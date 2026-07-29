# Implement 编码检查单

> **不是**第二套规范。细则 SSOT：[`AGENTS.md`](../../AGENTS.md) §8.0 · [`ui-leaf-parity-workflow.md`](./ui-leaf-parity-workflow.md)（**page-done 唯一正文**）· [`commands.md`](./commands.md)。

## 节奏

```
Pre-Design → 写盘（一页一帧）→ Post-Design + Post-Code → pnpm check → R7 → commit → page-done
```

## Pre-Design

```
[ ] ticket / Spec；未重开已锁决策
[ ] 手册已读（钱/门闸）；能口述
[ ] DApp：WebBridge 实录五字段已写（ui-leaf §2.2）；非 DApp 无原型：N/A + 路径证据
[ ] Figma fileKey + PC frame；get_design_context 页+子
[ ] 动态审计表；leaf UI 列∥钱路列（R5a：手册沉默不砍控件）
[ ] 「稿无代码有」列
[ ] Pre-Design 证据齐（独立审默认可压到 R7，除非用户要求写前再审）
[ ] DOM 就绪；src-layout；写链 fail-closed
```

## 写盘中

```
[ ] 只改本帧清单；本页未 page-done 不开下一帧
[ ] 稿面控件 UI MUST 已实现（手册缺数 → 缺口记文档 + 值 `—`；禁因此跳过 UI）
[ ] deletion-first；假数删
[ ] i18n：PC SSOT；键齐；真译可 locale-DEFER
[ ] 子代理 = cursor-grok-4.5-high only
```

## Post-Design / Post-Code

```
[ ] leaf UI 项无未解释 FAIL；钱路列单独判
[ ] WebBridge 实录仍在；回看过
[ ] Post-Code：§8.2；pnpm check
[ ] 独立审查（可并入 R7 双轨）
```

## 习惯（反例）

| 做                                 | 反例                      |
| ---------------------------------- | ------------------------- |
| 控件跟 Figma/原型；钱跟手册（R5a） | 「稿∩手册才 MUST」砍下拉  |
| 任意页走 ui-leaf §3–§5             | 截图估；check 绿冒充完成  |
| 诚实空                             | 演示数 / 假 1:1           |
| shared 只 chrome                   | 业务 presets 进 primitive |

## R7（commit 前）

```
[ ] Post-Design：实录五字段 + R5a；缺 → Critical（禁「DEFER 不挡」）
[ ] Post-Code：假数 / 稿外 / flip 冒充 picker
[ ] Critical=0；结论落盘
[ ] 用户明示才 commit → 才改 Status=page-done
```

## `/implement`（单帧）

手册 → WebBridge → Figma leaf → 动态审计 → 实现 → 回看 → check → R7 → commit → page-done → **下一帧**。

## 报告

改了什么 · leaf 路径（含实录）· R7 · check · 风险 · 反面意见。
