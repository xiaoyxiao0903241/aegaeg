import type { ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { Reveal } from '~/shared/components/reveal'
import { Text, type TextProps } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 行内提示外观
 *
 * 两种 tone 均无描边，正文统一 `muted-foreground`；仅底色区分语义。
 * - `destructive`：错误 / 阻断（浅红 wash）
 * - `notice`：机制说明（珊瑚 soft）
 *
 * 文案排版交给 Text；外间距由调用方控制。
 */
export const inlineAlert = tv({
  base: 'rounded-md border-0 text-muted-foreground',
  variants: {
    tone: {
      destructive: 'bg-destructive/10',
      notice: 'bg-coral-wash',
    },
    density: {
      /** 组件内紧凑提示（交易 / 闪电兑换） */
      compact: 'px-3.5 py-2.5',
      /** 页面级 / 弹窗说明（贴稿 p-3） */
      comfortable: 'p-3',
    },
  },
  defaultVariants: {
    tone: 'destructive',
    density: 'compact',
  },
})

export type InlineAlertDensity = NonNullable<VariantProps<typeof inlineAlert>['density']>
export type InlineAlertTone = NonNullable<VariantProps<typeof inlineAlert>['tone']>

export type InlineAlertProps = Omit<TextProps, 'tone' | 'variant'> & {
  children: ReactNode
  density?: InlineAlertDensity
  /** 默认 destructive；说明类用 notice */
  tone?: InlineAlertTone
  /** 传入时走高度/透明度缓动；省略则始终渲染（无动画） */
  open?: boolean
}

/**
 * 行内提示
 *
 * @param tone destructive（默认）/ notice（珊瑚软底说明）
 * @param density compact（组件内）/ comfortable（弹窗说明）
 * @param open 可选；传入后显隐带缓动
 */
export function InlineAlert({
  as = 'p',
  children,
  className,
  density = 'compact',
  open,
  tone = 'destructive',
  ...props
}: InlineAlertProps) {
  const alert = (
    <Text
      as={as}
      variant="copy"
      tone="muted-foreground"
      className={cn(inlineAlert({ density, tone }), className)}
      {...props}
    >
      {children}
    </Text>
  )

  if (open === undefined) return alert
  return <Reveal open={open}>{alert}</Reveal>
}
