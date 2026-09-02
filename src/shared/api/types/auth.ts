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
  /** 1=只弹一次, 2=每次进首页都弹 */
  display_mode: number
  version: string
  sort_order: number
  start_time: string | null
  end_time: string | null
  i18n?: HomePopupNoticeI18n[]
}

export interface HomePopupNoticesResponse {
  items: HomePopupNoticeApiItem[]
}

/** 归一化后的首页公告，供弹窗展示。 */
export interface HomePopupNotice {
  id: number
  version: string
  image_url: string | null
  title: string
  content: string
  link_url: string | null
  link_target: number
  /** true=访客关闭后不再弹出；false=每次进入首页都弹 */
  show_once: boolean
}
