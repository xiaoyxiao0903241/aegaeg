import { useMemo, useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import type { AssetsSortKey } from '~/views/dapp/assets/assets-quote-toolbar'
import {
  submitXmineActivateWarmup,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { readXminePosition } from '~/web3/assets/assets-read'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

/**
 * X 挖矿侧栏的状态编排
 *
 * 管理报价币与排序、挖矿仓位查询、领取 / 激活 / 退出写交易
 * 及退出确认弹窗状态。
 */
export function useAssetsXmineView() {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
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
