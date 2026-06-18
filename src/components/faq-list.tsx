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

const faqCardClass = cn(
  'overflow-hidden rounded-2xl bg-white shadow-[0_6px_20px_rgba(18,26,51,0.06)]',
  'max-dapp:rounded-[14px]',
)

const faqCardBodyClass = cn(
  'flex w-full flex-col items-start px-6 py-[18px]',
  'max-dapp:px-4 max-dapp:py-3.5',
  'group-data-[state=open]:gap-3 max-dapp:group-data-[state=open]:gap-2.5',
)

const faqQuestionClass = cn(
  'min-w-px flex-[1_0_0] text-left text-[15px] font-semibold leading-[1.3] tracking-[-0.3px] text-foreground [overflow-wrap:anywhere]',
  'max-dapp:text-sm',
)

const faqAnswerClass = cn(
  'w-full text-left text-[14px] font-normal leading-[1.5] tracking-[-0.28px] text-faq-text [overflow-wrap:anywhere]',
  'max-dapp:text-[13px]',
)

const faqTriggerClass =
  'flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent p-0 text-left outline-none'

const variantStyles = {
  home: {
    list: cn(
      revealClass(),
      'mx-auto mt-10 grid w-[min(100%,960px)] gap-3 max-dapp:mt-5 max-dapp:gap-2.5',
    ),
  },
  dapp: {
    list: 'mt-3.5 grid w-full gap-3 max-dapp:gap-2.5',
  },
} as const

function FaqChevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-[18px] shrink-0', open ? 'text-primary' : 'text-foreground/40')}
      fill="none"
      height="18"
      viewBox="0 0 18 18"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={open ? 'M4.5 11.25L9 6.75L13.5 11.25' : 'M13.5 6.75L9 11.25L4.5 6.75'}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  )
}

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

        return (
          <Accordion.Item
            className={cn(faqCardClass, 'group', itemClassName)}
            data-faq-item
            data-faq-motion={motionEnabled ? 'true' : 'false'}
            key={`${index}-${String(item.q)}`}
            value={itemValue}
          >
            <div className={faqCardBodyClass}>
              <Accordion.Header className="m-0 w-full">
                <Accordion.Trigger className={faqTriggerClass} data-faq-trigger>
                  <span className={faqQuestionClass}>{item.q}</span>
                  <FaqChevron open={isOpen} />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content
                className="w-full overflow-hidden"
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
                    <p className={faqAnswerClass}>{item.a}</p>
                  </div>
                </div>
              </Accordion.Content>
            </div>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
