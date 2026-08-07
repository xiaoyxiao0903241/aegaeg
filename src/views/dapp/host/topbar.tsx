import { CircleAlert, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { tv } from 'tailwind-variants'

import { useAuth } from '~/hooks/use-auth'
import { useDappHost } from '~/hooks/use-dapp-host'
import { languageMenuOptions, useI18n, withLocalePrefix } from '~/i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { homeAssets } from '~/shared/assets/home'
import { Icon, iconVariants } from '~/shared/components/icon'
import { LanguageMenu } from '~/shared/components/language-menu'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { OnboardingTourChip } from '~/views/dapp/host/primitives'
import { WalletConnectChip } from '~/views/dapp/host/wallet/wallet-connect-chip'
import { defaultChain } from '~/web3/thirdweb'
import { useActiveAccount, useSwitchActiveWalletChain } from '~/web3/thirdweb-react'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { hasWalletAccount } from '~/web3/wallet/wallet-connection-state'

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
      iconVariants({ size: 'brand' }),
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

const networkPill = tv({
  base: [
    // 网络胶囊：PC 与 H5 通用，圆角高度 36；字号走 Text / 本处 text-xs，禁 max-dapp:text-*
    'inline-flex h-9 min-h-9 max-w-full items-center justify-center gap-2 rounded-full border px-3.5',
    'text-xs leading-[1.2] font-semibold',
    'max-dapp:px-3',
  ],
  variants: {
    tone: {
      ok: 'cursor-default border-border bg-card text-foreground shadow-none',
      wrong: [
        'cursor-pointer border-destructive/30 bg-destructive/10 text-destructive',
        'transition-transform duration-150',
        'hover:bg-destructive/14 active:scale-[0.98]',
        'focus-visible:ring-2 focus-visible:ring-destructive/40 focus-visible:outline-none',
        'disabled:pointer-events-none disabled:active:scale-100',
        'network-pill-wrong-breathe',
      ],
    },
  },
  defaultVariants: {
    tone: 'ok',
  },
})

/** 顶部栏钱包区：会话就绪时网络胶囊 + 已连接入口，否则连接 / 登录。 */
function WalletTopbarActions() {
  const account = useActiveAccount()
  const { sessionReady, needsSignIn, isLoggingIn } = useAuth()
  const { messages: t } = useI18n()
  const { writeReady } = useWriteReadiness()
  const switchChain = useSwitchActiveWalletChain()
  const [switching, setSwitching] = useState(false)
  const walletReady = hasWalletAccount(account)
  const fullyConnected = walletReady && sessionReady

  if (fullyConnected) {
    const onExpectedChain = writeReady

    async function handleSwitchToBsc() {
      if (onExpectedChain || switching) return
      setSwitching(true)
      try {
        await switchChain(defaultChain)
      } catch {
        toast.error(t.topbar.switchNetworkFailed)
      } finally {
        setSwitching(false)
      }
    }

    const pill = onExpectedChain ? (
      <div className={networkPill({ tone: 'ok' })} aria-label={t.topbar.currentNetwork}>
        <Icon alt="" className="rounded-full" size="lg" src={dappAssets.bsc} />
        <Text as="span" variant="caption" className="truncate font-semibold">
          {t.common.bsc}
        </Text>
      </div>
    ) : (
      <button
        type="button"
        className={networkPill({ tone: 'wrong' })}
        aria-label={t.topbar.switchToBsc}
        disabled={switching}
        onClick={() => {
          void handleSwitchToBsc()
        }}
      >
        {switching ? (
          <Loader2 aria-hidden className="size-4 shrink-0 animate-spin" strokeWidth={2} />
        ) : (
          <CircleAlert aria-hidden className="size-4 shrink-0" strokeWidth={2} />
        )}
        <Text as="span" variant="caption" className="truncate font-semibold text-destructive">
          {t.topbar.switchToBsc}
        </Text>
      </button>
    )

    return (
      <>
        <Tooltip
          content={onExpectedChain ? t.nav.bscTooltip : t.topbar.wrongNetworkTooltip}
          position="bottom"
        >
          {pill}
        </Tooltip>
        <WalletConnectChip variant="connected" />
      </>
    )
  }

  const label = needsSignIn
    ? isLoggingIn
      ? t.wallet.connecting
      : t.wallet.signInRequired
    : t.common.connectWallet

  return <WalletConnectChip className="min-h-9" label={label} variant="primary" />
}

/**
 * DApp 顶部栏
 *
 * 左侧品牌标识（连接后隐藏品牌文字），右侧依次为新手教程入口、
 * 钱包连接区与语言切换；H5 下吸顶并带半透明毛玻璃底色。
 */
export function Topbar({
  onboardingDone,
  onStartOnboarding,
}: {
  onboardingDone?: boolean
  onStartOnboarding?: () => void
}) {
  const { locale, messages: t, setLocale } = useI18n()
  const { sessionReady, tab } = useDappHost()
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
