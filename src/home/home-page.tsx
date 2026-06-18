import { useEffect } from 'react'
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
  const { locale, messages } = useI18n()
  const home = messages.home

  useEffect(() => {
    document.title = home.meta.title

    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', home.meta.description)
    }
  }, [home.meta.description, home.meta.title])

  return (
    <div className="min-h-screen overflow-x-clip">
      <HomeHeader content={home.nav} />
      <main className="pt-[74px] max-dapp:pt-[60px]" id="top">
        <HomeHeroSection content={home.hero} locale={locale} />
        <HomeProtocolSection content={home.sections.protocol} />
        <HomeEngineSection content={home.sections.engine} />
        <HomeTokenSection content={home.sections.token} />
        <HomeMetricsSection metrics={home.metrics} />
        <HomeRoadmapSection content={home.sections.roadmap} />
        <HomeSecuritySection content={home.sections.security} />
        <HomePartnersSection title={home.sections.partners.title} />
        <HomeFaqSection content={home.sections.faq} />
      </main>
      <HomeFooter content={home.footer} />
    </div>
  )
}
