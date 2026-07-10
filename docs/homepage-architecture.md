# 首页架构（代码现状 SSOT）

> 改 Home / 动效 / i18n HTML / Provider 前先读。动效规则见 [`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md)。

## 命名陷阱

| 名字 | 是 | 不是 |
|------|----|------|
| `home-reveal-loader.ts` / `bootHomeReveal()` | 动效 boot（reveal / 计数 / 懒图） | 钱包 / thirdweb |
| `data-home-motion-ready` | 动效可播放 | 钱包已连接 |
| `wallet.css`（仅 `app.css`） | Connect 壳 | Home CTA（走 `Button`） |

## 双入口

| HTML | JS | Providers | 用途 |
|------|-----|-----------|------|
| `{locale}/index.html` | `views/home/main.tsx` | `HomeProviders`（仅 Query，**无** thirdweb） | 营销首页 |
| `{locale}/app.html` | `app/main.tsx` | `WebRootProviders` | DApp |

`/index.html`、`/app.html` = locale redirect，非内容页。Home CTA → `/{locale}/app.html`（首页不弹钱包）。

`pnpm build` / `pnpm dev` 均先 `render:home`。

## 多语言 HTML

- 脚本：`scripts/render-home.mjs`；渲染：`views/home/home-renderer.ts`
- Vite input **24**：11×`index` + 11×`app` + 2 redirect
- Locale：`src/i18n/locales.ts`（11 种）
- 每页：`#aegis-messages`（当前 locale JSON）+ 空 `#root`；**无** section SSG
- 切换语言：`import()` 单 locale；探针 `pnpm probe:bundle`

## 挂载

```text
home/main.tsx → home-boot → I18nProvider → HomeProviders → HomeApp
  useLayoutEffect: restoreHomeScroll + bootHomeReveal()
  HomePage
```

`bootHomeReveal`：懒图 / `[data-reveal]` IO / 计数；置 `html[data-home-motion-ready]`。CSS：`home-motion.css`。

## 样式入口

| 面 | 文件 |
|----|------|
| Home | `shared/styles/home.css`（无 `wallet.css`） |
| DApp | `shared/styles/app.css`（含 `wallet.css`） |

## 事实速查

| 项 | 现状 |
|----|------|
| Home × thirdweb | 无 |
| 首页 wallet island | 未做（钱包在 DApp） |
| HTML | 薄壳 CSR，非 SSG |
| DApp 链 | `supportedChains` **仅 BSC** |

## 验证

`pnpm check` · `pnpm build`（Home 不预载 thirdweb；`modulePreload: false` 有意保留）· `pnpm probe:bundle`（Home sync 污染标记 / 体积上限 **fail**；勿只靠 `thirdweb/react` 字符串）· 可选 `pnpm test:e2e`

> Bundle 债（S6，2026-07-10 复测）：多入口下拆 `thirdweb`/`viem` 仍无绿路径。
>
> | 策略 | Home | DApp |
> |------|------|------|
> | `manualChunks` → `thirdweb`/`viem` | 污染 ~3.5MB sync（共享 `LocalizedErrorBoundary` 从 thirdweb chunk 取被吸收的共享依赖） | main 变小，总 sync 膨胀 |
> | `codeSplitting` + `includeDependenciesRecursively: false`（仅 tw/viem） | 绿 ~435KB、无 thirdweb | 总 sync ~1.6MB→~4.6MB（thirdweb 内部 async 被压成单 sync chunk） |
> | 全量 groups + `false` + `strictExecutionOrder` | 图打穿（slippage 泄漏进 Home） | 不可用 |
>
> 下一条可行路径：对整棵 `WebRootProviders` + `DappShell` 树做 lazy（结构拆图），或分 build；勿再盲加 named vendor chunk / 勿只 lazy Provider。
