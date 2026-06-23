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
  afterSwap: (address: string, sellToken: string, buyToken: string) => void
  afterGenesisPurchase: (address: string, purchaseAmount?: bigint) => void
  afterTeamClaim: () => void
  afterReferralBind: (address: string) => void
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
