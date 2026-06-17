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

export function InviteFlowStack({ items }: { items: InviteFlowItem[] }) {
  return (
    <div
      className={cn(
        revealClass(),
        'grid gap-3.5 rounded-2xl bg-card p-4 shadow-card',
      )}
      data-reveal
    >
      {items.map((item, index) => (
        <article className="flex gap-3" key={item.title}>
          <span className="grid size-7 shrink-0 place-items-center rounded-[14px] bg-primary text-[13px] font-semibold leading-[1.2] text-white">
            {index + 1}
          </span>
          <div className="grid min-w-0 gap-0.5">
            <h4 className="m-0 text-sm font-semibold leading-[1.2] tracking-[-0.28px] text-foreground">
              {item.title}
            </h4>
            <p className="m-0 text-[13px] leading-normal tracking-[-0.26px] text-faint">
              {item.copy}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
