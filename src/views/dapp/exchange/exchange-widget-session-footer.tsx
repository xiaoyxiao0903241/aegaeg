import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { InlineAlert } from '~/shared/components/inline-alert'

/** Shared connect / block chrome under Exchange write CTAs. */
export function ExchangeWidgetSessionFooter({
  sessionReady,
  blockHint,
}: {
  sessionReady: boolean
  blockHint?: string | null
}) {
  return (
    <>
      {!sessionReady ? <DappWidgetConnectPromo className="mt-3.5" /> : null}
      {blockHint ? (
        <InlineAlert className="mt-3" role="status">
          {blockHint}
        </InlineAlert>
      ) : null}
    </>
  )
}
