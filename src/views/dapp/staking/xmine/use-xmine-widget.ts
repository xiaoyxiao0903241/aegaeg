import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateXmineLiveGate } from '~/core/staking/staking-gates'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { readXminePreflight } from '~/web3/staking/staking-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitXmineStake } from '~/views/dapp/staking/xmine/submit-xmine'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function useXmineWidget(sessionReady: boolean) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const address = account?.address
  const walletReady = hasWalletAccount(account)

  const preflightQuery = useQuery({
    queryKey: queryKeys.chain.xminePreflight(address ?? ''),
    queryFn: () => readXminePreflight({ user: address!, client: readClient }),
    enabled: sessionReady && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: GAGX_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const gate = evaluateXmineLiveGate({
    amount: amountInput.amountIn,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    miningQuota: preflightQuery.data?.miningQuota ?? 0n,
  })

  const locked =
    isUnknownReceiptLocked(WRITE_PATH.XMINE) || isSubmitting || !writeReady || !walletReady

  const canSubmit =
    !locked && amountInput.amountIn > 0n && gate == null && preflightQuery.data !== undefined

  async function submit() {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitXmineStake({
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

  return {
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount: amountInput.setAmount,
    fillMax: () => amountInput.fillPercent(100),
    balanceLabel: formatTokenAmount(balance, GAGX_DECIMALS, 4),
    quotaLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(preflightQuery.data.miningQuota, GAGX_DECIMALS, 4)
        : '—',
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting,
    error,
    gate,
    submit,
    pool: BSC_CONTRACTS.xStakingPool,
  }
}
