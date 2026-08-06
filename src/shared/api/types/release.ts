import type { PaginationParams } from '~/shared/api/types/common'

export type BufferPoolEventType = 'RELEASE_CREATED' | 'PRINCIPAL_CLAIMED'

export type ReleasePoolEventType = 'entered_queue' | 'claimed' | 'released'

export interface BufferPoolSummary {
  cumulative_amount: string
  released_amount: string
  releasing_amount: string
}

export interface BufferPoolLogItem {
  block_time: number
  event_type: BufferPoolEventType
  amount: string
  contract_address: string
  tx_hash: string | null
}

export interface BufferPoolLogsParams extends PaginationParams {
  event_type?: BufferPoolEventType[]
}

export interface ReleasePoolSummary {
  releasing_amount: string
  released_amount: string
  total_claimed_amount: string
}

export interface ReleasePoolLogItem {
  event_time: number
  event_type: ReleasePoolEventType
  amount: string
  tx_hash: string | null
  plan_index: number
}

export interface ReleasePoolLogsParams extends PaginationParams {
  event_type?: ReleasePoolEventType[]
}
