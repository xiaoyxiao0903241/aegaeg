import { useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ConnectEmbed, useActiveAccount } from '~/views/dapp/web3/thirdweb-react'
import { X } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { useI18n } from '~/i18n/use-i18n'
import { appMetadata, connectEmbedProps } from '~/views/dapp/web3/thirdweb'
import { Text } from '~/shared/ui/text'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'

const walletConnectPanel = tv({
  base: [
    'border-0 bg-card',
    'max-dapp:rounded-t-lg max-dapp:px-5 max-dapp:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-dapp:pt-3',
    'dapp:w-full dapp:max-w-md dapp:rounded-lg dapp:p-6',
    'dapp:shadow-modal-panel',
  ],
})

export function WalletConnectModal({
  onOpenChange,
  open,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const account = useActiveAccount()
  const { messages: t } = useI18n()

  useEffect(() => {
    if (account && open) {
      onOpenChange(false)
    }
  }, [account, onOpenChange, open])

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-strong backdrop-blur-sm"
      className={walletConnectPanel()}
    >
      <AegisSheetHandle />

      <div className="flex items-center justify-between max-dapp:px-0 dapp:mb-5">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="panel" className="m-0">
            {t.wallet.connectTitle}
          </Text>
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className="aegis-wallet-connect-close"
          type="button"
        >
          <X aria-hidden className={dappIcon({ size: 'sm' })} strokeWidth={2} />
        </DialogPrimitive.Close>
      </div>

      <div className="aegis-wallet-connect-body">
        <div className="aegis-connect-embed">
          <ConnectEmbed
            {...connectEmbedProps}
            appMetadata={appMetadata}
            onConnect={() => onOpenChange(false)}
          />
        </div>
      </div>
    </AegisResponsiveDialog>
  )
}
