import type { ReactNode } from 'react'
import { toast } from 'sonner'

import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import {
  baseDailyPctFromEpoch,
  epochRebasePctFrom1e18,
  lockedBonusBps,
  periodYieldPct,
  stakePeriodDays,
} from '~/core/staking/staking-yield-display'
import { formatAmountBalanceLabel, writeCtaLabel } from '~/core/wallet/write-cta'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useStakeFlowPositions } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd, formatGroupedNumber } from '~/shared/api/format-display'
import { mapStakePositionToAsideRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { goBindReferral } from '~/shared/config/go-bind-referral'
import { useStakingViewStore } from '~/stores/staking-view-store'
import { RebaseCountdownValue, StakingTokenMetricValue } from '~/views/dapp/staking/primitives'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
} from '~/views/dapp/staking/shared'
import { STAKING_BLOCKED } from '~/views/dapp/staking/stake/submit-stake'
import { useStakeWidget } from '~/views/dapp/staking/stake/use-stake-widget'
import { readStakePositions } from '~/web3/assets/assets-read'
import { readErrorText } from '~/web3/errors/error-text'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

const YIELD_EMPTY = `${formatGroupedNumber(0, { digits: 2 })}%`

function formatYieldPct(pct: number | null): string {
  if (pct == null || !Number.isFinite(pct)) return YIELD_EMPTY
  return `${formatGroupedNumber(pct, { digits: 2 })}%`
}

function formatBonusPct(bps: number): string {
  return `${formatGroupedNumber(bps / 100, { digits: 0, trimZeros: true })}%`
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

  const stake = useStakeWidget(sessionReady, {
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
      : t.staking.stake.meta.lockDays.replace('{days}', stake.period)

  const amountLabel = formatAmountBalanceLabel(t.staking.stake.amountBalance, {
    balance: !sessionReady || !walletReady ? '0.00' : stake.balanceLabel,
  })

  const ctaLabel = writeCtaLabel(stake.writePhase, {
    accountMigrated: t.staking.blocked.accountMigrated,
    bindReferral: t.staking.stake.bindCta,
    submit: t.staking.stake.submit,
  })

  const epochPct = epochRebasePctFrom1e18(overviewQuery.data?.rebaseRate1e18)
  const baseDaily = baseDailyPctFromEpoch(epochPct)
  const bonusBps = lockedBonusBps(stake.period)
  const yieldMeta = {
    baseDaily: formatYieldPct(baseDaily),
    periodYield: formatYieldPct(
      baseDaily == null ? null : periodYieldPct(baseDaily, stakePeriodDays(stake.period)),
    ),
    bonus: formatBonusPct(bonusBps),
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
    ctaLabel,
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
  const account = useActiveAccount()
  const walletReady = hasWalletAccount(account)
  const priceUsd = useAgxPriceUsd()
  const overviewQuery = useStakingHubOverviewQuery()
  const recordsQuery = useStakeFlowPositions({}, sessionReady)
  const stakeQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsStakePositions,
    queryFn: (addr) => readStakePositions(addr as Address),
  })

  const poolAgx =
    overviewQuery.data != null
      ? formatTokenAmountToNumber(overviewQuery.data.poolAgxBalance, AGX_DECIMALS)
      : 0
  const epochNumber = overviewQuery.data?.epochNumber ?? 0n
  const rebaseLabel = formatAsideRebasePct(overviewQuery.data?.rebaseRate1e18)

  const overviewItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: t.staking.stake.overviewMetrics[0]?.label ?? '总质押量',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(poolAgx, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(poolAgx)}
        />
      ),
    },
    {
      label: t.staking.stake.overviewMetrics[1]?.label ?? '当前 Epoch',
      value: `#${epochNumber.toString()}`,
    },
    {
      label: t.staking.stake.overviewMetrics[2]?.label ?? '下一次 Rebase 发放',
      value: (
        <RebaseCountdownValue
          currentBlock={overviewQuery.data?.currentBlock}
          epochEndBlock={overviewQuery.data?.epochEndBlock}
        />
      ),
    },
    {
      label: t.staking.stake.overviewMetrics[3]?.label ?? '当前 Rebase 收益率',
      value: rebaseLabel,
    },
  ]

  const stakeRows = walletReady && stakeQuery.data != null ? stakeQuery.data : []
  let principal = 0n
  let released = 0n
  let pending = 0n
  let blockReward = 0n
  let extraInterest = 0n
  for (const row of stakeRows) {
    principal += row.principal
    released += row.releasedPrincipal
    pending += row.principal > row.releasedPrincipal ? row.principal - row.releasedPrincipal : 0n
    blockReward += row.blockReward
    extraInterest += row.extraInterest
  }

  const stakeHeld = formatTokenAmountToNumber(principal, AGX_DECIMALS)
  const stakeReleased = formatTokenAmountToNumber(released, AGX_DECIMALS)
  const stakePending = formatTokenAmountToNumber(pending, AGX_DECIMALS)
  const rebaseGagx = formatTokenAmountToNumber(blockReward, GAGX_DECIMALS)
  const bonusGagx = formatTokenAmountToNumber(extraInterest, GAGX_DECIMALS)

  const metrics = t.staking.aside.positionMetrics
  const positionItems: Array<{ label: string; value: ReactNode }> = [
    {
      label: metrics[0]?.label ?? '我的持仓',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakeHeld, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakeHeld)}
        />
      ),
    },
    {
      label: metrics[1]?.label ?? '已释放',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakeReleased, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakeReleased)}
        />
      ),
    },
    {
      label: metrics[2]?.label ?? '待释放',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(stakePending, priceUsd)}
          icon="agx"
          value={formatAsideAgxLabel(stakePending)}
        />
      ),
    },
    {
      label: metrics[3]?.label ?? '当前Rebase 收益',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(rebaseGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(rebaseGagx)}
        />
      ),
    },
    {
      label: metrics[4]?.label ?? '当前Rebase 加成',
      value: (
        <StakingTokenMetricValue
          approx={formatApproxUsd(bonusGagx, priceUsd)}
          icon="gagx"
          value={formatAsideGagxLabel(bonusGagx)}
        />
      ),
    },
  ]

  const recordRows = recordsQuery.data?.items.map(mapStakePositionToAsideRow) ?? []
  const recordsLoading = sessionReady && recordsQuery.isLoading && recordsQuery.data == null

  return {
    overviewItems,
    positionItems,
    recordRows,
    recordsLoading,
  }
}
