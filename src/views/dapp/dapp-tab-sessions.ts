import type {
  FlashExchangeState,
  MarketTradeState,
} from '~/views/dapp/exchange/exchange-session-hosts'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

/** Lifted widget sessions shared by left Widget + right Content columns. */
export type DappTabSessions = {
  trade: MarketTradeState | null
  flash: FlashExchangeState | null
  genesis: GenesisWidgetState | null
}
