import { cardVariants } from '~/components/card'
import { revealClass } from '~/lib/reveal'
import * as Accordion from '@radix-ui/react-accordion'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cn } from '~/lib/utils'

export type FaqListItem = {
  a: ReactNode
  open?: boolean
  q: ReactNode
}

type FaqListVariant = 'home' | 'dapp'

const homeItemShellClass = cn(
  cardVariants({ context: 'home', fill: 'surface', hover: 'shadow', radius: 'md' }),
  'group rounded-md shadow-[0_6px_20px_oklch(22%_0.04_265_/_6%)]',
  'max-dapp:min-h-[46px] max-dapp:rounded-[14px]',
)

const dappItemOuterClass = 'rounded-md shadow-card max-dapp:rounded-[14px]'

const dappItemInnerClass = cn(
  'h-full w-full max-w-full overflow-hidden rounded-[inherit] border border-border bg-card px-[18px]',
  'max-dapp:px-4',
)

const dappTriggerClass = cn(
  'flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent py-4 text-left outline-none',
  'text-sm font-normal leading-[1.3] text-faq-text',
  'max-dapp:py-3.5',
)

const homeTriggerClass = cn(
  'flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-6 py-[18px] text-left outline-none',
  'text-[15px] font-semibold leading-[1.3] text-foreground',
  'max-dapp:min-h-[18px] max-dapp:px-4 max-dapp:py-3.5 max-dapp:text-sm',
)

const faqArrowClass =
  'grid size-4 shrink-0 origin-center place-items-center text-faint transition-[color,transform] duration-200 ease-out group-data-[state=open]:text-primary group-data-[state=open]:rotate-180'

const variantStyles = {
  home: {
    list: cn(
      revealClass(),
      'mx-auto mt-10 grid w-[min(100%,960px)] gap-3 max-dapp:mt-5 max-dapp:gap-2.5',
    ),
    item: homeItemShellClass,
    trigger: homeTriggerClass,
    question: 'min-w-0',
    answer: 'pt-3 mb-0 text-sm leading-[1.5] text-faq-text max-dapp:text-[13px]',
    answerPad: 'px-6 pb-[18px] max-dapp:px-4 max-dapp:pb-3.5',
    answerContent: 'overflow-hidden',
  },
  dapp: {
    list: 'mt-3.5 grid w-full gap-3',
    item: dappItemOuterClass,
    itemInner: dappItemInnerClass,
    trigger: dappTriggerClass,
    question: 'min-w-0',
    answer: 'mb-4 pt-0 text-xs leading-[1.6] text-ink-strong max-dapp:leading-normal',
    answerPad: 'pb-4 max-dapp:pb-3.5',
    answerContent: 'overflow-hidden',
  },
} as const

export function FaqList({
  className,
  'data-reveal': dataReveal,
  defaultOpenFirst,
  itemClassName,
  items,
  variant = 'home',
}: {
  className?: string
  'data-reveal'?: boolean
  defaultOpenFirst?: boolean
  itemClassName?: string
  items: FaqListItem[]
  variant?: FaqListVariant
}) {
  const styles = variantStyles[variant]
  const openFirst = defaultOpenFirst ?? variant === 'dapp'

  const defaultValue = useMemo(
    () =>
      items.reduce<string[]>((acc, item, index) => {
        if (item.open ?? (openFirst && index === 0)) {
          acc.push(String(index))
        }
        return acc
      }, []),
    [items, openFirst],
  )

  const [value, setValue] = useState(defaultValue)
  const [interacted, setInteracted] = useState<Set<string>>(new Set())

  const handleValueChange = useCallback(
    (next: string[]) => {
      setValue(next)
      setInteracted((prev) => {
        const changed = new Set(prev)
        for (let i = 0; i < items.length; i++) {
          const itemValue = String(i)
          const wasOpen = defaultValue.includes(itemValue)
          const isOpen = next.includes(itemValue)
          if (wasOpen !== isOpen) {
            changed.add(itemValue)
          }
        }
        return changed
      })
    },
    [defaultValue, items.length],
  )

  const collapseItem = useCallback(
    (itemValue: string) => {
      if (value.includes(itemValue)) {
        handleValueChange(value.filter((entry) => entry !== itemValue))
      }
    },
    [handleValueChange, value],
  )

  return (
    <Accordion.Root
      className={cn(styles.list, className)}
      data-reveal={dataReveal ?? true}
      onValueChange={handleValueChange}
      type="multiple"
      value={value}
    >
      {items.map((item, index) => {
        const itemValue = String(index)
        const wasInitiallyOpen = defaultValue.includes(itemValue)
        const motionEnabled = !wasInitiallyOpen || interacted.has(itemValue)
        const isOpen = value.includes(itemValue)
        const itemBody = (
          <>
            <Accordion.Trigger className={cn(styles.trigger, 'group')} data-faq-trigger>
              <span className={styles.question}>{item.q}</span>
              <span className={faqArrowClass} aria-hidden="true">
                <svg
                  className="size-4"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6L8 10L12 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.7"
                  />
                </svg>
              </span>
            </Accordion.Trigger>
            <Accordion.Content
              className={styles.answerContent}
              data-faq-answer
              forceMount
              onClick={() => collapseItem(itemValue)}
              onKeyDown={(event) => {
                if (!isOpen) {
                  return
                }
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  collapseItem(itemValue)
                }
              }}
              role={isOpen ? 'button' : undefined}
              tabIndex={isOpen ? 0 : undefined}
            >
              <div className="faq-answer-panel">
                <div className={cn('faq-answer-panel-inner', isOpen && 'cursor-pointer')}>
                  <div className={styles.answerPad}>
                    <div className={styles.answer}>{item.a}</div>
                  </div>
                </div>
              </div>
            </Accordion.Content>
          </>
        )

        return (
          <Accordion.Item
            className={cn(styles.item, itemClassName)}
            data-faq-item
            data-faq-motion={motionEnabled ? 'true' : 'false'}
            key={`${index}-${String(item.q)}`}
            value={itemValue}
          >
            {'itemInner' in styles && styles.itemInner ? (
              <div className={styles.itemInner}>{itemBody}</div>
            ) : (
              itemBody
            )}
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
