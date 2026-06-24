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

interface DappActionsState {
  afterAuthLogin: (address?: string) => void
  afterAuthLogout: () => void
  afterWalletSwitch: (previousAddress?: string, nextAddress?: string) => void
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
  afterWalletSwitch: (previousAddress, nextAddress) => {
    invalidateAfterWalletSwitch(previousAddress, nextAddress)
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
