import { ASSETS_BLOCKED } from '~/web3/errors/assets-write-block-errors'
import { invalidateAfterAssetsClaim } from '~/shared/api/query/invalidate'
import {
  evaluateRedeem,
  evaluateXmineActivateWarmup,
  evaluateXmineClaim,
  evaluateXmineUnstake,
} from '~/core/assets/assets-block-reasons'
import { dualCheckMixedClaim } from '~/core/assets/dual-check-mixed-claim'
import {
  matchPlanIndexByDurationDays,
  restakeBpsFromPct,
  type ReleaseDurationDays,
  type RestakeDurationDays,
} from '~/core/assets/claim-plans'
import {
  readBondRedeemableAmount,
  readClaimPlans,
  readContributionSnapshot,
  readMixedRewardAvailable,
  readStakeRedeemableAmount,
  readXminePosition,
  type AssetsBondRow,
  type AssetsStakeRow,
} from '~/web3/assets/assets-read'
import {
  writeBondClaimMixed,
  writeBondRedeem,
  writeLiquidClaimMixed,
  writeLiquidClaimPrincipal,
  writeLockedClaimMixed,
  writeLockedClaimPrincipal,
  writeXmineClaimReward,
  writeXmineStartUnstake,
  writeXmineActivateWarmup,
} from '~/web3/assets/assets-write'
import type { ChainReadClient } from '~/web3/chain-read-client'
import type { Address } from '~/shared/config/contracts'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: keyof typeof ASSETS_BLOCKED | null,
): (typeof ASSETS_BLOCKED)[keyof typeof ASSETS_BLOCKED] | null {
  if (!reason) return null
  return ASSETS_BLOCKED[reason]
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
  const releasePlanIndex = matchPlanIndexByDurationDays(plans.releasePlans, releaseDays)
  const restakePlanIndex = matchPlanIndexByDurationDays(plans.restakePlans, restakeDays)
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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitMixedClaim(args: {
  session: WriteSession
  target: MixedClaimTarget
  releaseDays: ReleaseDurationDays
  restakeDays: RestakeDurationDays
  restakePct: number
}): Promise<void> {
  const { session, target, releaseDays, restakeDays, restakePct } = args
  const { wallet, address: user, readClient } = session

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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitStakeRedeem(args: {
  session: WriteSession
  row: AssetsStakeRow
}): Promise<void> {
  const { session, row } = args
  const { wallet, address: user, readClient } = session

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

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitBondRedeem(args: {
  session: WriteSession
  row: AssetsBondRow
}): Promise<void> {
  const { session, row } = args
  const { wallet, address: user, readClient } = session

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
export async function submitXmineClaim(args: { session: WriteSession }): Promise<void> {
  const { wallet, address, readClient } = args.session

  const pre = await readXminePosition(address, readClient)
  const preBlock = evaluateXmineClaim({
    pending: pre.pending,
    warmupGons: pre.warmupGons,
  })
  if (preBlock) throw ASSETS_BLOCKED[preBlock]

  const live = await readXminePosition(address, readClient)
  const liveBlock = evaluateXmineClaim({
    pending: live.pending,
    warmupGons: live.warmupGons,
  })
  if (liveBlock) throw ASSETS_BLOCKED[liveBlock]

  await writeXmineClaimReward({ wallet })
  invalidateAfterAssetsClaim()
}

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitXmineUnstake(args: { session: WriteSession }): Promise<void> {
  const { wallet, address, readClient } = args.session

  const pre = await readXminePosition(address, readClient)
  const preBlock = evaluateXmineUnstake({
    activeGons: pre.gons,
    warmupGons: pre.warmupGons,
  })
  if (preBlock) throw ASSETS_BLOCKED[preBlock]

  const live = await readXminePosition(address, readClient)
  const liveBlock = evaluateXmineUnstake({
    activeGons: live.gons,
    warmupGons: live.warmupGons,
  })
  if (liveBlock) throw ASSETS_BLOCKED[liveBlock]

  await writeXmineStartUnstake({ wallet })
  invalidateAfterAssetsClaim()
}

/** Domain write only — soft gates throw sentinels. Envelope lives in `useChainMutation`. */
export async function submitXmineActivateWarmup(args: { session: WriteSession }): Promise<void> {
  const { wallet, address, readClient } = args.session

  const pre = await readXminePosition(address, readClient)
  const preBlock = evaluateXmineActivateWarmup({
    warmupGons: pre.warmupGons,
    warmupEndTime: pre.warmupEndTime,
  })
  if (preBlock) throw ASSETS_BLOCKED[preBlock]

  const live = await readXminePosition(address, readClient)
  const liveBlock = evaluateXmineActivateWarmup({
    warmupGons: live.warmupGons,
    warmupEndTime: live.warmupEndTime,
  })
  if (liveBlock) throw ASSETS_BLOCKED[liveBlock]

  await writeXmineActivateWarmup({ wallet })
  invalidateAfterAssetsClaim()
}
