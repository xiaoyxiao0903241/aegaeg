/**
 * 写按钮状态（手册 §1.4 状态模型的当前代码映射）。
 *
 * 薄适配层，不重复造状态机；只组合钱包 / 可写 / 推荐 / 资金门闸。
 *
 * @see 手册 §1.4 通用交易状态
 */
export type WriteButtonPhase =
  | 'need_wallet'
  | 'wrong_network'
  | 'need_referral'
  | 'account_migrated'
  | 'need_balance'
  | 'need_allowance'
  | 'estimating'
  | 'ready'
  | 'submitting'
  | 'blocked'

/**
 * 汇总各门闸结果并归并成单个写按钮状态。
 *
 * 判定优先级：钱包 → 网络 → 迁移 → 推荐 → 提交中 → 估算中 → 余额/授权/其他阻断。
 *
 * @param args.walletReady 钱包是否已连接
 * @param args.writeReady 是否已连上预期链（BSC）
 * @param args.needReferral 是否需要补绑推荐
 * @param args.accountMigrated 当前地址是否已迁移
 * @param args.moneyBlock 资金门闸结果（来自实时检查）
 * @param args.isQuoting 是否正在报价/预估
 * @param args.isSubmitting 是否正在提交
 * @returns 写按钮状态
 * @see 手册 §1.4 通用交易状态
 */
export function evaluateWriteButtonPhase(args: {
  walletReady: boolean
  /** 已连接但不在预期链（BSC）上。 */
  writeReady: boolean
  needReferral: boolean
  accountMigrated?: boolean
  moneyBlock:
    | 'notBound'
    | 'accountMigrated'
    | 'insufficientBalance'
    | 'insufficientAllowance'
    | 'insufficientQuota'
    | 'poolPaused'
    | 'depositoryNotAuth'
    | 'insufficientDebtCapacity'
    | 'zeroAmount'
    | 'unavailable'
    | null
  isQuoting?: boolean
  isSubmitting?: boolean
}): WriteButtonPhase {
  if (!args.walletReady) return 'need_wallet'
  if (!args.writeReady) return 'wrong_network'
  if (args.accountMigrated || args.moneyBlock === 'accountMigrated') return 'account_migrated'
  if (args.needReferral || args.moneyBlock === 'notBound') return 'need_referral'
  if (args.isSubmitting) return 'submitting'
  if (args.isQuoting) return 'estimating'
  if (args.moneyBlock === 'insufficientBalance') return 'need_balance'
  if (args.moneyBlock === 'insufficientAllowance') return 'need_allowance'
  if (
    args.moneyBlock === 'insufficientQuota' ||
    args.moneyBlock === 'poolPaused' ||
    args.moneyBlock === 'depositoryNotAuth' ||
    args.moneyBlock === 'insufficientDebtCapacity' ||
    args.moneyBlock === 'zeroAmount' ||
    args.moneyBlock === 'unavailable'
  ) {
    return 'blocked'
  }
  return 'ready'
}
