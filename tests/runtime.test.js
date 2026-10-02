const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const D = require("../src/discovery.js");
const data = require("../src/data/sites.json");

function runtime({ url = "http://localhost/", stored = {} } = {}) {
  const storage = new Map(Object.entries(stored));
  const nodes = new Map();
  const downloads = [];
  const warnings = [];
  class Element {
    constructor() { this.value = ""; this.textContent = ""; this.dataset = {}; this.listeners = {}; this.children = []; }
    addEventListener(name, listener) { this.listeners[name] = listener; }
    setAttribute() {}
    append(...children) { this.children.push(...children); }
    remove() {}
    click() { downloads.push(this); }
  }
  const document = { addEventListener() {}, body: new Element(), activeElement: null,
    querySelector(selector) { if (!nodes.has(selector)) nodes.set(selector, new Element()); return nodes.get(selector); },
    querySelectorAll() { return []; }, createElement() { return new Element(); }, createTextNode(text) { return { textContent: text }; } };
  const location = {};
  function navigate(href) {
    const next = new URL(href, location.href || url);
    for (const key of ["href", "pathname", "search", "hash", "protocol", "origin"]) location[key] = next[key];
  }
  navigate(url);
  const blobs = [];
  class RuntimeURL extends URL {
    static createObjectURL(blob) { blobs.push(blob); return "blob:fixture"; }
    static revokeObjectURL() {}
  }
  const context = vm.createContext({ SITES_DATA: structuredClone(data), window: { RoseToolsDiscovery: D, addEventListener() {} },
    document, location, history: { replaceState(_a, _b, href) { navigate(href); } },
    localStorage: { getItem(key) { return storage.get(key) || null; }, setItem(key, value) { storage.set(key, value); } },
    URL: RuntimeURL, URLSearchParams, Blob, console: { ...console, warn: (...args) => warnings.push(args[0]) }, Event: class {}, HTMLElement: Element,
    setTimeout() { return 0; }, clearTimeout() {}, matchMedia() { return { addEventListener() {} }; } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, "../src/script.js"), "utf8"), context);
  const run = (code) => vm.runInContext(code, context);
  run("data = SITES_DATA; renderAll = () => syncControls();");
  return { run, context, storage, nodes, document, location, downloads, blobs, warnings };
}

test("场景合集有六组真实跨分类资源，保留原四个合集 URL 标识", () => {
  const app = runtime();
  const collections = JSON.parse(app.run("JSON.stringify(COLLECTIONS.map(c => ({ id:c.id, count:data.sites.filter(c.matches).length, categories:[...new Set(data.sites.filter(c.matches).map(s=>s.category))] })))"));
  assert.equal(collections.length, 6);
  assert.ok(collections.every((collection) => collection.count >= 5 && collection.categories.length >= 2));
  for (const id of ["ai-starter", "designer-stack", "developer-stack", "productivity-workflow"]) assert.ok(collections.some((collection) => collection.id === id));
});

test("输入过程保留分词空格，搜索结果和 URL 使用规范查询", () => {
  const app = runtime();
  app.run("setupEventListeners();");
  const input = app.nodes.get("#search-input");
  app.document.activeElement = input;
  input.value = "AI "; input.listeners.input({ target: input });
  assert.equal(input.value, "AI ");
  input.value += "3D"; input.listeners.input({ target: input });
  assert.equal(input.value, "AI 3D");
  assert.equal(new URL(app.location.href).searchParams.get("q"), "AI 3D");
  assert.deepEqual(JSON.parse(app.run("JSON.stringify(getFilteredSites().map(s=>s.name))")), ["Meshy"]);
});

test("筛选 URL 往返保留搜索、标签、分类、价格、平台和详情链接", () => {
  const app = runtime({ url: "http://localhost/?q=%EF%BC%A1%EF%BC%A9%20%203D&category=AI%20%E5%B7%A5%E5%85%B7&pricing=freemium&platform=web&tag=3D&tool=meshy#resources" });
  app.run("readStateFromUrl(); writeStateToUrl();");
  const params = new URL(app.location.href).searchParams;
  assert.equal(params.get("q"), "AI 3D");
  assert.equal(params.get("category"), "AI 工具");
  assert.equal(params.get("tag"), "3D");
  assert.equal(params.get("pricing"), "freemium");
  assert.equal(params.get("platform"), "web");
  assert.equal(params.get("tool"), "meshy");
  assert.equal(new URL(app.location.href).hash, "#resources");
  assert.deepEqual(JSON.parse(app.run("JSON.stringify(getFilteredSites().map(s=>s.name))")), ["Meshy"]);
});

