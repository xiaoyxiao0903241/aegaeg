import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X is an AI-native DeFi 4.0 protocol building the next-generation value network with USD1 settlement, BSC-first wallet access, and a self-healing protocol engine.',
    title: 'AEGIS X - Guarding the Future Value Network'
  },
  nav: {
    sectionsLabel: 'Homepage section navigation',
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
        label: 'FAQs'
      }
    ],
    whitepaper: 'Whitepaper',
    enterApp: 'Launch App',
    languageLabel: 'Language'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Guarding the Future Value Network',
    body: 'The world\'s first AI think-tank-driven USD1 ecosystem protocol. With USD1 as the core settlement asset, connecting AI, payments, and global liquidity networks.',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: 'Core architecture of the next-generation value network',
      subtitle: 'AI x DeFi x USD1 - Powering value flows',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Autonomous risk control, intelligent market-making, and liquidity management — all executed on-chain.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'With USD1 as the core settlement asset, building a stable value circulation network.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Connecting AI Agents, DeFi, and global payment scenarios to build the next-generation value network.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: 'Four mechanisms, one intelligent system',
      subtitle: 'Through intelligent decision-making, dynamic adjustment, and risk control, building a sustainably operating value network.',
      cards: [
        {
          title: 'Intelligent Market-Making Mechanism',
          body: 'Accumulates reserve assets during uptrends to strengthen protocol reserves; during pullbacks, executes buyback and burn mechanisms for price recovery.'
        },
        {
          title: 'Volatility Defense Mechanism',
          body: 'Triggers automatically when daily decline reaches threshold: sell fee rises to 30%, reserve buyback and black-hole burn activate, auto-restoring after 24 hours.'
        },
        {
          title: 'Yield Distribution Mechanism',
          body: 'Uses block-level linear release with yield settlement every 12 hours, supporting participation cycles up to 540 days.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Optimizes market liquidity structure through dynamic buy-to-unlock mechanics, enhancing ecosystem stability and long-term growth capacity.'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
      title: 'Multi-asset value flywheel',
      subtitle: 'User growth → Liquidity expansion → Payment growth → Ecosystem growth.',
      cards: [
        {
          label: 'Core protocol asset',
          description: '150% over-collateralized minting · Yield growth engine'
        },
        {
          label: 'Core settlement asset',
          description: 'Ecosystem settlement layer · Value circulation infrastructure'
        },
        {
          label: 'Ecosystem value token',
          description: 'Fixed supply of 210M · Continuous value accumulation'
        },
        {
          label: 'Reward settlement voucher',
          description: 'Redeemable for AGX · Participate in ecosystem mining'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: 'The path to the next-generation value network',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol deployment · AGX minting · USD1 liquidity pool',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · Burn bonds · AI market-making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAO incentives · Multisig governance · Global nodes',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: 'Autonomous payments · Intelligent collaboration · AI Agent economy network',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Global payment network · Merchant onboarding · USD1 payment scenarios',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Future Value Network',
          description: 'Payment network · AI Agent economy · Value ecosystem',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'Security & Trust',
      title: 'AEGIS-grade security architecture',
      subtitle: 'From protocol architecture to asset management, security runs through every layer',
      checks: [
        "Non-custodial architecture · Smart market-making contracts cannot transfer assets out",
        "Core contracts open-source and verifiable · Professionally audited",
        "Multisig governance · Core permissions jointly managed",
        "Dynamic defense mechanisms · Automatically respond to extreme volatility"
      ]
    },
    partners: {
      title: 'Ecosystem infrastructure'
    },
    faq: {
      eyebrow: 'Quick overview',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'What is AEGIS X?',
          a: 'AEGIS X is the world\'s first AI think-tank-driven USD1 ecosystem protocol, with USD1 as the core settlement asset, connecting AI, DeFi, and global payment networks.',
          open: true
        },
        {
          q: 'How is AGX minted?',
          a: 'AGX is generated through a 150% over-collateralization mechanism and serves as a core protocol asset and key carrier of value growth.'
        },
        {
          q: 'What role does USD1 play in AEGIS X?',
          a: 'USD1 is the core settlement asset of the protocol, providing value circulation, liquidity support, and payment infrastructure for the ecosystem.'
        },
        {
          q: 'How is protocol security ensured?',
          a: 'Contracts use non-custodial boundaries, audits, open-source review, and multisig governance.'
        },
        {
          q: 'What is the Turbo mechanism?',
          a: 'The Turbo mechanism uses dynamic unlock and liquidity adjustment to reduce concentrated sell pressure risk and enhance market stability and long-term growth capacity.'
        },
        {
          q: 'How does the X token work?',
          a: 'X is the ecosystem value token with a fixed supply and protocol-driven burn mechanism.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Over-collateralization ratio'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP permanently locked'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Dynamic defense mechanism'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X fixed total supply'
    }
  ],
  footer: {
    brandCopy: 'Guarding the future value network \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Protocol footer links',
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
        ariaLabel: 'Ecosystem footer links',
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
            label: 'gAGX'
          }
        ]
      },
      {
        label: 'Community',
        ariaLabel: 'Community footer links',
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
