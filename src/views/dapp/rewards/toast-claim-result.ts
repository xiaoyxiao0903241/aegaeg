import { toast } from 'sonner'

/** Shared claim toast: confirm_failed → warning; else success. */
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
