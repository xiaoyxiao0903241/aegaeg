import { dappIconClass } from '~/app/dapp-icon-scale'
import { cn } from '~/lib/utils'
import { LanguageMenu } from '~/components/language-menu'
import { withLocalePrefix } from '~/i18n/locale'
import { allLanguageOptions } from '~/i18n/locales'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletTopbarActions } from '~/app/wallet-topbar-actions'
import { useDappShell } from '~/app/dapp-shell-context'

const topbarClass = cn(
  'relative flex shrink-0 w-full items-center justify-between gap-6 bg-transparent px-6 py-4',
  'max-dapp:sticky max-dapp:top-0 max-dapp:z-20',
  'max-dapp:gap-3 max-dapp:px-4 max-dapp:pb-4',
  'max-dapp:pt-[max(1rem,env(safe-area-inset-top,0px))]',
  // H5 毛玻璃顶栏：透出页面蜜桃渐变，滚动时模糊下方内容
  'max-dapp:border-b max-dapp:border-border/40',
  'max-dapp:bg-background/30 max-dapp:backdrop-blur-[18px] max-dapp:backdrop-saturate-150',
)

const brandClass = cn(
  'flex items-center gap-2.5 text-lg font-semibold tracking-tight text-foreground max-dapp:text-base',
  'group-data-[tab=rewards]/shell:max-dapp:group-data-[session-ready=true]/shell:[&_span]:hidden',
)

const brandMarkClass = cn(
  'object-contain',
  dappIconClass.brand,
  'max-dapp:size-[var(--dapp-icon-lg)] max-dapp:w-[var(--dapp-icon-lg)]',
)

const topActionsClass = cn(
  'flex items-center gap-3',
  'max-dapp:min-w-0 max-dapp:flex-1 max-dapp:justify-end max-dapp:gap-2',
)

export function DappTopbar() {
  const { locale, messages: t, setLocale } = useI18n()
  const { sessionReady, tab } = useDappShell()

  const languageOptions = allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === locale,
    onSelect: () => setLocale(option.locale),
  }))

  return (
    <header className={topbarClass}>
      <a
        className={cn(
          brandClass,
          sessionReady && tab === 'rewards' && 'max-dapp:[&_span]:hidden',
          sessionReady && 'max-dapp:[&_span]:hidden',
        )}
        href={withLocalePrefix(locale, '/')}
        aria-label="AEGIS X home"
      >
        <img
          className={brandMarkClass}
          src={homeAssets.logoMark}
          alt=""
        />
        <span>{t.common.brand}</span>
      </a>
      <div className={topActionsClass}>
        <WalletTopbarActions />
        <LanguageMenu
          checkIcon={dappAssets.check}
          globeIcon={dappAssets.globe}
          label={t.common.language}
          options={languageOptions}
        />
      </div>
    </header>
  )
}
