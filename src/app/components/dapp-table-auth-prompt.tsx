import { useI18n } from '~/i18n/use-i18n'
import { DappTableEmptyState } from '~/app/components/dapp-table-empty-state'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { cn } from '~/lib/utils'

export function DappTableAuthPrompt({
  body,
  className,
  embedded = false,
  showSkeleton = true,
}: {
  body: string
  className?: string
  embedded?: boolean
  showSkeleton?: boolean
}) {
  const { messages: t } = useI18n()

  return (
    <DappTableEmptyState
      className={cn(className)}
      embedded={embedded}
      showSkeleton={showSkeleton}
    >
      <div className="grid w-full gap-1.5 text-center">
        <p className="m-0 text-sm font-semibold leading-[1.2] tracking-[-0.3px] text-foreground">
          {t.dapp.connect.recordsTitle}
        </p>
        <p className="m-0 text-xs leading-normal tracking-[-0.26px] text-muted-foreground">
          {body}
        </p>
      </div>
      <WalletConnectChip variant="primary" />
    </DappTableEmptyState>
  )
}
