import type { ReactElement } from 'react'
import { tv } from 'tailwind-variants'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { cn } from '~/shared/lib/utils'
import { Card } from '~/shared/ui/card'
import { Text } from '~/shared/ui/text'

type AboutWash = 'lavender' | 'none'

/**
 * DApp about 轮播卡。
 * - 奖励 Figma `4297:213`：E3 · px16 py24 · lavender wash；人物仅 PC（`-scale-x-100` 朝左）
 * - 卡壳 **必须** `overflow-hidden`：稿 `overflow-clip`，wash / 人物均不得超出圆角
 * - 正文用 min-h + 换行增高；禁定高裁切（与右栏瓦不同：瓦曾用 h-18.5）
 * - 兑换 Token 卡仍走 `ExchangePromoCard`
 */
const aboutCard = tv({
  slots: {
    shell:
      'relative flex min-h-30 min-w-0 flex-col justify-center overflow-hidden rounded-2xl px-4 py-6 shadow-subtle',
    washLavender:
      'pointer-events-none absolute -top-2 right-0 h-42 w-96 bg-linear-to-r from-transparent to-(--rewards-carousel-wash)',
    body: 'relative z-1 grid min-w-0 gap-3',
    /** Figma 4297:213 mascot ≈101×143 → w-25 h-36；IP 水平翻转朝左；仅 desktop；壳 overflow-clip 裁切 */
    deco: 'pointer-events-none absolute top-2 right-4 z-2 h-36 w-25 -scale-x-100 object-contain object-bottom',
  },
  variants: {
    withDeco: {
      true: { body: 'max-w-xl' },
      false: { body: 'max-w-none' },
    },
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
  /** Figma IP 人物（H5 不渲染） */
  decoSrc?: string
  title: string
  /** `lavender`=奖励稿紫渐变；默认 none */
  wash?: AboutWash
}) {
  const isMobile = useMobileViewport()
  const showDeco = Boolean(decoSrc) && !isMobile
  const styles = aboutCard({ withDeco: showDeco })
  return (
    <Card as="article" surface="elevated" className={cn(styles.shell(), className)}>
      {wash === 'lavender' ? <div aria-hidden className={styles.washLavender()} /> : null}
      <div className={styles.body()}>
        <Text
          as="strong"
          className="leading-normal font-semibold wrap-break-word"
          variant="headline"
        >
          {title}
        </Text>
        <Text
          as="p"
          className="m-0 leading-normal wrap-break-word text-foreground/40"
          variant="copy"
        >
          {body}
        </Text>
        {action}
      </div>
      {showDeco ? <img alt="" aria-hidden className={styles.deco()} src={decoSrc} /> : null}
    </Card>
  )
}
