# 首页加载性能优化策略

> **状态**：Phase 1–2 **已完成** · Phase 3–4 待做（代码仍以 [`homepage-architecture.md`](./homepage-architecture.md) 为准）  
> **关联**：[`static-homepage-plan.md`](./static-homepage-plan.md)

---

## 0. 目标

保留 **多语言多入口 HTML**，降低 Home 首屏 JS、缩短可交互时间；可选再提升 FCP/LCP（SSG）。

**North Star**：Home 首屏 **不加载 thirdweb**；文案 **按 URL locale 只带一种语言**。

---

## 1. 现状基线

| 阶段 | Home sync JS（`en/index.html`） | 说明 |
|------|--------------------------------|------|
| Phase 1 后（改前） | ~817 KB · 最大共享包 ~748 KB · 5 files | 11 locale 静态进共享图 |
| Phase 2 后 | **~539 KB · 11 files · 最大 ~174 KB（react-dom）** | HTML `#aegis-messages` + 安全 `manualChunks` |

**根因（Phase 1）**：Home 曾使用 `WebRootProviders`；现 **`HomeProviders`**（仅 Query）。  
**根因（Phase 2）**：`messages.ts` 曾静态 import 11 语言；现 bootstrap + `import()`。

---

## 2. 原则

1. 多入口 HTML **保留**  
2. **先减 JS**，再 SSG  
3. build 已知 locale → HTML inline；切换 lazy  
4. DApp 行为不变  
5. 每阶段 `pnpm probe:bundle` 对比体积

---

## 3. 分阶段方案

```
Phase 1  Home 轻量 Provider（去 thirdweb）     ← ✅ 已完成
Phase 2  i18n 按 locale 减重 + vendor 拆包     ← ✅ 已完成
Phase 3  SSG 预渲染（可选）                     ← P2
Phase 4  CSS / redirect 细项                   ← P3
```

### Phase 1 · Home 轻量 Provider（P0）✅

- `HomeProviders`：仅 `QueryProvider`
- Home 首屏不加载 thirdweb chunk

### Phase 2 · i18n 按 locale + manualChunks（P1）✅

- `renderHomeDocument` / `renderAppDocument` 注入 `#aegis-messages`
- `getMessagesSync` 读 bootstrap；`loadMessages` → 动态 `import('~/i18n/messages/{locale}')`
- 全量静态表仅在 `messages-catalog.ts`（render-home / SSR）
- `vite.config.ts` `manualChunks`：`react` / `react-dom` / `query` / `radix` / `i18next` / …

### Phase 3 · SSG（P2 · 可选）

- `renderToString(HomePage)` → `#root`；客户端 hydrate

### Phase 4 · 细项

- R2 home CSS 瘦身 · 根路径 302 · wallet island **仅 DApp**

---

## 4. 明确不做

删多语言 HTML · 每语言重复打包 React · 只调 preload · Home 继续挂 Thirdweb「备用」

---

## 5. 验收

```bash
pnpm build && pnpm probe:bundle
```

Home `en`：**不应**在 sync script 中出现其它语言长文案（如日文「未来の価値」）；切换语言再拉对应 chunk。

---

**下一步**：可选 Phase 3 SSG；或进一步让 Home HTML 只注入 `home`+`common`（需收窄 `Messages` 类型 / 双 provider）。
