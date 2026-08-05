import { actionOwnerMatches } from '~/core/assets/action-owner'
import {
  evaluateRedeem,
  evaluateXmineActivateWarmup,
  evaluateXmineClaim,
  evaluateXmineUnstake,
} from '~/core/assets/assets-block-reasons'
import {
  matchClaimPlanIndices,
  type ReleaseDurationDays,
  restakeBpsFromPct,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import { dualCheckMixedClaim } from '~/core/assets/dual-check-mixed-claim'
import { invalidateAfterAssetsClaim } from '~/shared/api/query/invalidate'
import type { Address } from '~/shared/config/contracts'
import {
  type AssetsBondRow,
  type AssetsStakeRow,
  readBondRedeemableAmount,
  readClaimPlans,
  readContributionSnapshot,
  readMixedRewardAvailable,
  readStakeRedeemableAmount,
  readXminePosition,
} from '~/web3/assets/assets-read'
import {
  writeBondClaimMixed,
  writeBondRedeem,
  writeLiquidClaimMixed,
  writeLiquidClaimPrincipal,
  writeLockedClaimMixed,
  writeLockedClaimPrincipal,
  writeXmineActivateWarmup,
  writeXmineClaimReward,
  writeXmineStartUnstake,
} from '~/web3/assets/assets-write'
import type { ChainReadClient } from '~/web3/chain-read-client'
import { ASSETS_BLOCKED } from '~/web3/errors/write-block-errors'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: keyof typeof ASSETS_BLOCKED | null,
): (typeof ASSETS_BLOCKED)[keyof typeof ASSETS_BLOCKED] | null {
  if (!reason) return null
  return ASSETS_BLOCKED[reason]
}

function assertSessionOwnsAction(sessionAddress: string, owner: string): void {
  if (!actionOwnerMatches(sessionAddress, owner)) throw ASSETS_BLOCKED.unavailable
}

export type MixedClaimTarget =
  | { source: 'liquid'; amount: bigint }
  | {
      source: 'locked'
      pool: Address
      stakeIndex: number
      amount: bigint
      extra?: boolean
    }
  | {
      source: 'bond'
      depository: Address
      bondIndex: number
      amount: bigint
    }

async function readMixedClaimSnapshot(
  target: MixedClaimTarget,
  user: Address,
  amount: bigint,
  releaseDays: ReleaseDurationDays,
  restakeDays: RestakeDurationDays,
  readClient: ChainReadClient,
) {
  const plans = await readClaimPlans(readClient)
  const { releaseIndex: releasePlanIndex, restakeIndex: restakePlanIndex } = matchClaimPlanIndices(
    plans,
    releaseDays,
    restakeDays,
  )
  const [rewardAvailable, contrib] = await Promise.all([
    readMixedRewardAvailable(target, user, readClient),
    readContributionSnapshot(user, amount, readClient),
  ])
  return {
    rewardAvailable,
    contribution: contrib.contribution,
    requiredContribution: contrib.requiredContribution,
    releasePlanIndex,
    restakePlanIndex,
  }
}

/**
 * Mixed 领奖写交易
 *
 * 写前连续读取两次链上状态做双重校验，通过后按来源路由到对应合约的
 * 领取方法（活期 / 定期 / 债券），最后失效相关缓存。
 * 打开弹窗时捕获的 owner 须与会话钱包一致，否则拒绝提交。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
 */
export async function submitMixedClaim(args: {
  session: WriteSession
  owner: string
  target: MixedClaimTarget
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
}): Promise<void> {
  const { session, owner, target, releaseDays, restakeDays, restakePct } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

  const amount = target.amount
  const restakeBps = restakeBpsFromPct(restakePct)

  const intent = await readMixedClaimSnapshot(
    target,
    user,
    amount,
    releaseDays,
    restakeDays,
    readClient,
  )
  const live = await readMixedClaimSnapshot(
    target,
    user,
    amount,
    releaseDays,
    restakeDays,
    readClient,
  )
  const dual = dualCheckMixedClaim({ amount, intent, live })
  if (!dual.ok) {
    const mapped = gateError(dual.fail.reason)
    throw mapped ?? ASSETS_BLOCKED.unavailable
  }

  const { releasePlanIndex, restakePlanIndex } = dual.ready
  if (target.source === 'liquid') {
    await writeLiquidClaimMixed({
      wallet,
      releasePlanIndex,
      amount,
      restakePlanIndex,
      restakeBps,
    })
  } else if (target.source === 'locked') {
    await writeLockedClaimMixed({
      wallet,
      pool: target.pool,
      stakeIndex: target.stakeIndex,
      amount,
      releasePlanIndex,
      restakePlanIndex,
      restakeBps,
      extra: target.extra,
    })
  } else {
    await writeBondClaimMixed({
      wallet,
      depository: target.depository,
      recipient: user,
      amount,
      releasePlanIndex,
      bondIndex: target.bondIndex,
      restakePlanIndex,
      restakeBps,
    })
  }
  invalidateAfterAssetsClaim()
}

