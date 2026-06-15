import type { CSSProperties, ImgHTMLAttributes, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'
import { Card, Text } from '../components/primitives'
import { FaqList } from '../components/faq-list'
import { LanguageMenu } from '../components/language-menu'
import { desktopCopyClass, mobileCopyClass } from '../app/shell-layout'
import { WalletTopbarActions } from '../app/wallet-topbar-actions'
import { withLocalePrefix } from '../i18n/locale'
import {
  deferredImgClass,
  homeArtGlowClass,
  homeBrandClass,
  homeBrandInverseClass,
  homeBrandMarkClass,
  homeBtnClass,
  homeContainerClass,
  homeFooterBrandClass,
  homeFooterLangIconClass,
  homeFooterLangMarkerClass,
  homeHeroRaysClass,
  homeMetricsPanelGlowClass,
  homeMetricsRaysClass,
  homeNavActionsClass,
  homeNavClass,
  homeNavInnerClass,
  homeNavLinksClass,
  homeShellClass,
  tokenCardHoverClass,
} from '~/lib/home-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'
import type { Locale } from '../i18n/locales'
import { allLanguageOptions } from '../i18n/locales'
import { localeMeta } from '../i18n/locale-meta'
import { useI18n } from '../i18n/use-i18n'
import { dappAssets } from '../app/assets'
import { homeAssets } from './assets'
import { getHomeContent } from './content'
import type {
  HomeContent,
  IconCard,
  ResponsiveCopy as ResponsiveCopyValue,
  TokenCard as TokenCardContent,
} from './content'

type ResponsiveCopyProps = {
  desktop: ReactNode
  mobile: ReactNode
}

type DeferredImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string
}

const heroClass = {
  section:
    'hero relative flex min-h-[696px] items-start overflow-hidden pt-[90px] pb-24 [background:linear-gradient(180deg,var(--background),oklch(95.6%_0_0))] max-[1100px]:min-h-0 max-[1100px]:pt-16 max-[1100px]:pb-20 max-[820px]:block max-[820px]:min-h-[754px] max-[820px]:pt-9 max-[820px]:pb-12 max-[820px]:[background:var(--background)]',
  grid:
    'container hero-grid relative z-[1] grid min-h-[510px] grid-cols-[minmax(0,660px)_438px] items-center justify-between gap-16 max-[1100px]:grid-cols-1 max-[1100px]:justify-items-center max-[1100px]:gap-8 max-[1100px]:text-center max-[820px]:flex max-[820px]:min-h-0 max-[820px]:flex-col max-[820px]:items-center max-[820px]:justify-start max-[820px]:gap-4 max-[820px]:text-center',
  copy:
    'hero-copy max-w-[660px] pt-[65px] max-[1100px]:pt-0 max-[820px]:order-2 max-[820px]:flex max-[820px]:w-full max-[820px]:max-w-[362px] max-[820px]:flex-col max-[820px]:items-center max-[820px]:pt-0',
  eyebrow:
    'eyebrow-pill inline-flex min-h-8 w-max max-w-full items-center gap-2 whitespace-nowrap rounded-[999px] border border-border bg-card px-4 py-2 text-[13px] font-semibold leading-[1.2] text-foreground max-[1100px]:mx-auto max-[820px]:min-h-7 max-[820px]:gap-[7px] max-[820px]:px-3.5 max-[820px]:py-[7px] max-[820px]:text-xs max-[520px]:whitespace-normal max-[520px]:text-left',
  statusDot: 'status-dot size-[7px] shrink-0 rounded-[999px] bg-success',
  title:
    'mt-[22px] max-w-[660px] text-[64px] font-semibold leading-[1.08] tracking-[0] text-foreground max-[820px]:mt-4 max-[820px]:w-full max-[820px]:text-[34px] max-[820px]:leading-[1.2]',
  body:
    'mt-[22px] max-w-[660px] text-lg font-normal leading-[1.5] text-ink-strong max-[820px]:mt-2.5 max-[820px]:w-full max-[820px]:text-sm',
  actions:
    'hero-actions mt-[22px] flex items-center gap-3.5 pt-3.5 max-[1100px]:justify-center max-[820px]:mt-3 max-[820px]:w-full max-[820px]:flex-col max-[820px]:items-stretch max-[820px]:gap-4 max-[820px]:pt-0',
  actionButton:
    'max-[820px]:w-full max-[820px]:!shadow-none',
  secondaryAction:
    'max-[820px]:w-full max-[820px]:!shadow-none',
  actionLabel: 'text-inherit',
  actionArrow: 'ml-1.5 size-4 shrink-0',
  art:
    'hero-art relative w-[min(100%,438px)] aspect-[438/510] max-[1100px]:w-[min(438px,100%)] max-[1100px]:aspect-[438/420] max-[820px]:order-1 max-[820px]:w-[294px] max-[820px]:aspect-[294/342]',
  media:
    'hero-media absolute left-2.5 top-0 w-[min(77.2%,338px)] aspect-[338/510] [animation:character-float_6s_ease-in-out_infinite] max-[1100px]:left-1/2 max-[1100px]:w-[278px] max-[1100px]:aspect-[278/420] max-[1100px]:-translate-x-1/2 max-[1100px]:[animation-name:character-float-centered] max-[820px]:left-0 max-[820px]:top-0 max-[820px]:w-[294px] max-[820px]:aspect-[294/342] max-[820px]:translate-x-0 max-[820px]:[animation-name:character-float-mobile]',
  video:
    'hero-video block h-full w-full object-contain [filter:drop-shadow(0_24px_34px_oklch(25%_0.03_260_/_14%))] max-[820px]:[filter:none]',
} as const

