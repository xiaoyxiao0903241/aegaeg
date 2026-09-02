import { useEffect } from 'react'
import { toast } from 'sonner'

import { useI18n } from '~/i18n/use-i18n'
import { getAccountBannedToastId, subscribeAccountBanned } from '~/shared/api/account-banned'

/**
 * 账号被封禁全局提示
 *
 * 挂在应用根部，订阅 API 层拦截到的「账号封禁 403」事件，
 * 以固定 id 弹出去重提示，避免重复弹出。
 */
export function AccountBannedNotifier() {
  const { messages: t } = useI18n()

  useEffect(() => {
    return subscribeAccountBanned(() => {
      toast.error(t.wallet.accountBanned, { id: getAccountBannedToastId() })
    })
  }, [t.wallet.accountBanned])

  return null
}
