import { LanguageMenu } from '~/components/language-menu'
import { WalletTopbarActions } from '~/app/wallet-topbar-actions'
import { dappAssets } from '~/app/assets'
import { allLanguageOptions } from '~/i18n/locales'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/home/assets'
import type { HomeMessagesBundle } from '~/i18n/messages/home/en'
import { cn } from '~/lib/utils'

const navClass = cn(
  'fixed inset-x-0 top-0 z-50 flex h-[74px] w-full items-center border-b border-[oklch(94.87%_0.0058_264.53_/_72%)] bg-[oklch(97.29%_0.0029_264.54_/_88%)] backdrop-blur-[18px]',
  'max-dapp:min-h-[60px] max-dapp:bg-background max-dapp:py-0 max-dapp:backdrop-blur-none',
)

const navInnerClass = cn(
  'flex h-[74px] w-full items-center justify-between gap-6',
  'max-dapp:min-h-[60px] max-dapp:flex-nowrap max-dapp:gap-3 max-dapp:px-5',
)

const containerClass = 'mx-auto w-[min(calc(100%-48px),var(--container))]'

const brandClass = cn(
  'inline-flex items-center gap-[11px] whitespace-nowrap text-lg font-semibold tracking-normal text-foreground',
  'max-dapp:gap-[9px] max-dapp:text-base max-dapp:leading-[1.2]',
)

const brandMarkClass = cn(
  'h-[27px] w-7 object-contain',
  'max-dapp:h-[22px] max-dapp:w-6',
)

const navLinksClass = cn(
  'flex items-center gap-[34px] whitespace-nowrap text-[15px] font-medium text-ink-strong',
  'max-[1100px]:hidden',
  '[&_a]:transition-[color,transform] [&_a]:duration-180 [&_a]:ease-out',
  '[&_a:hover]:-translate-y-px [&_a:hover]:text-foreground',
)

const navActionsClass = cn(
  'flex items-center gap-3.5',
  'max-dapp:w-auto max-dapp:justify-end max-dapp:gap-2.5',
)

const navGhostBtnClass = cn(
  'inline-flex min-h-[39px] cursor-pointer items-center justify-center rounded-full border border-border bg-transparent px-[18px]',
  'text-sm font-semibold leading-none tracking-normal whitespace-nowrap text-foreground',
  'transition-[box-shadow,border-color,background-color,opacity,color] duration-180 ease-out',
  'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
  'hover:opacity-[0.96] hover:shadow-card focus-visible:opacity-[0.96] focus-visible:shadow-card',
  'visited:text-foreground hover:text-foreground focus-visible:text-foreground',
  'max-dapp:!hidden',
)

export function HomeHeader({ content }: { content: HomeMessagesBundle['nav'] }) {
  const { locale, setLocale } = useI18n()
  const languageOptions = allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))

  return (
    <header className={navClass} aria-label="Primary navigation">
      <div className={cn(navInnerClass, containerClass)}>
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
          <a className={navGhostBtnClass} href="#whitepaper">
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
