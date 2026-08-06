/**
 * 协议级纯数据（core 可依赖；无 React / shared）。
 * 跨 UI 页袋的展示常量见 `shared/lib/constants`。
 */

/** EIP 零地址——协议哨兵（未绑定推荐人 / 禁用槽位）。非部署地址，非 env 兜底。 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const
