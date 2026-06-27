import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/providers/auth-provider'
import { WalletConnectModal } from '~/app/components/wallet-connect-modal'
import { swapPromoCardPillActionClass } from '~/app/components/swap-promo-card'
import { useMobileViewport } from '~/hooks/use-mobile-viewport'

export function SwapPromoConnectButton() {
  const { messages: t } = useI18n()
  const { isLoggingIn } = useAuth()
  const [connectOpen, setConnectOpen] = useState(false)
  const variant = !useMobileViewport() ? 'desktop' : 'mobile'

  return (
    <>
      <button
        className={swapPromoCardPillActionClass(variant)}
        disabled={isLoggingIn}
        onClick={() => setConnectOpen(true)}
        type="button"
      >
        {isLoggingIn ? t.wallet.connecting : t.common.connectWallet}
      </button>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </>
  )
}
