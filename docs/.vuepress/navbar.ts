/**
 * @see https://theme-plume.vuejs.press/config/navigation/ 查看文档了解配置详情
 *
 * Navbar 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 */

import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  { text: '团队', link: '/team/', icon: 'fluent-color:people-team-20'},
  { text: '设备', link: '/instruments/', icon: 'streamline-color:microscope-observation-sciene-flat'},
  { text: '教程', link: '/courses/', icon: 'fluent-color:book-open-lightbulb-20'},
  { text: '课题', link: '/projects/', icon: 'gcp:advanced-solutions-lab'},
  { text: '更多', link: '/more/', icon: 'fluent-color:chat-more-20'},
])
