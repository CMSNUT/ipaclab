#!/usr/bin/env node
/**
 * convertTable.cjs
 * 将 xlsx / xls / csv / tsv / txt 转换为 Markdown 表格
 *
 * 路径规则：
 *   1. 绝对路径：直接使用
 *   2. 相对路径：优先按「执行命令时所在目录」(INIT_CWD) 解析
 *   3. 仍找不到：回退到「项目根目录」(process.cwd()) 解析
 *
 * 用法:
 *   node convertTable.cjs Table_S1.xlsx              # 就在当前目录
 *   node convertTable.cjs ./data/report.xlsx         # 当前目录下的子路径
 *   node convertTable.cjs docs/tables                # 目录批量
 *   node convertTable.cjs a.xlsx b.csv --out=docs/gen
 *
 * 示例：
 * 
 *   dir /ad  查看文件夹
 *   dir 查看当前目录的文件和文件夹 === dir /a
 *   cd 20260916.芪附汤抗慢性心衰网药分析
 *   dir /s /ad /b 递归查看文件夹详细路径
 *   dir /s /a /b 递归查看文件详细路径
 * 
 *   tree /a 树形结构
 * 
 *   node ./docs/.vuepress/scripts/convertTable.cjs data/report.xlsx
 *   node ./docs/.vuepress/scripts/convertTable.cjs data/students.csv docs/students.md
 *  
 *   npm run convert:table report.xlsx
 *   npm run convert:table students.csv docs/students.md
 */

// npm install xlsx

/**
 * convertTable.cjs
 * 批量将 xlsx / xls / csv / tsv / txt 转为 Markdown 表格
 *
 * 路径规则：
 *   1. 绝对路径：直接使用
 *   2. 相对路径：优先按「执行命令时所在目录」(INIT_CWD) 解析
 *   3. 仍找不到：回退到「项目根目录」(process.cwd()) 解析
 *
 * 用法:
 *   node convertTable.cjs Table_S1.xlsx              # 就在当前目录
 *   node convertTable.cjs ./data/report.xlsx         # 当前目录下的子路径
 *   node convertTable.cjs docs/tables                # 目录批量
 *   node convertTable.cjs a.xlsx b.csv --out=docs/gen
 *   node convertTable.cjs Table_S1.xlsx -            # 输出到 stdout
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const INVOCATION_DIR = process.env.INIT_CWD || process.cwd();

const SUPPORTED_EXTS = ['.xlsx', '.xls', '.csv', '.tsv', '.txt'];
const IGNORE_DIRS = new Set([
  'node_modules', '.git', 'dist', '.cache', '.temp', '.vuepress',
]);

// ---------- 参数解析 ----------
const argv = process.argv.slice(2);
const opts = { outDir: null, toStdout: false, inputs: [] };
for (const a of argv) {
  if (a.startsWith('--out=')) opts.outDir = a.slice('--out='.length);
  else if (a === '-') opts.toStdout = true;
  else if (!a.startsWith('--')) opts.inputs.push(a);
}
if (opts.inputs.length === 0) {
  console.error('用法: node convertTable.cjs <文件或目录> [...] [--out=目录]');
  process.exit(1);
}

// ---------- 解析输入路径 ----------
function resolveInput(input) {
  if (path.isAbsolute(input)) return input;
  const fromInvocation = path.resolve(INVOCATION_DIR, input);
  if (fs.existsSync(fromInvocation)) return fromInvocation;
  const fromCwd = path.resolve(process.cwd(), input);
  if (fs.existsSync(fromCwd)) return fromCwd;
  return fromInvocation;
}

function resolveOutDir(dir) {
  if (path.isAbsolute(dir)) return dir;
  return path.resolve(INVOCATION_DIR, dir);
}

// ---------- 读取文件 ----------
function decodeBuffer(buffer) {
  let text = buffer.toString('utf8');
  if (/\uFFFD/.test(text)) {
    try {
      const iconv = require('iconv-lite');
      text = iconv.decode(buffer, 'gbk');
    } catch { /* 未安装 iconv-lite 时忽略 */ }
  }
  return text;
}

