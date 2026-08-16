/**
 * 资金路径写流程编排：预检 → 按需授权 → 实时重读复核 → 写入
 *
 * 授权等待期间链上状态可能已变，所以授权后必须再读再判定，不能沿用预检快照。
 * 仅预检阶段允许「额度不足」等原因先走授权；实时复核再阻断时直接失败，不再授权消除。
 *
 * 有 `approve` 时必须同时给出 `softPreBlocks`（可软过的预检原因）；二者同配，避免漏配。
 *
 * @param args.readSnapshot 读取当前快照
 * @param args.evaluate 按快照判定是否阻断，返回阻断原因或 null
 * @param args.mapBlockError 阻断原因 → 抛出的错误
 * @param args.write 实时复核通过后执行写入（传入最新快照）
 */

type ApproveThenLiveWriteBase<TSnapshot, TReason> = {
  readSnapshot: () => Promise<TSnapshot>
  evaluate: (snapshot: TSnapshot) => TReason | null
  mapBlockError: (reason: TReason) => unknown
  write: (live: TSnapshot) => Promise<unknown>
}

/** 无授权：不得带 softPreBlocks。 */
type ApproveThenLiveWriteWithoutApprove<TSnapshot, TReason> = ApproveThenLiveWriteBase<
  TSnapshot,
  TReason
> & {
  approve?: undefined
  softPreBlocks?: undefined
}

/** 有授权：必须声明预检阶段可软过的原因。 */
type ApproveThenLiveWriteWithApprove<TSnapshot, TReason> = ApproveThenLiveWriteBase<
  TSnapshot,
  TReason
> & {
  approve: () => Promise<unknown>
  softPreBlocks: ReadonlyArray<TReason>
}

export type ApproveThenLiveWriteArgs<TSnapshot, TReason> =
  | ApproveThenLiveWriteWithoutApprove<TSnapshot, TReason>
  | ApproveThenLiveWriteWithApprove<TSnapshot, TReason>

export async function approveThenLiveWrite<TSnapshot, TReason>(
  args: ApproveThenLiveWriteArgs<TSnapshot, TReason>,
): Promise<void> {
  const pre = await args.readSnapshot()
  const preBlock = args.evaluate(pre)
  if (preBlock != null) {
    const soft = args.approve != null && args.softPreBlocks.includes(preBlock)
    if (!soft) throw args.mapBlockError(preBlock)
  }

  if (args.approve) await args.approve()

  const live = await args.readSnapshot()
  const liveBlock = args.evaluate(live)
  if (liveBlock) throw args.mapBlockError(liveBlock)

  await args.write(live)
}
