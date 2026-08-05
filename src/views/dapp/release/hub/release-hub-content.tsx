import { dappAssets } from '~/app/assets'
import { DappAboutCard } from '~/app/shell/dapp-about-card'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Carousel } from '~/shared/components/carousel'
import { Detail } from '~/shared/components/detail'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'
import { Steps } from '~/shared/components/steps'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/** 税率表高亮列：稿 20 天 / 60 天（4791:3602/3603） */
const TAX_HIGHLIGHT_PERIOD_INDEX = new Set([1, 3])

export function ReleaseHubContent() {
  const { messages: t } = useI18n()
  const slides = t.release.hub.aboutSlides
  const periods = t.release.hub.taxRows.periods
  const rates = t.release.hub.taxRows.rates
  const steps = t.release.hub.mechanismSteps

  return (
    <Detail>
      {/* Figma right-col 4371:262：节距 ≡ Detail gap-8.5 */}
      <Section>
        <Section.Title id="release-hub-title">{t.release.hub.aboutTitle}</Section.Title>
        <Carousel opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}>
          <Carousel.Content>
            {slides.map((slide) => (
              <Carousel.Item key={slide.title}>
                <DappAboutCard
                  // 4299:213：p16 · radius/lg · deco 91×91 右上；高随文案
                  body={slide.body}
                  className="min-h-0 gap-2 p-4"
                  decoClassName="top-2 right-4 size-(--dapp-about-deco-sq) !scale-x-100 object-cover"
                  decoSrc={dappAssets.aboutCarouselReleaseDeco}
                  title={slide.title}
                />
              </Carousel.Item>
            ))}
          </Carousel.Content>
          <Carousel.Indicators
            dotLabel={(index) => slides[index]?.title ?? String(index + 1)}
            nextLabel={t.common.paginationNext}
            prevLabel={t.common.paginationPrev}
          />
        </Carousel>
      </Section>

      <Section>
        <Section.Title>{t.release.hub.mechanismTitle}</Section.Title>
        <Section.Description>{t.release.hub.mechanismSubtitle}</Section.Description>
        {/* Figma `4359:531` — Steps center + activeIndex=2（进入释放池） */}
        <div data-slot-id="release-mechanism-steps">
          <Card className="rounded-2xl p-6" surface="elevated">
            <Steps activeIndex={2} align="center">
              {steps.map((step) => (
                <Steps.Item body={step.body} key={step.title} title={step.title} />
              ))}
            </Steps>
          </Card>
        </div>

        {/* 目的 + 税率：稿独立区块；跟在步骤卡下 */}
        <Card
          as="div"
          surface="elevated"
          className="flex flex-col gap-6 rounded-2xl p-6"
          data-slot-id="release-mechanism-meta"
        >
          <div className="grid gap-6 dapp:grid-cols-2">
            <div className="grid content-start gap-1.5">
              <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
                {t.release.hub.purposeTitle}
              </Text>
              <Text as="p" className="m-0 text-foreground/40" variant="caption">
                {t.release.hub.purposeBody}
              </Text>
            </div>

            <div className="grid content-start gap-2">
              <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
                {t.release.hub.taxTitle}
              </Text>
              {/* 税率：标签列 + 4 周期列；20/60 列灰底高亮 */}
              <div className="grid grid-cols-[auto_1fr] items-stretch gap-x-4">
                <div className="grid grid-rows-2 gap-4 py-2.5">
                  <Text as="span" className="self-center text-foreground/40" variant="caption">
                    {t.release.hub.taxPeriod}
                  </Text>
                  <Text as="span" className="self-center text-foreground/40" variant="caption">
                    {t.release.hub.taxRate}
                  </Text>
                </div>
                <div className="grid grid-cols-4 gap-0">
                  {periods.map((period, i) => (
                    <div
                      className={cn(
                        'grid grid-rows-2 gap-4 px-1 py-2.5 text-center',
                        TAX_HIGHLIGHT_PERIOD_INDEX.has(i) && 'rounded-sm bg-muted',
                      )}
                      data-slot-id={
                        i === 1 ? 'tax-highlight-20' : i === 3 ? 'tax-highlight-60' : undefined
                      }
                      key={period}
                    >
                      <Text
                        as="span"
                        className="self-center font-medium text-foreground"
                        variant="caption"
                      >
                        {period}
                      </Text>
                      <Text
                        as="span"
                        className={cn(
                          'self-center font-semibold',
                          rates[i] === '1%' ? 'text-primary' : 'text-foreground',
                        )}
                        variant="caption"
                      >
                        {rates[i]}
                      </Text>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        {/* 稿空态 FAQ 全关；禁 dapp 默认展开首项撑破节奏 */}
        <FaqList defaultOpenFirst={false} items={t.release.faq.hub} variant="dapp" />
      </Section>
    </Detail>
  )
}
