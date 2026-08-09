const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const workflowPath = path.join(root, ".github", "workflows", "deploy-pages.yml");

test("GitHub Pages 工作流会测试、构建并部署 dist", () => {
  assert.ok(fs.existsSync(workflowPath), "缺少 GitHub Pages 工作流");
  const workflow = fs.readFileSync(workflowPath, "utf8");
  assert.match(workflow, /branches:\s*\n\s*- main/);
  assert.match(workflow, /actions\/configure-pages@v5/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
  assert.match(workflow, /SITE_URL: \$\{\{ steps\.pages\.outputs\.base_url \}\}/);
  assert.match(workflow, /path: \.\/dist/);
});

test("部署产物包含 GitHub Pages 静态站点标记", () => {
  assert.ok(fs.existsSync(path.join(root, "dist", ".nojekyll")));
  const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
  assert.match(gitignore, /^dist\/$/m);
});
