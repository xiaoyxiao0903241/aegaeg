import { cn } from '~/lib/utils'

/** Scroll-reveal：默认可见，boot 后仅对未进入视口的块淡出；见 home-motion.css */
export function revealClass(opts?: { delay?: boolean; className?: string }) {
  return cn(
    'transition-opacity duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)]',
    opts?.delay && 'delay-100',
    'data-[visible=true]:opacity-100',
    opts?.className,
  )
}
