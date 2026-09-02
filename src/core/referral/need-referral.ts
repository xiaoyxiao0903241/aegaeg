/**
 * 是否需要补绑推荐人的判断结果。
 *
 * 手册 §5：未绑定推荐关系的地址，在质押 / 债券 / 治理写操作前必须补绑。
 *
 * @see 手册 §5 推荐关系 Referral
 */
export type NeedReferralReason = 'need_referral'

/**
 * 判断当前地址是否需要补绑推荐人。
 *
 * 未绑定（false）与未知 / 加载中（null/undefined）都返回需要绑定；
 * 绑定关系未知时宁可要求补绑，也不放行资金写入。Flash / Trade
 * 路径不经过本判断。
 *
 * @param isBound 是否已绑定推荐人；未知时 null/undefined
 * @returns 需要补绑返回 'need_referral'；已绑定返回 null
 * @see 手册 §1.4 通用交易状态
 */
export function evaluateNeedReferral(
  isBound: boolean | null | undefined,
): NeedReferralReason | null {
  if (isBound === true) return null
  if (isBound === false) return 'need_referral'
  // 未知 / 加载中按未绑定处理，阻止资金写入
  return 'need_referral'
}
