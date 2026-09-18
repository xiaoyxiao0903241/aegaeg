import { useState } from 'react'
import { toast } from 'sonner'

import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount, formatTokenAmountInputDisplay } from '~/core/exchange/token-amount'
import {
  evaluateProposalVoteLive,
  isProposalVoteCtaEnabled,
} from '~/core/proposal/proposal-block-reasons'
import {
  asProposalId,
  closedNoteKey,
  displayVoteSupport,
  formatProposalCode,
  isProposalVotingOpen,
  overlayMyVoteRow,
  parseProposalClaimStatus,
  parseProposalWei,
  PROPOSAL_STATE,
  type ProposalLockKind,
  proposalRewardHasPlus,
  type ProposalStateValue,
  VOTE_SUPPORT,
  voteSharePercents,
  type VoteSupportValue,
} from '~/core/proposal/proposal-state'
import { writeBlockHint } from '~/core/wallet/write-cta'
import {
  useGovernanceDetail,
  useGovernanceList,
  useGovernanceMyOperations,
  useGovernanceMyVotes,
  useGovernanceStats,
} from '~/hooks/use-api-data'
import { useCappedTokenAmountInput } from '~/hooks/use-capped-token-amount-input'
import { useChainMutation } from '~/hooks/use-chain-mutation'
import { useChainQuery } from '~/hooks/use-chain-query'
import { useDappHost } from '~/hooks/use-dapp-host'
import { interpolate } from '~/i18n/interpolate'
import { getHtmlLang } from '~/i18n/locale-meta'
import { useI18n } from '~/i18n/use-i18n'
import { queryKeys } from '~/shared/api/query/query-keys'
import { BSC_CONTRACTS } from '~/shared/config/contracts'
import type { ProposalView } from '~/shared/config/dapp-deep-links'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import { tablePageQuery } from '~/shared/lib/table-pagination'
import { formatFromNow, formatUtcBlockTime, interpolateLive } from '~/shared/presenters/format'
import {
  closeProposalDetail,
  openProposalDetail,
  useProposalViewStore,
} from '~/stores/proposal-view-store'
import { useWallClockSec } from '~/stores/wall-clock-store'
import { submitProposalVote, submitProposalWithdraw } from '~/views/dapp/proposal/submit-proposal'
import { goBindReferral } from '~/views/dapp/shared/navigation'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { readErrorText } from '~/web3/errors/error-text'
import { PROPOSAL_BLOCKED } from '~/web3/errors/write-block-errors'
import { readErc20Balance } from '~/web3/exchange/exchange-read'
import {
  type ChainVotePosition,
  readProposalLiveByIds,
  readProposalPositions,
  readProposalVoteSnapshot,
} from '~/web3/proposal/proposal-read'
import { useWriteReadiness } from '~/web3/wallet/use-write-readiness'
import { WRITE_PATH } from '~/web3/wallet/write-path'

const AGX_DECIMALS = EXCHANGE_CONFIG.tokens.agx.decimals

function orZero(value: bigint | null | undefined): bigint {
  if (value == null) return ZERO_BI
  return value
}

function voteCtaLabel(reason: string | null, bindCta: string, fallback: string): string {
  return reason === 'notBound' ? bindCta : fallback
}

function formatAgx(amount: bigint | null | undefined, options?: { plus?: boolean }): string {
  return formatTokenAmount(amount, AGX_DECIMALS, {
    digits: 2,
    trimZeros: false,
    prefix: options?.plus && amount != null ? '+' : '',
    suffix: ' AGX',
  })
}

function positionById(rows: ChainVotePosition[] | undefined): Map<number, ChainVotePosition> {
  const map = new Map<number, ChainVotePosition>()
  for (const row of rows ?? []) {
    const id = asProposalId(row.proposalId)
    if (id != null) map.set(id, row)
  }
  return map
}

function timeCopy(
  state: ProposalStateValue | null,
  voteStart: number,
  voteEnd: number,
  labels: {
    voteDeadline: string
    voteOpens: string
    voteEnded: string
  },
): string {
  if (state === PROPOSAL_STATE.pending) {
    return interpolate(labels.voteOpens, { time: formatUtcBlockTime(voteStart) })
  }
  if (state === PROPOSAL_STATE.active) {
    return interpolate(labels.voteDeadline, { time: formatUtcBlockTime(voteEnd) })
  }
  return interpolate(labels.voteEnded, { time: formatUtcBlockTime(voteEnd) })
}

