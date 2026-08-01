/** 写意图 owner 须与当前 session 地址一致（大小写不敏感）。 */
export function actionOwnerMatches(sessionAddress: string, owner: string): boolean {
  return sessionAddress.toLowerCase() === owner.toLowerCase()
}
