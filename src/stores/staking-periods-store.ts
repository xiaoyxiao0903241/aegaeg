import { create } from 'zustand'

import type { BondPeriod, StakePeriod } from '~/core/staking/staking-period'

type StakingPeriodsStore = {
  /** 质押部件与侧栏共享——剩余配额周期的唯一来源。 */
  stakePeriod: StakePeriod
  /** 债券部件与侧栏共享——各类型折扣/上限的唯一来源。 */
  lpBondPeriod: BondPeriod
  burnBondPeriod: BondPeriod
  setStakePeriod: (period: StakePeriod) => void
  setBondPeriod: (kind: 'lp' | 'burn', period: BondPeriod) => void
}

/** 质押周期选择 UI 状态，与 hub↔子视图导航相互独立。 */
export const useStakingPeriodsStore = create<StakingPeriodsStore>((set) => ({
  stakePeriod: 'liquid',
  lpBondPeriod: '180',
  burnBondPeriod: '180',
  setStakePeriod: (period) => set({ stakePeriod: period }),
  setBondPeriod: (kind, period) =>
    set(kind === 'lp' ? { lpBondPeriod: period } : { burnBondPeriod: period }),
}))
