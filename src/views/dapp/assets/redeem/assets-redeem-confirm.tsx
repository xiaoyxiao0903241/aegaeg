import * as DialogPrimitive from '@radix-ui/react-dialog'

import { DappActionButton } from '~/app/shell/dapp-action-button'
import { useI18n } from '~/i18n/use-i18n'
import { cn } from '~/shared/lib/utils'
import { AegisResponsiveDialog, AegisSheetHandle } from '~/shared/ui/aegis-responsive-dialog'
import { Text } from '~/shared/ui/text'

/** H5 redeem confirmation — Figma `4824:412`; PRV narrative (not instant wallet credit). */
export function AssetsRedeemConfirm({
  busy,
  onConfirm,
  onOpenChange,
  open,
}: {
  open: boolean
  busy: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  const { messages: t } = useI18n()

  return (
    <AegisResponsiveDialog
      onOpenChange={onOpenChange}
      open={open}
      overlayClassName="bg-modal-overlay-dim"
      className={cn(
        'border-0 bg-card',
        'w-full max-w-md max-dapp:w-full',
        'max-dapp:rounded-t-lg max-dapp:px-4 max-dapp:pt-3 max-dapp:pb-[max(1.25rem,env(safe-area-inset-bottom))]',
        'dapp:rounded-lg dapp:p-6',
        'dapp:shadow-modal-panel',
      )}
    >
      <AegisSheetHandle />
      <DialogPrimitive.Title asChild>
        <Text as="h2" variant="panel" className="m-0 pb-3">
          {t.assets.redeem.title}
        </Text>
      </DialogPrimitive.Title>
      <Text as="p" tone="muted-foreground" variant="copy">
        {t.assets.redeem.body}
      </Text>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <DappActionButton density="modal" onClick={() => onOpenChange(false)} variant="secondary">
          {t.assets.redeem.cancel}
        </DappActionButton>
        <DappActionButton density="modal" loading={busy} onClick={onConfirm}>
          {t.assets.redeem.confirm}
        </DappActionButton>
      </div>
    </AegisResponsiveDialog>
  )
}
