import { Text } from '~/shared/ui/text'
import { DappIcon } from '~/app/shell/dapp-icon'

export function TokenChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <DappIcon alt="" className="rounded-full" loading="lazy" size="token" src={icon} />
      <Text as="span" variant="detail" className="font-semibold leading-[1.2]">
        {label}
      </Text>
    </span>
  )
}
