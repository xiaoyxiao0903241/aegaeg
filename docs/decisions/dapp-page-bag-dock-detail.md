# DApp 页袋：Dock + Detail（域 Facade + 按需 mode 袋）

> **状态：现行**  
> 目录落点：域 `dock.tsx` / `detail.tsx`；跨 tab 产品壳 `views/dapp/shared/`；窗口宿主 `views/dapp/host/`（primitives + use-* + 具名大件）；组合根 `src/boot/`。

## 不变量（硬）

1. **Tab 注册表只 import 域根** `dock.tsx` / `detail.tsx`（导出 `{Domain}Dock` / `{Domain}Detail`）。
2. **禁止** registry（或等价入口）import 任意 mode 目录下的 `dock` / `detail`。
3. 左栏组装一律叫 **`*Dock`**，右栏一律叫 **`*Detail`**（域与 mode 同词表）。
4. **首页营销页**不在本合同内。
5. 壳层名（如 `DockFrame`）**不**与页袋 `*Dock` 绑死。跨 tab **产品壳**（读 store / 绑钱包 / i18n 默认）住在 [`views/dapp/shared/`](../../src/views/dapp/shared/)（**不是 tab**）；无业务数据的布局 primitive（`Tile`/`Grid`/`MainButton`…）住在 `src/shared/components`；窗口级 onboarding/wallet/nav 住在 [`views/dapp/host/`](../../src/views/dapp/host/)；组合根住在 [`src/boot/`](../../src/boot/)。

