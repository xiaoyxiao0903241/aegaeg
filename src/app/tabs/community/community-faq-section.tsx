import { useI18n } from '~/i18n/use-i18n'
import { DappSection } from '~/app/components/dapp-section'
import { FaqList } from '~/components/faq-list'

export function CommunityFaqSection() {
  const { messages: t } = useI18n()

  return (
    <DappSection
      className="group-data-[tab=community]/shell:max-dapp:mt-0"
      title={t.community.faq.title}
    >
      <FaqList items={t.community.faq.items} variant="dapp" />
    </DappSection>
  )
}
