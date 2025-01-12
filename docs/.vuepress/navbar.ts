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
      { text: '生物信息学', link: '/notes/研究课题/生物信息学/1.临床医学/1.膀胱癌lncRNAs.md' },
      { text: '计算机辅助药物设计', link: '/notes/研究课题/计算机辅助药物设计/1.先导化合物优化/1.优化001.md' },
      { text: '其他', link: '/notes/研究课题/其他/1.氢氧催化粘接/1.粘接溶液配方优化.md' },
    ]
  },

  /**
   * 重要文献
   */
  { 
    text: '重要文献',
    items: 
    [
      { text: '化学计量学', link: '/notes/重要文献/化学计量学/1.算法程序/README.md' },
      { text: '生物信息学', link: '/notes/重要文献/生物信息学/1.网络药理学/README.md' },
      { text: '计算机辅助药物设计', link: '/notes/重要文献/计算机辅助药物设计/1.先导化合物优化/README.md' },
      { text: '其他', link: '/notes/重要文献/其他/1.氢氧催化粘接/README.md' },
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
      { text: '常规操作', link: '/notes/实验技术/常规操作/分离纯化/过滤.md' },
      { text: '材料制备', link: '/notes/实验技术/材料制备/SERS基底/Ag纳米.md' },
      
    ]
  },

  /**
   * 软件教程
   */

  { 
    text: '软件教程',
    items: 
    [
      { text: '化学计量学', link: '/notes/软件教程/化学计量学/1.数据处理/1.数据读写.md' },
      { text: '生物信息学', link: '/notes/软件教程/生物信息学/1.生存分析/1.KM生存曲线.md' },
      { text: '计算机辅助药物设计', link: '/notes/软件教程/计算机辅助药物设计/1.分子设计/1.分子结构绘制与转换.md' },
      { text: '其他', link: '/notes/软件教程/其他/1.R软件/1.R基础.md' },
      
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

