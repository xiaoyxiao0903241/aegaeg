import {
  BaseError,
  ContractFunctionRevertedError,
  decodeErrorResult,
  parseAbi,
  type Abi,
} from 'viem'
import {
  ERC20_ERRORS,
  PRESALE_ERRORS,
  REFERRAL_ERRORS,
  REWARD_CLAIMER_ERRORS,
} from '~/views/dapp/web3/abis'

export interface DecodedContractRevert {
  errorName: string
  args?: readonly unknown[]
}

/** Union ABI for decoding revert data when the calling contract is unknown. */
export const ALL_CONTRACT_ERRORS_ABI = parseAbi([
  ...ERC20_ERRORS,
  ...PRESALE_ERRORS,
  ...REFERRAL_ERRORS,
  ...REWARD_CLAIMER_ERRORS,
])

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

/** Walk wallet / viem error trees and find the first revert payload hex. */
export function extractRevertData(error: unknown, depth = 0, seen = new WeakSet<object>()): `0x${string}` | null {
  if (depth > 10 || error == null) return null

  if (error instanceof ContractFunctionRevertedError) {
    if (error.raw && isRevertHex(error.raw)) return error.raw
    if (error.signature && isRevertHex(error.signature)) return error.signature
  }

  if (error instanceof BaseError) {
    const reverted = error.walk((entry) => entry instanceof ContractFunctionRevertedError)
    if (reverted instanceof ContractFunctionRevertedError) {
      return extractRevertData(reverted, depth + 1, seen)
    }
  }

  if (typeof error === 'string') {
    const match = error.match(/0x[a-fA-F0-9]{8,}/)
    return match && isRevertHex(match[0]) ? match[0] : null
  }

  if (typeof error !== 'object') return null
  if (seen.has(error)) return null
  seen.add(error)

  const record = error as Record<string, unknown>

  if (typeof record.data === 'string' && isRevertHex(record.data)) {
    return record.data
  }

  if (typeof record.data === 'object' && record.data !== null) {
    const nested = extractRevertData(record.data, depth + 1, seen)
    if (nested) return nested
  }

  for (const key of ['cause', 'error', 'originalError']) {
    if (key in record) {
      const nested = extractRevertData(record[key], depth + 1, seen)
      if (nested) return nested
    }
  }

  return null
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

/** Normalize a revert into ContractRevertError so UI parsers see a stable error name. */
export function normalizeContractRevertError(error: unknown, abi?: Abi): ContractRevertError {
  const revertData = extractRevertData(error) ?? '0x'
  const decoded =
    decodeContractRevert(error, abi) ??
    ({ errorName: 'ContractFunctionReverted' } satisfies DecodedContractRevert)

  return new ContractRevertError(decoded, revertData, error)
}
