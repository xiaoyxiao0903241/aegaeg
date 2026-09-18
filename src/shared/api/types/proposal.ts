/**
 * 治理提案 API 类型。
 *
 * 列表 / 详情标题走 JWT；左栏状态与票数叠链上。
 * 右上「我的投票」行来自 my-votes（累计 `votes`），锁 / 提案状态叠链上。
 * 右下「提案奖励」行来自 my-operations（本笔 `votes` / `reward` / `claim_status`）。
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

export type GovernanceMyOperationItem = {
  id: number
  time: number
  proposal_id: number
  votes: string
  vote_type: string | null
  reward: string
  claim_status: string
  proposal_state: string
}
