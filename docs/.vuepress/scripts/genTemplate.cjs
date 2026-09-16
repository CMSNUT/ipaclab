/**
 * 生成各栏目的 Markdown 模板（CJS）
 * 用法: 
 *   node docs/.vuepress/scripts/gen-template.cjs <栏目> <目录名> [--force]
 *   node docs/.vuepress/scripts/gen-template.cjs --list
 *
 * 例: 
 *   node docs/.vuepress/scripts/gen-template.cjs 课题 20260916.芪附汤抗慢性心衰网药分析
 *   node docs/.vuepress/scripts/gen-template.cjs 教程 01.Plume 入门
 *   node docs/.vuepress/scripts/gen-template.cjs 设备 01.高效液相色谱仪
 *   node docs/.vuepress/scripts/gen-template.cjs 工具 01.网络药理学工具集
 *   node docs/.vuepress/scripts/gen-template.cjs 更多 2026 年度汇总
 *
 * 说明: 
 * - 栏目决定生成哪些文件与内容
 * - 目录名作为子目录名（相对 docs/<栏目>/）
 * - 不加 --force 时，已存在的文件不覆盖
 * - permalink、createTime 由 gen:readme 脚本补齐或保留
 * - comment 统一写 false
 */

const fs = require('fs')
const path = require('path')

const DOCS_ROOT = path.resolve(__dirname, '../..')

// ========== 工具 ==========

function today() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function isoWeek(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`
}

function fm(title, tags = []) {
  const lines = ['---', `title: ${title}`]
  if (tags.length) {
    lines.push('tags:')
    for (const t of tags) lines.push(`  - ${t}`)
  }
  lines.push('comment: false')
  lines.push('---', '')
  return lines.join('\n') + '\n'
}

function writeFile(filePath, content, force) {
  const rel = path.relative(DOCS_ROOT, filePath)
  if (fs.existsSync(filePath) && !force) {
    console.log(`⏭️  已存在，跳过: ${rel}`)
    return false
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`✅ 已生成: ${rel}`)
  return true
}

// ========== 栏目: 教程 ==========

function genCourse(dir, force) {
  writeFile(path.join(dir, 'README.md'), fm('教程总览', ['教程']) + `
# 教程总览

> 本文件由脚本生成，请按需补充。

## 基本信息

| 项目 | 内容 |
|---|---|
| 标题 |  |
| 难度 | 入门 / 进阶 / 高级 |
| 预计时长 |  |
| 前置要求 |  |
| 最后更新 | ${today()} |

## 你将学会

- 

## 目录

- [01 简介](01-intro.md)
- [02 准备工作](02-prepare.md)
- [03 正文](03-main.md)
- [04 总结](04-summary.md)
`, force)

  writeFile(path.join(dir, '01-intro.md'), fm('01 简介') + `
# 01 简介

## 背景

## 适用人群

## 学习目标

- 
`, force)

  writeFile(path.join(dir, '02-prepare.md'), fm('02 准备工作') + `
# 02 准备工作

## 环境要求

| 项 | 版本 |
|---|---|
|  |  |

## 安装步骤

1. 
2. 

## 验证

\`\`\`bash

\`\`\`
`, force)

  writeFile(path.join(dir, '03-main.md'), fm('03 正文') + `
# 03 正文

## 步骤 1

## 步骤 2

## 常见问题

- 
`, force)

  writeFile(path.join(dir, '04-summary.md'), fm('04 总结') + `
# 04 总结

## 回顾

## 延伸阅读

- 
`, force)
}

// ========== 栏目: 设备 ==========

function genInstrument(dir, force) {
  writeFile(path.join(dir, 'README.md'), fm('设备总览', ['设备']) + `
# 设备总览

> 本文件由脚本生成，请按需补充。

## 基本信息

| 项目 | 内容 |
|---|---|
| 名称 |  |
| 型号 |  |
| 厂商 |  |
| 购置日期 |  |
| 存放位置 |  |
| 责任人 |  |
| 状态 | 正常 / 维修 / 报废 |

## 子页面

- [01 简介](01-intro.md)
- [02 规格参数](02-specs.md)
- [03 使用说明](03-usage.md)
- [04 维护保养](04-maintenance.md)
`, force)

  writeFile(path.join(dir, '01-intro.md'), fm('01 简介') + `
# 01 简介

## 用途

## 适用场景

## 主要功能

- 
`, force)

  writeFile(path.join(dir, '02-specs.md'), fm('02 规格参数') + `
# 02 规格参数

| 参数 | 数值 | 单位 |
|---|---|---|
|  |  |  |

## 附件清单

| 名称 | 数量 |
|---|---|
|  |  |
`, force)

  writeFile(path.join(dir, '03-usage.md'), fm('03 使用说明') + `
# 03 使用说明

## 开机前检查

- 

## 操作步骤

1. 
2. 

## 关机步骤

1. 

## 安全注意

- 
`, force)

  writeFile(path.join(dir, '04-maintenance.md'), fm('04 维护保养') + `
# 04 维护保养

## 日常维护

| 周期 | 项目 | 负责人 |
|---|---|---|
| 每日 |  |  |

## 常见故障

| 现象 | 可能原因 | 处理 |
|---|---|---|
|  |  |  |

## 维修记录

| 日期 | 问题 | 处理 | 结果 |
|---|---|---|---|
|  |  |  |  |
`, force)
}

