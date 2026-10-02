# RoseToolBox V2 P2.1 Bookmark Import Report

Date: 2026-10-02

## 1. Baseline

- Repository: `D:\Rose Workspace\02 Projects\Active\RoseToolBox`
- Branch: `dev/v2`; starting worktree clean.
- Starting commit / P2 audit commit: `9a8159028c2a13262f9ed0bc3ee98c3f99971212`
- P1 local commit: `325e19079123a272d5677dc14fbdf9a1f430dcd7`
- main and origin/main baseline: `bf443dae06949017a0261f97b4690592d6f4fbd5`
- Starting data: 121 sites / 11 categories / 48 subcategories; dev/v2 was 2 commits ahead of main.
- Authoritative metadata/decision source: `docs/ROSETOOLBOX_V2_P2_BOOKMARK_AUDIT_REPORT.md`; SHA-256 `62ee62e8389c8abef6b91db2934470b02552b45aef8ba4127761604126ab54f6`. The report is unchanged.
- P2 imported no resources. P2.1 used an explicit clean selection; the complete source bookmark HTML was not imported and its hash remains unchanged.

## 2. User Import Decision

按用户要求执行 P2.1 文档中的批准范围：C 类 7 项全部批准；D 类 7 项批准，但 Variant 必须先取得足够的公开价格证据。另批准 88API 与 Evol 的干净主页。G 类继续暂缓；E/F 类继续排除；只迁移 ChatGPT、Kimi、Framer Motion 三个既有网址。

实际导入 C 7 项、D 6 项、干净主页 2 项，共 15 项。Variant 单独暂缓，未猜测价格，也未加入替代资源凑到 137。保留即梦AI、Midjourney 的主页以及独立的 Framer 建站工具。

## 3. Imported Resources

13 项 C/D 元数据沿用 P2 提案，未作风格改写。所有新增条目 featured=false、updatedAt=2026-10-02；ID 按原最大值 121 之后连续分配。仅 88API/Evol 的精确主页及身份在本阶段重新核实，故只有这两项填写 verifiedAt。其他 13 项不填，页面诚实显示待核验。

