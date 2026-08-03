# R7 Post-Design · #18 幸运奖详情 `#rewards/lucky` · PC `4390:220`

> **审查员：** 独立会话 · Grok 4.5 high · AGENTS.md §8.0 R6/R7  
> **日期：** 2026-08-03  
> **复检：** 2026-08-03（§2.6 CTA Critical 已修；与 Post-Code 同标准）  
> **范围：** 只读审查（未改 `src/`）  
> **对照：** leaf `215-lucky-leaf.md` · A5 `215-lucky-measure-full.json` · inventory `215-lucky-a5-inventory.json` · A1/A2 `215-lucky-a1a2.md` · proto `215-lucky-proto.md` · gaps `docs/dapp-data-gaps.md` §4.2 · 实现 `rewards-lucky-content.tsx` / `use-rewards-lucky-content-view.ts` / `rewards-mixed-claim-widget.tsx` / `rewards-read.ts`

## Verdict: **PASS**

Critical = **0**。残留 High/Medium（A5 locate / fluidWide / 贡献 `0.00` 等）**不挡** PASS；不单独否决 page-done 的 Critical 门。

---

## 1. A5 R==N 且 fail=0 是否属实

| 顶字段 | JSON 值 | 裁决 |
|--------|---------|------|
| `N` | 196 | OK |
| `R` | 196 | OK |
| `R_eq_N` | true | OK |
| `pass` / `fail` / `locate_fail` | 196 / 0 / 0 | OK |
| `rows.length` | 196 | OK |
| `row ok=false` | 0 | OK |

**结论：** 顶字段声称 **属实**（文件：`.scratch/dapp-7rail-parity/research/215-lucky-measure-full.json`）。  
**但** inventory 诚实 skip 使部分叶「ok=true」未真正比尺寸/色/字号（见 §5）——**不否定顶字段算术，削弱 A5 作为 UI PASS 的证明力**。

---

## 2. R5a：稿面控件是否被 DEFER / 砍 / flip 冒充

| 控件 | 证据 | 裁决 |
|------|------|------|
| 选币 / 周期 | `SelectMenu variant="pill"` ×2（释放/复投）；`select-menu.tsx` pill 触发 `Text variant="copy"`；**无 flip** | **PASS** |
| 日期 pill | chrome 在（`disabled` button + chevron + `dateLabel`）；换日未开 | **UI 未砍** · UX 缺口 Medium |
| 资格瓦 | `isUserEligible` → Yes/No；hint Tracker `totalAmount` | **PASS** |
| 倒计时 | `getRound.endTime` → `countdownHint`；失败/`—` | **PASS** |
| Chainlink 卡 | 标题/正文/图标/`验证教程` disabled 诚实无 URL | **PASS** |
| FAQ | `FaqList` 6 条；活期跟手册 | **PASS** |
| Mixed 左栏 | 可领卡 / slider / 领取·复投卡 / 双行 CTA / burn | **PASS** |

**无 Critical 级「控件被砍 / flip 冒充」。**

---

## 3. 钱路 / 数据诚实

| 项 | 证据 | 裁决 |
|----|------|------|
| 资格假零清除 | `readLuckyRoundDisplaySnapshot` → `isUserEligible`；未连钱包 → `—`；非 `formatApiDecimalAmount(null)` | **PASS** |
| 倒计时 | `getRound(currentRoundId).endTime` → HH:MM:SS；A5 可见「距下次开奖 …」 | **PASS** |
| FAQ 活期 | zh：`可以。…liquidStake…单笔…`；跟手册 §14.1 | **PASS** |
| 「最大单笔」vs Tracker | UI 文案「今日累计购买」；gaps §4.2 登记无 max-single 源 | **诚实缺口 · 非撒谎** |
| 奖池/累计/表 | API summary / winners / my-rounds | **PASS** |
| 写链 | 仍 `claimRewardMixed`（未改写链） | **PASS（R4a）** |
| 贡献位 `formatApiDecimalAmount(null)` | 无可领时左栏贡献仍可能渲染 `"0.00"`（函数 SSOT 注释已警告假零） | **Medium**（非本票原 Critical 资格假零） |

---

## 4. WebBridge / 原型五字段

| # | 字段 | proto 值 | 裁决 |
|---|------|----------|------|
| 1 | http URL | `http://127.0.0.1:8766/AEGIS%20X%20DApp.html` | 齐 |
| 2 | 入口 | 侧栏奖励 → 幸运奖卡 | 齐 |
| 3 | 有序点击 | 奖励 → 幸运奖 → CTA/验证教程/FAQ | 齐 |
| 4 | 与本站差异 | 演示数 vs 链/API；周期档差异已记 | 齐 |
| 5 | 执行时间 | 2026-08-03 · `rewards-lucky-proto-215` | 齐 |

**结论：** 五字段仍有效（`215-lucky-proto.md`）。**无 Critical「缺实录」。**

---

## 5. inventory skip 可疑项（是否掩盖真 UI FAIL）

来源：`215-lucky-a5-inventory.json`（skip 叶 41：`fluidWide` 34 · `skipSize` 9 · `skipColor` 2 · `skipFs` 1）交叉 `measure-full` 实测 delta。

