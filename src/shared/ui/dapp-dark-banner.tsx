import { tv } from 'tailwind-variants'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/** Dark banner layout + surface colors. Typography → call site `<Text>` + these slots as `className`.
 * SSOT for RewardsHero / GenesisGlobal — not Card `inverse` (E3 / WidgetPromoCard). Elevation = `shadow-card`. */
export const dappDarkBanner = tv({
  slots: {
    root: cn(revealClass(), 'relative overflow-hidden rounded-md bg-dark text-white shadow-card'),
    content: 'relative z-1 flex flex-col gap-2',
    kicker: '',
    title: '',
    body: '',
    decoration: 'pointer-events-none absolute select-none',
  },
})
