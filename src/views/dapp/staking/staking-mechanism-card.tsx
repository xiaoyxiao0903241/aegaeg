/**
 * 质押 / 债券机制步骤卡
 *
 * 有步骤时展示步骤条；否则展示说明文案。
 */
import { Card } from '~/shared/components/card'
import { Steps } from '~/shared/components/steps'
import { Text } from '~/shared/components/text'

export function StakingMechanismCard({
  mechanism,
  steps,
}: {
  mechanism?: string
  steps?: ReadonlyArray<{ title: string; body: string }>
}) {
  if (steps && steps.length > 0) {
    return (
      <Card className="rounded-2xl p-6" surface="elevated">
        <Steps align="start">
          {steps.map((step) => (
            <Steps.Item body={step.body} key={step.title} title={step.title} />
          ))}
        </Steps>
      </Card>
    )
  }

  if (mechanism == null || mechanism === '') return null

  return (
    <Text as="p" className="m-0" tone="muted-foreground" variant="copy">
      {mechanism}
    </Text>
  )
}
