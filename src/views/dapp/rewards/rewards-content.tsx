import { useI18n } from '~/i18n/use-i18n'
import { DappDetailPage } from '~/app/shell/components/dapp-detail-page'
import { DappContentHeading } from '~/app/shell/components/dapp-content-heading'
import { RewardsFaqSection } from '~/views/dapp/rewards/rewards-faq-section'
import { RewardsHeroSection } from '~/views/dapp/rewards/rewards-hero-section'
import { RewardsHistorySection } from '~/views/dapp/rewards/rewards-history-section'
import { RewardsTierSection } from '~/views/dapp/rewards/rewards-tier-section'

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
