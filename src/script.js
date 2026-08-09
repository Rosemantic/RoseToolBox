"use strict";

const STORAGE_KEYS = {
  theme: "rosetools-theme",
  favorites: "rosetools-favorites-v2",
};

const PRICING_LABELS = {
  free: "免费",
  freemium: "免费增值",
  paid: "付费",
};

const PLATFORM_LABELS = {
  web: "网页",
  windows: "Windows",
  macos: "macOS",
  mobile: "移动端",
};

const CATEGORY_ICONS = ["✦", "⌘", "◇", "▦", "✓", "♪", "↗"];
const COLLECTIONS = [
  {
    id: "ai-starter",
    kicker: "AI STARTER",
    title: "免费 AI 工具",
    description: "从对话、编程到设计，优先发现可免费开始使用的 AI 工具。",
    accent: "violet",
    matches: (site) => site.category === "AI 工具" && site.pricing !== "paid",
  },
  {
    id: "developer-stack",
    kicker: "SHIP FASTER",
    title: "独立开发工具箱",
    description: "覆盖代码托管、开发环境、前端组件、文档与上线流程。",
    accent: "blue",
    matches: (site) => site.category === "开发编程" || site.tags.includes("开发"),
  },
  {
    id: "designer-stack",
    kicker: "DESIGN STACK",
    title: "设计师常用工具",
    description: "从界面设计、配色到图标与素材，组合一套顺手的创作流程。",
    accent: "pink",
    matches: (site) => ["设计创作", "素材资源"].includes(site.category),
  },
  {
    id: "productivity-workflow",
    kicker: "PRODUCTIVITY",
    title: "效率工作流",
    description: "整理日常任务、文件与信息，减少重复操作和工具切换。",
    accent: "cyan",
    matches: (site) => site.category === "效率工具",
  },
];

const state = {
  q: "",
  category: "all",
  pricing: "all",
  platform: "all",
  tag: "",
  view: "all",
  collection: "",
};

let data = { meta: {}, categories: [], sites: [] };
let favoriteIds = new Set();
let toastTimer;
let backToTopVisible = false;
let activeDetailSiteId = "";
let detailTrigger = null;
let detailClosing = false;

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  try {
    if (typeof SITES_DATA === "undefined") throw new Error("站点数据未生成");
    data = SITES_DATA;
    validateRuntimeData();
    favoriteIds = loadFavorites();
    readStateFromUrl();
    renderStaticData();
    setupEventListeners();
    updateThemeControls();
    renderAll();
    syncDetailFromUrl();
    updateBackToTopVisibility(window.scrollY >= 520);
    updateSeoData();
  } catch (error) {
    console.error(error);
    showFatalError("资源加载失败，请运行 npm run sync 后刷新页面。");
  }
}

function validateRuntimeData() {
  if (!Array.isArray(data.categories) || !Array.isArray(data.sites)) {
    throw new Error("站点数据格式错误");
  }
}

function applyRuntimeConfig() {
  const config = typeof SITE_CONFIG === "undefined" ? {} : SITE_CONFIG;
  document.documentElement.dataset.configStatus = "ready";
  document.documentElement.dataset.siteConfigured = String(Boolean(config.siteUrl));
  const feedback = $("#feedback-link");
  if (config.feedbackUrl) {
    feedback.href = config.feedbackUrl;
    feedback.hidden = false;
  } else {
    feedback.hidden = true;
  }

  if (config.ogImageUrl) $("#og-image").content = config.ogImageUrl;
  if (config.siteUrl) {
    $("#canonical-link").href = config.siteUrl;
    $("#og-url").content = config.siteUrl;
  }
}

function renderStaticData() {
  applyRuntimeConfig();
  $("#total-sites").textContent = String(data.sites.length);
  $("#last-updated").textContent = formatDate(data.meta.updatedAt);
  $("#copyright-year").textContent = String(new Date().getFullYear());
  $("#search-shortcut").textContent = navigator.platform.toLowerCase().includes("mac")
    ? "⌘ K"
    : "Ctrl K";
  renderCategoryNavigation();
  renderCategoryFilter();
  renderPopularTags();
  renderCollections();
  renderSiteGrid($("#featured-grid"), data.sites.filter((site) => site.featured));
  renderSiteGrid(
    $("#recent-grid"),
    [...data.sites].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 6),
  );
  updateFavoriteCount();
}

