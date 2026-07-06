# 首页加载性能优化策略

> **状态**：已批准 · **待实施**（代码仍以 [`homepage-architecture.md`](./homepage-architecture.md) 为准）  
> **关联**：[`static-homepage-plan.md`](./static-homepage-plan.md) · [`refactor-plan-minimal-world-class.md`](./refactor-plan-minimal-world-class.md)（R2 / R7）

---

## 0. 目标

保留 **多语言多入口 HTML**，降低 Home 首屏 JS、缩短可交互时间；可选再提升 FCP/LCP（SSG）。

**North Star**：Home 首屏 **不加载 thirdweb**；文案 **按 URL locale 只带一种语言**。

---

## 1. 现状基线（`pnpm build` · `dist/en/`）

| 指标 | Home | DApp |
|------|------|------|
| JS chunk 数 | 65 | 70 |
| JS 体积（未 gzip） | **~1 252 KB** | **~1 863 KB** |
| 与 DApp 共享 chunk | **64** | — |
| Home 独有 | `home-main`（~44 KB） | — |

**根因**：`src/home/main.tsx` 使用 `WebRootProviders`（thirdweb + AutoConnect + Auth），Home 与 DApp 共享 almost 同一依赖图。详见 [`homepage-architecture.md` §2](./homepage-architecture.md#2-现状-vs-目标agent-勿混读)。

---

## 2. 原则

1. 多入口 HTML **保留**  
2. **先减 JS**，再 SSG  
3. build 已知 locale → inline / 拆包 i18n  
4. DApp 行为不变  
5. 每阶段 build 对比体积

---

## 3. 分阶段方案

```
Phase 1  Home 轻量 Provider（去 thirdweb）     ← P0，可独立于 R0
Phase 2  i18n 按 locale 减重                   ← P1，建议与 R7 home-renderer 同 PR
Phase 3  SSG 预渲染（可选）                     ← P2
Phase 4  CSS / redirect 细项                   ← P3
```

### Phase 1 · Home 轻量 Provider（P0）

- 新建 `HomeProviders`：仅 `QueryProvider`（服务 `use-home-popup-notice`）
- `home/main.tsx` 移除 `WebRootProviders`；`main.tsx`（DApp）保留
- **预期**：Home JS ~200–400 KB；`dist/en/index.html` 无 thirdweb chunk

**验收**：build 后 chunk 断言 · Home 动效/popup/语言切换 · DApp 连接不受影响

### Phase 2 · i18n 按 locale（P1）

- **推荐**：`renderHomeDocument(locale)` inline `#aegis-messages` JSON；切换语言 lazy import
- **不推荐**：纯 pathname 动态 import（首屏易闪动）

### Phase 3 · SSG（P2 · 可选）

- `render-home.mjs` + `renderToString(HomePage)` → `#root`；客户端 hydrate

### Phase 4 · 细项

- R2 home CSS 瘦身 · 根路径 302 · wallet island **仅 DApp**（Home 仍链 `/app.html`）

---

## 4. 明确不做

删多语言 HTML · 每语言重复打包 React · 只调 preload · Home 继续挂 Thirdweb「备用」

---

## 5. 与重构衔接

| PR | 关系 |
|----|------|
| R2 | home/dapp CSS 双 bundle |
| R7 | `home-renderer` + Phase 2 inline i18n；`wallet-loader` rename |
| R8 | DApp `WebRootProviders` 终态归位 |

Phase 1 **不依赖** R0 Tab Registry。

---

## 6. 验收

```bash
pnpm build
node -e "
const fs=require('fs');
const html=fs.readFileSync('dist/en/index.html','utf8');
const scripts=[...html.matchAll(/src=\\\"(\\/assets\\/[^\\\"]+)\\\"/g)].map(m=>m[1]);
let total=0;
for (const s of scripts) { try { total+=fs.statSync('dist'+s).size; } catch {} }
console.log('Home JS KB:', (total/1024).toFixed(0));
"
```

Phase 1 后新增 `scripts/assert-home-bundle.mjs`（denylist thirdweb chunk 名）建议纳入 CI。

---

**下一步**：实施 Phase 1（见 [`homepage-architecture.md` §2 差距表](./homepage-architecture.md#2-现状-vs-目标agent-勿混读)）。
