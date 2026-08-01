import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useDappShell } from '~/app/use-dapp-shell'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { type Address, BSC_CONTRACTS } from '~/shared/config/contracts'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import {
  submitXmineActivateWarmup,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { readXminePosition } from '~/web3/assets/assets-read'
import { WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

function formatWarmupCountdown(endTime: bigint, nowSec: number): string {
  const left = Math.max(0, Number(endTime) - nowSec)
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function useAssetsXmineView() {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const { walletReady } = useDappShell()
  const isMobile = useMobileViewport()
  const [confirmUnstake, setConfirmUnstake] = useState(false)
  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [nowSec, setNowSec] = useState(0)

  const copy = t.assets.products.xmine
  const pageSize = t.assets.position.pageSize

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

  const warmupGons = position?.warmupGons
  const warmupEndTime = position?.warmupEndTime

  useEffect(() => {
    if (warmupGons == null || warmupGons <= 0n) return
    const tick = () => setNowSec(Math.floor(Date.now() / 1000))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [warmupGons, warmupEndTime])

  const inWarmupLocked = Boolean(
    position &&
    position.warmupGons > 0n &&
    (nowSec === 0 || nowSec < Number(position.warmupEndTime)),
  )
  const warmupReady = Boolean(
    position && position.warmupGons > 0n && nowSec > 0 && nowSec >= Number(position.warmupEndTime),
  )
  const inWarmup = Boolean(position && position.warmupGons > 0n)
  const redeemableStake = position == null ? 0n : inWarmup ? 0n : position.miningStake
  const remainingLabel =
    position == null
      ? '—'
      : inWarmupLocked
        ? nowSec === 0
          ? t.assets.position.lockedPrefix
          : `${t.assets.position.lockedPrefix} ${formatWarmupCountdown(position.warmupEndTime, nowSec)}`
        : warmupReady
          ? t.assets.position.activateWarmup
          : t.assets.position.redeemAnytime
  const voucher = `${BSC_CONTRACTS.xStakingPool.slice(0, 6)}…${BSC_CONTRACTS.xStakingPool.slice(-4)}`
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
    if (isMobile) {
      setConfirmUnstake(true)
      return
    }
    handleUnstake()
  }

  return {
    t,
    setView,
    walletReady,
    copy,
    pageSize,
    quote,
    setQuote,
    isLoading: positionQuery.isLoading,
    position,
    isEmpty,
    remainingLabel,
    voucher,
    totalRows,
    warmupReady,
    inWarmup,
    redeemableStake,
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
