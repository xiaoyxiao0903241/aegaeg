/**
 * Money-path choreography after the unknown-receipt envelope:
 * preflight check → optional approve → live re-read + check → write.
 * Domain owns evaluate / error mapping; this owns order only.
 */
export async function approveThenLiveWrite<TSnapshot, TReason>(args: {
  readSnapshot: () => Promise<TSnapshot>
  evaluate: (snapshot: TSnapshot) => TReason | null
  mapBlockError: (reason: TReason) => unknown
  approve?: () => Promise<unknown>
  write: (live: TSnapshot) => Promise<unknown>
}): Promise<void> {
  const pre = await args.readSnapshot()
  const preBlock = args.evaluate(pre)
  if (preBlock) throw args.mapBlockError(preBlock)

  if (args.approve) await args.approve()

  const live = await args.readSnapshot()
  const liveBlock = args.evaluate(live)
  if (liveBlock) throw args.mapBlockError(liveBlock)

  await args.write(live)
}
