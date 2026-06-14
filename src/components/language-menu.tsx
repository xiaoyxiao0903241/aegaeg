import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  langMenuClass,
  langSwitcherClass,
  langTriggerClass,
} from '~/lib/chip-styles'
import { cn } from '~/lib/utils'

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
  onClick?: () => void
}) {
  const itemClassName = cn(
    'flex h-[42px] items-center gap-2 rounded-[10px] bg-transparent px-[10px] text-left transition-colors duration-150 ease-out focus-visible:outline-none',
    option.active
      ? 'bg-[var(--background)]'
      : 'hover:bg-secondary focus-visible:bg-secondary',
    option.disabled && 'cursor-default opacity-60',
  )

  const children = (
    <>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block text-[14px] leading-[normal] text-foreground',
            option.active ? 'font-semibold' : 'font-normal',
          )}
        >
          {option.name}
        </span>
        <span className="block text-[11px] font-normal leading-[normal] text-[oklch(60%_0.02_260)]">
          {option.label}
        </span>
      </span>
      {option.active ? (
        checkIcon ? (
          <img
            src={checkIcon}
            alt=""
            aria-hidden="true"
            width="16"
            height="16"
            className="shrink-0"
          />
        ) : (
          <span
            aria-hidden="true"
            className="shrink-0 text-[13px] font-bold leading-none text-primary"
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
          <img src={globeIcon} alt="" width="16" height="16" />
          <span>{triggerLabel ?? activeOption?.code}</span>
        </summary>

        <div
          className={cn(
            langMenuClass,
            'absolute right-0 top-[calc(100%+8px)] z-[130] grid w-[264px] max-w-[calc(100vw-32px)] gap-[2px] overflow-clip rounded-[14px] border border-border bg-card p-[10px] shadow-[0_12px_32px_oklch(0%_0_0_/_12%)]',
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

  function selectOption(option: LanguageMenuOption) {
    if (option.disabled) {
      return
    }

    if (option.href) {
      setOpen(false)
      return
    }

    option.onSelect?.()
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
        <img src={globeIcon} alt="" width="16" height="16" />
        <span>{triggerLabel ?? activeOption?.code}</span>
      </button>

      <div
        className={cn(
          langMenuClass,
          'absolute right-0 top-[calc(100%+8px)] z-[130] grid w-[264px] max-w-[calc(100vw-32px)] gap-[2px] overflow-clip rounded-[14px] border border-border bg-card p-[10px] shadow-[0_12px_32px_oklch(0%_0_0_/_12%)]',
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
            onClick={() => selectOption(option)}
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
