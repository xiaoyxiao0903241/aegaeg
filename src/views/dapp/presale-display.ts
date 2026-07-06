import type { SalesLogItem } from '~/shared/api/types'
import { estimateAgxFromUsd1, resolvePhaseDiscountBps, type PresalePhaseOnChain } from '~/core/presale/presale-math'
import {
  TABLE_EMPTY,
  formatBlockTime,
  formatDiscountBps,
  formatShortAddress,
  formatUsd,
} from '~/shared/api/format-display'

export type SalesLogRowFormatOptions = {
  agxPriceUsd?: number
  phases?: ReadonlyArray<PresalePhaseOnChain>
}

function resolveSalesLogFormatOptions(
  options: number | SalesLogRowFormatOptions = {},
): Required<Pick<SalesLogRowFormatOptions, 'agxPriceUsd'>> & SalesLogRowFormatOptions {
  if (typeof options === 'number') {
    return { agxPriceUsd: options }
  }

  return {
    agxPriceUsd: options.agxPriceUsd ?? 0,
    phases: options.phases,
  }
}

function formatSalesLogAgx(
  item: SalesLogItem,
  options: number | SalesLogRowFormatOptions = {},
): string {
  const { agxPriceUsd, phases } = resolveSalesLogFormatOptions(options)
  const tokens = Number(item.tokens)
  if (Number.isFinite(tokens) && tokens > 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(tokens)
  }

  const amountUsd1 = Number(item.amount)
  if (!Number.isFinite(amountUsd1) || amountUsd1 <= 0) return TABLE_EMPTY

  const estimated = estimateAgxFromUsd1(
    amountUsd1,
    resolvePhaseDiscountBps(item.phase_id, phases),
    agxPriceUsd,
  )
  return estimated > 0
    ? new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(estimated)
    : TABLE_EMPTY
}

export function mapSalesLogToDesktopRow(
  item: SalesLogItem,
  options: number | SalesLogRowFormatOptions = {},
): string[] {
  const { phases } = resolveSalesLogFormatOptions(options)

  return [
    formatBlockTime(item.block_time),
    formatUsd(Number(item.amount), 0),
    formatDiscountBps(resolvePhaseDiscountBps(item.phase_id, phases)),
    formatSalesLogAgx(item, options),
    item.tx_hash ? formatShortAddress(item.tx_hash) : TABLE_EMPTY,
  ]
}

export function mapSalesLogToMobileRow(
  item: SalesLogItem,
  options: number | SalesLogRowFormatOptions = {},
): string[] {
  const { phases } = resolveSalesLogFormatOptions(options)

  return [
    formatBlockTime(item.block_time),
    formatUsd(Number(item.amount), 0),
    formatDiscountBps(resolvePhaseDiscountBps(item.phase_id, phases)),
    formatSalesLogAgx(item, options),
  ]
}
