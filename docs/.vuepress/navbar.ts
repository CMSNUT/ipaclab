import type { NavItem } from 'vuepress-theme-plume'
import { version } from '../../package.json'

export const zhNavbar = [
  { text: '首页', link: '/', icon: 'material-symbols:home', },
  { text: '博客', link: '/blog/', icon: 'material-symbols:article-outline', activeMatch: '^/(blog|article)/', },

  {
    text: '实验指南',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: '实验设计',
        // icon: 'logos:vue',
        link: '/notes/lab-guide/doe/1.基础知识/1.概述.md',
        activeMatch: '^/doe/',
      },
      {
        text: '实验仪器',
        // icon: 'logos:vue',
        link: '/notes/lab-guide/instruments/常用仪器.md',
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
        text: '初级教程',
        // icon: 'logos:vue',
        link: '/notes/bioinformatics/primer/教程列表.md',
        activeMatch: '^/primer/',
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
        activeMatch: '^/cml/',
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
  //   link: '/notes/projects/项目列表.md',
  //   activeMatch: '^/projects/',
  // },
] as NavItem[]


export const enNavbar = [
  { text: 'Home', link: '/en/', icon: 'material-symbols:home' },
  { text: 'Blog', link: '/en/blog/', icon: 'material-symbols:article-outline', activeMatch: '^/en/(blog|article)/', },
  {
    text: 'Lab Guide',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: 'DoE',
        // icon: 'logos:vue',
        link: '/en/notes/lab-guide/doe/1.Basic Knowledge/1.introduction.md',
        activeMatch: '^/doe/',
      },
      {
        text: 'Instruments',
        // icon: 'logos:vue',
        link: '/en/notes/lab-guide/instruments/Common Instruments.md',
        activeMatch: '^/instruments/',
      },
    ],
  },

  {
    text: 'Chemometrics',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: 'Data Pretreatment',
        // icon: 'logos:vue',
        link: '/en/notes/chemometrics/pretreatment/list.md',
        activeMatch: '^/pretreatment/',
      },
      {
        text: 'Multivariate Calibration',
        // icon: 'logos:vue',
        link: '/en/notes/chemometrics/multivariate-calibration/list.md',
        activeMatch: '^/multivariate-calibration/',
      },
      {
        text: 'Multivariate Resolution',
        // icon: 'logos:vue',
        link: '/en/notes/chemometrics/multivariate-resolution/list.md',
        activeMatch: '^/multivariate-resolution/',
      },
      {
        text: 'Pattern Recognition',
        // icon: 'logos:vue',
        link: '/en/notes/chemometrics/pattern-recognition/list.md',
        activeMatch: '^/pattern-recognition/',
      },
    ],
  },

  {
    text: 'Bioinformatics',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: 'Medical Datasets',
        // icon: 'logos:vue',
        link: '/en/notes/bioinformatics/datasets/list.md',
        activeMatch: '^/datasets/',
      },
      {
        text: 'Primer Course',
        // icon: 'logos:vue',
        link: '/en/notes/bioinformatics/primer/list.md',
        activeMatch: '^/primer/',
      },
    ],
  },

  {
    text: 'Machine Learning',
    icon: 'icon-park-outline:guide-board',
    items: [
      {
        text: 'Classic Machine Learning',
        // icon: 'logos:vue',
        link: '/en/notes/machine-learning/cml/list.md',
        activeMatch: '^/cml/',
      },
      {
        text: 'Deep Learning',
        // icon: 'logos:vue',
        link: '/en/notes/machine-learning/dl/list.md',
        activeMatch: '^/dl/',
      },
    ],
  },

] as NavItem[]
