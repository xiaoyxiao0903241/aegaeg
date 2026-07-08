import type { ReactNode } from 'react'
import { tv } from 'tailwind-variants'
import { ProgressMeter } from '~/app/shell/components/progress-meter'
import { revealClass } from '~/shared/lib/reveal'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

const genesisContributionsSection = tv({
  slots: {
    root: cn(revealClass(), 'flex flex-col gap-3'),
    syncHint: 'm-0',
    progressHeader: 'grid gap-2.5',
    progressRow: 'flex items-center justify-between gap-3',
    progressValue: 'mt-0 text-right',
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
  return (
    <Text as="p" className={styles.syncHint()} tone="muted-foreground" variant="meta">
      {children}
    </Text>
  )
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
        <Text tone="foreground" variant="headline">
          {label}
        </Text>
        <Text
          as="strong"
          className={styles.progressValue()}
          tone="foreground"
          variant="headline"
        >
          {contributedLabel}
        </Text>
      </div>
      <ProgressMeter label={label} value={progress} />
    </div>
  )
}
