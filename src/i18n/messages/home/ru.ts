import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X — AI-native протокол DeFi 4.0 с USD1 Settlement, BSC-first Wallet Access и Self-healing Protocol Engine, создающий сеть ценности нового поколения.',
    title: 'AEGIS X - Защита ценности будущего'
  },
  nav: {
    sectionsLabel: 'Навигация по разделам главной страницы',
    links: [
      {
        href: '#protocol',
        label: 'Protocol'
      },
      {
        href: '#engine',
        label: 'Core Mechanisms'
      },
      {
        href: '#token',
        label: 'Ecosystem Value'
      },
      {
        href: '#roadmap',
        label: 'Roadmap'
      },
      {
        href: '#security',
        label: 'Security'
      },
      {
        href: '#faq',
        label: 'FAQ'
      }
    ],
    whitepaper: 'Whitepaper',
    enterApp: 'Launch App',
    languageLabel: 'Язык'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Защита ценности будущего',
    body: 'Первый в мире AI Think-Tank-driven USD1 Ecosystem Protocol. USD1 как Core Settlement Asset связывает AI, Payments и Global Liquidity Network.',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: 'Core Architecture сети ценности нового поколения',
      subtitle: 'AI x DeFi x USD1 — движение ценности',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Autonomous Risk Control, Smart Market Making и Liquidity Management — всё исполняется On-chain.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'USD1 как Core Settlement Asset формирует стабильную сеть обращения ценности.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Связывает AI Agent, DeFi и Global Payment Scenarios, создавая сеть ценности нового поколения.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: 'Четыре Mechanisms — одна Intelligent System',
      subtitle: 'Intelligent Decision-making, Dynamic Adjustment и Risk Control создают устойчивую сеть ценности.',
      cards: [
        {
          title: 'Smart Market-Making Mechanism',
          body: 'На росте накапливает Reserve Assets, усиливая Protocol Reserve Capacity; на коррекции запускает Buyback и Burn Mechanism для Price Recovery.'
        },
        {
          title: 'Volatility Defense Mechanism',
          body: 'Автоматически срабатывает при достижении дневного Threshold падения: Sell Fee повышается до 30%, запускаются Reserve Buyback и Black-hole Burn, через 24 часа — Auto-Restore.'
        },
        {
          title: 'Yield Distribution Mechanism',
          body: 'Block-level Linear Release, Yield Settlement каждые 12 часов, максимальный Participation Cycle — 540 дней.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Dynamic Buy-to-Unlock Mechanism оптимизирует структуру Market Liquidity, усиливая Ecosystem Stability и долгосрочный потенциал развития.'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
      title: 'Multi-Asset Value Flywheel',
      subtitle: 'Рост пользователей → расширение ликвидности → рост платежей → рост экосистемы.',
      cards: [
        {
          label: 'Core Protocol Asset',
          description: '150% Over-Collateralized Minting · Yield Growth Engine'
        },
        {
          label: 'Core Settlement Asset',
          description: 'Ecosystem Settlement Layer · Value Circulation Infrastructure'
        },
        {
          label: 'Ecosystem Value Token',
          description: '210M Fixed Supply · Continuous Value Accumulation'
        },
        {
          label: 'Reward Settlement Voucher',
          description: 'Redeemable for AGX · Participate in Ecosystem Mining'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'Путь к сети ценности нового поколения',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol Deployment · AGX Minting · USD1 Liquidity Pool',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase Staking · LP Bonds · Burn Bonds · AI Market Making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAO Incentives · Multisig Governance · Global Nodes',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: 'Autonomous Payments · Intelligent Collaboration · AI Agent Economy Network',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Global Payment Network · Merchant Onboarding · USD1 Payment Scenarios',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Future Value Network',
          description: 'Payment Network · AI Agent Economy · Value Ecosystem',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'Security & Trust',
      title: 'Архитектура безопасности уровня AEGIS',
      subtitle: 'От архитектуры протокола до управления активами — безопасность на каждом этапе',
      checks: [
        "Non-custodial Architecture · Smart Market-Making Contract не имеет права вывода активов",
        "Core Contracts Open-source и Verifiable · пройден Professional Security Audit",
        "Multisig Governance Mechanism · Core Permissions совместно управляются",
        "Dynamic Defense Mechanism · Auto-response на Extreme Volatility"
      ]
    },
    partners: {
      title: 'Ecosystem Infrastructure'
    },
    faq: {
      eyebrow: 'Quick Overview',
      title: 'FAQ',
      items: [
        {
          q: 'Что такое AEGIS X?',
          a: 'AEGIS X — первый в мире AI Think-Tank-driven USD1 Ecosystem Protocol, с USD1 как Core Settlement Asset связывает AI, DeFi и Global Payment Network.',
          open: true
        },
        {
          q: 'Как Mint происходит AGX?',
          a: 'AGX создаётся через механизм 150% Over-Collateralization, является Core Protocol Asset и важным Carrier роста ценности.'
        },
        {
          q: 'Какую роль играет USD1 в AEGIS X?',
          a: 'USD1 — Core Settlement Asset протокола, обеспечивающий обращение ценности, поддержку ликвидности и платёжную инфраструктуру экосистемы.'
        },
        {
          q: 'Как обеспечивается безопасность Protocol?',
          a: 'Контракты используют Non-custodial Boundaries, Audit, Open-source Review и Multisig Governance.'
        },
        {
          q: 'Что такое Turbo Mechanism?',
          a: 'Turbo Mechanism снижает риск Concentrated Sell Pressure через Dynamic Unlock и Liquidity Adjustment, усиливая Market Stability и Long-term Growth Capacity.'
        },
        {
          q: 'Как работает токен X?',
          a: 'X — Ecosystem Value Token с Fixed Supply и Protocol-driven Burn Mechanism.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Over-Collateralization Ratio'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP Permanently Locked'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Dynamic Defense Mechanism'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X Fixed Supply'
    }
  ],
  footer: {
    brandCopy: 'Guarding the future value network \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Ссылки в подвале — Protocol',
        links: [
          {
            href: '/app.html',
            label: 'Launch App'
          },
          {
            linkId: 'whitepaper',
            label: 'Whitepaper'
          },
          {
            linkId: 'docs',
            label: 'Documentation'
          },
          {
            linkId: 'economicModel',
            label: 'Economic Model'
          }
        ]
      },
      {
        label: 'Ecosystem',
        ariaLabel: 'Ссылки в подвале — Ecosystem',
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
        label: 'Community',
        ariaLabel: 'Ссылки в подвале — Community',
        links: [
          {
            socialId: 'youtube',
            label: 'Youtube'
          },
          {
            socialId: 'twitter',
            label: 'Twitter / X'
          },
            {
            socialId: 'telegram',
            label: 'Telegram'
          },
          {
            socialId: 'medium',
            label: 'Medium'
          }
        ]
      }
    ]
  }
} satisfies HomeMessagesBundle)

export default home
