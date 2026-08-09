#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const SOURCE_ROOT = path.join(ROOT, "src");
const DIST_ROOT = path.join(ROOT, "dist");
const SOURCE_FILE = path.join(SOURCE_ROOT, "data", "sites.json");
const TARGET_FILE = path.join(DIST_ROOT, "sites-data.js");
const CONFIG_FILE = path.join(SOURCE_ROOT, "data", "site-config.json");
const RUNTIME_CONFIG_FILE = path.join(DIST_ROOT, "site-config.js");
const INDEX_FILE = path.join(DIST_ROOT, "index.html");
const SITEMAP_FILE = path.join(DIST_ROOT, "sitemap.xml");
const ROBOTS_FILE = path.join(DIST_ROOT, "robots.txt");
const CHECK_ONLY = process.argv.includes("--check");
const REQUIRED_FIELDS = [
  "id", "slug", "name", "url", "category", "subcategory", "description",
  "tags", "aliases", "pricing", "platforms", "featured", "updatedAt",
];
const VALID_PRICING = new Set(["free", "freemium", "paid"]);
const VALID_PLATFORMS = new Set(["web", "windows", "macos", "mobile"]);

function prepareDist() {
  const expectedPrefix = `${ROOT}${path.sep}`;
  if (!DIST_ROOT.startsWith(expectedPrefix) || path.basename(DIST_ROOT) !== "dist") {
    throw new Error(`拒绝清理非预期目录：${DIST_ROOT}`);
  }

  fs.rmSync(DIST_ROOT, { recursive: true, force: true });
  fs.mkdirSync(path.join(DIST_ROOT, "vendor"), { recursive: true });
  fs.writeFileSync(path.join(DIST_ROOT, ".nojekyll"), "", "utf8");

  for (const file of ["index.html", "style.css", "script.js", "animations.js", "manifest.webmanifest"]) {
    fs.copyFileSync(path.join(SOURCE_ROOT, file), path.join(DIST_ROOT, file));
  }
  for (const file of ["Logo.svg", "og-image.png"]) {
    fs.copyFileSync(path.join(SOURCE_ROOT, "assets", file), path.join(DIST_ROOT, file));
  }
  for (const file of ["gsap.min.js", "ScrollTrigger.min.js"]) {
    fs.copyFileSync(path.join(SOURCE_ROOT, "vendor", file), path.join(DIST_ROOT, "vendor", file));
  }

  const iconSource = path.join(SOURCE_ROOT, "assets", "icons");
  if (fs.existsSync(iconSource)) {
    fs.cpSync(iconSource, path.join(DIST_ROOT, "icons"), { recursive: true });
  }
}

function validate(data) {
  const errors = [];
  if (!data || !Array.isArray(data.categories) || !Array.isArray(data.sites)) {
    return ["根节点必须包含 categories 和 sites 数组"];
  }

  const categoryMap = new Map();
  data.categories.forEach((category, index) => {
    if (!category?.name || !Array.isArray(category.subcategories)) {
      errors.push(`categories[${index}] 缺少 name 或 subcategories`);
      return;
    }
    if (categoryMap.has(category.name)) errors.push(`分类重复：${category.name}`);
    categoryMap.set(category.name, new Set(category.subcategories));
  });

  const ids = new Set();
  const slugs = new Set();
  const urls = new Set();
  data.sites.forEach((site, index) => {
    const location = `sites[${index}]${site?.name ? ` (${site.name})` : ""}`;
    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in (site || {})) || site[field] === "" || site[field] == null) {
        errors.push(`${location} 缺少必填字段 ${field}`);
      }
    });
    if (!site) return;

    if (ids.has(site.id)) errors.push(`${location} id 重复：${site.id}`);
    if (slugs.has(site.slug)) errors.push(`${location} slug 重复：${site.slug}`);
    if (urls.has(site.url)) errors.push(`${location} URL 重复：${site.url}`);
    ids.add(site.id);
    slugs.add(site.slug);
    urls.add(site.url);

    try {
      const url = new URL(site.url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("仅支持 HTTP(S)");
    } catch (error) {
      errors.push(`${location} URL 无效：${site.url}`);
    }

    if (!categoryMap.has(site.category)) {
      errors.push(`${location} 使用了未知分类：${site.category}`);
    } else if (!categoryMap.get(site.category).has(site.subcategory)) {
      errors.push(`${location} 使用了未知子分类：${site.subcategory}`);
    }
    if (!Array.isArray(site.tags) || site.tags.length === 0) errors.push(`${location} tags 必须是非空数组`);
    if (!Array.isArray(site.aliases)) errors.push(`${location} aliases 必须是数组`);
    if (!VALID_PRICING.has(site.pricing)) errors.push(`${location} pricing 无效：${site.pricing}`);
    if (!Array.isArray(site.platforms) || site.platforms.length === 0) {
      errors.push(`${location} platforms 必须是非空数组`);
    } else {
      site.platforms.forEach((platform) => {
        if (!VALID_PLATFORMS.has(platform)) errors.push(`${location} platform 无效：${platform}`);
      });
    }
    if (typeof site.featured !== "boolean") errors.push(`${location} featured 必须是布尔值`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(site.updatedAt) || Number.isNaN(Date.parse(site.updatedAt))) {
      errors.push(`${location} updatedAt 必须使用 YYYY-MM-DD 格式`);
    }
    if (site.verifiedAt != null
      && (!/^\d{4}-\d{2}-\d{2}$/.test(site.verifiedAt) || Number.isNaN(Date.parse(site.verifiedAt)))) {
      errors.push(`${location} verifiedAt 必须使用 YYYY-MM-DD 格式`);
    }
    if (site.icon != null
      && (typeof site.icon !== "string"
        || site.icon.startsWith("/")
        || site.icon.includes("\\")
        || site.icon.includes("..")
        || /^[a-z][a-z\d+.-]*:/i.test(site.icon)
        || site.icon.startsWith("//"))) {
      errors.push(`${location} icon 必须是项目内的安全相对路径`);
    }
  });
  return errors;
}

