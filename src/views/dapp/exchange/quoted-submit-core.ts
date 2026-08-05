import type { WriteSession } from '~/web3/wallet/require-write-session'

export type QuotedSubmitExecute = (helpers: {
  session: WriteSession
  assertStillSubmittable: (live?: {
    sellBalance: bigint
  }) => Promise<{ amountOutMin: bigint; quotedOut: bigint }>
}) => Promise<void>

/** 闪电兑换 / 市价交易 / 销毁共用的报价提交流程接口。 */
export type QuotedSubmitCore = {
  debouncedAmountIn: bigint
  runQuotedSubmit: (
    run: QuotedSubmitExecute,
  ) => Promise<{ ok: true } | { ok: false; error: unknown | null }>
}
