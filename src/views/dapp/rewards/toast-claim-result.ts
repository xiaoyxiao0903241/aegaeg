import { toast } from 'sonner'

/**
 * 领取成功提示
 *
 * 流程已等过 confirm 尝试；调用方只在拿到结果时调用。
 *
 * @param result 领取结果（null 时不提示）
 * @param copy.claimSuccess 成功文案
 */
export function toastClaimResult(
  result: { status: 'success' } | null | undefined,
  copy: { claimSuccess: string },
): void {
  if (!result) return
  toast.success(copy.claimSuccess)
}
