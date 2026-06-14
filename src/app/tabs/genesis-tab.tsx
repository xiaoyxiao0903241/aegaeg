import { useState } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { dappButtonClass } from '~/lib/dapp-styles'
import { revealClass } from '~/lib/reveal'
import {
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets } from '../assets'
import { contributionRows, mobileContributionRows, seasons } from '../data'
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

const MAX_SHARES = 100

export function GenesisWidget({
  detailPanel,
  onSelectGenesis,
}: {
  detailPanel: DetailPanelControls
  onSelectGenesis: () => void
}) {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()
  const [shares, setShares] = useState(1)

  const handleSharesChange = (value: string) => {
    const parsed = Number.parseInt(value, 10)
    if (Number.isNaN(parsed)) {
      setShares(1)
      return
    }
    setShares(Math.min(Math.max(parsed, 1), MAX_SHARES))
  }

  return (
    <div className={cn(shellModulePanelClass, 'min-[821px]:[&>*]:shrink-0')}>
      <DappWidgetHeader
        detailCollapsed={detailPanel.collapsed}
        intro={t.genesis.intro}
        onTogglePanel={detailPanel.onToggle}
        showToggle={connected}
        title={t.genesis.title}
      />

      <SeasonSelector seasons={seasons} />

      <label className="mt-3.5 grid gap-2 text-xs leading-[1.5] text-muted-foreground">
        <span>{t.genesis.shares}</span>
        <div className="flex gap-2">
          <input
            className="w-full min-w-0 min-h-11 rounded-[11px] border border-border bg-card px-3.5 text-base font-bold text-foreground outline-none focus:border-primary"
            max={MAX_SHARES}
            min={1}
            onChange={(e) => handleSharesChange(e.target.value)}
            type="number"
            value={shares}
          />
          <button
            className="min-h-11 min-w-[66px] shrink-0 cursor-pointer rounded-[11px] border border-border bg-accent px-[15px] text-xs font-bold whitespace-nowrap text-primary"
            onClick={() => setShares(MAX_SHARES)}
            type="button"
          >
            {t.common.max}
          </button>
        </div>
      </label>

      <DappMetaList
        items={[
          { label: t.genesis.quota, value: '$100 – $10,000' },
          { label: t.genesis.pay, value: '100 USD1' },
          { label: t.genesis.receive, value: '2.20 AGX' },
          { label: t.genesis.value, value: '$143' },
          { label: t.genesis.xTokenAirdrop, value: '$5' },
        ]}
      />

      <DappActionRow>
        <DappActionButton variant="secondary">
          {t.swap.approve}
        </DappActionButton>
        <DappActionButton>
          {t.genesis.join}
        </DappActionButton>
      </DappActionRow>

      <GenesisPromoCard className="hidden max-[820px]:grid" onClick={onSelectGenesis} />
    </div>
  )
}

export function GenesisContent() {
  const { messages: t } = useI18n()

  return (
    <div className={shellContentPageClass}>
      <h2 className={shellContentHeadingClass} id="genesis-title">
        {t.genesis.statsTitle}
      </h2>

      <MetricGrid columns={4}>
        <MetricCard
          className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
          label={t.genesis.startsIn}
          value="17D 03H 51M"
        />
        <MetricCard
          className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
          label={<span className="text-muted-foreground">{t.genesis.referencePrice}</span>}
          value="$55"
        />
        <MetricCard
          className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
          label={t.genesis.discountRatio}
          value="-25%"
        />
        <MetricCard
          className="px-4 py-3.5 max-[820px]:min-h-0 max-[820px]:rounded-xl max-[820px]:p-3.5 max-[820px]:[&_small]:hidden max-[820px]:[&_strong]:text-[15px] max-[820px]:[&_strong]:leading-[1.2] [&_strong]:mt-[5px] [&_strong]:text-base [&_strong]:leading-[1.3]"
          label={t.genesis.xAirdropRatio}
          value="+5%"
        />
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
              25,000,000 USD1
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
          <div className="mb-3 grid gap-1.5 border-0 bg-transparent p-0">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
                {t.genesis.totalContributed}
              </span>
              <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
                6,000 / 10,000
              </strong>
            </div>
            <ProgressMeter label={t.genesis.totalContributed} value={60} />
          </div>
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
            rows={contributionRows}
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
            rows={mobileContributionRows}
          />
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