// ========== 栏目: 工具 ==========

function genTool(dir, force) {
  writeFile(path.join(dir, 'README.md'), fm('工具总览', ['工具']) + `
# 工具总览

> 本文件由脚本生成，请按需补充。

## 基本信息

| 项目 | 内容 |
|---|---|
| 名称 |  |
| 版本 |  |
| 官网 |  |
| 许可 |  |
| 平台 | Windows / macOS / Linux |
| 用途 |  |

## 子页面

- [01 简介](01-intro.md)
- [02 安装](02-install.md)
- [03 使用](03-usage.md)
- [04 常见问题](04-faq.md)
`, force)

  writeFile(path.join(dir, '01-intro.md'), fm('01 简介') + `
# 01 简介

## 功能概述

## 适用场景

## 替代方案

| 工具 | 差异 |
|---|---|
|  |  |
`, force)

  writeFile(path.join(dir, '02-install.md'), fm('02 安装') + `
# 02 安装

## 环境要求

| 项 | 要求 |
|---|---|
|  |  |

## 安装方式

### 方式一: 包管理器

\`\`\`bash

\`\`\`

### 方式二: 二进制

\`\`\`bash

\`\`\`

## 验证

\`\`\`bash

\`\`\`
`, force)

  writeFile(path.join(dir, '03-usage.md'), fm('03 使用') + `
# 03 使用

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
`, force)

  writeFile(path.join(dir, '04-faq.md'), fm('04 常见问题') + `
# 04 常见问题

## Q1

**A: **

## Q2

**A: **
`, force)
}

// ========== 栏目: 课题 ==========

