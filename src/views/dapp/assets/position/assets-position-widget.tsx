import { useAssetsViewStore } from '~/stores/assets-view-store'
import { DappTabHeader } from '~/app/shell/dapp-tab-header'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/app/assets'
import { DappActionButton } from '~/app/shell/dapp-action-button'
import { DappIcon } from '~/app/shell/dapp-icon'
import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { formatBlockTime } from '~/shared/api/format-display'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { openStakingView } from '~/shared/config/open-staking-view'
import { Button } from '~/shared/ui/button'
import { Card } from '~/shared/ui/card'
import { Chip } from '~/shared/ui/chip'
import { Text } from '~/shared/ui/text'
import { AssetsClaimModal } from '~/views/dapp/assets/claim-modal/assets-claim-modal'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { DappWidgetStack } from '~/app/shell/dapp-widget-frame'
import {
  useAssetsPositionWidget,
  type AssetsProduct,
} from '~/views/dapp/assets/position/use-assets-position-widget'

export type { AssetsProduct }

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals
const GAGX_DECIMALS = EXCHANGE_CONFIG.tokens.gagx.decimals

export function AssetsPositionWidget({ product }: { product: AssetsProduct }) {
  const { messages: t } = useI18n()
  const setView = useAssetsViewStore((state) => state.setView)
  const w = useAssetsPositionWidget(product)

  return (
    <>
      <DappTabHeader
        backText={t.assets.backToHub}
        onBack={() => setView('hub')}
        subtitle={w.copy.intro}
        title={w.copy.title}
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
                onClick={() => w.setQuote('agx')}
                shape="pill"
                size="sm"
                type="button"
                variant={w.quote === 'agx' ? 'solid' : 'soft'}
              >
                AGX
              </Chip>
              <Chip
                onClick={() => w.setQuote('usd')}
                shape="pill"
                size="sm"
                type="button"
                variant={w.quote === 'usd' ? 'solid' : 'soft'}
              >
                USD
              </Chip>
            </div>
          </div>
        </div>

        {!w.walletReady ? (
          <DappWidgetConnectPromo />
        ) : w.isLoading ? (
          <Text as="p" tone="muted-foreground" variant="copy">
            …
          </Text>
        ) : w.isEmpty ? (
          <div className="grid gap-3">
            <Text as="p" tone="muted-foreground" variant="copy">
              {w.copy.empty}
            </Text>
            <Button onClick={() => openStakingView(w.stakingTarget)} type="button">
              {w.copy.emptyCta}
            </Button>
          </div>
        ) : product === 'stake' ? (
          w.pagedStakeRows.map((row) => {
            const reward = row.blockReward + row.extraInterest
            const canClaim = reward > 0n
            const canRedeem = row.kind === 'liquid' ? row.principal > 0n : row.claimableBalance > 0n
            const periodLabel = w.formatPeriodLabel(row.period)
            const voucher =
              row.kind === 'locked' && row.pool
                ? `${row.pool.slice(0, 6)}…${row.pool.slice(-4)}`
                : null
            return (
              <Card key={row.id} surface="outlined" className="grid gap-2 p-4 shadow-none">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
                    {periodLabel}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.remaining}
                    </Text>
                    <Text as="span" className="text-sm" variant="detail">
                      {row.expiry > 0n ? formatBlockTime(Number(row.expiry)) : '—'}
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                      {t.assets.position.staked}
                    </Text>
                    <Text as="strong" className="text-base font-semibold" variant="copy">
                      {formatTokenAmount(row.principal, AGX_DECIMALS, 2)} AGX
                    </Text>
                    {row.releasedPrincipal > 0n ? (
                      <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
                        <Text as="span" className="text-xs text-primary" variant="detail">
                          {formatTokenAmount(row.releasedPrincipal, AGX_DECIMALS, 2)} AGX
                        </Text>
                      </span>
                    ) : null}
                  </div>
                  <div className="grid justify-items-end gap-1 text-right">
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                      {t.assets.position.yield}
                    </Text>
                    <Text
                      as="strong"
                      className="text-base font-semibold text-primary"
                      variant="copy"
                    >
                      {formatTokenAmount(reward, GAGX_DECIMALS, 2)} gAGX
                    </Text>
                    {row.extraInterest > 0n ? (
                      <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
                        <Text as="span" className="text-xs text-primary" variant="detail">
                          {formatTokenAmount(row.extraInterest, GAGX_DECIMALS, 2)} gAGX
                        </Text>
                      </span>
                    ) : null}
                    {w.quote === 'usd' ? (
                      <Text as="span" tone="muted-foreground" variant="detail">
                        {w.formatRewardUsd(reward)}
                      </Text>
                    ) : null}
                  </div>
                </div>
                {voucher ? (
                  <div className="flex items-center justify-end gap-1">
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                      {t.assets.position.voucher}
                    </Text>
                    <Text as="span" className="text-xs" variant="detail">
                      {voucher}
                    </Text>
                  </div>
                ) : null}
                <div className="grid grid-cols-2 gap-3">
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={!canClaim || w.locked || w.busy}
                    onClick={() => w.openStakeClaim(row)}
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={!canRedeem || w.locked || w.busy}
                    onClick={() => w.requestRedeem('stake', row)}
                    variant="secondary"
                  >
                    {row.kind === 'liquid' ? t.assets.position.unlock : t.assets.position.redeem}
                  </DappActionButton>
                </div>
              </Card>
            )
          })
        ) : (
          w.pagedBondRows.map((row) => {
            const canClaim = row.profit > 0n
            const canRedeem = row.pendingPayout > 0n
            const periodLabel = w.formatPeriodLabel(String(row.period))
            const voucher = `${row.depository.slice(0, 6)}…${row.depository.slice(-4)}`
            return (
              <Card key={row.id} surface="outlined" className="grid gap-2 p-4 shadow-none">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-full bg-muted px-3 text-xs text-muted-foreground">
                    {periodLabel}
                  </span>
                  <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
                    <Text as="span" tone="muted-foreground" variant="detail">
                      {t.assets.position.remaining}
                    </Text>
                    <Text as="span" className="text-sm" variant="detail">
                      {row.vestingEndTime > 0n ? formatBlockTime(Number(row.vestingEndTime)) : '—'}
                    </Text>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1">
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                      {t.assets.position.bondPrincipal}
                    </Text>
                    <Text as="strong" className="text-base font-semibold" variant="copy">
                      {formatTokenAmount(row.payoutRemaining, AGX_DECIMALS, 2)} AGX
                    </Text>
                    {row.pendingPayout > 0n ? (
                      <span className="inline-flex w-fit items-center gap-1 rounded-[10px] bg-primary-soft px-2 py-0.5">
                        <Text as="span" className="text-xs text-primary" variant="detail">
                          {formatTokenAmount(row.pendingPayout, AGX_DECIMALS, 2)} AGX
                        </Text>
                      </span>
                    ) : null}
                  </div>
                  <div className="grid justify-items-end gap-1 text-right">
                    <Text as="span" className="text-xs" tone="muted-foreground" variant="detail">
                      {t.assets.position.yield}
                    </Text>
                    <Text
                      as="strong"
                      className="text-base font-semibold text-primary"
                      variant="copy"
                    >
                      {formatTokenAmount(row.profit, GAGX_DECIMALS, 2)} gAGX
                    </Text>
                    {w.quote === 'usd' ? (
                      <Text as="span" tone="muted-foreground" variant="detail">
                        {w.formatRewardUsd(row.profit)}
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
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={!canClaim || w.locked || w.busy}
                    onClick={() => w.openBondClaim(row)}
                  >
                    {t.assets.position.claim}
                  </DappActionButton>
                  <DappActionButton
                    className="h-7 min-h-7 text-xs"
                    density="inverse"
                    disabled={!canRedeem || w.locked || w.busy}
                    onClick={() => w.requestRedeem('bond', row)}
                    variant="secondary"
                  >
                    {t.assets.position.redeem}
                  </DappActionButton>
                </div>
              </Card>
            )
          })
        )}

        {!w.isEmpty && w.walletReady ? (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <Text as="span" tone="muted-foreground" variant="detail">
              {t.common.paginationTotal.replace('{total}', String(w.totalRows))} ·{' '}
              {t.common.paginationPerPage.replace('{size}', String(w.pageSize))}
            </Text>
            <div className="flex gap-2">
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled={w.safePage <= 0}
                onClick={() => w.setPage((value) => Math.max(0, value - 1))}
                shape="pill"
                size="sm"
                type="button"
                variant="ghost"
              >
                {t.common.paginationPrev}
              </Button>
              <Button
                className="h-auto min-h-0 w-auto px-3 py-1 text-xs"
                disabled={w.safePage >= w.pageCount - 1}
                onClick={() => w.setPage((value) => Math.min(w.pageCount - 1, value + 1))}
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

      <AssetsClaimModal
        amountLabel={w.claim.open ? w.claim.amountLabel : ''}
        onOpenChange={(open) => {
          if (!open) w.closeClaim()
        }}
        open={w.claim.open}
        positionLabel={w.claim.open ? w.claim.label : ''}
        target={w.claim.open ? w.claim.target : null}
      />

      <AssetsRedeemConfirm
        busy={w.busy}
        onConfirm={w.confirmRedeem}
        onOpenChange={(open) => {
          if (!open) w.closeRedeem()
        }}
        open={w.redeem.open}
      />
    </>
  )
}
