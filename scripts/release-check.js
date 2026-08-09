#!/usr/bin/env node

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DIST_ROOT = path.join(ROOT, "dist");
const allowPlaceholders = process.argv.includes("--allow-placeholders");
const errors = [];
const warnings = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function addConfigIssue(message) {
  (allowPlaceholders ? warnings : errors).push(message);
}

function isPlaceholderHost(hostname) {
  return hostname === "localhost"
    || hostname.endsWith(".localhost")
    || hostname === "example.com"
    || hostname.endsWith(".example.com")
    || hostname.endsWith(".local");
}

const config = readJson("src/data/site-config.json");
const data = readJson("src/data/sites.json");
const html = fs.readFileSync(path.join(DIST_ROOT, "index.html"), "utf8");
const configuredSiteUrl = process.env.SITE_URL || config.siteUrl;

if (!configuredSiteUrl) {
  addConfigIssue("src/data/site-config.json 尚未填写 siteUrl");
} else {
  try {
    const siteUrl = new URL(configuredSiteUrl);
    if (!["http:", "https:"].includes(siteUrl.protocol)) errors.push("siteUrl 必须使用 HTTP(S)");
    if (isPlaceholderHost(siteUrl.hostname)) addConfigIssue("siteUrl 仍然是本地或示例域名");
    siteUrl.search = "";
    siteUrl.hash = "";
    if (!siteUrl.pathname.endsWith("/")) siteUrl.pathname += "/";
    if (!html.includes(`href="${siteUrl.href}"`)) {
      errors.push("dist/index.html canonical 尚未与 siteUrl 同步，请运行 npm run build");
    }
  } catch (_) {
    errors.push("siteUrl 不是有效 URL");
  }
}

if (!config.feedbackUrl) {
  addConfigIssue("src/data/site-config.json 尚未填写 feedbackUrl");
} else {
  try {
    const feedbackUrl = new URL(config.feedbackUrl);
    if (!["http:", "https:", "mailto:"].includes(feedbackUrl.protocol)) {
      errors.push("feedbackUrl 必须使用 HTTP(S) 或 mailto");
    }
    if (feedbackUrl.hostname && isPlaceholderHost(feedbackUrl.hostname)) {
      addConfigIssue("feedbackUrl 仍然使用本地或示例地址");
    }
  } catch (_) {
    errors.push("feedbackUrl 不是有效 URL");
  }
}

const ogImage = config.ogImage || "og-image.png";
if (/^https?:\/\//i.test(ogImage)) {
  warnings.push("建议将 ogImage 保存在项目内，避免分享图依赖第三方服务");
} else if (!fs.existsSync(path.join(DIST_ROOT, ogImage))) {
  errors.push(`缺少 OG 分享图：${ogImage}`);
}

for (const file of ["site-config.js", "sitemap.xml", "robots.txt", "manifest.webmanifest", ".nojekyll"]) {
  if (!fs.existsSync(path.join(DIST_ROOT, file))) errors.push(`缺少发布文件：${file}`);
}

const toolPages = fs.existsSync(path.join(DIST_ROOT, "tools"))
  ? fs.readdirSync(path.join(DIST_ROOT, "tools"), { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];
const categoryPages = fs.existsSync(path.join(DIST_ROOT, "category"))
  ? fs.readdirSync(path.join(DIST_ROOT, "category"), { withFileTypes: true }).filter((entry) => entry.isDirectory())
  : [];
if (toolPages.length !== data.sites.length) {
  errors.push(`工具详情页数量错误：应为 ${data.sites.length}，实际为 ${toolPages.length}`);
}
if (categoryPages.length !== data.categories.length) {
  errors.push(`分类页数量错误：应为 ${data.categories.length}，实际为 ${categoryPages.length}`);
}
for (const site of data.sites) {
  if (!fs.existsSync(path.join(DIST_ROOT, "tools", site.slug, "index.html"))) {
    errors.push(`缺少工具详情页：${site.slug}`);
  }
}

if (configuredSiteUrl && fs.existsSync(path.join(DIST_ROOT, "sitemap.xml"))) {
  const sitemap = fs.readFileSync(path.join(DIST_ROOT, "sitemap.xml"), "utf8");
  const sitemapUrlCount = (sitemap.match(/<url>/g) || []).length;
  const expectedUrlCount = 1 + data.categories.length + data.sites.length;
  if (sitemapUrlCount !== expectedUrlCount) {
    errors.push(`sitemap URL 数量错误：应为 ${expectedUrlCount}，实际为 ${sitemapUrlCount}`);
  }
}

const verifiedCount = data.sites.filter((site) => site.verifiedAt).length;
if (verifiedCount < data.sites.length) {
  warnings.push(`${data.sites.length - verifiedCount} 个站点尚未填写 verifiedAt；页面会诚实显示“待核验”`);
}

if (!html.includes('property="og:image"') || !html.includes('property="og:url"')) {
  errors.push("index.html 缺少 Open Graph 图片或 URL 元数据");
}

console.log(`RoseTools 发布检查：${data.sites.length} 个站点，${verifiedCount} 个已核验。`);
warnings.forEach((message) => console.warn(`警告：${message}`));
errors.forEach((message) => console.error(`错误：${message}`));

if (errors.length) {
  console.error(`发布检查未通过：${errors.length} 个错误，${warnings.length} 个警告。`);
  process.exitCode = 1;
} else {
  console.log(`发布检查通过：0 个错误，${warnings.length} 个警告。`);
}
