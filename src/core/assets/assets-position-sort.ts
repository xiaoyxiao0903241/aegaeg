/**
 * 资产仓位列表排序键：开始 Unix 秒 + 剩余秒。
 *
 * 定期 / 债券用结束点减合约周期反推开始；结束点为 0 视为未知，不排成无限远。
 * 活期已激活剩余为 0；预热剩余按 expiry epoch 估秒。活期开始用 startEpoch 换算。
 *
 * @see docs/onchain-manual/contracts/lockedstaking.md
 * @see docs/onchain-manual/contracts/earlystaking.md
 * @see docs/onchain-manual/contracts/liquidstaking.md
 * @see docs/onchain-manual/contracts/bonddepository.md
 */

export type AssetsPositionSortKey = 'startNear' | 'startFar' | 'endNear' | 'endFar'

export type AssetsSortEpochClock = {
  currentEpoch: bigint
  epochEndBlock: bigint
  currentBlock: bigint
  epochLengthBlocks: bigint
  secondsPerBlock: number
}

export type AssetsPositionSortTimes = {
  startAt: number | null
  remaining: number | null
}

export type AssetsStakeSortInput = {
  id: string
  kind: 'liquid' | 'locked' | 'early'
  expiry: bigint
  startEpoch?: bigint
  periodTime?: bigint
  inWarmup?: boolean
  warmupExpired?: boolean
}

export type AssetsBondSortInput = {
  id: string
  vestingEndTime: bigint
  vestingTerm?: bigint
}

/** 定期 / 债券：结束 Unix − 周期；结束点 ≤ 0 两个键都未知。 */
function unixLockSortTimes(
  end: bigint,
  periodSec: bigint | undefined,
  nowSec: number,
): AssetsPositionSortTimes {
  if (end <= 0n) return { startAt: null, remaining: null }
  const endSec = Number(end)
  if (!Number.isFinite(endSec) || endSec <= 0) return { startAt: null, remaining: null }
  const remaining = Math.max(0, endSec - nowSec)
  if (periodSec == null || periodSec <= 0n) return { startAt: null, remaining }
  const startAt = endSec - Number(periodSec)
  if (!Number.isFinite(startAt) || startAt <= 0) return { startAt: null, remaining }
  return { startAt, remaining }
}

/**
 * startEpoch → Unix：按「该 epoch 起点」估经过秒，再从 now 回推。
 * 粒度是一个 epoch，缺钟或 start 在未来则未知。
 */
function startAtSecFromEpoch(
  startEpoch: bigint | undefined,
  nowSec: number,
  clock: AssetsSortEpochClock | null,
): number | null {
  if (startEpoch == null || clock == null) return null
  if (startEpoch > clock.currentEpoch) return null
  const length = Number(clock.epochLengthBlocks)
  if (!(length > 0) || !Number.isFinite(length)) return null
  if (!(clock.secondsPerBlock > 0) || !Number.isFinite(clock.secondsPerBlock)) return null
  const elapsedEpochs = Number(clock.currentEpoch - startEpoch)
  if (!Number.isFinite(elapsedEpochs) || elapsedEpochs < 0) return null
  if (clock.epochEndBlock < clock.epochLengthBlocks) return null
  const epochStartBlock = clock.epochEndBlock - clock.epochLengthBlocks
  if (clock.currentBlock < epochStartBlock) return null
  const blocksIntoCurrent = Number(clock.currentBlock - epochStartBlock)
  if (!Number.isFinite(blocksIntoCurrent) || blocksIntoCurrent < 0) return null
  const elapsedSec = (elapsedEpochs * length + blocksIntoCurrent) * clock.secondsPerBlock
  if (!Number.isFinite(elapsedSec) || elapsedSec < 0) return null
  const startAt = nowSec - Math.floor(elapsedSec)
  return startAt > 0 ? startAt : null
}

