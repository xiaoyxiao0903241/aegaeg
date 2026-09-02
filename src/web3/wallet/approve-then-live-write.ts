/**
 * 资金路径写流程编排：预检 → 按需授权 → 实时重读复核 → 写入
 *
 * 授权等待期间余额 / 暂停 / 配额可能已变，所以授权后必须再读再判定，不能沿用预检快照。
 * 预检若已判定额度不足，只调用一次 `approve` 且必须上链，不再二次读 allowance。
 * 预检若已判定额度足够，不再调用 `approve`。
 * 实时复核仍报额度不足时，仅当本笔已有成功授权回执才视为读节点滞后；未授权仍不足则硬挡。
 * 回执后写入若仍报额度不足，不再重试；改抛滞后哨兵，避免刚签完权还提示「请先授权」。
 *
 * 有 `approve` 时必须同时给出 `softPreBlocks`（可软过的预检原因）；二者同配，避免漏配。
 * 调用方的 `evaluate` 须把 soft 原因放在余额等硬门之后，避免软过时跳过硬门。
 * `softPreBlocks` 为空时预检不看额度，每次仍走按需授权（闪兑 / 市价 / 销毁）。
 *
 * @param args.readSnapshot 读取当前快照
 * @param args.evaluate 按快照判定是否阻断，返回阻断原因或 null
 * @param args.mapBlockError 阻断原因 → 抛出的错误
 * @param args.write 实时复核通过后执行写入（传入最新快照）
 */

import { decodeContractRevert } from '~/web3/decode-contract-revert'
import { WALLET_WRITE_ERROR } from '~/web3/errors/sentinels'

type ApproveThenLiveWriteBase<TSnapshot, TReason> = {
  readSnapshot: () => Promise<TSnapshot>
  evaluate: (snapshot: TSnapshot) => TReason | null
  mapBlockError: (reason: TReason) => unknown
  write: (live: TSnapshot) => Promise<unknown>
}

/** 无授权：不得带 softPreBlocks。 */
type ApproveThenLiveWriteWithoutApprove<TSnapshot, TReason> = ApproveThenLiveWriteBase<
  TSnapshot,
  TReason
> & {
  approve?: undefined
  softPreBlocks?: undefined
}

/** 有授权：必须声明预检阶段可软过的原因。 */
type ApproveThenLiveWriteWithApprove<TSnapshot, TReason> = ApproveThenLiveWriteBase<
  TSnapshot,
  TReason
> & {
  approve: () => Promise<unknown>
  softPreBlocks: ReadonlyArray<TReason>
}

export type ApproveThenLiveWriteArgs<TSnapshot, TReason> =
  | ApproveThenLiveWriteWithoutApprove<TSnapshot, TReason>
  | ApproveThenLiveWriteWithApprove<TSnapshot, TReason>

function isMinedApproveReceipt(value: unknown): boolean {
  if (value == null || typeof value !== 'object') return false
  const hash = Reflect.get(value, 'transactionHash')
  return typeof hash === 'string' && hash.startsWith('0x') && hash.length > 2
}

function isErc20InsufficientAllowanceError(error: unknown): boolean {
  if (decodeContractRevert(error)?.errorName === 'ERC20InsufficientAllowance') return true
  const raw = error instanceof Error ? error.message : String(error)
  return /ERC20InsufficientAllowance/i.test(raw) || raw.includes('0xfb8f41b2')
}

export async function approveThenLiveWrite<TSnapshot, TReason>(
  args: ApproveThenLiveWriteArgs<TSnapshot, TReason>,
): Promise<void> {
  const pre = await args.readSnapshot()
  const preBlock = args.evaluate(pre)
  const preSoft = preBlock != null && args.approve != null && args.softPreBlocks.includes(preBlock)
  if (preBlock != null && !preSoft) throw args.mapBlockError(preBlock)

  const shouldApprove = args.approve != null && (preSoft || args.softPreBlocks.length === 0)
  const approveResult = shouldApprove ? await args.approve() : null
  const mined = isMinedApproveReceipt(approveResult)

  const live = await args.readSnapshot()
  const liveBlock = args.evaluate(live)
  if (liveBlock != null) {
    const liveSoft = args.approve != null && args.softPreBlocks.includes(liveBlock)
    if (!liveSoft || !mined) throw args.mapBlockError(liveBlock)
  }

  try {
    await args.write(live)
  } catch (error) {
    if (mined && isErc20InsufficientAllowanceError(error)) {
      throw new Error(WALLET_WRITE_ERROR.STALE_ALLOWANCE_READ, { cause: error })
    }
    throw error
  }
}
