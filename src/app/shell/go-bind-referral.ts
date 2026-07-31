import { useDappShellStore } from '~/stores/dapp-shell-store'

/** Open Community rail so the user can bind a referrer (need_referral / notBound). */
export function goBindReferral(): void {
  useDappShellStore.getState().selectTab('community')
}
