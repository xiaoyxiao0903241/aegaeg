import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'

type PillOption = { label: string; value: string }

/** Shared coral pill-tabs header for rewards records tables. */
export function rewardsRecordsPillTabsHeader(args: {
  ariaLabel: string
  options: readonly PillOption[]
  value: string
  onChange: (value: string) => void
}) {
  const { ariaLabel, options, value, onChange } = args
  return (
    <DappPillTabs
      activeTone="coral"
      ariaLabel={ariaLabel}
      className="flex items-center justify-start gap-2"
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
