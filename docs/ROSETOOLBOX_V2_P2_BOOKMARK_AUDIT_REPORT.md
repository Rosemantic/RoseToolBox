# RoseToolBox V2 P2 — Bookmark Audit Report

审核日期：2026-10-02（Asia/Shanghai）。本报告是候选审核与元数据提案；候选字段没有写入产品数据。

## 1. Baseline

| 项目 | 核实结果 |
| --- | --- |
| 仓库 | `D:\Rose Workspace\02 Projects\Active\RoseToolBox` |
| 当前分支 | `dev/v2` |
| P1 本地提交 | `325e19079123a272d5677dc14fbdf9a1f430dcd7` — feat: establish rosetoolbox v2 taxonomy and discovery |
| P1 Gate | `P1 ACCEPTED — READY FOR BOOKMARK AUDIT/IMPORT` |
| main 基线 | `bf443dae06949017a0261f97b4690592d6f4fbd5` — docs: record rosetoolbox baseline publication |
| 审核开始工作区 | CLEAN；P1 已本地提交，未推送 |
| 产品基线 | 121 个站点 / 11 个顶级分类 / 48 个子类 |
| 书签来源 | `bookmarks_2026_9_30.html` |
| 原始文件路径 | `C:\Users\rose\Desktop\bookmarks_2026_9_30.html` |
| 本阶段范围 | 仅新增此审核报告，并创建一次本地文档提交；P2.1 须等待用户选择 |

## 2. Source Summary

| 指标 | 结果 |
| --- | --- |
| 原始 HTML 大小 | 129091 bytes |
| SHA-256 | `3905dd6869a55117a69ed8df0b6d0d4923ee6502ee994a8f4511671c67484b92` |
| 书签总数 | 148 |
| 文件夹节点 | 35（包括“书签栏”根节点） |
| 临时网页 | 13 条；非临时 135 条 |
| 规范化后唯一 URL | 148；文件内部规范 URL 完全重复组 0 |
| 规范化主机 | 144（小写、去 www；按 hostname 统计，保留其他子域名） |
| 相同主机、多路径的组 | 3 |
| 非根路径、查询参数或 hash 的原书签 | 28；该结构计数不等于一次性页面数 |
| 与当前数据精确规范 URL 匹配 | 118；仅同主机而未精确匹配 4；当前数据未知主机 26 |
| 最终明确的新候选域名 | 14（C+D 各 7）；另有 5 个 G 主机待核实身份 |

全文件按 Netscape 书签层级解析；另以原文件的链接标签数量交叉核对，均为 148 条。顺序编号 #1–#148 用于追溯。旧文件夹仅提供上下文，不直接决定 V2 分类。

原文件夹节点：`书签栏`、`✨ AI 工具`、`AI 对话助手`、`AI 编程工具`、`AI 设计工具`、`🔧 开发编程`、`代码托管`、`开发环境`、`前端框架/库`、`组件库`、`动画工具`、`开发文档`、`代码展示`、`🎨 设计创作`、`UI/UX 设计`、`在线设计`、`图像处理`、`配色工具`、`📦 素材资源`、`图标`、`字体`、`图库`、`壁纸`、`综合素材`、`LOGO 工具`、`⚡ 效率工具`、`实用工具`、`🌈 灵感与学习`、`设计灵感`、`学术写作`、`资源导航`、`🎬 影音娱乐`、`视频流媒体`、`音乐平台`、`临时网页`。

| 类 | 含义 | 数量 | 本阶段决定 |
| --- | --- | --- | --- |
| A | EXISTING | 115 | NO IMPORT |
| B | EXISTING_URL_REVIEW | 5 | NO IMPORT IN P2 |
| C | NEW_RECOMMENDED | 7 | RECOMMEND IMPORT（提案） |
| D | NEW_OPTIONAL | 7 | USER DECISION |
| E | SKIP_DUPLICATE_OR_ONE_TIME | 7 | SKIP |
| F | SKIP_SECURITY_OR_LEGAL_RISK | 2 | SKIP |
| G | NEEDS_USER_DECISION | 5 | ASK USER BEFORE IMPORT |
| 合计 | 每条恰好一个类别 | 148 | 未导入 |

推荐新增 7；可选 7；另有身份/入口未明确的 5 条待确认。可选及待确认合计 12，但 G 的 5 条不能计入可执行导入清单。跳过 9（E 7 + F 2），既有资源 120（A 115 + B 5）。

临时网页 13 条逐项处理：A 0 / B 0 / C 1 / D 3 / E 4 / F 1 / G 4。其中 edclub 属 C；Bootstrap模板库、火星编程导航、JIEJOE 属 D。其余依链接用途或证据不足跳过/暂缓，不按文件夹整体排除。

## 3. Audit Rules

- 复用 P1 的 URL 规范化规则与当前 121 条站点逐项比较；主机相同只是线索，具体路径代表的产品或资源必须单独判断。A 是本地匹配结论，未逐站重新验证 115 个既有网站的在线状态。
- 对新增、歧义和少量旧入口查看官方公开主页、跳转、关于页面及产品说明；无完整正文时只读公开 HTML 元信息或官网发布的页面脚本文本，必要时使用搜索返回的官网索引快照。索引快照可能早于审核日期，不能视作功能测试。
- 休闲、影音、网络服务、综合工具、个人作品集与学习资源均可有长期收藏价值。旧目录、第三方服务、付费、功能重叠和临时目录本身都不是 F 的理由。
- E 用于明确的订单/钱包/登录/充值激活/邀请入口或没有确定可复用资源的一次性页面。存在有用的平台主页时，在理由中区分平台与本次原链接。F 仅用于有具体依据的高权限账户凭据交付或未授权软件绕过用途。
- 用途、归属、规范入口或与既有条目的关系不明时用 G；不猜测镜像、替代域名、实际功能、免费层级或分类。明确用途而仅定价未齐的 Variant 保留 D，pricing 标为待确认，批准后仍须补齐。
- C/D 使用当前 P1 精确分类/子类名称，2–5 个有用平铺 tags；aliases 仅放可核实替代名称，缺少则为空。pricing 只描述拟收录的公开用途，platforms 统一为可观察的网页入口 web，featured 默认 false；不由软件介绍推断桌面下载平台。
- 未登录、支付、提交账户密钥、激活软件或执行下载文件；未绕过访问限制。仅调用书签解析与本地身份比较，没有运行真实导入，也没有增加来源、状态、评分、频率、收藏时间等产品字段。

证据边界：Wallhaven 首页直接抓取 403，依据官网/About 索引；工具哇直接超时，依据近期官网索引；JIEJOE 根站为脚本页面，作品用途由官网索引补充。火星编程导航部分页面为空/演示态，课程性质与付费信息来自其官网索引。codexcn 与 GenP 的判断含官网索引证据。以上均未验证登录后功能、可下载内容或服务承诺。

edclub 的课程与个人/学校版本通过浏览器实际读取；订阅金额未核定。GPT-Image2 的案例、复制、免费测试与积分会员信息来自站点元描述和公开页面脚本文本，未实际生成图像。Variant 只核实公开产品描述及服务条款，原 community 路径转到认证入口，免费额度与定价仍待确认。

完整表保留原书签标题、层级和 URL；仅 #118 的 orderNo、#137 的 inviteCode 参数值显示为 [REDACTED]，原始 HTML 未修改，也未访问这些带标识值的入口。未将收藏 ADD_DATE 或嵌入图标转成产品元数据。

## 4. Complete Bookmark Audit

A/B 的匹配列为既有条目；C/D 为拟议分类；G 未确认分类。URL 列是原书签 URL，后续拟议规范 URL 在第 5–9 节。