function renderCategoryNavigation() {
  const nav = $("#category-nav");
  nav.replaceChildren();
  nav.append(
    createNavButton("all", "全部资源", data.sites.length, "⌂"),
    createNavButton("favorites", "我的收藏", favoriteIds.size, "♥", true),
  );

  data.categories.forEach((category, index) => {
    const count = data.sites.filter((site) => site.category === category.name).length;
    nav.append(createNavButton(category.name, category.name, count, CATEGORY_ICONS[index] || "•"));
  });
}

function createNavButton(value, label, count, icon, isFavorites = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-nav-button";
  button.dataset.category = value;
  if (isFavorites) button.dataset.view = "favorites";

  const iconElement = document.createElement("span");
  iconElement.className = "category-icon";
  iconElement.setAttribute("aria-hidden", "true");
  iconElement.textContent = icon;

  const labelElement = document.createElement("span");
  labelElement.textContent = label;

  const countElement = document.createElement("span");
  countElement.className = "category-count";
  countElement.textContent = String(count);
  if (isFavorites) countElement.dataset.favoriteNavCount = "";

  button.append(iconElement, labelElement, countElement);
  return button;
}

function renderCategoryFilter() {
  const select = $("#category-filter");
  data.categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    select.append(option);
  });
}

function renderPopularTags() {
  const counts = new Map();
  data.sites.forEach((site) => {
    site.tags.forEach((tag) => counts.set(tag, (counts.get(tag) || 0) + 1));
  });

  const broadCategories = new Set(data.categories.map((category) => category.name));
  const tags = [...counts.entries()]
    .filter(([tag]) => !broadCategories.has(tag))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 8);

  const list = $("#popular-tags-list");
  list.replaceChildren();
  tags.forEach(([tag, count]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tag-button";
    button.dataset.tag = tag;
    button.setAttribute("aria-pressed", "false");
    button.textContent = `${tag} ${count}`;
    list.append(button);
  });
}

function renderCollections() {
  const grid = $("#collection-grid");
  const fragment = document.createDocumentFragment();

  COLLECTIONS.forEach((collection) => {
    const count = data.sites.filter(collection.matches).length;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `collection-card collection-card-${collection.accent}`;
    button.dataset.collection = collection.id;
    button.setAttribute("aria-pressed", "false");

    const kicker = document.createElement("span");
    kicker.className = "collection-kicker";
    kicker.textContent = collection.kicker;

    const title = document.createElement("strong");
    title.textContent = collection.title;

    const description = document.createElement("span");
    description.className = "collection-description";
    description.textContent = collection.description;

    const footer = document.createElement("span");
    footer.className = "collection-footer";
    const countLabel = document.createElement("span");
    countLabel.textContent = `${count} 个工具`;
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    footer.append(countLabel, arrow);

    button.append(kicker, title, description, footer);
    fragment.append(button);
  });

  grid.replaceChildren(fragment);
}

