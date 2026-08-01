import { useEffect } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { HomeFaqSection } from '~/views/home/home-faq-section'
import { HomeFooter } from '~/views/home/home-footer'
import { HomeHeader } from '~/views/home/home-header'
import { HomeHeroSection } from '~/views/home/home-hero-section'
import { HomeIconFeatureSection } from '~/views/home/home-icon-feature-section'
import { HomeMetricsSection } from '~/views/home/home-metrics-section'
import { HomePartnersSection } from '~/views/home/home-partners-section'
import { HomePopupNoticeModal } from '~/views/home/home-popup-notice-modal'
import { HomeRoadmapSection } from '~/views/home/home-roadmap-section'
import { HomeSecuritySection } from '~/views/home/home-security-section'
import { HomeTokenSection } from '~/views/home/home-token-section'
import { noticeDismissKey } from '~/views/home/popup-notice'
import { useHomePopupNotice } from '~/views/home/use-home-popup-notice'

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
