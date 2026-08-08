import { releaseClaimBlockReason } from '~/core/release/release-block-reasons'
import { invalidateAfterReleaseClaim } from '~/shared/api/query/invalidate'
import { RELEASE_BLOCKED } from '~/web3/errors/write-block-errors'
import { readMigrationStatus } from '~/web3/migration/migration-read'
import {
  readReleaseBufferSnapshot,
  readReleaseQueueSnapshot,
  type ReleaseClaimWindow,
} from '~/web3/release/release-read'
import {
  writeClaimAllVestedRewards,
  writeClaimManyArchiveReleases,
  writeClaimManyReleases,
} from '~/web3/release/release-write'
import type { WriteSession } from '~/web3/wallet/require-write-session'

function gateError(
  reason: 'zeroAmount' | 'lockedUnknown' | null,
): (typeof RELEASE_BLOCKED)[keyof typeof RELEASE_BLOCKED] | null {
  if (!reason) return null
  return RELEASE_BLOCKED[reason]
}

async function assertReleaseWritesAllowed(address: string, readClient: WriteSession['readClient']) {
  const migration = await readMigrationStatus(address, readClient)
  if (migration.isOldAccount) throw RELEASE_BLOCKED.accountMigrated
}

/**
 * 领取释放队列：只做领域层写操作
 *
 * 写前先读快照做门闸检查，再读一次确认；不通过则抛错中断。
 *
 * @param args.session 已就绪的写会话
 * @param args.planIndex 要领取的天数档位
 * @see 手册 §12 RewardQueue 奖励释放队列
 */
export async function submitReleaseQueueClaim(args: {
  session: WriteSession
  planIndex: number
}): Promise<void> {
  const { session, planIndex } = args
  const { wallet, address, readClient } = session
  if (planIndex < 0) {
    throw RELEASE_BLOCKED.planUnresolved
  }

  const pre = await readReleaseQueueSnapshot(address, readClient)
  const preRow = pre.plans.find((row) => row.planIndex === planIndex)
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: preRow?.claimable ?? 0n,
      unknownLocked: false,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseQueueSnapshot(address, readClient)
  const liveRow = live.plans.find((row) => row.planIndex === planIndex)
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: liveRow?.claimable ?? 0n,
      unknownLocked: false,
    }),
  )
  if (liveErr) throw liveErr

  await assertReleaseWritesAllowed(address, readClient)
  await writeClaimAllVestedRewards({ wallet, planIndex })
  invalidateAfterReleaseClaim()
}

/** 按快照窗 claimMany；跳过空窗，避免 ErrorNothingToClaim 阻断后续页。每笔成功后 invalidate，部分成功也刷新。 */
async function claimWindows(args: {
  windows: readonly ReleaseClaimWindow[]
  write: (start: number, limit: number) => Promise<unknown>
}): Promise<void> {
  for (const window of args.windows) {
    await args.write(window.start, window.limit)
    invalidateAfterReleaseClaim()
  }
}

/** 逐笔 claimMany(index, 1)：只领指定 index，避免混币窗误领另一 token。每笔成功后 invalidate。 */
async function claimIndexes(args: {
  indexes: readonly number[]
  write: (start: number, limit: number) => Promise<unknown>
}): Promise<void> {
  for (const index of args.indexes) {
    await args.write(index, 1)
    invalidateAfterReleaseClaim()
  }
}

export type ReleaseBufferClaimToken = 'agx' | 'gagx'

/**
 * 领取缓冲池：按币种独立领取（AGX / gAGX 各一次写意图）。
 *
 * 分流器多币共存于同一 index 序列；整窗 claimMany 会混领，故按该币 index 逐笔 claimMany(i,1)。
 * 归档 PRV 仅 AGX。写前对该币可领额做两轮门闸；每笔链上成功后 invalidate。
 *
 * @see 手册 §13 分流器本金释放
 */
export async function submitReleaseBufferClaim(args: {
  session: WriteSession
  token: ReleaseBufferClaimToken
}): Promise<void> {
  const { session, token } = args
  const { wallet, address, readClient } = session

  const pre = await readReleaseBufferSnapshot(address, readClient)
  const preClaimable = token === 'agx' ? pre.agx.totalClaimable : pre.gagx.totalClaimable
  const preErr = gateError(
    releaseClaimBlockReason({
      claimable: preClaimable,
      unknownLocked: false,
    }),
  )
  if (preErr) throw preErr

  const live = await readReleaseBufferSnapshot(address, readClient)
  const liveClaimable = token === 'agx' ? live.agx.totalClaimable : live.gagx.totalClaimable
  const liveErr = gateError(
    releaseClaimBlockReason({
      claimable: liveClaimable,
      unknownLocked: false,
    }),
  )
  if (liveErr) throw liveErr
  if (liveClaimable <= 0n) throw RELEASE_BLOCKED.zeroAmount

  await assertReleaseWritesAllowed(address, readClient)

  for (const hop of live.chain) {
    const indexes = token === 'agx' ? hop.agxClaimIndexes : hop.gagxClaimIndexes
    if (indexes.length === 0) continue
    await claimIndexes({
      indexes,
      write: (start, limit) =>
        writeClaimManyReleases({
          wallet,
          splitter: hop.address,
          start,
          limit,
        }),
    })
  }

  // 归档 PRV 无 token 字段，历史单计入 AGX 桶
  if (token === 'agx' && live.archiveClaimWindows.length > 0) {
    await claimWindows({
      windows: live.archiveClaimWindows,
      write: (start, limit) =>
        writeClaimManyArchiveReleases({
          wallet,
          start,
          limit,
        }),
    })
  }
}
