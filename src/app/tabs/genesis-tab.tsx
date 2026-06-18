import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { Button } from '~/components/button'
import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { buttonDisabledClass } from '~/components/button'
import { revealClass } from '~/lib/reveal'
import { toast } from 'sonner'
import {
  usePerformance,
  useSalesLogs,
} from '~/hooks/use-api-data'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import {
  calcProgressPercent,
  formatUsd,
  mapSalesLogToDesktopRow,
  mapSalesLogToMobileRow,
  sumSalesLogAmountUsd,
} from '~/lib/api/format-display'
import { PRESALE_CONFIG } from '~/config/presale'
import { BSC_CONTRACTS } from '~/config/contracts'
import { bscscanAddress } from '~/config/explorer'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { dappAssets } from '~/app/assets'
import { seasons as fallbackSeasons } from '~/app/data'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { MetricCard } from '~/app/components/dapp-card'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import { DappSection } from '~/app/components/dapp-section'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { FaqList } from '~/components/faq-list'
import { GenesisPromoCard } from '~/app/components/genesis-promo-card'
import { MetricGrid } from '~/app/components/metric-grid'
import { ProgressMeter } from '~/app/components/progress-meter'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { SeasonSelector } from '~/app/components/season-selector'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { useAuth } from '~/providers/auth-provider'
import {
  DappSkeleton,
  MetricCardSkeleton,
  SeasonOptionSkeleton,
} from '~/app/components/dapp-skeleton'
import { resolveContractErrorMessage, resolveGenesisPurchaseError } from '~/lib/web3/resolve-contract-error-message'
import { formatTokenAmount } from '~/lib/swap/token-amount'

const MAX_SHARES = 100

export function GenesisWidget({
  onSelectGenesis,
}: {
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const genesis = useGenesisWidgetContext()
  const seasonIntro = t.genesis.intro
    .replace('{season}', String(genesis.activeSeasonNumber))
    .replace('{discount}', genesis.isLoading ? '…' : genesis.discountLabel)

  const handleSharesChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) {
      genesis.setShares(1)
      return
    }
    genesis.setShares(Math.min(Math.max(parsed, 1), MAX_SHARES))
  }

  const handleApprove = useCallback(async () => {
    const result = await genesis.approve()
    if (result.success) {
      toast.success(t.swap.approveSuccess)
      return
    }

    if (!result.error) return
    const message = resolveGenesisPurchaseError(result.error, {
      insufficientAllowance: t.genesis.insufficientAllowance,
      insufficientUsd1: t.genesis.insufficientUsd1,
      purchaseUnavailable: t.genesis.purchaseUnavailable,
      walletNotConnected: t.genesis.walletNotConnected,
    })
    if (message) toast.error(message)
  }, [
    genesis,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
    t.swap.approveSuccess,
  ])

  const handleParticipate = useCallback(async () => {
    const result = await genesis.purchase()
    if (result.success) {
      toast.success(t.genesis.joinSuccess)
      return
    }

    if (result.error) {
      const message = resolveGenesisPurchaseError(result.error, {
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        walletNotConnected: t.genesis.walletNotConnected,
      })
      if (message) toast.error(message)
    }
  }, [
    genesis,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.joinSuccess,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
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
    <DappWidgetFrame
      className="dapp:[&>*]:shrink-0 max-dapp:flex max-dapp:flex-col max-dapp:gap-3"
      subtitle={seasonIntro}
      title={t.genesis.title}
    >
      {genesis.isLoading && genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mt-3.5 grid gap-2 max-dapp:mt-0')} data-reveal>
          <SeasonOptionSkeleton />
          <SeasonOptionSkeleton />
          <SeasonOptionSkeleton />
        </div>
      ) : (
        <SeasonSelector
          seasons={genesis.seasonOptions.length > 0 ? genesis.seasonOptions : fallbackSeasons}
        />
      )}

      <label className="mt-3.5 grid gap-2 text-xs leading-[1.5] text-muted-foreground max-dapp:mt-0">
        <span>{t.genesis.shares}</span>
        <div className="flex gap-2">
          <input
            className="w-full min-w-0 min-h-11 rounded-[11px] border border-border bg-card px-[14px] text-base font-bold text-foreground outline-none focus:border-primary max-dapp:h-[46px] max-dapp:min-h-[46px]"
            disabled={!walletReady}
            max={MAX_SHARES}
            min={1}
            onChange={(e) => handleSharesChange(e.target.value)}
            type="number"
            value={genesis.shares}
          />
          <button
            className={cn(
              'min-h-11 min-w-[66px] shrink-0 rounded-[11px] border border-border bg-accent px-[15px] text-xs font-bold whitespace-nowrap text-primary max-dapp:h-[46px] max-dapp:min-h-[46px]',
              buttonDisabledClass,
              'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
            )}
            disabled={!walletReady}
            onClick={() => genesis.setShares(MAX_SHARES)}
            type="button"
          >
            {t.common.max}
          </button>
        </div>
      </label>

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
                <AnchoredTooltip content={t.genesis.xTokenAirdropHint}>
                  <button
                    aria-label={t.genesis.xTokenAirdropHint}
                    className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border border-current text-[9px] font-bold leading-none opacity-60"
                    type="button"
                  >
                    i
                  </button>
                </AnchoredTooltip>
              </span>
            ),
            value: genesis.xTokenAirdropLabel,
          },
        ]}
      />

      <DappActionRow className={cn(genesis.isApproved ? 'grid-cols-1' : undefined, 'max-dapp:mt-0')}>
        {!genesis.isApproved ? (
          <DappActionButton
            disabled={!walletReady || !genesis.canPurchase || genesis.isSubmitting}
            loading={genesis.submittingAction === 'approve'}
            onClick={() => void handleApprove()}
            variant="secondary"
          >
            {t.swap.approve}
          </DappActionButton>
        ) : null}
        <DappActionButton
          disabled={!walletReady || !genesis.canPurchase || genesis.isSubmitting}
          loading={genesis.submittingAction === 'purchase'}
          onClick={() => void handleParticipate()}
          variant="primary"
        >
          {t.genesis.join}
        </DappActionButton>
      </DappActionRow>

      <GenesisPromoCard
        className="hidden max-dapp:grid"
        isLoading={genesis.isLoading}
        onClick={onSelectGenesis}
        promo={genesis.promoSnapshot}
      />
    </DappWidgetFrame>
  )
}