/** 与倒计时同一套：当前 epoch 用剩余块，后面整 epoch 用 length × 秒/块。 */
function remainingSecFromExpiryEpoch(
  expiryEpoch: bigint,
  clock: AssetsSortEpochClock | null,
): number | null {
  if (clock == null) return null
  const remainingEpochs =
    expiryEpoch > clock.currentEpoch ? Number(expiryEpoch - clock.currentEpoch) : 0
  if (!Number.isFinite(remainingEpochs)) return null
  if (remainingEpochs <= 0) return 0
  if (!(clock.secondsPerBlock > 0) || !Number.isFinite(clock.secondsPerBlock)) return null
  if (clock.epochEndBlock <= clock.currentBlock) {
    if (remainingEpochs === 1) return 0
  }
  const remainingBlocks =
    clock.epochEndBlock > clock.currentBlock ? Number(clock.epochEndBlock - clock.currentBlock) : 0
  if (!Number.isFinite(remainingBlocks)) return null
  const thisEpochSec =
    remainingBlocks > 0 ? Math.floor(remainingBlocks * clock.secondsPerBlock) || 1 : 0
  if (remainingEpochs === 1) return thisEpochSec
  const length = Number(clock.epochLengthBlocks)
  if (!(length > 0) || !Number.isFinite(length)) return null
  const laterSec = (remainingEpochs - 1) * length * clock.secondsPerBlock
  if (!Number.isFinite(laterSec) || laterSec < 0) return null
  return thisEpochSec + Math.floor(laterSec)
}

/**
 * 质押行排序键。
 *
 * @param row 资产质押行（定期 / Early 带 periodTime；活期带 startEpoch）
 * @param nowSec 当前 Unix 秒
 * @param clock 活期换算用的 epoch 钟；缺则活期开始 / 预热剩余为未知
 */
export function assetsStakeSortTimes(
  row: AssetsStakeSortInput,
  nowSec: number,
  clock: AssetsSortEpochClock | null,
): AssetsPositionSortTimes {
  if (row.kind !== 'liquid') {
    return unixLockSortTimes(row.expiry, row.periodTime, nowSec)
  }

  const startAt = startAtSecFromEpoch(row.startEpoch, nowSec, clock)
  const inWarmupLocked = Boolean(row.inWarmup) && !row.warmupExpired
  if (!inWarmupLocked) {
    return { startAt, remaining: 0 }
  }
  return { startAt, remaining: remainingSecFromExpiryEpoch(row.expiry, clock) }
}

/**
 * 债券行排序键。
 *
 * @param row 债券行（需 vestingTerm）
 * @param nowSec 当前 Unix 秒
 */
export function assetsBondSortTimes(
  row: AssetsBondSortInput,
  nowSec: number,
): AssetsPositionSortTimes {
  return unixLockSortTimes(row.vestingEndTime, row.vestingTerm, nowSec)
}

function compareNullable(left: number | null, right: number | null, dir: 1 | -1): number {
  if (left == null && right == null) return 0
  if (left == null) return 1
  if (right == null) return -1
  return (left - right) * dir
}

/**
 * 开始近 = 越新越前；到期近 = 剩余越短越前（随时可赎 remaining=0）。
 * 未知键排最后；同键比 id。
 */
export function compareAssetsPositionSort(
  left: AssetsPositionSortTimes,
  right: AssetsPositionSortTimes,
  sort: AssetsPositionSortKey,
  leftId: string,
  rightId: string,
): number {
  let result = 0
  switch (sort) {
    case 'startNear':
      result = compareNullable(left.startAt, right.startAt, -1)
      break
    case 'startFar':
      result = compareNullable(left.startAt, right.startAt, 1)
      break
    case 'endNear':
      result = compareNullable(left.remaining, right.remaining, 1)
      break
    case 'endFar':
      result = compareNullable(left.remaining, right.remaining, -1)
      break
  }
  if (result !== 0) return result
  return leftId < rightId ? -1 : leftId > rightId ? 1 : 0
}
