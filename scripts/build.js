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
const TOOLS_ROOT = path.join(DIST_ROOT, "tools");
const CATEGORY_ROOT = path.join(DIST_ROOT, "category");
const CHECK_ONLY = process.argv.includes("--check");
const REQUIRED_FIELDS = [
  "id", "slug", "name", "url", "category", "subcategory", "description",
  "tags", "aliases", "pricing", "platforms", "featured", "updatedAt",
];
const VALID_PRICING = new Set(["free", "freemium", "paid"]);
const VALID_PLATFORMS = new Set(["web", "windows", "macos", "mobile"]);
const PRICING_LABELS = { free: "免费", freemium: "免费增值", paid: "付费" };
const PLATFORM_LABELS = { web: "网页", windows: "Windows", macos: "macOS", mobile: "移动端" };
const CATEGORY_SLUGS = new Map([
  ["AI 工具", "ai-tools"],
  ["开发编程", "development"],
  ["设计创作", "design"],
  ["素材资源", "assets"],
  ["效率工具", "productivity"],
  ["影音娱乐", "media"],
  ["灵感与学习", "inspiration"],
]);

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

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeXml(value) {
  return escapeHtml(value);
}

function safeJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatStaticDate(value) {
  if (!value) return "待核验";
  const [year, month, day] = value.split("-").map(Number);
  return `${year}年${month}月${day}日`;
}

function categorySlug(name) {
  return CATEGORY_SLUGS.get(name) || encodeURIComponent(name);
}

function createFeedbackUrl(baseUrl, site) {
  if (!baseUrl) return "";
  try {
    const url = new URL(baseUrl);
    if (site && url.hostname === "github.com" && /\/issues\/new\/?$/.test(url.pathname)) {
      url.searchParams.set("title", `[资源反馈] ${site.name}`);
      url.searchParams.set(
        "body",
        `工具：${site.name}\n站内标识：${site.slug}\n原网址：${site.url}\n\n问题描述：`,
      );
    }
    return url.href;
  } catch (_) {
    return baseUrl;
  }
}

