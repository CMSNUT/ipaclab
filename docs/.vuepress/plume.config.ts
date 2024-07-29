import { defineThemeConfig } from 'vuepress-theme-plume'
import { enNotes, zhNotes } from './notes.ts'
import { enNavbar, zhNavbar } from './navbar.ts'

export default defineThemeConfig({
  docsRepo: 'https://github.com/cmsnut/ipaclab',
  contributors: false,

  logo: '/logo.png',
  social: [
    { icon: 'github', link: 'https://cmsnut.github.io/ipaclab/' },
    { icon: 'bilibili', link: 'https://aikemi.cn' },
    { icon: 'zhihu', link: 'https://aikemi.cn' },
  ],

  navbarSocialInclude: ['github'],

  locales: {
    '/': {
      home: '/',
      notes: zhNotes,
      navbar: zhNavbar,
      footer: { message: '', copyright: 'Copyright © 2023-present 智能精准分析化学实验室' },
      profile: {
        avatar: '/avatar.jpg',
        name: '智能精准分析化学实验室',
        description: '锲而不舍 砥砺前行',
        circle: true,
        location: '中国陕西汉中',
        organization: '陕西理工大学',
      },
      editLinkText: '在 GitHub 上编辑此页',
      externalLinkIcon: false as any,
    },
    '/en/': {
      home: '/en/',
      notes: enNotes,
      navbar: enNavbar,
      footer: { message: '', copyright: 'Copyright © 2023-present IPAC Lab' },
      profile: {
        avatar: '/avatar.jpg',
        name: 'IPAC Lab',
        description: 'Asking for Science',
        circle: true,
        location: 'Hanzhong, Shaanxi, China',
        organization: 'Shaanxi University of Technology',
      },
      editLinkText: 'Edit this page on GitHub',
      externalLinkIcon: false as any,
    },
  },
})