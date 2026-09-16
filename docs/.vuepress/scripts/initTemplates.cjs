#!/usr/bin/env node
'use strict';

/**
 * 一次性初始化模板目录：docs/templates/project/
 * 同时把同目录下的 build_timeline.cjs 复制到模板的 scripts/ 子目录。
 *
 * 用法：
 *   node ./docs/.vuepress/scripts/initTemplates.cjs
 *   npm run init:templates
 *   npm run init:templates -- --force
 */

const fs = require('fs');
const path = require('path');

const DOCS_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATE_DIR = path.join(DOCS_ROOT, 'templates', 'project');

const SRC_BUILD_TIMELINE = path.join(__dirname, 'build_timeline.cjs');
const DEST_BUILD_TIMELINE = path.join(TEMPLATE_DIR, 'scripts', 'build_timeline.cjs');

const FORCE = process.argv.includes('--force');

// ---------- 模板内容(含空文件，统一由 writeFile 处理) ----------
const FILES = {
  'README.md': `---
title: {{PROJECT_NAME}}
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/
---

# {{PROJECT_NAME}}

## 课题简介

(填写课题背景、研究目标、预期成果)

## 目录

- [研究计划](./01.研究计划/研究计划.md)
- [研究进度](./02.研究进度/README.md)
- [参考文献](./03.参考文献/reading_list.md)
- [实验记录](./04.实验记录/README.md)
- [数据](./05.数据/README.md)
- [代码](./06.代码/README.md)
- [论文手稿](./07.论文手稿/README.md)
- [会议记录](./08.会议记录/README.md)
- [里程碑](./09.里程碑/README.md)
`,

  '01.研究计划/研究计划.md': `# {{PROJECT_NAME}} 研究计划

## 一、研究背景

## 二、研究问题

## 三、研究目标

## 四、研究方法

## 五、预期成果

## 六、时间安排

## 七、风险与应对
`,

  '01.研究计划/里程碑.md': `# 立项版里程碑

> 立项时确定的初始里程碑。实时追踪请见 [09.里程碑](../09.里程碑/README.md)。

| ID | 里程碑 | 计划完成 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| M01 | 文献调研完成 |  | 未开始 |  |
| M02 | 方案确定 |  | 未开始 |  |
| M03 | 基线实验完成 |  | 未开始 |  |
| M04 | 论文投稿 |  | 未开始 |  |
`,

  '01.研究计划/任务分解.md': `# 任务分解

## 阶段一

- [ ] 任务 1
- [ ] 任务 2

## 阶段二

- [ ] 任务 3
- [ ] 任务 4
`,

  '02.研究进度/README.md': `---
title: {{PROJECT_NAME}} 研究进度
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/progress/
---

# {{PROJECT_NAME}} 研究进度

<!-- PROGRESS_TIMELINE:START -->
<!-- 由 scripts/build_timeline.cjs 自动生成，请勿手动编辑 -->
<!-- PROGRESS_TIMELINE:END -->
`,

  '02.研究进度/_template/result.md': `---
date: {{DATE}}
title: 进度标题
status: 进行中
milestone: 
icon: mdi:flask-outline
tags: []
---

# 进度标题

## 目标

## 方法/过程

## 结果

## 结论

- 

## 下一步

- 

## 附件
`,

  '02.研究进度/entries/.gitkeep': '',

  '03.参考文献/references.bib': `% {{PROJECT_NAME}} 参考文献库
% 例：
%
% @article{key2024,
%   title   = {Title},
%   author  = {Author},
%   journal = {Journal},
%   year    = {2024},
% }
`,

  '03.参考文献/reading_list.md': `# 阅读清单

| 序号 | 标题 | 作者 | 年份 | 状态 | 笔记 |
| --- | --- | --- | --- | --- | --- |
| 1 |  |  |  | 未读 |  |
`,

  '03.参考文献/papers/.gitkeep': '',
  '03.参考文献/notes/.gitkeep': '',

  '04.实验记录/README.md': `---
title: {{PROJECT_NAME}} 实验记录
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/experiments/
---

# {{PROJECT_NAME}} 实验记录

## 目录结构

- \`湿实验/\`：样品制备、预处理、操作、测量等
- \`计算实验/\`：数据准备、模型配置、训练、评估等

两类实验组织方式一致：
- 每个实验一个文件夹：\`YYYY-MM-DD_实验名/\`
- 实验总览：\`README.md\`
- 实验步骤：\`NN.步骤名.md\`(或 \`NN.步骤名/README.md\`)
- 附件：\`附件/\`

## 实验索引

| 实验 | 类型 | 开始日期 | 状态 | 结论 | 链接 |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |
`,

  '04.实验记录/湿实验/README.md': `# 湿实验

## 目录结构

   湿实验/
   └── 2026-09-16_实验名/
       ├── README.md
       ├── 01.样品制备.md
       ├── 02.预处理.md
       ├── 03.操作.md
       ├── 04.测量.md
       ├── 05.分析.md
       └── 附件/

## 新建实验

1. 复制 \`_template/experiment.md\` 为新文件夹的 \`README.md\`
2. 按步骤复制 \`_template/step.md\` 为 \`01.xxx.md\`、\`02.xxx.md\` ...
3. 附件放入 \`附件/\`
`,

  '04.实验记录/湿实验/_template/experiment.md': `---
date: {{DATE}}
title: 实验名
type: wet
status: 进行中
operator: 
tags: []
---

# 实验名

## 目标

## 实验设计

- 自变量：
- 因变量：
- 对照：

## 步骤流程

- [ ] [01.样品制备](./01.样品制备.md)
- [ ] [02.预处理](./02.预处理.md)
- [ ] [03.操作](./03.操作.md)
- [ ] [04.测量](./04.测量.md)
- [ ] [05.分析](./05.分析.md)

## 材料与仪器

| 名称 | 规格/型号 | 数量 | 备注 |
| --- | --- | --- | --- |
|  |  |  |  |

## 关键结果

## 结论

- 

## 问题与改进

- 
`,

  '04.实验记录/湿实验/_template/step.md': `---
date: {{DATE}}
step: 
status: 完成
---

# 步骤名

## 目的

## 材料

## 操作

## 参数记录

| 参数 | 设定值 | 实测值 |
| --- | --- | --- |
|  |  |  |

## 观察与异常

## 结论

- 
`,

  '04.实验记录/湿实验/附件/.gitkeep': '',

  '04.实验记录/计算实验/README.md': `# 计算实验

## 目录结构

   计算实验/
   └── 2026-09-16_实验名/
       ├── README.md
       ├── 01.数据准备.md
       ├── 02.模型配置.md
       ├── 03.训练.md
       ├── 04.评估.md
       ├── 05.分析.md
       └── 附件/

## 新建实验

1. 复制 \`_template/experiment.md\` 为新文件夹的 \`README.md\`
2. 按步骤复制 \`_template/step.md\` 为 \`01.xxx.md\`、\`02.xxx.md\` ...
3. 配置、日志、图表放入 \`附件/\`; 大文件放 \`05.数据/\`
`,

  '04.实验记录/计算实验/_template/experiment.md': `---
date: {{DATE}}
title: 实验名
type: computational
status: 进行中
commit: 
tags: []
---

# 实验名

## 目标

## 实验设计

- 数据集：
- 模型：
- 评价指标：
- 对照/基线：

## 步骤流程

- [ ] [01.数据准备](./01.数据准备.md)
- [ ] [02.模型配置](./02.模型配置.md)
- [ ] [03.训练](./03.训练.md)
- [ ] [04.评估](./04.评估.md)
- [ ] [05.分析](./05.分析.md)

## 运行环境

- 语言/框架版本：
- 硬件：
- 随机种子：

## 关键结果

| 指标 | 基线 | 本实验 | 备注 |
| --- | --- | --- | --- |
|  |  |  |  |

## 结论

- 

## 复现说明

- 代码提交：
- 配置：\`附件/xxx.yaml\`
- 数据：\`05.数据/计算实验/...\`
`,

  '04.实验记录/计算实验/_template/step.md': `---
date: {{DATE}}
step: 
status: 完成
---

# 步骤名

## 目的

## 输入

- 数据：
- 配置：

## 命令

    # 运行命令

## 参数

| 参数 | 值 | 说明 |
| --- | --- | --- |
|  |  |  |

## 输出

- 文件：
- 指标：

## 观察与异常

## 结论

- 
`,

  '04.实验记录/计算实验/附件/.gitkeep': '',

  '05.数据/README.md': `---
title: {{PROJECT_NAME}} 数据
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/data/
---

# {{PROJECT_NAME}} 数据

## 说明

- \`湿实验/raw\`：仪器原始导出
- \`湿实验/processed\`：清洗、整理后
- \`计算实验/raw\`：原始数据集
- \`计算实验/processed\`：处理后特征、结果

## 数据卡片

| 数据集 | 来源 | 规模 | 版本 | 备注 |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

## 大文件

建议使用 Git LFS 或 DVC：

    git lfs track "05.数据/**/*.csv"
    git lfs track "05.数据/**/*.h5"
`,

  '05.数据/湿实验/raw/.gitkeep': '',
  '05.数据/湿实验/processed/.gitkeep': '',
  '05.数据/计算实验/raw/.gitkeep': '',
  '05.数据/计算实验/processed/.gitkeep': '',

  '06.代码/README.md': `---
title: {{PROJECT_NAME}} 代码
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/code/
---

# {{PROJECT_NAME}} 代码

- \`src/\`：公共库
- \`notebooks/\`：Jupyter / Quarto / Rmd
- \`scripts/\`：一次性脚本、数据处理

## 环境

    python -m venv .venv
    pip install -r requirements.txt

## 运行说明
`,

  '06.代码/src/.gitkeep': '',
  '06.代码/notebooks/.gitkeep': '',
  '06.代码/scripts/.gitkeep': '',

  '07.论文手稿/README.md': `---
title: {{PROJECT_NAME}} 论文手稿
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/manuscript/
---

# 论文手稿

- \`main/\`：正文、参考文献
- \`figures/\`：图表
- \`submissions/\`：投稿版本、审稿意见与回复
`,

  '07.论文手稿/main/.gitkeep': '',
  '07.论文手稿/figures/.gitkeep': '',
  '07.论文手稿/submissions/.gitkeep': '',

  '08.会议记录/README.md': `---
title: {{PROJECT_NAME}} 会议记录
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/meetings/
---

# 会议记录

命名：\`entries/YYYY-MM-DD_主题.md\`

## 模板

    ---
    date: {{DATE}}
    title: 会议主题
    attendees: []
    ---
    
    ## 议题
    
    ## 讨论要点
    
    ## 结论与行动项
    
    - [ ] 行动项 1
    - [ ] 行动项 2
`,

  '08.会议记录/entries/.gitkeep': '',

  '09.里程碑/README.md': `---
title: {{PROJECT_NAME}} 里程碑
createTime: {{DATETIME}}
permalink: /projects/{{PROJECT_NAME}}/milestones/
---

# {{PROJECT_NAME}} 里程碑

## 说明

- 每个里程碑一个文件，放在 \`milestones/\`
- 状态：\`未开始\` / \`进行中\` / \`完成\` / \`取消\`
- 进度条目通过 front matter 的 \`milestone: M03\` 挂到对应里程碑

<!-- MILESTONE_SUMMARY:START -->
<!-- 由 scripts/build_timeline.cjs 自动生成，请勿手动编辑 -->
<!-- MILESTONE_SUMMARY:END -->
`,

  '09.里程碑/_template/milestone.md': `---
id: M01
title: 里程碑名称
status: 未开始
target_date: {{DATE}}
completed_date: 
owner: 
tags: []
---

# M01 里程碑名称

## 目标

## 判定标准

- [ ] 标准 1
- [ ] 标准 2

## 关键产出

- 报告：
- 数据：
- 代码：

## 关联实验

- 

## 关联进度条目

<!-- MILESTONE_PROGRESS:START -->
<!-- 由 scripts/build_timeline.cjs 自动生成，请勿手动编辑 -->
<!-- MILESTONE_PROGRESS:END -->

## 备注

## 变更记录

| 日期 | 变更 |
| --- | --- |
| {{DATE}} | 创建 |
`,

  '09.里程碑/milestones/.gitkeep': '',
};