test("详情标签清除其他临时状态，普通标签可组合筛选或取消", () => {
  const app = runtime();
  app.run('Object.assign(state, { q:"unmatched", category:"开发编程", pricing:"paid", platform:"windows", view:"favorites", collection:"developer-stack" }); selectTag("3D", true);');
  const state = JSON.parse(app.run("JSON.stringify(state)"));
  assert.deepEqual(state, { q: "", category: "all", pricing: "all", platform: "all", tag: "3D", view: "all", collection: "" });
  assert.equal(new URL(app.location.href).searchParams.get("tag"), "3D");
  app.run('state.q = "AI"; selectTag("3D");');
  assert.equal(JSON.parse(app.run("JSON.stringify(state)")).tag, "");
  assert.equal(JSON.parse(app.run("JSON.stringify(state)")).q, "AI");
});

test("旧版及当前收藏能按 ID/URL 读取，重复与未知项不污染收藏", () => {
  const app = runtime({ stored: { favorites: JSON.stringify(["site-001", { url: data.sites[100].url }, { id: "site-001" }, "missing"]) } });
  app.run("favoriteIds = loadFavorites();");
  assert.deepEqual(JSON.parse(app.run("JSON.stringify([...favoriteIds])")), ["site-001", "site-101"]);
  const broken = runtime({ stored: { "rosetools-favorites-v2": "invalid-json" } });
  assert.equal(broken.run("loadFavorites().size"), 0);
  assert.deepEqual(broken.warnings, ["收藏数据无法读取"]);
});

test("收藏切换持久化且只显示收藏站点，迁移不影响既有标识", () => {
  const app = runtime();
  app.run('toggleFavorite("site-101"); state.view="favorites";');
  assert.deepEqual(JSON.parse(app.storage.get("rosetools-favorites-v2")), ["site-101"]);
  assert.deepEqual(JSON.parse(app.run("JSON.stringify(getFilteredSites().map(s=>s.name))")), ["Meshy"]);
  app.run('state.view="all"; toggleFavorite("site-101");');
  assert.deepEqual(JSON.parse(app.storage.get("rosetools-favorites-v2")), []);
  app.run('toggleFavorite("unknown");');
  assert.deepEqual(JSON.parse(app.storage.get("rosetools-favorites-v2")), []);
});

test("收藏导出与导入往返保留 ID/name/URL，导入合并并忽略未知项", async () => {
  const app = runtime();
  app.run('favoriteIds.add("site-001"); favoriteIds.add("site-101"); exportFavorites();');
  assert.equal(app.downloads.length, 1);
  const payload = JSON.parse(await app.blobs[0].text());
  assert.equal(payload.version, 2);
  assert.deepEqual(payload.favorites.map((site) => site.id), ["site-001", "site-101"]);
  assert.equal(payload.favorites[1].url, data.sites[100].url);
  const imported = runtime();
  imported.run('favoriteIds.add("site-002");');
  imported.context.fixtureEvent = { target: { files: [{ async text() { return JSON.stringify({ ...payload, favorites: [...payload.favorites, { id: "missing" }] }); } }], value: "fixture.json" } };
  await imported.run("importFavorites(fixtureEvent)");
  assert.deepEqual(JSON.parse(imported.storage.get("rosetools-favorites-v2")), ["site-002", "site-001", "site-101"]);
  assert.equal(imported.context.fixtureEvent.target.value, "");
});

test("搜索高亮不改变原文字，支持多词和 NFKC 展开", () => {
  const app = runtime();
  app.context.target = app.document.createElement("p");
  app.run('appendHighlightedText(target, "ＡＩ ㍿ 与 3D 灵感", "AI 株式会社 3D");');
  assert.equal(app.context.target.children.map((node) => node.textContent).join(""), "ＡＩ ㍿ 与 3D 灵感");
  assert.equal(app.context.target.children.filter((node) => node.textContent === "3D").length, 1);
});
