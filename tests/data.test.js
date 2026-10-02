const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "sites.json"), "utf8"));

test("P1 保留现有站点并采用新分类", () => {
  assert.equal(data.sites.length, 121);
  assert.equal(data.categories.length, 11);
  for (const name of ["Gamma", "Lovart", "Meshy", "Stitch", "Godly"]) {
    assert.ok(data.sites.some((site) => site.name === name), `缺少新版资源 ${name}`);
  }
});

test("所有站点都有新版字段和有效分类", () => {
  const categories = new Map(data.categories.map((item) => [item.name, new Set(item.subcategories)]));
  const fields = ["id", "slug", "name", "url", "category", "subcategory", "description", "tags", "aliases", "pricing", "platforms", "featured", "updatedAt"];
  data.sites.forEach((site) => {
    fields.forEach((field) => assert.ok(Object.hasOwn(site, field), `${site.name} 缺少 ${field}`));
    assert.ok(categories.has(site.category), `${site.name} 分类无效`);
    assert.ok(categories.get(site.category).has(site.subcategory), `${site.name} 子分类无效`);
    assert.match(site.url, /^https?:\/\//);
    assert.match(site.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
    if (site.verifiedAt != null) assert.match(site.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(site.tags.length > 0);
    assert.ok(site.platforms.length > 0);
  });
});

test("ID、slug 和 URL 均唯一", () => {
  for (const key of ["id", "slug", "url"]) {
    const values = data.sites.map((site) => site[key]);
    assert.equal(new Set(values).size, values.length, `${key} 存在重复`);
  }
});

test("首页包含精选与不同价格类型", () => {
  assert.ok(data.sites.filter((site) => site.featured).length >= 6);
  assert.deepEqual(new Set(data.sites.map((site) => site.pricing)), new Set(["free", "freemium", "paid"]));
});

test("P1 完整保留基线 121 个 ID、slug 和 URL", () => {
  const baseline = require("./fixtures/p1-baseline-sites.json");
  assert.deepEqual(data.sites.map(({ id, slug, url }) => ({ id, slug, url })), baseline);
});

test("分类精确采用 P1 的 11 类 48 子分类，图标是有效数据字段", () => {
  const expected = [
    ["AI 工具", ["对话助手", "AI 编程", "AI 视觉", "AI 3D", "AI 办公", "Prompt 与 AI 资源"]],
    ["开发编程", ["代码与托管", "开发环境", "前端框架与库", "UI 组件", "动画交互", "开发文档", "代码实验"]],
    ["设计创作", ["UI/UX 与原型", "网站搭建", "在线设计", "图像处理", "配色工具", "Logo 与品牌"]],
    ["素材资源", ["图标", "字体", "图库", "壁纸", "综合素材", "模板素材"]],
    ["灵感参考", ["网页灵感", "品牌与 Logo", "设计社区", "视觉灵感"]],
    ["效率工具", ["笔记写作", "思维整理", "在线工具", "截图与辅助"]],
    ["软件资源", ["软件发现", "软件下载", "插件与扩展"]],
    ["网络与服务", ["网络工具", "API 服务", "云与在线服务"]],
    ["影音娱乐", ["视频平台", "短视频", "音乐平台"]],
    ["学习与知识", ["学术写作", "翻译语言", "学习平台"]],
    ["导航发现", ["综合导航", "AI 导航", "开发导航"]],
  ];
  assert.deepEqual(data.categories.map(({ name, subcategories }) => [name, subcategories]), expected);
  for (const category of data.categories) {
    assert.equal(typeof category.icon, "string");
    assert.ok(category.icon.trim().length > 0);
    assert.ok([...category.icon].length <= 4);
    assert.doesNotMatch(category.icon, /[<>&\p{C}]/u);
  }
});

test("规范 URL、标签和别名无重复，不机械复制分类", () => {
  const { canonicalUrl, normalizeText } = require("../src/discovery.js");
  assert.equal(new Set(data.sites.map((site) => canonicalUrl(site.url))).size, data.sites.length);
  const categories = data.categories.map(({ name }) => normalizeText(name));
  for (const site of data.sites) {
    for (const key of ["tags", "aliases"]) {
      assert.equal(new Set(site[key].map(normalizeText)).size, site[key].length, `${site.name} ${key} 重复`);
      assert.ok(site[key].every((value) => value.trim() && value === value.trim()));
    }
    assert.ok(site.tags.length >= 2 && site.tags.length <= 5);
    assert.ok(site.tags.every((tag) => ![...categories, normalizeText(site.subcategory)].includes(normalizeText(tag))));
  }
});

test("构建校验拒绝无效图标、重复列表、分类冗余标签和规范 URL 重复", () => {
  const { validate } = require("../scripts/build.js");
  assert.deepEqual(validate(data), []);
  const cases = [
    [(copy) => { copy.categories[0].icon = ""; }, /icon/],
    [(copy) => { copy.sites[0].tags.push(copy.sites[0].tags[0].toLowerCase()); }, /tags 存在重复/],
    [(copy) => { copy.sites[0].aliases = ["Alt", "ＡＬＴ"]; }, /aliases 存在重复/],
    [(copy) => { copy.sites[0].tags.push(copy.sites[0].subcategory); }, /不能机械复制/],
    [(copy) => { copy.sites[1].url = copy.sites[0].url + "?utm_source=fixture"; }, /规范 URL 重复/],
  ];
  for (const [mutate, expected] of cases) {
    const copy = structuredClone(data);
    mutate(copy);
    assert.ok(validate(copy).some((error) => expected.test(error)));
  }
});
