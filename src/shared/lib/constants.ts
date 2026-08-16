/**
 * 跨域纯数据孤岛（无单一业务域归属方）。
 * 域内常量留域文件；协议哨兵 `ZERO_ADDRESS` 见 `core/constants`；可配置外链走 env。
 */

/** DApp 表格默认每页行数。 */
export const DAPP_TABLE_PAGE_SIZE = 5

/** BSC 出块约 3 秒/块（FAQ 口径兜底）；有实测值时优先用实测。 */
export const BSC_BLOCK_SECONDS = 3
