/** 分流器 `getReleases`/`claimMany` 与释放池分页领取的固定页宽。 */
export const RELEASE_CLAIM_PAGE = 50

export type ReleaseClaimPage = {
  start: number
  limit: number
  claimable: bigint
}

export type ReleaseClaimWindow = {
  start: number
  limit: number
}

export type BufferClaimTarget =
  | { kind: 'splitter'; splitter: string; start: number; limit: number }
  | { kind: 'archive'; start: number; limit: number }

/**
 * 从队列条目数里挑第一窗有待领的页（默认 50 条）。
 *
 * 前几页已领完则跳过；尾页 `limit` 为剩余条数。
 *
 * @param args.size 该档队列条目数
 * @param args.pageSize 页宽，默认 50
 * @param args.pageClaimable 该窗待领合计
 * @returns 第一窗；皆空为 null
 * @see RewardQueue.claimVestedRewardsInRange / AegisSplitter.claimMany
 */
export function pickFirstClaimPage(args: {
  size: number
  pageSize?: number
  pageClaimable: (start: number, limit: number) => bigint
}): ReleaseClaimPage | null {
  const pageSize = args.pageSize ?? RELEASE_CLAIM_PAGE
  if (args.size <= 0 || pageSize <= 0) return null
  for (let start = 0; start < args.size; start += pageSize) {
    const limit = Math.min(pageSize, args.size - start)
    const claimable = args.pageClaimable(start, limit)
    if (claimable > 0n) return { start, limit, claimable }
  }
  return null
}

/**
 * 缓冲池一键领取目标：Head→链尾第一窗，否则归档第一窗。
 *
 * @param args.chain 分流器跳
 * @param args.archiveClaimWindows 归档可领窗
 * @returns 单窗目标；没有可领窗为 null
 * @see 手册 §13.4 claimMany
 */
export function pickBufferFirstClaim(args: {
  chain: readonly { address: string; claimWindows: readonly ReleaseClaimWindow[] }[]
  archiveClaimWindows: readonly ReleaseClaimWindow[]
}): BufferClaimTarget | null {
  for (const hop of args.chain) {
    const window = hop.claimWindows[0]
    if (window) {
      return {
        kind: 'splitter',
        splitter: hop.address,
        start: window.start,
        limit: window.limit,
      }
    }
  }
  const archive = args.archiveClaimWindows[0]
  if (archive) {
    return { kind: 'archive', start: archive.start, limit: archive.limit }
  }
  return null
}
