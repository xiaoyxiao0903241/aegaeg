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
  if (isUnknownReceiptLocked(WRITE_PATH.BOND_ZAP)) {
    return { ok: false, error: BOND_ZAP_GATE_ERROR.unavailable }
  }

  const depository =
    kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)

  try {
    const pre = await readBondZapPreflight({
      depository,
      user: account.address,
      client: readClient,
    })
    const preMigration = await readMigrationStatus(account.address, readClient)
    const preGate = evaluateBondZapLiveGate({
      amount,
      isBound: pre.isBound,
      balance: pre.balance,
      allowance: pre.allowance,
      depositoryAuthorized: pre.depositoryAuthorized,
      isOldAccount: preMigration.isOldAccount,
    })
    if (preGate) return { ok: false, error: BOND_ZAP_GATE_ERROR[preGate] }

    await approveUsd1ForBondHelperIfNeeded({ wallet, amount })

    const live = await readBondZapPreflight({
      depository,
      user: account.address,
      client: readClient,
    })
    const liveMigration = await readMigrationStatus(account.address, readClient)
    const liveGate = evaluateBondZapLiveGate({
      amount,
      isBound: live.isBound,
      balance: live.balance,
      allowance: live.allowance,
      depositoryAuthorized: live.depositoryAuthorized,
      isOldAccount: liveMigration.isOldAccount,
    })
    if (liveGate) return { ok: false, error: BOND_ZAP_GATE_ERROR[liveGate] }

    if (kind === 'lp') {
      await zapIntoLiquidityBond({ wallet, depository, amount })
    } else {
      await zapIntoBurnBond({ wallet, depository, amount })
    }

    clearUnknownReceiptLock(WRITE_PATH.BOND_ZAP)
    invalidateAfterStaking()
    return { ok: true }
  } catch (caught) {
    if (isUnknownSubmitOutcome(caught)) {
      lockUnknownReceipt(WRITE_PATH.BOND_ZAP)
    }
    return { ok: false, error: caught }
  }
}
