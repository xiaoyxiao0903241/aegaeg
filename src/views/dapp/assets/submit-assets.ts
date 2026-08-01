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

/** 域写；软门闸抛哨兵。信封在 `useChainMutation`。打开时捕获的 owner 须与 session 一致。 */
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

/** 域写；软门闸抛哨兵。信封在 `useChainMutation`。 */
export async function submitStakeRedeem(args: {
  session: WriteSession
  owner: string
  row: AssetsStakeRow
}): Promise<void> {
  const { session, owner, row } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

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

/** 域写；软门闸抛哨兵。信封在 `useChainMutation`。 */
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
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
