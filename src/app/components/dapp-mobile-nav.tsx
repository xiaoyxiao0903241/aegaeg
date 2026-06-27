import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { dappIconClass } from '~/app/dapp-icon-scale'
import { cn } from '~/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import type { DappTab } from '~/app/types'
import { railItems } from '~/app/assets'
import { railIconMask, railNavLabelKeys } from '~/app/rail-shared'
import { shellMobileDrawerItemClass, shellRailRowLabelClass } from '~/app/shell-layout'

const NAV_MOTION_MS = 320

type NavMotion = 'enter' | 'exit'

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
        'fixed inset-0 z-[60] max-dapp:block dapp:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      data-dapp-mobile-nav
      data-motion={motion}
      role="presentation"
    >
      <button
        aria-label={t.common.close}
        className={cn(
          'absolute inset-0 border-0 p-0',
          'bg-[oklch(13%_0.02_264/45%)] backdrop-blur-sm',
        )}
        data-dapp-mobile-nav-backdrop
        onClick={onClose}
        type="button"
      />

      <nav
        aria-label="DApp sections"
        className={cn(
          'absolute inset-y-0 left-0 flex w-3/5 max-w-3/5 flex-col gap-1 p-4.5',
          'bg-[linear-gradient(165deg,oklch(100%_0_0/92%),oklch(100%_0_0/78%))] backdrop-blur-xl backdrop-saturate-150',
          'shadow-[20px_0_60px_oklch(18%_0.04_265/25%)]',
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
              'grid size-9 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0',
              'text-foreground shadow-none transition-opacity duration-180 ease-out',
              'hover:opacity-80 focus-visible:outline-none',
            )}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className={dappIconClass.sm} strokeWidth={2} />
          </button>
        </div>

        {railItems.map((item) => {
          const label = t.nav[railNavLabelKeys[item.id]]
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
                  'size-5.5 shrink-0 bg-current',
                  active ? 'text-primary' : 'text-foreground',
                )}
                style={railIconMask(item.icon)}
              />
              <span className={shellRailRowLabelClass} title={label}>
                {label}
              </span>
            </button>
          )
        })}
      </nav>
    </div>,
    document.body,
  )
}