/**
 * 质押本金赎回写交易
 *
 * 写前重新读取链上可赎回金额并校验；活期走本金领取，定期走
 * 定期本金领取，成功后失效相关缓存。
 * warmup 中的仓位禁止赎回。
 *
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export async function submitStakeRedeem(args: {
  session: WriteSession
  owner: string
  row: AssetsStakeRow
}): Promise<void> {
  const { session, owner, row } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

  if (row.inWarmup) throw ASSETS_BLOCKED.warmupActive

  const liveAmount = await readStakeRedeemableAmount(row, user, readClient)
  const blockReason = evaluateRedeem({ amount: liveAmount })
  if (blockReason) throw ASSETS_BLOCKED[blockReason]

  if (row.kind === 'liquid') {
    await writeLiquidClaimPrincipal({ wallet, amount: liveAmount })
  } else {
    if (row.stakeIndex == null) throw ASSETS_BLOCKED.nothingToRedeem
    await writeLockedClaimPrincipal({
      wallet,
      pool: row.pool,
      stakeIndex: row.stakeIndex,
    })
  }
  invalidateAfterAssetsClaim()
}

/**
 * 债券本金赎回写交易
 *
 * 写前重新读取链上可赎回金额并校验，通过后写入债券赎回，
 * 成功后失效相关缓存。
 *
 * @see docs/onchain-manual/contracts/principalreleasevault.md
 */
export async function submitBondRedeem(args: {
  session: WriteSession
  owner: string
  row: AssetsBondRow
}): Promise<void> {
  const { session, owner, row } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

  const liveAmount = await readBondRedeemableAmount(row, user, readClient)
  const blockReason = evaluateRedeem({ amount: liveAmount })
  if (blockReason) throw ASSETS_BLOCKED[blockReason]

  await writeBondRedeem({
    wallet,
    depository: row.depository,
    recipient: user,
    bondIndex: row.bondIndex,
  })
  invalidateAfterAssetsClaim()
}

/**
 * X 挖矿写交易通用流程
 *
 * 写前连续读取两次仓位状态并按规则校验，均通过后执行写操作并失效缓存；
 * 任一校验不通过即抛对应错误码。
 */
async function submitXmineDualCheck(args: {
  session: WriteSession
  evaluate: (
    position: Awaited<ReturnType<typeof readXminePosition>>,
  ) => keyof typeof ASSETS_BLOCKED | null
  write: (wallet: WriteSession['wallet']) => Promise<unknown>
}): Promise<void> {
  const { wallet, address, readClient } = args.session

  const pre = await readXminePosition(address, readClient)
  const preBlock = args.evaluate(pre)
  if (preBlock) throw ASSETS_BLOCKED[preBlock]

  const live = await readXminePosition(address, readClient)
  const liveBlock = args.evaluate(live)
  if (liveBlock) throw ASSETS_BLOCKED[liveBlock]

  await args.write(wallet)
  invalidateAfterAssetsClaim()
}

/**
 * X 挖矿奖励领取写交易：校验待领奖励与 warmup 状态后领取，成功后失效缓存
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineClaim(args: { session: WriteSession }): Promise<void> {
  await submitXmineDualCheck({
    session: args.session,
    evaluate: (position) =>
      evaluateXmineClaim({
        pending: position.pending,
        warmupGons: position.warmupGons,
      }),
    write: async (wallet) => {
      await writeXmineClaimReward({ wallet })
    },
  })
}

/**
 * X 挖矿退出写交易：校验生效中与 warmup 的份额后发起退出，成功后失效缓存
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineUnstake(args: { session: WriteSession }): Promise<void> {
  await submitXmineDualCheck({
    session: args.session,
    evaluate: (position) =>
      evaluateXmineUnstake({
        activeGons: position.gons,
        warmupGons: position.warmupGons,
      }),
    write: async (wallet) => {
      await writeXmineStartUnstake({ wallet })
    },
  })
}

/**
 * X 挖矿 warmup 激活写交易：校验 warmup 状态结束后激活，成功后失效缓存
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineActivateWarmup(args: { session: WriteSession }): Promise<void> {
  await submitXmineDualCheck({
    session: args.session,
    evaluate: (position) =>
      evaluateXmineActivateWarmup({
        warmupGons: position.warmupGons,
        warmupEndTime: position.warmupEndTime,
      }),
    write: async (wallet) => {
      await writeXmineActivateWarmup({ wallet })
    },
  })
}
