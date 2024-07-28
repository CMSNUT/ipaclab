import { definePlumeNotesConfig } from 'vuepress-theme-plume'

export const zhNotes = definePlumeNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    {
      dir: 'lab-guide/doe/',
      link: '/doe/',
      sidebar: [
        {
          text: '实验设计',
          icon: 'carbon:idea',
          collapsed: false,
          items: ['概述', '正交设计', '均匀设计', '响应面设计', '案例学习'],
        },
      ],
    },
    {
      dir: 'lab-guide/instruments/',
      link: '/instruments/',
      sidebar: [
        {
          text: '实验仪器',
          collapsed: true,
          items: [
            '实验仪器',
          ],
        },

        {
          text: '光谱仪器',
          prefix: 'spectrometer',
          collapsed: false,
          items: ['Nicolet is10 红外光谱仪', 'Mettler-Toledo ReactIR 15 在线红外光谱仪',],
        },
        {
          text: '色谱/质谱',
          prefix: 'xcms',
          collapsed: false,
          items: ['Bruker LC-MS', 'Shimadzu GC-MS',],
        },
        {
          text: '其他仪器',
          prefix: 'other',
          collapsed: false,
          items: [],
        },
      ],
    },
  ],
})

export const enNotes = definePlumeNotesConfig({
  dir: 'en/notes',
  link: '/',
  notes: [],
})