| nodeId | name | flags | 实测张力 | 风险 |
|--------|------|-------|----------|------|
| `4393:241` | 3.2000（contrib 值） | skipFs + skipColor（+ skipFw） | locator `claim.contribValue` 命中文案「可领取」；fs 13≠16、color muted40≠ink；仍 `ok=true` | **High** — 该叶未真正测到 |
| `4395:230` | 已获得 | skipColor | 稿 coral vs 实测「未获得」ink；稿态色跳过 | Medium（动态态诚实 skip，但未证合格态色） |
| `4393:241` 旁路 | 可领额 demo | skipFs（叶注贡献 demo） | 见上 locate 漂移，超出「demo 额」本意 | High（同上） |
| `4396:222` / `4398:222` | results/history table | skipSize + fluidWide | h 大幅低于稿（空表 vs 演示行） | Low–Medium（空态可解释） |
| `4398:295` | faq/1 | skipSize + fluidWide | h 141 vs 89（展开态） | Low（展开诚实 skip） |
| `4395:236` | chainlink card | skipSize + fluidWide | h−10 · w−46 | Medium |
| 右栏 tiles / FAQ / 表 | — | fluidWide | 一致 ~46px 窄于稿宽 | Medium（系统性栏宽；勿当 chrome PASS 铁证） |
| `4390:222/223` | dividers | skipSize | h 993 vs 1823 | Low（壳高随内容） |

**结论：** 顶字段 fail=0 **成立**，但 **`4393:241` locate 漂移 + skip\*** 足以质疑「全叶测齐」叙事；fluidWide/skipSize 对空表/展开/栏宽属常见诚实 skip，**不单独升 Critical**。

---

## Critical

（空）

### 已修复 · 原 Critical（§2.6 CTA）

1. **§2.6 任意长度硬禁回归（CTA）** — **已修复（2026-08-03 复检）**  
   - 路径：`rewards-mixed-claim-widget.tsx` 双行 CTA  
   - 现码：`Text as="span" variant="detail"` + `leading-4`（标准刻度）；无 `text-[0.9375rem]` / `leading-[1.125rem]`  
   - 实现方：A5 再测 `N=R=196 fail=0` · CTA `h=52`  
   - 依据：与 Post-Code 复检一致 → Critical 清零

---

## High（残留 · 不挡 PASS）

1. **A5 `4393:241` locate 错误被 skipFs/skipColor 掩盖**  
   - inventory / measure：期望贡献数值叶，实测 text=`可领取`  
   - 须重绑 locator 至贡献值节点并重跑 A5（或修 DOM 可定位性）后才可声称该叶 PASS

2. **右栏 fluidWide 系统性 ~46px**（tiles / Chainlink / 表 / FAQ）  
   - 非 fail 行，但若栏宽为稿硬约束，当前 A5 未拦；Post-Design 不得仅凭 fail=0 关闭栏宽质疑

---

## Medium

1. **日期 pill `disabled`**：chrome 在、换日未开（gaps §4.2 / A1A2 已记）— R5a 未砍控件，交互未交付  
2. **资格 `skipColor`**：未验证「已获得」coral 态  
3. **无可领时贡献展示 `formatApiDecimalAmount(null)` → `0.00`**：软假零风险（非资格瓦；建议 `—`）  
4. **Chainlink / 表 skipSize**：高度差依赖诚实 skip；空表可解释，有数据后须回看

---

## Low

1. FAQ 展开态 `skipSize`（`4398:295`）  
2. 壳 divider 高度随内容 `skipSize`  
3. 验证教程 URL 无源 → disabled（诚实；非砍）

---

## 清单逐项裁决摘要

| # | 项 | 裁决 |
|---|----|------|
| 1 | A5 R==N fail=0 属实？ | **属实**（算术）；证明力受 §5 skip 削弱 |
| 2 | R5a 控件未砍 / 无 flip | **PASS**（日期 pill 仅 UX 未开） |
| 3 | 钱路/数据诚实 | **资格/倒计时/FAQ/最大单笔缺口 PASS**；贡献 `0.00` Medium |
| 4 | Proto 五字段 | **PASS** |
| 5 | inventory skip 掩盖 | **有可疑**（尤其 `4393:241`）→ High，非单独 Critical |

---

## 门禁

| 项 | 结果 |
|----|------|
| Post-Design | **PASS**（Critical=0） |
| 允许称 page-done / commit | **Critical 门已过**；仍须用户明示 commit；建议跟进 High `4393:241` locator（不挡本 Verdict） |
| 建议下一动作 | 可选重绑 `4393:241` 并重跑 A5；收贡献 `0.00` → `—` |

---

## 简短证据路径

- A5 顶字段：`.scratch/dapp-7rail-parity/research/215-lucky-measure-full.json`（L1–11）  
- inventory skips：`.scratch/dapp-7rail-parity/research/215-lucky-a5-inventory.json`  
- proto：`.scratch/dapp-7rail-parity/research/215-lucky-proto.md`  
- gaps：`docs/dapp-data-gaps.md` §4.2  
- 资格/倒计时读：`src/web3/rewards/rewards-read.ts` `readLuckyRoundDisplaySnapshot`  
- 视图接线：`src/views/dapp/rewards/detail/use-rewards-lucky-content-view.ts`  
- CTA rem：`src/views/dapp/rewards/detail/rewards-mixed-claim-widget.tsx`  
- FAQ 活期：`src/i18n/messages/app/zh.ts` `rewards.lucky.faq` 末条  
