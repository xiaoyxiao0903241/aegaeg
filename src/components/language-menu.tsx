import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { cn } from '~/lib/utils'

const langSwitcherClass = 'relative z-40 inline-flex [[open]_&]:z-[120] [.is-open_&]:z-[120]'

const langMenuClass = cn(
  'hidden [[open]_&]:grid [.is-open_&]:grid',
  '[[open]_&]:animate-[language-menu-in_180ms_ease_both] [.is-open_&]:animate-[language-menu-in_180ms_ease_both]',
)

const langTriggerClass = cn(
  'inline-flex min-h-9 min-w-14 cursor-pointer items-center justify-center gap-1.5 rounded-md',
  'border border-border bg-card px-3 text-xs font-semibold leading-none text-foreground shadow-none',
  'transition-[background-color,border-color,box-shadow,transform] duration-180 ease-out',
  'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
  'hover:-translate-y-px hover:bg-[oklch(97%_0.014_45)] hover:shadow-card',
  'focus-visible:-translate-y-px focus-visible:bg-[oklch(97%_0.014_45)] focus-visible:shadow-card',
  '[[open]_&]:border-coral-hover-border [[open]_&]:bg-[oklch(97%_0.014_45)] [[open]_&]:shadow-card',
  '[.is-open_&]:border-coral-hover-border [.is-open_&]:bg-[oklch(97%_0.014_45)] [.is-open_&]:shadow-card',
  '[&::-webkit-details-marker]:hidden [&_img]:size-4',
  'max-dapp:min-h-7.5 max-dapp:min-w-14 max-dapp:gap-1.5 max-dapp:px-2.5 max-dapp:text-xs',
)

export type LanguageMenuOption = {
  code: string
  name: string
  label: string
  active?: boolean
  disabled?: boolean
  href?: string
  onSelect?: () => void
}

export type LanguageMenuProps = {
  label: string
  options: LanguageMenuOption[]
  globeIcon: string
  checkIcon?: string
  triggerClassName?: string
  triggerLabel?: ReactNode
  menuClassName?: string
  /**
   * Use a native `<details>` disclosure. Ideal for static/SSR pages where no
   * React runtime hydrates the component, because open/close is handled by the
   * browser and project CSS without external scripts.
   */
  native?: boolean
}

function MenuItem({
  option,
  checkIcon,
  onClick,
}: {
  option: LanguageMenuOption
  checkIcon?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}) {
  const itemClassName = cn(
    'flex h-10 cursor-pointer items-center gap-2 rounded-sm bg-transparent px-2.5 text-left transition-colors duration-150 ease-out focus-visible:outline-none',
    option.active
      ? 'bg-[var(--background)]'
      : 'hover:bg-secondary focus-visible:bg-secondary',
    option.disabled && 'cursor-not-allowed opacity-60',
  )

  const children = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-sm leading-[normal] text-foreground',
            option.active ? 'font-semibold' : 'font-normal',
          )}
        >
          {option.name}
        </span>
        <span className="block text-xs font-normal leading-[normal] text-[oklch(60%_0.02_260)]">
          {option.label}
        </span>
      </span>
      {option.active ? (
        checkIcon ? (
          <img
            src={checkIcon}
            alt=""
            aria-hidden="true"
            className="size-4 shrink-0"
          />
        ) : (
          <span
            aria-hidden="true"
            className="shrink-0 text-xs font-bold leading-none text-primary"
          >
            ✓
          </span>
        )
      ) : null}
    </>
  )

  if (option.href) {
    return (
      <a
        key={option.code}
        aria-checked={option.active}
        className={itemClassName}
        href={option.href}
        onClick={onClick}
        role="menuitemradio"
      >
        {children}
      </a>
    )
  }

  return (
    <button
      key={option.code}
      aria-checked={option.active}
      className={itemClassName}
      disabled={option.disabled}
      onClick={onClick}
      role="menuitemradio"
      type="button"
    >
      {children}
    </button>
  )
}

const nativeLanguageMenuScript = `
(function () {
  var script = document.currentScript
  var details = script && script.previousElementSibling
  if (!details || details.tagName !== 'DETAILS') return
  var summary = details.querySelector('summary')
  if (!summary) return

  summary.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && details.open) {
      details.open = false
    }
  })

  document.addEventListener(
    'pointerdown',
    function (event) {
      if (!details.contains(event.target)) {
        details.open = false
      }
    },
    { passive: true },
  )
})()
`

function NativeLanguageMenu({
  label,
  options,
  globeIcon,
  checkIcon,
  triggerClassName,
  triggerLabel,
  menuClassName,
}: Omit<LanguageMenuProps, 'native'>) {
  const activeOption = options.find((option) => option.active) ?? options[0]

  return (
    <>
      <details
        className={langSwitcherClass}
        data-language-switcher
      >
        <summary
          aria-haspopup="menu"
          aria-label={label}
          className={cn(langTriggerClass, triggerClassName)}
          data-language-trigger
          role="button"
        >
          <img src={globeIcon} alt="" className="size-4 shrink-0" />
          <span>{triggerLabel ?? activeOption?.code}</span>
        </summary>

        <div
          className={cn(
            langMenuClass,
            'absolute right-0 top-[calc(100%+0.5rem)] z-[130] grid w-64 max-w-[calc(100dvw-2rem)] gap-0.5 overflow-clip rounded-md border border-border bg-card p-2.5 shadow-[0_12px_32px_oklch(0%_0_0_/_12%)]',
            menuClassName,
          )}
          role="menu"
        >
          {options.map((option) => (
            <MenuItem key={option.code} option={option} checkIcon={checkIcon} />
          ))}
        </div>
      </details>
      <script dangerouslySetInnerHTML={{ __html: nativeLanguageMenuScript }} />
    </>
  )
}

function ReactLanguageMenu({
  label,
  options,
  globeIcon,
  checkIcon,
  triggerClassName,
  triggerLabel,
  menuClassName,
}: Omit<LanguageMenuProps, 'native'>) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const activeOption = options.find((option) => option.active) ?? options[0]

  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (wrapRef.current && !wrapRef.current.contains(target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectOption(
    option: LanguageMenuOption,
    event?: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  ) {
    if (option.disabled) {
      return
    }

    if (option.onSelect) {
      event?.preventDefault()
      option.onSelect()
      setOpen(false)
      return
    }

    if (option.href) {
      setOpen(false)
      return
    }

    setOpen(false)
  }

  return (
    <span
      ref={wrapRef}
      className={cn(langSwitcherClass, open && 'is-open')}
      data-language-switcher
    >
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={cn(langTriggerClass, triggerClassName)}
        data-language-trigger
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <img src={globeIcon} alt="" className="size-4 shrink-0" />
        <span>{triggerLabel ?? activeOption?.code}</span>
      </button>

      <div
        className={cn(
          langMenuClass,
          'absolute right-0 top-[calc(100%+0.5rem)] z-[130] grid w-64 max-w-[calc(100dvw-2rem)] gap-0.5 overflow-clip rounded-md border border-border bg-card p-2.5 shadow-[0_12px_32px_oklch(0%_0_0_/_12%)]',
          !open && 'hidden',
          menuClassName,
        )}
        role="menu"
      >
        {options.map((option) => (
          <MenuItem
            key={option.code}
            option={option}
            checkIcon={checkIcon}
            onClick={(event) => selectOption(option, event)}
          />
        ))}
      </div>
    </span>
  )
}

export function LanguageMenu({ native, ...props }: LanguageMenuProps) {
  if (native) {
    return <NativeLanguageMenu {...props} />
  }

  return <ReactLanguageMenu {...props} />
}
