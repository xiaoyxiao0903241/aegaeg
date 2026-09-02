import type { StoredAuthSession, StoredLoginSignature } from '~/core/auth/types'

/**
 * 登录会话与登录签名的本地存储抽象。
 *
 * 具体实现由依赖注入提供（localStorage / IndexedDB），核心层不感知存储细节。
 * 会话按地址分条保存，切换钱包时读取对应条目。
 *
 * @see 手册 §1.3 前端全局状态
 */
export interface AuthSessionStorage {
  read(): StoredAuthSession | null
  write(session: StoredAuthSession): void
  clear(): void
}

export interface LoginSignatureStorage {
  readForAddress(address: string): StoredLoginSignature | null
  write(signature: StoredLoginSignature): void
  clearForAddress(address: string): void
}
