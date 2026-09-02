/**
 * 绑定推荐人前：父节点是否允许。
 *
 * 手册：父节点须已绑定，**或为推荐树 root**（root 本身可不 `isBindReferral`）。
 *
 * @param input.parent 拟绑定的推荐人地址
 * @param input.parentBound `isBindReferral(parent)`
 * @param input.root `getRootAddress()` 链上根地址
 * @returns 允许绑定返回 true
 * @see docs/onchain-manual/contracts/referral.md
 * @see 手册 §5.4 用户写方法
 */
export function isReferralParentAllowed(input: {
  parent: string
  parentBound: boolean
  root: string
}): boolean {
  if (input.parentBound) return true
  return input.parent.toLowerCase() === input.root.toLowerCase()
}
