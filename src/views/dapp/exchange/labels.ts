import { LIVE_DATA_PLACEHOLDER } from '~/shared/presenters/format'

/**
 * 拼接 `标签: 值` 余额文案（供 AmountBox / CountValue 使用）
 *
 * 余额未知时印 `--`，禁止空串，也不用 0 冒充已读到的数。
 */
export function formatExchangeBalanceLabel({
  label,
  value,
}: {
  label: string
  value: string
}): string {
  const body = value.trim() === '' ? LIVE_DATA_PLACEHOLDER : value
  return `${label}: ${body}`
}
