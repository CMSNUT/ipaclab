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
const zhTasksTCM = defineNoteConfig({
  dir: '研究课题/中药智鉴',
  link: '/tasks/tcmie',
  sidebar: "auto"
})

const zhTasksCM = defineNoteConfig({
  dir: '研究课题/临床医学',
  link: '/tasks/clinical',
  sidebar: "auto"
})

const zhTasksTD= defineNoteConfig({
  dir: '研究课题/工具研发',
  link: '/tasks/tools',
  sidebar: "auto"
})

const zhTasksCADD = defineNoteConfig({
  dir: '研究课题/药物设计',
  link: '/tasks/cadd',
  sidebar: "auto"
})

const zhTasksOther = defineNoteConfig({
  dir: '研究课题/其他课题',
  link: '/tasks/other',
  sidebar: "auto"
})


/**
 * 学习资料
 */
const zhLearningChemometrics = defineNoteConfig({
  dir: '学习资料/化学计量学',
  link: '/learning/chemometrics',
  sidebar: "auto"
})

const zhLearningBioinfomatics = defineNoteConfig({
  dir: '学习资料/生物信息学',
  link: '/learning/bioinfomatics',
  sidebar: "auto"
})

const zhLearningNetPharm= defineNoteConfig({
  dir: '学习资料/网络药理学',
  link: '/learning/netpharm',
  sidebar: "auto"
})

const zhLearningCADD = defineNoteConfig({
  dir: '学习资料/计算机辅助药物设计',
  link: '/learning/cadd',
  sidebar: "auto"
})

const zhLearningOther = defineNoteConfig({
  dir: '学习资料/其他',
  link: '/learning/other',
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

const zhOperations = defineNoteConfig({
  dir: '实验技术/常规操作',
  link: '/skills/operations',
  sidebar: "auto"
})

const zhPreparations = defineNoteConfig({
  dir: '实验技术/材料制备',
  link: '/skills/preparations',
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
    zhTasksTCM,
    zhTasksCM,
    zhTasksTD,
    zhTasksCADD,
    zhTasksOther,

   /**
    * 实验技术
    */
    zhInstruments,
    zhSafts,
    zhOperations,
    zhPreparations,


 
    /**
     * 学习资料
     */
    zhLearningChemometrics,
    zhLearningBioinfomatics,
    zhLearningNetPharm,
    zhLearningCADD,
    zhLearningOther,
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

