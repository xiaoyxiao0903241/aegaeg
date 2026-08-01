# Homepage Animation Guidelines

> Boot：`src/views/home/home-reveal-loader.ts`（见 [`homepage-architecture.md`](./homepage-architecture.md)）  
> CSS：`src/shared/styles/home-motion.css`

Figma SSOT 同根 `AGENTS.md`。参考站 `https://aegis-x5.vercel.app/` 仅动效基准，非素材源。

## Principles

- CSS + 少量 IO / rAF；禁 Framer / GSAP / Anime / Lottie。
- 只动画 `opacity` / `transform` / `clip-path` / `filter` / `box-shadow`。
- 每区一个入场主意；首页**不**按 `prefers-reduced-motion` 降级。
- Hover 不改卡片几何（阴影 / 边框 / 轻 tint）。
- Runtime 只切状态；视觉时序归 CSS。

## Runtime

| 件                 | 位置                                                  |
| ------------------ | ----------------------------------------------------- |
| `bootHomeReveal()` | `home-reveal-loader.ts`；`main.tsx` `useLayoutEffect` |
| Ready              | `html[data-home-motion-ready]`                        |
| 懒图               | `img[data-src]`                                       |
| Reveal             | `[data-reveal]` → `data-visible`                      |
| 计数               | `[data-count-target]` / `[data-count-panel]`          |

## Section

- Hero rays：背景层连续旋转；媒体轻微 transform。
- Metrics：面板中线展开 → 数值入场 → count + pop。
- Token / flywheel：opacity/transform 入场；hover 阴影/滤镜。
- Roadmap：轨自上而下；点按 index 延迟；当前点可 breathe。
- Security：角色/连线先，卡片 index 延迟；hover 仅阴影。
- FAQ：答案 max-height/opacity；箭头绕心旋转。

## DApp

可复用同一动效语言于折叠 / tab / drawer；内容对齐优先于动效，勿改测量布局。
