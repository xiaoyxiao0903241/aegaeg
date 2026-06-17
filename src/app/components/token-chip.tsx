import { Text } from '~/components/text'
import { cn } from '~/lib/utils'

export function TokenChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img alt="" className="size-6 rounded-full" height="24" loading="lazy" src={icon} width="24" />
      <Text as="span" size="sm" weight="semibold" className="text-[14px] leading-[1.2] tracking-[-0.28px]">
        {label}
      </Text>
    </span>
  )
}
