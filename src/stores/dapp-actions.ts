import { create } from 'zustand'
import {
  clearApiQueries,
  invalidateAfterGenesisPurchase,
  invalidateAfterReferralBind,
  invalidateAfterSwap,
  invalidateAfterTeamClaim,
  invalidateApiQueries,
} from '../lib/query/invalidate'

interface DappActionsState {
  afterAuthLogin: () => void
  afterAuthLogout: () => void
  afterSwap: (address: string, sellToken: string, buyToken: string) => void
  afterGenesisPurchase: (address: string, purchaseAmount?: bigint) => void
  afterTeamClaim: () => void
  afterReferralBind: (address: string) => void
}

export const useDappActions = create<DappActionsState>(() => ({
  afterAuthLogin: () => {
    void invalidateApiQueries()
  },
  afterAuthLogout: () => {
    clearApiQueries()
  },
  afterSwap: (address, sellToken, buyToken) => {
    invalidateAfterSwap(address, sellToken, buyToken)
  },
  afterGenesisPurchase: (address, purchaseAmount) => {
    invalidateAfterGenesisPurchase(address, purchaseAmount)
  },
  afterTeamClaim: () => {
    invalidateAfterTeamClaim()
  },
  afterReferralBind: (address) => {
    invalidateAfterReferralBind(address)
  },
}))
