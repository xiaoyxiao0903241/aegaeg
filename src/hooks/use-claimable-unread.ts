import { useEffect, useSyncExternalStore } from 'react'

import {
  type ClaimableDotKind,
  isClaimableDotLit,
  mergeAckFingerprint,
} from '~/core/claimable-unread'
import {
  type ClaimableSeenSource,
  readClaimableSeen,
  subscribeClaimableSeen,
  writeClaimableSeen,
} from '~/shared/lib/claimable-seen-storage'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 单源可领红点。
 *
 * `fingerprint === null` 表示查询未就绪，不亮也不写 ack。
 * `balance`：投影非空就亮，不写本地、不因聚焦藏点。
 * `event`：进入子页后把当前身份并入 ack；聚焦时藏点（人已在该页）。
 *
 * @param source 红点源
 * @param fingerprint 当前投影；未就绪为 null
 * @param focused 是否正在该源子视图
 * @param kind `balance` 欠账钉住；`event` 到期看过即焚
 * @see src/core/claimable-unread.ts
 */
export function useClaimableUnread(
  source: ClaimableSeenSource,
  fingerprint: string | null,
  focused: boolean,
  kind: ClaimableDotKind,
): boolean {
  const address = useActiveAccount()?.address?.toLowerCase() ?? ''
  const ack = useSyncExternalStore(
    subscribeClaimableSeen,
    () => (address ? readClaimableSeen(address, source) : null),
    () => null,
  )

  useEffect(() => {
    if (kind !== 'event' || !address || fingerprint == null || !focused) return
    const next = mergeAckFingerprint(ack, fingerprint)
    if (next === (ack ?? '')) return
    writeClaimableSeen(address, source, next)
  }, [ack, address, fingerprint, focused, kind, source])

  if (!address || fingerprint == null) return false
  if (kind === 'event' && focused) return false
  return isClaimableDotLit(kind, fingerprint, ack)
}
