import { tv } from 'tailwind-variants'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

export type AccordionItem = {
  content: ReactNode
  open?: boolean
  title: ReactNode
}

type AccordionVariant = 'home' | 'dapp'

const accordionStyles = tv({
  slots: {
    list: '',
    cardBody: [
      'flex w-full flex-col items-start px-6 py-4.5',
      'max-dapp:px-4 max-dapp:py-3.5',
      'group-data-[state=open]:gap-3 max-dapp:group-data-[state=open]:gap-2.5',
    ],
    title: 'min-w-px flex-[1_0_0] text-left [overflow-wrap:anywhere]',
    content: 'w-full text-left [overflow-wrap:anywhere]',
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
        // 单处色 ≡4175 faq-text；不进 Text tone（text-[#…] 由 twMerge 盖掉默认 foreground）
        content: 'text-[#5b6472]',
      },
      dapp: {
        list: 'grid w-full gap-3 max-dapp:gap-2.5',
        content: 'text-[#5b6472]',
      },
    },
  },
  defaultVariants: {
    variant: 'home',
  },
})

function AccordionChevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={cn('size-[1.125rem] shrink-0', open ? 'text-primary' : 'text-foreground/40')}
      fill="none"
      viewBox="0 0 18 18"
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

export type AccordionProps = {
  className?: string
  'data-reveal'?: boolean
  defaultOpenFirst?: boolean
  itemClassName?: string
  items: AccordionItem[]
  variant?: AccordionVariant
}

export function Accordion({
  className,
  'data-reveal': dataReveal,
  defaultOpenFirst,
  itemClassName,
  items,
  variant = 'home',
}: AccordionProps) {
  const styles = accordionStyles({ variant })
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
    <AccordionPrimitive.Root
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
          <AccordionPrimitive.Item asChild key={`${index}-${String(item.title)}`} value={itemValue}>
            <Card
              as="div"
              surface="soft"
              className={cn('group', itemClassName)}
              data-faq-item
              data-faq-motion={motionEnabled ? 'true' : 'false'}
            >
              <div className={styles.cardBody()}>
                <AccordionPrimitive.Header className="m-0 w-full">
                  <AccordionPrimitive.Trigger className={styles.trigger()} data-faq-trigger>
                    <Text variant="question" className={styles.title()}>
                      {item.title}
                    </Text>
                    <AccordionChevron open={isOpen} />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content
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
                      {/* 4175 raw <p> kept UA margin (~1em); Tailwind preflight zeros it — restore via py. */}
                      <Text
                        as="p"
                        variant="detail"
                        className={cn(styles.content(), 'my-0 py-[1em]')}
                      >
                        {item.content}
                      </Text>
                    </div>
                  </div>
                </AccordionPrimitive.Content>
              </div>
            </Card>
          </AccordionPrimitive.Item>
        )
      })}
    </AccordionPrimitive.Root>
  )
}

/**
 * 兼容旧名 FaqList 的 thin wrapper。
 * TODO：按页替换后删除此导出。
 */
export function FaqList(props: Omit<AccordionProps, 'items'> & { items: Array<{ q: ReactNode; a: ReactNode; open?: boolean }> }) {
  const items = props.items.map((item) => ({ title: item.q, content: item.a, open: item.open }))
  return <Accordion {...props} items={items} />
}
