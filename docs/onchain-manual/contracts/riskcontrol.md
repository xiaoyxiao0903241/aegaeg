# RiskControl 合约文档

> 来源：`doc-contracts-riskcontrol`
> ABI：[`abis/riskcontrol.json`](../abis/riskcontrol.json)

## 完整 ABI

abi/AegisRiskController.json
SHA-256 2938ea003caf…
19
11
2
6

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/riskcontrol.json`](../abis/riskcontrol.json)（19 entries）。

</details>

## RiskControl 合约文档

### 概述

`AegisRiskController` 是 AGX 的受限操作转发器。它不读取价格、不维护价格快照，也不自行判断是否触发风险策略；owner 只负责指定两个操作地址，由外部风控系统决定何时调用：

- balanceControlAddress ：唯一可以调用 executeBalance() 的地址；该入口转调 AGX 的 burnPoolBalance() 。
- feeControlAddress ：唯一可以调用 updateFeeRatio(newTaxRate) 的地址；该入口转调 AGX 的 setBaseSellTax(newTaxRate) 。

AGX 的 Crash Fuse、价格快照和额外卖出税状态属于 `AGX.sol`，不属于本合约。前端不能使用 RiskControl ABI 查询这些状态。

**部署 key**：`RiskControl`

**Solidity 合约名**：`AegisRiskController`

**ABI 路径**：`abi/AegisRiskController.json`

### 状态变量

| Getter | 含义 |
| --- | --- |
| `agxToken()` | 被控制的 AGX 地址；初始化时写入 |
| `balanceControlAddress()` | 余额销毁操作的唯一授权调用者 |
| `feeControlAddress()` | 基础卖出税更新的唯一授权调用者 |
| `owner()` | 可配置两个控制地址的管理员 |

### 写入函数

#### initialize(address agxToken)

代理初始化函数，将调用者设为 owner 并保存 AGX 地址。只能初始化一次。

#### setBalanceControlAddress(address control)

仅 owner。设置余额控制地址；零地址会以 `ErrorRiskControlInvalidAddress()` 回滚。

#### setFeeControlAddress(address control)

仅 owner。设置税率控制地址；零地址会以 `ErrorRiskControlInvalidAddress()` 回滚。

#### executeBalance()

仅 `balanceControlAddress`。调用 AGX 的 `burnPoolBalance()`；其他地址调用会以 `ErrorRiskControlUnauthorized()` 回滚。AGX 调用失败时整笔交易原子回滚。

#### updateFeeRatio(uint256 newTaxRate)

仅 `feeControlAddress`。调用 AGX 的 `setBaseSellTax(newTaxRate)`；其他地址调用会以 `ErrorRiskControlUnauthorized()` 回滚。税率范围由 AGX 合约校验，RiskControl 不重复设置上限。

javascript
```javascript
const riskControl = new Contract(addresses.RiskControl.proxy, RISK_CONTROL_ABI, signer);

await (await riskControl.setBalanceControlAddress(balanceOperator)).wait(); // owner
await (await riskControl.setFeeControlAddress(feeOperator)).wait();         // owner

await (await riskControl.connect(balanceSigner).executeBalance()).wait();
await (await riskControl.connect(feeSigner).updateFeeRatio(newTaxRate)).wait();
```

### 事件与错误

当前合约自身没有定义业务事件；应根据对应交易 receipt 同时解析 AGX 发出的事件。

| 自定义错误 | 触发条件 |
| --- | --- |
| `ErrorRiskControlInvalidAddress()` | owner 尝试把控制地址设置为零地址 |
| `ErrorRiskControlUnauthorized()` | 非对应控制地址调用受限操作 |

### 权限和运维要求

- owner 只能配置控制地址，不能直接绕过调用者检查执行风控操作；如果 owner 也需要执行，必须明确把 owner 地址配置为对应 control。
- 两个 control 地址权限很高，应使用独立受控账户或多签/自动化执行器，并监控其变更。
- 本合约不验证价格来源或策略正确性；外部决策系统必须自行完成价格防操纵、阈值和冷却期检查。
