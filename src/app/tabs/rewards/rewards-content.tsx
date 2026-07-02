import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/components/dapp-detail-page'
import { DappContentHeading } from '~/app/components/dapp-content-heading'
import { RewardsFaqSection } from '~/app/tabs/rewards/rewards-faq-section'
import { RewardsHeroSection } from '~/app/tabs/rewards/rewards-hero-section'
import { RewardsHistorySection } from '~/app/tabs/rewards/rewards-history-section'
import { RewardsTierSection } from '~/app/tabs/rewards/rewards-tier-section'

export function RewardsContent() {
  const { messages: t } = useI18n()

  return (
    <DappDetailPage>
      <DappContentHeading id="rewards-title">{t.rewards.heroTitle}</DappContentHeading>
      <RewardsHeroSection />
      <RewardsTierSection />
      <RewardsHistorySection />
      <RewardsFaqSection />
    </DappDetailPage>
  )
}
