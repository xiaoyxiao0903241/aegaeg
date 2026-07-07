import { useI18n } from '~/i18n/use-i18n'
import { DappTableEmptyState } from '~/app/shell/components/dapp-table-empty-state'
import { Text } from '~/shared/ui/text'
import { WalletConnectChip } from '~/app/wallet-connect-chip'
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
    <DappTableEmptyState
      className={cn(className)}
      embedded={embedded}
      showSkeleton={showSkeleton}
    >
      <div className="grid w-full gap-1.5 text-center">
        <Text
          as="p"
          variant="body"
          weight="semibold"
          className="m-0 leading-[1.2] tracking-[-0.3px]"
        >
          {t.dapp.connect.recordsTitle}
        </Text>
        <Text as="p" variant="label" tone="secondary" className="m-0 tracking-[-0.26px]">
          {body}
        </Text>
      </div>
      <WalletConnectChip variant="primary" />
    </DappTableEmptyState>
  )
}
