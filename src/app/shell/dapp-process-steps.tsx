import type { ReactNode } from 'react'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

export type DappProcessStep = {
  body: ReactNode
  title: ReactNode
}

/**
 * 运行机制步骤条（chrome only）。
 * PC：横排圆标 + 水平连线（Stake 稿 `4450:223` ≈160h）；H5：竖排堆叠。
 */
export function DappProcessSteps({
  className,
  items,
}: {
  className?: string
  items: readonly DappProcessStep[]
}) {
  return (
    <Card
      className={cn(
        'flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-start sm:gap-0',
        className,
      )}
      surface="elevated"
    >
      {items.map((step, index) => (
        <div className="grid min-w-0 flex-1 gap-3" key={index}>
          <div className="flex w-full items-center">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary">
              <Text as="span" className="font-semibold" tone="inverse" variant="copy">
                {index + 1}
              </Text>
            </span>
            {index < items.length - 1 ? (
              <span aria-hidden className="ml-0 hidden h-0.5 min-w-0 flex-1 bg-border sm:block" />
            ) : null}
          </div>
          <Text as="strong" className="font-semibold" variant="detail">
            {step.title}
          </Text>
          <Text as="p" className="m-0 text-foreground/40" variant="copy">
            {step.body}
          </Text>
        </div>
      ))}
    </Card>
  )
}
