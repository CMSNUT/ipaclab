/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改都会重启 vuepress 服务。
 * 部分配置项的更新没有必要重启 vuepress 服务，建议请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会被覆盖
 */

import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
  base: '/ipaclab/',
  lang: 'zh-CN',
  title: 'IPAC',
  description: 'A web of IPAC Lab',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon_32x32.png' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false,

  theme: plumeTheme({

    /**
     * 自动为每个 Markdown 文件生成 frontmatter
     */
    autoFrontmatter: {
      title: true, // 自动生成标题
      createTime: true, // 自动生成创建时间
      permalink: true, // 自动生成永久链接
    },

    /**
     * @see https://theme-plume.vuejs.press/config/theme/#markdown
     */
    markdown: {

      // 提示：在文档中插入提示信息，适合实验步骤、注意事项
      hint: true,

      // 弹窗：在文档中插入弹窗，适合实验结果、数据分析
      alert: true,

      // 图片增强：图片懒加载、明暗模式、尺寸语法，适合实验结果展示
      image: {
        figure: true,    // 启用 Figure 包装
        lazyload: true,  // 启用图片懒加载
        mark: true,      // 启用明暗模式标记
        size: true,      // 启用图片尺寸语法
      },

      // 数学公式：文献精读、结果分析中的公式渲染
      math: {
        type: 'katex',
      },

      // 包含：在文档中插入其他 Markdown 文件的内容
      include: {
        // 是否启用深度包含（即被包含的文件里还可以再包含其他文件）
        deep: true, 
        
        // 是否解析被包含文件中的相对图片和链接路径
        resolveImagePath: true,
        resolveLinkPath: true,
      },

      // 内容注释：行内注释，点击展开说明，适合文献精读
      annotation: true,

      // 缩写词：自动解释专业术语，适合全文使用
      abbr: true,

      // 标记：标记实验关键数据，适合结果分析
      mark: 'eager',

      // 代码树：展示多文件项目结构，适合计算技术中的代码示例
      codeTree: true,

      // 选项卡：在文档中插入选项卡，适合实验步骤、结果分析
      // tabs: true,

      // NPM 包转换：在文档中插入 NPM 包信息，适合技术文档
      npmTo: true,

      // 图标：Markdown 中插入图标
      icon: {
        provider: 'iconify',
      },

      // 隐秘文本：隐藏实验关键数据，悬停/点击显示，适合结果分析
      plot: true,

      // 文件树：展示文件结构，适合项目文档
      fileTree: true,

      // 字段容器：描述配置字段、组件 Props，适合计算技术文档
      field: true,

      // 表格增强：带标题、复制功能的表格，适合数据展示
      table: true,

      // 时间线：展示研究进度、实验里程碑，适合研究项目模块
      timeline: true,

      // 折叠面板：折叠实验步骤、参数详情，适合实验技术文档
      collapse: true,

      // 视频：Markdown 中插入B站视频
      bilibili: true,

      // 图片尺寸：Markdown 中插入图片尺寸语法
      imageSize: true,

      // 图表：Markdown 中插入图表
      chartjs: true,

      // ECharts：Markdown 中插入 ECharts 图表
      echarts: true,

      // Mermaid：Markdown 中插入 Mermaid 图表
      mermaid: true,

      // Markmap：Markdown 中插入 Markmap 思维导图
      markmap: true,

      // Flowchart：Markdown 中插入流程图
      flowchart: true,
    },

    /**
     * @see https://theme-plume.vuejs.press/config/theme/#codehighlighter
     */
    codeHighlighter: {
      themes: { 
        light: 'vitesse-light', 
        dark: 'vitesse-dark' 
      }, 

      lineNumbers: true,              // 显示行号
      notationDiff: true,             // 差异标记 !!
      notationErrorLevel: true,       // 错误级别标记 !!
      notationFocus: true,            // 聚焦标记 !!
      notationHighlight: true,        // 高亮标记 !!
      notationWordHighlight: true,    // 单词高亮标记 !!
      highlightLines: true,           // 行高亮
      collapsedLines: false,          // 代码折叠（默认关闭，可设为数字）
      whitespace: false,              // 空白字符可视化

    },

    /**
     * @see https://theme-plume.vuejs.press/config/theme/#search
     */
    search:{
      provider: 'local',
    },

    /**
     * @see https://theme-plume.vuejs.press/config/theme/#comment
     */
    comment: {
      provider: 'Giscus', // "Artalk“ | "Giscus" | "Twikoo" | "Waline"
      comment: true,
      repo: 'cmsnut/ipaclab',        // 格式：用户名/仓库名
      repoId: 'R_kgDONGHXUQ',         // 从 giscus.app 复制，确保一致
      category: 'General',            // 你选择的分类名称
      categoryId: 'DIC_kwDONGHXUc4Cjxoc', // 从 giscus.app 复制，确保一致
      mapping: 'pathname',
      strict: false,
      reactionsEnabled: true,
      inputPosition: 'top',
    },


    /**
     * @see https://theme-plume.vuejs.press/config/theme/#watermark
     */
    // watermark: {
    //   // enabled: false,  // boolean 类型控制是否全局启用
    //   enabled: page => true, // function 类型 过滤哪些页面启用水印

    //   /**
    //    * 是否全屏水印，默认为 `true`，
    //    * 设置为 `false` 时，水印仅在 内容区域中显示。
    //    */
    //   fullPage: true,

    //   /** @see https://zhensherlock.github.io/watermark-js-plus/zh/config/ */
    //   watermarkOptions: {
    //     content: 'ipca@aikemi',   
    //   }
    // },

    /** 
     * @see https://theme-plume.vuejs.press/config/theme/#readingtime
    */
    readingTime: {
      wordPerMinute: 300
    },

    /** 
     * @see https://theme-plume.vuejs.press/config/theme/#copycode
     */
    copyCode: {
      showInMobile: false,
      ignoreSelector: ['.token.comment'],  // 复制时忽略的元素
    },

    /** 
     * @see https://theme-plume.vuejs.press/config/theme/#lastupdated
     */
    lastUpdated: {
      formatOptions: { dateStyle: 'short', timeStyle: 'short' } 
    },

    /**
     * @see https://theme-plume.vuejs.press/config/theme/#contributors
     */
    contributors: { 
      avatar: true,
      mode: "block",
      info: [
        {
          username: 'CMSNUT', // github username
          alias: ['Aikemi'], // 别名，本地 git 配置中的用户名
        }
      ]
    },

    plugins: {
      git: process.env.NODE_ENV === 'production', // 生产环境启用
    },

  }),
})
