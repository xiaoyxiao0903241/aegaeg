/**
 * 资产 Rebase 步骤说明卡
 *
 * 手机竖排步骤、桌面横排连线；底部要点标签与补充说明。
 */
import { dappAssets } from '~/app/assets'
import { Card } from '~/shared/components/card'
import { Icon } from '~/shared/components/icon'
import { Text } from '~/shared/components/text'

type RebaseStep = {
  title: string
  body: string
}

export function AssetsRebaseCard({
  footer,
  steps,
  tags,
}: {
  footer: string
  steps: ReadonlyArray<RebaseStep>
  tags: ReadonlyArray<string>
}) {
  return (
    <Card surface="elevated" className="grid gap-1.5 py-6">
      {/* 移动端时间轴：左端点 + 竖线连接 */}
      <ol className="m-0 flex list-none flex-col p-0 dapp:hidden">
        {steps.map((step, index) => (
          <li className="flex gap-3" key={`h5-${step.title}-${step.body}-${index}`}>
            <div className="flex w-3 shrink-0 flex-col items-center self-stretch">
              <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
              {index < steps.length - 1 ? (
                <span aria-hidden className="mt-0.5 w-0.5 flex-1 bg-border" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1 pb-4">
              <Text as="p" className="leading-5 font-bold" variant="headline">
                {step.title}
              </Text>
              <Text as="p" className="mt-1 leading-4" tone="muted-foreground" variant="copy">
                {step.body.replaceAll('\n', '')}
              </Text>
            </div>
          </li>
        ))}
      </ol>

      {/* 桌面端横轴连线：线高须显式声明，否则不渲染 */}
      <div className="relative hidden grid-cols-4 items-center dapp:grid">
        <div
          aria-hidden
          className="absolute inset-x-[12.5%] top-1/2 h-0.5 -translate-y-1/2 bg-border"
        />
        {steps.map((step) => (
          <span className="relative z-1 flex justify-center" key={`dot-${step.title}-${step.body}`}>
            <span aria-hidden className="size-2.5 shrink-0 rounded-full bg-primary" />
          </span>
        ))}
      </div>

      <ol className="m-0 hidden list-none grid-cols-4 gap-2 p-0 dapp:grid">
        {steps.map((step) => (
          <li className="px-1 pt-4 text-center" key={step.title + step.body}>
            <Text as="p" className="leading-5 font-bold" variant="headline">
              {step.title}
            </Text>
            <Text
              as="p"
              className="mt-1.5 leading-4 whitespace-pre-line"
              tone="muted-foreground"
              variant="copy"
            >
              {step.body}
            </Text>
          </li>
        ))}
      </ol>

      <div className="flex flex-col items-start gap-2.5 dapp:flex-row dapp:flex-wrap dapp:items-center dapp:justify-between dapp:gap-x-4 dapp:gap-y-2 dapp:rounded-2xl dapp:bg-muted dapp:px-6 dapp:py-3.5">
        {tags.map((tag) => (
          <span className="flex items-center gap-2 dapp:gap-1.5" key={tag}>
            <Icon
              alt=""
              className="h-4 w-4.5 shrink-0"
              size="sm"
              src={dappAssets.assetsHubCheckBadge}
            />
            <Text as="span" className="leading-4 dapp:font-semibold" variant="copy">
              {tag}
            </Text>
          </span>
        ))}
      </div>

      <Text as="p" className="leading-4 text-foreground/40" variant="copy">
        {footer}
      </Text>
    </Card>
  )
}
