# 前端手册入仓说明（仓库元文档，非手册正文）

> **原始 SSOT**：[`frontend-manual/AEGIS_X_FRONTEND_MANUAL.html`](./frontend-manual/AEGIS_X_FRONTEND_MANUAL.html)  
> （来源：`AEGIS_X_FRONTEND_MANUAL.html`，入仓时 **字节级复制**，sha256 见下方。）  
> **Markdown 阅读版**：[`frontend-manual/`](./frontend-manual/)（由上述 HTML 自动转换；ABI 拆到 `abis/*.json`）。

## 与原始 HTML 一致性（已复核）

对账脚本结论（`docs/frontend-manual/HTML_FIDELITY_REPORT.json`）：

| 检查项                                            | 结果                                                                                                                                                      |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HTML sha256                                       | `d8fcab922773c7c44944e0896e17657c368a432746ad47a569d81f774fd370be`（1,828,261 bytes）                                                                     |
| 主网地址表 `data-address-row` ↔ `00-addresses.md` | **47/47 键与地址完全一致**（含大小写）                                                                                                                    |
| HTML `<pre>` ABI ↔ `abis/*.json`                  | **40/40 面板均有对应 JSON**；canonical digest **39 个唯一**（HTML 原文里 CommunityFund 与预售 RewardClaimer 的 ABI 面板内容相同，属上游一致，非转换丢包） |
| HTML 有意义正文行 ⊆ 对应 Markdown                 | **8737/8737**（脚本忽略 2 行 HTML 壳：`前端接入主指南`、`docs/FRONTEND_INTEGRATION_GUIDE.md`）                                                            |
| 集成指南中文行（≥20 字）                          | **235/235 均在 MD 中**                                                                                                                                    |

**结论**：业务正文、地址、ABI 与原始 HTML **一致**。Markdown 差异仅来自转换形态（表格拆行、`<details>` ABI 折叠、`来源：` / `ABI：abis/...` 链接），不是内容改写。

复跑对账：

```bash
python3 scripts/verify-frontend-manual-html-fidelity.py
```

## 分层

| 层               | Owner                                           | 说明                       |
| ---------------- | ----------------------------------------------- | -------------------------- |
| 原始手册         | `frontend-manual/AEGIS_X_FRONTEND_MANUAL.html`  | **唯一不可改写原文**       |
| 地址目录（阅读） | `frontend-manual/00-addresses.md`               | 须与 HTML 地址表一致       |
| ABI（阅读/引用） | `frontend-manual/abis/*.json`                   | 须与 HTML `<pre>` ABI 一致 |
| Env 全量模板     | `env/manual.bsc.addresses.env`                  | 由地址表机械导出           |
| 运行时注入       | `VITE_BSC_*` → `src/shared/config/contracts.ts` | **fail-closed**            |
| 已实现行为       | `docs/contract.md` + `src/web3/**`              | 绑定 / 预售 / 领取等       |

## 禁止

- 在本仓库「顺手改」`frontend-manual/**` 正文去对齐产品；上游 HTML 更新后应整文件替换 HTML，再重生成 MD，并复跑 fidelity 脚本
- 在 `src/` 硬编码部署合约地址作为缺省 fallback
- 把 `env/ci.env` 占位 Client ID 当生产密钥