function setupEventListeners() {
  $("#search-input").addEventListener("input", (event) => {
    state.q = event.target.value.trim();
    state.tag = "";
    state.view = "all";
    state.collection = "";
    commitState();
  });

  $("#category-filter").addEventListener("change", (event) => {
    state.category = event.target.value;
    state.view = "all";
    state.collection = "";
    commitState();
  });

  $("#pricing-filter").addEventListener("change", (event) => {
    state.pricing = event.target.value;
    commitState();
  });

  $("#platform-filter").addEventListener("change", (event) => {
    state.platform = event.target.value;
    commitState();
  });

  $("#category-nav").addEventListener("click", (event) => {
    const button = event.target.closest(".category-nav-button");
    if (!button) return;
    if (button.dataset.view === "favorites") {
      state.view = "favorites";
      state.category = "all";
    } else {
      state.view = "all";
      state.category = button.dataset.category;
    }
    state.tag = "";
    state.collection = "";
    commitState();
    closeSidebar();
    $("#results-title").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  $("#popular-tags-list").addEventListener("click", (event) => {
    const button = event.target.closest(".tag-button");
    if (!button) return;
    state.tag = state.tag === button.dataset.tag ? "" : button.dataset.tag;
    state.view = "all";
    state.collection = "";
    commitState();
  });

  $("#collection-grid").addEventListener("click", (event) => {
    const button = event.target.closest(".collection-card");
    if (!button) return;
    Object.assign(state, {
      q: "",
      category: "all",
      pricing: "all",
      platform: "all",
      tag: "",
      view: "all",
      collection: button.dataset.collection,
    });
    commitState();
    $("#results-title").scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });

  $("#reset-filters").addEventListener("click", resetFilters);
  $("#empty-reset").addEventListener("click", resetFilters);
  $("#theme-toggle").addEventListener("click", toggleTheme);
  $("#mobile-menu-button").addEventListener("click", openSidebar);
  $("#sidebar-close").addEventListener("click", closeSidebar);
  $("#sidebar-overlay").addEventListener("click", closeSidebar);
  $("#export-favorites").addEventListener("click", exportFavorites);
  $("#import-favorites").addEventListener("click", () => $("#favorite-file").click());
  $("#favorite-file").addEventListener("change", importFavorites);
  $("#clear-favorites").addEventListener("click", clearFavorites);
  $("#back-to-top").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  });
  $("#detail-close").addEventListener("click", closeSiteDetail);
  $("#detail-backdrop").addEventListener("click", closeSiteDetail);
  $("#site-detail-dialog").addEventListener("cancel", (event) => {
    event.preventDefault();
    closeSiteDetail();
  });
  $("#detail-content").addEventListener("click", (event) => {
    const relatedButton = event.target.closest("[data-related-site-id]");
    if (!relatedButton) return;
    const site = data.sites.find((item) => item.id === relatedButton.dataset.relatedSiteId);
    if (site) openSiteDetail(site, relatedButton, { updateUrl: true });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && $("#site-detail-dialog").open) {
      event.preventDefault();
      closeSiteDetail();
      return;
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      $("#search-input").focus();
    }
    if (event.key === "Escape") closeSidebar();
  });

  window.addEventListener("scroll", () => {
    updateBackToTopVisibility(window.scrollY >= 520);
  }, { passive: true });

  window.addEventListener("popstate", () => {
    readStateFromUrl();
    renderAll();
    syncDetailFromUrl();
  });

  const themeMedia = matchMedia("(prefers-color-scheme: dark)");
  themeMedia.addEventListener("change", (event) => {
    if (localStorage.getItem(STORAGE_KEYS.theme)) return;
    document.documentElement.dataset.theme = event.matches ? "dark" : "light";
    updateThemeControls();
  });
}

function renderAll() {
  syncControls();
  const filtered = getFilteredSites();
  renderSiteGrid($("#results-grid"), filtered, state.q);
  updateResultsCopy(filtered.length);
  updateNavigationState();

  const isHomepage = !state.q && !state.tag && state.category === "all"
    && state.pricing === "all" && state.platform === "all" && state.view === "all"
    && !state.collection;
  $("#homepage-sections").hidden = !isHomepage;
  $("#empty-state").hidden = filtered.length > 0;
  $("#results-grid").hidden = filtered.length === 0;
  window.RoseToolsAnimations?.resultsChanged($("#results-grid"));
}

function getFilteredSites() {
  const normalizedQuery = normalizeText(state.q);
  const collection = COLLECTIONS.find((item) => item.id === state.collection);
  return data.sites.filter((site) => {
    if (collection && !collection.matches(site)) return false;
    if (state.view === "favorites" && !favoriteIds.has(site.id)) return false;
    if (state.category !== "all" && site.category !== state.category) return false;
    if (state.pricing !== "all" && site.pricing !== state.pricing) return false;
    if (state.platform !== "all" && !site.platforms.includes(state.platform)) return false;
    if (state.tag && !site.tags.includes(state.tag)) return false;
    if (normalizedQuery && !searchableText(site).includes(normalizedQuery)) return false;
    return true;
  });
}

function searchableText(site) {
  return normalizeText([
    site.name,
    site.description,
    site.category,
    site.subcategory,
    ...site.tags,
    ...site.aliases,
  ].join(" "));
}

function normalizeText(value) {
  return String(value || "").normalize("NFKC").toLocaleLowerCase("zh-CN");
}

