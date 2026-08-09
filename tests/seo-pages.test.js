const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");
const data = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "sites.json"), "utf8"));

test("每个资源都有可索引的静态详情页", () => {
  for (const site of data.sites) {
    const file = path.join(distRoot, "tools", site.slug, "index.html");
    assert.ok(fs.existsSync(file), `${site.slug} 缺少详情页`);
    const page = fs.readFileSync(file, "utf8");
    assert.match(page, new RegExp(`<h1>${site.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h1>`));
    assert.match(page, /"@type":"(?:WebApplication|SoftwareApplication)"/);
    assert.match(page, /class="static-breadcrumb"/);
    assert.match(page, /href="\.\.\/\.\.\/style\.css"/);
    assert.doesNotMatch(page, /\sonclick=/i);
  }
});

test("每个分类都有 ItemList 静态落地页", () => {
  const categoryRoot = path.join(distRoot, "category");
  const pages = fs.readdirSync(categoryRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  assert.equal(pages.length, data.categories.length);
  for (const entry of pages) {
    const page = fs.readFileSync(path.join(categoryRoot, entry.name, "index.html"), "utf8");
    assert.match(page, /"@type":"CollectionPage"/);
    assert.match(page, /"@type":"ItemList"/);
    assert.match(page, /class="site-grid category-page-grid"/);
  }
});
