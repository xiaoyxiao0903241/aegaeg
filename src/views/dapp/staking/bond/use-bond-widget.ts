import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateBondZapLiveGate } from '~/core/staking/staking-gates'
import { type BondPeriod } from '~/core/staking/staking-period'
import {
  resolveBurnBondDepository,
  resolveLpBondDepository,
} from '~/web3/staking/resolve-staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { readBondZapPreflight } from '~/web3/staking/staking-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitBondZap, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals

export function useBondWidget(kind: BondKind, sessionReady: boolean) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const [period, setPeriod] = useState<BondPeriod>('180')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const depository =
    kind === 'lp' ? resolveLpBondDepository(period) : resolveBurnBondDepository(period)

  const preflightQuery = useQuery({
    queryKey: queryKeys.chain.bondZapPreflight(depository, address ?? ''),
    queryFn: () =>
      readBondZapPreflight({
        depository,
        user: address!,
        client: readClient,
      }),
    enabled: sessionReady && walletReady && Boolean(address),
    staleTime: QUERY_STALE_TIME.balances,
  })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: USD1_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const gate = evaluateBondZapLiveGate({
    amount: amountInput.amountIn,
    isBound: preflightQuery.data?.isBound ?? false,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    depositoryAuthorized: preflightQuery.data?.depositoryAuthorized ?? false,
  })

  const locked =
    isUnknownReceiptLocked(WRITE_PATH.BOND_ZAP) || isSubmitting || !writeReady || !walletReady

  const canSubmit =
    !locked && amountInput.amountIn > 0n && gate == null && preflightQuery.data !== undefined

  async function submit() {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await submitBondZap({
        kind,
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

  function changePeriod(next: string) {
    if (next === period) return
    if (next !== '180' && next !== '360' && next !== '540') return
    amountInput.clearAmount()
    setPeriod(next)
  }

  return {
    kind,
    period,
    setPeriod: changePeriod,
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount: amountInput.setAmount,
    fillMax: () => amountInput.fillPercent(100),
    balanceLabel: formatTokenAmount(balance, USD1_DECIMALS, 4),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting,
    error,
    gate,
    submit,
    depository,
  }
}
