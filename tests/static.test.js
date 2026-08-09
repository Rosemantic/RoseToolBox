const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");
const html = fs.readFileSync(path.join(distRoot, "index.html"), "utf8");
const script = fs.readFileSync(path.join(distRoot, "script.js"), "utf8");

test("页面不依赖外部 CDN", () => {
  assert.doesNotMatch(html, /cdn\.tailwindcss|cdnjs\.cloudflare|font-awesome/i);
  assert.match(html, /href="style\.css"/);
  assert.match(html, /src="vendor\/gsap\.min\.js"/);
  assert.match(html, /src="vendor\/ScrollTrigger\.min\.js"/);
});

test("页面包含基础 SEO 与无障碍入口", () => {
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /rel="manifest"/);
  assert.match(html, /location\.protocol === "http:"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /aria-live="polite"/);
});

test("交互不使用内联事件或数据 innerHTML", () => {
  assert.doesNotMatch(html, /\sonclick=/i);
  assert.doesNotMatch(script, /\.innerHTML\s*=/);
});

test("SEO 和部署辅助文件存在", () => {
  for (const file of ["robots.txt", "sitemap.xml", "manifest.webmanifest", "Logo.svg", "og-image.png", "site-config.js", ".nojekyll"]) {
    assert.ok(fs.existsSync(path.join(distRoot, file)), `${file} 不存在`);
  }
});

test("发布配置集中管理且开发模式检查可通过", () => {
  assert.match(html, /src="site-config\.js"/);
  assert.match(html, /id="feedback-link"/);
  assert.match(html, /id="og-image"[^>]+og-image\.png/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(script, /site\.icon && isSafeLocalAsset\(site\.icon\)/);
  assert.match(script, /wrapper\.className = "site-icon"/);
  assert.doesNotMatch(script, /wrapper\.className = "site-icon is-fallback"/);
  assert.doesNotMatch(script, /new URL\("\/favicon\.ico"/);
  assert.doesNotMatch(script, /google\.com\/s2\/favicons/i);
  assert.doesNotMatch(html, /feedback@rosetools\.local/);
  assert.ok(fs.existsSync(path.join(root, "scripts", "release-check.js")));
  const result = spawnSync(process.execPath, ["scripts/release-check.js", "--allow-placeholders"], {
    cwd: root,
    encoding: "utf8",
  });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

test("动画资源本地化并支持减少动态效果", () => {
  const animationScript = fs.readFileSync(path.join(distRoot, "animations.js"), "utf8");
  const css = fs.readFileSync(path.join(distRoot, "style.css"), "utf8");
  for (const file of ["vendor/gsap.min.js", "vendor/ScrollTrigger.min.js"]) {
    assert.ok(fs.existsSync(path.join(distRoot, file)), `${file} 不存在`);
  }
  assert.match(animationScript, /registerPlugin\(ScrollTrigger\)/);
  assert.match(animationScript, /prefers-reduced-motion: reduce/);
  assert.match(animationScript, /rosetools-motion/);
  assert.match(animationScript, /motionStatus/);
  assert.match(animationScript, /dataset\.motion = "complete"/);
  assert.match(html, /id="motion-toggle"/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const reducedMotionCss = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.match(reducedMotionCss, /html\[data-motion="reduced"\]/);
  assert.doesNotMatch(reducedMotionCss, /html\[data-motion="ready"\]/);
  assert.doesNotMatch(animationScript, /\b(?:width|height|top|left):\s*[-\d]/);
});

test("场景合集与工具详情支持分享和键盘交互", () => {
  const animationScript = fs.readFileSync(path.join(distRoot, "animations.js"), "utf8");
  assert.match(html, /id="collection-grid"/);
  assert.match(html, /<dialog[^>]+id="site-detail-dialog"/);
  assert.match(html, /aria-labelledby="detail-title"/);
  assert.match(script, /const COLLECTIONS = \[/);
  assert.match(script, /params\.set\("collection"/);
  assert.match(script, /searchParams\.set\("tool"/);
  assert.match(script, /dialog\.showModal\(\)/);
  assert.match(script, /addEventListener\("cancel"/);
  assert.match(script, /event\.key === "Escape" && \$\("#site-detail-dialog"\)\.open/);
  assert.match(animationScript, /function detailOpened/);
  assert.match(animationScript, /function detailClosed/);
});

test("首页分批渲染资源并提供可访问的静态详情链接", () => {
  assert.match(html, /id="load-more"[^>]+aria-controls="results-grid"/);
  assert.match(script, /const RESULT_PAGE_SIZE = 24/);
  assert.match(script, /filtered\.slice\(0, visibleResultCount\)/);
  assert.match(script, /link\.href = `tools\/\$\{encodeURIComponent\(site\.slug\)\}\/`/);
  assert.match(script, /createSiteFeedbackUrl/);
});
