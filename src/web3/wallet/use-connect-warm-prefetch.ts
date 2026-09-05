import { useEffect } from 'react'

import { useAuth } from '~/hooks/use-auth'
import { prefetchConnectWarm } from '~/shared/api/query/prefetch'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'

/**
 * 登录且在 BSC 上时暖热推荐绑定与余额缓存。
 *
 * 与展示读同一道闸：未签名 / 异网不预取。
 *
 * @see docs/ubiquitous-language.md
 */
export function useConnectWarmPrefetch() {
  const { sessionReady } = useAuth()
  const { account, writeReady } = useWriteReadiness()
  const address = account?.address

  useEffect(() => {
    if (!sessionReady || !writeReady || !address) return
    prefetchConnectWarm(address)
  }, [sessionReady, writeReady, address])
}
