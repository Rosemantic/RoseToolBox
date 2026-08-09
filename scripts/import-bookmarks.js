#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const bookmarkFile = process.argv[2];
if (!bookmarkFile) {
  console.error('用法：node scripts/import-bookmarks.js "C:\\path\\to\\bookmarks.html"');
  process.exit(1);
}

const DATA_FILE = path.resolve(__dirname, "..", "src", "data", "sites.json");
const IMPORT_DATE = new Date().toISOString().slice(0, 10);
const EXCLUDED_HOSTS = new Set([
  "codexcn.com",
  "plusgpt.vip",
  "mh.yichengwlkj.com",
]);

const NEW_SITE_METADATA = {
  "miai.pro": {
    name: "米你AI",
    description: "聚合 AI 绘画模型与创作资源的设计平台",
    tags: ["AI 绘画", "模型资源"],
    aliases: ["Miai"],
    pricing: "freemium",
  },
  "gamma.app": {
    name: "Gamma",
    description: "使用 AI 快速生成演示文稿、文档和网页",
    tags: ["AI 演示", "幻灯片"],
    aliases: ["Gamma AI", "Gammas"],
    pricing: "freemium",
  },
  "lovart.ai": {
    name: "Lovart",
    description: "面向品牌与视觉创作的 AI 设计智能体",
    tags: ["AI 设计", "品牌设计"],
    aliases: ["洛瓦特"],
    pricing: "freemium",
  },
  "jianzhuxuezhang.com": {
    name: "建筑学长",
    description: "面向建筑师的 AI 建筑设计与创作平台",
    tags: ["建筑设计", "AI 建筑"],
    aliases: [],
    pricing: "freemium",
  },
  "meshy.ai": {
    name: "Meshy",
    description: "通过文字或图片生成 3D 模型与贴图",
    tags: ["AI 3D", "3D 模型"],
    aliases: ["Meshy AI"],
    pricing: "freemium",
  },
  "motionsites.ai": {
    name: "MotionSites",
    description: "精选动态网站案例与 AI 网站设计提示词",
    tags: ["动态网站", "提示词"],
    aliases: ["Motion Sites"],
    pricing: "free",
  },
  "loading-ui.com": {
    name: "Loading UI",
    description: "可直接使用的加载动画、旋转指示器与 CSS 代码",
    tags: ["加载动画", "CSS"],
    aliases: ["Loading UI Components"],
    pricing: "free",
  },
  "21st.dev": {
    name: "21st.dev",
    description: "面向现代前端与 AI 应用的组件和开发工具目录",
    tags: ["UI 组件", "AI 开发"],
    aliases: ["21st"],
    pricing: "free",
  },
  "originkit.dev": {
    name: "OriginKit",
    description: "适用于现代网站的免费动画组件库",
    tags: ["动画组件", "前端组件"],
    aliases: ["Origin Kit"],
    pricing: "free",
  },
  "string-tune.fiddle.digital": {
    name: "StringTune",
    description: "可视化调节并生成创意弦线动画的在线工具",
    tags: ["交互动画", "创意开发"],
    aliases: ["String Tune"],
    pricing: "free",
  },
  "stitch.withgoogle.com": {
    name: "Stitch",
    description: "Google 推出的 AI 界面设计与前端原型工具",
    tags: ["AI UI", "原型设计"],
    aliases: ["Google Stitch"],
    pricing: "free",
  },
  "588ku.com": {
    name: "千库网",
    description: "提供 PNG、背景、模板与办公设计素材",
    tags: ["设计模板", "PNG 素材"],
    aliases: ["588ku"],
    pricing: "freemium",
  },
  "huaban.com": {
    name: "花瓣网",
    description: "发现并收藏设计、插画、摄影与视觉创意灵感",
    tags: ["设计灵感", "视觉采集"],
    aliases: ["Huaban"],
    pricing: "freemium",
  },
  "chaopx.com": {
    name: "潮国创意",
    description: "原创 3D、电商、海报与可商用设计素材库",
    tags: ["3D 素材", "商用素材"],
    aliases: ["潮国"],
    pricing: "freemium",
  },
  "dameigong.cn": {
    name: "大美工",
    description: "面向电商与平面设计的优选素材和模板平台",
    tags: ["电商设计", "设计模板"],
    aliases: ["Dameigong"],
    pricing: "freemium",
  },
  "aishort.top": {
    name: "AiShort",
    description: "分类整理的 AI 提示词模板与生产力指令库",
    tags: ["提示词", "AI 效率"],
    aliases: ["AI Short", "Prompt 提示词"],
    pricing: "free",
  },
  "qiukuai.top": {
    name: "秋裤工具箱",
    description: "面向 CorelDRAW 用户的 AI 智能设计插件工具箱",
    tags: ["CorelDRAW", "设计插件"],
    aliases: ["秋裤 AI"],
    pricing: "freemium",
  },
  "love.mmy234.com": {
    name: "猫猫云",
    description: "提供多线路选择的网络连接服务",
    tags: ["网络工具", "跨平台"],
    aliases: ["Maomao Cloud"],
    pricing: "paid",
  },
  "packyapi.com": {
    name: "PackyAPI",
    description: "为开发和自动化场景提供统一的模型 API 服务",
    tags: ["API", "AI 开发"],
    aliases: ["Packy API"],
    pricing: "paid",
  },
  "minimal.gallery": {
    name: "极简画廊",
    description: "精选极简网站、设计工具与优秀域名案例",
    tags: ["极简设计", "网页灵感"],
    aliases: ["Minimal Gallery"],
    pricing: "free",
  },
  "logosystem.co": {
    name: "Logo System",
    description: "按行业与风格浏览千余个品牌标志设计案例",
    tags: ["Logo 灵感", "品牌设计"],
    aliases: ["LogoSystem"],
    pricing: "free",
  },
  "tympanus.net": {
    name: "Webzibition",
    description: "Codrops 策划的实验性网页设计与创意交互展览",
    tags: ["创意网页", "Codrops"],
    aliases: ["Codrops Webzibition"],
    pricing: "free",
  },
  "godly.website": {
    name: "Godly",
    description: "收录高质量网站和数字产品的网页设计灵感库",
    tags: ["网页灵感", "数字设计"],
    aliases: ["Godly Website"],
    pricing: "free",
  },
  "siteofsites.co": {
    name: "Site of Sites",
    description: "聚合全球优秀网站案例的设计灵感画廊",
    tags: ["网页灵感", "网站画廊"],
    aliases: ["SOS"],
    pricing: "free",
  },
  "recent.design": {
    name: "Recent Design",
    description: "持续更新的产品、网页与视觉设计灵感集合",
    tags: ["最新设计", "产品灵感"],
    aliases: ["最新设计灵感"],
    pricing: "free",
  },
};

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function stripCategoryEmoji(value) {
  return value.replace(/^[^\p{L}\p{N}]+/u, "").trim();
}

