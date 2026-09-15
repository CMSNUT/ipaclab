#!/usr/bin/env node
'use strict';

/**
 * 课题级脚本：生成研究进度时间线 + 聚合里程碑。
 *
 * 运行位置：<课题目录>/scripts/build_timeline.cjs
 * 依赖目录：
 *   <课题>/02_研究进度/entries/x/result.md
 *   <课题>/09_里程碑/milestones/*.md
 *
 * 产物：
 *   <课题>/02_研究进度/timeline.md      纯 Plume 时间线
 *   <课题>/02_研究进度/README.md        概览 + 时间线（自动区域）
 *   <课题>/09_里程碑/README.md          里程碑总览表（自动区域）
 *   <课题>/09_里程碑/milestones/*.md    每个里程碑内的进度聚合块
 *
 * 保留策略：
 *   若目标文件已存在且含 createTime / permalink，则这两项原样保留。
 */

const fs = require('fs');
const path = require('path');

// ---------- 路径 ----------
const ROOT = path.resolve(__dirname, '..');                    // <课题>/
const PROGRESS_DIR = path.join(ROOT, '02_研究进度');
const ENTRIES_DIR = path.join(PROGRESS_DIR, 'entries');
const TIMELINE_FILE = path.join(PROGRESS_DIR, 'timeline.md');
const PROGRESS_README = path.join(PROGRESS_DIR, 'README.md');

const MILESTONES_DIR = path.join(ROOT, '09_里程碑');
const MILESTONE_FILES_DIR = path.join(MILESTONES_DIR, 'milestones');
const MILESTONES_README = path.join(MILESTONES_DIR, 'README.md');

// ---------- 自动区域标记 ----------
const TIMELINE_START = '<!-- PROGRESS_TIMELINE:START -->';
const TIMELINE_END = '<!-- PROGRESS_TIMELINE:END -->';
const MS_PROGRESS_START = '<!-- MILESTONE_PROGRESS:START -->';
const MS_PROGRESS_END = '<!-- MILESTONE_PROGRESS:END -->';
const MS_SUMMARY_START = '<!-- MILESTONE_SUMMARY:START -->';
const MS_SUMMARY_END = '<!-- MILESTONE_SUMMARY:END -->';

// ---------- 默认元数据 ----------
const TIMELINE_DEFAULTS = { title: '研究进度纵向时间线', permalink: '/progress/timeline/' };
const PROGRESS_README_DEFAULTS = { title: '研究进度', permalink: '/progress/' };
const MS_README_DEFAULTS = { title: '里程碑', permalink: '/milestones/' };

// ---------- 状态 → Plume type ----------
const STATUS_TYPE_MAP = {
  '完成': 'success', done: 'success', completed: 'success',
  '进行中': 'warning', 'in-progress': 'warning', wip: 'warning',
  '暂停': 'caution', paused: 'caution', blocked: 'caution',
  '失败': 'failed', failed: 'danger',
  '重要': 'important', important: 'important',
};

function resolveType(status) {
  if (!status) return 'info';
  const key = String(status).trim();
  return STATUS_TYPE_MAP[key] || STATUS_TYPE_MAP[key.toLowerCase()] || 'info';
}

