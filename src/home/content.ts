import { allLanguageOptions, type Locale } from '../i18n/locales'
import { withLocalePrefix } from '../i18n/locale'
import { homeAssets } from './assets'

export type ResponsiveCopy = {
  desktop: string
  mobile: string
}

export type NavigationLink = {
  href: string
  label: string
}

export type LanguageOption = {
  href?: string
  code: string
  name: string
  label: string
  active: boolean
}

export type IconCard = {
  icon: string
  index?: string
  title: string
  desktop: string
  mobile: string
}

export type TokenCard = {
  className: string
  icon: string
  iconClassName?: string
  shape: string
  shapeClassName?: string
  symbol: string
  label: string
  description: string
}

export type Metric = {
  value: string
  countTarget: number
  suffix: string
  label: string
}

export type RoadmapPhase = {
  phase: string
  time: string
  title: string
  description: string
  dot: string
  side: 'left' | 'right'
  state?: 'done' | 'current'
}

export type FaqItem = {
  question: string
  answer: string
  open?: boolean
  optional?: boolean
}

export type FooterGroup = {
  label: string
  ariaLabel: string
  links: Array<{
    href: string
    label: string | ResponsiveCopy
  }>
}

export type HomeContent = {
  meta: {
    description: string
    title: string
  }
  nav: {
    sectionsLabel: string
    links: NavigationLink[]
    whitepaper: string
    launchDapp: string
    languageLabel: string
    languages: LanguageOption[]
  }
  hero: {
    guardianLabel: string
    eyebrow: string
    title: string
    body: ResponsiveCopy
    enterProtocol: string
    readWhitepaper: string
    walletBusy: string
  }
  sections: {
    protocol: {
      eyebrow: string
      title: ResponsiveCopy
      subtitle: ResponsiveCopy
      cards: IconCard[]
    }
    engine: {
      eyebrow: string
      title: ResponsiveCopy
      subtitle: ResponsiveCopy
      cards: IconCard[]
    }
    token: {
      eyebrow: string
      title: string
      subtitle: ResponsiveCopy
      cards: TokenCard[]
      note: string
    }
    roadmap: {
      eyebrow: string
      title: string
      phases: RoadmapPhase[]
    }
    security: {
      eyebrow: string
      title: string
      subtitle: ResponsiveCopy
      checks: Array<string | ResponsiveCopy>
    }
    partners: {
      title: string
      items: ReadonlyArray<readonly [string, string]>
    }
    faq: {
      eyebrow: string
      title: string
      items: FaqItem[]
    }
  }
  metrics: Metric[]
  footer: {
    brandCopy: ResponsiveCopy
    copyright: string
    legal: string
    languageLabel: string
    languages: LanguageOption[]
    groups: FooterGroup[]
  }
}

function makeLanguageOptions(activeLocale: Locale): LanguageOption[] {
  return allLanguageOptions.map((option) => ({
    ...option,
    active: option.locale === activeLocale,
    href: option.locale ? withLocalePrefix(option.locale, '/') : undefined,
  }))
}

const tokenCardShells = [
  {
    className: 'bg-token-usd1',
    icon: homeAssets.token.usd1Icon,
    shape: homeAssets.token.usd1Shape,
    shapeClassName: 'opacity-90',
    symbol: 'USD1',
  },
  {
    className: 'bg-token-agx',
    icon: homeAssets.token.agxIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.agxShape,
    shapeClassName:
      '!right-[-10px] !bottom-0 !h-[124px] !w-[133px] opacity-20',
    symbol: 'AGX',
  },
  {
    className: 'bg-token-gagx',
    icon: homeAssets.token.gagxIcon,
    shape: homeAssets.token.gagxShape,
    shapeClassName: 'opacity-90',
    symbol: 'gAGX',
  },
  {
    className: 'bg-token-x',
    icon: homeAssets.token.xIcon,
    iconClassName: 'scale-110',
    shape: homeAssets.token.xShape,
    shapeClassName:
      '!right-0 !bottom-[11px] !h-[129px] !w-[136px] opacity-10',
    symbol: 'X',
  },
] as const

const partners = [
  ['USD1', homeAssets.partners.usd1],
  ['BSC', homeAssets.partners.bsc],
  ['Ethereum', homeAssets.partners.ethereum],
  ['LayerZero', homeAssets.partners.layerZero],
  ['Chainlink', homeAssets.partners.chainlink],
  ['PancakeSwap', homeAssets.partners.pancakeSwap],
] as const

