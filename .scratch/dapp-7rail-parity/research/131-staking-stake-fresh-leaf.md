# 131 · Stake fresh leaf · PC `4448:220`

> **Status：** `page-done`（本轮 fresh · Critical=0）  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **本站：** `http://127.0.0.1:5174/zh/app.html#staking/stake`  
> **旧 leaf / page-done：** 作废（含 `48`/`61`/`100`）；本文为 SSOT  
> **日期：** 2026-08-02 · session `staking-5subs-fresh2`  
> **硬禁：** 任意 `*[Npx]` / `*[Nrem]`

---

## 本页登记

| 项 | 值 |
|----|-----|
| 帧 | DApp — 质押/质押 (Desktop 1920) |
| PC node | `4448:220` |
| leaf | `.scratch/dapp-7rail-parity/research/131-staking-stake-fresh-leaf.md` |
| 队列 | `#12` · [`120-fresh-releaf-queue.md`](./120-fresh-releaf-queue.md) |

---

## A1 手册逐行

**章节清单：** `01-frontend-integration-guide.md` §8.1–8.3 · `money-path-map.md` stake write · contracts Liquid/Locked。

| 手册条 | G-id | 现码 | 裁决 |
|--------|------|------|------|
| 活期 `liquidStake` | `G-8.2-T11` | `submit-stake` / LiquidStaking | 跟手册 |
| 定期 `lockedStake` 三池 | `G-8.3-T13` | 180/360/540 period → pool | 跟手册 |
| 推荐绑定门闸 | `G-8.2-T11` 前置 | `blockReason` / CTA | 跟手册 |
| AGX approve | `G-8.2-T10` / `G-8.3-T12` | write 前授权 | 跟手册 |
| Mixed 领奖 / claimPrincipal | `G-8.2-T13–T14` | **资产轨**；本页无写 | N/A |

**张力：** 稿右栏概览/仓位/记录/图为 UI MUST；图无 indexer → 空 series + `$0.00`。  
**R4a：** 写入口跟手册 liquid/locked；不发明第三条写链。

---

## A2 OpenAPI

| 稿面数值 | path / 源 | 接线 |
|----------|-----------|------|
| 总质押量 / Epoch / Rebase | 链上 overview / stake reads | live 或诚实空 |
| 我的仓位 | 链上 stake 聚合 | live / `0.00` |
| 质押记录 | 无完整 indexer | 空表 + empty copy |
| TVL 图 | 无历史 API | 空图 + `$0.00`/`+0.0%` |
| 收益率 meta | 协议档 + 链上 | live / 诚实空 |

---

## A3 原型 WebBridge（五字段）

| # | 字段 | 值 |
|---|------|-----|
| 1 | http URL | `http://127.0.0.1:8766/AEGIS%20X%20DApp.html`（`~/Downloads/新/` · `:8766`） |
| 2 | 入口 | rail **质押** → ModeCard **质押** |
| 3 | 有序点击 | ① rail 质押；② ModeCard「质押」；③ 本站直达 `#staking/stake` 验视觉 |
| 4 | vs 本站 | 原型演示数；本站余额 live、meta/仓位诚实空或链上、图空态 |
| 5 | 执行日 | 2026-08-02 · session `staking-5subs-fresh` / `fresh2` |

---

## A4 Figma 全 leaf 清单

页帧 `get_design_context` + `get_metadata` · `skillNames=figma-design-to-code`。子：`4448:599` form · `4449:223` overview · `4449:246` positions · `4450:223` mechanism · `4585:510` chart · `4450:276` FAQ。

| # | nodeId | leaf | 稿规格 |
|---|--------|------|--------|
| L1 | `4448:595` | 返回 | 16 Medium |
| L2 | `4448:589` | menu | 36×36 · outlined |
| L3 | `4448:597` | 标题 | 21 Semi |
| L4 | `4448:598` | 副文 | 13 muted |
| L5 | `4448:601` | Segment | **轨高36** · p4 · thumb28 · coral |
| L6 | `4448:611` | AmountBox | **h53** · px14 py12 · figure24 · icon**22** |
| L7 | `4448:617` | maxB | **h27** · coral-soft · fs12 |
| L8 | `4448:619` | infoBox | p16 · gap12 · border · r16 |
| L9 | `4448:635` | bigBtn | **h52** · py16 · pill |
| M1 | `4449:225`… | overview stat | **h≈71–73** · p16 · gap6 · elevated |
| M2 | `4449:248`… | position stat | 同 chrome |
| T1 | `4449:282` | records table | elevated · p16 |
| K1 | `4450:223` | mechanism | p24 · cir**28** · elevated |
| C1 | `4585:510` | chart-card | p16 · elevated · range **h24** |
| F1 | `4450:277`… | FAQ×8 | **h56** · px16 py18 · r12 |

---

## A5 本站实测矩阵（改后 · `staking-5subs-fresh2`）

| leaf | 稿 | 实测 | Δ | 判 |
|------|----|------|---|-----|
| Segment | 36 | **36** | 0 | **PASS** |
| AmountBox | 53 · py12 · fs24 | **55** · 12 · 24 | 2 | **Med** |
| token icon | 22 | **22**（rail） | 0 | **PASS** |
| maxB | 27 | **27** · br9（chip） | 0/1 | **PASS**/Med |
| infoBox | p16 · gap12 | **16** · 12 · h162 | 0 pad | **PASS** |
| CTA | 52 | **52** | 0 | **PASS** |
| metric | ~73 · p16 · gap6 · elev | **71** · 16 · 6 · elev | ≤2 | **PASS** |
| chart | p16 · elev | 16 · elev | 0 | **PASS** |
| FAQ 收起 | 56 | **55.2** | 0.8 | **Med** |
| 假演示数 | 禁 | 无 `129,420`/`5,416%` | — | **PASS** |
| 任意 px | 禁 | AmountMaxChip 已去 `*[Npx]` | — | **PASS** |

**Critical FAIL：0** · 剩余 Med：AmountBox Δ2 · FAQ Δ0.8 · max radius chip9 vs 稿10

---

## 改码摘要（本轮）

- `stake-widget`：meta `p-4`；token icon `rail`（22）
- `staking-detail-aside`：MetricGrid `gap-1.5 p-4` + label `leading-none`；mechanism/chart → `elevated`
- `chip` AmountMaxChip：`h-6.75` / `rounded-chip` / `leading-3.75`（禁任意 px）
- bond/xmine token icon 同步 `rail`

---

## 动态审计（UI ∥ 钱路）

| 位 | UI | 钱路 |
|----|----|------|
| Segment+Amount+CTA | PASS | liquid/locked write · 门闸 |
| meta 五行 | PASS | 档位/合约地址 live |
| overview/仓位 | PASS | 链上；空=`0.00` |
| 记录表 | PASS | 空表诚实 |
| chart | PASS | 无历史 → 空 |
| FAQ | PASS/Med | 静态 |

---

## 门禁

| 项 | 结果 |
|----|------|
| 禁任意 px | PASS |
| Critical | **0** |
| pnpm check | PASS（382 tests） |
| 队列 #12 | page-done |
