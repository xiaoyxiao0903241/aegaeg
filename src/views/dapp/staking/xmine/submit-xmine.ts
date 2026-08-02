import { evaluateXmineLive, type XmineLiveBlockReason } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { openExchangeView } from '~/shared/config/dapp-open-views'
import { XMINE_BLOCKED } from '~/web3/errors/write-block-errors'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export { XMINE_BLOCKED } from '~/web3/errors/write-block-errors'

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
    evaluate: (preflight): XmineLiveBlockReason | null => {
      const remaining =
        preflight.miningQuota > preflight.miningStaked
          ? preflight.miningQuota - preflight.miningStaked
          : 0n
      return evaluateXmineLive({
        amount,
        balance: preflight.balance,
        allowance: preflight.allowance,
        miningQuota: remaining,
      })
    },
    mapBlockError: (reason: XmineLiveBlockReason) => {
      if (!pastPreflight && reason === 'insufficientBalance') openExchangeView('flash')
      return XMINE_BLOCKED[reason]
    },
    softPreBlocks: ['insufficientAllowance'] satisfies ReadonlyArray<XmineLiveBlockReason>,
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
