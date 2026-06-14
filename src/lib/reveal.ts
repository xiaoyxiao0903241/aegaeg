import { cn } from '~/lib/utils'

/** Scroll-reveal: pair with DappRevealObserver `data-visible` attribute. */
export function revealClass(opts?: { delay?: boolean; className?: string }) {
  return cn(
    'translate-y-[22px] opacity-0 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
    opts?.delay && 'delay-100',
    'data-[visible=true]:translate-y-0 data-[visible=true]:opacity-100',
    opts?.className,
  )
}
