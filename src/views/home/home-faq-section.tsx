import { FaqList } from '~/shared/ui/faq-list'
import { useI18n } from '~/i18n/use-i18n'
import { HomeSectionHead } from '~/views/home/home-section-head'
import { HomeSection } from '~/views/home/home-section'

export function HomeFaqSection() {
  const { messages } = useI18n()
  const content = messages.home.sections.faq

  return (
    <HomeSection spacing="faq" container="page" id="faq" aria-labelledby="faq-title">
      <HomeSectionHead eyebrow={content.eyebrow} title={content.title} />
      <FaqList items={content.items} variant="home" />
    </HomeSection>
  )
}
