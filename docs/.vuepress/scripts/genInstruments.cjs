#!/usr/bin/env node
/**
 * 扫描 docs/.vuepress/public/instruments/ 生成 docs/设备/README.md
 * 输出：markdown 标题 + HTML 卡片
 *
 * 关键：
 *   分类标题用 markdown 的 ## 语法(外层，不被 v-pre 包裹)
 *   卡片网格用 <div class="ins-grid" v-pre> 包住(v-pre 阻止 VuePress 解析 <img src>)
 *
 * 用法：
 *   node docs/.vuepress/scripts/genInstruments.cjs
 */

const fs   = require('fs');
const path = require('path');

// ------- config -------
const IMG_ROOT = 'docs/.vuepress/public/instruments';
const MD_OUT   = 'docs/设备/README.md';
const URL_BASE = '/instruments/';
const IMG      = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const TITLE    = '仪器设备';
const DESC     = '按分析原理与技术对实验室仪器进行分类，附图片卡片展示。';
const TAGS     = ['仪器', '分类', '实验室'];
const PAGE_CLASS = 'team-page';   // 加到 front matter，用于 CSS 选择器

const CATEGORY_ORDER = [
  '分子光谱', '原子光谱', '色谱质谱', '波谱共振', '电化学', '热分析',
  '表面与形貌', '元素与同位素', '物理性能力学', '生命科学生物',
  '样品前处理', '实验室通用辅助', '未分类'
];

const DISPLAY_NAME = {
  '波谱共振':     '波谱 / 共振',
  '物理性能力学': '物理性能 / 力学',
  '生命科学生物': '生命科学 / 生物'
};
// ----------------------

/* ============================================================
   工具
   ============================================================ */