const sectionHeadClass = {
  root: 'section-head mx-auto max-w-[760px] text-center max-[820px]:w-full max-[820px]:max-w-[362px] max-[820px]:pb-1',
} as const

const homeSectionClass = {
  protocol:
    'relative py-[120px] max-[820px]:min-h-[827px] max-[820px]:pt-0 max-[820px]:pb-14',
  engine:
    'relative py-[120px] max-[820px]:min-h-[976px] max-[820px]:pt-0 max-[820px]:pb-14',
} as const

const iconCardClass = {
  protocolGrid:
    'feature-card three-col mt-14 grid grid-cols-3 overflow-hidden rounded-[22px] bg-card shadow-card max-[820px]:mt-4 max-[820px]:grid-cols-1 max-[820px]:gap-4 max-[820px]:overflow-visible max-[820px]:rounded-none max-[820px]:bg-transparent max-[820px]:shadow-none',
  protocolCard:
    'min-h-[281px] px-[34px] py-9 max-[820px]:min-h-0 max-[820px]:rounded-[18px] max-[820px]:bg-card max-[820px]:p-[22px] max-[820px]:shadow-card max-[520px]:px-6 max-[520px]:py-7',
  protocolIcon: 'feature-icon size-20 object-contain max-[820px]:size-11',
  protocolIndex:
    'feature-index mt-2.5 hidden text-xs font-semibold leading-[1.2] tracking-[0.96px] text-faint max-[820px]:block',
  engineGrid:
    'engine-card mt-14 grid grid-cols-2 overflow-hidden rounded-[22px] bg-card shadow-card max-[820px]:mt-6 max-[820px]:grid-cols-1 max-[820px]:gap-6 max-[820px]:overflow-visible max-[820px]:rounded-none max-[820px]:bg-transparent max-[820px]:shadow-none',
  engineCard:
    'group/engine min-h-[265px] p-[34px] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:min-h-0 max-[820px]:rounded-[18px] max-[820px]:bg-card max-[820px]:p-[22px] max-[820px]:shadow-card max-[520px]:px-6 max-[520px]:py-7',
  engineIcon:
    'size-20 object-cover max-[820px]:size-11 max-[820px]:object-contain',
} as const

const tokenCardClass = {
  section:
    'token-section relative py-[120px] min-[821px]:min-h-[696px] max-[820px]:min-h-[902px] max-[820px]:pt-0 max-[820px]:pb-14',
  container: 'container max-[820px]:!w-[min(calc(100vw-40px),362px)]',
  grid:
    'token-grid mt-14 grid grid-cols-4 gap-[22px] max-[1100px]:grid-cols-2 max-[820px]:mt-4 max-[820px]:grid-cols-1 max-[820px]:gap-4',
  card:
    'token-card relative isolate h-[280px] overflow-hidden transition-[box-shadow,filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(135deg,oklch(100%_0_0_/_16%),transparent_58%)] before:opacity-0 before:transition-opacity before:duration-300 before:ease-[cubic-bezier(0.2,0.7,0.2,1)] before:content-[""] max-[820px]:flex max-[820px]:h-auto max-[820px]:min-h-[173px] max-[820px]:flex-col max-[820px]:justify-start max-[820px]:gap-[7px] max-[820px]:rounded-[18px] max-[820px]:p-5',
  iconWrap:
    'token-tile absolute left-6 top-6 z-[1] grid size-[52px] origin-center place-items-center rounded-[14px] border border-white/28 bg-white/16 transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:static max-[820px]:size-[46px] max-[820px]:rounded-[13px] max-[820px]:border-0 max-[820px]:bg-card [&_img:not([src])]:bg-transparent',
  icon:
    'size-[30px] object-contain transition-[filter] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:size-[26px]',
  shapeWrap:
    'token-shape-wrap pointer-events-none absolute -z-[1] transition-[filter,opacity] duration-[420ms] ease-[cubic-bezier(0.2,0.7,0.2,1)] max-[820px]:hidden',
  shapeImg:
    'token-shape block size-full [[&:not([src])]]:bg-transparent',
  info:
    'token-info absolute left-6 top-[154px] z-[1] flex w-[min(calc(100%-48px),235px)] flex-col gap-1.5 max-[820px]:static max-[820px]:w-full',
} as const