function genProject(dir, force) {
  const t = today()
  const w = isoWeek()

  // 顶层 README
  writeFile(path.join(dir, 'README.md'), fm('课题总览', ['课题']) + `
# 课题总览

> 本文件由脚本生成，请按需补充。

## 基本信息

| 项目 | 内容 |
|---|---|
| 课题编号 |  |
| 状态 | 进行中 |
| 开始日期 | ${t} |
| 预计完成 |  |
| 负责人 |  |
| 成员 |  |
| 代码仓库 |  |
| 数据仓库 |  |

## 研究问题

- 主问题: 
- 子问题: 
  1. 

## 假设

- H1: 
- H2: 

## 实验列表

| 编号 | 目的 | 状态 | 页面 |
|---|---|---|---|
| exp-001 |  | 计划 | [exp-001](03-experiments/exp-001.md) |

## 子页面导航

- [研究背景](01-background.md)
- [实验设计](02-design.md)
- [实验记录](03-experiments/)
- [统计分析](04-analysis.md)
- [结果](05-results.md)
- [讨论](06-discussion.md)
- [参考文献](07-refs.md)
- [会议记录](08-meetings/)
- [日志周报](09-logs/)
- [决策记录](10-decisions/)
`, force)

  // 01 研究背景
  writeFile(path.join(dir, '01-background.md'), fm('研究背景') + `
# 研究背景

## 1. 领域现状

## 2. 文献综述

| 作者/年份 | 方法 | 主要结论 | 局限 |
|---|---|---|---|
|  |  |  |  |

## 3. 研究缺口

- 已有研究不足: 
- 本课题要解决: 

## 4. 研究问题

- 主问题: 
- 子问题: 
  1. 

## 5. 假设

- H1: 
- H2: 
- 零假设 / 备择假设: 

## 6. 概念框架

## 7. 伦理与许可

- 伦理审批: 
- 数据许可: 
`, force)

  // 02 实验设计
  writeFile(path.join(dir, '02-design.md'), fm('实验设计') + `
# 实验设计

## 1. 设计类型

- 实验 / 准实验 / 观察: 
- 组间 / 组内: 
- 盲法 / 随机化: 

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

- 预期效应量: 
- α: 
- 功效: 
- 计算工具: 
- 最终样本量: 

## 5. 材料与仪器

| 名称 | 型号/规格 | 用途 |
|---|---|---|
|  |  |  |

## 6. 实验流程 SOP

1. 
2. 

## 7. 数据采集

- 采集字段: 
- 采集频率: 
- 存储位置: 
- 命名规范: 

## 8. 质量控制与偏差控制

- 校准: 
- 重复: 
- 随机化: 
- 盲法: 
- 排除标准: 
`, force)

  // 03 实验记录
  writeFile(path.join(dir, '03-experiments/README.md'), fm('实验记录') + `
# 实验记录

## 实验列表

| 编号 | 日期 | 目的 | 状态 | 负责人 | 页面 |
|---|---|---|---|---|---|
| exp-001 | ${t} |  | 计划 |  | [exp-001](exp-001.md) |

## 命名规范

- 实验编号: \`exp-001\`
- 数据文件: \`exp-001_raw_YYYY-MM-DD.csv\`
- 分析脚本: \`exp-001_analysis.py\`

## 备注

原始数据、代码仓库链接放这里，不直接放文件。
`, force)

  writeFile(path.join(dir, '03-experiments/exp-001.md'), fm('exp-001 实验') + `
# exp-001

## 1. 基本信息

| 项目 | 内容 |
|---|---|
| 编号 | exp-001 |
| 日期 | ${t} |
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

- 观察: 
- 异常: 
- 原始记录位置: 

## 7. 数据与代码

- 原始数据: 
- 处理后数据: 
- 分析脚本: 

## 8. 初步结论

- 结论: 
- 下一步: 
`, force)

  // 04 统计分析
  writeFile(path.join(dir, '04-analysis.md'), fm('统计分析') + `
# 统计分析

## 1. 分析目标

对应假设: 

## 2. 数据版本

| 数据 | 版本 | 路径 | 说明 |
|---|---|---|---|
| 原始数据 |  |  |  |
| 处理后数据 |  |  |  |

## 3. 预处理

- 缺失值: 
- 异常值: 
- 转换: 
- 排除标准: 

## 4. 统计方法

| 假设 | 方法 | 变量 | 软件 |
|---|---|---|---|
| H1 |  |  |  |

## 5. 模型与公式

## 6. 假设检验

- 显著性水平: 
- 多重比较校正: 
- 效应量: 

## 7. 软件与代码入口

- 软件: 
- 代码仓库: 
- 运行命令: 
- 随机种子: 

## 8. 敏感性分析

## 9. 输出文件

- 图: 
- 表: 
`, force)

  // 05 结果
  writeFile(path.join(dir, '05-results.md'), fm('结果') + `
# 结果

## 1. 数据概况

- 样本量: 
- 分组: 
- 缺失: 

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

- 图: 
- 表: 
- 代码输出: 
`, force)

  // 06 讨论
  writeFile(path.join(dir, '06-discussion.md'), fm('讨论') + `
# 讨论

## 1. 主要发现

## 2. 与文献比较

| 研究 | 结论 | 一致/不一致 | 可能原因 |
|---|---|---|---|
|  |  |  |  |

## 3. 解释

## 4. 局限

- 设计: 
- 样本: 
- 测量: 
- 统计: 

## 5. 结论

## 6. 下一步

## 7. 贡献

- 理论: 
- 方法: 
- 应用: 
`, force)

  // 07 参考文献
  writeFile(path.join(dir, '07-refs.md'), fm('参考文献') + `
# 参考文献

## 1. 引用格式

APA / GB/T 7714 / 其他: 

## 2. 参考文献

1. 

## 3. 数据引用

- 数据集: 
- 仓库: 
- DOI: 

## 4. 代码引用

- 仓库: 
- 版本: 
- 许可: 

## 5. 许可

- 数据许可: 
- 代码许可: 
- 图片许可: 
`, force)

  // 08 会议记录
  writeFile(path.join(dir, '08-meetings/README.md'), fm('会议记录') + `
# 会议记录

## 会议列表

| 日期 | 类型 | 主题 | 主持 | 记录 | 页面 |
|---|---|---|---|---|---|
| ${t} | 启动会 | 目标与分工 |  |  | [kickoff](${t}-kickoff.md) |

## 待办行动项汇总

| 编号 | 任务 | 负责人 | 截止 | 状态 | 来源 |
|---|---|---|---|---|---|
| A1 |  |  |  | 待办 | ${t} |

## 命名规范

- 文件名: \`YYYY-MM-DD-主题.md\`
- 示例: \`${t}-kickoff.md\`
`, force)

  writeFile(path.join(dir, `08-meetings/${t}-kickoff.md`), fm(`${t} 启动会`) + `
# ${t} 启动会

## 1. 基本信息

| 项目 | 内容 |
|---|---|
| 时间 | ${t} 14:00–15:30 |
| 地点 |  |
| 主持 |  |
| 参会 |  |
| 缺席 |  |
| 记录 |  |
| 关联 | H1、exp-001 |

## 2. 议程

1. 课题目标
2. 实验设计
3. 分工与时间线

## 3. 讨论要点

- 

## 4. 决议

- D1: 

## 5. 行动项

| 编号 | 任务 | 负责人 | 截止 | 状态 |
|---|---|---|---|---|
| A1 |  |  |  | 待办 |

## 6. 风险 / 阻塞

## 7. 下次会议

- 时间: 
- 议程: 
`, force)

  // 09 日志周报
  writeFile(path.join(dir, '09-logs/README.md'), fm('日志与周报') + `
# 日志与周报

## 日志列表

| 周期 | 主题 | 负责人 | 页面 |
|---|---|---|---|
| ${w} | 第 ${w.split('-W')[1]} 周 |  | [${w}](${w}.md) |

## 命名规范

- 周报: \`YYYY-Www.md\`
- 实验日志: \`exp-001-YYYY-MM-DD.md\`
- 只放摘要，原始记录放科研仓库
`, force)

  writeFile(path.join(dir, `09-logs/${w}.md`), fm(`${w} 周报`) + `
# ${w} 周报

## 1. 本周目标

## 2. 完成

## 3. 未完成

## 4. 问题与风险

## 5. 数据 / 代码变更

- 数据: 
- 代码: 
- 版本: 

## 6. 下周计划

## 7. 需要支持
`, force)

  // 10 决策记录
  writeFile(path.join(dir, '10-decisions/README.md'), fm('决策记录') + `
# 决策记录

## 决策列表

| 编号 | 日期 | 决策 | 状态 | 页面 |
|---|---|---|---|---|
| DEC-001 | ${t} | 样本量确定 | 已采纳 | [dec-001](dec-001.md) |

## 命名规范

- \`dec-001.md\`
- 编号连续，不按日期重排
`, force)

  writeFile(path.join(dir, '10-decisions/dec-001.md'), fm('DEC-001 样本量确定') + `
# DEC-001 样本量确定

## 1. 决策信息

| 项目 | 内容 |
|---|---|
| 编号 | DEC-001 |
| 日期 | ${t} |
| 状态 | 已采纳 |
| 决策人 |  |
| 关联会议 | ${t}-kickoff |

## 2. 背景

## 3. 选项

| 选项 | 优点 | 缺点 |
|---|---|---|
| A |  |  |
| B |  |  |

## 4. 决定

## 5. 理由

## 6. 影响

- 对实验: 
- 对分析: 
- 对时间线: 

## 7. 关联

- 实验: exp-001
- 假设: H1
`, force)
}

