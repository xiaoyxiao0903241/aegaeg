import { useEffect } from 'react'
import { toast } from 'sonner'
import {
  getAccountBannedToastId,
  subscribeAccountBanned,
} from '~/lib/api/account-banned'
import { useI18n } from '~/i18n/use-i18n'

/** Shows a single deduped toast when apiRequest intercepts a banned-account 403. */
export function AccountBannedNotifier() {
  const { messages: t } = useI18n()

  useEffect(() => {
    return subscribeAccountBanned(() => {
      toast.error(t.wallet.accountBanned, { id: getAccountBannedToastId() })
    })
  }, [t.wallet.accountBanned])

  return null
}
