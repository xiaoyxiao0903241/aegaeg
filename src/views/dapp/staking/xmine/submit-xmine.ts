import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
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

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.XMINE,
    whenLocked: XMINE_GATE_ERROR.unavailable,
    run: async () => {
      let pastPreflight = false
      await approveThenLiveWrite({
        readSnapshot: () => readXminePreflight({ user: account.address, client: readClient }),
        evaluate: (preflight) =>
          evaluateXmineLiveGate({
            amount,
            balance: preflight.balance,
            allowance: preflight.allowance,
            miningQuota: preflight.miningQuota,
          }),
        mapGateError: (reason) => {
          if (!pastPreflight && reason === 'insufficientBalance') openExchangeView('flash')
          return XMINE_GATE_ERROR[reason]
        },
        approve: async () => {
          pastPreflight = true
          await approveGagxForXmineIfNeeded({ wallet, amount })
        },
        write: async () => {
          await stakeGagxForMining({ wallet, amount })
        },
      })
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterStaking()
  return { ok: true }
}
