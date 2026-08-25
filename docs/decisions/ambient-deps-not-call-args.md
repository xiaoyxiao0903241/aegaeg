# 环境依赖不当参数传

> **状态：现行（已落地）**  
> 触发：改链上读 / `WriteSession` / 再抽「为了可测而注入」时读。

## 裁决

全站只有一个当前 BSC 只读客户端（`bscReadClient`）。未连走公共 HTTP，已连 BSC 走钱包节点。  
**不要**再把它当作 `client` / `readClient` 从 `WriteSession` 传到每个 `read*`。

`WriteSession` 只保留这笔写需要的身份：`wallet` / `account` / `address`。  
单测不要靠 `{ readContract }` 塞进 session；改 mock 读函数或模块。

钱包、JWT、QueryClient 等同理：已有单例 / store / hook 的，禁止再当位置参数往下传。

## 为何是坏习惯

为了「调用方可见依赖」把环境对象塞进每个签名，读代码时满屏都是搬运，看不清真正变化的业务参数。可测性应该在边界 mock，不该污染生产函数形状。

## 已拆

|位置|改法|
|---|---|
|`WriteSession.readClient` + 各 `read*(…, client)`|读一律走 `bscReadClient`；单测用 `setBscReadClientForTest`|
|`fetchLiveGenesisPostApprove` 四个 `fetch*`|函数内直接调绑定 / 暂停 / 剩余额度 / 块时间|
|`ChainReadClient`|删空别名；写路径 gas 用 `PublicClient`|
