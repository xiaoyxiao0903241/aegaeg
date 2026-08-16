import { getAddress } from 'thirdweb/utils'
import type { Address } from 'viem'

import { WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'
import { defaultChain } from '~/web3/thirdweb'

/** 写意图：在预检 / 钱包弹窗前固化地址与链 id，写时对照防止漂移。 */
export type WriteIntent = {
  expectedAddress: Address
  expectedChainId: number
}

/**
 * 固化写意图
 *
 * 把当前地址与链 id 记入 intent；写交易前再次核对，
 * 防止用户在弹窗期间切换账户或链。
 *
 * @param address 发起写时的钱包地址
 * @param chainId 期望链 id，默认应用链
 * @returns 不可变写意图
 */
export function createWriteIntent(address: string, chainId = defaultChain.id): WriteIntent {
  return {
    expectedAddress: getAddress(address) as Address,
    expectedChainId: chainId,
  }
}

/**
 * 写前核对意图与实时钱包状态
 *
 * 在 `eth_sendTransaction` 前核对：地址缺失、地址不一致或链不符时
 * 抛对应错误码，防止用户切换账户 / 链后把交易发到错误目标。
 *
 * @param intent 固化时的写意图
 * @param liveAddress 实时的钱包地址
 * @param liveChainId 实时的链 id
 */
export function assertWriteIntentMatches({
  intent,
  liveAddress,
  liveChainId,
}: {
  intent: WriteIntent
  liveAddress: string | undefined | null
  liveChainId: number | undefined | null
}): void {
  if (!liveAddress) {
    throw new Error(WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH)
  }
  const normalizedLive = getAddress(liveAddress)
  if (normalizedLive.toLowerCase() !== intent.expectedAddress.toLowerCase()) {
    throw new Error(WALLET_WRITE_ERROR.INTENT_ADDRESS_MISMATCH)
  }
  if (liveChainId == null || liveChainId !== intent.expectedChainId) {
    throw new Error(WALLET_WRITE_ERROR.WRONG_CHAIN)
  }
}

/**
 * 解析 EIP-1193 十六进制链 id
 *
 * 解析失败即抛 WRONG_CHAIN——链 id 不可信时拒绝继续写交易。
 *
 * @param chainIdHex 钱包返回的十六进制链 id
 * @returns 十进制链 id
 */
export function parseEip1193ChainId(chainIdHex: string): number {
  const parsed = Number.parseInt(chainIdHex, 16)
  if (!Number.isFinite(parsed)) {
    throw new Error(WALLET_WRITE_ERROR.WRONG_CHAIN)
  }
  return parsed
}
