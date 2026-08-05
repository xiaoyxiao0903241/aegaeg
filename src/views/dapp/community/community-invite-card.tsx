/**
 * 社区邀请步骤卡
 *
 * 展示邀请流程的逐步说明。
 */
import { Card } from '~/shared/components/card'
import { Steps } from '~/shared/components/steps'

export function CommunityInviteCard({
  steps,
}: {
  steps: ReadonlyArray<{ title: string; body: string }>
}) {
  return (
    <div data-slot-id="community-invite-steps">
      <Card className="rounded-2xl p-4" surface="elevated">
        <Steps align="start">
          {steps.map((step) => (
            <Steps.Item body={step.body} key={String(step.title)} title={step.title} />
          ))}
        </Steps>
      </Card>
    </div>
  )
}
