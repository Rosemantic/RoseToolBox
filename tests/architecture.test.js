const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");

test("源码、维护脚本与部署产物彼此分离", () => {
  for (const file of [
    "src/data/sites.json",
    "src/data/site-config.json",
    "scripts/build.js",
    "scripts/dev-server.js",
    "dist/index.html",
    "dist/sites-data.js",
  ]) {
    assert.ok(fs.existsSync(path.join(root, file)), `${file} 不存在`);
  }

  for (const file of [
    "sites.json",
    "site-config.json",
    "sync-data.js",
    "index.html",
    "dist/sites.json",
    "dist/site-config.json",
    "dist/package.json",
    "dist/README.md",
  ]) {
    assert.equal(fs.existsSync(path.join(root, file)), false, `${file} 不应出现在该位置`);
  }
});

test("本地服务器为站点图标返回正确图片类型", () => {
  const server = fs.readFileSync(path.join(root, "scripts", "dev-server.js"), "utf8");
  for (const type of ["image/png", "image/x-icon", "image/webp", "image/svg+xml"]) {
    assert.match(server, new RegExp(type.replace("+", "\\+")));
  }
  assert.match(server, /pathname\.endsWith\("\/"\)/);
  assert.match(server, /path\.join\(requestedPath, "index\.html"\)/);
});
