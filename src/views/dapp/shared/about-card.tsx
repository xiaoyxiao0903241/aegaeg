import type { ReactElement } from 'react'
import { tv } from 'tailwind-variants'

import { useMobileViewport } from '~/hooks/use-mobile-viewport'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

type AboutWash = 'lavender' | 'none'

/**
 * DApp 关于轮播卡。
 *
 * 奖励活动卡（渐变底、PC 展示人物）与兑换入口卡，供首页轮播展示。
 * 容器须 overflow-hidden，防止底色 / 人物超出圆角；卡内高度随内容增高。
 */
const aboutCard = tv({
  slots: {
    root: 'relative flex min-w-0 flex-col justify-center overflow-hidden rounded-2xl px-4 py-6 shadow-subtle',
    washLavender:
      'pointer-events-none absolute -top-2 right-0 w-96 bg-linear-to-r from-transparent to-(--rewards-carousel-wash)',
    body: 'relative z-1 grid min-w-0 gap-3',
    /** 装饰插画：水平翻转朝左，仅 PC 渲染，由容器 overflow-hidden 裁切。 */
    deco: 'pointer-events-none absolute top-2 right-4 z-2 w-25 -scale-x-100 object-contain object-bottom',
  },
  variants: {
    withDeco: {
      true: { body: 'max-w-xl' },
      false: { body: 'max-w-none' },
    },
  },
})

export function AboutCard({
  action,
  body,
  className,
  decoClassName,
  decoSrc,
  title,
  wash = 'none',
}: {
  action?: ReactElement
  body: string
  className?: string
  /** 覆盖装饰插画的默认尺寸与位置。 */
  decoClassName?: string
  /** 装饰插画（移动端不渲染） */
  decoSrc?: string
  title: string
  /** `lavender`=奖励卡紫色渐变底色；默认 none */
  wash?: AboutWash
}) {
  const isMobile = useMobileViewport()
  const showDeco = Boolean(decoSrc) && !isMobile
  const styles = aboutCard({ withDeco: showDeco })
  return (
    <Card as="article" surface="elevated" className={cn(styles.root(), className)}>
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
      {showDeco ? (
        <img alt="" aria-hidden className={cn(styles.deco(), decoClassName)} src={decoSrc} />
      ) : null}
    </Card>
  )
}