// ========== 栏目: 更多 ==========

function genGeneric(dir, force) {
  writeFile(path.join(dir, 'README.md'), fm('目录总览', ['更多']) + `
# 目录总览

> 本文件由脚本生成，请按需补充。

## 基本信息

| 项目 | 内容 |
|---|---|
| 主题 |  |
| 维护人 |  |
| 最后更新 | ${today()} |

## 子页面

- [01 正文](01-main.md)
`, force)

  writeFile(path.join(dir, '01-main.md'), fm('正文') + `
# 正文

## 1. 背景

## 2. 内容

## 3. 参考
`, force)
}

// ========== 调度 ==========

const GENERATORS = {
  教程: genCourse,
  设备: genInstrument,
  工具: genTool,
  课题: genProject,
  更多: genGeneric,
}

// ========== 主流程 ==========

const argv = process.argv.slice(2)

if (!argv.length || argv[0] === '--list' || argv[0] === '-l') {
  console.log('可用栏目: ')
  for (const k of Object.keys(GENERATORS)) console.log('  - ' + k)
  console.log('\n用法: ')
  console.log('  node docs/.vuepress/scripts/gen-template.cjs <栏目> <目录名> [--force]')
  process.exit(0)
}

const column = argv[0]
const dirName = argv[1]
const force = argv.includes('--force')

if (!GENERATORS[column]) {
  console.error(`❌ 未知栏目: ${column}`)
  console.log('可用栏目: ' + Object.keys(GENERATORS).join('、'))
  process.exit(1)
}

if (!dirName) {
  console.error('❌ 缺少目录名')
  console.log('用法: node docs/.vuepress/scripts/gen-template.cjs <栏目> <目录名> [--force]')
  process.exit(1)
}

const targetDir = path.join(DOCS_ROOT, column, dirName)
console.log(`📂 目标: docs/${column}/${dirName}${force ? ' (force)' : ''}\n`)

GENERATORS[column](targetDir, force)

console.log('\n✨ 完成！可执行 npm run gen:readme 生成索引。')