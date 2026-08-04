import { dappAssets } from '~/app/assets'
import { DappSection } from '~/app/shell/dapp-section'
import { useGenesisPromoChrome } from '~/hooks/use-genesis-promo'
import { useI18n } from '~/i18n/use-i18n'
import { Card } from '~/shared/components/card'
import { Steps } from '~/shared/components/steps'
import { applyMessageTemplate } from '~/shared/lib/apply-message-template'
import {
  CommunityProgramCard,
  CommunityProgramGrid,
} from '~/views/dapp/community/community-flow-primitives'

const PROGRAM_IMAGES = [dappAssets.communityProgramRocket, dappAssets.communityProgramStar] as const

/** 右栏邀请 Steps + 生态支持双卡。 */
export function CommunityFlowSection({
  isMobileViewport: _isMobile = false,
}: {
  isMobileViewport?: boolean
} = {}) {
  void _isMobile
  const { messages: t } = useI18n()
  const genesis = useGenesisPromoChrome()

  const inviteFlowItems = t.community.inviteFlow.items.map(({ title, body }) => ({
    body,
    title,
  }))

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
    <>
      <DappSection title={t.community.inviteTitle}>
        {/* Figma `4301:226` — Steps start；卡壳在页袋 */}
        <div data-slot-id="community-invite-steps">
          <Card className="rounded-2xl p-4" surface="elevated">
            <Steps align="start">
              {inviteFlowItems.map((step) => (
                <Steps.Item body={step.body} key={String(step.title)} title={step.title} />
              ))}
            </Steps>
          </Card>
        </div>
      </DappSection>

      <DappSection title={t.community.programs.title}>
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
      </DappSection>
    </>
  )
}
