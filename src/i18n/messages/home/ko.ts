import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X는 AI 네이티브 DeFi 4.0 프로토콜로, USD1 정산, BSC 우선 지갑 접근 및 자가 복구 프로토콜 엔진을 통해 차세대 가치 네트워크를 구축합니다.',
    title: 'AEGIS X - 미래 가치를 수호'
  },
  nav: {
    sectionsLabel: '홈페이지 섹션 탐색',
    links: [
      {
        href: '#protocol',
        label: '프로토콜'
      },
      {
        href: '#engine',
        label: '핵심 메커니즘'
      },
      {
        href: '#token',
        label: '생태계 가치'
      },
      {
        href: '#roadmap',
        label: '로드맵'
      },
      {
        href: '#security',
        label: '보안'
      },
      {
        href: '#faq',
        label: '자주 묻는 질문'
      }
    ],
    whitepaper: '백서',
    languageLabel: '언어'
  },
  hero: {
    guardianLabel: 'AEGIS X 가디언',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 프로토콜',
    title: '미래 가치를 수호',
    body: '세계 최초의 AI 싱크탱크 기반 USD1 생태계 프로토콜. USD1을 핵심 정산 자산으로 AI, 결제 및 글로벌 유동성 네트워크를 연결합니다.',
    enterProtocol: '프로토콜 진입',
    readWhitepaper: '백서 읽기',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X 프로토콜',
      title: '차세대 가치 네트워크 핵심 아키텍처',
      subtitle: 'AI x DeFi x USD1 - 가치 흐름을 구동합니다',
      cards: [
        {
          title: 'AI 싱크탱크',
          body: '자율 리스크 관리, 지능형 마켓메이킹 및 유동성 관리가 모두 온체인에서 실행됩니다.',
          index: '01'
        },
        {
          title: 'USD1 정산',
          body: 'USD1을 핵심 정산 자산으로 안정적인 가치 유통 네트워크를 구축합니다.',
          index: '02'
        },
        {
          title: '글로벌 결제',
          body: 'AI Agent, DeFi 및 글로벌 결제 시나리오를 연결하여 차세대 가치 네트워크를 구축합니다.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: '핵심 메커니즘',
      title: '4대 메커니즘, 하나의 지능형 시스템',
      subtitle: '지능형 의사결정, 동적 조절 및 리스크 관리를 통해 지속 가능한 가치 네트워크를 구축합니다.',
      cards: [
        {
          title: '지능형 마켓메이킹 메커니즘',
          body: '상승 구간에서 준비금 자산을 축적하여 프로토콜 준비금 역량을 강화하고, 조정 구간에서는 매수·소각 메커니즘을 실행하여 가격을 복구합니다.'
        },
        {
          title: '변동성 방어 메커니즘',
          body: '일일 하락률이 임계값에 도달하면 자동 발동: 매도 수수료 30%로 상향, 준비금 매수 및 블랙홀 소각이 시작되며 24시간 후 자동 복구됩니다.'
        },
        {
          title: '수익 분배 메커니즘',
          body: '블록 단위 선형 해제 메커니즘을 채택하며, 12시간마다 수익 정산이 이루어지고 최대 540일 참여 주기를 지원합니다.'
        },
        {
          title: '터보 메커니즘',
          body: '동적 매수 해제 메커니즘을 통해 시장 유동성 구조를 최적화하고 생태계 안정성과 장기 발전 역량을 강화합니다.'
        }
      ]
    },
    token: {
      eyebrow: '가치 생태계',
      title: '다자산 가치 플라이휠',
      subtitle: '사용자 성장 → 유동성 강화 → 결제 확장 → 생태계 성장.',
      cards: [
        {
          label: '핵심 프로토콜 자산',
          description: '150% 초과 담보 발행 · 수익 성장 엔진'
        },
        {
          label: '핵심 정산 자산',
          description: '생태계 정산 레이어 · 가치 유통 인프라'
        },
        {
          label: '생태계 가치 토큰',
          description: '고정 총량 2.1억 · 지속적 가치 축적'
        },
        {
          label: '보상 정산 증명',
          description: 'AGX 교환 가능 · 생태계 마이닝 참여'
        }
      ]
    },
    roadmap: {
      eyebrow: '로드맵',
      title: '차세대 가치 네트워크로 향하는 길',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: '제네시스 런칭',
          description: '프로토콜 배포 · AGX 발행 · USD1 유동성 풀',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi 핵심',
          description: 'Rebase 스테이킹 · LP 본드 · 소각 본드 · AI 마켓메이킹',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO 및 성장',
          description: 'X DAO 인센티브 · 멀티시그 거버넌스 · 글로벌 노드',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent 경제',
          description: '자율 결제 · 지능형 협업 · AI Agent 경제 네트워크',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: '글로벌 결제',
          description: '글로벌 결제 네트워크 · 가맹점 연동 · USD1 결제 시나리오',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: '미래 가치 네트워크',
          description: '결제 네트워크 · AI Agent 경제 · 가치 생태계',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: '보안 및 신뢰',
      title: 'AEGIS급 보안 아키텍처',
      subtitle: '프로토콜 아키텍처부터 자산 관리까지, 보안이 모든 단계에 관통합니다',
      checks: [
        "비수탁 아키텍처 · 지능형 마켓메이킹 컨트랙트는 자산 이체 권한이 없습니다",
        "핵심 컨트랙트 오픈소스 검증 가능 · 전문 보안 감사 통과",
        "멀티시그 거버넌스 메커니즘 · 핵심 권한 공동 관리",
        "동적 방어 메커니즘 · 극단적 변동성에 자동 대응"
      ]
    },
    partners: {
      title: '생태계 인프라'
    },
    faq: {
      eyebrow: '빠른 이해',
      title: '자주 묻는 질문',
      items: [
        {
          q: 'AEGIS X란 무엇인가요?',
          a: 'AEGIS X는 세계 최초의 AI 싱크탱크 기반 USD1 생태계 프로토콜로, USD1을 핵심 정산 자산으로 AI, DeFi 및 글로벌 결제 네트워크를 연결합니다.',
          open: true
        },
        {
          q: 'AGX는 어떻게 발행되나요?',
          a: 'AGX는 150% 초과 담보 메커니즘을 통해 생성되며, 프로토콜 핵심 자산과 가치 성장의 중요한 매개체입니다.'
        },
        {
          q: 'USD1은 AEGIS X에서 어떤 역할을 하나요?',
          a: 'USD1은 프로토콜의 핵심 정산 자산으로, 생태계에 가치 유통, 유동성 지원 및 결제 인프라 역량을 제공합니다.'
        },
        {
          q: '프로토콜은 어떻게 보안을 보장하나요?',
          a: '컨트랙트는 비수탁 경계, 감사, 오픈소스 검토 및 멀티시그 거버넌스를 채택합니다.'
        },
        {
          q: '터보 메커니즘이란 무엇인가요?',
          a: '터보 메커니즘은 동적 해제 및 유동성 조절 메커니즘을 통해 집중 매도 압력 위험을 낮추고 시장 안정성과 장기 발전 역량을 강화합니다.'
        },
        {
          q: 'X 토큰은 어떻게 작동하나요?',
          a: 'X는 생태계 가치 토큰으로, 고정 총량과 프로토콜 기반 소각 메커니즘을 채택합니다.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '초과 담보율'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP 영구 잠금'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: '동적 방어 메커니즘'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X 고정 총량'
    }
  ],
  footer: {
    brandCopy: '미래 가치 네트워크를 수호 \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. 모든 권리 보유.',
    legal: '서비스 약관 · 개인정보 처리방침 · 면책 조항',
    groups: [
      {
        label: '프로토콜',
        ariaLabel: '프로토콜 푸터 링크',
        links: [
          {
            href: '/app.html',
            label: 'App 진입'
          },
          {
            href: '#whitepaper',
            label: '백서'
          },
          {
            href: '#docs',
            label: '프로젝트 문서'
          },
          {
            href: '#analytics',
            label: '발전 로드맵'
          }
        ]
      },
      {
        label: '생태계',
        ariaLabel: '생태계 푸터 링크',
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
        label: '커뮤니티',
        ariaLabel: '커뮤니티 푸터 링크',
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
} satisfies HomeMessagesBundle)

export default home
