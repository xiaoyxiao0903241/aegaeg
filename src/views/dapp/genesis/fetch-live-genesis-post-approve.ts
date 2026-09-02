import {
  evaluateGenesisPostApprove,
  evaluateGenesisPurchaseAmountLive,
  type GenesisPostApprove,
  isPhaseActive,
  type PresalePhaseOnChain,
  remainingPhaseAmount,
  remainingUserAmount,
} from '~/core/presale/presale-math'
import { bscReadClient } from '~/web3/bsc-read-client'
import { readPresalePaused, readUserPhaseRemainingAmount } from '~/web3/presale/presale-read'
import { readIsBindReferral } from '~/web3/referral/referral-read'

/**
 * 写操作后重读实时门闸状态
 *
 * 授权（或任意等待）之后重新读取绑定 / 暂停 / 阶段剩余额度，
 * 并用最新块时间确认阶段仍开放，避免沿用闭包中的渲染快照。
 *
 * @param args.address 钱包地址，缺失时直接判定未绑定
 * @param args.purchaseAmount 本次计划购买的金额
 * @param args.activePhase 当前预售阶段
 * @see docs/onchain-manual/contracts/presale.md
 */
export async function fetchLiveGenesisPostApprove(args: {
  address: string | undefined
  purchaseAmount: bigint
  activePhase: PresalePhaseOnChain
}): Promise<GenesisPostApprove> {
  if (!args.address) {
    return { ok: false, reason: 'not_bound' }
  }

  try {
    const [isBound, isPaused, phaseRemaining, block] = await Promise.all([
      readIsBindReferral(args.address),
      readPresalePaused(),
      readUserPhaseRemainingAmount(args.address, args.activePhase.index),
      bscReadClient.getBlock({ blockTag: 'latest' }),
    ])
    const nowSeconds = Number(block.timestamp)
    if (!isPhaseActive(args.activePhase, nowSeconds)) {
      return { ok: false, reason: 'unavailable' }
    }
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
