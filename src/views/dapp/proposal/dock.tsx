/**
 * 提案左栏
 *
 * 列表看编号 / 状态 / 标题；点进详情锁定 AGX 投赞成或反对。
 * 未连接钱包时只展示引导。已投票或投票结束只出说明，领取在右栏。
 */
import { VOTE_SUPPORT } from '~/core/proposal/proposal-state'
import { useDappHost } from '~/hooks/use-dapp-host'
import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { FieldActionChip } from '~/shared/components/chip'
import { FormActions } from '~/shared/components/form-actions'
import { Icon } from '~/shared/components/icon'
import { Input } from '~/shared/components/input'
import { MainButton } from '~/shared/components/main-button'
import { Skeleton } from '~/shared/components/skeleton'
import { Table } from '~/shared/components/table'
import { Text } from '~/shared/components/text'
import type { ProposalView } from '~/stores/proposal-view-store'
import { useProposalViewMotion } from '~/stores/proposal-view-store'
import {
  ProposalCodeLabel,
  ProposalListCard,
  ProposalListCardSkeleton,
  ProposalNotice,
  ProposalStateBadge,
  proposalStateKey,
  ProposalVotedBadge,
  VoteShareBar,
} from '~/views/dapp/proposal/primitives'
import { useProposalDock } from '~/views/dapp/proposal/use-proposal'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockFrame, DockStack } from '~/views/dapp/shared/dock-frame'
import { useSubviewView } from '~/views/dapp/shared/subview-panel'
import { TabHeader } from '~/views/dapp/shared/tab-header'
import { TabDockHost } from '~/views/dapp/shared/tab-host'
import { WriteBlockAlert } from '~/views/dapp/shared/write-block-alert'

function ProposalListDock() {
  const { walletReady } = useDappHost()
  const dock = useProposalDock()
  const { t } = dock

  return (
    <DockFrame
      subtitle={walletReady ? t.proposal.intro : t.proposal.disconnectedIntro}
      title={t.proposal.title}
    >
      {walletReady ? (
        dock.listLoading ? (
          <>
            <ProposalListCardSkeleton />
            <ProposalListCardSkeleton />
            <ProposalListCardSkeleton />
          </>
        ) : dock.cards.length > 0 ? (
          <>
            {dock.cards.map((card) => (
              <ProposalListCard
                code={card.code}
                key={card.id}
                meta={card.meta}
                onOpen={() => dock.openCard(card.id)}
                stateBadge={
                  <ProposalStateBadge state={card.state}>
                    {card.state == null ? '—' : t.proposal.state[proposalStateKey(card.state)]}
                  </ProposalStateBadge>
                }
                title={card.title}
                votedBadge={
                  card.voted ? <ProposalVotedBadge>{t.proposal.voted}</ProposalVotedBadge> : null
                }
              />
            ))}
            <Table.Pagination
              onPageChange={dock.setListPage}
              page={dock.listPage}
              total={dock.listTotal}
            />
          </>
        ) : (
          <Table.Empty
            authBody={t.dapp.connect.recordsBodyProposal}
            embedded
            title={t.proposal.listEmpty}
          />
        )
      ) : (
        <DockConnectPromo />
      )}
    </DockFrame>
  )
}

