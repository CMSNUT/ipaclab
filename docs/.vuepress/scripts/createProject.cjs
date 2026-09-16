#!/usr/bin/env node
'use strict';

/**
 * 在 docs/课题/ 下创建新课题，自动生成目录结构和文件。
 * 课题目录命名：`YYYYMMDD.课题名`(如 20260916.芪附汤抗慢性心衰网药分析)
 *
 * 用法：
 *   npm run new -- <课题名称> [--force]
 *   node ./docs/.vuepress/scripts/createProject.cjs <课题名称>
 *
 * 位置约定：
 *   __dirname = <repo>/docs/.vuepress/scripts
 *   工作根    = <repo>/docs
 *   模板目录  = <repo>/docs/templates/project
 *   课题目录  = <repo>/docs/课题/<YYYYMMDD.课题名>
 */

const fs = require('fs');
const path = require('path');

// ---------- 路径 ----------
const DOCS_ROOT = path.resolve(__dirname, '..', '..');          // docs/
const TEMPLATE_DIR = path.join(DOCS_ROOT, 'templates', 'project');
const PROJECTS_DIR = path.join(DOCS_ROOT, '课题');

// 名称校验：中文、字母、数字、下划线、短横线、点号
const NAME_PATTERN = /^[\w\u4e00-\u9fa5.-]+$/;

// ---------- 参数解析 ----------
function parseArgs(argv) {
  const args = argv.filter(a => a !== '--');
  const positional = args.filter(a => !a.startsWith('-'));
  const flags = new Set(args.filter(a => a.startsWith('--')));
  return {
    name: positional[0],
    force: flags.has('--force'),
  };
}

// ---------- 时间工具 ----------
const pad = n => String(n).padStart(2, '0');

function nowDate(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function nowDateTime(d = new Date()) {
  return `${nowDate(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** 目录名前缀用：YYYYMMDD */
function nowDateCompact(d = new Date()) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

/**
 * 去掉用户输入里可能已有的日期前缀(YYYYMMDD. 或 YYYY-MM-DD.)
 * 避免出现 20260916.20260916.xxx
 */
function stripDatePrefix(name) {
  return name.replace(/^\d{8}[.\-_]/, '').replace(/^\d{4}-\d{2}-\d{2}[.\-_]/, '');
}

// ---------- 模板变量替换 ----------
function replaceVars(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : match
  );
}

// ---------- 递归复制 ----------
function copyDir(srcDir, destDir, vars) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, vars);
    } else {
      const raw = fs.readFileSync(srcPath, 'utf-8');
      fs.writeFileSync(destPath, replaceVars(raw, vars), 'utf-8');
    }
  }
}

// ---------- 校验 ----------
function validate(rawName) {
  if (!rawName) {
    console.error('用法: npm run new -- <课题名称> [--force]');
    console.error('示例: npm run new -- 芪附汤抗慢性心衰网药分析');
    console.error('      → 生成 docs/课题/20260916.芪附汤抗慢性心衰网药分析');
    process.exit(1);
  }

  const baseName = stripDatePrefix(rawName);

  if (!baseName) {
    console.error(`[ERROR] 课题名称不能为空`);
    process.exit(1);
  }

  if (!NAME_PATTERN.test(baseName)) {
    console.error(`[ERROR] 课题名称只能包含中文、字母、数字、下划线、短横线、点号：${baseName}`);
    process.exit(1);
  }

  if (!fs.existsSync(TEMPLATE_DIR)) {
    console.error(`[ERROR] 模板目录不存在：${TEMPLATE_DIR}`);
    console.error('        请先运行: npm run init:templates');
    process.exit(1);
  }

  return baseName;
}

// ---------- 主流程 ----------
function main() {
  const { name: rawName, force } = parseArgs(process.argv.slice(2));
  const baseName = validate(rawName);

  const now = new Date();
  const dirName = `${nowDateCompact(now)}.${baseName}`;
  const destDir = path.join(PROJECTS_DIR, dirName);

  if (fs.existsSync(destDir) && !force) {
    console.error(`[ERROR] 课题目录已存在：${destDir}`);
    console.error('        如需覆盖请加 --force');
    process.exit(1);
  }

  if (fs.existsSync(destDir) && force) {
    console.warn(`[WARN] 已存在，将覆盖：${destDir}`);
    fs.rmSync(destDir, { recursive: true, force: true });
  }

  fs.mkdirSync(PROJECTS_DIR, { recursive: true });

  const vars = {
    PROJECT_NAME: dirName,          // 用带日期前缀的完整目录名
    DATE: nowDate(now),
    DATETIME: nowDateTime(now),
    YEAR: String(now.getFullYear()),
  };

  copyDir(TEMPLATE_DIR, destDir, vars);

  const relPath = `docs/课题/${dirName}`;
  console.log(`[OK] 已创建课题：${relPath}`);
  console.log('');
  console.log('下一步：');
  console.log(`  1. 写进度条目：在 ${relPath}/02_研究进度/entries/ 下新建 YYYY-MM-DD_标题/result.md`);
  console.log(`  2. 生成时间线: node ${relPath}/scripts/build_timeline.cjs`);
  console.log('     或在仓库根批量构建: npm run build');
}

main();