function parseBookmarks(html) {
  const stack = [];
  const bookmarks = [];
  let pendingFolder = null;
  for (const line of html.split(/\r?\n/)) {
    const heading = line.match(/<DT><H3[^>]*>(.*?)<\/H3>/i);
    if (heading) {
      pendingFolder = decodeHtml(heading[1]);
      continue;
    }
    if (/<DL><p>/i.test(line)) {
      if (pendingFolder) stack.push(pendingFolder);
      pendingFolder = null;
      continue;
    }
    if (/<\/DL><p>/i.test(line)) {
      stack.pop();
      continue;
    }
    const anchor = line.match(/<DT><A[^>]*HREF="([^"]+)"[^>]*>(.*?)<\/A>/i);
    if (anchor) {
      bookmarks.push({
        url: decodeHtml(anchor[1]),
        title: decodeHtml(anchor[2]),
        folders: stack.slice(1),
      });
    }
  }
  return bookmarks;
}

function hostOf(value) {
  return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
}

function canonicalUrl(value) {
  const url = new URL(value);
  return `${hostOf(value)}${url.pathname.replace(/\/$/, "")}`;
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function nextUniqueSlug(base, used) {
  let slug = slugify(base) || "resource";
  const root = slug;
  let suffix = 2;
  while (used.has(slug)) slug = `${root}-${suffix++}`;
  used.add(slug);
  return slug;
}

const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
const bookmarks = parseBookmarks(fs.readFileSync(path.resolve(bookmarkFile), "utf8"));
const categoryMap = new Map(data.categories.map((category) => [category.name, new Set(category.subcategories)]));
const byCanonical = new Map(data.sites.map((site) => [canonicalUrl(site.url), site]));
const byHost = new Map();
data.sites.forEach((site) => {
  const host = hostOf(site.url);
  byHost.set(host, [...(byHost.get(host) || []), site]);
});
const usedSlugs = new Set(data.sites.map((site) => site.slug));
let nextId = Math.max(...data.sites.map((site) => Number(site.id.replace(/\D/g, "")) || 0)) + 1;
const added = [];
const updated = new Set();
const skipped = [];

// 58pic 是千图网，修正旧数据中容易混淆的名称。
const legacy58Pic = data.sites.find((site) => hostOf(site.url) === "58pic.com");
if (legacy58Pic && legacy58Pic.name === "千库网") {
  legacy58Pic.name = "千图网";
  legacy58Pic.aliases = [...new Set([...(legacy58Pic.aliases || []), "58pic"] )];
  legacy58Pic.description = "提供设计模板、图片、插画与创意素材的综合平台";
}

for (const bookmark of bookmarks) {
  if (bookmark.folders.length < 2 || bookmark.folders[0] === "临时网页") {
    skipped.push({ ...bookmark, reason: "临时或未分类书签" });
    continue;
  }
  const category = stripCategoryEmoji(bookmark.folders[0]);
  const subcategory = bookmark.folders[1].trim();
  if (!categoryMap.has(category) || !categoryMap.get(category).has(subcategory)) {
    skipped.push({ ...bookmark, reason: "未知分类" });
    continue;
  }

  const host = hostOf(bookmark.url);
  if (EXCLUDED_HOSTS.has(host)) {
    skipped.push({ ...bookmark, reason: "不适合作为公开导航资源" });
    continue;
  }

  let site = byCanonical.get(canonicalUrl(bookmark.url));
  if (!site && (byHost.get(host) || []).length === 1) site = byHost.get(host)[0];
  if (site) {
    site.category = category;
    site.subcategory = subcategory;
    site.tags = [...new Set([...(site.tags || []), category, subcategory])];
    updated.add(site.id);
    continue;
  }

  const metadata = NEW_SITE_METADATA[host];
  if (!metadata) {
    skipped.push({ ...bookmark, reason: "缺少公开展示元数据" });
    continue;
  }
  const siteId = `site-${String(nextId++).padStart(3, "0")}`;
  site = {
    name: metadata.name,
    url: bookmark.url,
    category,
    subcategory,
    description: metadata.description,
    id: siteId,
    slug: nextUniqueSlug(metadata.name || host, usedSlugs),
    tags: [...new Set([category, subcategory, ...metadata.tags])],
    aliases: [...new Set(metadata.aliases || [])],
    pricing: metadata.pricing,
    platforms: ["web"],
    featured: false,
    updatedAt: IMPORT_DATE,
  };
  data.sites.push(site);
  byCanonical.set(canonicalUrl(site.url), site);
  byHost.set(host, [...(byHost.get(host) || []), site]);
  added.push(site);
}

data.meta.updatedAt = IMPORT_DATE;
data.meta.version = 3;
fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log(`书签解析：${bookmarks.length} 个`);
console.log(`已有资源标签更新：${updated.size} 个`);
console.log(`新增公开资源：${added.length} 个`);
added.forEach((site) => console.log(`+ ${site.name} · ${site.category} / ${site.subcategory}`));
console.log(`未导入：${skipped.length} 个`);
