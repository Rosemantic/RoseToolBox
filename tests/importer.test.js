const test = require("node:test");
const assert = require("node:assert/strict");
const { parseBookmarks, importBookmarks, NEW_SITE_METADATA } = require("../scripts/import-bookmarks.js");
const { validate } = require("../scripts/build.js");
const data = require("../src/data/sites.json");
const empty = () => ({ meta: { updatedAt: "2000-01-01", version: 3 }, categories: structuredClone(data.categories), sites: [] });
const bookmark = (url, category = "AI 工具", subcategory = "对话助手") => ({ url, title: "合成书签", folders: ["书签栏", category, subcategory] });
const site = (url, id = "site-001") => ({ id, slug: id, url, name: "Fixture", description: "合成资源",
  category: "AI 工具", subcategory: "对话助手", tags: ["写作", "AI"], aliases: [], pricing: "free", platforms: ["web"], featured: false, updatedAt: "2000-01-01" });

test("解析嵌套或紧凑 Netscape HTML、图标分类、单引号链接与实体", () => {
  const html = `<!DOCTYPE NETSCAPE-Bookmark-file-1><DL><p><DT><H3>书签栏</H3><DL><p>
    <DT><H3>✨ AI 工具</H3><DL><p><DT><H3>AI 办公</H3><DL><p>
    <DT><A HREF='https://gamma.app/?a=1&amp;b=2'>Gamma &amp; 合成</A></DL><p></DL><p></DL><p></DL><p>`;
  const parsed = parseBookmarks(html);
  assert.deepEqual(parsed, [{ url: "https://gamma.app/?a=1&b=2", title: "Gamma & 合成", folders: ["书签栏", "✨ AI 工具", "AI 办公"] }]);
});

test("导入兼容全部 11 个新分类的 48 个子分类，无分类填充标签", () => {
  const target = empty();
  const metadata = {};
  const bookmarks = [];
  data.categories.forEach((category, index) => category.subcategories.forEach((subcategory, subindex) => {
    const host = `category-${index}-${subindex}.example.test`;
    metadata[host] = { name: `Fixture ${index}`, description: "合成资源", tags: ["内容甲", "内容乙", category.name, subcategory], aliases: [], pricing: "free" };
    bookmarks.push(bookmark(`https://${host}/`, `◇ ${category.name}`, subcategory));
  }));
  const result = importBookmarks(target, bookmarks, { metadata, importDate: "2026-10-02" });
  assert.equal(result.added.length, 48);
  assert.equal(result.skipped.length, 0);
  assert.deepEqual(new Set(result.added.map((entry) => entry.category)), new Set(data.categories.map((entry) => entry.name)));
  assert.ok(result.added.every((entry) => JSON.stringify(entry.tags) === JSON.stringify(["内容甲", "内容乙"])));
  assert.deepEqual(validate(target), []);
});

test("临时网页任意层级、旧子分类、未知元数据和无效 URL 均跳过", () => {
  const target = empty();
  const inputs = [
    { ...bookmark("https://gamma.app/", "AI 工具", "AI 办公"), folders: ["临时网页", "AI 工具", "AI 办公"] },
    { ...bookmark("https://gamma.app/", "AI 工具", "AI 办公"), folders: ["书签栏", "◇ 临时网页", "AI 工具", "AI 办公"] },
    bookmark("https://gamma.app/", "AI 工具", "AI 设计工具"), bookmark("https://unknown.example.test/"),
    bookmark("javascript:alert(1)"), bookmark("https://codexcn.com/"),
  ];
  const result = importBookmarks(target, inputs);
  assert.equal(result.added.length, 0);
  assert.equal(result.skipped.length, inputs.length);
  assert.equal(target.meta.updatedAt, "2000-01-01");
});

test("规范 URL 去重并保留既有 ID、slug、URL、收藏标识和核验日期", () => {
  const target = empty();
  target.sites.push({ ...site("https://fixture.example.test/"), verifiedAt: "2000-01-01" });
  const before = target.sites[0];
  const result = importBookmarks(target, [bookmark("http://www.fixture.example.test/?utm_source=test#x", "AI 工具", "AI 办公"),
    bookmark("https://fixture.example.test", "AI 工具", "AI 办公")], { importDate: "2026-10-02" });
  assert.equal(target.sites.length, 1);
  assert.equal(result.added.length, 0);
  assert.deepEqual(result.updated, ["site-001"]);
  assert.equal(target.sites[0], before);
  assert.equal(before.url, "https://fixture.example.test/");
  assert.equal(before.slug, "site-001");
  assert.equal(before.verifiedAt, "2000-01-01");
  assert.deepEqual(before.tags, ["写作", "AI"]);
});

test("单一主机的语言主页可匹配，同域不同页面或多资源主机不误合并", () => {
  const target = empty();
  target.sites.push(site("https://single.example.test/zh/"));
  const result = importBookmarks(target, [bookmark("https://single.example.test/", "AI 工具", "AI 办公"), bookmark("https://single.example.test/account")]);
  assert.equal(result.updated.length, 1);
  assert.equal(result.skipped.length, 1);
  assert.equal(target.sites.length, 1);
  const shared = empty();
  shared.sites.push(site("https://shared.example.test/", "site-001"), site("https://shared.example.test/project", "site-002"));
  assert.equal(importBookmarks(shared, [bookmark("https://shared.example.test/en/")]).skipped.length, 1);
  assert.equal(shared.sites.length, 2);
});

test("已审核元数据采用清理后的标签别名，限制同域其他功能页面", () => {
  const target = empty();
  const result = importBookmarks(target, [bookmark("https://gamma.app/", "AI 工具", "AI 办公"), bookmark("https://gamma.app/account", "AI 工具", "AI 办公")]);
  assert.equal(result.added.length, 1);
  assert.equal(result.skipped.length, 1);
  assert.deepEqual(target.sites[0].tags, ["AI", "演示文稿", "文档"]);
  assert.deepEqual(target.sites[0].aliases, ["Gamma AI"]);
  assert.deepEqual(validate(target), []);
  assert.ok(!NEW_SITE_METADATA["tympanus.net"].paths.includes("/codrops/other"));
});

test("新增合成资源去重、保留有意义的查询参数且生成唯一 ID/slug", () => {
  const target = empty();
  const metadata = { "query.example.test": { name: "Fixture", description: "合成资源", tags: ["AI", "写作"], aliases: [], pricing: "free" } };
  const result = importBookmarks(target, [bookmark("https://query.example.test/?v=1"), bookmark("https://query.example.test/?v=1&utm_source=test"), bookmark("https://query.example.test/?v=2")], { metadata });
  assert.equal(result.added.length, 2);
  assert.equal(new Set(target.sites.map((entry) => entry.id)).size, 2);
  assert.equal(new Set(target.sites.map((entry) => entry.slug)).size, 2);
  assert.deepEqual(validate(target), []);
});
