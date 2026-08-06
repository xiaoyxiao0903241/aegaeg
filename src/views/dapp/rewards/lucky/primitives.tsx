/** Lucky mode UI 零件。 */
/**
 * 幸运奖 VRF 说明卡
 *
 * 深色底展示 Chainlink 随机开奖说明；验证教程按钮暂不可点。
 */
import { dappAssets } from '~/shared/assets/dapp'
import { Button } from '~/shared/components/button'
import { Card } from '~/shared/components/card'
import { Text } from '~/shared/components/text'

export function LuckyVrfCard({
  body,
  title,
  verifyTutorial,
}: {
  body: string
  title: string
  verifyTutorial: string
}) {
  return (
    <Card
      surface="inverse"
      className="flex flex-col gap-3.5 rounded-2xl bg-dark-panel px-5.5 py-5 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="inline-flex size-7.5 shrink-0 items-center justify-center rounded-control bg-white">
            <img alt="" className="size-4.5 object-contain" src={dappAssets.rewardsHubChainlink} />
          </span>
          <Text as="p" className="font-semibold text-white" variant="detail">
            {title}
          </Text>
        </div>
        <Button
          className="w-auto shrink-0 rounded-full border border-white/25 bg-transparent px-4 text-white hover:bg-white/10"
          disabled
          type="button"
          variant="secondary"
        >
          <Text as="span" className="font-semibold text-white" variant="copy">
            {verifyTutorial}
          </Text>
        </Button>
      </div>
      <Text as="p" className="text-white/65" variant="support">
        {body}
      </Text>
    </Card>
  )
}
