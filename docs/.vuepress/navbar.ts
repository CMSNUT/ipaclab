import type { NavItem } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = [
  {
    text: '博客',
    link: '/blog/',
    icon: 'material-symbols:article-outline',
    activeMatch: '^/(blog|article)/',
  },

  {
    text: '实验指南',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: '实验设计',
        // icon: 'logos:vue',
        link: '/notes/lab-guide/doe/概述.md',
        activeMatch: '^/doe/',
      },
      {
        text: '实验仪器',
        // icon: 'logos:vue',
        link: '/notes/lab-guide/instruments/实验仪器.md',
        activeMatch: '^/instruments/',
      },
    ],
  },

  {
    text: '化学计量学',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: '数据预处理',
        // icon: 'logos:vue',
        link: '/notes/chemometrics/pretreatment/教程列表.md',
        activeMatch: '^/pretreatment/',
      },
      {
        text: '多元校正',
        // icon: 'logos:vue',
        link: '/notes/chemometrics/multivariate-calibration/教程列表.md',
        activeMatch: '^/multivariate-calibration/',
      },
      {
        text: '多元分辨',
        // icon: 'logos:vue',
        link: '/notes/chemometrics/multivariate-resolution/教程列表.md',
        activeMatch: '^/multivariate-resolution/',
      },
      {
        text: '模式识别',
        // icon: 'logos:vue',
        link: '/notes/chemometrics/pattern-recognition/教程列表.md',
        activeMatch: '^/pattern-recognition/',
      },
    ],
  },

  {
    text: '生物信息学',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: '医学数据',
        // icon: 'logos:vue',
        link: '/notes/bioinformatics/datasets/数据列表.md',
        activeMatch: '^/datasets/',
      },
      {
        text: '入门教程',
        // icon: 'logos:vue',
        link: '/notes/bioinformatics/tutorials/教程列表.md',
        activeMatch: '^/tutorials/',
      },
    ],
  },

  {
    text: '机器学习',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: '经典机器学习',
        // icon: 'logos:vue',
        link: '/notes/machine-learning/cml/教程列表.md',
        activeMatch: '^/python/',
      },
      {
        text: '深度学习',
        // icon: 'logos:vue',
        link: '/notes/machine-learning/dl/教程列表.md',
        activeMatch: '^/dl/',
      },
    ],
  },
  // {
  //   text: '项目管理',
  //   icon: 'icon-park-outline:guide-board',
  //   items: [
  //     {
  //       text: '国家级',
  //       // icon: 'logos:vue',
  //       link: '/notes/projects/nsf/项目列表.md',
  //       activeMatch: '^/nsf/',
  //     },
  //     {
  //       text: '省部级',
  //       // icon: 'logos:vue',
  //       link: '/notes/projects/pmsf/项目列表.md',
  //       activeMatch: '^/pmsf/',
  //     },
  //     {
  //       text: '省部级',
  //       // icon: 'logos:vue',
  //       link: '/notes/projects/pmsf/项目列表.md',
  //       activeMatch: '^/pmsf/',
  //     },
  //   ],
  // },
] as NavItem[]

export const enNavbar = [
  // {
  //   text: 'Guide',
  //   icon: 'icon-park-outline:guide-board',
  //   link: '/en/guide/intro/',
  //   activeMatch: '^/en/guide/',
  // },
  // {
  //   text: 'Config',
  //   icon: 'icon-park-outline:setting-two',
  //   link: '/en/config/intro/',
  //   activeMatch: '^/en/config/',
  // },
  // {
  //   text: 'Blog',
  //   link: '/en/blog/',
  //   icon: 'material-symbols:article-outline',
  //   activeMatch: '^/en/(blog|article)/',
  // },
  // {
  //   text: 'More',
  //   icon: 'icon-park-outline:more-three',
  //   items: [
  //     {
  //       text: 'Vuepress',
  //       items: [
  //         { text: 'Official Docs', link: 'https://v2.vuepress.vuejs.org' },
  //         { text: 'Ecosystem', link: 'https://ecosystem.vuejs.press/' },
  //       ],
  //     },
  //   ],
  // },
] as NavItem[]
