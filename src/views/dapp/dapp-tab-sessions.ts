import type {
  BurnExchangeState,
  FlashExchangeState,
  MarketTradeState,
  TurbineExchangeState,
} from '~/views/dapp/exchange/exchange-session-hosts'
import type { GenesisWidgetState } from '~/views/dapp/genesis/genesis-session-host'

/** 左右两栏共用的 Widget 会话状态，由 Tab 父层统一提升。 */
export type DappTabSessions = {
  trade: MarketTradeState | null
  flash: FlashExchangeState | null
  burn: BurnExchangeState | null
  turbine: TurbineExchangeState | null
  genesis: GenesisWidgetState | null
}
