import type { CSSProperties } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { homeAssets } from '~/views/home/assets'
import { useI18n } from '~/i18n/use-i18n'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSectionHead } from '~/views/home/components/home-section-head'
import { HomeSection } from '~/views/home/components/home-section'
import { securityLayout } from '~/views/home/static-layout'

const securityClass = {
  section:
    'border-y border-border bg-[#ebeef3] py-30 dapp:min-h-[49.625rem] max-dapp:min-h-[44.4375rem] max-dapp:border-y-0 max-dapp:py-12',
  head: 'dapp:min-h-[8.75rem]',
  title: '[&&]:max-w-[26.25rem] dapp:[&&]:mt-4',
  subtitle: '[&&]:max-w-[26.25rem] dapp:[&&]:mt-4',
  artImage: 'h-full w-full object-contain object-center',
  iconImage: 'size-[var(--home-security-icon-size)] object-contain',
} as const

export function HomeSecuritySection() {
  const { messages } = useI18n()
  const content = messages.home.sections.security

  return (
    <HomeSection
      container="content"
      className={securityClass.section}
      id="security"
      aria-labelledby="security-title"
    >
      <HomeSectionHead
          className={securityClass.head}
          eyebrow={content.eyebrow}
          title={content.title}
          titleClassName={securityClass.title}
          subtitleClassName={securityClass.subtitle}
          subtitle={content.subtitle}
        />
        <div
          className={cn(securityLayout.gridClassName, revealClass())}
          data-reveal
          data-security-grid
        >
          <div className={securityLayout.artStageClassName}>
            <div className={securityLayout.artClassName} data-security-art>
              <img
                className={cn(securityClass.artImage, '[[&:not([src])]]:bg-transparent')}
                src={homeAssets.securityCharacter}
                alt=""
                width="330"
                height="382"
                loading="lazy"
              />
            </div>
            <img
              className={securityLayout.lineClassName}
              data-security-line
              src={homeAssets.securityConnector}
              alt=""
              width="110"
              height="258"
              aria-hidden="true"
              loading="lazy"
            />
          </div>
          <div className={securityLayout.listClassName}>
            {content.checks.map((check, index) => (
              <Card
                className={cn(
                  securityLayout.cardClassName,
                  (index === 0 || index === content.checks.length - 1) &&
                    securityLayout.cardTallClassName,
                )}
                context="home"
                data-security-check
                hover="shadow"
                key={check}
                style={{ '--security-index': index } as CSSProperties}
              >
                <span className={securityLayout.iconClassName}>
                  <img
                    className={securityClass.iconImage}
                    src={homeAssets.securityCheck}
                    alt=""
                    width="14"
                    height="14"
                    loading="lazy"
                  />
                </span>
                <Text as="span" tone="strong" variant="body" weight="medium">
                  {check}
                </Text>
              </Card>
            ))}
          </div>
        </div>
    </HomeSection>
  )
}
