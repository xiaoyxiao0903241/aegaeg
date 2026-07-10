# 首页架构与入口（代码现状 SSOT）

> **读者**：后续 AI agent / 开发者 — **改 Home、动效、i18n HTML、Provider 前先读本文**  
> **最后对齐代码**：2026-07-09  
> **关联**：[`static-homepage-plan.md`](./static-homepage-plan.md)（目标规则）· [`homepage-load-optimization.md`](./homepage-load-optimization.md)（性能优化路线）· [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md)（动效）

---

## 0. 文档地图（避免混淆）

| 文档 | 用途 | 写的是什么 |
|------|------|------------|
| **本文** | **代码今天怎么做** | 路径、Provider、HTML 生成、命名陷阱 |
| `static-homepage-plan.md` | 产品/性能 **目标** | 理想态；与现状偏差见 §2 |
| `homepage-load-optimization.md` | 性能优化路线 | Phase 1 已完成；Phase 2–4 待做 |
| `homepage-animation-guidelines.md` | 动效设计规则 | CSS + IO；runtime 见 `home-reveal-loader.ts` |
| [`foundation/`](./foundation/README.md) | DApp / Foundation 视觉与 API | 双核 runbook · api |
| [`docs/README.md`](./README.md) | 全项目文档索引 | 当前分支 = baseline |

**命名陷阱（必读）**

| 名字 | 实际含义 | 不是 |
|------|----------|------|
| `src/views/home/home-reveal-loader.ts` | 首页 **动效 boot**（reveal / 计数 / 懒图） | 钱包连接、地址探测 |
| `bootHomeReveal()` | React mount 后启动 IO | 加载 thirdweb |
| `data-home-motion-ready` | 动效脚本已就绪，CSS 可播放入场 | 钱包已连接 |
| `wallet.css`（仅 `app.css` import） | connected chip · ConnectEmbed · tw-modal shell | Connect CTA（已走 `Button` / `DappActionButton`） |

---

## 1. 双入口

| 入口 HTML | JS 入口 | Provider 栈 | 用途 |
|-----------|---------|-------------|------|
| `{locale}/index.html` | `src/views/home/main.tsx` | `I18nProvider` → **`HomeProviders`** → `HomePage` | 营销首页 |
| `{locale}/app.html` | `src/app/main.tsx` | `I18nProvider` → **`WebRootProviders`** → `DappShell` | DApp |

根路径 **`/index.html`**、**`/app.html`** 仅为 **客户端 locale 检测 + redirect**（`home-renderer.ts` 内联 script），不是内容页。

**Build 命令**：`pnpm build` = `tsc -b` → `pnpm render:home` → `vite build`  
**Dev**：`pnpm dev` 同样先跑 `render:home` 再生 HTML。

---

## 2. 现状 vs 目标（agent 勿混读）

| 主题 | **现状（代码）** | **目标（static-homepage-plan / 优化 Phase 1）** |
|------|------------------|--------------------------------------------------|
| Home 与 thirdweb | **`views/home/main.tsx`** 使用 **`HomeProviders`**（仅 `QueryProvider`，**无 thirdweb**） | ✅ 已达成；DApp 仍用 `WebRootProviders` |
| Home 首屏 JS | build 后 ~**1 252 KB**（65 chunk，与 DApp 共享 64 个） | 去掉 thirdweb 后 ~200–400 KB（见 load-optimization） |
| Home 是否连钱包 / 探地址 | **否**（无 ConnectButton；不读 `useActiveAccount` 做 UI） | 保持否 |
| Home CTA | Hero / Header **`<a href="/{locale}/app.html">`** | 保持；**不是**首页弹 connect modal |
| 首页 wallet island | **未实现** | 文档曾写 hover 预加载 island — **defer**，钱包在 DApp 入口 |
| HTML 内容 | **薄壳** + `#aegis-messages`（当前 locale 全文案 JSON）；**无** section DOM SSG | 可选 Phase 3 预渲染 |
| i18n 打包 | 首屏读 HTML bootstrap；切换语言 `import()` 单 locale | ✅ Phase 2 已落地（见 load-optimization） |
| 链支持（DApp） | `supportedChains = [bsc]` **仅 BSC** | `AGENTS.md` 8.6 规划 BSC + Ethereum；Ethereum **尚未接入** |

---

## 3. 多语言 HTML 生成

**脚本**：`scripts/render-home.mjs`  
**渲染 SSOT**：`src/views/home/home-renderer.ts`

### 3.1 产出

| 文件 | 数量 | 说明 |
|------|------|------|
| `/index.html`、`/app.html` | 2 | redirect + `noindex` |
| `/{locale}/index.html` | 11 | Home 薄壳 + `#aegis-messages` |
| `/{locale}/app.html` | 11 | DApp 薄壳 + `#aegis-messages` |
| **合计 Vite input** | **24** | `vite.config.ts` `rollupOptions.input` |

**Locale 列表**（`src/i18n/locales.ts`）：`en`, `zh`, `zht`, `id`, `ko`, `ja`, `vi`, `es`, `ru`, `hi`, `tr`

### 3.2 每个 Home HTML 内有什么

