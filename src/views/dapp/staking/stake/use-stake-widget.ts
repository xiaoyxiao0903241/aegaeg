import { useActiveAccount } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateStakeLive } from '~/core/staking/staking-block-reasons'
import { stakePoolAddress } from '~/web3/staking/staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { useStakeOpenPreflightQuery } from '~/web3/staking/use-staking-queries'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { evaluateNeedReferral } from '~/core/referral/need-referral'
import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitLiquidWarmupClaim, submitStakeOpen } from '~/views/dapp/staking/stake/submit-stake'
import { useStakingPeriodsStore } from '~/stores/staking-periods-store'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export type StakeWritePresent = {
  onOpenSuccess: () => void | Promise<void>
  onWarmupSuccess: () => void | Promise<void>
  /** Extra side effects only — default error toast always runs after. */
  onError?: (error: unknown) => void
}

export function useStakeWidget(sessionReady: boolean, present: StakeWritePresent) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()
  const period = useStakingPeriodsStore((state) => state.stakePeriod)
  const setStakePeriod = useStakingPeriodsStore((state) => state.setStakePeriod)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const pool = stakePoolAddress(period)
  const isLiquid = period === 'liquid'

  const preflightQuery = useStakeOpenPreflightQuery(pool, isLiquid, {
    enabled: sessionReady,
  })
  const migration = useMigrationUser(address, { enabled: walletReady })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const isBound = preflightQuery.data?.isBound ?? false
  const needReferral = evaluateNeedReferral(preflightQuery.data?.isBound) === 'need_referral'

  const blockReason = evaluateStakeLive({
    amount: amountInput.amountIn,
    isBound,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    remainingQuota: preflightQuery.data?.remainingQuota ?? 0n,
    poolOpen: preflightQuery.data?.poolOpen,
    isOldAccount: migration.isOldAccount,
  })

  const open = useChainMutation({
    path: WRITE_PATH.STAKING,
    mutation: (_vars, session) =>
      submitStakeOpen({
        session,
        period,
        amount: amountInput.amountIn,
      }),
    onSuccess: async () => {
      await present.onOpenSuccess()
      amountInput.clearAmount()
    },
    onError: present.onError,
  })

  const warmup = useChainMutation({
    path: WRITE_PATH.STAKING,
    mutation: (_vars, session) => submitLiquidWarmupClaim({ session }),
    onSuccess: async () => {
      await present.onWarmupSuccess()
    },
  })

  const isSubmitting = open.isPending || warmup.isPending
  const isLocked = open.isLocked

  const locked = writeCtaDisabled({
    unknownReceiptLocked: isLocked,
    isSubmitting,
    writeReady,
    walletReady,
  })

  const canSubmit =
    !locked && amountInput.amountIn > 0n && blockReason == null && preflightQuery.data !== undefined

  const writePhase = evaluateWriteButtonPhase({
    walletReady,
    writeReady,
    needReferral,
    accountMigrated: migration.isOldAccount === true,
    moneyBlock: blockReason,
    isSubmitting,
  })

  function unlock() {
    open.clearLock()
  }

  function setAmount(value: string) {
    unlock()
    amountInput.setAmount(value)
  }

  function fillMax() {
    unlock()
    amountInput.fillPercent(100)
  }

  function changePeriod(next: string) {
    if (next === period) return
    if (next !== 'liquid' && next !== '180' && next !== '360' && next !== '540') return
    unlock()
    amountInput.clearAmount()
    setStakePeriod(next)
  }

  return {
    period,
    setPeriod: changePeriod,
    amount: amountInput.amount,
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount,
    fillMax,
    balanceLabel: formatTokenAmount(balance, AGX_DECIMALS, 4),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting,
    blockReason,
    writePhase,
    showWarmupClaim: isLiquid && Boolean(preflightQuery.data?.isWarmupExpired),
    claimWarmup: () => warmup.mutate(),
    submit: () => open.mutate(),
    pool,
    remainingLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(preflightQuery.data.remainingQuota, AGX_DECIMALS, 4)
        : '—',
  }
}
