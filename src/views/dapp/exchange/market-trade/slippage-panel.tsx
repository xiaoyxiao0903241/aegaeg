import {
  type RefObject,
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { isAllowedSlippageDraft } from '~/core/exchange/token-amount'
import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { CountValue } from '~/shared/components/count-value'
import { Icon } from '~/shared/components/icon'
import { SEGMENT_MOTION_EASING, SEGMENT_MOTION_MS } from '~/shared/components/segment'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'
import { clampAnchoredPopover } from '~/views/dapp/exchange/market-trade/clamp-anchored-popover'

const PANEL_WIDTH_PX = 264
const PANEL_GAP_PX = 8
const VIEWPORT_PADDING_PX = 8

type SlippageMode = 'auto' | 'custom'

function readViewportBox() {
  const view = window.visualViewport
  if (!view) {
    return { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight }
  }
  return { left: view.offsetLeft, top: view.offsetTop, width: view.width, height: view.height }
}

function useDismissOnOutside(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
) {
  const dismiss = useEffectEvent(onDismiss)

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) return
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      dismiss()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') dismiss()
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, triggerRef, panelRef])
}

/**
 * 滑点：行内齿轮打开深色浮层，默认 / 自定义即时生效。
 *
 * 市价与涡轮共用。浮层 portal 到 body，按视口剩余空间上下翻转并水平收进屏幕。
 */
