import { defineThemeConfig } from 'vuepress-theme-plume'


export default defineThemeConfig({
  logo: '/logo.png',
  social: [
    { icon: 'github', link: 'https://cmsnut.github.io/ipaclab/' },
    // { icon: 'bilibili', link: 'https://pengzhanbo.cn' },
    // { icon: 'zhihu', link: 'https://pengzhanbo.cn' },
  ],

  navbarSocialInclude: ['github'],
  locales: {
    '/': {
      home: '/',
      footer: { message: '', copyright: 'Copyright © 2023-present 智能精准分析化学实验室' },
      profile: {
        avatar: '/avatar.jpg',
        name: '智能精准分析化学实验室',
        description: '锲而不舍 砥砺前行',
        circle: true,
        location: '中国陕西汉中',
        organization: '陕西理工大学',
      },
    },
    '/en/': {
      home: '/en/',
      footer: { message: '', copyright: 'Copyright © 2023-present IPAC Lab' },
      profile: {
        avatar: '/avatar.jpg',
        name: 'IPAC Lab',
        description: 'Asking for Science',
        circle: true,
        location: '中国陕西汉中',
        organization: '陕西理工大学',
      },
    },
  },
})