/**
 * 资金路径写流程编排：预检 → 按需授权 → 实时重读复核 → 写入
 *
 * 域代码负责「读取快照 + 判定 + 错误映射」，本函数只负责顺序与授权消除逻辑。
 * `softPreBlocks` 是 pre 阶段可被授权消除的原因（如 insufficientAllowance）：
 * 存在 `approve` 且命中软阻断时不硬抛，先授权再实时重读；实时复核阶段
 * 一旦再阻断即抛错，不再尝试消除。
 *
 * @param args.readSnapshot 读取当前快照
 * @param args.evaluate 按快照判定是否阻断，返回阻断原因或 null
 * @param args.mapBlockError 阻断原因 → 抛出的错误
 * @param args.approve 可选授权步骤，仅当存在时才可消除软阻断
 * @param args.softPreBlocks pre 阶段允许继续走授权的原因，须与 `approve` 同配
 * @param args.write 实时复核通过后执行写入（传入最新快照）
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
