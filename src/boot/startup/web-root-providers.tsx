import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { AuthProvider } from '~/boot/startup/auth-provider'
import { QueryProvider } from '~/boot/startup/query-providers'
import { AccountBannedNotifier } from '~/shared/components/account-banned-notifier'
import { Tooltip } from '~/shared/components/tooltip'
import { assertWeb3EnvConfigured, thirdwebClient } from '~/web3/thirdweb'
import { AutoConnect, ThirdwebProvider } from '~/web3/thirdweb-react'

/**
 * DApp 专用 Provider 栈（`app.html` / `src/boot/main.tsx`）。
 * 首页使用 `HomeProviders`（`query-providers.tsx`，无 thirdweb）。
 *
 * QueryProvider 必须放在 ThirdwebProvider 内部：thirdweb 的 Provider
 * 自带一个 QueryClientProvider，若我们的在外层会被遮蔽，组件里的 useQuery
 * 会落在 thirdweb 的客户端上，而模块级失效逻辑（invalidate.ts 的 queryClient 单例）
 * 指向的是另一个孤儿客户端——导致每次操作后的刷新静默失效。
 * 把自己的 QueryProvider 放在内层使其成为最近的 Provider，读写共用同一客户端。
 */
export function WebRootProviders({ children }: { children: ReactNode }) {
  useEffect(() => {
    assertWeb3EnvConfigured()
  }, [])

  return (
    <ThirdwebProvider>
      <QueryProvider>
        <Tooltip.Provider delayDuration={200} skipDelayDuration={0}>
          <AutoConnect client={thirdwebClient} timeout={15_000} />
          <AuthProvider>
            <AccountBannedNotifier />
            {children}
          </AuthProvider>
        </Tooltip.Provider>
      </QueryProvider>
    </ThirdwebProvider>
  )
}
