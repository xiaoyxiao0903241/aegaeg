import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X는 AI Native DeFi 4.0 Protocol로, USD1 Settlement, BSC 우선 Wallet 접근, 자가 복구 Protocol Engine으로 차세대 가치 네트워크를 구축합니다.',
    title: 'AEGIS X - 미래 가치를 수호'
  },
  nav: {
    sectionsLabel: '홈페이지 섹션 네비게이션',
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
    title: '미래 가치를 수호',
    body: '세계 최초의 AI Think Tank 기반 USD1 Ecosystem Protocol. USD1을 Core Settlement Asset으로 AI, 결제, 글로벌 유동성 네트워크를 연결합니다.',
    enterProtocol: 'Enter Protocol',
    readWhitepaper: 'Read Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: '차세대 가치 네트워크 핵심 아키텍처',
      subtitle: 'AI x DeFi x USD1 - 가치 흐름을 구동합니다',
      cards: [
        {
          title: 'AI Think Tank',
          body: '자율 Risk Control, Intelligent Market Making, 유동성 관리를 모두 온체인에서 실행합니다.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'USD1을 Core Settlement Asset으로 안정적인 가치 유통 네트워크를 구축합니다.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'AI Agent, DeFi, 글로벌 결제 시나리오를 연결하여 차세대 가치 네트워크를 구축합니다.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: '4대 메커니즘, 하나의 Intelligent System',
      subtitle: 'Intelligent Decision, Dynamic Adjustment, Risk Control로 지속 가능한 가치 네트워크를 구축합니다.',
      cards: [
        {
          title: 'Intelligent Market-Making',
          body: '상승 구간에서 준비금 자산을 축적하여 Protocol Reserve 역량을 강화하고, 조정 구간에서는 Buyback·Burn으로 가격을 복구합니다.'
        },
        {
          title: 'Volatility Defense',
          body: '일일 하락률이 임계값에 도달하면 자동 발동: Sell Fee 30%로 상향, Reserve Buyback 및 Blackhole Burn이 시작되며 24시간 후 자동 복구됩니다.'
        },
        {
          title: 'Yield Distribution',
          body: 'Block-Level Linear Release를 채택하고 12시간마다 Yield Settlement가 이루어지며 최대 540일 참여 주기를 지원합니다.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Dynamic Buy-to-Unlock 메커니즘으로 시장 유동성 구조를 최적화하고 생태계 안정성과 장기 발전 역량을 강화합니다.'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
      title: 'Multi-Asset Value Flywheel',
      subtitle: '사용자 성장 → 유동성 강화 → 결제 확장 → 생태계 성장.',
      cards: [
        {
          label: 'Core Protocol Asset',
          description: '150% 초과 담 보 Minting · Yield Growth Engine'
        },
        {
          label: 'Core Settlement Asset',
          description: 'Ecosystem Settlement Layer · Value Circulation Infra'
        },
        {
          label: 'Ecosystem Value Token',
          description: '고정 총량 2.1억 · 지속적 가치 축적'
        },
        {
          label: 'Reward Settlement Voucher',
          description: 'AGX로 교환 가능 · 생태계 Mining 참여'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Roadmap',
      title: '차세대 가치 네트워크로 향하는 길',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol 배포 · AGX Minting · USD1 Liquidity Pool',
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
          description: 'X DAO Incentives · Multisig Governance · 글로벌 노드',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: '자율 결제 · Intelligent Collaboration · AI Agent Economy Network',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Global Payment Network · 가맹점 연동 · USD1 결제 시나리오',
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
      title: 'AEGIS급 보안 아키텍처',
      subtitle: 'Protocol Architecture부터 Asset Management까지, 보안이 모든 단계에 관통합니다',
      checks: [
        "Non-Custodial Architecture · Smart Market-Making Contract는 자산 이체 권한이 없습니다",
        "Core Contract 오픈소스 검증 가능 · 전문 보안 Audit 통과",
        "Multisig Governance · Core 권한 공동 관리",
        "Dynamic Defense Mechanism · 극단적 변동성에 자동 대응"
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
          q: 'AEGIS X란?',
          a: 'AEGIS X는 세계 최초의 AI Think Tank 기반 USD1 Ecosystem Protocol로, USD1을 Core Settlement Asset으로 AI, DeFi, 글로벌 결제 네트워크를 연결합니다.',
          open: true
        },
        {
          q: 'AGX는 어떻게 Minting 되나요?',
          a: 'AGX는 150% 초과 담 보 메커니즘으로 생성되며, Protocol 핵심 자산과 가치 성장의 중요한 매개체입니다.'
        },
        {
          q: 'USD1은 AEGIS X에서 어떤 역할을 하나요?',
          a: 'USD1은 Protocol의 Core Settlement Asset으로, 생태계에 가치 유통, 유동성 지원 및 결제 인프라 역량을 제공합니다.'
        },
        {
          q: 'Protocol은 어떻게 보안을 보장하나요?',
          a: 'Contract는 Non-Custodial Boundary, Audit, 오픈소스 Review, Multisig Governance를 채택합니다.'
        },
        {
          q: 'Turbo Mechanism이란?',
          a: 'Turbo Mechanism은 Dynamic Unlock과 유동성 조절 메커니즘을 통해 집중 매도 압력 리스크를 낮추고 시장 안정성과 장기 발전 역량을 강화합니다.'
        },
        {
          q: 'X Token은 어떻게 작동하나요?',
          a: 'X는 Ecosystem Value Token으로, 고정 총량과 Protocol 기반 Burn 메커니즘을 채택합니다.'
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
    brandCopy: '미래 가치 네트워크를 수호 \nAI x DeFi x USD1',
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