// ---------- Front matter 解析 ----------
function parseFrontMatter(text) {
  const result = { meta: {}, body: text, hasFrontMatter: false };
  if (!text.startsWith('---')) return result;

  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return result;

  result.hasFrontMatter = true;
  result.body = text.slice(m[0].length);

  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const mm = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    let val = mm[2].trim();

    // 数组形式 [a, b]
    if (/^\[.*\]$/.test(val)) {
      result.meta[key] = val
        .slice(1, -1)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      continue;
    }

    // 去引号
    if ((val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    result.meta[key] = val;
  }
  return result;
}

function formatYamlValue(v) {
  if (Array.isArray(v)) {
    return `[${v.map(formatYamlValue).join(', ')}]`;
  }
  const s = String(v);
  if (/[\n\r]/.test(s)) return JSON.stringify(s);
  if (/^[-?:,\[\]{}#&*!|>'"%@`]/.test(s)) return JSON.stringify(s);
  return s;
}

function buildFrontMatter(meta) {
  const preferred = ['title', 'createTime', 'permalink'];
  const keys = [
    ...preferred.filter(k => meta[k] !== undefined && meta[k] !== ''),
    ...Object.keys(meta).filter(
      k => !preferred.includes(k) && meta[k] !== undefined && meta[k] !== ''
    ),
  ];
  const lines = ['---'];
  for (const k of keys) lines.push(`${k}: ${formatYamlValue(meta[k])}`);
  lines.push('---', '');
  return lines.join('\n');
}

function nowCreateTime(d = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
         `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/**
 * 合并元数据：旧文件已有的键全部保留；
 * title / createTime / permalink 缺失时补全。
 */
function mergeMeta(oldMeta, defaults) {
  const meta = { ...oldMeta };
  if (!meta.title) meta.title = defaults.title;
  if (!meta.createTime) meta.createTime = nowCreateTime();
  if (!meta.permalink) meta.permalink = defaults.permalink;
  return meta;
}

function readFileParts(filePath) {
  if (!fs.existsSync(filePath)) {
    return { meta: {}, body: '', hasFrontMatter: false };
  }
  return parseFrontMatter(fs.readFileSync(filePath, 'utf-8'));
}

// ---------- 内容提取 ----------
function extractSection(body, name) {
  const parts = body.split(/^##\s+/m);
  for (const p of parts) {
    const nl = p.indexOf('\n');
    const title = (nl === -1 ? p : p.slice(0, nl)).trim();
    if (title === name) {
      return nl === -1 ? '' : p.slice(nl + 1).trim();
    }
  }
  return '';
}

function normalizeConclusion(raw) {
  if (!raw) return '';
  let c = raw.replace(/^\s*[-*]\s*/gm, '');
  c = c.replace(/\n+/g, '；').replace(/；{2,}/g, '；');
  return c.replace(/^；|；$/g, '').trim();
}

// ---------- 进度条目 ----------
function parseResultMd(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontMatter(text);

  const dirname = path.basename(path.dirname(filePath));
  const dateMatch = dirname.match(/^(\d{4}-\d{2}-\d{2})/);
  const dateFallback = dateMatch ? dateMatch[1] : '';
  const titleFallback = dirname.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/_/g, ' ');

  let milestones = [];
  if (Array.isArray(meta.milestone)) milestones = meta.milestone;
  else if (meta.milestone) milestones = [meta.milestone];

  return {
    date: meta.date || dateFallback,
    title: meta.title || titleFallback || dirname,
    status: meta.status || '',
    icon: meta.icon || '',
    milestones,
    conclusion: normalizeConclusion(extractSection(body, '结论')),
    relpath: `entries/${dirname}/result.md`,
    dirname,
  };
}

function collectEntries() {
  if (!fs.existsSync(ENTRIES_DIR)) return [];
  const items = [];
  for (const name of fs.readdirSync(ENTRIES_DIR).sort()) {
    const file = path.join(ENTRIES_DIR, name, 'result.md');
    if (!fs.existsSync(file)) continue;
    try {
      items.push(parseResultMd(file));
    } catch (e) {
      console.warn(`[WARN] 解析失败 ${file}: ${e.message}`);
    }
  }
  items.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return items;
}

// ---------- Plume 时间线 ----------
function buildPlumeTimeline(items) {
  if (items.length === 0) {
    return '::: timeline\n- 暂无进度记录\n:::\n';
  }

  const lines = ['::: timeline card placement=between line=solid', ''];

  for (const item of items) {
    lines.push(`- ${item.date} ${item.title}`);

    const cfg = [`time=${item.date}`, `type=${resolveType(item.status)}`];
    if (item.icon) cfg.push(`icon=${item.icon}`);
    lines.push('  ' + cfg.join(' '));
    lines.push('');

    lines.push(
      item.conclusion
        ? `  **结论**：${item.conclusion}`
        : '  *（暂无结论记录）*'
    );
    if (item.milestones.length) {
      lines.push(`  **里程碑**：${item.milestones.join(' / ')}`);
    }
    lines.push(`  [查看详情 →](${item.relpath})`);
    lines.push('');
  }

  lines.push(':::');
  lines.push('');
  return lines.join('\n');
}

function buildSummary(items) {
  const total = items.length;
  const done = items.filter(i => ['完成', 'done', 'completed'].includes(i.status)).length;
  const wip = items.filter(i => ['进行中', 'in-progress', 'wip'].includes(i.status)).length;
  const last = items[items.length - 1];

  const lines = [
    '## 进度概览',
    '',
    `- 总记录数：**${total}**`,
    `- 已完成：**${done}**`,
    `- 进行中：**${wip}**`,
  ];
  if (last) lines.push(`- 最近更新：**${last.date} ${last.title}**`);
  lines.push('');
  return lines.join('\n');
}

// ---------- 里程碑 ----------
function parseMilestoneMd(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8');
  const { meta, body } = parseFrontMatter(text);
  const filename = path.basename(filePath, '.md');
  const idFromName = (filename.match(/^(M\d+)/) || [])[1];

  return {
    filePath,
    filename,
    id: meta.id || idFromName || filename,
    title: meta.title || filename,
    status: meta.status || '未开始',
    target_date: meta.target_date || '',
    completed_date: meta.completed_date || '',
    owner: meta.owner || '',
    meta,
    body,
  };
}

function collectMilestones() {
  if (!fs.existsSync(MILESTONE_FILES_DIR)) return [];
  return fs.readdirSync(MILESTONE_FILES_DIR)
    .filter(n => n.endsWith('.md'))
    .sort()
    .map(n => parseMilestoneMd(path.join(MILESTONE_FILES_DIR, n)));
}

function buildMilestoneProgressBlock(relatedItems) {
  if (relatedItems.length === 0) {
    return `${MS_PROGRESS_START}\n\n*暂无关联进度条目。*\n\n${MS_PROGRESS_END}`;
  }
  const lines = [MS_PROGRESS_START, ''];
  for (const item of relatedItems) {
    lines.push(`- **${item.date}** [${item.title}](../../02_研究进度/${item.relpath})`);
    if (item.conclusion) lines.push(`  - 结论：${item.conclusion}`);
  }
  lines.push('');
  lines.push(MS_PROGRESS_END);
  return lines.join('\n');
}

function replaceAutoBlock(body, block, startTag, endTag) {
  const s = body.indexOf(startTag);
  const e = body.indexOf(endTag);
  if (s !== -1 && e !== -1 && e > s) {
    return body.slice(0, s) + block + body.slice(e + endTag.length);
  }
  return body.replace(/\s*$/, '') + '\n\n' + block + '\n';
}

function writeMilestoneFiles(milestones, allItems) {
  if (milestones.length === 0) return;

  for (const ms of milestones) {
    const related = allItems.filter(it => it.milestones.includes(ms.id));

    // 1. 更新里程碑文件内的 MILESTONE_PROGRESS 区域
    const newBody = replaceAutoBlock(
      ms.body,
      buildMilestoneProgressBlock(related),
      MS_PROGRESS_START,
      MS_PROGRESS_END
    );

    const meta = mergeMeta(ms.meta, {
      title: ms.title,
      permalink: `/milestones/${ms.id}/`,
    });
    fs.writeFileSync(ms.filePath, buildFrontMatter(meta) + newBody, 'utf-8');
  }

  // 2. 更新 09_里程碑/README.md 的总览表
  const oldReadme = fs.existsSync(MILESTONES_README)
    ? fs.readFileSync(MILESTONES_README, 'utf-8')
    : '# 里程碑\n\n';
  const { meta: readmeMeta, body: readmeBody } = parseFrontMatter(oldReadme);

  const total = milestones.length;
  const done = milestones.filter(m => m.status === '完成').length;
  const wip = milestones.filter(m => m.status === '进行中').length;

  const summaryLines = [
    MS_SUMMARY_START,
    '',
    '## 里程碑状态汇总',
    '',
    `- 总计：**${total}**`,
    `- 已完成：**${done}**`,
    `- 进行中：**${wip}**`,
    '',
    '| ID | 里程碑 | 计划 | 实际 | 状态 | 关联进度 |',
    '| --- | --- | --- | --- | --- | --- |',
  ];

  for (const ms of milestones) {
    const related = allItems.filter(it => it.milestones.includes(ms.id));
    summaryLines.push(
      `| ${ms.id} | [${ms.title}](./milestones/${ms.filename}.md) | ` +
      `${ms.target_date} | ${ms.completed_date} | ${ms.status} | ${related.length} 条 |`
    );
  }
  summaryLines.push('', MS_SUMMARY_END);

  const newReadmeBody = replaceAutoBlock(
    readmeBody,
    summaryLines.join('\n'),
    MS_SUMMARY_START,
    MS_SUMMARY_END
  );
  const mergedMeta = mergeMeta(readmeMeta, MS_README_DEFAULTS);
  fs.writeFileSync(MILESTONES_README, buildFrontMatter(mergedMeta) + newReadmeBody, 'utf-8');
  console.log(`[OK] 已更新 ${MILESTONES_README}`);
}

// ---------- 写入进度文件 ----------
function writeWithPreservedMeta(filePath, defaults, newBody) {
  const { meta: oldMeta } = readFileParts(filePath);
  const meta = mergeMeta(oldMeta, defaults);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buildFrontMatter(meta) + newBody, 'utf-8');

  const kept = [];
  if (oldMeta.createTime) kept.push('createTime');
  if (oldMeta.permalink) kept.push('permalink');
  console.log(
    `[OK] 已写入 ${filePath}` +
    (kept.length ? `（已保留 ${kept.join('、')}）` : '')
  );
}

function writeTimelineMd(timeline) {
  writeWithPreservedMeta(
    TIMELINE_FILE,
    TIMELINE_DEFAULTS,
    '# 研究进度纵向时间线\n\n' + timeline
  );
}

function writeProgressReadme(timeline, summary) {
  const { body: oldBody } = readFileParts(PROGRESS_README);
  const block = `${TIMELINE_START}\n\n${summary}\n\n${timeline}\n${TIMELINE_END}`;
  const baseBody = oldBody && oldBody.trim() ? oldBody : '# 研究进度\n\n';
  const newBody = replaceAutoBlock(baseBody, block, TIMELINE_START, TIMELINE_END);
  writeWithPreservedMeta(PROGRESS_README, PROGRESS_README_DEFAULTS, newBody);
}

// ---------- 主流程 ----------
function main() {
  console.log('[INFO] 课题：' + path.basename(ROOT));
  console.log('[INFO] 生成研究进度时间线...');

  const items = collectEntries();
  console.log(`[INFO] 找到 ${items.length} 条进度记录`);

  const timeline = buildPlumeTimeline(items);
  const summary = buildSummary(items);
  writeTimelineMd(timeline);
  writeProgressReadme(timeline, summary);

  console.log('[INFO] 聚合里程碑...');
  const milestones = collectMilestones();
  console.log(`[INFO] 找到 ${milestones.length} 个里程碑`);
  writeMilestoneFiles(milestones, items);

  console.log('[DONE] 完成。');
}

main();