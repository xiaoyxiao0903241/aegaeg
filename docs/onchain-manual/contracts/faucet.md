# Faucet（USD1）前端使用指南

> 来源：`doc-contracts-faucet`
> ABI：[`abis/faucet.json`](../abis/faucet.json)

## 完整 ABI

abi/USD1.json
SHA-256 4d7543a73238…
22
11
3
8

<details>
<summary>展开查看 ABI JSON</summary>

完整 ABI 已导出为 [`abis/faucet.json`](../abis/faucet.json)（22 entries）。

</details>

## Faucet（USD1）前端使用指南

### 定位与安全边界

`USD1`（源码 `src/Faucet.sol`，原合约名 `AegisMintableToken`）是可配置 decimals 的可增发 ERC20。本地/测试部署通常使用 key `Faucet`；BNB Chain 主网累计快照把同一实现记录为 `USD1`。

当前源码的 `mint(address,uint256)` **没有任何权限控制，任何地址都能增发**。因此：

- 该 mint 不是管理员权限，任何钱包都可以直接调用；主网使用它并不会自动获得稳定币的发行权限控制。
- 普通生产前端不应把公开 mint 包装成“管理员充值”，也不应默认展示 mint 按钮；即使 UI 隐藏，链上方法仍然公开可调用。
- 若业务期望 USD1 具备受控发行或真实资产价值，必须另行修改/迁移合约并审计，文档或前端限制不能修复链上公开增发权限。

**部署 key**：本地/历史 `Faucet`；当前主网 `USD1`

**ABI**：`abi/USD1.json`

当前 BNB Chain 主网使用规范 key `USD1`，地址为 `0xd94Be47992B17534d7eDB6293D0433F5C7A166aC`（release `bb680398-e7c0-46fa-ad87-139446fb4120`，`MAINNET_REUSE_ALLOWLIST=none`）。前端使用本页 `USD1` ABI，但普通业务页面只需标准 ERC20 读写；`mint` 的公开可调用风险必须单独披露。

### 前端读取

使用标准 ERC20 方法：

javascript
```javascript
const [name, symbol, decimals, balance, allowance, totalSupply] = await Promise.all([
  token.name(),
  token.symbol(),
  token.decimals(),
  token.balanceOf(user),
  token.allowance(user, spender),
  token.totalSupply(),
]);
```

不要硬编码 decimals。部署时可以把该 token 初始化为任意精度；当前本地 USD1 流程通常使用 18 位。

### 写方法

| 方法 | 权限 | 前端用途 |
| --- | --- | --- |
| `transfer(to, amount)` | token 持有人 | 标准转账 |
| `approve(spender, amount)` | token 持有人 | 为 PreSale、Usd1Swap、BondHelper、Turbine 等授权 |
| `transferFrom(from, to, amount)` | 已获 allowance 的 spender | 一般由业务合约调用 |
| `mint(to, amount)` | **任何地址** | 仅测试工具；生产用户界面不展示 |

测试环境 mint：

javascript
```javascript
const decimals = await token.decimals();
const amount = ethers.parseUnits('1000', decimals);
await (await token.mint(user, amount)).wait();
```

### 事件与错误

合约只使用 OpenZeppelin ERC20 的标准 `Transfer`、`Approval` 事件和标准 ERC20 自定义错误。源码没有 `Minted` 或 `Unauthorized`。

mint 会产生 `Transfer(address(0), to, amount)`；前端若需要测试资产到账通知，应监听标准 `Transfer` 并核对 `from == ZeroAddress`。
