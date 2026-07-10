import { useEffect, useMemo } from 'react'
import { USD1_DECIMALS } from '~/core/presale/presale-math'
import { formatTokenAmountToNumber } from '~/core/swap/token-amount'
import { buildSeasonOptions } from '~/views/dapp/genesis/season/genesis-season-options'
import { buildGenesisPromoSnapshot } from '~/views/dapp/genesis/genesis-promo'
import {
  usePresaleActivePhaseQuery,
  usePresaleAgxPriceQuery,
  usePresalePhasesQuery,
} from '~/views/dapp/web3/use-presale-queries'
import { useGenesisPromoStore } from '~/stores/genesis-promo-store'

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
      seasonOptions,
    })
  }, [activeSeasonNumber, discountLabel, isLoading, promoSnapshot, seasonOptions, setPromo])

  return null
}