function staticHead({ title, description, canonical, ogImageUrl, type = "website", structuredData }) {
  const canonicalMarkup = canonical
    ? `<link rel="canonical" href="${escapeAttribute(canonical)}" />`
    : "";
  const ogUrlMarkup = canonical
    ? `<meta property="og:url" content="${escapeAttribute(canonical)}" />`
    : "";
  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#f7f8fc" />
    <meta name="description" content="${escapeAttribute(description)}" />
    <meta name="robots" content="index, follow" />
    <meta property="og:type" content="${escapeAttribute(type)}" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:description" content="${escapeAttribute(description)}" />
    <meta property="og:image" content="${escapeAttribute(ogImageUrl)}" />
    ${ogUrlMarkup}
    <meta name="twitter:card" content="summary" />
    <title>${escapeHtml(title)}</title>
    ${canonicalMarkup}
    <link rel="icon" href="../../Logo.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../style.css" />
    <script>
      try {
        const saved = localStorage.getItem("rosetools-theme");
        const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme = dark ? "dark" : "light";
      } catch (_) {}
    </script>
    <script type="application/ld+json">${safeJson(structuredData)}</script>
  </head>`;
}

function renderStaticIcon(site) {
  const fallback = escapeHtml([...site.name][0]?.toUpperCase() || "R");
  if (!site.icon) return `<span class="site-icon is-fallback"><span class="site-icon-fallback">${fallback}</span></span>`;
  return `<span class="site-icon is-loaded"><img src="../../${escapeAttribute(site.icon)}" alt="" width="26" height="26" /><span class="site-icon-fallback">${fallback}</span></span>`;
}

function renderStaticCard(site) {
  const tags = site.tags.slice(0, 2).map((tag) => `<span class="site-tag">${escapeHtml(tag)}</span>`).join("");
  const domain = new URL(site.url).hostname.replace(/^www\./, "");
  return `<article class="site-card">
    <a class="site-card-link" href="../../tools/${encodeURIComponent(site.slug)}/" aria-label="查看 ${escapeAttribute(site.name)} 的工具详情">
      <div class="site-card-header">${renderStaticIcon(site)}<div class="site-heading"><h2>${escapeHtml(site.name)}</h2><span class="site-domain">${escapeHtml(domain)}</span></div></div>
      <p class="site-description">${escapeHtml(site.description)}</p>
      <div class="site-card-footer">${tags}<span class="pricing-badge">${escapeHtml(PRICING_LABELS[site.pricing] || site.pricing)}</span></div>
    </a>
  </article>`;
}

function generateToolPage(site, data, runtimeConfig) {
  const toolUrl = runtimeConfig.siteUrl
    ? new URL(`tools/${encodeURIComponent(site.slug)}/`, runtimeConfig.siteUrl).href
    : "";
  const categoryUrl = `../../category/${categorySlug(site.category)}/`;
  const feedbackUrl = createFeedbackUrl(runtimeConfig.feedbackUrl, site);
  const related = data.sites
    .filter((item) => item.id !== site.id && item.subcategory === site.subcategory)
    .slice(0, 4);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": site.platforms.includes("web") ? "WebApplication" : "SoftwareApplication",
        name: site.name,
        description: site.description,
        url: toolUrl || site.url,
        sameAs: site.url,
        applicationCategory: site.subcategory,
        operatingSystem: site.platforms.map((platform) => PLATFORM_LABELS[platform] || platform).join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "RoseTools", item: runtimeConfig.siteUrl || "../../" },
          { "@type": "ListItem", position: 2, name: site.category },
          { "@type": "ListItem", position: 3, name: site.name },
        ],
      },
    ],
  };
  const tags = site.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
  const relatedMarkup = related.length
    ? `<section class="tool-related" aria-labelledby="related-title"><h2 id="related-title">同类工具</h2><div class="tool-related-grid">${related.map((item) => `<a href="../${encodeURIComponent(item.slug)}/"><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.description)}</span></a>`).join("")}</div></section>`
    : "";
  const feedbackMarkup = feedbackUrl
    ? `<a class="secondary-button" href="${escapeAttribute(feedbackUrl)}" target="_blank" rel="noopener noreferrer">反馈链接或信息问题</a>`
    : "";
  return `${staticHead({
    title: `${site.name}｜RoseTools 工具详情`,
    description: site.description,
    canonical: toolUrl,
    ogImageUrl: runtimeConfig.siteUrl ? runtimeConfig.ogImageUrl : `../../${runtimeConfig.ogImageUrl}`,
    type: "article",
    structuredData,
  })}
  <body class="static-page">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <header class="static-header"><a href="../../"><img src="../../Logo.svg" alt="" width="38" height="38" /><strong>RoseTools</strong></a><a href="../../">返回资源导航</a></header>
    <main class="static-shell" id="main-content">
      <nav class="static-breadcrumb" aria-label="面包屑"><a href="../../">首页</a><span>/</span><a href="${categoryUrl}">${escapeHtml(site.category)}</a><span>/</span><span aria-current="page">${escapeHtml(site.name)}</span></nav>
      <article class="tool-page">
        <div class="tool-page-hero">${renderStaticIcon(site)}<div><span class="detail-eyebrow">${escapeHtml(site.featured ? "编辑推荐" : site.subcategory)}</span><h1>${escapeHtml(site.name)}</h1><a href="${escapeAttribute(site.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(new URL(site.url).hostname.replace(/^www\./, ""))}</a></div></div>
        <p class="tool-page-description">${escapeHtml(site.description)}</p>
        <dl class="detail-meta">
          <div><dt>分类</dt><dd><a href="${categoryUrl}">${escapeHtml(site.category)} / ${escapeHtml(site.subcategory)}</a></dd></div>
          <div><dt>价格</dt><dd>${escapeHtml(PRICING_LABELS[site.pricing] || site.pricing)}</dd></div>
          <div><dt>平台</dt><dd>${escapeHtml(site.platforms.map((platform) => PLATFORM_LABELS[platform] || platform).join("、"))}</dd></div>
          <div><dt>内容更新</dt><dd>${formatStaticDate(site.updatedAt)}</dd></div>
          <div><dt>链接核验</dt><dd>${site.verifiedAt ? formatStaticDate(site.verifiedAt) : "待核验"}</dd></div>
        </dl>
        <section class="detail-section"><h2>相关标签</h2><div class="detail-tags">${tags}</div></section>
        <div class="tool-page-actions"><a class="primary-button" href="${escapeAttribute(site.url)}" target="_blank" rel="noopener noreferrer">访问官方网站 ↗</a>${feedbackMarkup}</div>
      </article>
      ${relatedMarkup}
    </main>
    <footer class="static-footer">© ${new Date().getFullYear()} RoseTools · 为设计师与开发者精选实用工具</footer>
  </body>
</html>
`;
}

function generateCategoryPage(category, sites, runtimeConfig, updatedAt) {
  const slug = categorySlug(category.name);
  const categoryUrl = runtimeConfig.siteUrl ? new URL(`category/${slug}/`, runtimeConfig.siteUrl).href : "";
  const description = `浏览 RoseTools 精选的 ${category.name}，共 ${sites.length} 个资源。`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name}｜RoseTools`,
    description,
    url: categoryUrl || `../../category/${slug}/`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: sites.length,
      itemListElement: sites.map((site, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: site.name,
        url: runtimeConfig.siteUrl
          ? new URL(`tools/${encodeURIComponent(site.slug)}/`, runtimeConfig.siteUrl).href
          : `../../tools/${encodeURIComponent(site.slug)}/`,
      })),
    },
  };
  return `${staticHead({
    title: `${category.name}｜RoseTools 精选工具`,
    description,
    canonical: categoryUrl,
    ogImageUrl: runtimeConfig.siteUrl ? runtimeConfig.ogImageUrl : `../../${runtimeConfig.ogImageUrl}`,
    structuredData,
  })}
  <body class="static-page">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <header class="static-header"><a href="../../"><img src="../../Logo.svg" alt="" width="38" height="38" /><strong>RoseTools</strong></a><a href="../../">返回资源导航</a></header>
    <main class="static-shell" id="main-content">
      <nav class="static-breadcrumb" aria-label="面包屑"><a href="../../">首页</a><span>/</span><span aria-current="page">${escapeHtml(category.name)}</span></nav>
      <header class="category-page-heading"><div><span class="section-kicker">CURATED CATEGORY</span><h1>${escapeHtml(category.name)}</h1><p>${escapeHtml(description)}</p></div><time datetime="${escapeAttribute(updatedAt)}">数据更新：${formatStaticDate(updatedAt)}</time></header>
      <div class="site-grid category-page-grid">${sites.map(renderStaticCard).join("")}</div>
    </main>
    <footer class="static-footer">© ${new Date().getFullYear()} RoseTools · 为设计师与开发者精选实用工具</footer>
  </body>
</html>
`;
}

