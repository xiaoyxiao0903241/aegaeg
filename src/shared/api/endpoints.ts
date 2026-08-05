import { apiRequest } from '~/shared/api/request'
import type {
  AgxContributionBurnLogItem,
  AgxContributionConsumeLogItem,
  AgxContributionSummary,
  AssetsHoldingsDistribution,
  AssetsHoldingsSummary,
  AssetsRewardSummary,
  BondFlowLogItem,
  BondFlowLogsParams,
  BondPurchasesPage,
  BufferPoolLogItem,
  BufferPoolLogsParams,
  BufferPoolSummary,
  ClaimConfirmRequest,
  ClaimConfirmResult,
  ClaimParseSignatureRequest,
  ClaimParseSignatureResult,
  CommunityFundLogItem,
  CommunityFundTotals,
  DaoRewardType,
  HomePopupNoticesResponse,
  LoginRequest,
  LoginResponse,
  LuckyRewardMyRoundItem,
  LuckyRewardSummary,
  LuckyRewardWinnersResponse,
  MakingOverview,
  MarketAllowanceClaimLogItem,
  MarketAllowancePaidLogItem,
  MarketAllowanceSummary,
  Paginated,
  PaginationParams,
  ParticipationAwardInviterResponse,
  ParticipationAwardLogItem,
  ParticipationAwardSummary,
  QualifiedPartitionsResponse,
  RankRewardLogItem,
  RankRewardPeerSurpassLogItem,
  RankRewardSummary,
  RankRewardTeamMemberItem,
  RankRewardTeamMembersParams,
  ReferralAwardDirectReferralItem,
  ReferralAwardDirectReferralsParams,
  ReferralAwardLogItem,
  ReferralAwardSummary,
  ReleasePoolLogItem,
  ReleasePoolLogsParams,
  ReleasePoolSummary,
  RewardLogItem,
  RewardTotals,
  SalesLogItem,
  StakeAddressCountStats,
  StakeFlowLogItem,
  StakeFlowLogsParams,
  StakePositionsPage,
  TeamCommunityOverview,
  TeamReferralItem,
  TeamRewardClaimLogItem,
  TeamRewardSignature,
  TurbineLogItem,
  TurbineLogsParams,
  TurbineSummary,
  UserPerformance,
  X0MiningLogItem,
  X0MiningLogsParams,
  X0MiningPositionsPage,
} from '~/shared/api/types'

/**
 * 后端 API 端点封装
 *
 * 每个导出函数对应 docs/backend-api/api.md 中的一个 POST 端点，是 apiRequest 的薄封装：
 * 统一处理分页参数、可选过滤字段与鉴权 token。
 * 分页默认 page=1、page_size=20。
 *
 * @see docs/backend-api/api.md
 */
function paginationBody(params: PaginationParams = {}) {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 20,
  }
}

