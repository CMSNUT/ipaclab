// docs/.vuepress/plugins/citation-plugin.cjs

// 需安装插件

// npm install citation-js
// npm install -D @types/markdown-it

// 字段	类型	默认值	说明
// bibFile	string	—	.bib 文件名，相对 bibDir；不写则不启用引用
// bibTemplate	string	apa	引用格式：apa / vancouver / ieee / harvard1 / mdpi 等
// bibTitle	string	参考文献	参考文献列表标题
// bibHeadingLevel	number	2	标题级别，1–6
// bibHeadingId	string	参考文献	标题 id；设空字符串则不写
// bibWrapClass	string	csl-bib-body	外层容器 class
// bibAppendHeading	boolean	true	是否自动插入标题

// 内置样式列表
// citation-js 自带这些样式，bibTemplate 里直接写名字即可：

// 样式名	格式	示例
// apa	APA 第 7 版	(Zhang & Li, 2023)
// vancouver	Vancouver	[1]
// harvard1	Harvard	(Zhang and Li, 2023)

// 添加样式
// mkdir docs\.vuepress\data\csl
// cd docs\.vuepress\data\csl

// # 以 Nature 为例
// curl --ssl-no-revoke -O https://raw.githubusercontent.com/citation-style-language/styles/master/nature.csl

const fs = require('fs')
const path = require('path')
const Cite = require('citation-js')

const cslConfig = Cite.plugins.config.get('@csl')

// ===== 样式 → citation-format 缓存 =====
// 内置三个样式是 citation-js 内嵌的，无法从文件读取，硬编码
const styleFormatCache = new Map([
  ['apa', 'author-date'],
  ['vancouver', 'numeric'],
  ['harvard1', 'author-date'],
])

// 从 CSL 文本解析 citation-format
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

  let added = 0
  let skipped = 0
  let failed = 0

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

      // 无论是否已注册，都记录格式
      const fmt = detectCitationFormat(content)
      styleFormatCache.set(name, fmt)

      // 已注册则跳过 add
      try {
        if (registry.has(name)) {
          skipped++
          continue
        }
      } catch {
        // has() 在某些版本可能不抛错，忽略
      }

      registry.add(name, content)
      console.log(`✅ [citation] 已注册样式: ${name}  [${fmt}]`)
      added++
    } catch (e) {
      console.warn(`⚠️  [citation] 注册失败 ${file}:`, e.message)
      failed++
    }
  }

  console.log(
    `[citation] CSL 扫描完成：新增 ${added}，已存在 ${skipped}，失败 ${failed}`
  )
}

registerCslStyles()

const styleNames = Object.keys(cslConfig.styles.data)
console.log('[citation] 可用样式:', styleNames)

// ===== 判断是否数字顺序编码制 =====
function isNumericStyle(name) {
  if (!name) return false
  const fmt = styleFormatCache.get(name)
  if (fmt) return fmt === 'numeric'
  // 表里没有时回退到启发式
  return /numeric|ieee|vancouver|nature|mdpi|acs/i.test(name)
}