function detectFS(text) {
  const line = (text.split(/\r?\n/)[0] || '');
  let best, max = 0;
  for (const fs of ['\t', ',', ';', '|']) {
    const n = line.split(fs).length - 1;
    if (n > max) { max = n; best = fs; }
  }
  return max > 0 ? best : undefined;
}

function readWorkbook(filePath) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.xlsx' || ext === '.xls') {
    return XLSX.read(buffer, { type: 'buffer' });
  }
  const text = decodeBuffer(buffer);
  const FS = ext === '.csv' ? ',' : ext === '.tsv' ? '\t' : detectFS(text);
  return XLSX.read(text, { type: 'string', FS });
}

// ---------- 单元格转义 ----------
// 目标：把可能被 linkify 或 markdown 链接语法识别的字符
// 替换为 HTML 数字实体。渲染后显示原字符，但不会变成超链接。
function escapeCell(v) {
  let s = String(v ?? '');

  // 1. 转义表格分隔符和换行
  s = s.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>');

  // 2. 转义 @ 和方括号，防止 linkify / markdown 链接语法误判
  s = s
    .replace(/@/g, '&#64;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;');

  return s;
}

// ---------- 二维数组 → Markdown ----------
function toMarkdownTable(data) {
  if (!data || data.length === 0) return '> 空表格\n';

  const header = data[0];
  const colCount = header.length;
  const normalize = (row) => {
    const r = row.slice(0, colCount);
    while (r.length < colCount) r.push('');
    return r;
  };

  let md = '';
  md += '| ' + header.map(escapeCell).join(' | ') + ' |\n';
  md += '| ' + header.map(() => '---').join(' | ') + ' |\n';
  for (let i = 1; i < data.length; i++) {
    md += '| ' + normalize(data[i]).map(escapeCell).join(' | ') + ' |\n';
  }
  return md;
}

// ---------- 转换单个文件 ----------
function convertFile(filePath) {
  const workbook = readWorkbook(filePath);
  const sheetNames = workbook.SheetNames;
  let md = '';
  for (const name of sheetNames) {
    const ws = workbook.Sheets[name];
    const data = XLSX.utils.sheet_to_json(ws, {
      header: 1, defval: '', raw: false,
    });
    if (sheetNames.length > 1) md += `## ${name}\n\n`;
    md += toMarkdownTable(data) + '\n';
  }
  return md;
}

// ---------- 递归收集文件 ----------
function collectFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      out.push(...collectFiles(full));
    } else if (SUPPORTED_EXTS.includes(path.extname(entry.name).toLowerCase())) {
      out.push(full);
    }
  }
  return out;
}

// ---------- 主流程 ----------
(function main() {
  const files = [];
  for (const input of opts.inputs) {
    const p = resolveInput(input);
    if (!fs.existsSync(p)) {
      console.warn(`⚠️  跳过（不存在）: ${input}  (解析为 ${p})`);
      continue;
    }
    if (fs.statSync(p).isDirectory()) files.push(...collectFiles(p));
    else files.push(p);
  }

  if (files.length === 0) {
    console.log('没有找到可转换的表格文件');
    return;
  }

  const outDirAbs = opts.outDir ? resolveOutDir(opts.outDir) : null;

  let ok = 0, fail = 0;
  for (const file of files) {
    try {
      const md = convertFile(file);

      if (opts.toStdout) {
        process.stdout.write(md);
        ok++;
        continue;
      }

      let outPath;
      if (outDirAbs) {
        const rel = path.relative(process.cwd(), file).replace(/^(\.\.[\/\\])+/, '');
        outPath = path.join(outDirAbs, rel).replace(/\.[^.]+$/, '.md');
      } else {
        outPath = file.replace(/\.[^.]+$/, '.md');
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, md, 'utf8');
      console.log(`✅ ${file} → ${outPath}`);
      ok++;
    } catch (err) {
      console.error(`❌ ${file}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n完成: 成功 ${ok}, 失败 ${fail}`);
})();