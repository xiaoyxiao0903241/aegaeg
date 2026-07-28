import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/hooks/use-auth'
import { WalletConnectModal } from '~/app/shell/wallet-connect-modal'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import {
  ExchangePromoPillAction,
  exchangePromoLayoutFromViewport,
} from '~/views/dapp/exchange/exchange-promo-card'

export function ExchangePromoConnectButton() {
  const { messages: t } = useI18n()
  const { isLoggingIn } = useAuth()
  const [connectOpen, setConnectOpen] = useState(false)
  const isDesktop = !useMobileViewport()
  const layout = exchangePromoLayoutFromViewport(isDesktop)

  return (
    <>
      <ExchangePromoPillAction
        disabled={isLoggingIn}
        layout={layout}
        minConnectWidth
        onClick={() => setConnectOpen(true)}
      >
        {isLoggingIn ? t.wallet.connecting : t.common.connectWallet}
      </ExchangePromoPillAction>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </>
  )
}
