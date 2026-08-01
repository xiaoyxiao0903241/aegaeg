import {
  evaluateGenesisPostApprove,
  evaluateGenesisPurchaseAmountLive,
  type GenesisPostApprove,
  type PresalePhaseOnChain,
  type PresalePhaseRemaining,
  remainingPhaseAmount,
  remainingUserAmount,
} from '~/core/presale/presale-math'

/**
 * approve（或任意 await）后重读绑定/暂停/阶段额度，禁闭包渲染快照。
 */
export async function fetchLiveGenesisPostApprove(args: {
  address: string | undefined
  purchaseAmount: bigint
  activePhase: PresalePhaseOnChain
  fetchIsBound: (address: string) => Promise<boolean>
  fetchPaused: () => Promise<boolean>
  fetchPhaseRemaining: (address: string, phaseIndex: number) => Promise<PresalePhaseRemaining>
}): Promise<GenesisPostApprove> {
  if (!args.address) {
    return { ok: false, reason: 'not_bound' }
  }

  try {
    const [isBound, isPaused, phaseRemaining] = await Promise.all([
      args.fetchIsBound(args.address),
      args.fetchPaused(),
      args.fetchPhaseRemaining(args.address, args.activePhase.index),
    ])
    const post = evaluateGenesisPostApprove({
      isBound,
      isPaused,
      isPausedUnknown: false,
    })
    if (!post.ok) return post

    const phaseLeft = remainingPhaseAmount(phaseRemaining, args.activePhase)
    const userLeft = remainingUserAmount(
      phaseRemaining,
      args.activePhase,
      args.activePhase.maxAmount,
    )
    if (
      !evaluateGenesisPurchaseAmountLive({
        purchaseAmount: args.purchaseAmount,
        remainingPhaseAmount: phaseLeft,
        remainingUserAmount: userLeft,
      })
    ) {
      return { ok: false, reason: 'unavailable' }
    }
    return { ok: true }
  } catch {
    return { ok: false, reason: 'unavailable' }
  }
}
