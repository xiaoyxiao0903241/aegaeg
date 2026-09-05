import { X } from 'lucide-react'
import { Fragment, useEffect, useEffectEvent, useState } from 'react'
import { createPortal } from 'react-dom'
import { tv } from 'tailwind-variants'

import {
  useAssetsClaimableUnreads,
  useExchangeTurbineUnread,
  useReleaseClaimableUnreads,
  useRewardsClaimableUnreads,
} from '~/hooks/use-nav-claimable-dots'
import { useI18n } from '~/i18n/use-i18n'
import { railItems } from '~/shared/assets/dapp'
import { ClaimableDot } from '~/shared/components/claimable-dot'
import { dialogClose } from '~/shared/components/dialog'
import { iconVariants } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { cn } from '~/shared/lib/utils'
import { NoticeRailButton } from '~/views/dapp/host/notices/notice-rail-button'
import { railIconMask, railNavLabelKeys, railTourIds } from '~/views/dapp/host/primitives'

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

/** 与 theme.css 中 `--motion-dapp-emphasis` / onboarding `MOBILE_NAV_ENTER_MS` 保持一致。 */
const NAV_MOTION_MS = 300

type NavMotion = 'enter' | 'exit'

/**
 * H5 移动端导航抽屉。
 *
 * 从左侧滑出，带半透明遮罩与毛玻璃面板；列出全部 Tab 并高亮当前项。
 * 社区与共建之间插入公告入口（非 Tab）：外观与未选中项相同，有待展示公告时红点且可点。
 * 关闭时先播放退场动画再卸载，期间锁定页面滚动。
 */
export function MobileNav({
  activeTab,
  noticeHasPopup,
  onClose,
  onOpenNotice,
  onSelectTab,
  open,
}: {
  open: boolean
  activeTab: DappTab
  noticeHasPopup: boolean
  onSelectTab: (tab: DappTab) => void
  onOpenNotice: () => void
  onClose: () => void
}) {
  const { messages: t } = useI18n()
  const exchangeClaimable = useExchangeTurbineUnread()
  const assetsClaimable = useAssetsClaimableUnreads().rail
  const releaseClaimable = useReleaseClaimableUnreads().rail
  const rewardsClaimable = useRewardsClaimableUnreads().rail
  const [mounted, setMounted] = useState(open)
  const [motion, setMotion] = useState<NavMotion | null>(open ? 'enter' : null)
  const [prevOpen, setPrevOpen] = useState(open)

  // 渲染期间 `open` 翻转时同步挂载/动画状态（React「依据 props 调整 state」模式）
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

  const close = useEffectEvent(onClose)

  useEffect(() => {
    if (!mounted) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mounted])

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
            className={dialogClose()}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className={iconVariants({ size: 'sm' })} strokeWidth={2} />
          </button>
        </div>

        {railItems.map((item) => {
          const label = t.nav[railNavLabelKeys[item.id]]
          const active = item.id === activeTab
          const tabButton = (
            <button
              aria-label={label}
              aria-selected={active}
              className={cn(drawerItem({ active }), 'relative')}
              data-tour-id={railTourIds[item.id]}
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
              {item.id === 'exchange' && exchangeClaimable ? <ClaimableDot /> : null}
              {item.id === 'assets' && assetsClaimable ? <ClaimableDot /> : null}
              {item.id === 'release' && releaseClaimable ? <ClaimableDot /> : null}
              {item.id === 'rewards' && rewardsClaimable ? <ClaimableDot /> : null}
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

          if (item.id !== 'community') {
            return <Fragment key={item.id}>{tabButton}</Fragment>
          }

          return (
            <Fragment key={item.id}>
              {tabButton}
              <NoticeRailButton
                className={cn(drawerItem({ active: false }), 'relative')}
                hasPopup={noticeHasPopup}
                iconClassName="size-5.5 shrink-0 bg-current text-foreground"
                labelClassName="min-w-0 flex-1 truncate text-sm/snug font-semibold tracking-tight"
                labelTone="foreground"
                labelVariant="copy"
                onOpen={onOpenNotice}
              />
            </Fragment>
          )
        })}
      </nav>
    </div>,
    document.body,
  )
}
