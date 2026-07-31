import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
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
import { messageFromSentinels } from '~/web3/errors/message-from-sentinels'
import { presentSubmitResult } from '~/web3/present-submit-result'
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

  function toUserMessage(error: unknown) {
    return messageFromSentinels(
      error,
      [
        [ASSETS_GATE_ERROR.warmupActive, t.assets.gates.warmupActive],
        [ASSETS_GATE_ERROR.warmupNotEnded, t.assets.gates.warmupNotEnded],
        [ASSETS_GATE_ERROR.noWarmup, t.assets.gates.noWarmup],
        [ASSETS_GATE_ERROR.nothingToRedeem, t.assets.gates.nothingToRedeem],
        [ASSETS_GATE_ERROR.zeroAmount, t.assets.gates.zeroAmount],
        [ASSETS_GATE_ERROR.unavailable, t.assets.gates.unavailable],
      ],
      (err) =>
        resolveWalletTransactionError(err, t.wallet.transactionErrors) ?? t.errors.chain.fallback,
    )
  }

  async function handleClaim() {
    setBusy(true)
    try {
      const result = await submitXmineClaim({ account, wallet, readClient })
      await presentSubmitResult(result, t.assets.claim.xmineSuccess, toUserMessage)
    } finally {
      setBusy(false)
    }
  }

  async function handleActivateWarmup() {
    setBusy(true)
    try {
      const result = await submitXmineActivateWarmup({ account, wallet, readClient })
      if (result.ok) await positionQuery.refetch()
      await presentSubmitResult(result, t.assets.position.activateWarmupSuccess, toUserMessage)
    } finally {
      setBusy(false)
    }
  }

  async function handleUnstake() {
    setBusy(true)
    try {
      const result = await submitXmineUnstake({ account, wallet, readClient })
      if (result.ok) setConfirmUnstake(false)
      await presentSubmitResult(result, t.assets.redeem.success, toUserMessage)
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