const metricClass = {
  section:
    'metrics-wrap min-[821px]:min-h-[231px] pb-10 max-[820px]:min-h-[252px] max-[820px]:pb-12',
  container: 'container max-[820px]:!w-[min(calc(100vw-40px),362px)]',
  panel:
    'relative isolate grid min-h-[191px] grid-cols-4 items-center justify-between overflow-hidden rounded-[28px] bg-dark px-10 py-14 text-white max-[820px]:min-h-[204px] max-[820px]:grid-cols-2 max-[820px]:gap-y-6 max-[820px]:rounded-[22px] max-[820px]:px-5 max-[820px]:py-7',
  item: 'relative z-[1] grid justify-items-center gap-2 text-center max-[820px]:gap-1.5',
  value:
    'text-[44px] font-semibold leading-none max-[820px]:text-[30px] max-[820px]:leading-[1.2] max-[820px]:tracking-[-0.9px]',
  label:
    'text-sm font-medium leading-[1.2] max-[820px]:text-[13px] max-[820px]:font-normal max-[820px]:leading-[1.5] max-[820px]:text-on-dark',
} as const

const roadmapClass = {
  section:
    'roadmap relative py-[120px] min-[821px]:min-h-[1215px] max-[820px]:min-h-[911px] max-[820px]:pt-0 max-[820px]:pb-14',
  timeline:
    'timeline relative mt-5 flex min-h-[776px] w-full flex-col gap-0 pl-0 min-[821px]:mt-12 min-[821px]:block min-[821px]:min-h-[851px]',
  rail:
    'timeline-rail hidden min-[821px]:absolute min-[821px]:left-[calc(50%-2px)] min-[821px]:top-[58px] min-[821px]:block min-[821px]:h-[727px] min-[821px]:w-1 min-[821px]:rounded-[2px] min-[821px]:bg-border',
  phase:
    'phase relative grid min-h-[132px] grid-cols-[32px_minmax(0,1fr)] items-start gap-3.5 min-[821px]:absolute min-[821px]:block min-[821px]:min-h-0 min-[821px]:w-full',
  card:
    'phase-card w-full min-h-[116px] p-4 max-[820px]:rounded-[14px] min-[821px]:min-h-[120px] min-[821px]:w-[min(540px,calc(50%_-_60px))] min-[821px]:p-[22px_24px]',
  cardRight: 'min-[821px]:ml-auto',
  currentCard:
    'min-h-[119px] border border-primary min-[821px]:min-h-[124px]',
  header:
    'flex items-center justify-between gap-2.5 overflow-hidden min-[821px]:justify-start',
  phaseLabel:
    'text-[11px] font-semibold leading-[1.2] tracking-[0.72px] min-[821px]:text-xs min-[821px]:leading-normal',
  phaseLabelActive: 'text-primary',
  phaseLabelMuted: 'text-ink-muted',
  now:
    'rounded-[999px] bg-primary px-2 py-0.5 text-[10px] font-semibold not-italic text-white min-[821px]:px-2.5 min-[821px]:py-[3px] min-[821px]:text-[11px]',
  time:
    'ml-auto text-[11px] font-semibold leading-[1.2] min-[821px]:text-xs min-[821px]:leading-[1.4]',
  timeMuted: 'text-ink-muted',
  timeCurrent: 'text-primary',
  title:
    'mt-1.5 text-base font-semibold leading-[1.2] tracking-[-0.64px] text-foreground min-[821px]:mt-2 min-[821px]:text-lg min-[821px]:leading-[1.4] min-[821px]:tracking-[-0.72px]',
  body:
    'mt-1.5 text-[13px] font-normal leading-[1.4] tracking-[-0.26px] text-ink-muted min-[821px]:mt-2',
  dot:
    'phase-dot relative left-0 top-0 z-[2] grid size-8 place-items-center rounded-[999px] text-sm font-semibold min-[821px]:absolute min-[821px]:left-[calc(50%_-_18px)] min-[821px]:top-[42px] min-[821px]:size-9 min-[821px]:border-[3px]',
  dotComplete:
    'bg-primary text-white min-[821px]:border-primary',
  dotUpcoming:
    'border-[3px] border-border bg-card text-ink-muted',
  dotCurrent:
    'min-[821px]:shadow-[0_0_0_8px_oklch(94.92%_0.0224_45.6_/_96%)]',
  dotConnector:
    "after:absolute after:left-[14.5px] after:top-8 after:h-[100px] after:w-[3px] after:rounded-[2px] after:content-[''] min-[821px]:after:hidden",
  dotConnectorDone: 'after:bg-primary',
  dotConnectorUpcoming: 'after:bg-border',
} as const

