import { DappTableEmptyState } from '~/app/shell/dapp-table-empty-state'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
import { useI18n } from '~/i18n/use-i18n'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

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
    <DappTableEmptyState className={cn(className)} embedded={embedded} showSkeleton={showSkeleton}>
      <div className="grid w-full gap-1.5 text-center">
        <Text as="p" variant="headline" className="m-0 text-sm leading-[1.2] tracking-[-0.02em]">
          {t.dapp.connect.recordsTitle}
        </Text>
        <Text as="p" variant="support" tone="muted-foreground" className="m-0">
          {body}
        </Text>
      </div>
      <WalletConnectChip variant="primary" />
    </DappTableEmptyState>
  )
}
