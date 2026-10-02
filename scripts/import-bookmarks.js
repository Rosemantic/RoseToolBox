#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { canonicalUrl, normalizeText } = require("../src/discovery.js");

const DATA_FILE = path.resolve(__dirname, "..", "src", "data", "sites.json");
const EXCLUDED_HOSTS = new Set(["codexcn.com", "plusgpt.vip", "mh.yichengwlkj.com"]);

const NEW_SITE_METADATA = {
  "miai.pro": {
    name: "米你AI",
    description: "聚合 AI 绘画模型与创作资源的设计平台",
    tags: ["AI", "文生图", "模型资源"],
    aliases: ["Miai"],
    pricing: "freemium",
    paths: ["/list"],
  },
  "gamma.app": {
    name: "Gamma",
    description: "使用 AI 快速生成演示文稿、文档和网页",
    tags: ["AI", "演示文稿", "文档"],
    aliases: ["Gamma AI"],
    pricing: "freemium",
    paths: ["/"],
  },
  "lovart.ai": {
    name: "Lovart",
    description: "面向品牌与视觉创作的 AI 设计智能体",
    tags: ["AI", "视觉创作", "品牌设计"],
    aliases: ["洛瓦特"],
    pricing: "freemium",
    paths: ["/zh/home"],
  },
  "jianzhuxuezhang.com": {
    name: "建筑学长",
    description: "面向建筑师的 AI 建筑设计与创作平台",
    tags: ["AI", "建筑设计", "视觉创作"],
    aliases: [],
    pricing: "freemium",
    paths: ["/"],
  },
  "meshy.ai": {
    name: "Meshy",
    description: "通过文字或图片生成 3D 模型与贴图",
    tags: ["AI", "3D", "模型生成", "贴图"],
    aliases: ["Meshy AI"],
    pricing: "freemium",
    paths: ["/zh"],
  },
  "motionsites.ai": {
    name: "MotionSites",
    description: "精选动态网站案例与 AI 网站设计提示词",
    tags: ["网页设计", "动效", "Prompt"],
    aliases: ["Motion Sites"],
    pricing: "free",
    paths: ["/"],
  },
  "loading-ui.com": {
    name: "Loading UI",
    description: "可直接使用的加载动画、旋转指示器与 CSS 代码",
    tags: ["加载动画", "CSS", "前端组件"],
    aliases: ["Loading UI Components"],
    pricing: "free",
    paths: ["/"],
  },
  "21st.dev": {
    name: "21st.dev",
    description: "面向现代前端与 AI 应用的组件和开发工具目录",
    tags: ["前端组件", "AI", "开发"],
    aliases: ["21st"],
    pricing: "free",
    paths: ["/home"],
  },
  "originkit.dev": {
    name: "OriginKit",
    description: "适用于现代网站的免费动画组件库",
    tags: ["动效", "前端组件", "开源"],
    aliases: ["Origin Kit"],
    pricing: "free",
    paths: ["/"],
  },
  "string-tune.fiddle.digital": {
    name: "StringTune",
    description: "用于平滑滚动、悬停与网页动效的轻量 JavaScript 库",
    tags: ["JavaScript", "平滑滚动", "动效"],
    aliases: ["String Tune"],
    pricing: "free",
    paths: ["/"],
  },
  "stitch.withgoogle.com": {
    name: "Stitch",
    description: "Google 推出的 AI 界面设计与前端原型工具",
    tags: ["AI", "界面设计", "原型设计"],
    aliases: ["Google Stitch"],
    pricing: "free",
    paths: ["/"],
  },
  "588ku.com": {
    name: "千库网",
    description: "提供 PNG、背景、模板与办公设计素材",
    tags: ["PNG 素材", "模板", "背景图案"],
    aliases: ["588ku"],
    pricing: "freemium",
    paths: ["/"],
  },
  "huaban.com": {
    name: "花瓣网",
    description: "发现并收藏设计、插画、摄影与视觉创意灵感",
    tags: ["视觉采集", "插画", "摄影"],
    aliases: ["Huaban"],
    pricing: "freemium",
    paths: ["/discovery"],
  },
  "chaopx.com": {
    name: "潮国创意",
    description: "原创 3D、电商、海报与可商用设计素材库",
    tags: ["3D", "电商设计", "商用素材"],
    aliases: ["潮国"],
    pricing: "freemium",
    paths: ["/"],
  },
  "dameigong.cn": {
    name: "大美工",
    description: "面向电商与平面设计的优选素材和模板平台",
    tags: ["电商设计", "模板", "海报"],
    aliases: ["Dameigong"],
    pricing: "freemium",
    paths: ["/"],
  },
  "aishort.top": {
    name: "AiShort",
    description: "分类整理的 AI 提示词模板与生产力指令库",
    tags: ["Prompt", "AI", "模板"],
    aliases: ["AI Short"],
    pricing: "free",
    paths: ["/"],
  },
  "qiukuai.top": {
    name: "秋裤工具箱",
    description: "面向 CorelDRAW 用户的 AI 智能设计插件工具箱",
    tags: ["AI", "CorelDRAW", "设计插件"],
    aliases: ["秋裤 AI"],
    pricing: "freemium",
    paths: ["/"],
  },
  "love.mmy234.com": {
    name: "猫猫云",
    description: "提供多线路选择的网络连接服务",
    tags: ["网络连接", "代理", "多线路"],
    aliases: ["Maomao Cloud"],
    pricing: "paid",
    paths: ["/"],
  },
  "packyapi.com": {
    name: "PackyAPI",
    description: "为开发和自动化场景提供统一的模型 API 服务",
    tags: ["API", "AI", "自动化"],
    aliases: ["Packy API"],
    pricing: "paid",
    paths: ["/"],
  },
  "minimal.gallery": {
    name: "极简画廊",
    description: "精选极简网站、设计工具与优秀域名案例",
    tags: ["极简设计", "网页设计", "案例"],
    aliases: ["Minimal Gallery"],
    pricing: "free",
    paths: ["/"],
  },
  "logosystem.co": {
    name: "Logo System",
    description: "按行业与风格浏览千余个品牌标志设计案例",
    tags: ["Logo", "品牌设计", "案例"],
    aliases: ["LogoSystem"],
    pricing: "free",
    paths: ["/"],
  },
  "tympanus.net": {
    name: "Webzibition",
    description: "Codrops 策划的实验性网页设计与创意交互展览",
    tags: ["网页设计", "交互", "实验设计"],
    aliases: ["Codrops Webzibition"],
    pricing: "free",
    paths: ["/codrops/webzibition"],
  },
  "godly.website": {
    name: "Godly",
    description: "收录高质量网站和数字产品的网页设计灵感库",
    tags: ["网页设计", "数字设计", "案例"],
    aliases: ["Godly Website"],
    pricing: "free",
    paths: ["/"],
  },
  "siteofsites.co": {
    name: "Site of Sites",
    description: "聚合全球优秀网站案例的设计灵感画廊",
    tags: ["网页设计", "案例", "视觉创作"],
    aliases: ["SOS"],
    pricing: "free",
    paths: ["/"],
  },
  "recent.design": {
    name: "Recent Design",
    description: "持续更新的产品、网页与视觉设计灵感集合",
    tags: ["产品灵感", "网页设计", "视觉创作"],
    aliases: [],
    pricing: "free",
    paths: ["/"],
  },
};