// ---------- 写入 ----------
function writeFile(rel, content) {
  const abs = path.join(TEMPLATE_DIR, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });

  if (fs.existsSync(abs) && !FORCE) {
    console.log('[SKIP] ' + rel);
    return;
  }
  fs.writeFileSync(abs, content, 'utf-8');
  console.log('[OK]   ' + rel);
}

function copyBuildTimeline() {
  if (!fs.existsSync(SRC_BUILD_TIMELINE)) {
    console.warn('[WARN] 未找到源脚本：' + SRC_BUILD_TIMELINE);
    console.warn('       请先把它放到 docs/.vuepress/scripts/build_timeline.cjs');
    console.warn('       再重跑本命令。');
    return;
  }

  fs.mkdirSync(path.dirname(DEST_BUILD_TIMELINE), { recursive: true });

  if (fs.existsSync(DEST_BUILD_TIMELINE) && !FORCE) {
    console.log('[SKIP] scripts/build_timeline.cjs');
    return;
  }

  fs.copyFileSync(SRC_BUILD_TIMELINE, DEST_BUILD_TIMELINE);
  console.log('[OK]   scripts/build_timeline.cjs (从 docs/.vuepress/scripts/ 复制)');
}

function main() {
  console.log('[INFO] 目标目录：' + TEMPLATE_DIR);
  console.log('');

  // 统一写入：FILES 里已包含原 EMPTY_FILES 的空文件
  for (const [rel, content] of Object.entries(FILES)) {
    writeFile(rel, content);
  }

  copyBuildTimeline();

  console.log('');
  console.log('[DONE] 模板已生成。');
  console.log('');
  console.log('下一步：');
  console.log('  npm run new -- 课题名称');
}

main();