function generateStaticPages(data, runtimeConfig) {
  fs.mkdirSync(TOOLS_ROOT, { recursive: true });
  fs.mkdirSync(CATEGORY_ROOT, { recursive: true });
  data.sites.forEach((site) => {
    const target = path.join(TOOLS_ROOT, site.slug);
    fs.mkdirSync(target, { recursive: true });
    fs.writeFileSync(path.join(target, "index.html"), generateToolPage(site, data, runtimeConfig), "utf8");
  });
  data.categories.forEach((category) => {
    const target = path.join(CATEGORY_ROOT, categorySlug(category.name));
    fs.mkdirSync(target, { recursive: true });
    const sites = data.sites.filter((site) => site.category === category.name);
    fs.writeFileSync(
      path.join(target, "index.html"),
      generateCategoryPage(category, sites, runtimeConfig, data.meta?.updatedAt || ""),
      "utf8",
    );
  });
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
    const sitemapEntries = [
      { url: siteUrl, lastmod: data.meta?.updatedAt, changefreq: "weekly" },
      ...data.categories.map((category) => ({
        url: new URL(`category/${categorySlug(category.name)}/`, siteUrl).href,
        lastmod: data.meta?.updatedAt,
        changefreq: "weekly",
      })),
      ...data.sites.map((site) => ({
        url: new URL(`tools/${encodeURIComponent(site.slug)}/`, siteUrl).href,
        lastmod: site.updatedAt,
        changefreq: "monthly",
      })),
    ];
    sitemapEntries.forEach((entry) => sitemapLines.push(
      "  <url>",
      `    <loc>${escapeXml(entry.url)}</loc>`,
      `    <lastmod>${entry.lastmod || new Date().toISOString().slice(0, 10)}</lastmod>`,
      `    <changefreq>${entry.changefreq}</changefreq>`,
      "  </url>",
    ));
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
    generateStaticPages(data, runtimeConfig);
    console.log(`同步完成：${data.sites.length} 个站点，${data.categories.length} 个分类。`);
    if (!runtimeConfig.siteUrl) console.log("提示：发布前请在 src/data/site-config.json 中填写正式站点地址并重新构建。");
    if (!runtimeConfig.feedbackUrl) console.log("提示：发布前请在 src/data/site-config.json 中填写反馈地址。");
  } catch (error) {
    console.error(`同步失败：${error.message}`);
    process.exitCode = 1;
  }
}

main();
