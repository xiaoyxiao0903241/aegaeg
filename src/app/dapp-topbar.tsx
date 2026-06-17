import { cn } from '~/lib/utils'
import { LanguageMenu } from '~/components/language-menu'
import { withLocalePrefix } from '~/i18n/locale'
import { allLanguageOptions } from '~/i18n/locales'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets, dappAssets } from '~/app/assets'
import { WalletTopbarActions } from '~/app/wallet-topbar-actions'
import { useDappShell } from '~/app/dapp-shell-context'

const topbarClass = cn(
  'relative flex shrink-0 min-h-[76px] w-full items-center justify-between gap-6 bg-transparent px-[26px] py-[18px]',
  'max-[820px]:sticky max-[820px]:top-0 max-[820px]:z-20',
  'max-[820px]:min-h-[60px] max-[820px]:gap-3 max-[820px]:px-4 max-[820px]:py-3',
  'max-[820px]:pt-[max(12px,env(safe-area-inset-top,0px))]',
  // H5 毛玻璃顶栏：透出页面蜜桃渐变，滚动时模糊下方内容
  'max-[820px]:border-b max-[820px]:border-border/40',
  'max-[820px]:bg-background/30 max-[820px]:backdrop-blur-[18px] max-[820px]:backdrop-saturate-150',
)

const brandClass = cn(
  'flex items-center gap-2.5 text-[17px] font-semibold tracking-[-0.34px] text-foreground',
  'max-[820px]:text-[15px]',
  'group-data-[tab=rewards]/shell:max-[820px]:group-data-[connected=true]/shell:[&_span]:hidden',
)

const brandMarkClass = cn(
  'h-6 w-[26px] object-contain',
  'max-[820px]:h-[22px] max-[820px]:w-6',
)

const topActionsClass = cn(
  'flex items-center gap-3',
  'max-[820px]:min-w-0 max-[820px]:flex-1 max-[820px]:justify-end max-[820px]:gap-2',
)

export function DappTopbar() {
  const { locale, messages: t, setLocale } = useI18n()
  const { connected, tab } = useDappShell()

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
          connected && tab === 'rewards' && 'max-[820px]:[&_span]:hidden',
          connected && 'max-[820px]:[&_span]:hidden',
        )}
        href={withLocalePrefix(locale, '/')}
        aria-label="AEGIS X home"
      >
        <img
          className={brandMarkClass}
          src={homeAssets.logoMark}
          alt=""
          width="28"
          height="27"
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
