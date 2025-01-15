import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNavbar, zhNavbar } from './navbar'
import { enNotes, zhNotes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',
  // your git repo url
  docsRepo: '',
  docsDir: 'docs',

  appearance: true,

  social: [
    { icon: 'github', link: '/' },
  ],

  locales: {
    '/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'IPACLab',
        // description: 'Web for IPACLab',
        description: '智能精准分析化学实验室',
        // circle: true,
        location: '中国汉中市',
        organization: '陕西理工大学',
      },

      navbar: zhNavbar,
      notes: zhNotes,
    },
    '/en/': {
      profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: 'IPACLab',
        description: 'Web for IPACLab',
        // circle: true,
        location: 'Hanzhong, China',
        organization: 'Shaanxi University of Technology',
      },

      navbar: enNavbar,
      notes: enNotes,
    },
  },
})