function renderSiteGrid(container, sites, highlightTerm = "") {
  const fragment = document.createDocumentFragment();
  sites.forEach((site) => fragment.append(createSiteCard(site, highlightTerm)));
  container.replaceChildren(fragment);
}

function createSiteCard(site, highlightTerm) {
  const article = document.createElement("article");
  article.className = "site-card";
  article.dataset.siteId = site.id;
  article.dataset.siteSlug = site.slug;

  const link = document.createElement("button");
  link.type = "button";
  link.className = "site-card-link";
  link.setAttribute("aria-label", `查看 ${site.name} 的工具详情`);
  link.addEventListener("click", () => openSiteDetail(site, link, { updateUrl: true }));

  const header = document.createElement("div");
  header.className = "site-card-header";
  const icon = createSiteIcon(site);
  const heading = document.createElement("div");
  heading.className = "site-heading";
  const title = document.createElement("h3");
  appendHighlightedText(title, site.name, highlightTerm);
  const domain = document.createElement("span");
  domain.className = "site-domain";
  domain.textContent = new URL(site.url).hostname.replace(/^www\./, "");
  heading.append(title, domain);
  header.append(icon, heading);

  const description = document.createElement("p");
  description.className = "site-description";
  appendHighlightedText(description, site.description, highlightTerm);

  const footer = document.createElement("div");
  footer.className = "site-card-footer";
  site.tags.slice(0, 2).forEach((tag) => {
    const badge = document.createElement("span");
    badge.className = "site-tag";
    badge.textContent = tag;
    footer.append(badge);
  });
  const pricing = document.createElement("span");
  pricing.className = "pricing-badge";
  pricing.textContent = PRICING_LABELS[site.pricing] || site.pricing;
  footer.append(pricing);

  link.append(header, description, footer);
  article.append(link, createFavoriteButton(site));
  return article;
}

function createSiteIcon(site) {
  const wrapper = document.createElement("span");
  wrapper.className = "site-icon is-fallback";
  wrapper.style.setProperty("--icon-hue", String(getIconHue(site.name)));
  const fallback = document.createElement("span");
  fallback.className = "site-icon-fallback";
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = [...site.name][0]?.toUpperCase() || "R";

  if (site.icon && isSafeLocalAsset(site.icon)) {
    const image = document.createElement("img");
    image.alt = "";
    image.width = 26;
    image.height = 26;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("load", () => {
      wrapper.classList.remove("is-fallback");
      wrapper.classList.add("is-loaded");
    }, { once: true });
    image.addEventListener("error", () => wrapper.classList.add("is-fallback"), { once: true });
    image.src = site.icon;
    wrapper.append(image);
  }

  wrapper.append(fallback);
  return wrapper;
}

function getIconHue(value) {
  return [...String(value)].reduce((hash, character) => ((hash * 31) + character.codePointAt(0)) % 360, 254);
}

function isSafeLocalAsset(value) {
  return typeof value === "string"
    && !value.startsWith("/")
    && !value.includes("\\")
    && !value.includes("..")
    && !/^[a-z][a-z\d+.-]*:/i.test(value)
    && !value.startsWith("//");
}

function createFavoriteButton(site) {
  const active = favoriteIds.has(site.id);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "favorite-button";
  button.dataset.favoriteId = site.id;
  button.setAttribute("aria-pressed", String(active));
  button.setAttribute("aria-label", active ? `取消收藏 ${site.name}` : `收藏 ${site.name}`);
  button.title = active ? "取消收藏" : "添加收藏";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M12 20.7 10.55 19.38C5.4 14.7 2 11.62 2 7.85 2 4.77 4.42 2.35 7.5 2.35c1.74 0 3.41.81 4.5 2.09a6 6 0 0 1 4.5-2.09c3.08 0 5.5 2.42 5.5 5.5 0 3.77-3.4 6.85-8.55 11.54Z");
  svg.append(path);
  button.append(svg);
  button.addEventListener("click", () => toggleFavorite(site.id));
  return button;
}

function syncDetailFromUrl() {
  const slug = new URLSearchParams(location.search).get("tool");
  const site = slug ? data.sites.find((item) => item.slug === slug) : null;
  const dialog = $("#site-detail-dialog");

  if (site) {
    openSiteDetail(site, null, { updateUrl: false });
  } else if (slug) {
    setDetailUrl("");
  } else if (dialog.open) {
    closeSiteDetail({ updateUrl: false });
  }
}

