import type { BondPeriod } from '~/core/staking/staking-period'
import { evaluateBondZapLive } from '~/core/staking/staking-block-reasons'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { BOND_ZAP_BLOCKED } from '~/web3/errors/write-block-errors'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import {
  approveUsd1ForBondHelperIfNeeded,
  zapIntoBurnBond,
  zapIntoLiquidityBond,
} from '~/web3/staking/staking-write'
import { readBondZapPreflight } from '~/web3/staking/staking-read'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

export type BondKind = 'lp' | 'burn'

export { BOND_ZAP_BLOCKED } from '~/web3/errors/write-block-errors'

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitBondZap(args: {
  session: WriteSession
  kind: BondKind
  period: BondPeriod
  amount: bigint
}): Promise<void> {
  const { session, kind, period, amount } = args
  const { wallet, address, readClient } = session

  const depository =
    kind === 'lp' ? lpBondDepositoryAddress(period) : burnBondDepositoryAddress(period)

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
      evaluateBondZapLive({
        amount,
        isBound: preflight.isBound,
        balance: preflight.balance,
        allowance: preflight.allowance,
        depositoryAuthorized: preflight.depositoryAuthorized,
        isOldAccount,
      }),
    mapBlockError: (reason: NonNullable<ReturnType<typeof evaluateBondZapLive>>) =>
      BOND_ZAP_BLOCKED[reason],
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
