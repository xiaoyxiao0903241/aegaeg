# 首页架构（代码 SSOT）

> 改 Home / 动效 / i18n HTML / Provider 前先读。动效：[`homepage-animation-guidelines.md`](./homepage-animation-guidelines.md)。

## 命名

| 名字                                         | 是         | 不是            |
| -------------------------------------------- | ---------- | --------------- |
| `home-reveal-loader.ts` / `bootHomeReveal()` | 动效 boot  | 钱包 / thirdweb |
| `data-home-motion-ready`                     | 动效可播放 | 钱包已连接      |

## 双入口

| HTML                  | JS                    | Providers                                |
| --------------------- | --------------------- | ---------------------------------------- |
| `{locale}/index.html` | `views/home/main.tsx` | `HomeProviders`（仅 Query，无 thirdweb） |
| `{locale}/app.html`   | `app/main.tsx`        | `WebRootProviders`                       |

`/index.html`、`/app.html` = locale redirect。Home CTA → `/{locale}/app.html`。

## 多语言 HTML

- `scripts/render-home.mjs` → `views/home/home-renderer.ts`
- Vite input：11×`index` + 11×`app` + 2 redirect（locale：`src/i18n/locales.ts`）
- 每页：`#aegis-messages` + 空 `#root`（薄壳 CSR，非 SSG）

## 挂载

```text
home/main.tsx → I18nProvider → HomeProviders → HomeApp
  useLayoutEffect: restoreHomeScroll + bootHomeReveal()
```

样式：Home → `shared/styles/home.css`；DApp → `shared/styles/app.css`（含 `wallet.css`）。

## 约束

| 项          | 规则                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| Home × web3 | 禁 `src/web3` / `thirdweb` / `viem`（depcruise `home-no-web3`）            |
| 链          | `supportedChains` 仅 BSC                                                   |
| Bundle      | `pnpm build` 后 `pnpm probe:bundle`：Home sync 污染标记或体积超限 → exit 1 |

## 验证

`pnpm check` · `pnpm build` · `pnpm probe:bundle` · 可选 `pnpm test:e2e`