function openSiteDetail(site, trigger, { updateUrl = false } = {}) {
  const dialog = $("#site-detail-dialog");
  const sheet = $("#detail-sheet");
  const wasOpen = dialog.open;

  if (!wasOpen) detailTrigger = trigger || document.activeElement;
  activeDetailSiteId = site.id;
  renderSiteDetail(site);
  document.title = `${site.name}｜RoseTools`;
  if (updateUrl) setDetailUrl(site.slug);

  if (!wasOpen) {
    dialog.showModal();
    document.body.classList.add("detail-is-open");
    $("#detail-close").focus();
    window.RoseToolsAnimations?.detailOpened(dialog, sheet);
  } else {
    window.RoseToolsAnimations?.detailContentChanged($("#detail-content"));
  }
}

function closeSiteDetail(options = {}) {
  const { updateUrl = true } = options instanceof Event ? {} : options;
  const dialog = $("#site-detail-dialog");
  if (!dialog.open || detailClosing) return;
  detailClosing = true;

  const finish = () => {
    dialog.close();
    document.body.classList.remove("detail-is-open");
    activeDetailSiteId = "";
    detailClosing = false;
    if (updateUrl) setDetailUrl("");
    updateResultsCopy(getFilteredSites().length);
    if (detailTrigger instanceof HTMLElement && document.contains(detailTrigger)) detailTrigger.focus();
    detailTrigger = null;
  };

  if (window.RoseToolsAnimations?.detailClosed) {
    window.RoseToolsAnimations.detailClosed(dialog, $("#detail-sheet"), finish);
  } else {
    finish();
  }
}

function setDetailUrl(slug) {
  const url = new URL(location.href);
  if (slug) url.searchParams.set("tool", slug);
  else url.searchParams.delete("tool");
  history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
}

function renderSiteDetail(site) {
  const content = $("#detail-content");
  const body = document.createElement("article");
  body.className = "detail-body";

  const hero = document.createElement("div");
  hero.className = "detail-hero";
  const icon = createSiteIcon(site);
  icon.classList.add("detail-icon");
  const identity = document.createElement("div");
  identity.className = "detail-identity";
  const eyebrow = document.createElement("span");
  eyebrow.className = "detail-eyebrow";
  eyebrow.textContent = site.featured ? "编辑推荐" : site.subcategory;
  const title = document.createElement("h2");
  title.id = "detail-title";
  title.textContent = site.name;
  const domain = document.createElement("span");
  domain.className = "detail-domain";
  domain.textContent = new URL(site.url).hostname.replace(/^www\./, "");
  identity.append(eyebrow, title, domain);
  hero.append(icon, identity);

  const description = document.createElement("p");
  description.className = "detail-description";
  description.textContent = site.description;

  const meta = document.createElement("dl");
  meta.className = "detail-meta";
  appendDetailMeta(meta, "分类", `${site.category} / ${site.subcategory}`);
  appendDetailMeta(meta, "价格", PRICING_LABELS[site.pricing] || site.pricing);
  appendDetailMeta(meta, "平台", site.platforms.map((platform) => PLATFORM_LABELS[platform] || platform).join("、"));
  appendDetailMeta(meta, "内容更新", formatDate(site.updatedAt));
  appendDetailMeta(meta, "链接核验", site.verifiedAt ? formatDate(site.verifiedAt) : "待核验");

  const tagsSection = createDetailListSection("相关标签", site.tags);
  const aliasesSection = site.aliases.length
    ? createDetailListSection("也可以这样搜索", site.aliases)
    : null;
  const relatedSection = createRelatedSitesSection(site);

  const actions = document.createElement("div");
  actions.className = "detail-actions";
  const favorite = createFavoriteButton(site);
  favorite.classList.add("detail-favorite-button");
  const favoriteLabel = document.createElement("span");
  favoriteLabel.dataset.favoriteLabel = "";
  favoriteLabel.textContent = favoriteIds.has(site.id) ? "已收藏" : "加入收藏";
  favorite.append(favoriteLabel);

  const visit = document.createElement("a");
  visit.className = "primary-button detail-visit";
  visit.href = site.url;
  visit.target = "_blank";
  visit.rel = "noopener noreferrer";
  visit.setAttribute("aria-label", `访问 ${site.name} 官方网站，在新窗口打开`);
  visit.textContent = "访问官方网站 ↗";
  actions.append(favorite, visit);

  body.append(hero, description, meta, tagsSection);
  if (aliasesSection) body.append(aliasesSection);
  if (relatedSection) body.append(relatedSection);
  body.append(actions);
  content.replaceChildren(body);
}

