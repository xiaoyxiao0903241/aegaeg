import { ArrowRight } from 'lucide-react'

import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/shared/assets/home'
import { Button } from '~/shared/components/button'
import { HeroRaysBackground } from '~/shared/components/hero-rays-background'
import { Text } from '~/shared/components/text'
import { getNotionLinks } from '~/shared/config/notion-links'

function HeroPrimaryAction({ enterProtocol }: { enterProtocol: string }) {
  const { locale } = useI18n()

  return (
    <Button asChild className="max-dapp:w-full max-dapp:shadow-none!" size="lg" variant="primary">
      <a href={withLocalePrefix(locale, '/app.html')}>
        {enterProtocol}
        <ArrowRight aria-hidden className="ml-1.5 size-4 shrink-0" strokeWidth={2} />
      </a>
    </Button>
  )
}

export function HomeHeroSection() {
  const { locale, messages } = useI18n()
  const content = messages.home.hero
  const notionLinks = getNotionLinks(locale)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-176 items-start overflow-hidden bg-(image:--home-hero-wash) pt-22 pb-24 max-tablet:min-h-0 max-tablet:pt-16 max-tablet:pb-20 max-dapp:block max-dapp:min-h-192 max-dapp:bg-background max-dapp:pt-9 max-dapp:pb-12"
    >
      <HeroRaysBackground variant="home" />
      <div className="relative z-1 container grid min-h-128 grid-cols-[minmax(0,1fr)_auto] items-center justify-between gap-16 max-tablet:grid-cols-1 max-tablet:justify-items-center max-tablet:gap-8 max-tablet:text-center max-dapp:flex max-dapp:min-h-0 max-dapp:flex-col max-dapp:items-center max-dapp:gap-4 max-dapp:text-center">
        <div
          className="max-w-2xl pt-16 max-tablet:pt-0 max-dapp:order-2 max-dapp:flex max-dapp:w-full max-dapp:max-w-96 max-dapp:flex-col max-dapp:items-center max-dapp:pt-0"
          data-hero-enter
        >
          <div
            className="inline-flex min-h-8 w-max max-w-full items-center gap-2 rounded-3xl border border-border bg-card px-4 py-2 whitespace-nowrap max-tablet:mx-auto max-narrow:text-left max-narrow:whitespace-normal max-dapp:min-h-7 max-dapp:gap-1.5 max-dapp:px-3.5 max-dapp:py-1.5"
            data-hero-line="eyebrow"
          >
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-success" />
            <Text as="span" variant="caption" className="text-xs leading-[1.2] font-semibold">
              {content.eyebrow}
            </Text>
          </div>
          <Text
            as="h1"
            className="mt-5.5 max-w-2xl text-6xl leading-[1.08] font-semibold tracking-normal max-dapp:mt-4 max-dapp:w-full max-dapp:text-4xl max-dapp:leading-[1.2]"
            data-hero-line="title"
            id="hero-title"
          >
            {content.title}
          </Text>
          <Text
            as="p"
            className="mt-5.5 max-w-2xl text-lg/normal font-normal max-dapp:mt-2.5 max-dapp:w-full max-dapp:text-sm"
            data-hero-line="body"
            tone="muted-foreground"
          >
            {content.body}
          </Text>
          <div
            className="mt-5.5 flex items-center gap-3.5 pt-3.5 max-tablet:justify-center max-dapp:mt-3 max-dapp:w-full max-dapp:flex-col max-dapp:items-stretch max-dapp:gap-4 max-dapp:pt-0"
            data-hero-line="actions"
          >
            <HeroPrimaryAction enterProtocol={content.enterProtocol} />
            <Button
              asChild
              className="max-dapp:w-full max-dapp:shadow-none!"
              size="lg"
              variant="secondary"
            >
              <a href={notionLinks.whitepaper} rel="noopener noreferrer" target="_blank">
                {content.readWhitepaper}
              </a>
            </Button>
          </div>
        </div>
        <div
          aria-label={content.guardianLabel}
          className="relative aspect-438/510 w-108 max-w-full shrink-0 max-tablet:aspect-438/420 max-tablet:w-full max-tablet:max-w-108 max-dapp:order-1 max-dapp:aspect-294/342 max-dapp:w-72"
          data-hero-art-enter
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-px -left-2 aspect-square w-[142%] max-w-160 rounded-full bg-(image:--home-hero-glow) opacity-[0.28] blur-[0.625rem] max-tablet:left-1/2 max-tablet:-translate-x-1/2 max-dapp:hidden"
          />
          <div className="absolute top-0 left-2.5 aspect-338/510 w-11/12 max-w-84 animate-[character-float_6s_ease-in-out_infinite] max-tablet:left-1/2 max-tablet:aspect-278/420 max-tablet:w-72 max-tablet:max-w-72 max-tablet:-translate-x-1/2 max-tablet:[animation-name:character-float-centered] max-dapp:top-0 max-dapp:left-0 max-dapp:aspect-294/342 max-dapp:w-72 max-dapp:translate-x-0 max-dapp:[animation-name:character-float-mobile]">
            <video
              aria-hidden="true"
              autoPlay
              className="size-full object-contain"
              height="640"
              muted
              playsInline
              poster={homeAssets.heroVideoPoster}
              preload="metadata"
              width="464"
            >
              <source src={homeAssets.heroVideoSafari} type='video/quicktime; codecs="hvc1"' />
              <source src={homeAssets.heroVideo} type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
