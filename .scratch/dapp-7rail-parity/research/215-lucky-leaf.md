# 215 · 幸运奖详情 leaf · PC `4390:220`（重启 #18）

> **Status：** `page-done` · A5 N=R=196 · R7 Critical=0 · committed  
> **队列：** [`200-releaf-restart-queue.md`](./200-releaf-restart-queue.md) #18  
> **fileKey：** `uiKwzwIoD06phS0husdqjB` · PC `4390:220`  
> **本站：** `http://127.0.0.1:5174/zh/app.html#rewards/lucky`  
> **日期：** 2026-08-03  
> **清单：** [`215-lucky-min-leaves.json`](./215-lucky-min-leaves.json) · [`215-lucky-min-leaves.md`](./215-lucky-min-leaves.md)  
> **meta：** [`215-lucky-meta.xml`](./215-lucky-meta.xml)  
> **A1/A2：** [`215-lucky-a1a2.md`](./215-lucky-a1a2.md) · gaps [`docs/dapp-data-gaps.md`](../../../docs/dapp-data-gaps.md) §4.2  
> **A3：** [`215-lucky-proto.md`](./215-lucky-proto.md)  
> **GDC 合并：** [`215-gdc-merged.json`](./215-gdc-merged.json)（batches 0–7）  
> **A5：** [`215-lucky-measure-full.json`](./215-lucky-measure-full.json) · profile `rewards-lucky`  
> **R7：** [`215-lucky-r7-post-design.md`](./215-lucky-r7-post-design.md) · [`215-lucky-r7-post-code.md`](./215-lucky-r7-post-code.md)  
> **meta_min_leaf_count N = 196** · **gdc_min_leaf_count M = 196**  
> **原则：** Content Card 产品面全量计叶；rail/顶栏 = shell-shared 另表

---

## 本页登记

```
帧名称：DApp — 奖励·幸运奖详情 (Desktop 1920)
PC nodeId：4390:220
leaf 路径：.scratch/dapp-7rail-parity/research/215-lucky-leaf.md
队列 #：18
Status：page-done
日期：2026-08-03
Agent session：rewards-lucky-releaf
```

### A0–A7

```
[x] A0 开页（只做 #18；#17 Hub A5 未完成不并行写盘）
[x] A1 手册（215-lucky-a1a2.md）
[x] A2 OpenAPI（同上 + gaps §4.2）
[x] A3 原型 WebBridge 五字段
[x] A4 Figma 全 leaf GDC · M=N=196
[x] A5 本站 measure · N=R=196 · fail=0 · locate_fail=0（2026-08-03）
[x] A6 动态审计表（资格/倒计时/累计购买 · 见 gaps §4.2）
[x] A7 尺寸硬禁 + 复用核（SelectMenu pill→copy；复投卡 success-soft；禁 ClaimSplitSlider 绿轨回归）
[x] ✅ 允许写盘（A5 后已写；本栏补勾）
```

### A3

见 [`215-lucky-proto.md`](./215-lucky-proto.md)（session `rewards-lucky-proto-215` · 2026-08-03）。

---

## A4 计数

| 项 | 值 |
|----|-----|
| 源 | `get_metadata(4390:220)` · 2026-08-03 |
| 范围 | Content Card 产品面（left-col + right-col + col dividers） |
| shell-shared | rail `4390:224` + top header **另表**，不计入 N |
| N | **196**（text 122 · surface 34 · icon 21 · chrome 19） |
| M | **196**（miss=0 · batches 0–7） |
| 分区大块 | results 65 · history 41 · faq 20 · claim/* · slider · tiles · chainlink |

```
[x] A4 N=M=196
```

---

## A5 结果

| 项 | 值 |
|----|-----|
| profile | `rewards-lucky` |
| N=R | **196** |
| pass / fail / locate_fail | **196 / 0 / 0** |
| 出 | `215-lucky-measure-full.json` |
| inventory 诚实 skip | divider/表高/FAQ 展开/链卡高；稿态资格色；dropdown fluidWide；贡献 demo 额 skipFs |

---

## 实现摘要（钱路 + UI）

| 面 | 变更 |
|----|------|
| 左 Mixed | 领取标题 headline；复投卡 `success-soft`；CTA 双行 15/400 + `!py-2` 高 52；SelectMenu pill `copy` |
| 右栏瓦 | label copy13 medium body70 · value headline16；资格 `isUserEligible`；倒计时 `getRound.endTime`；辅助额 Tracker `totalAmount`（文案「累计购买」） |
| FAQ | 活期资格跟手册（可获 · 单笔达标） |
| 写 | 仍 `claimRewardMixed`（未改写链） |

### Critical 张力（已处理）

1. ~~资格假零~~ → 链 `isUserEligible` + Yes/No  
2. ~~FAQ 活期~~ → 跟手册  
3. ~~倒计时~~ → `getRound.endTime`  
4. 稿「最大单笔」vs 链 `totalAmount` 累计 → gaps 登记；UI 文案改为累计购买  

---

## page-done

是（用户明示 commit · R7 Critical=0 · A5 PASS）。
