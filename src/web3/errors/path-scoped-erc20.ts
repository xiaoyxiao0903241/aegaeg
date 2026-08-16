import type { AppMessagesBundle } from '~/i18n/messages/app/types'
import { decodeContractRevert } from '~/web3/decode-contract-revert'
import { WRITE_PATH, type WritePath } from '~/web3/wallet/unknown-receipt-lock'

/** 可选写路径 / 钱包上下文，用于共享 revert 消歧。 */
export type ErrorMessageContext = {
  path?: WritePath
  walletAddress?: string
}

type BalanceSide = 'wallet' | 'contract'

/** 无 account 参数时可按写路径推断默认侧（付币 vs 发币）。 */
function defaultBalanceSide(path: WritePath | undefined): BalanceSide {
  switch (path) {
    case WRITE_PATH.ASSETS_CLAIM:
    case WRITE_PATH.RELEASE_CLAIM:
    case WRITE_PATH.REWARD_CLAIM:
    case WRITE_PATH.REWARD_LUCKY_MIXED:
    case WRITE_PATH.REWARD_DAO_MIXED:
    case WRITE_PATH.REWARD_SIGNED_CLAIM:
      return 'contract'
    default:
      return 'wallet'
  }
}

/** 从 ERC20InsufficientBalance 解码出缺余额的 address。 */
function readErc20InsufficientAccount(error: unknown): string | null {
  const decoded = decodeContractRevert(error)
  if (decoded?.errorName !== 'ERC20InsufficientBalance') return null
  const account = decoded.args?.[0]
  return typeof account === 'string' ? account.toLowerCase() : null
}

function walletBalanceMessage(t: AppMessagesBundle, path: WritePath | undefined): string {
  switch (path) {
    case WRITE_PATH.GENESIS:
      return t.genesis.insufficientUsd1
    case WRITE_PATH.STAKING:
      return t.errors.chain.reverts.walletAgxInsufficient
    case WRITE_PATH.BOND_ZAP:
      return t.errors.chain.reverts.walletUsd1Insufficient
    case WRITE_PATH.XMINE:
      return t.errors.chain.reverts.walletGagxInsufficient
    case WRITE_PATH.EXCHANGE:
      return t.errors.chain.reverts.walletTokenInsufficient
    default:
      return t.errors.chain.reverts.walletTokenInsufficient
  }
}

function contractBalanceMessage(t: AppMessagesBundle, path: WritePath | undefined): string {
  if (path === WRITE_PATH.RELEASE_CLAIM) {
    return t.errors.chain.reverts.extractableInsufficient
  }
  return t.errors.chain.reverts.contractPayableInsufficient
}

/**
 * ERC20InsufficientBalance → 用户文案
 *
 * 优先用解码出的 `sender` 与当前钱包比较；否则按 WritePath 默认侧选句。
 */
export function messageForErc20InsufficientBalance(
  t: AppMessagesBundle,
  ctx: ErrorMessageContext | undefined,
  error: unknown,
): string {
  const path = ctx?.path
  const account = readErc20InsufficientAccount(error)
  const wallet = ctx?.walletAddress?.toLowerCase()

  let side: BalanceSide = defaultBalanceSide(path)
  if (account && wallet) {
    side = account === wallet ? 'wallet' : 'contract'
  }

  return side === 'wallet' ? walletBalanceMessage(t, path) : contractBalanceMessage(t, path)
}

/** ERC20InsufficientAllowance → 用户文案（一律用户侧；TOKEN/产品由 path 定）。 */
export function messageForErc20InsufficientAllowance(
  t: AppMessagesBundle,
  ctx: ErrorMessageContext | undefined,
): string {
  switch (ctx?.path) {
    case WRITE_PATH.GENESIS:
      return t.genesis.insufficientAllowance
    case WRITE_PATH.STAKING:
    case WRITE_PATH.XMINE:
    case WRITE_PATH.BOND_ZAP:
      return t.staking.blocked.insufficientAllowance
    default:
      return t.errors.chain.reverts.insufficientAllowance
  }
}
