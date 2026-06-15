import type { HomeContentBundle } from '../types'

export const enBundle: HomeContentBundle = {
  meta: {
    description:
      'AEGIS X is an AI-native DeFi 4.0 protocol with USD1 settlement, BSC-first wallet access, and a self-healing protocol engine.',
    title: 'AEGIS X - Guarding the Future of Value',
  },
  nav: {
    sectionsLabel: 'Homepage sections',
    links: [
      { href: '#protocol', label: 'Protocol' },
      { href: '#engine', label: 'Engine' },
      { href: '#token', label: 'Token' },
      { href: '#roadmap', label: 'Roadmap' },
      { href: '#security', label: 'Security' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: 'Whitepaper',
    launchDapp: 'Launch DApp',
    languageLabel: 'Language',
  },
  hero: {
    guardianLabel: 'AEGIS X guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Guarding the Future of Value',
    body: {
      desktop:
        "The world's first AI x DeFi x USD1 global payment protocol, driven by an AI think-tank system. With USD1 as the core settlement asset, redefining decentralized finance through intelligence.",
      mobile:
        "The world's first AI x DeFi x USD1 global payment protocol, driven by an AI think-tank system.",
    },
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
    walletBusy: 'Opening wallet...',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X PROTOCOL',
      title: {
        desktop: 'AI-native infrastructure built for the next financial era',
        mobile: 'AI-native infrastructure',
      },
      subtitle: {
        desktop:
          'AI x DeFi x USD1 - building the next-generation value network.',
        mobile: 'AI x DeFi x USD1 - building the next-gen value network.',
      },
      cards: [
        {
          index: '01',
          title: 'AI Think-Tank',
          desktop:
            'Autonomous risk control, market-making and asset allocation - all executed on-chain, all intelligence-driven.',
          mobile:
            'Autonomous risk control, market-making and asset allocation - all on-chain, intelligence-driven.',
        },
        {
          index: '02',
          title: 'USD1 Settlement',
          desktop:
            '150% over-collateralized minting, with USD1 as the core settlement asset of a stable DeFi 4.0 base layer.',
          mobile:
            '150% over-collateralized minting, with USD1 as the core settlement asset of DeFi 4.0.',
        },
        {
          index: '03',
          title: 'Global Payments',
          desktop:
            'Connecting AI agents, DeFi liquidity and cross-border payments into one unified global value network.',
          mobile:
            'Connecting AI agents, DeFi liquidity and cross-border payments into one value network.',
        },
      ],
    },
    engine: {
      eyebrow: 'CORE ENGINE',
      title: {
        desktop: 'Four pillars, one intelligent system',
        mobile: 'Four pillars, one system',
      },
      subtitle: {
        desktop:
          'The AI-driven DeFi 4.0 core engine - a self-healing price architecture.',
        mobile: 'The AI-driven DeFi 4.0 core engine.',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            'Dynamic balancing model: accumulate USD1 reserves on the way up; on pullbacks, unwind LP and deploy buyback + burn for price self-repair.',
          mobile:
            'Dynamic balancing: accumulate USD1 on the way up; on pullbacks, buyback + burn for price self-repair.',
        },
        {
          title: 'Dynamic Volatility Defense',
          desktop:
            'Triggers automatically on a daily drop >=5%: sell fee rises to 30%, reserve buyback and black-hole burn engage, auto-restoring after 24h.',
          mobile:
            'Daily drop >=5% triggers: sell fee to 30%, reserve buyback + black-hole burn, auto-restore after 24h.',
        },
        {
          title: 'Rebase Engine',
          desktop:
            'Dual-epoch settlement every 12h with block-level linear release. Flexible to 540-day staking tiers, ref. APY 535%-4,880%.',
          mobile:
            'Dual-epoch settlement every 12h, block-level release. Ref. APY 535%-4,880%.',
        },
        {
          title: 'Turbo Mechanism',
          desktop:
            'Buy-to-unlock design: 1:1 buy-to-sell quota with 24-96h adaptive cooldown and anti-panic selling logic.',
          mobile:
            '1:1 buy unlocks sell quota, 24-96h adaptive cooldown - no panic selling.',
        },
      ],
    },
    token: {
      eyebrow: 'TOKEN & ECOSYSTEM',
      title: 'Multi-asset flywheel',
      subtitle: {
        desktop:
          'Four tokens, one self-reinforcing value loop: growth → liquidity + payments + ecosystem.',
        mobile: 'Four tokens, one self-reinforcing value loop.',
      },
      cards: [
        {
          label: 'Stable reserve asset',
          description: 'Settlement layer · USD-backed liquidity',
        },
        {
          label: 'Core protocol asset',
          description: '150% over-collateralized · AI think-tank managed',
        },
        {
          label: 'Reward settlement token',
          description: '1:1 to AGX · powers X mining',
        },
        {
          label: 'Ecosystem value token',
          description: '210M fixed · 25% sell-burn',
        },
      ],
      note: 'Users → Liquidity → Payments → Growth → infinity',
    },
    roadmap: {
      eyebrow: 'ROADMAP',
      title: 'The road to DeFi 4.0',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2025 Q3',
          title: 'Genesis Launch',
          description: 'Protocol deployment · AGX minting · USD1 liquidity pool',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'PHASE 02',
          time: '2025 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · burn bonds · AI market-making',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: 'PHASE 03',
          time: '2026 Q1',
          title: 'DAO & Growth',
          description: 'X DAO incentives · multisig governance · global nodes',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'PHASE 04',
          time: '2026 Q2',
          title: 'AI Agent Economy',
          description:
            'Autonomous payments · on-chain collaboration · agent market-making',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: 'PHASE 05',
          time: '2026 Q3',
          title: 'Global Payments',
          description: 'Cross-border settlement · merchant onboarding · USD1 rails',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'PHASE 06',
          time: '2026 Q4',
          title: 'DeFi 4.0',
          description:
            'Institutional products · compliance framework · full ecosystem',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'SECURITY & TRUST',
      title: 'Aegis-grade security',
      subtitle: {
        desktop:
          'AEGIS = shield, guardianship, order, security. Asset safety is built in from the ground up.',
        mobile: 'Asset safety is built in from the ground up.',
      },
      checks: [
        {
          desktop:
            'Non-custodial - the AI market-maker contract cannot transfer out any assets',
          mobile: "Non-custodial - AI market-maker can't transfer out assets",
        },
        'Audited by multiple security firms',
        'Core contracts open-sourced on GitHub',
        {
          desktop: 'Safe multisig governance (upgrade + execution rights)',
          mobile: 'Safe multisig governance (upgrade + execution)',
        },
      ],
    },
    partners: {
      title: 'ECOSYSTEM PARTNERS',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Frequently asked questions',
      items: [
        {
          question: 'What is AEGIS X?',
          answer:
            "The world's first protocol driven by an AI think-tank system, fusing AI intelligence, DeFi liquidity and USD1 stablecoin payments into a next-generation value network - DeFi 4.0.",
          open: true,
        },
        {
          question: 'How is AGX minted?',
          answer:
            "AGX is minted through the protocol's collateralized issuance design with USD1 as the core settlement asset.",
        },
        {
          question: 'How are staking rewards calculated?',
          answer:
            'Rewards follow staking tiers, epoch settlement, and protocol participation rules defined by the AEGIS X contracts.',
        },
        {
          question: 'How is protocol security ensured?',
          answer:
            'AEGIS X combines non-custodial design, audits, open-source contracts, and multisig governance.',
        },
        {
          question: 'How does the X token work?',
          answer:
            'X is the ecosystem value token with a fixed supply and protocol-driven burn mechanics.',
          optional: true,
        },
        {
          question: 'What is the Turbo mechanism?',
          answer:
            'Turbo links buying and selling quotas with an adaptive cooldown to reduce panic selling while preserving liquidity.',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Collateral Ratio',
    },
    {
      value: '4,880%',
      countTarget: 4880,
      suffix: '%',
      label: 'Max Ref. APY',
    },
    {
      value: '2+',
      countTarget: 2,
      suffix: '+',
      label: 'Chains Supported',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'X Total Supply',
    },
  ],
  footer: {
    brandCopy: {
      desktop: 'Guarding the Future of Value.\nAI x DeFi x USD1',
      mobile: 'Guarding the Future of Value.\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: 'Terms of Service · Privacy Policy · Disclaimer',
    languageLabel: 'Language',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Protocol footer links',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'Launch DApp', mobile: 'Docs' },
          },
          { href: '#whitepaper', label: 'Whitepaper' },
          { href: '#docs', label: 'Docs' },
          { href: '#analytics', label: 'Analytics' },
        ],
      },
      {
        label: 'Ecosystem',
        ariaLabel: 'Ecosystem footer links',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX Staking', mobile: 'Docs' },
          },
          {
            href: '#token',
            label: { desktop: 'LP Bond', mobile: 'Whitepaper' },
          },
          { href: '#token', label: 'Burn Bond' },
          { href: '#token', label: 'X Mining' },
        ],
      },
      {
        label: 'Community',
        ariaLabel: 'Community footer links',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: 'Docs' },
          },
          {
            href: '#twitter',
            label: { desktop: 'Twitter / X', mobile: 'Whitepaper' },
          },
          { href: '#telegram', label: 'Telegram' },
          { href: '#github', label: 'GitHub' },
        ],
      },
    ],
  },
}
