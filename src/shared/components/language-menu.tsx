import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from 'react'
import { tv } from 'tailwind-variants'

import { Text } from '~/shared/components/text'

const languageMenu = tv({
  slots: {
    trigger: [
      // Figma topbar lang — h 36, pill, white (H5 226:205 / PC 12:14)
      'inline-flex h-9 min-h-9 min-w-14 cursor-pointer items-center justify-center gap-1.5 rounded-full',
      'border border-border bg-card px-3 text-xs leading-none font-semibold text-foreground shadow-none',
      'transition-[background-color,border-color,box-shadow,transform] duration-180 ease-out',
      'hover:border-coral-hover-border focus-visible:border-coral-hover-border',
      'hover:-translate-y-px hover:bg-coral-wash hover:shadow-card',
      'focus-visible:-translate-y-px focus-visible:bg-coral-wash focus-visible:shadow-card',
      'in-[[open]]:border-coral-hover-border in-[[open]]:bg-coral-wash in-[[open]]:shadow-card',
      'in-data-open:border-coral-hover-border in-data-open:bg-coral-wash in-data-open:shadow-card',
      '[&_img]:size-4 [&::-webkit-details-marker]:hidden',
      'max-dapp:min-w-14 max-dapp:gap-1.5 max-dapp:px-3 max-dapp:text-xs',
    ],
    /** Figma `lang-popup` 4140:286 — sizes via `--dapp-lang-menu-*` (rem / site-fluid). */
    panel: [
      'hidden in-data-open:flex in-data-open:flex-col in-[[open]]:flex in-[[open]]:flex-col',
      'in-data-open:animate-[language-menu-in_180ms_ease_both] in-[[open]]:animate-[language-menu-in_180ms_ease_both]',
      'absolute top-[calc(100%+0.5rem)] right-0 z-130 w-(--dapp-lang-menu-width) max-w-[calc(100dvw-2rem)] overflow-clip',
      'rounded-sm border border-border-subtle bg-card p-2.5 shadow-menu',
    ],
    list: 'flex w-full flex-col gap-0.5 overflow-clip',
  },
})

const languageMenuItem = tv({
  base: [
    'flex h-(--dapp-lang-menu-row-height) w-full cursor-pointer items-center gap-2 bg-transparent px-2.5 text-left',
    // 与 DropdownMenuItem 同 guideline：rounded-control
    'rounded-control',
    'transition-colors duration-150 ease-out focus-visible:outline-none',
  ],
  variants: {
    active: {
      true: 'bg-primary-soft',
      false: 'hover:bg-background focus-visible:bg-background',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-60',
      false: '',
    },
  },
})

const languageMenuItemName = tv({
  base: 'block text-sm/normal text-foreground',
  variants: {
    active: {
      true: 'font-semibold',
      false: 'font-normal',
    },
  },
})

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
  const itemClassName = languageMenuItem({
    active: Boolean(option.active),
    disabled: Boolean(option.disabled),
  })

  const children = (
    <>
      <span className="flex min-w-0 flex-1 flex-col gap-px overflow-hidden whitespace-nowrap">
        <Text
          as="span"
          variant="copy"
          className={languageMenuItemName({ active: Boolean(option.active) })}
        >
          {option.name}
        </Text>
        <Text
          as="span"
          variant="caption"
          tone="muted-foreground"
          className="block text-(length:--dapp-lang-menu-meta-size) leading-normal"
        >
          {option.label}
        </Text>
      </span>
      {option.active ? (
        checkIcon ? (
          <img src={checkIcon} alt="" aria-hidden="true" className="relative z-1 size-4 shrink-0" />
        ) : (
          <Text
            aria-hidden="true"
            variant="caption"
            tone="primary"
            className="relative z-1 shrink-0 text-xs leading-none font-bold"
          >
            ✓
          </Text>
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
  const styles = languageMenu()
  const activeOption = options.find((option) => option.active) ?? options[0]

  return (
    <>
      <details className="relative z-40 inline-flex open:z-120" data-language-switcher>
        <summary
          aria-haspopup="menu"
          aria-label={label}
          className={styles.trigger({ class: triggerClassName })}
          data-language-trigger
          role="button"
        >
          <img src={globeIcon} alt="" className="size-4 shrink-0" />
          <Text as="span" variant="copy" className="text-sm leading-none font-semibold">
            {triggerLabel ?? activeOption?.code}
          </Text>
        </summary>

        <div className={styles.panel({ class: menuClassName })} role="menu">
          <div className={styles.list()}>
            {options.map((option) => (
              <MenuItem key={option.code} option={option} checkIcon={checkIcon} />
            ))}
          </div>
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
  const styles = languageMenu()
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
      className="relative z-40 inline-flex data-open:z-120"
      data-language-switcher
      data-open={open ? '' : undefined}
    >
      <button
        ref={triggerRef}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={label}
        className={styles.trigger({ class: triggerClassName })}
        data-language-trigger
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <img src={globeIcon} alt="" className="size-4 shrink-0" />
        <Text as="span" variant="copy" className="text-sm leading-none font-semibold">
          {triggerLabel ?? activeOption?.code}
        </Text>
      </button>

      <div className={styles.panel({ class: [!open && 'hidden', menuClassName] })} role="menu">
        <div className={styles.list()}>
          {options.map((option) => (
            <MenuItem
              key={option.code}
              option={option}
              checkIcon={checkIcon}
              onClick={(event) => selectOption(option, event)}
            />
          ))}
        </div>
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
