import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { useAgxPriceUsd } from '~/hooks/use-agx-price-usd'
import { useX0MiningLifetimeReward, useX0MiningLogs } from '~/hooks/use-api-data'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { formatNumber, formatUsdApprox } from '~/shared/presenters/format'
import { mapX0MiningLogToOpsRow } from '~/shared/presenters/map-flow-log-rows'
import { useXmineSessionStore } from '~/stores/assets-session-store'
import { useAssetsViewStore } from '~/stores/assets-view-store'
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
 * 及退出确认弹窗状态。报价 / 排序在 `useXmineSessionStore`；
 * 退出确认用本地 `useState`（`AssetsDockBody` 以 address 为 key remount 复位）。
 */
export function useXmineDock() {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const { walletReady } = useDappHost()
  const { quote, setQuote, sort, setSort } = useXmineSessionStore()
  const [confirmUnstake, setConfirmUnstake] = useState(false)

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
  const isEmpty = !position || (position.miningStake <= ZERO_BI && position.pending <= ZERO_BI)
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

/** X 挖矿右侧统计：链上仓位 + 用户 REWARD 流水累加「累计产出」 */
export function useAssetsXmineStats(): AssetsXmineStatCell[] {
  const { walletReady, sessionReady } = useDappHost()
  const account = useActiveAccount()
  const address = account?.address
  const priceUsd = useAgxPriceUsd()

  const positionQuery = useChainQuery({
    queryKey: queryKeys.chain.assetsXminePosition,
    queryFn: (addr) => readXminePosition(addr as Address),
  })
  // 累加用户历史 REWARD；翻页至覆盖 total（无协议累计 view）
  const rewardLifetime = useX0MiningLifetimeReward(sessionReady)

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

  const { miningStake, pending } = positionQuery.data
  // 无 PRV「已释放」映射 → 不把 miningStake 冒充已释放
  const released = ZERO_BI
  const lifetimeX = rewardLifetime.data ?? 0

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
    {
      value: `${formatNumber(lifetimeX, { digits: 2 })} X`,
      icon: 'x',
      approx: formatUsdApprox(0, null),
    },
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
