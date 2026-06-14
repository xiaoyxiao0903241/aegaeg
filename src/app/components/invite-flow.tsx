import { dappLayout } from '../../components/primitive-styles'
import { revealClass } from '~/lib/reveal'
import { cn } from '~/lib/utils'

export type InviteFlowItem = {
  copy: string
  title: string
}

export function InviteFlow({ items }: { items: InviteFlowItem[] }) {
  return (
    <div className={cn(revealClass(), dappLayout.inviteFlow)} data-reveal>
      {items.map((item, index) => (
        <article className={dappLayout.inviteFlowItem} key={item.title}>
          <div className={dappLayout.inviteFlowTop}>
            <span className={dappLayout.inviteFlowStep}>{index + 1}</span>
            {index < items.length - 1 ? (
              <i
                className={dappLayout.inviteFlowLine}
                data-tone={index === 0 ? 'primary' : index === 1 ? 'muted' : undefined}
              />
            ) : null}
          </div>
          <h4 className={dappLayout.inviteFlowTitle}>{item.title}</h4>
          <p className={dappLayout.inviteFlowBody}>{item.copy}</p>
        </article>
      ))}
    </div>
  )
}
