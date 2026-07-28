# Implement 编码检查单

> **不是**第二套规范。写盘前过一遍；细则仍以链出的 SSOT 为准。  
> 分层裁决：根 [`AGENTS.md`](../../AGENTS.md) **§8.0**。命令门禁：[`commands.md`](./commands.md)。

## 写盘前（强制）

```
[ ] 已读当前 ticket + Parent Spec/Answer；未重开已锁决策
[ ] 按 §8.0 R1 表对号：产品验收 vs foundation API vs 落点 vs i18n vs Figma vs 手册 vs money-path
[ ] ticket 字面若像「把档位/文案塞进 shared」→ 按 R2 解为 call site；张力大则先暴露，禁止静默覆盖
[ ] 落点查 src-layout：宁放 views，勿放 shared；shared/ui 只扩 chrome（R3）
[ ] 触达 Foundation / shell primitive → 先读 foundation runbook + api（AGENTS §8.1）
[ ] 改 hooks / memo / i18n 渲染 → 先读 docs/react-runtime.md
[ ] 写链 / 领奖 / 兑换提交 → 先读 docs/money-path-map.md；不重写已证 gates
[ ] 合约地址 → shared/config + VITE_BSC_* fail-closed；组件内禁散落地址
```

## 编码习惯（从本仓已落地模式抽出）

| 做法                                               | 本仓锚点                                           | 反例                                      |
| -------------------------------------------------- | -------------------------------------------------- | ----------------------------------------- |
| 用户可见字符串 → i18n + `<Text>`                   | `src/i18n/messages/` · foundation runbook §3       | `shared/ui` 内硬编码「活期」「领取/复投」 |
| 选项 / 档位 → call site 组装后传入                 | Segment / AmountBox：`options` · 必填 `aria-label` | 在 primitive 导出业务 `*_OPTIONS` presets |
| Composite = 跨页 chrome，非业务数据袋              | foundation api §7                                  | 借「业务组件」名把 domain 塞进 shared     |
| PC 文案 SSOT；H5 只响应式                          | AGENTS §8.4 / §8.6                                 | 为 H5 新增同义 key                        |
| 静态 UI = 现行 Figma fileKey                       | AGENTS §8.4                                        | `docs/figma-export/`、旧 fileKey          |
| 交互跟原型状态机，禁抄 DOM/CSS                     | Spec Testing / map                                 | 粘贴原型 class / 结构当生产               |
| 金钱路径复用既有 intent / unknown lock / live 门闸 | `docs/money-path-map.md`                           | ticket 为「好写」绕开二次门闸             |
| 测试：合同用 unit；行为 e2e 在挂载后               | `tests/unit/*` · `pnpm test:e2e` 可选              | 无失败测试先写生产代码（TDD 缝）          |
| 收工                                               | `pnpm check`                                       | 只靠肉眼或未跑门禁称完成                  |

## `/implement` 节奏（单票）

1. 新会话；只带 **一张** ticket + Spec 相关节 + §8.0。
2. `/tdd`：先红后绿（gates / 纯函数 / 合同优先）。
3. 最小实现；deletion-first。
4. 组件已挂路由再补 Playwright **行为**契约（非像素 SSOT）。
5. `pnpm check`。
6. **单票一 commit**；再开下一票窗口。

## 写盘后报告（轻量）

改了什么 · 为何（含归属：chrome vs call site）· 如何验证 · 剩余风险。
