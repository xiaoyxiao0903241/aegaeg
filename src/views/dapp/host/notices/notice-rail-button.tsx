import { useI18n } from '~/i18n/use-i18n'
import { dappAssets } from '~/shared/assets/dapp'
import { ClaimableDot } from '~/shared/components/claimable-dot'
import { Text, type TextProps } from '~/shared/components/text'
import { Tooltip } from '~/shared/components/tooltip'
import { railIconMask } from '~/views/dapp/host/primitives'

/**
 * 侧栏 / 抽屉的公告入口
 *
 * 不是 Tab：不高亮、不带动指示条。外观与相邻未选中项相同（同样是 button）。
 * 有未读时带红点；点开由队列决定未读或已读回看。空列表由 start 忽略，也不用 disabled，避免变灰。
 *
 * @param className 与相邻导航项同一套外观
 * @param hasUnread 是否有未读（红点）
 * @param iconClassName 图标遮罩盒
 * @param labelClassName 文案
 * @param labelTone 与相邻项同一字色
 * @param labelVariant 与相邻项同一字阶
 * @param onOpen 可点时打开弹窗
 * @param tooltip 有则包 PC 侧栏提示（抽屉不传）
 * @see docs/foundation/component-usage.md
 */
export function NoticeRailButton({
  className,
  hasUnread,
  iconClassName,
  labelClassName,
  labelTone,
  labelVariant,
  onOpen,
  tooltip,
}: {
  className: string
  hasUnread: boolean
  iconClassName: string
  labelClassName: string
  labelTone: TextProps['tone']
  labelVariant: TextProps['variant']
  onOpen: () => void
  tooltip?: string
}) {
  const { messages: t } = useI18n()
  const label = t.nav.notice

  const node = (
    <button
      aria-label={label}
      className={className}
      data-dapp-notice-rail=""
      onClick={onOpen}
      type="button"
    >
      <span aria-hidden className={iconClassName} style={railIconMask(dappAssets.notice)} />
      {hasUnread ? <ClaimableDot /> : null}
      <Text
        as="span"
        className={labelClassName}
        title={label}
        tone={labelTone}
        variant={labelVariant}
      >
        {label}
      </Text>
    </button>
  )

  if (!tooltip) return node

  return (
    <Tooltip content={tooltip} position="right">
      {node}
    </Tooltip>
  )
}
