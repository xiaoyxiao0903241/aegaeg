# Assets · LP Bond 仓位 fresh leaf · `4518:5993`

> **流程：** [`docs/agents/ui-leaf-parity-workflow.md`](../../../docs/agents/ui-leaf-parity-workflow.md)  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **Frame：** `DApp — 资产/LP债券仓位 (Desktop 1920)` · `4518:5993`（get_metadata 已确认）  
> **本站：** `http://127.0.0.1:5174/zh/app.html#assets/lpbond`（**正确 hash**；`#assets/lp-bond` 无效回落 Hub）  
> **WebBridge：** `http://127.0.0.1:10086` · session `assets-bond-fresh`  
> **日期：** 2026-08-02 · **禁** `*[Npx]` / `*[Nrem]` · **旧 leaf 不作 SSOT**

---

## Figma 直拉（本轮）

| node | name | 用途 |
|------|------|------|
| `4518:5993` | DApp — 资产/LP债券仓位 | 页帧 metadata |
| `4527:229` / `4527:231` | 排序 pill + chevron | 62×24 · gap4 · chevron-down 10 |
| `4527:235` | Quote toggle | Segment AGX/USD · h24 |
| `4525:413` | 仓位卡（180天） | outlined · p16 · period24 · CTA h28 · chip+锁 |
| `4525:427` | chip 锁 | **open lock 12** coral stroke（与 #02 `assetsPositionLock` 同路径） |
| `4525:442` | vr 凭证 | **左对齐**（metadata x=16；禁右推） |
| `4518:6225` | sec-仓位数据 | **3+2** · h94 · elevated · icon18 · gap16 |
| `4518:6340` | sec-FAQs | FAQ×**6** · 收起 h56 · gap12 · soft elevated · radius12 |
| `4518:6045` | btn/menu | 36×36（壳） |

空态：PC 帧为有仓演示；空态 chrome 对照本站 + 插画 `assetsPositionEmptyArt`（**84**）· elevated 无 border。

---

## 全 leaf 清单 + 本站实测矩阵

> **执行：** WebBridge evaluate · 空仓态 · rem=16 · hash=`#assets/lpbond`

| # | leaf | 稿 | 本站 | Δ | 判 | 备注 |
|---|------|----|------|---|----|------|
| L1 | 返回「返回资产」 | 链高 ~20 | 24（hit） | — | **PASS** | 壳 |
| L2 | 标题「LP债券仓位」 | ~26 | 21px / h27.3 | ~1–5 | **Med** | Text 字阶；1–2px 可取整，字号 Med |
| L3 | 排序 pill `4527:229` | 62×24 · gap4 | **62×24** · gap4 | 0 | **PASS** | |
| L4 | 排序箭头 `4527:231` | chevron-down 10 | **10×10** `ic-chevron-down` | 0 | **PASS** | |
| L5 | 计价 Segment | h24 | **24** | 0 | **PASS** | AGX/USD |
| L6 | 空态 skeleton Card | elevated · 无 border | border0 · elevated · h72 | 0 | **PASS** | |
| L7 | 空态主卡 | elevated · 无 border | border0 · elevated | 0 | **PASS** | |
| L8 | 空态插画 | 84 | **84×84** `size-21` | 0 | **PASS** | |
| L9 | 空态 CTA | 深底全宽 | h46 · dark · full | 0 | **PASS** | |
| L10 | 仓位卡外壳 | border + r16 · p16 | outlined · p-4（共用 bond-row） | 0 | **PASS** | 复用 #02 chrome |
| L11 | period pill | 24 | h-6 | 0 | **PASS** | |
| L12 | 本金 chip 锁 | 12 coral | **`assetsPositionLock` size-3** | 0 | **PASS** | Figma 直拉同路径 |
| L13 | 凭证行 | 左 x16 | **justify-start** | 0 | **PASS** | bond-row 已左 |
| L14 | CTA 领取/赎回 | h28 · gap12 | h-7 · gap-3 | 0 | **PASS** | |
| L15 | 仓位数据 3+2 | 94 · elevated | **94** · border0 · shadow | 0 | **PASS** | `min-h-23.5` · grid 6 列 |
| L16 | stat token icon | 18 | **18** | 0 | **PASS** | |
| L17 | 操作记录 | 表头+空 | 空文案诚实 | — | **PASS** | indexer DEFER |
| L18 | FAQ 收起 | 56 · soft · r12 | **~55.2** · sh · r12 · border0 | ~0.8 | **PASS** | |
| L19 | FAQ 列表 gap | 12 | gap-3 | 0 | **PASS** | 共用 FaqList |
| L20 | FAQ 题数 | 6 | **6** | 0 | **PASS** | LP 专属末题 |

**Critical FAIL：0**  
**剩余 Med：** 标题字号 21 vs 稿 ~26（DappTabHeader 共用，不在本页单开）

---

## 本轮改码

本页 Critical=0：**无新增产品码**（复用 #02 仓位 chrome / toolbar / empty / metric grid 3+2）。  
图标/字阶对本帧节点直拉核验：`4525:427` 锁 = 现有 `ic-position-lock-12.svg`；排序 chevron / Segment / FAQ soft 与实测一致。

---

## 手册 / 钱路（对照，非 UI SSOT）

| 项 | 结论 |
|----|------|
| 读 | LP Bond depository 仓位；右栏 3+2 汇总 |
| 写 | claim / redeem（Mixed 门闸） |
| 诚实空 | 空仓 empty+CTA；操作记录无 indexer |

---

## WebBridge 实录

1. **http URL：** `http://127.0.0.1:5174/zh/app.html#assets/lpbond`
2. **入口：** 直达 hash（勿用 `lp-bond`）/ 资产 → LP债券
3. **有序点击：** 确认空态/排序 pill/Segment/六格（3+2）/FAQ×6
4. **vs Figma：** 有仓卡 chrome 代码对照 `4525:413`；空仓走空态 MUST
5. **执行日：** 2026-08-02

---

## 验证

- [x] get_metadata(`4518:5993`) + get_design_context 关键控件
- [x] 实测矩阵 · Critical=0
- [x] `pnpm check`（本切片文件 prettier/eslint；全仓 check 被无关 dirty prettier 挡）（commit 前）
- [x] commit · queue #03 → page-done · `212eef4c (leaf) / chrome b72c13df`
