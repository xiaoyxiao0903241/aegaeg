import { useQuery } from '@tanstack/react-query'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { DappTableEmptyMessage } from '~/app/shell/dapp-table-empty-message'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { useDappShell } from '~/app/use-dapp-shell'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readContributionSnapshot } from '~/web3/assets/assets-read'
import { readReferralCount } from '~/web3/referral/referral-read'
import { Button } from '~/shared/ui/button'
import { ChevronIcon } from '~/shared/ui/chevron-icon'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

const DASH = '—'
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function RewardsLuckyContent() {
  const { messages: t } = useI18n()
  const lucky = t.rewards.lucky

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{lucky.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.todayPool}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.eligibility}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {lucky.cumulativeWins}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-col gap-3.5 rounded-2xl bg-[#1c2234] px-5.5 py-5 text-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Text as="p" className="font-semibold text-white" variant="detail">
              {lucky.vrfTitle}
            </Text>
            <Button
              className="rounded-full border border-white/25 bg-transparent px-4 py-1.5 text-white hover:bg-white/10"
              disabled
              type="button"
              variant="secondary"
            >
              {lucky.verifyTutorial}
            </Button>
          </div>
          <Text as="p" className="text-[12.5px] leading-[21px] text-white/65" variant="caption">
            {lucky.vrfBody}
          </Text>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <DappContentHeading>{lucky.resultsTitle}</DappContentHeading>
          {/* Figma `4396:225` date pill — shell only until draw indexer exists */}
          <button
            aria-label={lucky.dateFilterAria}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card py-[7px] pr-3 pl-3.5 disabled:opacity-100"
            disabled
            type="button"
          >
            <Text as="span" className="text-[13px] font-semibold" variant="caption">
              {DASH}
            </Text>
            <ChevronIcon className="size-2.5 rotate-180 opacity-70" direction="up" />
          </button>
        </div>
        <DappTableCard className="mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <Text as="span" className="font-semibold" variant="caption">
              {lucky.resultsSummary.replace('{count}', DASH)}
            </Text>
            <Text as="span" className="text-primary underline" variant="caption">
              {lucky.verifyHash.replace('{hash}', DASH)}
            </Text>
          </div>
          <ResponsiveTable
            colWidths={['90px', '255px', '175px', '1fr']}
            headers={[...lucky.resultsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={lucky.emptyResults} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.historyTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['150px', '148px', '235px', '1fr']}
            headers={[...lucky.historyColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={lucky.emptyHistory} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{lucky.faq.title}</DappContentHeading>
        <FaqList items={lucky.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

function RewardsReferralContent() {
  const { messages: t } = useI18n()
  const referral = t.rewards.referral
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address

  const countQuery = useQuery({
    queryKey: ['chain', 'rewards', 'referral-count', address ?? ''],
    queryFn: () => readReferralCount(address as Address, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const contribQuery = useQuery({
    queryKey: [...queryKeys.chain.assetsContribution(address ?? ''), 'rewards-referral'],
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const referralCount =
    !walletReady || !address
      ? DASH
      : countQuery.isPending
        ? '…'
        : countQuery.data != null
          ? String(countQuery.data)
          : DASH

  const contributionValue =
    !walletReady || !address
      ? DASH
      : contribQuery.isPending
        ? '…'
        : contribQuery.data
          ? formatTokenAmount(contribQuery.data.contribution, AGX_DECIMALS, 2)
          : DASH

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading>{referral.dataTitle}</DappContentHeading>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.myPosition}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.directCount}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {referralCount}
            </Text>
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.contribution}
            </Text>
            <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
              <Text as="p" className="font-semibold" variant="copy">
                {contributionValue}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {referral.contributionHint}
              </Text>
            </div>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" tone="muted-foreground" variant="caption">
              {referral.nextPayout}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.recordsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['190px', '160px', '160px', '1fr']}
            headers={[...referral.recordsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyRecords} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.referralsTitle}</DappContentHeading>
        <DappTableCard className="mt-4">
          <ResponsiveTable
            colWidths={['200px', '170px', '110px', '1fr']}
            headers={[...referral.referralsColumns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={referral.emptyReferrals} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{referral.faq.title}</DappContentHeading>
        <FaqList items={referral.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}

export function RewardsDetailContent({ view }: { view: Exclude<RewardsView, 'hub'> }) {
  const { messages: t } = useI18n()
  if (view === 'lucky') return <RewardsLuckyContent />
  if (view === 'referral') return <RewardsReferralContent />

  const card = t.rewards.cards[view]

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id={`rewards-${view}-title`}>{card.title}</DappContentHeading>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="copy">
          {card.aside}
        </Text>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.claimHistory.title}</DappContentHeading>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['200px', '140px', '160px', '1fr']}
            headers={[...t.rewards.claimHistory.columns]}
            rows={[]}
          />
          <DappTableEmptyMessage embedded title={t.rewards.claimHistory.empty} />
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        <FaqList items={t.rewards.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
