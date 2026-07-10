# AEGIS X 前端合约调用指南 — 绑定 & 预售 & 团队奖励


> 本文档面向前端开发，梳理邀请绑定推荐关系、预售购买、团队奖励领取三个核心业务的合约调用方法。
>
> **本仓库实现入口（行为 SSOT）**：写链经 `src/web3/wallet/wallet-contract-write.ts`；绑定 `referral-write.ts`；预售 `presale-write.ts`；奖励领取 `reward-claim.ts`（API 签名 → `normalize-team-reward-claim.ts` → 链上 `claimReward`）。地址 SSOT：`src/shared/config/contracts.ts`。

---


## 目录


1. [通用说明](#1-通用说明)
2. [模块一：邀请绑定（AegisReferral）](#2-模块一邀请绑定aegisreferral)
3. [模块二：创世预售（AegisPreSale）](#3-模块二创世预售aegispresale)
4. [模块三：团队奖励领取（AegisPresaleRewardClaimer）](#4-模块三团队奖励领取aegispresalerewardclaimer)
5. [完整用户流程图](#5-完整用户流程图)
6. [ERC20 授权前置操作清单](#6-erc20-授权前置操作清单)


---


## 1. 通用说明


### 1.1 代币精度
| 代币 | 精度 | 说明 |
|------|------|------|
| AGX | 9 位 | 1 AGX = 1,000,000,000 (1e9) |
| USD1 | 18 位 | 稳定币，1 USD = 1e18 |


### 1.2 前置操作：ERC20 授权
所有涉及代币转入的操作，用户需要先对对应合约进行 `approve`。详见文末[授权清单](#6-erc20-授权前置操作清单)。


### 1.3 错误处理
所有合约使用自定义 error（如 `PreSalePaused()`、`Referral__AlreadyBound()` 等），前端需要解码 revert reason 来展示友好提示。


### 1.4 合约调用依赖链
```
Referral(邀请绑定) → PreSale(预售购买) → Reward(团队奖励领取)
```


---


## 2. 模块一：邀请绑定（AegisReferral）


> 用户在购买预售前 **必须先绑定推荐关系**。每个用户只有一个直接上级，形成单线推荐链。


### 2.1 用户操作：绑定推荐人


```solidity
function bindReferral(address _referral) external
```


| 参数 | 类型 | 说明 |
|------|------|------|
| `_referral` | address | 推荐人的钱包地址 |


**调用条件：**
- 用户尚未绑定（`isBindReferral(user) == false`）
- 不能自己推荐自己
- 推荐人必须已经绑定（或为根节点）
- 不能是已迁移的旧地址


**前端流程：**
1. 检查用户是否已绑定：调用 `isBindReferral(userAddress)`
2. 若未绑定，展示绑定推荐人界面，用户输入推荐人地址
3. 调用 `bindReferral(referrerAddress)`


### 2.2 查询接口


```solidity
// 查询用户是否已绑定
function isBindReferral(address _address) external view returns (bool)


// 查询用户的直接上级（推荐人）
function getReferral(address _address) external view returns (address)


// 查询用户的直推人数（下级数量）
function getReferralCount(address _address) external view returns (uint256)


// 查询用户的所有直推下级列表
function getChildren(address _address) external view returns (address[] memory)


// 查询指定索引的下级地址
function getChildAt(address _address, uint256 index) external view returns (address)


// 查询上游推荐链（前 N 级祖先）
function getReferrals(address _address, uint256 _num) external view returns (address[] memory)


// 查询推荐树根地址
function getRootAddress() external view returns (address)
```


### 2.3 事件


```solidity
event BindReferral(address indexed user, address indexed parent, uint256 timestamp)
```


### 2.4 自定义错误


| 错误 | 参数 | 触发场景 | 前端提示建议 |
|------|------|---------|-------------|
| `Referral__RootZero()` | — | 根地址为零 | 系统配置异常 |
| `Referral__UserZero()` | — | 用户地址为零 | 请输入有效地址 |
| `Referral__ParentZero()` | — | 推荐人地址为零 | 推荐人地址不能为空 |
| `Referral__SelfReferral()` | — | 自己推荐自己 | 不能填写自己的地址 |
| `Referral__AlreadyBound(address user)` | user | 用户已绑定过 | 您已绑定推荐人，无法重复绑定 |
| `Referral__ParentNotBound(address parent)` | parent | 推荐人尚未绑定 | 推荐人尚未完成绑定，请联系推荐人 |
| `Referral__MigratedAccount(address account)` | account | 地址已迁移（旧地址不可用） | 该地址已迁移，请使用新地址 |
| `Referral__NotMigrationManager(address caller)` | caller | 非管理员调用迁移 | 无权限操作 |


### 2.5 前端展示建议


| 场景 | 调用方法 | 展示内容 |
|------|---------|---------|
| 检查绑定状态 | `isBindReferral(user)` | 已绑定/未绑定 |
| 显示推荐人 | `getReferral(user)` | 上级地址 |
| 团队人数 | `getReferralCount(user)` | 直推人数 |
| 团队成员列表 | `getChildren(user)` | 下级地址列表 |
| 推荐链溯源 | `getReferrals(user, 50)` | 上游最多50级祖先 |


---


## 3. 模块二：创世预售（AegisPreSale）


> 用户以折扣价购买 AGX。**必须先绑定推荐关系**。AGX 仅记账，预售结束后统一分发。


### 3.1A 新增功能：预售空投价值记录与预估


> `新增` 预售每个档位支持配置“空投价值比例”，并在用户购买时自动累计空投价值记录。


**规则说明：**
- `新增` 每个档位新增字段 `airdropValueRatio`，单位为 bps，`1000 = 10%`
- `新增` 只有用户在**单个档位**内累计购买金额 **超过 5000U** 后，才会开始计算空投价值
- `新增` 一旦超过 5000U，按“**该档位整期累计购买金额 × 空投价值比例**”计算，不是只算超出部分
- `新增` 合约会记录：
  - 用户在某档位累计获得多少空投价值
  - 用户跨所有档位累计获得多少空投价值
  - 全网累计产生多少空投价值
- `新增` 前端可在用户下单前调用预估接口，查询“再买多少 U 会新增多少空投价值”


### 3.1B 新增功能：单账户每期购买累计限制


> `新增` 预售每个档位支持配置“单账户累计购买上限”，管理员可随时设置/修改，购买时自动校验。


**规则说明：**
- `新增` 每个档位新增字段 `userPurchaseLimit`，表示该档位单账户累计购买上限
- `新增` `userPurchaseLimit == 0` 表示**不限制**（向后兼容，已有档位默认无限制）
- `新增` 购买时校验：`用户该档位累计购买金额 + 本次购买金额 <= userPurchaseLimit`
- `新增` 校验使用用户原始地址（账户迁移后限额仍绑定在原地址）
- `新增` 管理员可通过 `setPhaseUserPurchaseLimit` 独立调整限额，无需重设整个档位
- `新增` 前端可在购买前调用查询接口，获取用户在该档位的剩余可购额度


### 3.1 资金分配（每笔购买）
| 去向 | 比例 | 说明 |
|------|------|------|
| 销售钱包 | 82% | 流动性与项目资金 |
| 团队奖 | 10% | 转入 Reward 合约，用户签名领取 |
| 系统奖 | 5% | 运营支出 |
| 推荐奖 | 3% | 直接发给有购买记录的上级 |


### 3.2 用户操作：购买


```solidity
function purchase(uint256 _phaseIndex, uint256 _amount) external
```


| 参数 | 类型 | 说明 |
|------|------|------|
| `_phaseIndex` | uint256 | 档位索引（从 0 开始） |
| `_amount` | uint256 | 购买金额（USD1，必须是 100 USD 的整数倍） |


**调用条件：**
- 合约未暂停（`paused == false`）
- 用户已绑定推荐关系
- `_amount` 是 `BASE_UNIT`（100e18 = 100 USD）的整数倍
- 当前档位在有效时间内且未售罄
- `新增` 用户该档位累计购买金额 + `_amount` 不超过单账户限额（`userPurchaseLimit > 0` 时校验）
- 用户需先 `approve` USD1 给 PreSale 合约


**前端流程：**
1. 检查 `paused()` 是否为 false
2. 检查 `isBindReferral(user)` 是否为 true（未绑定则引导去绑定）
3. 获取档位信息：调用 `phases(phaseIndex)` 或遍历所有档位
4. `新增` 读取该档位的 `airdropValueRatio`，如需展示空投权益，调用预估接口
5. `新增` 读取该档位的 `userPurchaseLimit`，如需展示限额信息，调用 `getUserPhaseRemainingAmount`
6. 计算用户可购买数量，展示折扣价
7. 用户输入金额（100 的整数倍），校验是否满足 `minAmount`、剩余量和单账户限额
8. `新增` 可先调用 `previewAirdropValue(user, phaseIndex, amount)`，展示本次购买预计新增多少空投价值
9. 先 `approve` USD1，再调用 `purchase`


### 3.3 查询接口


```solidity
// 获取档位总数
function getPhaseCount() external view returns (uint256)


// 获取某档位剩余可购金额
function getPhaseRemainingAmount(uint256 _phaseIndex) external view returns (uint256)


// 获取某档位详细信息（public 状态变量，直接读取）
function phases(uint256) external view returns (
    uint256 minAmount,    // 最低购买金额
    uint256 maxAmount,    // 最大售卖金额
    uint256 discount,     // 折扣（bps，3000 = 30%）
    uint256 airdropValueRatio, // 新增：空投价值比例（bps，1000 = 10%）
    uint256 startTime,    // 开始时间戳
    uint256 endTime,      // 结束时间戳
    uint256 soldAmount,   // 已售金额
    uint256 userPurchaseLimit // 新增：单账户累计购买上限（0 = 不限制）
)


// 新增：预估用户在某档位再购买指定金额后，可新增多少空投价值
function previewAirdropValue(address _user, uint256 _phaseIndex, uint256 _purchaseAmount)
    external
    view
    returns (
        uint256 addedAirdropValue,      // 本次新增空投价值
        uint256 phaseAirdropValueAfter, // 购买后该档位累计空投价值
        uint256 phaseAmountAfter,       // 购买后该档位累计购买金额
        bool qualifiedAfter             // 购买后是否已超过 5000U 门槛
    )


// 新增：按当前档位比例静态试算某累计购买金额对应的总空投价值
function quotePhaseAirdropValue(uint256 _phaseIndex, uint256 _phaseAmount)
    external
    view
    returns (uint256)


// 查询用户是否已购买过
function hasPurchased(address) external view returns (bool)


// 查询用户在某档的购买金额
function userPhaseAmount(address, uint256) external view returns (uint256)


// 新增：查询用户在某档位累计获得的空投价值
function userPhaseAirdropValue(address, uint256) external view returns (uint256)


// 查询用户总购买金额
function userTotalAmount(address) external view returns (uint256)


// 查询用户总应得 AGX 数量
function userTotalAgx(address) external view returns (uint256)


// 新增：查询用户累计获得的空投价值
function userTotalAirdropValue(address) external view returns (uint256)


// 查询用户累计获得的推荐奖励
function userTotalReferralReward(address) external view returns (uint256)


// 全局总购买金额
function totalPurchasedAmount() external view returns (uint256)


// 全局总分配 AGX
function totalAllocatedAgx() external view returns (uint256)


// 新增：全网累计空投价值
function totalAirdropValue() external view returns (uint256)


// 新增：查询指定用户在指定档位的剩余可购买金额
function getUserPhaseRemainingAmount(address _user, uint256 _phaseIndex)
    external
    view
    returns (
        uint256 remainingPhaseAmount,   // 该档位剩余可售卖金额
        uint256 remainingUserAmount,    // 该用户剩余可购买金额（0 表示不限制时无限）
        uint256 userPurchaseLimit,      // 该档位的单账户上限（0 = 不限制）
        uint256 userPhaseAmountCurrent  // 用户当前累计购买金额
    )


// AGX 单价（如 $65 = 65e18）
function agxPrice() external view returns (uint256)
```


### 3.4 AGX 数量计算


```
折扣价 = agxPrice × (10000 - discount) / 10000
AGX数量 = 购买金额 × 1e18 / 折扣价
```


**示例：** agxPrice = 65e18, discount = 3000 (30%)
- 折扣价 = 65 × 7000/10000 = 45.5 USD/AGX
- 购买 $1000 → 获得 1000/45.5 ≈ 21.978 AGX


### 3.4A 新增：空投价值计算规则


```text
若该用户在某档位累计购买金额 <= 5000U：
    空投价值 = 0


若该用户在某档位累计购买金额 > 5000U：
    空投价值 = 该档位累计购买金额 × airdropValueRatio / 10000
```


**示例 1：首次跨过门槛**
- 某档位 `airdropValueRatio = 1000 (10%)`
- 用户先买 `4900U`：空投价值 = `0`
- 再买 `200U`，累计 `5100U`
- `新增` 空投价值 = `5100 × 10% = 510U`


**示例 2：已达标后继续购买**
- 用户当前该档位累计 `5100U`，累计空投价值 `510U`
- 再买 `300U`，累计 `5400U`
- 新总空投价值 = `5400 × 10% = 540U`
- 本次新增空投价值 = `30U`


### 3.5 事件


```solidity
event Purchased(address indexed buyer, uint256 indexed phaseIndex, uint256 usdAmount, uint256 agxAmount, uint256 timestamp)
event ReferralRewardPaid(address indexed referrer, address indexed buyer, uint256 usdAmount, uint256 reward, uint256 timestamp)
event AirdropValueAccrued(address indexed buyer, uint256 indexed phaseIndex, uint256 purchaseAmount, uint256 addedValue, uint256 totalPhaseValue, uint256 timestamp)
// 新增：单账户购买限额更新事件
event PhaseUserPurchaseLimitUpdated(uint256 indexed phaseIndex, uint256 userPurchaseLimit)
```


### 3.6 自定义错误


| 错误 | 参数 | 触发场景 | 前端提示建议 |
|------|------|---------|-------------|
| `PreSalePaused()` | — | 合约已暂停 | 预售已暂停，请稍后再试 |
| `PreSaleUserNotBound()` | — | 用户未绑定推荐关系 | 请先绑定推荐人 |
| `PreSaleInvalidAmount()` | — | 金额为 0 或不是 100 的整数倍 | 购买金额必须是 100 USD 的整数倍 |
| `PreSalePhaseIndexOutOfBounds(uint256 phaseIndex, uint256 phaseCount)` | phaseIndex, phaseCount | 档位索引超出范围 | 无效的档位 |
| `PreSalePhaseNotActive(uint256 phaseIndex)` | phaseIndex | 档位不在有效时间内 | 当前档位未开始或已结束 |
| `PreSaleBelowMin(uint256 phaseIndex)` | phaseIndex | 购买金额低于档位最低限额 | 购买金额低于本档最低限额 |
| `PreSalePhaseSoldOut(uint256 phaseIndex)` | phaseIndex | 档位已售罄 | 当前档位已售罄 |
| `PreSaleZeroAddress()` | — | 管理员设置了零地址 | 系统配置异常 |
| `PreSaleInvalidDiscount(uint256 discount)` | discount | 折扣超过 10000 bps | 系统配置异常 |
| `PreSaleInvalidAirdropValueRatio(uint256 ratio)` | ratio | 空投价值比例超过 10000 bps | 系统配置异常 |
| `PreSaleInvalidAgxPrice(uint256 price)` | price | AGX 单价为 0 | 系统配置异常 |
| `PreSaleUserPurchaseLimitExceeded(uint256 phaseIndex, uint256 limit, uint256 currentAmount, uint256 attemptedAmount)` | phaseIndex, limit, currentAmount, attemptedAmount | `新增` 用户累计购买将超过单账户限额 | 本次购买将超过该档位单账户限额，请减少金额 |


### 3.7 推荐奖说明
- 购买后自动发放给上级（上级必须有购买记录 `hasPurchased == true`）
- 奖励 = min(上级购买额, 下级购买额) × 3%
- 若上级无购买记录，跳过，剩余奖励转入 `unclaimedReceiver`


### 3.8 新增：前端接入建议（空投价值）


| 场景 | 调用方法 | 前端展示内容 |
|------|---------|-------------|
| 展示档位空投比例 | `phases(phaseIndex)` | `airdropValueRatio` |
| 预估本次购买新增空投价值 | `previewAirdropValue(user, phaseIndex, amount)` | `addedAirdropValue` |
| 展示买完后该档位累计空投价值 | `previewAirdropValue(...)` | `phaseAirdropValueAfter` |
| 展示买完后该档位累计购买金额 | `previewAirdropValue(...)` | `phaseAmountAfter` |
| 展示是否已达到空投资格 | `previewAirdropValue(...)` | `qualifiedAfter` |
| 查询用户当前某档位累计空投价值 | `userPhaseAirdropValue(user, phaseIndex)` | 当前档位空投价值 |
| 查询用户累计空投价值 | `userTotalAirdropValue(user)` | 总空投价值 |
| 查询全网累计空投价值 | `totalAirdropValue()` | 全网总空投价值 |
| `新增` 查询用户某档位剩余可购额度 | `getUserPhaseRemainingAmount(user, phaseIndex)` | 剩余可购金额、当前累计、限额 |
| `新增` 展示档位单账户限额 | `phases(phaseIndex)` | `userPurchaseLimit` |


**前端展示建议：**
- `新增` 在预售购买弹窗中增加“预计新增空投价值”区域
- `新增` 在用户个人预售面板中增加“当前档位累计空投价值”与“总空投价值”
- `新增` 若 `qualifiedAfter == false`，可提示“单档累计购买超过 5000U 后开始计算空投价值”
- `新增` 在购买面板展示“该档位单账户限额”及“您剩余可购金额”
- `新增` 若 `userPurchaseLimit > 0`，购买输入框最大值应取 `min(档位剩余, 用户剩余额度)`


### 3.9 新增：前端调用示例代码（ethers.js）


#### 3.9.1 读取档位信息并展示空投比例


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();


const preSaleAddress = "0xYourPreSaleAddress";
const preSale = new ethers.Contract(preSaleAddress, preSaleAbi, signer);


const phaseIndex = 0n;
const phase = await preSale.phases(phaseIndex);


console.log("最低购买金额:", ethers.formatEther(phase.minAmount), "USD");
console.log("最大售卖金额:", ethers.formatEther(phase.maxAmount), "USD");
console.log("折扣(bps):", phase.discount.toString());
console.log("新增-空投价值比例(bps):", phase.airdropValueRatio.toString());
console.log("新增-空投价值比例(%):", Number(phase.airdropValueRatio) / 100, "%");
console.log("开始时间:", Number(phase.startTime));
console.log("结束时间:", Number(phase.endTime));
console.log("已售金额:", ethers.formatEther(phase.soldAmount), "USD");
console.log("新增-单账户累计购买上限:", ethers.formatEther(phase.userPurchaseLimit), "USD");
console.log("新增-单账户限额(%):", phase.userPurchaseLimit == 0n ? "不限制" : ethers.formatEther(phase.userPurchaseLimit));
```


#### 3.9.2 新增：购买前预估本次可新增多少空投价值


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();


const preSale = new ethers.Contract("0xYourPreSaleAddress", preSaleAbi, signer);


const phaseIndex = 0n;
const purchaseAmount = ethers.parseEther("200"); // 200 USD1


const preview = await preSale.previewAirdropValue(userAddress, phaseIndex, purchaseAmount);


const addedAirdropValue = preview[0];
const phaseAirdropValueAfter = preview[1];
const phaseAmountAfter = preview[2];
const qualifiedAfter = preview[3];


console.log("新增-本次新增空投价值:", ethers.formatEther(addedAirdropValue), "U");
console.log("新增-购买后该档位累计空投价值:", ethers.formatEther(phaseAirdropValueAfter), "U");
console.log("新增-购买后该档位累计购买金额:", ethers.formatEther(phaseAmountAfter), "U");
console.log("新增-购买后是否达标:", qualifiedAfter);
```


#### 3.9.3 新增：静态试算某累计购买金额对应的总空投价值


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();


const preSale = new ethers.Contract("0xYourPreSaleAddress", preSaleAbi, signer);


const phaseIndex = 0n;
const simulatedPhaseAmount = ethers.parseEther("5100");


const quotedAirdropValue = await preSale.quotePhaseAirdropValue(
  phaseIndex,
  simulatedPhaseAmount
);


console.log("新增-累计购买 5100U 对应空投价值:", ethers.formatEther(quotedAirdropValue), "U");
```


#### 3.9.4 新增：完整购买流程（含空投预估）


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";
import erc20Abi from "@/abi/ERC20.json";
import referralAbi from "@/abi/AegisReferral.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();


const preSaleAddress = "0xYourPreSaleAddress";
const referralAddress = "0xYourReferralAddress";
const usd1Address = "0xYourUsd1Address";


const preSale = new ethers.Contract(preSaleAddress, preSaleAbi, signer);
const referral = new ethers.Contract(referralAddress, referralAbi, signer);
const usd1 = new ethers.Contract(usd1Address, erc20Abi, signer);


const phaseIndex = 0n;
const purchaseAmount = ethers.parseEther("200"); // 必须是 100 的整数倍


// 1. 检查是否已绑定推荐人
const bound = await referral.isBindReferral(userAddress);
if (!bound) {
  throw new Error("请先绑定推荐人");
}


// 2. 检查预售是否暂停
const paused = await preSale.paused();
if (paused) {
  throw new Error("预售已暂停");
}


// 3. 购买前预估空投价值
const preview = await preSale.previewAirdropValue(userAddress, phaseIndex, purchaseAmount);
console.log("新增-本次预计新增空投价值:", ethers.formatEther(preview[0]), "U");


// 4. 授权 USD1 给 PreSale
const approveTx = await usd1.approve(preSaleAddress, purchaseAmount);
await approveTx.wait();


// 5. 执行购买
const purchaseTx = await preSale.purchase(phaseIndex, purchaseAmount);
const receipt = await purchaseTx.wait();


console.log("购买成功，交易哈希:", receipt.hash);
```


#### 3.9.5 新增：查询用户空投价值记录


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();


const preSale = new ethers.Contract("0xYourPreSaleAddress", preSaleAbi, signer);


const phaseIndex = 0n;


const userPhaseAmount = await preSale.userPhaseAmount(userAddress, phaseIndex);
const userPhaseAirdropValue = await preSale.userPhaseAirdropValue(userAddress, phaseIndex);
const userTotalAirdropValue = await preSale.userTotalAirdropValue(userAddress);
const totalAirdropValue = await preSale.totalAirdropValue();


console.log("当前档位累计购买金额:", ethers.formatEther(userPhaseAmount), "U");
console.log("新增-当前档位累计空投价值:", ethers.formatEther(userPhaseAirdropValue), "U");
console.log("新增-用户累计空投价值:", ethers.formatEther(userTotalAirdropValue), "U");
console.log("新增-全网累计空投价值:", ethers.formatEther(totalAirdropValue), "U");
```


#### 3.9.6 新增：查询用户在某档位的剩余可购买额度


```ts
import { ethers } from "ethers";
import preSaleAbi from "@/abi/AegisPreSale.json";


const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const userAddress = await signer.getAddress();


const preSale = new ethers.Contract("0xYourPreSaleAddress", preSaleAbi, signer);


const phaseIndex = 0n;


const remaining = await preSale.getUserPhaseRemainingAmount(userAddress, phaseIndex);


const remainingPhaseAmount = remaining[0];   // 该档位剩余可售卖金额
const remainingUserAmount = remaining[1];    // 该用户剩余可购买金额
const userPurchaseLimit = remaining[2];      // 该档位的单账户上限
const userPhaseAmountCurrent = remaining[3]; // 用户当前累计购买金额


console.log("新增-该档位剩余可售卖:", ethers.formatEther(remainingPhaseAmount), "USD");
console.log("新增-该用户剩余可购:", userPurchaseLimit === 0n ? "不限制" : ethers.formatEther(remainingUserAmount) + " USD");
console.log("新增-单账户限额:", ethers.formatEther(userPurchaseLimit), "USD");
console.log("新增-当前累计购买:", ethers.formatEther(userPhaseAmountCurrent), "USD");
```


---


## 4. 模块三：团队奖励领取（AegisPresaleRewardClaimer）


> 预售购买时 10% 团队奖自动转入本合约，用户需要**后端签名**才能领取。


### 4.1 用户操作：签名领奖


```solidity
function claimReward(
    uint256 _signType,
    uint256 _amount,
    uint256 _expireTime,
    bytes32 _salt,
    bytes calldata _signature
) external
```


| 参数 | 类型 | 说明 |
|------|------|------|
| `_signType` | uint256 | 签名类型（业务标识） |
| `_amount` | uint256 | 领取金额（USD1 精度 18 位） |
| `_expireTime` | uint256 | 签名过期时间戳 |
| `_salt` | bytes32 | 防重放随机数 |
| `_signature` | bytes | 签名者签发的签名 |


**签名生成规则（后端/链下计算）：**
```
msgHash = keccak256(abi.encodePacked(合约地址, _salt, 用户地址, _amount, _expireTime, _signType))
signature = eth_sign(msgHash, rewardSigner私钥)
```


**调用条件：**
- 签名未被使用过（双重防重放：`rewardSignUse[signature]` + `signatureSalts[salt]`）
- 领取金额 > 0
- 签名未过期（`_expireTime > block.timestamp`）
- 签名验证通过（签名者 == `rewardSigner`）


**前端流程：**
1. 前端向后端请求签名数据（包含 _signType, _amount, _expireTime, _salt, _signature）
2. 检查 `_expireTime` 是否过期
3. 调用 `claimReward` 领取 USD1 到用户钱包


### 4.2 查询接口


```solidity
// 查询签名是否已使用
function useSalt(bytes32 _salt) external view returns (bool)


// 查询签名者地址
function rewardSigner() external view returns (address)


// 查询 USD 地址
function usd() external view returns (address)
```


### 4.3 事件


```solidity
event Claimed(address indexed user, uint256 amount, bytes32 salt, uint256 timestamp)
```


### 4.4 自定义错误


| 错误 | 参数 | 触发场景 | 前端提示建议 |
|------|------|---------|-------------|
| `ErrorZeroAddress()` | — | 零地址 | 系统配置异常 |
| `ErrorZeroAmount()` | — | 领取金额为 0 | 领取金额不能为 0 |
| `ErrorInvalidSigner()` | — | 签名验证失败 | 签名无效，请联系后端重新获取 |
| `ErrorAlreadyUsed()` | — | 签名或 salt 已使用 | 该奖励已领取，请勿重复操作 |
| `ErrorSignatureExpired()` | — | 签名已过期 | 签名已过期，请重新获取 |


---


## 5. 完整用户流程图


```
┌─────────────────────────────────────────────────────────────────┐
│                      预售业务完整流程                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ① 邀请绑定推荐关系                                              │
│     Referral.bindReferral(推荐人地址)                             │
│          │                                                      │
│          ▼                                                      │
│  ② 预售购买                                                     │
│     USD1.approve(PreSale, 金额)                                 │
│     PreSale.purchase(档位索引, 金额)                              │
│          │                                                      │
│          ├── 82% → 销售钱包                                      │
│          ├── 10% → Reward 合约（团队奖，签名领取）                  │
│          ├── 5%  → 系统钱包                                      │
│          └── 3%  → 推荐奖（自动发给有购买的上级）                   │
│                                                                 │
│  ③ 领取团队奖励                                                  │
│     后端提供签名 → Reward.claimReward(...)                        │
│          │                                                      │
│          ▼                                                      │
│     USD1 到用户钱包                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```


---


## 6. ERC20 授权前置操作清单


| 操作 | 授权代币 | 授权目标合约 | 说明 |
|------|---------|-------------|------|
| 预售购买 | USD1 | AegisPreSale | 每次购买前需确保额度足够 |


> **注意：** 绑定推荐人和领取团队奖励不需要 ERC20 授权。


---


## 附录：关键常量


| 常量 | 值 | 来源合约 |
|------|-----|---------|
| BASE_UNIT | 100e18 (100 USD) | PreSale |
| AIRDROP_THRESHOLD | 5000e18 (5000 USD) | PreSale |
| 销售分配 | 82% | PreSale |
| 团队奖分配 | 10% | PreSale |
| 系统奖分配 | 5% | PreSale |
| 推荐奖分配 | 3% | PreSale |
| 推荐奖比例 | 3% (300 bps) | PreSale |
| AGX 精度 | 9 位 | AGX |
| USD1 精度 | 18 位 | USD1 |



