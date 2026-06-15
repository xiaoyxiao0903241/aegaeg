import type { ReactNode } from 'react'
import { useCallback, useEffect } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '../../i18n/use-i18n'
import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'
import {
  usePerformance,
  useTeamReferrals,
} from '../../hooks/use-api-data'
import { useShareholderRank } from '../../hooks/use-shareholder-rank'
import {
  formatReferralLinkDisplay,
  formatPresaleRank,
  formatUsd,
  formatUsdCompact,
  mapTeamReferralToCompactRow,
  mapTeamReferralToMobileRow,
} from '../../lib/api/format-display'
import { buildReferralSharePath } from '../../config/referral'
import { CommunityStatCardSkeleton } from '../components/dapp-skeleton'
import { useAuth } from '../../providers/auth-provider'
import { useReferral } from '../../hooks/use-referral'
import { toast } from 'sonner'
import { toWalletUserFacingMessage } from '../../lib/web3/resolve-contract-error-message'
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
  mobileCommunityFirstVisitInvites,
  mobileCommunityInvites,
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

const REFERRAL_CARD_CLASS = cn(
  '[&_button]:mt-2',
  '[&_strong]:block [&_strong]:max-w-full [&_strong]:truncate',
)

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
  'max-[820px]:[&:not(.is-dark)>span]:text-xs max-[820px]:[&:not(.is-dark)>span]:leading-[1.35] max-[820px]:[&:not(.is-dark)>span]:text-faint',
  'max-[820px]:[&.is-dark>span]:text-xs max-[820px]:[&.is-dark>span]:leading-[1.35] max-[820px]:[&.is-dark>span]:text-on-dark',
  'max-[820px]:[&>strong]:mt-[3px] max-[820px]:[&>strong]:text-2xl max-[820px]:[&>strong]:leading-[1.05]',
  'max-[820px]:[&>b]:hidden max-[820px]:[&>small]:hidden',
  '[&>strong]:tracking-[-1.2px]',
  'max-[820px]:[&.is-dark>small]:hidden',
)

