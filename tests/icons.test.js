const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const iconScript = fs.readFileSync(path.join(root, "scripts", "sync-icons.js"), "utf8");
const optimizeScript = fs.readFileSync(path.join(root, "scripts", "optimize-icons.js"), "utf8");

test("图标同步脚本使用源站并缓存为本地资源", () => {
  assert.match(iconScript, /discoverIconUrls/);
  assert.match(iconScript, /src["\s,]+["']assets["\s,]+["']icons/);
  assert.match(iconScript, /site\.icon = relativeIcon/);
  assert.match(iconScript, /assertSafeRemoteUrl/);
  assert.match(iconScript, /icon\.horse\/icon/);
  assert.doesNotMatch(iconScript, /google\.com\/s2\/favicons/i);
});

test("图标同步帮助命令无需网络即可运行", () => {
  const result = spawnSync(process.execPath, ["scripts/sync-icons.js", "--help"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /--refresh/);
});

test("所有站点都配置了存在于项目内的图标文件", () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src", "data", "sites.json"), "utf8"));
  for (const site of data.sites) {
    assert.match(site.icon || "", /^icons\/[a-z0-9-]+\.(?:gif|ico|jpg|png|svg|webp)$/);
    assert.ok(
      fs.existsSync(path.join(root, "src", "assets", site.icon)),
      `${site.name} 的图标文件不存在：${site.icon}`,
    );
  }
});

test("图标可重复优化且资源总量保持精简", () => {
  assert.match(optimizeScript, /\.webp\(\{ lossless: true/);
  assert.match(optimizeScript, /extractDibFromIco/);
  const iconFiles = fs.readdirSync(path.join(root, "src", "assets", "icons"));
  const totalBytes = iconFiles.reduce(
    (sum, file) => sum + fs.statSync(path.join(root, "src", "assets", "icons", file)).size,
    0,
  );
  assert.ok(totalBytes < 350 * 1024, `图标总量过大：${totalBytes} B`);
});
