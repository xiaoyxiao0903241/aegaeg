import type { LoginSignatureStorage } from '~/lib/api/auth/login-signature-cache'
import type { AuthSessionStorage, StoredAuthSession } from '~/lib/api/auth/session'
import { useAuthStore } from '~/stores/auth-store'

type AuthStoreGetter = Pick<
  ReturnType<typeof useAuthStore.getState>,
  | 'session'
  | 'sessionsByAddress'
  | 'signaturesByAddress'
  | 'setSession'
  | 'clearSession'
  | 'upsertSessionForAddress'
  | 'upsertSignatureForAddress'
  | 'readSignatureForAddress'
  | 'clearSignatureForAddress'
  | 'readSessionForAddress'
>

export function createStoreAuthSessionStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): AuthSessionStorage {
  return {
    read: () => getStore().session,
    write: (session: StoredAuthSession) => {
      getStore().setSession(session)
      getStore().upsertSessionForAddress(session)
    },
    clear: () => getStore().clearSession(),
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
