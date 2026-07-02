import { useI18n } from '~/i18n/use-i18n'
import { useGenesisWidgetContext } from '~/app/genesis-widget-context'
import { applyMessageTemplate } from '~/lib/presale/genesis-promo'
import { cn } from '~/lib/utils'
import { DappSection } from '~/app/components/dapp-section'
import { ProgramCard } from '~/app/components/dapp-card'
import { InviteFlow, InviteFlowStack } from '~/app/components/invite-flow'

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
        <div className={cn('grid grid-cols-2 gap-2', 'max-dapp:grid-cols-1 max-dapp:gap-2')}>
          {programItems.map((program) => (
            <ProgramCard
              action={program.action}
              body={program.body}
              className="max-dapp:gap-1.5 max-dapp:py-3"
              href={program.href}
              key={program.label}
              label={program.label}
              title={program.title}
            />
          ))}
        </div>
      </DappSection>
    </>
  )
}
