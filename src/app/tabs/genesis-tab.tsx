import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { Button } from '~/components/button'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import { buttonDisabledClass } from '~/components/button'
import { revealClass } from '~/lib/reveal'
import { toast } from 'sonner'
import { useSalesLogs } from '~/hooks/use-api-data'
import { invalidateGenesisPage } from '~/lib/query/invalidate'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import {
  calcProgressPercent,
  formatCount,
  formatUsd,
  formatUsdAmountLabel,
  mapSalesLogToDesktopRow,
} from '~/lib/api/format-display'
import { BSC_CONTRACTS } from '~/config/contracts'
import { bscscanAddress, bscscanTx } from '~/config/explorer'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { seasons as fallbackSeasons } from '~/app/data'
import { DappActionButton } from '~/app/components/dapp-action-button'
import { DappActionRow } from '~/app/components/dapp-action-row'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { MetricCard } from '~/app/components/dapp-card'
import { DappMetaList } from '~/app/components/dapp-meta-list'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { DappSection } from '~/app/components/dapp-section'
import { DappWidgetFrame } from '~/app/components/dapp-widget-frame'
import { FaqList } from '~/components/faq-list'
import { formatGenesisSeasonIntro, applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { buildGenesisFaqTemplateValues } from '~/lib/presale/genesis-faq'
import { DappWidgetConnectPromo } from '~/app/components/dapp-widget-connect-footer'
import { MetricGrid } from '~/app/components/metric-grid'
import { ProgressMeter } from '~/app/components/progress-meter'
import { DappTableAuthPrompt } from '~/app/components/dapp-table-auth-prompt'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { DappTableCard } from '~/app/components/dapp-table-card'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { dappTableViewState, tablePageQuery } from '~/lib/table-pagination'
import { SeasonSelector } from '~/app/components/season-selector'
import { useDappShell } from '~/app/dapp-shell-context'
import { useAuth } from '~/providers/auth-provider'
import {
  DappSkeleton,
  MetricCardSkeleton,
  SeasonOptionSkeleton,
} from '~/app/components/dapp-skeleton'
import { resolveContractErrorMessage, resolveGenesisPurchaseError } from '~/lib/web3/resolve-contract-error-message'
import { formatTokenAmountToNumber } from '~/lib/swap/token-amount'

export function GenesisWidget() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const genesis = useGenesisWidgetContext()

  useEffect(() => {
    genesis.setShares(0)
  }, [genesis.setShares])

  // Mirror shares as editable text; default empty so the placeholder is shown.
  const [sharesText, setSharesText] = useState('')
  useEffect(() => {
    setSharesText(genesis.shares === 0 ? '' : String(genesis.shares))
  }, [genesis.shares])

  const sharesInputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    sharesInputRef.current?.focus()
  }, [])

  const seasonIntro = formatGenesisSeasonIntro(
    t.genesis.intro,
    genesis.activeSeasonNumber,
    genesis.discountLabel,
    genesis.isLoading,
  )
  const xTokenAirdropHint = applyMessageTemplate(t.genesis.xTokenAirdropHint, {
    threshold: genesis.airdropThresholdLoading
      ? '…'
      : formatUsdAmountLabel(genesis.airdropThresholdUsd),
  })

  const handleSharesChange = (value: string) => {
    // Allow clearing the field — keep the raw text so it can be empty.
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
      const message = resolveGenesisPurchaseError(result.error, {
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
    <DappWidgetFrame subtitle={seasonIntro} title={t.genesis.title}>
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

      <label className="grid gap-2 text-xs leading-[1.5] text-muted-foreground">
        <span>{t.genesis.shares.replace('{max}', formatCount(genesis.maxShares))}</span>
        <div className="flex gap-2">
          <div className="relative flex min-w-0 flex-1">
            <input
              ref={sharesInputRef}
              className="w-full min-w-0 rounded-sm border border-border bg-card py-2.5 pl-3.5 pr-10 text-base font-bold text-foreground outline-none placeholder:text-placeholder [appearance:textfield] focus:border-primary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              disabled={!walletReady}
              max={Math.max(genesis.maxShares, 1)}
              min={1}
              onBlur={handleSharesBlur}
              onChange={(e) => handleSharesChange(e.currentTarget.value)}
              placeholder="0"
              type="number"
              value={sharesText}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-sm text-muted-foreground"
            >
              {t.common.shareUnit}
            </span>
          </div>
          <button
            className={cn(
              'min-w-16 shrink-0 rounded-sm border border-border bg-accent px-3.5 py-2.5 text-xs font-bold whitespace-nowrap text-primary',
              buttonDisabledClass,
              'disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100',
            )}
            disabled={!walletReady}
            onClick={() => genesis.setShares(Math.max(genesis.maxShares, 1))}
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
                <AnchoredTooltip content={xTokenAirdropHint}>
                  <button
                    aria-label={xTokenAirdropHint}
                    className={cn(
                      'inline-flex shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold leading-none opacity-60',
                      dappIconClass.md,
                    )}
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
    </DappWidgetFrame>
  )
}

export function GenesisContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const { isLoggingIn } = useAuth()
  const genesis = useGenesisWidgetContext()
  const seasonStatsTitle = t.genesis.statsTitle.replace(
    '{season}',
    String(genesis.activeSeasonNumber),
  )
  const [contributionsPage, setContributionsPage] = useState(1)
  const { data: salesLogs, isLoading: salesLoading } = useSalesLogs(
    tablePageQuery(contributionsPage),
    sessionReady,
  )

  const seasonContributedUsd = formatTokenAmountToNumber(genesis.userPhaseAmountCurrent, 18)
  const seasonMaxContributionUsd = formatTokenAmountToNumber(genesis.seasonContributionMaxWei, 18)
  const cumulativeContributedUsd = formatTokenAmountToNumber(genesis.userTotal, 18)
  const contributionProgress = calcProgressPercent(
    String(seasonContributedUsd),
    seasonMaxContributionUsd,
  )
  const contributedLabel = `${formatUsd(seasonContributedUsd)} / ${formatUsd(seasonMaxContributionUsd)}`

  const genesisFaqValues = useMemo(
    () =>
      buildGenesisFaqTemplateValues(
        genesis.phases,
        genesis.airdropThresholdUsd,
        genesis.isLoading && genesis.phases.length === 0,
      ),
    [genesis.airdropThresholdUsd, genesis.isLoading, genesis.phases],
  )

  const genesisFaqItems = useMemo(
    () =>
      t.genesis.faq.items.map((item) => ({
        q: item.q,
        a: applyMessageTemplate(item.a, genesisFaqValues),
      })),
    [genesisFaqValues, t.genesis.faq.items],
  )

  const desktopRows =
    salesLogs?.items.map((item) => {
      const row = mapSalesLogToDesktopRow(item, genesis.agxPriceUsd)
      const txLabel = row[4]
      if (!item.tx_hash || txLabel === '—') return row

      return [
        ...row.slice(0, 4),
        <a
          className="text-primary underline"
          href={bscscanTx(item.tx_hash)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {txLabel}
        </a>,
      ]
    }) ?? []
  const tableRows = desktopRows
  const tableHeaders = [
    t.tables.time,
    t.tables.paid,
    t.tables.discount,
    t.tables.estimatedAgx,
    t.tables.tx,
  ]
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
            <MetricCardSkeleton className="max-dapp:rounded-md" />
            <MetricCardSkeleton className="max-dapp:rounded-md" />
            <MetricCardSkeleton className="max-dapp:rounded-md" />
            <MetricCardSkeleton className="max-dapp:rounded-md" />
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
            'relative min-h-32 overflow-hidden rounded-md bg-dark p-6 shadow-card',
          )}
          data-reveal
        >
          <div className="relative z-1">
            <span className="text-xs font-bold leading-[1.3] tracking-[1.2px] text-coral-bright">
              {t.genesis.globalLabel}
            </span>
            <strong className="mt-1.5 block text-xl font-bold leading-[1.25] text-white">
              {genesis.isLoading && genesis.phases.length === 0 ? (
                <DappSkeleton className="h-6 w-40" tone="dark" />
              ) : genesis.globalPurchasedLoading ? (
                <DappSkeleton className="h-6 w-40" tone="dark" />
              ) : (
                `$${genesis.globalPurchasedLabel}`
              )}
            </strong>
            <p className="mt-2.5 mb-0 max-w-[70ch] text-xs leading-[1.5] text-white">
              {t.genesis.globalBody}
            </p>
          </div>
          <Button
            className={cn(
              'absolute right-5.5 top-11 z-[2] !gap-1.5 !border-[oklch(100%_0_0/45%)] !bg-transparent !px-4.5 !text-white',
              'hover:!border-[oklch(100%_0_0/80%)] focus-visible:!border-[oklch(100%_0_0/80%)]',
              '[&_img]:size-[var(--dapp-icon-action)] [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
            )}
            onClick={() =>
              window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
            }
            size="md"
            type="button"
            variant="secondary"
          >
            {t.genesis.viewContract}
            <DappIcon alt="" size="action" src={dappAssets.arrowUpRight} />
          </Button>
          <img
            alt=""
            className="pointer-events-none absolute top-0 right-9 h-auto w-[44%] max-w-80 select-none opacity-[0.78]"
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
        <div className={cn(revealClass(), 'flex flex-col gap-3')} data-reveal>
          {showSalesSyncHint ? (
            <p className="m-0 text-xs leading-normal text-muted-foreground">
              {t.genesis.contributionsSyncPending}
            </p>
          ) : null}
          <DappTableCard
            footer={
              sessionReady && !contributionsTable.requiresAuth ? (
                <DappTablePagination
                  embedded
                  onPageChange={setContributionsPage}
                  page={contributionsPage}
                  summary={`${t.genesis.cumulativeContributed}${formatUsd(cumulativeContributedUsd)}`}
                  total={contributionsTotal}
                />
              ) : undefined
            }
            header={
              sessionReady && !contributionsTable.requiresAuth ? (
                <div className="grid gap-2.5">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold leading-[1.2] tracking-[-0.26px] text-foreground">
                    <span>{t.genesis.totalContributed}</span>
                    <strong className="mt-0 text-right font-semibold">{contributedLabel}</strong>
                  </div>
                  <ProgressMeter
                    label={t.genesis.totalContributed}
                    value={contributionProgress}
                  />
                </div>
              ) : undefined
            }
          >
            {contributionsTable.requiresAuth ? (
              <DappTableAuthPrompt body={t.dapp.connect.recordsBodyGenesis} embedded />
            ) : contributionsTable.queryEmpty && !showSalesSyncHint ? (
              <>
                <ResponsiveTable
                  colWidths={['132px', '104px', '96px', '136px', '104px']}
                  compact
                  headers={tableHeaders}
                  positiveColumns={[2]}
                  rows={[]}
                />
                <DappTableEmptyMessage embedded title={t.genesis.contributionsEmpty.title} />
              </>
            ) : (
              <ResponsiveTable
                colWidths={['132px', '104px', '96px', '136px', '104px']}
                compact
                headers={tableHeaders}
                isLoading={contributionsTable.showSkeleton}
                loadingRowCount={4}
                positiveColumns={[2]}
                rows={tableRows}
              />
            )}
          </DappTableCard>
        </div>
      </DappSection>

      <DappCollapsibleSection bodyClassName="overflow-visible" title={t.genesis.faq.title}>
        <FaqList items={genesisFaqItems} variant="dapp" />
      </DappCollapsibleSection>
    </DappDetailPage>
  )
}
