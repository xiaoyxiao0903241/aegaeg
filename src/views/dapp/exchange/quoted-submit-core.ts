import type { WriteSession } from '~/web3/wallet/require-write-session'

export type QuotedSubmitExecute = (helpers: {
  session: WriteSession
  assertStillSubmittable: (live?: {
    sellBalance: bigint
  }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
}) => Promise<void>

/** Shared surface for flash / market / burn quoted submits. */
export type QuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: QuotedSubmitExecute,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}
