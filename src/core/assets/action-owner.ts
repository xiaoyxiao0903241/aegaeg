/**
 * 写交易前校验「动作 owner」与当前会话钱包地址一致。
 *
 * Mixed 领取 / 本金赎回等方法在打开弹窗时捕获 owner，提交前必须确认
 * owner 仍是当前连接的钱包，防止切换钱包后按旧地址提交（被合约拒绝
 * 或写入错误账户）。地址比较大小写不敏感。
 *
 * @param sessionAddress 当前会话钱包地址
 * @param owner 弹窗捕获的写动作归属地址
 * @returns 一致返回 true，否则 false
 * @see 手册 §1.3 前端全局状态
 */
export function actionOwnerMatches(sessionAddress: string, owner: string): boolean {
  return sessionAddress.toLowerCase() === owner.toLowerCase()
}
