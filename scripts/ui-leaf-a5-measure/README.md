# UI leaf A5 全量实测（§2.3b）

> **禁止抽检。** A4 inventory 有 N 行 → 本脚本产出 R 行，且 **R 必须 = N**。

## 命令

```bash
# 需：pnpm dev（:5174）+ Kimi WebBridge（:10086）
pnpm measure:leaf --profile assets-hub
pnpm measure:leaf --list
pnpm measure:leaf --profile assets-hub --allow-fail   # 只强制 R==N，样式 FAIL 仍写出
```

## 新页怎么加

1. 复制 `profiles/assets-hub.mjs` + `profiles/assets-hub.page.js`
2. 改 `profile.inventory` / `url` / `out`
3. 改 `page.js`：对本站 DOM 采结构化 snapshot（不要手抄子集）
4. 改 `mapLeaves`：按 **A4 表顺序** 把每个 `nodeId` 绑到 snapshot 路径（长度必须 = N）
5. 在 `measure.mjs` 的 `PROFILES` 注册 id

## 产出

`*-measure-full.json`：

| 字段                            | 含义                |
| ------------------------------- | ------------------- |
| `N` / `R` / `R_eq_N`            | 机械门              |
| `pass` / `fail` / `locate_fail` | 对照结果            |
| `rows[]`                        | 每一 A4 nodeId 一行 |
| `fail_rows[]`                   | 仅 FAIL（便于修码） |

SSOT：[`docs/agents/ui-leaf-parity-workflow.md`](../../docs/agents/ui-leaf-parity-workflow.md) §2.3b。
