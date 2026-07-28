# Implement 编码检查单

> **不是**第二套规范。写盘前过一遍；细则仍以链出的 SSOT 为准。  
> 分层裁决：根 [`AGENTS.md`](../../AGENTS.md) **§8.0**（含 **R5 / R6**）。命令门禁：[`commands.md`](./commands.md)。

## 三门节奏（强制）

```
Pre-Design → 写盘实现 → Post-Design + Post-Code（分轨）→ pnpm check → 才可称完成
```

缺 **Pre-Design** 不得开写。缺 **Post-Design** 或 **Post-Code** 不得称完成。  
细节：根 `AGENTS.md` **§8.0 R6**。

## Pre-Design（写盘前 · 强制产出）

```
[ ] 已读当前 ticket + Parent Spec/Answer；未重开已锁决策
[ ] **先读手册了解功能**（§8.0 R5 第一步；先于开 Figma 元素清单）
    - `docs/frontend-manual/01-frontend-integration-guide.md` 本票相关章
    - 相关 `docs/frontend-manual/contracts/*.md`
    - 触及写链 → 另读 `docs/money-path-map.md`
    - 产出：能用自己的话说明用户流程、读/写方法、前置检查、成功后刷新；禁止未读手册开写
[ ] 按 §8.0 R1 表对号：产品验收 vs foundation API vs 落点 vs i18n vs Figma vs 手册 vs money-path
[ ] **现行 Figma node 已钉死**（fileKey + frame id；若 section 有新帧替换旧帧，以用户指定 / 更新的帧为准）
[ ] **§8.0 R5 元素清单已落盘**（ticket 附件或 `.scratch/...`），形状符合 R5「禁止偷换」：
    - 按 frame 自上而下可见节点（含状态帧）
    - 含「代码有、稿无 → 删/缺口」列
    - 能力/门闸表可附属，不可替代节点清单
[ ] 手册 / money-path 已对照；稿∩手册空缺已暴露或 DEFER
[ ] **Pre-Design 独立审查已过**（另一会话 / reviewer / 用户勾认清单）——实现者自检不算过门
[ ] ticket 字面若像「把档位/文案塞进 shared」→ 按 R2 解为 call site；张力大则先暴露
[ ] **DOM / 锚点就绪**：验收 DOM 已在代码中或由本票创建；否则改 Blocked by
[ ] 落点查 src-layout；Foundation → runbook + api；hooks/i18n → react-runtime
[ ] 写链 → money-path + frontend-manual；合约地址 fail-closed
```

## 写盘中

```
[ ] 只实现清单 MUST / 已裁决项；发现稿变更 → 停手更新清单，不静默扩 scope
[ ] deletion-first：稿外 chrome、死状态、假数、无测缝的分支当场删
[ ] 用户可见文案 → i18n；PC 为文案 SSOT；全 locale 键补齐（本票触及的 key）
[ ] 纯逻辑 / 门闸 → 单测；禁止无失败测试先堆生产分支（TDD 缝）
```

## Post-Design（做后 · 贴稿分轨）

```
[ ] 同一份元素清单逐项标 pass / fail / N/A（附帧 id 或截图依据）
[ ] 稿外项已删或缺口已记录；无「先留着以后再说」的黑卡/原型残留
[ ] i18n：本票文案键全 locale 存在且与 PC 稿义对齐
[ ] **Post-Design 独立审查已过**（对照清单，非实现者口述）
```

## Post-Code（做后 · 质量分轨，≠ 贴稿）

```
[ ] 极简：无机会主义抽象 / wrapper / 预留扩展面
[ ] 清晰可测：数据流直；门闸与报价纯函数可单测；副作用边界清楚
[ ] §8.2：正确性 > 可验证性 > 简洁；deletion-first 已执行
[ ] `pnpm check` 通过
[ ] **Post-Code 独立审查已过**（可与 Post-Design 同 reviewer，但勾选分列；不可「过了视觉就跳过代码」）
```

## 编码习惯（从本仓已落地模式抽出）

| 做法                                               | 本仓锚点                                           | 反例                                      |
| -------------------------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| 用户可见字符串 → i18n + `<Text>`                   | `src/i18n/messages/` · foundation runbook §3       | `shared/ui` 内硬编码「活期」「领取/复投」 |
| 选项 / 档位 → call site 组装后传入                 | Segment / AmountBox：`options` · 必填 `aria-label` | 在 primitive 导出业务 `*_OPTIONS` presets |
| Composite = 跨页 chrome，非业务数据袋              | foundation api §7                                  | 借「业务组件」名把 domain 塞进 shared     |
| PC 文案 SSOT；H5 只响应式                          | AGENTS §8.4 / §8.6                                 | 为 H5 新增同义 key                        |
| 静态 UI = 现行 Figma fileKey                       | AGENTS §8.4                                        | `docs/figma-export/`、旧 fileKey          |
| 稿∩手册才 MUST；手册独有→缺口；稿独有→暴露         | AGENTS §8.0 **R5**                                 | 无稿造 UI；有稿不读手册；假数冒充验收     |
| **先读手册再开稿清单**                             | AGENTS §8.0 **R5** 第一步 · 本表 Pre-Design        | 跳过手册直接贴稿/抄现码                   |
| 三门独立审查                                       | AGENTS §8.0 **R6**                                 | 自检冒充审查；用链上完成代替贴稿          |
| 交互跟原型状态机，禁抄 DOM/CSS                     | Spec Testing / map                                 | 粘贴原型 class / 结构当生产               |
| 金钱路径复用既有 intent / unknown lock / live 门闸 | `docs/money-path-map.md`                           | ticket 为「好写」绕开二次门闸             |
| 测试：合同用 unit；行为 e2e 在挂载后               | `tests/unit/*` · `pnpm test:e2e` 可选              | 无失败测试先写生产代码（TDD 缝）          |
| 收工                                               | 三门 + `pnpm check`                                | 只靠肉眼或未跑门禁称完成                  |

## 提交前多 agent（§8.0 **R7** · 强制）

> 每个 tab / ticket **`git commit` 之前**必须过；实现者自检不算。用户锁定：子代理模型 = **Grok 4.5 high**（Cursor slug `cursor-grok-4.5-high`）。

```
[ ] Post-Design / Spec 子代理（Grok 4.5 high）已对照 ticket + Pre-Design 清单 + 手册/Figma
[ ] Post-Code / deletion-first 子代理（Grok 4.5 high）已对照 §8.2 + 金钱路径 + 死代码/多余抽象
[ ] Critical 已清或已修；DEFER 已落盘理由
[ ] 审查结论路径已记录（`.scratch/.../research/*-review.md` 或 ticket 勾选）
[ ] 然后才 `git commit`（用户明示才提交）
```

**并行 spawn**：同一轮至少两条 Task/子代理，`model: cursor-grok-4.5-high`。账单或工具不可用时：停手暴露，不得静默降级模型或跳过 R7（用户明示「跳过审查」除外）。

**补审**：已提交但未过 R7 的 tab → 补跑两路审查；Critical → follow-up commit。

## `/implement` 节奏（单票）

1. 新会话；只带 **一张** ticket + Spec 相关节 + §8.0。
2. **先读手册了解功能**（integration-guide 章 + contracts + 必要时 money-path）。
3. **Pre-Design**：落盘元素清单（稿 × 手册）→ 独立审查通过。
4. `/tdd`：先红后绿（gates / 纯函数 / 合同优先）。
5. 最小实现；deletion-first。
6. **Post-Design** + **Post-Code** 分轨独立审查。
7. 组件已挂路由再补 Playwright **行为**契约（非像素 SSOT）。
8. `pnpm check`。
9. **R7 多 agent（Grok 4.5 high）** → Critical 清零。
10. **单票一 commit**（用户明示才提交）；再开下一票窗口。

## 写盘后报告（常规）

改了什么 · 为何 · Pre/Post 清单路径与审查结论（含 R7） · `pnpm check` · 剩余风险 · 一句反面意见。
