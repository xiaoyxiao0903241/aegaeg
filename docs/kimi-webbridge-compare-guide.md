# Kimi WebBridge 视觉对比 — 使用说明

> **适用**：`pnpm compare:screenshots` · `pnpm compare:diff-audit`（截图链）  
> **不适用**：`pnpm compare:computed` — 该命令用 **Playwright + Edge**，不走 WebBridge（见 §8）  
> **上游流程**：[`foundation/verification.md`](./foundation/verification.md) §5

---

## 1. 原理（30 秒）

| 组件 | 作用 |
|------|------|
| **Kimi WebBridge 守护进程** | 本机 `http://127.0.0.1:10086`，接收 JSON 命令 |
| **Edge 浏览器扩展** | 附着到系统 Edge，执行 navigate / CDP 截图 |
| **aegis 对比脚本** | `curl` → 10086，顺序打开 4175 / 5174，生成标红 `diff.png` |

**新 Cursor 会话不会自动启动 WebBridge。** Agent 或你需要 **先手动启动守护进程 + 确认扩展已连接**，再跑 `pnpm compare:screenshots`。

---

## 2. 一次性安装

### 2.1 安装 WebBridge 守护进程

若命令不存在，按官方页安装：

- 中文：https://www.kimi.com/zh-cn/features/webbridge  
- English：https://www.kimi.com/features/webbridge  

安装后二进制路径（macOS）：

```text
~/.kimi-webbridge/bin/kimi-webbridge
```

### 2.2 安装 Edge 扩展

同一官方页下载 **Microsoft Edge** 扩展并启用。扩展必须显示 **已连接**（与守护进程 WebSocket 连通）。

### 2.3 验证安装

```bash
~/.kimi-webbridge/bin/kimi-webbridge start   # 已运行则 no-op
curl -s http://127.0.0.1:10086/status | python3 -m json.tool
```

期望（字段名以实际 JSON 为准）：

- `running: true`
- `extension_connected: true`

若 `extension_connected: false` → 打开 Edge，点击扩展图标重连；仍失败见官方帮助页。

---

## 3. 每次对比前：环境清单

按顺序做，**缺一步脚本会失败或产出假 diff**。

### 3.1 启动 WebBridge（必做）

```bash
~/.kimi-webbridge/bin/kimi-webbridge start
```

**新对话 / 新终端 / 重启电脑后都要再跑。** Cursor Agent 也应先执行此命令，再跑对比脚本。

### 3.2 启动双 dev（4175 基线 + 5174 当前）

```bash
# 终端 A — dev 分支基线（仅首次需 worktree，见 foundation/verification.md）
pnpm dev:baseline
# 等价：cd /private/tmp/aegis-dev-baseline && pnpm dev --host 127.0.0.1 --port 4175 --strictPort

# 终端 B — 当前 refactor 分支
cd /Users/ava/Documents/Projects/aegis
pnpm dev --host 127.0.0.1 --port 5174 --strictPort
```

验证：

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:4175/en/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5174/en/
# 两次都应是 200
```

### 3.3 清理 Edge 里的 localhost 标签（强烈建议）

脚本 **顺序** 打开 4175 → 再 5174。若 Edge 里 **同时** 留着多个 `127.0.0.1:4175` / `:5174` 标签，`find_tab` 会 **误匹配端口**，产出「几乎相同」的假 diff。

```bash
# 关闭脚本用过的 session 标签组
pnpm compare:webbridge:cleanup

# 仍失败：手动关掉 Edge 里所有 localhost:4175 / localhost:5174 标签后再跑
```

### 3.4 快速探测 WebBridge 是否可用

```bash
curl -s http://127.0.0.1:10086/command \
  -H 'Content-Type: application/json' \
  -d '{"action":"navigate","args":{"url":"http://127.0.0.1:5174/en/"},"session":"aegis-preflight"}'
```

返回 `"ok":true` 且 `"url":"http://127.0.0.1:5174/..."` 即通信正常。测完可：

```bash
curl -s http://127.0.0.1:10086/command \
  -H 'Content-Type: application/json' \
  -d '{"action":"close_session","args":{},"session":"aegis-preflight"}'
```

---

## 4. 运行对比脚本

### 4.1 全页标红 diff（10 个 target）

```bash
cd /Users/ava/Documents/Projects/aegis

# 未连钱包时用（推荐日常 refactor）
UI_COMPARE_SKIP_WALLET=1 pnpm compare:screenshots
```

产物：

```text
tmp/screenshot-diff/
  home-desktop/
    base-4175.png      # 基线
    curr-5174.png      # 当前
    diff.png           # 标红（人眼验收主图）
    diff-heatmap.png   # 聚类用，勿当人眼验收
  dapp-swap-desktop/
    ...
  report.json
