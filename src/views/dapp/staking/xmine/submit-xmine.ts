import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { openExchangeView } from '~/shared/config/open-exchange-view'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

export const XMINE_GATE_ERROR = {
  insufficientBalance: 'XMINE_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'XMINE_INSUFFICIENT_ALLOWANCE',
  insufficientQuota: 'XMINE_INSUFFICIENT_QUOTA',
  zeroAmount: 'XMINE_ZERO_AMOUNT',
  unavailable: 'XMINE_UNAVAILABLE',
} as const

export async function submitXmineStake(args: {
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.XMINE)) {
    return { ok: false, error: XMINE_GATE_ERROR.unavailable }
  }

  try {
    const pre = await readXminePreflight({ user: account.address, client: readClient })
    const preGate = evaluateXmineLiveGate({
      amount,
      balance: pre.balance,
      allowance: pre.allowance,
      miningQuota: pre.miningQuota,
    })
    if (preGate === 'insufficientBalance') {
      openExchangeView('flash')
      return { ok: false, error: XMINE_GATE_ERROR.insufficientBalance }
    }
    if (preGate) return { ok: false, error: XMINE_GATE_ERROR[preGate] }

    await approveGagxForXmineIfNeeded({ wallet, amount })

    const live = await readXminePreflight({ user: account.address, client: readClient })
    const liveGate = evaluateXmineLiveGate({
      amount,
      balance: live.balance,
      allowance: live.allowance,
      miningQuota: live.miningQuota,
    })
    if (liveGate) return { ok: false, error: XMINE_GATE_ERROR[liveGate] }

    await stakeGagxForMining({ wallet, amount })

    clearUnknownReceiptLock(WRITE_PATH.XMINE)
    invalidateAfterStaking()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.XMINE)
    }
    return { ok: false, error: caught }
  }
}
