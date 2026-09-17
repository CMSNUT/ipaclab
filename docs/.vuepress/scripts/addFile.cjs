/**
 * 单文件生成器（CJS）
 *
 * 作为 CLI：
 *   node ./docs/.vuepress/scripts/add.cjs <相对 docs 的路径> [--force]
 *   node ./docs/.vuepress/scripts/add.cjs --list
 * 
 *   npm run add:file <相对 docs 的路径> [--force]
 *
 * 作为模块：
 *   const { generateFile, today, isoWeek, timestampDate, timestampFull, DOCS_ROOT } = require('./add.cjs')
 *
 * 规范：
 *   - 课题/20260916.课题名/01.研究背景.md
 *   - 课题/20260916.课题名/03.实验记录/实验001.md
 *   - 课题/20260916.课题名/08.会议记录/20260916.启动会.md
 *   - 课题/20260916.课题名/09.日志周报/2026年第38周.md
 *   - 课题/20260916.课题名/10.决策记录/决策001.md
 *   - 教程/教程名.md（文件名时间戳由脚本自动补）
 *   - 更多/名称/01.正文.md
 *   - README.md 由 gen:readme 负责，本脚本不处理
 */

const fs = require('fs')
const path = require('path')

const DOCS_ROOT = path.resolve(__dirname, '../..')

// ---------- 时间戳 ----------
function timestampDate(date = new Date()) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`
}

function timestampFull(date = new Date()) {
  return `${timestampDate(date)}${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(2, '0')}${String(date.getSeconds()).padStart(2, '0')}`
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function fmtDisplayDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
}

function fmtWeekDisplay(week) {
  // 2026-W38 → 2026年第38周
  const m = week.match(/^(\d{4})-W(\d{1,2})$/)
  if (m) return `${m[1]}年第${parseInt(m[2], 10)}周`
  return week
}

function fm(title, tags = []) {
  const lines = ['---', `title: ${title}`]
  if (tags.length) {
    lines.push('tags:')
    for (const t of tags) lines.push(`  - ${t}`)
  }
  lines.push('---', '')
  return lines.join('\n') + '\n'
}

function stripNum(name) {
  return name.replace(/^\d+\./, '')
}

// ---------- 模板库 ----------
const TEMPLATES = {
  // ===== 课题 =====
  background: () => ({
    title: '研究背景',
    tags: ['背景'],
    body: `

## 1. 领域现状

## 2. 文献综述

| 作者/年份 | 方法 | 主要结论 | 局限 |
|---|---|---|---|
|  |  |  |  |

## 3. 研究缺口

- 已有研究不足：
- 本课题要解决：

## 4. 研究问题

- 主问题：
- 子问题：
  1. 

## 5. 假设

- H1：
- H2：
- 零假设 / 备择假设：

## 6. 概念框架

## 7. 伦理与许可

- 伦理审批：
- 数据许可：
`
  }),

  design: () => ({
    title: '实验设计',
    tags: ['设计'],
    body: `# 实验设计

## 1. 设计类型

- 实验 / 准实验 / 观察：
- 组间 / 组内：
- 盲法 / 随机化：

## 2. 变量

| 变量 | 类型 | 操作定义 | 测量单位 | 水平 |
|---|---|---|---|---|
| 自变量 |  |  |  |  |
| 因变量 |  |  |  |  |
| 控制变量 |  |  |  |  |

## 3. 对照与分组

| 组别 | 处理 | 样本量 | 说明 |
|---|---|---|---|
| 对照组 |  |  |  |
| 实验组 |  |  |  |

## 4. 样本量与功效

- 预期效应量：
- α：
- 功效：
- 计算工具：
- 最终样本量：

## 5. 材料与仪器

| 名称 | 型号/规格 | 用途 |
|---|---|---|
|  |  |  |

## 6. 实验流程 SOP

1. 
2. 

## 7. 数据采集

- 采集字段：
- 采集频率：
- 存储位置：
- 命名规范：

## 8. 质量控制与偏差控制

- 校准：
- 重复：
- 随机化：
- 盲法：
- 排除标准：
`
  }),

  analysis: () => ({
    title: '统计分析',
    tags: ['分析'],
    body: `

## 1. 分析目标

## 2. 数据版本

| 数据 | 版本 | 路径 | 说明 |
|---|---|---|---|
| 原始数据 |  |  |  |
| 处理后数据 |  |  |  |

