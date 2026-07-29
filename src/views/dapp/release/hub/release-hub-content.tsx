import { useCallback, useEffect, useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/dapp-content-heading'
import { DappDetailBlock } from '~/app/shell/dapp-detail-block'
import { Text } from '~/shared/ui/text'
import { FaqList } from '~/shared/ui/faq-list'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '~/shared/ui/carousel'
import { cn } from '~/shared/lib/utils'

export function ReleaseHubContent() {
  const { messages: t } = useI18n()
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)
  const slides = t.release.hub.aboutSlides

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

  return (
    <DappDetailPage>
      <DappDetailBlock>
        <DappContentHeading id="release-hub-title">{t.release.hub.aboutTitle}</DappContentHeading>
        <Carousel className="w-full" opts={{ loop: true }} setApi={setApi}>
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.title}>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <Text as="p" className="mb-2 font-semibold" variant="copy">
                    {slide.title}
                  </Text>
                  <Text as="p" tone="muted-foreground" variant="copy">
                    {slide.body}
                  </Text>
                </div>
              </CarouselItem>
            ))}
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
            {slides.map((slide, i) => (
              <button
                aria-label={slide.title}
                className={cn(
                  'rounded-full transition-[width,background-color]',
                  i === index ? 'h-1.5 w-5.5 bg-primary' : 'size-1.5 bg-border',
                )}
                key={slide.title}
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
        <Text as="h3" className="mb-1 font-semibold" variant="headline">
          {t.release.hub.mechanismTitle}
        </Text>
        <Text as="p" className="mb-4" tone="muted-foreground" variant="caption">
          {t.release.hub.mechanismSubtitle}
        </Text>
        <ol className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {t.release.hub.mechanismSteps.map((step, stepIndex) => (
            <li className="rounded-2xl border border-border bg-card p-3" key={step.title}>
              <Text as="p" className="mb-1 font-semibold text-primary" variant="caption">
                {stepIndex + 1}
              </Text>
              <Text as="p" className="font-semibold" variant="copy">
                {step.title}
              </Text>
              <Text as="p" className="mt-1" tone="muted-foreground" variant="caption">
                {step.body}
              </Text>
            </li>
          ))}
        </ol>
        <div className="mb-4 grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
          <div>
            <Text as="p" className="mb-2 font-semibold" variant="copy">
              {t.release.hub.purposeTitle}
            </Text>
            <Text as="p" tone="muted-foreground" variant="caption">
              {t.release.hub.purposeBody}
            </Text>
          </div>
          <div>
            <Text as="p" className="mb-3 font-semibold" variant="copy">
              {t.release.hub.taxTitle}
            </Text>
            <div className="grid grid-cols-5 gap-2 text-center">
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.hub.taxPeriod}
              </Text>
              {t.release.hub.taxRows.periods.map((p) => (
                <Text as="span" key={p} variant="caption">
                  {p}
                </Text>
              ))}
              <Text as="span" tone="muted-foreground" variant="caption">
                {t.release.hub.taxRate}
              </Text>
              {t.release.hub.taxRows.rates.map((r) => (
                <Text
                  as="span"
                  className={r === '1%' ? 'font-semibold text-primary' : undefined}
                  key={r}
                  variant="caption"
                >
                  {r}
                </Text>
              ))}
            </div>
          </div>
        </div>
      </DappDetailBlock>

      <DappDetailBlock>
        <Text as="h3" className="mb-3 font-semibold" variant="headline">
          {t.release.faq.title}
        </Text>
        <FaqList items={t.release.faq.hub} variant="dapp" />
      </DappDetailBlock>
    </DappDetailPage>
  )
}
