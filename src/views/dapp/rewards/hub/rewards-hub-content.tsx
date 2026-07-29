import { useCallback, useEffect, useState } from 'react'
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
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~/shared/ui/carousel'
import { cn } from '~/shared/lib/utils'
import type { RewardsView } from '~/shared/config/rewards-deep-link'

const ABOUT_VIEWS = [
  'lucky',
  'referral',
  'participate',
  'cobuild',
  'grant',
  'genesis',
] as const satisfies readonly Exclude<RewardsView, 'hub'>[]

const DASH = '—'

export function RewardsHubContent() {
  const { messages: t } = useI18n()
  const { sessionReady } = useDappShell()
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!api) return
    setIndex(api.selectedScrollSnap())
  }, [api])

  useEffect(() => {
    if (!api) return
    onSelect()
    api.on('select', onSelect)
    return () => {
      api.off('select', onSelect)
    }
  }, [api, onSelect])

  const tier = t.rewards.hub.tierTable
  const emptyValue = sessionReady
    ? t.rewards.hub.balancePlaceholder
    : t.rewards.hub.signInForBalance
  const stats = t.rewards.hub.stats

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <div className="mb-6 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl bg-card p-4 shadow-sm">
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.totalRewards}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {emptyValue}
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
            <Text as="p" className="text-[13px]" tone="muted-foreground" variant="caption">
              {stats.contribution}
            </Text>
            <Text as="p" className="mt-1.5 font-semibold" variant="copy">
              {DASH}
            </Text>
            <Text as="p" className="mt-1 text-[13px]" tone="muted-foreground" variant="detail">
              {stats.contributionHint}
            </Text>
            <Button
              className="mt-2 h-auto p-0 text-primary"
              onClick={() => openExchangeView('burn')}
              type="button"
              variant="link"
            >
              {stats.goClaim}
            </Button>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.hub.aboutTitle}</DappContentHeading>
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {ABOUT_VIEWS.map((view) => {
              const slide = t.rewards.hub.aboutSlides[view]
              return (
                <CarouselItem key={view}>
                  <div className="rounded-2xl border border-border bg-card px-4 py-6 shadow-sm">
                    <Text as="p" className="font-semibold" variant="copy">
                      {slide.title}
                    </Text>
                    <Text as="p" className="mt-3" tone="muted-foreground" variant="detail">
                      {slide.body}
                    </Text>
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
        </Carousel>
        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            aria-label="prev"
            className="grid size-4 place-items-center text-muted-foreground"
            onClick={() => api?.scrollPrev()}
            type="button"
          >
            ‹
          </button>
          <div className="flex items-center gap-1.5">
            {ABOUT_VIEWS.map((view, i) => (
              <button
                aria-label={view}
                className={cn(
                  'rounded-full transition-[width,background-color]',
                  i === index ? 'h-1.5 w-5.5 bg-primary' : 'size-1.5 bg-border',
                )}
                key={view}
                onClick={() => api?.scrollTo(i)}
                type="button"
              />
            ))}
          </div>
          <button
            aria-label="next"
            className="grid size-4 place-items-center text-muted-foreground"
            onClick={() => api?.scrollNext()}
            type="button"
          >
            ›
          </button>
        </div>
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
        </DappTableCard>
      </DappDetailBlock>

      <DappDetailBlock>
        <DappContentHeading>{t.rewards.faq.title}</DappContentHeading>
        <FaqList items={t.rewards.faq.items} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
