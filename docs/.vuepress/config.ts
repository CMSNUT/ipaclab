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

    /**
     * bulletin： 公告板
     * @see https://theme-plume.vuejs.press/guide/features/bulletin/
     */

    // bulletin: {
    //   layout: 'top-right',
    //   title: '公告板标题',
    //   content: '公告板内容',
    // },

    /**
     * outline： 显示的标题级别
     * @see https://theme-plume.vuejs.press/config/frontmatter/basic/#outline
     */

    outline: [2,6],

    /**
     * changelog: 文章变更历史
     * 
     * 默认 不启用，仅当 plugins.git 为 true 时生效
     * 此配置在 plume.config.ts 中无效
     * @see https://theme-plume.vuejs.press/guide/features/changelog/
     */
    changelog: true,

    /**
     * contributors: 文章贡献者
     * @see https://theme-plume.vuejs.press/guide/features/contributors/
     */
    contributors: true,

    /**
     * copyright: 文章版权
     * @see https://theme-plume.vuejs.press/guide/features/copyright/
     */
    copyright: 'CC-BY-4.0',

    /**
     * 文章封面图
     */
    blog: {
      // 配置 封面图 布局位置
      // postCover: 'left', // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
      postCover: {
        layout: 'left',
        ratio: '16:9',
        width: 300,
        compact: true
      }
    },

    /**
     * 文章加密
     * @see https://theme-plume.vuejs.press/guide/features/encryption/
     */

    encrypt: {
      rules: {
        // 可以是 md 文件的相对路径，对该文件加密
        // '前端/基础.md': '123456',

        // 可以是 文件夹的路径，对该目录下所有文章加密
        // '/notes/': '123456',  //好像失败了

        // 可以是 访问地址的请求路径，对该访问路径下所有文章加密
        '/tasks/': 'snut3426',

        // 可以是 具体的某个页面的请求路径，对该页面加密
        // '/article/f8dnci3/': '123456',

        // 如果是 `^` 开头，则匹配该正则表达式的页面也会加密
        // '^/(a|b)/': '123456',
      }
    },

    plugins: {

      /**
       * 文章变更历史 、 文章贡献者
       * @see https://theme-plume.vuejs.press/guide/features/changelog/
       */
      // git: process.env.NODE_ENV === 'production',
      git: true,


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
        chartjs: true, // 图表支持
        echarts: true, // ECharts 图表支持
        flowchart: true, // 流程图支持
        // markmap: true, // Markmap 图表支持
        mermaid: true, // mermaid 图标支持
        // stylize: true, // 对行内语法进行样式化以创建代码片段
        // playground: true, // 交互演示
        // kotlinPlayground: true, // Kotlin 交互演示
        // vuePlayground: true, // Vue 交互演示
        // sandpack: true, // sandpack 交互演示
        // demo: true, // 代码案例
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

      /**
       * markdownImage 为 Markdown 图像添加附加功能
       * @see https://theme-plume.vuejs.press/config/plugins/markdown-image/
       */
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
