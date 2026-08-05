import { DappPillTabs } from '~/app/shell/dapp-pill-tabs'

type PillOption = { label: string; value: string }

/**
 * 奖励记录表的 pill Tab 表头
 *
 * @param args.ariaLabel Tab 组无障碍标签
 * @param args.options Tab 选项
 * @param args.value 当前选中值
 * @param args.onChange 切换回调
 */
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
      className="justify-start"
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
