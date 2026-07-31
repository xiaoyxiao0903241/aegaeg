import { useState } from 'react'
import { useI18n } from '~/i18n/use-i18n'

type GrantRecordsTab = 'issue' | 'claim'

export function useRewardsGrantContentView() {
  const { messages: t } = useI18n()
  const grant = t.rewards.grant
  const [recordsTab, setRecordsTab] = useState<GrantRecordsTab>('issue')
  return {
    t,
    grant,
    recordsTab,
    setRecordsTab,
    recordsTabOptions: [
      { label: grant.recordsTabIssue, value: 'issue' as const },
      { label: grant.recordsTabClaim, value: 'claim' as const },
    ],
    isIssue: recordsTab === 'issue',
  }
}
