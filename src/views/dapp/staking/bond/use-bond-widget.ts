import { useState } from 'react'
import { useQueries, useQuery } from '@tanstack/react-query'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateBondZapLiveGate } from '~/core/staking/staking-gates'
import type { BondPeriod } from '~/core/staking/staking-period'
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
import {
  readBondMarketMeta,
  readBondZapPreflight,
  formatBondDiscountLabel,
} from '~/web3/staking/staking-read'
import { readBondZapAgxPreview, readBondHelperSlippage } from '~/web3/staking/bond-zap-quote-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitBondZap, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useStakingViewStore } from '~/stores/staking-view-store'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const BOND_PERIODS: BondPeriod[] = ['180', '360', '540']

export function useBondWidget(kind: BondKind, sessionReady: boolean) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { writeReady } = useWriteReadiness()
  const readClient = useChainReadClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const period = useStakingViewStore((state) =>
    kind === 'lp' ? state.lpBondPeriod : state.burnBondPeriod,
  )
  const setBondPeriod = useStakingViewStore((state) => state.setBondPeriod)
  const resolveDepository = kind === 'lp' ? resolveLpBondDepository : resolveBurnBondDepository
  const depository = resolveDepository(period)

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

  const periodMarketQueries = useQueries({
    queries: BOND_PERIODS.map((p) => {
      const addr = resolveDepository(p)
      return {
        queryKey: queryKeys.chain.bondMarketMeta(addr),
        queryFn: () => readBondMarketMeta(addr, readClient),
        staleTime: QUERY_STALE_TIME.quote,
      }
    }),
  })

  const marketQuery = periodMarketQueries[BOND_PERIODS.indexOf(period)]!

  const slippageQuery = useQuery({
    queryKey: queryKeys.chain.bondHelperSlippage,
    queryFn: () => readBondHelperSlippage(readClient),
    staleTime: QUERY_STALE_TIME.quote,
  })

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: USD1_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const payoutQuery = useQuery({
    queryKey: queryKeys.chain.bondZapAgxPreview(kind, depository, amountInput.amountIn.toString()),
    queryFn: () =>
      readBondZapAgxPreview({
        kind,
        depository,
        depositUsd1: amountInput.amountIn,
        client: readClient,
      }),
    enabled: sessionReady && amountInput.amountIn > 0n,
    staleTime: QUERY_STALE_TIME.quote,
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

  const market = marketQuery.data
  const discountLabel =
    market === undefined
      ? marketQuery.isError
        ? '—'
        : ''
      : formatBondDiscountLabel(market.discountRateBP)
  const periodDiscounts = Object.fromEntries(
    BOND_PERIODS.map((p, index) => {
      const q = periodMarketQueries[index]!
      if (q.data !== undefined) return [p, formatBondDiscountLabel(q.data.discountRateBP)]
      if (q.isError) return [p, '—']
      return [p, q.isFetching ? '…' : '—']
    }),
  ) as Record<BondPeriod, string>
  const capLabel =
    market === undefined
      ? marketQuery.isError
        ? '—'
        : ''
      : market.maxDebt === 0n
        ? '—'
        : formatTokenAmount(
            market.maxDebt > market.totalDeposit ? market.maxDebt - market.totalDeposit : 0n,
            AGX_DECIMALS,
            2,
          )

  const receiveLabel =
    amountInput.amountIn === 0n
      ? '—'
      : payoutQuery.isError
        ? '—'
        : payoutQuery.data === undefined
          ? ''
          : payoutQuery.data.netPayout > 0n
            ? formatTokenAmount(payoutQuery.data.netPayout, AGX_DECIMALS, 4)
            : '—'

  const slippageLabel = slippageQuery.isError
    ? '—'
    : slippageQuery.data === undefined
      ? ''
      : `${slippageQuery.data.toString()}%`

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
        await Promise.all([preflightQuery.refetch(), marketQuery.refetch(), payoutQuery.refetch()])
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
    setBondPeriod(kind, next)
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
    isMarketLoading: marketQuery.isFetching && !discountLabel && !marketQuery.isError,
    isPayoutQuoting: payoutQuery.isFetching && !receiveLabel && amountInput.amountIn > 0n,
    isSlippageLoading: slippageQuery.isFetching && !slippageLabel && !slippageQuery.isError,
    discountLabel: discountLabel || '—',
    periodDiscounts,
    capLabel: capLabel || '—',
    receiveLabel: receiveLabel || '—',
    slippageLabel: slippageLabel || '—',
    walletReady,
    canSubmit,
    isSubmitting,
    error,
    gate,
    submit,
    depository,
  }
}
