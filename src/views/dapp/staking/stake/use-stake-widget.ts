import { useState } from 'react'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import { resolveStakePoolAddress } from '~/web3/staking/resolve-staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { useStakeOpenPreflightQuery } from '~/web3/staking/use-staking-queries'
import { useMigrationUserGate } from '~/web3/migration/use-migration-queries'
import { resolveNeedReferral } from '~/core/referral/resolve-need-referral'
import { resolveWriteButtonPhase } from '~/core/wallet/resolve-write-button-phase'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitLiquidWarmupClaim, submitStakeOpen } from '~/views/dapp/staking/stake/submit-stake'
import { useStakingViewStore } from '~/stores/staking-view-store'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function useStakeWidget(sessionReady: boolean) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const period = useStakingViewStore((state) => state.stakePeriod)
  const setStakePeriod = useStakingViewStore((state) => state.setStakePeriod)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown>(null)

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

  const locked =
    isUnknownReceiptLocked(WRITE_PATH.STAKING) || isSubmitting || !writeReady || !walletReady

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

  const showWarmupClaim = isLiquid && Boolean(preflightQuery.data?.isWarmupExpired)

  async function submit() {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitStakeOpen({
        period,
        amount: amountInput.amountIn,
        account,
        wallet,
        readClient,
      })
      if (result.ok) {
        amountInput.clearAmount()
        await preflightQuery.refetch()
      } else {
        setError(result.error)
      }
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  async function claimWarmup() {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitLiquidWarmupClaim({ account, wallet })
      if (result.ok) await preflightQuery.refetch()
      else setError(result.error)
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  function changePeriod(next: string) {
    if (next === period) return
    if (next !== 'liquid' && next !== '180' && next !== '360' && next !== '540') return
    amountInput.clearAmount()
    setStakePeriod(next)
  }

  return {
    period,
    setPeriod: changePeriod,
    amount: amountInput.amount,
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount: amountInput.setAmount,
    fillMax: () => amountInput.fillPercent(100),
    balanceLabel: formatTokenAmount(balance, AGX_DECIMALS, 4),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting,
    error,
    gate,
    writePhase,
    showWarmupClaim,
    claimWarmup,
    submit,
    pool,
    remainingLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(preflightQuery.data.remainingQuota, AGX_DECIMALS, 4)
        : '—',
  }
}
