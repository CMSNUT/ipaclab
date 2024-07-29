import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { plumeTheme } from 'vuepress-theme-plume'
import * as path from 'node:path'

export default defineUserConfig({
  base: '/ipaclab/',
  lang: 'zh-CN',
  locales: {
    '/': { lang: 'zh-CN', title: '智能精准分析化学实验室' },
    '/en/': { lang: 'en-US', title: 'IPAC Lab' }
  },

  theme: plumeTheme({
    encrypt: {
      rules: {
        '/notes/projects/': 'ipac3426',
        '/en/notes/projects/': 'ipac3426',
      },
    },

    plugins: {
      shiki: {
        theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
        languages: ['javascript', 'typescript', 'python', 'r', 'matlab', 'vue', 'md', 'sql', 'tex', 'bibtex'],
        twoslash: true,
      },
      markdownEnhance: {
        hint: true, // 提示容器
        codetabs: true, // 代码组
        tabs: true, // 选项卡
        align: true, // 对齐容器
        mark: true, // 标记语法
        tasklist: true, // 任务列表语法
        attrs: true, // 属性语法
        sup: true, // 上标语法
        sub: true, // 下标语法
        alert: true, // GFM 通知语法
        footnote: true, // 注脚语法
        katex: true, // 数学公式

        // 以下可选项在 主题中默认不启用，
        // 请在主题中自行配置
        // include: true, // Markdown 导入支持
        // figure: true, // 启用图片 Figure 支持
        // imgLazyload: true, // 使用原生方式懒加载页面图片
        // imgMark: true, // 浅色/深色 图片标记
        // imgSize: true, // 图片尺寸支持
        // obsidianImgSize: true, // obsidian 图片尺寸支持
        // mathjax: true, //  Math Jax 数学公式 语法支持
        // chart: true, // 图表支持
        // echarts: true, // ECharts 图表支持
        // flowchart: true, // 流程图支持
        // markmap: true, // Markmap 图表支持
        // stylize: true, // 对行内语法进行样式化以创建代码片段
        // playground: true, // 交互演示
        // kotlinPlayground: true, // Kotlin 交互演示
        // vuePlayground: true, // Vue 交互演示
        // sandpack: true, // sandpack 交互演示
        // demo: true, // 代码案例
        // revealJs: true, // 幻灯片支持
      },
      markdownPower: {
        // 默认不启用任何功能，你需要手动开启它们
        pdf: true, // @[pdf](url)  嵌入 PDF 文件
        icons: true, // :[collect:name]:   内联 iconify 图标
        bilibili: true, // @[bilibili](bvid)  嵌入 bilibili 视频
        youtube: true, // @[youtube](id)  嵌入 youtube 视频
        codepen: true, // @[codepen](user/slash)  嵌入 codepen
        replit: true, // @[replit](user/repl-name)  嵌入 Replit
        codeSandbox: true, // @[codesandbox](id)  嵌入 CodeSandbox
        jsfiddle: true, // @[jsfiddle](id)  嵌入 jsfiddle
        caniuse: true, // @[caniuse](feature)  嵌入 caniuse
        repl: true, // :::go-repl   :::kotlin-repl  :::rust-repl
        plot: true, // <Plot>悬停时可见</Plot>  <Plot trigger="click">点击时可见</Plot>
      },
    },
  }),
  bundler: viteBundler(),
  source: path.resolve(__dirname, '../'),
  public: path.resolve(__dirname, 'public'),
  head: [
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
  ],
}) as UserConfig