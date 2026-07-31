import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { XMINE_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import { requireWriteSession } from '~/web3/wallet/require-write-session'
import { openExchangeView } from '~/shared/config/open-exchange-view'

export { XMINE_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitXmineStake(args: { amount: bigint }): Promise<void> {
  const { amount } = args
  const { wallet, address, readClient } = requireWriteSession()

  let pastPreflight = false
  await approveThenLiveWrite({
    readSnapshot: () => readXminePreflight({ user: address, client: readClient }),
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
  invalidateAfterStaking()
}
