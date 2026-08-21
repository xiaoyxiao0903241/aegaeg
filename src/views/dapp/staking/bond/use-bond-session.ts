import { keepPreviousData } from '@tanstack/react-query'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateNeedReferral } from '~/core/referral/need-referral'
import { formatBondDebtRemainingDisplay } from '~/core/staking/format-bond-debt-remaining'
import { evaluateBondZapLive } from '~/core/staking/staking-block-reasons'
import type { BondKind } from '~/core/staking/staking-period'
import { BOND_PERIODS, type BondPeriod, isBondPeriod } from '~/core/staking/staking-period'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useStakingPeriodsStore } from '~/stores/staking-periods-store'
import { submitBondZap } from '~/views/dapp/staking/bond/submit-bond-zap'
import { evaluateStakingAmountWrite } from '~/views/dapp/staking/shared'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import {
  burnBondDepositoryAddress,
  lpBondDepositoryAddress,
} from '~/web3/staking/staking-addresses'
import { formatBondDiscountLabel, readBondMarketMeta } from '~/web3/staking/staking-read'
import {
  useBondHelperSlippageQuery,
  useBondZapAgxPreviewQuery,
  useBondZapPreflightQuery,
} from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'
import { WRITE_PATH } from '~/web3/wallet/write-path'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export type BondWritePresent = {
  onSuccess: () => void | Promise<void>
  /** 仅附加副作用，默认错误提示始终随后执行。 */
  onError?: (error: unknown) => void
}

/**
 * 债券买入表单核心状态
 *
 * 维护周期 / 数量 / 预检 / 市场 / 滑点等状态，
 * 通过 evaluateBondZapLive 判定可写条件并执行 zap 提交。
 *
 * @param kind 债券类型：lp / burn
 * @param sessionReady 会话是否就绪（决定是否取数）
 * @param present 写入成功 / 失败的附加副作用
 * @returns 表单展示值与提交控制
 */
