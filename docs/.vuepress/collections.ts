/**
 * @see https://theme-plume.vuejs.press/guide/collection/ 查看文档了解配置详情。
 *
 * Collections 配置文件，它在 `.vuepress/plume.config.ts` 中被导入。
 *
 * 请注意，你应该先在这里配置好 Collections，然后再启动 vuepress，主题会在启动 vuepress 时，
 * 读取这里配置的 Collections，然后在与 Collection 相关的 Markdown 文件中，自动生成 permalink。
 *
 * collection 的  type 为 `post` 时，表示为 文档列表类型(即没有侧边导航栏，有文档列表页)
 * 可用于实现如 博客、专栏 等以文章列表聚合形式的文档集合 (内容相对碎片化的)
 *
 * collection 的 type 为 `doc` 时，表示为文档类型(即有侧边导航栏)
 * 可用于实现如 笔记、知识库、文档等以侧边导航栏形式的文档集合 (内容强关联、成体系的)
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


// import { defineCollection, defineCollections } from 'vuepress-theme-plume'

// const team = defineCollection({
//   type: 'doc',
//   dir: '团队',
//   title: '团队',
//   linkPrefix: '/team/',
//   sidebar: 'auto',
//   sidebarCollapsed: true, 
// })

// const projects = defineCollection({
//   type: 'doc',
//   dir: '课题',
//   title: '课题',
//   linkPrefix: '/projects/',
//   sidebar: 'auto',
//   sidebarCollapsed: true, 
// })

// const instruments = defineCollection({
//   type: 'doc',
//   dir: '设备',
//   title: '设备',
//   linkPrefix: '/instruments/',
//   sidebar: 'auto',
//   sidebarCollapsed: true, 
// })

// const courses = defineCollection({
//   type: 'doc',
//   dir: '教程',
//   title: '教程',
//   linkPrefix: '/courses/',
//   sidebar: 'auto',
//   sidebarCollapsed: true, 
// })

// const more = defineCollection({
//   type: 'doc',
//   dir: '更多',
//   title: '更多',
//   linkPrefix: '/more/',
//   sidebar: 'auto',
//   sidebarCollapsed: true, 
// })

// export default defineCollections([
//   team,
//   instruments,
//   courses,
//   projects,
//   more,  
// ])


import path from 'node:path'
import { defineCollection, defineCollections } from 'vuepress-theme-plume'
import { scanSidebar } from './sidebar.js'
import { url } from 'node:inspector'

const DOCS_ROOT = path.resolve(process.cwd(), 'docs')

const team = defineCollection({
  type: 'doc',
  dir: '团队',
  title: '团队',
  linkPrefix: '/team/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '团队')),
  sidebarCollapsed: true,
})

const instruments = defineCollection({
  type: 'doc',
  dir: '设备',
  title: '设备',
  linkPrefix: '/instruments/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '设备')),
  sidebarCollapsed: true,
})

const courses = defineCollection({
  type: 'doc',
  dir: '教程',
  title: '教程',
  linkPrefix: '/courses/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '教程')),
  sidebarCollapsed: true,
})

const tools = defineCollection({
  type: 'doc',
  dir: '工具',
  title: '工具',
  linkPrefix: '/tools/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '工具')),
  sidebarCollapsed: true,
})

const projects = defineCollection({
  type: 'doc',
  dir: '课题',
  title: '课题',
  linkPrefix: '/projects/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '课题')),
  sidebarCollapsed: true,
})

const papers = defineCollection({
  type: 'post',
  dir: '案例',
  title: '案例',
  // linkPrefix: '/papers/',
  postList: true, // 启用文章列表页
  link: '/papers/', // 列表页链接
  linkPrefix: '/papers/', // 文章链接前缀
  tags: true, // 启用标签页
  tagsLink: '/papers/tags/', // 标签页链接
  tagsTheme: 'colored', // 标签主题 colored|gray|brand
  tagsText: '标签', // 标签页标题
  archives: true, // 启用归档页
  archivesLink: '/papers/archives/', // 归档页链接
  archivesText: '归档', // 归档页标题
  categories: true, // 启用分类页
  categoriesLink: '/papers/categories/', // 分类页链接
  categoriesText: '分类', // 分类页标题
  categoriesExpand: 'deep', // 分类展开层级 number|'deep'
  categoriesTransform: categories => categories, // 分类转换函数
  postCover: {
          layout: 'left',
          ratio: '16/9',
          width: 300,
          compact: true
        },
  autoFrontmatter: {
        title: true, // 自动生成标题
        createTime: true, // 自动生成创建时间
        permalink: true, // 自动生成永久链接
        transform: (data, context, locale) => { // 自定义转换
          data.tags ??= ''
          data.cover ??= ''
          // data.source ??= 'link'
          // if (data.source) {
          //   data.copyright ??= {
          //     creation: 'reprint', // 自动标记为转载
          //     source: 'link',
          //     author: { name: '原作者', url: '' } // 可选，自动填写原作者
          //   }
          // } else {
          //   data.copyright ??= {
          //     author: { name: 'IPAC Lab' }
          //   }
          // }
          return data
        }
      }
})

const skills = defineCollection({
  type: 'post',
  dir: '技术',
  title: '技术',
  // linkPrefix: '/skills/',
  postList: true, // 启用文章列表页
  link: '/skills/', // 列表页链接
  linkPrefix: '/skills/', // 文章链接前缀
  tags: true, // 启用标签页
  tagsLink: '/skills/tags/', // 标签页链接
  tagsTheme: 'colored', // 标签主题 colored|gray|brand
  tagsText: '标签', // 标签页标题
  archives: true, // 启用归档页
  archivesLink: '/skills/archives/', // 归档页链接
  archivesText: '归档', // 归档页标题
  categories: true, // 启用分类页
  categoriesLink: '/skills/categories/', // 分类页链接
  categoriesText: '分类', // 分类页标题
  categoriesExpand: 'deep', // 分类展开层级 number|'deep'
  categoriesTransform: categories => categories, // 分类转换函数
  postCover: {
          layout: 'left',
          ratio: '16/9',
          width: 300,
          compact: true
        },
  autoFrontmatter: {
        title: true, // 自动生成标题
        createTime: true, // 自动生成创建时间
        permalink: true, // 自动生成永久链接
        transform: (data, context, locale) => { // 自定义转换
          data.tags ??= ''
          data.cover ??= ''
          return data
        }
      }
})


const more = defineCollection({
  type: 'doc',
  dir: '更多',
  title: '更多',
  linkPrefix: '/more/',
  sidebar: scanSidebar(path.join(DOCS_ROOT, '更多')),
  sidebarCollapsed: true,
})

export default defineCollections([
  team,
  instruments,
  courses,
  tools,
  projects,
  papers,
  skills,
  more,
])