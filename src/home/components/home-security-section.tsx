import type { CSSProperties } from 'react'
import { Card } from '~/components/card'
import { homeAssets } from '~/home/assets'
import type { HomeContent } from '~/home/content/types'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DeferredImage } from './home-primitives'
import { HomeSectionHead } from './home-section-head'

const securityClass = {
  section:
    'relative border-y border-border bg-[#ebeef3] py-[120px] min-[821px]:min-h-[794px] max-[820px]:min-h-[711px] max-[820px]:border-y-0 max-[820px]:py-12',
  container: 'container max-[820px]:!w-[min(calc(100vw-40px),362px)]',
  head: 'min-[821px]:min-h-[140px]',
  title:
    '[&&]:max-w-[420px] min-[821px]:[&&]:mt-4 min-[821px]:[&&]:leading-[1.1] max-[820px]:whitespace-nowrap',
  subtitle:
    '[&&]:max-w-[420px] min-[821px]:[&&]:mt-4 min-[821px]:[&&]:text-base min-[821px]:[&&]:leading-[1.5]',
  grid:
    'security-grid relative mx-auto mt-8 grid w-[min(100%,842px)] grid-cols-[330px_1fr] items-center gap-12 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-[820px]:mt-4 max-[820px]:flex max-[820px]:w-full max-[820px]:flex-col max-[820px]:gap-4',
  art:
    'security-art flex w-[min(100%,330px)] aspect-[330/382] items-center justify-center overflow-hidden max-[820px]:w-[174px] max-[820px]:aspect-[174/201]',
  artImage: 'h-full w-full object-contain object-center',
  line:
    'security-line absolute left-[267px] top-[62px] z-[1] aspect-[110/258] w-[110px] object-contain max-[1100px]:!hidden',
  list: 'check-list relative z-[2] grid gap-3.5 max-[820px]:w-full max-[820px]:gap-4',
  card:
    'flex items-center gap-3.5 px-[22px] py-5 text-[15px] font-medium leading-[1.4] text-foreground max-[820px]:min-h-14 max-[820px]:w-full max-[820px]:gap-3 max-[820px]:rounded-[14px] max-[820px]:px-[18px] max-[820px]:py-4 max-[820px]:text-sm max-[820px]:leading-[1.2]',
  cardTall: 'max-[820px]:min-h-[66px]',
  icon:
    'grid size-[26px] shrink-0 place-items-center rounded-[13px] bg-accent text-[13px] text-primary max-[820px]:size-6 max-[820px]:rounded-xl',
  iconImage: 'size-3.5 object-contain',
} as const

export function HomeSecuritySection({
  content,
}: {
  content: HomeContent['sections']['security']
}) {
  return (
    <section
      className={securityClass.section}
      id="security"
      aria-labelledby="security-title"
    >
      <div className={securityClass.container}>
        <HomeSectionHead
          className={securityClass.head}
          eyebrow={content.eyebrow}
          title={content.title}
          titleClassName={securityClass.title}
          subtitleClassName={securityClass.subtitle}
          subtitle={content.subtitle}
        />
        <div
          className={cn(securityClass.grid, revealClass())}
          data-reveal
          data-security-grid
        >
          <div className={securityClass.art} data-security-art>
            <DeferredImage
              className={cn(securityClass.artImage, '[[&:not([src])]]:bg-transparent')}
              src={homeAssets.securityCharacter}
              alt=""
              width="330"
              height="382"
            />
          </div>
          <DeferredImage
            className={securityClass.line}
            data-security-line
            src={homeAssets.securityConnector}
            alt=""
            width="110"
            height="258"
            aria-hidden="true"
          />
          <div className={securityClass.list}>
            {content.checks.map((check, index) => (
              <Card
                className={cn(
                  securityClass.card,
                  (index === 0 || index === content.checks.length - 1) &&
                    securityClass.cardTall,
                )}
                context="home"
                data-security-check
                hover="shadow"
                key={check}
                style={{ '--security-index': index } as CSSProperties}
              >
                <span className={securityClass.icon}>
                  <DeferredImage
                    className={securityClass.iconImage}
                    src={homeAssets.securityCheck}
                    alt=""
                    width="14"
                    height="14"
                  />
                </span>
                {check}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
