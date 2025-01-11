import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

/* =================== locale: zh-CN ======================= */

/**
 * 配置 单个 note
 */

const zhDemo = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: "auto"
})

const zhCS = defineNoteConfig({
  dir: '测试',
  link: '/cs',
  sidebar: "auto"
})



/**
 * 配置 notes
 */

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [
    zhDemo,
    zhCS,
    // zhChemometricsTools,
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

