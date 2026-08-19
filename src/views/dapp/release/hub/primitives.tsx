/**
 * 释放总览 UI 零件：入口卡、机制步骤卡、目的与税率卡。
 */
import { type ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { CountValue } from '~/shared/components/count-value'
import { InteractiveCard } from '~/shared/components/interactive-card'
import { Steps } from '~/shared/components/steps'
import { Text } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { cn } from '~/shared/lib/utils'

function EntryRoot({
  'aria-label': ariaLabel,
  children,
  className,
  onClick,
  tourId,
  'data-slot-id': dataSlotId,
}: {
  'aria-label': string
  children: ReactNode
  className?: string
  onClick: () => void
  tourId?: string
  'data-slot-id'?: string
}) {
  return (
    <InteractiveCard
      aria-label={ariaLabel}
      className="grid"
      data-slot-id={dataSlotId}
      hitArea="overlay"
      onClick={onClick}
      tourId={tourId}
    >
      {/* 不加 relative：红点才能锚到整张卡，而不是标题行 */}
      <div className={cn('pointer-events-none z-10 flex flex-col', className)}>{children}</div>
    </InteractiveCard>
  )
}

function EntryTitleGroup({ children }: { children: ReactNode }) {
  return <div className="flex items-center justify-between gap-3">{children}</div>
}

function EntryTitle({ children }: { children: ReactNode }) {
  return (
    <Text as="span" className="min-w-0 font-semibold" variant="detail">
      {children}
    </Text>
  )
}

function EntryPercent({ hint, value }: { hint: string; value: string }) {
  return (
    <div className="pointer-events-auto flex shrink-0 items-center gap-1">
      <Text as="span" variant="detail">
        <CountValue text={value} />
      </Text>
      <Tooltip.Info className="size-3 text-foreground [&_svg]:size-3" content={hint} />
    </div>
  )
}

/** 释放入口卡（组合组件）：释放队列 / 缓冲池总览入口 */
export const ReleaseEntryCard = Object.assign(EntryRoot, {
  TitleGroup: EntryTitleGroup,
  Title: EntryTitle,
  Percent: EntryPercent,
})

/** 释放机制步骤卡：居中展示进入释放池前的流程步骤 */
export function ReleaseMechanismCard({
  steps,
}: {
  steps: ReadonlyArray<{ title: string; body: string }>
}) {
  return (
    <Card className="rounded-2xl p-6" data-slot-id="release-mechanism-steps" surface="elevated">
      <Steps activeIndex={2} align="center">
        {steps.map((step) => (
          <Steps.Item body={step.body} key={step.title} title={step.title} />
        ))}
      </Steps>
    </Card>
  )
}

/** 税率表高亮列：20 天与 60 天档 */
const TAX_HIGHLIGHT_PERIOD_INDEX = new Set([1, 3])

/** 释放目的与税率说明卡 */
export function ReleaseTaxCard({
  periods,
  purposeBody,
  purposeTitle,
  rates,
  taxPeriod,
  taxRate,
  taxTitle,
}: {
  periods: ReadonlyArray<string>
  purposeBody: string
  purposeTitle: string
  rates: ReadonlyArray<string>
  taxPeriod: string
  taxRate: string
  taxTitle: string
}) {
  return (
    <Card
      as="div"
      surface="elevated"
      className="flex flex-col gap-6 rounded-2xl p-6"
      data-slot-id="release-mechanism-meta"
    >
      <div className="grid gap-6 dapp:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
            {purposeTitle}
          </Text>
          <Text as="p" className="m-0 text-foreground/40" variant="caption">
            {purposeBody}
          </Text>
        </div>

        <div className="grid content-start gap-2">
          <Text as="p" className="m-0 font-medium text-foreground" variant="detail">
            {taxTitle}
          </Text>
          <div className="grid grid-cols-[auto_1fr] items-stretch gap-x-4">
            <div className="grid grid-rows-2 gap-4 py-2.5">
              <Text as="span" className="self-center text-foreground/40" variant="caption">
                {taxPeriod}
              </Text>
              <Text as="span" className="self-center text-foreground/40" variant="caption">
                {taxRate}
              </Text>
            </div>
            <div className="grid grid-cols-4 gap-0">
              {periods.map((period, i) => (
                <div
                  className={cn(
                    'grid grid-rows-2 gap-4 px-1 py-2.5 text-center',
                    TAX_HIGHLIGHT_PERIOD_INDEX.has(i) && 'rounded-sm bg-muted',
                  )}
                  data-slot-id={
                    i === 1 ? 'tax-highlight-20' : i === 3 ? 'tax-highlight-60' : undefined
                  }
                  key={period}
                >
                  <Text
                    as="span"
                    className="self-center font-medium text-foreground"
                    variant="caption"
                  >
                    {period}
                  </Text>
                  <Text
                    as="span"
                    className={cn(
                      'self-center font-semibold',
                      rates[i] === '1%' ? 'text-primary' : 'text-foreground',
                    )}
                    variant="caption"
                  >
                    {rates[i]}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
