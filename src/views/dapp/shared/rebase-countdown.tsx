/**
 * 下一次 Rebase 发放倒计时
 *
 * 读质押池当前 epoch 结束块，与质押页同一套钟；推荐 / 参与 / 共建奖励同周期复用。
 */
import { useI18n } from '~/i18n/use-i18n'
import {
  CountdownValue,
  remainingSecFromBlocks,
  useAnchoredRemainingSec,
} from '~/shared/components/countdown-value'
import { Text } from '~/shared/components/text'
import { useStakingHubOverviewQuery } from '~/web3/staking/use-staking-queries'

export function RebaseCountdownValue() {
  const { messages: t } = useI18n()
  const units = t.staking.aside.countdownUnits
  const overviewQuery = useStakingHubOverviewQuery()
  const remainingSec = useAnchoredRemainingSec(
    remainingSecFromBlocks(
      overviewQuery.data?.epochEndBlock,
      overviewQuery.data?.currentBlock,
      overviewQuery.data?.secondsPerBlock,
    ),
  )

  return (
    <CountdownValue
      className="gap-x-1"
      labels={{
        hours: (
          <Text as="span" variant="detail">
            {units.hours}
          </Text>
        ),
        minutes: (
          <Text as="span" variant="detail">
            {units.minutes}
          </Text>
        ),
      }}
      totalSec={remainingSec}
      trim={false}
      units={['hours', 'minutes']}
    />
  )
}