## 3. 预处理

- 缺失值：
- 异常值：
- 转换：
- 排除标准：

## 4. 统计方法

| 假设 | 方法 | 变量 | 软件 |
|---|---|---|---|
| H1 |  |  |  |

## 5. 模型与公式

## 6. 假设检验

- 显著性水平：
- 多重比较校正：
- 效应量：

## 7. 软件与代码入口

- 软件：
- 代码仓库：
- 运行命令：
- 随机种子：

## 8. 敏感性分析

## 9. 输出文件

- 图：
- 表：
`
  }),

  results: () => ({
    title: '结果',
    tags: ['结果'],
    body: `# 结果

## 1. 数据概况

- 样本量：
- 分组：
- 缺失：

## 2. 主要结果

| 指标 | 对照组 | 实验组 | 统计量 | p 值 | 效应量 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 3. 图表

## 4. 统计表

| 模型 | 系数 | SE | 95% CI | p |
|---|---|---|---|---|
|  |  |  |  |  |

## 5. 次要结果

## 6. 异常与缺失

## 7. 结果文件

- 图：
- 表：
- 代码输出：
`
  }),

  discussion: () => ({
    title: '讨论',
    tags: ['讨论'],
    body: `

## 1. 主要发现

## 2. 与文献比较

| 研究 | 结论 | 一致/不一致 | 可能原因 |
|---|---|---|---|
|  |  |  |  |

## 3. 解释

## 4. 局限

- 设计：
- 样本：
- 测量：
- 统计：

## 5. 结论

## 6. 下一步

## 7. 贡献

- 理论：
- 方法：
- 应用：
`
  }),

  refs: () => ({
    title: '参考文献',
    tags: ['文献'],
    body: `

## 1. 参考文献

[1] 

## 2. 数据引用

- 数据集：
- 仓库：
- DOI：

## 3. 代码引用

- 仓库：
- 版本：
- 许可：

## 4. 许可

- 数据许可：
- 代码许可：
- 图片许可：
`
  }),

  experiment: (ctx) => {
    const code = ctx.expCode || '实验001'
    return {
      title: code,
      tags: ['实验'],
      body: `

## 1. 基本信息

| 项目 | 内容 |
|---|---|
| 编号 | ${code} |
| 日期 | ${today()} |
| 负责人 |  |
| 状态 | 进行中 |
| 关联假设 | H1 |
| 数据位置 |  |
| 代码位置 |  |

## 2. 目的

## 3. 材料与设备

| 名称 | 规格 | 数量 |
|---|---|---|
|  |  |  |

## 4. 实际步骤

1. 

## 5. 偏差与变更

| 时间 | 变更/偏差 | 原因 | 影响 |
|---|---|---|---|
|  |  |  |  |

## 6. 观察与原始记录

- 观察：
- 异常：
- 原始记录位置：

## 7. 数据与代码

- 原始数据：
- 处理后数据：
- 分析脚本：

## 8. 初步结论

- 结论：
- 下一步：
`
    }
  },

  meeting: (ctx) => {
    const dateDisp = ctx.dateDisplay || today()
    const topic = ctx.topic || '会议'
    return {
      title: `${dateDisp} ${topic}`,
      tags: ['会议'],
      body: `

## 1. 基本信息

| 项目 | 内容 |
|---|---|
| 时间 | ${dateDisp} 14:00–15:30 |
| 地点 |  |
| 主持 |  |
| 参会 |  |
| 缺席 |  |
| 记录 |  |
| 关联 | H1、实验001 |

## 2. 议程

1. 

## 3. 讨论要点

- 

## 4. 决议

- D1：

## 5. 行动项

| 编号 | 任务 | 负责人 | 截止 | 状态 |
|---|---|---|---|---|
| A1 |  |  |  | 待办 |

## 6. 风险 / 阻塞

## 7. 下次会议

- 时间：
- 议程：
`
    }
  },

  log: (ctx) => {
    const week = ctx.weekDisplay || fmtWeekDisplay(isoWeek())
    return {
      title: week,
      tags: ['周报'],
      body: `

## 1. 本周目标

## 2. 完成

## 3. 未完成

## 4. 问题与风险

## 5. 数据 / 代码变更

- 数据：
- 代码：
- 版本：

## 6. 下周计划

