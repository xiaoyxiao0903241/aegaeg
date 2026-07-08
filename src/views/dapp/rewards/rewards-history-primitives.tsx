import type { ComponentProps, ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { Segment } from '~/shared/ui/segment'
import { revealClass } from '~/shared/lib/reveal'

const rewardsHistorySection = tv({
  slots: {
    reveal: revealClass(),
    pillTabs: 'flex items-center justify-start gap-2',
  },
})

export function RewardsHistoryReveal({ children }: { children: ReactNode }) {
  const styles = rewardsHistorySection()
  return (
    <div className={styles.reveal()} data-reveal>
      {children}
    </div>
  )
}

export function RewardsHistoryPillTabs(props: ComponentProps<typeof Segment>) {
  const styles = rewardsHistorySection()
  return <Segment {...props} className={styles.pillTabs()} />
}

export const rewardsHistoryTableHead = tv({
  base: '',
})
