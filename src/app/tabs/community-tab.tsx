import type { ReactNode } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'
import {
  usePerformance,
  useTeamReferrals,
} from '~/hooks/use-api-data'
import { useShareholderRank } from '~/hooks/use-shareholder-rank'
import {
  formatReferralLinkDisplay,
  formatPresaleRank,
  formatUsd,
  mapTeamReferralToCompactRow,
  mapTeamReferralToMobileRow,
} from '~/lib/api/format-display'
import { buildReferralSharePath } from '~/config/referral'
import { CommunityStatCardSkeleton } from '~/app/components/dapp-skeleton'
import { useAuth } from '~/providers/auth-provider'
import { useReferral } from '~/hooks/use-referral'
import { toast } from 'sonner'
import { resolveGenesisPurchaseError, toWalletUserFacingMessage } from '~/lib/web3/resolve-contract-error-message'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { shellWidgetRootClass } from '~/app/shell-layout'
import { useDappShell } from '~/app/dapp-shell-context'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { dappAssets } from '~/app/assets'
import type { DappTab, DetailPanelControls } from '~/app/types'
import { DappActionButton } from '~/app/components/dapp-action-button'
import {
  CommunityStatCard,
  DappReferrerBoundCard,
  DappSideCard,
  ProgramCard,
  SideHint,
  SideLabel,
  SideValue,
} from '~/app/components/dapp-card'
import { ReferrerAddressRow } from '~/app/components/referrer-address-row'
import { DappSection } from '~/app/components/dapp-section'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { DappPanelHeader } from '~/app/components/dapp-panel-header'
import { InviteFlow, InviteFlowStack } from '~/app/components/invite-flow'
import { QuickLinks } from '~/app/components/quick-links'
import { DappTableEmptyMessage } from '~/app/components/dapp-table-empty-message'
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { DappTablePagination } from '~/app/components/dapp-table-pagination'
import { ResponsiveTable } from '~/app/components/responsive-table'
import { DAPP_TABLE_PAGE_SIZE } from '~/lib/table-pagination'
import { FaqStack } from '~/app/components/faq-stack'

type CommunityStat = {
  dark?: boolean
  image?: string
  label: ReactNode
  today?: ReactNode
  value: ReactNode
  volume?: ReactNode
}

const REFERRAL_CARD_CLASS = cn(
  '[&_strong]:block [&_strong]:max-w-full [&_strong]:truncate',
  'rounded-2xl px-4 py-3.5 max-dapp:mt-0',
  '[&_label]:text-xs [&_label]:text-faint',
)

const COMMUNITY_WIDGET_SHELL_CLASS = cn(
  shellWidgetRootClass,
  'max-dapp:flex max-dapp:flex-col max-dapp:gap-3',
)

const SHAREHOLDER_ACTION_CLASS = cn(
  'mt-4 min-h-[42px] hover:shadow-primary-hover-xl focus-visible:shadow-primary-hover-xl max-dapp:hidden',
)

