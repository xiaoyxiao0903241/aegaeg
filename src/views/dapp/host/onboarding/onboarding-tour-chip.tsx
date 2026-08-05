import { Text } from '~/shared/components/text'
import { cn } from '~/shared/lib/utils'

/**
 * 顶部栏「新手教程」入口，点击重播引导；未完成时右上角带提示点。
 */
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
