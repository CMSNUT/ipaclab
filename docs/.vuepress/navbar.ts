/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '首页', link: '/' },
  { text: '研究课题', link: '/ipaclab/projects/' },
  { text: '实验技术', link: '/ipaclab/lab-skills/' },
  { text: '研究工具', link: '/ipaclab/tools/' },
  { text: '技术文集', link: '/ipaclab/tech-collection/' },
  { text: '研究笔记', link: '/ipaclab/notes/' },
  { text: '文献研读', link: '/ipaclab/paper/' },
  { text: '学术图库', link: '/ipaclab/pictures/' },
])
