# RoseToolBox Baseline Cleanup Report

执行日期：2026-10-02（Asia/Shanghai）。范围：Baseline 阻塞项诊断、条件满足后的 Logo 恢复、只读依赖审计、基线复验和本报告；未开始 v2。

## 1. 基线信息

| 项目 | 实际结果 |
|---|---|
| 本地项目路径 | 仓库根目录（本机路径已省略） |
| Branch | `main` |
| HEAD | `4a9d27c39ace5d5a47973cea4cc524bc45071b02` |
| Commit 描述 | `4a9d27c Add indexable resource pages and optimize discovery` |
| origin（fetch / push） | [https://github.com/Rosemantic/RoseToolBox.git](https://github.com/Rosemantic/RoseToolBox.git) |
| `origin/main` | `4a9d27c39ace5d5a47973cea4cc524bc45071b02`，与 HEAD 一致 |
| GitHub 当前 `refs/heads/main` | `git ls-remote` 实测同一 commit |

## 2. Git 状态

### 开始时

```text
## main...origin/main
 M src/assets/Logo.svg
```

### Logo.svg 的真实原因

执行了文档指定的 `git diff`、`git diff --ignore-space-at-eol` 和 `git check-attr -a`。普通 diff 显示 79 行替换；忽略行尾差异后没有内容 diff，带 `--exit-code` 的检查返回 0。属性为 `text: set`、`eol: lf`。

`git ls-files --eol` 实测：

```text
i/crlf  w/crlf  attr/text eol=lf  src/assets/Logo.svg
```

仓库 HEAD 和 index 中的 Logo blob 本身保存了 CRLF；工作区文件的原始字节与该 blob 完全一致。Git 按显式 `text eol=lf` 规则计算工作区内容时会规范化为 LF，因此得到不同的 blob hash：

| 对象 | Git blob hash |
|---|---|
| HEAD、index、工作区 `--no-filters` | `8d8d5cabd532a124f01c0fa5aeeae8be34359087` |
| 工作区应用仓库属性后的 hash | `51cb8b94983dad6187f452bcdee007a9678bc5d7` |

这说明异常来自已提交 CRLF blob 与当前属性规则的不一致，并非实际 SVG 内容变化。Git 官方文档说明，显式 `text` 会启用 LF 规范化；只有属性未指定时才由 `core.autocrlf` 决定是否转换。[Git 属性与行尾规范](https://git-scm.com/docs/gitattributes/2.50.0#_text)

### 实际处理与结果

在确认没有内容变化后执行：

```bash
git restore --source=HEAD --worktree -- src/assets/Logo.svg
```

命令返回 0，但后续 `git status --short` 仍显示 `M src/assets/Logo.svg`。使用仅对单次命令生效的 `-c core.autocrlf=false` 和 `-c core.autocrlf=input` 诊断，`git diff --quiet` 都返回 1；显式属性规则仍然生效。没有持久修改 Git 配置或属性，也没有暂存、提交 Logo 换行变化。

恢复并完成所有复验后，本轮开始时的 155 个受版本控制文件 SHA-256 全部保持一致；其中包括 Logo、`sites.json`、`site-config.json`、`package.json` 和 lockfile。

### 保存报告后的最终状态

```text
 M src/assets/Logo.svg
?? docs/ROSETOOLBOX_BASELINE_CLEANUP_REPORT.md
```

工作区不干净。报告按要求保存在项目 `docs` 下；由于本轮禁止 commit，报告保留为未跟踪文件。报告文件本身不属于 v2 产品修改，但按严格 Git clean 条件仍必须计入最终状态。

## 3. Dependency Audit

| 项目 | 结果 |
|---|---|
| 漏洞 package | `sharp@0.35.3`，影响范围 `<0.35.4` |
| Severity | High；npm 共报告 1 项高危、0 项其他等级漏洞 |
| Direct / transitive | npm 标记为 direct；底层缺陷来自 sharp 包含的 libheif 原生组件 |
| Production / dev | 直接 `devDependency`；项目没有生产 npm dependencies |
| 本机组件版本 | `require('sharp').versions` 显示 sharp `0.35.3`、heif `1.23.0` |
| `npm audit` | Exit 1；1 high severity vulnerability |
| `npm audit --omit=dev` | Exit 0；`found 0 vulnerabilities` |
| 是否进入静态部署产物 | 否；下文列出项目证据 |
| 官方修复版本 | sharp `>=0.35.4`；维护者建议使用包含 libheif `1.23.2` 的修复版本 |
| Breaking change | `0.35.3 → 0.35.4` 是补丁升级，符合现有 `^0.35.3` 范围；无需跨越 minor/major。该发行说明未列出 breaking change，但本轮未升级，未验证实际兼容性 |
| 本轮处理 | 仅分析；未执行任何 `npm audit fix`，未升级依赖 |

官方公告指出，漏洞涉及处理不可信图像输入，特定条件下可在基于 glibc 的 Linux 上导致代码执行；不能因它属于 devDependency 就视作漏洞已修复。[sharp 维护者安全公告](https://github.com/lovell/sharp/security/advisories/GHSA-rgj7-g3m4-5g8c)

修复建议为另行安排并验证 sharp `0.35.4` 或符合项目约束的更高修复版本；npm 本次建议普通 `npm audit fix`，不要求 `--force`。本轮仅记录建议。[sharp v0.35.4 发行说明](https://github.com/lovell/sharp/releases/tag/v0.35.4)

### 项目使用范围与风险判断

- 源码搜索显示，sharp 的导入和调用仅在 `scripts/optimize-icons.js` 中，供手动图标优化使用；本轮未运行该脚本。
- `npm test`、validate、build 和 release-check 不调用图标优化。现有 GitHub Pages 工作流也只安装、测试、构建并上传 `dist`。
- build 脚本复制静态源码、浏览器 vendor 文件和图标，并生成静态 HTML/数据；没有复制 `node_modules` 或打包 sharp。
- 最终 `dist` 实测 263 个文件，0 个 `.node` / `.dll` / `.so` 文件，0 个 `node_modules` 目录。

据上述实际调用与产物范围判断，此漏洞不进入当前静态站点的浏览器运行时，不作为当前 v2 静态开发的独立 Gate 阻塞。漏洞仍留在本地/CI 开发依赖中；后续若运行图标优化处理不可信图片，应先安排依赖修复与验证。排除 dev 后审计为 0 不能代替完整审计通过。

## 4. Baseline Warnings

| Warning | 原因 | 开发判定 | 本轮为何不处理 |
|---|---|---|---|
| `siteUrl` 未填写 | HEAD 中既有的 `src/data/site-config.json` 为 `siteUrl: ""`；本地构建未提供 `SITE_URL` | **NON-BLOCKING FOR V2 DEVELOPMENT** | 当前为本地开发；正式发布需要真实地址。现有 Pages 工作流会从 Pages 配置提供 `SITE_URL`，本轮不编造地址 |
| 121 个站点未填写 `verifiedAt` | 当前数据没有站点人工核验日期；release-check 实测 0 个已核验，页面显示“待核验” | **NON-BLOCKING FOR V2 DEVELOPMENT** | 这是既有内容维护状态。本轮没有人工核验站点，不批量补写或伪造日期 |

两项都是仓库既有提示。`--allow-placeholders` 模式下它们是 warning，不产生 error；本轮没有改变配置或核验数据。

## 5. Verification Results

本轮在 Logo restore 后重新顺序执行了以下全部命令。

| 命令 | Exit | Passed / failed | Error 数 | Warning 数 |
|---|---:|---|---:|---|
| `npm test` | 0 | 23 passed / 0 failed；0 skipped | 0 | 0；pretest 构建另有 siteUrl 配置提示 |
| `npm run validate` | 0 | Passed：121 sites / 7 categories | 0 | 0 |
| `npm run build` | 0 | Passed：121 sites / 7 categories | 0 | 0；另有 1 条 siteUrl 配置提示 |
| `npm run release-check -- --allow-placeholders` | 0 | Passed | 0 | 2：siteUrl、verifiedAt |

同时重新执行 `git status`、`git log -1 --oneline`、`git remote -v`，核对本地 HEAD、`origin/main` 和 GitHub 当前 main 一致。保存报告后再次确认 Git 状态及报告副本一致。

## 6. Final Decision

**NOT READY FOR ROSETOOLBOX V2**

未满足的 Acceptance 条件是 **Git working tree clean**：

1. `src/assets/Logo.svg` 仍被 Git 标记为 modified。HEAD/index 中的 CRLF blob 与当前显式 LF 规则冲突；restore 和单次 autocrlf 配置诊断均不能消除它。
2. 要求保存的 `docs/ROSETOOLBOX_BASELINE_CLEANUP_REPORT.md` 为新增未跟踪文件；在禁止 commit 且保留报告的当前要求下，它也使最终 Git 状态不干净。

其他验收项已满足：HEAD 一致；没有提交 Logo 换行；高危来源及范围已明确；tests、validate、build 全部通过；release-check 无 error；两项 warning 已标记为非开发阻塞；没有任何 v2 修改。

最小后续决策是明确如何处理已提交 Logo blob 与属性规则的冲突，以及报告如何交付才能兼容严格 clean 要求。当前授权没有包含提交或调整仓库属性规则，本轮保留真实结果并停止。

项目报告：`docs/ROSETOOLBOX_BASELINE_CLEANUP_REPORT.md`。
