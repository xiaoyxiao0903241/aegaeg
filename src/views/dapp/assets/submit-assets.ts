import { actionOwnerMatches } from '~/core/assets/action-owner'
import {
  evaluateMixedClaim,
  evaluateRedeem,
  evaluateXmineActivateWarmup,
  evaluateXmineClaim,
  evaluateXmineUnstake,
} from '~/core/assets/assets-block-reasons'
import { matchClaimPlanIndices, restakeBpsFromPct } from '~/core/assets/claim-plans'
import type { LockedClaimEntry } from '~/core/assets/locked-claim-entry'
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
import { approveThenLiveWrite } from '~/web3/wallet/approve-then-live-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

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
      /** 普通奖励与额外利息为独立写入口；通常只含用户所选的一项。 */
      entries: ReadonlyArray<LockedClaimEntry>
    }
  | {
      source: 'bond'
      depository: Address
      bondIndex: number
      amount: bigint
    }

/** 单次读快照目标（定期需带 extra 以区分普通 / 额外可领余额）。 */
type MixedClaimReadTarget =
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
  target: MixedClaimReadTarget,
  user: Address,
  amount: bigint,
  releaseDays: number,
  restakeDays: number,
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

type MixedClaimSnapshot = Awaited<ReturnType<typeof readMixedClaimSnapshot>>

/**
 * Mixed 领奖写交易
 *
 * 按 `approveThenLiveWrite`：预检读 → 实时重读复核 → 再写。
 * 打开弹窗时捕获的 owner 须与会话钱包一致，否则拒绝提交。
 * 定期普通 / 额外为独立入口；若传入多项则按序各写一笔。
 *
 * @see docs/onchain-manual/contracts/rewardqueue.md
 * @see 手册 §9.3 Mixed 领奖前端流程
 */
export async function submitMixedClaim(args: {
  session: WriteSession
  owner: string
  target: MixedClaimTarget
  releaseDays: number
  restakeDays: number
  restakePct: number
}): Promise<void> {
  const { session, owner, target, releaseDays, restakeDays, restakePct } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

  const restakeBps = restakeBpsFromPct(restakePct)

  async function writeOne(readTarget: MixedClaimReadTarget, amount: bigint, extra?: boolean) {
    await approveThenLiveWrite({
      readSnapshot: () =>
        readMixedClaimSnapshot(readTarget, user, amount, releaseDays, restakeDays, readClient),
      evaluate: (snap: MixedClaimSnapshot) =>
        evaluateMixedClaim({
          amount,
          rewardAvailable: snap.rewardAvailable,
          contribution: snap.contribution,
          requiredContribution: snap.requiredContribution,
          releasePlanIndex: snap.releasePlanIndex,
          restakePlanIndex: snap.restakePlanIndex,
        }),
      mapBlockError: (reason) => ASSETS_BLOCKED[reason],
      write: async (live) => {
        const releasePlanIndex = live.releasePlanIndex
        const restakePlanIndex = live.restakePlanIndex
        if (releasePlanIndex == null || restakePlanIndex == null) {
          throw ASSETS_BLOCKED.unavailable
        }
        if (readTarget.source === 'locked') {
          await writeLockedClaimMixed({
            wallet,
            pool: readTarget.pool,
            stakeIndex: readTarget.stakeIndex,
            amount,
            releasePlanIndex,
            restakePlanIndex,
            restakeBps,
            extra: extra ?? false,
          })
          return
        }
        if (readTarget.source === 'liquid') {
          await writeLiquidClaimMixed({
            wallet,
            releasePlanIndex,
            amount,
            restakePlanIndex,
            restakeBps,
          })
          return
        }
        await writeBondClaimMixed({
          wallet,
          depository: readTarget.depository,
          recipient: user,
          amount,
          releasePlanIndex,
          bondIndex: readTarget.bondIndex,
          restakePlanIndex,
          restakeBps,
        })
      },
    })
  }

  if (target.source === 'locked') {
    if (target.entries.length === 0) throw ASSETS_BLOCKED.unavailable
    for (const entry of target.entries) {
      try {
        await writeOne(
          {
            source: 'locked',
            pool: target.pool,
            stakeIndex: target.stakeIndex,
            amount: entry.amount,
            extra: entry.extra,
          },
          entry.amount,
          entry.extra,
        )
      } finally {
        // 半成功也刷新：已上链那笔的可领额立刻从界面消失，重试只针对未完成笔
        invalidateAfterAssetsClaim()
      }
    }
    return
  }

  await writeOne(target, target.amount)
  invalidateAfterAssetsClaim()
}

