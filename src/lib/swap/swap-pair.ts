import { dappAssets } from '~/app/assets'
import { SWAP_CONFIG } from '~/config/swap'

export type SwapDirection = 'forward' | 'reverse'

export interface SwapPairToken {
  key: 'usd1' | 'xx'
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
  symbol: SWAP_CONFIG.testPair.tokenA.symbol,
  address: SWAP_CONFIG.testPair.tokenA.address,
  decimals: SWAP_CONFIG.testPair.tokenA.decimals,
  icon: dappAssets.usd1,
}

const XX_TOKEN: SwapPairToken = {
  key: 'xx',
  symbol: SWAP_CONFIG.testPair.tokenB.symbol,
  address: SWAP_CONFIG.testPair.tokenB.address,
  decimals: SWAP_CONFIG.testPair.tokenB.decimals,
  icon: dappAssets.usdt,
}

export function getSwapPairTokens(direction: SwapDirection): SwapPairTokens {
  return direction === 'forward'
    ? { sell: USD1_TOKEN, buy: XX_TOKEN }
    : { sell: XX_TOKEN, buy: USD1_TOKEN }
}
