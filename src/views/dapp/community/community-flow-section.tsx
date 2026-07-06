import { useI18n } from '~/i18n/use-i18n'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { applyMessageTemplate } from '~/views/dapp/genesis/genesis-promo'
import { DappSection } from '~/app/shell/components/dapp-section'
import { InviteFlow, InviteFlowStack } from '~/views/dapp/community/community-invite-flow'
import {
  CommunityProgramCard,
  CommunityProgramGrid,
} from '~/views/dapp/community/community-flow-primitives'

export function CommunityFlowSection({
  isMobileViewport = false,
}: {
  isMobileViewport?: boolean
}) {
  const { messages: t } = useI18n()
  const genesis = useGenesisWidgetContext()

  const inviteFlowItems = t.community.inviteFlow.items.map(({ title, body }) => ({
    copy: body,
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
        {isMobileViewport ? (
          <InviteFlowStack items={inviteFlowItems} />
        ) : (
          <InviteFlow items={inviteFlowItems} />
        )}
      </DappSection>

      <DappSection title={t.community.programs.title}>
        <CommunityProgramGrid>
          {programItems.map((program) => (
            <CommunityProgramCard
              action={program.action}
              body={program.body}
              href={program.href}
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
