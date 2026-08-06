import { apiRequest } from '~/shared/api/request'
import type { HomePopupNoticesResponse, LoginRequest, LoginResponse } from '~/shared/api/types'

/** 登录：用钱包签名换取登录 JWT。 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

/** 首页弹窗公告：可指定语言，缺省由后端按请求环境返回。 */
export async function getHomePopupNotices(locale?: string): Promise<HomePopupNoticesResponse> {
  return apiRequest<HomePopupNoticesResponse>('/home/popup-notices', {
    method: 'POST',
    body: locale ? { locale } : {},
  })
}