/**
 * 提案左栏：列表分页、详情投票表单。
 */
export function useProposalDock() {
  const view = useSubviewView<ProposalView>()
  const onHub = view === 'hub'
  const onDetail = view === 'detail'
  const { locale, messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappHost()
  const { writeReady } = useWriteReadiness()
  const selectedId = useProposalViewStore((state) => state.selectedId)
  const [listPage, setListPage] = useState(1)
  const [pendingSupport, setPendingSupport] = useState<VoteSupportValue | null>(null)
  const listQuery = useGovernanceList(locale, tablePageQuery(listPage), sessionReady && onHub)
  const ids =
    onDetail && selectedId != null && selectedId > 0
      ? [selectedId]
      : (listQuery.data?.items ?? []).flatMap((item) => {
          const id = asProposalId(item.proposal_id)
          return id == null ? [] : [id]
        })
  const liveQuery = useChainQuery({
    scope: 'public',
    queryKey: queryKeys.chain.proposalLive(ids),
    queryFn: () => readProposalLiveByIds(ids),
    enabled: ids.length > 0,
  })
  const balanceQuery = useChainQuery({
    queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.agx),
    queryFn: (addr) => readErc20Balance(BSC_CONTRACTS.agx, addr),
    enabled: walletReady && onDetail,
  })
  const snapshotQuery = useChainQuery({
    queryKey: queryKeys.chain.proposalVoteSnapshot(selectedId ?? 0),
    queryFn: (addr) => readProposalVoteSnapshot({ user: addr, proposalId: selectedId ?? 0 }),
    enabled: onDetail && selectedId != null && selectedId > 0,
  })
  const detailQuery = useGovernanceDetail(
    selectedId,
    locale,
    sessionReady && onDetail && selectedId != null,
  )
  const amountInput = useCappedTokenAmountInput({
    decimals: AGX_DECIMALS,
    balance: orZero(balanceQuery.data),
    balancesLoaded: balanceQuery.data != null,
    sessionReady,
  })
  const voteMutation = useChainMutation({
    path: WRITE_PATH.PROPOSAL,
    mutation: async (
      vars: { proposalId: number; support: VoteSupportValue; amount: bigint },
      session,
    ) => {
      await submitProposalVote({
        session,
        proposalId: vars.proposalId,
        support: vars.support,
        amount: vars.amount,
      })
    },
    onSuccess: () => {
      toast.success(t.proposal.voteSuccess)
      amountInput.clearAmount()
    },
    onError: (error) => {
      if (readErrorText(error) === PROPOSAL_BLOCKED.notBound) goBindReferral()
    },
  })

  const liveMap = liveQuery.data ?? {}
  const cards = (listQuery.data?.items ?? []).map((item) => {
    const live = liveMap[item.proposal_id]
    const state = live?.state ?? null
    return {
      id: item.proposal_id,
      code: formatProposalCode(item.proposal_id),
      title: item.title,
      state,
      voted: item.has_voted,
      meta: timeCopy(state, live?.voteStart ?? 0, live?.voteEnd ?? 0, t.proposal),
    }
  })

  const selectedLive = selectedId != null ? liveMap[selectedId] : undefined
  const selectedApi = detailQuery.data
  const selectedState = selectedLive?.state ?? snapshotQuery.data?.state ?? null
  const snapshot = snapshotQuery.data
  const shares = voteSharePercents(
    orZero(selectedLive?.forVotes),
    orZero(selectedLive?.againstVotes),
  )
  const amountIn = amountInput.amountIn
  const hasVoted = snapshot != null && snapshot.hasVoted
  const existingSupport = displayVoteSupport(snapshot == null ? null : snapshot.existingSupport)
  const voteReason = snapshot
    ? evaluateProposalVoteLive({
        amount: amountIn,
        isBound: snapshot.isBound,
        state: snapshot.state,
        hasVoted: snapshot.hasVoted,
        existingSupport: snapshot.existingSupport,
        nextSupport: VOTE_SUPPORT.for,
        balance: snapshot.balance,
        allowance: snapshot.allowance,
        votedTotal: snapshot.votedTotal,
        maxQuorum: snapshot.maxQuorum,
      })
    : null
  const againstReason = snapshot
    ? evaluateProposalVoteLive({
        amount: amountIn,
        isBound: snapshot.isBound,
        state: snapshot.state,
        hasVoted: snapshot.hasVoted,
        existingSupport: snapshot.existingSupport,
        nextSupport: VOTE_SUPPORT.against,
        balance: snapshot.balance,
        allowance: snapshot.allowance,
        votedTotal: snapshot.votedTotal,
        maxQuorum: snapshot.maxQuorum,
      })
    : null
  const showVoteForm = isProposalVotingOpen(selectedState)
  const voteForLabel = voteCtaLabel(voteReason, t.proposal.blocked.bindCta, t.proposal.for)
  const voteAgainstLabel = voteCtaLabel(
    againstReason,
    t.proposal.blocked.bindCta,
    t.proposal.against,
  )
  const voteCtaBase = {
    amount: amountIn,
    snapshotReady: snapshot != null,
    walletReady,
    writeReady,
    isPending: voteMutation.isPending,
  }
  const voteForEnabled = isProposalVoteCtaEnabled({ ...voteCtaBase, reason: voteReason })
  const voteAgainstEnabled = isProposalVoteCtaEnabled({ ...voteCtaBase, reason: againstReason })
  const addOnReason = existingSupport === VOTE_SUPPORT.against ? againstReason : voteReason

  function onVote(support: VoteSupportValue) {
    if (!selectedId) return
    const reason = support === VOTE_SUPPORT.for ? voteReason : againstReason
    if (reason === 'notBound') {
      goBindReferral()
      return
    }
    setPendingSupport(support)
    void voteMutation.mutate({ proposalId: selectedId, support, amount: amountIn }).finally(() => {
      setPendingSupport(null)
    })
  }

  const myPrincipal = snapshot == null ? ZERO_BI : snapshot.principal
  const votedStance =
    existingSupport === VOTE_SUPPORT.for
      ? t.proposal.for
      : existingSupport === VOTE_SUPPORT.against
        ? t.proposal.against
        : null
  const votedNote =
    hasVoted && votedStance
      ? interpolate(t.proposal.votedStanceNote, {
          stance: votedStance,
          amount: formatAgx(myPrincipal),
        })
      : hasVoted
        ? t.proposal.votedLockedNote
        : null
  const noteKey = closedNoteKey(selectedState)

  return {
    t,
    listLoading: sessionReady && listQuery.isLoading && listQuery.data == null,
    listPage,
    setListPage,
    listTotal: listQuery.data?.total ?? 0,
    cards,
    openCard: openProposalDetail,
    closeDetail: closeProposalDetail,
    selectedCode: selectedId != null ? formatProposalCode(selectedId) : '',
    selectedTitle: selectedApi?.title ?? null,
    selectedBody: selectedApi?.content_text ?? null,
    detailLoading: selectedId != null && selectedApi == null && detailQuery.isLoading,
    selectedState,
    selectedMeta: interpolate(t.proposal.voteMeta, {
      time: timeCopy(
        selectedState,
        selectedLive?.voteStart ?? 0,
        selectedLive?.voteEnd ?? 0,
        t.proposal,
      ),
      amount: formatAgx(orZero(selectedLive?.forVotes) + orZero(selectedLive?.againstVotes)),
    }),
    shares,
    forAmount: formatAgx(selectedLive?.forVotes),
    againstAmount: formatAgx(selectedLive?.againstVotes),
    showVoteForm,
    closedNote: noteKey == null ? null : t.proposal.closed[noteKey],
    amountDisplay: formatTokenAmountInputDisplay(amountInput.amount),
    setAmount: amountInput.setAmount,
    fillMax: () => amountInput.fillPercent(100),
    availableLabel: interpolateLive(t.proposal.available, {
      amount: formatAgx(balanceQuery.data),
    }),
    voteForLabel,
    voteAgainstLabel,
    voteHint: writeBlockHint(
      addOnReason === 'belowMin' || addOnReason === 'supportMismatch' ? null : addOnReason,
      t.proposal.blocked,
    ),
    voteForDisabled: !voteForEnabled,
    voteAgainstDisabled: !voteAgainstEnabled,
    isVoting: voteMutation.isPending,
    pendingSupport,
    votedNote,
    onVoteFor: () => {
      onVote(VOTE_SUPPORT.for)
    },
    onVoteAgainst: () => {
      onVote(VOTE_SUPPORT.against)
    },
  }
}

