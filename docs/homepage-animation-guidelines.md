# Homepage Animation Guidelines

> **Runtime SSOT**：动效 boot 在 `src/views/home/home-reveal-loader.ts` — 详见 [`homepage-architecture.md` §4.1](./homepage-architecture.md#41-home-reveal-loaderts动效-boot)  
> **CSS SSOT**：`src/shared/styles/home-motion.css`（`data-reveal` / `data-visible` / `data-home-motion-ready`）

Source of truth:

- **Figma (canonical)**：`https://www.figma.com/design/sXWXDvBrLeg5r0NnP1SMZH/AEGIS-X--Copy---Copy---Copy-`（同根 `AGENTS.md`）
- Reference site `https://aegis-x5.vercel.app/` is an animation benchmark only, not an asset source.

## Principles

- Use CSS transitions/keyframes plus small `IntersectionObserver` / `requestAnimationFrame` helpers. Do not add Framer Motion, GSAP, Anime, Lottie, or other runtime animation libraries.
- Animate low-cost properties: `opacity`, `transform`, `clip-path`, `filter`, and `box-shadow`. Do not animate layout-driving width, height, top, left, margin, padding, or grid tracks for normal entrance/hover motion.
- Motion should be restrained and continuous: one clear entrance idea per section, no decorative multi-stage choreography.
- Homepage motion intentionally ignores `prefers-reduced-motion`; all devices keep the same animation semantics.
- Hover must not move card geometry. Card hover may use stronger shadow, border emphasis, subtle saturation/filter, or a very light tint when explicitly required.
- Keep animation state class-driven. Runtime code only toggles visibility/counting state; CSS owns visual timing.

## Runtime boot (today)

| Piece | Location | Notes |
|-------|----------|-------|
| Boot entry | `bootHomeReveal()` in `src/views/home/home-reveal-loader.ts` | Called from `src/views/home/main.tsx` `useLayoutEffect` **after** React mount |
| Ready flag | `html[data-home-motion-ready]` | Set when IO observers registered; CSS hides unrevealed nodes until then |
| Lazy images | `img[data-src]` | IntersectionObserver, `rootMargin: 320px` |
| Section reveal | `[data-reveal]` | IO + `data-visible="true"` |
| Count-up | `[data-count-target]`, `[data-count-panel]` | IO + rAF; metrics panel sequence in CSS |

**Do not delete** this boot script when removing wallet from Home — it has no wallet logic.

> **历史命名**：原 `wallet-loader.ts` / `bootWalletLoader()` / `data-wallet-loader-ready` 已于 R7-move rename 为现名，行为不变。

## Section Rules

- Hero rays: continuous background rotation on a pseudo/vector layer behind the media. The media float is subtle and transform-only.
- Metrics: when entering viewport, the dark panel expands from the center first, then metrics fade/raise in, then numbers count and run a small pop animation.
- Token/flywheel cards: entrance can fan cards into place with opacity/transform. Hover uses shadow/filter and image emphasis, not layout movement.
- Roadmap: when the timeline enters viewport, the vertical rail reveals from top to bottom; each dot scales in by index delay; the current dot may breathe after the reveal completes.
- Security: character and connector reveal first, then cards enter with index delay. Card hover uses shadow only.
- FAQ: answer expansion changes max-height/opacity; the arrow rotates around its center without shifting.

## DApp Carryover

- DApp may reuse the same motion language only where it helps state clarity: panel collapse, tab surfaces, drawer/menu, and small hover/focus states.
- DApp content alignment has priority over animation. Do not introduce motion that changes measured layout or affects Figma comparison screenshots.
