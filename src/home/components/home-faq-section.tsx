import { FaqList } from '~/components/faq-list'
import type { HomeContent } from '~/home/content/types'
import { HomeSectionHead } from './home-section-head'

const sectionClass =
  'relative py-[120px] min-[821px]:min-h-[800px] max-[820px]:min-h-[529px] max-[820px]:py-14'

export function HomeFaqSection({
  content,
}: {
  content: HomeContent['sections']['faq']
}) {
  return (
    <section className={sectionClass} id="faq" aria-labelledby="faq-title">
      <div className="container">
        <HomeSectionHead eyebrow={content.eyebrow} title={content.title} />
        <FaqList items={content.items} variant="home" />
      </div>
    </section>
  )
}