// ===== DOI / URL 转超链接 =====
function linkifyDoiAndUrl(html) {
  let out = html

  // 1. DOI：支持 10.xxx、doi:10.xxx、https://doi.org/10.xxx 三种形式
  //    只把 10.xxx 本身包成链接，doi: 前缀留在外面
  out = out.replace(
    /(doi:\s*)?(?:https?:\/\/doi\.org\/)?(10\.\d{4,9}\/[^\s<)"']+)/g,
    (match, prefix, doi) => {
      const href = `https://doi.org/${doi}`
      const link = `<a href="${href}" target="_blank" rel="noopener">${doi}</a>`
      return prefix ? `${prefix}${link}` : link
    }
  )

  // 2. 剩余 http/https URL 变超链接（跳过已生成的 <a href="..."> 里的 URL）
  out = out.replace(
    /(?<!href="|">)(https?:\/\/[^\s<)"']+)/g,
    url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
  )

  return out
}

// ===== Bib 缓存 =====
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

// ===== 插件主体 =====
module.exports = function citationPlugin(md, options = {}) {
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

  // ===== 1. 解析 frontmatter 配置 =====
  md.core.ruler.before('block', 'citation_resolve_config', (state) => {
    const fm = state.env?.frontmatter || {}
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

  // ===== 2. 数字样式：inline 之后按出现顺序替换 children 中的 @key =====
  md.core.ruler.after('inline', 'citation_replace_numeric', (state) => {
    const cfg = state.env.__citation
    if (!cfg || !cfg.bibPath) return
    if (!isNumericStyle(cfg.template)) return

    // 2.1 收集 @key，按首次出现顺序
    const ordered = []
    const seen = new Set()
    for (const token of state.tokens) {
      if (token.type === 'inline' && token.children) {
        for (const child of token.children) {
          if (child.type === 'text' && child.content && /@[\w-]+/.test(child.content)) {
            for (const m of child.content.matchAll(/\[?@([\w-]+)\]?/g)) {
              if (!seen.has(m[1])) {
                seen.add(m[1])
                ordered.push(m[1])
              }
            }
          }
        }
      }
    }
    if (ordered.length === 0) return

    cfg.orderedKeys = ordered
    cfg.keyIndex = new Map(ordered.map((k, i) => [k, i + 1]))

    // 2.2 替换 children 中的 text
    for (const token of state.tokens) {
      if (token.type !== 'inline' || !token.children) continue
      for (const child of token.children) {
        if (child.type !== 'text' || !child.content) continue
        if (!/@[\w-]+/.test(child.content)) continue
        child.content = child.content.replace(/\[?@([\w-]+)\]?/g, (match, key) => {
          const num = cfg.keyIndex.get(key)
          return num !== undefined ? `[${num}]` : match
        })
      }
    }
  })

  const defaultRender =
    md.renderer.rules.text ||
    function (tokens, idx, opts, env, self) {
      return self.renderToken(tokens, idx, opts)
    }

  // ===== 3. 正文引用替换（数字样式已在 after('inline') 处理，这里只处理非数字样式） =====
  md.renderer.rules.text = function (tokens, idx, opts, env, self) {
    const cfg = env.__citation
    if (!cfg || !cfg.bibPath) return defaultRender(tokens, idx, opts, env, self)

    const token = tokens[idx]
    if (!token.content || !/@[\w-]+/.test(token.content)) {
      return defaultRender(tokens, idx, opts, env, self)
    }

    if (isNumericStyle(cfg.template)) {
      return defaultRender(tokens, idx, opts, env, self)
    }

    const cite = loadBib(cfg.bibPath)
    if (!cite) return defaultRender(tokens, idx, opts, env, self)

    token.content = token.content.replace(/\[?@([\w-]+)\]?/g, (match, key) => {
      try {
        return cite.format('citation', { style: cfg.template, entry: [key] })
      } catch {
        return match
      }
    })
    return defaultRender(tokens, idx, opts, env, self)
  }

  // ===== 4. 文末插入参考文献列表 =====
  md.core.ruler.push('citation_bibliography', function (state) {
    const cfg = state.env.__citation
    if (!cfg || !cfg.bibPath) return

    const cite = loadBib(cfg.bibPath)
    if (!cite) return

    let usedKeys = cfg.orderedKeys
    if (!usedKeys || !usedKeys.length) {
      const fallback = new Set()
      for (const token of state.tokens) {
        if (token.type === 'inline' && token.children) {
          for (const child of token.children) {
            if (child.type === 'text' && child.content) {
              for (const m of child.content.matchAll(/\[?@([\w-]+)\]?/g)) {
                fallback.add(m[1])
              }
            }
          }
        }
      }
      usedKeys = [...fallback]
    }
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

    const Token = state.Token
    const level = Math.min(Math.max(parseInt(cfg.headingLevel, 10) || 2, 1), 6)
    const tag = `h${level}`

    if (cfg.appendHeading) {
      const hOpen = new Token('heading_open', tag, 1)
      if (cfg.headingId) hOpen.attrSet('id', cfg.headingId)
      const hInline = new Token('inline', '', 0)
      hInline.content = cfg.title
      hInline.children = []
      const hText = new Token('text', '', 0)
      hText.content = cfg.title
      hInline.children.push(hText)
      const hClose = new Token('heading_close', tag, -1)
      state.tokens.push(hOpen, hInline, hClose)
    }

    const htmlToken = new Token('html_block', '', 0)
    htmlToken.content = `<div class="${cfg.wrapClass}">\n${bibHtml}\n</div>\n`
    state.tokens.push(htmlToken)
  })
}