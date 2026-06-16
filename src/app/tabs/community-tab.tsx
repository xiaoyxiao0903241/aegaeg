import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
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
} from '../../lib/api/format-display'
import { buildReferralSharePath } from '../../config/referral'
import { CommunityStatCardSkeleton } from '../components/dapp-skeleton'
import { useAuth } from '../../providers/auth-provider'
import { useReferral } from '../../hooks/use-referral'
import { toast } from 'sonner'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '../../lib/web3/resolve-contract-error-message'
import {
  desktopCopyClass,
  mobileCopyClass,
  shellContentHeadingClass,
  shellContentPageClass,
  shellMobilePageTitleClass,
  shellModulePanelClass,
} from '../shell-layout'
import { useDappShell } from '../dapp-shell-context'
import { dappAssets } from '../assets'
import type { DappTab, DetailPanelControls } from '../types'
import { DappActionButton } from '../components/dapp-action-button'
import {
  CommunityStatCard,
  DappReferrerBoundCard,
  DappSideCard,
  ProgramCard,
  SideHint,
  SideLabel,
  SideValue,
} from '../components/dapp-card'
import { dappLayout, dappSpacing } from '../../components/primitive-styles'
import { DappSection } from '../components/dapp-section'
import { DappWidgetHeader } from '../components/dapp-widget-header'
import { InviteFlow } from '../components/invite-flow'
import { QuickLinks } from '../components/quick-links'
import { DappTableEmptyMessage } from '../components/dapp-table-empty-message'
import { DappTableEmptyState } from '../components/dapp-table-empty-state'
import { DappTablePagination } from '../components/dapp-table-pagination'
import { ResponsiveTable } from '../components/responsive-table'
import { DAPP_TABLE_PAGE_SIZE } from '../../lib/table-pagination'

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}

const REFERRAL_CARD_CLASS = '[&_strong]:block [&_strong]:max-w-full [&_strong]:truncate'

const SHAREHOLDER_ACTION_CLASS = cn(
  'mt-4 min-h-12 hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-[820px]:hidden',
)

const COMMUNITY_MY_COMMUNITY_HEADING_CLASS = cn(
  shellContentHeadingClass,
  revealClass(),
  'max-[820px]:mt-0.5',
)

const COMMUNITY_WIDGET_HEADER_CLASS = cn(
  shellMobilePageTitleClass,
  'max-[820px]:[&_p]:mt-3',
)

