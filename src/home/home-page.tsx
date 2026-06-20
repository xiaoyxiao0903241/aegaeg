import { useEffect } from 'react'
import { HomeIconFeatureSection } from '~/home/components/home-icon-feature-section'
import { HomeFaqSection } from '~/home/components/home-faq-section'
import { HomeFooter } from '~/home/components/home-footer'
import { HomeHeader } from '~/home/components/home-header'
import { HomeHeroSection } from '~/home/components/home-hero-section'
import { HomeMetricsSection } from '~/home/components/home-metrics-section'
import { HomePartnersSection } from '~/home/components/home-partners-section'
import { HomeRoadmapSection } from '~/home/components/home-roadmap-section'
import { HomeSecuritySection } from '~/home/components/home-security-section'
import { HomeTokenSection } from '~/home/components/home-token-section'
import { useI18n } from '~/i18n/use-i18n'

export function HomePage() {
  const { messages } = useI18n()
  const { meta } = messages.home

  useEffect(() => {
    document.title = meta.title

    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', meta.description)
    }
  }, [meta.description, meta.title])

  return (
    <div className="min-h-screen overflow-x-clip">
      <HomeHeader />
      <main className="pt-18 max-dapp:pt-14" id="top">
        <HomeHeroSection />
        <HomeIconFeatureSection variant="protocol" />
        <HomeIconFeatureSection variant="engine" />
        <HomeTokenSection />
        <HomeMetricsSection />
        <HomeRoadmapSection />
        <HomeSecuritySection />
        <HomePartnersSection />
        <HomeFaqSection />
      </main>
      <HomeFooter />
    </div>
  )
}
