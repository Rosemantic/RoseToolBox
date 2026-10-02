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

const approvedP21Urls = [
  "https://www.100font.com/", "https://wallhaven.cc/hot?page=7", "https://toolwa.com/",
  "https://xiaoyi.vc/", "https://www.landing.love/", "https://www.lapa.ninja/",
  "https://www.edclub.com/", "https://www.zhijianshang.com/colosseum/",
  "https://gpt-image2.canghe.ai/", "https://www.hvoyai.com/", "https://www.bootstrapmb.com/",
  "https://mars-coder.cn/", "https://www.jiejoe.com/home", "https://88api.ai/", "https://www.evolai.cn/",
];

test("P2.1 批准资源和已审核公开深链接采用固定分类、规范主页且幂等", () => {
  const target = empty();
  target.sites.push(site("https://seed.example.test/", "site-400"));
  const inputs = approvedP21Urls.map((url) => ({ url, title: "旧目录合成书签", folders: ["书签栏", "临时网页"] }));
  const first = importBookmarks(target, inputs, { importDate: "2026-10-02" });
  assert.equal(first.added.length, 15);
  assert.equal(first.skipped.length, 0);
  assert.deepEqual(first.added.map((entry) => entry.id), approvedP21Urls.map((_, index) => "site-" + (401 + index)));
  for (const entry of first.added) {
    assert.equal(new URL(entry.url).pathname, "/");
    assert.equal(new URL(entry.url).search, "");
    assert.equal(entry.featured, false);
    assert.equal(entry.verifiedAt, undefined, "导入器不得自动补核验日期");
  }
  assert.equal(first.added.find((entry) => entry.name === "edclub").subcategory, "学习平台");
  assert.equal(first.added.find((entry) => entry.name === "小羿").subcategory, "软件发现");
  assert.equal(first.added.find((entry) => entry.name === "火星编程导航").subcategory, "学习平台");
  const before = JSON.stringify(target);
  const second = importBookmarks(target, [...inputs, ...first.added.map((entry) => bookmark(entry.url))], { importDate: "2026-10-03" });
  assert.equal(second.added.length, 0);
  assert.equal(second.updated.length, 0);
  assert.equal(second.skipped.length, 0);
  assert.equal(JSON.stringify(target), before);
  assert.deepEqual(validate(target), []);
});

test("88API 钱包始终跳过，Evol 邀请/推荐参数不保留，仅干净主页可导入", () => {
  const target = empty();
  const inputs = [
    bookmark("https://88api.ai/wallet"), bookmark("https://88api.ai/"),
    bookmark("https://www.evolai.cn/?inviteCode=synthetic-only#/"), bookmark("https://www.evolai.cn/"),
    bookmark("https://www.evolai.cn/?ref=synthetic-only"), bookmark("https://88api.ai/login"),
  ];
  const result = importBookmarks(target, inputs);
  assert.deepEqual(result.added.map((entry) => entry.url), ["https://88api.ai/", "https://www.evolai.cn/"]);
  assert.equal(result.skipped.length, 4);
  assert.doesNotMatch(JSON.stringify(target), /inviteCode|synthetic-only|\/wallet|\/login/);
  const before = JSON.stringify(target);
  assert.equal(importBookmarks(target, inputs).added.length, 0);
  assert.equal(JSON.stringify(target), before);
});

test("3 个官方迁移保留身份与分类，旧新入口重复导入不与 Framer 建站工具合并", () => {
  const target = empty();
  const pairs = [
    ["site-001", "https://chat.openai.com/", "https://chatgpt.com/"],
    ["site-006", "https://kimi.moonshot.cn/", "https://www.kimi.com/"],
    ["site-020", "https://www.framer.com/motion/", "https://motion.dev/"],
  ];
  target.sites.push(...pairs.map(([id, from]) => ({ ...site(from, id), featured: true, verifiedAt: "2000-01-01" })), site("https://www.framer.com/", "site-034"));
  const before = structuredClone(target.sites);
  const first = importBookmarks(target, pairs.map(([, from]) => bookmark(from, "AI 工具", "AI 办公")), { importDate: "2026-10-02" });
  assert.equal(first.added.length, 0);
  assert.deepEqual(first.updated, pairs.map(([id]) => id));
  assert.deepEqual(target.sites, before.map((entry, index) => index < 3 ? { ...entry, url: pairs[index][2], updatedAt: "2026-10-02" } : entry));
  const stable = JSON.stringify(target);
  const second = importBookmarks(target, pairs.flatMap(([, from, to]) => [bookmark(from), bookmark(to)]), { importDate: "2026-10-03" });
  assert.equal(second.added.length, 0);
  assert.equal(second.updated.length, 0);
  assert.equal(JSON.stringify(target), stable);
  assert.equal(importBookmarks(target, [bookmark("https://www.framer.com/motion/other")]).skipped.length, 1);
});

test("迁移缺少原 ID 时保守跳过，不凭相似域名创建或重命名站点", () => {
  const target = empty();
  target.sites.push(site("https://chat.openai.com/", "site-999"));
  const before = JSON.stringify(target);
  const result = importBookmarks(target, [bookmark("https://chatgpt.com/")]);
  assert.equal(result.added.length, 0);
  assert.equal(result.updated.length, 0);
  assert.equal(result.skipped.length, 1);
  assert.equal(JSON.stringify(target), before);
});

test("P2 排除的 E/F/G 与 Variant 暂缓项仍排除，既有 GitHub/Aibiye 不被订单或个人页改变", () => {
  const target = empty();
  target.sites.push(site("https://github.com/", "site-021"), site("https://www.aibiye.com/", "site-080"));
  const urls = [
    "https://plusgpt.vip/cat/recommend", "https://88api.ai/wallet", "https://www.aibiye.com/result?orderNo=synthetic-only",
    "https://github.com/synthetic-only?tab=repositories", "https://www.evolai.cn/?inviteCode=synthetic-only",
    "https://sss.ulrr.cn/login.html", "https://sdk.buybuygpt.shop/activate", "https://codexcn.com/", "https://gen.paramore.su/",
    "https://mh.yichengwlkj.com/pc", "https://kk.yusucai.cn/", "https://app.wckmsc.com/", "https://www.xuanyu168.net/",
    "https://xz.nmslb.com/", "https://variant.com/",
  ];
  const before = JSON.stringify(target);
  const result = importBookmarks(target, urls.map((url) => bookmark(url)));
  assert.equal(result.added.length, 0);
  assert.equal(result.updated.length, 0);
  assert.equal(result.skipped.length, urls.length);
  assert.equal(JSON.stringify(target), before);
});

test("批准主机也不放宽未知路径、业务参数、凭据与非 HTTP URL", () => {
  const target = empty();
  const urls = ["https://wallhaven.cc/other", "https://wallhaven.cc/hot?account=synthetic-only", "https://www.jiejoe.com/account",
    "https://88api.ai/?token=synthetic-only", "https://synthetic-only@88api.ai/", "javascript:alert(1)"];
  const result = importBookmarks(target, urls.map((url) => bookmark(url)));
  assert.equal(result.added.length, 0);
  assert.equal(result.skipped.length, urls.length);
  assert.equal(importBookmarks(target, [bookmark("https://wallhaven.cc/?utm_source=synthetic-only#top")]).added[0].url, "https://wallhaven.cc/");
});
