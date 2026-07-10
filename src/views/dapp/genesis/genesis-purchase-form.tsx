import { DappInfoTooltip } from '~/app/shell/dapp-info-tooltip'
import { useEffect, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { revealClass } from '~/shared/lib/reveal'
import { toast } from 'sonner'
import { invalidateGenesisPage } from '~/shared/api/query/invalidate'
import { useGenesisWidgetContext } from '~/app/use-genesis-widget-context'
import { formatCount, formatUsdAmountLabel } from '~/shared/api/format-display'
import { seasons as fallbackSeasons } from '~/app/data'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappMetaList } from '~/app/shell/dapp-meta-list'
import { clampGenesisShares, formatGenesisSharesText } from '~/core/presale/presale-math'
import { applyMessageTemplate } from '~/views/dapp/genesis/genesis-promo'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { SeasonSelector } from '~/views/dapp/genesis/season-selector'
import { useDappShell } from '~/app/dapp-shell-context'
import { SeasonOptionSkeleton } from '~/views/dapp/genesis/season-option-skeleton'
import { resolveApiUserFacingError } from '~/shared/api/resolve-api-user-facing-error'
import {
  isUserRejectedWalletError,
  resolveGenesisPurchaseError,
  resolveWalletTransactionError,
} from '~/views/dapp/web3/resolve-contract-error-message'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { GenesisPurchaseSharesField } from '~/views/dapp/genesis/genesis-purchase-shares-field'

/**
 * Remount via `key={address}` from parent when wallet changes — clears draft text
 * without an effect that mirrors genesis.shares.
 */
export function GenesisPurchaseForm() {
  'use memo'
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const genesis = useGenesisWidgetContext()
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
      : formatUsdAmountLabel(genesis.airdropThresholdUsd),
  })

  const handleSharesChange = (value: string) => {
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

  const handleSharesBlur = () => {
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

  async function handleParticipate() {
    const result = await genesis.participate()
    if (result.success) {
      toast.success(t.genesis.joinSuccess)
      window.setTimeout(() => {
        invalidateGenesisPage()
      }, 2000)
      return
    }

    if (result.error) {
      if (isUserRejectedWalletError(result.error)) return
      const message =
        resolveWalletTransactionError(result.error, t.wallet.transactionErrors) ??
        resolveGenesisPurchaseError(result.error, {
          insufficientAllowance: t.genesis.insufficientAllowance,
          insufficientUsd1: t.genesis.insufficientUsd1,
          purchaseUnavailable: t.genesis.purchaseUnavailable,
          walletNotConnected: t.genesis.walletNotConnected,
          notBound: t.genesis.errors.notBound,
          paused: t.genesis.errors.paused,
          invalidAmount: t.genesis.errors.invalidAmount,
          phaseInactive: t.genesis.errors.phaseInactive,
          belowMin: t.genesis.errors.belowMin,
          soldOut: t.genesis.errors.soldOut,
          userLimitExceeded: t.genesis.errors.userLimitExceeded,
          invalidPhase: t.genesis.errors.invalidPhase,
          systemConfig: t.genesis.errors.systemConfig,
        }) ??
        resolveApiUserFacingError(result.error, t.errors.api) ??
        t.errors.chain.fallback
      if (message) toast.error(message)
    }
  }

  useEffect(() => {
    if (!genesis.error) return
    if (isUserRejectedWalletError(genesis.error)) return
    const message =
      resolveApiUserFacingError(genesis.error, t.errors.api) ?? t.errors.loadFailed
    if (message) toast.error(message)
  }, [genesis.error, t.errors.api, t.errors.loadFailed])

  return (
    <>
      {genesis.isLoading && genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mb-1.5 overflow-hidden')} data-reveal>
          <div className="flex gap-2.5">
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
          </div>
        </div>
      ) : (
        <SeasonSelector
          activePhaseIndex={
            genesis.seasonOptions.length > 0 ? genesis.phaseIndex : undefined
          }
          seasons={genesis.seasonOptions.length > 0 ? genesis.seasonOptions : fallbackSeasons}
        />
      )}

      <GenesisPurchaseSharesField
        disabled={!walletReady || genesis.maxShares <= 0}
        inputRef={sharesInputRef}
        label={t.genesis.shares.replace('{max}', formatCount(genesis.maxShares))}
        max={Math.max(genesis.maxShares, 1)}
        maxLabel={t.common.max}
        min={1}
        onBlur={handleSharesBlur}
        onChange={handleSharesChange}
        onMax={() => {
          if (genesis.maxShares <= 0) {
            setShares(0)
            setSharesText('')
            return
          }
          setShares(genesis.maxShares)
          setSharesText(String(genesis.maxShares))
        }}
        shareUnit={t.common.shareUnit}
        value={sharesTextDisplay}
      />

      <DappMetaList
        items={[
          { label: t.genesis.quota, value: genesis.quotaLabel },
          { label: t.genesis.pay, value: genesis.payUsd1Label },
          { label: t.genesis.receive, value: `${genesis.estimatedAgxLabel} AGX` },
          { label: t.genesis.value, value: genesis.contributionValueLabel },
          {
            // 与同级 MetaList label 同阶：外层已是 detail + muted；内层勿再套 Text variant/tone
            label: (
              <span className="inline-flex items-center gap-1">
                {t.genesis.xTokenAirdrop}
                <DappInfoTooltip content={xTokenAirdropHint} />
              </span>
            ),
            value: genesis.xTokenAirdropLabel,
          },
        ]}
      />

      {walletReady ? (
        <DappActionRow className="grid-cols-1">
          <DappActionButton
            density="external"
            disabled={!genesis.canPurchase || genesis.isSubmitting}
            loading={genesis.isSubmitting}
            onClick={() => void handleParticipate()}
            variant="primary"
          >
            {t.genesis.join}
          </DappActionButton>
        </DappActionRow>
      ) : (
        <DappWidgetConnectPromo />
      )}
    </>
  )
}