function appendDetailMeta(list, label, value) {
  const item = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.textContent = value;
  item.append(term, description);
  list.append(item);
}

function createDetailListSection(titleText, items) {
  const section = document.createElement("section");
  section.className = "detail-section";
  const title = document.createElement("h3");
  title.textContent = titleText;
  const list = document.createElement("div");
  list.className = "detail-tags";
  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    list.append(tag);
  });
  section.append(title, list);
  return section;
}

function createRelatedSitesSection(site) {
  const candidates = data.sites
    .filter((item) => item.id !== site.id && item.subcategory === site.subcategory)
    .concat(data.sites.filter((item) => item.id !== site.id && item.category === site.category));
  const seen = new Set();
  const related = candidates.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  }).slice(0, 3);
  if (!related.length) return null;

  const section = document.createElement("section");
  section.className = "detail-section";
  const title = document.createElement("h3");
  title.textContent = "同类工具";
  const list = document.createElement("div");
  list.className = "related-sites";
  related.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "related-site-button";
    button.dataset.relatedSiteId = item.id;
    const name = document.createElement("strong");
    name.textContent = item.name;
    const copy = document.createElement("span");
    copy.textContent = item.description;
    const arrow = document.createElement("span");
    arrow.className = "related-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    button.append(name, copy, arrow);
    list.append(button);
  });
  section.append(title, list);
  return section;
}

function appendHighlightedText(element, text, term) {
  const source = String(text || "");
  const query = String(term || "").trim();
  if (!query) {
    element.textContent = source;
    return;
  }

  const normalizedSource = normalizeText(source);
  const normalizedQuery = normalizeText(query);
  let cursor = 0;
  let index = normalizedSource.indexOf(normalizedQuery);
  if (index < 0) {
    element.textContent = source;
    return;
  }

  while (index >= 0) {
    if (index > cursor) element.append(document.createTextNode(source.slice(cursor, index)));
    const mark = document.createElement("mark");
    mark.textContent = source.slice(index, index + query.length);
    element.append(mark);
    cursor = index + query.length;
    index = normalizedSource.indexOf(normalizedQuery, cursor);
  }
  if (cursor < source.length) element.append(document.createTextNode(source.slice(cursor)));
}

function updateResultsCopy(count) {
  const title = $("#results-title");
  const kicker = $("#results-kicker");
  let label = "全部资源";
  let path = "首页 / 全部资源";
  const activeCollection = COLLECTIONS.find((collection) => collection.id === state.collection);

  if (activeCollection) {
    label = activeCollection.title;
    path = `首页 / 场景合集 / ${activeCollection.title}`;
  } else if (state.view === "favorites") {
    label = "我的收藏";
    path = "首页 / 我的收藏";
  } else if (state.q) {
    label = `“${state.q}”的搜索结果`;
    path = "首页 / 搜索结果";
  } else if (state.tag) {
    label = `标签：${state.tag}`;
    path = `首页 / 标签 / ${state.tag}`;
  } else if (state.category !== "all") {
    label = state.category;
    path = `首页 / ${state.category}`;
  }

  title.textContent = label;
  kicker.textContent = activeCollection
    ? activeCollection.kicker
    : state.view === "favorites" ? "MY COLLECTION" : "DISCOVER RESOURCES";
  $("#breadcrumb").textContent = path;
  $("#results-summary").textContent = `找到 ${count} 个资源`;
  document.title = label === "全部资源"
    ? "RoseTools｜设计师与开发者的精选工具导航"
    : `${label}｜RoseTools`;
}

function syncControls() {
  $("#search-input").value = state.q;
  $("#category-filter").value = state.category;
  $("#pricing-filter").value = state.pricing;
  $("#platform-filter").value = state.platform;
  $$(".tag-button").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.tag === state.tag));
  });
  $$(".collection-card").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.collection === state.collection));
  });
}