/**
 * 提案右栏：统计卡、投票/奖励表、机制与 FAQ。
 */
export function useProposalDetail() {
  const { locale, messages: t } = useI18n()
  const { sessionReady, walletReady } = useDappHost()
  const nowSec = useWallClockSec(true)
  const [votesPage, setVotesPage] = useState(1)
  const [rewardsPage, setRewardsPage] = useState(1)
  const statsQuery = useGovernanceStats(sessionReady)
  const votesQuery = useGovernanceMyVotes(tablePageQuery(votesPage), sessionReady)
  const rewardsQuery = useGovernanceMyOperations(tablePageQuery(rewardsPage), sessionReady)
  const positionsQuery = useChainQuery({
    queryKey: queryKeys.chain.proposalPositions,
    queryFn: (addr) => readProposalPositions(addr),
    enabled: walletReady,
  })
  const voteIds = (votesQuery.data?.items ?? []).flatMap((item) => {
    const id = asProposalId(item.proposal_id)
    return id == null ? [] : [id]
  })
  const liveQuery = useChainQuery({
    scope: 'public',
    queryKey: queryKeys.chain.proposalLive(voteIds),
    queryFn: () => readProposalLiveByIds(voteIds),
    enabled: voteIds.length > 0,
  })
  const balanceQuery = useChainQuery({
    queryKey: queryKeys.chain.erc20Balance(BSC_CONTRACTS.agx),
    queryFn: (addr) => readErc20Balance(BSC_CONTRACTS.agx, addr),
    enabled: walletReady,
  })
  const withdrawMutation = useChainMutation({
    path: WRITE_PATH.PROPOSAL,
    mutation: async (vars: { proposalId: number }, session) => {
      await submitProposalWithdraw({ session, proposalId: vars.proposalId })
    },
    onSuccess: () => {
      toast.success(t.proposal.withdrawSuccess)
    },
  })

  const positions = positionById(positionsQuery.data)
  const positionsReady = positionsQuery.data != null
  let locked = ZERO_BI
  for (const row of positions.values()) locked += row.principal

  const liveMap = liveQuery.data ?? {}
  const voteRows = (votesQuery.data?.items ?? []).map((item) => {
    const id = asProposalId(item.proposal_id)
    const chain = id == null ? undefined : positions.get(id)
    const overlay = overlayMyVoteRow({
      voteType: item.vote_type,
      votes: item.votes,
      proposalState: item.proposal_state,
      liveState: id == null ? null : (liveMap[id]?.state ?? null),
      positionsReady,
      chain: chain ?? null,
      nowSec,
    })
    return {
      id: item.proposal_id,
      time: formatFromNow(item.voted_at, nowSec, getHtmlLang(locale)),
      code: formatProposalCode(item.proposal_id),
      support: overlay.support,
      power: formatAgx(overlay.power),
      state: overlay.state,
      lock: overlay.lock,
    }
  })
  const rewardRows = (rewardsQuery.data?.items ?? []).map((item) => {
    const id = asProposalId(item.proposal_id)
    const claim = parseProposalClaimStatus(item.claim_status)
    return {
      id: id ?? item.proposal_id,
      time: formatFromNow(item.time, nowSec, getHtmlLang(locale)),
      code: formatProposalCode(id ?? item.proposal_id),
      power: formatAgx(parseProposalWei(item.votes)),
      reward: formatAgx(parseProposalWei(item.reward), { plus: proposalRewardHasPlus(claim) }),
      claim,
    }
  })

  return {
    t,
    sessionReady,
    stats: sessionReady ? statsQuery.data : null,
    lockedLabel: formatAgx(walletReady && positionsReady ? locked : null),
    availableLabel: formatAgx(balanceQuery.data),
    votesPage,
    setVotesPage,
    votesTotal: votesQuery.data?.total ?? 0,
    votesLoading: sessionReady && votesQuery.isLoading,
    voteRows,
    rewardsPage,
    setRewardsPage,
    rewardsTotal: rewardsQuery.data?.total ?? 0,
    rewardsLoading: sessionReady && rewardsQuery.isLoading,
    rewardRows,
    openProposal: openProposalDetail,
    onWithdraw: (id: number) => {
      void withdrawMutation.mutate({ proposalId: id })
    },
    withdrawing: withdrawMutation.isPending,
  }
}

export type ProposalVoteRow = {
  id: number
  time: string
  code: string
  support: VoteSupportValue | null
  power: string
  state: ProposalStateValue | null
  lock: ProposalLockKind
}