const enContent: HomeContent = {
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
    languages: makeLanguageOptions('en'),
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
          icon: homeAssets.protocol.aiThinkTank,
          index: '01',
          title: 'AI Think-Tank',
          desktop:
            'Autonomous risk control, market-making and asset allocation - all executed on-chain, all intelligence-driven.',
          mobile:
            'Autonomous risk control, market-making and asset allocation - all on-chain, intelligence-driven.',
        },
        {
          icon: homeAssets.protocol.usd1,
          index: '02',
          title: 'USD1 Settlement',
          desktop:
            '150% over-collateralized minting, with USD1 as the core settlement asset of a stable DeFi 4.0 base layer.',
          mobile:
            '150% over-collateralized minting, with USD1 as the core settlement asset of DeFi 4.0.',
        },
        {
          icon: homeAssets.protocol.globalPayments,
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
          icon: homeAssets.engine.marketMaker,
          title: 'AI Market Maker',
          desktop:
            'Dynamic balancing model: accumulate USD1 reserves on the way up; on pullbacks, unwind LP and deploy buyback + burn for price self-repair.',
          mobile:
            'Dynamic balancing: accumulate USD1 on the way up; on pullbacks, buyback + burn for price self-repair.',
        },
        {
          icon: homeAssets.engine.volatility,
          title: 'Dynamic Volatility Defense',
          desktop:
            'Triggers automatically on a daily drop >=5%: sell fee rises to 30%, reserve buyback and black-hole burn engage, auto-restoring after 24h.',
          mobile:
            'Daily drop >=5% triggers: sell fee to 30%, reserve buyback + black-hole burn, auto-restore after 24h.',
        },
        {
          icon: homeAssets.engine.rebase,
          title: 'Rebase Engine',
          desktop:
            'Dual-epoch settlement every 12h with block-level linear release. Flexible to 540-day staking tiers, ref. APY 535%-4,880%.',
          mobile:
            'Dual-epoch settlement every 12h, block-level release. Ref. APY 535%-4,880%.',
        },
        {
          icon: homeAssets.engine.turbo,
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
          ...tokenCardShells[0],
          label: 'Stable reserve asset',
          description: 'Settlement layer · USD-backed liquidity',
        },
        {
          ...tokenCardShells[1],
          label: 'Core protocol asset',
          description: '150% over-collateralized · AI think-tank managed',
        },
        {
          ...tokenCardShells[2],
          label: 'Reward settlement token',
          description: '1:1 to AGX · powers X mining',
        },
        {
          ...tokenCardShells[3],
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
      items: partners,
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
    languages: makeLanguageOptions('en'),
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

const zhContent: HomeContent = {
  meta: {
    description:
      'AEGIS X 是 AI 原生 DeFi 4.0 协议，以 USD1 结算、BSC 优先钱包入口和自修复协议引擎构建下一代价值网络。',
    title: 'AEGIS X - 守护未来价值',
  },
  nav: {
    sectionsLabel: '首页区块导航',
    links: [
      { href: '#protocol', label: '协议' },
      { href: '#engine', label: '引擎' },
      { href: '#token', label: '代币' },
      { href: '#roadmap', label: '路线图' },
      { href: '#security', label: '安全' },
      { href: '#faq', label: '常见问题' },
    ],
    whitepaper: '白皮书',
    launchDapp: '启动 DApp',
    languageLabel: '语言',
    languages: makeLanguageOptions('zh'),
  },
  hero: {
    guardianLabel: 'AEGIS X 守护者',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 协议',
    title: '守护未来价值',
    body: {
      desktop:
        '全球首个 AI x DeFi x USD1 全球支付协议，由 AI 智库系统驱动。以 USD1 作为核心结算资产，用智能化重新定义去中心化金融。',
      mobile:
        '全球首个 AI x DeFi x USD1 全球支付协议，由 AI 智库系统驱动。',
    },
    enterProtocol: '进入协议',
    readWhitepaper: '阅读白皮书',
    walletBusy: '正在打开钱包...',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X 协议',
      title: {
        desktop: '为下一代金融时代构建的 AI 原生基础设施',
        mobile: 'AI 原生基础设施',
      },
      subtitle: {
        desktop: 'AI x DeFi x USD1 - 构建下一代全球价值网络。',
        mobile: 'AI x DeFi x USD1 - 构建下一代价值网络。',
      },
      cards: [
        {
          icon: homeAssets.protocol.aiThinkTank,
          index: '01',
          title: 'AI 智库',
          desktop:
            '自主执行风控、做市与资产配置 - 全部链上运行，全部由智能驱动。',
          mobile: '自主执行风控、做市与资产配置 - 链上运行，智能驱动。',
        },
        {
          icon: homeAssets.protocol.usd1,
          index: '02',
          title: 'USD1 结算',
          desktop:
            '150% 超额抵押铸造，以 USD1 作为稳定 DeFi 4.0 底层的核心结算资产。',
          mobile: '150% 超额抵押铸造，以 USD1 作为 DeFi 4.0 核心结算资产。',
        },
        {
          icon: homeAssets.protocol.globalPayments,
          index: '03',
          title: '全球支付',
          desktop:
            '将 AI Agent、DeFi 流动性与跨境支付连接为统一的全球价值网络。',
          mobile: '连接 AI Agent、DeFi 流动性与跨境支付，形成统一价值网络。',
        },
      ],
    },
    engine: {
      eyebrow: '核心引擎',
      title: {
        desktop: '四大支柱，一个智能系统',
        mobile: '四大支柱，一个系统',
      },
      subtitle: {
        desktop: 'AI 驱动的 DeFi 4.0 核心引擎 - 自修复价格架构。',
        mobile: 'AI 驱动的 DeFi 4.0 核心引擎。',
      },
      cards: [
        {
          icon: homeAssets.engine.marketMaker,
          title: 'AI 做市引擎',
          desktop:
            '动态平衡模型：上涨时累积 USD1 储备；回撤时退出 LP 并执行回购 + 销毁，实现价格自修复。',
          mobile:
            '动态平衡：上涨时累积 USD1；回撤时回购 + 销毁，实现价格自修复。',
        },
        {
          icon: homeAssets.engine.volatility,
          title: '动态波动防御',
          desktop:
            '日跌幅 >=5% 自动触发：卖出费率提升至 30%，储备回购与黑洞销毁启动，24 小时后自动恢复。',
          mobile:
            '日跌幅 >=5% 触发：卖出费至 30%，储备回购 + 黑洞销毁，24 小时自动恢复。',
        },
        {
          icon: homeAssets.engine.rebase,
          title: 'Rebase 引擎',
          desktop:
            '每 12 小时双周期结算，区块级线性释放。适配最高 540 天质押周期，参考 APY 535%-4,880%。',
          mobile: '每 12 小时双周期结算，区块级释放。参考 APY 535%-4,880%。',
        },
        {
          icon: homeAssets.engine.turbo,
          title: 'Turbo 机制',
          desktop:
            '买入解锁设计：1:1 买入换取卖出额度，24-96 小时自适应冷却，抑制恐慌性抛售。',
          mobile: '1:1 买入解锁卖出额度，24-96 小时自适应冷却，抑制恐慌抛售。',
        },
      ],
    },
    token: {
      eyebrow: '代币与生态',
      title: '多资产飞轮',
      subtitle: {
        desktop:
          '四种代币，一个自强化价值循环：增长 → 流动性 + 支付 + 生态。',
        mobile: '四种代币，一个自强化价值循环。',
      },
      cards: [
        {
          ...tokenCardShells[0],
          label: '稳定储备资产',
          description: '结算层 · USD 支撑流动性',
        },
        {
          ...tokenCardShells[1],
          label: '核心协议资产',
          description: '150% 超额抵押 · AI 智库管理',
        },
        {
          ...tokenCardShells[2],
          label: '奖励结算代币',
          description: '1:1 对应 AGX · 驱动 X 挖矿',
        },
        {
          ...tokenCardShells[3],
          label: '生态价值代币',
          description: '2.1 亿固定供应 · 25% 卖出销毁',
        },
      ],
      note: '用户 → 流动性 → 支付 → 增长 → 无限循环',
    },
    roadmap: {
      eyebrow: '路线图',
      title: '通往 DeFi 4.0 的路径',
      phases: [
        {
          phase: '阶段 01',
          time: '2025 Q3',
          title: '创世启动',
          description: '协议部署 · AGX 铸造 · USD1 流动性池',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '阶段 02',
          time: '2025 Q4',
          title: 'DeFi 核心',
          description: 'Rebase 质押 · LP 债券 · 销毁债券 · AI 做市',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: '阶段 03',
          time: '2026 Q1',
          title: 'DAO 与增长',
          description: 'X DAO 激励 · 多签治理 · 全球节点',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '阶段 04',
          time: '2026 Q2',
          title: 'AI Agent 经济',
          description: '自主支付 · 链上协作 · Agent 做市',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: '阶段 05',
          time: '2026 Q3',
          title: '全球支付',
          description: '跨境结算 · 商户接入 · USD1 支付通道',
          dot: '5',
          side: 'left',
        },
        {
          phase: '阶段 06',
          time: '2026 Q4',
          title: 'DeFi 4.0',
          description: '机构产品 · 合规框架 · 完整生态',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: '安全与信任',
      title: 'Aegis 级安全',
      subtitle: {
        desktop:
          'AEGIS 代表护盾、守护、秩序与安全。资产安全从协议底层开始内建。',
        mobile: '资产安全从协议底层开始内建。',
      },
      checks: [
        {
          desktop: '非托管 - AI 做市合约不能转出任何资产',
          mobile: '非托管 - AI 做市合约不能转出资产',
        },
        '多家安全机构审计',
        '核心合约在 GitHub 开源',
        {
          desktop: 'Safe 多签治理（升级 + 执行权限）',
          mobile: 'Safe 多签治理（升级 + 执行）',
        },
      ],
    },
    partners: {
      title: '生态合作伙伴',
      items: partners,
    },
    faq: {
      eyebrow: '常见问题',
      title: '常见问题',
      items: [
        {
          question: '什么是 AEGIS X？',
          answer:
            'AEGIS X 是全球首个由 AI 智库系统驱动的协议，将 AI 智能、DeFi 流动性与 USD1 稳定币支付融合为下一代价值网络 - DeFi 4.0。',
          open: true,
        },
        {
          question: 'AGX 如何铸造？',
          answer: 'AGX 通过协议的抵押发行设计铸造，并以 USD1 作为核心结算资产。',
        },
        {
          question: '质押奖励如何计算？',
          answer: '奖励遵循 AEGIS X 合约定义的质押层级、周期结算和协议参与规则。',
        },
        {
          question: '协议如何保证安全？',
          answer: 'AEGIS X 结合非托管设计、安全审计、开源合约与多签治理。',
        },
        {
          question: 'X 代币如何运作？',
          answer: 'X 是生态价值代币，具备固定供应和协议驱动的销毁机制。',
          optional: true,
        },
        {
          question: 'Turbo 机制是什么？',
          answer: 'Turbo 将买入与卖出额度绑定，并通过自适应冷却减少恐慌抛售，同时保持流动性。',
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
      label: '最高参考 APY',
    },
    {
      value: '2+',
      countTarget: 2,
      suffix: '+',
      label: '支持链',
    },
    {
      value: '2.1亿',
      countTarget: 210,
      suffix: 'M',
      label: 'X 总供应',
    },
  ],
  footer: {
    brandCopy: {
      desktop: '守护未来价值。\nAI x DeFi x USD1',
      mobile: '守护未来价值。\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. 保留所有权利。',
    legal: '服务条款 · 隐私政策 · 免责声明',
    languageLabel: '语言',
    languages: makeLanguageOptions('zh'),
    groups: [
      {
        label: '协议',
        ariaLabel: '协议页脚链接',
        links: [
          {
            href: '/app.html',
            label: { desktop: '启动 DApp', mobile: '文档' },
          },
          { href: '#whitepaper', label: '白皮书' },
          { href: '#docs', label: '文档' },
          { href: '#analytics', label: '数据分析' },
        ],
      },
      {
        label: '生态',
        ariaLabel: '生态页脚链接',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX 质押', mobile: '文档' },
          },
          {
            href: '#token',
            label: { desktop: 'LP 债券', mobile: '白皮书' },
          },
          { href: '#token', label: '销毁债券' },
          { href: '#token', label: 'X 挖矿' },
        ],
      },
      {
        label: '社区',
        ariaLabel: '社区页脚链接',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: '文档' },
          },
          {
            href: '#twitter',
            label: { desktop: 'Twitter / X', mobile: '白皮书' },
          },
          { href: '#telegram', label: 'Telegram' },
          { href: '#github', label: 'GitHub' },
        ],
      },
    ],
  },
}

export function getHomeContent(locale: Locale): HomeContent {
  return locale === 'zh' ? zhContent : enContent
}
