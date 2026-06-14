import type { ReactNode } from 'react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  desktopCopyClass,
  mobileCopyClass,
  shellContentHeadingClass,
  shellContentPageClass,
  shellModulePanelClass,
} from '../shell-layout'
import { useDappShell } from '../dapp-shell-context'
import { dappAssets } from '../assets'
import {
  compactInvites,
  inviteFlow,
  invites,
  mobileCommunityFirstVisitInvites,
  mobileCommunityInvites,
  programs,
} from '../data'
import type { DappTab, DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import {
  CommunityStatCard,
  DappSideCard,
  ProgramCard,
  SideHint,
  SideLabel,
  SideValue,
} from '../components/dapp-card'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { InviteFlow } from '../components/invite-flow'
import { QuickLinks } from '../components/quick-links'
import { ResponsiveTable } from '../components/responsive-table'

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}

const REFERRAL_CARD_CLASS = '[&_button]:mt-2'

const REFERRER_ADDRESS_CLASS = cn(
  'mt-2.5 flex items-center gap-2.5 rounded-[11px] bg-background px-3.5 py-[11px]',
  '[&_strong]:m-0 [&_strong]:flex-1 [&_strong]:text-sm [&_strong]:leading-[1.2]',
  '[&_button]:grid [&_button]:aspect-square [&_button]:w-[30px] [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:rounded-lg [&_button]:bg-transparent [&_button]:text-subtle-ink',
)

const SHAREHOLDER_ACTION_CLASS = cn(
  'mt-2 min-h-12 hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-[820px]:hidden',
)

const COMMUNITY_STAT_GRID = cn(
  'mt-3.5 grid grid-cols-3 gap-3.5',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  'max-[820px]:min-w-0 max-[820px]:grid-cols-1',
  'max-[820px]:[&:has(.community-stat)]:grid-cols-3 max-[820px]:[&:has(.community-stat)]:gap-2.5',
)

const COMMUNITY_STAT_CARD_CLASS = cn(
  'max-[820px]:min-h-[70px] max-[820px]:rounded-xl max-[820px]:p-3.5',
  'max-[820px]:items-center max-[820px]:text-center',
  'max-[820px]:[&>span]:text-xs max-[820px]:[&>span]:leading-[1.35] max-[820px]:[&>span]:text-faint',
  'max-[820px]:[&>strong]:mt-[3px] max-[820px]:[&>strong]:text-2xl max-[820px]:[&>strong]:leading-[1.05]',
  'max-[820px]:[&>b]:hidden max-[820px]:[&>small]:hidden',
  '[&>strong]:tracking-[-1.2px]',
  'max-[820px]:[&.is-dark>small]:hidden',
)

const CONNECTED_STAT_CLASS = cn(
  'max-[820px]:min-h-[90px] max-[820px]:items-start max-[820px]:rounded-[14px] max-[820px]:border max-[820px]:border-border max-[820px]:p-[13px_12px] max-[820px]:text-left max-[820px]:shadow-none',
  'max-[820px]:[&>span]:w-full max-[820px]:[&>span]:text-[11px] max-[820px]:[&>span]:leading-[1.5]',
  'max-[820px]:[&>strong]:mt-1 max-[820px]:[&>strong]:w-full max-[820px]:[&>strong]:text-2xl',
  'max-[820px]:[&>b]:mt-1 max-[820px]:[&>b]:block max-[820px]:[&>b]:w-full max-[820px]:[&>b]:text-[11px] max-[820px]:[&>b]:leading-[1.2]',
  'max-[820px]:[&.is-dark>b]:hidden',
  'max-[820px]:[&.is-dark>small]:mt-1 max-[820px]:[&.is-dark>small]:block max-[820px]:[&.is-dark>small]:w-full max-[820px]:[&.is-dark>small]:text-[11px] max-[820px]:[&.is-dark>small]:leading-[1.2]',
)

