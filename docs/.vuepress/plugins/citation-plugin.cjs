// // docs/.vuepress/plugins/citation-plugin.cjs

// // 需安装插件

// // npm install citation-js
// // npm install -D @types/markdown-it

// // 字段	类型	默认值	说明
// // bibFile	string	—	.bib 文件名，相对 bibDir；不写则不启用引用
// // bibTemplate	string	apa	引用格式：apa / vancouver / ieee / harvard1 / mdpi 等
// // bibTitle	string	参考文献	参考文献列表标题
// // bibHeadingLevel	number	2	标题级别，1–6
// // bibHeadingId	string	参考文献	标题 id；设空字符串则不写
// // bibWrapClass	string	csl-bib-body	外层容器 class
// // bibAppendHeading	boolean	true	是否自动插入标题

// // 内置样式列表
// // citation-js 自带这些样式，bibTemplate 里直接写名字即可：

// // 样式名	格式	示例
// // apa	APA 第 7 版	(Zhang & Li, 2023)
// // vancouver	Vancouver	[1]
// // harvard1	Harvard	(Zhang and Li, 2023)

// // 添加样式
// // mkdir docs\.vuepress\data\csl
// // cd docs\.vuepress\data\csl

// // # 以 Nature 为例
// // curl --ssl-no-revoke -O https://raw.githubusercontent.com/citation-style-language/styles/master/nature.csl

const fs = require('fs')
const path = require('path')
const Cite = require('citation-js')

const cslConfig = Cite.plugins.config.get('@csl')

const CITE_RE = /\[@([\w-]+)\]/g
const installedMarkdownIt = new WeakSet()

const styleFormatCache = new Map([
  ['apa', 'author-date'],
  ['vancouver', 'numeric'],
  ['harvard1', 'author-date'],
])

function detectCitationFormat(cslContent) {
  const m = cslContent.match(/<category\s+citation-format="([^"]+)"/)
  return m ? m[1] : 'author-date'
}

function registerCslStyles() {
  const cslConfig = Cite.plugins.config.get('@csl')
  const registry = cslConfig?.styles
  if (!registry) {
    console.warn('⚠️  [citation] styles 注册表未找到')
    return
  }
  const cslDir = path.resolve(process.cwd(), 'docs/.vuepress/data/csl')
  if (!fs.existsSync(cslDir)) {
    console.log(`ℹ️  [citation] CSL 目录不存在，跳过: ${cslDir}`)
    return
  }
  const files = fs.readdirSync(cslDir).filter(f => f.endsWith('.csl'))
  if (files.length === 0) {
    console.log('ℹ️  [citation] 未找到任何 .csl 文件')
    return
  }
  let added = 0, skipped = 0, failed = 0
  for (const file of files) {
    const name = path.basename(file, '.csl')
    const fullPath = path.join(cslDir, file)
    try {
      const content = fs.readFileSync(fullPath, 'utf-8')
      if (!content.trim().startsWith('<?xml')) {
        console.warn(`⚠️  [citation] 不是有效 CSL: ${file}`)
        failed++
        continue
      }
      const fmt = detectCitationFormat(content)
      styleFormatCache.set(name, fmt)
      try {
        if (registry.has(name)) { skipped++; continue }
      } catch {}
      registry.add(name, content)
      console.log(`✅ [citation] 已注册样式: ${name}  [${fmt}]`)
      added++
    } catch (e) {
      console.warn(`⚠️  [citation] 注册失败 ${file}:`, e.message)
      failed++
    }
  }
  console.log(`[citation] CSL 扫描完成：新增 ${added}，已存在 ${skipped}，失败 ${failed}`)
}

registerCslStyles()

const styleNames = Object.keys(cslConfig.styles.data)
console.log('[citation] 可用样式:', styleNames)

function isNumericStyle(name) {
  if (!name) return false
  const fmt = styleFormatCache.get(name)
  if (fmt) return fmt === 'numeric'
  return /numeric|ieee|vancouver|nature|mdpi|acs/i.test(name)
}