| ID | Name | Canonical URL | Category / Subcategory | Tags | Aliases | Pricing | Platforms | verifiedAt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `site-122` | 100font | [https://www.100font.com/](https://www.100font.com/) | 素材资源 / 字体 | 免费商用、中文字体、字体授权 | 100font.com | `free` | `web` | absent |
| `site-123` | Wallhaven | [https://wallhaven.cc/](https://wallhaven.cc/) | 素材资源 / 壁纸 | 桌面壁纸、高清图片、摄影 | Wallhaven.cc | `free` | `web` | absent |
| `site-124` | 工具哇 | [https://toolwa.com/](https://toolwa.com/) | 效率工具 / 在线工具 | 文字处理、图片处理、音频编辑、开发 | ToolWa、工具蛙 | `free` | `web` | absent |
| `site-125` | 小羿 | [https://xiaoyi.vc/](https://xiaoyi.vc/) | 软件资源 / 软件发现 | 应用推荐、Windows、macOS、使用技巧 | [] | `free` | `web` | absent |
| `site-126` | Landing Love | [https://www.landing.love/](https://www.landing.love/) | 灵感参考 / 网页灵感 | 网页设计、动效、案例 | landing.love | `free` | `web` | absent |
| `site-127` | Lapa Ninja | [https://www.lapa.ninja/](https://www.lapa.ninja/) | 灵感参考 / 网页灵感 | 落地页、网页设计、案例、学习 | [] | `freemium` | `web` | absent |
| `site-128` | edclub | [https://www.edclub.com/](https://www.edclub.com/) | 学习与知识 / 学习平台 | 打字练习、语言学习、数字素养、教育 | [] | `freemium` | `web` | absent |
| `site-129` | 指尖上 | [https://www.zhijianshang.com/](https://www.zhijianshang.com/) | 灵感参考 / 视觉灵感 | 360全景、VR、旅行、建筑 | [] | `free` | `web` | absent |
| `site-130` | GPT-Image2 Prompt Gallery | [https://gpt-image2.canghe.ai/](https://gpt-image2.canghe.ai/) | AI 工具 / Prompt 与 AI 资源 | Prompt、图像生成、视觉创作、模板 | [] | `freemium` | `web` | absent |
| `site-131` | 禾维 AI | [https://www.hvoyai.com/](https://www.hvoyai.com/) | 网络与服务 / 网络工具 | API检测、服务评测、延迟监测 | Hvoy AI | `free` | `web` | absent |
| `site-132` | Bootstrap模板库 | [https://www.bootstrapmb.com/](https://www.bootstrapmb.com/) | 素材资源 / 模板素材 | HTML模板、Bootstrap、前端组件 | BootstrapMB | `freemium` | `web` | absent |
| `site-133` | 火星编程导航 | [https://mars-coder.cn/](https://mars-coder.cn/) | 学习与知识 / 学习平台 | 编程学习、项目实战、学习路线 | Mars Coder | `freemium` | `web` | absent |
| `site-134` | JIEJOE | [https://www.jiejoe.com/](https://www.jiejoe.com/) | 灵感参考 / 视觉灵感 | 作品集、动效、视频剪辑、摄影 | [] | `free` | `web` | absent |
| `site-135` | 88API | [https://88api.ai/](https://88api.ai/) | 网络与服务 / API 服务 | API、模型接口、Token、AI服务 | [] | `paid` | `web` | 2026-10-02 |
| `site-136` | Evol | [https://www.evolai.cn/](https://www.evolai.cn/) | AI 工具 / AI 编程 | Agent、远程开发、Claude Code、Codex | [] | `freemium` | `web` | 2026-10-02 |

新增可读 slug，顺序对应上表：`100font`、`wallhaven`、`toolwa`、`xiaoyi`、`landing-love`、`lapa-ninja`、`edclub`、`zhijianshang`、`gpt-image2-prompt-gallery`、`hvoy-ai`、`bootstrapmb`、`mars-coder`、`jiejoe`、`88api`、`evol`。

88API 的 [官方主页](https://88api.ai/) 描述 AI 模型接口服务，[公开定价页](https://88api.ai/pricing) 显示按量及按任务计费，公开 FAQ 说明输入、输出和调用量收费。基于其服务收费方式映射为 paid；未推断免费试用、余额或实际账户状态。

Evol 的 [官方主页](https://www.evolai.cn/) 展示远端 Claude Code、Codex 等 Agent 的通信工作空间。[服务条款](https://www.evolai.cn/terms)（页面更新日 2026-09-10）8.1 明确基础 IM 免费，8.2 说明部分附加功能收费，因此映射为 freemium。未执行页面中的安装命令、登录或支付。

## 4. Existing URL Migrations

| ID / Name | Old URL | New URL | Identity |
| --- | --- | --- | --- |
| `site-001` / ChatGPT | `https://chat.openai.com/` | `https://chatgpt.com/` | 原 ID / slug `chatgpt` / 顺序 / 分类 / 名称保留 |
| `site-006` / Kimi | `https://kimi.moonshot.cn/` | `https://www.kimi.com/` | 原 ID / slug `kimi` / 顺序 / 分类 / 名称保留 |
| `site-020` / Framer Motion | `https://www.framer.com/motion/` | `https://motion.dev/` | 原 ID / slug `framer-motion` / 顺序 / 分类 / 名称保留 |

三项 updatedAt 均为实际数据修改日 2026-10-02；原数据恰已使用同一天，故日期字段无额外文本差异。未因 URL 迁移补 verifiedAt。对原 121 项逐字段比较：仅这三个 URL 和授权的更新时间允许变化，其他字段及原有图标完整保留。Framer Motion 与 site-034 Framer 建站工具仍是独立身份。

## 5. Deferred / Excluded

Variant：批准项中唯一暂缓资源。[公开定价入口](https://variant.com/pricing) 重定向到登录页；[官方条款](https://variant.com/terms-and-privacy) 只有一般付费/订阅说明，无法可靠确定当前产品应归 free、freemium 还是 paid。未登录，也未设置无效占位值。产品数据及导入元数据均不含 Variant。

| Class | Entry | Disposition |
| --- | --- | --- |
| E | ChatGPT PLUS purchase directory | 不导入购买目录 |
| E | 88API wallet page | 钱包入口不导入；另行批准的公开主页已导入 |
| E | Aibiye order result | 订单结果不导入；既有 Aibiye 不变 |
| E | Lil-TT repository-list temporary page | 个人仓库列表不导入；既有 GitHub 不变 |
| E | Evol invite URL | 邀请入口不导入；仅干净主页获单独批准 |
| E | 枭枭图库 login page | 登录入口不导入 |
| E | recharge / activation page | 充值/激活入口不导入 |
| F | codexcn ChatGPT Business Session handoff | 不导入会话交接入口 |
| F | GenP / Adobe crack | 不导入破解入口 |
| G | 人人视频 uncertain entry | 身份/入口不确定，继续暂缓 |
| G | 像素魔方 | 证据未闭合，继续暂缓 |
| G | 猫猫云 uncertain download-domain entry | 下载域名身份未确认，继续暂缓 |
| G | 炫宇 | 证据未闭合，继续暂缓 |
| G | 灵感素材社 / 享设计 uncertain relation | 站点关系未确认，继续暂缓 |

本报告不复制私人订单、邀请码或推荐参数值。E 类的两项主页例外不扩展到其他 E/F/G 条目。

## 6. Importer Changes

- 新增 15 项明确公开身份的导入元数据，固定规范 URL 与既有分类；仅这些批准身份可以覆盖薄弱的旧书签目录上下文。原 P1 未批准身份仍遵守目录/临时网页和元数据匹配限制。
- 公开深链白名单仅含 Wallhaven /hot（可去除分页参数）、指尖上 /colosseum、JIEJOE /home；都归一为批准的干净主页。其他未知同域路径及业务查询参数跳过。
- 钱包、订单、登录、账户、邀请、激活及凭据入口在匹配前跳过；Evol 的邀请/推荐链接直接跳过，不从私人链接创建资源。URL 用户信息也拒绝。CLI 只输出数量及新增公开名称，不输出原私人 URL。
- 3 个迁移为旧/新 URL 精确映射到原 ID；缺少相符原 ID 则跳过。更新规范 URL 与两个索引，保留身份、分类和独立 Framer 建站工具。
- 新 ID 在当前最大值之后分配；slug 唯一且可读；规范 URL 去重，保留 P1 的有意义查询参数规则。导入器不会自动填写 verifiedAt。
- 实际产品导入重复执行于数据副本：新增 0、更新 0，数据完全不变；合成测试另验证旧/新入口混合重复、最大 ID 为 400 的分配及分类稳定。

## 7. Counts

| Metric | Before | After / Change |
| --- | --- | --- |
| Sites | 121 | 136 |
| Additions | 0 | 15 |
| Deletions | 0 | 0 |
| Existing URL migrations | 0 | 3 |
| Categories | 11 | 11 |
| Subcategories | 48 | 48 |
| Approved candidate deferred | 0 | 1 (Variant) |

导入后全部分类计数（总和 136）：

| Category | Sites |
| --- | --- |
| AI 工具 | 23 |
| 开发编程 | 18 |
| 设计创作 | 13 |
| 素材资源 | 24 |
| 灵感参考 | 17 |
| 效率工具 | 9 |
| 软件资源 | 4 |
| 网络与服务 | 7 |
| 影音娱乐 | 10 |
| 学习与知识 | 7 |
| 导航发现 | 4 |

导入后全部 48 个子分类计数（包括空子分类；总和 136）：

| Category | Subcategory | Sites |
| --- | --- | --- |
| AI 工具 | 对话助手 | 6 |
| AI 工具 | AI 编程 | 5 |
| AI 工具 | AI 视觉 | 6 |
| AI 工具 | AI 3D | 1 |
| AI 工具 | AI 办公 | 1 |
| AI 工具 | Prompt 与 AI 资源 | 4 |
| 开发编程 | 代码与托管 | 1 |
| 开发编程 | 开发环境 | 1 |
| 开发编程 | 前端框架与库 | 0 |
| 开发编程 | UI 组件 | 9 |
| 开发编程 | 动画交互 | 5 |
| 开发编程 | 开发文档 | 1 |
| 开发编程 | 代码实验 | 1 |
| 设计创作 | UI/UX 与原型 | 2 |
| 设计创作 | 网站搭建 | 2 |
| 设计创作 | 在线设计 | 2 |
| 设计创作 | 图像处理 | 3 |
| 设计创作 | 配色工具 | 2 |
| 设计创作 | Logo 与品牌 | 2 |
| 素材资源 | 图标 | 4 |
| 素材资源 | 字体 | 4 |
| 素材资源 | 图库 | 3 |
| 素材资源 | 壁纸 | 4 |
| 素材资源 | 综合素材 | 5 |
| 素材资源 | 模板素材 | 4 |
| 灵感参考 | 网页灵感 | 9 |
| 灵感参考 | 品牌与 Logo | 1 |
| 灵感参考 | 设计社区 | 3 |
| 灵感参考 | 视觉灵感 | 4 |
| 效率工具 | 笔记写作 | 2 |
| 效率工具 | 思维整理 | 1 |
| 效率工具 | 在线工具 | 4 |
| 效率工具 | 截图与辅助 | 2 |
| 软件资源 | 软件发现 | 1 |
| 软件资源 | 软件下载 | 2 |
| 软件资源 | 插件与扩展 | 1 |
| 网络与服务 | 网络工具 | 4 |
| 网络与服务 | API 服务 | 2 |
| 网络与服务 | 云与在线服务 | 1 |
| 影音娱乐 | 视频平台 | 6 |
| 影音娱乐 | 短视频 | 1 |
| 影音娱乐 | 音乐平台 | 3 |
| 学习与知识 | 学术写作 | 2 |
| 学习与知识 | 翻译语言 | 3 |
| 学习与知识 | 学习平台 | 2 |
| 导航发现 | 综合导航 | 2 |
| 导航发现 | AI 导航 | 1 |
| 导航发现 | 开发导航 | 1 |

## 8. Tests & Validation

| Command | Result |
| --- | --- |
| `npm audit` | PASS · exit 0 · 0 vulnerabilities |
| `npm audit --omit=dev` | PASS · exit 0 · 0 vulnerabilities |
| `npm test` | PASS · exit 0 · 57 passed / 0 failed / 0 skipped |
| `npm run validate` | PASS · exit 0 · 136 sites / 11 categories |
| `npm run build` | PASS · exit 0 · 136 sites / 11 categories |
| `npm run release-check -- --allow-placeholders` | PASS · exit 0 · 0 errors / 2 honest warnings |
| `git diff --check` | PASS · exit 0 |

两种原有非阻塞警告保留：siteUrl 尚未配置正式站点地址；134 项未填 verifiedAt（2 项本阶段已核验）。未补造日期或站点地址。

首次 npm test 有 1 项失败：旧图标检查要求所有条目必须有本地图标，与本任务允许新增资源使用既有首字回退相冲突。调整检查后重新执行 npm test，57 项全部通过：原 121 项仍强制图标文件存在；新增缺图标条目则验证实际构建详情页的首字回退。未改图标资源或抓取器。

显式数据核验通过：ID、slug、canonical URL 均唯一；15 项干净主页无私有路径/参数；E/F/G 及 Variant 未进入产品数据；11/48 分类定义逐字段不变；原 121 项未删、未重排、未重命名。165 个原跟踪文件中，仅 6 个授权代码/数据/测试文件变化，其余 159 个 SHA-256 完全相同；新增本报告为第 7 个变更文件。原始书签 HTML 哈希未变。

## 9. Manual UI Verification

在真实 Codex 内置浏览器打开 `http://127.0.0.1:4173/`，本地开发服务器仅绑定 127.0.0.1。以下均来自实际页面交互及 DOM/截图，不把源码或单元测试充当 UI 证据。

| Scenario | Observed result |
| --- | --- |
| 首页与分类计数 | 首页 136 个精选资源；全部分类计数与第 7 节一致；分批列表显示 24 / 136 |
| 新名称搜索 | 100font、Wallhaven、小羿、edclub、88API、Evol 各返回正确的唯一资源 |
| 多关键词 AND | Prompt 图像生成 → 仅 GPT-Image2 Prompt Gallery |
| 详情标签 | 点击 Prompt 标签 → 5 项，包括新增 Prompt Gallery；搜索词被清除 |
| 热门标签 | 点击 网页设计 → 13 项，包括 Landing Love、Lapa Ninja |
| 分类筛选 | 学习与知识 → 7 项，包括 edclub、火星编程导航 |
| 弹层及独立详情 | edclub、Landing Love、88API、Evol：两种详情都实际打开，信息、3 项相关推荐与规范外链可见 |
| 学习推荐 | edclub → 火星编程导航 / Aibiye / 中国知网；实际点击火星编程导航进入其独立详情页 |
| 设计推荐 | Landing Love → Awwwards / Godly / Lapa Ninja |
| API 推荐 | 88API → PackyAPI / BootCDN / 禾维 AI |
| Agent 推荐 | Evol → Cursor / Qoder / Trae |
| 既有网址迁移 | ChatGPT / Kimi / Framer Motion 详情的访问按钮 href 分别为三个批准新网址 |
| 新资源外链 | 上述 4 个新资源的弹层及独立详情访问按钮 href 精确匹配第 3 节干净主页 |
| 桌面 1280 × 900 | 可用宽度及 scrollWidth 均为 1265；无横向溢出 |
| 窄屏 390 × 844 | 首页可用宽度及 scrollWidth 均为 375；单列卡片正常换行；Evol 详情宽度与 scrollWidth 均为 390，边界 0..390，无横向溢出 |
| 浏览器控制台 | 该本地预览页未记录 error / warn；临时视口覆盖已恢复 |

访问按钮核验的是页面中真实 href；没有通过登录验证第三方账户功能。所有外部调研仅查看公开主页/定价/条款，未登录、支付或执行下载。截图保存于本次任务 outputs，浏览器预览页保留供用户查看。

## 10. Changed Files

| File | Purpose |
| --- | --- |
| `scripts/import-bookmarks.js` | 15 项批准元数据、公开路径白名单、私有入口排除和三处稳定身份迁移 |
| `src/data/sites.json` | 追加 15 项；迁移 3 项 canonical URL；两项真实 verifiedAt |
| `tests/data.test.js` | 136 项验收、基线身份/顺序保留、批准迁移及排除检查 |
| `tests/discovery.test.js` | 空搜索结果数量跟随实际数据，不固定旧 121 |
| `tests/importer.test.js` | 幂等、私有入口、旧新迁移、未批准项和同域保守匹配测试 |
| `tests/icons.test.js` | 原图标检查保留，新增资源验证既有首字回退 |
| `docs/ROSETOOLBOX_V2_P2_1_BOOKMARK_IMPORT_REPORT.md` | 本阶段决策、数据、验证、实际 UI 和 Gate 记录 |

完整 diff 已审查，无 UI 重设、分类变化、依赖升级、图标刷新、既有条目删除或其他文件改动。P2.1 按要求使用一次本地提交；提交 SHA 在最终交付回执中记录，避免为写入自身 SHA 再创建第二次提交。

## 11. Remaining Work

阻塞项：无。Variant 证据不足属于用户明确允许的单项暂缓，不阻止其余批准资源验收。

非阻塞后续：Variant 当前公开价格仍需足够证据；G 类 5 项仍待更强身份/关系证据及未来决定；15 项新图标可在后续定向润色，当前实际使用既有首字回退；134 项待核验标签和正式 siteUrl 待未来对应任务处理。上述后续均未在本阶段展开。

Git 边界：仅在 dev/v2 本地提交；main 保持基线；不 Push、不 Merge、不创建 PR/tag/release、不部署。

## 12. Gate

P2.1 ACCEPTED — BOOKMARK IMPORT COMPLETE

121 → 136；新增 15；既有 canonical URL 更新 3；Variant 暂缓。所有必需检查及实际本地 UI 验证通过。

NO EXISTING SITE DELETED

G ENTRIES NOT IMPORTED

NOT PUSHED
