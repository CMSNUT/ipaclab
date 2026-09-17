/**
 * 自动为指定目录生成 README.md 索引
 * 用法：npm run gen:readme
 *
 * permalink 规则：
 * - 顶层段：`课题` → `projects`，`教程` → `courses`，`更多` → `more`，`工具` → `tools`
 * - 顶层段之后的整条相对路径 → md5 前 8 位（合并为一个 hash 段）
 *   例：docs/课题/20260916.芪附汤抗慢性心衰网药分析/01.研究计划
 *       → /projects/xxxxxxxx/
 * - 已存在 permalink 的 README：原样保留
 *   - 例外：如果 permalink 中连续 8 位 hex 段多于 1 个（旧格式），则丢弃并重算
 * - 没有 permalink 的 README：按上面规则生成
 * - createTime 存在即保留
 * - tags 存在即保留
 * - pageClass 存在即保留
 * - comment 一律写 false（已存在的 README 也会被强制修正）
 * - 生成后自动比对每条链接：目标文件/目录不存在即清除
 * - 排序：所有文件与目录混合，按名称中的数字前缀升序；无前缀者排最后
 * - 顺序修正：全仓库扫描时，README 条目顺序与期望不一致也会被重写
 *
 * 页面排除索引：
 * - 页面 frontmatter 中写 `index: false`（兼容 `inIndex: false` / `list: false`）
 *   则该页面不进入父级 README 索引
 * - 目录的 README.md 中写同样的标识，则整个目录不进入父级索引
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

// ===== 配置要生成索引的目录（相对于 docs/) =====
const TARGET_DIRS = [
  '教程',
  '工具',
  '课题',
  '更多',
]

// 顶层目录名映射（路径段 → URL 段）
const SEGMENT_MAP = {
  '课题': 'projects',
  '教程': 'courses',
  '更多': 'more',
  '工具': 'tools',
}

// 遇到这些目录名跳过：不生成 README、不递归进入
const SKIP_DIRNAMES = new Set([
  '_template',
  'scripts',
  'node_modules',
])

// 页面 frontmatter 中用于排除索引的字段名（值为 false 时生效）
const EXCLUDE_KEYS = ['index', 'inIndex', 'list']

// docs 根目录（脚本位于 docs/.vuepress/scripts/）
const DOCS_ROOT = path.resolve(__dirname, '../..')

// ---------- 工具 ----------

function stripPrefix(name) {
  return name.replace(/^\d+[-_.]\s*/, '')
}

function extractPrefix(name) {
  const match = name.match(/^(\d+)[-_.]/)
  return match ? parseInt(match[1], 10) : Infinity
}

function hash8(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 8)
}

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
      if (/^\s+\S/.test(line)) {
        result.push(line)
      } else {
        break
      }
    }
  }

  return result.length ? result.join('\n') : null
}

/**
 * 判断 permalink 是否为旧格式（多段 8 位 hex）。
 *   /courses/cd5bbd35/ca3de5a3/9c47bde3/ → 3 段 → true（旧）
 *   /projects/c2538985/                  → 1 段 → false（新）
 *   /more/开源数据/                      → 0 段 → false（自定义）
 */
function isLegacyMultiHash(permalink) {
  const segs = permalink.match(/\/[0-9a-f]{8}(?=\/|$)/g) || []
  return segs.length > 1
}

// ---------- 文件内容缓存 + frontmatter 读取 ----------

const contentCache = new Map()

function readContent(filePath) {
  if (path.basename(filePath) === 'README.md') {
    try {
      return fs.readFileSync(filePath, 'utf-8')
    } catch {
      return ''
    }
  }
  if (contentCache.has(filePath)) return contentCache.get(filePath)
  let content = ''
  try {
    content = fs.readFileSync(filePath, 'utf-8')
  } catch {
    content = ''
  }
  contentCache.set(filePath, content)
  return content
}

