/** Lucky mode UI 零件。 */
/**
 * 幸运奖 VRF 说明卡
 *
 * 深色底展示 Chainlink 随机开奖说明；
 * 「验证教程」切换三步链上核对步骤，高度用 Reveal 缓动。
 */
import { useId, useState } from 'react'

import { dappAssets } from '~/shared/assets/dapp'
import { Card } from '~/shared/components/card'
import { Reveal } from '~/shared/components/reveal'
import { Text } from '~/shared/components/text'

export function LuckyVrfCard({
  body,
  collapseTutorial,
  guideSteps,
  title,
  verifyTutorial,
}: {
  body: string
  collapseTutorial: string
  guideSteps: readonly string[]
  title: string
  verifyTutorial: string
}) {
  const [open, setOpen] = useState(false)
  const guideId = useId()

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
        <button
          aria-controls={guideId}
          aria-expanded={open}
          className="duration-dapp-base inline-flex shrink-0 cursor-pointer items-center rounded-full border border-white/25 bg-transparent px-[15px] py-[7px] transition-colors ease-dapp hover:bg-white/10"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <Text
            as="span"
            className="leading-none font-semibold whitespace-nowrap text-white"
            variant="copy"
          >
            {open ? collapseTutorial : verifyTutorial}
          </Text>
        </button>
      </div>
      <div>
        <Text as="p" className="text-white/65" variant="support">
          {body}
        </Text>
        {/* 教程挂在正文下，避免 flex gap 在 Reveal 挂载时跳空档 */}
        <Reveal open={open}>
          <div className="pt-3.5" id={guideId}>
            <div className="grid gap-2.5 border-t border-white/10 pt-3.5">
              <Text
                as="span"
                className="font-semibold tracking-[0.04em] text-white/50"
                variant="support"
              >
                {verifyTutorial}
              </Text>
              <ol className="m-0 grid list-none gap-2 p-0">
                {guideSteps.map((step, index) => (
                  <li className="flex gap-2.5" key={step}>
                    <Text
                      as="b"
                      className="grid size-4.5 shrink-0 place-items-center rounded-full bg-primary/90 text-[11px] leading-none font-bold text-white"
                      variant="caption"
                    >
                      {index + 1}
                    </Text>
                    <Text as="span" className="text-white/75" variant="copy">
                      {step}
                    </Text>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </Card>
  )
}
