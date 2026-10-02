const test = require("node:test");
const assert = require("node:assert/strict");
const D = require("../src/discovery.js");
const data = require("../src/data/sites.json");
const all = { q: "", category: "all", pricing: "all", platform: "all", tag: "", view: "all" };

test("查询保留中文，处理全角、大小写、重复空白与空输入", () => {
  assert.equal(D.normalizeQuery("  ＡＩ\n ３Ｄ\t "), "AI 3D");
  assert.deepEqual(D.queryTokens("  ＡＩ\n ３Ｄ\tAI "), ["ai", "3d"]);
  assert.deepEqual(D.queryTokens(" \n\t "), []);
  assert.ok(D.matchesQuery(data.sites.find((site) => site.name === "ChatGPT"), "CHATGPT"));
  assert.ok(D.matchesQuery(data.sites.find((site) => site.name === "ChatGPT"), "聊天机器人 大模型"));
  assert.ok(D.matchesQuery(data.sites.find((site) => site.name === "GitHub"), "开源社区"));
  assert.equal(D.filterSites(data.sites, { ...all, q: "  " }).length, data.sites.length);
});

test("多关键词 AND 可以跨字段匹配，不能只匹配其中一词", () => {
  assert.deepEqual(D.filterSites(data.sites, { ...all, q: " AI\t3D " }).map((site) => site.name), ["Meshy"]);
  const site = { name: "红杉", description: "漫游", category: "学习", subcategory: "语言",
    tags: ["SVG"], aliases: ["Sequoia"] };
  for (const token of ["红杉", "漫游", "学习", "语言", "svg", "SEQUOIA"]) assert.ok(D.matchesQuery(site, token));
  assert.ok(D.matchesQuery(site, "红杉 语言 svg sequoia"));
  assert.equal(D.matchesQuery(site, "红杉 未收录"), false);
  const inspiration = D.filterSites(data.sites, { ...all, q: "网页 设计 灵感" });
  assert.ok(inspiration.some((site) => site.name === "MotionSites"));
  assert.ok(inspiration.every((site) => D.queryTokens("网页 设计 灵感").every((token) => D.searchableText(site).includes(token))));
});

test("标签和搜索、分类、价格、平台、收藏采用交集筛选", () => {
  const site = { id: "a", name: "Alpha", description: "创作", category: "设计", subcategory: "原型",
    tags: ["SVG"], aliases: [], pricing: "free", platforms: ["web"] };
  const others = [{ ...site, id: "b", tags: ["PNG"] }, { ...site, id: "c", pricing: "paid" },
    { ...site, id: "d", platforms: ["windows"] }, { ...site, id: "e", category: "开发" }];
  const state = { ...all, q: "ALPHA 创作", category: "设计", pricing: "free", platform: "web", tag: "SVG", view: "favorites" };
  assert.deepEqual(D.filterSites([site, ...others], state, new Set(["a", "b", "c", "d", "e"])).map((item) => item.id), ["a"]);
  assert.deepEqual(D.filterSites([site, ...others], state, new Set()), []);
  assert.deepEqual(D.filterSites([site], { ...all, tag: "SV" }), []);
  assert.deepEqual(D.filterSites([site], all, new Set(), () => false), []);
});

test("全部标签以站点数降序计数，同分按名称稳定排序", () => {
  const sites = [{ tags: ["SVG", "API", "SVG"] }, { tags: ["API", "SVG", "CSS"] }];
  assert.deepEqual(D.tagCounts(sites), [["API", 2], ["SVG", 2], ["CSS", 1]]);
  assert.deepEqual(D.tagCounts([...sites].reverse()), D.tagCounts(sites));
});

test("推荐分数覆盖同子分类、同分类和共同标签，不重复计分", () => {
  const site = { id: "a", category: "A", subcategory: "A1", tags: ["SVG", "CSS"] };
  assert.equal(D.relatedScore(site, { id: "b", category: "A", subcategory: "A1", tags: ["SVG", "css", "SVG"] }), 6);
  assert.equal(D.relatedScore(site, { id: "c", category: "A", subcategory: "A2", tags: ["SVG"] }), 2);
  assert.equal(D.relatedScore(site, { id: "d", category: "B", subcategory: "B1", tags: ["SVG", "CSS"] }), 2);
  assert.equal(D.relatedScore(site, site), 0);
});

test("推荐排除自身与零分，同分固定排序，最多三个且不依赖数据顺序", () => {
  const anchor = { id: "self", slug: "self", category: "A", subcategory: "A1", tags: ["SVG", "CSS"] };
  const sites = [anchor,
    { id: "3", slug: "z", category: "A", subcategory: "A2", tags: ["SVG"] },
    { id: "2", slug: "b", category: "A", subcategory: "A1", tags: [] },
    { id: "1", slug: "a", category: "A", subcategory: "A1", tags: [] },
    { id: "4", slug: "c", category: "B", subcategory: "B1", tags: ["SVG", "CSS"] },
    { id: "0", slug: "zero", category: "B", subcategory: "B1", tags: [] }];
  assert.deepEqual(D.relatedSites(anchor, sites).map((site) => site.id), ["1", "2", "4"]);
  assert.deepEqual(D.relatedSites(anchor, [...sites].reverse()), D.relatedSites(anchor, sites));
  assert.deepEqual(D.relatedSites(anchor, [anchor, sites.at(-1)]), []);
});

test("规范 URL 合并追踪和主页变体，保留不同功能查询参数", () => {
  assert.equal(D.canonicalUrl("http://www.example.test/path/?utm_source=fixture#section"), D.canonicalUrl("https://example.test/path"));
  assert.equal(D.canonicalUrl("https://example.test/?b=2&a=1"), D.canonicalUrl("https://example.test?a=1&b=2"));
  assert.notEqual(D.canonicalUrl("https://example.test/?v=1"), D.canonicalUrl("https://example.test/?v=2"));
  assert.throws(() => D.canonicalUrl("javascript:alert(1)"));
});
