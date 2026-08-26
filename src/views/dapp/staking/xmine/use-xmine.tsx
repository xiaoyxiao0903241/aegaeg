import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import {
  formatTokenAmount,
  formatTokenAmountInputDisplay,
  formatTokenAmountToNumber,
  PERSONAL_TOKEN_DIGITS,
} from '~/core/exchange/token-amount'
import { decisionBigint, isDecisionFresh } from '~/core/query/decision-freshness'
import { evaluateXmineLive, xmineSpendableCap } from '~/core/staking/staking-block-reasons'
import { formatAmountBalanceLabel, writeBlockHint, writeCtaDisabled } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import {
  useAssetsHoldingsDistribution,
  useX0MiningLifetimeReward,
  useX0MiningLogs,
  useX0MiningPositions,
} from '~/hooks/use-api-data'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { Text } from '~/shared/components/text'
import type { Address } from '~/shared/config/contracts'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatNumber, formatUsdApprox } from '~/shared/presenters/format'
import { mapX0MiningLogToOpsRow } from '~/shared/presenters/map-flow-log-rows'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import { parseApiAmountOrZero } from '~/views/dapp/staking/shared'
import { submitXmineStake } from '~/views/dapp/staking/xmine/submit-xmine'
import { readXminePosition } from '~/web3/assets/assets-read'
import { useMigrationUser } from '~/web3/migration/use-migration-queries'
import { useXmineOverviewQuery, useXminePreflightQuery } from '~/web3/staking/use-staking-queries'
import {
  agxAmountPerXFromXPerAgx,
  formatXmineDailyYieldLabel,
} from '~/web3/staking/xmine-overview-read'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/write-path'

const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type XmineWritePresent = {
  onSuccess: () => void | Promise<void>
  /** 仅附加副作用，默认错误提示始终随后执行。 */
  onError?: (error: unknown) => void
}

/**
 * Xmine 质押表单核心状态
 *
 * 输入上限取「钱包 gAGX 与剩余挖矿额度」的较小值；
 * 授权不足仍允许提交，由内联 approve 完成授权。
 *
 * @param sessionReady 会话是否就绪（决定是否取数）
 * @param present 写入成功 / 失败的附加副作用
 * @returns 表单展示值与提交控制
 */
