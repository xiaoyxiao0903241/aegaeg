import { useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { ConnectEmbed, useActiveAccount } from 'thirdweb/react'
import { X } from 'lucide-react'
import { useI18n } from '~/i18n/use-i18n'
import { homeAssets } from '~/app/assets'
import { appMetadata, connectEmbedProps } from '~/web3/thirdweb'
import { cn } from '~/lib/utils'
import {
  AegisResponsiveDialog,
  AegisSheetHandle,
} from '~/components/aegis-responsive-dialog'

const panelShellClass = cn(
  'border-0 bg-card',
  'max-[820px]:rounded-t-[24px] max-[820px]:px-5 max-[820px]:pb-[max(24px,env(safe-area-inset-bottom))] max-[820px]:pt-3',
  'min-[821px]:w-[min(calc(100%-40px),430px)] min-[821px]:rounded-[24px] min-[821px]:p-[26px]',
  'min-[821px]:shadow-[0_30px_80px_oklch(15%_0.02_270/35%)]',
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

      <div className="flex items-center justify-between max-[820px]:px-0 min-[821px]:mb-5">
        <DialogPrimitive.Title className="m-0 text-[21px] font-semibold leading-[1.3] tracking-[-0.63px] text-foreground">
          {t.wallet.connectTitle}
        </DialogPrimitive.Title>
        <DialogPrimitive.Close
          aria-label={t.common.close}
          className="aegis-wallet-connect-close"
          type="button"
        >
          <X aria-hidden className="size-3.5" strokeWidth={2} />
        </DialogPrimitive.Close>
      </div>

      <div className="aegis-wallet-connect-body">
        <div className="aegis-wallet-connect-intro">
          <img
            alt=""
            className="h-[34px] w-auto shrink-0"
            height="34"
            src={homeAssets.logoMark}
          />
          <div className="min-w-0">
            <p className="m-0 text-sm font-semibold leading-[1.35] text-foreground">
              {t.wallet.connectIntroTitle}
            </p>
            <p className="m-0 mt-[3px] text-[13px] leading-[1.4] text-muted-foreground">
              <a
                className="font-semibold text-primary transition-opacity duration-180 hover:opacity-80"
                href="/app#swap"
              >
                {t.wallet.connectIntroLink}
              </a>
            </p>
          </div>
        </div>

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
