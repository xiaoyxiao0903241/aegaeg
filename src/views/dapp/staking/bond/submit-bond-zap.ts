import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
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
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { ChainReadClient } from '~/web3/chain-read-client'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

export type BondKind = 'lp' | 'burn'

export const BOND_ZAP_GATE_ERROR = {
  accountMigrated: 'BOND_ZAP_ACCOUNT_MIGRATED',
  notBound: 'BOND_ZAP_NOT_BOUND',
  insufficientBalance: 'BOND_ZAP_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'BOND_ZAP_INSUFFICIENT_ALLOWANCE',
  depositoryNotAuth: 'BOND_ZAP_DEPOSITORY_NOT_AUTH',
  zeroAmount: 'BOND_ZAP_ZERO_AMOUNT',
  unavailable: 'BOND_ZAP_UNAVAILABLE',
} as const

export async function submitBondZap(args: {
  kind: BondKind
  period: BondPeriod
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { kind, period, amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const depository =
    kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.BOND_ZAP,
    whenLocked: BOND_ZAP_GATE_ERROR.unavailable,
    run: async () => {
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
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterStaking()
  return { ok: true }
}
