# RoseToolBox V2 P4 — Publication Report

Date: 2026-10-02

Project: `D:\Rose Workspace\02 Projects\Active\RoseToolBox`

## 1. Baseline

| Item | Verified pre-push state |
| --- | --- |
| Branch | `main` |
| Local main / RC HEAD | `1b5420e2ff3d4ee241750e91a0107a29cfc7087e` |
| `origin/main`, confirmed after fetch | `bf443dae06949017a0261f97b4690592d6f4fbd5` |
| `dev/v2`, preserved locally | `c5a29e3b9c65f4e35c8a006969e77508e713a1b9` |
| `origin/main...main` | `0 5`: 0 behind / 5 ahead |
| Worktree | Clean; `HEAD == main` |

The remote URL was confirmed as `https://github.com/Rosemantic/RoseToolBox.git`. An ancestry check and the complete unpublished commit list confirmed ordinary publication was possible. No unexpected local or remote-main movement was found.

## 2. Published V2 History

The RC push published exactly these five existing commits, in chronological order:

| Phase | Commit | Subject |
| --- | --- | --- |
| P1 | `325e19079123a272d5677dc14fbdf9a1f430dcd7` | feat: establish rosetoolbox v2 taxonomy and discovery |
| P2 | `9a8159028c2a13262f9ed0bc3ee98c3f99971212` | docs: audit v2 bookmark candidates |
| P2.1 | `654113528ec724e66b7124c6360a906345ba6c99` | feat: import approved v2 bookmark resources |
| P2.2 | `c5a29e3b9c65f4e35c8a006969e77508e713a1b9` | chore: polish rosetoolbox v2 imported resources |
| P3 | `1b5420e2ff3d4ee241750e91a0107a29cfc7087e` | docs: record rosetoolbox v2 rc integration |

All parent relationships matched the expected linear history from the published baseline. There was no squash, rebase, merge rewrite, amendment, cherry-pick, reset or force-push. Publication used ordinary `git push origin main`.

## 3. Pre-push Verification

All required commands ran on clean local `main` at the RC SHA before publication. Audit results were captured in JSON form.

| Command | Actual result |
| --- | --- |
| `npm audit` | PASS; 0 vulnerabilities |
| `npm audit --omit=dev` | PASS; 0 vulnerabilities |
| `npm test` | PASS; 57 tests, 57 passed, 0 failed, 0 skipped |
| `npm run validate` | PASS; 136 sites / 11 categories |
| `npm run build` | PASS; 136 sites / 11 categories |
| `npm run release-check -- --allow-placeholders` | PASS; 0 errors, 2 existing warnings |
| `git diff --check origin/main...main` | PASS; no whitespace errors |

Every command exited 0; the worktree remained clean. The product audit passed all 13 checks. Source and locally generated data matched, with 136 resources, 11 categories and 48 subcategories; IDs, slugs and canonical URLs were unique. All 121 original resource identities and icon blobs were preserved, all 15 approved imports and 14 new icon assets remained present, and 火星编程导航 retained its valid fallback.

Variant and all 5 G-class candidates remained excluded by identity/domain. ChatGPT, Kimi and Framer Motion retained their approved canonical migrations. `inviteCode`, `orderNo`, `/wallet`, `/login` and `/activate` had 0 matches in source and generated product data; decoded source URLs were also checked. Historical reports were excluded from product-data scanning. No product change or dependency upgrade was needed.

## 4. Push Result

The remote SHA was reconfirmed immediately before the authorized RC push:

```text
git push origin main
```

Git returned exit 0 and `bf443da..1b5420e main -> main`. Push completed at `2026-10-02T11:04:53.373Z`.

After push, `git fetch origin`, reference checks and `git ls-remote origin refs/heads/main` confirmed:

- Local `main == origin/main == 1b5420e2ff3d4ee241750e91a0107a29cfc7087e`.
- Ahead / behind: `0 / 0`.
- Worktree: clean.
- `dev/v2` remained at `c5a29e3b9c65f4e35c8a006969e77508e713a1b9`.

## 5. GitHub Actions / Pages

