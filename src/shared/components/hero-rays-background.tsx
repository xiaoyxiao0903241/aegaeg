import { useId } from 'react'
import { tv } from 'tailwind-variants'

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

function rayWedgePath(index: number) {
  const startDeg = index * RAY_SPACING_DEG
  const endDeg = startDeg + RAY_WIDTH_DEG
  const outerStart = polarPoint(CENTER, CENTER, RADIUS, startDeg)
  const outerEnd = polarPoint(CENTER, CENTER, RADIUS, endDeg)

  return `M ${CENTER} ${CENTER} L ${outerStart.x} ${outerStart.y} A ${RADIUS} ${RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y} Z`
}

const RAY_WEDGES = Array.from({ length: RAY_COUNT }, (_, index) => rayWedgePath(index))

const heroRays = tv({
  base: 'hero-rays',
  variants: {
    variant: {
      home: 'hero-rays--home',
      host: 'hero-rays--host',
    },
  },
  defaultVariants: {
    variant: 'host',
  },
})

/**
 * 首页 / 应用外壳的背景射线
 *
 * 用 SVG 生成向外辐射的光线，作为页面装饰背景；
 * 仅供装饰，对辅助功能隐藏。
 *
 * @param variant home（首页）/ host（DApp 宿主）
 */
export function HeroRaysBackground({
  className,
  variant = 'host',
}: {
  className?: string
  variant?: 'home' | 'host'
}) {
  const uid = useId().replace(/:/g, '')
  const hubGradientId = `hero-rays-hub-${uid}`
  const maskGradientId = `hero-rays-mask-gradient-${uid}`
  const maskId = `hero-rays-mask-${uid}`
  const maskSolidStop = variant === 'home' ? '90%' : '50%'

  return (
    <div
      aria-hidden="true"
      className={heroRays({ variant, class: className })}
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
            <stop offset="0%" stopColor="var(--hero-rays-hub)" stopOpacity="0.06" />
            <stop offset="32%" stopColor="var(--hero-rays-wedge)" stopOpacity="0.025" />
            <stop offset="58%" stopColor="var(--hero-rays-wedge)" stopOpacity="0" />
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
          <g fill="var(--hero-rays-wedge)" fillOpacity="0.08">
            {RAY_WEDGES.map((path, index) => (
              <path d={path} key={index} />
            ))}
          </g>
        </g>
      </svg>
    </div>
  )
}
