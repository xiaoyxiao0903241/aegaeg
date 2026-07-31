import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { BOND_ZAP_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateBondZapLiveGate } from '~/core/staking/staking-gates'
import type { BondPeriod } from '~/core/staking/staking-period'
import {
  resolveBurnBondDepository,
  resolveLpBondDepository,
} from '~/web3/staking/resolve-staking-addresses'
import {
  approveUsd1ForBondHelperIfNeeded,
  zapIntoBurnBond,
  zapIntoLiquidityBond,
} from '~/web3/staking/staking-write'
import { readBondZapPreflight } from '~/web3/staking/staking-read'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { ChainReadClient } from '~/web3/chain-read-client'

export type BondKind = 'lp' | 'burn'

export { BOND_ZAP_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitBondZap(args: {
  kind: BondKind
  period: BondPeriod
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<void> {
  const { kind, period, amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    throw WALLET_GATE_ERROR.NOT_CONNECTED
  }

  const depository =
    kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)

  await approveThenLiveWrite({
    readSnapshot: async () => {
      const preflight = await readBondZapPreflight({
        depository,
        user: account.address,
        client: readClient,
      })
      const migration = await readMigrationStatus(account.address, readClient)
      return { preflight, isOldAccount: migration.isOldAccount }
    },
    evaluate: ({ preflight, isOldAccount }) =>
      evaluateBondZapLiveGate({
        amount,
        isBound: preflight.isBound,
        balance: preflight.balance,
        allowance: preflight.allowance,
        depositoryAuthorized: preflight.depositoryAuthorized,
        isOldAccount,
      }),
    mapGateError: (reason: NonNullable<ReturnType<typeof evaluateBondZapLiveGate>>) =>
      BOND_ZAP_GATE_ERROR[reason],
    approve: async () => {
      await approveUsd1ForBondHelperIfNeeded({ wallet, amount })
    },
    write: async () => {
      if (kind === 'lp') {
        await zapIntoLiquidityBond({ wallet, depository, amount })
      } else {
        await zapIntoBurnBond({ wallet, depository, amount })
      }
    },
  })
  invalidateAfterStaking()
}