function updateNavigationState() {
  $$(".category-nav-button").forEach((button) => {
    const active = state.view === "favorites"
      ? button.dataset.view === "favorites"
      : !state.collection && !button.dataset.view && button.dataset.category === state.category;
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

function commitState() {
  writeStateToUrl();
  renderAll();
}

function readStateFromUrl() {
  const params = new URLSearchParams(location.search);
  state.q = params.get("q") || "";
  state.category = params.get("category") || "all";
  state.pricing = params.get("pricing") || "all";
  state.platform = params.get("platform") || "all";
  state.tag = params.get("tag") || "";
  state.view = params.get("view") === "favorites" ? "favorites" : "all";
  state.collection = params.get("collection") || "";

  const categories = new Set(["all", ...data.categories.map((category) => category.name)]);
  if (!categories.has(state.category)) state.category = "all";
  if (!["all", "free", "freemium", "paid"].includes(state.pricing)) state.pricing = "all";
  if (!["all", "web", "windows", "macos", "mobile"].includes(state.platform)) state.platform = "all";
  if (!COLLECTIONS.some((collection) => collection.id === state.collection)) state.collection = "";
}

function writeStateToUrl() {
  const params = new URLSearchParams();
  const activeTool = new URLSearchParams(location.search).get("tool");
  if (state.q) params.set("q", state.q);
  if (state.category !== "all") params.set("category", state.category);
  if (state.pricing !== "all") params.set("pricing", state.pricing);
  if (state.platform !== "all") params.set("platform", state.platform);
  if (state.tag) params.set("tag", state.tag);
  if (state.view === "favorites") params.set("view", "favorites");
  if (state.collection) params.set("collection", state.collection);
  if (activeTool) params.set("tool", activeTool);
  const query = params.toString();
  history.replaceState(null, "", `${location.pathname}${query ? `?${query}` : ""}${location.hash}`);
}

function resetFilters() {
  Object.assign(state, {
    q: "",
    category: "all",
    pricing: "all",
    platform: "all",
    tag: "",
    view: "all",
    collection: "",
  });
  commitState();
  $("#search-input").focus();
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.favorites) || localStorage.getItem("favorites");
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : parsed.favorites;
    if (!Array.isArray(list)) return new Set();
    const ids = list.map(resolveFavoriteId).filter(Boolean);
    return new Set(ids);
  } catch (error) {
    console.warn("收藏数据无法读取", error);
    return new Set();
  }
}

function resolveFavoriteId(entry) {
  if (typeof entry === "string") return data.sites.some((site) => site.id === entry) ? entry : null;
  if (!entry || typeof entry !== "object") return null;
  if (entry.id && data.sites.some((site) => site.id === entry.id)) return entry.id;
  return data.sites.find((site) => site.url === entry.url)?.id || null;
}

function saveFavorites() {
  localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify([...favoriteIds]));
  updateFavoriteCount();
}

function toggleFavorite(id) {
  const site = data.sites.find((item) => item.id === id);
  if (!site) return;
  const added = !favoriteIds.has(id);
  if (added) favoriteIds.add(id);
  else favoriteIds.delete(id);
  saveFavorites();
  updateFavoriteButtons(id);
  const favoriteButtons = $$('[data-favorite-id]').filter((button) => button.dataset.favoriteId === id);
  window.RoseToolsAnimations?.favoriteChanged(favoriteButtons, $("#favorite-count"), added);
  showToast(added ? `已收藏 ${site.name}` : `已取消收藏 ${site.name}`);
  if (state.view === "favorites") renderAll();
}

function updateFavoriteButtons(id) {
  const active = favoriteIds.has(id);
  $$('[data-favorite-id]').filter((button) => button.dataset.favoriteId === id).forEach((button) => {
    const site = data.sites.find((item) => item.id === id);
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? `取消收藏 ${site.name}` : `收藏 ${site.name}`);
    button.title = active ? "取消收藏" : "添加收藏";
    const label = button.querySelector("[data-favorite-label]");
    if (label) label.textContent = active ? "已收藏" : "加入收藏";
  });
}

function updateFavoriteCount() {
  $("#favorite-count").textContent = String(favoriteIds.size);
  const navCount = $("[data-favorite-nav-count]");
  if (navCount) navCount.textContent = String(favoriteIds.size);
}

