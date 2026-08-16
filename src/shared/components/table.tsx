/**
 * DApp 表 — 组合组件
 *
 * `Table` · `Header`（卡内顶槽）· `Body` · `Cell` · `Footer` · `Pagination`
 * · `Empty` / `Auth` / `Frame`。
 * Header 不是列名 thead；区块标题仍放在卡外 `Section.Title`。
 * @see docs/foundation/component-usage.md
 */

import { Body, Cell } from '~/shared/components/table-body'
import { Auth, TableEmpty } from '~/shared/components/table-empty'
import { Footer, Frame, Header, TableRoot } from '~/shared/components/table-frame'
import { Pagination } from '~/shared/components/table-pagination'

export const Table = Object.assign(TableRoot, {
  Header,
  Body,
  Cell,
  Footer,
  Pagination,
  Empty: TableEmpty,
  Auth,
  Frame,
})