function getFrontmatter(filePath) {
  const content = readContent(filePath)
  if (!content.startsWith('---')) return ''
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

function isExcludedFromIndex(filePath) {
  if (!filePath) return false
  if (!fs.existsSync(filePath)) return false
  const fm = getFrontmatter(filePath)
  if (!fm) return false
  for (const key of EXCLUDE_KEYS) {
    if (new RegExp(`^${key}\\s*:\\s*false\\s*$`, 'm').test(fm)) {
      return true
    }
  }
  return false
}

// ---------- 路径 → URL 段 ----------

/**
 * 顶层段走 SEGMENT_MAP，其余整条路径 hash8 一次。
 *   docs/课题                     → projects
 *   docs/课题/20260916.芪附汤     → projects/c2538985
 *   docs/课题/20260916.芪附汤/01.研究计划 → projects/xxxxxxxx
 *   docs/更多/开源数据            → more/xxxxxxxx
 */
function relFromDocs(dir) {
  const rel = path.relative(DOCS_ROOT, dir)
  if (!rel) return ''

  const segs = rel.split(path.sep).filter(Boolean)
  if (segs.length === 0) return ''

  const [top, ...rest] = segs
  const mapped = SEGMENT_MAP[top] || top

  if (rest.length === 0) return mapped
  return mapped + '/' + hash8(rest.join('/'))
}

function buildPermalink(dir) {
  const rel = relFromDocs(dir)
  return rel ? '/' + rel + '/' : '/'
}

// ---------- 标题 / frontmatter ----------

function getTitle(filePath) {
  const content = readContent(filePath)

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

  // permalink：存在即保留，但旧格式（多段 hash）丢弃以触发重算
  const plMatch = fm.match(/^permalink:\s*(.+)$/m)
  if (plMatch && plMatch[1].trim()) {
    const v = plMatch[1].trim().replace(/^["']|["']$/g, '')
    if (isLegacyMultiHash(v)) {
      preserved.permalinkOld = v          // 仅记录，用于日志
    } else {
      preserved.permalink = v
    }
  }

  const tagsBlock = extractKeyBlock(fm, 'tags')
  if (tagsBlock) preserved.tags = tagsBlock

  const pageClassBlock = extractKeyBlock(fm, 'pageClass')
  if (pageClassBlock) preserved.pageClass = pageClassBlock

  return preserved
}

// ---------- comment: false 强制修正 ----------

function ensureCommentFalse(readmePath) {
  if (!fs.existsSync(readmePath)) return false
  const text = fs.readFileSync(readmePath, 'utf-8')
  if (!text.startsWith('---')) return false

  const m = text.match(/^(---\r?\n)([\s\S]*?)(\r?\n---)/)
  if (!m) return false

  const [, fmStart, fm, fmEnd] = m
  let newFm
  if (/^comment\s*:/m.test(fm)) {
    newFm = fm.replace(/^comment\s*:.*$/m, 'comment: false')
  } else {
    newFm = fm + '\ncomment: false'
  }
  if (newFm === fm) return false

  const updated = text.replace(m[0], fmStart + newFm + fmEnd)
  fs.writeFileSync(readmePath, updated, 'utf-8')
  return true
}

// ---------- 无效链接清理 ----------

function isExternalLink(link) {
  return (
    /^(https?:)?\/\//i.test(link) ||
    /^mailto:/i.test(link) ||
    link.startsWith('#')
  )
}

function linkTargetExists(baseDir, rawLink) {
  if (isExternalLink(rawLink)) return true

  const cleanLink = rawLink.split('#')[0].split('?')[0]
  if (!cleanLink) return true

  let decoded = cleanLink
  try {
    decoded = decodeURI(cleanLink)
  } catch {
    /* 保持原样 */
  }

  const target = decoded.startsWith('/')
    ? path.join(DOCS_ROOT, decoded)
    : path.resolve(baseDir, decoded)

  return fs.existsSync(target)
}

function cleanInvalidLinks(readmePath) {
  if (!fs.existsSync(readmePath)) return []

  const baseDir = path.dirname(readmePath)
  const original = fs.readFileSync(readmePath, 'utf-8')
  const lines = original.split(/\r?\n/)
  const kept = []
  const removed = []

  for (const line of lines) {
    const m = line.match(/^(\s*[-*]\s+)\[([^\]]+)\]\(([^)]+)\)\s*$/)
    if (!m) {
      kept.push(line)
      continue
    }

    const name = m[2]
    const link = m[3]

    if (linkTargetExists(baseDir, link)) {
      kept.push(line)
    } else {
      removed.push({ name, link })
    }
  }

  if (!removed.length) return []

  let text = kept.join('\n')
  const count = kept.filter(l => /^\s*[-*]\s+\[/.test(l)).length
  text = text.replace(
    /(本目录下共\s+)\d+(\s+个条目)/,
    (_, a, b) => `${a}${count}${b}`
  )

  fs.writeFileSync(readmePath, text, 'utf-8')
  return removed
}

// ---------- 排序 / 内容探测 ----------

function sortEntries(entries) {
  return entries.sort((a, b) => {
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

// ---------- 顺序修正 ----------

function computeDirItems(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const sorted = sortEntries(entries)
  const items = []
  for (const entry of sorted) {
    if (entry.name === 'README.md') continue
    if (entry.isDirectory()) {
      const fullPath = path.join(dir, entry.name)
      if (!hasContent(fullPath)) continue
      const subReadme = path.join(fullPath, 'README.md')
      if (isExcludedFromIndex(subReadme)) continue
      items.push({
        name: stripPrefix(entry.name),
        link: `${entry.name}/README.md`,
      })
    } else if (entry.name.endsWith('.md')) {
      const fullPath = path.join(dir, entry.name)
      if (isExcludedFromIndex(fullPath)) continue
      items.push({
        name: getTitle(fullPath),
        link: entry.name,
      })
    }
  }
  return items
}

function readReadmeItems(readmePath) {
  if (!fs.existsSync(readmePath)) return []
  const text = fs.readFileSync(readmePath, 'utf-8')
  const fmMatch = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/)
  const body = fmMatch ? text.slice(fmMatch[0].length) : text
  const items = []
  for (const line of body.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+\[([^\]]+)\]\(([^)]+)\)\s*$/)
    if (m) items.push({ name: m[1], link: m[2] })
  }
  return items
}

function normalizeLink(link) {
  let out = link
  try { out = decodeURI(out) } catch { /* 保持原样 */ }
  return out
}

function fixReadmeOrder(dir) {
  const readmePath = path.join(dir, 'README.md')
  if (!fs.existsSync(readmePath)) return false

  const expected = computeDirItems(dir)
  const current = readReadmeItems(readmePath)

  if (current.length === expected.length && current.length > 0) {
    let same = true
    for (let i = 0; i < current.length; i++) {
      if (
        normalizeLink(current[i].link) !== normalizeLink(expected[i].link) ||
        current[i].name !== expected[i].name
      ) {
        same = false
        break
      }
    }
    if (same) return false
  } else if (current.length === 0 && expected.length === 0) {
    return false
  }

  const text = fs.readFileSync(readmePath, 'utf-8')
  const fmMatch = text.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n?)/)
  let fm = fmMatch ? fmMatch[0] : ''
  const displayName = stripPrefix(path.basename(dir))

  let newContent = fm
  if (!fm) {
    const autoPermalink = buildPermalink(dir)
    newContent += '---\n'
    newContent += `title: ${displayName}\n`
    if (autoPermalink && autoPermalink !== '/') {
      newContent += `permalink: ${autoPermalink}\n`
    }
    newContent += 'comment: false\n'
    newContent += '---\n\n'
  }
  newContent += `# ${displayName}\n\n`
  newContent += `::: info 本目录下共 ${expected.length} 个条目\n:::\n\n`
  for (const item of expected) {
    newContent += `- [${item.name}](${encodeURI(item.link)})\n`
  }

  fs.writeFileSync(readmePath, newContent, 'utf-8')
  return true
}

