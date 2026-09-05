import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'

import {
  formatTokenAmount,
  formatTokenAmountToNumber,
  PERSONAL_TOKEN_DIGITS,
} from '~/core/exchange/token-amount'
import { sumLoadedWei } from '~/core/query/sum-loaded-wei'
import { aggregateStakeRelease } from '~/core/staking/aggregate-stake-release'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  scenarioPeriodYieldPct,
  YIELD_EPOCHS_PER_DAY,
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
import { formatDecimal, interpolateLive, toUsd } from '~/shared/presenters/format'
import { mapStakePositionToAsideRow } from '~/shared/presenters/map-flow-log-rows'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { goBindReferral } from '~/views/dapp/shared/navigation'
import { RebaseCountdownValue } from '~/views/dapp/shared/rebase-countdown'
import { StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import {
  formatBonusPct,
  formatRebasePct,
  formatWeiUsdApprox,
  formatYieldPct,
} from '~/views/dapp/staking/shared'
import { STAKING_BLOCKED } from '~/views/dapp/staking/stake/submit-stake'
import { useStakeSession } from '~/views/dapp/staking/stake/use-stake-session'
import { readStakePositions } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
import {
  useLatestSagxRebaseRateQuery,
  useStakingHubOverviewQuery,
} from '~/web3/staking/use-staking-queries'

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
  const rebaseQuery = useLatestSagxRebaseRateQuery()

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
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })
  const quotaLabel = formatTokenAmount(stake.remainingQuota, AGX_DECIMALS, {
    digits: PERSONAL_TOKEN_DIGITS,
    trimZeros: false,
    suffix: ' AGX',
  })
  const quotaCopy =
    stake.quotaKind === 'personalDaily'
      ? t.staking.blocked.insufficientQuotaPersonalDailyWithAmount
      : stake.quotaKind === 'personal'
        ? t.staking.blocked.insufficientQuotaPersonalWithAmount
        : t.staking.blocked.insufficientQuotaPoolWithAmount
  const blockHint =
    stake.blockReason === 'insufficientQuota'
      ? interpolateLive(quotaCopy, { quota: quotaLabel })
      : writeBlockHint(stake.blockReason, t.staking.blocked)

  const epochPct = epochRebasePctFrom1e18(rebaseQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct, YIELD_EPOCHS_PER_DAY)
  const yieldMeta = {
    baseDaily: formatYieldPct(baseDaily),
    periodYield: formatYieldPct(
      scenarioPeriodYieldPct(epochPct, YIELD_EPOCHS_PER_DAY, stake.period, 'stake'),
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
  const { sessionReady } = useDappHost()
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const rebaseQuery = useLatestSagxRebaseRateQuery()
  const [recordsPage, setRecordsPage] = useState(1)
  const recordsQuery = useStakeFlowPositions(tablePageQuery(recordsPage), sessionReady)
  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
  })

  const poolAgxWei = overviewQuery.data?.poolAgxBalance
  const poolAgx = poolAgxWei != null ? formatTokenAmountToNumber(poolAgxWei, AGX_DECIMALS) : null
  const epochNumber = overviewQuery.data?.epochNumber
  const rebaseLabel = formatRebasePct(rebaseQuery.data?.rebaseRate1e18)

  const overviewItems: Array<{ label: string; value: ReactNode; hint?: string }> = [
    {
      label: t.staking.stake.overviewMetrics[0]?.label ?? '总质押量',
      hint: t.staking.stake.overviewMetrics[0]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatDecimal(toUsd(poolAgx, priceUsd), { digits: 2, prefix: '≈ $' })}
          icon="agx"
          value={formatTokenAmount(poolAgxWei, AGX_DECIMALS, {
            digits: 2,
            trimZeros: false,
            suffix: ' AGX',
          })}
        />
      ),
    },
    {
      label: t.staking.stake.overviewMetrics[1]?.label ?? '当前 Epoch',
      hint: t.staking.stake.overviewMetrics[1]?.hint,
      value: epochNumber != null ? `#${epochNumber.toString()}` : formatDecimal(null),
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

  const stakeRows = stakeQuery.data
  const principal = sumLoadedWei(stakeRows, (row) => row.principal)
  const blockReward = sumLoadedWei(stakeRows, (row) => row.blockReward)
  const extraInterest = sumLoadedWei(stakeRows, (row) => row.extraInterest)
  const release = stakeRows == null ? null : aggregateStakeRelease(stakeRows)
  const released = release?.released ?? null
  const pending = release?.pending ?? null

  const metrics = t.staking.aside.positionMetrics
  const positionItems: Array<{ label: string; value: ReactNode; hint?: string }> = [
    {
      label: metrics[0]?.label ?? '我的持仓',
      hint: metrics[0]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatWeiUsdApprox(principal, AGX_DECIMALS, priceUsd)}
          icon="agx"
          value={formatTokenAmount(principal, AGX_DECIMALS, {
            digits: PERSONAL_TOKEN_DIGITS,
            trimZeros: false,
            suffix: ' AGX',
          })}
        />
      ),
    },
    {
      label: metrics[1]?.label ?? '已释放',
      hint: metrics[1]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatWeiUsdApprox(released, AGX_DECIMALS, priceUsd)}
          icon="agx"
          value={formatTokenAmount(released, AGX_DECIMALS, {
            digits: PERSONAL_TOKEN_DIGITS,
            trimZeros: false,
            suffix: ' AGX',
          })}
        />
      ),
    },
    {
      label: metrics[2]?.label ?? '待释放',
      hint: metrics[2]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatWeiUsdApprox(pending, AGX_DECIMALS, priceUsd)}
          icon="agx"
          value={formatTokenAmount(pending, AGX_DECIMALS, {
            digits: PERSONAL_TOKEN_DIGITS,
            trimZeros: false,
            suffix: ' AGX',
          })}
        />
      ),
    },
    {
      label: metrics[3]?.label ?? '当前Rebase 收益',
      hint: metrics[3]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatWeiUsdApprox(blockReward, GAGX_DECIMALS, priceUsd)}
          icon="gagx"
          value={formatTokenAmount(blockReward, GAGX_DECIMALS, {
            digits: PERSONAL_TOKEN_DIGITS,
            trimZeros: false,
            suffix: ' gAGX',
          })}
        />
      ),
    },
    {
      label: metrics[4]?.label ?? '当前Rebase 加成',
      hint: metrics[4]?.hint,
      value: (
        <StakingTokenMetricValue
          approx={formatWeiUsdApprox(extraInterest, GAGX_DECIMALS, priceUsd)}
          icon="gagx"
          value={formatTokenAmount(extraInterest, GAGX_DECIMALS, {
            digits: PERSONAL_TOKEN_DIGITS,
            trimZeros: false,
            suffix: ' gAGX',
          })}
        />
      ),
    },
  ]

  const recordRows =
    recordsQuery.data?.items.map((item) => mapStakePositionToAsideRow(item, t.flowOps)) ?? []
  const recordsLoading = sessionReady && recordsQuery.isLoading && recordsQuery.data == null
  const recordsTotal = recordsQuery.data?.total ?? 0
  const recordsSummary = interpolateLive(t.staking.aside.recordsFooter.stake, {
    amount: formatDecimal(recordsQuery.data?.total_stake_amount, {
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
