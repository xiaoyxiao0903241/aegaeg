import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateStakeLiveGate } from '~/core/staking/staking-gates'
import { resolveStakePoolAddress } from '~/web3/staking/resolve-staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { readStakeOpenPreflight } from '~/web3/staking/staking-read'
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

  const preflightQuery = useQuery({
    queryKey: queryKeys.chain.stakeOpenPreflight(pool, address ?? ''),
    queryFn: () =>
      readStakeOpenPreflight({
        pool,
        isLiquid,
        user: address!,
        client: readClient,
      }),
    enabled: sessionReady && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const gate = evaluateStakeLiveGate({
    amount: amountInput.amountIn,
    isBound: preflightQuery.data?.isBound ?? false,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    remainingQuota: preflightQuery.data?.remainingQuota ?? 0n,
    poolOpen: preflightQuery.data?.poolOpen,
  })

  const locked =
    isUnknownReceiptLocked(WRITE_PATH.STAKING) || isSubmitting || !writeReady || !walletReady

  const canSubmit =
    !locked && amountInput.amountIn > 0n && gate == null && preflightQuery.data !== undefined

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
