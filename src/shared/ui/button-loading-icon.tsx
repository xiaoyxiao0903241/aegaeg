import { Loader2 } from 'lucide-react'
import { cn } from '~/shared/lib/utils'

export function ButtonLoadingIcon({ className }: { className?: string }) {
  return (
    <Loader2
      aria-hidden
      className={cn('size-4 shrink-0 animate-spin', className)}
      strokeWidth={2}
    />
  )
}
