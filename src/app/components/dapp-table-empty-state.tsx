import { cn } from '~/lib/utils'
import { revealClass } from '~/lib/reveal'

type EmptyRowLayout = {
  desktop: string
  mobile: string
  cells: string[]
}

const rowLayouts = {
  contributions: {
    desktop:
      'grid-cols-[minmax(72px,0.9fr)_minmax(72px,0.8fr)_minmax(56px,0.6fr)_minmax(72px,0.9fr)_minmax(48px,0.5fr)]',
    mobile: 'max-[820px]:grid-cols-[minmax(56px,0.8fr)_1fr_minmax(56px,0.7fr)]',
    cells: ['', '', 'max-[820px]:hidden', '', 'max-[820px]:hidden'],
  },
  history: {
    desktop:
      'grid-cols-[minmax(72px,0.9fr)_minmax(72px,0.8fr)_minmax(96px,1.1fr)_minmax(72px,0.8fr)_minmax(40px,0.5fr)_minmax(56px,0.6fr)]',
    mobile: 'max-[820px]:grid-cols-[minmax(56px,0.8fr)_1fr_minmax(56px,0.7fr)]',
    cells: ['', '', 'max-[820px]:hidden', 'max-[820px]:hidden', '', 'max-[820px]:hidden'],
  },
  invites: {
    desktop:
      'grid-cols-[minmax(72px,1fr)_minmax(96px,1.4fr)_repeat(3,minmax(40px,0.7fr))]',
    mobile: 'max-[820px]:grid-cols-[minmax(56px,80px)_1fr_minmax(46px,56px)]',
    cells: ['', '', 'max-[820px]:hidden', 'max-[820px]:hidden', ''],
  },
} satisfies Record<string, EmptyRowLayout>

type DappTableEmptyStateVariant = keyof typeof rowLayouts

export function DappTableEmptyState({
  className,
  rows = 3,
  variant,
}: {
  className?: string
  rows?: number
  variant: DappTableEmptyStateVariant
}) {
  const layout = rowLayouts[variant]

  return (
    <div
      aria-hidden="true"
      className={cn(
        revealClass(),
        'overflow-hidden rounded-[18px] bg-card p-[30px_24px] shadow-card',
        'max-[820px]:border max-[820px]:border-border max-[820px]:p-[22px_16px] max-[820px]:shadow-none',
        className,
      )}
      data-reveal
    >
      <div className="grid w-full gap-3 max-[820px]:gap-[11px]">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            className={cn(
              'grid items-center gap-3.5 max-[820px]:gap-2.5',
              layout.desktop,
              layout.mobile,
            )}
            key={rowIndex}
          >
            {layout.cells.map((cellClassName, cellIndex) => (
              <span
                className={cn('h-3.5 rounded-lg bg-border max-[820px]:h-3', cellClassName)}
                key={cellIndex}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
