import type { ReactNode } from 'react'

import { QueryProvider } from '~/bootstrap/startup/query-provider'

/** 首页专用 Provider 栈——不包含 thirdweb / 登录 / 钱包自动连接。 */
export function HomeProviders({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>
}
