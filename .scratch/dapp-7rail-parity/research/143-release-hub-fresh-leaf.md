# 143 · 释放 Hub fresh leaf · PC `4298:212`

> **Status：** `page-done`（本轮 fresh · Critical=0）  
> **fileKey：** `uiKwzwIoD06phS0husdqjB`  
> **本站：** `http://127.0.0.1:5174/zh/app.html#release`  
> **WebBridge：** `127.0.0.1:10086` · session `release-fresh`  
> **旧 leaf：** 作废（`85`/`115`）  
> **日期：** 2026-08-02 · **禁** `*[Npx]`/`*[Nrem]`

---

## Figma 直拉（本轮 · MCP 证据）

| 调用 | node | 时间 |
|------|------|------|
| `get_metadata` | `4298:212` 全树 | 2026-08-02T20:28+08 |
| `get_design_context` · `skillNames=figma-design-to-code` | `4298:212` 页帧 | 同 |
| 同上 | `4298:365` 释放池 | 同 |
| 同上 | `4298:376` 缓冲池 | 同 |
| 同上 | `4299:222` mechanism | 同 |
| 同上 | `4299:253` FAQ | 同 |

**确认：** frame name=`DApp — 释放 · 无数据 (Desktop 1920)` · w1920×h1216

| # | nodeId | leaf | 稿规格 |
|---|--------|------|--------|
| L1 | `4298:360` | 标题 | 20 Semi |
| L2 | `4298:362` | menu | 36×36 |
| L3 | `4298:365` | 释放池 | **351×125** · outlined · p16 |
| L4 | `4298:376` | 缓冲池 | **351×146** |
| R1 | `4299:213` | carousel | **h108** |
| R2 | `4299:222` | mechanism | **h286** · badge28 |
| R3 | `4299:253`… | FAQ×5 | **h54** |

---

## A1 手册 / A2 OpenAPI

Hub 无写链。RQ/PRV 读：`useReleaseQueueSnapshot` / `useReleaseBufferSnapshot`。≈$ 无源→`≈ —`；缓冲 gAGX→`—`。

## A3 原型五字段

1. `http://127.0.0.1:8766/AEGIS%20X%20DApp.html`  
2. rail 释放  
3. Hub 双池 → 点释放池进 queue  
4. 原型演示数；本站 live/`≈ —`  
5. 2026-08-02

## A5 本站实测

| leaf | 稿 | 实测 | Δ | 判 |
|------|----|------|---|-----|
| 释放池 | 125 | **125** | 0 | PASS |
| 缓冲池 | 146 | **146** | 0 | PASS |
| carousel | 108 | **108** | 0 | PASS |
| mechanism | 286 | **286** | 0 | PASS |
| badge | 28 | **28** | 0 | PASS |
| menu | 36 | **36** | 0 | PASS |
| FAQ | 54 | **55.2** | 1.2 | Med |
| h1 | 20 | text-xl/none | ≤1 | PASS/Med |

**Critical=0**

## 改码

- `release-hub-widget`：h1 `text-xl/none`
