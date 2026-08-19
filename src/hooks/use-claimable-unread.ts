import { useEffect, useSyncExternalStore } from 'react'

import { isUnread } from '~/core/claimable-unread'
import {
  type ClaimableSeenSource,
  readClaimableSeen,
  subscribeClaimableSeen,
  writeClaimableSeen,
} from '~/shared/lib/claimable-seen-storage'
import { useActiveAccount } from '~/web3/thirdweb-react'

/**
 * 单源可领红点：有指纹且与上次在子页看到的不同才亮。
 *
 * `fingerprint === null` 表示查询未就绪，不亮也不写 seen（避免把加载态当成已看过）。
 * 子页聚焦且已有数时，把当前指纹写入本地（含空串），当场看到的领取/到账被吸收。
 *
 * @param source 红点源
 * @param fingerprint 当前指纹；未就绪为 null
 * @param focused 是否正在该源子视图
 * @see src/core/claimable-unread.ts
 */
export function useClaimableUnread(
  source: ClaimableSeenSource,
  fingerprint: string | null,
  focused: boolean,
): boolean {
  const address = useActiveAccount()?.address?.toLowerCase() ?? ''
  const seen = useSyncExternalStore(
    subscribeClaimableSeen,
    () => (address ? readClaimableSeen(address, source) : null),
    () => null,
  )

  useEffect(() => {
    if (!address || fingerprint == null || !focused) return
    if (seen === fingerprint) return
    writeClaimableSeen(address, source, fingerprint)
  }, [address, fingerprint, focused, seen, source])

  if (!address || fingerprint == null) return false
  if (focused) return false
  return isUnread(fingerprint, seen)
}