| # | 原书签名称 | 原 URL | 旧文件夹 | 类 | 既有匹配 / 拟议分类 | 决定 | 理由 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | ChatGPT | `https://chat.openai.com/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | B — EXISTING_URL_REVIEW | ChatGPT (`site-001`)；AI 工具 / 对话助手 | NO IMPORT IN P2 | 旧官方域名本次实际跳转到 chatgpt.com；同一产品，建议后续更新入口，不新增。 |
| 2 | Claude | `https://claude.ai/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | A — EXISTING | Claude (`site-002`)；AI 工具 / 对话助手 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 3 | Gemini | `https://gemini.google.com/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | A — EXISTING | Gemini (`site-003`)；AI 工具 / 对话助手 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 4 | DeepSeek | `https://www.deepseek.com/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | A — EXISTING | DeepSeek (`site-004`)；AI 工具 / 对话助手 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 5 | 豆包 | `https://www.doubao.com/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | A — EXISTING | 豆包 (`site-005`)；AI 工具 / 对话助手 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 6 | Kimi | `https://kimi.moonshot.cn/` | 书签栏 / ✨ AI 工具 / AI 对话助手 | B — EXISTING_URL_REVIEW | Kimi (`site-006`)；AI 工具 / 对话助手 | NO IMPORT IN P2 | 旧 Moonshot 域名本次实际跳转到 www.kimi.com；同一产品，建议后续更新入口，不新增。 |
| 7 | Cursor | `https://cursor.com/cn` | 书签栏 / ✨ AI 工具 / AI 编程工具 | A — EXISTING | Cursor (`site-007`)；AI 工具 / AI 编程 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 8 | Windsurf | `https://windsurf.com/` | 书签栏 / ✨ AI 工具 / AI 编程工具 | A — EXISTING | Windsurf (`site-008`)；AI 工具 / AI 编程 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 9 | Qoder | `https://qoder.com/` | 书签栏 / ✨ AI 工具 / AI 编程工具 | A — EXISTING | Qoder (`site-009`)；AI 工具 / AI 编程 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 10 | Trae | `https://trae.ai/` | 书签栏 / ✨ AI 工具 / AI 编程工具 | A — EXISTING | Trae (`site-010`)；AI 工具 / AI 编程 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 11 | Liblib | `https://www.liblib.art/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | Liblib (`site-011`)；AI 工具 / AI 视觉 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 12 | Huemint | `https://huemint.com/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | Huemint (`site-014`)；设计创作 / 配色工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 13 | 即梦AI - 一站式AI创作平台 | `https://jimeng.jianying.com/ai-tool/home/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | B — EXISTING_URL_REVIEW | 即梦AI (`site-012`)；AI 工具 / AI 视觉 | NO IMPORT IN P2 | 同一即梦产品的创作内页；原根域主页已核实，内页抓取失败，优先保留稳定根入口，后续再决定是否直达创作页。 |
| 14 | Explore | `https://www.midjourney.com/explore?tab=video_top` | 书签栏 / ✨ AI 工具 / AI 设计工具 | B — EXISTING_URL_REVIEW | Midjourney (`site-013`)；AI 工具 / AI 视觉 | NO IMPORT IN P2 | Explore 的 video_top 筛选列表不是独立网站；保留 Midjourney 主页，不另建 Explore 条目。 |
| 15 | 米你AI | `https://www.miai.pro/list` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | 米你AI (`site-097`)；AI 工具 / AI 视觉 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 16 | Gammas - Gamma | `https://gamma.app/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | Gamma (`site-098`)；AI 工具 / AI 办公 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 17 | Lovart：全球首个AI设计智能体 \| 自动化平面设计平台 | `https://www.lovart.ai/zh/home` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | Lovart (`site-099`)；AI 工具 / AI 视觉 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 18 | 建筑学长——千万建筑师的AI创作平台 | `https://www.jianzhuxuezhang.com/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | 建筑学长 (`site-100`)；AI 工具 / AI 视觉 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 19 | AI 3D 模型生成器：用文本和图片创建 3D \| Meshy | `https://www.meshy.ai/zh/?noRedirect=true` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | Meshy (`site-101`)；AI 工具 / AI 3D | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 20 | MotionSites AI — Official Premium AI Website Prompts | `https://motionsites.ai/` | 书签栏 / ✨ AI 工具 / AI 设计工具 | A — EXISTING | MotionSites (`site-102`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 21 | GitHub | `https://github.com/` | 书签栏 / 🔧 开发编程 / 代码托管 | A — EXISTING | GitHub (`site-015`)；开发编程 / 代码与托管 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 22 | VS Code | `https://code.visualstudio.com/` | 书签栏 / 🔧 开发编程 / 开发环境 | A — EXISTING | VS Code (`site-016`)；开发编程 / 开发环境 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 23 | ReactBits | `https://www.reactbits.dev/` | 书签栏 / 🔧 开发编程 / 前端框架/库 | A — EXISTING | ReactBits (`site-017`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 24 | Vue Bits | `https://vue-bits.dev/` | 书签栏 / 🔧 开发编程 / 前端框架/库 | A — EXISTING | Vue Bits (`site-018`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 25 | GSAP | `https://gsap.com/` | 书签栏 / 🔧 开发编程 / 前端框架/库 | A — EXISTING | GSAP (`site-019`)；开发编程 / 动画交互 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 26 | Framer Motion | `https://www.framer.com/motion/` | 书签栏 / 🔧 开发编程 / 前端框架/库 | B — EXISTING_URL_REVIEW | Framer Motion (`site-020`)；开发编程 / 动画交互 | NO IMPORT IN P2 | Framer 的旧 Motion 路径本次跳转到 motion.dev；这是动画库，与 Framer 建站产品保持独立。 |
| 27 | Inspira UI | `https://v1.inspira-ui.com/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | Inspira UI (`site-021`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 28 | Fancy Components | `https://www.fancycomponents.dev/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | Fancy Components (`site-022`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 29 | Uiverse | `https://uiverse.io/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | Uiverse (`site-023`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 30 | NavNav | `https://navnav.co/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | NavNav (`site-024`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 31 | 网页加载界面 - 旋转指示器、加载器和加载动画 | `https://loading-ui.com/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | Loading UI (`site-103`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 32 | 21st.dev — AI Agent Registry, UI Components &amp; Developer Tools for the Agentic Internet \| 21st | `https://21st.dev/home` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | 21st.dev (`site-104`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 33 | Originkit — Free Animated component library for modern websites | `https://www.originkit.dev/` | 书签栏 / 🔧 开发编程 / 组件库 | A — EXISTING | OriginKit (`site-105`)；开发编程 / UI 组件 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 34 | Lenis | `https://lenis.darkroom.engineering/` | 书签栏 / 🔧 开发编程 / 动画工具 | A — EXISTING | Lenis (`site-025`)；开发编程 / 动画交互 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 35 | LottieFiles | `https://lottiefiles.com/` | 书签栏 / 🔧 开发编程 / 动画工具 | A — EXISTING | LottieFiles (`site-026`)；开发编程 / 动画交互 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 36 | SVG路径动画 | `https://tools.ui-layouts.com/` | 书签栏 / 🔧 开发编程 / 动画工具 | A — EXISTING | SVG路径动画 (`site-027`)；效率工具 / 在线工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 37 | StringTune | `https://string-tune.fiddle.digital/` | 书签栏 / 🔧 开发编程 / 动画工具 | A — EXISTING | StringTune (`site-106`)；开发编程 / 动画交互 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 38 | MDN | `https://developer.mozilla.org/zh-CN/` | 书签栏 / 🔧 开发编程 / 开发文档 | A — EXISTING | MDN (`site-028`)；开发编程 / 开发文档 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 39 | BootCDN | `https://www.bootcdn.cn/` | 书签栏 / 🔧 开发编程 / 开发文档 | A — EXISTING | BootCDN (`site-029`)；网络与服务 / 云与在线服务 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 40 | Cursor Directory | `https://cursor.directory/` | 书签栏 / 🔧 开发编程 / 开发文档 | A — EXISTING | Cursor Directory (`site-030`)；AI 工具 / Prompt 与 AI 资源 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 41 | Cursor Rules CN | `https://cursorrulescn.cn/` | 书签栏 / 🔧 开发编程 / 开发文档 | A — EXISTING | Cursor Rules CN (`site-031`)；AI 工具 / Prompt 与 AI 资源 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 42 | CodePen | `https://codepen.io/` | 书签栏 / 🔧 开发编程 / 代码展示 | A — EXISTING | CodePen (`site-032`)；开发编程 / 代码实验 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 43 | Figma | `https://www.figma.com/` | 书签栏 / 🎨 设计创作 / UI/UX 设计 | A — EXISTING | Figma (`site-033`)；设计创作 / UI/UX 与原型 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 44 | Framer | `https://www.framer.com/` | 书签栏 / 🎨 设计创作 / UI/UX 设计 | A — EXISTING | Framer (`site-034`)；设计创作 / 网站搭建 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 45 | Webflow | `https://webflow.com/` | 书签栏 / 🎨 设计创作 / UI/UX 设计 | A — EXISTING | Webflow (`site-035`)；设计创作 / 网站搭建 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 46 | Canva | `https://www.canva.com/` | 书签栏 / 🎨 设计创作 / UI/UX 设计 | A — EXISTING | Canva (`site-036`)；设计创作 / 在线设计 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 47 | Stitch - Design with AI | `https://stitch.withgoogle.com/` | 书签栏 / 🎨 设计创作 / UI/UX 设计 | A — EXISTING | Stitch (`site-107`)；设计创作 / UI/UX 与原型 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 48 | 稿定 | `https://www.gaoding.com/` | 书签栏 / 🎨 设计创作 / 在线设计 | A — EXISTING | 稿定 (`site-037`)；设计创作 / 在线设计 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 49 | Remove.bg | `https://www.remove.bg/zh` | 书签栏 / 🎨 设计创作 / 图像处理 | A — EXISTING | Remove.bg (`site-038`)；设计创作 / 图像处理 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 50 | 佐糖 | `https://picwish.cn/` | 书签栏 / 🎨 设计创作 / 图像处理 | A — EXISTING | 佐糖 (`site-039`)；设计创作 / 图像处理 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 51 | D.design 抠图 | `https://d.design/toolbox/cutout` | 书签栏 / 🎨 设计创作 / 图像处理 | A — EXISTING | D.design 抠图 (`site-040`)；设计创作 / 图像处理 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 52 | HappyHues | `https://www.happyhues.co/` | 书签栏 / 🎨 设计创作 / 配色工具 | A — EXISTING | HappyHues (`site-041`)；设计创作 / 配色工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 53 | FontAwesome | `https://fontawesome.com.cn/` | 书签栏 / 📦 素材资源 / 图标 | A — EXISTING | FontAwesome (`site-042`)；素材资源 / 图标 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 54 | Lordicon | `https://lordicon.com/` | 书签栏 / 📦 素材资源 / 图标 | A — EXISTING | Lordicon (`site-043`)；素材资源 / 图标 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 55 | IconFinder | `https://www.iconfinder.com/` | 书签栏 / 📦 素材资源 / 图标 | A — EXISTING | IconFinder (`site-044`)；素材资源 / 图标 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 56 | 阿里巴巴矢量图标库 | `https://www.iconfont.cn/` | 书签栏 / 📦 素材资源 / 图标 | A — EXISTING | 阿里巴巴矢量图标库 (`site-045`)；素材资源 / 图标 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 57 | 求字体 | `https://www.qiuziti.com/` | 书签栏 / 📦 素材资源 / 字体 | A — EXISTING | 求字体 (`site-046`)；素材资源 / 字体 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 58 | 字体搬运工 | `https://font.sucai999.com/` | 书签栏 / 📦 素材资源 / 字体 | A — EXISTING | 字体搬运工 (`site-047`)；素材资源 / 字体 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 59 | 猫啃网 | `https://www.maoken.com/` | 书签栏 / 📦 素材资源 / 字体 | A — EXISTING | 猫啃网 (`site-048`)；素材资源 / 字体 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 60 | 100font.com - 免费商用字体大全 - 免费字体下载网站 | `https://www.100font.com/` | 书签栏 / 📦 素材资源 / 字体 | C — NEW_RECOMMENDED | 素材资源 / 字体 | RECOMMEND IMPORT | 补充中文免费字体与授权筛选，长期资源价值明确；具体字体仍按其独立许可证使用。 |
| 61 | Unsplash | `https://unsplash.com/` | 书签栏 / 📦 素材资源 / 图库 | A — EXISTING | Unsplash (`site-049`)；素材资源 / 图库 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 62 | Pexels | `https://www.pexels.com/zh-cn/` | 书签栏 / 📦 素材资源 / 图库 | A — EXISTING | Pexels (`site-050`)；素材资源 / 图库 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 63 | Pixabay | `https://pixabay.com/` | 书签栏 / 📦 素材资源 / 图库 | A — EXISTING | Pixabay (`site-051`)；素材资源 / 图库 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 64 | 彼岸桌面 | `http://www.netbian.com/` | 书签栏 / 📦 素材资源 / 壁纸 | A — EXISTING | 彼岸桌面 (`site-052`)；素材资源 / 壁纸 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 65 | 暖糖 | `https://www.nuantang.net/` | 书签栏 / 📦 素材资源 / 壁纸 | A — EXISTING | 暖糖 (`site-053`)；素材资源 / 壁纸 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 66 | 哲风壁纸 | `https://haowallpaper.com/` | 书签栏 / 📦 素材资源 / 壁纸 | A — EXISTING | 哲风壁纸 (`site-054`)；素材资源 / 壁纸 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 67 | 热门壁纸 - wallhaven.cc | `https://wallhaven.cc/hot?page=7` | 书签栏 / 📦 素材资源 / 壁纸 | C — NEW_RECOMMENDED | 素材资源 / 壁纸 | RECOMMEND IMPORT | 原链接为热门列表第 7 页，提案使用官方主页；不是因属于休闲内容而排除。首页直接抓取为 403，身份和用途由官方主页及 About 的索引快照确认。 |
| 68 | 觅知网 | `https://www.51miz.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 觅知网 (`site-056`)；素材资源 / 模板素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 69 | 包图网 | `https://ibaotu.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 包图网 (`site-057`)；素材资源 / 模板素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 70 | 站长素材 | `https://sc.chinaz.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 站长素材 (`site-058`)；素材资源 / 综合素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 71 | 享设计 | `https://www.design006.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 享设计 (`site-059`)；素材资源 / 综合素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 72 | 千库网 | `https://588ku.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 千库网 (`site-108`)；素材资源 / 综合素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 73 | 花瓣网 | `https://huaban.com/discovery` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 花瓣网 (`site-109`)；灵感参考 / 设计社区 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 74 | 潮国创意_原创3d图片素材电商设计海报_免费正版商用素材库 | `https://chaopx.com/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 潮国创意 (`site-110`)；素材资源 / 综合素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 75 | 大美工-设计优选 - 大美工dameigong.cn | `https://dameigong.cn/` | 书签栏 / 📦 素材资源 / 综合素材 | A — EXISTING | 大美工 (`site-111`)；素材资源 / 模板素材 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 76 | 标小智 | `https://www.logosc.cn/` | 书签栏 / 📦 素材资源 / LOGO 工具 | A — EXISTING | 标小智 (`site-060`)；设计创作 / Logo 与品牌 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 77 | 钙网 | `https://www.uugai.com/` | 书签栏 / 📦 素材资源 / LOGO 工具 | A — EXISTING | 钙网 (`site-061`)；设计创作 / Logo 与品牌 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 78 | Notion | `https://www.notion.so/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Notion (`site-062`)；效率工具 / 笔记写作 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 79 | 草料二维码 | `https://cli.im/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | 草料二维码 (`site-063`)；效率工具 / 在线工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 80 | Hotkey CheatSheet | `https://hotkeycheatsheet.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Hotkey CheatSheet (`site-064`)；效率工具 / 截图与辅助 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 81 | Text-to-Speech | `https://www.text-to-speech.cn/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Text-to-Speech (`site-065`)；效率工具 / 在线工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 82 | XMind | `https://xmind.cn/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | XMind (`site-066`)；效率工具 / 思维整理 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 83 | Typora | `https://typoraio.cn/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Typora (`site-067`)；效率工具 / 笔记写作 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 84 | Snipaste | `https://zh.snipaste.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Snipaste (`site-068`)；效率工具 / 截图与辅助 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 85 | Mocreak | `https://www.mocreak.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Mocreak (`site-069`)；软件资源 / 软件下载 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 86 | Vowa | `https://vowa.lat/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | Vowa (`site-070`)；网络与服务 / 网络工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 87 | LestVPN | `https://letsvpn.world/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | LestVPN (`site-071`)；网络与服务 / 网络工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 88 | AiShort - AI提示词模板库 \| 精选Prompt指令 \| 一键提升生产力 \| AiShort - Advanced AI Agent &amp; Prompt Platform \| Build, Share, and Multiply Productivity with One Click | `https://www.aishort.top/?tags=ai` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | AiShort (`site-112`)；AI 工具 / Prompt 与 AI 资源 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 89 | ChatGPT Business Team 自助开通 | `https://codexcn.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | F — SKIP_SECURITY_OR_LEGAL_RISK | — | SKIP | 第三方订阅页面公开要求提交完整账户 Session 并支付，存在高权限凭据交付风险；按凭据/支付风险跳过，不据此断言其为恶意或欺诈网站。 |
| 90 | 秋裤工具箱 - CorelDRAW AI 智能插件 | `http://qiukuai.top/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | 秋裤工具箱 (`site-113`)；软件资源 / 插件与扩展 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 91 | 猫猫云官网 \| 稳定如猫的高性价比网络服务 \| 猫猫云网络服务 | `https://love.mmy234.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | 猫猫云 (`site-114`)；网络与服务 / 网络工具 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 92 | PackyAPI | `https://www.packyapi.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | A — EXISTING | PackyAPI (`site-115`)；网络与服务 / API 服务 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 93 | 购物 - ChatGPT PLUS一手批发部 | `https://plusgpt.vip/cat/recommend` | 书签栏 / ⚡ 效率工具 / 实用工具 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | 第三方订阅充值卡密的商品购买目录；作为充值交易入口跳过，不为购买目录建立独立收藏条目。未购买或登录。 |
| 94 | 工具哇 - 在线工具大全 | `https://toolwa.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | C — NEW_RECOMMENDED | 效率工具 / 在线工具 | RECOMMEND IMPORT | 官方说明为免费在线工具平台，兼顾一般实用用途；直接抓取超时，官网近期索引与 About 说明可核实。 |
| 95 | 小羿 – 专注收录各种优秀软件！ | `https://xiaoyi.vc/` | 书签栏 / ⚡ 效率工具 / 实用工具 | C — NEW_RECOMMENDED | 软件资源 / 软件发现 | RECOMMEND IMPORT | 官方主页已核实，主要用途是发现软件和阅读介绍，可自然填入软件发现空子类；不等同于为所介绍软件提供免费授权。 |
| 96 | 罗马斗兽场 \| 罗马轻VR全景旅游助手_指尖上 | `https://www.zhijianshang.com/colosseum/` | 书签栏 / ⚡ 效率工具 / 实用工具 | D — NEW_OPTIONAL | 灵感参考 / 视觉灵感 | USER DECISION | 原书签是罗马斗兽场单景点，官网确认有独立多目的地平台；提案只收平台主页。属于较专门的视觉/旅行探索，交由用户选择。 |
| 97 | GPT-Image2 Prompt Gallery | `https://gpt-image2.canghe.ai/` | 书签栏 / ⚡ 效率工具 / 实用工具 | D — NEW_OPTIONAL | AI 工具 / Prompt 与 AI 资源 | USER DECISION | 官网元描述和公开页面脚本确认案例/复制功能及免费测试、积分会员功能；特定模型场景较窄，建议可选。本次未登录或测试生成。 |
| 98 | 禾维 AI \| 2026 AI API 中转站排名 推荐 与 AI API 检测 | `https://www.hvoyai.com/` | 书签栏 / ⚡ 效率工具 / 实用工具 | D — NEW_OPTIONAL | 网络与服务 / 网络工具 | USER DECISION | 实际主页兼有 API 检测与目录，按网络检测工具归类，不误当直接模型 API 提供商；只读公开榜单，没有提交密钥或验证其排名，是否需要收录由用户决定。 |
| 99 | 88API-Token聚合平台 | `https://88api.ai/wallet` | 书签栏 / ⚡ 效率工具 / 实用工具 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | /wallet 是账户钱包/余额入口，应跳过。88API 有独立公开服务主页，但钱包本身不是公共资源条目，本次不由钱包自动扩展导入服务。 |
| 100 | SiteInspire | `https://www.siteinspire.com/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | SiteInspire (`site-072`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 101 | Awwwards | `https://www.awwwards.com/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Awwwards (`site-073`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 102 | Dribbble | `https://dribbble.com/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Dribbble (`site-074`)；灵感参考 / 设计社区 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 103 | 站酷 | `https://www.zcool.com.cn/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | 站酷 (`site-075`)；灵感参考 / 设计社区 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 104 | 极简画廊 – 精选网站灵感、工具、域名等 | `https://minimal.gallery/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | 极简画廊 (`site-116`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 105 | Get inspiration by exploring a library of 1000+ logo designs on Logo System | `https://logosystem.co/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Logo System (`site-117`)；灵感参考 / 品牌与 Logo | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 106 | Webzibition \| Codrops | `https://tympanus.net/codrops/webzibition/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Webzibition (`site-118`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 107 | Godly - Astronomically good web design inspiration | `https://godly.website/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Godly (`site-119`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 108 | Site of Sites \| The Best Web Design Inspiration 2026 | `https://www.siteofsites.co/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Site of Sites (`site-120`)；灵感参考 / 网页灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 109 | 最新设计灵感 | `https://recent.design/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | A — EXISTING | Recent Design (`site-121`)；灵感参考 / 视觉灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 110 | 精选 2141 个最佳动画网站 - landing.love | `https://www.landing.love/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | C — NEW_RECOMMENDED | 灵感参考 / 网页灵感 | RECOMMEND IMPORT | 页面视频和分类提供明确参考价值，虽有同类收藏仍值得保留；免费公开浏览已核实。 |
| 111 | Variant – Endless designs for your ideas, just scroll | `https://variant.com/community` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | D — NEW_OPTIONAL | 设计创作 / UI/UX 与原型 | USER DECISION | 公开主页元描述确认产品用途；原 community 路径跳到认证页，提案使用产品主页，不导入认证页。界面探索用途明确，但定价层级/免费额度尚未核实，保留可选并待补齐。 |
| 112 | 落地页设计案例：7300+ 个最佳落地页 \| Lapa Ninja | `https://www.lapa.ninja/` | 书签栏 / 🌈 灵感与学习 / 设计灵感 | C — NEW_RECOMMENDED | 灵感参考 / 网页灵感 | RECOMMEND IMPORT | 长期案例库与过滤浏览价值明确；官方同时提供付费 Pro 收藏功能，不因已有其他灵感站而直接剔除。 |
| 113 | 中国知网 | `https://www.cnki.net/` | 书签栏 / 🌈 灵感与学习 / 学术写作 | A — EXISTING | 中国知网 (`site-076`)；学习与知识 / 学术写作 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 114 | Grammarly | `https://www.grammarly.com/` | 书签栏 / 🌈 灵感与学习 / 学术写作 | A — EXISTING | Grammarly (`site-077`)；学习与知识 / 翻译语言 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 115 | DeepL | `https://www.deepl.com/` | 书签栏 / 🌈 灵感与学习 / 学术写作 | A — EXISTING | DeepL (`site-078`)；学习与知识 / 翻译语言 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 116 | QuillBot | `https://quillbot.com/` | 书签栏 / 🌈 灵感与学习 / 学术写作 | A — EXISTING | QuillBot (`site-079`)；学习与知识 / 翻译语言 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 117 | Aibiye | `https://www.aibiye.com/` | 书签栏 / 🌈 灵感与学习 / 学术写作 | A — EXISTING | Aibiye (`site-080`)；学习与知识 / 学术写作 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 118 | Aibiye官网_ai写论文_论文写作_AI论文写作指导平台 | `https://www.aibiye.com/result?orderNo=[REDACTED]` | 书签栏 / 🌈 灵感与学习 / 学术写作 | E — SKIP_DUPLICATE_OR_ONE_TIME | Aibiye (`site-080`)；学习与知识 / 学术写作 | SKIP | 已收录 Aibiye 的个人订单结果页，携带订单号；重复的非独立结果入口，保留现有主页。订单号在报告中遮蔽，未打开该订单。 |
| 119 | AI工具集 | `https://ai-bot.cn/` | 书签栏 / 🌈 灵感与学习 / 资源导航 | A — EXISTING | AI工具集 (`site-081`)；导航发现 / AI 导航 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 120 | Haitangw | `https://www.haitangw.cc/` | 书签栏 / 🌈 灵感与学习 / 资源导航 | A — EXISTING | Haitangw (`site-082`)；导航发现 / 综合导航 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 121 | Awesome Lists | `https://github.com/sindresorhus/awesome` | 书签栏 / 🌈 灵感与学习 / 资源导航 | A — EXISTING | Awesome Lists (`site-083`)；导航发现 / 开发导航 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 122 | 奇迹秀 | `https://qijishow.com/` | 书签栏 / 🌈 灵感与学习 / 资源导航 | A — EXISTING | 奇迹秀 (`site-084`)；导航发现 / 综合导航 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 123 | 软仓 | `https://www.ruancang.net/` | 书签栏 / 🌈 灵感与学习 / 资源导航 | A — EXISTING | 软仓 (`site-085`)；软件资源 / 软件下载 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 124 | Netflix | `https://www.netflix.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | Netflix (`site-086`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 125 | YouTube | `https://www.youtube.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | YouTube (`site-087`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 126 | 哔哩哔哩 | `https://www.bilibili.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 哔哩哔哩 (`site-088`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 127 | 腾讯视频 | `https://v.qq.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 腾讯视频 (`site-089`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 128 | 爱奇艺 | `https://www.iqiyi.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 爱奇艺 (`site-090`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 129 | 优酷视频 | `https://www.youku.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 优酷视频 (`site-091`)；影音娱乐 / 视频平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 130 | 抖音 | `https://www.douyin.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 抖音 (`site-092`)；影音娱乐 / 短视频 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 131 | 小红书 | `https://www.xiaohongshu.com/` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | A — EXISTING | 小红书 (`site-093`)；灵感参考 / 视觉灵感 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 132 | 人人视频 | `https://mh.yichengwlkj.com/pc` | 书签栏 / 🎬 影音娱乐 / 视频流媒体 | G — NEEDS_USER_DECISION | 待确认 | ASK USER BEFORE IMPORT | 页面当前可取到“人人视频APP”描述及搜索/客服框架，但没有足以确认服务归属、稳定公共入口和实际视频内容的证据；不因娱乐类型跳过。 |
| 133 | QQ音乐 | `https://y.qq.com/` | 书签栏 / 🎬 影音娱乐 / 音乐平台 | A — EXISTING | QQ音乐 (`site-094`)；影音娱乐 / 音乐平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 134 | 网易云音乐 | `https://music.163.com/` | 书签栏 / 🎬 影音娱乐 / 音乐平台 | A — EXISTING | 网易云音乐 (`site-095`)；影音娱乐 / 音乐平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 135 | Spotify | `https://www.spotify.com/` | 书签栏 / 🎬 影音娱乐 / 音乐平台 | A — EXISTING | Spotify (`site-096`)；影音娱乐 / 音乐平台 | NO IMPORT | 规范 URL 与现有条目一致；本地身份比较，未逐站复测。 |
| 136 | Lil-TT (Lil-TT) / Repositories | `https://github.com/Lil-TT?tab=repositories` | 书签栏 / 临时网页 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | GitHub 某用户的仓库列表临时页，未给出明确可复用的具体资源；不与 GitHub 主页或 Awesome Lists 粗暴合并，也不另建该个人页。 |
| 137 | Evol - AI 智能工作空间平台 | `https://www.evolai.cn/?inviteCode=[REDACTED]#/` | 书签栏 / 临时网页 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | 原入口带 inviteCode，按邀请/推荐入口规则跳过该链接并遮蔽邀请码。已核实 Evol 官网确有通信和远端 Agent 协作用途；平台本身并非无价值，如需收录可另行批准无邀请码主页。未访问带邀请码的 URL。 |
| 138 | 像素魔方 | `https://kk.yusucai.cn/` | 书签栏 / 临时网页 | G — NEEDS_USER_DECISION | 待确认 | ASK USER BEFORE IMPORT | 标题为像素魔方，页面描述却为小华同学AI，og:url 指向另一个域名；品牌/用途信号不一致，未将模板元数据当真实用途。 |
| 139 | Bootstrap模板_响应式网站模板 - Bootstrap模板库 | `https://www.bootstrapmb.com/` | 书签栏 / 临时网页 | D — NEW_OPTIONAL | 素材资源 / 模板素材 | USER DECISION | 官网模板列表与 VIP 条款已核实；与既有素材/组件资源有交叉但仍有独立用途。浏览与会员下载分开看，具体模板授权需逐项确认，没有证据据付费本身归为 F。 |
| 140 | 枭枭图库 | `https://sss.ulrr.cn/login.html` | 书签栏 / 临时网页 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | 明确的 /login.html 登录入口，不作为独立公开图库条目；没有登录或读取账户内容。 |
| 141 | 学习。教学。创造。 \| edclub | `https://www.edclub.com/` | 书签栏 / 临时网页 | C — NEW_RECOMMENDED | 学习与知识 / 学习平台 | RECOMMEND IMPORT | 浏览器实际读到官方课程和个人/学校版本说明；虽在临时文件夹，仍有明确持续学习价值，可填学习平台空子类。 |
| 142 | gen.paramore  adobe软件破解器 | `https://gen.paramore.su/` | 书签栏 / 临时网页 | F — SKIP_SECURITY_OR_LEGAL_RISK | — | SKIP | 原书签明确标注 Adobe 软件破解器；官网索引对应 GenP 发布和二进制下载，主要涉及未授权软件绕过，按指定风险规则跳过。没有下载或执行文件。 |
| 143 | 首页 - 火星编程导航 | `https://mars-coder.cn/` | 书签栏 / 临时网页 | D — NEW_OPTIONAL | 学习与知识 / 学习平台 | USER DECISION | 官网近期索引呈现教程与免费/付费课程，主要是学习平台，不沿用旧名称机械归为导航；部分内容为空或演示态，作为较专门的可选收藏。 |
| 144 | 猫猫云 - 高速IEPL专线机场 \| 猫猫云官网下载 | `https://app.wckmsc.com/` | 书签栏 / 临时网页 | G — NEEDS_USER_DECISION | 待确认；可能关联 猫猫云 (`site-114`)，未证实 | ASK USER BEFORE IMPORT | 原书签称猫猫云下载，但域名与现有猫猫云不同，访问失败且没有官方关联证据；不能仅据标题当镜像或替换 URL。 |
| 145 | 炫宇 | `https://www.xuanyu168.net/` | 书签栏 / 临时网页 | G — NEEDS_USER_DECISION | 待确认 | ASK USER BEFORE IMPORT | 原网站无法取得可核实内容，标题不足以确定用途、服务身份、定价或归类。 |
| 146 | 享设计下载素材 | `https://xz.nmslb.com/` | 书签栏 / 临时网页 | G — NEEDS_USER_DECISION | 待确认；可能关联 享设计 (`site-059`)，未证实 | ASK USER BEFORE IMPORT | 当前页面标题为灵感素材社，与原书签和现有享设计均不一致；只有应用壳，不能判断是独立素材服务、下载助手还是另一个资源。 |
| 147 | HOME - JIEJOE \| 视觉设计者 | `https://www.jiejoe.com/home` | 书签栏 / 临时网页 | D — NEW_OPTIONAL | 灵感参考 / 视觉灵感 | USER DECISION | 官网根入口有明确品牌，官方索引作品集内容可核实；原 /home 抓取超时。单一创作者参考较专门，可选收录，没有将个人作品站一概当临时链接。 |
| 148 | 充值提交 | `https://sdk.buybuygpt.shop/activate` | 书签栏 / 临时网页 | E — SKIP_DUPLICATE_OR_ONE_TIME | — | SKIP | /activate 配合“充值提交”标题是充值/激活流程入口，缺少独立公共收藏价值；不打开激活流程、不提交卡密。 |

