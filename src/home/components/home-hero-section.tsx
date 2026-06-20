import { withLocalePrefix } from '~/i18n/locale'
import { Button } from '~/components/button'
import { HeroRaysBackground, heroRaysHomeClass } from '~/components/hero-rays-background'
import { homeAssets } from '~/home/assets'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/lib/utils'

const homeArtGlowClass = cn(
  'pointer-events-none absolute -top-px -left-2 aspect-square w-[142%] max-w-160 rounded-full opacity-[0.28] blur-[0.625rem]',
  '[background:radial-gradient(circle,oklch(94%_0.035_45_/_42%),transparent_58%)]',
  'max-[1100px]:left-1/2 max-[1100px]:-translate-x-1/2',
  'max-dapp:hidden',
)

const heroClass = {
  section:
    'hero relative flex min-h-176 items-start overflow-hidden pt-22 pb-24 [background:linear-gradient(180deg,var(--background),oklch(95.6%_0_0))] max-[1100px]:min-h-0 max-[1100px]:pt-16 max-[1100px]:pb-20 max-dapp:block max-dapp:min-h-192 max-dapp:pt-9 max-dapp:pb-12 max-dapp:[background:var(--background)]',
  grid:
    'container hero-grid relative z-1 grid min-h-128 grid-cols-[minmax(0,1fr)_auto] items-center justify-between gap-16 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-[1100px]:gap-8 max-[1100px]:text-center max-dapp:flex max-dapp:min-h-0 max-dapp:flex-col max-dapp:items-center max-dapp:justify-start max-dapp:gap-4 max-dapp:text-center',
  copy:
    'hero-copy max-w-168 pt-16 max-[1100px]:pt-0 max-dapp:order-2 max-dapp:flex max-dapp:w-full max-dapp:max-w-96 max-dapp:flex-col max-dapp:items-center max-dapp:pt-0',
  eyebrow:
    'hero-eyebrow eyebrow-pill inline-flex min-h-8 w-max max-w-full items-center gap-2 whitespace-nowrap rounded-3xl border border-border bg-card px-4 py-2 text-xs font-semibold leading-[1.2] text-foreground max-[1100px]:mx-auto max-dapp:min-h-7 max-dapp:gap-1.5 max-dapp:px-3.5 max-dapp:py-1.5 max-dapp:text-xs max-[520px]:whitespace-normal max-[520px]:text-left',
  statusDot: 'status-dot size-1.5 shrink-0 rounded-3xl bg-success',
  title:
    'hero-title mt-5.5 max-w-168 text-6xl font-semibold leading-[1.08] tracking-normal text-foreground max-dapp:mt-4 max-dapp:w-full max-dapp:text-4xl max-dapp:leading-[1.2]',
  body:
    'hero-body mt-5.5 max-w-168 text-lg font-normal leading-[1.5] text-ink-strong max-dapp:mt-2.5 max-dapp:w-full max-dapp:text-sm',
  actions:
    'hero-actions mt-5.5 flex items-center gap-3.5 pt-3.5 max-[1100px]:justify-center max-dapp:mt-3 max-dapp:w-full max-dapp:flex-col max-dapp:items-stretch max-dapp:gap-4 max-dapp:pt-0',
  actionButton: 'max-dapp:w-full max-dapp:!shadow-none',
  secondaryAction: 'max-dapp:w-full max-dapp:!shadow-none',
  actionLabel: 'text-inherit',
  actionArrow: 'ml-1.5 size-4 shrink-0',
  art:
    'hero-art relative w-108 max-w-full shrink-0 aspect-[438/510] max-[1100px]:w-full max-[1100px]:max-w-108 max-[1100px]:aspect-[438/420] max-dapp:order-1 max-dapp:w-72 max-dapp:max-w-72 max-dapp:aspect-[294/342]',
  media:
    'hero-media absolute left-2.5 top-0 w-11/12 max-w-84 aspect-[338/510] [animation:character-float_6s_ease-in-out_infinite] max-[1100px]:left-1/2 max-[1100px]:w-72 max-[1100px]:max-w-72 max-[1100px]:aspect-[278/420] max-[1100px]:-translate-x-1/2 max-[1100px]:[animation-name:character-float-centered] max-dapp:left-0 max-dapp:top-0 max-dapp:w-72 max-dapp:max-w-72 max-dapp:aspect-[294/342] max-dapp:translate-x-0 max-dapp:[animation-name:character-float-mobile]',
  video:
    'hero-video block h-full w-full object-contain',
} as const

function HeroPrimaryAction({ enterProtocol }: { enterProtocol: string }) {
  const { locale } = useI18n()
  const appHref = withLocalePrefix(locale, '/app.html')

  return (
    <Button asChild className={heroClass.actionButton} size="lg" variant="primary">
      <a href={appHref}>
        <span className={heroClass.actionLabel}>{enterProtocol}</span>
        <svg
        className={heroClass.actionArrow}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M5 12H19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      </a>
    </Button>
  )
}

export function HomeHeroSection() {
  const { messages } = useI18n()
  const content = messages.home.hero

  return (
    <section className={heroClass.section} aria-labelledby="hero-title">
      <HeroRaysBackground className={heroRaysHomeClass} />
      <div className={heroClass.grid}>
        <div className={heroClass.copy} data-hero-enter>
          <div className={heroClass.eyebrow}>
            <span className={heroClass.statusDot} />
            {content.eyebrow}
          </div>
          <h1 className={heroClass.title} id="hero-title">
            {content.title}
          </h1>
          <p className={heroClass.body}>{content.body}</p>
          <div className={heroClass.actions}>
            <HeroPrimaryAction enterProtocol={content.enterProtocol} />
            <Button asChild className={heroClass.secondaryAction} size="lg" variant="secondary">
              <a href="#whitepaper">{content.readWhitepaper}</a>
            </Button>
          </div>
        </div>
        <div
          className={heroClass.art}
          data-hero-art-enter
          aria-label={content.guardianLabel}
        >
          <div className={homeArtGlowClass} aria-hidden="true" />
          <div className={heroClass.media}>
            <video
              aria-hidden="true"
              className={heroClass.video}
              autoPlay
              muted
              playsInline
              preload="metadata"
              poster={homeAssets.heroVideoPoster}
              width="464"
              height="640"
            >
              <source src={homeAssets.heroVideo} type="video/webm" />
            </video>
          </div>
        </div>
      </div>
    </section>
  )
}