function linkifyDoiAndUrl(html) {
  let out = html
  out = out.replace(
    /(doi:\s*)?(?:https?:\/\/doi\.org\/)?(10\.\d{4,9}\/[^\s<)"']+)/g,
    (match, prefix, doi) => {
      const href = `https://doi.org/${doi}`
      const link = `<a href="${href}" target="_blank" rel="noopener">${doi}</a>`
      return prefix ? `${prefix}${link}` : link
    }
  )
  out = out.replace(
    /(?<!href="|">)(https?:\/\/[^\s<)"']+)/g,
    url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
  )
  return out
}

const citeCache = new Map()
function loadBib(bibPath) {
  if (citeCache.has(bibPath)) return citeCache.get(bibPath)
  if (!fs.existsSync(bibPath)) {
    console.warn(`⚠️  [citation] 文献文件不存在: ${bibPath}`)
    return null
  }
  const cite = new Cite(fs.readFileSync(bibPath, 'utf-8'))
  citeCache.set(bibPath, cite)
  return cite
}

function getValidKeys(cite) {
  if (!cite || !Array.isArray(cite.data)) return new Set()
  return new Set(cite.data.map(d => d && d.id).filter(Boolean))
}

function extractKeysFromState(state, validKeys) {
  const keys = []
  const seen = new Set()
  const push = (key) => {
    if (seen.has(key)) return
    if (validKeys && !validKeys.has(key)) return
    seen.add(key)
    keys.push(key)
  }
  const src = state.src || ''
  for (const m of src.matchAll(CITE_RE)) push(m[1])
  if (state.tokens) {
    for (const token of state.tokens) {
      if (token.type === 'inline' && token.children) {
        for (const child of token.children) {
          if (child.type === 'text' && child.content) {
            for (const m of child.content.matchAll(CITE_RE)) push(m[1])
          }
        }
      }
    }
  }
  return keys
}

module.exports = function citationPlugin(md, options = {}) {
  if (installedMarkdownIt.has(md)) {
    console.warn('[citation] 该 md 实例已安装过插件，跳过重复注册')
    return
  }
  installedMarkdownIt.add(md)

  const {
    bibDir = 'docs/.vuepress/data/bib',
    defaultTemplate = 'apa',
    defaultTitle = '参考文献',
    defaultHeadingLevel = 2,
    defaultHeadingId = '参考文献',
    defaultWrapClass = 'csl-bib-body',
    defaultAppendHeading = true,
    linkify = true,
  } = options

  // ===== 1. 解析 frontmatter =====
  md.core.ruler.before('block', 'citation_resolve_config', (state) => {
    let fm = state.env?.frontmatter || {}
    if (!fm.bibFile && state.src) {
      const m = state.src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      if (m) {
        try {
          const yaml = require('js-yaml')
          const parsed = yaml.load(m[1]) || {}
          fm = { ...parsed, ...fm }
        } catch (e) {}
      }
    }
    const bibFile = fm.bibFile
    const bibPath = bibFile ? path.resolve(process.cwd(), bibDir, bibFile) : null
    state.env.__citation = {
      bibPath,
      template: fm.bibTemplate || defaultTemplate,
      title: fm.bibTitle || defaultTitle,
      headingLevel: Number(fm.bibHeadingLevel) || defaultHeadingLevel,
      headingId: fm.bibHeadingId !== undefined ? fm.bibHeadingId : defaultHeadingId,
      wrapClass: fm.bibWrapClass || defaultWrapClass,
      appendHeading: fm.bibAppendHeading !== undefined
        ? fm.bibAppendHeading === true || fm.bibAppendHeading === 'true'
        : defaultAppendHeading,
      linkify: fm.bibLinkify !== undefined
        ? fm.bibLinkify === true || fm.bibLinkify === 'true'
        : linkify,
      orderedKeys: [],
      keyIndex: new Map(),
    }
  })

  // ===== 2. 数字样式替换 =====
  md.core.ruler.after('inline', 'citation_replace_numeric', (state) => {
    const cfg = state.env.__citation
    if (!cfg || !cfg.bibPath) return
    if (!isNumericStyle(cfg.template)) return
    const cite = loadBib(cfg.bibPath)
    if (!cite) return
    const validKeys = getValidKeys(cite)
    const ordered = extractKeysFromState(state, validKeys)
    if (ordered.length === 0) return
    cfg.orderedKeys = ordered
    cfg.keyIndex = new Map(ordered.map((k, i) => [k, i + 1]))
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue
      for (const child of token.children) {
        if (child.type !== 'text' || !child.content) continue
        if (!/\[@[\w-]+\]/.test(child.content)) continue
        child.content = child.content.replace(CITE_RE, (match, key) => {
          const num = cfg.keyIndex.get(key)
          return num !== undefined ? `[${num}]` : match
        })
      }
    }
  })

  // ===== 3. 非数字样式：正文引用替换 =====
  {
    const defaultRender =
      md.renderer.rules.text ||
      function (tokens, idx, opts, env, self) {
        return self.renderToken(tokens, idx, opts)
      }
    md.renderer.rules.text = function (tokens, idx, opts, env, self) {
      const cfg = env.__citation
      if (!cfg || !cfg.bibPath) return defaultRender(tokens, idx, opts, env, self)
      const token = tokens[idx]
      if (!token.content || !/\[@[\w-]+\]/.test(token.content)) {
        return defaultRender(tokens, idx, opts, env, self)
      }
      if (isNumericStyle(cfg.template)) {
        return defaultRender(tokens, idx, opts, env, self)
      }
      const cite = loadBib(cfg.bibPath)
      if (!cite) return defaultRender(tokens, idx, opts, env, self)
      token.content = token.content.replace(CITE_RE, (match, key) => {
        try {
          return cite.format('citation', { style: cfg.template, entry: [key] })
        } catch {
          return match
        }
      })
      return defaultRender(tokens, idx, opts, env, self)
    }
  }

  // ===== 4. 文末插入参考文献 =====
  md.core.ruler.before('inline', 'citation_bibliography', function (state) {
    const cfg = state.env.__citation
    if (!cfg || !cfg.bibPath) return

    const level = Math.min(Math.max(parseInt(cfg.headingLevel, 10) || 2, 1), 6)
    const hashes = '#'.repeat(level)
    const headingId = cfg.headingId || ''
    const wrapClass = cfg.wrapClass || 'csl-bib-body'
    const title = cfg.title

    // 清理旧 wrap，防止重复
    {
      const cleaned = []
      let removed = 0
      for (const t of state.tokens) {
        if (t.type === 'html_block' && t.content && t.content.includes(`class="${wrapClass}"`)) {
          removed++
          continue
        }
        cleaned.push(t)
      }
      if (removed > 0) {
        console.warn(`[citation] 清理旧 wrap：${removed}`)
        state.tokens.length = 0
        state.tokens.push(...cleaned)
      }
    }

    const cite = loadBib(cfg.bibPath)
    if (!cite) return
    const validKeys = getValidKeys(cite)
    let usedKeys = extractKeysFromState(state, validKeys)
    if (!usedKeys.length) return

    let bibHtml = ''
    try {
      bibHtml = cite.format('bibliography', {
        format: 'html',
        style: cfg.template,
        lang: 'en-US',
        entry: usedKeys,
      })
    } catch (e) {
      console.warn('[citation] 生成参考文献失败:', e.message)
      return
    }

    if (cfg.linkify) {
      bibHtml = linkifyDoiAndUrl(bibHtml)
    }

    // ===== 关键：拼成 Markdown 源文本，让 md.block.parse 生成标准 heading token =====
    let mdSource = ''
    if (cfg.appendHeading) {
      mdSource += `${hashes} ${title}\n\n`
    }
    mdSource += `<div class="${wrapClass}">\n${bibHtml}\n</div>\n`

    const newTokens = []
    md.block.parse(mdSource, md, state.env, newTokens)

    // 给 heading 补 id
    if (headingId && cfg.appendHeading) {
      for (const t of newTokens) {
        if (t.type === 'heading_open') {
          t.attrSet('id', headingId)
          break
        }
      }
    }

    // 【关键】不要手动补 inline.children
    // 规则在 before('inline')，后面的 inline core rule 会自动处理
    state.tokens.push(...newTokens)
  })
}



