/**
 * 自动为指定目录生成 README.md 索引
 * 用法：npm run gen:readme
 *
 * 规则：
 * - 优先读取 frontmatter 的 title，其次一级标题 #，最后用文件名
 * - 排除 README.md 自身，避免循环
 * - 目录优先、文件次之，各自按名称排序（支持 01-、02- 数字前缀）
 * - 若目录下无内容，则跳过，不生成空 README
 */

const fs = require('fs')
const path = require('path')

// ===== 配置要生成索引的目录（相对于 docs/）=====
const TARGET_DIRS = [
  'projects',
  'exp',
  'tools',
  'pictures',
]

// docs 根目录（脚本位于 docs/.vuepress/scripts/）
const DOCS_ROOT = path.resolve(__dirname, '../..')

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
  return path
    .basename(filePath, '.md')
    .replace(/^\d+[-_.]\s*/, '')
}

/**
 * 按名称排序：目录优先，文件次之，各自按名称排序
 */
function sortEntries(entries) {
  return entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1
    if (!a.isDirectory() && b.isDirectory()) return 1
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
      // 递归处理子目录
      const subItems = generateReadme(fullPath)
      // 子目录有内容才加入索引
      if (subItems.length > 0) {
        items.push({
          name: entry.name.replace(/^\d+[-_.]\s*/, ''),
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

  // 无内容则不生成 README
  if (items.length === 0) return []

  // 生成 Markdown 内容
  const dirName = path.basename(dir)
  let content = `---\ntitle: ${dirName}\n---\n\n`
  content += `# ${dirName}\n\n`
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