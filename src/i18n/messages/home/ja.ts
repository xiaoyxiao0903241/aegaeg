import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS Xは、USD1 Settlement、BSC優先Wallet入口、自己修復Protocol Engineを備えたAI Native DeFi 4.0 Protocolで、次世代の価値ネットワークを構築します。',
    title: 'AEGIS X - 未来の価値を守る'
  },
  nav: {
    sectionsLabel: 'ホームページセクションナビゲーション',
    links: [
      {
        href: '#protocol',
        label: 'Protocol'
      },
      {
        href: '#engine',
        label: 'Core'
      },
      {
        href: '#token',
        label: 'Value'
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
    languageLabel: 'Language'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: '未来の価値を守る',
    body: '世界初のAI Think Tank駆動型USD1 Ecosystem Protocol。USD1をCore Settlement Assetとし、AI、決済、グローバル流動性ネットワークを接続します。',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: '次世代価値ネットワークのコアアーキテクチャ',
      subtitle: 'AI x DeFi x USD1 - 価値の流動を駆動',
      cards: [
        {
          title: 'AI Think Tank',
          body: '自律的なRisk Control、Intelligent Market Making、流動性管理をすべてオンチェーンで実行。',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'USD1をCore Settlement Assetとし、安定した価値流通ネットワークを構築。',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'AI Agent、DeFi、グローバル決済シナリオを接続し、次世代の価値ネットワークを構築。',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: '4つのメカニズム、1つのIntelligent System',
      subtitle: 'Intelligent Decision、Dynamic Adjustment、Risk Controlにより、持続可能な価値ネットワークを構築。',
      cards: [
        {
          title: 'Intelligent Market-Making',
          body: '上昇局面では準備資産を蓄積しProtocol Reserve能力を強化し、調整局面ではBuyback·Burnで価格を修復。'
        },
        {
          title: 'Volatility Defense',
          body: '日次下落率が閾値に達すると自動発動：Sell Feeを30%に引き上げ、Reserve BuybackとBlackhole Burnを開始し、24時間後に自動復帰。'
        },
        {
          title: 'Yield Distribution',
          body: 'Block-Level Linear Releaseを採用し、12時間ごとにYield Settlement、最大540日の参加期間をサポート。'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Dynamic Buy-to-Unlockメカニズムにより市場流動性構造を最適化し、エコシステムの安定性と長期発展力を強化。'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
      title: 'Multi-Asset Value Flywheel',
      subtitle: 'ユーザー成長 → 流動性強化 → 決済拡大 → エコシステム成長。',
      cards: [
        {
          label: 'Core Protocol Asset',
          description: '150%超過担保Minting · Yield Growth Engine'
        },
        {
          label: 'Core Settlement Asset',
          description: 'Ecosystem Settlement Layer · Value Circulation Infra'
        },
        {
          label: 'Ecosystem Value Token',
          description: '固定総量2.1億 · 継続的な価値蓄積'
        },
        {
          label: 'Reward Settlement Voucher',
          description: 'AGXと交換可能 · エコシステムMining参加'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: '次世代価値ネットワークへの道',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol展開 · AGX Minting · USD1 Liquidity Pool',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase Staking · LP Bond · Burn Bond · AI Market Making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAO Incentives · Multisig Governance · グローバルノード',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: '自律決済 · Intelligent Collaboration · AI Agent Economy Network',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Global Payment Network · 加盟店連携 · USD1決済シナリオ',
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
      title: 'AEGIS級セキュリティアーキテクチャ',
      subtitle: 'Protocol ArchitectureからAsset Managementまで、セキュリティがすべての段階に貫通',
      checks: [
        "Non-Custodial Architecture · Intelligent Market-Making Contractは資産転出権限を持たない",
        "Core Contractはオープンソースで検証可能 · 専門的なセキュリティAudit通過",
        "Multisig Governance · Core権限の共同管理",
        "Dynamic Defense Mechanism · 極端なボラティリティに自動対応"
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
          q: 'AEGIS Xとは？',
          a: 'AEGIS Xは世界初のAI Think Tank駆動型USD1 Ecosystem Protocolで、USD1をCore Settlement Assetとし、AI、DeFi、グローバル決済ネットワークを接続します。',
          open: true
        },
        {
          q: 'AGXはどうMintingされますか？',
          a: 'AGXは150%超過担保メカニズムにより生成され、Protocolのコア資産と価値成長の重要な担い手です。'
        },
        {
          q: 'USD1はAEGIS Xでどのような役割？',
          a: 'USD1はProtocolのCore Settlement Assetであり、エコシステムに価値流通、流動性サポート、決済インフラ機能を提供します。'
        },
        {
          q: 'Protocolはどうセキュリティを確保？',
          a: 'ContractはNon-Custodial Boundary、Audit、オープンソースReview、Multisig Governanceを採用。'
        },
        {
          q: 'Turbo Mechanismとは？',
          a: 'Turbo MechanismはDynamic Unlockと流動性調整メカニズムにより、集中売り圧力リスクを低減し、市場の安定性と長期発展力を強化します。'
        },
        {
          q: 'X Tokenはどう機能しますか？',
          a: 'XはEcosystem Value Tokenで、固定総量とProtocol駆動のBurnメカニズムを採用。'
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
      label: 'X Fixed Total Supply'
    }
  ],
  footer: {
    brandCopy: '未来の価値ネットワークを守る \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
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
            label: 'Docs'
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
