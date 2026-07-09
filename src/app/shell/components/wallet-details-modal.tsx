import { useState } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Wallet, X } from 'lucide-react'
import { useActiveAccount, useActiveWallet, useDisconnect } from '~/views/dapp/web3/thirdweb-react'
import { formatTokenAmount } from '~/core/swap/token-amount'
import { useUsd1PresaleWalletQuery } from '~/hooks/queries/use-presale-queries'
import { useI18n } from '~/i18n/use-i18n'
import { useAuth } from '~/app/bootstrap/auth-provider'
import { hasWalletAccount } from '~/views/dapp/web3/wallet-connection-state'
import { dappAssets } from '~/app/assets'
import { DappIcon } from '~/app/shell/components/dapp-icon'
import { formatAddress } from '~/app/utils'
import { Button } from '~/shared/ui/button'
import { Text } from '~/shared/ui/text'
import { toast } from 'sonner'
import { copyTextToClipboard } from '~/shared/lib/copy-to-clipboard'
import { cn } from '~/shared/lib/utils'
import {
  AegisDialogClose,
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'
import { WalletConnectModal } from '~/app/shell/components/wallet-connect-modal'

const USD1_DECIMALS = 18

/**
 * Wallet details / disconnect modal — Figma `4040:5234`.
 * Address + USD1 balance + Copy / Disconnect. No token list rows.
 */
export function WalletDetailsModal({
  onOpenChange,
  open,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const account = useActiveAccount()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { clearAuthOnDisconnect } = useAuth()
  const { messages: t } = useI18n()
  const [copied, setCopied] = useState(false)
  const [connectOpen, setConnectOpen] = useState(false)
  const walletAddress = account?.address
  const walletReady = hasWalletAccount(account)
  const { balanceQuery, usd1Balance } = useUsd1PresaleWalletQuery(
    open ? walletAddress : undefined,
  )

  const handleOpenChange = (next: boolean) => {
    if (!next) setCopied(false)
    onOpenChange(next)
  }

  if (!walletAddress) {
    return null
  }

  const addressLabel = formatAddress(walletAddress)
  const balanceValue = balanceQuery.isPending
    ? '…'
    : balanceQuery.isError
      ? '—'
      : formatTokenAmount(usd1Balance, USD1_DECIMALS, 2)

  async function handleCopy() {
    if (!walletAddress) return
    const result = await copyTextToClipboard(walletAddress)
    if (result === 'skipped') return
    if (result === 'failed') {
      toast.error(t.wallet.copyFailed)
      return
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  async function handleDisconnect() {
    // Close first so Radix can play data-state=closed exit animation (same as connect modal).
    // Teardown after the longest sheet/modal out duration in animations.css.
    onOpenChange(false)
    window.setTimeout(() => {
      void (async () => {
        if (wallet) {
          await disconnect(wallet)
        }
        clearAuthOnDisconnect()
      })()
    }, 280)
  }

  return (
    <AegisResponsiveDialog
      onOpenChange={handleOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay backdrop-blur-sm"
      className={cn(
        // PC centered card (Figma 4040:5234) — same responsive shell as slippage / connect
        'border-0 bg-card text-center shadow-modal-panel',
        'w-full max-w-(--dapp-wallet-modal-max-width) p-6',
        'dapp:rounded-2xl',
        // H5 bottom sheet — full bleed, top radius only
        'max-dapp:max-w-none max-dapp:w-full',
        'max-dapp:rounded-t-2xl max-dapp:rounded-b-none',
        'max-dapp:border-x-0 max-dapp:border-b-0 max-dapp:border-t max-dapp:border-border',
        'max-dapp:px-6 max-dapp:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-dapp:pt-3',
      )}
    >
      <AegisSheetHandle />

      <div className="relative flex w-full shrink-0 items-start justify-end">
        <AegisDialogClose aria-label={t.common.close}>
          <X aria-hidden className="size-3.5 shrink-0" strokeWidth={2} />
        </AegisDialogClose>
      </div>

      <div
        aria-hidden="true"
        className="mx-auto mt-1.5 mb-5 grid size-(--dapp-wallet-modal-orb-size) shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-primary-orb"
      >
        <Wallet
          className="size-(--dapp-wallet-modal-orb-icon) shrink-0"
          strokeWidth={1.75}
        />
      </div>

      <DialogPrimitive.Title asChild>
        <Text as="h2" variant="panel" className="m-0 tracking-[0.01em]">
          {addressLabel}
        </Text>
      </DialogPrimitive.Title>

      {!walletReady ? (
        <Text as="p" variant="copy" tone="primary" className="m-0 mt-3">
          {t.wallet.reconnectHint}
        </Text>
      ) : (
        <div className="mt-3 mb-6 flex items-baseline justify-center gap-1">
          <Text
            as="span"
            variant="figure"
            className="text-(length:--dapp-wallet-modal-balance-size) leading-none tracking-[-0.02em] text-coral"
          >
            {balanceValue}
          </Text>
          <Text
            as="span"
            variant="copy"
            className="text-(length:--dapp-wallet-modal-unit-size) leading-none font-semibold tracking-[-0.02em] text-black/40"
          >
            USD1
          </Text>
        </div>
      )}

      <div className={cn('grid gap-2.5', walletReady && 'mt-0', !walletReady && 'mt-6')}>
        {!walletReady ? (
          <>
            <Button
              onClick={() => setConnectOpen(true)}
              size="md"
              type="button"
              variant="primary"
            >
              {t.wallet.reconnectWallet}
            </Button>
            <Button
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              {t.wallet.disconnect}
            </Button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              className="gap-2"
              onClick={() => void handleCopy()}
              size="md"
              type="button"
              variant="primary"
            >
              <DappIcon
                alt=""
                aria-hidden="true"
                size="action"
                src={copied ? dappAssets.check : dappAssets.copyWhite}
              />
              {copied ? t.wallet.copied : t.wallet.copyAddress}
            </Button>
            <Button
              onClick={() => void handleDisconnect()}
              size="md"
              type="button"
              variant="secondary"
            >
              {t.wallet.disconnect}
            </Button>
          </div>
        )}
      </div>
      <WalletConnectModal onOpenChange={setConnectOpen} open={connectOpen} />
    </AegisResponsiveDialog>
  )
}
