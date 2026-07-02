import { dappAssets } from '~/app/assets'
import { SWAP_CONFIG } from '~/config/swap'

export type SwapDirection = 'forward' | 'reverse'

export interface SwapPairToken {
  key: 'usd1' | 'usdt'
  symbol: string
  address: `0x${string}`
  decimals: number
  icon: string
}

export interface SwapPairTokens {
  sell: SwapPairToken
  buy: SwapPairToken
}

const USD1_TOKEN: SwapPairToken = {
  key: 'usd1',
  symbol: SWAP_CONFIG.tradePair.tokenA.symbol,
  address: SWAP_CONFIG.tradePair.tokenA.address,
  decimals: SWAP_CONFIG.tradePair.tokenA.decimals,
  icon: dappAssets.usd1,
}

const USDT_TOKEN: SwapPairToken = {
  key: 'usdt',
  symbol: SWAP_CONFIG.tradePair.tokenB.symbol,
  address: SWAP_CONFIG.tradePair.tokenB.address,
  decimals: SWAP_CONFIG.tradePair.tokenB.decimals,
  icon: dappAssets.usdt,
}

export function getSwapPairTokens(direction: SwapDirection): SwapPairTokens {
  return direction === 'forward'
    ? { sell: USD1_TOKEN, buy: USDT_TOKEN }
    : { sell: USDT_TOKEN, buy: USD1_TOKEN }
}
