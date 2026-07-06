import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { ProgressMeter } from '~/app/components/progress-meter'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'

const genesisContributionsSection = tv({
  slots: {
    root: cn(revealClass(), 'flex flex-col gap-3'),
    syncHint: 'm-0 text-xs leading-normal text-muted-foreground',
    progressHeader: 'grid gap-2.5',
    progressRow:
      'flex items-center justify-between gap-3 text-xs font-semibold leading-[1.2] tracking-[-0.26px] text-foreground',
    progressValue: 'mt-0 text-right font-semibold',
  },
})

export function GenesisContributionsReveal({
  children,
}: {
  children: ReactNode
}) {
  const styles = genesisContributionsSection()
  return (
    <div className={styles.root()} data-reveal>
      {children}
    </div>
  )
}

export function GenesisContributionsSyncHint({ children }: { children: string }) {
  const styles = genesisContributionsSection()
  return <p className={styles.syncHint()}>{children}</p>
}

export function GenesisContributionsProgressHeader({
  contributedLabel,
  label,
  progress,
}: {
  contributedLabel: string
  label: string
  progress: number
}) {
  const styles = genesisContributionsSection()

  return (
    <div className={styles.progressHeader()}>
      <div className={styles.progressRow()}>
        <span>{label}</span>
        <strong className={styles.progressValue()}>{contributedLabel}</strong>
      </div>
      <ProgressMeter label={label} value={progress} />
    </div>
  )
}
