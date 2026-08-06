/**
 * 释放总览详情页
 *
 * 顶部轮播介绍释放机制，中部为流程步骤、目的说明与税率表，
 * 底部为常见问题。
 */
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { Carousel } from '~/shared/components/carousel'
import { Detail } from '~/shared/components/detail'
import { Faq } from '~/shared/components/faq'
import { Section } from '~/shared/components/section'
import { ReleaseMechanismCard, ReleaseTaxCard } from '~/views/dapp/release/hub/primitives'
import { AboutCard } from '~/views/dapp/shared/about-card'

export function ReleaseHubDetail() {
  const { messages: t } = useI18n()
  const slides = t.release.hub.aboutSlides
  const periods = t.release.hub.taxRows.periods
  const rates = t.release.hub.taxRows.rates
  const steps = t.release.hub.mechanismSteps

  return (
    <Detail>
      <Section>
        <Section.Title id="release-hub-title">{t.release.hub.aboutTitle}</Section.Title>
        <Carousel opts={{ align: 'start', loop: true, containScroll: 'trimSnaps' }}>
          <Carousel.Content>
            {slides.map((slide) => (
              <Carousel.Item key={slide.title}>
                <AboutCard
                  // 介绍卡：右上角装饰图，高度随文案
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
        <ReleaseMechanismCard steps={steps} />
        <ReleaseTaxCard
          periods={periods}
          purposeBody={t.release.hub.purposeBody}
          purposeTitle={t.release.hub.purposeTitle}
          rates={rates}
          taxPeriod={t.release.hub.taxPeriod}
          taxRate={t.release.hub.taxRate}
          taxTitle={t.release.hub.taxTitle}
        />
      </Section>

      <Section>
        <Section.Title>{t.release.faq.title}</Section.Title>
        {/* FAQ 默认全部折叠，避免首项展开撑乱节奏 */}
        <Faq defaultOpenFirst={false} items={t.release.faq.hub} variant="dapp" />
      </Section>
    </Detail>
  )
}
