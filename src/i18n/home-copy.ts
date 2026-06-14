import { localeLabels, type Locale } from './locales'

export const homeCopy: Record<Locale, Record<string, string>> = {
  en: {
    protocol: 'Protocol',
    engine: 'Engine',
    token: 'Token',
    roadmap: 'Roadmap',
    security: 'Security',
    faq: 'FAQ',
    whitepaper: 'Whitepaper',
    launchDapp: 'Launch DApp',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
    language: localeLabels.en,
  },
  zh: {
    protocol: '协议',
    engine: '引擎',
    token: '代币',
    roadmap: '路线图',
    security: '安全',
    faq: '常见问题',
    whitepaper: '白皮书',
    launchDapp: '启动 DApp',
    enterProtocol: '进入协议',
    readWhitepaper: '阅读白皮书',
    language: localeLabels.zh,
  },
}
