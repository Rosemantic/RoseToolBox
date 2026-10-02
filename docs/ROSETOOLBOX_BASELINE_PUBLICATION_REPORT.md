# RoseToolBox P0.2 Baseline Publication Report

日期：2026-10-02（Asia/Shanghai）。本报告记录 P0.1 技术基线的发布及对应 GitHub 工作流结果。

## 1. Scope

P0.2 授权将已经完成的本地基线以普通 push 发布到 `origin/main`，核验远端结果与自动工作流，并将本报告作为独立文档 commit 提交和推送。

**ROSETOOLBOX V2 NOT STARTED**。未创建 v2 分支，未修改站点数据、分类、书签、UI、站点文案、发布配置、依赖或工作流。未 force-push、rebase、merge、改写 P0.1 commit，未创建 tag 或 Release，也未手动触发部署。

## 2. Pre-push State

执行 `git fetch origin` 后核对：

| 项目 | 实测结果 |
|---|---|
| Branch | `main` |
| Local HEAD | `6f023ef415ed2e53afcbf58af183d0472d5698d0` |
| Pre-push `origin/main` | `4a9d27c39ace5d5a47973cea4cc524bc45071b02` |
| Ahead / behind | 1 / 0 |
| Worktree | clean；`git status --short` 为空 |
| origin fetch / push | [https://github.com/Rosemantic/RoseToolBox.git](https://github.com/Rosemantic/RoseToolBox.git) |
| sharp | `0.35.4` |

预检 PASS：远端没有移动，实际状态符合 P0.2 指定基线。推送前再次用 `git ls-remote origin refs/heads/main` 核对旧远端 SHA，仍为 `4a9d27c...`。

## 3. Pre-push Verification

本轮重新执行全部六项发布前检查：

| 命令 | Exit | 实际结果 |
|---|---:|---|
| `npm audit` | 0 | 0 vulnerabilities |
| `npm audit --omit=dev` | 0 | 0 vulnerabilities |
| `npm test` | 0 | 23 passed / 0 failed / 0 skipped |
| `npm run validate` | 0 | PASS：121 sites / 7 categories |
| `npm run build` | 0 | PASS：121 sites / 7 categories |
| `npm run release-check -- --allow-placeholders` | 0 | PASS：0 errors / 2 个已知非阻塞 warnings |

检查后工作区仍干净。开始时的 157 个 tracked 文件 SHA-256 全部不变；构建只重建已忽略的 `dist`。

## 4. Push Result

实际命令：

```bash
git push origin main
```

命令成功，Git 输出：

```text
4a9d27c..6f023ef  main -> main
```

随后执行 `git fetch origin`、两端 `rev-parse`、ahead/behind、`ls-remote` 和 worktree 检查。基线发布核验时间为 2026-10-02 13:38:28 +08:00。

| 项目 | 基线发布后的实际结果 |
|---|---|
| Published P0.1 baseline | `6f023ef415ed2e53afcbf58af183d0472d5698d0` |
| Local HEAD | `6f023ef415ed2e53afcbf58af183d0472d5698d0` |
| Post-push `origin/main` | `6f023ef415ed2e53afcbf58af183d0472d5698d0` |
| GitHub `refs/heads/main` | 同一 SHA，`git ls-remote` 已确认 |
| Ahead / behind | 0 / 0 |
| Worktree | clean；`git status --short` 为空 |

**BASELINE PUSHED TO ORIGIN/MAIN**。

本报告作为 `docs: record rosetoolbox baseline publication` 独立提交，直接跟随已发布的 P0.1 技术基线；不 amend 技术基线。按 P0.2 约定，本报告不嵌入包含自身的 commit hash；最终文档 commit hash 和最终同步状态在 Codex 最终回复中记录。

## 5. GitHub Workflow Result

通过 GitHub API 按已推送 commit SHA 与 `event=push` 查阅实际 runs，并检查 jobs/steps。工作流状态核验时间为 2026-10-02 13:39:53 +08:00。

| 工作流 | Status | Conclusion | Commit SHA | 阻塞判断 |
|---|---|---|---|---|
| [Deploy RoseTools to GitHub Pages · run 36969842246](https://github.com/Rosemantic/RoseToolBox/actions/runs/36969842246) | completed | success | `6f023ef415ed2e53afcbf58af183d0472d5698d0` | 无阻塞；现有 workflow 自动完成 |
| Check external links | 本次 push 未触发 | 不适用 | 本次无对应 push run | 非阻塞；仅配置 `schedule` 和 `workflow_dispatch` |

Pages run 的两个 jobs 均已完成：

- [build](https://github.com/Rosemantic/RoseToolBox/actions/runs/36969842246/job/110721322879)：completed / success。依赖安装、测试、Pages 配置、构建和 artifact 上传步骤全部成功。
- [deploy](https://github.com/Rosemantic/RoseToolBox/actions/runs/36969842246/job/110721376135)：completed / success。现有自动 Pages 部署步骤成功。

没有修改工作流，也没有手动运行链接巡检或部署。未将无关的定时巡检作为本次基线回归判断。

## 6. Known Non-blocking Warnings

| Warning | 原因 | 判定与本轮处理 |
|---|---|---|
| 本地 `siteUrl` 未配置 | 现有本地配置为空；本轮本地检查未注入 `SITE_URL` | **NON-BLOCKING FOR V2 DEVELOPMENT**；保留原配置，未填假地址。现有 Pages 工作流使用 Pages 配置提供实际 `SITE_URL` |
| 121 个 sites 没有 `verifiedAt` | 既有数据没有人工核验日期，页面显示“待核验” | **NON-BLOCKING FOR V2 DEVELOPMENT**；未批量补写或伪造日期 |

两项在允许 placeholders 的本地 release-check 中都是 warning，error 数为 0。

## 7. Gate

本地六项发布前检查全部通过，P0.1 基线已经以普通 push 发布且远端 SHA 确认一致，对应 Pages build/deploy 已成功。没有已知发布阻塞项。

**ROSETOOLBOX V2 NOT STARTED**。

**BASELINE PUBLISHED — READY TO PREPARE ROSETOOLBOX V2**
