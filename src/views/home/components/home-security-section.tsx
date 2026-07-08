import type { CSSProperties } from 'react'
import { Card } from '~/shared/ui/card'
import { homeAssets } from '~/views/home/assets'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSectionHead } from '~/views/home/components/home-section-head'
import { HomeSection } from '~/views/home/components/home-section'

export function HomeSecuritySection() {
  const { messages } = useI18n()
  const content = messages.home.sections.security

  return (
    <HomeSection
      container="content"
      className="border-y border-border bg-[#ebeef3] py-30 dapp:min-h-[49.625rem] max-dapp:min-h-[44.4375rem] max-dapp:border-y-0 max-dapp:py-12"
      id="security"
      aria-labelledby="security-title"
    >
      <HomeSectionHead
        className="dapp:min-h-[8.75rem]"
        eyebrow={content.eyebrow}
        title={content.title}
        titleClassName="[&&]:max-w-[26.25rem] dapp:[&&]:mt-4 dapp:[&&]:leading-[1.1]"
        subtitleClassName="[&&]:max-w-[26.25rem] dapp:[&&]:mt-4 dapp:[&&]:text-base dapp:[&&]:leading-[1.5]"
        subtitle={content.subtitle}
      />
      <div
        className={cn(
          'relative mx-auto mt-8 grid w-full max-w-[var(--home-security-block-max)] grid-cols-[var(--home-security-art-w)_minmax(0,1fr)] items-center gap-12 max-tablet:grid-cols-1 max-tablet:justify-items-center max-dapp:mt-4 max-dapp:flex max-dapp:w-full max-dapp:flex-col max-dapp:gap-4',
          revealClass(),
        )}
        data-reveal
        data-security-grid
      >
        <div className="relative w-full max-w-[var(--home-security-art-w)] shrink-0 max-dapp:max-w-[var(--home-security-art-h5-w)]">
          <div
            className="flex w-full aspect-[330/382] items-center justify-center overflow-hidden max-dapp:aspect-[174/201]"
            data-security-art
          >
            <img
              className="h-full w-full object-contain object-center [[&:not([src])]]:bg-transparent"
              src={homeAssets.securityCharacter}
              alt=""
              width="330"
              height="382"
              loading="lazy"
            />
          </div>
          <img
            className="pointer-events-none absolute left-[80.91%] top-[16.23%] z-1 aspect-[110/258] w-[33.33%] object-contain max-tablet:!hidden"
            data-security-line
            src={homeAssets.securityConnector}
            alt=""
            width="110"
            height="258"
            aria-hidden="true"
            loading="lazy"
          />
        </div>
        <div className="relative z-[2] grid w-full max-w-[var(--home-security-list-max)] gap-3.5 max-dapp:max-w-none">
          {content.checks.map((check, index) => (
            <Card
              className={cn(
                'flex min-h-[3.8125rem] items-center gap-3.5 px-5.5 py-5 text-[0.9375rem] font-medium leading-[1.4] text-foreground shadow-card transition-shadow duration-200 ease-out hover:shadow-card max-dapp:min-h-14 max-dapp:w-full max-dapp:gap-3 max-dapp:rounded-[0.875rem] max-dapp:px-[1.125rem] max-dapp:py-4 max-dapp:text-sm max-dapp:leading-[1.2]',
                (index === 0 || index === content.checks.length - 1) &&
                  'max-dapp:min-h-[4.125rem]',
              )}
              surface="outlined"
              data-security-check
              key={check}
              style={{ '--security-index': index } as CSSProperties}
            >
              <span className="grid size-[var(--home-security-icon-wrap-size)] shrink-0 place-items-center rounded-[0.8125rem] bg-accent text-[0.8125rem] text-primary max-dapp:size-[var(--home-security-icon-wrap-size-h5)] max-dapp:rounded-xl">
                <img
                  className="size-[var(--home-security-icon-size)] object-contain"
                  src={homeAssets.securityCheck}
                  alt=""
                  width="14"
                  height="14"
                  loading="lazy"
                />
              </span>
              {check}
            </Card>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
