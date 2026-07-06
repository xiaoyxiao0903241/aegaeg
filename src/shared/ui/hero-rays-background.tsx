import { useId } from 'react'
import { cn } from '~/lib/utils'

/** Matches original CSS: `repeating-conic-gradient(... 0deg 0.2deg, transparent 0.2deg 2.5deg)`. */
const RAY_SPACING_DEG = 2.5
const RAY_WIDTH_DEG = 0.2
const RAY_COUNT = 360 / RAY_SPACING_DEG
const CENTER = 50
const RADIUS = 50

function polarPoint(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  }
}

function buildRayWedgePath(index: number) {
  const startDeg = index * RAY_SPACING_DEG
  const endDeg = startDeg + RAY_WIDTH_DEG
  const outerStart = polarPoint(CENTER, CENTER, RADIUS, startDeg)
  const outerEnd = polarPoint(CENTER, CENTER, RADIUS, endDeg)

  return `M ${CENTER} ${CENTER} L ${outerStart.x} ${outerStart.y} A ${RADIUS} ${RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y} Z`
}

const RAY_WEDGES = Array.from({ length: RAY_COUNT }, (_, index) => buildRayWedgePath(index))

/** Homepage hero — large square behind art; mask fade inside hero clip. */
export const heroRaysHomeClass = 'hero-rays--home'

/** DApp — viewport-centered circle; perimeter fades to transparent. */
export const heroRaysShellClass = 'hero-rays--shell'

export function HeroRaysBackground({
  className,
  variant = 'shell',
}: {
  className?: string
  variant?: 'home' | 'shell'
}) {
  const uid = useId().replace(/:/g, '')
  const hubGradientId = `hero-rays-hub-${uid}`
  const maskGradientId = `hero-rays-mask-gradient-${uid}`
  const maskId = `hero-rays-mask-${uid}`
  const maskSolidStop = variant === 'home' ? '90%' : '50%'

  return (
    <div
      aria-hidden="true"
      className={cn('hero-rays', className)}
      data-variant={variant}
    >
      <svg
        className="hero-rays__svg"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient cx="50%" cy="50%" id={hubGradientId} r="50%">
            <stop offset="0%" stopColor="#8a8f98" stopOpacity="0.06" />
            <stop offset="32%" stopColor="#868b94" stopOpacity="0.025" />
            <stop offset="58%" stopColor="#868b94" stopOpacity="0" />
          </radialGradient>
          <radialGradient cx="50%" cy="50%" id={maskGradientId} r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset={maskSolidStop} stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId}>
            <rect fill={`url(#${maskGradientId})`} height="100" width="100" />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <rect fill={`url(#${hubGradientId})`} height="100" width="100" />
          <g fill="#868b94" fillOpacity="0.08">
            {RAY_WEDGES.map((path, index) => (
              <path d={path} key={index} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
