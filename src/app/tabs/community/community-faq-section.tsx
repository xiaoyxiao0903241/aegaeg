import { useI18n } from '~/i18n/use-i18n'
import { DappCollapsibleSection } from '~/app/components/dapp-collapsible-section'
import { FaqList } from '~/components/faq-list'

export function CommunityFaqSection() {
  const { messages: t } = useI18n()

  return (
    <DappCollapsibleSection
      bodyClassName="overflow-visible"
      className="group-data-[tab=community]/shell:max-dapp:mt-0"
      title={t.community.faq.title}
    >
      <FaqList items={t.community.faq.items} variant="dapp" />
    </DappCollapsibleSection>
  )
}
