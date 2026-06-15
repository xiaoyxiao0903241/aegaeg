import { useCallback, useEffect } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { dappButtonClass } from '~/lib/dapp-styles'
import { revealClass } from '~/lib/reveal'
import { toast } from 'sonner'
import {
  usePerformance,
  useSalesLogs,
} from '../../hooks/use-api-data'
import { useGenesisWidgetContext } from '../genesis-widget-context'
import {
  calcProgressPercent,
  formatUsd,
  mapSalesLogToDesktopRow,
  mapSalesLogToMobileRow,
  sumSalesLogAmountUsd,
} from '../../lib/api/format-display'
import { PRESALE_CONFIG } from '../../config/presale'
import { BSC_CONTRACTS } from '../../config/contracts'
import { bscscanAddress } from '../../config/explorer'
import {
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets } from '../assets'
import { contributionRows, mobileContributionRows, seasons as fallbackSeasons } from '../data'
import type { DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import { DappActionRow } from '../components/dapp-action-row'
import { MetricCard } from '../components/dapp-card'
import { DappMetaList } from '../components/dapp-meta-list'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { FaqStack } from '../components/faq-stack'
import { GenesisPromoCard } from '../components/genesis-promo-card'
import { MetricGrid } from '../components/metric-grid'
import { ProgressMeter } from '../components/progress-meter'
import { ResponsiveTable } from '../components/responsive-table'
import { SeasonSelector } from '../components/season-selector'
import { useDappShell } from '../dapp-shell-context'
import { useAuth } from '../../providers/auth-provider'
import {
  ContributionBlockSkeleton,
  DappSkeleton,
  MetricCardSkeleton,
  SeasonOptionSkeleton,
} from '../components/dapp-skeleton'
import { resolveContractErrorMessage, resolveGenesisPurchaseError } from '../../lib/web3/resolve-contract-error-message'
import { formatTokenAmount } from '../../lib/swap/token-amount'

const MAX_SHARES = 100

export function GenesisWidget({
  detailPanel,
  onSelectGenesis,
}: {
  detailPanel: DetailPanelControls
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { connected, walletReady } = useDappShell()
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
    <div className={cn(shellModulePanelClass, 'min-[821px]:[&>*]:shrink-0')}>
      <DappWidgetHeader
        detailCollapsed={detailPanel.collapsed}
        intro={seasonIntro}
        onTogglePanel={detailPanel.onToggle}
        showToggle={connected}
        title={t.genesis.title}
      />

      {genesis.isLoading && genesis.seasonOptions.length === 0 ? (
        <div aria-busy="true" className={cn(revealClass(), 'mt-3.5 grid gap-2')} data-reveal>
          <SeasonOptionSkeleton />
          <SeasonOptionSkeleton />
          <SeasonOptionSkeleton />
        </div>
      ) : (
        <SeasonSelector
          seasons={genesis.seasonOptions.length > 0 ? genesis.seasonOptions : fallbackSeasons}
        />
      )}

      <label className="mt-3.5 grid gap-2 text-xs leading-[1.5] text-muted-foreground">
        <span>{t.genesis.shares}</span>
        <div className="flex gap-2">
          <input
            className="w-full min-w-0 min-h-11 rounded-[11px] border border-border bg-card px-3.5 text-base font-bold text-foreground outline-none focus:border-primary"
            disabled={!walletReady}
            max={MAX_SHARES}
            min={1}
            onChange={(e) => handleSharesChange(e.target.value)}
            type="number"
            value={genesis.shares}
          />
          <button
            className="min-h-11 min-w-[66px] shrink-0 cursor-pointer rounded-[11px] border border-border bg-accent px-[15px] text-xs font-bold whitespace-nowrap text-primary disabled:opacity-50"
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
          { label: t.genesis.usd1Balance, value: walletReady ? `${genesis.usd1BalanceLabel} USD1` : '—' },
          {
            label: t.genesis.phase,
            value: genesis.activePhase
              ? t.genesis.phaseSeason
                  .replace('{season}', String(genesis.phaseIndex + 1))
                  .replace('{discount}', genesis.discountLabel)
              : '—',
          },
        ]}
      />

      <DappActionRow className={genesis.isApproved ? 'grid-cols-1' : undefined}>
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
        className="hidden max-[820px]:grid"
        isLoading={genesis.isLoading}
        onClick={onSelectGenesis}
        promo={genesis.promoSnapshot}
      />
    </div>
  )
}