export function ExchangeSlippagePanel({
  autoPercent,
  customText,
  disabled = false,
  hint,
  mode,
  onCustomTextChange,
  onModeChange,
  slippage,
}: {
  autoPercent: number
  customText: string
  disabled?: boolean
  hint?: string
  mode: SlippageMode
  onCustomTextChange: (value: string) => void
  onModeChange: (mode: SlippageMode) => void
  slippage: number
}) {
  const { messages: t } = useI18n()
  const copy = t.exchange.slippagePanel
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const [box, setBox] = useState({ top: 0, left: 0, width: PANEL_WIDTH_PX, maxHeight: 0 })

  const customActive = mode === 'custom'
  const trackRef = useRef<HTMLDivElement>(null)
  const [thumb, setThumb] = useState({ left: 0, width: 0 })
  const [thumbMotion, setThumbMotion] = useState(false)

  useDismissOnOutside(open, rootRef, panelRef, () => setOpen(false))

  useEffect(() => {
    if (open) return
    setThumbMotion(false)
    setThumb({ left: 0, width: 0 })
  }, [open])

  const updateBox = useEffectEvent(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return
    const rect = trigger.getBoundingClientRect()
    setBox(
      clampAnchoredPopover({
        trigger: { top: rect.top, right: rect.right, bottom: rect.bottom },
        panelWidth: PANEL_WIDTH_PX,
        panelHeight: panel.offsetHeight,
        gap: PANEL_GAP_PX,
        padding: VIEWPORT_PADDING_PX,
        viewport: readViewportBox(),
      }),
    )
  })

  useLayoutEffect(() => {
    if (!open) return
    updateBox()
  }, [open, customActive, customText])

  useLayoutEffect(() => {
    if (!open) return
    const track = trackRef.current
    if (!track) return

    function measure() {
      const root = trackRef.current
      if (!root) return
      const radios = root.querySelectorAll<HTMLElement>('[role="radio"]')
      const active = radios[customActive ? 1 : 0]
      if (!active) return
      const next = { left: active.offsetLeft, width: active.offsetWidth }
      setThumb((prev) => (prev.left === next.left && prev.width === next.width ? prev : next))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [open, customActive])

  useEffect(() => {
    if (thumbMotion || thumb.width <= 0) return
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setThumbMotion(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [thumb.width, thumbMotion])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(updateBox, 0)
    const view = window.visualViewport
    window.addEventListener('resize', updateBox)
    window.addEventListener('scroll', updateBox, true)
    view?.addEventListener('resize', updateBox)
    view?.addEventListener('scroll', updateBox)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', updateBox)
      window.removeEventListener('scroll', updateBox, true)
      view?.removeEventListener('resize', updateBox)
      view?.removeEventListener('scroll', updateBox)
    }
  }, [open])

  const autoLabel = `${autoPercent}%`

  return (
    <div className="relative inline-flex" ref={rootRef}>
      <span className="inline-flex items-center justify-end gap-1">
        <CountValue text={`${slippage}%`} />
        <button
          aria-controls={open ? menuId : undefined}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label={t.exchange.slippageSettings}
          className={cn(
            'grid size-6 shrink-0 place-items-center rounded-tight border-0 p-0',
            'duration-dapp-fast transition-[background-color,opacity] ease-out',
            open ? 'bg-accent' : 'bg-transparent hover:opacity-80',
            disabled ? 'pointer-events-none opacity-40' : 'cursor-pointer',
          )}
          disabled={disabled}
          onClick={() => setOpen((next) => !next)}
          ref={triggerRef}
          type="button"
        >
          <Icon alt="" size="xs" src={dappAssets.settingPrimary} />
        </button>
      </span>

      {open
        ? createPortal(
            <div
              className={cn(
                'fixed z-50 grid gap-3 overflow-y-auto rounded-lg bg-dark-panel p-4 shadow-tooltip',
                'dapp-panel-enter',
              )}
              id={menuId}
              onClick={(event) => event.stopPropagation()}
              ref={panelRef}
              role="dialog"
              style={{
                top: box.top,
                left: box.left,
                width: box.width,
                maxHeight: box.maxHeight || undefined,
              }}
            >
              <Text as="b" className="m-0 font-semibold" tone="inverse" variant="copy">
                {copy.title}
              </Text>
              <Text as="span" className="whitespace-normal" tone="inverse-muted" variant="support">
                {hint ?? copy.hint}
              </Text>
              <div
                aria-label={copy.title}
                className="relative grid grid-cols-2 gap-0.5 rounded-full bg-inverse/10 p-0.75"
                ref={trackRef}
                role="radiogroup"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0.75 bottom-0.75 rounded-full bg-inverse shadow-[0_1px_2px_rgba(18,26,51,0.06)]"
                  style={{
                    left: thumb.left,
                    width: thumb.width,
                    opacity: thumb.width > 0 ? 1 : 0,
                    transition: thumbMotion
                      ? `left ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}, width ${SEGMENT_MOTION_MS}ms ${SEGMENT_MOTION_EASING}`
                      : undefined,
                  }}
                />
                <button
                  aria-checked={!customActive}
                  className="relative z-1 flex min-h-7.5 w-full cursor-pointer items-center justify-center rounded-full border-0 bg-transparent"
                  onClick={() => onModeChange('auto')}
                  role="radio"
                  type="button"
                >
                  <Text
                    as="span"
                    className="font-semibold"
                    tone={!customActive ? 'foreground' : 'inverse-muted'}
                    variant="support"
                  >
                    {copy.modeAuto}
                  </Text>
                </button>
                <button
                  aria-checked={customActive}
                  className="relative z-1 flex min-h-7.5 w-full cursor-pointer items-center justify-center rounded-full border-0 bg-transparent"
                  onClick={() => onModeChange('custom')}
                  role="radio"
                  type="button"
                >
                  <Text
                    as="span"
                    className="font-semibold"
                    tone={customActive ? 'foreground' : 'inverse-muted'}
                    variant="support"
                  >
                    {copy.modeCustom}
                  </Text>
                </button>
              </div>
              <div className="flex items-center justify-between gap-2.5">
                <Text as="span" tone="inverse-muted" variant="copy">
                  {copy.max}
                </Text>
                {customActive ? (
                  <label className="inline-flex items-center gap-0.75 rounded-full border border-inverse/25 px-2.5 py-1">
                    <input
                      aria-label={copy.customAria}
                      className="w-11 border-0 bg-transparent text-right text-(length:--type-copy-size) font-semibold text-inverse outline-none"
                      inputMode="decimal"
                      onChange={(event) => {
                        const next = event.currentTarget.value
                        if (isAllowedSlippageDraft(next)) onCustomTextChange(next)
                      }}
                      value={customText}
                    />
                    <Text as="span" tone="inverse-muted" variant="support">
                      %
                    </Text>
                  </label>
                ) : (
                  <Text as="b" className="m-0 font-semibold" tone="inverse" variant="copy">
                    {autoLabel}
                  </Text>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
