import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'

import { cn } from '~/shared/lib/utils'

export const homeSectionVariants = tv({
  slots: {
    root: 'relative',
    container: '',
  },
  variants: {
    spacing: {
      none: {},
      /** 标准内容区 */
      content: { root: 'py-30 max-dapp:pt-0 max-dapp:pb-14' },
      /** FAQ 区块：带最小高度约束 */
      faq: { root: 'py-30 dapp:min-h-192 max-dapp:min-h-128 max-dapp:py-14' },
    },
    container: {
      none: {},
      /** 通栏页面宽度：路线图、FAQ、特性卡、合作伙伴使用 */
      page: { container: 'container' },
      /** H5 内容区：保留 container 外边距，仅收窄最大宽度 */
      content: { container: 'container max-dapp:mx-auto max-dapp:max-w-90' },
    },
  },
  defaultVariants: {
    spacing: 'none',
    container: 'none',
  },
})

type HomeSectionProps = ComponentPropsWithoutRef<'section'> &
  VariantProps<typeof homeSectionVariants> & {
    children: ReactNode
    containerClassName?: string
  }

/**
 * 首页区块外壳
 *
 * 统一区块的纵向间距与内容容器宽度：spacing 控制上下留白，
 * container 决定是否包裹 .container 及是否收窄最大宽度。
 *
 * @param spacing 纵向间距档位
 * @param container 内容容器档位
 * @param children 区块内容
 */
export function HomeSection({
  children,
  className,
  containerClassName,
  spacing = 'none',
  container = 'none',
  ...props
}: HomeSectionProps) {
  const styles = homeSectionVariants({ spacing, container })
  const wrapContainer = container !== 'none'

  return (
    <section className={cn(styles.root(), className)} {...props}>
      {wrapContainer ? (
        <div className={cn(styles.container(), containerClassName)}>{children}</div>
      ) : (
        children
      )}
    </section>
  )
}
