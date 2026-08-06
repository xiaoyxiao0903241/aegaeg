import { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
import {
  getBondFlowBurnLogs,
  getBondFlowBurnPurchases,
  getBondFlowLpLogs,
  getBondFlowLpPurchases,
  getStakeAddressCount,
  getStakeFlowLogs,
  getStakeFlowPositions,
  getX0MiningLogs,
  getX0MiningPositions,
} from '~/shared/api/endpoints'
import { queryKeys } from '~/shared/api/query/query-keys'
import type {
  BondFlowLogsParams,
  PaginationParams,
  StakeFlowLogsParams,
  X0MiningLogsParams,
} from '~/shared/api/types'

export function useStakeAddressCount(enabled = true) {
  return useAuthenticatedQuery(queryKeys.api.stakeAddressCount, getStakeAddressCount, enabled)
}

export function useBondFlowLpLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpLogs(params),
    (token) => getBondFlowLpLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowBurnLogs(params: BondFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnLogs(params),
    (token) => getBondFlowBurnLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowLpPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowLpPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowLpPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useBondFlowBurnPurchases(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.bondFlowBurnPurchases({ page, page_size: pageSize }),
    (token) => getBondFlowBurnPurchases(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useStakeFlowLogs(params: StakeFlowLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowLogs(params),
    (token) => getStakeFlowLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useStakeFlowPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.stakeFlowPositions({ page, page_size: pageSize }),
    (token) => getStakeFlowPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}

export function useX0MiningLogs(params: X0MiningLogsParams = {}, enabled = true) {
  return useAuthenticatedQuery(
    queryKeys.api.x0MiningLogs(params),
    (token) => getX0MiningLogs(token, params),
    enabled,
    { keepPreviousData: true },
  )
}

export function useX0MiningPositions(params: PaginationParams = {}, enabled = true) {
  const page = params.page
  const pageSize = params.page_size

  return useAuthenticatedQuery(
    queryKeys.api.x0MiningPositions({ page, page_size: pageSize }),
    (token) => getX0MiningPositions(token, { page, page_size: pageSize }),
    enabled,
    { keepPreviousData: true },
  )
}
