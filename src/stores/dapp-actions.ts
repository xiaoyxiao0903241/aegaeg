import { create } from 'zustand'
import {
  clearApiQueries,
  invalidateAfterAuthLogin,
  invalidateAfterGenesisPhaseTransition,
  invalidateAfterGenesisPurchase,
  invalidateAfterReferralBind,
  invalidateAfterSwap,
  invalidateAfterTeamClaim,
  invalidateAfterWalletSwitch,
} from '~/lib/query/invalidate'
import type { DappTab } from '~/app/types'

interface DappActionsState {
  afterAuthLogin: (address?: string) => void
  afterAuthLogout: () => void
  afterWalletSwitch: (previousAddress?: string, nextAddress?: string, tab?: DappTab) => void
  afterGenesisPhaseTransition: (address?: string) => void
  afterSwap: () => void
  afterGenesisPurchase: (address: string, purchaseAmount?: bigint) => void
  afterTeamClaim: () => void
  afterReferralBind: () => void
}

export const useDappActions = create<DappActionsState>(() => ({
  afterAuthLogin: (address) => {
    invalidateAfterAuthLogin(address)
  },
  afterGenesisPhaseTransition: (address) => {
    invalidateAfterGenesisPhaseTransition(address)
  },
  afterAuthLogout: () => {
    clearApiQueries()
  },
  afterWalletSwitch: (previousAddress, nextAddress, tab) => {
    invalidateAfterWalletSwitch(previousAddress, nextAddress, tab)
  },
  afterSwap: () => {
    invalidateAfterSwap()
  },
  afterGenesisPurchase: (address, purchaseAmount) => {
    invalidateAfterGenesisPurchase(address, purchaseAmount)
  },
  afterTeamClaim: () => {
    invalidateAfterTeamClaim()
  },
  afterReferralBind: () => {
    invalidateAfterReferralBind()
  },
}))
