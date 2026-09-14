/**
 * 自动为指定目录生成 README.md 索引
 * 用法：npm run gen:readme
 *
 * 规则：
 * - 优先读取 frontmatter 的 title，其次一级标题 #，最后用文件名
 * - 排除 README.md 自身，避免循环
 * - 目录优先、文件次之
 * - 按数字前缀的大小正序排列（如 01-、02-、20260915.）
 * - 无数字前缀的排在有前缀的之后
 * - 目录名/文件名前的数字前缀在显示时自动去除
 * - 若目录下无内容，则跳过，不生成空 README
 */

const fs = require('fs')
const path = require('path')

// ===== 配置要生成索引的目录（相对于 docs/）=====
const TARGET_DIRS = [
  '学术图库',
  '实验技术',
  '技术文集',
  // '文献研读',
  '研究工具',
  '研究课题', 
  // '研究笔记',
]

// docs 根目录（脚本位于 docs/.vuepress/scripts/）
const DOCS_ROOT = path.resolve(__dirname, '../..')

/**
 * 去掉名称前的数字前缀（如 01-、02_、20260915. 等）
 */
function stripPrefix(name) {
  return name.replace(/^\d+[-_.]\s*/, '')
}

/**
 * 提取名称开头的数字前缀，无前缀返回 Infinity（排到最后）
 */
function extractPrefix(name) {
  const match = name.match(/^(\d+)[-_.]/)
  return match ? parseInt(match[1], 10) : Infinity
}

/**
 * 从 Markdown 文件中提取标题
 */
function getTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  // 1. frontmatter title
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (fmMatch) {
    const titleMatch = fmMatch[1].match(/^title:\s*(.+)$/m)
    if (titleMatch) {
      return titleMatch[1].trim().replace(/^["']|["']$/g, '')
    }
  }

  // 2. 一级标题 # Title
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) return h1Match[1].trim()

  // 3. 文件名（去掉扩展名和数字前缀）
  return stripPrefix(path.basename(filePath, '.md'))
}

/**
 * 按数字前缀正序排序：目录优先，再按前缀数字升序，无前缀的排最后
 */
function sortEntries(entries) {
  return entries.sort((a, b) => {
    // 目录优先
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1

    // 按数字前缀大小排序
    const pa = extractPrefix(a.name)
    const pb = extractPrefix(b.name)
    if (pa !== pb) return pa - pb

    // 前缀相同（或无前缀）时按名称排序
    return a.name.localeCompare(b.name, 'zh-CN', { numeric: true })
  })
}

/**
 * 为单个目录递归生成 README.md
 */
function generateReadme(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const sorted = sortEntries(entries)
  const items = []

  for (const entry of sorted) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const subItems = generateReadme(fullPath)
      if (subItems.length > 0) {
        items.push({
          name: stripPrefix(entry.name),        // 显示：去掉前缀
          link: `${entry.name}/README.md`,      // 链接：保留原始目录名
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

  const dirName = path.basename(dir)
  const displayName = stripPrefix(dirName)      // 标题：去掉前缀
  let content = `---\ntitle: ${displayName}\n---\n\n`
  content += `# ${displayName}\n\n`
  content += `> 本目录下共 ${items.length} 个条目\n\n`
  for (const item of items) {
    content += `- [${item.name}](${encodeURI(item.link)})\n`
  }

  fs.writeFileSync(path.join(dir, 'README.md'), content, 'utf-8')
  console.log(`✅ 已更新: ${path.relative(DOCS_ROOT, path.join(dir, 'README.md'))}`)

  return items
}

// ===== 执行 =====
console.log('🚀 开始生成 README 索引...\n')

for (const rel of TARGET_DIRS) {
  const targetDir = path.join(DOCS_ROOT, rel)
  if (!fs.existsSync(targetDir)) {
    console.log(`⚠️  跳过（目录不存在）: docs/${rel}`)
    continue
  }
  console.log(`📂 处理目录: docs/${rel}`)
  generateReadme(targetDir)
  console.log('')
}

console.log('✨ 全部完成！')