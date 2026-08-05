import type { ReactNode } from 'react'

import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useStakeFlowPositions } from '~/hooks/use-api-data'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { formatApproxUsd } from '~/shared/api/format-display'
import { mapStakePositionToAsideRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { RebaseCountdownValue } from '~/views/dapp/staking/rebase-countdown-value'
import {
  formatAsideAgxLabel,
  formatAsideGagxLabel,
  formatAsideRebasePct,
} from '~/views/dapp/staking/staking-aside-format'
import { StakingTokenMetricValue } from '~/views/dapp/staking/staking-token-metric-value'
import { readStakePositions } from '~/web3/assets/assets-read'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

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
export function useStakeDetailAsideView() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
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
