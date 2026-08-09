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
