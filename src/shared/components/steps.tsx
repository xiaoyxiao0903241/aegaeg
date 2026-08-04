import {
  Children,
  cloneElement,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
} from 'react'

import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * DApp 步骤条 — 组合式（不含 Card）：
 * `Steps` · `Item`
 *
 * - 列间**不用 gap**：非末项 `pr-4`（16）做间距；圆标轨 `-mr-4` 把连线伸过 padding，圆↔圆相接
 * - 连线一律 **2px**（`h-0.5`）
 * - `start` `4301:226`：圆 26 · 文左齐 · 圆→文 12 · 题→说明 8
 * - `center` `4359:531`：圆 28 · 文居中 max≈148 · 圆→文 16 · 题→说明 4 · 贯通线首末圆心
 *
 * `activeIndex`：0-based；缺省 = 全实心说明态。
 * @see docs/foundation/component-usage.md
 */

type StepsAlign = 'start' | 'center'

type StepsContextValue = {
  activeIndex: number | null
  align: StepsAlign
  count: number
}

const StepsContext = createContext<StepsContextValue | null>(null)

function useSteps() {
  const ctx = useContext(StepsContext)
  if (!ctx) throw new Error('Steps.Item must be used within <Steps>')
  return ctx
}

type ItemProps = {
  title: ReactNode
  body: ReactNode
  className?: string
  index?: number
}

function isItemElement(node: ReactNode): node is ReactElement<ItemProps> {
  return isValidElement(node) && node.type === Item
}

type StepsRootProps = HTMLAttributes<HTMLDivElement> & {
  align?: StepsAlign
  activeIndex?: number
  children?: ReactNode
}

function StepsRoot({
  align = 'start',
  activeIndex,
  className,
  children,
  ...props
}: StepsRootProps) {
  const items = Children.toArray(children).filter(isItemElement)
  const count = items.length
  const cloned = items.map((child, index) =>
    cloneElement(child, { index, key: child.key ?? index }),
  )

  return (
    <StepsContext.Provider value={{ activeIndex: activeIndex ?? null, align, count }}>
      <div className={cn('w-full', className)} {...props}>
        <div className="max-dapp:hidden">
          {align === 'start' ? (
            <StartDesktop count={count}>{cloned}</StartDesktop>
          ) : (
            <CenterDesktop count={count}>{cloned}</CenterDesktop>
          )}
        </div>
        <ol className="m-0 flex list-none flex-col p-0 dapp:hidden">{cloned}</ol>
      </div>
    </StepsContext.Provider>
  )
}

/**
 * start PC：无 gap · 非末项 pr-4；
 * 轨 `-mr-4` 伸进 padding，[圆][h-0.5 线] 接到下一列圆左缘。
 */
function StartDesktop({ count, children }: { count: number; children: ReactElement<ItemProps>[] }) {
  return (
    <div className="flex w-full items-start">
      {children.map((child, index) => {
        const isLast = index >= count - 1
        return (
          <div
            className={cn('flex min-w-0 flex-1 flex-col gap-3', !isLast && 'pr-4')}
            key={child.key ?? index}
          >
            <div className={cn('flex h-[1.625rem] items-center', !isLast && '-mr-4')}>
              <StepBadge align="start" index={index} />
              {!isLast ? <span aria-hidden className="h-0.5 min-w-0 flex-1 bg-border" /> : null}
            </div>
            <StepText
              align="start"
              body={child.props.body}
              className={child.props.className}
              index={index}
              title={child.props.title}
            />
          </div>
        )
      })}
    </div>
  )
}

/**
 * center PC：无 gap · 非末项 pr-4；圆居中于整列（含 padding 区用轨拉满）；
 * 贯通 h-0.5，inset = 半列。
 */
function CenterDesktop({
  count,
  children,
}: {
  count: number
  children: ReactElement<ItemProps>[]
}) {
  const inset = count > 0 ? `${100 / (count * 2)}%` : '0%'

  return (
    <div className="relative flex w-full items-start">
      {count > 1 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-[13px] z-0 h-0.5 bg-border"
          style={{ left: inset, right: inset }}
        />
      ) : null}
      {children.map((child, index) => {
        const isLast = index >= count - 1
        return (
          <div
            className={cn(
              'relative z-1 flex min-w-0 flex-1 flex-col items-center gap-4',
              !isLast && 'pr-4',
            )}
            key={child.key ?? index}
          >
            {/* 圆相对「列宽含 pr」居中：轨拉满到下一列边界 */}
            <div className={cn('flex w-full justify-center', !isLast && '-mr-4')}>
              <StepBadge align="center" index={index} />
            </div>
            <StepText
              align="center"
              body={child.props.body}
              className={cn('w-full max-w-[9.25rem]', child.props.className)}
              index={index}
              title={child.props.title}
            />
          </div>
        )
      })}
    </div>
  )
}

function StepBadge({ align, index }: { align: StepsAlign; index: number }) {
  const { activeIndex } = useSteps()
  const isActive = activeIndex == null ? true : index === activeIndex
  return (
    <span
      className={cn(
        'relative z-1 flex shrink-0 items-center justify-center rounded-full',
        align === 'start' ? 'size-[1.625rem]' : 'size-7',
        isActive ? 'border-0 bg-primary' : 'border-[1.5px] border-amount-muted bg-card',
      )}
    >
      <Text
        as="span"
        className={cn(
          align === 'start' ? 'font-bold' : 'font-semibold',
          !isActive && 'text-foreground/40',
        )}
        tone={isActive ? 'inverse' : undefined}
        variant="copy"
      >
        {index + 1}
      </Text>
    </span>
  )
}

function StepText({
  align,
  index,
  title,
  body,
  className,
}: {
  align: StepsAlign
  index: number
  title: ReactNode
  body: ReactNode
  className?: string
}) {
  const { activeIndex } = useSteps()
  const isActive = activeIndex == null ? true : index === activeIndex
  const highlight = align === 'center' && activeIndex != null && isActive

  return (
    <div
      className={cn(
        'grid min-w-0 content-start',
        align === 'start' ? 'gap-2 text-left' : 'gap-1 text-center',
        className,
      )}
    >
      <Text
        as="strong"
        className={cn(
          align === 'start' ? 'font-semibold' : 'font-medium',
          highlight && 'text-primary',
        )}
        variant={align === 'start' ? 'copy' : 'detail'}
      >
        {title}
      </Text>
      <Text
        as="p"
        className={cn('m-0', highlight ? 'text-coral' : 'text-foreground/40')}
        variant="copy"
      >
        {body}
      </Text>
    </div>
  )
}

function Item({ index = 0, title, body, className }: ItemProps) {
  const { align, count } = useSteps()
  const isLast = index >= count - 1

  return (
    <li className={cn('flex gap-3', className)}>
      <div className="flex w-7 shrink-0 flex-col items-center self-stretch">
        <StepBadge align={align} index={index} />
        {!isLast ? <span aria-hidden className="w-0.5 flex-1 bg-border" /> : null}
      </div>
      <StepText
        align={align}
        body={body}
        className={cn('flex-1 pt-1', !isLast && 'pb-4')}
        index={index}
        title={title}
      />
    </li>
  )
}

export const Steps = Object.assign(StepsRoot, {
  Item,
})