- `html[lang]`、`title`、`meta description`（来自当前 locale `messages.home.meta`）
- `#aegis-messages`：`application/json`，当前 locale 全文案（供 `getMessagesSync` 首屏同步读）
- hero poster、`montserrat` 字体 **preload**
- 滚动恢复 boot：`PAGE_SCROLL_RESTORATION_BOOT_SCRIPT`
- `link` → `/src/shared/styles/home.css`（dev）/ 打包后 hashed CSS
- **空** `<div id="root">` + `views/home/main.tsx`

**没有什么**：预渲染的 section DOM；其它 10 种语言的 message 模块（切换时再 `import()`）。

### 3.3 性能含义

- ✅ SEO / 分享 meta、直链 `/zh/`、CDN 按路径缓存  
- ✅ 多 HTML **共用** 同一套 runtime chunk；文案按入口 locale 注入  
- ✅ 切换语言只拉一个 locale chunk（`loadMessages`）  
- ❌ **不**缩短 FCP 到「无 JS 可见正文」（仍 CSR；SSG 见 Phase 3）  
- 探针：`pnpm probe:bundle`（`scripts/probe-home-bundle.mjs`）

---

## 4. 运行时：Home 挂载顺序

```
src/views/home/main.tsx
  bootHomeApp()               ← src/app/bootstrap/home-boot.ts
  import shared/styles/home.css
  I18nProvider
    HomeProviders             ← 仅 QueryProvider，无 thirdweb
      HomeApp
        useLayoutEffect:
          restoreHomeScroll()
          bootHomeReveal()    ← views/home/home-reveal-loader.ts，动效非钱包
        HomePage
```

### 4.1 `home-reveal-loader.ts`（动效 boot）

- **调用时机**：`useLayoutEffect`（React 已写入 `[data-reveal]` 等 DOM）
- **职责**：`img[data-src]` 懒加载；`[data-reveal]` IntersectionObserver；`[data-count-target]` / `[data-count-panel]` 计数；设置 `document.documentElement.dataset.homeMotionReady = 'true'`
- **CSS 配合**：`src/shared/styles/home-motion.css`（`html:not([data-home-motion-ready])` 初始隐藏）

### 4.2 Home 实际用到的「重」依赖

| 依赖 | 用途 |
|------|------|
| `HomeProviders` | 仅 React Query（popup notice 等 API） |
| `@tanstack/react-query` | `use-home-popup-notice.ts` 拉 popup API |
| `I18nProvider` | 文案；首屏 `getMessagesSync(locale)` |
| `Button` | Header/Hero CTA 外观（不依赖 `wallet.css`） |

Home **不**渲染 `ConnectButton`；Header/Hero 仅链接到 DApp。

---

## 5. 样式入口

| 入口 | 文件 | 内容 |
|------|------|------|
| Home | `src/shared/styles/home.css` | `tailwindcss` + `shared.css` + `home-motion.css`（**不含** `wallet.css`） |
| DApp | `src/shared/styles/app.css` | `shared.css` + utilities + `wallet.css` + DApp shell |

**CSS 双 bundle**：`home.css` 与 `app.css` 分入口；Home 首屏不携带 Connect / `tw-modal` 壳规则。

---

## 6. 文案 SSOT

| 层 | 路径 |
|----|------|
| 静态 HTML meta | `home-renderer.ts` + `homeMessagesByLocale[locale].meta` |
| 运行时 section | `src/i18n/messages/home/{locale}.ts` → `messages.home` |
| 构建内容 helper | `buildHomeContent`（`src/i18n/messages/home/`） |

切换语言：`I18nProvider.setLocale` + `history.replaceState` 更新 pathname 前缀。

---

## 7. 验证（现状）

```bash
pnpm check              # tsc + architecture + unit（收工门禁）
pnpm build              # Home 入口不应预载 thirdweb；DApp 可
pnpm test:e2e           # 视觉 + Swap 行为契约
```

**手工**：

- [ ] `/en/` 各 section、动效、语言切换  
- [ ] Enter App / Launch → 进入 **`/en/app.html`**（非首页 modal）  
- [ ] DApp 内 Connect 正常  
- [ ] popup notice（依赖 API 时）

**后续性能**：见 `homepage-load-optimization.md` Phase 2–4。

---

## 8. agent 常见误判

| 误判 | 事实 |
|------|------|
| 「删 home-reveal-loader = 去掉钱包」 | 删的是 **动效**；钱包在 DApp |
| 「Home 不探测地址所以不需要 reveal boot」 | 需要 **等价动效 boot**；不可无声删除 |
| 「多语言 HTML 已 SSG」 | 只有 meta + 空 root |
| 「static-homepage-plan 已全部落地」 | Home 已去 thirdweb；wallet island **未**落地 |
| 「文档写 22 HTML」 | 准确为 **24 Vite HTML 入口**（11×2 + 2 redirect） |
| 「AGENTS 8.6 已有 Ethereum 链」 | 代码 `supportedChains` **仅 BSC** |

---

**维护**：改 Home 入口、Provider、`render-home.mjs`、`home-reveal-loader`、`home-renderer` 时 **同步更新本文 §2 表格**。
