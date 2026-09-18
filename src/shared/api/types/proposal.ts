/**
 * 治理提案 API 类型。
 *
 * 标题 / 正文走 JWT（决定展示哪些提案）；状态 / 票数 / 仓位以链上为准。
 *
 * @see 用户文档 governance-apis
 */

export type GovernanceListItem = {
  proposal_id: number
  title: string | null
  image_url: string | null
  start_time: number
  end_time: number
  proposal_state: string
  has_voted: boolean
  vote_type: string | null
}

export type GovernanceDetail = {
  proposal_id: number
  title: string | null
  content: string | null
  content_text: string | null
  image_url: string | null
  start_time: number
  end_time: number
  proposal_state: string
  for_votes: string
  against_votes: string
  abstain_votes: string
  participated_votes: string
  total_voters: number
  min_quorum: string
  has_voted: boolean
  vote_type: string | null
  my_votes: string
}

export type GovernanceStats = {
  total: number
  active_count: number
  pending_count: number
  my_locked_vote_count: number
  recent_participation_rate: number
}

export type GovernanceMyVoteItem = {
  proposal_id: number
  voted_at: number
  vote_type: string | null
  votes: string
  proposal_state: string
  lock_status: string
}
