import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { DappPillTabs } from '~/app/shell/components/dapp-pill-tabs'
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

export function RewardsHistoryPillTabs({
  'aria-label': ariaLabel,
  onChange,
  options,
  value,
}: {
  'aria-label': string
  onChange: (value: string) => void
  options: Array<{ label: string; value: string }>
  value: string
}) {
  const styles = rewardsHistorySection()
  return (
    <DappPillTabs
      ariaLabel={ariaLabel}
      className={styles.pillTabs()}
      items={options.map((option) => ({
        active: option.value === value,
        label: option.label,
      }))}
      onSelect={(index) => {
        const next = options[index]
        if (next) onChange(next.value)
      }}
    />
  )
}
