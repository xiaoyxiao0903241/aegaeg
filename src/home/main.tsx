import { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/home.css'
import { HomePage } from './home-page'
import type { Locale } from '../i18n/locales'

// 客户端按路径识别语言（/zh/... → zh，其余 → en）
const locale: Locale = window.location.pathname.startsWith('/zh') ? 'zh' : 'en'

function HomeApp() {
  useEffect(() => {
    // React 挂载提交后再运行命令式增强脚本（钱包触发、滚动揭示、数字计数、图片懒加载）。
    // 此时 walletLoader 查询的 DOM 节点已存在。动态 import 仅求值一次，事件只绑定一次。
    void import('../wallet-loader')
  }, [])

  return <HomePage locale={locale} />
}

createRoot(document.getElementById('root')!).render(<HomeApp />)
