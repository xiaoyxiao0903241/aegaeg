import { LanguageMenu } from '~/components/language-menu'
import { dappAssets } from '~/app/assets'
import { allLanguageOptions } from '~/i18n/locales'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { getHomeNotionLinks } from '~/home/notion-links'
import { homeAssets } from '~/home/assets'
import { cn } from '~/lib/utils'

const navClass = cn(
  'fixed inset-x-0 top-0 z-50 flex h-18 w-full items-center border-b border-[oklch(94.87%_0.0058_264.53_/_72%)] bg-[oklch(97.29%_0.0029_264.54_/_88%)] backdrop-blur-[1.125rem]',
  'max-dapp:min-h-14 max-dapp:bg-background max-dapp:py-0 max-dapp:backdrop-blur-none',
)

const navInnerClass = cn(
  'container flex h-18 items-center justify-between gap-6',
  'max-dapp:min-h-14 max-dapp:flex-nowrap max-dapp:gap-3',
)

const brandClass = cn(
  'inline-flex items-center gap-2.5 whitespace-nowrap text-lg font-semibold tracking-normal text-foreground',
  'max-dapp:gap-2 max-dapp:text-base max-dapp:leading-[1.2]',
)

const brandMarkClass = cn(
  'h-7 w-7 object-contain',
  'max-dapp:h-5.5 max-dapp:w-6',
)

const navLinksClass = cn(
  'flex items-center gap-8 whitespace-nowrap text-sm font-medium text-ink-strong',
  'max-[1100px]:hidden',
  '[&_a]:transition-[color,transform] [&_a]:duration-180 [&_a]:ease-out',
  '[&_a:hover]:-translate-y-px [&_a:hover]:text-foreground',
)

const navActionsClass = cn(
  'flex items-center gap-3.5',
  'max-dapp:w-auto max-dapp:justify-end max-dapp:gap-2.5',
)

const navGhostBtnClass = cn(
  'inline-flex min-h-9.5 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent px-4.5',
  'text-sm font-semibold leading-none tracking-normal whitespace-nowrap text-foreground',
  'transition-[box-shadow,border-color,background-color,opacity,color] duration-180 ease-out',
  'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
  'hover:opacity-[0.96] hover:shadow-card focus-visible:opacity-[0.96] focus-visible:shadow-card',
  'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
  'max-dapp:!hidden',
)

export function HomeHeader() {
  const { locale, messages, setLocale } = useI18n()
  const content = messages.home.nav
  const notionLinks = getHomeNotionLinks(locale)
  const appHref = withLocalePrefix(locale, '/app.html')
  const languageOptions = allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))

  return (
    <header className={navClass} aria-label="Primary navigation">
      <div className={navInnerClass}>
        <a className={brandClass} href="#top" aria-label="AEGIS X home">
          <img
            className={brandMarkClass}
            src={homeAssets.logoMark}
            alt=""
            width="28"
            height="27"
          />
          <span>AEGIS X</span>
        </a>
        <nav className={navLinksClass} aria-label={content.sectionsLabel}>
          {content.links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={navActionsClass}>
          <a
            className={navGhostBtnClass}
            href={notionLinks.whitepaper}
            rel="noopener noreferrer"
            target="_blank"
          >
            {content.whitepaper}
          </a>
          <a
            className="aegis-thirdweb-button aegis-thirdweb-button-primary"
            href={appHref}
          >
            {content.enterApp}
          </a>
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
