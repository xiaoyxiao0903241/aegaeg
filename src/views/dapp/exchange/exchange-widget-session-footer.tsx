import { DappWidgetConnectPromo } from '~/app/shell/dapp-widget-connect-footer'
import { DappInlineAlert } from '~/shared/ui/dapp-inline-alert'

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
        <DappInlineAlert className="mt-3" role="status">
          {blockHint}
        </DappInlineAlert>
      ) : null}
    </>
  )
}
