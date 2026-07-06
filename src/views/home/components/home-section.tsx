import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { tv, type VariantProps } from 'tailwind-variants'
import { cn } from '~/shared/lib/utils'
import {
  homePageContainerClass,
  homeSectionContainerClass,
  homeSectionContentSpacingClass,
  homeSectionFaqSpacingClass,
} from '~/views/home/home-layout'

export const homeSectionVariants = tv({
  slots: {
    root: 'relative',
    container: '',
  },
  variants: {
    spacing: {
      none: {},
      content: { root: homeSectionContentSpacingClass },
      faq: { root: homeSectionFaqSpacingClass },
    },
    container: {
      none: {},
      page: { container: homePageContainerClass },
      content: { container: homeSectionContainerClass },
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
