import { useEffect, useMemo } from 'react'
import { formatTokenAmountToNumber } from '~/core/swap/token-amount'
import { buildSeasonOptions } from '~/views/dapp/genesis/season-options'
import { buildGenesisPromoSnapshot } from '~/views/dapp/genesis/genesis-promo'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresalePhasesQuery,
} from '~/hooks/queries/use-presale-queries'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

const USD1_DECIMALS = 18

/**
 * Shell-resident syncer: light presale reads → genesis-promo-store.
 * Mount once under DApp shell; do not mount inside GenesisWidgetProvider.
 */
export function GenesisPromoSync() {
  const setPromo = useGenesisPromoStore((state) => state.setPromo)
  const setNowSeconds = useGenesisPromoStore((state) => state.setNowSeconds)
  const nowSeconds = useGenesisPromoStore((state) => state.nowSeconds)

  const phasesQuery = usePresalePhasesQuery()
  const activePhaseQuery = usePresaleActivePhaseQuery()
  const agxPriceQuery = usePresaleAgxPriceQuery()

  useEffect(() => {
    const tick = () => setNowSeconds(Math.floor(Date.now() / 1000))
    tick()
    const timer = window.setInterval(tick, 15_000)
    return () => window.clearInterval(timer)
  }, [setNowSeconds])

  const phases = useMemo(() => phasesQuery.data ?? [], [phasesQuery.data])
  const activePhase = activePhaseQuery.data ?? null
  const phaseIndex = activePhase?.index ?? 0
  const agxPriceWei = agxPriceQuery.data ?? 0n
  const agxPriceUsd = useMemo(() => {
    const fromChain = formatTokenAmountToNumber(agxPriceWei, USD1_DECIMALS)
    return fromChain > 0 ? fromChain : 0
  }, [agxPriceWei])

  const discountBps = Number(activePhase?.discountBps ?? 0)
  const discountLabel = discountBps > 0 ? `-${(discountBps / 100).toFixed(0)}%` : '—'

  const seasonOptions = useMemo(
    () => buildSeasonOptions(phases, agxPriceUsd, nowSeconds),
    [agxPriceUsd, nowSeconds, phases],
  )

  const activeSeasonNumber = useMemo(() => {
    if (activePhase) return phaseIndex + 1
    const liveIndex = seasonOptions.findIndex((season) => season.active)
    if (liveIndex >= 0) return liveIndex + 1
    return 1
  }, [activePhase, phaseIndex, seasonOptions])

  const promoSnapshot = useMemo(
    () => buildGenesisPromoSnapshot(phases, activePhase, agxPriceUsd, nowSeconds),
    [activePhase, agxPriceUsd, nowSeconds, phases],
  )

  const isLoading =
    phasesQuery.isLoading || activePhaseQuery.isLoading || agxPriceQuery.isLoading

  useEffect(() => {
    setPromo({
      activeSeasonNumber,
      discountLabel,
      isLoading,
      promoSnapshot,
    })
  }, [activeSeasonNumber, discountLabel, isLoading, promoSnapshot, setPromo])

  return null
}
