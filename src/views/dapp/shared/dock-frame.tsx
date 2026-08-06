import { type ReactNode, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { cn } from '~/shared/lib/utils'
import { DockHeader } from '~/views/dapp/shared/dock-header'

/**
 * H5 顶栏固定高（Hub title+desc 与子页返回行共用，切换不抖）。
 * PC 不锁高，随内容。
 */
export const DOCK_H5_CHROME_BODY_CLASS = 'flex h-14 min-h-14 items-center'

/** 操作区纵向堆叠容器。 */
export function DockStack({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        '[&>*:first-child]:mt-0! max-dapp:[&>*:first-child]:mt-0!',
        'min-h-0 flex-none',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * H5 顶栏挂载点：放在 `[data-dapp-window]` 内、aside 之前。
 * sticky 钉在窗口滚动口顶，不随左侧 aside 滚走。
 * PC：hidden（不占位）；勿用 `contents`（portal 目标会异常）。
 */
export function DockH5ChromeSlot() {
  return (
    <div
      className={cn(
        'hidden',
        'max-dapp:sticky max-dapp:top-0 max-dapp:z-30 max-dapp:grid max-dapp:bg-card',
        'max-dapp:-mx-4.5 max-dapp:px-4.5 max-dapp:pt-4.5',
      )}
      data-dapp-dock-chrome-slot
    />
  )
}

/**
 * 左栏面板容器：头部 / 返回行与内容分离。
 *
 * - PC：头在栏内，整层横滑，高度随内容
 * - H5：头 portal 到 window sticky 槽；固定高；过渡期退场隐身（不做槽内横滑）
 */
export function DockPanel({
  bodyClassName,
  children,
  chrome,
  className,
}: {
  bodyClassName?: string
  children: ReactNode
  chrome: ReactNode
  className?: string
}) {
  const isMobile = useMobileViewport()
  const rootRef = useRef<HTMLDivElement>(null)
  const [slot, setSlot] = useState<Element | null>(null)
  const [exitLayer, setExitLayer] = useState(false)

  useLayoutEffect(() => {
    const nextSlot = document.querySelector('[data-dapp-dock-chrome-slot]')
    setSlot((prev) => (prev === nextSlot ? prev : nextSlot))
    const exiting = Boolean(rootRef.current?.closest('.dapp-subview-layer-exit'))
    setExitLayer((prev) => (prev === exiting ? prev : exiting))
  }, [])

  const chromeBody = (
    <div
      className={cn(
        DOCK_H5_CHROME_BODY_CLASS,
        'col-start-1 row-start-1 w-full pb-2',
        exitLayer && 'pointer-events-none opacity-0',
      )}
    >
      {chrome}
    </div>
  )

  return (
    <div
      ref={rootRef}
      className={cn(
        'flex flex-col',
        'dapp:h-full dapp:min-h-0 dapp:flex-1',
        'max-dapp:h-auto max-dapp:min-h-0 max-dapp:flex-none',
        className,
      )}
    >
      {/* PC：栏内固定头（高度随内容） */}
      <div className="shrink-0 bg-card px-6 pt-7.5 pb-2 max-dapp:hidden" data-dapp-dock-chrome>
        {chrome}
      </div>

      {/* H5：抬到 window sticky 槽 */}
      {isMobile && slot ? createPortal(chromeBody, slot) : null}

      <div
        className={cn(
          'flex min-w-0 flex-col',
          'dapp:relative dapp:min-h-0 dapp:flex-1',
          'max-dapp:min-h-0 max-dapp:flex-none',
        )}
        data-dapp-dock-body
      >
        <div
          aria-hidden
          className="dapp-scroll-fade-edge dapp-scroll-fade-edge-bottom absolute inset-x-0 bottom-0 z-10 hidden dapp:block"
        />
        <div
          className={cn(
            'dapp:h-full dapp:min-h-0 dapp:overflow-x-hidden dapp:overflow-y-auto dapp:px-6 dapp:pt-1 dapp:pb-5.5',
            'max-dapp:overflow-visible max-dapp:px-0 max-dapp:pt-1',
            bodyClassName,
          )}
          data-dapp-widget-scroll
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/**
 * Hub 面板容器：标题区 + 操作按钮（可选第二图标）+ 内容区。
 */
export function DockFrame({
  bodyClassName,
  children,
  className,
  endAction,
  showToggle = true,
  subtitle,
  title,
  titleClassName,
}: {
  bodyClassName?: string
  children: ReactNode
  className?: string
  endAction?: ReactNode
  showToggle?: boolean
  subtitle: ReactNode
  title: ReactNode
  titleClassName?: string
}) {
  return (
    <DockPanel
      bodyClassName={bodyClassName}
      className={className}
      chrome={
        <DockHeader
          className="w-full"
          endAction={endAction}
          showToggle={showToggle}
          subtitle={subtitle}
          title={title}
          titleClassName={titleClassName}
        />
      }
    >
      <DockStack>{children}</DockStack>
    </DockPanel>
  )
}