const roadmapPhaseTopClass = [
  'min-[821px]:top-4',
  'min-[821px]:top-[154px]',
  'min-[821px]:top-[292px]',
  'min-[821px]:top-[430px]',
  'min-[821px]:top-[577px]',
  'min-[821px]:top-[715px]',
] as const

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

const partnerClass = {
  section:
    'partners min-[821px]:min-h-52 border-b border-border bg-secondary pb-[120px] text-center max-[820px]:min-h-[262px] max-[820px]:py-12',
  row: 'partner-row mt-6 flex flex-wrap justify-center gap-3.5 max-[820px]:mt-4',
  chip: 'inline-flex min-h-12 items-center gap-2.5 border border-border py-3 pl-3 pr-7 text-[15px] font-semibold text-ink-strong max-[820px]:min-h-9 max-[820px]:py-1.5 max-[820px]:pl-3 max-[820px]:pr-4 max-[820px]:text-[13px]',
} as const

const faqClass = {
  section:
    'relative py-[120px] min-[821px]:min-h-[800px] max-[820px]:min-h-[529px] max-[820px]:py-14',
} as const

const footerClass = {
  root:
    'site-footer flex flex-col items-center gap-10 bg-[#161514] pt-[72px] pb-9 text-on-dark min-[821px]:min-h-[336px] max-[820px]:gap-6 max-[820px]:pt-12 max-[820px]:pb-8',
  top:
    'container footer-top grid min-[821px]:min-h-[131px] grid-cols-4 items-start gap-10 overflow-hidden max-[820px]:grid-cols-3 max-[820px]:gap-x-3.5 max-[820px]:gap-y-6',
  brand:
    'footer-brand flex min-h-[124px] min-w-0 flex-col items-start gap-3.5 overflow-hidden max-[820px]:col-span-full max-[820px]:min-h-0',
  brandCopy:
    'm-0 w-[min(100%,260px)] text-sm font-normal leading-[1.5] tracking-[-0.28px] text-on-dark max-[820px]:text-[13px]',
  group:
    'grid min-w-0 content-start gap-2.5 overflow-hidden pb-1.5 text-sm whitespace-nowrap max-[820px]:gap-2 max-[820px]:pb-0',
  rule: 'container h-px bg-[#232323]',
  bottom:
    'container footer-bottom flex min-h-4 items-start justify-between gap-6 overflow-hidden text-[13px] font-normal leading-4 tracking-[-0.26px] text-on-dark whitespace-nowrap max-[820px]:block max-[820px]:text-xs',
} as const

const footerLinkClass =
  'font-normal tracking-[-0.28px] max-[820px]:nth-[n+4]:hidden'

const navClass = {
  secondary: homeBtnClass('ghost', { sm: true, className: 'max-[820px]:!hidden' }),
} as const

function labelKey(label: string | ResponsiveCopyValue) {
  return typeof label === 'string' ? label : label.desktop
}

function prefixedPath(locale: Locale, path: string) {
  if (path.startsWith('#')) {
    return path
  }

  return `/${locale}${path.startsWith('/') ? path : `/${path}`}`
}

function ResponsiveCopy({ desktop, mobile }: ResponsiveCopyProps) {
  return (
    <>
      <span className={desktopCopyClass}>{desktop}</span>
      <span className={mobileCopyClass}>{mobile}</span>
    </>
  )
}

