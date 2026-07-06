import { useI18n } from '~/i18n/use-i18n'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { FaqList } from '~/components/faq-list'

export function RewardsFaqSection() {
  const { messages: t } = useI18n()

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.rewards.faq.title}>
      <FaqList defaultOpenFirst={false} items={t.rewards.faq.items} variant="dapp" />
    </DappCollapsibleSection>
  )
}
