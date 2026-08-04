import { DappCollapsibleSection } from '~/app/shell/dapp-collapsible-section'
import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'

export function CommunityFaqSection() {
  const { messages: t } = useI18n()

  return (
    <DappCollapsibleSection bodyClassName="overflow-visible" title={t.community.faq.title}>
      <FaqList items={t.community.faq.items} variant="dapp" />
    </DappCollapsibleSection>
  )
}
