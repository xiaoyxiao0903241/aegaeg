export interface LoginRequest {
  address: string
  message: string
  signature: string
}

export interface LoginResponse {
  token: string
}

/** POST /home/popup-notices — i18n 文案 */
export interface HomePopupNoticeI18n {
  locale: string
  title: string
  content: string
  image_url: string
}

/** POST /home/popup-notices — 原始 API 行 */
export interface HomePopupNoticeApiItem {
  id: number
  image_url: string
  link_url: string
  /** 0=当前页, 1=新标签 */
  link_target: number
  version: string
  sort_order: number
  start_time: string | null
  end_time: string | null
  i18n?: HomePopupNoticeI18n[]
}

export interface HomePopupNoticesResponse {
  items: HomePopupNoticeApiItem[]
}

/** 归一化后的公告，供 DApp 弹窗展示。 */
export interface HomePopupNotice {
  id: number
  version: string
  image_url: string | null
  title: string
  content: string
  link_url: string | null
  link_target: number
  /** 投放开始时间；空表示无起始限制，已读回看时视为更旧 */
  startMs: number | null
}
