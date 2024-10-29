import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/ipaclab/',
  lang: 'zh-CN',
  locales: {
    '/': {
      title: 'IPACLab',
      lang: 'zh-CN',
      description: 'Web for IPACLab',
    },
    '/en/': {
      title: 'IPACLab',
      lang: 'en-US',
      description: 'Web for IPACLab',
    },
  },

  bundler: viteBundler(),

  theme: plumeTheme({
    // 添加您的部署域名
    // hostname: 'https://your_site_url',

    plugins: {
      /**
       * Shiki 代码高亮
       * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
       */
      shiki: {
        // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
        languages: ['shell', 'bash', 'typescript', 'javascript', 'python', 'r'],
      },

      /**
       * markdown enhance
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
       */
      markdownEnhance: {
        demo: true, // 代码案例
        mermaid: true,
        include: true, // Markdown 导入支持
        chart: true, // 图表支持
        echarts: true, // ECharts 图表支持
        flowchart: true, // 流程图支持
        markmap: true, // Markmap 图表支持
        // stylize: true, // 对行内语法进行样式化以创建代码片段
        // playground: true, // 交互演示
        // kotlinPlayground: true, // Kotlin 交互演示
        // vuePlayground: true, // Vue 交互演示
        // sandpack: true, // sandpack 交互演示
      },

      /**
       *  markdown power
       * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
       */
      markdownPower: {
        fileTree: true, // :::file-tree  文件树容器
        plot: true, // !!plot!! 隐秘文本
        icons: true, // :[collect:name]:   内联 iconify 图标

        pdf: true,  // @[pdf](url)  嵌入 PDF 文件
        // caniuse: true,
        bilibili: true, // @[bilibili](bvid)  嵌入 bilibili 视频
        youtube: true, // @[youtube](id)  嵌入 youtube 视频

        // codepen: true,
        // replit: true,
        // codeSandbox: true,
        // jsfiddle: true,
        // repl: {
        //   go: true,
        //   rust: true,
        //   kotlin: true,
        // },
        imageSize: true, // 在构建阶段为 图片添加 width/height 属性
      },

      /**
       *  markdown math
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-math/
       */
      markdownMath: {
        type: 'katex',
      },

      markdownImage: {
        // 启用 figure
        figure: true,

        // 启用图片懒加载
        lazyload: true,

        // 启用图片标记
        mark: true,

        // 启用图片大小
        size: true,
      },

      /**
       * 评论 comments
       * @see https://theme-plume.vuejs.press/guide/features/comments/
       */
      comment: {
        provider: 'Giscus', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
        comment: true,
        repo: 'CMSNUT/ipaclab',
        repoId: 'R_kgDONGHXUQ',
        category: 'General',
        categoryId: 'DIC_kwDONGHXUc4Cjxoc',
        mapping: 'pathname',
        reactionsEnabled: true,
        inputPosition: 'top',
      },
    },
  }),
})
