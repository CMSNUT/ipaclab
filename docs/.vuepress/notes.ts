import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

/**
 * 配置 单个 note
 */

// const zhDemo = defineNoteConfig({
//   dir: 'demo',
//   link: '/demo',
//   sidebar: "auto"
// })

// const zhCS = defineNoteConfig({
//   dir: '测试',
//   link: '/cs',
//   sidebar: "auto"
// })


/**
 * 研究课题
 */
const zhTasksChemometrics = defineNoteConfig({
  dir: '研究课题/化学计量学',
  link: '/tasks/chemometrics',
  sidebar: "auto"
})

const zhTasksBioinfomatics = defineNoteConfig({
  dir: '研究课题/生物信息学',
  link: '/tasks/bioinfomatics',
  sidebar: "auto"
})


/**
 * 软件教程
 */

const zhTutorialsChemometrics = defineNoteConfig({
  dir: '软件教程/化学计量学',
  link: '/tutorials/chemometrics',
  sidebar: "auto"
})

const zhTutorialsBioinfomatics = defineNoteConfig({
  dir: '软件教程/生物信息学',
  link: '/tutorials/bioinfomatics',
  sidebar: "auto"
})



/**
 * 实验技术
 */

const zhSafts = defineNoteConfig({
  dir: '实验技术/实验安全',
  link: '/skills/safes',
  sidebar: "auto"
})

const zhInstruments = defineNoteConfig({
  dir: '实验技术/分析仪器',
  link: '/skills/instruments',
  sidebar: "auto"
})


/**
 * 配置 notes
 */

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    // zhDemo,
    // zhCS,

    /**
     * 研究课题
     */
    zhTasksChemometrics,
    zhTasksBioinfomatics,

    /**
     * 软件教程
     */
    zhTutorialsChemometrics,
    zhTutorialsBioinfomatics,


    // 实验技术
    zhInstruments,
    zhSafts,


  
  ]
})

/* =================== locale: en-US ======================= */

const enDemoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/en/',
  notes: [enDemoNote],
})

