import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { useI18n } from '~/i18n/use-i18n'
import { useDappShell } from '~/app/use-dapp-shell'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import {
  ASSETS_GATE_ERROR,
  submitXmineActivateWarmup,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readXminePosition } from '~/web3/assets/assets-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

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
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const readClient = useChainReadClient()
  const isMobile = useMobileViewport()
  const address = account?.address
  const locked = isUnknownReceiptLocked(WRITE_PATH.ASSETS_CLAIM)
  const [busy, setBusy] = useState(false)
  const [confirmUnstake, setConfirmUnstake] = useState(false)
  const [quote, setQuote] = useState<'agx' | 'usd'>('agx')
  const [nowSec, setNowSec] = useState(0)

  const copy = t.assets.products.xmine
  const pageSize = t.assets.position.pageSize

  const positionQuery = useQuery({
    queryKey: queryKeys.chain.assetsXminePosition(address ?? ''),
    queryFn: () => readXminePosition(address as Address, readClient),
    enabled: walletReady && Boolean(address),
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

  function resolveMessage(error: unknown) {
    const raw = readErrorText(error)
    if (raw === ASSETS_GATE_ERROR.warmupActive) return t.assets.gates.warmupActive
    if (raw === ASSETS_GATE_ERROR.warmupNotEnded) return t.assets.gates.warmupNotEnded
    if (raw === ASSETS_GATE_ERROR.noWarmup) return t.assets.gates.noWarmup
    if (raw === ASSETS_GATE_ERROR.nothingToRedeem) return t.assets.gates.nothingToRedeem
    if (raw === ASSETS_GATE_ERROR.zeroAmount) return t.assets.gates.zeroAmount
    if (raw === ASSETS_GATE_ERROR.unavailable) return t.assets.gates.unavailable
    return (
      resolveWalletTransactionError(error, t.wallet.transactionErrors) ?? t.errors.chain.fallback
    )
  }

  async function handleClaim() {
    setBusy(true)
    try {
      const result = await submitXmineClaim({ account, wallet, readClient })
      if (result.ok) {
        toast.success(t.assets.claim.xmineSuccess)
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  async function handleActivateWarmup() {
    setBusy(true)
    try {
      const result = await submitXmineActivateWarmup({ account, wallet, readClient })
      if (result.ok) {
        toast.success(t.assets.position.activateWarmupSuccess)
        await positionQuery.refetch()
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  async function handleUnstake() {
    setBusy(true)
    try {
      const result = await submitXmineUnstake({ account, wallet, readClient })
      if (result.ok) {
        toast.success(t.assets.redeem.success)
        setConfirmUnstake(false)
        return
      }
      if (result.error != null) presentUserFacingError(result.error, resolveMessage)
    } finally {
      setBusy(false)
    }
  }

  function requestUnstake() {
    if (isMobile) {
      setConfirmUnstake(true)
      return
    }
    void handleUnstake()
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
