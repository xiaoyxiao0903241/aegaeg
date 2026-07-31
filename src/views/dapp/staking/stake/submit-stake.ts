import type { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { WALLET_GATE_ERROR } from '~/web3/resolve-contract-error-message'
import { invalidateAfterStaking } from '~/shared/api/query/invalidate'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import type { StakePeriod } from '~/core/staking/staking-period'
import { resolveStakePoolAddress } from '~/web3/staking/resolve-staking-addresses'
import {
  approveAgxForStakeIfNeeded,
  claimLiquidWarmup,
  liquidStakeAgx,
  lockedStakeAgx,
} from '~/web3/staking/staking-write'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import { submitWithUnknownReceiptLock } from '~/web3/wallet/submit-with-unknown-receipt-lock'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import type { ChainReadClient } from '~/web3/chain-read-client'

type ActiveAccount = ReturnType<typeof useActiveAccount>
type ActiveWallet = ReturnType<typeof useActiveWallet>

export const STAKING_GATE_ERROR = {
  accountMigrated: 'STAKING_ACCOUNT_MIGRATED',
  notBound: 'STAKING_NOT_BOUND',
  insufficientBalance: 'STAKING_INSUFFICIENT_BALANCE',
  insufficientAllowance: 'STAKING_INSUFFICIENT_ALLOWANCE',
  insufficientQuota: 'STAKING_INSUFFICIENT_QUOTA',
  poolPaused: 'STAKING_POOL_PAUSED',
  zeroAmount: 'STAKING_ZERO_AMOUNT',
  unavailable: 'STAKING_UNAVAILABLE',
} as const

export async function submitStakeOpen(args: {
  period: StakePeriod
  amount: bigint
  account: ActiveAccount
  wallet: ActiveWallet
  readClient: ChainReadClient
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { period, amount, account, wallet, readClient } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const pool = resolveStakePoolAddress(period)
  const isLiquid = period === 'liquid'

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.STAKING,
    whenLocked: STAKING_GATE_ERROR.unavailable,
    run: async () => {
      await approveThenLiveWrite({
        readSnapshot: async () => {
          const preflight = await readStakeOpenPreflight({
            pool,
            isLiquid,
            user: account.address,
            client: readClient,
          })
          const migration = await readMigrationStatus(account.address, readClient)
          return { preflight, isOldAccount: migration.isOldAccount }
        },
        evaluate: ({ preflight, isOldAccount }) =>
          evaluateStakeLiveGate({
            amount,
            isBound: preflight.isBound,
            balance: preflight.balance,
            allowance: preflight.allowance,
            remainingQuota: preflight.remainingQuota,
            poolOpen: preflight.poolOpen,
            isOldAccount,
          }),
        mapGateError: (reason: NonNullable<ReturnType<typeof evaluateStakeLiveGate>>) =>
          STAKING_GATE_ERROR[reason],
        approve: async () => {
          await approveAgxForStakeIfNeeded({ wallet, pool, amount })
        },
        write: async () => {
          if (isLiquid) {
            await liquidStakeAgx({ wallet, amount })
          } else {
            await lockedStakeAgx({ wallet, pool, amount })
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

export async function submitLiquidWarmupClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }

  const guarded = await submitWithUnknownReceiptLock({
    path: WRITE_PATH.STAKING,
    whenLocked: STAKING_GATE_ERROR.unavailable,
    run: async () => {
      await claimLiquidWarmup({ wallet })
    },
  })

  if (!guarded.ok) {
    return { ok: false, error: guarded.error }
  }
  invalidateAfterStaking()
  return { ok: true }
}
