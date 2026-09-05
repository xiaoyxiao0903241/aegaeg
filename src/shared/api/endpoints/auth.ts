import { apiRequest } from '~/shared/api/request'
import type { HomePopupNoticesResponse, LoginRequest, LoginResponse } from '~/shared/api/types'

/** 登录：用钱包签名换取登录 JWT。 */
export async function login(request: LoginRequest): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: request,
  })
}

/**
 * 拉取当前生效的弹窗公告。
 *
 * 需登录 JWT；可选 locale 只返回对应语言文案。
 *
 * @param token 会话 JWT
 * @param locale 当前界面语言；缺省由后端按请求环境返回
 * @returns 生效中的公告列表
 * @see docs/backend-api/api.md #一期接口/home/popup-notices
 */
export async function getHomePopupNotices(
  token: string,
  locale?: string,
): Promise<HomePopupNoticesResponse> {
  return apiRequest<HomePopupNoticesResponse>('/home/popup-notices', {
    method: 'POST',
    token,
    body: locale ? { locale } : {},
  })
}
