import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { aggregateStakeRelease } from '~/core/staking/aggregate-stake-release'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  scenarioPeriodYieldPct,
} from '~/core/staking/staking-yield'
import { formatAmountBalanceLabel, writeBlockHint, writeCtaLabel } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useStakeFlowPositions } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatNumber, formatUsdApprox } from '~/shared/presenters/format'
import { mapStakePositionToAsideRow } from '~/shared/presenters/map-flow-log-rows'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { goBindReferral } from '~/views/dapp/shared/navigation'
import { RebaseCountdownValue } from '~/views/dapp/shared/rebase-countdown'
import { StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import { formatRebasePct, parseApiAmountOrZero } from '~/views/dapp/staking/shared'
import { STAKING_BLOCKED } from '~/views/dapp/staking/stake/submit-stake'
import { useStakeSession } from '~/views/dapp/staking/stake/use-stake-session'
import { readStakePositions } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

const YIELD_EMPTY = `${formatNumber(0, { digits: 2 })}%`

function formatYieldPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatNumber(pct, { digits: 2 })}%`
}

function formatBonusPct(bps: number): string {
  return `${formatNumber(bps / 100, { digits: 0, trimZeros: true })}%`
}

/**
 * 质押视图：组合表单状态、CTA 文案与提交入口
 *
 * 提交被推荐关系拦截时引导补绑；
 * 被迁移拦截时停留在原页。
 *
 * @returns 质押表单状态与交互回调
 */
export function useStakeDock() {
  const { messages: t } = useI18n()
  const setView = useStakingViewStore((state) => state.setView)
  const { sessionReady, walletReady } = useDappHost()
  const overviewQuery = useStakingHubOverviewQuery()

  const stake = useStakeSession(sessionReady, {
    onOpenSuccess: () => {
      toast.success(t.staking.stake.success)
    },
    onError: (error) => {
      if (readErrorText(error) === STAKING_BLOCKED.notBound) goBindReferral()
    },
  })

  const periodOptions = [
    { label: t.staking.stake.periods.liquid, value: 'liquid' },
    { label: t.staking.stake.periods.d180, value: '180' },
    { label: t.staking.stake.periods.d360, value: '360' },
    { label: t.staking.stake.periods.d540, value: '540' },
  ]

  const lockLabel =
    stake.period === 'liquid'
      ? t.staking.stake.meta.lockLiquid
      : interpolate(t.staking.stake.meta.lockDays, { days: stake.period })

  const amountLabel = formatAmountBalanceLabel(t.staking.stake.amountBalance, {
    balance: sessionReady && walletReady ? stake.balanceLabel : '',
    digits: 2,
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })
  const quotaLabel = formatTokenAmount(stake.remainingQuota, AGX_DECIMALS, 4)
  const quotaCopy =
    stake.quotaKind === 'personalDaily'
      ? t.staking.blocked.insufficientQuotaPersonalDailyWithAmount
      : stake.quotaKind === 'personal'
        ? t.staking.blocked.insufficientQuotaPersonalWithAmount
        : t.staking.blocked.insufficientQuotaPoolWithAmount
  const blockHint =
    stake.blockReason === 'insufficientQuota'
      ? interpolate(quotaCopy, { quota: quotaLabel })
      : writeBlockHint(stake.blockReason, t.staking.blocked)

  const epochPct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct, overviewQuery.data?.epochsPerDay)
  const yieldMeta = {
    baseDaily: formatYieldPct(baseDaily),
    periodYield: formatYieldPct(
      scenarioPeriodYieldPct(epochPct, overviewQuery.data?.epochsPerDay, stake.period, 'stake'),
    ),
    bonus: formatBonusPct(lockedBonusBps(stake.period)),
  }

  async function onSubmit() {
    if (stake.blockReason === 'accountMigrated') return
    if (stake.blockReason === 'notBound') {
      goBindReferral()
      return
    }
    await stake.submit()
  }

  return {
    t,
    stake,
    sessionReady,
    walletReady,
    setView,
    periodOptions,
    lockLabel,
    amountLabel,
    quotaLabel,
    ctaLabel,
    blockHint,
    yieldMeta,
    onSubmit,
  }
}

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

/**
 * 质押详情右栏
 *
 * 协议概览走 StakingPool / sAGX；
 * 仓位五卡与资产页同源链读；
 * 记录表走 OpenAPI `stake-flow/positions`。
 *
 * @returns 右栏概览、仓位、记录表的展示数据
 * @see docs/backend-api/api.md #stake-flow/positions
 */
export function useStakeDetail() {
  const { messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const [recordsPage, setRecordsPage] = useState(1)
  const recordsQuery = useStakeFlowPositions(tablePageQuery(recordsPage), sessionReady)
  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
  })

  const poolAgxWei = overviewQuery.data?.poolAgxBalance
  const poolAgx = poolAgxWei != null ? formatTokenAmountToNumber(poolAgxWei, AGX_DECIMALS) : 0
  const epochNumber = overviewQuery.data?.epochNumber ?? ZERO_BI
  const rebaseLabel = formatRebasePct(overviewQuery.data?.rebaseRate1e18)

  const overviewItems: Array<{ label: string; value: ReactNode; hint?: string }> = [
    {
      label: t.staking.stake.overviewMetrics[0]?.label ?? '总质押量',
      hint: t.staking.stake.overviewMetrics[0]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(poolAgx, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(poolAgxWei ?? ZERO_BI, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: t.staking.stake.overviewMetrics[1]?.label ?? '当前 Epoch',
      hint: t.staking.stake.overviewMetrics[1]?.hint,
      value: `#${epochNumber.toString()}`,
    },
    {
      label: t.staking.stake.overviewMetrics[2]?.label ?? '下一次 Rebase 发放',
      hint: t.staking.stake.overviewMetrics[2]?.hint,
      value: <RebaseCountdownValue />,
    },
    {
      label: t.staking.stake.overviewMetrics[3]?.label ?? '当前 Rebase 收益率',
      hint: t.staking.stake.overviewMetrics[3]?.hint,
      value: rebaseLabel,
    },
  ]

  const stakeRows = walletReady && stakeQuery.data != null ? stakeQuery.data : []
  let principal = ZERO_BI
  let blockReward = ZERO_BI
  let extraInterest = ZERO_BI
  for (const row of stakeRows) {
    principal += row.principal
    blockReward += row.blockReward
    extraInterest += row.extraInterest
  }
  const { released, pending } = aggregateStakeRelease(stakeRows)

  const stakeHeld = formatTokenAmountToNumber(principal, AGX_DECIMALS)
  const stakeReleased = formatTokenAmountToNumber(released, AGX_DECIMALS)
  const stakePending = formatTokenAmountToNumber(pending, AGX_DECIMALS)
  const rebaseGagx = formatTokenAmountToNumber(blockReward, GAGX_DECIMALS)
  const bonusGagx = formatTokenAmountToNumber(extraInterest, GAGX_DECIMALS)

  const metrics = t.staking.aside.positionMetrics
  const positionItems: Array<{ label: string; value: ReactNode; hint?: string }> = [
    {
      label: metrics[0]?.label ?? '我的持仓',
      hint: metrics[0]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(stakeHeld, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(principal, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: metrics[1]?.label ?? '已释放',
      hint: metrics[1]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(stakeReleased, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(released, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: metrics[2]?.label ?? '待释放',
      hint: metrics[2]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(stakePending, priceUsd)}
          icon="agx"
          value={`${formatTokenAmount(pending, AGX_DECIMALS, 2)} AGX`}
        />
      ),
    },
    {
      label: metrics[3]?.label ?? '当前Rebase 收益',
      hint: metrics[3]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(rebaseGagx, priceUsd)}
          icon="gagx"
          value={`${formatTokenAmount(blockReward, GAGX_DECIMALS, 2)} gAGX`}
        />
      ),
    },
    {
      label: metrics[4]?.label ?? '当前Rebase 加成',
      hint: metrics[4]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatUsdApprox(bonusGagx, priceUsd)}
          icon="gagx"
          value={`${formatTokenAmount(extraInterest, GAGX_DECIMALS, 2)} gAGX`}
        />
      ),
    },
  ]

  const recordRows =
    recordsQuery.data?.items.map((item) => mapStakePositionToAsideRow(item, t.flowOps)) ?? []
  const recordsLoading = sessionReady && recordsQuery.isLoading && recordsQuery.data == null
  const recordsTotal = recordsQuery.data?.total ?? 0
  const recordsSummary = interpolate(t.staking.aside.recordsFooter.stake, {
    amount: formatNumber(parseApiAmountOrZero(recordsQuery.data?.total_stake_amount), {
      digits: 2,
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