## 7. 需要支持
`
    }
  },

  decision: (ctx) => {
    const code = ctx.decCode || '决策001'
    return {
      title: code,
      tags: ['决策'],
      body: `

## 1. 决策信息

| 项目 | 内容 |
|---|---|
| 编号 | ${code} |
| 日期 | ${today()} |
| 状态 | 已采纳 |
| 决策人 |  |

## 2. 背景

## 3. 选项

| 选项 | 优点 | 缺点 |
|---|---|---|
| A |  |  |
| B |  |  |

## 4. 决定

## 5. 理由

## 6. 影响

- 对实验：
- 对分析：
- 对时间线：
`
    }
  },

  // ===== 教程（单文件） =====
  course: (ctx) => {
    const title = ctx.title || '教程'
    return {
      title,
      tags: ['教程'],
      body: `

## 1. 背景

## 2. 正文

## 3. 常见问题

## 4. 延伸阅读
`
    }
  },

  // ===== 工具 =====
  'tool-intro': () => ({
    title: '简介',
    tags: ['工具'],
    body: `

## 功能概述

## 适用场景

## 替代方案

| 工具 | 差异 |
|---|---|
|  |  |
`
  }),
  'tool-install': () => ({
    title: '安装',
    tags: ['工具'],
    body: `

## 环境要求

| 项 | 要求 |
|---|---|
|  |  |

## 安装方式

### 方式一：包管理器

\`\`\`bash

\`\`\`

### 方式二：二进制

\`\`\`bash

\`\`\`

## 验证

\`\`\`bash

\`\`\`
`
  }),
  'tool-usage': () => ({
    title: '使用',
    tags: ['工具'],
    body: `

## 快速开始

\`\`\`bash

\`\`\`

## 常用命令

| 命令 | 说明 |
|---|---|
|  |  |

## 配置

\`\`\`yaml

\`\`\`
`
  }),
  'tool-faq': () => ({
    title: '常见问题',
    tags: ['工具'],
    body: `

## Q1

**A：**

## Q2

**A：**
`
  }),

  // ===== 更多 =====
  generic: (ctx) => ({
    title: ctx.title || '正文',
    tags: [],
    body: `# ${ctx.title || '正文'}

## 1. 背景

## 2. 内容

## 3. 参考
`
  }),
}

// ---------- 路径 → 模板 ----------
function resolveTemplate(relFromDocs) {
  const segs = relFromDocs.split(/[\\/]/)
  const top = segs[0]
  const file = segs[segs.length - 1]
  const rawName = file.replace(/\.md$/i, '')
  const name = stripNum(rawName)
  const ctx = {}

  if (rawName === 'README' || rawName === 'index') return null

  // ----- 教程：单文件，只有一个模板 -----
  if (top === '教程') {
    return { key: 'course', ctx: { title: name } }
  }

  // ----- 课题 -----
  if (top === '课题') {
    if (/^实验\d+$/.test(rawName)) {
      return { key: 'experiment', ctx: { expCode: rawName } }
    }
    if (/^\d{8}\..+$/.test(rawName)) {
      const date = rawName.slice(0, 8)
      const topic = rawName.slice(9)
      return { key: 'meeting', ctx: { dateDisplay: fmtDisplayDate(date), topic } }
    }
    if (/^\d{4}年第\d+周$/.test(rawName)) {
      return { key: 'log', ctx: { weekDisplay: rawName } }
    }
    if (/^决策\d+$/.test(rawName)) {
      return { key: 'decision', ctx: { decCode: rawName } }
    }
    if (name === '研究背景') return { key: 'background' }
    if (name === '实验设计') return { key: 'design' }
    if (name === '统计分析') return { key: 'analysis' }
    if (name === '结果') return { key: 'results' }
    if (name === '讨论') return { key: 'discussion' }
    if (name === '参考文献') return { key: 'refs' }
  }

  // ----- 工具 -----
  if (top === '工具') {
    if (name === '简介') return { key: 'tool-intro' }
    if (name === '安装') return { key: 'tool-install' }
    if (name === '使用') return { key: 'tool-usage' }
    if (name === '常见问题') return { key: 'tool-faq' }
  }

  // ----- 更多 -----
  if (top === '更多') {
    if (name === '正文') return { key: 'generic', ctx: { title: '正文' } }
  }

  return null
}

