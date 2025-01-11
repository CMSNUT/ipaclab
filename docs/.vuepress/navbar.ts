import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' , icon: 'material-symbols:home-outline'},
  { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline'},
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },

  // { 
  //   text: '笔记',
  //   items: 
  //   [
  //     { text: '示例', link: '/notes/demo/bar.md' },
  //     { text: '测试', link: '/notes/测试/1.测试1/1.测试003.md' },
  //   ]
  // },


  /**
   * 研究课题
   */
  { 
    text: '研究课题',
    items: 
    [
      { text: '化学计量学', link: '/notes/研究课题/化学计量学/1.算法程序/1.算法001.md' },
      { text: '生物信息学', link: '/notes/研究课题/生物信息学/转录组学/转录001.md' },
      
    ]
  },

  /**
   * 软件教程
   */

  { 
    text: '软件教程',
    items: 
    [
      { text: '化学计量学', link: '/notes/软件教程/化学计量学/数据处理/处理001.md' },
      { text: '生物信息学', link: '/notes/软件教程/生物信息学/生信分析/生信001.md' },
      
    ]
  },


  /**
   * 实验技术
   */

  { 
    text: '实验技术',
    items: 
    [
      { text: '实验安全', link: '/notes/实验技术/实验安全/试剂/危险化学品.md' },
      { text: '分析仪器', link: '/notes/实验技术/分析仪器/红外光谱/Nicolet.md' },
      
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

