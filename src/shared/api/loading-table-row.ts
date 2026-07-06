const LOADING_CELL = '…'

export function createLoadingTableRow(columnCount: number): string[] {
  return Array.from({ length: columnCount }, () => LOADING_CELL)
}
