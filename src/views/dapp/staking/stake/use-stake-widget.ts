import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import { resolveStakePoolAddress } from '~/web3/staking/resolve-staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { useStakeOpenPreflightQuery } from '~/web3/staking/use-staking-queries'
import { useMigrationUserGate } from '~/web3/migration/use-migration-queries'
import { resolveNeedReferral } from '~/core/referral/resolve-need-referral'
import { resolveWriteButtonPhase } from '~/core/wallet/resolve-write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitLiquidWarmupClaim, submitStakeOpen } from '~/views/dapp/staking/stake/submit-stake'
import { useStakingViewStore } from '~/stores/staking-view-store'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export type StakeWritePresent = {
  onOpenSuccess: () => void | Promise<void>
  onWarmupSuccess: () => void | Promise<void>
  /** Extra side effects only — default error toast always runs after. */
  onError?: (error: unknown) => void
}

export function useStakeWidget(sessionReady: boolean, present: StakeWritePresent) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const period = useStakingViewStore((state) => state.stakePeriod)
  const setStakePeriod = useStakingViewStore((state) => state.setStakePeriod)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const pool = resolveStakePoolAddress(period)
  const isLiquid = period === 'liquid'

  const preflightQuery = useStakeOpenPreflightQuery(pool, address, isLiquid, {
    enabled: sessionReady && walletReady,
  })
  const migration = useMigrationUserGate(address, { enabled: walletReady })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const isBound = preflightQuery.data?.isBound ?? false
  const needReferral = resolveNeedReferral(preflightQuery.data?.isBound) === 'need_referral'

  const gate = evaluateStakeLiveGate({
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
    mutation: () =>
      submitStakeOpen({
        period,
        amount: amountInput.amountIn,
        account,
        wallet,
        readClient,
      }),
    onSuccess: async () => {
      await present.onOpenSuccess()
      amountInput.clearAmount()
      await preflightQuery.refetch()
    },
    onError: present.onError,
  })

  const warmup = useChainMutation({
    path: WRITE_PATH.STAKING,
    mutation: () => submitLiquidWarmupClaim({ account, wallet }),
    onSuccess: async () => {
      await present.onWarmupSuccess()
      await preflightQuery.refetch()
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
    !locked && amountInput.amountIn > 0n && gate == null && preflightQuery.data !== undefined

  const writePhase = resolveWriteButtonPhase({
    walletReady,
    writeReady,
    needReferral,
    accountMigrated: migration.isOldAccount === true,
    moneyGate: gate,
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
    gate,
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
