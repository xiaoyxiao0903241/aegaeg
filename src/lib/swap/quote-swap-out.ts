import { buildSwapPaths } from './build-swap-paths'
import { selectBestPath } from './select-best-path'

export interface QuoteSwapOutDeps {
  amountIn: bigint
  tokenIn: string
  tokenOut: string
  wbnb: string
  getAmountsOut: (amountIn: bigint, path: string[]) => Promise<readonly bigint[]>
}

export interface QuoteSwapOutResult {
  path: string[]
  quotedOut: bigint
}

export async function quoteSwapOut(deps: QuoteSwapOutDeps): Promise<QuoteSwapOutResult> {
  const { amountIn, tokenIn, tokenOut, wbnb, getAmountsOut } = deps
  const paths = buildSwapPaths(tokenIn, tokenOut, wbnb)
  const quotes = await Promise.all(
    paths.map(async (path) => {
      try {
        const amounts = await getAmountsOut(amountIn, path)
        return { path, quotedOut: amounts[amounts.length - 1] ?? 0n }
      } catch {
        return { path, quotedOut: 0n }
      }
    }),
  )

  const viable = quotes.filter((quote) => quote.quotedOut > 0n)
  if (viable.length === 0) {
    throw new Error('No viable swap path')
  }

  const path = selectBestPath(viable)
  const quotedOut = viable.find(
    (quote) => quote.path.length === path.length && quote.path.every((value, index) => value === path[index]),
  )?.quotedOut ?? 0n

  return { path, quotedOut }
}
