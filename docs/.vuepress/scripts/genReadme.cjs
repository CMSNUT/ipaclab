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
 * - comment 一律写 false（已存在的 README 也会被强制修正）
 * - permalink 与脚本重新计算的值一致（或以其为前缀）时保留，否则重建
 * - 生成后自动比对每条链接：目标文件/目录不存在即清除
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

function stripPrefix(name) {
  return name.replace(/^\d+[-_.]\s*/, '')
}

function extractPrefix(name) {
  const match = name.match(/^(\d+)[-_.]/)
  return match ? parseInt(match[1], 10) : Infinity
}

function stripFirstDotPrefix(seg) {
  const idx = seg.indexOf('.')
  return idx === -1 ? seg : seg.slice(idx + 1)
}

function hash8(input) {
  return crypto.createHash('md5').update(input).digest('hex').slice(0, 8)
}

function isDatedSegment(seg) {
  return /^\d{8}\./.test(seg)
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

// ---------- 路径 → URL 段 ----------

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

function buildPermalink(dir) {
  return '/' + relFromDocs(dir) + '/'
}

function isPermalinkPrefixValid(value, dir) {
  const expected = ('/' + relFromDocs(dir)).replace(/\/+$/, '')
  const v = value.replace(/\/+$/, '') || '/'
  return v === expected || v.startsWith(expected + '/')
}

// ---------- 标题 / frontmatter ----------

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

  const tagsBlock = extractKeyBlock(fm, 'tags')
  if (tagsBlock) preserved.tags = tagsBlock

  const pageClassBlock = extractKeyBlock(fm, 'pageClass')
  if (pageClassBlock) preserved.pageClass = pageClassBlock

  return preserved
}

// ---------- comment: false 强制修正 ----------

/**
 * 保证 README frontmatter 中 comment 字段恒为 false：
 *   - 有 comment 行 → 覆盖为 `comment: false`
 *   - 无 comment 行 → 在 frontmatter 末尾追加
 *   - 没有 frontmatter → 不动（避免误伤非本脚本生成的文件）
 * 返回 true 表示发生了修改
 */
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

  const readmePath = path.join(dir, 'README.md')

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

  // ===== 无条目：清理无效链接 + 强制 comment: false =====
  if (items.length === 0) {
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

  // 写入后兜底清理（跳过目录无 README、被手动加进来的死链等）
  const removedLinks = cleanInvalidLinks(readmePath)
  if (removedLinks.length) {
    console.log(`   🧹 清除 ${removedLinks.length} 条无效链接:`)
    for (const { name, link } of removedLinks) {
      console.log(`      - [${name}](${link})`)
    }
  }

  // 二次确认 comment: false（其实上面写入时已是 false，这里只是保险）
  ensureCommentFalse(readmePath)

  // 返回值过滤掉被清理的项
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
  if (preserved.permalink && !preserved.permalinkRebuilt) notes.push('保留 permalink')
  if (preserved.permalinkRebuilt) {
    notes.push(`重建 permalink(原 ${preserved.permalinkOld} → ${preserved.permalink})`)
  }
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

// ===== 全仓库兜底扫描：把 docs 下所有 README.md 的 comment 都修正 =====
console.log('🔎 全仓库扫描 README.md，确保 comment: false ...')
let scanned = 0
let fixed = 0

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
      if (ensureCommentFalse(full)) {
        fixed++
        console.log(`🔧 修正: ${path.relative(DOCS_ROOT, full)}`)
      }
    }
  }
}

walkDocs(DOCS_ROOT)
console.log(`   扫描 ${scanned} 个 README.md，修正 ${fixed} 个\n`)

console.log('✨ 全部完成！')