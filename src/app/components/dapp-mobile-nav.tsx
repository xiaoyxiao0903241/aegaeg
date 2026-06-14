import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import { X } from 'lucide-react'
import { cn } from '~/lib/utils'
import { useI18n } from '../../i18n/use-i18n'
import type { DappTab } from '../types'
import { railItems } from '../assets'
import { shellMobileDrawerItemClass } from '../shell-layout'

const railCopy = {
  swap: 'swap',
  genesis: 'genesis',
  rewards: 'rewards',
  community: 'community',
} as const

const NAV_MOTION_MS = 320

type NavMotion = 'enter' | 'exit'

function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}

export function DappMobileNav({
  activeTab,
  onClose,
  onSelectTab,
  open,
}: {
  open: boolean
  activeTab: DappTab
  onSelectTab: (tab: DappTab) => void
  onClose: () => void
}) {
  const { messages: t } = useI18n()
  const wasOpenRef = useRef(open)
  const [mounted, setMounted] = useState(false)
  const [motion, setMotion] = useState<NavMotion | null>(null)

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true
      setMounted(true)
      setMotion('enter')
      return
    }

    if (!wasOpenRef.current) return
    wasOpenRef.current = false

    setMotion('exit')
    const timer = window.setTimeout(() => {
      setMounted(false)
      setMotion(null)
    }, NAV_MOTION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!mounted) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mounted, onClose])

  if (!mounted || !motion) return null

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        'fixed inset-0 z-[60] max-[820px]:block min-[821px]:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      data-dapp-mobile-nav
      data-motion={motion}
      role="presentation"
    >
      <button
        aria-label={t.common.close}
        className="absolute inset-0 border-0 bg-[oklch(0%_0_0/40%)] p-0"
        data-dapp-mobile-nav-backdrop
        onClick={onClose}
        type="button"
      />

      <nav
        aria-label="DApp sections"
        className={cn(
          'absolute inset-0 flex flex-col gap-1 bg-card p-[18px] shadow-[20px_0_60px_oklch(18%_0.04_265/25%)]',
          'will-change-transform',
        )}
        data-dapp-mobile-nav-panel
        id="dapp-mobile-nav"
        role="tablist"
      >
        <div className="flex items-start justify-end pb-2">
          <button
            aria-label={t.topbar.closeMenu}
            className={cn(
              'grid size-9 shrink-0 cursor-pointer place-items-center rounded-[18px]',
              'border border-border bg-card text-foreground transition-[border-color,transform] duration-180 ease-out',
              'hover:-translate-y-px hover:border-primary focus-visible:border-primary focus-visible:outline-none',
            )}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-3.5" strokeWidth={2} />
          </button>
        </div>

        {railItems.map((item) => {
          const label = t.nav[railCopy[item.id]]
          const active = item.id === activeTab

          return (
            <button
              aria-label={label}
              aria-selected={active}
              className={shellMobileDrawerItemClass(active)}
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              role="tab"
              type="button"
            >
              <span
                aria-hidden
                className={cn(
                  'size-[22px] shrink-0 bg-current',
                  active ? 'text-primary' : 'text-foreground',
                )}
                style={railIconMask(item.icon)}
              />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </div>,
    document.body,
  )
}
