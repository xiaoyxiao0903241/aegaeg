import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'

import { chainQueryEnabled, type ChainQueryScope } from '~/core/wallet/chain-query-enabled'
import { useAuth } from '~/hooks/use-auth'
import { hideDisabledQueryData } from '~/shared/api/query/hide-disabled-query-data'
import { QUERY_STALE_TIME } from '~/shared/api/query/query-client'
import { chainWalletQueryKey } from '~/shared/api/query/query-keys'
import { useActiveAccount } from '~/web3/thirdweb-react'

export type ChainQueryFreshness = keyof typeof QUERY_STALE_TIME

/** 链上查询通用选项（当前仅支持 enabled）。 */
export type ChainQueryOptions = {
  enabled?: boolean
}

type ChainQueryBase<TData> = {
  /** 数据新鲜度档位，默认 balances（普通余额级）；提交时需实时校验的数据不得用本 hook。 */
  freshness?: ChainQueryFreshness
  /** 领域开关，与作用域判断取交集，默认 true。 */
  enabled?: boolean
  placeholderData?: UseQueryOptions<TData, Error, TData, QueryKey>['placeholderData']
  refetchInterval?: number | false
}

/** 钱包作用域：queryKey 为前缀，hook 自动追加当前钱包地址。 */
export type UseWalletChainQueryArgs<TData> = ChainQueryBase<TData> & {
  scope?: 'wallet'
  queryKey: QueryKey
  queryFn: (address: string) => Promise<TData>
}

/** 公开作用域：调用方持有完整 queryKey，不注入钱包地址。 */
export type UsePublicChainQueryArgs<TData> = ChainQueryBase<TData> & {
  scope: 'public'
  queryKey: QueryKey
  queryFn: () => Promise<TData>
}

export type UseChainQueryArgs<TData> =
  UseWalletChainQueryArgs<TData> | UsePublicChainQueryArgs<TData>

/**
 * 链上展示数据查询 hook
 *
 * 按新鲜度档位设置 staleTime；钱包作用域自动以当前地址作为缓存键后缀并注入 queryFn。
 * 通过 read* 默认的 `bscReadClient` 读取，无需外部注入客户端。
 * 提交时需实时校验的门禁数据不得使用本 hook，应直接读取或 staleTime 置 0。
 * 水合完成后查询关闭（含断开钱包）时不把缓存交给视图，避免界面继续印上一份数。
 */
export function useChainQuery<TData>(args: UseChainQueryArgs<TData>): UseQueryResult<TData> {
  const account = useActiveAccount()
  const { sessionReady, hasHydrated } = useAuth()
  const scope: ChainQueryScope = args.scope ?? 'wallet'
  const freshness = args.freshness ?? 'balances'
  /** 统一小写，保证缓存键与 queryFn 的地址一致（校验和大小写安全）。 */
  const walletAddress = account?.address?.toLowerCase()

  // 钱包断开时仍追加空串后缀，避免缓存键退化为裸前缀而与误启用的查询碰撞
  const queryKey =
    scope === 'wallet' ? chainWalletQueryKey(args.queryKey, walletAddress ?? '') : args.queryKey

  const enabled = chainQueryEnabled({
    scope,
    enabled: args.enabled,
    address: walletAddress,
    sessionReady,
    hasHydrated,
  })

  const query = useQuery<TData, Error, TData, QueryKey>({
    queryKey,
    queryFn: () => {
      if (scope === 'wallet') {
        if (!walletAddress) {
          throw new Error('useChainQuery: wallet scope ran without address')
        }
        return (args as UseWalletChainQueryArgs<TData>).queryFn(walletAddress)
      }
      return (args as UsePublicChainQueryArgs<TData>).queryFn()
    },
    enabled,
    staleTime: QUERY_STALE_TIME[freshness],
    placeholderData: enabled ? args.placeholderData : undefined,
    refetchInterval: args.refetchInterval,
    refetchIntervalInBackground: args.refetchInterval ? false : undefined,
  })

  return hideDisabledQueryData(query, { enabled, hasHydrated })
}
