import { create } from 'zustand'

import {
  type CobuildTeamSort,
  type CobuildTeamSortColumn,
  DEFAULT_COBUILD_TEAM_SORT,
  toggleCobuildTeamSort,
} from '~/core/rewards/cobuild-team-sort'

export type CobuildRecordsTab = 'cobuild' | 'equalize'
export type GrantRecordsTab = 'issue' | 'claim'
export type GenesisHistoryTab = 'referral' | 'team' | 'communityFund'

/** 共建奖详情会话：切 Tab 归页；隐藏 0 业绩默认开；团队表列头排序。 */
export const useCobuildSessionStore = create<{
  recordsTab: CobuildRecordsTab
  recordsPage: number
  directsPage: number
  hideZeroMarket: boolean
  teamSort: CobuildTeamSort
  setRecordsTab: (tab: CobuildRecordsTab) => void
  setRecordsPage: (page: number) => void
  setDirectsPage: (page: number) => void
  setHideZeroMarket: (hide: boolean) => void
  setTeamSortColumn: (column: CobuildTeamSortColumn) => void
}>((set) => ({
  recordsTab: 'cobuild',
  recordsPage: 1,
  directsPage: 1,
  hideZeroMarket: true,
  teamSort: DEFAULT_COBUILD_TEAM_SORT,
  setRecordsTab: (tab) => set({ recordsTab: tab, recordsPage: 1 }),
  setRecordsPage: (page) => set({ recordsPage: page }),
  setDirectsPage: (page) => set({ directsPage: page }),
  setHideZeroMarket: (hide) => set({ hideZeroMarket: hide, directsPage: 1 }),
  setTeamSortColumn: (column) =>
    set((state) => ({
      teamSort: toggleCobuildTeamSort(state.teamSort, column),
      directsPage: 1,
    })),
}))

/** 发展津贴详情会话。 */
export const useGrantSessionStore = create<{
  recordsTab: GrantRecordsTab
  recordsPage: number
  setRecordsTab: (tab: GrantRecordsTab) => void
  setRecordsPage: (page: number) => void
}>((set) => ({
  recordsTab: 'issue',
  recordsPage: 1,
  setRecordsTab: (tab) => set({ recordsTab: tab, recordsPage: 1 }),
  setRecordsPage: (page) => set({ recordsPage: page }),
}))

/** 创世荣誉历史会话。 */
export const useGenesisHistorySessionStore = create<{
  historyTab: GenesisHistoryTab
  historyPage: number
  setHistoryTab: (tab: GenesisHistoryTab) => void
  setHistoryPage: (page: number) => void
}>((set) => ({
  historyTab: 'referral',
  historyPage: 1,
  setHistoryTab: (tab) => set({ historyTab: tab, historyPage: 1 }),
  setHistoryPage: (page) => set({ historyPage: page }),
}))

/** 幸运奖详情会话；`selectedDate === null` 时默认请求不带 date，下拉展示接口返回的最新开奖日。 */
export const useLuckySessionStore = create<{
  selectedDate: string | null
  historyPage: number
  setSelectedDate: (date: string) => void
  setHistoryPage: (page: number) => void
}>((set) => ({
  selectedDate: null,
  historyPage: 1,
  setSelectedDate: (date) => set({ selectedDate: date }),
  setHistoryPage: (page) => set({ historyPage: page }),
}))

/** 推荐奖详情分页；隐藏 0 持仓默认开。 */
export const useReferralSessionStore = create<{
  recordsPage: number
  referralsPage: number
  hideZeroPosition: boolean
  setRecordsPage: (page: number) => void
  setReferralsPage: (page: number) => void
  setHideZeroPosition: (hide: boolean) => void
}>((set) => ({
  recordsPage: 1,
  referralsPage: 1,
  hideZeroPosition: true,
  setRecordsPage: (page) => set({ recordsPage: page }),
  setReferralsPage: (page) => set({ referralsPage: page }),
  setHideZeroPosition: (hide) => set({ hideZeroPosition: hide, referralsPage: 1 }),
}))
