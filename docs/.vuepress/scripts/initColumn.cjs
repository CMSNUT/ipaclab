/**
 * 初始化模块/项目结构（CJS）
 *
 * 文件名：./docs/.vuepress/scripts/initColumn.cjs
 *
 * 用法：
 *   npm run init:column -- <栏目> <名称> [--force] [--empty]
 *   node ./docs/.vuepress/scripts/initColumn.cjs <栏目> <名称> [--force] [--empty]
 *   node ./docs/.vuepress/scripts/initColumn.cjs --list
 *
 * 例：
 *   npm run init:column -- 课题 芪附汤抗慢性心衰网药分析
 *     → docs/课题/20260916.芪附汤抗慢性心衰网药分析/
 *   npm run init:column -- 教程 Plume入门
 *     → docs/教程/20260916220123.Plume入门.md
 *   npm run init:column -- 更多 2026年度汇总
 *     → docs/更多/2026年度汇总/
 *
 * 说明：
 *   - 课题：目录名自动加 YYYYMMDD. 前缀；生成骨架与基础文件
 *   - 教程：单个文件，文件名自动加 YYYYMMDDHHmmss. 前缀
 *   - 工具 / 更多：目录结构，中文文件名
 *   - --empty 只建目录骨架，不生成文件（教程无意义）
 *   - --force 覆盖已存在文件（默认不覆盖），也可写 -f
 *   - 由于 npm 会吞掉 --force，脚本同时读取 npm_config_force
 *   - README 由 gen:readme 生成，本脚本不处理
 */

const fs = require('fs')
const path = require('path')

const {
  DOCS_ROOT,
  today,
  isoWeek,
  timestampDate,
  timestampFull,
  fmtWeekDisplay,
  generateFile,
} = require('./addFile.cjs')

// ---------- 计划 ----------

function planProject() {
  const t = today()
  const w = fmtWeekDisplay(isoWeek())
  return {
    dirs: ['03.实验记录', '08.会议记录', '09.日志周报', '10.决策记录'],
    files: [
      '01.研究背景.md',
      '02.实验设计.md',
      '04.统计分析.md',
      '05.结果.md',
      '06.讨论.md',
      '07.参考文献.md',
      '03.实验记录/实验001.md',
      `08.会议记录/${timestampDate()}.启动会.md`,
      `09.日志周报/${w}.md`,
      '10.决策记录/决策001.md',
    ],
  }
}

function planTool() {
  return {
    dirs: [],
    files: [
      '01.简介.md',
      '02.安装.md',
      '03.使用.md',
      '04.常见问题.md',
    ],
  }
}

function planMore() {
  return {
    dirs: [],
    files: ['01.正文.md'],
  }
}

const PLANS = {
  课题: planProject,
  工具: planTool,
  更多: planMore,
  // 教程单文件，单独处理
}

// ---------- 日志 ----------
function logCreated(rel) { console.log(`✅ 已生成: docs/${rel}`) }
function logSkipped(rel) { console.log(`⏭️  已存在，未覆盖: docs/${rel}`) }
function logDirCreated(rel) { console.log(`📁 已创建: docs/${rel}`) }
function logDirSkipped(rel) { console.log(`⏭️  已存在: docs/${rel}`) }

// ---------- 初始化：教程（单文件） ----------
function initCourse(name, opts) {
  // 传入不带时间戳的名字，add.cjs 会自动补 YYYYMMDDHHmmss.
  const rel = `教程/${name}.md`
  try {
    const r = generateFile(rel, { force: opts.force, title: name })
    if (r.skipped) logSkipped(r.path)
    else logCreated(r.path)
  } catch (e) {
    console.error(`❌ ${e.message}`)
    process.exit(1)
  }
}

