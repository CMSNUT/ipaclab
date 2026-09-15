/**
 * 查看以下文档了解主题配置
 * - @see https://theme-plume.vuejs.press/config/intro/ 配置说明
 * - @see https://theme-plume.vuejs.press/config/theme/ 主题配置项
 *
 * 请注意，对此文件的修改不会重启 vuepress 服务，而是通过热更新的方式生效
 * 但同时部分配置项不支持热更新，请查看文档说明
 * 对于不支持热更新的配置项，请在 `.vuepress/config.ts` 文件中配置
 *
 * 特别的，请不要在两个配置文件中重复配置相同的项，当前文件的配置项会覆盖 `.vuepress/config.ts` 文件中的配置
 */

import { defineThemeConfig } from 'vuepress-theme-plume'
import collections from './collections'
import navbar from './navbar'

const startYear = 2024
const currentYear = new Date().getFullYear()
const yearRange = startYear === currentYear ? `${startYear}` : `${startYear}–${currentYear}`

/**
 * @see https://theme-plume.vuejs.press/config/theme/
 */
export default defineThemeConfig({
  logo: '/avatar.jpg',

  social: [
    { icon: 'github', link: 'https://github.com/cmsnut' },
  ],

  /**
   * @see https://theme-plume.vuejs.press/config/theme/#profile
   */
  profile: {
    avatar: '/avatar.jpg',
    name: 'IPAC Lab',
    description: '智能精准分析化学实验室',
    circle: true,
    organization: '陕西理工大学',
    location: '中国陕西省汉中市',
  },

  /**
   * @see https://theme-plume.vuejs.press/config/theme/#footer
   */
  footer: {
    message: '陕西理工大学智能精准分析化学课题组 版权所有  Email: <a href="mailto:dhxia@snut.edu.cn">dhxia@snut.edu.cn</a>',
    copyright: '© ' + yearRange + `&nbsp;` + ' IPAC Lab ',
  },

  navbar,
  collections,

})
