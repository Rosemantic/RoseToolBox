# RoseToolBox P0.1 Baseline Finalization Report

日期：2026-10-02（Asia/Shanghai）。本报告更新当前 Gate；此前 cleanup 报告继续作为历史证据。

## 1. Scope

本轮授权：仅规范化 `src/assets/Logo.svg` 的行尾；将 sharp 升级到指定修复补丁 `0.35.4`；保留并删除历史报告中的本机交付路径；创建本报告；技术检查通过后创建一个本地 baseline commit，并最终保持工作区干净。

**ROSETOOLBOX V2 NOT STARTED**。未修改站点数据、分类、书签、UI 或站点文案。未修改 `.gitattributes` 或用户/全局 Git 配置。只允许本地提交；**NOT PUSHED**。

## 2. Starting Baseline

| 项目 | 实测值 |
|---|---|
| Branch | `main` |
| Starting HEAD | `4a9d27c39ace5d5a47973cea4cc524bc45071b02` |
| `origin/main` | `4a9d27c39ace5d5a47973cea4cc524bc45071b02` |
| origin | [Rosemantic/RoseToolBox](https://github.com/Rosemantic/RoseToolBox.git) |

开始时 `git status --short --untracked-files=all`：

```text
 M src/assets/Logo.svg
?? docs/ROSETOOLBOX_BASELINE_CLEANUP_REPORT.md
```

预检 PASS：没有其他 tracked/untracked 改动，分支和 HEAD 均符合指定基线。未创建分支。

## 3. Logo Normalization

原因为 HEAD/index 保存 CRLF blob，而已有属性 `*.svg text eol=lf` 要求文本规范化为 LF。

执行并检查：

```bash
git diff -- src/assets/Logo.svg
git diff --ignore-space-at-eol --exit-code -- src/assets/Logo.svg
git check-attr -a -- src/assets/Logo.svg
git ls-files --eol -- src/assets/Logo.svg
git add --renormalize -- src/assets/Logo.svg
git diff --cached -- src/assets/Logo.svg
git diff --cached --ignore-space-at-eol --exit-code -- src/assets/Logo.svg
```

忽略行尾差异的工作区和 staged diff 均返回 0。仅此文件被 renormalize。工作区随后仅将 79 个 CRLF 改为 LF，与已经验证的 staged LF blob 逐字节相同，并刷新该文件的 index 记录。没有语义 SVG 改动。

| 对象 | Blob hash |
|---|---|
| 原始 HEAD CRLF blob | `8d8d5cabd532a124f01c0fa5aeeae8be34359087` |
| 规范化后的 LF blob | `51cb8b94983dad6187f452bcdee007a9678bc5d7` |

最终行尾检查：

```text
i/lf    w/lf    attr/text eol=lf      src/assets/Logo.svg
```

`.gitattributes` 保持原样；未持久修改任何 Git 行尾配置。

附加 `git diff --cached --check` 将 Logo 原有的三处带制表符空行报告为 trailing whitespace。原始 HEAD 与 staged blob 在仅替换 CRLF 后逐字节一致，因此保留这些原有内容；其余四个文件的空白检查通过。

## 4. Dependency Fix

执行指定命令：

```bash
npm install --save-dev sharp@0.35.4
npm ls sharp
npm audit
npm audit --omit=dev
```

| 项目 | 结果 |
|---|---|
| sharp 旧版本 | `0.35.3`；manifest 为 `^0.35.3` |
| sharp 新版本 | 实际安装 `0.35.4`；manifest 为 `^0.35.4` |
| npm 修改文件 | `package.json`、`package-lock.json` |
| 改动范围 | manifest 仅改变 sharp；lockfile 仅改变 sharp、`@img/sharp-*` 配套平台/原生包及根依赖声明；无无关包升级 |
| 原生组件 | heif `1.23.0 → 1.23.2` |
| `npm audit` | Exit 0；0 vulnerabilities |
| `npm audit --omit=dev` | Exit 0；0 vulnerabilities |
| 原先 sharp high vulnerability | 已关闭；没有新审计漏洞 |

未运行 `npm audit fix` 或 `--force`。另以内存中的合成 PNG 验证新 sharp 的旋转、缩放和无损 WebP 输出，结果 PASS（4×4 WebP）；未运行会写入真实图标和站点数据的图标维护脚本。

## 5. Verification

### 提交前

| 命令 | Exit | 结果 | Error / warning |
|---|---:|---|---|
| `npm test` | 0 | 23 passed / 0 failed / 0 skipped | 0 errors；pretest 有 siteUrl 配置提示 |
| `npm run validate` | 0 | PASS：121 sites / 7 categories | 0 errors / 0 warnings |
| `npm run build` | 0 | PASS：121 sites / 7 categories | 0 errors；1 条 siteUrl 配置提示 |
| `npm run release-check -- --allow-placeholders` | 0 | PASS | 0 errors / 2 warnings |

两项 release warning 均为 **NON-BLOCKING FOR V2 DEVELOPMENT**：本地 `siteUrl` 尚未配置，现有 121 个 sites 没有 `verifiedAt`。未伪造配置或核验日期。

初始 155 个 tracked 文件的 SHA-256 对比仅发现三个预期变化：Logo、manifest 和 lockfile；其余 152 个文件不变。

### 提交后

本地 commit 后按文档重新执行四项检查：

| 命令 | Exit | 实测结果 |
|---|---:|---|
| `npm test` | 0 | 23 passed / 0 failed / 0 skipped |
| `npm run validate` | 0 | PASS：121 sites / 7 categories |
| `npm run build` | 0 | PASS |
| `npm run release-check -- --allow-placeholders` | 0 | PASS：0 errors / 2 个已知非阻塞 warnings |

提交后 `git status --short --untracked-files=all` 为空；`git rev-list --left-right --count origin/main...HEAD` 为 `0 1`。报告补入实测结果后，按授权仅 amend 同一本地 commit 一次；amend 仅更新本报告，技术文件与已复验版本相同。

## 6. Git Diff Summary

本地 commit 仅允许包含以下五个文件：

| 文件 | 改动 |
|---|---|
| `src/assets/Logo.svg` | CRLF → LF；无语义改动 |
| `package.json` | sharp 修复补丁范围 |
| `package-lock.json` | sharp 及配套原生/平台包的锁定版本和完整性信息 |
| `docs/ROSETOOLBOX_BASELINE_CLEANUP_REPORT.md` | 保留历史技术结论，仅删除本机/聊天交付路径；原 `NOT READY` 结论保留 |
| `docs/ROSETOOLBOX_BASELINE_FINALIZATION_REPORT.md` | 本轮范围、检查和当前 Gate |

Commit message：`chore: finalize rosetoolbox baseline`。

## 7. Final Gate

**READY FOR ROSETOOLBOX V2 — LOCAL BASELINE FINALIZED**

提交前 Gate 为 `READY FOR BASELINE COMMIT`。提交后技术复验通过；最终 Git 状态要求为工作区干净，`main` 相对 `origin/main` ahead 1 / behind 0，且只有本报告列出的五个文件在该本地 commit 中。

`origin/main` 仍为 `4a9d27c39ace5d5a47973cea4cc524bc45071b02`。本地 commit 的直接 parent 为该基线；commit message 为 `chore: finalize rosetoolbox baseline`。历史 cleanup 报告保留原始 `NOT READY` 技术结论，本报告取代它作为当前 Gate。

**NOT PUSHED**。**ROSETOOLBOX V2 NOT STARTED**。

报告的最终 commit hash 若写入该 commit 自身包含的文件，会再次改变其 hash。因此，仓库报告记录验证结果，最终 hash 由仓库外的交付副本和最终回复记录；仓库报告中的当前提交标识可用 `git rev-parse HEAD` 获取。

项目内报告位置：`docs/ROSETOOLBOX_BASELINE_FINALIZATION_REPORT.md`。
