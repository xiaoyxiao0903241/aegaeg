import { toast } from 'sonner'

/** Run quoted exchange submit and toast success when ok. */
export async function submitExchangeWithSuccessToast(
  submit: () => Promise<{ ok: boolean }>,
  successMessage: string,
): Promise<void> {
  const result = await submit()
  if (result.ok) toast.success(successMessage)
}