const CONNECTED_STAT_CLASS = cn(
  'community-stat',
  'max-[820px]:min-h-[90px] max-[820px]:items-start max-[820px]:rounded-[14px] max-[820px]:border-0 max-[820px]:p-[13px_12px] max-[820px]:text-left max-[820px]:shadow-card',
  'max-[820px]:[&>span]:w-full max-[820px]:[&>span]:text-[11px] max-[820px]:[&>span]:leading-[1.5]',
  'max-[820px]:[&.is-dark>span]:text-on-dark',
  'max-[820px]:[&>strong]:mt-1 max-[820px]:[&>strong]:w-full max-[820px]:[&>strong]:text-2xl',
  'max-[820px]:[&>b]:mt-1 max-[820px]:[&>b]:block max-[820px]:[&>b]:w-full max-[820px]:[&>b]:text-[11px] max-[820px]:[&>b]:leading-[1.2]',
  'max-[820px]:[&:not(.is-dark)>small]:mt-1 max-[820px]:[&:not(.is-dark)>small]:block max-[820px]:[&:not(.is-dark)>small]:w-full max-[820px]:[&:not(.is-dark)>small]:text-[11px] max-[820px]:[&:not(.is-dark)>small]:leading-[1.2]',
  'max-[820px]:[&.is-dark>b]:text-coral-bright',
  'max-[820px]:[&.is-dark>small]:mt-1 max-[820px]:[&.is-dark>small]:block max-[820px]:[&.is-dark>small]:w-full max-[820px]:[&.is-dark>small]:text-[11px] max-[820px]:[&.is-dark>small]:leading-[1.2] max-[820px]:[&.is-dark>small]:text-on-dark',
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
  const account = useActiveAccount()
  const { isAuthenticated } = useAuth()
  const referral = useReferral(true)
  const referralLink = account ? formatReferralLinkDisplay(account.address) : '—'

  const copyReferralLink = useCallback(async () => {
    if (!account) return
    const url = `${window.location.origin}${window.location.pathname}${buildReferralSharePath(account.address)}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success(t.wallet.copied)
    } catch {
      // Clipboard permission denied — no success toast.
    }
  }, [account, t.wallet.copied])

  const copyReferrerAddress = useCallback(async () => {
    if (!referral.referrer) return
    try {
      await navigator.clipboard.writeText(referral.referrer)
      toast.success(t.wallet.copied)
    } catch {
      // Clipboard permission denied — no success toast.
    }
  }, [referral.referrer, t.wallet.copied])

  useEffect(() => {
    if (!referral.error) return
    const message = toWalletUserFacingMessage(referral.error)
    if (message) toast.error(message)
  }, [referral.error])

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
        <SideValue>{isAuthenticated ? referralLink : '…'}</SideValue>
        <DappActionButton disabled={!account} onClick={() => void copyReferralLink()}>
          {t.community.shareReferral}
        </DappActionButton>
      </DappSideCard>

      <DappSideCard className="mt-2">
        <SideLabel tone="muted">{t.community.referrer}</SideLabel>
        <div className={REFERRER_ADDRESS_CLASS}>
          <span className="grid aspect-square w-6 flex-none place-items-center rounded-full bg-accent text-[10px] font-semibold text-primary">
            R
          </span>
          <strong>{referral.referrerLabel ?? (referral.isLoading ? '…' : '—')}</strong>
          {referral.referrer ? (
            <button
              aria-label={t.common.copy}
              onClick={() => void copyReferrerAddress()}
              type="button"
            >
              <img alt="" height="16" src={dappAssets.copy} width="16" />
            </button>
          ) : null}
        </div>
        {!referral.isBound ? (
          <div className="mt-2 grid grid-cols-[minmax(0,1fr)_max-content] items-end gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-[11px] border border-border bg-background px-3.5 text-muted-foreground outline-0"
              onChange={(event) => referral.setReferrerInput(event.currentTarget.value)}
              placeholder={t.community.referrerPlaceholder}
              value={referral.referrerInput}
            />
            <DappActionButton
              disabled={referral.isSubmitting}
              loading={referral.isSubmitting}
              onClick={() =>
                void referral.bind().then((ok) => ok && toast.success(t.community.bindReferrerSuccess))
              }
              shape="inline"
              variant="secondary"
            >
              {t.community.bindReferrer}
            </DappActionButton>
          </div>
        ) : null}
        <SideHint>
          {referral.isBound
            ? t.community.referralBondActive.replace('{count}', referral.directCount)
            : t.community.referrerHint}
        </SideHint>
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
  const { connected } = useDappShell()
  const referral = useReferral(connected)

  useEffect(() => {
    if (!referral.error) return
    const message = toWalletUserFacingMessage(referral.error)
    if (message) toast.error(message)
  }, [referral.error])

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
              className="w-full min-h-11 rounded-[11px] border border-border bg-background px-3.5 text-muted-foreground outline-0 disabled:opacity-60"
              disabled={!connected || referral.isBound}
              onChange={(event) => referral.setReferrerInput(event.currentTarget.value)}
              placeholder={t.community.referrerPlaceholder}
              value={referral.referrerInput}
            />
          </label>
          <DappActionButton
            disabled={!connected || referral.isBound || referral.isSubmitting}
            loading={referral.isSubmitting}
            onClick={() => void referral.bind().then((ok) => ok && toast.success(t.community.bindReferrerSuccess))}
            shape="inline"
            variant="secondary"
          >
            {t.community.bindReferrer}
          </DappActionButton>
        </div>
        <SideHint>{referral.isBound ? t.community.boundTo.replace('{address}', referral.referrerLabel ?? '—') : t.community.referrerHint}</SideHint>
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
  const { isAuthenticated, isLoggingIn } = useAuth()
  const referralChain = useReferral(connected)
  const apiEnabled = connected && isAuthenticated
  const { data: performance, isLoading: performanceLoading } = usePerformance(apiEnabled)
  const { displayRank, isRankLoading } = useShareholderRank()
  const { data: referrals, isLoading: referralsLoading } = useTeamReferrals(
    { page: 1, page_size: 20 },
    apiEnabled,
  )

  const inviteRowsCompact = referrals?.items.map(mapTeamReferralToCompactRow) ?? []
  const inviteRowsMobile = referrals?.items.map(mapTeamReferralToMobileRow) ?? []
  const useMockInvites = !connected
  const authPending = connected && (isLoggingIn || !isAuthenticated)
  const compactRows = useMockInvites ? compactInvites : inviteRowsCompact
  const mobileRows = useMockInvites ? mobileCommunityInvites : inviteRowsMobile
  const showInvitesSkeleton =
    !useMockInvites && (authPending || referralsLoading) && compactRows.length === 0
  const inviteCount = useMockInvites
    ? String(compactInvites.length)
    : referralsLoading || authPending
      ? '…'
      : String(referrals?.total ?? Number(referralChain.directCount || 0))
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const showInvitesEmpty =
    !useMockInvites && !referralsLoading && !authPending && inviteRowsCompact.length === 0

  if (!connected) {
    return (
      <div className={cn(shellContentPageClass, 'max-[820px]:pb-20')}>
        <MobileCommunityFirstStats />
        <CommunityFlowSection onSelectTab={onSelectTab} />
        <MobileCommunityFirstInvites />
      </div>
    )
  }

  const useStatPlaceholders =
    authPending ||
    performanceLoading ||
    referralsLoading ||
    referralChain.isLoading ||
    isRankLoading

  const directCount = referralChain.directCount
  const directVolume = formatUsd(performance?.direct_presale_volume ?? 0)
  const directVolumeCompact = formatUsdCompact(performance?.direct_presale_volume ?? 0)

  const teamCount = String(referrals?.total ?? referralChain.directCount)
  const teamVolume = formatUsd(performance?.sales_team_market ?? 0)
  const teamVolumeCompact = formatUsdCompact(performance?.sales_team_market ?? 0)

  const shareholderRank = formatPresaleRank(displayRank)
  const genesisShareholderLabel = useStatPlaceholders || isRankLoading
    ? t.community.statGenesisVolume
    : displayRank > 0
      ? t.community.genesisShareholder
      : t.rewards.shareholderHintNoRank

  const stats: CommunityStat[] = [
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.directReferrals}</span>
          <span className={mobileCopyClass}>{t.community.directShort}</span>
        </>
      ),
      value: directCount,
      volume: useStatPlaceholders ? (
        <>
          <span className={desktopCopyClass}>{t.community.statDirectVolume}</span>
          <span className={mobileCopyClass}>{t.community.statDirectVolumeShort}</span>
        </>
      ) : (
        <>
          <span className={desktopCopyClass}>{t.community.volumePrefix} {directVolume}</span>
          <span className={mobileCopyClass}>{directVolumeCompact}</span>
        </>
      ),
      today: t.community.statDirectToday,
    },
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.myTeam}</span>
          <span className={mobileCopyClass}>{t.community.myTeam}</span>
        </>
      ),
      value: teamCount,
      volume: useStatPlaceholders ? (
        <>
          <span className={desktopCopyClass}>{t.community.statTeamVolume}</span>
          <span className={mobileCopyClass}>{t.community.statTeamVolumeShort}</span>
        </>
      ) : (
        <>
          <span className={desktopCopyClass}>{t.community.volumePrefix} {teamVolume}</span>
          <span className={mobileCopyClass}>{teamVolumeCompact}</span>
        </>
      ),
      today: t.community.statTeamToday,
    },
    {
      label: (
        <>
          <span className={desktopCopyClass}>{t.community.genesisTitle}</span>
          <span className={mobileCopyClass}>{t.community.titleShort}</span>
        </>
      ),
      value: shareholderRank,
      volume: genesisShareholderLabel,
      today: (
        <>
          <span className={desktopCopyClass}>{t.community.statGenesisToday}</span>
          <span className={mobileCopyClass}>{t.community.statGenesisTodayShort}</span>
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
        {useStatPlaceholders ? (
          <>
            <CommunityStatCardSkeleton />
            <CommunityStatCardSkeleton />
            <CommunityStatCardSkeleton dark />
          </>
        ) : (
          stats.map((stat, index) => (
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
          ))
        )}
      </div>

      <CommunityFlowSection connected={connected} onSelectTab={onSelectTab} tab={tab} />

      <DappSection title={inviteSectionTitle}>
        {showInvitesEmpty ? (
          <InvitesEmptyState />
        ) : (
          <>
            <ResponsiveTable
              className={cn(
                'mt-3.5 max-[820px]:hidden',
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
              isLoading={showInvitesSkeleton}
              linkColumns={[1]}
              plain
              rows={compactRows}
            />
            <ResponsiveTable
              className="mt-3.5 hidden max-[820px]:block"
              compact
              headers={[
                t.tables.joined,
                t.tables.address,
                t.tables.title,
                t.tables.volumeShort,
              ]}
              isLoading={showInvitesSkeleton}
              linkColumns={[1]}
              plain
              rows={mobileRows}
            />
          </>
        )}
      </DappSection>
    </div>
  )
}

function InvitesEmptyState() {
  const { messages: t } = useI18n()

  return (
    <div
      className={cn(
        revealClass(),
        'mt-3.5 grid justify-items-center gap-[18px] overflow-hidden rounded-[18px] bg-card p-[30px_24px] shadow-card',
        'max-[820px]:gap-3.5 max-[820px]:border max-[820px]:border-border max-[820px]:p-[22px_16px] max-[820px]:shadow-none',
      )}
      data-reveal
    >
      <div aria-hidden="true" className="grid w-full gap-3 max-[820px]:gap-[11px]">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            className={cn(
              'grid grid-cols-[minmax(72px,1fr)_minmax(96px,1.4fr)_repeat(3,minmax(40px,0.7fr))] items-center gap-3.5',
              'max-[820px]:grid-cols-[minmax(56px,80px)_1fr_minmax(46px,56px)] max-[820px]:gap-2.5',
            )}
            key={index}
          >
            <span className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
            <i className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
            <b className="h-3.5 rounded-lg bg-border max-[820px]:h-3 max-[820px]:hidden" />
            <b className="h-3.5 rounded-lg bg-border max-[820px]:hidden" />
            <b className="h-3.5 rounded-lg bg-border max-[820px]:h-3" />
          </div>
        ))}
      </div>
      <div className="grid justify-items-center gap-1.5 text-center text-faint max-[820px]:w-full max-[820px]:gap-[5px]">
        <strong className="text-[15px] font-semibold leading-[1.2] text-foreground max-[820px]:text-sm">
          {t.community.invitesEmptyTitle}
        </strong>
        <p className="m-0 max-w-[42ch] text-[13px] leading-normal max-[820px]:max-w-none max-[820px]:text-xs">
          {t.community.invitesEmptyBody}
        </p>
      </div>
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
      title={t.community.myInvites.replace(
        '{count}',
        String(mobileCommunityFirstVisitInvites.length),
      )}
    >
      <ResponsiveTable
        className="mt-3.5 hidden max-[820px]:block"
        compact
        headers={[
          t.tables.joined,
          t.tables.address,
          t.tables.title,
          t.tables.volumeShort,
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

  const inviteFlowItems = [
    {
      title: t.community.inviteFlowShareTitle,
      copy: t.community.inviteFlowShareBody,
    },
    {
      title: t.community.inviteFlowJoinTitle,
      copy: t.community.inviteFlowJoinBody,
    },
    {
      title: t.community.inviteFlowEarnTitle,
      copy: t.community.inviteFlowEarnBody,
    },
  ]

  const programItems = [
    {
      label: t.community.programGenesisLabel,
      title: t.community.programGenesisTitle,
      body: t.community.programGenesisBody,
      link: t.community.programGenesisAction,
    },
    {
      label: t.community.programAcademyLabel,
      title: t.community.programAcademyTitle,
      body: t.community.programAcademyBody,
      link: t.community.programAcademyAction,
    },
  ]

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
              <span className="hidden max-[820px]:inline">{t.community.startInvitingMobile}</span>
            ) : null}
          </>
        )}
      >
        <InviteFlow items={inviteFlowItems} />
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
          {programItems.map((program) => (
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
