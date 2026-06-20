import { useActiveAccount } from 'thirdweb/react'
import { cn } from '~/lib/utils'
import { AnchoredTooltip } from '~/components/anchored-tooltip'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/providers/auth-provider'
import { hasWalletAccount } from '~/lib/web3/wallet-connection-state'
import { DappIcon } from '~/app/components/dapp-icon'
import { dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'

const networkPillClass = cn(
  'inline-flex h-9 min-h-9 cursor-default items-center justify-center gap-2 rounded-full border border-border bg-background px-3.5',
  'text-xs font-semibold leading-[1.2] tracking-[-0.26px] shadow-none',
  'max-dapp:h-7.5 max-dapp:min-h-7.5 max-dapp:px-3 max-dapp:text-xs',
)

export function WalletTopbarActions() {
  const account = useActiveAccount()
  const { isAuthenticated, needsSignIn, isLoggingIn } = useAuth()
  const { messages: t } = useI18n()
  const walletReady = hasWalletAccount(account)
  const fullyConnected = walletReady && isAuthenticated

  if (fullyConnected) {
    return (
      <>
        <AnchoredTooltip content={t.nav.bscTooltip} position="bottom">
          <div className={networkPillClass} aria-label={t.topbar.currentNetwork}>
            <DappIcon
              alt=""
              className="rounded-full"
              size="lg"
              src={dappAssets.bsc}
            />
            {t.common.bsc}
          </div>
        </AnchoredTooltip>
        <WalletConnectChip variant="connected" />
      </>
    )
  }

  const label = needsSignIn
    ? isLoggingIn
      ? t.wallet.connecting
      : t.wallet.signInRequired
    : t.common.connectWallet

  return <WalletConnectChip label={label} variant="primary" />
}