/**
 * 质押本金赎回写交易
 *
 * 预检读 → 实时重读 → 写入；warmup 中禁止赎回。
 *
 * @see docs/onchain-manual/contracts/liquidstaking.md
 * @see docs/onchain-manual/contracts/lockedstaking.md
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

  await approveThenLiveWrite({
    readSnapshot: async () => ({ amount: await readStakeRedeemableAmount(row, user, readClient) }),
    evaluate: (snap) => evaluateRedeem(snap),
    mapBlockError: (reason) => ASSETS_BLOCKED[reason],
    write: async (live) => {
      if (row.kind === 'liquid') {
        await writeLiquidClaimPrincipal({ wallet, amount: live.amount })
        return
      }
      if (row.stakeIndex == null) throw ASSETS_BLOCKED.nothingToRedeem
      await writeLockedClaimPrincipal({
        wallet,
        pool: row.pool,
        stakeIndex: row.stakeIndex,
      })
    },
  })
  invalidateAfterAssetsClaim()
}

/**
 * 债券本金赎回写交易
 *
 * 预检读 → 实时重读 → 写入债券赎回。
 *
 * @see docs/onchain-manual/contracts/bonddepository.md
 */
export async function submitBondRedeem(args: {
  session: WriteSession
  owner: string
  row: AssetsBondRow
}): Promise<void> {
  const { session, owner, row } = args
  const { wallet, address: user, readClient } = session
  assertSessionOwnsAction(user, owner)

  await approveThenLiveWrite({
    readSnapshot: async () => ({ amount: await readBondRedeemableAmount(row, user, readClient) }),
    evaluate: (snap) => evaluateRedeem(snap),
    mapBlockError: (reason) => ASSETS_BLOCKED[reason],
    write: async () => {
      await writeBondRedeem({
        wallet,
        depository: row.depository,
        recipient: user,
        bondIndex: row.bondIndex,
      })
    },
  })
  invalidateAfterAssetsClaim()
}

/**
 * X 挖矿写交易：预检读仓位 → 实时重读 → 写入。
 */
async function submitXmineLiveWrite(args: {
  session: WriteSession
  evaluate: (
    position: Awaited<ReturnType<typeof readXminePosition>>,
  ) => keyof typeof ASSETS_BLOCKED | null
  write: (wallet: WriteSession['wallet']) => Promise<unknown>
}): Promise<void> {
  const { wallet, address, readClient } = args.session

  await approveThenLiveWrite({
    readSnapshot: () => readXminePosition(address, readClient),
    evaluate: args.evaluate,
    mapBlockError: (reason) => ASSETS_BLOCKED[reason],
    write: async () => {
      await args.write(wallet)
    },
  })
  invalidateAfterAssetsClaim()
}

/**
 * X 挖矿奖励领取写交易：校验待领奖励与 warmup 状态后领取。
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineClaim(args: { session: WriteSession }): Promise<void> {
  await submitXmineLiveWrite({
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
 * X 挖矿退出写交易：校验生效中与 warmup 的份额后发起退出。
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineUnstake(args: { session: WriteSession }): Promise<void> {
  await submitXmineLiveWrite({
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
 * X 挖矿 warmup 激活写交易：校验 warmup 结束后激活。
 *
 * @see docs/onchain-manual/contracts/xstakingpool.md
 */
export async function submitXmineActivateWarmup(args: { session: WriteSession }): Promise<void> {
  await submitXmineLiveWrite({
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
