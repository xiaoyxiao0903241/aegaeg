export type FlashPairId = 'gagx' | 'usdt'

/** 默认兑换对，Segment 初始选中 gagx。 */
export const FLASH_PAIR_DEFAULT: FlashPairId = 'gagx'

/** 判断字符串是否为合法兑换对标识。 */
export function isFlashPairId(value: string): value is FlashPairId {
  return value === 'gagx' || value === 'usdt'
}
