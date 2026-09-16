/**
 * 自动为指定目录生成 README.md 索引
 * 用法：npm run gen:readme
 *
 * permalink 规则：
 * - 段 `课题` → `projects`
 * - 段 `YYYYMMDD.xxx` → md5 前 8 位（同名同 hash，稳定不变）
 * - 其它段 → 剥掉"第一个 . 及之前"的部分
 *   例：docs/课题/20260916.芪附汤抗慢性心衰网药分析/01.研究计划
 *       → /projects/a1b2c3d4/研究计划/
 * - createTime 存在即保留
 * - tags 存在即保留
 * - pageClass 存在即保留
 * - comment 一律写 false
 * - permalink 与脚本重新计算的值一致（或以其为前缀）时保留，否则重建
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ===== 配置要生成索引的目录（相对于 docs/)=====
const TARGET_DIRS = [
  '教程',
  '设备',
  '工具',
  '课题',
  '更多'
]

// 顶层目录名映射（路径段 → URL 段）
const SEGMENT_MAP = {
  '课题': 'projects',
  // 需要时可加：
  '教程': 'courses',
  '设备': 'instruments',
  '工具': 'tools',
  '更多': 'more',
}

// 遇到这些目录名跳过：不生成 README、不递归进入
const SKIP_DIRNAMES = new Set([
  '02.研究进度',
  '09.里程碑',
  '_template',
  'scripts',
  'node_modules',
])

// docs 根目录（脚本位于 docs/.vuepress/scripts/)
const DOCS_ROOT = path.resolve(__dirname, '../..')

// ---------- 工具 ----------

/** 去掉名称前的数字前缀（显示用）：01.、02_、20260915. 等 */
function stripPrefix(name) {
  return name.replace(/^\d+[-_.]\s*/, '')
}

/** 提取名称开头的数字前缀，无前缀返回 Infinity */
function extractPrefix(name) {
  const match = name.match(/^(\d+)[-_.]/)
  return match ? parseInt(match[1], 10) : Infinity
}

/** 剥掉"第一个 . 及之前"的所有内容 */
function stripFirstDotPrefix(seg) {
  const idx = seg.indexOf('.')
  return idx === -1 ? seg : seg.slice(idx + 1)
}

/** 8 位 hash（md5 前 8 位） */
function hash8(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 8)
}

/** 判断是否是 YYYYMMDD.xxx 形式的目录段 */
function isDatedSegment(seg) {
  return /^\d{8}\./.test(seg)
}

/**
 * 从 frontmatter 中提取某个 key 的完整 YAML 块
 * 支持：
 *   key: value
 *   key: [a, b]
 *   key:
 *     - a
 *     - b
 * 找不到返回 null
 */
function extractKeyBlock(fm, key) {
  const lines = fm.split(/\r?\n/)
  const result = []
  let collecting = false

  for (const line of lines) {
    if (new RegExp(`^${key}\\s*:`).test(line)) {
      collecting = true
      result.push(line)
      continue
    }
    if (collecting) {
      // 继续吃缩进行（多行列表）
      if (/^\s+\S/.test(line)) {
        result.push(line)
      } else {
        break
      }
    }
  }

  return result.length ? result.join('\n') : null
}

// ---------- 路径 → URL 段 ----------

/**
 * 目录相对 docs 的路径（统一 / 分隔），逐段映射：
 *   课题                    → projects
 *   20260916.xxx           → 8 位 hash
 *   01.研究计划             → 研究计划
 *   教程                    → 教程
 */
function relFromDocs(dir) {
  return path.relative(DOCS_ROOT, dir)
    .split(path.sep)
    .map(seg => {
      if (SEGMENT_MAP[seg]) return SEGMENT_MAP[seg]
      if (isDatedSegment(seg)) return hash8(seg)
      return stripFirstDotPrefix(seg)
    })
    .join('/')
}

/** 生成 permalink：以 / 开头、以 / 结尾 */
function buildPermalink(dir) {
  return '/' + relFromDocs(dir) + '/'
}

/** 判断旧 permalink 与脚本计算值是否一致或前缀一致 */
function isPermalinkPrefixValid(value, dir) {
  const expected = ('/' + relFromDocs(dir)).replace(/\/+$/, '')
  const v = value.replace(/\/+$/, '') || '/'
  return v === expected || v.startsWith(expected + '/')
}

// ---------- 标题 / frontmatter ----------

/** 从 Markdown 文件中提取标题 */
function getTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m)
    if (titleMatch) {
      return titleMatch[1].trim().replace(/^["']|["']$/g, '')
    }
  }

  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1].trim()

  return stripPrefix(path.basename(filePath, '.md'))
}

