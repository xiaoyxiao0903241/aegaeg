import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
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
      'flex w-full flex-col items-start',
      'group-data-[state=open]:gap-3 max-dapp:group-data-[state=open]:gap-2.5',
    ],
    question: 'min-w-px flex-[1_0_0] text-left wrap-anywhere',
    answer: 'w-full text-left wrap-anywhere',
    // font-normal: reset button UA bold so Text `question` weight is the owner
    trigger:
      'flex w-full cursor-pointer items-center justify-between gap-0 border-0 bg-transparent p-0 text-left font-normal text-inherit outline-none',
  },
  variants: {
    variant: {
      home: {
        list: cn(
          revealClass(),
          'mx-auto mt-10 grid w-full max-w-240 gap-3 max-dapp:mt-5 max-dapp:max-w-none max-dapp:gap-2.5',
        ),
        cardBody: 'px-6 py-4.5 max-dapp:px-4 max-dapp:py-3.5',
        // Color only — size/weight from Text `copy` (shadcn semantic; replaces legacy text-faq)
        answer: 'text-muted-foreground',
      },
      dapp: {
        // Figma DApp FAQ (hub `4273:242`): pad + gap via spacing tokens; question = Text `question`.
        list: 'grid w-full gap-3 max-dapp:gap-2.5',
        cardBody: 'px-4 py-4.5',
        answer: 'my-0 py-4 text-muted-foreground',
      },
    },
  },
  defaultVariants: {
    variant: 'home',
  },
})

/** FAQ chevron — Lucide；开合染色靠 currentColor / group. */
function FaqChevron() {
  return <ChevronDown aria-hidden className="faq-chevron size-4.5 shrink-0" strokeWidth={1.5} />
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
      if (!item) continue
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
              className={cn(
                'group',
                // Figma FAQ `4273:242` radius 12 → `rounded-faq` (soft default 2xl ≠ 稿).
                variant === 'dapp' && 'rounded-faq',
                itemClassName,
              )}
              data-faq-item
              data-faq-motion={motionEnabled ? 'true' : 'false'}
            >
              <div className={styles.cardBody()}>
                <Accordion.Header className="m-0 w-full">
                  <Accordion.Trigger className={styles.trigger()} data-faq-trigger>
                    {/* DApp FAQ 问句稿 16 semibold → headline；home 仍 question */}
                    <Text
                      variant={variant === 'dapp' ? 'headline' : 'question'}
                      className={styles.question()}
                    >
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
