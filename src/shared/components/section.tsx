import {
  Children,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { CollapseChevron } from '~/shared/components/collapse-chevron'
import { Text } from '~/shared/components/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

/**
 * 右栏内容节（组合式）— `Section` · `Title` · `Description`
 *
 * 节间距归 Detail（PC 34 / H5 24）；节内节奏一律 `gap-4`（Title / Description / body）。
 * 标题字阶 ≡ `Text variant="section"`（禁 call site className 改字阶/间距）。
 * `collapsible`：标题行可折叠；**必然** reveal；settle 后 `overflow-visible`。
 * 折叠箭头 ≡ `CollapseChevron`（与 FAQ 同 SSOT）。
 *
 * @see docs/foundation/component-usage.md
 */

const COLLAPSE_MS = 320

type SectionContextValue = {
  collapsible: boolean
  open: boolean
  bodyId: string
  onToggle: () => void
}

const SectionContext = createContext<SectionContextValue | null>(null)

function useSectionContext() {
  return useContext(SectionContext)
}

type SectionProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  /** 标题行可折叠；隐含 reveal + settle 后 overflow-visible */
  collapsible?: boolean
  defaultOpen?: boolean
  /** 进场 reveal（非折叠节可选；折叠节必然 reveal） */
  reveal?: boolean
}

function isElementType(child: ReactNode, type: unknown): child is ReactElement {
  return isValidElement(child) && child.type === type
}

function SectionRoot({
  children,
  className,
  collapsible = false,
  defaultOpen = true,
  reveal = false,
  ...props
}: SectionProps) {
  const showReveal = collapsible || reveal
  const [open, setOpen] = useState(defaultOpen)
  const [overflowSettled, setOverflowSettled] = useState(defaultOpen)
  const settleTimerRef = useRef<number | null>(null)
  const bodyId = useId()

  useEffect(() => {
    return () => {
      if (settleTimerRef.current != null) window.clearTimeout(settleTimerRef.current)
    }
  }, [])

  const onToggle = () => {
    if (settleTimerRef.current != null) {
      window.clearTimeout(settleTimerRef.current)
      settleTimerRef.current = null
    }
    if (open) {
      setOpen(false)
      setOverflowSettled(false)
      return
    }
    setOpen(true)
    settleTimerRef.current = window.setTimeout(() => {
      setOverflowSettled(true)
      settleTimerRef.current = null
    }, COLLAPSE_MS)
  }

  const childList = Children.toArray(children)
  const title = childList.find((child) => isElementType(child, Title))
  const description = childList.find((child) => isElementType(child, Description))
  const rest = childList.filter(
    (child) => !isElementType(child, Title) && !isElementType(child, Description),
  )

  const ctx: SectionContextValue = {
    bodyId,
    collapsible,
    onToggle,
    open,
  }

  return (
    <SectionContext.Provider value={ctx}>
      <section
        className={cn('flex flex-col gap-4', showReveal && revealClass(), className)}
        data-reveal={showReveal ? '' : undefined}
        {...props}
      >
        {collapsible ? (
          <>
            <button
              aria-controls={bodyId}
              aria-expanded={open}
              className="flex w-full cursor-pointer appearance-none items-center justify-between gap-3 border-0 bg-transparent p-0 text-left text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-none active:bg-transparent"
              onClick={onToggle}
              type="button"
            >
              <span className="min-w-0 flex-1">{title}</span>
              <CollapseChevron open={open} />
            </button>
            <div
              className="dapp-collapsible-body"
              data-open={open ? 'true' : 'false'}
              id={bodyId}
              style={{ transitionDuration: `${COLLAPSE_MS}ms` }}
            >
              <div
                className={cn(
                  'dapp-collapsible-inner flex flex-col gap-4',
                  overflowSettled && 'overflow-visible',
                )}
              >
                {description}
                {rest}
              </div>
            </div>
          </>
        ) : (
          <>
            {title}
            {description}
            {rest}
          </>
        )}
      </section>
    </SectionContext.Provider>
  )
}

type TitleProps = {
  children: ReactNode
  id?: string
}

function Title({ children, id }: TitleProps) {
  const section = useSectionContext()
  const collapsible = section?.collapsible ?? false

  return (
    <Text as={collapsible ? 'span' : 'h2'} className="m-0" id={id} variant="section">
      {children}
    </Text>
  )
}
Title.displayName = 'Section.Title'

type DescriptionProps = {
  children: ReactNode
}

/** 节说明：copy · foreground@40%；与 Title/body 间距由 Section gap-4 承担 */
function Description({ children }: DescriptionProps) {
  return (
    <Text as="p" className="m-0 text-foreground/40" variant="copy">
      {children}
    </Text>
  )
}
Description.displayName = 'Section.Description'

export const Section = Object.assign(SectionRoot, {
  Title,
  Description,
})
