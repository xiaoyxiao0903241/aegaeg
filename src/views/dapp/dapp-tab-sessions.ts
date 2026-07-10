import type { FlashSwapState, TradeSwapState } from '~/views/dapp/swap/swap-session-hosts'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

/** Lifted widget sessions shared by left Widget + right Content columns. */
export type DappTabSessions = {
  trade: TradeSwapState | null
  flash: FlashSwapState | null
  genesis: GenesisWidgetState | null
}
