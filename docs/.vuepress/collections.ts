/**
 * @see https://theme-plume.vuejs.press/guide/collection/ 查看文档了解配置详情。
 *
 * Collections 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Collections，然后再启动 vuepress，主题会在启动 vuepress 时，
 * 读取这里配置的 Collections，然后在与 Collection 相关的 Markdown 文件中，自动生成 permalink。
 *
 * collection 的  type 为 `post` 时，表示为 文档列表类型（即没有侧边导航栏，有文档列表页）
 * 可用于实现如 博客、专栏 等以文章列表聚合形式的文档集合 （内容相对碎片化的）
 *
 * collection 的 type 为 `doc` 时，表示为文档类型（即有侧边导航栏）
 * 可用于实现如 笔记、知识库、文档等以侧边导航栏形式的文档集合 （内容强关联、成体系的）
 * 如果发现 侧边栏没有显示，那么请检查你的配置是否正确，以及 Markdown 文件中的 permalink
 * 是否是以对应的 Collection 配置的 link 的前缀开头。 是否展示侧边栏是根据 页面链接 的前缀 与 `collection.link`
 * 的前缀是否匹配来决定。
 */

/**
 * 在受支持的 IDE 中会智能提示配置项。
 *
 * - `defineCollections` 是用于定义 collection 集合的帮助函数
 * - `defineCollection` 是用于定义单个 collection 配置的帮助函数
 *
 * 通过 `defineCollection` 定义的 collection 配置，应该填入 `defineCollections` 中
 */
import { defineCollection, defineCollections } from 'vuepress-theme-plume'

const projects = defineCollection({
  type: 'doc',
  dir: '研究课题',
  title: '研究课题',
  linkPrefix: '/ipaclab/projects/',
  sidebar: 'auto',
  sidebarCollapsed: true, 
})

const pictures = defineCollection({
  type: 'doc',
  dir: '学术图库',
  title: '学术图库',
  linkPrefix: '/ipaclab/pictures/',
  sidebar: 'auto',
  sidebarCollapsed: true, 
})

const labSkills = defineCollection({
  type: 'doc',
  dir: '实验技术',
  title: '实验技术',
  linkPrefix: '/ipaclab/lab-skills/',
  sidebar: 'auto',
  sidebarCollapsed: true, 
})

const tools = defineCollection({
  type: 'doc',
  dir: '研究工具',
  title: '研究工具',
  linkPrefix: '/ipaclab/tools/',
  sidebar: 'auto',
  sidebarCollapsed: true, 
})

const techCollect = defineCollection({
  type: 'doc',
  dir: '技术文集',
  title: '技术文集',
  linkPrefix: '/ipaclab/tech-collection/',
  sidebar: 'auto',
  sidebarCollapsed: true, 
})

const paper = defineCollection({
  type: 'post',
  dir: '文献研读',
  title: '文献研读',
  link: '/ipaclab/paper/',
  tags: true,
  categories: true,
  archives: true, 
  postCover: {
    layout: 'left',       // 封面图在上方
    ratio: '16/9',       // 宽高比
    width: 300,          // 宽度（仅 left/right 生效）
    compact: false,      // 紧凑模式
  },
})

const notes = defineCollection({
  type: 'post',
  dir: '研究笔记',
  title: '研究笔记',
  link: '/ipaclab/notes/',
  tags: true,
  categories: true,
  archives: true,
})

export default defineCollections([
  projects,
  notes,
  pictures,
  labSkills,
  tools,
  paper,
  techCollect,
])
