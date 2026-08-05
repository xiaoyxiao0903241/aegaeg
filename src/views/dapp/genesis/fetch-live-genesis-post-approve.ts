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
 * 写操作后重读实时门闸状态
 *
 * 授权（或任意等待）之后重新读取绑定 / 暂停 / 阶段剩余额度，
 * 避免沿用闭包中的渲染快照；任一读取失败一律按不可用处理。
 *
 * @param args.address 钱包地址，缺失时直接判定未绑定
 * @param args.purchaseAmount 本次计划购买的金额
 * @param args.activePhase 当前预售阶段
 * @param args.fetchIsBound 读取推荐绑定状态的函数
 * @param args.fetchPaused 读取暂停状态的函数
 * @param args.fetchPhaseRemaining 读取阶段剩余额度的函数
 * @see docs/onchain-manual/contracts/presale.md
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
