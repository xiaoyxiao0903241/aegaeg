import { proposalHashForView, type ProposalView } from '~/shared/config/dapp-deep-links'
import { createDappSubviewStore } from '~/stores/create-dapp-subview-store'

export type { ProposalView }

function proposalViewHash(view: ProposalView): string {
  return proposalHashForView(view === 'detail' ? useProposalViewStore.getState().selectedId : null)
}

const proposalView = createDappSubviewStore<ProposalView, { selectedId: number | null }>({
  hub: 'hub',
  hashForView: proposalViewHash,
  extra: { selectedId: null },
})

/** 当前提案子页与切换动画状态。 */
export const useProposalViewStore = proposalView.useStore
export const useProposalViewMotion = proposalView.useMotion

function syncSelectedId(id: number | null) {
  useProposalViewStore.setState({ selectedId: id })
}

/** 打开提案详情。id 写入 hash，刷新可恢复。 */
export function openProposalDetail(id: number) {
  syncSelectedId(id)
  useProposalViewStore.getState().setView('detail')
}

/** 返回提案列表。 */
export function closeProposalDetail() {
  syncSelectedId(null)
  useProposalViewStore.getState().backToHub()
}

/**
 * 由 URL hash 水合详情或列表。
 *
 * @param id `#proposal/{id}` 的数字；无效则回列表
 */
export function hydrateProposalLocation(id: number | null) {
  const detail = id != null && id > 0
  syncSelectedId(detail ? id : null)
  useProposalViewStore.getState().hydrateView(detail ? 'detail' : 'hub')
}