/** POST 分页列表，附带一个可选的过滤字段。 */
function postFilteredPage<TItem>(
  path: string,
  token: string,
  params: PaginationParams,
  filterKey: string,
  filterValue: unknown,
): Promise<Paginated<TItem>> {
  return apiRequest<Paginated<TItem>>(path, {
    method: 'POST',
    token,
    body: {
      ...paginationBody(params),
      ...(filterValue !== undefined ? { [filterKey]: filterValue } : {}),
    },
  })
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

export async function getHomePopupNotices(locale?: string): Promise<HomePopupNoticesResponse> {
  return apiRequest<HomePopupNoticesResponse>('/home/popup-notices', {
    method: 'POST',
    body: locale ? { locale } : {},
  })
}

export async function getPerformance(token: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/performance', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function searchPerformance(address: string): Promise<UserPerformance> {
  return apiRequest<UserPerformance>('/search/performance', {
    method: 'POST',
    body: { address },
  })
}

export async function getQualifiedPartitions(token: string): Promise<QualifiedPartitionsResponse> {
  return apiRequest<QualifiedPartitionsResponse>('/performance/qualified-partitions', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getMakingOverview(token: string): Promise<MakingOverview> {
  return apiRequest<MakingOverview>('/performance/making-overview', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getStakeAddressCount(token: string): Promise<StakeAddressCountStats> {
  return apiRequest<StakeAddressCountStats>('/performance/stake-address-count', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getSalesLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<SalesLogItem>> {
  return apiRequest<Paginated<SalesLogItem>>('/sales/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRewardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RewardLogItem>> {
  return apiRequest<Paginated<RewardLogItem>>('/rewards/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getReferralTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/referral/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTeamRewardTotal(token: string): Promise<RewardTotals> {
  return apiRequest<RewardTotals>('/team-reward/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getCommunityFundTotal(token: string): Promise<CommunityFundTotals> {
  return apiRequest<CommunityFundTotals>('/community-fund/total', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getCommunityFundLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<CommunityFundLogItem>> {
  return apiRequest<Paginated<CommunityFundLogItem>>('/community-fund/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTeamReferrals(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamReferralItem>> {
  return apiRequest<Paginated<TeamReferralItem>>('/team/referrals', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTeamOverview(token: string): Promise<TeamCommunityOverview> {
  return apiRequest<TeamCommunityOverview>('/team/overview', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTeamRewardClaimLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<TeamRewardClaimLogItem>> {
  return apiRequest<Paginated<TeamRewardClaimLogItem>>('/team-reward/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getAgxContributionSummary(token: string): Promise<AgxContributionSummary> {
  return apiRequest<AgxContributionSummary>('/agx-contribution/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAgxContributionBurnLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<AgxContributionBurnLogItem>> {
  return apiRequest<Paginated<AgxContributionBurnLogItem>>('/agx-contribution/burn-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getAgxContributionConsumeLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<AgxContributionConsumeLogItem>> {
  return apiRequest<Paginated<AgxContributionConsumeLogItem>>('/agx-contribution/consume-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getAssetsHoldingsDistribution(
  token: string,
): Promise<AssetsHoldingsDistribution> {
  return apiRequest<AssetsHoldingsDistribution>('/assets/holdings-distribution', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAssetsHoldingsSummary(token: string): Promise<AssetsHoldingsSummary> {
  return apiRequest<AssetsHoldingsSummary>('/assets/holdings-summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getAssetsRewardSummary(token: string): Promise<AssetsRewardSummary> {
  return apiRequest<AssetsRewardSummary>('/assets/reward-summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getBondFlowLpLogs(
  token: string,
  params: BondFlowLogsParams = {},
): Promise<Paginated<BondFlowLogItem>> {
  return postFilteredPage('/bond-flow/lp-logs', token, params, 'operation', params.operation)
}

export async function getBondFlowBurnLogs(
  token: string,
  params: BondFlowLogsParams = {},
): Promise<Paginated<BondFlowLogItem>> {
  return postFilteredPage('/bond-flow/burn-logs', token, params, 'operation', params.operation)
}

export async function getBondFlowLpPurchases(
  token: string,
  params: PaginationParams = {},
): Promise<BondPurchasesPage> {
  return apiRequest<BondPurchasesPage>('/bond-flow/lp-purchases', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getBondFlowBurnPurchases(
  token: string,
  params: PaginationParams = {},
): Promise<BondPurchasesPage> {
  return apiRequest<BondPurchasesPage>('/bond-flow/burn-purchases', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getBufferPoolSummary(token: string): Promise<BufferPoolSummary> {
  return apiRequest<BufferPoolSummary>('/buffer-pool/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getBufferPoolLogs(
  token: string,
  params: BufferPoolLogsParams = {},
): Promise<Paginated<BufferPoolLogItem>> {
  return postFilteredPage('/buffer-pool/logs', token, params, 'event_type', params.event_type)
}

export async function getLuckyRewardSummary(token: string): Promise<LuckyRewardSummary> {
  return apiRequest<LuckyRewardSummary>('/lucky-reward/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getLuckyRewardMyRounds(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<LuckyRewardMyRoundItem>> {
  return apiRequest<Paginated<LuckyRewardMyRoundItem>>('/lucky-reward/my-rounds', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getLuckyRewardWinners(
  token: string,
  date: string,
): Promise<LuckyRewardWinnersResponse> {
  return apiRequest<LuckyRewardWinnersResponse>('/lucky-reward/winners', {
    method: 'POST',
    token,
    body: { date },
  })
}

export async function getMarketAllowanceSummary(token: string): Promise<MarketAllowanceSummary> {
  return apiRequest<MarketAllowanceSummary>('/market-allowance/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getMarketAllowanceClaimLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<MarketAllowanceClaimLogItem>> {
  return apiRequest<Paginated<MarketAllowanceClaimLogItem>>('/market-allowance/claim-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getMarketAllowancePaidLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<MarketAllowancePaidLogItem>> {
  return apiRequest<Paginated<MarketAllowancePaidLogItem>>('/market-allowance/paid-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getParticipationAwardSummary(
  token: string,
): Promise<ParticipationAwardSummary> {
  return apiRequest<ParticipationAwardSummary>('/participation-award/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getParticipationAwardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<ParticipationAwardLogItem>> {
  return apiRequest<Paginated<ParticipationAwardLogItem>>('/participation-award/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getParticipationAwardInviter(
  token: string,
): Promise<ParticipationAwardInviterResponse> {
  return apiRequest<ParticipationAwardInviterResponse>('/participation-award/inviter', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getRankRewardSummary(token: string): Promise<RankRewardSummary> {
  return apiRequest<RankRewardSummary>('/rank-reward/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getRankRewardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RankRewardLogItem>> {
  return apiRequest<Paginated<RankRewardLogItem>>('/rank-reward/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRankRewardPeerSurpassLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<RankRewardPeerSurpassLogItem>> {
  return apiRequest<Paginated<RankRewardPeerSurpassLogItem>>('/rank-reward/peer-surpass-logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getRankRewardTeamMembers(
  token: string,
  params: RankRewardTeamMembersParams = {},
): Promise<Paginated<RankRewardTeamMemberItem>> {
  return apiRequest<Paginated<RankRewardTeamMemberItem>>('/rank-reward/team-members', {
    method: 'POST',
    token,
    body: {
      ...paginationBody(params),
      ...(params.sort_time !== undefined ? { sort_time: params.sort_time } : {}),
      ...(params.hide_zero_market !== undefined
        ? { hide_zero_market: params.hide_zero_market }
        : {}),
    },
  })
}

export async function getReferralAwardSummary(token: string): Promise<ReferralAwardSummary> {
  return apiRequest<ReferralAwardSummary>('/referral-award/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getReferralAwardLogs(
  token: string,
  params: PaginationParams = {},
): Promise<Paginated<ReferralAwardLogItem>> {
  return apiRequest<Paginated<ReferralAwardLogItem>>('/referral-award/logs', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getReferralAwardDirectReferrals(
  token: string,
  params: ReferralAwardDirectReferralsParams = {},
): Promise<Paginated<ReferralAwardDirectReferralItem>> {
  return apiRequest<Paginated<ReferralAwardDirectReferralItem>>(
    '/referral-award/direct-referrals',
    {
      method: 'POST',
      token,
      body: {
        ...paginationBody(params),
        ...(params.hide_zero_position !== undefined
          ? { hide_zero_position: params.hide_zero_position }
          : {}),
      },
    },
  )
}

export async function getReleasePoolSummary(token: string): Promise<ReleasePoolSummary> {
  return apiRequest<ReleasePoolSummary>('/release-pool/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getReleasePoolLogs(
  token: string,
  params: ReleasePoolLogsParams = {},
): Promise<Paginated<ReleasePoolLogItem>> {
  return postFilteredPage('/release-pool/logs', token, params, 'event_type', params.event_type)
}

export async function getStakeFlowLogs(
  token: string,
  params: StakeFlowLogsParams = {},
): Promise<Paginated<StakeFlowLogItem>> {
  return postFilteredPage('/stake-flow/logs', token, params, 'operation', params.operation)
}

export async function getStakeFlowPositions(
  token: string,
  params: PaginationParams = {},
): Promise<StakePositionsPage> {
  return apiRequest<StakePositionsPage>('/stake-flow/positions', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function getTurbineSummary(token: string): Promise<TurbineSummary> {
  return apiRequest<TurbineSummary>('/turbine/summary', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function getTurbineLogs(
  token: string,
  params: TurbineLogsParams = {},
): Promise<Paginated<TurbineLogItem>> {
  return postFilteredPage('/turbine/logs', token, params, 'turbine_type', params.turbine_type)
}

export async function getX0MiningLogs(
  token: string,
  params: X0MiningLogsParams = {},
): Promise<Paginated<X0MiningLogItem>> {
  return postFilteredPage('/x0-mining/logs', token, params, 'operation', params.operation)
}

export async function getX0MiningPositions(
  token: string,
  params: PaginationParams = {},
): Promise<X0MiningPositionsPage> {
  return apiRequest<X0MiningPositionsPage>('/x0-mining/positions', {
    method: 'POST',
    token,
    body: paginationBody(params),
  })
}

export async function requestTeamRewardSignature(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/team-reward', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function requestCommunityFundClaim(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/community-fund', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function requestIncentiveClaim(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/incentive', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function requestDaoClaim(
  token: string,
  rewardType: DaoRewardType,
): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/dao-reward', {
    method: 'POST',
    token,
    body: { rewardType },
  })
}

export async function requestMarketFundClaim(token: string): Promise<TeamRewardSignature> {
  return apiRequest<TeamRewardSignature>('/claim/market-fund', {
    method: 'POST',
    token,
    body: {},
  })
}

export async function parseClaimSignature(
  token: string,
  request: ClaimParseSignatureRequest,
): Promise<ClaimParseSignatureResult> {
  return apiRequest<ClaimParseSignatureResult>('/claim/parse-signature', {
    method: 'POST',
    token,
    body: request,
  })
}

export async function confirmTeamRewardClaim(
  token: string,
  request: ClaimConfirmRequest,
): Promise<ClaimConfirmResult> {
  return apiRequest<ClaimConfirmResult>('/claim/confirm', {
    method: 'POST',
    token,
    body: request,
  })
}
