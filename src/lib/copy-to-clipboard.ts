const HUAWEI_VIVO_UA = /huawei|vivo/i
const COPY_COOLDOWN_MS = 5000

export type CopyToClipboardResult = 'copied' | 'skipped' | 'failed'

let lastSuccessfulCopy: { text: string; at: number } | null = null

function isWithinCopyCooldown(text: string): boolean {
  if (!lastSuccessfulCopy || lastSuccessfulCopy.text !== text) return false
  return Date.now() - lastSuccessfulCopy.at < COPY_COOLDOWN_MS
}

function markCopySuccess(text: string): void {
  lastSuccessfulCopy = { text, at: Date.now() }
}

type LegacyTextInput = HTMLInputElement & {
  createTextRange?: () => {
    collapse: (toStart: boolean) => void
    select: () => void
  }
}

async function preflightClipboardPermission(): Promise<void> {
  if (!HUAWEI_VIVO_UA.test(navigator.userAgent)) return
  try {
    await navigator.permissions?.query({ name: 'clipboard-write' as PermissionName })
  } catch {
    // Permission query is optional; copy fallbacks still run.
  }
}

function selectInputContents(input: HTMLInputElement): void {
  const legacy = input as LegacyTextInput
  if (legacy.createTextRange) {
    const range = legacy.createTextRange()
    range.collapse(true)
    range.select()
    return
  }
  input.focus()
  input.select()
  input.setSelectionRange(0, input.value.length)
}

async function copyViaClipboardApi(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) return false
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function copyViaExecCommand(input: HTMLInputElement): boolean {
  try {
    selectInputContents(input)
    return document.execCommand('copy')
  } catch {
    return false
  }
}

function copyViaSelectionApi(input: HTMLInputElement): boolean {
  try {
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(input)
    selection?.removeAllRanges()
    selection?.addRange(range)
    const success = document.execCommand('copy')
    selection?.removeAllRanges()
    return success
  } catch {
    return false
  }
}

/** Hidden-input + execCommand fallbacks for mobile WebViews (Huawei/Vivo, etc.). */
export async function fallbackCopyText(text: string): Promise<boolean> {
  if (typeof document === 'undefined' || !text) return false

  const input = document.createElement('input')
  input.setAttribute('readonly', 'readonly')
  input.style.position = 'fixed'
  input.style.opacity = '0'
  input.style.left = '-9999px'
  input.style.top = '-9999px'
  input.value = text
  document.body.appendChild(input)

  try {
    await preflightClipboardPermission()

    let success = copyViaExecCommand(input)
    if (!success) success = await copyViaClipboardApi(text)
    if (!success) success = copyViaSelectionApi(input)
    return success
  } finally {
    ;(document.activeElement as HTMLElement | null)?.blur()
    input.remove()
  }
}

/** Clipboard API first, then legacy fallbacks — call from a user gesture (click). */
export async function copyTextToClipboard(text: string): Promise<CopyToClipboardResult> {
  if (!text) return 'failed'
  if (isWithinCopyCooldown(text)) return 'skipped'
  const ok =
    (await copyViaClipboardApi(text)) || (await fallbackCopyText(text))
  if (!ok) return 'failed'
  markCopySuccess(text)
  return 'copied'
}
