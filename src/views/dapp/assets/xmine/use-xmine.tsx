import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useX0MiningLogs } from '~/hooks/use-api-data'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { formatUsdApprox } from '~/shared/api/format-display'
import { mapX0MiningLogToOpsRow } from '~/shared/api/map-flow-log-rows'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import type { AssetsSortKey } from '~/views/dapp/assets/primitives'
import {
  submitXmineActivateWarmup,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { readXminePosition } from '~/web3/assets/assets-read'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

/**
 * X 挖矿侧栏的状态编排
 *
 * 管理报价币与排序、挖矿仓位查询、领取 / 激活 / 退出写交易
 * 及退出确认弹窗状态。
 */
export function useXmineDock() {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const { walletReady } = useDappHost()
  const [confirmUnstake, setConfirmUnstake] = useState(false)
  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [sort, setSort] = useState<AssetsSortKey>('startNear')

  const copy = t.assets.products.xmine
  const pageSize = t.assets.position.pageSize

  const sortOptions = useMemo(
    () =>
      (['startNear', 'startFar', 'endNear', 'endFar'] as const).map((value) => ({
        value,
        label: t.assets.position.sortOptions[value],
      })),
    [t.assets.position.sortOptions],
  )

  const positionQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
  })

  const claim = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) => submitXmineClaim({ session }),
    onSuccess: () => {
      toast.success(t.assets.claim.xmineSuccess)
    },
  })

  const activateWarmup = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) => submitXmineActivateWarmup({ session }),
    onSuccess: async () => {
      toast.success(t.assets.position.activateWarmupSuccess)
      await positionQuery.refetch()
    },
  })

  const unstake = useChainMutation({
    path: WRITE_PATH.ASSETS_CLAIM,
    mutation: (_vars, session) => submitXmineUnstake({ session }),
    onSuccess: () => {
      toast.success(t.assets.redeem.success)
      setConfirmUnstake(false)
    },
  })

  const position = positionQuery.data
  const isEmpty = !position || (position.miningStake <= 0n && position.pending <= 0n)
  const voucherAddress = BSC_CONTRACTS.xStakingPool
  const totalRows = isEmpty ? 0 : 1

  const busy = claim.isPending || activateWarmup.isPending || unstake.isPending
  const locked = claim.isLocked

  function handleClaim() {
    void claim.mutate()
  }

  function handleActivateWarmup() {
    void activateWarmup.mutate()
  }

  function handleUnstake() {
    void unstake.mutate()
  }

  function requestUnstake() {
    setConfirmUnstake(true)
  }

  return {
    t,
    setView,
    walletReady,
    copy,
    pageSize,
    quote,
    setQuote,
    sort,
    setSort,
    sortOptions,
    isLoading: positionQuery.isLoading,
    position,
    isEmpty,
    voucherAddress,
    totalRows,
    busy,
    locked,
    confirmUnstake,
    setConfirmUnstake,
    handleClaim,
    handleActivateWarmup,
    handleUnstake,
    requestUnstake,
  }
}

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export type AssetsXmineStatCell = {
  value: string
  approx?: string
  icon?: 'gagx' | 'x'
}

/** X 挖矿右侧统计：仅读取链上仓位；累计产出暂无数据来源 */
export function useAssetsXmineStats(): AssetsXmineStatCell[] {
  const { walletReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()

  const positionQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
  })

  if (!walletReady || !address || positionQuery.isError) {
    return Array.from({ length: 4 }, () => ({
      value: '0.00 gAGX',
      approx: formatUsdApprox(0, null),
    }))
  }
  if (positionQuery.data === undefined) {
    return Array.from({ length: 4 }, () => ({
      value: '0.00 gAGX',
      approx: formatUsdApprox(0, null),
    }))
  }

  const { miningStake, pending, warmupGons } = positionQuery.data
  // 无份额转金额的接口，可赎回估算为 warmup 结束后的全部质押，否则为 0
  const released = warmupGons > 0n ? 0n : miningStake

  return [
    ...(
      [
        {
          amount: miningStake,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        {
          amount: released,
          decimals: GAGX_DECIMALS,
          unit: 'gAGX',
          icon: 'gagx' as const,
          price: priceUsd,
        },
        { amount: pending, decimals: X_DECIMALS, unit: 'X', icon: 'x' as const, price: null },
      ] as const
    ).map(({ amount, decimals, unit, icon, price }) => ({
      value: `${formatTokenAmount(amount, decimals, 2)} ${unit}`,
      icon,
      approx: formatUsdApprox(formatTokenAmountToNumber(amount, decimals), price),
    })),
    { value: '0.00 X', icon: 'x', approx: formatUsdApprox(0, null) },
  ]
}

/** X 挖矿操作记录：拉取挖矿日志并映射为表格行 */
export function useAssetsXmineOpsRows() {
  const { sessionReady } = useDappHost()
  const logs = useX0MiningLogs({}, sessionReady)
  return {
    rows: logs.data?.items.map(mapX0MiningLogToOpsRow) ?? [],
    isLoading: sessionReady && logs.isLoading,
  }
}
