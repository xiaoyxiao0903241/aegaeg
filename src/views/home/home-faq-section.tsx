import { useI18n } from '~/i18n/use-i18n'
import { FaqList } from '~/shared/components/faq-list'
import { HomeSection } from '~/views/home/home-section'
import { HomeSectionHead } from '~/views/home/home-section-head'

/** FAQ 区块：标题 + 手风琴问答列表。 */
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
