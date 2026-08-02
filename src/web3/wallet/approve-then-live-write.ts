/**
 * Money-path choreography after the unknown-receipt envelope:
 * preflight check → optional approve → live re-read + check → write.
 * Domain owns evaluate / error mapping; this owns order only.
 *
 * `softPreBlocks`：pre 门闸可被 approve 消除的原因（如 insufficientAllowance）。
 * 有 `approve` 时不硬抛，先授权再 live 重读；live 仍 fail-closed。
 */
export async function approveThenLiveWrite<TSnapshot, TReason>(args: {
  readSnapshot: () => Promise<TSnapshot>
  evaluate: (snapshot: TSnapshot) => TReason | null
  mapBlockError: (reason: TReason) => unknown
  approve?: () => Promise<unknown>
  /** pre 阶段允许继续走 approve 的原因（须与 `approve` 同配）。 */
  softPreBlocks?: ReadonlyArray<TReason>
  write: (live: TSnapshot) => Promise<unknown>
}): Promise<void> {
  const pre = await args.readSnapshot()
  const preBlock = args.evaluate(pre)
  if (preBlock != null) {
    const soft = args.approve != null && (args.softPreBlocks?.includes(preBlock) ?? false)
    if (!soft) throw args.mapBlockError(preBlock)
  }

  if (args.approve) await args.approve()

  const live = await args.readSnapshot()
  const liveBlock = args.evaluate(live)
  if (liveBlock) throw args.mapBlockError(liveBlock)

  await args.write(live)
}
