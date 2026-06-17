import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'zh', 'ko', 'ja', 'vi', 'es', 'ru'],

    // 命名空间分割
    ns: ['common', 'home', 'dapp'],
    defaultNS: 'common',

    // 性能优化
    load: 'languageOnly', // 只加载 'en' 不加载 'en-US'

    interpolation: {
      escapeValue: false, // React 已经转义
    },

    // 开发环境配置
    debug: import.meta.env.DEV,

    // 初始资源（避免首次加载闪烁）
    resources: {
      en: {
        common: {
          connectWallet: 'Connect Wallet',
          language: 'Language',
        },
      },
      zh: {
        common: {
          connectWallet: '连接钱包',
          language: '语言',
        },
      },
    },
  })

export default i18n
