import { create } from 'zustand'

import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'

type StakingPeriodsStore = {
  /** Shared with stake widget + aside — SSOT for remainingQuota period. */
  stakePeriod: StakePeriod
  /** Shared with bond widget + aside — SSOT for discount/cap per kind. */
  lpBondPeriod: BondPeriod
  burnBondPeriod: BondPeriod
  setStakePeriod: (period: StakePeriod) => void
  setBondPeriod: (kind: 'lp' | 'burn', period: BondPeriod) => void
}

/** Staking period UI state — separate from hub↔subview navigation. */
export const useStakingPeriodsStore = create<StakingPeriodsStore>((set) => ({
  stakePeriod: 'liquid',
  lpBondPeriod: '180',
  burnBondPeriod: '180',
  setStakePeriod: (period) => set({ stakePeriod: period }),
  setBondPeriod: (kind, period) =>
    set(kind === 'lp' ? { lpBondPeriod: period } : { burnBondPeriod: period }),
}))
