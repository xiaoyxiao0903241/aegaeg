import { useEffect } from 'react'
import { HomeIconFeatureSection } from '~/views/home/components/home-icon-feature-section'
import { HomeFaqSection } from '~/views/home/components/home-faq-section'
import { HomeFooter } from '~/views/home/components/home-footer'
import { HomeHeader } from '~/views/home/components/home-header'
import { HomeHeroSection } from '~/views/home/components/home-hero-section'
import { HomeMetricsSection } from '~/views/home/components/home-metrics-section'
import { HomePartnersSection } from '~/views/home/components/home-partners-section'
import { HomeRoadmapSection } from '~/views/home/components/home-roadmap-section'
import { HomeSecuritySection } from '~/views/home/components/home-security-section'
import { HomeTokenSection } from '~/views/home/components/home-token-section'
import { HomePopupNoticeModal } from '~/views/home/components/home-popup-notice-modal'
import { noticeDismissKey } from '~/views/home/popup-notice'
import { useHomePopupNotice } from '~/views/home/use-home-popup-notice'
import { useI18n } from '~/i18n/use-i18n'

export function HomePage() {
  const { messages } = useI18n()
  const { meta } = messages.home
  const popupNotice = useHomePopupNotice()

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
      {popupNotice.open && popupNotice.notice ? (
        <HomePopupNoticeModal
          key={noticeDismissKey(popupNotice.notice)}
          notice={popupNotice.notice}
          onDismiss={popupNotice.onDismiss}
          onImageLoadError={popupNotice.onImageLoadError}
          open={popupNotice.open}
        />
      ) : null}
    </div>
  )
}
