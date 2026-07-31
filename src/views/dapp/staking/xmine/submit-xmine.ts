import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { XMINE_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { approveGagxForXmineIfNeeded, stakeGagxForMining } from '~/web3/staking/staking-write'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { openExchangeView } from '~/shared/config/open-exchange-view'

export { XMINE_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitXmineStake(args: {
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<void> {
  const { amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }

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
  invalidateAfterStaking()
}
