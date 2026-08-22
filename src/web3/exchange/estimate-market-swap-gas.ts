import { getAddress } from 'thirdweb/utils'
import type { Address } from 'viem'

import { requiresFeeOnTransferSwap } from '~/core/exchange/fee-on-transfer-swap'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { bscReadClient } from '~/web3/bsc-read-client'
import { ContractRevertError, decodeContractRevert } from '~/web3/decode-contract-revert'
import { readErrorText } from '~/web3/errors/error-text'
import { marketSwapWriteCall } from '~/web3/exchange/market-swap-write-call'
import { applyGasBuffer, estimateWriteGasLimit } from '~/web3/wallet/wallet-contract-write'

/** Pancake V2 一跳兑换常见 estimateGas 量级（未加 20% 缓冲）。 */
const TYPICAL_SWAP_GAS_PER_HOP = 150_000n
/** SupportingFeeOnTransfer 比普通 swap 多一轮转账。 */
const TYPICAL_SWAP_GAS_FEE_ON_TRANSFER_EXTRA = 40_000n

const ALLOWANCE_OR_BALANCE_REVERT =
  /ERC20Insufficient(Allowance|Balance)|insufficient (allowance|balance)|transfer amount exceeds (allowance|balance)|TRANSFER_FROM_FAILED|TRANSFER_FAILED|0xfb8f41b2|0xe450d38c/i

/**
 * 路径级典型 gas 上限（未加缓冲）。
 *
 * 本仓按笔精确授权，未授权时用户态 simulate 会 revert；展示用费用不能因此变 `—`。
 *
 * @param path 与报价相同的兑换路径
 * @returns 未加 20% 缓冲的典型 gas
 */
export function typicalMarketSwapGasLimit(path: readonly `0x${string}`[]): bigint {
  const hops = path.length - 1
  if (hops < 1) {
    throw new Error(`EXCHANGE_PATH_TOO_SHORT:${path.length}`)
  }
  const tokenIn = path[0]
  if (tokenIn === undefined) {
    throw new Error('EXCHANGE_PATH_TOO_SHORT:0')
  }
  const feeOnTransfer = requiresFeeOnTransferSwap(tokenIn, {
    agx: BSC_CONTRACTS.agx,
    x: BSC_CONTRACTS.xToken,
  })
  return (
    BigInt(hops) * TYPICAL_SWAP_GAS_PER_HOP +
    (feeOnTransfer ? TYPICAL_SWAP_GAS_FEE_ON_TRANSFER_EXTRA : 0n)
  )
}

/**
 * 未授权 / 余额不足导致的兑换 simulate revert。
 *
 * 精确授权下这是展示估算的常态，不是滑点或流动性失败。
 *
 * @param error simulate / estimateGas 抛出的错误
 */
export function isAllowanceOrBalanceSwapRevert(error: unknown): boolean {
  const name =
    error instanceof ContractRevertError
      ? error.errorName
      : (decodeContractRevert(error)?.errorName ?? '')
  if (name === 'ERC20InsufficientAllowance' || name === 'ERC20InsufficientBalance') {
    return true
  }
  return ALLOWANCE_OR_BALANCE_REVERT.test(readErrorText(error))
}

/**
 * 估算市价兑换的网络费用（BNB wei）。
 *
 * 已授权时用与提交相同的 Router 调用做 simulate / estimateGas。
 * 未授权或 simulate 因授权/余额 revert 时，改用路径典型 gas × 当前 gasPrice
 * （估的是兑换本身，不含 approve；提交仍先精确授权再估真交易）。
 * RPC / 滑点等真失败返回 `null`，不抛错，避免报价整笔失败。
 *
 * @param account 钱包地址（from / 收款人）
 * @param amountIn 卖出数量
 * @param path 兑换路径，须与报价一致
 * @param amountOutMin 滑点下限
 * @param allowance 当前 Router 授权；低于 amountIn 时跳过用户态 simulate
 * @returns 预估花费的 BNB wei；失败为 `null`
 */
export async function estimateMarketSwapGasWei({
  account,
  amountIn,
  path,
  amountOutMin,
  allowance,
}: {
  account: `0x${string}`
  amountIn: bigint
  path: readonly `0x${string}`[]
  amountOutMin: bigint
  allowance?: bigint
}): Promise<bigint | null> {
  try {
    const write = marketSwapWriteCall({
      amountIn,
      path,
      amountOutMin,
      recipient: account,
    })
    let gasLimit: bigint
    if (allowance != null && allowance < amountIn) {
      gasLimit = applyGasBuffer(typicalMarketSwapGasLimit(path))
    } else {
      try {
        gasLimit = await estimateWriteGasLimit({
          account: getAddress(account) as Address,
          address: write.address,
          abi: write.abi,
          functionName: write.functionName,
          args: write.args,
        })
      } catch (error) {
        if (!isAllowanceOrBalanceSwapRevert(error)) return null
        gasLimit = applyGasBuffer(typicalMarketSwapGasLimit(path))
      }
    }
    const gasPrice = await bscReadClient.getGasPrice()
    if (gasPrice <= 0n) return null
    return gasLimit * gasPrice
  } catch {
    return null
  }
}
