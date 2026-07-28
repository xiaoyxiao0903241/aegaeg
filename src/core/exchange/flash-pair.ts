export type FlashPairId = 'gagx' | 'usdt'

/** Figma `4430:220` default Segment tab. */
export const FLASH_PAIR_DEFAULT: FlashPairId = 'gagx'

export function isFlashPairId(value: string): value is FlashPairId {
  return value === 'gagx' || value === 'usdt'
}
