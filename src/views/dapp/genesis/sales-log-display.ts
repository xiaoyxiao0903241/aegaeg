import type { SalesLogItem } from '~/shared/api/types'
import {
  estimateAgxFromUsd1,
  phaseDiscountBps,
  type PresalePhaseOnChain,
} from '~/core/presale/presale-math'
import {
  formatGroupedNumber,
  TABLE_EMPTY,
  formatBlockTime,
  formatDiscountBps,
  formatShortAddress,
} from '~/shared/api/format-display'

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