export function CommunityWidget({
  connected,
  detailPanel,
  onSelectTab,
}: {
  connected: boolean
  detailPanel: DetailPanelControls
  onSelectTab: (tab: DappTab) => void
}) {
  return connected ? (
    <CommunityConnectedWidget
      detailPanel={detailPanel}
      onSelectTab={onSelectTab}
    />
  ) : (
    <CommunityDisconnectedWidget
      detailPanel={detailPanel}
      onSelectTab={onSelectTab}
    />
  )
}

function CommunityConnectedWidget({
  detailPanel,
  onSelectTab,
}: {
  detailPanel: DetailPanelControls
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()

  return (
    <div className={shellModulePanelClass}>
      <DappWidgetHeader
        detailCollapsed={detailPanel.collapsed}
        intro={t.community.intro}
        onTogglePanel={detailPanel.onToggle}
        title={t.community.title}
      />

      <DappSideCard className={REFERRAL_CARD_CLASS}>
        <SideLabel>{t.community.referralLink}</SideLabel>
        <SideValue>aegis-x.io/r/0x8F32…91A2</SideValue>
        <DappActionButton>
          {t.community.shareReferral}
        </DappActionButton>
      </DappSideCard>

      <DappSideCard className="mt-2">
        <SideLabel tone="muted">{t.community.referrer}</SideLabel>
        <div className={REFERRER_ADDRESS_CLASS}>
          <span className="grid aspect-square w-6 flex-none place-items-center rounded-full bg-accent text-[10px] font-semibold text-primary">
            R
          </span>
          <strong>0x77A2…4F1B</strong>
          <button aria-label={t.common.copy} type="button">
            <img alt="" height="16" src={dappAssets.copy} width="16" />
          </button>
        </div>
        <SideHint>Referral bond active since 2026-04-12 · binding is permanent.</SideHint>
      </DappSideCard>

      <CommunityQuickLinks />

      <DappActionButton
        className={SHAREHOLDER_ACTION_CLASS}
        onClick={() => onSelectTab('genesis')}
      >
        {t.community.shareholder}
      </DappActionButton>
    </div>
  )
}

function CommunityDisconnectedWidget({
  detailPanel,
  onSelectTab,
}: {
  detailPanel: DetailPanelControls
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()

  return (
    <div className={shellModulePanelClass}>
      <DappWidgetHeader
        detailCollapsed={detailPanel.collapsed}
        intro={t.community.intro}
        onTogglePanel={detailPanel.onToggle}
        showToggle={false}
        title={t.community.title}
      />

      <DappSideCard className="max-[820px]:mt-[22px]">
        <SideLabel>{t.community.referrer}</SideLabel>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_max-content] items-end gap-2">
          <label className="grid gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-[11px] border border-border bg-background px-3.5 text-muted-foreground outline-0"
              disabled
              placeholder={t.community.referrerPlaceholder}
            />
          </label>
          <DappActionButton
            className="max-[820px]:min-h-11 max-[820px]:rounded-[11px] max-[820px]:border-transparent max-[820px]:bg-accent max-[820px]:px-[15px] max-[820px]:text-xs max-[820px]:text-primary"
            disabled
            variant="secondary"
          >
            {t.community.bindReferrer}
          </DappActionButton>
        </div>
        <SideHint>{t.community.referrerHint}</SideHint>
      </DappSideCard>

      <CommunityQuickLinks />

      <DappActionButton
        className={SHAREHOLDER_ACTION_CLASS}
        onClick={() => onSelectTab('genesis')}
      >
        {t.community.shareholder}
      </DappActionButton>
    </div>
  )
}

function CommunityQuickLinks() {
  const { messages: t } = useI18n()

  return (
    <QuickLinks
      items={[
        {
          href: '#docs',
          icon: dappAssets.docs,
          label: t.community.docs,
        },
        {
          href: '#twitter',
          icon: dappAssets.twitter,
          iconTone: 'dark',
          label: t.community.twitter,
          size: 14,
        },
        {
          href: '#telegram',
          icon: dappAssets.telegram,
          iconTone: 'plain',
          label: t.community.telegram,
          size: 30,
        },
      ]}
    />
  )
}

export function CommunityContent({
  connected,
  onSelectTab,
}: {
  connected: boolean
  onSelectTab: (tab: DappTab) => void
}) {
  const { messages: t } = useI18n()
  const { tab } = useDappShell()

  if (!connected) {
    return (
      <div className={cn(shellContentPageClass, 'max-[820px]:pb-20')}>
        <MobileCommunityFirstStats />
        <CommunityFlowSection onSelectTab={onSelectTab} />
        <MobileCommunityFirstInvites />
      </div>
    )
  }

  const stats: CommunityStat[] = [
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.directReferrals}</span>
          <span className={mobileCopyClass}>{t.community.directShort}</span>
        </>
      ),
      value: '12',
      volume: (
        <>
          <span className={desktopCopyClass}>Volume $48,200</span>
          <span className={mobileCopyClass}>$48.2K</span>
        </>
      ),
      today: 'Today +2 · +$1,200',
    },
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.myTeam}</span>
          <span className={mobileCopyClass}>{t.community.myTeam}</span>
        </>
      ),
      value: '156',
      volume: (
        <>
          <span className={desktopCopyClass}>Volume $412,900</span>
          <span className={mobileCopyClass}>$412.9K</span>
        </>
      ),
      today: 'Today +9 · +$8,640',
    },
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.genesisTitle}</span>
          <span className={mobileCopyClass}>{t.community.titleShort}</span>
        </>
      ),
      value: 'S3',
      volume: 'Genesis Shareholder',
      today: (
        <>
          <span className={desktopCopyClass}>Upgrades +1 tier at launch</span>
          <span className={mobileCopyClass}>+1 @launch</span>
        </>
      ),
      dark: true,
    },
  ]

  return (
    <div className={shellContentPageClass}>
      <h2
        className={cn(shellContentHeadingClass, revealClass())}
        data-reveal
        id="community-title"
      >
        {t.community.myCommunity}
      </h2>

      <div className={COMMUNITY_STAT_GRID}>
        {stats.map((stat, index) => (
          <CommunityStatCard
            className={cn(COMMUNITY_STAT_CARD_CLASS, CONNECTED_STAT_CLASS)}
            dark={stat.dark}
            image={stat.image}
            key={index}
            label={stat.label}
            today={stat.today}
            value={stat.value}
            volume={stat.volume}
          />
        ))}
      </div>

      <CommunityFlowSection connected={connected} onSelectTab={onSelectTab} tab={tab} />

      <DappSection title={t.community.myInvites}>
        <ResponsiveTable
          className="mt-3.5 max-[820px]:hidden"
          compact
          headers={[
            t.tables.joined,
            t.tables.address,
            t.tables.personal,
            t.tables.title,
            t.tables.team,
            t.tables.volume,
          ]}
          linkColumns={[1]}
          rows={invites}
        />
        <ResponsiveTable
          className={cn(
            'max-[820px]:hidden',
            '[&_table]:table-fixed',
            '[&_th:nth-child(1)]:w-[23.08%] [&_td:nth-child(1)]:w-[23.08%]',
            '[&_th:nth-child(2)]:w-[30.77%] [&_td:nth-child(2)]:w-[30.77%]',
            '[&_th:nth-child(3)]:w-[15.38%] [&_td:nth-child(3)]:w-[15.38%]',
            '[&_th:nth-child(4)]:w-[15.38%] [&_td:nth-child(4)]:w-[15.38%]',
            '[&_th:nth-child(5)]:w-[15.38%] [&_td:nth-child(5)]:w-[15.38%]',
          )}
          compact
          emphasisColumns={[3]}
          headers={[
            t.tables.joined,
            t.tables.address,
            t.tables.title,
            t.tables.direct,
            t.tables.volume,
          ]}
          linkColumns={[2]}
          plain
          rows={compactInvites}
        />
        <ResponsiveTable
          className="hidden max-[820px]:block"
          compact
          headers={[
            t.tables.joined,
            t.tables.address,
            t.tables.title,
            'Vol.',
          ]}
          linkColumns={[1]}
          plain
          rows={mobileCommunityInvites}
        />
      </DappSection>
    </div>
  )
}

