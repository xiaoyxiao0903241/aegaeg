import { tv } from 'tailwind-variants'

import { dappAssets, homeAssets } from '~/app/assets'
import { OnboardingTourChip } from '~/app/shell/onboarding-tour-chip'
import { useDappShell } from '~/app/use-dapp-shell'
import { WalletTopbarActions } from '~/app/wallet-topbar-actions'
import { languageMenuOptions } from '~/i18n/language-menu-options'
import { withLocalePrefix } from '~/i18n/locale'
import { useI18n } from '~/i18n/use-i18n'
import { dappIcon } from '~/shared/components/dapp-icon-scale'
import { LanguageMenu } from '~/shared/components/language-menu'
import { Text } from '~/shared/components/text'

const topbar = tv({
  slots: {
    root: [
      'relative flex w-full shrink-0 items-center justify-between gap-6 bg-transparent px-6 py-4',
      'max-dapp:sticky max-dapp:top-0 max-dapp:z-20',
      'max-dapp:gap-3 max-dapp:px-4 max-dapp:pb-4',
      'max-dapp:pt-[max(1rem,env(safe-area-inset-top,0px))]',
      'max-dapp:border-b max-dapp:border-border/40',
      'max-dapp:bg-background/30 max-dapp:backdrop-blur-[1.125rem] max-dapp:backdrop-saturate-150',
    ],
    brand: 'flex items-center gap-2.5',
    brandMark: [
      'object-contain',
      dappIcon({ size: 'brand' }),
      'max-dapp:size-(--dapp-icon-lg) max-dapp:w-(--dapp-icon-lg)',
    ],
    actions: [
      'flex items-center gap-3',
      'max-dapp:min-w-0 max-dapp:flex-1 max-dapp:justify-end max-dapp:gap-2',
    ],
  },
  variants: {
    hideBrandLabel: {
      true: {
        brand: 'max-dapp:[&_span]:hidden',
      },
      false: {
        brand: '',
      },
    },
  },
  defaultVariants: {
    hideBrandLabel: false,
  },
})

export function DappTopbar({
  onboardingDone,
  onStartOnboarding,
}: {
  onboardingDone?: boolean
  onStartOnboarding?: () => void
}) {
  const { locale, messages: t, setLocale } = useI18n()
  const { sessionReady, tab } = useDappShell()
  const styles = topbar({ hideBrandLabel: sessionReady })

  const languageOptions = languageMenuOptions(locale, setLocale)

  return (
    <header className={styles.root()}>
      <a
        className={styles.brand()}
        href={withLocalePrefix(locale, '/')}
        aria-label="AEGIS X home"
        data-tab={tab}
      >
        <img className={styles.brandMark()} src={homeAssets.logoMark} alt="" />
        <Text as="span" variant="brand" className="text-lg/7 tracking-tight">
          {t.common.brand}
        </Text>
      </a>
      <div className={styles.actions()}>
        {onStartOnboarding ? (
          <OnboardingTourChip
            done={Boolean(onboardingDone)}
            label={t.onboarding.chip}
            onClick={onStartOnboarding}
          />
        ) : null}
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
