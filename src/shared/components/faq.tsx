import * as Accordion from '@radix-ui/react-accordion'
import { type ReactNode, useCallback, useMemo, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { CollapseChevron } from '~/shared/components/collapse-chevron'
import { Text } from '~/shared/components/text'
import { cn, revealClass } from '~/shared/lib/utils'

export type FaqItem = {
  a: ReactNode
  open?: boolean
  q: ReactNode
}

type FaqVariant = 'home' | 'dapp'

const faqStyles = tv({
  slots: {
    list: '',
    cardBody: [
      'flex w-full flex-col items-start',
      'group-data-[state=open]:gap-3 max-dapp:group-data-[state=open]:gap-2.5',
    ],
    question: 'min-w-px flex-[1_0_0] text-left wrap-anywhere',
    answer: 'w-full text-left wrap-anywhere',
    // 重置按钮默认粗体，让 Text `question` 控制字重
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
        // 只改颜色；字号字重由 Text `copy` 决定
        answer: 'text-muted-foreground',
      },
      dapp: {
        // 问句用 Text `question`
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

/**
 * 常见问题折叠列表
 *
 * 每条一个可展开卡片；DApp 版默认展开首条。
 *
 * @param items 问答条目
 * @param variant home（首页样式）/ dapp（DApp 内样式）
 * @param defaultOpenFirst 是否默认展开首条（dapp 默认开启）
 */
export function Faq({
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
  items: FaqItem[]
  variant?: FaqVariant
}) {
  const styles = faqStyles({ variant })
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
              className={cn('group', variant === 'dapp' && 'rounded-faq', itemClassName)}
              data-faq-item
              data-faq-motion={motionEnabled ? 'true' : 'false'}
            >
              <div className={styles.cardBody()}>
                <Accordion.Header className="m-0 w-full">
                  <Accordion.Trigger className={styles.trigger()} data-faq-trigger>
                    {/* DApp 问句用 headline，home 仍用 question */}
                    <Text
                      variant={variant === 'dapp' ? 'headline' : 'question'}
                      className={styles.question()}
                    >
                      {item.q}
                    </Text>
                    <CollapseChevron open={isOpen} />
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
