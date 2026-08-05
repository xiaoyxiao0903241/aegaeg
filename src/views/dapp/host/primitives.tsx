import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import { Text } from '~/shared/components/text'
import type { DappTab } from '~/shared/config/dapp-tabs'
import { cn } from '~/shared/lib/utils'

export const railNavLabelKeys = {
  exchange: 'exchange',
  assets: 'assets',
  staking: 'staking',
  rewards: 'rewards',
  release: 'release',
  community: 'community',
  genesis: 'genesis',
} as const satisfies Record<
  DappTab,
  'exchange' | 'assets' | 'staking' | 'rewards' | 'release' | 'community' | 'genesis'
>

/** 导航各步骤在引导流程中的锚点标识；创世页不在引导范围内。 */
export const railTourIds = {
  exchange: 'nav-swap',
  assets: 'nav-assets',
  staking: 'nav-staking',
  rewards: 'nav-rewards',
  release: 'nav-release',
  community: 'nav-community',
  genesis: undefined,
} as const satisfies Record<DappTab, string | undefined>

/**
 * 将图标文件作为 CSS 遮罩，使其显示为当前文字色。
 *
 * @param icon 图标资源路径
 * @returns 遮罩相关样式，供 `style` 内联使用
 */
export function railIconMask(icon: string): CSSProperties {
  return {
    maskImage: `url(${icon})`,
    WebkitMaskImage: `url(${icon})`,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
  }
}

/**
 * 将 DApp 左右两个面板与整个窗口滚动到顶部。
 *
 * 切换 Tab 或点击引导类 CTA 后调用；
 * 用 requestAnimationFrame 延后到下一帧执行，确保新的面板已挂载。
 */
export function scrollDappPanelsToTop() {
  requestAnimationFrame(() => {
    const hostWindow = document.querySelector('[data-dapp-window]')
    const detail = document.querySelector('[data-dapp-detail]')
    if (hostWindow instanceof HTMLElement) {
      hostWindow.scrollTop = 0
    }
    document.querySelectorAll('[data-dapp-widget-scroll]').forEach((node) => {
      if (node instanceof HTMLElement) {
        node.scrollTop = 0
      }
    })
    if (detail instanceof HTMLElement) {
      detail.scrollTop = 0
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  })
}

/**
 * PC 左右内容面板的外层容器：子元素负责滚动，
 * 上下边缘各放一个固定淡出遮罩，滚动时内容渐隐渐显。
 */
export function ScrollFadeHost({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'dapp-scroll-fade-host',
        'dapp:relative dapp:h-full dapp:max-h-full dapp:min-h-0 dapp:min-w-0',
        className,
      )}
    >
      {children}
      <div aria-hidden className="dapp-scroll-fade-edge dapp-scroll-fade-edge-top" />
      <div aria-hidden className="dapp-scroll-fade-edge dapp-scroll-fade-edge-bottom" />
    </div>
  )
}

/**
 * 滚动进入视口的元素显示监听器。
 *
 * 在容器内查找 `[data-reveal]` 元素，进入视口后打上 `data-visible`，
 * 只触发一次并停止观察；容器 DOM 变化（新增子元素）时重新扫描。
 *
 * @param container 监听范围，为 null 时不工作
 */
export function RevealObserver({ container }: { container: HTMLElement | null }) {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const observedRef = useRef(new WeakSet<Element>())

  useEffect(() => {
    if (!container) {
      return
    }

    const observed = observedRef.current
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }
          entry.target.setAttribute('data-visible', 'true')
          io.unobserve(entry.target)
          observed.delete(entry.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    observerRef.current = io

    const scan = () => {
      const elements = [
        ...(container.hasAttribute('data-reveal') ? [container] : []),
        ...container.querySelectorAll<HTMLElement>('[data-reveal]'),
      ]
      elements.forEach((element) => {
        if (observed.has(element)) {
          return
        }
        observed.add(element)
        io.observe(element)
      })
    }

    scan()

    const mutationObserver = new MutationObserver(scan)
    mutationObserver.observe(container, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      io.disconnect()
      observerRef.current = null
    }
  }, [container])

  return null
}

/**
 * 顶部栏「新手教程」入口，点击重播引导；未完成时右上角带提示点。
 */
export function OnboardingTourChip({
  done,
  label,
  onClick,
}: {
  label: string
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'relative inline-flex h-9 min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full',
        'border border-border bg-card px-3.5 text-xs leading-none font-semibold text-foreground',
        'duration-dapp-fast transition-[border-color,transform,background-color] ease-out',
        'hover:-translate-y-px hover:border-coral-hover-border hover:bg-coral-wash',
      )}
      data-onboarding-chip
      onClick={onClick}
      type="button"
    >
      <Text as="span" className="text-xs font-semibold" variant="caption">
        {label}
      </Text>
      {!done ? (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-coral"
          data-onboarding-chip-dot
        />
      ) : null}
    </button>
  )
}
