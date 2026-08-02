import { useRef, useState } from 'react'

import { DappIcon } from '~/app/shell/dapp-icon'
import { cn } from '~/shared/lib/utils'
import { Text } from '~/shared/ui/text'
import { useDismissOnOutside } from '~/shared/ui/use-dismiss-on-outside'

export type ExchangeTokenPickerOption = {
  key: string
  symbol: string
  icon?: string
  balanceLabel: string
  /** Shown in list but not selectable (handbook-silent / DEFER tokens). */
  disabled?: boolean
}

/**
 * Sell/Buy token pill + open list (proto HTML chrome).
 * Options are call-site data; chrome only — no domain presets.
 *
 * Proto: trigger #f7f8f9 pill; panel white 14px / pad 6 / shadow;
 * rows gap 9 / radius 10 / selected #f9ece6 — buttons in a grid, not ul/li.
 */
export function ExchangeTokenPicker({
  ariaLabel,
  checkIcon,
  disabled = false,
  onSelect,
  options,
  value,
}: {
  ariaLabel: string
  checkIcon?: string
  disabled?: boolean
  onSelect: (key: string) => void
  options: ExchangeTokenPickerOption[]
  value: string
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const selected = options.find((option) => option.key === value) ?? options[0]

  useDismissOnOutside(open, wrapRef, () => setOpen(false))

  if (!selected) return null

  return (
    <span
      ref={wrapRef}
      className={cn('relative inline-flex shrink-0 items-center', open && 'z-50')}
      data-open={open ? '' : undefined}
    >
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={cn(
          // Figma tk `4433:415`：icon24 + py-1.5 → pill h36；禁 py-1.25 落 34
          'inline-flex items-center gap-2 rounded-full border-0 bg-background px-2.5 py-1.5',
          'transition-colors duration-150 ease-out hover:bg-muted',
          disabled ? 'cursor-default opacity-40' : 'cursor-pointer',
        )}
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {selected.icon ? (
          <DappIcon
            alt=""
            className="rounded-full"
            loading="lazy"
            size="token"
            src={selected.icon}
          />
        ) : null}
        <Text as="span" className="leading-none font-semibold" variant="copy">
          {selected.symbol}
        </Text>
        <svg
          aria-hidden
          className="size-3 shrink-0 text-muted-foreground"
          fill="none"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.5 6.75L9 11.25L4.5 6.75"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </svg>
      </button>

      {open ? (
        <div
          className={cn(
            'absolute top-[calc(100%+0.5rem)] left-0 z-50 grid min-w-52 gap-0.5',
            'rounded-sm border border-border bg-card p-1.5 shadow-menu',
          )}
          role="listbox"
        >
          {options.map((option) => {
            const active = option.key === value
            const optionDisabled = Boolean(option.disabled)
            return (
              <button
                key={option.key}
                aria-disabled={optionDisabled || undefined}
                aria-selected={active}
                className={cn(
                  'flex w-full items-center gap-2.25 rounded-control border-0 px-2.5 py-2 text-left',
                  'transition-colors duration-150 ease-out focus-visible:outline-none',
                  optionDisabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer',
                  !optionDisabled &&
                    (active
                      ? 'bg-primary-soft'
                      : 'bg-transparent hover:bg-background focus-visible:bg-background'),
                  optionDisabled && active && 'bg-primary-soft',
                )}
                disabled={optionDisabled}
                onClick={() => {
                  if (optionDisabled) return
                  onSelect(option.key)
                  setOpen(false)
                }}
                role="option"
                type="button"
              >
                {option.icon ? (
                  <img
                    alt=""
                    className="size-(--app-icon-rail) shrink-0 rounded-full object-contain"
                    loading="lazy"
                    src={option.icon}
                  />
                ) : null}
                <Text as="span" className="min-w-0 flex-1 font-semibold" variant="detail">
                  {option.symbol}
                </Text>
                <Text
                  as="span"
                  className="shrink-0 whitespace-nowrap tabular-nums"
                  tone="muted-foreground"
                  variant="caption"
                >
                  {option.balanceLabel}
                </Text>
                <span
                  aria-hidden
                  className="flex w-3 shrink-0 items-center justify-end text-xs font-bold text-primary"
                >
                  {active ? (
                    checkIcon ? (
                      <img alt="" className="size-3" src={checkIcon} />
                    ) : (
                      '✓'
                    )
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>
      ) : null}
    </span>
  )
}
