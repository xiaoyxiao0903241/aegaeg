import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

export type DappProcessStep = {
  body: ReactNode
  title: ReactNode
}

/**
 * 运行机制步骤条（chrome only）。
 * - PC（`dapp:`）：横排圆标 + 水平连线（Stake `4450:223`）
 * - H5（`max-dapp`）：竖时间线 · 左轨圆标+竖线（`4665:1252`）
 */
export function DappProcessSteps({
  className,
  items,
}: {
  className?: string
  items: readonly DappProcessStep[]
}) {
  return (
    <Card className={cn('rounded-2xl p-6', className)} surface="elevated">
      <ol className="m-0 flex list-none flex-col p-0 dapp:flex-row dapp:items-start">
        {items.map((step, index) => {
          const isLast = index >= items.length - 1
          return (
            <li
              className={cn(
                // H5：左轨 + 文案；PC：上标号轨、下文案
                'flex gap-3',
                'dapp:grid dapp:min-w-0 dapp:flex-1 dapp:grid-cols-1 dapp:gap-3',
              )}
              key={index}
            >
              <div
                className={cn(
                  'flex w-7 shrink-0 flex-col items-center self-stretch',
                  'dapp:w-full dapp:flex-row dapp:items-center dapp:self-auto',
                )}
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
                  <Text as="span" className="font-semibold" tone="inverse" variant="copy">
                    {index + 1}
                  </Text>
                </span>
                {!isLast ? (
                  <span
                    aria-hidden
                    className={cn(
                      // H5 竖线 2px；PC 横线
                      'w-0.5 flex-1 bg-border',
                      'dapp:h-0.5 dapp:min-h-0 dapp:w-auto dapp:flex-1',
                    )}
                  />
                ) : null}
              </div>
              <div
                className={cn(
                  'grid min-w-0 flex-1 content-start gap-1 pt-1',
                  !isLast && 'pb-4',
                  'dapp:gap-3 dapp:pt-0 dapp:pb-0',
                )}
              >
                <Text as="strong" className="font-semibold" variant="detail">
                  {step.title}
                </Text>
                <Text as="p" className="m-0 text-foreground/40" variant="copy">
                  {step.body}
                </Text>
              </div>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