// ---------- 生成单个 README ----------

function generateReadme(dir, options = {}) {
  const { shallow = false } = options
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const sorted = sortEntries(entries)
  const items = []

  const readmePath = path.join(dir, 'README.md')
  const readmeExisted = fs.existsSync(readmePath)

  for (const entry of sorted) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIP_DIRNAMES.has(entry.name)) {
        if (hasContent(fullPath)) {
          const subReadme = path.join(fullPath, 'README.md')
          if (!isExcludedFromIndex(subReadme)) {
            items.push({
              name: stripPrefix(entry.name),
              link: `${entry.name}/README.md`,
            })
          }
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
        const subReadme = path.join(fullPath, 'README.md')
        if (isExcludedFromIndex(subReadme)) continue
        items.push({
          name: stripPrefix(entry.name),
          link: `${entry.name}/README.md`,
        })
      }
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md') {
      if (isExcludedFromIndex(fullPath)) continue
      items.push({
        name: getTitle(fullPath),
        link: entry.name,
      })
    }
  }

  if (items.length === 0) {
    console.log(`⏭️  跳过（无有效条目）: ${path.relative(DOCS_ROOT, dir)}`)
    const removed = cleanInvalidLinks(readmePath)
    const fixedComment = ensureCommentFalse(readmePath)

    if (removed.length) {
      console.log(`🧹 ${path.relative(DOCS_ROOT, readmePath)} 清除 ${removed.length} 条无效链接:`)
      for (const { name, link } of removed) {
        console.log(`   - [${name}](${link})`)
      }
    }
    if (fixedComment) {
      console.log(`🔧 ${path.relative(DOCS_ROOT, readmePath)} 修正 comment → false`)
    }
    return []
  }

  const preserved = extractPreservedMeta(readmePath, dir)
  const dirName = path.basename(dir)
  const displayName = stripPrefix(dirName)

  // permalink：有就保留（多段 hash 已在上一步丢弃），没有就生成
  const autoPermalink = preserved.permalink ?? buildPermalink(dir)

  let content = '---\n'
  content += `title: ${displayName}\n`
  if (preserved.createTime) content += `createTime: ${preserved.createTime}\n`
  if (autoPermalink && autoPermalink !== '/') {
    content += `permalink: ${autoPermalink}\n`
  }
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

  console.log(
    readmeExisted
      ? `📝 更新: ${path.relative(DOCS_ROOT, readmePath)}`
      : `🆕 创建: ${path.relative(DOCS_ROOT, readmePath)}`
  )

  const removedLinks = cleanInvalidLinks(readmePath)
  if (removedLinks.length) {
    console.log(`   🧹 清除 ${removedLinks.length} 条无效链接:`)
    for (const { name, link } of removedLinks) {
      console.log(`      - [${name}](${link})`)
    }
  }

  ensureCommentFalse(readmePath)

  const removedKeys = new Set()
  for (const r of removedLinks) {
    removedKeys.add(r.link)
    removedKeys.add(encodeURI(r.link))
    try { removedKeys.add(decodeURI(r.link)) } catch {}
  }
  const validItems = removedKeys.size
    ? items.filter(it => {
        const enc = encodeURI(it.link)
        let dec = it.link
        try { dec = decodeURI(enc) } catch {}
        return !removedKeys.has(it.link) && !removedKeys.has(enc) && !removedKeys.has(dec)
      })
    : items

  const notes = []
  if (preserved.createTime) notes.push('保留 createTime')
  if (preserved.permalink) notes.push('保留 permalink')
  else if (preserved.permalinkOld) notes.push(`重建 permalink(旧 ${preserved.permalinkOld} → ${autoPermalink})`)
  else if (autoPermalink && autoPermalink !== '/') notes.push('生成 permalink')
  if (preserved.tags) notes.push('保留 tags')
  if (preserved.pageClass) notes.push('保留 pageClass')
  notes.push('comment=false')
  if (removedLinks.length) notes.push(`清除无效链接 x${removedLinks.length}`)
  const noteStr = notes.length ? `(${notes.join('; ')})` : ''
  console.log(`✅ 已更新: ${path.relative(DOCS_ROOT, readmePath)} ${noteStr}`)

  return validItems
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

