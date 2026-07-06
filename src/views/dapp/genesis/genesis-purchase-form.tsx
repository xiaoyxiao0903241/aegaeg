import { DappInfoTooltip } from '~/app/components/dapp-info-tooltip'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { revealClass } from '~/shared/lib/reveal'
import { toast } from 'sonner'
import { invalidateGenesisPage } from '~/shared/api/query/invalidate'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { formatCount, formatUsdAmountLabel } from '~/shared/api/format-display'
import { seasons as fallbackSeasons } from '~/app/data'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import { applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { SeasonSelector } from '~/app/components/season-selector'
import { useDappShell } from '~/app/dapp-shell-context'
import { SeasonOptionSkeleton } from '~/app/components/dapp-skeleton'
import { resolveContractErrorMessage, resolveGenesisPurchaseError, resolveWalletTransactionError } from '~/views/dapp/web3/resolve-contract-error-message'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { GenesisPurchaseSharesField } from '~/views/dapp/genesis/genesis-purchase-shares-field'

export function GenesisPurchaseForm() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const genesis = useGenesisWidgetContext()

  useEffect(() => {
    genesis.setShares(0)
  }, [genesis.setShares])

  const [sharesText, setSharesText] = useState('')
  useEffect(() => {
    setSharesText(genesis.shares === 0 ? '' : String(genesis.shares))
  }, [genesis.shares])

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
      genesis.setShares(0)
      return
    }
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) return
    const clamped = Math.min(Math.max(parsed, 1), Math.max(genesis.maxShares, 1))
    setSharesText(String(clamped))
    genesis.setShares(clamped)
  }

  const handleSharesBlur = () => {
    if (sharesText === '' || Number.parseInt(sharesText, 10) < 1) {
      genesis.setShares(0)
      setSharesText('')
    }
  }

  const handleParticipate = useCallback(async () => {
    const result = await genesis.participate()
    if (result.success) {
      toast.success(t.genesis.joinSuccess)
      window.setTimeout(() => {
        invalidateGenesisPage()
      }, 2000)
      return
    }

    if (result.error) {
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
      })
      if (message) toast.error(message)
    }
  }, [
    genesis,
    t.genesis.errors,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.joinSuccess,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
    t.wallet.transactionErrors,
  ])

  useEffect(() => {
    if (!genesis.error) return
    const message = resolveContractErrorMessage(genesis.error, {
      insufficientAllowance: t.genesis.insufficientAllowance,
      insufficientUsd1: t.genesis.insufficientUsd1,
    })
    if (message) toast.error(message)
  }, [genesis.error, t.genesis.insufficientAllowance, t.genesis.insufficientUsd1])

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
        disabled={!walletReady}
        inputRef={sharesInputRef}
        label={t.genesis.shares.replace('{max}', formatCount(genesis.maxShares))}
        max={Math.max(genesis.maxShares, 1)}
        maxLabel={t.common.max}
        min={1}
        onBlur={handleSharesBlur}
        onChange={handleSharesChange}
        onMax={() => genesis.setShares(Math.max(genesis.maxShares, 1))}
        shareUnit={t.common.shareUnit}
        value={sharesText}
      />

      <DappMetaList
        items={[
          { label: t.genesis.quota, value: genesis.quotaLabel },
          { label: t.genesis.pay, value: genesis.payUsd1Label },
          { label: t.genesis.receive, value: `${genesis.estimatedAgxLabel} AGX` },
          { label: t.genesis.value, value: genesis.contributionValueLabel },
          {
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
