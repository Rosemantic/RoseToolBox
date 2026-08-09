# RoseTools

RoseTools 是一个面向设计师与开发者的精品资源导航站。项目使用原生 HTML、CSS 和 JavaScript，无框架、无账号系统、无数据库，可直接部署到任意静态托管平台。

首页提供场景合集、编辑精选、最近更新和完整资源筛选。点击资源卡片会打开站内工具详情抽屉，展示分类、价格、平台、标签、别名、最近核验时间与同类工具；详情通过 `tool` 参数分享，场景合集通过 `collection` 参数分享。

界面动画由本地 vendored GSAP 与 ScrollTrigger 驱动，不依赖运行时 CDN。动画只使用位移、缩放和透明度。默认跟随系统的“减少动态效果”设置；如系统已开启精简动效，也可以通过侧栏底部的动效开关明确启用完整动画。

## 本地预览

构建后可以通过 `file://` 双击打开 `dist/index.html`，页面会自动停用只适用于 HTTP 的 Web App Manifest。资源卡片默认使用本地生成的首字母图标，不会向第三方站点请求 favicon，因此离线预览时控制台也不会出现成批的 404、连接关闭或跨域错误。

更推荐双击 `启动本地预览.bat`，或在项目目录启动本地静态服务器：

```bash
npm run dev
```

默认地址为 `http://127.0.0.1:4173`。也可以使用 VS Code Live Server 或任意静态服务器。

## 文件结构

```text
RoseTools/
├─ src/                 页面源码、资源数据与本地依赖
│  ├─ data/             sites.json 与 site-config.json
│  ├─ assets/           Logo、分享图与可选站点图标
│  └─ vendor/           GSAP 与 ScrollTrigger
├─ scripts/             构建、导入、链接检查和本地服务器
├─ tests/               数据与静态页面测试
├─ dist/                自动生成的纯静态部署目录
├─ package.json
└─ README.md
```

`dist/` 可以直接上传到 GitHub Pages、Cloudflare Pages 或其他静态托管平台。不要直接编辑其中的文件，因为每次构建都会安全地重新生成该目录。

## 部署到 GitHub Pages

项目已包含 `.github/workflows/deploy-pages.yml`。推送到 `main` 分支后，GitHub Actions 会自动测试、构建 `dist/` 并发布；构建时会读取 GitHub Pages 的实际地址，自动生成正确的 canonical、Open Graph URL、`robots.txt` 和 `sitemap.xml`。

首次部署：

1. 在 GitHub 新建一个仓库，并把完整源码上传到仓库根目录。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 推送到 `main`，或在 **Actions → Deploy RoseTools to GitHub Pages** 中手动运行。
5. 部署完成后，网站地址会显示在工作流的 `deploy` 任务和仓库 Pages 设置中。

`dist/` 已加入 `.gitignore`，无需提交生成文件。Pages 工作流会在云端根据 `src/` 自动重新构建。

## 维护资源数据

`src/data/sites.json` 是唯一需要手动编辑的数据源。每次修改后运行：

```bash
npm run sync
```

构建会先校验必填字段、URL、分类、子分类、价格类型、平台、重复 ID、重复 slug 和重复 URL。校验失败时不会覆盖 `dist/`。

站点字段：

- `id`：稳定且唯一的内部标识。
- `slug`：唯一的 URL 友好标识，为后续独立详情页预留。
- `tags`、`aliases`：用于搜索、标签和中英文别名匹配。
- `pricing`：`free`、`freemium` 或 `paid`。
- `platforms`：`web`、`windows`、`macos`、`mobile` 中的一项或多项。
- `featured`：是否出现在首页编辑精选。
- `updatedAt`：`YYYY-MM-DD` 格式的内容更新时间。
- `verifiedAt`：可选的链接人工核验日期；未填写时详情页显示“待核验”，不会把内容更新时间冒充为核验时间。
- `icon`：可选的项目内图标相对路径（例如 `icons/figma.svg`）；不允许外部 URL，缺省时使用本地首字母图标。

仅检查数据、不重新生成文件：

```bash
npm run validate
```

也可以从 Chrome/Edge 导出的 Netscape 书签文件更新标签并导入新资源：

```bash
npm run import-bookmarks -- "C:\\path\\to\\bookmarks.html"
npm run sync
```

导入器会按两级书签文件夹映射分类与子分类，忽略“临时网页”和未纳入公开导航白名单的链接。新增站点需要先在 `scripts/import-bookmarks.js` 中补充名称、简介、标签与价格元数据。

## 发布前配置

在 `src/data/site-config.json` 中集中填写正式部署地址、反馈入口和 OG 分享图，例如：

```json
{
  "siteUrl": "https://example.com/rosetools/",
  "feedbackUrl": "https://github.com/example/rosetools/issues/new",
  "ogImage": "og-image.png"
}
```

随后运行 `npm run build`，脚本会重新生成整个 `dist/`，包括运行数据、站点配置、`sitemap.xml`、`robots.txt`、canonical、Open Graph URL 和分享图地址。未填写反馈地址时，页脚反馈入口会自动隐藏。

正式发布前运行严格检查：

```bash
npm run release-check
```

本地开发阶段可以允许域名与反馈地址暂时为空，但仍检查文件完整性：

```bash
npm run release-check -- --allow-placeholders
```

## 链接健康检查

以下命令只读取站点数据和远程链接，不会删除或修改任何资源：

```bash
npm run check-links
```

检查结果保存在 `reports/link-report-YYYY-MM-DD.json`。可以限制数量或调整并发：

```bash
node scripts/check-links.js --limit 10 --concurrency 4 --timeout 10000
```

## 验证

```bash
npm test
```

测试覆盖数据结构、重复项、静态页面依赖、安全渲染约束和关键 SEO 文件。发布前还应在真实域名上运行 Lighthouse，并用桌面、平板和 320px 手机视口检查交互。
