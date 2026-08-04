import type { ReactNode } from 'react'

import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

type RewardsStatCardProps = {
  label: ReactNode
  value?: ReactNode
  /** 与 value 同一基线行（稿 ≈ USD / 贡献 hint） */
  valueHint?: ReactNode
  hint?: ReactNode
  className?: string
  labelClassName?: string
  children?: ReactNode
}

/**
 * 奖励右栏瓦 — elevated e2 · 稿高约 77 作 **min**。
 * 字阶跟 Lucky/Figma：label copy13 medium 70% · value headline16 · hint copy 40%。
 */
export function RewardsStatCard({
  label,
  value,
  valueHint,
  hint,
  className,
  labelClassName,
  children,
}: RewardsStatCardProps) {
  return (
    <Card
      as="div"
      surface="elevated"
      className={cn('min-h-19.25 gap-1.5 overflow-visible rounded-2xl p-5', className)}
    >
      {children ?? (
        <>
          <Text
            as="p"
            className={cn('leading-none font-medium text-foreground/70', labelClassName)}
            variant="copy"
          >
            {label}
          </Text>
          {value != null ? (
            <div className="mt-1.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              <Text
                as="p"
                className="leading-none font-semibold wrap-break-word"
                variant="headline"
              >
                {value}
              </Text>
              {valueHint != null ? (
                <Text
                  as="p"
                  className="leading-none wrap-break-word text-foreground/40"
                  variant="copy"
                >
                  {valueHint}
                </Text>
              ) : null}
            </div>
          ) : null}
          {hint != null ? (
            <Text
              as="p"
              className="mt-1 leading-none wrap-break-word text-foreground/40"
              variant="copy"
            >
              {hint}
            </Text>
          ) : null}
        </>
      )}
    </Card>
  )
}
