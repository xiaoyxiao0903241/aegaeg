/**
 * 释放机制步骤卡
 *
 * 居中展示进入释放池前的流程步骤，当前停在「进入释放池」一步。
 */
import { Card } from '~/shared/components/card'
import { Steps } from '~/shared/components/steps'

export function ReleaseMechanismCard({
  steps,
}: {
  steps: ReadonlyArray<{ title: string; body: string }>
}) {
  return (
    <Card className="rounded-2xl p-6" data-slot-id="release-mechanism-steps" surface="elevated">
      <Steps activeIndex={2} align="center">
        {steps.map((step) => (
          <Steps.Item body={step.body} key={step.title} title={step.title} />
        ))}
      </Steps>
    </Card>
  )
}
