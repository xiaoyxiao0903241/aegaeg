import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { tv } from 'tailwind-variants'
import { dappIcon } from '~/shared/ui/dapp-icon-scale'
import { cn } from '~/shared/lib/utils'
import { useI18n } from '~/i18n/use-i18n'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { railItems } from '~/app/assets'
import { railIconMask, railNavLabelKeys, railTourIds } from '~/app/rail-shared'
import { aegisDialogClose } from '~/shared/ui/aegis-responsive-dialog'
import { Text } from '~/shared/ui/text'
import { useTurbineExchangeRailDot } from '~/views/dapp/exchange/turbine/use-turbine-exchange-rail-dot'
import { useReleaseRailDot } from '~/views/dapp/release/use-release-rail-dot'
import { useDappShell } from '~/app/use-dapp-shell'

const drawerItem = tv({
  base: cn(
    'flex w-full min-w-0 cursor-pointer items-center gap-3.5 rounded-md px-4 py-3.5',
    'duration-dapp-fast transition-[background-color,color] ease-out',
  ),
  variants: {
    active: {
      true: 'bg-accent text-primary',
      false: 'bg-transparent text-foreground',
    },
  },
})

/** Keep in sync with `--motion-dapp-emphasis` (theme.css). */
const NAV_MOTION_MS = 300

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
  const { sessionReady, walletReady } = useDappShell()
  const exchangeClaimable = useTurbineExchangeRailDot(sessionReady)
  const releaseClaimable = useReleaseRailDot(walletReady)
  const [mounted, setMounted] = useState(open)
  const [motion, setMotion] = useState<NavMotion | null>(open ? 'enter' : null)
  const [prevOpen, setPrevOpen] = useState(open)

  // Adjust mount/motion during render when `open` flips (React “adjust state from props”).
  if (open !== prevOpen) {
    setPrevOpen(open)
    if (open) {
      setMounted(true)
      setMotion('enter')
    } else {
      setMotion('exit')
    }
  }

  useEffect(() => {
    if (motion !== 'exit') return
    const timer = window.setTimeout(() => {
      setMounted(false)
      setMotion(null)
    }, NAV_MOTION_MS)
    return () => window.clearTimeout(timer)
  }, [motion])

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
        'fixed inset-0 z-60 dapp:hidden max-dapp:block',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      data-dapp-mobile-nav
      data-motion={motion}
      role="presentation"
    >
      <button
        aria-label={t.common.close}
        className={cn('absolute inset-0 border-0 p-0', 'bg-modal-overlay backdrop-blur-sm')}
        data-dapp-mobile-nav-backdrop
        onClick={onClose}
        type="button"
      />

      <nav
        aria-label="DApp sections"
        className={cn(
          'absolute inset-y-0 left-0 flex w-3/5 max-w-3/5 flex-col gap-1 p-4.5',
          'bg-(image:--glass-drawer) backdrop-blur-xl backdrop-saturate-150',
          'shadow-drawer',
          'will-change-transform',
        )}
        data-dapp-mobile-nav-panel
        id="dapp-mobile-nav"
        role="tablist"
      >
        <div className="flex items-start justify-end pb-2">
          <button
            aria-label={t.topbar.closeMenu}
            className={aegisDialogClose()}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className={dappIcon({ size: 'sm' })} strokeWidth={2} />
          </button>
        </div>

        {railItems.map((item) => {
          const label = t.nav[railNavLabelKeys[item.id]]
          const active = item.id === activeTab

          return (
            <button
              aria-label={label}
              aria-selected={active}
              className={cn(drawerItem({ active }), 'relative')}
              data-tour-id={railTourIds[item.id]}
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
              {item.id === 'exchange' && exchangeClaimable ? (
                <span
                  aria-hidden
                  className="absolute top-3 right-3 size-1.5 rounded-full bg-coral"
                  data-exchange-claimable-dot
                />
              ) : null}
              {item.id === 'release' && releaseClaimable ? (
                <span
                  aria-hidden
                  className="absolute top-3 right-3 size-1.5 rounded-full bg-coral"
                  data-release-claimable-dot
                />
              ) : null}
              <Text
                as="span"
                variant="copy"
                tone={active ? 'primary' : 'foreground'}
                className="min-w-0 flex-1 truncate text-sm/snug font-semibold tracking-tight"
                title={label}
              >
                {label}
              </Text>
            </button>
          )
        })}
      </nav>
    </div>,
    document.body,
  )
}
