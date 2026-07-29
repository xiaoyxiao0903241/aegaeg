import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'

/** Figma topbar `chip/新手教程` (`4305:358`) — replay entry for OnboardingGuide. */
export function OnboardingTourChip({
  done,
  label,
  onClick,
}: {
  label: string
  done: boolean
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'relative inline-flex h-9 min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full',
        'border border-border bg-card px-3.5 text-xs leading-none font-semibold text-foreground',
        'duration-dapp-fast transition-[border-color,transform,background-color] ease-out',
        'hover:-translate-y-px hover:border-coral-hover-border hover:bg-coral-wash',
      )}
      data-onboarding-chip
      onClick={onClick}
      type="button"
    >
      <Text as="span" className="text-xs font-semibold" variant="caption">
        {label}
      </Text>
      {!done ? (
        <span
          aria-hidden
          className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-coral"
          data-onboarding-chip-dot
        />
      ) : null}
    </button>
  )
}
