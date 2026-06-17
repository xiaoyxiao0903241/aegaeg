import { useEffect } from 'react'
import { useHomeContent } from '~/home/use-home-content'
import { HomeEngineSection } from '~/home/components/home-icon-feature-section'
import { HomeFaqSection } from '~/home/components/home-faq-section'
import { HomeFooter } from '~/home/components/home-footer'
import { HomeHeader } from '~/home/components/home-header'
import { HomeHeroSection } from '~/home/components/home-hero-section'
import { HomeMetricsSection } from '~/home/components/home-metrics-section'
import { HomePartnersSection } from '~/home/components/home-partners-section'
import { HomeProtocolSection } from '~/home/components/home-icon-feature-section'
import { HomeRoadmapSection } from '~/home/components/home-roadmap-section'
import { HomeSecuritySection } from '~/home/components/home-security-section'
import { HomeTokenSection } from '~/home/components/home-token-section'
import { useI18n } from '~/i18n/use-i18n'

export function HomePage() {
  const { locale } = useI18n()
  const content = useHomeContent()

  useEffect(() => {
    document.title = content.meta.title

    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', content.meta.description)
    }
  }, [content.meta.description, content.meta.title])

  return (
    <div className="min-h-screen overflow-x-clip">
      <HomeHeader content={content.nav} />
      <main className="pt-[74px] max-dapp:pt-[60px]" id="top">
        <HomeHeroSection content={content.hero} locale={locale} />
        <HomeProtocolSection content={content.sections.protocol} />
        <HomeEngineSection content={content.sections.engine} />
        <HomeTokenSection content={content.sections.token} />
        <HomeMetricsSection metrics={content.metrics} />
        <HomeRoadmapSection content={content.sections.roadmap} />
        <HomeSecuritySection content={content.sections.security} />
        <HomePartnersSection content={content.sections.partners} />
        <HomeFaqSection content={content.sections.faq} />
      </main>
      <HomeFooter content={content.footer} />
    </div>
  )
}
