# 前端不再接归档 PrincipalReleaseVault

> **状态：现行**  
> 触发：补释放缓冲读/写、加 `VITE_BSC_PRINCIPAL_RELEASE_VAULT`、对照手册 §13「凭归档 ABI 领取」时读。

## 裁决

旧 `PrincipalReleaseVault` 代理不再进入本仓运行时。  
缓冲页只读/领分流器链（Manager → Head → `next`）。

手册 §13 仍写历史单可在旧地址领取；**本仓按产品裁决不接**。入仓手册正文不改。

## 不要做

- 不要把 `VITE_BSC_PRINCIPAL_RELEASE_VAULT` 加回 `contracts.ts`
- 不要为归档 ABI 再写 `claimMany`
- 不要改 `docs/onchain-manual/` 里质押合约槽位名 `principalReleaseVault`（那是指向 Manager 的历史字段名）
