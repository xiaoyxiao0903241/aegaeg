import { FaqList } from '~/components/faq-list'
import { useI18n } from '~/i18n/use-i18n'
import { HomeSectionHead } from '~/home/components/home-section-head'

const sectionClass =
  'relative py-30 dapp:min-h-192 max-dapp:min-h-128 max-dapp:py-14'

export function HomeFaqSection() {
  const { messages } = useI18n()
  const content = messages.home.sections.faq

  return (
    <section className={sectionClass} id="faq" aria-labelledby="faq-title">
      <div className="container">
        <HomeSectionHead eyebrow={content.eyebrow} title={content.title} />
        <FaqList items={content.items} variant="home" />
      </div>
    </section>
  )
}
