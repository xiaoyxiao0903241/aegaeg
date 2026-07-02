import { getAddress } from 'thirdweb/utils'

export function buildSwapPaths(
  tokenIn: string,
  tokenOut: string,
  wbnb: string,
): string[][] {
  return [
    [getAddress(tokenIn), getAddress(tokenOut)],
    [getAddress(tokenIn), getAddress(wbnb), getAddress(tokenOut)],
  ]
}