function enc(s) {
  return encodeURIComponent(s);   // 把 # 编码为 %23
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function joinUrl() {
  var parts = Array.prototype.slice.call(arguments).filter(Boolean);
  return parts.join('/').replace(/\/{2,}/g, '/');
}

/* ============================================================
   文件名解析
   ============================================================ */

function parseFilename(file) {
  var stem = path.basename(file, path.extname(file));
  var segs = stem.split('__')
                .map(function (s) { return s.trim(); })
                .filter(function (s) { return s.length > 0; });

  var order = '';
  if (segs.length >= 2 && /^\d+$/.test(segs[0])) {
    order = segs.shift();
  }

  var location = '';
  if (segs.length >= 2) {
    var last = segs[segs.length - 1];
    if (/^[A-Za-z0-9]+[#\-_.][A-Za-z0-9]+$/.test(last)) {
      location = segs.pop();
    }
  }

  var name = '';
  var model = '';
  if (segs.length >= 2) {
    name  = segs[0];
    model = segs.slice(1).join('__');
  } else if (segs.length === 1) {
    name = segs[0];
  }

  return {
    order:    order,
    name:     name,
    model:    model,
    location: location,
    sortKey:  order ? parseInt(order, 10) : null
  };
}

/* ============================================================
   排序
   ============================================================ */

function compareItems(a, b) {
  if (a.sortKey !== null && b.sortKey !== null) {
    if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;
    return a.name.localeCompare(b.name, 'zh');
  }
  if (a.sortKey !== null) return -1;
  if (b.sortKey !== null) return 1;
  return a.name.localeCompare(b.name, 'zh');
}

/* ============================================================
   扫描
   ============================================================ */

function collect() {
  var groups = {};
  var order  = [];

  if (!fs.existsSync(IMG_ROOT)) {
    console.error('[ERROR] dir not found: ' + IMG_ROOT);
    process.exit(1);
  }

  fs.readdirSync(IMG_ROOT)
    .sort(function (a, b) { return a.localeCompare(b, 'zh'); })
    .forEach(function (entry) {
      var full = path.join(IMG_ROOT, entry);
      if (!fs.statSync(full).isDirectory()) return;

      var files = fs.readdirSync(full)
        .filter(function (f) { return IMG.test(f); });

      if (!files.length) return;

      var items = files.map(function (file) {
        var parsed = parseFilename(file);
        return {
          name:     parsed.name,
          model:    parsed.model,
          location: parsed.location,
          sortKey:  parsed.sortKey,
          src:      joinUrl(URL_BASE, enc(entry), enc(file))
        };
      });

      items.sort(compareItems);
      groups[entry] = items;
      order.push(entry);
    });

  var rootFiles = fs.readdirSync(IMG_ROOT)
    .filter(function (f) { return IMG.test(f); });

  if (rootFiles.length) {
    var loose = rootFiles.map(function (file) {
      var parsed = parseFilename(file);
      return {
        name:     parsed.name,
        model:    parsed.model,
        location: parsed.location,
        sortKey:  parsed.sortKey,
        src:      joinUrl(URL_BASE, enc(file))
      };
    });
    loose.sort(compareItems);
    groups['未分类'] = loose;
    order.push('未分类');
  }

  order.sort(function (a, b) {
    var ia = CATEGORY_ORDER.indexOf(a);
    var ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1) ia = 9999;
    if (ib === -1) ib = 9999;
    if (ia !== ib) return ia - ib;
    return a.localeCompare(b, 'zh');
  });

  return { groups: groups, order: order };
}

/* ============================================================
   HTML 卡片
   ============================================================ */

function cardHTML(it) {
  var modelLine = it.model
    ? '    <p class="ins-card__model">' + esc(it.model) + '</p>\n'
    : '';
  var locationLine = it.location
    ? '    <p class="ins-card__location">' + esc(it.location) + '</p>\n'
    : '';

  return '  <article class="ins-card">\n' +
         '    <div class="ins-card__media">\n' +
         '      <img src="' + esc(it.src) + '" alt="' + esc(it.name) + '" loading="lazy" decoding="async">\n' +
         '    </div>\n' +
         '    <div class="ins-card__body">\n' +
         '      <p class="ins-card__name">' + esc(it.name) + '</p>\n' +
                  modelLine +
                  locationLine +
         '    </div>\n' +
         '  </article>';
}

/**
 * 一个分类区块：
 *   - 标题用 markdown 的 ## 语法，放在最外层
 *   - 卡片网格用 v-pre 的 div 包住
 */
function sectionMarkdown(dirName, list) {
  var display = DISPLAY_NAME[dirName] || dirName;

  return '## ' + display + '\n\n' +
         '<div class="ins-grid" v-pre>\n' +
              list.map(cardHTML).join('\n') + '\n' +
         '</div>';
}

/* ============================================================
   build
   ============================================================ */

function build() {
  var r = collect();
  var groups = r.groups;
  var order  = r.order;

  var frontMatter =
    '---\n' +
    'title: ' + TITLE + '\n' +
    'description: ' + DESC + '\n' +
    'pageClass: ' + PAGE_CLASS + '\n' +
    `comment: false`  + '\n' +
    'tags:\n' +
    TAGS.map(function (t) { return '  - ' + t; }).join('\n') + '\n' +
    '---';

  if (!order.length) {
    return [frontMatter, '', '## ' + TITLE, '', '暂无仪器图片。', ''].join('\n');
  }

  // 每个分类：## 标题 + v-pre 网格
  var body = order.map(function (cat) {
    return sectionMarkdown(cat, groups[cat]);
  }).join('\n\n');

  var tail =
    '## 分类速查\n\n' +
    '| 大类 | 分析原理 | 代表仪器 |\n' +
    '|---|---|---|\n' +
    '| 分子光谱 | 分子对光的吸收 / 发射 / 散射 | 紫外可见、红外、拉曼、荧光 |\n' +
    '| 原子光谱 | 原子外层电子跃迁 | 原子吸收 AAS、原子荧光 AFS、ICP-OES |\n' +
    '| 色谱质谱 | 组分在固定相与流动相间分配差异 | GC、HPLC、IC、GPC、CE、GC-MS、LC-MS |\n' +
    '| 波谱共振 | 原子核 / 电子自旋共振 | NMR、EPR/ESR |\n' +
    '| 电化学 | 电极电位 / 电流响应 | pH 计、电导率仪、电位滴定、伏安 |\n' +
    '| 热分析 | 温度变化下的质量 / 热量 / 形变 | TGA、DSC、DTA、TMA、DMA |\n' +
    '| 表面与形貌 | 电子 / 光子与表面相互作用 | SEM、TEM、AFM、XPS、BET |\n' +
    '| 元素与同位素 | 元素含量 / 同位素比值 | 元素分析仪、ICP-OES/MS、AAS、XRF |\n' +
    '| 物理性能力学 | 物理量 / 力学量直接测量 | 万能试验机、硬度计、粘度计、粒度仪 |\n' +
    '| 生命科学生物 | 生物分子识别与扩增 | PCR、流式、酶标仪、测序仪 |\n' +
    '| 样品前处理 | 消解 / 萃取 / 浓缩 / 研磨 | 微波消解、固相萃取、旋转蒸发、冻干机 |\n' +
    '| 实验室通用辅助 | 实验室基础保障 | 天平、烘箱、马弗炉、纯水机、安全柜 |\n';

  return [frontMatter, '', body, '', tail, ''].join('\n');
}

fs.mkdirSync(path.dirname(MD_OUT), { recursive: true });
fs.writeFileSync(MD_OUT, build(), 'utf8');
console.log('[OK] generated -> ' + MD_OUT);