function ProposalVoteDock() {
  const dock = useProposalDock()
  const { t } = dock

  return (
    <TabHeader
      backText={t.proposal.backToList}
      onBack={dock.closeDetail}
      subtitle={null}
      title={dock.selectedTitle ?? dock.selectedCode}
    >
      <DockStack>
        <Card className="grid gap-3.5 p-4.5">
          <div className="flex items-center justify-between gap-2.5">
            <ProposalCodeLabel>{dock.selectedCode}</ProposalCodeLabel>
            <ProposalStateBadge state={dock.selectedState}>
              {dock.selectedState == null
                ? '—'
                : t.proposal.state[proposalStateKey(dock.selectedState)]}
            </ProposalStateBadge>
          </div>
          {dock.detailLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : dock.selectedBody ? (
            <Text as="p" className="m-0 text-pretty text-foreground/60" variant="copy">
              {dock.selectedBody}
            </Text>
          ) : null}
          <Text as="span" className="text-foreground/40 tabular-nums" variant="caption">
            {dock.selectedMeta}
          </Text>
          <div className="grid gap-2.5 border-t border-border pt-3.5">
            <VoteShareBar
              amount={dock.forAmount}
              label={t.proposal.for}
              percent={dock.shares.forPct}
              tone="for"
            />
            <VoteShareBar
              amount={dock.againstAmount}
              label={t.proposal.against}
              percent={dock.shares.againstPct}
              tone="against"
            />
          </div>
          {dock.showVoteForm ? (
            <div className="grid gap-2.5 border-t border-border pt-3.5">
              <div className="flex items-baseline justify-between gap-2.5">
                <Text as="span" className="font-semibold" variant="copy">
                  {t.proposal.lockToVote}
                </Text>
                <Text as="span" className="text-foreground/45 tabular-nums" variant="caption">
                  {dock.availableLabel}
                </Text>
              </div>
              <div className="flex items-center gap-2">
                <Card
                  as="section"
                  className="flex min-w-0 flex-1 items-center gap-2 px-3.5 py-3 focus-within:border-coral"
                  surface="outlined"
                >
                  <Input
                    variant="amount"
                    aria-label={t.proposal.amountAria}
                    className="w-0 min-w-0 flex-1 p-0 text-left text-(length:--type-detail-size) leading-(--type-detail-leading) font-semibold"
                    inputMode="decimal"
                    onChange={(event) => dock.setAmount(event.target.value)}
                    placeholder="0.00"
                    value={dock.amountDisplay}
                  />
                  <span className="flex shrink-0 items-center gap-1.25">
                    <Icon alt="" shape="circle" size="action" src={dappAssets.tokenAgx} />
                    <Text as="span" className="font-semibold text-foreground/45" variant="copy">
                      AGX
                    </Text>
                  </span>
                </Card>
                <FieldActionChip disabled={dock.isVoting} onClick={dock.fillMax}>
                  {t.common.max}
                </FieldActionChip>
              </div>
              <Text as="p" className="m-0 text-pretty text-foreground/45" variant="caption">
                {t.proposal.votePowerHint}
              </Text>
              <WriteBlockAlert hint={dock.voteHint} />
              <FormActions>
                <MainButton
                  density="card"
                  disabled={dock.voteForDisabled || dock.isVoting}
                  loading={dock.isVoting && dock.pendingSupport === VOTE_SUPPORT.for}
                  onClick={() => void dock.onVoteFor()}
                >
                  {dock.voteForLabel}
                </MainButton>
                <MainButton
                  className="bg-claim hover:bg-claim disabled:bg-muted disabled:text-muted-foreground"
                  density="card"
                  disabled={dock.voteAgainstDisabled || dock.isVoting}
                  loading={dock.isVoting && dock.pendingSupport === VOTE_SUPPORT.against}
                  onClick={() => void dock.onVoteAgainst()}
                >
                  {dock.voteAgainstLabel}
                </MainButton>
              </FormActions>
            </div>
          ) : null}
          {dock.votedNote ? <ProposalNotice tone="voted">{dock.votedNote}</ProposalNotice> : null}
          {dock.closedNote ? (
            <ProposalNotice tone="closed">{dock.closedNote}</ProposalNotice>
          ) : null}
        </Card>
      </DockStack>
    </TabHeader>
  )
}

function ProposalDockBody() {
  const view = useSubviewView<ProposalView>()
  if (view === 'detail') return <ProposalVoteDock />
  return <ProposalListDock />
}

export function ProposalDock() {
  const subview = useProposalViewMotion()
  return (
    <TabDockHost subview={subview}>
      <ProposalDockBody />
    </TabDockHost>
  )
}