const COMMUNITY_STAT_GRID = cn(
  'mt-3.5 grid grid-cols-3 gap-3.5',
  'max-[1100px]:grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))]',
  'max-dapp:mt-3 max-dapp:min-w-0 max-dapp:grid-cols-3 max-dapp:gap-2.5',
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
    <div className={COMMUNITY_WIDGET_SHELL_CLASS}>
      <DappPanelHeader
        detailCollapsed={detailPanel.collapsed}
        onTogglePanel={detailPanel.onToggle}
        subtitle={t.community.intro}
        title={t.community.title}
      />

      <DappSideCard className={REFERRAL_CARD_CLASS}>
        <SideLabel>{t.community.referralLink}</SideLabel>
        <SideValue className="text-[13px] tracking-[-0.26px]">{isAuthenticated ? referralLink : '…'}</SideValue>
        <DappActionButton
          className="max-dapp:min-h-11 max-dapp:text-sm"
          disabled={!account}
          onClick={() => void copyReferralLink()}
        >
          {t.community.shareReferral}
        </DappActionButton>
      </DappSideCard>

      {referral.isBound ? (
        <DappReferrerBoundCard className="rounded-2xl px-4 py-3.5 max-dapp:mt-0">
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referrer}
          </p>
          <ReferrerAddressRow>
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
          </ReferrerAddressRow>
          <p className="text-xs leading-normal tracking-[-0.24px] text-muted-foreground">
            {t.community.referralBondPermanent}
          </p>
        </DappReferrerBoundCard>
      ) : (
        <DappSideCard className={cn(REFERRAL_CARD_CLASS, 'mt-2 grid gap-2')}>
          <SideLabel tone="muted">{t.community.referrer}</SideLabel>
          <div className="grid grid-cols-[minmax(0,1fr)_max-content] items-center gap-2">
            <input
              aria-label={t.community.referrerPlaceholder}
              className="w-full min-h-11 rounded-[11px] border border-border bg-card px-[14px] text-[13px] tracking-[-0.26px] text-muted-foreground outline-0 max-dapp:h-11"
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

      <CommunityQuickLinks className="max-dapp:mt-0" />

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
    <div className={COMMUNITY_WIDGET_SHELL_CLASS}>
      <DappPanelHeader
        detailCollapsed={detailPanel.collapsed}
        onTogglePanel={detailPanel.onToggle}
        subtitle={t.community.disconnectedIntro}
        title={t.community.title}
      />

      <DappSideCard className={cn(REFERRAL_CARD_CLASS, 'max-dapp:mt-0')}>
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

function CommunityQuickLinks({ className }: { className?: string }) {
  const { messages: t } = useI18n()

  return (
    <QuickLinks
      className={className}
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
  const isMobileViewport = useMobileViewport()
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

  const inviteRowsCompact =
    referrals?.items.map((item) =>
      isMobileViewport ? mapTeamReferralToMobileRow(item) : mapTeamReferralToCompactRow(item),
    ) ?? []
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
      <DappDetailPage className="max-dapp:pb-20">
        <CommunityFlowSection isMobileViewport={isMobileViewport} onSelectTab={onSelectTab} />
        <CommunityFaqSection />
      </DappDetailPage>
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

  const teamCount = String(referrals?.total ?? referralChain.directCount)
  const teamVolume = formatUsd(performance?.sales_team_market ?? 0)

  const shareholderRank = formatPresaleRank(displayRank)
  const genesisShareholderLabel = useStatPlaceholders || isRankLoading
    ? t.community.statGenesisVolume
    : displayRank > 0
      ? t.community.genesisShareholder
      : t.rewards.shareholderHintNoRank

  const stats: CommunityStat[] = [
    {
      label: t.community.directReferrals,
      value: directCount,
      volume: useStatPlaceholders ? (
        t.community.statDirectVolume
      ) : (
        `${t.community.volumePrefix} ${directVolume}`
      ),
      today: t.community.statDirectToday,
    },
    {
      label: t.community.myTeam,
      value: teamCount,
      volume: useStatPlaceholders ? (
        t.community.statTeamVolume
      ) : (
        `${t.community.volumePrefix} ${teamVolume}`
      ),
      today: t.community.statTeamToday,
    },
    {
      label: t.community.genesisTitle,
      value: shareholderRank,
      volume: genesisShareholderLabel,
      today: t.community.statGenesisToday,
      dark: !isMobileViewport,
    },
  ]

  return (
    <DappDetailPage>
      <DappContentHeading id="community-title" reveal>
        {t.community.myCommunity}
      </DappContentHeading>

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
              className={cn(
                isMobileViewport &&
                  'items-center text-center shadow-card [&>b]:hidden [&>small]:hidden [&>span]:text-[11px] [&>span]:tracking-[-0.11px] [&>strong]:text-lg [&>strong]:tracking-[-0.54px]',
              )}
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

      <CommunityFlowSection
        connected={connected}
        isMobileViewport={isMobileViewport}
        onSelectTab={onSelectTab}
        tab={tab}
      />

      <DappSection
        className="group-data-[tab=community]/shell:max-dapp:mt-0"
        title={inviteSectionTitle}
      >
        {showInvitesRequiresAuth ? (
          <DappTableEmptyState className="mt-3.5" />
        ) : showInvitesQueryEmpty ? (
          <DappTableEmptyMessage
            body={t.community.invitesEmpty.body}
            className="mt-3.5"
            title={t.community.invitesEmpty.title}
          />
        ) : (
          <>
            <ResponsiveTable
              className={cn(
                'mt-3.5 max-dapp:mt-3 max-dapp:rounded-2xl max-dapp:shadow-card',
                !isMobileViewport && [
                  '[&_table]:table-fixed',
                  '[&_th:nth-child(1)]:w-[23.08%] [&_td:nth-child(1)]:w-[23.08%]',
                  '[&_th:nth-child(2)]:w-[30.77%] [&_td:nth-child(2)]:w-[30.77%]',
                  '[&_th:nth-child(3)]:w-[15.38%] [&_td:nth-child(3)]:w-[15.38%]',
                  '[&_th:nth-child(4)]:w-[15.38%] [&_td:nth-child(4)]:w-[15.38%]',
                  '[&_th:nth-child(5)]:w-[15.38%] [&_td:nth-child(5)]:w-[15.38%]',
                ],
              )}
              compact
              emphasisColumns={isMobileViewport ? [] : [3]}
              headers={
                isMobileViewport
                  ? [
                      t.tables.joined,
                      t.tables.address,
                      t.tables.title,
                      t.tables.volume,
                    ]
                  : [
                      t.tables.joined,
                      t.tables.address,
                      t.tables.title,
                      t.tables.direct,
                      t.tables.volume,
                    ]
              }
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

      <CommunityFaqSection />
    </DappDetailPage>
  )
}

function CommunityFaqSection() {
  const { messages: t } = useI18n()

  return (
    <DappSection
      className="group-data-[tab=community]/shell:max-dapp:mt-0"
      title={t.community.faq.title}
    >
      <FaqStack items={t.community.faq.items} />
    </DappSection>
  )
}

function CommunityFlowSection({
  connected = false,
  isMobileViewport = false,
  onSelectTab,
}: {
  connected?: boolean
  isMobileViewport?: boolean
  onSelectTab: (tab: DappTab) => void
  tab?: DappTab
}) {
  const { messages: t } = useI18n()

  const inviteFlowItems = t.community.inviteFlow.items.map(({ title, body }) => ({
    copy: body,
    title,
  }))

  const programItems = t.community.programs.items

  return (
    <>
      <DappSection
        className={cn(
          connected && 'group-data-[tab=community]/shell:max-dapp:mt-0',
          !connected && 'max-dapp:mt-5',
        )}
        title={t.community.inviteTitle}
      >
        {isMobileViewport ? (
          <InviteFlowStack items={inviteFlowItems} />
        ) : (
          <InviteFlow items={inviteFlowItems} />
        )}
      </DappSection>

      <DappSection
        className={cn(
          connected && 'group-data-[tab=community]/shell:max-dapp:mt-0',
          !connected && 'max-dapp:mt-[18px]',
        )}
        title={t.community.programs.title}
      >
        <div
          className={cn(
            'mt-4 grid grid-cols-2 gap-3',
            'max-dapp:grid-cols-1 max-dapp:gap-2.5',
          )}
        >
          {programItems.map((program) => (
            <ProgramCard
              action={program.action}
              body={program.body}
              className={cn(
                'max-dapp:gap-1.5 max-dapp:py-3',
                '[&_h4]:tracking-[-0.48px] max-dapp:[&_h4]:mt-1.5 max-dapp:[&_h4]:mb-0 max-dapp:[&_h4]:text-sm max-dapp:[&_h4]:leading-[1.2]',
                '[&_p]:tracking-[-0.26px]',
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
