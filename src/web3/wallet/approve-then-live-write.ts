/**
 * Money-path choreography after the unknown-receipt envelope:
 * preflight gate → optional approve → live re-read + gate → write.
 * Domain owns evaluate / error mapping; this owns order only.
 */
export async function approveThenLiveWrite<TSnapshot, TReason>(args: {
  readSnapshot: () => Promise<TSnapshot>
  evaluate: (snapshot: TSnapshot) => TReason | null
  mapGateError: (reason: TReason) => unknown
  approve?: () => Promise<unknown>
  write: (live: TSnapshot) => Promise<unknown>
}): Promise<void> {
  const pre = await args.readSnapshot()
  const preGate = args.evaluate(pre)
  if (preGate) throw args.mapGateError(preGate)

  if (args.approve) await args.approve()

  const live = await args.readSnapshot()
  const liveGate = args.evaluate(live)
  if (liveGate) throw args.mapGateError(liveGate)

  await args.write(live)
}