function decodeHtml(value) {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function stripCategoryEmoji(value) {
  return value.replace(/^[^\p{L}\p{N}]+/u, "").trim();
}

function parseBookmarks(html) {
  const stack = [];
  const bookmarks = [];
  let pendingFolder = "";
  const tokens = html.match(/<DT>\s*<H3\b[^>]*>[\s\S]*?<\/H3>|<\/?DL\b[^>]*>|<DT>\s*<A\b[^>]*>[\s\S]*?<\/A>/gi) || [];
  for (const token of tokens) {
    const heading = token.match(/<H3\b[^>]*>([\s\S]*?)<\/H3>/i);
    if (heading) { pendingFolder = decodeHtml(heading[1]); continue; }
    if (/^<DL\b/i.test(token)) { stack.push(pendingFolder); pendingFolder = ""; continue; }
    if (/^<\/DL\b/i.test(token)) { stack.pop(); continue; }
    const href = token.match(/\bHREF\s*=\s*(["'])(.*?)\1/i);
    const title = token.match(/<A\b[^>]*>([\s\S]*?)<\/A>/i);
    if (href && title) bookmarks.push({ url: decodeHtml(href[2]), title: decodeHtml(title[1]), folders: stack.filter(Boolean) });
  }
  return bookmarks;
}

function hostOf(value) {
  return new URL(value).host.replace(/^www\./, "").toLowerCase();
}

function isHomeUrl(value) {
  const url = new URL(value);
  return /^\/(?:home\/?|(?:zh|zh-cn|cn|en)(?:\/home)?\/?)?$/i.test(url.pathname)
    && !canonicalUrl(value).includes("?");
}

function slugify(value) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function nextUniqueSlug(base, used) {
  let slug = slugify(base) || "resource";
  const root = slug;
  let suffix = 2;
  while (used.has(slug)) slug = `${root}-${suffix++}`;
  used.add(slug);
  return slug;
}

function cleanTags(values, categories, subcategory) {
  const excluded = new Set([...categories, subcategory].map(normalizeText));
  const seen = new Set();
  return values.filter((tag) => {
    const normalized = normalizeText(tag);
    if (!normalized || seen.has(normalized) || excluded.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).map((tag) => tag.trim());
}

function importBookmarks(data, bookmarks, { importDate = new Date().toISOString().slice(0, 10), metadata = NEW_SITE_METADATA } = {}) {
  const categoryMap = new Map(data.categories.map((category) => [category.name, new Set(category.subcategories)]));
  const byCanonical = new Map(data.sites.map((site) => [canonicalUrl(site.url), site]));
  const byHost = new Map();
  const indexHost = (site) => {
    const host = hostOf(site.url);
    byHost.set(host, [...(byHost.get(host) || []), site]);
  };
  data.sites.forEach(indexHost);
  const usedSlugs = new Set(data.sites.map((site) => site.slug));
  let nextId = Math.max(0, ...data.sites.map((site) => Number(site.id.replace(/\D/g, "")) || 0)) + 1;
  const added = [];
  const updated = new Set();
  const skipped = [];
  for (const bookmark of bookmarks) {
    const folders = bookmark.folders.map(stripCategoryEmoji);
    if (folders.includes("临时网页")) { skipped.push({ ...bookmark, reason: "临时网页" }); continue; }
    const categoryIndex = folders.findIndex((folder) => categoryMap.has(folder));
    const category = folders[categoryIndex];
    const subcategory = folders[categoryIndex + 1];
    if (categoryIndex < 0 || !categoryMap.get(category).has(subcategory)) {
      skipped.push({ ...bookmark, reason: "未知分类或子分类" }); continue;
    }
    let host;
    let canonical;
    try { host = hostOf(bookmark.url); canonical = canonicalUrl(bookmark.url); }
    catch (_) { skipped.push({ ...bookmark, reason: "无效 URL" }); continue; }
    if (EXCLUDED_HOSTS.has(host)) { skipped.push({ ...bookmark, reason: "不适合作为公开导航资源" }); continue; }
    let site = byCanonical.get(canonical);
    const sameHost = byHost.get(host) || [];
    if (!site && sameHost.length === 1 && isHomeUrl(bookmark.url) && isHomeUrl(sameHost[0].url)) site = sameHost[0];
    if (site) {
      const tags = cleanTags(site.tags || [], categoryMap.keys(), subcategory);
      if (site.category !== category || site.subcategory !== subcategory || JSON.stringify(site.tags) !== JSON.stringify(tags)) {
        Object.assign(site, { category, subcategory, tags, updatedAt: importDate });
        updated.add(site.id);
      }
      continue;
    }
    const info = metadata[host];
    const bookmarkPath = new URL(bookmark.url).pathname.replace(/\/+$/, "") || "/";
    if (!info || (info.paths && !info.paths.includes(bookmarkPath))) {
      skipped.push({ ...bookmark, reason: "缺少公开展示元数据" }); continue;
    }
    site = {
      name: info.name, url: bookmark.url, category, subcategory, description: info.description,
      id: `site-${String(nextId++).padStart(3, "0")}`,
      slug: nextUniqueSlug(info.name || host, usedSlugs),
      tags: cleanTags(info.tags, categoryMap.keys(), subcategory),
      aliases: [...new Map((info.aliases || []).map((alias) => [normalizeText(alias), alias.trim()])).values()],
      pricing: info.pricing, platforms: ["web"], featured: false, updatedAt: importDate,
    };
    data.sites.push(site);
    byCanonical.set(canonical, site);
    indexHost(site);
    added.push(site);
  }
  if (added.length || updated.size) data.meta.updatedAt = importDate;
  return { data, added, updated: [...updated], skipped };
}

function main() {
  const bookmarkFile = process.argv[2];
  if (!bookmarkFile) {
    console.error('用法：node scripts/import-bookmarks.js "C:\\path\\to\\bookmarks.html"');
    process.exitCode = 1;
    return;
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  const bookmarks = parseBookmarks(fs.readFileSync(path.resolve(bookmarkFile), "utf8"));
  const result = importBookmarks(data, bookmarks);
  if (result.added.length || result.updated.length) fs.writeFileSync(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`书签解析：${bookmarks.length} 个`);
  console.log(`已有资源更新：${result.updated.length} 个`);
  console.log(`新增公开资源：${result.added.length} 个`);
  result.added.forEach((site) => console.log(`+ ${site.name} · ${site.category} / ${site.subcategory}`));
  console.log(`未导入：${result.skipped.length} 个`);
}

if (require.main === module) main();
module.exports = { parseBookmarks, importBookmarks, NEW_SITE_METADATA };
