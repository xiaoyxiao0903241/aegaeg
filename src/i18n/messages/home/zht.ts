import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X 是 AI 原生 DeFi 4.0 協議，以 USD1 結算、BSC 優先錢包入口和自修復協議引擎構建下一代價值網路。',
    title: 'AEGIS X - 守護未來價值'
  },
  nav: {
    sectionsLabel: '首頁區塊導航',
    links: [
      {
        href: '#protocol',
        label: '協議'
      },
      {
        href: '#engine',
        label: '核心機制'
      },
      {
        href: '#token',
        label: '生態價值'
      },
      {
        href: '#roadmap',
        label: '路線圖'
      },
      {
        href: '#security',
        label: '安全'
      },
      {
        href: '#faq',
        label: '常見問題'
      }
    ],
    whitepaper: '白皮書',
    enterApp: '進入 App',
    languageLabel: '語言'
  },
  hero: {
    guardianLabel: 'AEGIS X 守護者',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 協議',
    title: '守護未來價值',
    body: '全球首個 AI 智庫驅動的 USD1 生態協議。以 USD1 為核心結算資產，連接 AI、支付與全球流動性網路。',
    enterProtocol: '進入協議',
    readWhitepaper: '閱讀白皮書',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X 協議',
      title: '下一代價值網路核心架構',
      subtitle: 'AI x DeFi x USD1 - 驅動價值流動',
      cards: [
        {
          title: 'AI 智庫',
          body: '自主風險控制、智能做市與流動性管理全部鏈上執行。',
          index: '01'
        },
        {
          title: 'USD1 結算',
          body: '以 USD1 為核心結算資產，構建穩定的價值流通網路。',
          index: '02'
        },
        {
          title: '全球支付',
          body: '連接 AI Agent、DeFi 與全球支付場景，構建下一代價值網路。',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: '核心機制',
      title: '四大機制，一個智能系統',
      subtitle: '透過智能決策、動態調節與風險控制，構建可持續運行的價值網路。',
      cards: [
        {
          title: '智能做市機制',
          body: '上漲階段累積儲備資產，增強協議儲備能力；回調階段執行回購與銷毀機制，實現價格修復。'
        },
        {
          title: '波動防禦機制',
          body: '當日跌幅達到閾值自動觸發：賣出費率提升至 30%，儲備回購與黑洞銷毀啟動，24 小時後自動恢復。'
        },
        {
          title: '收益分配機制',
          body: '採用區塊級線性釋放機制，每 12 小時進行一次收益結算，支援最長 540 天參與週期。'
        },
        {
          title: '渦輪機制',
          body: '透過動態買入解鎖機制，優化市場流動性結構，增強生態穩定性與長期發展能力。'
        }
      ]
    },
    token: {
      eyebrow: '價值生態',
      title: '多資產價值飛輪',
      subtitle: '用戶增長 → 流動性增強 → 支付擴張 → 生態增長。',
      cards: [
        {
          label: '核心協議資產',
          description: '150% 超額抵押鑄造 · 收益增長引擎'
        },
        {
          label: '核心結算資產',
          description: '生態結算層 · 價值流通基礎設施'
        },
        {
          label: '生態價值代幣',
          description: '固定總量 2.1 億 · 持續價值沉澱'
        },
        {
          label: '獎勵結算憑證',
          description: '可兌換 AGX · 參與生態挖礦'
        }
      ]
    },
    roadmap: {
      eyebrow: '路線圖',
      title: '通往下一代價值網路',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: '創世啟動',
          description: '協議部署 · AGX 鑄造 · USD1 流動性池',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi 核心',
          description: 'Rebase 質押 · LP 債券 · 銷毀債券 · AI 做市',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO 與增長',
          description: 'X DAO 激勵 · 多簽治理 · 全球節點',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent 經濟',
          description: '自主支付 · 智能協作 · AI Agent 經濟網路',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: '全球支付',
          description: '全球支付網路 · 商戶接入 · USD1 支付場景',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: '未來價值網路',
          description: '支付網路 · AI Agent 經濟 · 價值生態',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: '安全與信任',
      title: 'AEGIS 級安全架構',
      subtitle: '從協議架構到資產管理，安全貫穿每一個環節',
      checks: [
        "非託管架構 · 智能做市合約不具備資產轉出權限",
        "核心合約開源可驗證 · 通過專業安全審計",
        "多簽治理機制 · 核心權限共同管理",
        "動態防禦機制 · 自動應對極端波動"
      ]
    },
    partners: {
      title: '生態基礎設施'
    },
    faq: {
      eyebrow: '快速了解',
      title: '常見問題',
      items: [
        {
          q: 'AEGIS X 是什麼？',
          a: 'AEGIS X 是全球首個 AI 智庫驅動的 USD1 生態協議，以 USD1 為核心結算資產，連接 AI、DeFi 與全球支付網路。',
          open: true
        },
        {
          q: 'AGX 如何鑄造？',
          a: 'AGX 透過 150% 超額抵押機制生成，是協議核心資產與價值增長的重要載體。'
        },
        {
          q: 'USD1 在 AEGIS X 中擔任什麼角色？',
          a: 'USD1 是協議核心結算資產，為生態提供價值流通、流動性支援與支付基礎設施能力。'
        },
        {
          q: '協議如何保障安全？',
          a: '合約採用非託管邊界、審計、開源審查與多簽治理。'
        },
        {
          q: '渦輪機制是什麼？',
          a: '渦輪機制透過動態解鎖與流動性調節機制，降低集中性拋壓風險，增強市場穩定性與長期發展能力。'
        },
        {
          q: 'X 代幣如何運作？',
          a: 'X 是生態價值代幣，採用固定總量與協議驅動的銷毀機制。'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '超額抵押率'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP 永久鎖定'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: '動態防禦機制'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X 固定總量'
    }
  ],
  footer: {
    brandCopy: '守護未來價值網路 \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. 保留所有權利。',
    legal: '服務條款 · 隱私政策 · 免責聲明',
    groups: [
      {
        label: '協議',
        ariaLabel: '協議頁腳連結',
        links: [
          {
            href: '/app.html',
            label: '進入 App'
          },
          {
            linkId: 'whitepaper',
            label: '白皮書'
          },
          {
            linkId: 'docs',
            label: '專案文件'
          },
          {
            linkId: 'economicModel',
            label: '經濟模型'
          }
        ]
      },
      {
        label: '生態',
        ariaLabel: '生態頁腳連結',
        links: [
          {
            href: '#token',
            label: 'AGX'
          },
          {
            href: '#token',
            label: 'USD1'
          },
          {
            href: '#token',
            label: 'X'
          },
          {
            href: '#token',
            label: 'gGAX'
          }
        ]
      },
      {
        label: '社區',
        ariaLabel: '社區頁腳連結',
        links: [
          {
            href: '#discord',
            label: 'Discord'
          },
          {
            href: '#twitter',
            label: 'Twitter / X'
          },
          {
            href: '#telegram',
            label: 'Telegram'
          },
          {
            href: '#github',
            label: 'GitHub'
          }
        ]
      }
    ]
  }
} satisfies HomeMessagesBundle)

export default home