function MobileCommunityFirstStats() {
  const { messages: t } = useI18n()

  return (
    <>
      <h2
        className={cn(shellContentHeadingClass, revealClass(), 'hidden max-[820px]:block max-[820px]:mt-6')}
        data-reveal
        id="community-title"
      >
        {t.community.myCommunity}
      </h2>
      <div
        className={cn(
          revealClass(),
          'hidden max-[820px]:mt-3.5 max-[820px]:grid max-[820px]:grid-cols-3 max-[820px]:gap-2.5',
        )}
        data-reveal
      >
        <article className="grid min-h-[72px] place-items-center rounded-xl bg-card p-3 text-center shadow-card">
          <strong className="text-xl font-bold leading-[1.1] text-foreground">0</strong>
          <span className="text-xs leading-[1.35] text-faint">{t.community.directShort}</span>
        </article>
        <article className="grid min-h-[72px] place-items-center rounded-xl bg-card p-3 text-center shadow-card">
          <strong className="text-xl font-bold leading-[1.1] text-foreground">0</strong>
          <span className="text-xs leading-[1.35] text-faint">{t.community.myTeam}</span>
        </article>
        <article className="grid min-h-[72px] place-items-center rounded-xl bg-card p-3 text-center shadow-card">
          <strong className="text-xl font-bold leading-[1.1] text-foreground">S3</strong>
          <span className="text-xs leading-[1.35] text-faint">{t.community.titleShort}</span>
        </article>
      </div>
    </>
  )
}

