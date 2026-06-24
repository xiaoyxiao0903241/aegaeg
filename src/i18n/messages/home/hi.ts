import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X एक AI-native DeFi 4.0 Protocol है, USD1 Settlement, BSC-first Wallet Access और Self-healing Protocol Engine के साथ अगली पीढ़ी का Value Network बना रहा है।',
    title: 'AEGIS X - भविष्य के Value की रक्षा'
  },
  nav: {
    sectionsLabel: 'Homepage Section Navigation',
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
    languageLabel: 'भाषा'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'भविष्य के Value की रक्षा',
    body: 'दुनिया का पहला AI Think-Tank-driven USD1 Ecosystem Protocol। USD1 को Core Settlement Asset बनाकर AI, Payments और Global Liquidity Network को जोड़ता है।',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: 'अगली पीढ़ी के Value Network की Core Architecture',
      subtitle: 'AI x DeFi x USD1 - Value Flows को Power करना',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Autonomous Risk Control, Smart Market Making और Liquidity Management — सब On-chain Executed।',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'USD1 को Core Settlement Asset बनाकर Stable Value Circulation Network का निर्माण।',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'AI Agent, DeFi और Global Payment Scenarios को जोड़कर अगली पीढ़ी का Value Network बनाना।',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: 'चार Mechanisms, एक Intelligent System',
      subtitle: 'Intelligent Decision-making, Dynamic Adjustment और Risk Control से Sustainable Value Network।',
      cards: [
        {
          title: 'Smart Market-Making Mechanism',
          body: 'Uptrend में Reserve Assets संचय, Protocol Reserve Capacity मज़बूत; Pullback में Buyback और Burn Mechanism, Price Recovery।'
        },
        {
          title: 'Volatility Defense Mechanism',
          body: 'दैनिक गिरावट Threshold पर Auto-Trigger: Sell Fee 30% तक, Reserve Buyback और Black-hole Burn, 24 घंटे बाद Auto-Restore।'
        },
        {
          title: 'Yield Distribution Mechanism',
          body: 'Block-level Linear Release, हर 12 घंटे Yield Settlement, अधिकतम 540 दिन Participation Cycle।'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Dynamic Buy-to-Unlock Mechanism के माध्यम से Market Liquidity Structure ऑप्टिमाइज़, Ecosystem Stability और Long-term Growth Capacity बढ़ाना।'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
      title: 'Multi-Asset Value Flywheel',
      subtitle: 'User Growth → Liquidity Expansion → Payment Growth → Ecosystem Growth।',
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
      title: 'अगली पीढ़ी के Value Network की ओर',
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
      title: 'AEGIS-स्तर Security Architecture',
      subtitle: 'Protocol Architecture से Asset Management तक, हर चरण में Security',
      checks: [
        "Non-custodial Architecture · Smart Market-Making Contract में Asset Transfer Right नहीं",
        "Core Contracts Open-source और Verifiable · Professional Security Audit पारित",
        "Multisig Governance Mechanism · Core Permissions सामूहिक प्रबंधन",
        "Dynamic Defense Mechanism · Extreme Volatility पर Auto-Response"
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
          q: 'AEGIS X क्या है?',
          a: 'AEGIS X दुनिया का पहला AI Think-Tank-driven USD1 Ecosystem Protocol है, USD1 को Core Settlement Asset बनाकर AI, DeFi और Global Payment Network को जोड़ता है।',
          open: true
        },
        {
          q: 'AGX कैसे Mint होता है?',
          a: 'AGX 150% Over-Collateralization Mechanism से जनित होता है, Protocol Core Asset और Value Growth का महत्वपूर्ण Carrier।'
        },
        {
          q: 'USD1 AEGIS X में क्या भूमिका निभाता है?',
          a: 'USD1 Protocol का Core Settlement Asset है, Ecosystem को Value Circulation, Liquidity Support और Payment Infrastructure Capability प्रदान करता है।'
        },
        {
          q: 'Protocol Security कैसे सुनिश्चित होती है?',
          a: 'Contracts Non-custodial Boundaries, Audit, Open-source Review और Multisig Governance का उपयोग करते हैं।'
        },
        {
          q: 'Turbo Mechanism क्या है?',
          a: 'Turbo Mechanism Dynamic Unlock और Liquidity Adjustment के माध्यम से Concentrated Sell Pressure Risk कम करता है, Market Stability और Long-term Growth Capacity बढ़ाता है।'
        },
        {
          q: 'X Token कैसे काम करता है?',
          a: 'X Ecosystem Value Token है, Fixed Supply और Protocol-driven Burn Mechanism के साथ।'
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
    copyright: '© 2026 AEGIS X DAO. All rights reserved।',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Protocol Footer Links',
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
        ariaLabel: 'Ecosystem Footer Links',
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
        ariaLabel: 'Community Footer Links',
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
