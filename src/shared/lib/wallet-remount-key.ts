/** 按钱包隔离草稿状态的稳定 React 重挂载键。 */
export function walletRemountKey(address: string | null | undefined): string {
  return address?.toLowerCase() ?? 'disconnected'
}
