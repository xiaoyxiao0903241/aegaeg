import { keepPreviousData } from '@tanstack/react-query'

import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateNeedReferral } from '~/core/referral/need-referral'
import { evaluateBondZapLive } from '~/core/staking/staking-block-reasons'
import type { BondPeriod } from '~/core/staking/staking-period'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useStakingPeriodsStore } from '~/stores/staking-periods-store'
import { type BondKind, submitBondZap } from '~/views/dapp/staking/bond/submit-bond-zap'
import {
  bindUnlockedAmountEditors,
  evaluateStakingAmountWrite,
} from '~/views/dapp/staking/staking-amount-write-ui'
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
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const USD1_DECIMALS = EXCHANGE_CONFIG.tokens.usd1.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const BOND_PERIODS: BondPeriod[] = ['180', '360', '540']

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
    decisionBigint(preflightQuery.data?.balance, preflightQuery.isPlaceholderData) ?? 0n
  const allowance =
    decisionBigint(preflightQuery.data?.allowance, preflightQuery.isPlaceholderData) ?? 0n
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

  const blockReason = evaluateBondZapLive({
    amount: amountInput.amountIn,
    isBound: balancesLoaded ? (preflightQuery.data?.isBound ?? false) : false,
    balance,
    allowance,
    depositoryAuthorized: balancesLoaded
      ? (preflightQuery.data?.depositoryAuthorized ?? false)
      : false,
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

  const { canSubmit, writePhase } = evaluateStakingAmountWrite({
    unknownReceiptLocked: zap.isLocked,
    isSubmitting,
    writeReady,
    walletReady,
    amountIn: amountInput.amountIn,
    blockReason,
    preflightReady: preflightQuery.data !== undefined,
    needReferral,
    accountMigrated: migration.isOldAccount === true,
  })

  const market = marketQuery.data
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
  const capLabel =
    market === undefined
      ? marketQuery.isError
        ? '0'
        : ''
      : market.maxDebt === 0n
        ? '0'
        : formatTokenAmount(
            market.maxDebt > market.totalDeposit ? market.maxDebt - market.totalDeposit : 0n,
            AGX_DECIMALS,
            2,
          )

  const receiveLabel =
    amountInput.amountIn === 0n
      ? '0'
      : payoutQuery.isError
        ? '0'
        : payoutQuery.data === undefined
          ? ''
          : payoutQuery.data.netPayout > 0n
            ? formatTokenAmount(payoutQuery.data.netPayout, AGX_DECIMALS, 4)
            : '0'

  const slippageLabel = slippageQuery.isError
    ? '0'
    : slippageQuery.data === undefined
      ? ''
      : `${slippageQuery.data.toString()}%`

  function unlock() {
    zap.clearLock()
  }

  const { setAmount, fillMax } = bindUnlockedAmountEditors(unlock, amountInput)

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
    balanceLabel:
      preflightQuery.data === undefined
        ? ''
        : formatTokenAmount(preflightQuery.data.balance, USD1_DECIMALS, 4),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    isMarketLoading: marketQuery.isFetching && !discountLabel && !marketQuery.isError,
    isPayoutQuoting: payoutQuery.isFetching && !receiveLabel && amountInput.amountIn > 0n,
    isSlippageLoading: slippageQuery.isFetching && !slippageLabel && !slippageQuery.isError,
    discountLabel: discountLabel || '0',
    periodDiscounts,
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
