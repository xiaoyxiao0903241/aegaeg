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
 * DApp 步骤条（不含卡片）
 *
 * 组合组件：`Steps` · `Item`。
 * `align` 控制布局：`start` 左对齐、`center` 居中。
 * `activeIndex`：0 起；缺省 = 全部实心说明态。
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

/** 桌面左对齐步骤条：编号在上，连线横穿列间 */
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
            <div className={cn('flex h-6.5 items-center', !isLast && '-mr-4')}>
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

/** 桌面居中步骤条：编号居中，连线位于两侧留白之间 */
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
            {/* 圆在含内边距的整列内居中，连线拉满到下一列边界 */}
            <div className={cn('flex w-full justify-center', !isLast && '-mr-4')}>
              <StepBadge align="center" index={index} />
            </div>
            <StepText
              align="center"
              body={child.props.body}
              className={cn('w-full max-w-37', child.props.className)}
              index={index}
              title={child.props.title}
            />
          </div>
        )
      })}
    </div>
  )
}

/** 步骤编号圆点：activeIndex 缺省时全部高亮 */
function StepBadge({ align, index }: { align: StepsAlign; index: number }) {
  const { activeIndex } = useSteps()
  const isActive = activeIndex == null ? true : index === activeIndex
  return (
    <span
      className={cn(
        'relative z-1 flex shrink-0 items-center justify-center rounded-full',
        align === 'start' ? 'size-6.5' : 'size-7',
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

/** 步骤标题与正文；居中模式当前项额外高亮 */
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

/** 移动端步骤项：纵排编号与连线，正文放在右侧 */
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
