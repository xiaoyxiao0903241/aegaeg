import {
  type Abi,
  BaseError,
  ContractFunctionRevertedError,
  decodeErrorResult,
  parseAbi,
} from 'viem'

import {
  AGX_CONTRIBUTION_SWAP_ERRORS,
  BOND_DEPOSITORY_ERRORS,
  BOND_HELPER_ERRORS,
  ERC20_ERRORS,
  LIQUID_STAKING_ERRORS,
  LOCKED_STAKING_ERRORS,
  LUCKY_POOL_ERRORS,
  PRESALE_ERRORS,
  PRINCIPAL_RELEASE_VAULT_ERRORS,
  REDEEMABLE_GAGX_ERRORS,
  REFERRAL_ERRORS,
  REWARD_CLAIMER_ERRORS,
  REWARD_QUEUE_ERRORS,
  TURBINE_ERRORS,
  USD1_SWAP_ERRORS,
  X_STAKING_POOL_ERRORS,
} from '~/web3/abis'
import { walkErrorTree } from '~/web3/errors/error-tree'

export interface DecodedContractRevert {
  errorName: string
  args?: readonly unknown[]
}

/** 去掉签名文本相同的重复错误 ABI 行。 */
function uniqueErrorAbiLines(lines: readonly string[]): string[] {
  return [...new Set(lines)]
}

/**
 * 合并全部合约的自定义错误 ABI
 *
 * 当调用方合约未知时，用这份联合 ABI 解码 revert 数据。
 * 错误表取自手册的合约错误表（写路径 + 闪电 / 销毁 / 预售）。
 *
 * @see 手册 §19 常见错误与前端提示
 */
export const ALL_CONTRACT_ERRORS_ABI = parseAbi(
  uniqueErrorAbiLines([
    ...ERC20_ERRORS,
    ...PRESALE_ERRORS,
    ...REFERRAL_ERRORS,
    ...REWARD_CLAIMER_ERRORS,
    ...USD1_SWAP_ERRORS,
    ...AGX_CONTRIBUTION_SWAP_ERRORS,
    ...TURBINE_ERRORS,
    ...REDEEMABLE_GAGX_ERRORS,
    ...LIQUID_STAKING_ERRORS,
    ...LOCKED_STAKING_ERRORS,
    ...BOND_HELPER_ERRORS,
    ...BOND_DEPOSITORY_ERRORS,
    ...X_STAKING_POOL_ERRORS,
    ...REWARD_QUEUE_ERRORS,
    ...PRINCIPAL_RELEASE_VAULT_ERRORS,
    ...LUCKY_POOL_ERRORS,
  ]),
)

export class ContractRevertError extends Error {
  readonly errorName: string
  readonly args?: readonly unknown[]
  readonly revertData: `0x${string}`

  constructor(decoded: DecodedContractRevert, revertData: `0x${string}`, cause?: unknown) {
    super(decoded.errorName)
    this.name = 'ContractRevertError'
    this.errorName = decoded.errorName
    this.args = decoded.args
    this.revertData = revertData
    this.cause = cause
  }
}

function isRevertHex(value: string): value is `0x${string}` {
  return value.startsWith('0x') && value.length >= 10
}

/** 在钱包 / viem 错误树中查找第一段 revert 载荷十六进制；找不到返回 null。 */
export function extractRevertData(error: unknown): `0x${string}` | null {
  if (error instanceof BaseError) {
    const reverted = error.walk((entry) => entry instanceof ContractFunctionRevertedError)
    if (reverted instanceof ContractFunctionRevertedError) {
      if (reverted.raw && isRevertHex(reverted.raw)) return reverted.raw
      if (reverted.signature && isRevertHex(reverted.signature)) return reverted.signature
    }
  }

  let found: `0x${string}` | null = null
  walkErrorTree(error, (node) => {
    if (node instanceof ContractFunctionRevertedError) {
      if (node.raw && isRevertHex(node.raw)) {
        found = node.raw
        return true
      }
      if (node.signature && isRevertHex(node.signature)) {
        found = node.signature
        return true
      }
    }

    if (typeof node === 'string') {
      const match = node.match(/0x[a-fA-F0-9]{8,}/)
      if (match && isRevertHex(match[0])) {
        found = match[0]
        return true
      }
      return
    }

    if (typeof node === 'object' && node !== null) {
      const data = (node as Record<string, unknown>).data
      if (typeof data === 'string' && isRevertHex(data)) {
        found = data
        return true
      }
    }
  })

  return found
}

export function decodeContractRevert(
  error: unknown,
  abi: Abi = ALL_CONTRACT_ERRORS_ABI,
): DecodedContractRevert | null {
  if (error instanceof ContractFunctionRevertedError && error.data?.errorName) {
    return { errorName: error.data.errorName, args: error.data.args }
  }

  if (error instanceof BaseError) {
    const reverted = error.walk((entry) => entry instanceof ContractFunctionRevertedError)
    if (reverted instanceof ContractFunctionRevertedError && reverted.data?.errorName) {
      return { errorName: reverted.data.errorName, args: reverted.data.args }
    }
  }

  const revertData = extractRevertData(error)
  if (!revertData) return null

  try {
    const decoded = decodeErrorResult({ abi, data: revertData })
    return { errorName: decoded.errorName, args: decoded.args }
  } catch {
    return null
  }
}

export function isContractRevert(error: unknown): boolean {
  if (error instanceof ContractRevertError) return true
  if (error instanceof ContractFunctionRevertedError) return true
  if (error instanceof BaseError && error.walk((e) => e instanceof ContractFunctionRevertedError)) {
    return true
  }
  return extractRevertData(error) !== null
}

/** 把 revert 归一化为 ContractRevertError，让 UI 解析看到稳定的错误名。 */
export function normalizeContractRevertError(error: unknown, abi?: Abi): ContractRevertError {
  const revertData = extractRevertData(error) ?? '0x'
  const decoded =
    decodeContractRevert(error, abi) ??
    ({ errorName: 'ContractFunctionReverted' } satisfies DecodedContractRevert)

  return new ContractRevertError(decoded, revertData, error)
}
