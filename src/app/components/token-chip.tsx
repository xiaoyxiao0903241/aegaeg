import { dappTextClass } from '../../components/primitive-styles'
import { cn } from '~/lib/utils'

export function TokenChip({ icon, label }: { icon: string; label: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', dappTextClass('tokenChip', { tone: 'ink' }))}>
      <img
        className="aspect-square w-6 flex-none object-contain"
        src={icon}
        alt=""
        width="24"
        height="24"
      />
      {label}
    </span>
  )
}
