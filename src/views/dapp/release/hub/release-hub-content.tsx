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
                <div className="rounded-2xl bg-card p-4 shadow-sm">
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
        <div className="flex flex-col gap-6 rounded-2xl bg-card px-4 py-6 shadow-sm">
          <ol className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {t.release.hub.mechanismSteps.map((step, stepIndex) => {
              const accent = stepIndex === 2
              return (
                <li className="grid min-w-0 flex-1 gap-3 text-center" key={step.title}>
                  <div className="flex items-center">
                    <span
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold',
                        accent
                          ? 'bg-primary text-white'
                          : 'border-[1.5px] border-border bg-card text-muted-foreground',
                      )}
                    >
                      {stepIndex + 1}
                    </span>
                    {stepIndex < t.release.hub.mechanismSteps.length - 1 ? (
                      <span aria-hidden className="ml-0 hidden h-0.5 flex-1 bg-border sm:block" />
                    ) : null}
                  </div>
                  <Text
                    as="p"
                    className={cn('font-medium', accent ? 'text-primary' : undefined)}
                    variant="copy"
                  >
                    {step.title}
                  </Text>
                  <Text
                    as="p"
                    className={accent ? 'text-primary' : undefined}
                    tone={accent ? undefined : 'muted-foreground'}
                    variant="caption"
                  >
                    {step.body}
                  </Text>
                </li>
              )
            })}
          </ol>
          <div className="border-t border-border" />
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Text as="p" className="mb-2 font-medium" variant="copy">
                {t.release.hub.purposeTitle}
              </Text>
              <Text as="p" tone="muted-foreground" variant="caption">
                {t.release.hub.purposeBody}
              </Text>
            </div>
            <div>
              <Text as="p" className="mb-3 font-medium" variant="copy">
                {t.release.hub.taxTitle}
              </Text>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3">
                <Text as="span" tone="muted-foreground" variant="caption">
                  {t.release.hub.taxPeriod}
                </Text>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {t.release.hub.taxRows.periods.map((p) => (
                    <Text as="span" className="font-medium" key={p} variant="caption">
                      {p}
                    </Text>
                  ))}
                </div>
                <Text as="span" tone="muted-foreground" variant="caption">
                  {t.release.hub.taxRate}
                </Text>
                <div className="grid grid-cols-4 gap-1 text-center">
                  {t.release.hub.taxRows.rates.map((r) => (
                    <Text
                      as="span"
                      className={r === '1%' ? 'font-semibold text-primary' : 'font-semibold'}
                      key={r}
                      variant="caption"
                    >
                      {r}
                    </Text>
                  ))}
                </div>
              </div>
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
