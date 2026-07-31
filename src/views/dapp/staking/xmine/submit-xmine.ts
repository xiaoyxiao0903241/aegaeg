import { evaluateXmineLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { XMINE_BLOCKED } from '~/web3/errors/staking-write-block-errors'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'
import { openExchangeView } from '~/shared/config/open-exchange-view'

export { XMINE_BLOCKED } from '~/web3/errors/staking-write-block-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitXmineStake(args: {
  session: WriteSession
  amount: bigint
}): Promise<void> {
  const { session, amount } = args
  const { wallet, address, readClient } = session

  let pastPreflight = false
  await approveThenLiveWrite({
    readSnapshot: () => readXminePreflight({ user: address, client: readClient }),
    evaluate: (preflight) =>
      evaluateXmineLive({
        amount,
        balance: preflight.balance,
        allowance: preflight.allowance,
        miningQuota: preflight.miningQuota,
      }),
    mapBlockError: (reason) => {
      if (!pastPreflight && reason === 'insufficientBalance') openExchangeView('flash')
      return XMINE_BLOCKED[reason]
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
