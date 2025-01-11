import { defineNavbarConfig } from 'vuepress-theme-plume'

export const zhNavbar = defineNavbarConfig([
  { text: '首页', link: '/' , icon: 'material-symbols:home-outline'},
  { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline'},
  // { text: '标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },

  { 
    text: '化学计量学',
    items: 
    [
      { text: '示例', link: '/notes/demo/bar.md' },
      { text: '测试', link: '/notes/多元校正/1.测试1/1.测试003.md' },
    ]
  }

  // { text: '化学计量学', 
  //   icon: 'icon-park-solid:bookshelf',
  //   items: [
  //     {
  //       text: '研究进展',
  //       link: '/chemometrics-progresses/',
  //       activeMatch: '^/chemometrics-progresses/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究工具',
  //       link: '/tools/',
  //       activeMatch: '^/tools/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究课题',
  //       link: '/chemometrics/tasks/',
  //       activeMatch: '^/chemometrics/tasks/',
  //       icon: 'emojione:memo',
  //     },
  //   ]
  // },

  // { text: '生物信息学', 
  //   icon: 'icon-park-solid:bookshelf',
  //   items: [
  //     {
  //       text: '研究进展',
  //       link: '/bioinfomatics/progresses/',
  //       activeMatch: '^/bioinfomatics/progresses/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究工具',
  //       link: '/bioinfomatics/tools/',
  //       activeMatch: '^/bioinfomatics/tools/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究课题',
  //       link: '/bioinfomatics/tasks/',
  //       activeMatch: '^/bioinfomatics/tasks/',
  //       icon: 'emojione:memo',
  //     },
  //   ]
  // },

  // { text: '计算机辅助药物设计', 
  //   icon: 'icon-park-solid:bookshelf',
  //   items: [
  //     {
  //       text: '研究进展',
  //       link: '/cadd/progresses/',
  //       activeMatch: '^/cadd/progresses/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究工具',
  //       link: '/cadd/tools/',
  //       activeMatch: '^/cadd/tools/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究课题',
  //       link: '/cadd/tasks/',
  //       activeMatch: '^/cadd/tasks/',
  //       icon: 'emojione:memo',
  //     },
  //   ]
  // },

  // { text: '其他工作', 
  //   icon: 'icon-park-solid:bookshelf',
  //   items: [
  //     {
  //       text: '研究进展',
  //       link: '/other/progresses/',
  //       activeMatch: '^/other/progresses/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究工具',
  //       link: '/other/tools/',
  //       activeMatch: '^/other/tools/',
  //       icon: 'emojione:memo',
  //     },
  //     {
  //       text: '研究课题',
  //       link: '/other/tasks/',
  //       activeMatch: '^/other/tasks/',
  //       icon: 'emojione:memo',
  //     },
  //   ]
  // },

  
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

