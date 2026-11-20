import fs from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'

// ---------- 类型 ----------

interface SidebarItem {
  text?: string
  link?: string
  icon?: string
  badge?: string | { text: string; type?: string }
  prefix?: string
  items?: 'auto' | (string | SidebarItem)[]
  collapsed?: boolean
}

// ---------- 常量 ----------

/** frontmatter 中任一字段为 false → 从左侧栏移除 */
const EXCLUDED_KEYS = ['sidebar', 'index', 'list'] as const

// ---------- 文件读取 ----------

function read(file: string): string {
  try {
    return fs.readFileSync(file, 'utf-8').replace(/^\uFEFF/, '')
  } catch {
    return ''
  }
}

function fm(file: string): string {
  const m = read(file).match(/^---\r?\n([\s\S]*?)\r?\n---/)
  return m ? m[1] : ''
}

/** 取 frontmatter 单个字段（去引号）；不存在返回 undefined */
function fmField(file: string, key: string): string | undefined {
  const m = fm(file).match(new RegExp(`^\\s*${key}\\s*:\\s*(.+)$`, 'm'))
  if (!m) return undefined
  const v = m[1].trim().replace(/^["']|["']$/g, '')
  return v || undefined
}

/** 是否从侧边栏排除 */
function excluded(file: string): boolean {
  const f = fm(file)
  if (!f) return false
  return EXCLUDED_KEYS.some(k =>
    new RegExp(`^\\s*${k}\\s*:\\s*false\\s*$`, 'mi').test(f)
  )
}

/** 页面标题：frontmatter.title → 首个 H1 → 文件名去前缀 */
function pageTitle(file: string): string {
  const t = fmField(file, 'title')
  if (t) return t
  const h1 = read(file).match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  return path.basename(file, '.md').replace(/^\d+[-_.]\s*/, '')
}

/** 页面 permalink：直接读 frontmatter */
function pageLink(file: string): string | undefined {
  return fmField(file, 'permalink')
}

// ---------- 排序 ----------

function numericPrefix(name: string): number {
  const m = name.match(/^(\d+)[-_.]/)
  return m ? parseInt(m[1], 10) : Infinity
}

function stripPrefix(name: string): string {
  return name.replace(/^\d+[-_.]\s*/, '')
}

// ---------- 扫描 ----------

/**
 * 递归扫描目录，生成 SidebarItem[]
 * - 目录：读其 README.md 的 permalink / frontmatter
 * - 文件：读自身 frontmatter
 * - 命中排除标记 → 跳过
 * - 目录下无有效子项 → 该目录也跳过
 * - 没有 permalink 的 md → 不进侧边栏
 */
export function scanSidebar(dir: string): SidebarItem[] {
  if (!fs.existsSync(dir)) return []

  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e =>
      !e.name.startsWith('.') &&
      !e.name.startsWith('_') &&
      e.name !== 'README.md'
    )
    .sort((a, b) => {
      const ka = numericPrefix(a.name)
      const kb = numericPrefix(b.name)
      if (ka !== kb) return ka - kb
      return a.name.localeCompare(b.name, 'zh-CN', { numeric: true })
    })

  const items: SidebarItem[] = []

  for (const e of entries) {
    const full = path.join(dir, e.name)

    if (e.isDirectory()) {
      const readme = path.join(full, 'README.md')
      if (excluded(readme)) continue

      const children = scanSidebar(full)
      if (children.length === 0) continue

      items.push({
        text: stripPrefix(e.name),
        link: pageLink(readme),
        items: children,
        collapsed: false,
      })
    } else if (e.name.endsWith('.md')) {
      if (excluded(full)) continue

      const link = pageLink(full)
      if (!link) continue

      items.push({
        text: pageTitle(full),
        link,
      })
    }
  }

  return items
}

// ---------- 工具（可选导出） ----------

/** 需要算 hash 段名时可用（例如日期目录 20260916.xxx） */
export function hash8(input: string): string {
  return createHash('md5').update(input).digest('hex').slice(0, 8)
}