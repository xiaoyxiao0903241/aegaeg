import { useState } from 'react'
import { useActiveAccount } from 'thirdweb/react'
import { useI18n } from '../i18n/use-i18n'
import { formatAddress } from './utils'
import { cn } from '~/lib/utils'
import { WalletDetailsModal } from './components/wallet-details-modal'
import { WalletConnectModal } from './components/wallet-connect-modal'

const walletLabelClass = 'inline-flex min-w-0 items-center gap-1.5'

const walletGlyphClass = cn(
  'relative aspect-[16/13] w-4 shrink-0 rounded border-[1.5px] border-primary',
  'after:absolute after:right-0.5 after:top-[3px] after:aspect-square after:w-[5px] after:rounded-full after:bg-primary after:content-[""]',
)

function ConnectedWalletChip() {
  const account = useActiveAccount()
  const [menuOpen, setMenuOpen] = useState(false)

  if (!account) {
    return null
  }

  const addressLabel = formatAddress(account.address)

  return (
    <>
      <button
        className="aegis-connected-wallet-chip"
        onClick={() => setMenuOpen(true)}
        type="button"
      >
        <span className="aegis-connected-wallet-chip__status" aria-hidden="true" />
        <span className="truncate">{addressLabel}</span>
      </button>
      <WalletDetailsModal onOpenChange={setMenuOpen} open={menuOpen} />
    </>
  )
}

export function WalletConnectChip({
  label,
  variant = 'pill',
}: {
  label?: string
  variant?: 'pill' | 'primary' | 'inline' | 'connected'
}) {
  if (variant === 'connected') {
    return <ConnectedWalletChip />
  }

  const { messages: t } = useI18n()
  const [connectOpen, setConnectOpen] = useState(false)
  const connectLabel = label ?? t.common.connectWallet

  const connectButtonClassName =
    variant === 'primary'
      ? 'aegis-thirdweb-button aegis-thirdweb-button-primary'
      : variant === 'inline'
        ? 'aegis-thirdweb-button aegis-thirdweb-button-inline'
        : 'aegis-thirdweb-button'

  return (
    <div className="inline-flex items-center">
      <button
        className={connectButtonClassName}
        onClick={() => setConnectOpen(true)}
        type="button"
      >
        <span className={walletLabelClass}>
          {variant !== 'primary' ? (
            <span className={walletGlyphClass} aria-hidden="true" />
          ) : null}
          {connectLabel}
        </span>
      </button>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </div>
  )
}
