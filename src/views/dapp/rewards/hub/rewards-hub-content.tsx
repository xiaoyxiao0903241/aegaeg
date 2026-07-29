import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { DappTableCard } from '~/app/shell/dapp-table-card'
import { ResponsiveTable } from '~/app/shell/responsive-table'
import { Text } from '~/shared/ui/text'
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

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="rewards-hub-title">{t.rewards.hub.asideTitle}</DappContentHeading>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="copy">
          {t.rewards.hub.asideBody}
        </Text>
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-4">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.hub.stats.totalRewards}
            </Text>
            <Text as="p" className="mt-1 font-semibold" variant="copy">
              {sessionReady ? t.rewards.hub.balancePlaceholder : t.rewards.hub.signInForBalance}
            </Text>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.hub.stats.tier}
            </Text>
            <Text as="p" className="mt-1 font-semibold" variant="copy">
              {t.rewards.hub.stats.tierEmpty}
            </Text>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:col-span-2">
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.rewards.hub.stats.contribution}
            </Text>
            <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
              {t.rewards.hub.stats.contributionHint}
            </Text>
            <Button className="mt-3" onClick={() => openExchangeView('burn')} type="button">
              {t.rewards.hub.stats.goBurn}
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
        <ul className="grid gap-3">
          {t.rewards.faq.items.map((item) => (
            <li className="rounded-2xl border border-border bg-card p-4" key={item.q}>
              <Text as="p" className="font-semibold" variant="copy">
                {item.q}
              </Text>
              <Text as="p" className="mt-2" tone="muted-foreground" variant="copy">
                {item.a}
              </Text>
            </li>
          ))}
        </ul>
      </DappDetailBlock>
    </DappDetailPage>
  )
}
