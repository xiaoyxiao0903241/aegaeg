# #18 幸运奖详情 — R7 Post-Code / deletion-first

> **审查方：** Grok 4.5 high（独立 · 只读）  
> **日期：** 2026-08-03  
> **复检：** 2026-08-03（C1/H1/M1 修复后）  
> **范围：** working tree vs HEAD（abis / rewards-read / lucky view+content / mixed-claim-widget / SelectMenu / i18n / query-keys / dapp-data-gaps §4.2 / A5 profiles）  
> **对照：** AGENTS.md §8.0 R6/R7 · ui-leaf §2.6 · money-path Rewards Mixed Lucky · 手册 `aegisluckypool` / `aegisdailypurchasetracker` §14.1

---

## Verdict

**PASS** — Critical = **0**。残留 Medium/Low 不挡 PASS。

---

## 复检（2026-08-03）

| 原 ID | 项 | 复检证据 | 状态 |
|-------|----|----------|------|
| C1 | §2.6 CTA 任意长度 | `rewards-mixed-claim-widget.tsx`：双行 CTA 为 `Text variant="detail"` + `leading-4`；`rg` 无 `text-[`/`leading-[`/`*[Nrem]`/`*[Npx]` | **已修复** |
| H1 | 资格读失败 → 未获得 | `eligibilityFailed = walletReady && !pending && (isError \|\| data == null)` → `NON_NUMERIC_EMPTY`；hint 同步隐藏 | **已修复** |
| M1 | 1s 链 refetch | `refetchInterval: 15_000`；本地 1s 仅驱动倒计时 | **已降频（可接受）** |

实现方报告 A5 再测 `N=R=196 fail=0` · CTA `h=52` — 与 §2.6 清零一致；本复检未重跑 measure，采信其顶字段声明。

---

## Critical

（空）

---

## High

（空 — 原 H1 已修复）

---

## Medium（残留 · 不挡 PASS）

| ID | 项 | 说明 |
|----|----|------|
| M2 | 复投卡 success 绿 · 共享面 | Mixed widget 复投卡 `border-success/35 bg-success-soft` 影响全 Mixed rail；与 slider 蓝轨并存 |
| M3 | FAQ 活期语种 | 语义全 locale 已纠偏；非 zh/en 仍英文壳（含 zht） |
| M4 | SelectMenu pill→copy | primitive 默认字阶变更；pill 调用点 = Mixed claim |

---

## Low

| ID | 项 | 说明 |
|----|----|------|
| L1 | i18n `?.` / `??` | 键已在 zh 类型源；可选链多余 |
| L2 | `RewardsStatCard label` + children | children 自绘 label（Hub 同构） |
| L3 | CTA `!py-2 !font-normal` | 非 §2.6 任意长度；important 覆盖味，可后续收进 density/token |
| L4 | abis 英文注释 | 存量惯例 |

---

## 轴检查（复检后）

| 轴 | 结论 | 笔记 |
|----|------|------|
| 1 正确性 | **pass** | getRound endTime named/[3]；`purchaseTracker()` fail-closed；资格失败诚实 `—`；倒计时本地 tick |
| 2 deletion-first | **pass*** | 假零资格已删；§2.6 任意长已清；\*M2–M4 / `!` 残留 |
| 3 共享回归 | **Slider pass · 卡/Menu Med** | ClaimSplitSlider 未改绿轨；复投卡绿 = M2；SelectMenu = M4 |
| 4 i18n | **keys pass · FAQ 语种 Med** | lucky 键齐；FAQ 语义齐 |
| 5 金钱写路径 | **pass** | 仍 `claimRewardMixed`；无新写链 |
| 6 注释 | **pass*** | 页袋/read 简中；abis 英文例外 |

---

## 共享回归风险（残留）

1. Mixed 复投卡 success 绿（M2）— 合并前目视 referral/participate/cobuild  
2. SelectMenu pill copy（M4）— spot-check 周期 pill  
3. ClaimSplitSlider — 无绿轨回归  

---

## 反面意见

Critical/资格假态/1s 轮询三闸已关；Post-Code 可 PASS。若追求 deletion-first 满分，再收 M2 范围与 CTA `!important`，但不构成 R7 否决。
