import { getAddress } from 'thirdweb/utils'
import type { Wallet } from 'thirdweb/wallets'
import {
  type Abi,
  type Address,
  encodeFunctionData,
  type Hash,
  numberToHex,
  parseAbi,
  type TransactionReceipt,
} from 'viem'

import { bscReadClient, createWalletReadClient } from '~/web3/bsc-read-client'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { WALLET_WRITE_ERROR } from '~/web3/contract-error-message'
import {
  decodeContractRevert,
  isContractRevert,
  normalizeContractRevertError,
} from '~/web3/decode-contract-revert'
import { WALLET_BLOCKED } from '~/web3/errors/sentinels'
import { defaultChain } from '~/web3/thirdweb'
import {
  assertWriteIntentMatches,
  createWriteIntent,
  type WriteIntent,
} from '~/web3/wallet/assert-write-intent'
import { waitForWalletTransactionConfirmation } from '~/web3/wallet/wait-wallet-transaction'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'
import { walletProviderRequest } from '~/web3/wallet/wallet-provider-request'
import { assertWalletTransactionHash } from '~/web3/wallet/wallet-write-error'

export type ConfirmedWalletWrite = TransactionReceipt

/** +20% 余量：估算与出块之间轻微的链上状态漂移仍能成功。仅展示用 gas。 */
const GAS_BUFFER_NUMERATOR = 120n
const GAS_BUFFER_DENOMINATOR = 100n

function requireWalletAccount(wallet: Wallet) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  return account
}

function assertWalletMatchesIntent(wallet: Wallet, intent: WriteIntent) {
  const live = requireWalletAccount(wallet)
  assertWriteIntentMatches({
    intent,
    liveAddress: live.address,
    liveChainId: wallet.getChain()?.id,
  })
}

export type WriteCallParams = {
  account: Address
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}

type WalletWriteCallInput = {
  wallet: Wallet
  address: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  value?: bigint
}

function writeCallParams(input: WalletWriteCallInput): WriteCallParams {
  const account = requireWalletAccount(input.wallet)
  return {
    account: getAddress(account.address) as Address,
    address: input.address,
    abi: input.abi,
    functionName: input.functionName,
    args: input.args,
    value: input.value,
  }
}

/**
 * 给估算 gas 加 20% 缓冲
 *
 * 估算为 0 或负数视为估算失败，抛 GAS_ESTIMATE_FAILED。
 *
 * @param estimatedGas 估算结果
 * @returns 加缓冲后的 gas 上限
 */
export function applyGasBuffer(estimatedGas: bigint): bigint {
  if (estimatedGas <= 0n) {
    throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
  }
  return (estimatedGas * GAS_BUFFER_NUMERATOR) / GAS_BUFFER_DENOMINATOR
}

/**
 * 模拟写调用：合约 revert 在钱包弹窗前抛出。
 * 非 revert（RPC 超时等）不挡发送，交给钱包。
 */
async function simulateWriteCall(call: WriteCallParams, walletClient: ChainReadClient) {
  const callRequest = call as never
  try {
    await walletClient.simulateContract(callRequest)
  } catch (error) {
    if (isContractRevert(error)) {
      throw normalizeContractRevertError(error, call.abi)
    }
    if (import.meta.env.DEV) {
      const decoded = decodeContractRevert(error, call.abi)
      console.warn('[preflight] simulate skipped (non-revert):', decoded?.errorName ?? error)
    }
  }
}

/**
 * 估算写交易 gas（展示用，不进入发送）
 *
 * 先 simulate 挡 revert，再 `estimateContractGas` 加 20% 缓冲。
 * simulate 因非 revert 失败时，再试默认读客户端估算。
 *
 * @param call 写调用参数
 * @param walletClient 钱包读客户端
 * @param fallbackClient 回退读客户端，默认 `bscReadClient`
 * @returns 加缓冲后的 gas 上限
 */
export async function estimateWriteGasLimit(
  call: WriteCallParams,
  walletClient: ChainReadClient,
  fallbackClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  const callRequest = call as never
  await simulateWriteCall(call, walletClient)

  for (const client of [walletClient, fallbackClient]) {
    try {
      return applyGasBuffer(await client.estimateContractGas(callRequest))
    } catch (error) {
      if (isContractRevert(error)) {
        throw normalizeContractRevertError(error, call.abi)
      }
    }
  }

  throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
}

/**
 * 通过钱包提交合约写交易
 *
 * 核对会话地址/链 → simulate 挡 revert → 再核一次 → `eth_sendTransaction`（不设 gas、不设墙钟）→
 * `waitForTransactionReceipt({ timeout: 0 })`。
 * 授权与业务写各 send 各 wait；gas 由钱包估算。
 *
 * @param input 钱包与写调用参数
 * @returns 确认收据（含交易 hash）
 */
export async function writeContractViaWallet(
  input: WalletWriteCallInput,
): Promise<ConfirmedWalletWrite> {
  const { wallet, address, abi, functionName, args, value } = input
  const account = requireWalletAccount(wallet)
  const intent = createWriteIntent(account.address, defaultChain.id)
  assertWalletMatchesIntent(wallet, intent)

  await simulateWriteCall(writeCallParams(input), createWalletReadClient(wallet))
  assertWalletMatchesIntent(wallet, intent)

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  } as Parameters<typeof encodeFunctionData>[0])

  const hash = await walletProviderRequest<Hash>({
    provider: walletEip1193Provider(wallet),
    method: 'eth_sendTransaction',
    params: [
      {
        chainId: numberToHex(defaultChain.id),
        data,
        from: intent.expectedAddress,
        to: address,
        ...(value ? { value: numberToHex(value) } : {}),
      },
    ],
  })

  assertWalletTransactionHash(hash)
  return waitForWalletTransactionConfirmation({ hash })
}

/** 解析写 ABI 签名，并附加 `~/web3/abis` 提供的自定义错误定义。 */
export function parseWriteAbi(signature: string, errors: readonly string[] = []) {
  return parseAbi(errors.length > 0 ? [signature, ...errors] : [signature])
}
