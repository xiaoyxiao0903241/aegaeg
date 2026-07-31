import { useEffect, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { toast } from 'sonner'
import { invalidateGenesisPage } from '~/shared/api/query/invalidate'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { clampGenesisShares, formatGenesisSharesText } from '~/core/presale/presale-math'
import { applyMessageTemplate } from '~/views/dapp/genesis/genesis-promo'
import { useDappShell } from '~/app/use-dapp-shell'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { resolveApiUserFacingError } from '~/shared/api/resolve-api-user-facing-error'
import { usePresentUserFacingError } from '~/hooks/use-present-user-facing-error'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

/**
 * Owns Genesis purchase form chrome (share draft, focus, submit/present).
 * Parent remounts via `key={address}` when wallet changes — clears draft text
 * without an effect that mirrors genesis.shares.
 */
export function useGenesisPurchaseView(genesis: GenesisWidgetState) {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const setShares = genesis.setShares

  const [sharesText, setSharesText] = useState('')

  // Derive display when maxShares drops under the typed draft (no setState-in-effect).
  const sharesTextDisplay =
    sharesText === ''
      ? ''
      : formatGenesisSharesText(
          clampGenesisShares(Number.parseInt(sharesText, 10) || 0, genesis.maxShares),
        )

  const isMobileViewport = useMobileViewport()
  const sharesInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isMobileViewport) return
    sharesInputRef.current?.focus()
  }, [isMobileViewport])

  const xTokenAirdropHint = applyMessageTemplate(t.genesis.xTokenAirdropHint, {
    threshold: genesis.airdropThresholdLoading
      ? '…'
      : formatGroupedNumber(genesis.airdropThresholdUsd, { suffix: ' USD' }),
  })

  function handleSharesChange(value: string) {
    if (value === '') {
      setSharesText('')
      setShares(0)
      return
    }
    if (genesis.maxShares <= 0) {
      setSharesText('')
      setShares(0)
      return
    }
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    const clamped = clampGenesisShares(parsed, genesis.maxShares)
    setSharesText(formatGenesisSharesText(clamped))
    setShares(clamped)
  }

  function handleSharesBlur() {
    if (sharesTextDisplay === '' || Number.parseInt(sharesTextDisplay, 10) < 1) {
      setShares(0)
      setSharesText('')
      return
    }
    if (sharesTextDisplay !== sharesText) {
      setSharesText(sharesTextDisplay)
      setShares(Number.parseInt(sharesTextDisplay, 10))
    }
  }

  function handleSharesMax() {
    if (genesis.maxShares <= 0) {
      setShares(0)
      setSharesText('')
      return
    }
    setShares(genesis.maxShares)
    setSharesText(String(genesis.maxShares))
  }

  function goBindReferrer() {
    goBindReferral()
  }

  async function handlePurchase() {
    const ok = await genesis.submitPurchase()
    if (ok !== true) return
    toast.success(t.genesis.joinSuccess)
    window.setTimeout(() => {
      invalidateGenesisPage()
    }, 2000)
  }

  usePresentUserFacingError(genesis.error, {
    id: 'genesis-query-error',
    resolveMessage: (err) => resolveApiUserFacingError(err, t.errors.api) ?? t.errors.loadFailed,
  })

  const hasUpcomingSeason = genesis.seasonOptions.some((season) => season.status === 'Upcoming')
  const programEnded = !genesis.isLoading && genesis.activePhase === null && !hasUpcomingSeason
  const purchaseCtaLabel =
    genesis.activePhase === null && hasUpcomingSeason ? t.genesis.seasonUpcoming : t.genesis.join

  return {
    t,
    walletReady,
    sharesTextDisplay,
    sharesInputRef,
    xTokenAirdropHint,
    handleSharesChange,
    handleSharesBlur,
    handleSharesMax,
    handlePurchase,
    goBindReferrer,
    programEnded,
    purchaseCtaLabel,
  }
}
