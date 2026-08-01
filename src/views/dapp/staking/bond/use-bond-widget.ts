import { useActiveAccount } from '~/web3/thirdweb-react'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { evaluateBondZapLive } from '~/core/staking/staking-block-reasons'
import type { BondPeriod } from '~/core/staking/staking-period'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { readBondMarketMeta, formatBondDiscountLabel } from '~/web3/staking/staking-read'
import {
  useBondHelperSlippageQuery,
  useBondZapAgxPreviewQuery,
  useBondZapPreflightQuery,
} from '~/web3/staking/use-staking-queries'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { evaluateNeedReferral } from '~/core/referral/need-referral'
import { evaluateWriteButtonPhase } from '~/core/wallet/write-button-phase'
import { writeCtaDisabled } from '~/core/wallet/write-cta'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { submitBondZap, type BondKind } from '~/views/dapp/staking/bond/submit-bond-zap'
import { useStakingPeriodsStore } from '~/stores/staking-periods-store'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const BOND_PERIODS: BondPeriod[] = ['180', '360', '540']

export type BondWritePresent = {
  onSuccess: () => void | Promise<void>
  /** Extra side effects only — default error toast always runs after. */
  onError?: (error: unknown) => void
}

export function useBondWidget(kind: BondKind, sessionReady: boolean, present: BondWritePresent) {
  const account = useActiveAccount()
  const { writeReady } = useWriteReadiness()

  const address = account?.address
  const walletReady = hasWalletAccount(account)
  const period = useStakingPeriodsStore((state) =>
    kind === 'lp' ? state.lpBondPeriod : state.burnBondPeriod,
  )
  const setBondPeriod = useStakingPeriodsStore((state) => state.setBondPeriod)
  const depositoryAddress = kind === 'lp' ? lpBondDepositoryAddress : burnBondDepositoryAddress
  const depository = depositoryAddress(period)

  const preflightQuery = useBondZapPreflightQuery(depository, {
    enabled: sessionReady,
  })
  const migration = useMigrationUser(address, { enabled: walletReady })

  const market180 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('180')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('180')),
  })
  const market360 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('360')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('360')),
  })
  const market540 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('540')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('540')),
  })
  const periodMarketQueries = [market180, market360, market540] as const

  const marketQuery = periodMarketQueries[BOND_PERIODS.indexOf(period)]!

  const slippageQuery = useBondHelperSlippageQuery()

  const balance = preflightQuery.data?.balance ?? 0n
  const balancesLoaded = preflightQuery.data !== undefined

  const amountInput = useCappedTokenAmountInput({
    decimals: USD1_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const payoutQuery = useBondZapAgxPreviewQuery(kind, depository, amountInput.amountIn, {
    enabled: sessionReady,
  })

  const blockReason = evaluateBondZapLive({
    amount: amountInput.amountIn,
    isBound: preflightQuery.data?.isBound ?? false,
    balance,
    allowance: preflightQuery.data?.allowance ?? 0n,
    depositoryAuthorized: preflightQuery.data?.depositoryAuthorized ?? false,
    isOldAccount: migration.isOldAccount,
  })

  const needReferral = evaluateNeedReferral(preflightQuery.data?.isBound) === 'need_referral'

  const zap = useChainMutation({
    path: WRITE_PATH.BOND_ZAP,
    mutation: (_vars, session) =>
      submitBondZap({
        session,
        kind,
        period,
        amount: amountInput.amountIn,
      }),
    onSuccess: async () => {
      await present.onSuccess()
      amountInput.clearAmount()
    },
    onError: present.onError,
  })

  const isSubmitting = zap.isPending

  const locked = writeCtaDisabled({
    unknownReceiptLocked: zap.isLocked,
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

  function unlock() {
    zap.clearLock()
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
    if (next !== '180' && next !== '360' && next !== '540') return
    unlock()
    amountInput.clearAmount()
    setBondPeriod(kind, next)
  }

  return {
    kind,
    period,
    setPeriod: changePeriod,
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount,
    fillMax,
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
    blockReason,
    writePhase,
    submit: () => zap.mutate(),
    depository,
  }
}
