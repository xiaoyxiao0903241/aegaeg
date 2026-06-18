import { defineMessages } from '~/i18n/messages/define-messages'

const home = defineMessages({
  meta: {
    description: 'AEGIS X is an AI-native DeFi 4.0 protocol with USD1 settlement, BSC-first wallet access, and a self-healing protocol engine.',
    title: 'AEGIS X - Guarding the Future of Value'
  },
  nav: {
    sectionsLabel: 'Homepage sections',
    links: [
      {
        href: '#protocol',
        label: 'Protocol'
      },
      {
        href: '#engine',
        label: 'Engine'
      },
      {
        href: '#token',
        label: 'Token'
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
    languageLabel: 'Language'
  },
  hero: {
    guardianLabel: 'AEGIS X guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Guarding the Future of Value',
    body: 'The world\'s first AI x DeFi x USD1 global payment protocol, driven by an AI think-tank system. With USD1 as the core settlement asset, redefining decentralized finance through intelligence.',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X PROTOCOL',
      title: 'AI-native infrastructure built for the next financial era',
      subtitle: 'AI x DeFi x USD1 - building the next-generation value network.',
      cards: [
        {
          title: 'AI Think-Tank',
          body: 'Autonomous risk control, market-making and asset allocation - all executed on-chain, all intelligence-driven.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: '150% over-collateralized minting, with USD1 as the core settlement asset of a stable DeFi 4.0 base layer.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Connecting AI agents, DeFi liquidity and cross-border payments into one unified global value network.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'CORE ENGINE',
      title: 'Four pillars, one intelligent system',
      subtitle: 'The AI-driven DeFi 4.0 core engine - a self-healing price architecture.',
      cards: [
        {
          title: 'AI Market Maker',
          body: 'Dynamic balancing model: accumulate USD1 reserves on the way up; on pullbacks, unwind LP and deploy buyback + burn for price self-repair.'
        },
        {
          title: 'Dynamic Volatility Defense',
          body: 'Triggers automatically on a daily drop >=5%: sell fee rises to 30%, reserve buyback and black-hole burn engage, auto-restoring after 24h.'
        },
        {
          title: 'Rebase Engine',
          body: 'Dual-epoch settlement every 12h with block-level linear release. Flexible to 540-day staking tiers, ref. APY 535%-4,880%.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Buy-to-unlock design: 1:1 buy-to-sell quota with 24-96h adaptive cooldown and anti-panic selling logic.'
        }
      ]
    },
    token: {
      eyebrow: 'TOKEN & ECOSYSTEM',
      title: 'Multi-asset flywheel',
      subtitle: 'Four tokens, one self-reinforcing value loop: growth → liquidity → payments → ecosystem.',
      cards: [
        {
          label: 'Core protocol asset',
          description: '150% over-collateralized · AI think-tank managed'
        },
        {
          label: 'Stable reserve asset',
          description: 'Settlement layer · USD-backed liquidity'
        },
        {
          label: 'Ecosystem value token',
          description: '210M fixed · 25% sell-burn'
        },
        {
          label: 'Reward settlement token',
          description: '1:1 to AGX · powers X mining'
        }
      ]
    },
    roadmap: {
      eyebrow: 'ROADMAP',
      title: 'The road to DeFi 4.0',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol deployment · AGX minting · USD1 liquidity pool',
          dot: '1',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · burn bonds · AI market-making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAO incentives · multisig governance · global nodes',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: 'Autonomous payments · on-chain collaboration · agent market-making',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Cross-border settlement · merchant onboarding · USD1 rails',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'DeFi 4.0',
          description: 'Institutional products · compliance framework · full ecosystem',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'SECURITY & TRUST',
      title: 'Aegis-grade security',
      subtitle: 'AEGIS = shield, guardianship, order, security. Asset safety is built in from the ground up.',
      checks: [
        "Non-custodial - the AI market-maker contract cannot transfer out any assets",
        "Audited by multiple security firms",
        "Core contracts open-sourced on GitHub",
        "Safe multisig governance (upgrade + execution rights)"
      ]
    },
    partners: {
      title: 'ECOSYSTEM PARTNERS'
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          q: 'What is AEGIS X?',
          a: 'The world\'s first protocol driven by an AI think-tank system, fusing AI intelligence, DeFi liquidity and USD1 stablecoin payments into a next-generation value network - DeFi 4.0.',
          open: true
        },
        {
          q: 'How is AGX minted?',
          a: 'AGX is minted through the protocol\'s collateralized issuance design with USD1 as the core settlement asset.'
        },
        {
          q: 'How are staking rewards calculated?',
          a: 'Rewards follow staking tiers, epoch settlement, and protocol participation rules defined by the AEGIS X contracts.'
        },
        {
          q: 'How is protocol security ensured?',
          a: 'AEGIS X combines non-custodial design, audits, open-source contracts, and multisig governance.'
        },
        {
          q: 'How does the X token work?',
          a: 'X is the ecosystem value token with a fixed supply and protocol-driven burn mechanics.'
        },
        {
          q: 'What is the Turbo mechanism?',
          a: 'Turbo links buying and selling quotas with an adaptive cooldown to reduce panic selling while preserving liquidity.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Collateral Ratio'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'Max Ref. APY'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Chains Supported'
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'X Total Supply'
    }
  ],
  footer: {
    brandCopy: 'Guarding the Future of Value.\nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: 'Terms of Service · Privacy Policy · Disclaimer',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Protocol footer links',
        links: [
          {
            href: '/app.html',
            label: 'Launch DApp'
          },
          {
            href: '#whitepaper',
            label: 'Whitepaper'
          },
          {
            href: '#docs',
            label: 'Docs'
          },
          {
            href: '#analytics',
            label: 'Analytics'
          }
        ]
      },
      {
        label: 'Ecosystem',
        ariaLabel: 'Ecosystem footer links',
        links: [
          {
            href: '#token',
            label: 'AGX Staking'
          },
          {
            href: '#token',
            label: 'LP Bond'
          },
          {
            href: '#token',
            label: 'Burn Bond'
          },
          {
            href: '#token',
            label: 'X Mining'
          }
        ]
      },
      {
        label: 'Community',
        ariaLabel: 'Community footer links',
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
})

export type HomeMessagesBundle = typeof home

export default home
