import { useEffect, useMemo } from 'react'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmountToNumber } from '~/core/exchange/token-amount'
import { genesisPromoSnapshot } from '~/core/presale/genesis-promo'
import { seasonOptionsFromPhases } from '~/core/presale/genesis-season-options'
import { USD1_DECIMALS } from '~/core/presale/presale-math'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'
import { useWallClockSec } from '~/stores/wall-clock-store'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresalePhasesQuery,
} from '~/web3/presale/use-presale-queries'

/**
 * 创世促销数据同步器
 *
 * 挂在 DApp 宿主下、只挂载一次：读取预售各阶段、当前阶段与 AGX 价格等轻量查询，
 * 汇总成导航与促销位需要的快照，写入 genesis-promo-store。
 * 时钟取全局墙钟，不另开 interval。
 * 不要放进 GenesisSessionHost，避免重复挂载导致重复查询。
 */
export function GenesisPromoSync() {
  const setPromo = useGenesisPromoStore((state) => state.setPromo)
  const nowSeconds = useWallClockSec(true)

  const phasesQuery = usePresalePhasesQuery()
  const activePhaseQuery = usePresaleActivePhaseQuery()
  const agxPriceQuery = usePresaleAgxPriceQuery()

  const phases = useMemo(() => phasesQuery.data ?? [], [phasesQuery.data])
  const activePhase = activePhaseQuery.data ?? null
  const phaseIndex = activePhase?.index ?? 0
  const agxPriceWei = agxPriceQuery.data ?? ZERO_BI
  const agxPriceUsd = useMemo(() => {
    const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
    return fromChain > 0 ? fromChain : 0
  }, [agxPriceWei])

  const discountBps = Number(activePhase?.discountBps ?? 0)
  const discountLabel = discountBps > 0 ? `-${(discountBps / 100).toFixed(0)}%` : '—'

  const seasonOptions = useMemo(
    () => seasonOptionsFromPhases(phases, agxPriceUsd, nowSeconds),
    [agxPriceUsd, nowSeconds, phases],
  )

  const activeSeasonNumber = useMemo(() => {
    if (activePhase) return phaseIndex + 1
    const liveIndex = seasonOptions.findIndex((season) => season.active)
    if (liveIndex >= 0) return liveIndex + 1
    return 1
  }, [activePhase, phaseIndex, seasonOptions])

  const promoSnapshot = useMemo(
    () => genesisPromoSnapshot(phases, activePhase, agxPriceUsd, nowSeconds),
    [activePhase, agxPriceUsd, nowSeconds, phases],
  )

  const isLoading = phasesQuery.isLoading || activePhaseQuery.isLoading || agxPriceQuery.isLoading

  useEffect(() => {
    setPromo({
      activeSeasonNumber,
      discountLabel,
      isLoading,
      promoSnapshot,
      seasonOptions,
    })
  }, [activeSeasonNumber, discountLabel, isLoading, promoSnapshot, seasonOptions, setPromo])

  return null
}
