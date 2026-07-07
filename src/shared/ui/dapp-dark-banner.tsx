import { tv } from 'tailwind-variants'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/** Dark banner layout + surface colors. Typography → call site `<Text>` + these slots as `className`. */
export const dappDarkBanner = tv({
  slots: {
    root: cn(revealClass(), 'relative overflow-hidden rounded-md bg-dark text-white shadow-card'),
    content: 'relative z-1 flex flex-col gap-2',
    kicker: '',
    title: 'text-white max-dapp:text-lg max-dapp:leading-[1.2] max-dapp:tracking-[-0.54px]',
    body: '',
    decoration: 'pointer-events-none absolute select-none',
  },
})