```

**退出码 1** 表示「有像素差异」—— 正常，不是 WebBridge 坏了。看 `diff.png` 和 `report.json`。

### 4.2 只跑单个页面

```bash
UI_COMPARE_SKIP_WALLET=1 UI_COMPARE_TARGETS=dapp-swap-desktop pnpm compare:screenshots
```

可用 id：`home-desktop` · `home-h5` · `dapp-swap-desktop` · `dapp-swap-h5` · `dapp-genesis-desktop` · `dapp-genesis-h5` · `dapp-rewards-desktop` · `dapp-rewards-h5` · `dapp-community-desktop` · `dapp-community-h5`

### 4.3 标红 → DOM → computed

**必须先有 §4.1 的产物**：

```bash
pnpm compare:diff-audit
pnpm compare:diff-audit -- dapp-swap-desktop   # 单 target
```

产物：`tmp/visual-diff-audit/<target>.json` · `summary.json`

---

## 5. 环境变量速查

| 变量 | 默认 | 说明 |
|------|------|------|
| `UI_COMPARE_BASE` | `http://127.0.0.1:4175` | 基线 URL |
| `UI_COMPARE_CURR` | `http://127.0.0.1:5174` | 当前分支 URL |
| `UI_COMPARE_SKIP_WALLET` | 未设置 | `1` = 不等待 SIWE/钱包 |
| `UI_COMPARE_TARGETS` | 全部 10 个 | 逗号或空格分隔 id |
| `UI_COMPARE_OUT` | `tmp/screenshot-diff` | 截图输出目录 |
| `UI_COMPARE_CAPTURE` | `fullPage` | `longPage` / `viewport` 为 fallback |
| `UI_COMPARE_WB_SESSION` | `aegis-visual-compare` | WebBridge session 名 |
| `UI_COMPARE_REUSE_TABS` | 未设置 | `1` = 复用已登录标签（高级） |

---

## 6. 如何读结果

| 文件 | 用途 |
|------|------|
| `diff.png` | **必看** — 当前页底图 + 差异标红 |
| `report.json` | `pct` · `baseTab.origin` / `currTab.origin`（必须为 4175 / 5174） |
| `diff-heatmap.png` | 给 `compare:diff-audit` 聚类，**不能**当人眼验收图 |

**假阴性信号**：swap desktop `pct` 只有 ~0.5% 但肉眼明显不同 → 查 `report.json` 的 origin，多半是 **双标签误截图**。

---

## 7. 常见错误与处理

| 报错 / 现象 | 原因 | 处理 |
|-------------|------|------|
| `fetch failed` / `connection refused` :10086 | 守护进程未启动 | `~/.kimi-webbridge/bin/kimi-webbridge start` |
| `extension_error` / 扩展未连接 | Edge 扩展未连上 | 打开 Edge，重连扩展；查 `/status` |
| `标签 origin 错误：期望 4175，实际 5174` | Edge 多 localhost 标签 | `pnpm compare:webbridge:cleanup` + 手动关标签 |
| `page load timeout` | 5174/4175 dev 未起或编译慢 | 确认双 dev 200；重试 |
| `Please update the Kimi WebBridge extension` | 扩展版本旧 | 按官方页更新扩展 |
| 新 Cursor 会话「无法用 webbridge」 | Agent 未启动 daemon；或误以为有 MCP | **无 Cursor MCP**；脚本直连 10086，需 §3.1 |
| `compare:diff-audit` 失败 | 未先跑 screenshots | 先 §4.1 |

**不要**在未确认的情况下运行 `kimi-webbridge stop` / `restart` — 可能打断 Kimi Desktop 管理的守护进程（见官方 operations 文档）。

---

## 8. 与 `compare:computed` 的区别

| 命令 | 浏览器控制 | 用途 |
|------|------------|------|
| `compare:screenshots` | **Kimi WebBridge** + 系统 Edge | 全页像素 diff、标红 |
| `compare:diff-audit` | Playwright（读截图 + 开 Edge 探针） | 标红簇 → computed |
| `compare:computed` | **Playwright**（可选 CDP 9222） | 探针回归网，**不需要** WebBridge |

跑 computed 前 **不需要** 启动 WebBridge，但需要 Playwright 与 Edge channel。

---

## 9. 给新 Cursor 会话的 Handoff（复制即用）

```text
视觉对比前置（必做）：
1. ~/.kimi-webbridge/bin/kimi-webbridge start
2. curl http://127.0.0.1:10086/status 确认 extension_connected
3. pnpm dev:baseline（4175）+ pnpm dev --host 127.0.0.1 --port 5174 --strictPort
4. pnpm compare:webbridge:cleanup
5. UI_COMPARE_SKIP_WALLET=1 pnpm compare:screenshots

说明文档：docs/kimi-webbridge-compare-guide.md
产物：tmp/screenshot-diff/*/diff.png
```

---

## 10. 相关路径

| 资源 | 路径 |
|------|------|
| 截图脚本 | `scripts/ui-compare-screenshot-diff.mjs` |
| audit 脚本 | `scripts/ui-compare-diff-audit.mjs` |
| session 清理 | `scripts/kimi-webbridge-close-sessions.mjs` |
| 基线 dev 启动 | `pnpm dev:baseline` → `scripts/dev-baseline.mjs` |
| WebBridge 官方 skill | `~/.kimi-code/skills/kimi-webbridge/SKILL.md` |

---

## 修订记录

| 版本 | 日期 | 说明 |
|------|------|------|
| v1.0 | 2026-07-08 | 初版：安装、每次前置、脚本、排错、新会话 handoff |
