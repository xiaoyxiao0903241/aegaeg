import {
  estimateAgxFromUsd1,
  phaseDiscountBps,
  type PresalePhaseOnChain,
} from '~/core/presale/presale-math'
import {
  formatBlockTime,
  formatDiscountBps,
  formatGroupedNumber,
  formatShortAddress,
  TABLE_EMPTY,
} from '~/shared/api/format-display'
import type { SalesLogItem } from '~/shared/api/types'

export type SalesLogRowFormatOptions = {
  agxPriceUsd?: number
  phases?: ReadonlyArray<PresalePhaseOnChain>
}

function formatSalesLogAgx(item: SalesLogItem, options: SalesLogRowFormatOptions): string {
  const agxPriceUsd = options.agxPriceUsd ?? 0
  const tokens = Number(item.tokens)
  if (Number.isFinite(tokens) && tokens > 0) {
    return formatGroupedNumber(tokens, { digits: 2 })
  }

  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) return TABLE_EMPTY

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    phaseDiscountBps(item.phase_id, options.phases),
    agxPriceUsd,
  )
  return estimated > 0 ? formatGroupedNumber(estimated, { digits: 2 }) : TABLE_EMPTY
}

/**
 * 把销售记录映射为桌面表格行
 *
 * 列序为时间、金额、折扣、AGX 估算与交易哈希；
 * 交易哈希缺失或 AGX 无法估算时显示为空表标记。
 */
export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  options: SalesLogRowFormatOptions = {},
): string[] {
  return [
    formatBlockTime(item.block_time),
    formatGroupedNumber(Number(item.amount), { digits: 0, prefix: '$' }),
    formatDiscountBps(phaseDiscountBps(item.phase_id, options.phases)),
    formatSalesLogAgx(item, options),
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
  ]
}
