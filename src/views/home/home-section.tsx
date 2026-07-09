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
      /** 标准 content section — PC py-30，H5 pt-0 pb-14 */
      content: { root: 'py-30 max-dapp:pt-0 max-dapp:pb-14' },
      /** FAQ section — 含 min-height 约束 */
      faq: { root: 'py-30 dapp:min-h-192 max-dapp:min-h-128 max-dapp:py-14' },
    },
    container: {
      none: {},
      /** Full-width page gutter — roadmap, FAQ, icon features, partners */
      page: { container: 'container' },
      /** H5 内容区 — 保留 container gutter；仅收窄最大宽度 */
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
