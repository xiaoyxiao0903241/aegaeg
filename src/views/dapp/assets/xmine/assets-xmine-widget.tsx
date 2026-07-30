import { useQuery } from '@tanstack/react-query'
import { useAssetsViewStore } from '~/stores/assets-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS, type Address } from '~/shared/config/contracts'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { openStakingView } from '~/shared/config/open-staking-view'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import {
  ASSETS_GATE_ERROR,
  submitXmineActivateWarmup,
  submitXmineClaim,
  submitXmineUnstake,
} from '~/views/dapp/assets/submit-assets'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { presentUserFacingError } from '~/web3/present-user-facing-error'
import { readErrorText } from '~/web3/errors/error-text'
import { resolveWalletTransactionError } from '~/web3/resolve-contract-error-message'
import { useActiveAccount, useActiveWallet } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readXminePosition } from '~/web3/assets/assets-read'
import { isUnknownReceiptLocked, WRITE_PATH } from '~/web3/wallet/unknown-receipt-lock'

const X_DECIMALS = EXCHANGE_CONFIG.tokens.x.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

function formatWarmupCountdown(endTime: bigint, nowSec: number): string {
  const left = Math.max(0, Number(endTime) - nowSec)
  const h = Math.floor(left / 3600)
  const m = Math.floor((left % 3600) / 60)
  const s = left % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function AssetsXmineWidget() {
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

  return (
    <>
      <DappTabHeader
        backText={t.assets.backToHub}
        onBack={() => setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      />
      <DappWidgetStack>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Chip className="h-6 gap-1" shape="pill" size="sm" type="button" variant="soft">
            {t.assets.position.sort}
            <DappIcon alt="" className="size-2.5" size="sm" src={dappAssets.chevron} />
          </Chip>
          <div className="flex items-center gap-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.assets.position.quoteCurrency}
            </Text>
            <div className="flex rounded-full bg-muted p-0.5">
              <Chip
                onClick={() => setQuote('agx')}
                shape="pill"
                size="sm"
                type="button"
                variant={quote === 'agx' ? 'solid' : 'soft'}
              >
                AGX
              </Chip>
              <Chip
                onClick={() => setQuote('usd')}
                shape="pill"
                size="sm"
                type="button"
                variant={quote === 'usd' ? 'solid' : 'soft'}
              >
                USD
              </Chip>
            </div>
          </div>
        </div>

        {!walletReady ? (
          <DappWidgetConnectPromo />
        ) : positionQuery.isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : isEmpty || !position ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {copy.empty}
            </Text>
            <Button onClick={() => openStakingView('xmine')} type="button">
              {copy.emptyCta}
            </Button>
          </div>
        ) : (
          <Card surface="outlined" className="grid gap-2 p-4 shadow-none">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
                {copy.periodPill}
              </span>
              <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                <Text as="span" tone="muted-foreground" variant="detail">
                  {t.assets.position.remaining}
                </Text>
                <Text as="span" className="text-sm" variant="detail">
                  {remainingLabel}
                </Text>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-1">
                <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                  {t.assets.position.staked}
                </Text>
                <Text as="strong" className="text-base font-semibold" variant="copy">
                  {formatTokenAmount(position.miningStake, GAGX_DECIMALS, 2)} gAGX
                </Text>
                <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
                  <Text as="span" className="text-xs text-primary" variant="detail">
                    {formatTokenAmount(redeemableStake, GAGX_DECIMALS, 2)} gAGX
                  </Text>
                </span>
              </div>
              <div className="grid justify-items-end gap-1 text-right">
                <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                  {copy.output}
                </Text>
                <Text as="strong" className="text-base font-semibold text-primary" variant="copy">
                  {formatTokenAmount(position.pending, X_DECIMALS, 2)} X
                </Text>
                {quote === 'usd' ? (
                  <Text as="span" tone="muted-foreground" variant="detail">
                    ≈ —
                  </Text>
                ) : null}
              </div>
            </div>
            <div className="flex items-center justify-end gap-1">
              <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                {t.assets.position.voucher}
              </Text>
              <Text as="span" className="text-xs" variant="detail">
                {voucher}
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {warmupReady ? (
                <DappActionButton
                  className="col-span-2 h-7 min-h-7 text-xs"
                  density="inverse"
                  disabled={locked || busy}
                  onClick={() => void handleActivateWarmup()}
                >
                  {t.assets.position.activateWarmup}
                </DappActionButton>
              ) : (
                <>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={position.pending <= 0n || inWarmup || locked || busy}
                    onClick={() => void handleClaim()}
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={position.gons <= 0n || inWarmup || locked || busy}
                    onClick={requestUnstake}
                    variant="secondary"
                  >
                    {t.assets.position.redeem}
                  </DappActionButton>
                </>
              )}
            </div>
          </Card>
        )}

        {!isEmpty && walletReady ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(pageSize))}
            </Text>
            <div className="flex gap-2">
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationPrev}
              </Button>
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationNext}
              </Button>
            </div>
          </div>
        ) : null}
      </DappWidgetStack>

      <AssetsRedeemConfirm
        busy={busy}
        onConfirm={() => void handleUnstake()}
        onOpenChange={setConfirmUnstake}
        open={confirmUnstake}
      />
    </>
  )
}
