import type { BondPeriod } from '~/core/staking/staking-period'
import { evaluateBondZapLiveGate } from '~/core/staking/staking-gates'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { BOND_ZAP_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'
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
import { requireWriteSession } from '~/web3/wallet/require-write-session'

export type BondKind = 'lp' | 'burn'

export { BOND_ZAP_GATE_ERROR } from '~/web3/errors/staking-write-gate-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitBondZap(args: {
  kind: BondKind
  period: BondPeriod
  amount: bigint
}): Promise<void> {
  const { kind, period, amount } = args
  const { wallet, address, readClient } = requireWriteSession()

  const depository =
    kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)

  await approveThenLiveWrite({
    readSnapshot: async () => {
      const preflight = await readBondZapPreflight({
        depository,
        user: address,
        client: readClient,
      })
      const migration = await readMigrationStatus(address, readClient)
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
