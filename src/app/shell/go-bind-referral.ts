import { useDappShellStore } from '~/stores/dapp-shell-store'

/**
 * 跳转到社区页，让用户补绑推荐人。
 *
 * 手册 §5 规定：未绑定推荐关系的地址在质押 / 债券等写操作前必须补绑，
 * 后端在需要补绑时返回 need_referral / notBound，前端据此引导用户去绑定。
 *
 * @see 手册 §5 推荐关系 Referral
 */
export function goBindReferral(): void {
  useDappShellStore.getState().selectTab('community')
}
