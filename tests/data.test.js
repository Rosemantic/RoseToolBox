const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const data = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "sites.json"), "utf8"));

test("保留原有站点并导入新版书签", () => {
  assert.equal(data.sites.length, 121);
  assert.equal(data.categories.length, 7);
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
