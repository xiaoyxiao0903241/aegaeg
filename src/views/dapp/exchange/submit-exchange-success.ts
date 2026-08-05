import { toast } from 'sonner'

/** 执行兑换提交，成功后弹出成功提示。 */
export async function submitExchangeWithSuccessToast(
  submit: () => Promise<{ ok: boolean }>,
  successMessage: string,
): Promise<void> {
  const result = await submit()
  if (result.ok) toast.success(successMessage)
}
