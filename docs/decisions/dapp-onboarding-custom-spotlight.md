# 决策：DApp 新手引导自研 Spotlight

**日期：** 2026-08-06  
**状态：** 已落地

## 决定

卸掉 `@reactour/tour`，改用自研 `OnboardingSpotlight`：

- 高亮：0 padding、`rounded-md` primary 实线框；落到新目标后播一次外扩「落点一击」
- 气泡：`placeOnboardingTooltip` 视口躲避（单测覆盖）
- H5：`nav-*` 开抽屉并等待 `MOBILE_NAV_ENTER_MS`（与抽屉 translate 入场对齐）后再量坐标；完成/跳过关抽屉并回兑换 hub
- 最后一步隐藏「跳过」；文案点阵与高亮用 `displayStep` 对齐（prepare 完成后再推进）
- 进度点样式复用 `carouselIndicatorDotClass`

## 不做

- 无限脉冲 / 辉光
- 换 driver.js 等第三方 tour

## 落点

`src/views/dapp/host/onboarding/*` · Figma 教程帧见 `docs/figma-pages.md`「新手教程」
