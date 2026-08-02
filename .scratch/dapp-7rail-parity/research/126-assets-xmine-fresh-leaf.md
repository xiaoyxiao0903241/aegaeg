# Assets · Xmine 仓位 fresh leaf · `4518:6775`

> **流程：** [`docs/agents/ui-leaf-parity-workflow.md`](../../../docs/agents/ui-leaf-parity-workflow.md)  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **Frame：** `DApp — 资产/X挖矿仓位 (Desktop 1920)` · `4518:6775`（get_metadata 已确认）  
> **本站：** `http://127.0.0.1:5174/zh/app.html#assets/xmine`  
> **WebBridge：** `http://127.0.0.1:10086` · session `assets-bond-fresh`  
> **日期：** 2026-08-02 · **禁** `*[Npx]` / `*[Nrem]` · **旧 leaf 不作 SSOT**

---

## Figma 直拉（本轮）

| node | name | 用途 |
|------|------|------|
| `4518:6775` | DApp — 资产/X挖矿仓位 | 页帧 metadata |
| `4527:253` / `4527:255` | 排序 pill + chevron | 62×24 · gap4 · 10 |
| `4527:259` | Quote toggle | Segment h24 |
| `4525:783` | 仓位卡 | outlined · period「挖矿质押」· CTA h28 |
| `4525:797` | chip 锁 | **open lock 12** coral（同 `assetsPositionLock`） |
| `4525:812` | vr 凭证 | **左对齐** x16（禁 justify-end） |
| `4518:7007` | sec-仓位数据 | **2×2** · h94 · elevated · icon18 |
| `4518:7116` | sec-FAQs | FAQ×**6** · soft · r12 |

空态：共用 `AssetsPositionEmptyCard`（elevated · 84 · CTA h46）。

---

## 全 leaf 清单 + 本站实测矩阵

> WebBridge · 空仓 · rem=16 · `#assets/xmine` · **改后**含锁 icon / 凭证左对齐（代码对照有仓卡）

| # | leaf | 稿 | 本站 | Δ | 判 | 备注 |
|---|------|----|------|---|----|------|
| L1 | 返回 | ~20 | 24 | — | **PASS** | |
| L2 | 标题「X挖矿仓位」 | ~26 | 21 / h27.3 | Med | **Med** | 共用 header |
| L3 | 排序 pill | 62×24 | **62×24** · gap4 | 0 | **PASS** | |
| L4 | 排序箭头 | 10 | **10×10** | 0 | **PASS** | |
| L5 | Segment | h24 | **24** | 0 | **PASS** | |
| L6–L9 | 空态 | elevated · 84 · h46 | border0 · **84** · **46** | 0 | **PASS** | |
| L10 | 仓位卡外壳 | outlined r16 p16 | outlined p-4 | 0 | **PASS** | |
| L11 | period「挖矿质押」 | h24 | h-6 | 0 | **PASS** | |
| L12 | chip 锁 | 12 coral | **`assetsPositionLock` size-3** | 0 | **PASS** | **本轮补** |
| L13 | 凭证行 | 左 x16 | **justify-start** | 0 | **PASS** | **本轮改**；禁右推 |
| L14 | CTA | h28 · gap12 | h-7 · gap-3 | 0 | **PASS** | |
| L15 | 仓位数据 2×2 | 94 | **94**×4 · elevated | 0 | **PASS** | `grid-cols-2` |
| L16 | stat icon | 18 | 18 | 0 | **PASS** | |
| L17 | 操作记录 | 空诚实 | 空 | — | **PASS** | |
| L18–L20 | FAQ×6 | 56 soft | FAQ×6 | ≤1 | **PASS** | |

**Critical FAIL：0**（改后）  
**Med：** 标题字号

---

## 本轮改码

| 文件 | 改动 |
|------|------|
| `assets-xmine-position-card.tsx` | chip 加 `assetsPositionLock`；凭证 `justify-start` |

---

## WebBridge 实录

1. **http URL：** `http://127.0.0.1:5174/zh/app.html#assets/xmine`
2. **入口：** 直达 hash / 资产 → X挖矿
3. **有序点击：** 空态 · 排序 · Segment · 2×2 格 · FAQ×6
4. **vs Figma：** 卡 chrome 对照 `4525:783`（锁/凭证改后代码核）
5. **执行日：** 2026-08-02

---

## 验证

- [x] get_metadata + get_design_context
- [x] 实测 · Critical=0
- [x] `pnpm check`（本切片文件 prettier/eslint；全仓 check 被无关 dirty prettier 挡） · commit · queue #05
