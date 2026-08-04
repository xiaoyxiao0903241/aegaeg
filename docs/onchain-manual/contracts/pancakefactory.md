# PancakeFactory 前端集成说明

> 来源：`doc-contracts-pancakefactory`
> ABI：[`abis/pancakefactory.json`](../abis/pancakefactory.json)

## 完整 ABI

abi/PancakeFactory.json
SHA-256 b491d0dadb3b…
4
3
1
0

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/pancakefactory.json`](../abis/pancakefactory.json)（4 entries）。

</details>

## PancakeFactory 前端集成说明

这是项目内的简化 V2 Factory，用于确定性创建/查询交易对。普通 Swap 页面主要通过 Router 操作，不直接调用 Factory 写方法。

**部署 key**：`PancakeFactory`

**ABI**：`abi/PancakeFactory.json`

### 前端读取

| 方法                     | 说明                                                                                |
| ------------------------ | ----------------------------------------------------------------------------------- |
| `getPair(tokenA,tokenB)` | 查询交易对；零地址表示尚未创建                                                      |
| `allPairs(index)`        | 按索引读取已创建 pair；当前 ABI 没有 `allPairsLength()`，前端不要假设可直接得到总数 |

`createPair(tokenA,tokenB)` 是 permissionless，但生产用户界面不应把“创建新池”混入普通兑换流程。项目发布阶段应预先创建、验证并在地址 manifest 中锁定所需 pair；前端使用 Router 报价/兑换，并核对 Router/Factory 是否属于目标网络配置。

监听 `PairCreated(token0,token1,pair,index)` 后仍要通过 `getPair` 回读，不只依赖事件。