> 命名对照：`src/shared/` = 设计系统；`views/dapp/shared/` = 跨 tab 产品壳；`views/dapp/host/` = 窗口宿主（≠ 页袋 Dock）；`src/boot/` = 入口；`{tab}/shared.ts` = 域内非 UI 纯函数。路径不撞。

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
├── primitives.tsx           # 可选：跨 mode UI 零件（图表/指标等；禁数千行 mega）
├── use-detail.ts            # 可选：跨 mode 右栏共享 chrome hook（如 useStakingDetail）
├── hub/
│   ├── dock.tsx             # StakingHubDock（跨域导出须带域前缀）
│   ├── detail.tsx           # StakingHubDetail
│   ├── use-hub.ts           # useStakingHubDetail（有则 useStakingHub）
│   └── primitives.tsx
├── stake/
│   ├── dock.tsx             # StakeDock
│   ├── detail.tsx           # StakeDetail
│   ├── use-stake.ts         # useStakeDock / useStakeDetail
│   └── primitives.tsx
├── bond/                    # LP / 燃烧共用，kind 区分
│   ├── dock.tsx
│   ├── detail.tsx
│   ├── use-bond.ts
│   └── primitives.tsx
└── …                        # xmine / calc 同构；submit-* / session-host / claim-modal 可留域根旁路
```

**Rewards 旁路（合同允许）**：跨 mode 领取面板 `claim-panels.tsx` / `claim-primitives.tsx` 与 IO hooks（`use-simple-claim` / `use-mixed-claim`）留在域根，**不**并入 mode `primitives`，也**不**进 registry。

### 扁平小域（例：community）

```text
community/
├── dock.tsx                 # ★ CommunityDock
├── detail.tsx               # ★ CommunityDetail
├── use-community.ts         # useCommunityDock / useCommunityDetail
├── use-referral.ts          # useCommunityReferral（第二 hook；跨域勿用短名）
├── primitives.tsx
└── shared.ts                # 可选纯函数（display / bind-success）
```

### mode / 小域四文件（默认不多不少）

| 文件             | 导出（例）        | 职责                                                |
| ---------------- | ----------------- | --------------------------------------------------- |
| `dock.tsx`       | `StakeDock`       | 左栏组装；不进 registry                             |
| `detail.tsx`     | `StakeDetail`     | 右栏组装；不进 registry                             |
| `use-{mode}.ts`  | 见下「Hook 命名」 | 数据与交互；写链过长可再拆第二 hook                 |
| `primitives.tsx` | 具名零件          | **该袋全部 UI 零件**（多 export）；禁一卡一文件瀑布 |

域根**通常**为 `dock.tsx` + `detail.tsx`；跨 mode 需要时再加 `shared.ts`（纯函数）与/或 `primitives.tsx`（UI）。**禁止**域根一卡一文件瀑布，也**禁止**数千行 mega-`primitives`。写链 `submit-*`、session-host、claim-modal / claim-panels 等 IO/弹层可留域根旁路，不进四件套、不进 registry。

**hub = 普通 mode 袋**（`hub/dock` + `hub/detail` + …），不把总览 UI 塞进域根 `dock.tsx`。

### Hook 命名（左 / 右）

| 情况               | 导出                                                                                 | 说明                                |
| ------------------ | ------------------------------------------------------------------------------------ | ----------------------------------- |
| 左/右各有独立 VM   | `useStakeDock` / `useStakeDetail`                                                    | 与 UI 面一一对应；可同文件多 export |
| 一份会话同时喂左右 | `useFlashExchange`（中性名）或 session host                                          | **禁止**假拆成 Dock/Detail 两份     |
| 纯读、两边共用     | 域内可中性；**跨域 export 边界**须域前缀（如 `useAssetsHub` / `useRewardsReferral`） | dock/detail 与 tab 父层取用         |

页袋 VM 禁止残留 `*View` / `*Aside` / `*Widget` 作入口名；写链 / IO helper 不强制改名。

## 体量与再拆

- 单文件可读上限约 **400–600 行**。
- 超限**只允许**：再拆 hook，或再拆 primitives（如左/右）；**不**新增第五类职责名当常态。
- **禁止**整域一个数千行 `primitives.tsx`。
- community 样板只证明**不变量与命名**；**不能**规定 exchange 的扇出——扇出由升级门槛触发。

## 与 Foundation / jscpd

- 右栏仍：`Detail → Section → Grid|具名 → Tile|*Card`；禁 Section 薄壳（`Section` 仅 `*-detail` / 此处 `detail.tsx` import）。
- 页内同构拼装 → `jscpd:ignore`（理由含「页内拼装」）；**禁止**为过 jscpd 抽薄包装。
- `shared/components` 扩无业务数据的布局/控件 primitive（含 `Tile`/`Grid`/`MainButton`/`ModeCard` 等）。产品色/奖励 wash 等域味卡（如 `AboutCard`）留在 `views/dapp/shared/`，勿冒充 Foundation。
- 跨 tab **产品壳**（`DockFrame` / Subview / ConnectPromo 等）→ `views/dapp/shared/`（准入：≥2 无关 tab；禁域常量/单域卡）；业务零件留在域/mode `primitives.tsx`。
- 门禁：`views-no-cross-tab` 禁 tab↔tab，允许 tab→`views/dapp/shared` / host / hooks；`host` 与 `shared` 均非 tab；`dapp-shared-no-tabs` 禁 `views/dapp/shared`→tab（允许 shared→host 如 WalletConnectChip）；`host-views-composition` 记录 host→tab（warn）。

## 命名（现行）

| 项                  | 约定                                                                             |
| ------------------- | -------------------------------------------------------------------------------- |
| 页袋左 / 右入口     | `*Dock` / `*Detail`（文件 `dock.tsx` / `detail.tsx`）                            |
| Hub 总览            | `hub/` mode 袋四件套，不塞域根 `dock.tsx`                                        |
| UI 零件             | 收进该袋 `primitives.tsx`；禁一卡一文件瀑布                                      |
| Hook                | 左右分离 → `use*Dock` / `use*Detail`；弹层 VM 中性名（如 `useAssetsClaimModal`） |
| 薄包装              | 禁域内 `SideCard` / `QuickLinks`；单列链接栈不硬套右栏 `Grid`                    |
| `views/dapp/shared` | **不**改名为 `components`（与 `src/shared/components` 抢词）                     |

## 非目标

- 把 Faq / Tile / Grid 收进域 primitives
- 改链上 / API / 文案语义
- mode 级 Dock 进 Tab 注册表
