import type { LoginSignatureStorage } from '~/lib/api/auth/login-signature-cache'
import type { AuthSessionStorage } from '~/lib/api/auth/session'
import { useAuthStore } from '~/stores/auth-store'

type AuthStoreGetter = Pick<
  ReturnType<typeof useAuthStore.getState>,
  'session' | 'signature' | 'setSession' | 'clearSession' | 'setSignature' | 'clearSignature'
>

export function createStoreAuthSessionStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): AuthSessionStorage {
  return {
    read: () => getStore().session,
    write: (session) => getStore().setSession(session),
    clear: () => getStore().clearSession(),
  }
}

export function createStoreLoginSignatureStorage(
  getStore: () => AuthStoreGetter = () => useAuthStore.getState(),
): LoginSignatureStorage {
  return {
    read: () => getStore().signature,
    write: (signature) => getStore().setSignature(signature),
    clear: () => getStore().clearSignature(),
  }
}