export function useXmineSession(sessionReady: boolean, present: XmineWritePresent) {
  const { walletReady, writeReady } = useWriteReadiness()
  const migration = useMigrationUser({ enabled: walletReady })

  const preflightQuery = useXminePreflightQuery({
    enabled: sessionReady,
  })

  const balance =
    decisionBigint(preflightQuery.data?.balance, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const allowance =
    decisionBigint(preflightQuery.data?.allowance, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const miningQuota =
    decisionBigint(preflightQuery.data?.miningQuota, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const miningStaked =
    decisionBigint(preflightQuery.data?.miningStaked, preflightQuery.isPlaceholderData) ?? ZERO_BI
  const balancesLoaded = isDecisionFresh(preflightQuery.isPlaceholderData, preflightQuery.data)

  // 上限：钱包 gAGX 与剩余挖矿额度取较小值
  const spendable = xmineSpendableCap(balance, miningQuota, miningStaked)
  const remainingQuota = miningQuota > miningStaked ? miningQuota - miningStaked : ZERO_BI

  const amountInput = useCappedTokenAmountInput({
    decimals: GAGX_DECIMALS,
    balance: spendable,
    balancesLoaded,
    sessionReady,
  })

  const blockReason = evaluateXmineLive({
    amount: amountInput.amountIn,
    balance,
    allowance,
    miningQuota: remainingQuota,
    isOldAccount: migration.isOldAccount,
  })

  const stake = useChainMutation({
    path: WRITE_PATH.XMINE,
    mutation: (_vars, session) =>
      submitXmineStake({
        session,
        amount: amountInput.amountIn,
      }),
    onSuccess: async () => {
      await present.onSuccess()
      amountInput.clearAmount()
    },
    onError: present.onError,
  })

  // 仅授权不足可点（内联补授权）；其它硬门禁用，文案不变
  const moneyOk = blockReason == null || blockReason === 'insufficientAllowance'
  const canSubmit =
    !writeCtaDisabled({
      isSubmitting: stake.isPending,
      writeReady,
      walletReady,
    }) &&
    amountInput.amountIn > ZERO_BI &&
    moneyOk &&
    preflightQuery.data !== undefined

  function setAmount(value: string) {
    amountInput.setAmount(value)
  }

  function fillMax() {
    amountInput.fillPercent(100)
  }

  return {
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount,
    fillMax,
    balanceLabel:
      preflightQuery.data === undefined
        ? ''
        : formatTokenAmount(preflightQuery.data.balance, GAGX_DECIMALS, PERSONAL_TOKEN_DIGITS),
    quotaLabel:
      preflightQuery.data !== undefined
        ? formatTokenAmount(remainingQuota, GAGX_DECIMALS, 4)
        : formatNumber(0, { digits: 4 }),
    isBalancesLoading: walletReady && preflightQuery.isLoading,
    walletReady,
    canSubmit,
    isSubmitting: stake.isPending,
    blockReason,
    submit: () => stake.mutate(),
    pool: BSC_CONTRACTS.xStakingPool,
  }
}

const ZERO_PCT = `${formatNumber(0, { digits: 2 })}%`

/**
 * Xmine 视图：组合表单状态、余额文案与提交入口
 *
 * @returns Xmine 表单状态与交互回调
 */
export function useXmineDock() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappHost()
  const overviewQuery = useXmineOverviewQuery()
  const xmine = useXmineSession(sessionReady, {
    onSuccess: () => {
      toast.success(t.staking.xmine.success)
    },
  })

  const amountLabel = formatAmountBalanceLabel(t.staking.xmine.amountBalance, {
    balance: sessionReady && walletReady ? xmine.balanceLabel : '',
  })

  const blockHint =
    xmine.blockReason === 'insufficientQuota'
      ? interpolate(t.staking.blocked.insufficientXmineQuotaWithAmount, {
          quota: xmine.quotaLabel || formatNumber(0, { digits: 4 }),
        })
      : writeBlockHint(xmine.blockReason, t.staking.blocked)

  const dailyYieldLabel =
    overviewQuery.data != null
      ? formatXmineDailyYieldLabel(overviewQuery.data.yieldRateBP)
      : ZERO_PCT

  return {
    t,
    xmine,
    sessionReady,
    walletReady,
    setView,
    amountLabel,
    dailyYieldLabel,
    blockHint,
    onSubmit: () => {
      if (xmine.blockReason === 'accountMigrated') return
      xmine.submit()
    },
  }
}

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
/** 下次产出倒计时：没有结算时刻时显示 —，不伪造倒计时。 */
const NEXT_EMISSION_EMPTY = '—'

/**
 * Xmine 详情右栏
 *
 * 仓位链读 `readXminePosition`，记录走 `/x0-mining/logs`；
 * 协议概览走 `readXmineOverview`（totalStakedGagx / xPerAgx / yieldRateBP）。
 * 「累计产出」无协议合计 view → 与资产侧同口径：用户 REWARD 流水累加。
 *
 * @returns 右栏概览、仓位、记录表的展示数据
 * @see docs/backend-api/api.md #x0-mining/logs
 */
export function useXmineDetail() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const [recordsPage, setRecordsPage] = useState(1)
  const positionsQuery = useX0MiningPositions({}, sessionReady)
  const logsQuery = useX0MiningLogs(tablePageQuery(recordsPage), sessionReady)
  // 累加用户历史 REWARD；翻页至覆盖 total（无协议累计 view）
  const rewardLifetime = useX0MiningLifetimeReward(sessionReady)
  const distQuery = useAssetsHoldingsDistribution(sessionReady)
  const overviewQuery = useXmineOverviewQuery()
  const chainPosition = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
    enabled: walletReady,
  })

  const tvlGagxWei = overviewQuery.data?.totalStakedGagx
  const tvlGagx = tvlGagxWei != null ? formatTokenAmountToNumber(tvlGagxWei, GAGX_DECIMALS) : 0
  const agxPerXWei =
    overviewQuery.data != null ? agxAmountPerXFromXPerAgx(overviewQuery.data.xPerAgx) : null
  const agxPerX = agxPerXWei != null ? formatTokenAmountToNumber(agxPerXWei, AGX_DECIMALS) : 0
  const dailyYield =
    overviewQuery.data != null
      ? formatXmineDailyYieldLabel(overviewQuery.data.yieldRateBP)
      : ZERO_PCT
  const lifetimeX = rewardLifetime.data ?? 0

  const overviewItems: Array<{
    hint?: string
    klineHref?: string
    label: string
    value: ReactNode
  }> = [
    {
      label: t.staking.xmine.overviewMetrics[0]?.label ?? '',
      hint: t.staking.xmine.overviewMetrics[0]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(tvlGagx, priceUsd)}
          icon="gagx"
          value={`${formatTokenAmount(tvlGagxWei ?? ZERO_BI, GAGX_DECIMALS, 2)} gAGX`}
        />
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[1]?.label ?? '',
      hint: t.staking.xmine.overviewMetrics[1]?.hint,
      klineHref: `https://dexscreener.com/bsc/${BSC_CONTRACTS.xToken}`,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(agxPerX, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(agxPerXWei ?? ZERO_BI, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[2]?.label ?? '',
      hint: t.staking.xmine.overviewMetrics[2]?.hint,
      value: (
        <StakingTokenMetricValue
          icon="x"
          value={formatNumber(lifetimeX, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' X' })}
        />
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[3]?.label ?? '',
      hint: t.staking.xmine.overviewMetrics[3]?.hint,
      value: (
        <Text as="span" className="font-semibold text-success" variant="copy">
          {dailyYield}
        </Text>
      ),
    },
    {
      label: t.staking.xmine.overviewMetrics[4]?.label ?? '',
      hint: t.staking.xmine.overviewMetrics[4]?.hint,
      value: (
        <Text as="span" className="font-semibold" variant="detail">
          {NEXT_EMISSION_EMPTY}
        </Text>
      ),
    },
  ]

  const apiHeld = parseApiAmountOrZero(
    distQuery.data?.stake_x_pool ?? positionsQuery.data?.total_stake_amount,
  )
  const chainHeld =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.miningStake, GAGX_DECIMALS)
      : null
  const held = chainHeld ?? (walletReady || sessionReady ? apiHeld : 0)

  const pendingX =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.pending, X_DECIMALS)
      : 0
  const pendingValueGagx =
    chainPosition.data != null
      ? formatTokenAmountToNumber(chainPosition.data.pendingValue, GAGX_DECIMALS)
      : 0

  const heldLabel =
    chainPosition.data != null
      ? `${formatTokenAmount(chainPosition.data.miningStake, GAGX_DECIMALS, PERSONAL_TOKEN_DIGITS)} gAGX`
      : formatNumber(held, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' gAGX' })
  const pendingLabel =
    chainPosition.data != null
      ? `${formatTokenAmount(chainPosition.data.pending, X_DECIMALS, PERSONAL_TOKEN_DIGITS)} X`
      : formatNumber(pendingX, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' X' })

  const positionItems: Array<{ label: string; value: ReactNode; hint?: string }> = [
    {
      label: t.staking.xmine.positionMetrics[0]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(held, priceUsd)}
          icon="gagx"
          value={heldLabel}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[1]?.label ?? '',
      // 已释放：本页没有 PRV 已释字段，先显示 0；资产页另有链上口径
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(0, priceUsd)}
          icon="gagx"
          value={formatNumber(0, { digits: PERSONAL_TOKEN_DIGITS, suffix: ' gAGX' })}
        />
      ),
    },
    {
      label: t.staking.xmine.positionMetrics[2]?.label ?? '',
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(pendingValueGagx, priceUsd)}
          icon="x"
          value={pendingLabel}
        />
      ),
    },
  ]

  const recordRows =
    logsQuery.data?.items.map((item) => mapX0MiningLogToOpsRow(item, t.flowOps)) ?? []
  const recordsLoading = sessionReady && logsQuery.isLoading && logsQuery.data == null
  const recordsTotal = logsQuery.data?.total ?? 0
  const recordsSummary = interpolate(t.staking.aside.recordsFooter.xmine, {
    amount: formatNumber(parseApiAmountOrZero(positionsQuery.data?.total_stake_amount), {
      digits: PERSONAL_TOKEN_DIGITS,
    }),
  })

  return {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
    recordsPage,
    recordsTotal,
    recordsSummary,
    setRecordsPage,
  }
}
