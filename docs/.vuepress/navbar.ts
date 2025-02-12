import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' , icon: 'material-symbols:home-outline'},
  { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline'},
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },

  /**
   * 研究课题
   */
  { 
    text: '研究课题',
    items: 
    [
      { text: '化学计量学', link: '/notes/研究课题/化学计量学/README.md' },
      { text: '生物信息学', link: '/notes/研究课题/生物信息学/README.md' },
      { text: '网络药理学', link: '/notes/研究课题/网络药理学/README.md' },
      { text: '计算机辅助药物设计', link: '/notes/研究课题/计算机辅助药物设计/README.md' },
      { text: '其他', link: '/notes/研究课题/其他/README.md' },
    ]
  },

  /**
   * 实验技术
   */

  { 
    text: '实验技术',
    items: 
    [
      { text: '实验安全', link: '/notes/实验技术/实验安全/README.md' },
      { text: '分析仪器', link: '/notes/实验技术/分析仪器/README.md' },
      { text: '常规操作', link: '/notes/实验技术/常规操作/README.md' },
      { text: '材料制备', link: '/notes/实验技术/材料制备/README.md' },
      
    ]
  },

  /**
   * 学习资料
   */

  { 
    text: '学习资料',
    items: 
    [
      { text: '化学计量学', link: '/notes/学习资料/化学计量学/README.md' },
      { text: '生物信息学', link: '/notes/学习资料/生物信息学/README.md' },
      { text: '网络药理学', link: '/notes/学习资料/网络药理学/README.md' },
      { text: '计算机辅助药物设计', link: '/notes/学习资料/计算机辅助药物设计/README.md' },
      { text: '其他', link: '/notes/学习资料/其他/README.md' },
      
    ]
  },

  {
    text: '更多',
    icon: 'mingcute:more-3-fill',
    items: 
    [
      {text: '书籍推荐', link: '/ebooks/', icon: 'material-symbols:recommend'},
      {text: '站点导航', link: '/sites-collect/', icon: 'mdi:roadmap'},
    ]
  },


   
])

export const enNavbar = defineNavbarConfig([
  { text: 'Home', link: '/en/' },
  { text: 'Blog', link: '/en/blog/' },
  { text: 'Tags', link: '/en/blog/tags/' },
  { text: 'Archives', link: '/en/blog/archives/' },
  {
    text: 'Notes',
    items: [{ text: 'Demo', link: '/en/notes/demo/README.md' }]
  },
])

