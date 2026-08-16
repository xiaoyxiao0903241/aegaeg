import { toast } from 'sonner'

/**
 * 领取结果统一提示
 *
 * confirm_failed 表示链上已成功但确认同步失败，用警告提示；
 * 其余情况提示成功。
 *
 * @param result 领取结果（null 时不提示）
 * @param copy.claimSuccess 成功文案
 * @param copy.confirmSyncFailed 确认同步失败文案（缺省沿用成功文案）
 */
export function toastClaimResult(
  result: { status: 'success' | 'confirm_failed' } | null | undefined,
  copy: { claimSuccess: string; confirmSyncFailed?: string },
): void {
  if (!result) return
  if (result.status === 'confirm_failed') {
    toast.warning(copy.confirmSyncFailed ?? copy.claimSuccess)
    return
  }
  toast.success(copy.claimSuccess)
}