export function useBondSession(kind: BondKind, sessionReady: boolean, present: BondWritePresent) {
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

  // 预热各周期仓库，切换周期时命中缓存。
  const preflight180 = useBondZapPreflightQuery(depositoryAddress('180'), {
    enabled: sessionReady,
  })
  const preflight360 = useBondZapPreflightQuery(depositoryAddress('360'), {
    enabled: sessionReady,
  })
  const preflight540 = useBondZapPreflightQuery(depositoryAddress('540'), {
    enabled: sessionReady,
  })
  const periodPreflights = [preflight180, preflight360, preflight540] as const
  const preflightQuery = periodPreflights[BOND_PERIODS.indexOf(period)]!

  const migration = useMigrationUser(address, { enabled: walletReady })

  const market180 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('180')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('180')),
    placeholderData: keepPreviousData,
  })
  const market360 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('360')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('360')),
    placeholderData: keepPreviousData,
  })
  const market540 = useChainQuery({
    queryKey: queryKeys.chain.bondMarketMeta(depositoryAddress('540')),
    scope: 'public',
    freshness: 'quote',
    queryFn: () => readBondMarketMeta(depositoryAddress('540')),
    placeholderData: keepPreviousData,
  })
  const periodMarketQueries = [market180, market360, market540] as const

  const marketQuery = periodMarketQueries[BOND_PERIODS.indexOf(period)]!

  const slippageQuery = useBondHelperSlippageQuery()

  const balance =
    decisionBigint(preflightQuery.data?.balance, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const allowance =
    decisionBigint(preflightQuery.data?.allowance, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const balancesLoaded = isDecisionFresh(preflightQuery.isPlaceholderData, preflightQuery.data)

  const amountInput = useCappedTokenAmountInput({
    decimals: USD1_DECIMALS,
    balance,
    balancesLoaded,
    sessionReady,
  })

  const payoutQuery = useBondZapAgxPreviewQuery(kind, depository, amountInput.amountIn, {
    enabled: sessionReady,
  })

  const market = marketQuery.data
  const marketLoaded = isDecisionFresh(marketQuery.isPlaceholderData, market)
  const payoutFresh = isDecisionFresh(payoutQuery.isPlaceholderData, payoutQuery.data)
  const payoutLoaded = amountInput.amountIn === ZERO_BI || payoutFresh
  // payoutFresh 已含 !placeholder；勿用 isFetching，后台 refetch 会闪灰。
  const isPayoutQuoting = amountInput.amountIn > ZERO_BI && !payoutFresh
  const blockReason = evaluateBondZapLive({
    amount: amountInput.amountIn,
    isBound: balancesLoaded ? (preflightQuery.data?.isBound ?? false) : false,
    balance,
    allowance,
    depositoryAuthorized: balancesLoaded
      ? (preflightQuery.data?.depositoryAuthorized ?? false)
      : false,
    isOldAccount: migration.isOldAccount,
    maxDebt: marketLoaded ? market!.maxDebt : null,
    totalDeposit: marketLoaded ? market!.totalDeposit : null,
    maxPayout: marketLoaded ? market!.maxPayoutAmount : null,
    netPayout:
      amountInput.amountIn === ZERO_BI
        ? ZERO_BI
        : payoutLoaded
          ? (payoutQuery.data?.netPayout ?? null)
          : null,
    grossPayout:
      amountInput.amountIn === ZERO_BI
        ? ZERO_BI
        : payoutLoaded
          ? (payoutQuery.data?.grossPayout ?? null)
          : null,
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

  const { canSubmit, writePhase } = evaluateStakingAmountWrite({
    isSubmitting,
    writeReady,
    walletReady,
    amountIn: amountInput.amountIn,
    blockReason,
    preflightReady: preflightQuery.data !== undefined,
    needReferral,
    accountMigrated: migration.isOldAccount === true,
    isQuoting: isPayoutQuoting,
  })

  const discountLabel =
    market === undefined
      ? marketQuery.isError
        ? '0'
        : ''
      : formatBondDiscountLabel(market.discountRateBP)
  const periodDiscounts = Object.fromEntries(
    BOND_PERIODS.map((p, index) => {
      const q = periodMarketQueries[index]!
      if (q.data !== undefined) return [p, formatBondDiscountLabel(q.data.discountRateBP)]
      if (q.isError) return [p, '0']
      return [p, '']
    }),
  ) as Record<BondPeriod, string>
  /** 各周期已发行债务（AGX）；未就绪为 null，供「已售」USD 展示。 */
  const periodTotalDeposits = Object.fromEntries(
    BOND_PERIODS.map((p, index) => {
      const q = periodMarketQueries[index]!
      if (q.data !== undefined) return [p, q.data.totalDeposit]
      return [p, null]
    }),
  ) as Record<BondPeriod, bigint | null>
  const debtRemaining =
    market === undefined
      ? null
      : formatBondDebtRemainingDisplay(market.maxDebt, market.totalDeposit, AGX_DECIMALS, 2)
  const capUnlimited = debtRemaining?.kind === 'unlimited'
  const capLabel =
    market === undefined
      ? marketQuery.isError
        ? '0'
        : ''
      : debtRemaining?.kind === 'amount'
        ? debtRemaining.label
        : ''

  const receiveLabel =
    amountInput.amountIn === ZERO_BI
      ? '0'
      : payoutQuery.isError
        ? '0'
        : !payoutFresh
          ? ''
          : payoutQuery.data!.netPayout > ZERO_BI
            ? formatTokenAmount(payoutQuery.data!.netPayout, AGX_DECIMALS, 4)
            : '0'

  const slippageLabel = slippageQuery.isError
    ? '0'
    : slippageQuery.data === undefined
      ? ''
      : `${slippageQuery.data.toString()}%`

  const { setAmount } = amountInput
  const fillMax = () => amountInput.fillPercent(100)

  function changePeriod(next: string) {
    if (next === period) return
    if (!isBondPeriod(next)) return
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
    balanceLabel:
      preflightQuery.data === undefined
        ? ''
        : formatTokenAmount(preflightQuery.data.balance, USD1_DECIMALS, 2),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    isMarketLoading: marketQuery.isFetching && !discountLabel && !marketQuery.isError,
    isPayoutQuoting,
    isSlippageLoading: slippageQuery.isFetching && !slippageLabel && !slippageQuery.isError,
    discountLabel: discountLabel || '0',
    periodDiscounts,
    periodTotalDeposits,
    capUnlimited,
    capLabel: capLabel || '0',
    receiveLabel: receiveLabel || '0',
    slippageLabel: slippageLabel || '0',
    walletReady,
    canSubmit,
    isSubmitting,
    blockReason,
    writePhase,
    submit: () => zap.mutate(),
    depository,
  }
}
