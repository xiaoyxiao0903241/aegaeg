import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

export function ButtonLoadingIcon({ className }: { className?: string }) {
  return (
    <Loader2
      aria-hidden
      className={cn('size-4 shrink-0 animate-spin', className)}
      strokeWidth={2}
    />
  )
}
