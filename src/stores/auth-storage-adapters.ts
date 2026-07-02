import type { LoginSignatureStorage } from '~/lib/api/auth/login-signature-cache'
import type { AuthSessionStorage, StoredAuthSession } from '~/lib/api/auth/session'
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

export function createStoreAuthSessionStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): AuthSessionStorage {
  return {
    // The address-keyed session table is the single source of truth. The active
    // session is derived from it, so login only ever needs to `write`.
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
