import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappActionRow } from '~/app/shell/dapp-action-row'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { goBindReferral } from '~/app/shell/go-bind-referral'
import { formatGroupedNumber } from '~/shared/api/format-display'
import { Card } from '~/shared/components/card'
import { List } from '~/shared/components/list'
import { Tooltip } from '~/shared/components/tooltip'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { GenesisPurchaseSharesField } from '~/views/dapp/genesis/genesis-purchase-shares-field'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'
import { GenesisSeasonCarousel } from '~/views/dapp/genesis/season/genesis-season-carousel'
import { SeasonOptionSkeleton } from '~/views/dapp/genesis/season/genesis-season-option-skeleton'
import { useGenesisPurchaseView } from '~/views/dapp/genesis/use-genesis-purchase-view'

/**
 * Remount via `key={address}` from parent when wallet changes — clears draft text
 * without an effect that mirrors genesis.shares.
 */
export function GenesisPurchaseForm({ genesis }: { genesis: GenesisWidgetState }) {
  const vm = useGenesisPurchaseView(genesis)
  const { t } = vm

  return (
    <>
      {genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mb-1.5 overflow-hidden')} data-reveal>
          <div className="flex gap-2.5">
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
            <SeasonOptionSkeleton />
          </div>
        </div>
      ) : (
        <GenesisSeasonCarousel
          activePhaseIndex={genesis.phaseIndex}
          seasons={genesis.seasonOptions}
        />
      )}

      <GenesisPurchaseSharesField
        disabled={!vm.walletReady || genesis.maxShares <= 0}
        inputRef={vm.sharesInputRef}
        label={t.genesis.shares.replace(
          '{max}',
          formatGroupedNumber(genesis.maxShares, { digits: 0, trimZeros: true }),
        )}
        max={Math.max(genesis.maxShares, 1)}
        maxLabel={t.common.max}
        min={1}
        onBlur={vm.handleSharesBlur}
        onChange={vm.handleSharesChange}
        onMax={vm.handleSharesMax}
        shareUnit={t.common.shareUnit}
        value={vm.sharesTextDisplay}
      />

      <Card as="div" surface="outlined">
        <List
          items={[
            { label: t.genesis.quota, value: genesis.quotaLabel },
            { label: t.genesis.pay, value: genesis.payUsd1Label },
            { label: t.genesis.receive, value: `${genesis.estimatedAgxLabel} AGX` },
            { label: t.genesis.value, value: genesis.contributionValueLabel },
            {
              // Label 已是 detail + muted；内层勿再套 Text variant/tone
              label: (
                <span className="inline-flex items-center gap-1">
                  {t.genesis.xTokenAirdrop}
                  <Tooltip.Info content={vm.xTokenAirdropHint} />
                </span>
              ),
              value: genesis.xTokenAirdropLabel,
            },
          ]}
        />
      </Card>

      {vm.walletReady ? (
        <DappActionRow className="grid-cols-1">
          {vm.programEnded ? (
            <DappActionButton density="card" disabled variant="secondary">
              {t.genesis.joinEnded}
            </DappActionButton>
          ) : genesis.needsReferralBind ? (
            <DappActionButton density="card" onClick={() => goBindReferral()} variant="primary">
              {t.genesis.goBindReferrer}
            </DappActionButton>
          ) : (
            <DappActionButton
              className="min-h-11"
              density="card"
              disabled={!genesis.canPurchase || genesis.isSubmitting}
              loading={genesis.isSubmitting}
              onClick={() => void vm.handlePurchase()}
              variant="primary"
            >
              {vm.purchaseCtaLabel}
            </DappActionButton>
          )}
        </DappActionRow>
      ) : (
        <DappWidgetConnectPromo />
      )}
    </>
  )
}