export function GenesisContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const isMobileViewport = useMobileViewport()
  const { isLoggingIn } = useAuth()
  const genesis = useGenesisWidgetContext()
  const seasonStatsTitle = t.genesis.statsTitle.replace(
    '{season}',
    String(genesis.activeSeasonNumber),
  )
  const [contributionsPage, setContributionsPage] = useState(1)
  const { data: performance } = usePerformance(sessionReady)
  const { data: salesLogs, isLoading: salesLoading } = useSalesLogs(
    tablePageQuery(contributionsPage),
    sessionReady,
  )

  const phaseMaxUsd1 = Number(
    PRESALE_CONFIG.phases[genesis.phaseIndex]?.maxUsd1 ??
      PRESALE_CONFIG.phases[0]?.maxUsd1 ??
      10000,
  )
  const chainMaxContribution = genesis.activePhase
    ? Number(formatTokenAmount(genesis.activePhase.maxAmount, 18, 0))
    : 0
  const maxContribution =
    chainMaxContribution > 0 ? chainMaxContribution : phaseMaxUsd1
  const chainContributedUsd = Number(formatTokenAmount(genesis.userTotal, 18, 0))
  const apiContributedUsd = Number(performance?.presale_volume ?? 0)
  const salesLogsTotalUsd = sumSalesLogAmountUsd(salesLogs?.items ?? [])
  const contributedUsd = Math.max(apiContributedUsd, chainContributedUsd, salesLogsTotalUsd)
  const contributed = String(contributedUsd)
  const contributionProgress = calcProgressPercent(contributed, maxContribution)
  const contributedLabel = `${formatUsd(contributed)} / ${formatUsd(maxContribution)}`

  const desktopRows =
    salesLogs?.items.map((item) => mapSalesLogToDesktopRow(item, genesis.agxPriceUsd)) ?? []
  const mobileRows =
    salesLogs?.items.map((item) => mapSalesLogToMobileRow(item, genesis.agxPriceUsd)) ?? []
  const tableRows = isMobileViewport ? mobileRows : desktopRows
  const tableHeaders = isMobileViewport
    ? [t.tables.time, t.tables.paid, t.tables.discount, t.tables.estimatedAgx]
    : [t.tables.time, t.tables.paid, t.tables.discount, t.tables.estimatedAgx, t.tables.tx]
  const tableLinkColumns = isMobileViewport ? [] : [4]
  const contributionsTotal = salesLogs?.total ?? 0
  const showSalesSyncHint =
    sessionReady && !salesLoading && desktopRows.length === 0 && genesis.userTotal > 0n
  const contributionsTable = dappTableViewState({
    sessionReady,
    isLoading: isLoggingIn || salesLoading,
    isLoggingIn,
    rowCount: desktopRows.length,
  })

  return (
    <DappDetailPage>
      <DappContentHeading id="genesis-title">{seasonStatsTitle}</DappContentHeading>

      <MetricGrid columns={4}>
        {genesis.isLoading && genesis.phases.length === 0 ? (
          <>
            <MetricCardSkeleton className="max-dapp:rounded-[14px]" />
            <MetricCardSkeleton className="max-dapp:rounded-[14px]" />
            <MetricCardSkeleton className="max-dapp:rounded-[14px]" />
            <MetricCardSkeleton className="max-dapp:rounded-[14px]" />
          </>
        ) : (
          <>
            <MetricCard
              className="[&_strong]:tabular-nums"
              label={
                genesis.countdownMode === 'ends' ? t.genesis.endsIn : t.genesis.startsIn
              }
              value={genesis.countdown}
            />
            <MetricCard
              className="[&_strong]:tabular-nums"
              label={<span className="text-muted-foreground">{t.genesis.referencePrice}</span>}
              value={genesis.referencePriceLabel}
            />
            <MetricCard
              className="[&_strong]:tabular-nums"
              label={t.genesis.discountRatio}
              value={genesis.discountLabel}
            />
            <MetricCard
              label={t.genesis.xAirdropRatio}
              value={genesis.airdropLabel}
            />
          </>
        )}
      </MetricGrid>

      <section className="mt-8 max-dapp:!hidden">
        <div
          className={cn(
            revealClass(),
            // Figma `tc` 82:683 — 780×125；Globe 190:339 288×185 @ (456,-24)；卡片 overflow:hidden 裁切，不撑出滚动
            'relative mt-3.5 min-h-[125px] overflow-hidden rounded-md bg-dark p-6 shadow-card',
          )}
          data-reveal
        >
          <div className="relative z-1">
            <span className="text-[11px] font-bold leading-[1.3] tracking-[1.2px] text-coral-bright">
              {t.genesis.globalLabel}
            </span>
            <strong className="mt-[7px] block text-[21px] font-bold leading-[1.25] text-white">
              {genesis.isLoading && genesis.phases.length === 0 ? (
                <DappSkeleton className="h-6 w-40" tone="dark" />
              ) : genesis.globalPurchasedLoading ? (
                <DappSkeleton className="h-6 w-40" tone="dark" />
              ) : (
                `${genesis.globalPurchasedLabel} USD1`
              )}
            </strong>
            <p className="mt-2.5 mb-0 max-w-[70ch] text-[13px] leading-[1.5] text-white">
              {t.genesis.globalBody}
            </p>
          </div>
          <Button
            className={cn(
              'absolute right-[22px] top-[43px] z-[2] !gap-1.5 !border-[oklch(100%_0_0/45%)] !bg-transparent !px-[18px] !text-white',
              'hover:!border-[oklch(100%_0_0/80%)] focus-visible:!border-[oklch(100%_0_0/80%)]',
              '[&_img]:size-[15px] [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
            )}
            onClick={() =>
              window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
            }
            size="md"
            type="button"
            variant="secondary"
          >
            {t.genesis.viewContract}
            <img alt="" height="15" src={dappAssets.arrowUpRight} width="15" />
          </Button>
          <img
            alt=""
            className="pointer-events-none absolute top-0 right-9 h-auto w-[min(44%,320px)] select-none opacity-[0.78]"
            draggable={false}
            height={250}
            loading="lazy"
            src={dappAssets.genesisGlobe}
            width={597}
          />
        </div>
      </section>

      <DappSection
        className="group-data-[tab=genesis]/shell:max-dapp:mt-0"
        title={t.genesis.myContributions}
      >
        <div
          className={cn(
            revealClass(),
            'mt-3.5 max-dapp:mt-3 max-dapp:rounded-2xl max-dapp:bg-card max-dapp:p-4 max-dapp:shadow-card',
          )}
          data-reveal
        >
          <div className="mb-3 grid gap-1.5 border-0 bg-transparent p-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
                {t.genesis.totalContributed}
              </span>
              <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
                {contributedLabel}
              </strong>
            </div>
            <ProgressMeter
              label={t.genesis.totalContributed}
              value={contributionProgress}
            />
          </div>
          {showSalesSyncHint ? (
            <p className="mb-3 text-[13px] leading-normal text-muted-foreground">
              {t.genesis.contributionsSyncPending}
            </p>
          ) : null}
          {contributionsTable.requiresAuth ? (
            <DappTableEmptyState />
          ) : contributionsTable.queryEmpty && !showSalesSyncHint ? (
            <DappTableEmptyMessage title={t.genesis.contributionsEmpty.title} />
          ) : (
            <>
              <ResponsiveTable
                compact
                headers={tableHeaders}
                isLoading={contributionsTable.showSkeleton}
                loadingRowCount={4}
                plain
                linkColumns={tableLinkColumns}
                positiveColumns={[2]}
                rows={tableRows}
              />
              <DappTablePagination
                onPageChange={setContributionsPage}
                page={contributionsPage}
                total={contributionsTotal}
              />
            </>
          )}
        </div>
      </DappSection>

      <DappSection title={t.genesis.faq.title}>
        <FaqList items={t.genesis.faq.items} variant="dapp" />
      </DappSection>
    </DappDetailPage>
  )
}