/** 从已有 README 中提取需要保留的字段 */
function extractPreservedMeta(readmePath, dir) {
  const preserved = {}
  if (!fs.existsSync(readmePath)) return preserved

  const text = fs.readFileSync(readmePath, 'utf-8')
  if (!text.startsWith('---')) return preserved

  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return preserved
  const fm = m[1]

  const ctMatch = fm.match(/^createTime:\s*(.+)$/m)
  if (ctMatch && ctMatch[1].trim()) {
    preserved.createTime = ctMatch[1].trim().replace(/^["']|["']$/g, '')
  }

  const plMatch = fm.match(/^permalink:\s*(.+)$/m)
  if (plMatch && plMatch[1].trim()) {
    const value = plMatch[1].trim().replace(/^["']|["']$/g, '')
    if (isPermalinkPrefixValid(value, dir)) {
      preserved.permalink = value
    } else {
      preserved.permalink = buildPermalink(dir)
      preserved.permalinkRebuilt = true
      preserved.permalinkOld = value
    }
  }

  // 保留 tags（支持行内数组、单行、多行列表）
  const tagsBlock = extractKeyBlock(fm, 'tags')
  if (tagsBlock) preserved.tags = tagsBlock

  // 保留 pageClass（字符串或数组都按块保留）
  const pageClassBlock = extractKeyBlock(fm, 'pageClass')
  if (pageClassBlock) preserved.pageClass = pageClassBlock

  return preserved
}

// ---------- 排序 / 内容探测 ----------

function sortEntries(entries) {
  return entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1

    const pa = extractPrefix(a.name)
    const pb = extractPrefix(b.name)
    if (pa !== pb) return pa - pb

    return a.name.localeCompare(b.name, 'zh-CN', { numeric: true })
  })
}

function hasContent(dir) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return false
  }
  for (const entry of entries) {
    if (entry.name === 'README.md') continue
    if (SKIP_DIRNAMES.has(entry.name)) continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (hasContent(full)) return true
    } else if (entry.name.endsWith('.md')) {
      return true
    }
  }
  return false
}

// ---------- 生成单个 README ----------

function generateReadme(dir, options = {}) {
  const { shallow = false } = options
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const sorted = sortEntries(entries)
  const items = []

  for (const entry of sorted) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIRNAMES.has(entry.name)) {
        if (hasContent(fullPath)) {
          items.push({
            name: stripPrefix(entry.name),
            link: `${entry.name}/README.md`,
          })
        }
        continue
      }

      let ok
      if (shallow) {
        ok = hasContent(fullPath)
      } else {
        const subItems = generateReadme(fullPath)
        ok = subItems.length > 0
      }
      if (ok) {
        items.push({
          name: stripPrefix(entry.name),
          link: `${entry.name}/README.md`,
        })
      }
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      items.push({
        name: getTitle(fullPath),
        link: entry.name,
      })
    }
  }

  if (items.length === 0) return []

  const readmePath = path.join(dir, 'README.md')
  const preserved = extractPreservedMeta(readmePath, dir)

  const dirName = path.basename(dir)
  const displayName = stripPrefix(dirName)

  let content = '---\n'
  content += `title: ${displayName}\n`
  if (preserved.createTime) content += `createTime: ${preserved.createTime}\n`
  if (preserved.permalink) content += `permalink: ${preserved.permalink}\n`
  if (preserved.tags) content += `${preserved.tags}\n`
  if (preserved.pageClass) content += `${preserved.pageClass}\n`
  content += 'comment: false\n'
  content += '---\n\n'

  content += `# ${displayName}\n\n`
  content += `::: info 本目录下共 ${items.length} 个条目\n:::\n\n`
  for (const item of items) {
    content += `- [${item.name}](${encodeURI(item.link)})\n`
  }

  fs.writeFileSync(readmePath, content, 'utf-8')

  const notes = []
  if (preserved.createTime) notes.push('保留 createTime')
  if (preserved.permalink && !preserved.permalinkRebuilt) notes.push('保留 permalink')
  if (preserved.permalinkRebuilt) {
    notes.push(`重建 permalink(原 ${preserved.permalinkOld} → ${preserved.permalink})`)
  }
  if (preserved.tags) notes.push('保留 tags')
  if (preserved.pageClass) notes.push('保留 pageClass')
  notes.push('comment=false')
  const noteStr = notes.length ? `(${notes.join('; ')})` : ''
  console.log(`✅ 已更新: ${path.relative(DOCS_ROOT, readmePath)} ${noteStr}`)

  return items
}

// ===== 执行 =====
console.log('🚀 开始生成 README 索引...\n')

for (const target of TARGET_DIRS) {
  const rel = typeof target === 'string' ? target : target.path
  const shallow = typeof target === 'object' && target.shallow === true

  const targetDir = path.join(DOCS_ROOT, rel)
  if (!fs.existsSync(targetDir)) {
    console.log(`⚠️  跳过（目录不存在）: docs/${rel}`)
    continue
  }
  console.log(`📂 已更新: docs/${rel}${shallow ? ' (shallow)' : ''}`)
  generateReadme(targetDir, { shallow })
  console.log('')
}

console.log('✨ 全部完成！')