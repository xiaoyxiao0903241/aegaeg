import { apiRequest } from '~/shared/api/request'
import type { HomePopupNoticesResponse, LoginRequest, LoginResponse } from '~/shared/api/types'

export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

export async function getHomePopupNotices(locale?: string): Promise<HomePopupNoticesResponse> {
  return apiRequest<HomePopupNoticesResponse>('/home/popup-notices', {
    method: 'POST',
    body: locale ? { locale } : {},
  })
}