| Item | Actual result |
| --- | --- |
| Workflow | Deploy RoseTools to GitHub Pages |
| Run | [36999029640](https://github.com/Rosemantic/RoseToolBox/actions/runs/36999029640) |
| Event / commit | `push` / `1b5420e2ff3d4ee241750e91a0107a29cfc7087e` |
| Status / conclusion | `completed` / `success` |
| Build job | [110812217228](https://github.com/Rosemantic/RoseToolBox/actions/runs/36999029640/job/110812217228): completed / success |
| Deploy job | [110812274682](https://github.com/Rosemantic/RoseToolBox/actions/runs/36999029640/job/110812274682): completed / success |
| Deployment ID | `6806986744` |
| Successful deployment timestamp | `2026-10-02T11:05:24Z` |
| Actual production URL | [https://rosemantic.github.io/RoseToolBox/](https://rosemantic.github.io/RoseToolBox/) |

Build/test, Pages configuration, production build, artifact upload and deployment steps succeeded. There was no failing step. The deployment record SHA matched the published RC. The URL was obtained from actual Pages configuration and confirmed by the successful deployment status, rather than inferred from a repository name.

The existing workflow injects `SITE_URL` from `actions/configure-pages` output. No workflow or local `siteUrl` configuration was changed, and no manual redeployment was performed.

`Check external links` is an existing schedule / workflow_dispatch workflow, with no push trigger. Its absence from this RC push is non-blocking; it was not manually triggered.

## 6. Production Smoke Test

Actual browser checks used the deployed production URL after the RC deployment. Desktop viewport: 1280 × 900. Narrow viewport: 390 × 844. All 20 required checks passed.

| Check | Concrete live result |
| --- | --- |
| 1. Homepage | Rendered with the RoseTools title and homepage content |
| 2. Resource count | `136 个精选资源` |
| 3. Categories | All 11 category buttons rendered with the expected counts |
| 4. Search | `Prompt 图像生成` returned exactly GPT-Image2 Prompt Gallery |
| 5. Tag filter | `网页设计` selected and returned 13 resources |
| 6. Existing detail | ChatGPT static detail page opened with the correct heading |
| 7. Imported detail | GPT-Image2 Prompt Gallery card opened its detail drawer and independent static page |
| 8. 88API | Static page opened; heading and `https://88api.ai/` button target correct |
| 9. Evol | Static page opened; heading and `https://www.evolai.cn/` button target correct |
| 10. Narrow long title | GPT-Image2 Prompt Gallery card title occupied two lines, approximately 51.2px at 25.6px line height; title client/scroll widths both 211px |
| 11. ChatGPT target | Browser DOM official button: `https://chatgpt.com/` |
| 12. Kimi target | Browser DOM official button: `https://www.kimi.com/` |
| 13. Framer Motion target | Browser DOM official button: `https://motion.dev/` |
| 14. New local icon | GPT Gallery and Evol production icons completed loading, with natural width 64px |
| 15. Mars fallback | `火` visibly rendered with grid display and approximately 62.7 × 62.7px bounds; no image element |
| 16. Generated category | `/category/ai-tools/` rendered AI 工具 and links to existing and imported resources |
| 17. Generated resource | `/tools/gpt-image2-prompt-gallery/` rendered its complete detail content |
| 18. Narrow overflow | None: document client/scroll widths both 375px, card widths both 341px; narrow static page widths also both 375px |
| 19. Console | 0 warning/error entries in the captured browser log |
| 20. Canonical / OG | Homepage, category and all 7 browser-opened static detail pages used the actual production base and coherent route paths |

Initial browser-control timeouts were recovered through the supported browser interface. The results above were captured from successful live browser interactions and DOM observations after recovery. No source-only or localhost result was substituted for production browser evidence. Official external targets were inspected without logging into or exercising third-party account or paid functionality.

Screenshots were saved outside the repository as task outputs: `RoseToolBox_P4_production_home.jpg` and `RoseToolBox_P4_production_narrow.jpg`. Title wrapping was additionally checked by measured browser DOM layout. The browser returned to the production homepage, and the temporary viewport override was reset.

## 7. Production Artifact Check

Separate live HTTP checks fetched 16 representative production routes/assets. Every response was 200, and the resolved URL stayed at the intended production route.

| Artifact / route | Verified result |
| --- | --- |
| `/` | Homepage canonical / OG equal the actual production base |
| `/category/ai-tools/` | Generated category route and matching canonical / OG |
| `/tools/chatgpt/` | Existing generated resource route and coherent canonical / OG |
| `/tools/gpt-image2-prompt-gallery/` | Imported resource route and coherent canonical / OG |
| `/tools/88api/`, `/tools/evol/` | Imported detail routes and coherent canonical / OG |
| `/tools/mars-coder/`, `/tools/kimi/`, `/tools/framer-motion/` | Generated detail routes, fallback HTML and coherent canonical / OG |
| `/sitemap.xml` | 148 locations, all using the production base; representative V2 category and resource routes present |
| `/robots.txt` | Sitemap directive uses the actual production sitemap URL |
| `/manifest.webmanifest` and `/Logo.svg` | Valid manifest; start URL resolves to production homepage; declared logo fetch succeeds |
| `/sites-data.js` | Parsed data matches accepted source: 136 resources / 11 categories / 48 subcategories; sensitive patterns absent |
| `/site-config.js` | Generated runtime configuration includes the actual production base |
| `/icons/evol.webp` | Image/webp, 4,936 bytes; byte-identical to the accepted local icon |

Canonical / OG fields contain no localhost placeholders. These are representative generated-route and artifact checks, not an exhaustive crawl of external websites.

## 8. Known Non-blocking Items

- Local `siteUrl` remains empty, producing the existing local release-check warning. Production generation correctly used the Pages workflow's actual base URL.
- 134 resources still lack `verifiedAt`; the existing warning and honest pending-verification UI remain.
- 火星编程导航 keeps its verified, visible text-icon fallback.
- Variant remains deferred.
- All 5 G-class candidates remain deferred.

No fabricated configuration or verification date was added. There was no new blocking failure.

## 9. Changed Files in P4

P4 made **no product-source changes**. The product tree, dependencies and workflows remained at the accepted RC; local builds regenerated ignored output only. The worktree was clean before report creation.

The sole new repository file and sole file in the separately authorized P4 report commit is:

```text
docs/ROSETOOLBOX_V2_P4_PUBLICATION_REPORT.md
```

The next authorized steps are a report-only commit with subject `docs: record rosetoolbox v2 publication`, ordinary `git push origin main`, and verification of its push-triggered Pages workflow. The final report-commit SHA, remote synchronization and that workflow run are recorded in the separate delivery receipt and final response. This avoids a self-referential report amendment cycle.

## 10. Gate

```text
P4 RC PUBLISHED — V2 LIVE AND VERIFIED
```

The accepted RC was published normally, its Pages build/deployment succeeded, all 20 required production smoke checks passed, and representative generated artifacts passed. Report publication and its final workflow receipt follow as the documentation closeout of this phase.

```text
V2 PUBLISHED TO ORIGIN/MAIN
PRODUCTION PAGES VERIFIED
DEV/V2 PRESERVED LOCALLY
NO TAG OR GITHUB RELEASE CREATED
```
