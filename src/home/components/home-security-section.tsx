import type { CSSProperties } from 'react'
import { Card } from '~/components/card'
import { homeAssets } from '~/home/assets'
import type { HomeMessagesBundle } from '~/i18n/messages/home/en'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import { DeferredImage } from '~/home/components/home-primitives'
import { HomeSectionHead } from '~/home/components/home-section-head'

const securityClass = {
  section:
    'relative border-y border-border bg-[#ebeef3] py-[120px] dapp:min-h-[794px] max-dapp:min-h-[711px] max-dapp:border-y-0 max-dapp:py-12',
  container: 'container max-dapp:!w-[min(calc(100vw-40px),362px)]',
  head: 'dapp:min-h-[140px]',
  title:
    '[&&]:max-w-[420px] dapp:[&&]:mt-4 dapp:[&&]:leading-[1.1] max-dapp:whitespace-nowrap',
  subtitle:
    '[&&]:max-w-[420px] dapp:[&&]:mt-4 dapp:[&&]:text-base dapp:[&&]:leading-[1.5]',
  grid:
    'security-grid relative mx-auto mt-8 grid w-[min(100%,842px)] grid-cols-[330px_1fr] items-center gap-12 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-dapp:mt-4 max-dapp:flex max-dapp:w-full max-dapp:flex-col max-dapp:gap-4',
  art:
    'security-art flex w-[min(100%,330px)] aspect-[330/382] items-center justify-center overflow-hidden max-dapp:w-[174px] max-dapp:aspect-[174/201]',
  artImage: 'h-full w-full object-contain object-center',
  line:
    'security-line absolute left-[267px] top-[62px] z-1 aspect-[110/258] w-[110px] object-contain max-[1100px]:!hidden',
  list: 'check-list relative z-[2] grid gap-3.5 max-dapp:w-full max-dapp:gap-4',
  card:
    'flex items-center gap-3.5 px-[22px] py-5 text-[15px] font-medium leading-[1.4] text-foreground max-dapp:min-h-14 max-dapp:w-full max-dapp:gap-3 max-dapp:rounded-[14px] max-dapp:px-[18px] max-dapp:py-4 max-dapp:text-sm max-dapp:leading-[1.2]',
  cardTall: 'max-dapp:min-h-[66px]',
  icon:
    'grid size-[26px] shrink-0 place-items-center rounded-[13px] bg-accent text-[13px] text-primary max-dapp:size-6 max-dapp:rounded-xl',
  iconImage: 'size-3.5 object-contain',
} as const

export function HomeSecuritySection({
  content,
}: {
  content: HomeMessagesBundle['sections']['security']
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