## 5. New Recommended Candidates

以下 7 条为 C，仅提供拟议元数据。pricing 的 free 指该收藏用途的公开浏览/使用，不保证站内所有素材、软件或附加产品免费；具体字体许可、服务定价和可用性仍应在将来实际导入前复核。

### #60 100font — C

| 字段 | 拟议值 |
| --- | --- |
| name | 100font |
| 规范 URL | `https://www.100font.com/` |
| category | 素材资源 |
| subcategory | 字体 |
| description | 整理免费商用字体，并提供字体样式筛选、授权类型和使用说明。 |
| tags | `免费商用`、`中文字体`、`字体授权` |
| aliases | `100font.com` |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：补充中文免费字体与授权筛选，长期资源价值明确；具体字体仍按其独立许可证使用。

依据：[官方来源](https://www.100font.com/)。核实方式与限制见第 3 节及上文说明。

### #67 Wallhaven — C

| 字段 | 拟议值 |
| --- | --- |
| name | Wallhaven |
| 规范 URL | `https://wallhaven.cc/` |
| category | 素材资源 |
| subcategory | 壁纸 |
| description | 由社区提交和整理高清桌面壁纸，支持搜索、分类及热门浏览。 |
| tags | `桌面壁纸`、`高清图片`、`摄影` |
| aliases | `Wallhaven.cc` |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：原链接为热门列表第 7 页，提案使用官方主页；不是因属于休闲内容而排除。首页直接抓取为 403，身份和用途由官方主页及 About 的索引快照确认。

依据：[官方来源](https://wallhaven.cc/index.php/about)。核实方式与限制见第 3 节及上文说明。

### #94 工具哇 — C

| 字段 | 拟议值 |
| --- | --- |
| name | 工具哇 |
| 规范 URL | `https://toolwa.com/` |
| category | 效率工具 |
| subcategory | 在线工具 |
| description | 提供文字、图像、音频、开发辅助及趣味功能的浏览器工具集合。 |
| tags | `文字处理`、`图片处理`、`音频编辑`、`开发` |
| aliases | `ToolWa`、`工具蛙` |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官方说明为免费在线工具平台，兼顾一般实用用途；直接抓取超时，官网近期索引与 About 说明可核实。

依据：[官方来源](https://toolwa.com/about/)。核实方式与限制见第 3 节及上文说明。

### #95 小羿 — C

| 字段 | 拟议值 |
| --- | --- |
| name | 小羿 |
| 规范 URL | `https://xiaoyi.vc/` |
| category | 软件资源 |
| subcategory | 软件发现 |
| description | 介绍 Windows、macOS、浏览器扩展及其他应用，并整理软件使用技巧。 |
| tags | `应用推荐`、`Windows`、`macOS`、`使用技巧` |
| aliases | []（无可靠补充别名） |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官方主页已核实，主要用途是发现软件和阅读介绍，可自然填入软件发现空子类；不等同于为所介绍软件提供免费授权。

依据：[官方来源](https://xiaoyi.vc/)。核实方式与限制见第 3 节及上文说明。

### #110 Landing Love — C

| 字段 | 拟议值 |
| --- | --- |
| name | Landing Love |
| 规范 URL | `https://www.landing.love/` |
| category | 灵感参考 |
| subcategory | 网页灵感 |
| description | 收录网站设计案例及完整页面视频，提供风格与行业分类参考。 |
| tags | `网页设计`、`动效`、`案例` |
| aliases | `landing.love` |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：页面视频和分类提供明确参考价值，虽有同类收藏仍值得保留；免费公开浏览已核实。

依据：[官方来源](https://www.landing.love/)。核实方式与限制见第 3 节及上文说明。

### #112 Lapa Ninja — C

| 字段 | 拟议值 |
| --- | --- |
| name | Lapa Ninja |
| 规范 URL | `https://www.lapa.ninja/` |
| category | 灵感参考 |
| subcategory | 网页灵感 |
| description | 整理落地页设计案例、页面截图、视频及相关设计学习资源。 |
| tags | `落地页`、`网页设计`、`案例`、`学习` |
| aliases | []（无可靠补充别名） |
| pricing | `freemium` |
| platforms | `web` |
| featured | `false` |

判断与取舍：长期案例库与过滤浏览价值明确；官方同时提供付费 Pro 收藏功能，不因已有其他灵感站而直接剔除。

依据：[官方来源](https://www.lapa.ninja/pro/)。核实方式与限制见第 3 节及上文说明。

### #141 edclub — C

| 字段 | 拟议值 |
| --- | --- |
| name | edclub |
| 规范 URL | `https://www.edclub.com/` |
| category | 学习与知识 |
| subcategory | 学习平台 |
| description | 提供打字、词汇拼写、数字素养等互动课程，并支持个人学习和课堂教学。 |
| tags | `打字练习`、`语言学习`、`数字素养`、`教育` |
| aliases | []（无可靠补充别名） |
| pricing | `freemium` |
| platforms | `web` |
| featured | `false` |

判断与取舍：浏览器实际读到官方课程和个人/学校版本说明；虽在临时文件夹，仍有明确持续学习价值，可填学习平台空子类。

定价核实范围：免费课程与学校/高级版本并存的提案分类；本次未核定订阅金额。

依据：[官方来源](https://www.edclub.com/)。核实方式与限制见第 3 节及上文说明。

## 6. Optional Candidates

以下 7 条为 D，具有独立用途但更专门或与既有资源重叠，需要用户决定。Variant 的 pricing 未核实；它是可选候选而非已齐备的可导入记录。

### #96 指尖上 — D

| 字段 | 拟议值 |
| --- | --- |
| name | 指尖上 |
| 规范 URL | `https://www.zhijianshang.com/` |
| category | 灵感参考 |
| subcategory | 视觉灵感 |
| description | 以 360 度全景和目的地列表展示城市、景点、建筑与博物馆。 |
| tags | `360全景`、`VR`、`旅行`、`建筑` |
| aliases | []（无可靠补充别名） |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：原书签是罗马斗兽场单景点，官网确认有独立多目的地平台；提案只收平台主页。属于较专门的视觉/旅行探索，交由用户选择。

依据：[官方来源](https://www.zhijianshang.com/)。核实方式与限制见第 3 节及上文说明。

### #97 GPT-Image2 Prompt Gallery — D

| 字段 | 拟议值 |
| --- | --- |
| name | GPT-Image2 Prompt Gallery |
| 规范 URL | `https://gpt-image2.canghe.ai/` |
| category | AI 工具 |
| subcategory | Prompt 与 AI 资源 |
| description | 提供图像创作提示词案例、可复制模板及在线生图测试入口。 |
| tags | `Prompt`、`图像生成`、`视觉创作`、`模板` |
| aliases | []（无可靠补充别名） |
| pricing | `freemium` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官网元描述和公开页面脚本确认案例/复制功能及免费测试、积分会员功能；特定模型场景较窄，建议可选。本次未登录或测试生成。

依据：[官方来源](https://gpt-image2.canghe.ai/)。核实方式与限制见第 3 节及上文说明。

### #98 禾维 AI — D

| 字段 | 拟议值 |
| --- | --- |
| name | 禾维 AI |
| 规范 URL | `https://www.hvoyai.com/` |
| category | 网络与服务 |
| subcategory | 网络工具 |
| description | 整理 AI API 中转站目录、接口检测说明和服务对比数据。 |
| tags | `API检测`、`服务评测`、`延迟监测` |
| aliases | `Hvoy AI` |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：实际主页兼有 API 检测与目录，按网络检测工具归类，不误当直接模型 API 提供商；只读公开榜单，没有提交密钥或验证其排名，是否需要收录由用户决定。

依据：[官方来源](https://www.hvoyai.com/)。核实方式与限制见第 3 节及上文说明。

### #111 Variant — D

| 字段 | 拟议值 |
| --- | --- |
| name | Variant |
| 规范 URL | `https://variant.com/` |
| category | 设计创作 |
| subcategory | UI/UX 与原型 |
| description | 根据应用或网站构想探索多种界面设计方向的在线服务。 |
| tags | `界面设计`、`设计探索`、`网页设计` |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：公开主页元描述确认产品用途；原 community 路径跳到认证页，提案使用产品主页，不导入认证页。界面探索用途明确，但定价层级/免费额度尚未核实，保留可选并待补齐。

定价核实范围：待确认；官方服务条款包含订阅服务，不能据此猜测免费额度或强填 free/freemium。

依据：[官方来源](https://variant.com/terms-and-privacy)。核实方式与限制见第 3 节及上文说明。

### #139 Bootstrap模板库 — D

| 字段 | 拟议值 |
| --- | --- |
| name | Bootstrap模板库 |
| 规范 URL | `https://www.bootstrapmb.com/` |
| category | 素材资源 |
| subcategory | 模板素材 |
| description | 整理响应式网站模板、后台界面及前端交互插件，提供预览和下载入口。 |
| tags | `HTML模板`、`Bootstrap`、`前端组件` |
| aliases | `BootstrapMB` |
| pricing | `freemium` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官网模板列表与 VIP 条款已核实；与既有素材/组件资源有交叉但仍有独立用途。浏览与会员下载分开看，具体模板授权需逐项确认，没有证据据付费本身归为 F。

依据：[官方来源](https://www.bootstrapmb.com/vip)。核实方式与限制见第 3 节及上文说明。

### #143 火星编程导航 — D

| 字段 | 拟议值 |
| --- | --- |
| name | 火星编程导航 |
| 规范 URL | `https://mars-coder.cn/` |
| category | 学习与知识 |
| subcategory | 学习平台 |
| description | 整理编程教程、学习路线、项目课程及开发者接单相关经验。 |
| tags | `编程学习`、`项目实战`、`学习路线` |
| aliases | `Mars Coder` |
| pricing | `freemium` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官网近期索引呈现教程与免费/付费课程，主要是学习平台，不沿用旧名称机械归为导航；部分内容为空或演示态，作为较专门的可选收藏。

依据：[官方来源](https://mars-coder.cn/project-courses)。核实方式与限制见第 3 节及上文说明。

### #147 JIEJOE — D

| 字段 | 拟议值 |
| --- | --- |
| name | JIEJOE |
| 规范 URL | `https://www.jiejoe.com/` |
| category | 灵感参考 |
| subcategory | 视觉灵感 |
| description | 展示视觉设计者的平面、交互、摄影和剪辑作品的个人作品集。 |
| tags | `作品集`、`动效`、`视频剪辑`、`摄影` |
| aliases | []（无可靠补充别名） |
| pricing | `free` |
| platforms | `web` |
| featured | `false` |

判断与取舍：官网根入口有明确品牌，官方索引作品集内容可核实；原 /home 抓取超时。单一创作者参考较专门，可选收录，没有将个人作品站一概当临时链接。

依据：[官方来源](https://www.jiejoe.com/)。核实方式与限制见第 3 节及上文说明。

## 7. Existing / Duplicate Findings

5 个 B 案例均不在本阶段更新 URL：前 3 个跨域迁移证据是 #1、#6、#26；#13、#14 则建议保留现有稳定主页。

| # / 既有条目 | 当前数据 URL | 书签 URL | 后续建议 URL | 结论及依据 |
| --- | --- | --- | --- | --- |
| #1 ChatGPT (`site-001`) | `https://chat.openai.com/` | `https://chat.openai.com/` | `https://chatgpt.com/` | 旧官方域名本次实际跳转到 chatgpt.com；同一产品，建议后续更新入口，不新增。 [官方来源](https://chat.openai.com/) |
| #6 Kimi (`site-006`) | `https://kimi.moonshot.cn/` | `https://kimi.moonshot.cn/` | `https://www.kimi.com/` | 旧 Moonshot 域名本次实际跳转到 www.kimi.com；同一产品，建议后续更新入口，不新增。 [官方来源](https://kimi.moonshot.cn/) |
| #13 即梦AI (`site-012`) | `https://jimeng.jianying.com/` | `https://jimeng.jianying.com/ai-tool/home/` | `https://jimeng.jianying.com/` | 同一即梦产品的创作内页；原根域主页已核实，内页抓取失败，优先保留稳定根入口，后续再决定是否直达创作页。 [官方来源](https://jimeng.jianying.com/) |
| #14 Midjourney (`site-013`) | `https://www.midjourney.com/` | `https://www.midjourney.com/explore?tab=video_top` | `https://www.midjourney.com/` | Explore 的 video_top 筛选列表不是独立网站；保留 Midjourney 主页，不另建 Explore 条目。 [官方来源](https://www.midjourney.com/) |
| #26 Framer Motion (`site-020`) | `https://www.framer.com/motion/` | `https://www.framer.com/motion/` | `https://motion.dev/` | Framer 的旧 Motion 路径本次跳转到 motion.dev；这是动画库，与 Framer 建站产品保持独立。 [官方来源](https://www.framer.com/motion/) |

文件内部没有规范 URL 完全重复组。3 组同主机入口必须分别判断：

| 主机 | 书签 | 处理 |
| --- | --- | --- |
| github.com | #21 GitHub；#121 Awesome Lists；#136 用户仓库列表 | GitHub 主页和 Awesome Lists 是两个已收录的不同资源，均 A；个人仓库列表 E。未按主机粗暴去重。 |
| framer.com | #26 Framer Motion；#44 Framer | 动画库 B 与建站工具 A 保持独立；Motion 跨域迁移供后续 URL 更新。 |
| aibiye.com | #117 Aibiye；#118 订单结果 | 主页 A，携订单号的结果页 E；确认是同资源的非独立入口，不新建。 |

118 条精确 URL 匹配中有 3 条因已核实官方迁移转为 B；另 2 条同资源深路径转为 B，所以最终 A 115、B 5。其余 2 条仅同主机原书签分别为 Aibiye 订单结果与 GitHub 个人页，列 E。未知主机 26 最终分为 C 7、D 7、E 5、F 2、G 5。

当前 121 个资源中，120 个在本次导出内对应 A/B；千图网（site-055）未出现。本审核不以导出缺失为删除依据，现有 121 条全数保留。

## 8. Skipped Entries

### E — Duplicate / One-time（7）

| # | 原书签 | 原 URL | 具体理由 | 依据 |
| --- | --- | --- | --- | --- |
| 93 | 购物 - ChatGPT PLUS一手批发部 | `https://plusgpt.vip/cat/recommend` | 第三方订阅充值卡密的商品购买目录；作为充值交易入口跳过，不为购买目录建立独立收藏条目。未购买或登录。 | [官方来源](https://www.plusgpt.vip/) |
| 99 | 88API-Token聚合平台 | `https://88api.ai/wallet` | /wallet 是账户钱包/余额入口，应跳过。88API 有独立公开服务主页，但钱包本身不是公共资源条目，本次不由钱包自动扩展导入服务。 | [官方来源](https://88api.ai/) |
| 118 | Aibiye官网_ai写论文_论文写作_AI论文写作指导平台 | `https://www.aibiye.com/result?orderNo=[REDACTED]` | 已收录 Aibiye 的个人订单结果页，携带订单号；重复的非独立结果入口，保留现有主页。订单号在报告中遮蔽，未打开该订单。 | 原书签路径/标题与本地匹配；未打开交易、登录或个人结果入口 |
| 136 | Lil-TT (Lil-TT) / Repositories | `https://github.com/Lil-TT?tab=repositories` | GitHub 某用户的仓库列表临时页，未给出明确可复用的具体资源；不与 GitHub 主页或 Awesome Lists 粗暴合并，也不另建该个人页。 | 原书签路径/标题与本地匹配；未打开交易、登录或个人结果入口 |
| 137 | Evol - AI 智能工作空间平台 | `https://www.evolai.cn/?inviteCode=[REDACTED]#/` | 原入口带 inviteCode，按邀请/推荐入口规则跳过该链接并遮蔽邀请码。已核实 Evol 官网确有通信和远端 Agent 协作用途；平台本身并非无价值，如需收录可另行批准无邀请码主页。未访问带邀请码的 URL。 | [官方来源](https://www.evolai.cn/) |
| 140 | 枭枭图库 | `https://sss.ulrr.cn/login.html` | 明确的 /login.html 登录入口，不作为独立公开图库条目；没有登录或读取账户内容。 | 原书签路径/标题与本地匹配；未打开交易、登录或个人结果入口 |
| 148 | 充值提交 | `https://sdk.buybuygpt.shop/activate` | /activate 配合“充值提交”标题是充值/激活流程入口，缺少独立公共收藏价值；不打开激活流程、不提交卡密。 | 原书签路径/标题与本地匹配；未打开交易、登录或个人结果入口 |

88API、Evol 的公开主页确有独立服务用途，本次排除的是钱包/邀请链接；没有把整个服务称作无用或高风险。若后续希望收录它们的干净主页，应另行明确选择并补齐元数据，它们不计入本报告的 14 条 C/D 候选。充值商品目录同样未被指认为欺诈网站。

### F — Security / Legal-risk（2）

| # | 原书签 | 原 URL | 具体依据与判断 | 官方来源 |
| --- | --- | --- | --- | --- |
| 89 | ChatGPT Business Team 自助开通 | `https://codexcn.com/` | 第三方订阅页面公开要求提交完整账户 Session 并支付，存在高权限凭据交付风险；按凭据/支付风险跳过，不据此断言其为恶意或欺诈网站。 | [官方来源](https://codexcn.com/) |
| 142 | gen.paramore  adobe软件破解器 | `https://gen.paramore.su/` | 原书签明确标注 Adobe 软件破解器；官网索引对应 GenP 发布和二进制下载，主要涉及未授权软件绕过，按指定风险规则跳过。没有下载或执行文件。 | [官方来源](https://gen.paramore.su/) |

F 是按任务规定的凭据/未授权软件绕过用途处理，没有作恶意软件检测或特定司法管辖区的法律结论。未下载、运行破解文件或提交账户 Session。codexcn 的根站书签与其另一个 API 子域服务不自动等同，本次未替换成该 API 服务。

## 9. User Decisions Required

以下 5 条 G 才是身份、用途或规范入口真正未明确的条目。未知值保留“待确认”；这些表格不是有效导入记录，tags 不编造，canonical URL、category、subcategory、pricing 均未定。

### #132 人人视频（归属待确认） — G

| 字段 | 拟议值 |
| --- | --- |
| name | 人人视频（归属待确认） |
| 规范 URL | 待确认（原书签 URL 见完整表） |
| category | 待确认 |
| subcategory | 待确认 |
| description | 用途或资源身份待确认；本条不能作为可导入元数据。 |
| tags | 待确认 |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：页面当前可取到“人人视频APP”描述及搜索/客服框架，但没有足以确认服务归属、稳定公共入口和实际视频内容的证据；不因娱乐类型跳过。

待确认事项：请确认它是否是你要长期收藏的服务，以及其可靠官网入口。

依据：[原入口的公开页面核查](https://mh.yichengwlkj.com/pc)。核实方式与限制见第 3 节及上文说明。

### #138 像素魔方 — G

| 字段 | 拟议值 |
| --- | --- |
| name | 像素魔方 |
| 规范 URL | 待确认（原书签 URL 见完整表） |
| category | 待确认 |
| subcategory | 待确认 |
| description | 用途或资源身份待确认；本条不能作为可导入元数据。 |
| tags | 待确认 |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：标题为像素魔方，页面描述却为小华同学AI，og:url 指向另一个域名；品牌/用途信号不一致，未将模板元数据当真实用途。

待确认事项：它具体提供什么功能，哪个入口是你希望收藏的主页？

依据：[原入口的公开页面核查](https://kk.yusucai.cn/)。核实方式与限制见第 3 节及上文说明。

### #144 猫猫云下载入口（待确认） — G

| 字段 | 拟议值 |
| --- | --- |
| name | 猫猫云下载入口（待确认） |
| 规范 URL | 待确认（原书签 URL 见完整表） |
| category | 待确认 |
| subcategory | 待确认 |
| description | 用途或资源身份待确认；本条不能作为可导入元数据。 |
| tags | 待确认 |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：原书签称猫猫云下载，但域名与现有猫猫云不同，访问失败且没有官方关联证据；不能仅据标题当镜像或替换 URL。

待确认事项：请确认该域名是否是现有猫猫云的官方客户端下载入口。

可能关联：猫猫云（`site-114`，`https://love.mmy234.com/`）；关联尚未证实，未当作重复或替换。

依据：[原入口的公开页面核查](https://app.wckmsc.com/)。核实方式与限制见第 3 节及上文说明。

### #145 炫宇 — G

| 字段 | 拟议值 |
| --- | --- |
| name | 炫宇 |
| 规范 URL | 待确认（原书签 URL 见完整表） |
| category | 待确认 |
| subcategory | 待确认 |
| description | 用途或资源身份待确认；本条不能作为可导入元数据。 |
| tags | 待确认 |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：原网站无法取得可核实内容，标题不足以确定用途、服务身份、定价或归类。

待确认事项：请说明网站用途并确认仍有效的规范主页；否则继续暂缓。

依据：[原入口的公开页面核查](https://www.xuanyu168.net/)。核实方式与限制见第 3 节及上文说明。

### #146 灵感素材社（原书签称享设计下载素材） — G

| 字段 | 拟议值 |
| --- | --- |
| name | 灵感素材社（原书签称享设计下载素材） |
| 规范 URL | 待确认（原书签 URL 见完整表） |
| category | 待确认 |
| subcategory | 待确认 |
| description | 用途或资源身份待确认；本条不能作为可导入元数据。 |
| tags | 待确认 |
| aliases | []（无可靠补充别名） |
| pricing | 待确认 |
| platforms | `web` |
| featured | `false` |

判断与取舍：当前页面标题为灵感素材社，与原书签和现有享设计均不一致；只有应用壳，不能判断是独立素材服务、下载助手还是另一个资源。

待确认事项：请确认其与享设计的关系及是否希望收录为独立服务。

可能关联：享设计（`site-059`，`https://www.design006.com/`）；关联尚未证实，未当作重复或替换。

依据：[原入口的公开页面核查](https://xz.nmslb.com/)。核实方式与限制见第 3 节及上文说明。

另有一个已计入 D 的元数据缺口：Variant 的 pricing/免费层级需要补齐（第 6 节），不额外计为第 6 个 G。7 个 D 的“是否收藏”选择列在第 11 节，不因偏好尚未作答将其重复归入 G。

## 10. Taxonomy Impact

| V2 category | V2 subcategory | 现有站点 | 推荐 C | 可选 D | 新候选合计 |
| --- | --- | --- | --- | --- | --- |
| AI 工具 | Prompt 与 AI 资源 | 3 | 0 | 1 | 1 |
| 设计创作 | UI/UX 与原型 | 2 | 0 | 1 | 1 |
| 素材资源 | 字体 | 3 | 1 | 0 | 1 |
| 素材资源 | 壁纸 | 3 | 1 | 0 | 1 |
| 素材资源 | 模板素材 | 3 | 0 | 1 | 1 |
| 灵感参考 | 网页灵感 | 7 | 2 | 0 | 2 |
| 灵感参考 | 视觉灵感 | 2 | 0 | 2 | 2 |
| 效率工具 | 在线工具 | 3 | 1 | 0 | 1 |
| 软件资源 | 软件发现 | 0 | 1 | 0 | 1 |
| 网络与服务 | 网络工具 | 3 | 0 | 1 | 1 |
| 学习与知识 | 学习平台 | 0 | 1 | 1 | 2 |

| 顶级分类 | C | D | 合计 |
| --- | --- | --- | --- |
| AI 工具 | 0 | 1 | 1 |
| 开发编程 | 0 | 0 | 0 |
| 设计创作 | 0 | 1 | 1 |
| 素材资源 | 2 | 1 | 3 |
| 灵感参考 | 2 | 2 | 4 |
| 效率工具 | 1 | 0 | 1 |
| 软件资源 | 1 | 0 | 1 |
| 网络与服务 | 0 | 1 | 1 |
| 影音娱乐 | 0 | 0 | 0 |
| 学习与知识 | 1 | 1 | 2 |
| 导航发现 | 0 | 0 | 0 |

新候选合计 C 7 / D 7 / 14，涉及 8 个既有顶级分类；G 不计入，避免用不明条目强行填空。若将来批准：软件资源 / 软件发现可由小羿（C）自然补入；学习与知识 / 学习平台可由 edclub（C），及火星编程导航（D，若选择）补入。开发编程 / 前端框架与库暂无自然候选，继续留空。

无需增加、删除或改名分类/子类。所有 C/D 路径均对照 P1 sites.json 精确验证；tags 2–5 个且不逐字重复其分类/子类，aliases 仅用可核实名称。没有引入新字段或收藏时间、来源、使用频率等产品属性。实际产品分类与站点数量在本阶段均未变化。

## 11. Proposed P2.1 Import Set

### RECOMMENDED TO IMPORT

- #60 100font — `https://www.100font.com/` — 素材资源 / 字体
- #67 Wallhaven — `https://wallhaven.cc/` — 素材资源 / 壁纸
- #94 工具哇 — `https://toolwa.com/` — 效率工具 / 在线工具
- #95 小羿 — `https://xiaoyi.vc/` — 软件资源 / 软件发现
- #110 Landing Love — `https://www.landing.love/` — 灵感参考 / 网页灵感
- #112 Lapa Ninja — `https://www.lapa.ninja/` — 灵感参考 / 网页灵感
- #141 edclub — `https://www.edclub.com/` — 学习与知识 / 学习平台

### OPTIONAL — WAITING FOR USER DECISION

- #96 指尖上 — `https://www.zhijianshang.com/` — 灵感参考 / 视觉灵感
- #97 GPT-Image2 Prompt Gallery — `https://gpt-image2.canghe.ai/` — AI 工具 / Prompt 与 AI 资源
- #98 禾维 AI — `https://www.hvoyai.com/` — 网络与服务 / 网络工具
- #111 Variant — `https://variant.com/` — 设计创作 / UI/UX 与原型；pricing 待确认，补齐后才可导入
- #139 Bootstrap模板库 — `https://www.bootstrapmb.com/` — 素材资源 / 模板素材
- #143 火星编程导航 — `https://mars-coder.cn/` — 学习与知识 / 学习平台
- #147 JIEJOE — `https://www.jiejoe.com/` — 灵感参考 / 视觉灵感

另行暂缓的 G（不是可导入清单）：#132 人人视频（归属待确认）；#138 像素魔方；#144 猫猫云下载入口（待确认）；#145 炫宇；#146 灵感素材社（原书签称享设计下载素材）。

P2.1 必须等待用户明确导入选择；届时需复核被批准候选的规范入口、身份、定价与元数据，补齐 Variant 的 pricing，并单独决定 5 个 B 的 URL 是否更新。不能对整个原 HTML 执行批量导入；G、E、F、未选择的 D 不应自动进入数据。此处没有执行导入。

## 12. Changed Files

仓库唯一新增文件：

```text
docs/ROSETOOLBOX_V2_P2_BOOKMARK_AUDIT_REPORT.md
```

解析、中间候选表、只读公开页面快照、测试日志及渲染/校验脚本均放在线程工作目录，未写入或提交到项目仓库。仅对本报告创建一次本地文档提交，提交消息为 `docs: audit v2 bookmark candidates`；最终提交 SHA 在任务回执中提供，不为写入自身 SHA 追加提交。

| 验证 | 审核前 | 审核完成后 |
| --- | --- | --- |
| git status --short | CLEAN | 文档提交前仅新增报告；提交后状态在任务回执提供 |
| git diff -- src/data/sites.json | 空 | 空 |
| git diff -- src/script.js | 空 | 空 |
| git diff -- scripts/import-bookmarks.js | 空 | 空 |
| npm run validate | PASS：121 站点 / 11 分类 | PASS：121 站点 / 11 分类 |
| npm test | PASS：50 / 50，0 fail，0 skipped | PASS：50 / 50，0 fail，0 skipped |
| 审核前已有 tracked 文件 SHA-256 | 164 个文件作为基线 | 164 / 164 未变化；提交前/后再按相同基线核对 |
| 原始书签 SHA-256 | `3905dd6869a55117a69ed8df0b6d0d4923ee6502ee994a8f4511671c67484b92` | 相同；原 HTML 未修改 |
| main | `bf443dae06949017a0261f97b4690592d6f4fbd5` | 相同；没有 Merge、Push、Tag、发布或部署 |

上述完成后校验时间：2026-10-02T14:59:12+08:00。完整表编号连续且无遗漏/重复；各类数量合计 148。C/D 候选规范 URL 与当前数据及候选集合无重复，分类路径精确合法，标签数量与默认字段已校验。两个私有查询参数值只在报告遮蔽，未泄露到报告或外部查询。

产品验证仍证明原 121 条数据与原功能基线合规；它不是新增候选已导入或新网站功能经过运行验收的证据。

## 13. Gate

```text
P2 AUDIT COMPLETE — WAITING FOR USER IMPORT DECISION
```

NO BOOKMARKS IMPORTED

NOT PUSHED
