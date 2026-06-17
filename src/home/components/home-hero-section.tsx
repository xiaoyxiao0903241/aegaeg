import { withLocalePrefix } from '~/i18n/locale'
import type { Locale } from '~/i18n/locales'
import { homeAssets } from '~/home/assets'
import type { HomeContent } from '~/home/content/types'
import { cn } from '~/lib/utils'

const homeHeroRaysClass = cn(
  'pointer-events-none absolute left-[calc(50%-358px)] top-[-477px] aspect-square w-[1500px] opacity-[0.72]',
  '[animation:hero-rays-drift_48s_linear_infinite]',
  '[background:repeating-conic-gradient(from_0deg,oklch(40%_0.02_260_/_13%)_0deg_0.28deg,transparent_0.28deg_4.8deg)]',
  '[mask-image:radial-gradient(circle,black_0%,oklch(0%_0_0_/_65%)_35%,transparent_62%)]',
  'max-[820px]:hidden',
)

const homeArtGlowClass = cn(
  'pointer-events-none absolute -top-px left-[-7px] aspect-square w-[142%] max-w-[620px] rounded-full opacity-[0.28] blur-[10px]',
  '[background:radial-gradient(circle,oklch(94%_0.035_45_/_42%),transparent_58%)]',
  'max-[1100px]:left-1/2 max-[1100px]:-translate-x-1/2',
  'max-[820px]:hidden',
)

const homeBtnBaseClass = cn(
  'inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-[26px]',
  'text-[15px] font-semibold leading-none tracking-normal whitespace-nowrap',
  'transition-[box-shadow,border-color,background-color,opacity,color] duration-180 ease-out',
  'hover:opacity-[0.96] focus-visible:opacity-[0.96]',
)

const homeBtnPrimaryClass = cn(
  homeBtnBaseClass,
  'border-0 bg-primary text-primary-foreground',
  'visited:text-primary-foreground hover:text-primary-foreground focus-visible:text-primary-foreground',
  'shadow-[0_10px_24px_oklch(66.83%_0.1625_36.6_/_24%)]',
  'hover:shadow-[0_14px_30px_oklch(66.83%_0.1625_36.6_/_30%)]',
  'focus-visible:shadow-[0_14px_30px_oklch(66.83%_0.1625_36.6_/_30%)]',
)

const homeBtnSecondaryClass = cn(
  homeBtnBaseClass,
  'border border-border bg-card text-foreground',
  'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
  'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
  'hover:shadow-card focus-visible:shadow-card',
)

const heroClass = {
  section:
    'hero relative flex min-h-[696px] items-start overflow-hidden pt-[90px] pb-24 [background:linear-gradient(180deg,var(--background),oklch(95.6%_0_0))] max-[1100px]:min-h-0 max-[1100px]:pt-16 max-[1100px]:pb-20 max-[820px]:block max-[820px]:min-h-[754px] max-[820px]:pt-9 max-[820px]:pb-12 max-[820px]:[background:var(--background)]',
  grid:
    'container hero-grid relative z-1 grid min-h-[510px] grid-cols-[minmax(0,660px)_438px] items-center justify-between gap-16 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-[1100px]:gap-8 max-[1100px]:text-center max-[820px]:flex max-[820px]:min-h-0 max-[820px]:flex-col max-[820px]:items-center max-[820px]:justify-start max-[820px]:gap-4 max-[820px]:text-center',
  copy:
    'hero-copy max-w-[660px] pt-[65px] max-[1100px]:pt-0 max-[820px]:order-2 max-[820px]:flex max-[820px]:w-full max-[820px]:max-w-[362px] max-[820px]:flex-col max-[820px]:items-center max-[820px]:pt-0',
  eyebrow:
    'hero-eyebrow eyebrow-pill inline-flex min-h-8 w-max max-w-full items-center gap-2 whitespace-nowrap rounded-[999px] border border-border bg-card px-4 py-2 text-[13px] font-semibold leading-[1.2] text-foreground max-[1100px]:mx-auto max-[820px]:min-h-7 max-[820px]:gap-[7px] max-[820px]:px-3.5 max-[820px]:py-[7px] max-[820px]:text-xs max-[520px]:whitespace-normal max-[520px]:text-left',
  statusDot: 'status-dot size-[7px] shrink-0 rounded-[999px] bg-success',
  title:
    'hero-title mt-[22px] max-w-[660px] text-[64px] font-semibold leading-[1.08] tracking-[0] text-foreground max-[820px]:mt-4 max-[820px]:w-full max-[820px]:text-[34px] max-[820px]:leading-[1.2]',
  body:
    'hero-body mt-[22px] max-w-[660px] text-lg font-normal leading-[1.5] text-ink-strong max-[820px]:mt-2.5 max-[820px]:w-full max-[820px]:text-sm',
  actions:
    'hero-actions mt-[22px] flex items-center gap-3.5 pt-3.5 max-[1100px]:justify-center max-[820px]:mt-3 max-[820px]:w-full max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-4 max-[820px]:pt-0',
  actionButton: 'max-[820px]:w-full max-[820px]:!shadow-none',
  secondaryAction: 'max-[820px]:w-full max-[820px]:!shadow-none',
  actionLabel: 'text-inherit',
  actionArrow: 'ml-1.5 size-4 shrink-0',
  art:
    'hero-art relative w-[min(100%,438px)] aspect-[438/510] max-[1100px]:w-[min(438px,100%)] max-[1100px]:aspect-[438/420] max-[820px]:order-1 max-[820px]:w-[294px] max-[820px]:aspect-[294/342]',
  media:
    'hero-media absolute left-2.5 top-0 w-[min(77.2%,338px)] aspect-[338/510] [animation:character-float_6s_ease-in-out_infinite] max-[1100px]:left-1/2 max-[1100px]:w-[278px] max-[1100px]:aspect-[278/420] max-[1100px]:-translate-x-1/2 max-[1100px]:[animation-name:character-float-centered] max-[820px]:left-0 max-[820px]:top-0 max-[820px]:w-[294px] max-[820px]:aspect-[294/342] max-[820px]:translate-x-0 max-[820px]:[animation-name:character-float-mobile]',
  video:
    'hero-video block h-full w-full object-contain [filter:drop-shadow(0_24px_34px_oklch(25%_0.03_260_/_14%))] max-[820px]:[filter:none]',
} as const

function HeroPrimaryAction({
  enterProtocol,
  locale,
}: {
  enterProtocol: string
  locale: Locale
}) {
  const appHref = withLocalePrefix(locale, '/app.html')

  return (
    <a className={cn(homeBtnPrimaryClass, heroClass.actionButton)} href={appHref}>
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
  )
}

export function HomeHeroSection({
  content,
  locale,
}: {
  content: HomeContent['hero']
  locale: Locale
}) {
  return (
    <section className={heroClass.section} aria-labelledby="hero-title">
      <div className={homeHeroRaysClass} aria-hidden="true" />
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
            <HeroPrimaryAction enterProtocol={content.enterProtocol} locale={locale} />
            <a
              className={cn(homeBtnSecondaryClass, heroClass.secondaryAction)}
              href="#whitepaper"
            >
              {content.readWhitepaper}
            </a>
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