function ResponsiveLines({ copy }: { copy: ResponsiveCopyValue }) {
  return (
    <ResponsiveCopy
      desktop={copy.desktop.split('\n').map((line, index) => (
        <span key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
      mobile={copy.mobile.split('\n').map((line, index) => (
        <span key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    />
  )
}

function DeferredImage({
  src,
  className,
  loading = 'lazy',
  ...props
}: DeferredImageProps) {
  return (
    <img
      {...props}
      className={cn(className, deferredImgClass)}
      data-src={src}
      loading={loading}
    />
  )
}

function Header({
  content,
}: {
  content: HomeContent['nav']
}) {
  const { locale, setLocale } = useI18n()
  const languageOptions = allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))

  return (
    <header className={homeNavClass} aria-label="Primary navigation">
      <div className={cn(homeNavInnerClass, homeContainerClass)}>
        <a className={homeBrandClass} href="#top" aria-label="AEGIS X home">
          <img
            className={homeBrandMarkClass}
            src={homeAssets.logoMark}
            alt=""
            width="28"
            height="27"
          />
          <span>AEGIS X</span>
        </a>
        <nav className={homeNavLinksClass} aria-label={content.sectionsLabel}>
          {content.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={homeNavActionsClass}>
          <a className={navClass.secondary} href="#whitepaper">
            {content.whitepaper}
          </a>
          <WalletTopbarActions />
          <LanguageMenu
            checkIcon={dappAssets.check}
            globeIcon={homeAssets.globe}
            label={content.languageLabel}
            options={languageOptions}
          />
        </div>
      </div>
    </header>
  )
}

function HeroPrimaryAction({
  enterProtocol,
  locale,
}: {
  enterProtocol: string
  locale: Locale
}) {
  const appHref = withLocalePrefix(locale, '/app.html')

  return (
    <a
      className={cn(homeBtnClass('primary'), heroClass.actionButton)}
      href={appHref}
    >
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

function HeroSection({
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
        <div className={cn(heroClass.copy, revealClass())} data-reveal>
          <div className={heroClass.eyebrow}>
            <span className={heroClass.statusDot} />
            <ResponsiveCopy
              desktop={content.eyebrow.desktop}
              mobile={content.eyebrow.mobile}
            />
          </div>
          <h1 className={heroClass.title} id="hero-title">
            {content.title}
          </h1>
          <p className={heroClass.body}>
            <ResponsiveCopy
              desktop={content.body.desktop}
              mobile={content.body.mobile}
            />
          </p>
          <div className={heroClass.actions}>
            <HeroPrimaryAction enterProtocol={content.enterProtocol} locale={locale} />
            <a
              className={cn(homeBtnClass('secondary'), heroClass.secondaryAction)}
              href="#whitepaper"
            >
              {content.readWhitepaper}
            </a>
          </div>
        </div>
        <div
          className={cn(heroClass.art, revealClass({ delay: true }))}
          data-reveal
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

function SectionHead({
  eyebrow,
  title,
  subtitle,
  className,
  titleClassName,
  subtitleClassName,
}: {
  eyebrow: string
  title: ReactNode
  subtitle?: ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}) {
  return (
    <div className={cn(sectionHeadClass.root, revealClass(), className)} data-reveal>
      <Text as="p" variant="eyebrow" tone="coral">
        {eyebrow}
      </Text>
      <Text as="h2" variant="sectionTitle" className={titleClassName}>
        {title}
      </Text>
      {subtitle ? (
        <Text
          as="span"
          variant="sectionSubtitle"
          tone="body"
          className={subtitleClassName}
        >
          {subtitle}
        </Text>
      ) : null}
    </div>
  )
}

function ProtocolCards({ cards }: { cards: IconCard[] }) {
  return (
    <div className={cn(iconCardClass.protocolGrid, revealClass())} data-reveal>
      {cards.map((card, index) => (
        <Card
          className={cn(
            iconCardClass.protocolCard,
            index > 0 && 'min-[821px]:border-l min-[821px]:border-border',
            index === 0
              ? 'max-[820px]:min-h-[218px]'
              : 'max-[820px]:min-h-[197px]',
          )}
          key={card.title}
          radius="none"
          tone="transparent"
          hover="shadow"
        >
          <DeferredImage
            className={iconCardClass.protocolIcon}
            src={card.icon}
            alt=""
            width="80"
            height="80"
          />
          {card.index ? (
            <Text
              as="span"
              className={iconCardClass.protocolIndex}
              tone="muted"
            >
              {card.index}
            </Text>
          ) : null}
          <Text as="h3" variant="cardTitle">
            {card.title}
          </Text>
          <Text as="p" variant="cardBody" tone="body">
            <ResponsiveCopy desktop={card.desktop} mobile={card.mobile} />
          </Text>
        </Card>
      ))}
    </div>
  )
}

function EngineCards({ cards }: { cards: IconCard[] }) {
  return (
    <div className={cn(iconCardClass.engineGrid, revealClass())} data-reveal>
      {cards.map((card, index) => (
        <Card
          className={cn(
            iconCardClass.engineCard,
            index % 2 === 1 && 'min-[821px]:border-l min-[821px]:border-border',
            index > 1 && 'min-[821px]:border-t min-[821px]:border-border',
            index < 2
              ? 'max-[820px]:min-h-[194px]'
              : 'max-[820px]:min-h-[173px]',
          )}
          key={card.title}
          radius="none"
          tone="transparent"
          hover="shadow"
          data-engine-card
        >
          <DeferredImage
            className={iconCardClass.engineIcon}
            src={card.icon}
            alt=""
            width="80"
            height="80"
          />
          <Text
            as="h3"
            className="transition-colors duration-300 ease-out group-hover/engine:text-primary group-focus-within/engine:text-primary max-[820px]:whitespace-nowrap"
            variant="cardTitle"
          >
            {card.title}
          </Text>
          <Text as="p" variant="cardBody" tone="body">
            <ResponsiveCopy desktop={card.desktop} mobile={card.mobile} />
          </Text>
        </Card>
      ))}
    </div>
  )
}

function ProtocolSection({ content }: { content: HomeContent['sections']['protocol'] }) {
  return (
    <section
      className={homeSectionClass.protocol}
      id="protocol"
      aria-labelledby="protocol-title"
    >
      <div className="container">
        <SectionHead
          eyebrow={content.eyebrow}
          title={
            <ResponsiveCopy
              desktop={content.title.desktop}
              mobile={content.title.mobile}
            />
          }
          subtitle={
            <ResponsiveCopy
              desktop={content.subtitle.desktop}
              mobile={content.subtitle.mobile}
            />
          }
        />
        <ProtocolCards cards={content.cards} />
      </div>
    </section>
  )
}

function EngineSection({ content }: { content: HomeContent['sections']['engine'] }) {
  return (
    <section
      className={homeSectionClass.engine}
      id="engine"
      aria-labelledby="engine-title"
    >
      <div className="container">
        <SectionHead
          eyebrow={content.eyebrow}
          title={
            <ResponsiveCopy
              desktop={content.title.desktop}
              mobile={content.title.mobile}
            />
          }
          subtitle={
            <ResponsiveCopy
              desktop={content.subtitle.desktop}
              mobile={content.subtitle.mobile}
            />
          }
        />
        <EngineCards cards={content.cards} />
      </div>
    </section>
  )
}

function TokenSection({ content }: { content: HomeContent['sections']['token'] }) {
  return (
    <section
      className={tokenCardClass.section}
      id="token"
      aria-labelledby="token-title"
    >
      <div className={tokenCardClass.container}>
        <SectionHead
          eyebrow={content.eyebrow}
          title={content.title}
          subtitle={
            <ResponsiveCopy
              desktop={content.subtitle.desktop}
              mobile={content.subtitle.mobile}
            />
          }
        />
        <div
          className={cn(tokenCardClass.grid, revealClass())}
          data-reveal
          data-token-grid
        >
          {content.cards.map((token) => (
            <TokenCardItem token={token} key={token.symbol} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TokenCardItem({ token }: { token: TokenCardContent }) {
  return (
    <Card
      className={cn(tokenCardClass.card, token.className, tokenCardHoverClass)}
      data-token-card
      radius="xl"
      tone="token"
    >
      <div
        className={cn(tokenCardClass.shapeWrap, token.shapeWrapClassName)}
        aria-hidden="true"
      >
        <DeferredImage
          className={cn(tokenCardClass.shapeImg, token.shapeClassName)}
          src={token.shape}
          alt=""
          width="170"
          height="170"
        />
      </div>
      <span className={tokenCardClass.iconWrap} aria-hidden="true">
        <DeferredImage
          className={cn(tokenCardClass.icon, token.iconClassName)}
          src={token.icon}
          alt=""
          width="30"
          height="30"
        />
      </span>
      <div className={tokenCardClass.info}>
        <Text as="h3" variant="tokenSymbol" tone="inverse">
          {token.symbol}
        </Text>
        <Text as="strong" variant="tokenLabel" tone="inverse">
          {token.label}
        </Text>
        <Text as="p" variant="tokenBody" tone="inverse">
          {token.description}
        </Text>
      </div>
    </Card>
  )
}

function MetricsSection({ metrics }: { metrics: HomeContent['metrics'] }) {
  return (
    <section
      className={metricClass.section}
      aria-label="Protocol metrics"
      data-count-panel
      data-metrics-reveal
      data-reveal
      data-reveal-manual
    >
      <div className={metricClass.container}>
        <div className={cn(metricClass.panel, homeMetricsPanelGlowClass)} data-metrics-panel>
          <div className={homeMetricsRaysClass} aria-hidden="true" />
          {metrics.map((metric) => (
            <article
              className={metricClass.item}
              key={metric.label}
            >
              <Text
                as="strong"
                className={metricClass.value}
                data-count-target={metric.countTarget}
                data-count-suffix={metric.suffix}
                data-count-initial={metric.value}
                tone="inverse"
              >
                {metric.value}
              </Text>
              <Text
                as="span"
                className={metricClass.label}
                tone="inverse"
              >
                {metric.label}
              </Text>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function RoadmapSection({ content }: { content: HomeContent['sections']['roadmap'] }) {
  return (
    <section
      className={roadmapClass.section}
      id="roadmap"
      aria-labelledby="roadmap-title"
    >
      <div className="container">
        <SectionHead eyebrow={content.eyebrow} title={content.title} />
        <div
          className={cn(roadmapClass.timeline, revealClass())}
          data-reveal
          data-timeline
        >
          <div className={roadmapClass.rail} data-timeline-rail aria-hidden="true" />
          {content.phases.map((phase, index) => (
            <article
              className={cn(
                roadmapClass.phase,
                phase.side === 'right' ? 'phase-right' : 'phase-left',
                phase.state === 'current' && 'phase-current',
                roadmapPhaseTopClass[index],
              )}
              data-phase-current={phase.state === 'current' ? true : undefined}
              data-phase-side={phase.side}
              key={phase.phase}
              style={{ '--phase-index': index } as CSSProperties}
            >
              <div
                className={cn(
                  roadmapClass.dot,
                  phase.state === 'done' || phase.state === 'current'
                    ? roadmapClass.dotComplete
                    : roadmapClass.dotUpcoming,
                  phase.state === 'current' && roadmapClass.dotCurrent,
                  index < content.phases.length - 1 && roadmapClass.dotConnector,
                  index < content.phases.length - 1 &&
                    (phase.state === 'done'
                      ? roadmapClass.dotConnectorDone
                      : roadmapClass.dotConnectorUpcoming),
                )}
                data-phase-dot
                aria-hidden="true"
              >
                {phase.dot}
              </div>
              <Card
                className={cn(
                  roadmapClass.card,
                  phase.side === 'right' && roadmapClass.cardRight,
                  phase.state === 'current' && roadmapClass.currentCard,
                )}
                data-phase-card
                radius="md"
                hover="shadow"
              >
                <div className={roadmapClass.header}>
                  <span
                    className={cn(
                      roadmapClass.phaseLabel,
                      phase.state
                        ? roadmapClass.phaseLabelActive
                        : roadmapClass.phaseLabelMuted,
                    )}
                  >
                    {phase.phase}
                  </span>
                  {phase.state === 'current' ? (
                    <em className={roadmapClass.now}>NOW</em>
                  ) : null}
                  <time
                    className={cn(
                      roadmapClass.time,
                      phase.state === 'current'
                        ? roadmapClass.timeCurrent
                        : roadmapClass.timeMuted,
                    )}
                  >
                    {phase.time}
                  </time>
                </div>
                <h3 className={roadmapClass.title}>{phase.title}</h3>
                <p className={roadmapClass.body}>{phase.description}</p>
              </Card>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SecuritySection({ content }: { content: HomeContent['sections']['security'] }) {
  return (
    <section
      className={securityClass.section}
      id="security"
      aria-labelledby="security-title"
    >
      <div className={securityClass.container}>
        <SectionHead
          eyebrow={content.eyebrow}
          title={content.title}
          className={securityClass.head}
          titleClassName={securityClass.title}
          subtitleClassName={securityClass.subtitle}
          subtitle={
            <ResponsiveCopy
              desktop={content.subtitle.desktop}
              mobile={content.subtitle.mobile}
            />
          }
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
                data-security-check
                key={typeof check === 'string' ? check : check.desktop}
                hover="shadow"
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
                {typeof check === 'string' ? (
                  check
                ) : (
                  <ResponsiveCopy desktop={check.desktop} mobile={check.mobile} />
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PartnersSection({ content }: { content: HomeContent['sections']['partners'] }) {
  return (
    <section className={partnerClass.section} aria-labelledby="partners-title">
      <div className="container">
        <Text
          as="h2"
          variant="eyebrow"
          tone="coral"
          id="partners-title"
        >
          {content.title}
        </Text>
        <div className={partnerClass.row}>
          {content.items.map(([name, icon]) => (
            <Card
              as="span"
              className={partnerClass.chip}
              radius="full"
              key={name}
              hover="shadow"
            >
              <DeferredImage
                className="partner-icon size-6 shrink-0 object-contain"
                src={icon}
                alt=""
                width="24"
                height="24"
              />
              {name}
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ content }: { content: HomeContent['sections']['faq'] }) {
  return (
    <section className={faqClass.section} id="faq" aria-labelledby="faq-title">
      <div className="container">
        <SectionHead eyebrow={content.eyebrow} title={content.title} />
        <FaqList items={content.items} variant="home" />
      </div>
    </section>
  )
}

function Footer({
  content,
}: {
  content: HomeContent['footer']
}) {
  const { locale } = useI18n()

  return (
    <footer className={footerClass.root}>
      <div className={footerClass.top}>
        <div className={footerClass.brand}>
          <a className={cn(homeFooterBrandClass, homeBrandInverseClass)} href="#top">
            <img className={homeBrandMarkClass} src={homeAssets.logoMark} alt="" width="28" height="26" />
            <span>AEGIS X</span>
          </a>
          <Text as="p" className={footerClass.brandCopy} tone="onDark">
            <ResponsiveLines copy={content.brandCopy} />
          </Text>
          <span
            aria-label={content.languageLabel}
            className={homeFooterLangMarkerClass}
          >
            <svg
              aria-hidden="true"
              className={homeFooterLangIconClass}
              viewBox="0 0 16 16"
            >
              <path d="M8 14.3C11.4794 14.3 14.3 11.4794 14.3 8C14.3 4.52061 11.4794 1.7 8 1.7C4.52061 1.7 1.7 4.52061 1.7 8C1.7 11.4794 4.52061 14.3 8 14.3Z" />
              <path d="M8 1.7C4 4.2 4 11.8 8 14.3C12 11.8 12 4.2 8 1.7Z" />
              <path d="M1.7 8H14.3" />
            </svg>
            <span>{localeMeta[locale].menuCode}</span>
          </span>
        </div>
        {content.groups.map((group) => (
          <nav
            className={footerClass.group}
            aria-label={group.ariaLabel}
            key={group.label}
          >
            <Text as="h3" variant="footerHeading" tone="inverse">
              {group.label}
            </Text>
            {group.links.map((link) => (
              <Text
                as="a"
                className={footerLinkClass}
                href={prefixedPath(locale, link.href)}
                key={`${group.label}-${link.href}-${labelKey(link.label)}`}
                tone="onDark"
                variant="footerLink"
              >
                {typeof link.label === 'string' ? (
                  link.label
                ) : (
                  <ResponsiveCopy
                    desktop={link.label.desktop}
                    mobile={link.label.mobile}
                  />
                )}
              </Text>
            ))}
          </nav>
        ))}
      </div>
      <div className={footerClass.rule} aria-hidden="true" />
      <div className={footerClass.bottom}>
        <p className="m-0 max-[820px]:whitespace-nowrap">
          {content.copyright}
        </p>
        <p className="m-0 max-[820px]:hidden">{content.legal}</p>
      </div>
    </footer>
  )
}

export function HomePage() {
  const { locale } = useI18n()
  const content = useMemo(() => getHomeContent(locale), [locale])

  useEffect(() => {
    document.title = content.meta.title

    const descriptionMeta = document.querySelector('meta[name="description"]')
    if (descriptionMeta) {
      descriptionMeta.setAttribute('content', content.meta.description)
    }
  }, [content.meta.description, content.meta.title])

  return (
    <div className={homeShellClass}>
      <Header content={content.nav} />
      <main className="pt-[74px] max-[820px]:pt-[60px]" id="top">
        <HeroSection content={content.hero} locale={locale} />
        <ProtocolSection content={content.sections.protocol} />
        <EngineSection content={content.sections.engine} />
        <TokenSection content={content.sections.token} />
        <MetricsSection metrics={content.metrics} />
        <RoadmapSection content={content.sections.roadmap} />
        <SecuritySection content={content.sections.security} />
        <PartnersSection content={content.sections.partners} />
        <FaqSection content={content.sections.faq} />
      </main>
      <Footer content={content.footer} />
    </div>
  )
}
