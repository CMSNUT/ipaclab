/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' },
  // { text: '博客', link: '/blog/' },
  // { text: ' 标签', link: '/blog/tags/' },
  // { text: '归档', link: '/blog/archives/' },
  // {
  //   text: '笔记',
  //   items: [{ text: ' 示例', link: '/demo/README.md' }]
  // },
  { text: '研究课题', link: '/ipaclab/projects/' },
  { text: '研究笔记', link: '/ipaclab/notes/' },
  { text: '学术图库', link: '/ipaclab/pictures/' },
  { text: '实验技术', link: '/ipaclab/exp/' },
  { text: '研究工具', link: '/ipaclab/tools/' },
  { text: '文献研读', link: '/ipaclab/paper/' },
])
