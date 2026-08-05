import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'
import { Section } from '~/shared/components/section'

export function CommunityFaqSection() {
  const { messages: t } = useI18n()

  return (
    <Section collapsible>
      <Section.Title>{t.community.faq.title}</Section.Title>
      <FaqList items={t.community.faq.items} variant="dapp" />
    </Section>
  )
}
