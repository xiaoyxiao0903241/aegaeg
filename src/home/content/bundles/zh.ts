import type { HomeContentBundle } from '../types'

export const zhBundle: HomeContentBundle = {
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
  },
  hero: {
    guardianLabel: 'AEGIS X 守护者',
    eyebrow: {
      desktop: 'AI x DeFi x USD1 · DeFi 4.0 协议',
      mobile: 'AI x DeFi x USD1 · DeFi 4.0',
    },
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
          index: '01',
          title: 'AI 智库',
          desktop:
            '自主执行风控、做市与资产配置 - 全部链上运行，全部由智能驱动。',
          mobile: '自主执行风控、做市与资产配置 - 链上运行，智能驱动。',
        },
        {
          index: '02',
          title: 'USD1 结算',
          desktop:
            '150% 超额抵押铸造，以 USD1 作为稳定 DeFi 4.0 底层的核心结算资产。',
          mobile: '150% 超额抵押铸造，以 USD1 作为 DeFi 4.0 核心结算资产。',
        },
        {
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
          title: 'AI 做市引擎',
          desktop:
            '动态平衡模型：上涨时累积 USD1 储备；回撤时退出 LP 并执行回购 + 销毁，实现价格自修复。',
          mobile:
            '动态平衡：上涨时累积 USD1；回撤时回购 + 销毁，实现价格自修复。',
        },
        {
          title: '动态波动防御',
          desktop:
            '日跌幅 >=5% 自动触发：卖出费率提升至 30%，储备回购与黑洞销毁启动，24 小时后自动恢复。',
          mobile:
            '日跌幅 >=5% 触发：卖出费至 30%，储备回购 + 黑洞销毁，24 小时自动恢复。',
        },
        {
          title: 'Rebase 引擎',
          desktop:
            '每 12 小时双周期结算，区块级线性释放。适配最高 540 天质押周期，参考 APY 535%-4,880%。',
          mobile: '每 12 小时双周期结算，区块级释放。参考 APY 535%-4,880%。',
        },
        {
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
          '四种代币，一个自强化价值循环：增长 → 流动性 → 支付 → 生态。',
        mobile: '四种代币，一个自强化价值循环。',
      },
      cards: [
        {
          label: '核心协议资产',
          description: '150% 超额抵押 · AI 智库管理',
        },
        {
          label: '稳定储备资产',
          description: '结算层 · USD 支撑流动性',
        },
        {
          label: '生态价值代币',
          description: '2.1 亿固定供应 · 25% 卖出销毁',
        },
        {
          label: '奖励结算代币',
          description: '1:1 对应 AGX · 驱动 X 挖矿',
        },
      ],
    },
    roadmap: {
      eyebrow: '路线图',
      title: '通往 DeFi 4.0 的路径',
      phases: [
        {
          phase: '阶段 01',
          time: '2026 Q3',
          title: '创世启动',
          description: '协议部署 · AGX 铸造 · USD1 流动性池',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '阶段 02',
          time: '2026 Q4',
          title: 'DeFi 核心',
          description: 'Rebase 质押 · LP 债券 · 销毁债券 · AI 做市',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: '阶段 03',
          time: '2027 Q1',
          title: 'DAO 与增长',
          description: 'X DAO 激励 · 多签治理 · 全球节点',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: '阶段 04',
          time: '2027 Q2',
          title: 'AI Agent 经济',
          description: '自主支付 · 链上协作 · Agent 做市',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: '阶段 05',
          time: '2027 Q3',
          title: '全球支付',
          description: '跨境结算 · 商户接入 · USD1 支付通道',
          dot: '5',
          side: 'left',
        },
        {
          phase: '阶段 06',
          time: '2027 Q4',
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
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: '最高参考 APY',
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
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
