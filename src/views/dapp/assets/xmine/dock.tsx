import { ZERO_BI } from '~/core/constants'
import { formatTokenAmount } from '~/core/exchange/token-amount'
import { EXCHANGE_CONFIG } from '~/shared/config/exchange'
import {
  AssetsListPager,
  AssetsPositionListSkeleton,
} from '~/views/dapp/assets/position/primitives'
import { AssetsPositionEmptyCard, AssetsQuoteToolbar } from '~/views/dapp/assets/primitives'
import { AssetsRedeemConfirm } from '~/views/dapp/assets/redeem/assets-redeem-confirm'
import { AssetsXminePositionCard } from '~/views/dapp/assets/xmine/primitives'
import { useXmineDock } from '~/views/dapp/assets/xmine/use-xmine'
import { DockConnectPromo } from '~/views/dapp/shared/dock-connect-promo'
import { DockStack } from '~/views/dapp/shared/dock-frame'
import { openStakingView } from '~/views/dapp/shared/navigation'
import { TabHeader } from '~/views/dapp/shared/tab-header'

/** X 挖矿侧栏：报价 / 排序工具条 + 挖矿持仓卡（含空态、加载态）与赎回确认弹窗 */
export function XmineDock() {
  const vm = useXmineDock()
  const { t, copy, position } = vm

  return (
    <>
      <TabHeader
        backText={t.assets.backToHub}
        onBack={() => vm.setView('hub')}
        subtitle={copy.intro}
        title={copy.title}
      >
        <DockStack>
          <AssetsQuoteToolbar
            onQuoteChange={vm.setQuote}
            onSortChange={vm.setSort}
            quote={vm.quote}
            quoteLabel={t.assets.position.quoteCurrency}
            sortLabel={t.assets.position.sort}
            sortOptions={vm.sortOptions}
            sortValue={vm.sort}
          />

          {!vm.walletReady ? (
            <DockConnectPromo />
          ) : vm.isLoading ? (
            <AssetsPositionListSkeleton count={1} />
          ) : vm.isEmpty || !position ? (
            <AssetsPositionEmptyCard
              body={copy.empty}
              ctaLabel={copy.emptyCta}
              onCta={() => openStakingView('xmine')}
              title={t.assets.position.emptyTitle}
            />
          ) : (
            <AssetsXminePositionCard
              activateWarmupLabel={t.assets.position.activateWarmup}
              busy={vm.busy}
              claimLabel={t.assets.position.claim}
              gons={position.gons}
              locked={vm.locked}
              lockedPrefix={t.assets.position.lockedPrefix}
              miningStake={position.miningStake}
              onActivateWarmup={() => void vm.handleActivateWarmup()}
              onClaim={() => void vm.handleClaim()}
              onRequestUnstake={vm.requestUnstake}
              outputCaption={copy.output}
              pending={position.pending}
              periodPill={copy.periodPill}
              quote={vm.quote}
              redeemAnytimeLabel={t.assets.position.unstakeAnytime}
              redeemLabel={t.assets.position.unstake}
              remainingCaption={t.assets.position.remaining}
              stakedCaption={t.assets.position.staked}
              voucherAddress={vm.voucherAddress}
              voucherCaption={t.assets.position.voucher}
              warmupEndTime={position.warmupEndTime}
              warmupGons={position.warmupGons}
            />
          )}

          {!vm.isEmpty && vm.walletReady ? (
            <AssetsListPager
              onPageChange={() => {}}
              page={0}
              pageCount={1}
              pageSize={vm.pageSize}
              total={vm.totalRows}
            />
          ) : null}
        </DockStack>
      </TabHeader>

      <AssetsRedeemConfirm
        amountLabel={
          vm.position
            ? `${formatTokenAmount(
                vm.position.warmupGons > ZERO_BI ? ZERO_BI : vm.position.miningStake,
                EXCHANGE_CONFIG.tokens.gagx.decimals,
                2,
              )} gAGX`
            : ''
        }
        busy={vm.busy}
        confirmCta={t.assets.redeem.unstakeConfirmCta}
        onConfirm={() => void vm.handleUnstake()}
        onOpenChange={vm.setConfirmUnstake}
        open={vm.confirmUnstake}
      />
    </>
  )
}
