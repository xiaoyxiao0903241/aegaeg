import { FaqList } from '~/components/faq-list'
import type { HomeContent } from '~/home/content/types'
import { HomeSectionHead } from '~/home/components/home-section-head'

const sectionClass =
  'relative py-[120px] dapp:min-h-[800px] max-dapp:min-h-[529px] max-dapp:py-14'

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