function MobileCommunityFirstInvites() {
  const { messages: t } = useI18n()

  return (
    <DappSection
      className={cn(
        'hidden max-[820px]:block',
        '[&_td]:py-[7px] [&_th]:py-[7px]',
      )}
      title={t.community.myInvites}
    >
      <ResponsiveTable
        className="mt-3.5 hidden max-[820px]:block"
        compact
        headers={[
          t.tables.joined,
          t.tables.address,
          t.tables.title,
          'Vol.',
        ]}
        linkColumns={[1]}
        plain
        rows={mobileCommunityFirstVisitInvites}
      />
    </DappSection>
  )
}

function CommunityFlowSection({
  connected = false,
  onSelectTab,
  tab,
}: {
  connected?: boolean
  onSelectTab: (tab: DappTab) => void
  tab?: DappTab
}) {
  const { messages: t } = useI18n()
  const isCommunityTab = tab === 'community' || tab === undefined

  return (
    <>
      <DappSection
        className={cn(
          connected && isCommunityTab && 'max-[820px]:hidden',
          !connected && 'max-[820px]:mt-5',
        )}
        title={(
          <>
            <span className={cn(!connected && 'max-[820px]:hidden')}>{t.community.inviteTitle}</span>
            {!connected ? (
              <span className="hidden max-[820px]:inline">Start inviting</span>
            ) : null}
          </>
        )}
      >
        <InviteFlow items={inviteFlow} />
      </DappSection>

      <DappSection
        className={cn(
          connected && isCommunityTab && 'max-[820px]:hidden',
          !connected && 'max-[820px]:mt-[18px]',
        )}
        title={t.community.programs}
      >
        <div
          className={cn(
            'mt-4 grid grid-cols-2 gap-3',
            'max-[820px]:grid-cols-1 max-[820px]:gap-2.5',
          )}
        >
          {programs.map((program) => (
            <ProgramCard
              action={program.link}
              body={program.body}
              className={cn(
                'max-[820px]:gap-1.5 max-[820px]:py-3',
                '[&_h4]:tracking-[-0.48px] max-[820px]:[&_h4]:mt-1.5 max-[820px]:[&_h4]:mb-0 max-[820px]:[&_h4]:text-sm max-[820px]:[&_h4]:leading-[1.2]',
                '[&_p]:tracking-[-0.26px] max-[820px]:[&_p]:hidden',
                '[&_button]:tracking-[-0.26px]',
              )}
              key={program.label}
              label={program.label}
              onAction={() => onSelectTab('genesis')}
              title={program.title}
            />
          ))}
        </div>
      </DappSection>
    </>
  )
}
