import type { HomeContentBundle } from '../types'

export const zhTwBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - 守護未來價值',
    description:
      'AEGIS X 是 AI 原生 DeFi 4.0 協議，以 USD1 結算、BSC 優先錢包入口和自修復協議引擎構建下一代價值網絡。',
  },
  nav: {
    sectionsLabel: '首頁區塊導航',
    links: [
      { href: '#protocol', label: '協議' },
      { href: '#engine', label: '引擎' },
      { href: '#token', label: '代幣' },
      { href: '#roadmap', label: '路線圖' },
      { href: '#security', label: '安全' },
      { href: '#faq', label: '常見問題' },
    ],
    whitepaper: '白皮書',
    launchDapp: '啟動 DApp',
    languageLabel: '語言',
  },
  hero: {
    guardianLabel: 'AEGIS X 守護者',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 協議',
    title: '守護未來價值',
    body: {
      desktop:
        '全球首個 AI x DeFi x USD1 全球支付協議，由 AI 智庫系統驅動。以 USD1 作為核心結算資產，用智能化重新定義去中心化金融。',
      mobile:
        '全球首個 AI x DeFi x USD1 全球支付協議，由 AI 智庫系統驅動。',
    },
    enterProtocol: '進入協議',
    readWhitepaper: '閱讀白皮書',
    walletBusy: '正在開啟錢包...',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X 協議',
      title: {
        desktop: '為下一代金融時代構建的 AI 原生基礎設施',
        mobile: 'AI 原生基礎設施',
      },
      subtitle: {
        desktop: 'AI x DeFi x USD1 - 構建下一代全球價值網絡。',
        mobile: 'AI x DeFi x USD1 - 構建下一代價值網絡。',
      },
      cards: [
        {
          index: '01',
          title: 'AI 智庫',
          desktop:
            '自主執行風控、做市與資產配置 - 全部鏈上運行，全部由智能驅動。',
          mobile: '自主執行風控、做市與資產配置 - 鏈上運行，智能驅動。',
        },
        {
          index: '02',
          title: 'USD1 結算',
          desktop:
            '150% 超額抵押鑄造，以 USD1 作為穩定 DeFi 4.0 底層的核心結算資產。',
          mobile: '150% 超額抵押鑄造，以 USD1 作為 DeFi 4.0 核心結算資產。',
        },
        {
          index: '03',
          title: '全球支付',
          desktop:
            '將 AI Agent、DeFi 流動性與跨境支付連接為統一的全球價值網絡。',
          mobile: '連接 AI Agent、DeFi 流動性與跨境支付，形成統一價值網絡。',
        },
      ],
    },
    engine: {
      eyebrow: '核心引擎',
      title: {
        desktop: '四大支柱，一個智能系統',
        mobile: '四大支柱，一個系統',
      },
      subtitle: {
        desktop: 'AI 驅動的 DeFi 4.0 核心引擎 - 自修復價格架構。',
        mobile: 'AI 驅動的 DeFi 4.0 核心引擎。',
      },
      cards: [
        {
          title: 'AI 做市引擎',
          desktop:
            '動態平衡模型：上漲時累積 USD1 儲備；回撤時退出 LP 並執行回購 + 銷毀，實現價格自修復。',
          mobile:
            '動態平衡：上漲時累積 USD1；回撤時回購 + 銷毀，實現價格自修復。',
        },
        {
          title: '動態波動防禦',
          desktop:
            '日跌幅 >=5% 自動觸發：賣出費率提升至 30%，儲備回購與黑洞銷毀啟動，24 小時後自動恢復。',
          mobile:
            '日跌幅 >=5% 觸發：賣出費至 30%，儲備回購 + 黑洞銷毀，24 小時自動恢復。',
        },
        {
          title: 'Rebase 引擎',
          desktop:
            '每 12 小時雙週期結算，區塊級線性釋放。適配最高 540 天質押週期，參考 APY 535%-4,880%。',
          mobile: '每 12 小時雙週期結算，區塊級釋放。參考 APY 535%-4,880%。',
        },
        {
          title: 'Turbo 機制',
          desktop:
            '買入解鎖設計：1:1 買入換取賣出額度，24-96 小時自適應冷卻，抑制恐慌性拋售。',
          mobile: '1:1 買入解鎖賣出額度，24-96 小時自適應冷卻，抑制恐慌拋售。',
        },
      ],
    },
    token: {
      eyebrow: '代幣與生態',
      title: '多資產飛輪',
      subtitle: {
        desktop:
          '四種代幣，一個自強化價值循環：增長 → 流動性 + 支付 + 生態。',
        mobile: '四種代幣，一個自強化價值循環。',
      },
      cards: [
        {
          label: '穩定儲備資產',
          description: '結算層 · USD 支撐流動性',
        },
        {
          label: '核心協議資產',
          description: '150% 超額抵押 · AI 智庫管理',
        },
        {
          label: '獎勵結算代幣',
          description: '1:1 對應 AGX · 驅動 X 挖礦',
        },
        {
          label: '生態價值代幣',
          description: '2.1 億固定供應 · 25% 賣出銷毀',
        },
      ],
      note: '用戶 → 流動性 → 支付 → 增長 → 無限循環',
    },
    roadmap: {
      eyebrow: '路線圖',
      title: '通往 DeFi 4.0 的路徑',
      phases: [
        {
          phase: '階段 01',
          time: '2025 Q3',
          title: '創世啟動',
          description: '協議部署 · AGX 鑄造 · USD1 流動性池',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '階段 02',
          time: '2025 Q4',
          title: 'DeFi 核心',
          description: 'Rebase 質押 · LP 債券 · 銷毀債券 · AI 做市',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: '階段 03',
          time: '2026 Q1',
          title: 'DAO 與增長',
          description: 'X DAO 激勵 · 多簽治理 · 全球節點',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '階段 04',
          time: '2026 Q2',
          title: 'AI Agent 經濟',
          description: '自主支付 · 鏈上協作 · Agent 做市',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: '階段 05',
          time: '2026 Q3',
          title: '全球支付',
          description: '跨境結算 · 商戶接入 · USD1 支付通道',
          dot: '5',
          side: 'left',
        },
        {
          phase: '階段 06',
          time: '2026 Q4',
          title: 'DeFi 4.0',
          description: '機構產品 · 合規框架 · 完整生態',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: '安全與信任',
      title: 'Aegis 級安全',
      subtitle: {
        desktop:
          'AEGIS 代表護盾、守護、秩序與安全。資產安全從協議底層開始內建。',
        mobile: '資產安全從協議底層開始內建。',
      },
      checks: [
        {
          desktop: '非託管 - AI 做市合約不能轉出任何資產',
          mobile: '非託管 - AI 做市合約不能轉出資產',
        },
        '多家安全機構審計',
        '核心合約在 GitHub 開源',
        {
          desktop: 'Safe 多簽治理（升級 + 執行權限）',
          mobile: 'Safe 多簽治理（升級 + 執行）',
        },
      ],
    },
    partners: {
      title: '生態合作夥伴',
    },
    faq: {
      eyebrow: '常見問題',
      title: '常見問題',
      items: [
        {
          question: '什麼是 AEGIS X？',
          answer:
            'AEGIS X 是全球首個由 AI 智庫系統驅動的協議，將 AI 智能、DeFi 流動性與 USD1 穩定幣支付融合為下一代價值網絡 - DeFi 4.0。',
          open: true,
        },
        {
          question: 'AGX 如何鑄造？',
          answer: 'AGX 透過協議的抵押發行設計鑄造，並以 USD1 作為核心結算資產。',
        },
        {
          question: '質押獎勵如何計算？',
          answer: '獎勵遵循 AEGIS X 合約定義的質押層級、週期結算和協議參與規則。',
        },
        {
          question: '協議如何保證安全？',
          answer: 'AEGIS X 結合非託管設計、安全審計、開源合約與多簽治理。',
        },
        {
          question: 'X 代幣如何運作？',
          answer: 'X 是生態價值代幣，具備固定供應和協議驅動的銷毀機制。',
          optional: true,
        },
        {
          question: 'Turbo 機制是什麼？',
          answer:
            'Turbo 將買入與賣出額度綁定，並透過自適應冷卻減少恐慌拋售，同時保持流動性。',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '抵押率',
    },
    {
      value: '4,880%',
      countTarget: 4880,
      suffix: '%',
      label: '最高參考 APY',
    },
    {
      value: '2+',
      countTarget: 2,
      suffix: '+',
      label: '支援鏈',
    },
    {
      value: '2.1億',
      countTarget: 210,
      suffix: 'M',
      label: 'X 總供應',
    },
  ],
  footer: {
    brandCopy: {
      desktop: '守護未來價值。\nAI x DeFi x USD1',
      mobile: '守護未來價值。\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. 保留所有權利。',
    legal: '服務條款 · 隱私政策 · 免責聲明',
    languageLabel: '語言',
    groups: [
      {
        label: '協議',
        ariaLabel: '協議頁腳連結',
        links: [
          {
            href: '/app.html',
            label: { desktop: '啟動 DApp', mobile: '文件' },
          },
          { href: '#whitepaper', label: '白皮書' },
          { href: '#docs', label: '文件' },
          { href: '#analytics', label: '數據分析' },
        ],
      },
      {
        label: '生態',
        ariaLabel: '生態頁腳連結',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX 質押', mobile: '文件' },
          },
          {
            href: '#token',
            label: { desktop: 'LP 債券', mobile: '白皮書' },
          },
          { href: '#token', label: '銷毀債券' },
          { href: '#token', label: 'X 挖礦' },
        ],
      },
      {
        label: '社區',
        ariaLabel: '社區頁腳連結',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: '文件' },
          },
          {
            href: '#twitter',
            label: { desktop: 'Twitter / X', mobile: '白皮書' },
          },
          { href: '#telegram', label: 'Telegram' },
          { href: '#github', label: 'GitHub' },
        ],
      },
    ],
  },
}
