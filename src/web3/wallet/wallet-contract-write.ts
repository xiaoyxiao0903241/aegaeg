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

import { bscReadClient } from '~/web3/bsc-read-client'
import { type ChainReadClient, createWalletReadClient } from '~/web3/chain-read-client'
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
  parseEip1193ChainId,
} from '~/web3/wallet/assert-write-intent'
import { notifyWriteHash } from '~/web3/wallet/unknown-receipt-lock'
import { waitForWalletTransactionConfirmation } from '~/web3/wallet/wait-wallet-transaction'
import { walletEip1193Provider } from '~/web3/wallet/wallet-eip1193-provider'
import { walletProviderRequest } from '~/web3/wallet/wallet-provider-request'
import { WalletSubmitUnknownError } from '~/web3/wallet/wallet-submit-unknown-error'
import { assertWalletTransactionHash } from '~/web3/wallet/wallet-write-error'

export type ConfirmedWalletWrite = TransactionReceipt & { transactionHash: Hash }

/** +20% 余量：估算与出块之间轻微的链上状态漂移仍能成功。 */
const GAS_BUFFER_NUMERATOR = 120n
const GAS_BUFFER_DENOMINATOR = 100n

function requireWalletAccount(wallet: Wallet) {
  const account = wallet.getAccount()
  if (!account) {
    throw WALLET_BLOCKED.NOT_CONNECTED
  }
  return account
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
 * 估算写交易 gas
 *
 * 先 simulate 取 gas 并加缓冲；simulate 因非 revert 原因失败时，
 * 依次回退到钱包读客户端与公共 RPC 的 `estimateContractGas`。
 * revert 会在钱包弹窗前暴露。导出供单测注入客户端。
 *
 * @param call 写调用参数
 * @param walletClient 钱包读客户端
 * @param fallbackClient 回退读客户端，默认公共 RPC
 * @returns 加缓冲后的 gas 上限
 */
export async function estimateWriteGasLimit(
  call: WriteCallParams,
  walletClient: ChainReadClient,
  fallbackClient: ChainReadClient = bscReadClient,
): Promise<bigint> {
  // viem 的 simulate/estimate 重载需要具体 ABI 函数名；
  // 动态写路径在此刻意擦除类型（与 thirdweb 适配器同一模式）
  const callRequest = call as never

  try {
    const { request } = await walletClient.simulateContract(callRequest)
    if (request.gas && request.gas > 0n) {
      return applyGasBuffer(request.gas)
    }
  } catch (error) {
    if (isContractRevert(error)) {
      throw normalizeContractRevertError(error, call.abi)
    }

    if (import.meta.env.DEV) {
      const decoded = decodeContractRevert(error, call.abi)
      console.warn('[preflight] simulate skipped (non-revert):', decoded?.errorName ?? error)
    }
  }

  for (const client of [walletClient, fallbackClient]) {
    try {
      const estimated = await client.estimateContractGas(callRequest)
      return applyGasBuffer(estimated)
    } catch (error) {
      if (isContractRevert(error)) {
        throw normalizeContractRevertError(error, call.abi)
      }
    }
  }

  throw new Error(WALLET_WRITE_ERROR.GAS_ESTIMATE_FAILED)
}

async function preflightContractWrite(input: WalletWriteCallInput): Promise<bigint> {
  const call = writeCallParams(input)
  const walletClient = createWalletReadClient(input.wallet)
  return estimateWriteGasLimit(call, walletClient)
}

/**
 * 通过钱包提交合约写交易
 *
 * simulate 估 gas（加缓冲）→ 核对写意图 → `eth_sendTransaction` 提交 →
 * 公共 RPC `waitForTransactionReceipt` 等到收据。revert 在钱包弹窗前暴露；
 * gas 显式传入，钱包无需再估算。
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
  const provider = walletEip1193Provider(wallet)

  const gasLimit = await preflightContractWrite(input)

  const liveAccount = requireWalletAccount(wallet)
  const chainIdHex = await walletProviderRequest<string>({
    provider,
    method: 'eth_chainId',
  })
  assertWriteIntentMatches({
    intent,
    liveAddress: liveAccount.address,
    liveChainId: parseEip1193ChainId(chainIdHex),
  })

  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  } as Parameters<typeof encodeFunctionData>[0])

  let hash: Hash
  try {
    hash = await walletProviderRequest<Hash>({
      provider,
      method: 'eth_sendTransaction',
      params: [
        {
          chainId: numberToHex(defaultChain.id),
          data,
          from: intent.expectedAddress,
          gas: numberToHex(gasLimit),
          to: address,
          ...(value ? { value: numberToHex(value) } : {}),
        },
      ],
      timeoutMessage: 'Wallet closed or did not complete the transaction request',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/did not (respond|complete)|timed out|timeout/i.test(message)) {
      throw new WalletSubmitUnknownError(WALLET_WRITE_ERROR.SUBMIT_UNKNOWN)
    }
    throw error
  }

  assertWalletTransactionHash(hash)
  notifyWriteHash(hash)

  const receipt = await waitForWalletTransactionConfirmation({ hash })
  return { ...receipt, transactionHash: hash }
}

/** 解析写 ABI 签名，并附加 `~/web3/abis` 提供的自定义错误定义。 */
export function parseWriteAbi(signature: string, errors: readonly string[] = []) {
  return parseAbi(errors.length > 0 ? [signature, ...errors] : [signature])
}
