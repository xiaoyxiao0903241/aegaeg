import { Icon } from '~/shared/components/icon'

/** 兑换信息行内的提供方名称 + 外链打开按钮。 */
export function ExchangeProviderMetaValue({
  name,
  ariaLabel,
  onOpen,
  iconSrc,
}: {
  name: string
  ariaLabel: string
  onOpen: () => void
  iconSrc: string
}) {
  return (
    <>
      {name}
      <button
        aria-label={ariaLabel}
        className="duration-dapp-fast grid size-4 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent p-0 transition-opacity ease-out hover:opacity-80"
        onClick={onOpen}
        type="button"
      >
        <Icon alt="" className="size-2.5" src={iconSrc} />
      </button>
    </>
  )
}

/** 构造一条外部提供方链接的列表行。 */
export function exchangeProviderMetaRow({
  label,
  name,
  ariaLabel,
  onOpen,
  iconSrc,
}: {
  label: string
  name: string
  ariaLabel: string
  onOpen: () => void
  iconSrc: string
}) {
  return {
    label,
    value: (
      <ExchangeProviderMetaValue
        ariaLabel={ariaLabel}
        iconSrc={iconSrc}
        name={name}
        onOpen={onOpen}
      />
    ),
    valueClassName: 'inline-flex items-center justify-end gap-1',
  }
}