// ---------- 初始化：目录型 ----------
function initDirModule(column, dirName, opts) {
  const rootRel = `${column}/${dirName}`
  const rootAbs = path.join(DOCS_ROOT, rootRel)

  if (fs.existsSync(rootAbs)) {
    logDirSkipped(rootRel)
  } else {
    fs.mkdirSync(rootAbs, { recursive: true })
    logDirCreated(rootRel)
  }

  const plan = PLANS[column]()

  // 1. 建目录骨架
  for (const d of plan.dirs) {
    const abs = path.join(rootAbs, d)
    const rel = `${rootRel}/${d}`
    if (!fs.existsSync(abs)) {
      fs.mkdirSync(abs, { recursive: true })
      logDirCreated(rel)
    } else {
      logDirSkipped(rel)
    }
  }

  // 2. 生成基础文件
  if (opts.empty) {
    console.log('\n--empty 模式：跳过文件生成。')
    return
  }

  console.log('')
  let created = 0
  let skipped = 0
  for (const f of plan.files) {
    const rel = `${rootRel}/${f}`
    try {
      const r = generateFile(rel, { force: opts.force })
      if (r.skipped) {
        skipped++
        logSkipped(r.path)
      } else {
        created++
        console.log(`✅ 已生成: docs/${r.path}  [${r.key}]`)
      }
    } catch (e) {
      console.error(`❌ ${rel}: ${e.message}`)
    }
  }
  console.log(`\n📊 生成 ${created} 个，跳过 ${skipped} 个。`)
}

// ---------- CLI ----------
function parseArgs() {
  const raw = process.argv.slice(2)
  const flags = new Set(['--force', '-f'])
  const force =
    raw.some(a => flags.has(a)) ||
    process.env.npm_config_force === 'true' ||
    process.env.npm_config_force === '1'
  const empty = raw.includes('--empty')
  const argv = raw.filter(a => !flags.has(a) && a !== '--empty')
  return { argv, force, empty }
}

function printHelp() {
  console.log('用法：')
  console.log('  npm run init:column -- <栏目> <名称> [--force] [--empty]')
  console.log('  node docs/.vuepress/scripts/initColumn.cjs <栏目> <名称> [--force] [--empty]')
  console.log('\n注意：用 npm run 时，参数前要加 `--`，否则 --force 会被 npm 吃掉：')
  console.log('  ✅ npm run init:column -- 课题 芪附汤抗慢性心衰网药分析')
  console.log('  ✅ npm run init:column -- 课题 芪附汤抗慢性心衰网药分析 --force')
  console.log('  ✅ npm run init:column -- 课题 芪附汤抗慢性心衰网药分析 -f')
  console.log('  ❌ npm run init:column 课题 芪附汤抗慢性心衰网药分析 --force')
  console.log('\n栏目：课题、教程、更多')
  console.log('\n示例：')
  console.log('  npm run init:column -- 课题 芪附汤抗慢性心衰网药分析')
  console.log('    → docs/课题/20260916.芪附汤抗慢性心衰网药分析/')
  console.log('  npm run init:column -- 教程 Plume入门')
  console.log('    → docs/教程/20260916220123.Plume入门.md')
  console.log('  npm run init:column -- 更多 2026年度汇总')
  console.log('    → docs/更多/2026年度汇总/')
  console.log('\n选项：')
  console.log('  --empty   只建目录骨架，不生成文件（教程无意义）')
  console.log('  --force   覆盖已存在文件（或 -f）')
}

function main() {
  const { argv, force, empty } = parseArgs()

  if (!argv.length || argv[0] === '--list' || argv[0] === '-l' || argv[0] === '--help' || argv[0] === '-h') {
    printHelp()
    process.exit(0)
  }

  const column = argv[0]
  const name = argv[1]

  if (!name) {
    console.error('❌ 缺少名称')
    console.log('用法：npm run init:column -- <栏目> <名称> [--force] [--empty]')
    process.exit(1)
  }

  const VALID = new Set(['课题', '教程', '工具', '更多'])
  if (!VALID.has(column)) {
    console.error(`❌ 未知栏目: ${column}`)
    console.log('可用栏目：' + [...VALID].join('、'))
    process.exit(1)
  }

  if (column === '教程') {
    initCourse(name, { force })
  } else {
    // 课题目录名加日期前缀；工具/更多保持原名
    const dirName = column === '课题'
      ? `${timestampDate()}.${name}`
      : name
    initDirModule(column, dirName, { force, empty })
  }

  console.log('\n✨ 完成！下一步：')
  console.log('   npm run gen:readme')
}

main()