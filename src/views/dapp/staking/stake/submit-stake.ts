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
import { isUnknownSubmitOutcome } from '~/web3/wallet/wallet-submit-unknown-error'
import {
  WRITE_PATH,
  clearUnknownReceiptLock,
  isUnknownReceiptLocked,
  lockUnknownReceipt,
} from '~/web3/wallet/unknown-receipt-lock'
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
  if (isUnknownReceiptLocked(WRITE_PATH.STAKING)) {
    return { ok: false, error: STAKING_GATE_ERROR.unavailable }
  }

  const pool = resolveStakePoolAddress(period)
  const isLiquid = period === 'liquid'

  try {
    const pre = await readStakeOpenPreflight({
      pool,
      isLiquid,
      user: account.address,
      client: readClient,
    })
    const preMigration = await readMigrationStatus(account.address, readClient)
    const preGate = evaluateStakeLiveGate({
      amount,
      isBound: pre.isBound,
      balance: pre.balance,
      allowance: pre.allowance,
      remainingQuota: pre.remainingQuota,
      poolOpen: pre.poolOpen,
      isOldAccount: preMigration.isOldAccount,
    })
    if (preGate) return { ok: false, error: STAKING_GATE_ERROR[preGate] }

    await approveAgxForStakeIfNeeded({ wallet, pool, amount })

    const live = await readStakeOpenPreflight({
      pool,
      isLiquid,
      user: account.address,
      client: readClient,
    })
    const liveMigration = await readMigrationStatus(account.address, readClient)
    const liveGate = evaluateStakeLiveGate({
      amount,
      isBound: live.isBound,
      balance: live.balance,
      allowance: live.allowance,
      remainingQuota: live.remainingQuota,
      poolOpen: live.poolOpen,
      isOldAccount: liveMigration.isOldAccount,
    })
    if (liveGate) return { ok: false, error: STAKING_GATE_ERROR[liveGate] }

    if (isLiquid) {
      await liquidStakeAgx({ wallet, amount })
    } else {
      await lockedStakeAgx({ wallet, pool, amount })
    }

    clearUnknownReceiptLock(WRITE_PATH.STAKING)
    invalidateAfterStaking()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.STAKING)
    }
    return { ok: false, error: caught }
  }
}

export async function submitLiquidWarmupClaim(args: {
  account: ActiveAccount
  wallet: ActiveWallet
}): Promise<{ ok: true } | { ok: false; error: unknown }> {
  const { account, wallet } = args
  if (!account || !wallet) {
    return { ok: false, error: WALLET_GATE_ERROR.NOT_CONNECTED }
  }
  if (isUnknownReceiptLocked(WRITE_PATH.STAKING)) {
    return { ok: false, error: STAKING_GATE_ERROR.unavailable }
  }
  try {
    await claimLiquidWarmup({ wallet })
    clearUnknownReceiptLock(WRITE_PATH.STAKING)
    invalidateAfterStaking()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.STAKING)
    }
    return { ok: false, error: caught }
  }
}