// ---------- 生成单文件 ----------
/**
 * @param {string} relFromDocs 相对 docs 的路径
 * @param {object} [options]
 * @param {boolean} [options.force=false] 覆盖已存在文件
 * @param {string}  [options.title] 覆盖标题
 * @returns {{ok:boolean, skipped:boolean, path:string, key:string}}
 */
function generateFile(relFromDocs, options = {}) {
  const force = !!options.force
  const titleOverride = options.title

  if (!relFromDocs.endsWith('.md')) {
    throw new Error(`只支持 .md 文件: ${relFromDocs}`)
  }

  // 教程：文件名若没有 YYYYMMDDHHmmss. 前缀，自动补
  let finalRel = relFromDocs
  const segs = relFromDocs.split(/[\\/]/)
  if (segs[0] === '教程') {
    const file = segs[segs.length - 1]
    const rawName = file.replace(/\.md$/i, '')
    if (!/^\d{14}\./.test(rawName)) {
      segs[segs.length - 1] = `${timestampFull()}.${rawName}.md`
      finalRel = segs.join('/')
    }
  }

  const baseName = path.basename(finalRel).replace(/\.md$/i, '')
  if (baseName === 'README' || baseName === 'index') {
    throw new Error(`README.md / index.md 由 gen:readme 生成，请勿用 add 创建: ${finalRel}`)
  }

  const resolved = resolveTemplate(finalRel)
  if (!resolved) {
    throw new Error(`无法识别文件类型: ${finalRel}\n   请检查栏目、目录与文件名是否符合规范。`)
  }

  const tplFn = TEMPLATES[resolved.key]
  if (!tplFn) throw new Error(`模板不存在: ${resolved.key}`)

  const tpl = tplFn(resolved.ctx || {})
  const finalTitle = titleOverride || tpl.title
  const content = fm(finalTitle, tpl.tags) + tpl.body

  const targetPath = path.join(DOCS_ROOT, finalRel)

  if (fs.existsSync(targetPath) && !force) {
    return { ok: false, skipped: true, path: finalRel, key: resolved.key }
  }

  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, content, 'utf-8')

  return { ok: true, skipped: false, path: finalRel, key: resolved.key }
}

// ---------- 导出 ----------
module.exports = {
  DOCS_ROOT,
  today,
  isoWeek,
  timestampDate,
  timestampFull,
  fmtDisplayDate,
  fmtWeekDisplay,
  fm,
  stripNum,
  TEMPLATES,
  resolveTemplate,
  generateFile,
}

// ---------- CLI ----------
if (require.main === module) {
  const argv = process.argv.slice(2)

  if (!argv.length || argv[0] === '--list' || argv[0] === '-l' || argv[0] === '--help' || argv[0] === '-h') {
    console.log('用法：')
    console.log('  node docs/.vuepress/scripts/add.cjs <相对 docs 的路径> [--force]')
    console.log('\n命名规范：')
    console.log('  课题：01.研究背景.md / 03.实验记录/实验001.md / 08.会议记录/20260916.启动会.md')
    console.log('        09.日志周报/2026年第38周.md / 10.决策记录/决策001.md')
    console.log('  教程：20260916220123.教程名.md（不写时间戳会自动补）')
    console.log('  工具：01.简介.md / 02.安装.md / 03.使用.md / 04.常见问题.md')
    console.log('\n示例：')
    console.log('  npm run add -- 课题/20260916.xxx/01.研究背景.md')
    console.log('  npm run add -- 课题/20260916.xxx/03.实验记录/实验002.md')
    console.log('  npm run add -- 课题/20260916.xxx/08.会议记录/20260923.周会.md')
    console.log('  npm run add -- 课题/20260916.xxx/09.日志周报/2026年第39周.md')
    console.log('  npm run add -- 课题/20260916.xxx/10.决策记录/决策002.md')
    console.log('  npm run add -- 教程/Plume入门.md')
    console.log('  npm run add -- 工具/网络药理学工具集/01.简介.md')
    process.exit(0)
  }

  const relInput = argv[0]
  const force = argv.includes('--force')

  try {
    const r = generateFile(relInput, { force })
    if (r.skipped) {
      console.error(`⏭️  已存在，未覆盖: docs/${r.path}`)
      console.error('   如需覆盖请加 --force')
      process.exit(0)
    }
    console.log(`✅ 已生成: docs/${r.path}  [${r.key}]`)
  } catch (e) {
    console.error(`❌ ${e.message}`)
    process.exit(1)
  }
}