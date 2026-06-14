import { dappCardClass, dappTextClass } from '~/lib/dapp-styles'
import { homeCardClass, homeTextClass } from '~/lib/home-styles'
import { revealClass } from '~/lib/reveal'
import * as Accordion from '@radix-ui/react-accordion'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { cn } from '~/lib/utils'

export type FaqListItem = {
  answer: ReactNode
  open?: boolean
  optional?: boolean
  question: ReactNode
}

type FaqListVariant = 'home' | 'dapp'

const variantStyles = {
  home: {
    list: cn(
      revealClass(),
      'mx-auto mt-10 grid w-[min(100%,960px)] gap-3 max-[820px]:mt-5 max-[820px]:gap-2.5',
    ),
    item: homeCardClass({
      hover: 'shadow',
      className:
        'group overflow-hidden px-6 py-[18px] shadow-[0_6px_20px_oklch(22%_0.04_265_/_6%)] max-[820px]:min-h-[46px] max-[820px]:rounded-[14px] max-[820px]:px-4 max-[820px]:py-3.5 data-[state=closed]:max-[820px]:overflow-hidden',
    }),
    optional: 'max-[820px]:hidden',
    trigger:
      'flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent text-left outline-none text-[15px] font-semibold leading-[1.3] text-foreground max-[820px]:min-h-[18px] max-[820px]:text-sm',
    question: homeTextClass('faqQuestion'),
    answer: homeTextClass('faqAnswer', { tone: 'faq' }),
    arrow:
      'grid size-4 shrink-0 origin-center place-items-center text-faint transition-[color,transform] duration-200 ease-out group-data-[state=open]:text-primary group-data-[state=open]:rotate-180',
    answerPanel: 'overflow-hidden',
    answerInner:
      'opacity-0 transition-opacity duration-180 ease-out group-data-[state=open]:opacity-100',
  },
  dapp: {
    list: cn(revealClass(), 'mt-3.5 grid gap-3'),
    item: cn(
      dappCardClass('faq'),
      'group w-full max-w-full py-0',
      'group-data-[tab=rewards]/shell:max-[820px]:w-full group-data-[tab=rewards]/shell:max-[820px]:rounded-[14px] group-data-[tab=rewards]/shell:max-[820px]:border-0 group-data-[tab=rewards]/shell:max-[820px]:px-4 group-data-[tab=rewards]/shell:max-[820px]:shadow-faq',
    ),
    optional: '',
    trigger: cn(
      dappTextClass('faqSummary', { tone: 'ink' }),
      'w-full border-0 bg-transparent text-left outline-none',
      'max-[820px]:py-3.5 max-[820px]:text-[13px] max-[820px]:font-normal',
      'group-data-[tab=rewards]/shell:text-sm group-data-[tab=rewards]/shell:font-normal group-data-[tab=rewards]/shell:text-faq-text',
    ),
    question: 'min-w-0',
    answer: cn(
      dappTextClass('faqAnswer', { tone: 'body' }),
      'group-data-[tab=swap]/shell:max-[820px]:leading-normal group-data-[tab=rewards]/shell:max-[820px]:hidden',
    ),
    arrow:
      'grid size-4 shrink-0 origin-center place-items-center text-faint transition-[color,transform] duration-200 ease-out group-data-[state=open]:text-primary group-data-[state=open]:rotate-180',
    answerPanel: 'overflow-hidden',
    answerInner:
      'opacity-0 transition-opacity duration-180 ease-out group-data-[state=open]:opacity-100',
  },
} as const

export function FaqList({
  className,
  'data-reveal': dataReveal,
  defaultOpenFirst = false,
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

  const defaultValue = useMemo(
    () =>
      items.reduce<string[]>((acc, item, index) => {
        if (item.open ?? (defaultOpenFirst && index === 0)) {
          acc.push(String(index))
        }
        return acc
      }, []),
    [items, defaultOpenFirst],
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

  return (
    <Accordion.Root
      className={cn(styles.list, className)}
      data-reveal={dataReveal ? true : variant === 'dapp' ? true : undefined}
      onValueChange={handleValueChange}
      type="multiple"
      value={value}
    >
      {items.map((item, index) => {
        const itemValue = String(index)
        const animated = interacted.has(itemValue)
        return (
          <Accordion.Item
            className={cn(styles.item, item.optional && styles.optional, itemClassName)}
            data-faq-animated={animated ? true : undefined}
            data-faq-item
            key={`${index}-${String(item.question)}`}
            value={itemValue}
          >
            <Accordion.Trigger className={styles.trigger} data-faq-trigger>
              <span className={styles.question}>{item.question}</span>
              <span className={styles.arrow} aria-hidden="true">
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
            <Accordion.Content className={styles.answerPanel} data-faq-answer>
              <div className={cn(styles.answer, styles.answerInner)}>{item.answer}</div>
            </Accordion.Content>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
