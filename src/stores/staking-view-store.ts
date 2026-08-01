import { stakingHashForView, type StakingView } from '~/shared/config/dapp-deep-links'
import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { StakingView }

type StakingPeriods = {
  /** Shared with stake widget + aside — SSOT for remainingQuota period. */
  stakePeriod: StakePeriod
  /** Shared with bond widget + aside — SSOT for discount/cap per kind. */
  lpBondPeriod: BondPeriod
  burnBondPeriod: BondPeriod
  setStakePeriod: (period: StakePeriod) => void
  setBondPeriod: (kind: 'lp' | 'burn', period: BondPeriod) => void
}

/** Pure view/motion state — panel scroll lives in the shell (DOM side effect). */
export const useStakingViewStore = createDappSubviewStore<StakingView, StakingPeriods>({
  hub: 'hub',
  hashForView: stakingHashForView,
  extra: (set) => ({
    stakePeriod: 'liquid',
    lpBondPeriod: '180',
    burnBondPeriod: '180',
    setStakePeriod: (period) => set({ stakePeriod: period }),
    setBondPeriod: (kind, period) =>
      set(kind === 'lp' ? { lpBondPeriod: period } : { burnBondPeriod: period }),
  }),
})
