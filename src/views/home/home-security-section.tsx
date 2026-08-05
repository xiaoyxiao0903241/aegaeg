import type { CSSProperties } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/shared/assets/home'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { HomeSection } from '~/views/home/home-section'
import { HomeSectionHead } from '~/views/home/home-section-head'

/**
 * 安全特性区块
 *
 * 左侧为安全角色插画与连线装饰，右侧逐条列出安全检查项；
 * 卡片进入视口后按序号错峰渐显。
 */
export function HomeSecuritySection() {
  const { messages } = useI18n()
  const content = messages.home.sections.security

  return (
    <HomeSection
      container="content"
      className="border-y border-border bg-muted py-30 dapp:min-h-(--home-security-section-min-h) max-dapp:min-h-(--home-security-section-min-h-h5) max-dapp:border-y-0 max-dapp:py-12"
      id="security"
      aria-labelledby="security-title"
    >
      <HomeSectionHead
        className="dapp:min-h-35"
        eyebrow={content.eyebrow}
        title={content.title}
        titleClassName="[&&]:max-w-[26.25rem] dapp:[&&]:mt-4 dapp:[&&]:leading-[1.1]"
        subtitleClassName="[&&]:max-w-[26.25rem] dapp:[&&]:mt-4 dapp:[&&]:text-base dapp:[&&]:leading-normal"
        subtitle={content.subtitle}
      />
      <div
        className={cn(
          'relative mx-auto mt-8 grid w-full max-w-(--home-security-block-max) grid-cols-[var(--home-security-art-w)_minmax(0,1fr)] items-center gap-12 max-tablet:grid-cols-1 max-tablet:justify-items-center max-dapp:mt-4 max-dapp:flex max-dapp:w-full max-dapp:flex-col max-dapp:gap-4',
          revealClass(),
        )}
        data-reveal
        data-security-grid
      >
        <div className="relative w-full max-w-(--home-security-art-w) shrink-0 max-dapp:max-w-(--home-security-art-h5-w)">
          <div
            className="flex aspect-330/382 w-full items-center justify-center overflow-hidden max-dapp:aspect-174/201"
            data-security-art
          >
            <img
              className="size-full object-contain object-center [[&:not([src])]]:bg-transparent"
              src={homeAssets.securityCharacter}
              alt=""
              width="330"
              height="382"
              loading="lazy"
            />
          </div>
          <img
            className="pointer-events-none absolute top-[16.23%] left-[80.91%] z-1 aspect-110/258 w-[33.33%] object-contain max-tablet:hidden!"
            data-security-line
            src={homeAssets.securityConnector}
            alt=""
            width="110"
            height="258"
            aria-hidden="true"
            loading="lazy"
          />
        </div>
        <div className="relative z-2 grid w-full max-w-(--home-security-list-max) gap-3.5 max-dapp:max-w-none">
          {content.checks.map((check, index) => (
            <Card
              className={cn(
                'flex min-h-15.25 items-center gap-3.5 px-5.5 py-5 transition-shadow duration-200 ease-out max-dapp:min-h-14 max-dapp:w-full max-dapp:gap-3 max-dapp:rounded-sm max-dapp:px-4.5 max-dapp:py-4',
                (index === 0 || index === content.checks.length - 1) && 'max-dapp:min-h-16.5',
              )}
              surface="elevated"
              data-security-check
              key={check}
              style={{ '--security-index': index } as CSSProperties}
            >
              <span className="grid size-(--home-security-icon-wrap-size) shrink-0 place-items-center rounded-sm bg-accent text-primary max-dapp:size-(--home-security-icon-wrap-size-h5) max-dapp:rounded-xl">
                <img
                  className="size-(--home-security-icon-size) object-contain"
                  src={homeAssets.securityCheck}
                  alt=""
                  width="14"
                  height="14"
                  loading="lazy"
                />
              </span>
              <Text
                as="span"
                variant="detail"
                className="leading-[1.4] font-medium max-dapp:text-sm max-dapp:leading-[1.2]"
              >
                {check}
              </Text>
            </Card>
          ))}
        </div>
      </div>
    </HomeSection>
  )
}
