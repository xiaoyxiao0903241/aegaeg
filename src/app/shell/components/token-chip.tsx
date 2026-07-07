import { Text } from '~/shared/ui/text'
import { DappIcon } from '~/app/shell/components/dapp-icon'

export function TokenChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <DappIcon alt="" className="rounded-full" loading="lazy" size="token" src={icon} />
      <Text as="span" variant="value-sm">
        {label}
      </Text>
    </span>
  )
}
