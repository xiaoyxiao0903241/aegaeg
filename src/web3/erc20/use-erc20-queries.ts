import { keepPreviousData } from '@tanstack/react-query'

import { type ChainQueryOptions, useChainQuery } from '~/hooks/use-chain-query'
import { queryKeys } from '~/shared/api/query/query-keys'
import type { Address } from '~/shared/config/contracts'
import { readErc20Allowance, readErc20Balance } from '~/web3/exchange/exchange-read'

/**
 * 原子 ERC20 余额查询（钱包作用域）
 *
 * 查询键含 token；当前钱包地址由 `useChainQuery` 追加。
 * 展示可用 `keepPreviousData`；判断用数据须排除上一次数据
 * （见 `decision-freshness` 约定）。
 *
 * @param token 代币地址，未提供时查询禁用
 * @param options 查询选项
 */
export function useErc20BalanceQuery(token: Address | undefined, options?: ChainQueryOptions) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20Balance(token ?? ''),
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token),
    queryFn: (address) => readErc20Balance(token!, address),
    placeholderData: keepPreviousData,
  })
}

/**
 * 原子 ERC20 授权额度查询（钱包作用域）
 *
 * 查询键含 token + spender；当前钱包地址由 `useChainQuery` 追加。
 * 展示可用 `keepPreviousData`；判断用数据须排除上一次数据。
 *
 * @param token 代币地址
 * @param spender 被授权方地址
 * @param options 查询选项
 */
export function useErc20AllowanceQuery(
  token: Address | undefined,
  spender: Address | undefined,
  options?: ChainQueryOptions,
) {
  return useChainQuery({
    queryKey: queryKeys.chain.erc20Allowance(token ?? '', spender ?? ''),
    freshness: 'balances',
    enabled: (options?.enabled ?? true) && Boolean(token && spender),
    queryFn: (address) => readErc20Allowance(token!, address, spender!),
    placeholderData: keepPreviousData,
  })
}
