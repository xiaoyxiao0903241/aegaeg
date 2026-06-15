export interface PathQuote {
  path: string[]
  quotedOut: bigint
}

export function selectBestPath(quotes: PathQuote[]): string[] {
  if (quotes.length === 0) {
    throw new Error('At least one path quote is required')
  }

  return quotes.reduce((best, current) =>
    current.quotedOut > best.quotedOut ? current : best,
  ).path
}
