import { WidgetConnectPromo } from '~/app/shell/widget-connect-promo'
import { InlineAlert } from '~/shared/components/inline-alert'

/** 兑换提交按钮下方的通用提示区：未连接时引导连接，有阻断原因时展示告警。 */
export function ExchangeWidgetSessionFooter({
  sessionReady,
  blockHint,
}: {
  sessionReady: boolean
  blockHint?: string | null
}) {
  return (
    <>
      {!sessionReady ? <WidgetConnectPromo className="mt-3.5" /> : null}
      {blockHint ? (
        <InlineAlert className="mt-3" role="status">
          {blockHint}
        </InlineAlert>
      ) : null}
    </>
  )
}
