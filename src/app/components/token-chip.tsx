import { Text } from '~/components/text'
import { DappIcon } from '~/app/components/dapp-icon'

export function TokenChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <DappIcon alt="" className="rounded-full" loading="lazy" size="token" src={icon} />
      <Text as="span" size="sm" weight="semibold" className="text-sm leading-[1.2] tracking-[-0.28px]">
        {label}
      </Text>
    </span>
  )
}
