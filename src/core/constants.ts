/**
 * 协议级纯数据（core 可依赖；无 React / shared）。
 * 跨 UI 页袋的展示常量见 `shared/lib/constants`。
 */

/** EIP 零地址——协议哨兵（未绑定推荐人 / 禁用槽位）。非部署地址，非 env 兜底。 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as const

/**
 * BigInt 字面量 SSOT（`0n` / `10n` / `100n`）。
 * React Compiler 尚不降低组件/hook 内的 BigIntLiteral；组件内请引用这些常量。
 * @see https://www.react.doctor/docs/rules/react-hooks-js/todo
 */
export const ZERO_BI = 0n
export const TEN_BI = 10n
export const HUNDRED_BI = 100n
