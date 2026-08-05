# DApp 页袋：Dock + Detail + primitives + hook

> **状态：deferred** — 先写合同，**等右栏组件优化收完后再改代码**。  
> 拍板：2026-08-05 · 左栏名 **Dock**（不用 Widget）。

## 结论

每个 DApp 业务域（社区 / 资产 / 兑换 / …）页袋统一为四件套：

| 文件                      | 职责                                                        |
| ------------------------- | ----------------------------------------------------------- |
| `{domain}-dock.tsx`       | **左栏入口**：只组装；导出 `{Domain}Dock`                   |
| `{domain}-detail.tsx`     | **右栏入口**：只组装；导出 `{Domain}Detail`                 |
| `{domain}-primitives.tsx` | 本域左右栏用到的 **全部 UI 零件**（卡、步骤块、横幅等）     |
| `use-{domain}.ts`         | 本域数据与交互（可多 export；写链过长可再拆第二 hook 文件） |

Tab 注册表只 import **Dock** 与 **Detail** 两个入口。

## 命名

| 侧   | 名字       | 例                                |
| ---- | ---------- | --------------------------------- |
| 左栏 | **Dock**   | `CommunityDock`                   |
| 右栏 | **Detail** | `CommunityDetail`（已落地，保持） |

- **不用** Widget 作左栏页袋名（与本决策冲突的 `*Widget` 入口在执行波次一并改名）。
- **不用** Aside / Rail / Hub：Aside 在本仓曾指右栏；Rail 易与导航轨混；Hub 已禁用。
- 壳层现有名（如 `DappWidgetFrame`、`WidgetPromoCard`）**不在本决策强制改名**；若执行波次要统一措辞，另开切片，勿与页袋四件套绑死。

## 边界

1. **primitives 只放 UI** — 不放 hook、不放写链、不当入口。
2. **Dock / Detail 只组装** — map + 布局在入口；零件定义在 primitives。
3. **标准指标**仍走 `Tile` + `Grid` + map；特制块走 primitives 里的具名单卡 + 入口 map（禁 `*Cards` 大包）。
4. **一个主 hook 文件**；写链 / 大块逻辑可拆第二 `use-*.ts`，仍算 hook 袋，不是一卡一文件。
5. **体量**：primitives / 主 hook 各自 roughly 可读上限约 400–600 行；再胀按读/写或左/右数据拆，不按组件名碎文件。
6. **首页营销页**不在本页袋合同内。

## 执行顺序（deferred）

1. 右栏 Detail 组件化与收口完成（进行中 / 前置）。
2. 以 **community** 做样板：四件套落地 + 注册表改 import。
3. 其余 tab 按同一合同滚动（assets / exchange / staking / rewards / release / genesis …）。
4. 清掉旧名：`*Widget` 页袋入口、`*-content-primitives` / `*-flow-primitives` 等碎片文件。

## 非目标（本决策不做）

- 立刻全仓重命名或搬文件。
- 把 `shared/components` 的 Faq / Tile / Grid 收进域 primitives。
- 改链上 / API / 文案语义。