function exportFavorites() {
  const favorites = data.sites
    .filter((site) => favoriteIds.has(site.id))
    .map(({ id, name, url }) => ({ id, name, url }));
  const payload = { version: 2, exportedAt: new Date().toISOString(), favorites };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rosetools-favorites-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast(`已导出 ${favorites.length} 个收藏`);
}

async function importFavorites(event) {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const list = Array.isArray(parsed) ? parsed : parsed.favorites;
    if (!Array.isArray(list)) throw new Error("文件中缺少 favorites 数组");
    const imported = list.map(resolveFavoriteId).filter(Boolean);
    if (list.length && imported.length === 0) throw new Error("没有找到可识别的站点");
    imported.forEach((id) => favoriteIds.add(id));
    saveFavorites();
    renderAll();
    showToast(`成功导入 ${imported.length} 个收藏`);
  } catch (error) {
    showToast(`导入失败：${error.message}`);
  }
}

function clearFavorites() {
  if (favoriteIds.size === 0) {
    showToast("收藏夹已经是空的");
    return;
  }
  if (!confirm(`确定清空 ${favoriteIds.size} 个收藏吗？此操作无法撤销。`)) return;
  favoriteIds.clear();
  saveFavorites();
  renderAll();
  showToast("收藏夹已清空");
}

function toggleTheme() {
  const root = document.documentElement;
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  localStorage.setItem(STORAGE_KEYS.theme, next);
  updateThemeControls();
  window.RoseToolsAnimations?.themeChanged($("#theme-toggle"));
}

function updateThemeControls() {
  const dark = document.documentElement.dataset.theme === "dark";
  $("#theme-toggle").setAttribute("aria-pressed", String(dark));
  $("#theme-label").textContent = dark ? "切换到浅色模式" : "切换到深色模式";
  $("meta[name='theme-color']").content = dark ? "#11121a" : "#f7f8fc";
}

function openSidebar() {
  $("#sidebar").classList.add("is-open");
  $("#sidebar-overlay").hidden = false;
  $("#mobile-menu-button").setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  window.RoseToolsAnimations?.drawerOpened($("#sidebar"), $("#sidebar-overlay"));
  $("#sidebar-close").focus();
}

function closeSidebar() {
  const wasOpen = $("#sidebar").classList.contains("is-open");
  $("#sidebar").classList.remove("is-open");
  $("#sidebar-overlay").hidden = true;
  $("#mobile-menu-button").setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
  if (wasOpen && window.innerWidth <= 820) $("#mobile-menu-button").focus();
}

function showToast(message) {
  const toast = $("#toast");
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  window.RoseToolsAnimations?.toastIn(toast);
  toastTimer = setTimeout(() => {
    if (window.RoseToolsAnimations?.toastOut) {
      window.RoseToolsAnimations.toastOut(toast, () => { toast.hidden = true; });
    } else {
      toast.hidden = true;
    }
  }, 2400);
}

function updateBackToTopVisibility(visible) {
  if (visible === backToTopVisible) return;
  backToTopVisible = visible;
  const button = $("#back-to-top");
  if (window.RoseToolsAnimations?.backToTopChanged) {
    window.RoseToolsAnimations.backToTopChanged(button, visible);
  } else {
    button.hidden = !visible;
  }
}

function showFatalError(message) {
  const grid = $("#results-grid");
  grid.replaceChildren();
  const error = document.createElement("p");
  error.className = "empty-state";
  error.textContent = message;
  grid.append(error);
  $("#results-summary").textContent = "加载失败";
}

function updateSeoData() {
  if (location.protocol === "http:" || location.protocol === "https:") {
    $("#canonical-link").href = `${location.origin}${location.pathname}`;
  }
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: data.meta.title || "RoseTools",
        description: data.meta.description,
        url: location.href.split("?")[0].split("#")[0],
        potentialAction: {
          "@type": "SearchAction",
          target: `${location.href.split("?")[0]}?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ItemList",
        numberOfItems: data.sites.length,
        itemListElement: data.sites.map((site, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: site.name,
          url: site.url,
        })),
      },
    ],
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(structuredData);
  document.head.append(script);
}

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function prefersReducedMotion() {
  return document.documentElement.dataset.motion === "reduced";
}
