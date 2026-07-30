import { useQuery } from '@tanstack/react-query'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { openExchangeView } from '~/shared/config/open-exchange-view'
import { Button } from '~/shared/ui/button'
import { useDappShell } from '~/app/use-dapp-shell'
import { DappCarousel } from '~/app/shell/dapp-carousel'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import type { Address } from '~/shared/config/contracts'
import { queryKeys } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'
import { useChainReadClient } from '~/web3/use-chain-read-client'
import { readContributionSnapshot } from '~/web3/assets/assets-read'

/** Figma about carousel · 4 dots（推荐/参与/共建/幸运）；发展/创世不进轮播。 */
const ABOUT_VIEWS = ['referral', 'participate', 'cobuild', 'lucky'] as const

const DASH = '—'
const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const { walletReady } = useDappShell()
  const account = useActiveAccount()
  const readClient = useChainReadClient()
  const address = account?.address
  const contribQuery = useQuery({
    queryKey: queryKeys.chain.assetsContribution(address ?? ''),
    queryFn: () => readContributionSnapshot(address as Address, 0n, readClient),
    enabled: Boolean(walletReady && address && readClient),
  })

  const tier = t.rewards.hub.tierTable
  const stats = t.rewards.hub.stats
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
        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.tier}
            </Text>
            <Text as="p" className="mt-1.5 text-[13px]" tone="muted-foreground" variant="detail">
              {stats.tierEmpty}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.personalHolding}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.totalPerformance}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.smallAreaPerformance}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
          </div>
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
                {stats.contribution}
              </Text>
              <Button
                className="h-4 shrink-0 rounded-full bg-primary px-2 text-[10px] text-primary-foreground hover:bg-primary/90"
                onClick={() => openExchangeView('burn')}
                size="sm"
                type="button"
              >
                {stats.goBurn}
              </Button>
            </div>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {contributionValue}
            </Text>
            <Text as="p" className="mt-1 text-[13px]" tone="muted-foreground" variant="detail">
              {stats.contributionHint}
            </Text>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.aboutTitle}</DappContentHeading>
        <DappCarousel
          slides={ABOUT_VIEWS.map((view) => {
            const slide = t.rewards.hub.aboutSlides[view]
            return {
              key: view,
              content: (
                <div className="rounded-2xl border border-border bg-card px-4 py-6 shadow-sm">
                  <Text as="p" className="font-semibold" variant="copy">
                    {slide.title}
                  </Text>
                  <Text as="p" className="mt-3" tone="muted-foreground" variant="detail">
                    {slide.body}
                  </Text>
                </div>
              ),
            }
          })}
        />
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.mechanismTitle}</DappContentHeading>
        <Text as="p" className="mb-3" tone="muted-foreground" variant="detail">
          {t.rewards.hub.mechanismBody}
        </Text>
        <DappTableCard>
          <ResponsiveTable
            colWidths={['160px', '160px', '160px', '1fr', '112px']}
            headers={[...tier.columns]}
            rows={tier.rows.map((row) => [
              row.level,
              row.holding,
              row.accounts,
              row.team,
              row.rate,
            ])}
          />
          <Text as="p" className="mt-3.5 text-[13px]" tone="muted-foreground" variant="detail">
            {t.rewards.hub.mechanismFooter}
          </Text>
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        <FaqList items={t.rewards.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
