import { dappAssets } from '~/app/assets'
import { useGenesisPromoChrome } from '~/hooks/use-genesis-promo'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Section } from '~/shared/components/section'
import { Steps } from '~/shared/components/steps'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import {
  CommunityProgramCard,
  CommunityProgramGrid,
} from '~/views/dapp/community/community-flow-primitives'

const PROGRAM_IMAGES = [dappAssets.communityProgramRocket, dappAssets.communityProgramStar] as const

/**
 * 邀请引导区块
 *
 * 把文案中的邀请步骤条目逐条渲染为步骤列表。
 */
export function CommunityInviteSection() {
  const { messages: t } = useI18n()

  const inviteFlowItems = t.community.inviteFlow.items.map(({ title, body }) => ({
    body,
    title,
  }))

  return (
    <Section reveal>
      <Section.Title>{t.community.inviteTitle}</Section.Title>
      <div data-slot-id="community-invite-steps">
        <Card className="rounded-2xl p-4" surface="elevated">
          <Steps align="start">
            {inviteFlowItems.map((step) => (
              <Steps.Item body={step.body} key={String(step.title)} title={step.title} />
            ))}
          </Steps>
        </Card>
      </div>
    </Section>
  )
}

/**
 * 生态支持区块
 *
 * 渲染两张项目推广卡；首张卡标题按当前创世季度动态替换。
 */
export function CommunityProgramsSection() {
  const { messages: t } = useI18n()
  const genesis = useGenesisPromoChrome()

  const programItems = t.community.programs.items.map((program, index) => {
    if (index !== 0) return program
    return {
      ...program,
      label: applyMessageTemplate(program.label, {
        season: String(genesis.activeSeasonNumber),
      }),
    }
  })

  return (
    <Section reveal>
      <Section.Title>{t.community.programs.title}</Section.Title>
      <CommunityProgramGrid>
        {programItems.map((program, index) => (
          <CommunityProgramCard
            action={program.action}
            body={program.body}
            href={program.href}
            image={PROGRAM_IMAGES[index]}
            key={program.label}
            label={program.label}
            title={program.title}
          />
        ))}
      </CommunityProgramGrid>
    </Section>
  )
}
