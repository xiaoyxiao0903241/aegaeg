import { cn } from '~/lib/utils'

/** Dense rays + soft center hub — shared by home hero and DApp shell. */
const heroRaysFillClass =
  '[background:radial-gradient(circle_at_50%_50%,oklch(42%_0.025_260_/_6%)_0%,oklch(40%_0.02_260_/_2.5%)_32%,transparent_58%),repeating-conic-gradient(from_0deg,oklch(40%_0.02_260_/_8%)_0deg_0.2deg,transparent_0.2deg_2.5deg)]'

/** Home — solid through 90% radius; outer 10% fades out. */
const heroRaysHomeMaskClass =
  '[mask-image:radial-gradient(circle,black_0%,black_90%,transparent_100%)]'

/** DApp — full strength through mid-radius, then fade to 0% at corners. */
const heroRaysShellMaskClass =
  '[mask-image:radial-gradient(circle,black_0%,black_50%,transparent_100%)]'

const heroRaysVisualClass = cn(
  'pointer-events-none aspect-square origin-center',
  heroRaysFillClass,
  'max-dapp:hidden',
)

/** Homepage hero — fixed square; mask fade sits inside the hero clip. */
export const heroRaysHomeClass = cn(
  heroRaysVisualClass,
  heroRaysHomeMaskClass,
  'absolute [animation:hero-rays-drift_48s_linear_infinite]',
  'left-[calc(50%-358px)] top-[-477px] w-[1500px] opacity-[0.55]',
)

/**
 * DApp — viewport-centered circle; radius = center → corner (hypot of vw/vh).
 * Radial mask fades to fully transparent at the perimeter.
 */
export const heroRaysShellClass = cn(
  heroRaysVisualClass,
  heroRaysShellMaskClass,
  'fixed left-1/2 top-1/2 z-0 size-[hypot(100vw,100vh)] opacity-[0.55]',
  '[animation:dapp-rays-spin_48s_linear_infinite]',
)

export function HeroRaysBackground({ className }: { className?: string }) {
  return <div aria-hidden="true" className={className} />
}
