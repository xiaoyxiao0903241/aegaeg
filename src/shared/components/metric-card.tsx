import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { revealClass } from '~/shared/lib/reveal'

export type MetricCardProps = {
  children?: ReactNode
  className?: string
  hint?: ReactNode
  hintClassName?: string
  label: ReactNode
  value: ReactNode
  valueClassName?: string
  /** FAQ / static copy: disable count+pop. Default true for metric rails. */
  animateValue?: boolean
}

const metricCard = tv({
  slots: {
    root: [revealClass(), 'flex flex-col items-start gap-1.5 rounded-md px-4 py-3.5'],
    value: 'text-lg leading-[1.3] tracking-[-0.02em] max-dapp:text-sm max-dapp:leading-[1.2]',
    hint: 'mt-1.5',
  },
})

export function MetricCard({
  children,
  className,
  hint,
  hintClassName,
  label,
  value,
  valueClassName,
  animateValue = true,
}: MetricCardProps) {
  const styles = metricCard()
  const renderedValue =
    typeof value === 'string' ? <CountValue animate={animateValue} text={value} /> : value

  return (
    <Card as="article" surface="elevated" className={styles.root({ class: className })} data-reveal>
      <Card.Label tone="muted-foreground">{label}</Card.Label>
      <Card.Value className={styles.value({ class: valueClassName })}>{renderedValue}</Card.Value>
      {hint ? (
        <Card.Description className={styles.hint({ class: hintClassName })}>
          {typeof hint === 'string' ? <CountValue animate={animateValue} text={hint} /> : hint}
        </Card.Description>
      ) : null}
      {children}
    </Card>
  )
}
