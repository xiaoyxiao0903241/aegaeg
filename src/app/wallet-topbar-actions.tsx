import { useActiveAccount } from '~/views/dapp/web3/thirdweb-react'
import { tv } from 'tailwind-variants'
import { AnchoredTooltip } from '~/shared/ui/anchored-tooltip'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/app/bootstrap/use-auth'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { DappIcon } from '~/app/shell/dapp-icon'
import { dappAssets } from '~/app/assets'
import { WalletConnectChip } from '~/app/wallet-connect-chip'

const networkPill = tv({
  base: [
    // Figma H5/PC topbar net — h 36, white surface (226:199 / 12:*)
    'inline-flex h-9 min-h-9 cursor-default items-center justify-center gap-2 rounded-full border border-border bg-card px-3.5',
    'text-xs font-semibold leading-[1.2] shadow-none',
    'max-dapp:px-3 max-dapp:text-xs',
  ],
})

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
          <div className={networkPill()} aria-label={t.topbar.currentNetwork}>
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

  return <WalletConnectChip className="min-h-9" label={label} variant="primary" />
}