// ===== 全仓库兜底扫描：comment 与条目顺序一并修正 =====
console.log('🔎 全仓库扫描 README.md，确保 comment: false 与条目顺序正确 ...')
let scanned = 0
let fixedComment = 0
let fixedOrder = 0
let fixedBoth = 0

function walkDocs(dir) {
  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue
      walkDocs(full)
    } else if (entry.name === 'README.md') {
      scanned++
      const cFixed = ensureCommentFalse(full)
      const oFixed = fixReadmeOrder(dir)
      if (cFixed && oFixed) {
        fixedBoth++
        console.log(`🔧 修正 comment + 顺序: ${path.relative(DOCS_ROOT, full)}`)
      } else if (cFixed) {
        fixedComment++
        console.log(`🔧 修正 comment: ${path.relative(DOCS_ROOT, full)}`)
      } else if (oFixed) {
        fixedOrder++
        console.log(`🔄 修正顺序: ${path.relative(DOCS_ROOT, full)}`)
      }
    }
  }
}

walkDocs(DOCS_ROOT)
console.log(
  `   扫描 ${scanned} 个 README.md，` +
  `comment 修正 ${fixedComment + fixedBoth} 个，` +
  `顺序修正 ${fixedOrder + fixedBoth} 个\n`
)

console.log('✨ 全部完成！')