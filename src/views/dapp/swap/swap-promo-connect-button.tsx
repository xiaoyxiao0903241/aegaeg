import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/app/bootstrap/use-auth'
import { WalletConnectModal } from '~/app/shell/components/wallet-connect-modal'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import {
  SwapPromoPillAction,
  swapPromoLayoutFromViewport,
} from '~/views/dapp/swap/swap-promo-card'

export function SwapPromoConnectButton() {
  const { messages: t } = useI18n()
  const { isLoggingIn } = useAuth()
  const [connectOpen, setConnectOpen] = useState(false)
  const isDesktop = !useMobileViewport()
  const layout = swapPromoLayoutFromViewport(isDesktop)

  return (
    <>
      <SwapPromoPillAction
        disabled={isLoggingIn}
        layout={layout}
        minConnectWidth
        onClick={() => setConnectOpen(true)}
      >
        {isLoggingIn ? t.wallet.connecting : t.common.connectWallet}
      </SwapPromoPillAction>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </>
  )
}
