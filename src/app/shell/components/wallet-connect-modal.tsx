import { useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ConnectEmbed, useActiveAccount } from '~/views/dapp/web3/thirdweb-react'
import { X } from 'lucide-react'
import { useI18n } from '~/i18n/use-i18n'
import { appMetadata, connectEmbedProps } from '~/views/dapp/web3/thirdweb'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'
import { dappIconClass } from '~/app/dapp-icon-scale'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/shared/ui/aegis-responsive-dialog'

const panelShellClass = cn(
  'border-0 bg-card',
  'max-dapp:rounded-t-lg max-dapp:px-5 max-dapp:pb-[max(1.5rem,env(safe-area-inset-bottom))] max-dapp:pt-3',
  'dapp:w-full dapp:max-w-md dapp:rounded-lg dapp:p-6',
  'dapp:shadow-[0_1.875rem_5rem_oklch(15%_0.02_270/35%)]',
)

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
      overlayClassName="bg-[oklch(13%_0.02_264/50%)] backdrop-blur-sm"
      className={panelShellClass}
    >
      <AegisSheetHandle />

      <div className="flex items-center justify-between max-dapp:px-0 dapp:mb-5">
        <DialogPrimitive.Title asChild>
          <Text as="h2" variant="title-xl" className="m-0">
            {t.wallet.connectTitle}
          </Text>
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className="aegis-wallet-connect-close"
          type="button"
        >
          <X aria-hidden className={dappIconClass.sm} strokeWidth={2} />
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
