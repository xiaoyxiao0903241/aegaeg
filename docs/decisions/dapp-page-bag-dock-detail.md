# DApp 页袋：Dock + Detail（域 Facade + 按需 mode 袋）

> **状态：合同已修订** — 2026-08-05 再拍；**先收口门禁/右栏，再按本文执行搬目录**。  
> 取代原稿「每域固定四文件」表述。

## 不变量（硬）

1. **Tab 注册表只 import 域根** `dock.tsx` / `detail.tsx`（导出 `{Domain}Dock` / `{Domain}Detail`）。
2. **禁止** registry（或等价入口）import 任意 mode 目录下的 `dock` / `detail`。
3. 左栏组装一律叫 **`*Dock`**，右栏一律叫 **`*Detail`**（域与 mode 同词表）。
4. **首页营销页**不在本合同内。
5. 壳层名（如 `WidgetFrame`）**不**与页袋 `*Dock` 绑死；另波次再统一措辞亦可。

## 何时开 mode 袋

满足**任一**即升级为「域 Facade + mode 袋」：

- 已有 **subview store**，或
- 同 tab 内 ≥2 条 **独立写链路 / 独立 session**

否则保持**扁平小域**（如 community / genesis）：域目录下直接四文件，**禁止**为空建 mode 文件夹。

## 目录与短文件名

目录即命名空间；**文件用短名**，**导出用全名**（`StakeDock`，禁止 `import { Dock }` 裸名）。

### 大域（例：staking）

```text
staking/
├── dock.tsx                 # ★ StakingDock — 只做 subview switch + 组装
├── detail.tsx               # ★ StakingDetail
├── shared.ts                # 可选：跨 mode 纯函数 / format（非 UI）
├── hub/
│   ├── dock.tsx             # HubDock
│   ├── detail.tsx           # HubDetail
│   ├── use-hub.ts
│   └── primitives.tsx
├── stake/
│   ├── dock.tsx             # StakeDock
│   ├── detail.tsx           # StakeDetail
│   ├── use-stake.ts
│   └── primitives.tsx
├── bond/                    # LP / 燃烧共用，kind 区分
│   ├── dock.tsx
│   ├── detail.tsx
│   ├── use-bond.ts
│   └── primitives.tsx
└── …                        # xmine / calc 同构
```

### 扁平小域（例：community）

```text
community/
├── dock.tsx                 # ★ CommunityDock
├── detail.tsx               # ★ CommunityDetail
├── use-community.ts
└── primitives.tsx
```

### mode / 小域四文件（默认不多不少）

| 文件             | 导出（例）    | 职责                                                |
| ---------------- | ------------- | --------------------------------------------------- |
| `dock.tsx`       | `StakeDock`   | 左栏组装；不进 registry                             |
| `detail.tsx`     | `StakeDetail` | 右栏组装；不进 registry                             |
| `use-{mode}.ts`  | `useStake`    | 数据与交互；写链过长可再拆第二 hook                 |
| `primitives.tsx` | 具名零件      | **该袋全部 UI 零件**（多 export）；禁一卡一文件瀑布 |

域根**通常只有** `dock.tsx` + `detail.tsx`（+ 可选 `shared.ts`），不放域级 mega-`primitives` / 域级总 hook。

**hub = 普通 mode 袋**（`hub/dock` + `hub/detail` + …），不把总览 UI 塞进域根 `dock.tsx`。

## 体量与再拆

- 单文件可读上限约 **400–600 行**。
- 超限**只允许**：再拆 hook，或再拆 primitives（如左/右）；**不**新增第五类职责名当常态。
- **禁止**整域一个数千行 `primitives.tsx`。
- community 样板只证明**不变量与命名**；**不能**规定 exchange 的扇出——扇出由升级门槛触发。

## 与 Foundation / jscpd

- 右栏仍：`Detail → Section → Grid|具名 → Tile|*Card`；禁 Section 薄壳（`Section` 仅 `*-detail` / 此处 `detail.tsx` import）。
- 页内同构拼装 → `jscpd:ignore`（理由含「页内拼装」）；**禁止**为过 jscpd 抽薄包装。
- `shared/components` 只扩 chrome；业务零件留在域/mode `primitives.tsx`。

## 命名对照（执行波次）

| 旧                               | 新                                  |
| -------------------------------- | ----------------------------------- |
| 域/mode `*Widget` 页袋入口       | `*Dock`（文件 `dock.tsx`）          |
| 已有 `*Detail`                   | 保持；归入 mode 或域根 `detail.tsx` |
| `hub` 总览 widget                | `hub/dock.tsx` 等四件套             |
| 散落 `*-primitives` / 一卡一文件 | 收进该袋 `primitives.tsx`           |

## 执行顺序

1. 右栏 Foundation + jscpd/Section 门禁收口（进行中）。
2. **修订本合同**（本文件）——已完成。
3. 以 **community** 做扁平样板：四短文件 + 注册表改 import。
4. 大域按 mode 滚动（先 exchange 或 staking 择一）；清旧 `*Widget` 入口名。

## 非目标

- 立刻全仓搬目录。
- 把 Faq / Tile / Grid 收进域 primitives。
- 改链上 / API / 文案语义。
- mode 级 Dock 进 Tab 注册表。
