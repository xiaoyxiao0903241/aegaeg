import { tv } from 'tailwind-variants'
import * as Accordion from '@radix-ui/react-accordion'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export type FaqListItem = {
  a: ReactNode
  open?: boolean
  q: ReactNode
}

type FaqListVariant = 'home' | 'dapp'

const faqList = tv({
  slots: {
    list: '',
    cardBody: [
      'flex w-full flex-col items-start px-6 py-4.5',
      'max-dapp:px-4 max-dapp:py-3.5',
      'group-data-[state=open]:gap-3 max-dapp:group-data-[state=open]:gap-2.5',
    ],
    question: 'min-w-px flex-[1_0_0] text-left [overflow-wrap:anywhere]',
    answer: 'w-full text-left [overflow-wrap:anywhere]',
    trigger:
      'flex w-full cursor-pointer items-center justify-between gap-0 border-0 bg-transparent p-0 text-left text-inherit outline-none',
  },
  variants: {
    variant: {
      home: {
        list: cn(
          revealClass(),
          'mx-auto mt-10 grid w-full max-w-240 gap-3 max-dapp:mt-5 max-dapp:max-w-none max-dapp:gap-2.5',
        ),
        answer: 'text-sm font-normal leading-[1.5] text-faq max-dapp:text-xs',
      },
      dapp: {
        list: 'grid w-full gap-3 max-dapp:gap-2.5',
        answer: 'my-0 py-[1em] leading-[1.5] text-faq max-dapp:text-xs',
      },
    },
  },
  defaultVariants: {
    variant: 'home',
  },
})

/** FAQ chevron — CSS rotate/color via `[data-faq-item][data-state]`. */
function FaqChevron() {
  return (
    <svg
      aria-hidden="true"
      className="faq-chevron size-[1.125rem] shrink-0"
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.5 6.75L9 11.25L13.5 6.75"
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
  const styles = faqList({ variant })
  const openFirst = defaultOpenFirst ?? variant === 'dapp'

  const defaultValue = useMemo(() => {
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      if (item.open ?? (openFirst && index === 0)) {
        return String(index)
      }
    }
    return ''
  }, [items, openFirst])

  const [value, setValue] = useState(defaultValue)
  const [interacted, setInteracted] = useState<Set<string>>(new Set())

  const handleValueChange = useCallback(
    (next: string) => {
      setValue(next)
      setInteracted((prev) => {
        const changed = new Set(prev)
        for (let i = 0; i < items.length; i++) {
          const itemValue = String(i)
          const wasOpen = defaultValue === itemValue
          const isOpen = next === itemValue
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
      if (value === itemValue) {
        handleValueChange('')
      }
    },
    [handleValueChange, value],
  )

  return (
    <Accordion.Root
      className={cn(styles.list(), className)}
      collapsible
      data-reveal={dataReveal ?? true}
      onValueChange={handleValueChange}
      type="single"
      value={value}
    >
      {items.map((item, index) => {
        const itemValue = String(index)
        const wasInitiallyOpen = defaultValue === itemValue
        const motionEnabled = !wasInitiallyOpen || interacted.has(itemValue)
        const isOpen = value === itemValue

        return (
          <Accordion.Item asChild key={`${index}-${String(item.q)}`} value={itemValue}>
            <Card
              as="div"
              surface="soft"
              className={cn('group', itemClassName)}
              data-faq-item
              data-faq-motion={motionEnabled ? 'true' : 'false'}
            >
              <div className={styles.cardBody()}>
                <Accordion.Header className="m-0 w-full">
                  <Accordion.Trigger className={styles.trigger()} data-faq-trigger>
                    <Text variant="question" className={styles.question()}>
                      {item.q}
                    </Text>
                    <FaqChevron />
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
                      <Text
                        as="p"
                        variant={variant === 'home' ? 'copy' : 'detail'}
                        className={styles.answer()}
                      >
                        {item.a}
                      </Text>
                    </div>
                  </div>
                </Accordion.Content>
              </div>
            </Card>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