function normalizeBaseUrl(value) {
  if (!value) return "";
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("siteUrl 必须使用 HTTP(S)");
  url.search = "";
  url.hash = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url.href;
}

function normalizeFeedbackUrl(value) {
  if (!value) return "";
  const url = new URL(value);
  if (!["http:", "https:", "mailto:"].includes(url.protocol)) {
    throw new Error("feedbackUrl 必须使用 HTTP(S) 或 mailto");
  }
  return value;
}

function escapeAttribute(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function updateIndexMetadata(siteUrl, ogImageUrl) {
  let html = fs.readFileSync(INDEX_FILE, "utf8");
  const canonical = siteUrl || "./";
  const ogUrl = siteUrl || "./";
  html = html.replace(
    /(<link id="canonical-link"[^>]*href=")[^"]*(")/,
    (_, prefix, suffix) => `${prefix}${escapeAttribute(canonical)}${suffix}`,
  );
  html = html.replace(
    /(<meta id="og-url"[^>]*content=")[^"]*(")/,
    (_, prefix, suffix) => `${prefix}${escapeAttribute(ogUrl)}${suffix}`,
  );
  html = html.replace(
    /(<meta id="og-image"[^>]*content=")[^"]*(")/,
    (_, prefix, suffix) => `${prefix}${escapeAttribute(ogImageUrl)}${suffix}`,
  );
  fs.writeFileSync(INDEX_FILE, html, "utf8");
}

function generateDeploymentFiles(config, data) {
  const configuredUrl = process.env.SITE_URL || config.siteUrl || "";
  const siteUrl = normalizeBaseUrl(configuredUrl);
  const feedbackUrl = normalizeFeedbackUrl(config.feedbackUrl || "");
  const ogImage = config.ogImage || "og-image.png";
  const ogImageUrl = siteUrl ? new URL(ogImage, siteUrl).href : ogImage;
  const robots = ["User-agent: *", "Allow: /"];
  const sitemapLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  if (siteUrl) {
    robots.push(`Sitemap: ${new URL("sitemap.xml", siteUrl).href}`);
    sitemapLines.push(
      "  <url>",
      `    <loc>${siteUrl}</loc>`,
      `    <lastmod>${data.meta?.updatedAt || new Date().toISOString().slice(0, 10)}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      "  </url>",
    );
  } else {
    sitemapLines.push("  <!-- Set siteUrl in src/data/site-config.json, then run npm run build before deployment. -->");
  }
  sitemapLines.push("</urlset>", "");
  fs.writeFileSync(ROBOTS_FILE, `${robots.join("\n")}\n`, "utf8");
  fs.writeFileSync(SITEMAP_FILE, sitemapLines.join("\n"), "utf8");
  const runtimeConfig = { siteUrl, feedbackUrl, ogImageUrl };
  fs.writeFileSync(
    RUNTIME_CONFIG_FILE,
    `// 此文件由 site-config.json 自动生成，请勿直接编辑。\nconst SITE_CONFIG = ${JSON.stringify(runtimeConfig, null, 2)};\n`,
    "utf8",
  );
  updateIndexMetadata(siteUrl, ogImageUrl);
  return runtimeConfig;
}

function main() {
  try {
    const data = JSON.parse(fs.readFileSync(SOURCE_FILE, "utf8"));
    const errors = validate(data);
    if (errors.length) {
      console.error(`数据校验失败，共 ${errors.length} 个问题：`);
      errors.forEach((error) => console.error(`- ${error}`));
      process.exitCode = 1;
      return;
    }

    if (CHECK_ONLY) {
      console.log(`校验通过：${data.sites.length} 个站点，${data.categories.length} 个分类。`);
      return;
    }

    prepareDist();

    const banner = [
      "// 此文件由 src/data/sites.json 自动生成，请勿直接编辑。",
      `// 数据版本：${data.meta?.version || 1}；更新日期：${data.meta?.updatedAt || "unknown"}`,
      "",
    ].join("\n");
    fs.writeFileSync(TARGET_FILE, `${banner}const SITES_DATA = ${JSON.stringify(data, null, 2)};\n`, "utf8");

    const config = fs.existsSync(CONFIG_FILE)
      ? JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"))
      : {};
    const runtimeConfig = generateDeploymentFiles(config, data);
    console.log(`同步完成：${data.sites.length} 个站点，${data.categories.length} 个分类。`);
    if (!runtimeConfig.siteUrl) console.log("提示：发布前请在 src/data/site-config.json 中填写正式站点地址并重新构建。");
    if (!runtimeConfig.feedbackUrl) console.log("提示：发布前请在 src/data/site-config.json 中填写反馈地址。");
  } catch (error) {
    console.error(`同步失败：${error.message}`);
    process.exitCode = 1;
  }
}

main();
