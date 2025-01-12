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

const zhTasksCADD = defineNoteConfig({
  dir: '研究课题/计算机辅助药物设计',
  link: '/tasks/cadd',
  sidebar: "auto"
})

const zhTasksOther = defineNoteConfig({
  dir: '研究课题/其他',
  link: '/tasks/other',
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
 * 重要文献
 */

const zhRefsChemometrics = defineNoteConfig({
  dir: '重要文献/化学计量学',
  link: '/references/chemometrics',
  sidebar: "auto"
})

const zhRefsBioinfomatics = defineNoteConfig({
  dir: '重要文献/生物信息学',
  link: '/references/bioinfomatics',
  sidebar: "auto"
})

const zhRefsCADD = defineNoteConfig({
  dir: '重要文献/计算机辅助药物设计',
  link: '/references/cadd',
  sidebar: "auto"
})

const zhRefsOther = defineNoteConfig({
  dir: '重要文献/其他',
  link: '/references/other',
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

const zhTutorialsCADD = defineNoteConfig({
  dir: '软件教程/计算机辅助药物设计',
  link: '/tutorials/cadd',
  sidebar: "auto"
})

const zhTutorialsOther = defineNoteConfig({
  dir: '软件教程/其他',
  link: '/tutorials/other',
  sidebar: "auto"
})

/**
 * 开源数据
 */

const zhDatasetsChemometrics = defineNoteConfig({
  dir: '开源数据/化学计量学',
  link: '/datasets/chemometrics',
  sidebar: "auto"
})

const zhDatasetsBioinfomatics = defineNoteConfig({
  dir: '开源数据/生物信息学',
  link: '/datasets/bioinfomatics',
  sidebar: "auto"
})

const zhDatasetsCADD = defineNoteConfig({
  dir: '开源数据/计算机辅助药物设计',
  link: '/datasets/cadd',
  sidebar: "auto"
})

const zhDatasetsOther = defineNoteConfig({
  dir: '开源数据/其他',
  link: '/datasets/other',
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
     * 重要文献
     */

    zhRefsChemometrics,
    zhRefsBioinfomatics,
    zhRefsCADD,
    zhRefsOther,

     /**
     * 软件教程
     */
     zhTutorialsChemometrics,
     zhTutorialsBioinfomatics,
     zhTutorialsCADD,
     zhTutorialsOther,
 
    /**
     * 开源数据
     */
    zhDatasetsChemometrics,
    zhDatasetsBioinfomatics,
    zhDatasetsCADD,
    zhDatasetsOther,
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

