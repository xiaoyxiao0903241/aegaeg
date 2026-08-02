# Assets · Burn Bond 仓位 fresh leaf · `4518:6384`

> **流程：** [`docs/agents/ui-leaf-parity-workflow.md`](../../../docs/agents/ui-leaf-parity-workflow.md)  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **Frame：** `DApp — 资产/销毁债券仓位 (Desktop 1920)` · `4518:6384`（get_metadata 已确认）  
> **本站：** `http://127.0.0.1:5174/zh/app.html#assets/burnbond`（**正确 hash**；`#assets/burn-bond` 无效）  
> **WebBridge：** `http://127.0.0.1:10086` · session `assets-bond-fresh`  
> **日期：** 2026-08-02 · **禁** `*[Npx]` / `*[Nrem]` · **旧 leaf 不作 SSOT**

---

## Figma 直拉（本轮）

| node | name | 用途 |
|------|------|------|
| `4518:6384` | DApp — 资产/销毁债券仓位 | 页帧 metadata |
| `4527:241` / `4527:243` | 排序 pill + chevron | 62×24 · gap4 · chevron-down 10 |
| `4527:247` | Quote toggle | Segment h24 |
| `4525:598` | 仓位卡（180天） | outlined · p16 · period24 · CTA h28 · chip+锁 |
| `4525:612` | chip 锁 | open lock 12 coral（同 `assetsPositionLock`） |
| `4525:627` | vr 凭证 | 左 x16 |
| `4518:6616` | sec-仓位数据 | **3+2** · h94 · elevated · icon18 |
| `4518:6731` | sec-FAQs | FAQ×**6** · soft · r12 · gap12 |

空态：同 LP Bond chrome（elevated · 插画 84 · CTA h46）。

---

## 全 leaf 清单 + 本站实测矩阵

> WebBridge · 空仓 · rem=16 · `#assets/burnbond`

| # | leaf | 稿 | 本站 | Δ | 判 | 备注 |
|---|------|----|------|---|----|------|
| L1 | 返回 | ~20 | 24 hit | — | **PASS** | |
| L2 | 标题「销毁债券仓位」 | ~26 | 21 / h27.3 | Med | **Med** | 共用 header |
| L3 | 排序 pill | 62×24 · gap4 | **62×24** · gap4 | 0 | **PASS** | |
| L4 | 排序箭头 | 10 chevron-down | **10×10** | 0 | **PASS** | |
| L5 | Segment | h24 | **24** | 0 | **PASS** | |
| L6–L9 | 空态 skeleton/主卡/插画/CTA | elevated · 84 · h46 | border0 · **84** · **46** | 0 | **PASS** | |
| L10–L14 | 仓位卡 chrome | 同 LP | bond-row 共用 | 0 | **PASS** | 锁图标本帧直拉同路径 |
| L15 | 仓位数据 3+2 | 94 | **94**×5 · elevated | 0 | **PASS** | 末格「销毁债券总收益」 |
| L16 | stat icon | 18 | 18 | 0 | **PASS** | |
| L17 | 操作记录 | 空诚实 | 空 | — | **PASS** | |
| L18–L20 | FAQ×6 soft | 56 · r12 · gap12 | ~55 · FAQ×6 | ≤1 | **PASS** | 末题「销毁债券对 AGX…」 |

**Critical FAIL：0**  
**Med：** 标题字号（共用）

---

## 本轮改码

无产品码变更（复用 #02/#03 仓位 chrome）。本帧直拉核验图标/字阶。

---

## WebBridge 实录

1. **http URL：** `http://127.0.0.1:5174/zh/app.html#assets/burnbond`
2. **入口：** 直达 hash / 资产 → 销毁债券
3. **有序点击：** 空态 · 排序 · Segment · 3+2 格 · FAQ×6
4. **vs Figma：** 卡 chrome 对照 `4525:598`
5. **执行日：** 2026-08-02

---

## 验证

- [x] get_metadata + get_design_context
- [x] 实测 · Critical=0
- [ ] `pnpm check` · commit · queue #04
