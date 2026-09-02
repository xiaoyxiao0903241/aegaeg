/**
 * 后端 API 数据查询 hooks（按域拆分；本文件为 barrel）。
 *
 * @see docs/backend-api/api.md
 */
export { useAuthenticatedQuery } from '~/hooks/api/_authenticated-query'
export * from '~/hooks/api/assets'
export * from '~/hooks/api/community'
export * from '~/hooks/api/exchange'
export * from '~/hooks/api/release'
export * from '~/hooks/api/rewards'
export * from '~/hooks/api/staking'
