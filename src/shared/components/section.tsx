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
 * 右栏内容节
 *
 * 组合组件：`Section` · `Title` · `Description`。
 * 可折叠：点击标题收起 / 展开正文。
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
  /** 标题行可折叠：点击收起 / 展开正文 */
  collapsible?: boolean
  defaultOpen?: boolean
  /** 可选进场动画（折叠节默认带动画） */
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

/** 节说明文字 */
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
