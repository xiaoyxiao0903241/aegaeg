import { LanguageMenu } from '~/shared/ui/language-menu'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { dappAssets } from '~/app/assets'
import { allLanguageOptions } from '~/i18n/locales'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { getNotionLinks } from '~/shared/config/notion-links'
import { homeAssets } from '~/views/home/assets'

export function HomeHeader() {
  const { locale, messages, setLocale } = useI18n()
  const content = messages.home.nav
  const notionLinks = getNotionLinks(locale)
  const appHref = withLocalePrefix(locale, '/app.html')
  const languageOptions = allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 flex h-18 w-full items-center border-b border-border/70 bg-background/90 backdrop-blur-[1.125rem] max-dapp:min-h-14 max-dapp:bg-background max-dapp:py-0 max-dapp:backdrop-blur-none"
      aria-label="Primary navigation"
    >
      <div className="container flex h-18 items-center justify-between gap-6 max-dapp:min-h-14 max-dapp:flex-nowrap max-dapp:gap-3">
        <a
          className="inline-flex items-center gap-2.5 whitespace-nowrap max-dapp:gap-2"
          href="#top"
          aria-label="AEGIS X home"
        >
          <img
            className="size-7 object-contain max-dapp:h-5.5 max-dapp:w-6"
            src={homeAssets.logoMark}
            alt=""
            width="28"
            height="27"
          />
          {/* Keep text-lg — brand token is 17px; header lock is 18px / H5 16px */}
          <Text
            as="span"
            variant="brand"
            className="text-lg max-dapp:text-base max-dapp:leading-[1.2]"
          >
            AEGIS X
          </Text>
        </a>
        <nav
          className="flex items-center gap-8 whitespace-nowrap max-tablet:hidden [&_a]:transition-[color,transform] [&_a]:duration-180 [&_a]:ease-out [&_a:hover]:-translate-y-px [&_a:hover]:text-foreground"
          aria-label={content.sectionsLabel}
        >
          {content.links.map((link) => (
            <Text
              as="a"
              href={link.href}
              key={link.href}
              variant="detail"
              tone="muted-foreground"
              className="text-sm font-medium"
            >
              {link.label}
            </Text>
          ))}
        </nav>
        <div className="flex items-center gap-3.5 max-dapp:w-auto max-dapp:justify-end max-dapp:gap-2.5">
          <Text
            as="a"
            className="inline-flex min-h-9.5 cursor-pointer items-center justify-center rounded-full border border-border bg-transparent px-4.5 text-sm leading-none font-semibold tracking-normal whitespace-nowrap transition-[box-shadow,border-color,background-color,opacity,color] duration-180 ease-out visited:text-foreground hover:border-coral-hover-border hover:text-foreground hover:opacity-[0.96] hover:shadow-card focus-visible:border-coral-hover-border focus-visible:text-foreground focus-visible:opacity-[0.96] focus-visible:shadow-card max-dapp:hidden!"
            href={notionLinks.whitepaper}
            rel="noopener noreferrer"
            target="_blank"
            variant="detail"
          >
            {content.whitepaper}
          </Text>
          <Button asChild className="w-auto" shape="pill" size="sm" variant="primary">
            <a href={appHref}>{content.enterApp}</a>
          </Button>
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
