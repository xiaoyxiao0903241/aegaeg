import type { ReactElement } from 'react'
import { tv } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

type AboutWash = 'lavender' | 'none'

/**
 * DApp about 轮播卡。
 * - 奖励 Figma `4297:213`：E3 · px16 py24 · lavender wash `4297:214` · 人物 `4585:1026`
 * - 兑换 Token 卡仍走 `ExchangePromoCard`（合约 CTA + rays）
 */
const aboutCard = tv({
  slots: {
    shell:
      'relative flex min-h-30 min-w-0 flex-col justify-center overflow-hidden rounded-2xl px-4 py-6 shadow-subtle',
    washLavender:
      'pointer-events-none absolute -top-2 right-0 h-42 w-96 bg-linear-to-r from-transparent to-(--rewards-carousel-wash)',
    body: 'relative z-1 grid max-w-xl gap-3',
    /** Figma mascot ≈101×143 → w-25 h-36 */
    deco: 'pointer-events-none absolute top-2 right-6.5 z-2 h-36 w-25 object-contain object-bottom',
  },
})

export function DappAboutCard({
  action,
  body,
  className,
  decoSrc,
  title,
  wash = 'none',
}: {
  action?: ReactElement
  body: string
  className?: string
  /** Figma/原型 IP 人物 */
  decoSrc?: string
  title: string
  /** `lavender`=奖励稿紫渐变；默认 none */
  wash?: AboutWash
}) {
  const styles = aboutCard()
  return (
    <Card as="article" surface="elevated" className={cn(styles.shell(), className)}>
      {wash === 'lavender' ? <div aria-hidden className={styles.washLavender()} /> : null}
      <div className={styles.body()}>
        <Text as="strong" className="truncate leading-normal font-semibold" variant="headline">
          {title}
        </Text>
        <Text as="p" className="m-0 leading-normal text-foreground/40" variant="copy">
          {body}
        </Text>
        {action}
      </div>
      {decoSrc ? <img alt="" aria-hidden className={styles.deco()} src={decoSrc} /> : null}
    </Card>
  )
}
