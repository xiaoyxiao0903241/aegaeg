export interface SwapHistoryRecord {
  id: string
  at: number
  paidLabel: string
  receivedLabel: string
  status: 'Success'
}

const STORAGE_KEY = 'aegis.swapHistory'
const MAX_ENTRIES = 20

function readRaw(): SwapHistoryRecord[] {
  if (typeof localStorage === 'undefined') return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SwapHistoryRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function readSwapHistory(): SwapHistoryRecord[] {
  return readRaw().sort((a, b) => b.at - a.at)
}

export function appendSwapHistory(
  entry: Pick<SwapHistoryRecord, 'paidLabel' | 'receivedLabel' | 'status'>,
): SwapHistoryRecord[] {
  const record: SwapHistoryRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: Date.now(),
    ...entry,
  }

  const next = [record, ...readRaw()].slice(0, MAX_ENTRIES)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aegis:swap-history-updated'))
  }

  return next
}

export function formatSwapHistoryTime(at: number): string {
  const date = new Date(at)
  const now = new Date()
  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const time = `${hours}:${minutes}`

  if (isToday) return `Today ${time}`
  if (isYesterday) return `Yesterday ${time}`

  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${month}-${day} ${time}`
}

export function mapSwapHistoryToDesktopRows(records: SwapHistoryRecord[]): string[][] {
  return records.map((record) => [
    formatSwapHistoryTime(record.at),
    record.paidLabel,
    record.receivedLabel,
    record.status,
  ])
}

export function mapSwapHistoryToMobileRows(records: SwapHistoryRecord[]): string[][] {
  return records.map((record) => [
    formatSwapHistoryTime(record.at),
    record.receivedLabel,
    record.status,
  ])
}
