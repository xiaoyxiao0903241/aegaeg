import type { AuthSessionStorage, LoginSignatureStorage } from '~/core/auth/storage'
import type { StoredAuthSession } from '~/core/auth/types'
import { useAuthStore } from '~/stores/auth-store'

type AuthStoreGetter = Pick<
  ReturnType<typeof useAuthStore.getState>,
  | 'sessionsByAddress'
  | 'signaturesByAddress'
  | 'upsertSessionForAddress'
  | 'upsertSignatureForAddress'
  | 'readSignatureForAddress'
  | 'clearSignatureForAddress'
>

/**
 * 将 loginWithWallet 的 session 写入适配到按地址 Zustand 表。
 * read/clear 为空操作：活跃会话由 sessionsByAddress 派生，不经单槽 storage。
 */
export function createStoreAuthSessionStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): AuthSessionStorage {
  return {
    read: () => null,
    write: (session: StoredAuthSession) => {
      getStore().upsertSessionForAddress(session)
    },
    clear: () => {},
  }
}

export function createStoreLoginSignatureStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): LoginSignatureStorage {
  return {
    readForAddress: (address) => getStore().readSignatureForAddress(address),
    write: (signature) => getStore().upsertSignatureForAddress(signature),
    clearForAddress: (address) => getStore().clearSignatureForAddress(address),
  }
}