export function GenesisContent() {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()
  const { isAuthenticated, isLoggingIn } = useAuth()
  const genesis = useGenesisWidgetContext()
  const seasonStatsTitle = t.genesis.statsTitle.replace(
    '{season}',
    String(genesis.activeSeasonNumber),
  )
  const apiEnabled = connected && isAuthenticated
  const { data: performance, isLoading: performanceLoading } = usePerformance(apiEnabled)
  const { data: salesLogs, isLoading: salesLoading } = useSalesLogs(
    { page: 1, page_size: 20 },
    apiEnabled,
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
  const isContributionLoading =
    apiEnabled &&
    contributedUsd === 0 &&
    genesis.userTotal === 0n &&
    (performanceLoading || salesLoading)
  const contributedLabel = `${formatUsd(contributed)} / ${formatUsd(maxContribution)}`

  const desktopRows =
    salesLogs?.items.map((item) => mapSalesLogToDesktopRow(item, genesis.agxPriceUsd)) ?? []
  const mobileRows =
    salesLogs?.items.map((item) => mapSalesLogToMobileRow(item, genesis.agxPriceUsd)) ?? []
  const useMockRows = !connected && !genesis.walletReady
  const authPending = connected && (isLoggingIn || !isAuthenticated)
  const tableRows = useMockRows ? contributionRows : desktopRows
  const tableRowsMobile = useMockRows ? mobileContributionRows : mobileRows
  const showSalesSyncHint =
    apiEnabled && !salesLoading && desktopRows.length === 0 && genesis.userTotal > 0n
  const showContributionsSignInHint =
    !apiEnabled && genesis.walletReady && genesis.userTotal > 0n && desktopRows.length === 0
  const showContributionSkeleton =
    connected &&
    !useMockRows &&
    desktopRows.length === 0 &&
    (authPending || isContributionLoading || salesLoading)

  return (
    <div className={shellContentPageClass}>
      <h2 className={shellContentHeadingClass} id="genesis-title">
        {seasonStatsTitle}
      </h2>

      <MetricGrid columns={4}>
        {genesis.isLoading && genesis.phases.length === 0 ? (
          <>
            <MetricCardSkeleton className="max-[820px]:rounded-xl" />
            <MetricCardSkeleton className="max-[820px]:rounded-xl" />
            <MetricCardSkeleton className="max-[820px]:rounded-xl" />
            <MetricCardSkeleton className="max-[820px]:rounded-xl" />
          </>
        ) : (
          <>
            <MetricCard
              className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3] [&_strong]:tabular-nums"
              label={
                genesis.countdownMode === 'ends' ? t.genesis.endsIn : t.genesis.startsIn
              }
              value={genesis.countdown}
            />
            <MetricCard
              className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
              label={<span className="text-muted-foreground">{t.genesis.referencePrice}</span>}
              value={genesis.referencePriceLabel}
            />
            <MetricCard
              className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
              label={t.genesis.discountRatio}
              value={genesis.discountLabel}
            />
            <MetricCard
              className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
              label={t.genesis.xAirdropRatio}
              value={genesis.airdropLabel}
            />
          </>
        )}
      </MetricGrid>

      <section className="mt-8 max-[820px]:!hidden">
        <div
          className={cn(
            revealClass(),
            // Figma `tc` 82:683 — 780×125；Globe 190:339 288×185 @ (456,-24)；卡片 overflow:hidden 裁切，不撑出滚动
            'relative mt-3.5 min-h-[125px] overflow-hidden rounded-md bg-dark p-6 shadow-card',
          )}
          data-reveal
        >
          <div className="relative z-[1]">
            <span className="text-[11px] font-bold leading-[1.3] tracking-[1.2px] text-coral-bright">
              {t.genesis.globalLabel}
            </span>
            <strong className="mt-[7px] block text-[21px] font-bold leading-[1.25] text-white">
              {genesis.isLoading && genesis.phases.length === 0 ? (
                <DappSkeleton className="h-6 w-40" tone="dark" />
              ) : (
                `${genesis.globalPurchasedLabel} USD1`
              )}
            </strong>
            <p className="mt-2.5 mb-0 max-w-[70ch] text-[13px] leading-[1.5] text-white">
              {t.genesis.globalBody}
            </p>
          </div>
          <button
            className={dappButtonClass(
              'capsule',
              'light',
              cn(
                'absolute right-[22px] top-[43px] z-[2] !min-h-10 !gap-1.5 !border-[oklch(100%_0_0/45%)] !bg-transparent !px-[18px] !text-white',
                'hover:!border-[oklch(100%_0_0/80%)] focus-visible:!border-[oklch(100%_0_0/80%)]',
                '[&_img]:size-[15px] [&_img]:shrink-0 [&_img]:brightness-0 [&_img]:invert',
              ),
            )}
            onClick={() =>
              window.open(bscscanAddress(BSC_CONTRACTS.preSale), '_blank', 'noopener,noreferrer')
            }
            type="button"
          >
            {t.genesis.viewContract}
            <img alt="" height="15" src={dappAssets.arrowUpRight} width="15" />
          </button>
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

      <DappSection title={t.genesis.myContributions}>
        <div className={cn(revealClass(), 'mt-3.5 max-[820px]:mt-3')} data-reveal>
          {showContributionSkeleton ? (
            <ContributionBlockSkeleton />
          ) : (
            <>
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
          {showContributionsSignInHint ? (
            <p className="mb-3 text-[13px] leading-normal text-muted-foreground">
              {t.rewards.rankSignInRequired}
            </p>
          ) : null}
          {tableRows.length > 0 ? (
            <>
              <ResponsiveTable
                className="max-[820px]:hidden"
                compact
                headers={[
                  t.tables.time,
                  t.tables.paid,
                  t.tables.discount,
                  t.tables.estimatedAgx,
                  t.tables.tx,
                ]}
                plain
                linkColumns={[4]}
                positiveColumns={[2]}
                rows={tableRows}
              />
              <ResponsiveTable
                className="hidden max-[820px]:block"
                compact
                headers={[
                  t.tables.time,
                  t.tables.paid,
                  t.tables.discount,
                  t.tables.estimatedAgx,
                ]}
                plain
                positiveColumns={[2]}
                rows={tableRowsMobile}
              />
            </>
          ) : apiEnabled && !showSalesSyncHint && !showContributionsSignInHint ? (
            <p className="text-[13px] leading-normal text-muted-foreground">{t.genesis.contributionsEmpty}</p>
          ) : null}
            </>
          )}
        </div>
      </DappSection>

      <DappSection className="max-[820px]:hidden" title={t.swap.faq}>
        <FaqStack
          items={[
            {
              answer: t.genesis.faqSeasonBody,
              question: t.genesis.faqSeason,
            },
            {
              answer: t.genesis.faqRedeemBody,
              question: t.genesis.faqRedeem,
            },
          ]}
        />
      </DappSection>
    </div>
  )
}
