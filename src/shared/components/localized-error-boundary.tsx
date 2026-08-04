import type { ReactNode } from 'react'

import { useI18n } from '~/i18n/use-i18n'
import { ErrorBoundary } from '~/shared/components/error-boundary'

/** Wraps ErrorBoundary with catalog copy so defaults are never English-only. */
export function LocalizedErrorBoundary({ children, name }: { children: ReactNode; name?: string }) {
  const { messages: t } = useI18n()
  return (
    <ErrorBoundary
      fallbackBody={t.errors.pageLoadFailedBody}
      fallbackTitle={t.errors.pageLoadFailed}
      name={name}
      reloadLabel={t.errors.reloadPage}
    >
      {children}
    </ErrorBoundary>
  )
}
