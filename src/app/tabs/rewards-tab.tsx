import { useState } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { dappAssets } from '../assets'
import {
  mobileRewardTiers,
  rewardRows,
  rewardTiers,
  teamRewardRows,
} from '../data'
import type { DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import {
  DappSideCard,
  RewardBalanceCard,
  SideHint,
  SideLabel,
  SideValue,
} from '../components/dapp-card'
import { DappPillTabs } from '../components/dapp-pill-tabs'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { FaqStack } from '../components/faq-stack'
import { ProgressMeter } from '../components/progress-meter'
import { ResponsiveTable } from '../components/responsive-table'
import { useDappShell } from '../dapp-shell-context'

const TITLE_MINI_CARD_CLASS = cn(
  '[&_p]:text-[11px] [&_p]:font-semibold [&_p]:uppercase [&_p]:tracking-[0.88px] [&_p]:leading-[1.3] [&_p]:text-primary',
  '[&_strong]:mt-1.5 [&_strong]:text-[17px] [&_strong]:tracking-normal',
  '[&_small]:mt-1.5 [&_small]:tracking-normal [&_small]:text-muted-foreground',
  'max-[820px]:py-[13px] max-[820px]:[&_small]:max-w-[31ch] max-[820px]:[&_small]:leading-[1.4] max-[820px]:[&_small]:text-faint',
)

const PROGRESS_CARD_CLASS = cn(
  'grid gap-1.5 max-[820px]:gap-1.5 max-[820px]:py-[13px] max-[820px]:[&_span]:text-faint',
)

export function RewardsWidget({
  detailPanel,
}: {
  detailPanel: DetailPanelControls
}) {
  const { messages: t } = useI18n()
  const { connected } = useDappShell()

  return (
    <div className={shellModulePanelClass}>
      <DappWidgetHeader
        className="max-[820px]:mt-3 max-[820px]:[&_p]:mt-3"
        detailCollapsed={detailPanel.collapsed}
        intro={t.rewards.intro}
        onTogglePanel={detailPanel.onToggle}
        showToggle={connected}
        title={t.rewards.title}
      />

      <DappSideCard className={TITLE_MINI_CARD_CLASS}>
        <SideLabel tone="coral">{t.rewards.currentTitle}</SideLabel>
        <SideValue>{t.rewards.shareholder}</SideValue>
        <SideHint tone="body">{t.rewards.shareholderHint}</SideHint>
      </DappSideCard>

      <DappSideCard className={PROGRESS_CARD_CLASS}>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
            {t.rewards.progressPersonal}
          </span>
          <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
            $1,500 / $2,000
          </strong>
        </div>
        <ProgressMeter label={t.rewards.progressPersonal} value={75} />
        <span aria-hidden="true" className="block h-1" />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-normal leading-[1.5] text-muted-foreground">
            {t.rewards.teamVolume}
          </span>
          <strong className="mt-0 text-right text-xs font-bold leading-[1.4] text-foreground">
            $18,000 / $30,000
          </strong>
        </div>
        <ProgressMeter label={t.rewards.teamVolume} value={60} />
      </DappSideCard>

      <RewardBalanceCard
        badge={t.rewards.autoPaidLabel}
        className={cn(
          'max-[820px]:pb-3 max-[820px]:[&_button]:mt-1.5 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
          '[&_strong_span]:text-xs [&_strong_span]:font-semibold [&_strong_span]:text-faint',
        )}
        hint={t.rewards.autoPaid}
        label={t.rewards.referralRewards}
        value="$1,280.50"
      />

      <RewardBalanceCard
        action={
          <DappActionButton>
            {t.rewards.claim}
          </DappActionButton>
        }
        className={cn(
          '[&_strong]:text-lg',
          'max-[820px]:pb-3 max-[820px]:[&_button]:mt-1.5 max-[820px]:[&_strong]:mt-1.5 max-[820px]:[&_strong]:text-[17px] max-[820px]:[&_strong]:leading-[1.1]',
        )}
        label={t.rewards.teamRewards}
        meta={t.rewards.claimed}
        value={`$342.18 ${t.common.claimable.toLowerCase()}`}
      />
    </div>
  )
}

export function RewardsContent() {
  const { messages: t } = useI18n()
  const [historyTab, setHistoryTab] = useState<'referral' | 'team'>('referral')

  const historyHeaders =
    historyTab === 'referral'
      ? [
          t.tables.time,
          t.tables.amount,
          t.tables.from,
          t.tables.contribution,
          t.tables.rate,
          t.tables.status,
        ]
      : [
          t.tables.time,
          t.tables.amount,
          t.tables.source,
          t.tables.contribution,
          t.tables.rate,
          t.tables.status,
        ]

  return (
    <div className={shellContentPageClass}>
      <h2
        className={cn(shellContentHeadingClass, 'max-[820px]:mt-0.5')}
        id="rewards-title"
      >
        {t.rewards.heroTitle}
      </h2>

      <section
        className={cn(
          revealClass(),
          'relative mt-3.5 flex min-h-[145px] items-center justify-between gap-6 overflow-visible rounded-md bg-dark p-6 text-white shadow-card',
          'max-[820px]:hidden',
        )}
        data-reveal
      >
        <div className="relative z-[1]">
          <span className="text-[11px] font-bold uppercase tracking-[0.88px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          <h3 className="my-2 text-[21px] font-bold text-white">{t.rewards.shareholder}</h3>
          <p className="m-0 max-w-[min(58ch,calc(100%-164px))] text-[13px] leading-[1.55] text-on-dark">
            {t.rewards.heroBody}
          </p>
        </div>
        <img
          alt=""
          className="pointer-events-none absolute right-3 top-[-43px] z-0 h-[188px] w-[133px] max-w-[133px] -scale-x-100 object-contain"
          height="156"
          loading="lazy"
          src={dappAssets.rewardsCharacter}
          width="104"
        />
      </section>

      <section
        className={cn(
          'relative mt-3.5 hidden min-h-[127px] items-center justify-between gap-6 overflow-visible rounded-md bg-dark p-[18px] text-white shadow-card',
          'max-[820px]:flex',
        )}
      >
        <div className="relative z-[1]">
          <span className="text-[11px] font-bold uppercase tracking-[1.4px] text-coral-bright">
            {t.rewards.heroKicker}
          </span>
          <h3 className="my-2 text-lg font-bold text-white max-[820px]:text-lg">
            {t.rewards.shareholder}
          </h3>
          <p className="m-0 text-[13px] leading-[1.55] text-on-dark">
            {t.rewards.heroBody}
          </p>
        </div>
      </section>

      <DappSection title={t.rewards.allTiers}>
        <ResponsiveTable
          className="max-[820px]:hidden"
          compact
          headers={[
            t.tables.title,
            t.tables.personalShort,
            t.tables.totalVolume,
            t.tables.bonusShort,
            t.tables.postLaunchShort,
          ]}
          highlightedRows={[1]}
          plain
          positiveColumns={[3]}
          rows={rewardTiers}
        />
        <ResponsiveTable
          className="hidden max-[820px]:block"
          compact
          headers={[
            t.tables.title,
            t.tables.personalShort,
            t.tables.bonusShort,
            t.tables.rankShort,
          ]}
          highlightedRows={[1]}
          plain
          positiveColumns={[2]}
          rows={mobileRewardTiers}
        />
      </DappSection>

      <DappSection
        className="max-[820px]:hidden"
        title={t.rewards.history}
      >
        <div className={cn(revealClass(), 'mt-3.5')} data-reveal>
          <DappPillTabs
            ariaLabel={t.rewards.history}
            className="mb-2.5 flex items-center justify-start gap-2"
            items={[
              { active: historyTab === 'referral', label: t.rewards.referralHistory },
              { active: historyTab === 'team', label: t.rewards.teamHistory },
            ]}
            onSelect={(index) => setHistoryTab(index === 0 ? 'referral' : 'team')}
          />
          <ResponsiveTable
            className="[&_th]:text-faint"
            compact
            headers={historyHeaders}
            plain
            positiveColumns={[1]}
            rows={historyTab === 'referral' ? rewardRows : teamRewardRows}
          />
        </div>
      </DappSection>

      <DappSection
        className="max-[820px]:mt-[22px] max-[820px]:[&_h3]:text-[17px]"
        title={t.swap.faq}
      >
        <FaqStack
          className={cn(
            'justify-items-start [&_[data-faq-item]]:w-full [&_[data-faq-item]]:max-w-full',
            'max-[820px]:[&_[data-faq-item]]:rounded-[14px] max-[820px]:[&_[data-faq-item]]:border-0 max-[820px]:[&_[data-faq-item]]:px-4 max-[820px]:[&_[data-faq-item]]:shadow-faq',
            'max-[820px]:[&_[data-faq-trigger]]:py-3.5 max-[820px]:[&_[data-faq-trigger]]:text-[13px] max-[820px]:[&_[data-faq-trigger]]:font-normal max-[820px]:[&_[data-faq-trigger]]:text-faq-text',
            'max-[820px]:[&_p]:hidden',
            '[&_[data-faq-trigger]]:text-sm [&_[data-faq-trigger]]:font-normal [&_[data-faq-trigger]]:text-faq-text',
          )}
          defaultOpenFirst={false}
          items={[
            {
              answer: t.rewards.faqSettlementBody,
              question: t.rewards.faqSettlement,
            },
          ]}
        />
      </DappSection>
    </div>
  )
}