const COMMUNITY_STAT_GRID = cn(
  'mt-3.5 grid grid-cols-3 gap-3.5',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  'max-[820px]:min-w-0 max-[820px]:grid-cols-3 max-[820px]:gap-2.5',
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
        className={COMMUNITY_WIDGET_HEADER_CLASS}
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

      {referral.isBound ? (
        <DappReferrerBoundCard>
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referrer}
          </p>
          <div className={dappLayout.referrerAddrRow}>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="grid size-6 flex-none place-items-center rounded-full bg-accent text-[10px] font-semibold leading-[1.2] text-primary">
                R
              </span>
              <strong className="truncate text-sm font-semibold leading-[1.2] tracking-[-0.28px] text-foreground">
                {referral.referrerLabel ?? '—'}
              </strong>
            </div>
            {referral.referrer ? (
              <button
                aria-label={t.common.copy}
                className="grid size-[30px] shrink-0 cursor-pointer place-items-center rounded-[8px] bg-transparent"
                onClick={() => void copyReferrerAddress()}
                type="button"
              >
                <img alt="" height="16" src={dappAssets.copy} width="16" />
              </button>
            ) : null}
          </div>
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referralBondPermanent}
          </p>
        </DappReferrerBoundCard>
      ) : (
        <DappSideCard className={dappSpacing.stackBetweenCards}>
          <SideLabel tone="muted">{t.community.referrer}</SideLabel>
          <div className="grid grid-cols-[minmax(0,1fr)_max-content] items-end gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-[11px] border border-border bg-card px-[14px] text-[13px] tracking-[-0.26px] text-muted-foreground outline-0"
              onChange={(event) => referral.setReferrerInput(event.currentTarget.value)}
              placeholder={t.community.referrerPlaceholder}
              value={referral.referrerInput}
            />
            <DappActionButton
              disabled={!referral.canBind}
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
          <SideHint>{t.community.referrerHint}</SideHint>
        </DappSideCard>
      )}

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
  const { connected, needsSignIn } = useDappShell()
  const referral = useReferral(connected)

  useEffect(() => {
    if (!referral.error) return
    const message =
      resolveGenesisPurchaseError(referral.error, {
        insufficientAllowance: t.genesis.insufficientAllowance,
        insufficientUsd1: t.genesis.insufficientUsd1,
        purchaseUnavailable: t.genesis.purchaseUnavailable,
        walletNotConnected: t.genesis.walletNotConnected,
      }) ?? toWalletUserFacingMessage(referral.error)
    if (message) toast.error(message)
  }, [
    referral.error,
    t.genesis.insufficientAllowance,
    t.genesis.insufficientUsd1,
    t.genesis.purchaseUnavailable,
    t.genesis.walletNotConnected,
  ])

  return (
    <div className={shellModulePanelClass}>
      <DappWidgetHeader
        className={COMMUNITY_WIDGET_HEADER_CLASS}
        detailCollapsed={detailPanel.collapsed}
        intro={t.community.intro}
        onTogglePanel={detailPanel.onToggle}
        title={t.community.title}
      />

      <DappSideCard className="max-[820px]:mt-[22px]">
        <SideLabel>{t.community.referrer}</SideLabel>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_max-content] items-end gap-2">
          <label className="grid gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-[11px] border border-border bg-card px-[14px] text-[13px] tracking-[-0.26px] text-muted-foreground outline-0 disabled:opacity-60"
              disabled={!connected || referral.isBound}
              onChange={(event) => referral.setReferrerInput(event.currentTarget.value)}
              placeholder={t.community.referrerPlaceholder}
              value={referral.referrerInput}
            />
          </label>
          <DappActionButton
            disabled={!referral.canBind}
            loading={referral.isSubmitting}
            onClick={() => void referral.bind().then((ok) => ok && toast.success(t.community.bindReferrerSuccess))}
            shape="inline"
            variant="secondary"
          >
            {t.community.bindReferrer}
          </DappActionButton>
        </div>
        <SideHint>
          {needsSignIn && !referral.isBound
            ? t.wallet.signInRequired
            : referral.isBound
              ? t.community.boundTo.replace('{address}', referral.referrerLabel ?? '—')
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
  const [invitesPage, setInvitesPage] = useState(1)
  const { data: performance, isLoading: performanceLoading } = usePerformance(apiEnabled)
  const { displayRank, isRankLoading } = useShareholderRank()
  const { data: referrals, isLoading: referralsLoading } = useTeamReferrals(
    { page: invitesPage, page_size: DAPP_TABLE_PAGE_SIZE },
    apiEnabled,
  )

  const inviteRowsCompact = referrals?.items.map(mapTeamReferralToCompactRow) ?? []
  const compactRows = inviteRowsCompact
  const invitesTotal = referrals?.total ?? 0
  const showInvitesRequiresAuth = !apiEnabled && !isLoggingIn
  const showInvitesSkeleton = apiEnabled && referralsLoading && compactRows.length === 0
  const showInvitesQueryEmpty = apiEnabled && !referralsLoading && compactRows.length === 0
  const inviteCount = !apiEnabled
    ? '0'
    : referralsLoading || isLoggingIn
      ? '…'
      : String(referrals?.total ?? Number(referralChain.directCount || 0))
  const inviteSectionTitle = t.community.myInvites.replace('{count}', inviteCount)
  const authPending = connected && (isLoggingIn || !isAuthenticated)

  if (!connected) {
    return (
      <div className={cn(shellContentPageClass, 'max-[820px]:pb-20')}>
        <CommunityFlowSection onSelectTab={onSelectTab} />
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
        className={COMMUNITY_MY_COMMUNITY_HEADING_CLASS}
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
        {showInvitesRequiresAuth ? (
          <DappTableEmptyState className="mt-3.5" />
        ) : showInvitesQueryEmpty ? (
          <DappTableEmptyMessage
            body={t.community.invitesEmptyBody}
            className="mt-3.5"
            title={t.community.invitesEmptyTitle}
          />
        ) : (
          <>
            <ResponsiveTable
              className={cn(
                'mt-3.5',
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
            <DappTablePagination
              onPageChange={setInvitesPage}
              page={invitesPage}
              total={invitesTotal}
            />
          </>
        )}
      </DappSection>
    </div>
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
