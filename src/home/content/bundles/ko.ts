import type { HomeContentBundle } from '../types'

export const koBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - 미래 가치의 수호',
    description:
      'AEGIS X는 USD1 결제, BSC 우선 지갑 접근, 자가 복구 프로토콜 엔진을 갖춘 AI 네이티브 DeFi 4.0 프로토콜입니다.',
  },
  nav: {
    sectionsLabel: '홈페이지 섹션',
    links: [
      { href: '#protocol', label: '프로토콜' },
      { href: '#engine', label: '엔진' },
      { href: '#token', label: '토큰' },
      { href: '#roadmap', label: '로드맵' },
      { href: '#security', label: '보안' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: '백서',
    launchDapp: 'DApp 실행',
    languageLabel: '언어',
  },
  hero: {
    guardianLabel: 'AEGIS X 가디언',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: '미래 가치의 수호',
    body: {
      desktop:
        'AI 싱크탱크 시스템이 구동하는 세계 최초의 AI x DeFi x USD1 글로벌 결제 프로토콜. USD1을 핵심 결제 자산으로, 지능을 통해 탈중앙화 금융을 재정의합니다.',
      mobile:
        'AI 싱크탱크 시스템이 구동하는 세계 최초의 AI x DeFi x USD1 글로벌 결제 프로토콜.',
    },
    enterProtocol: '프로토콜 진입',
    readWhitepaper: '백서 읽기',
    walletBusy: '지갑 여는 중...',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X PROTOCOL',
      title: {
        desktop: '차세대 금융 시대를 위한 AI 네이티브 인프라',
        mobile: 'AI 네이티브 인프라',
      },
      subtitle: {
        desktop: 'AI x DeFi x USD1 - 차세대 가치 네트워크를 구축합니다.',
        mobile: 'AI x DeFi x USD1 - 차세대 가치 네트워크 구축.',
      },
      cards: [
        {
          index: '01',
          title: 'AI Think-Tank',
          desktop:
            '자율 리스크 관리, 마켓 메이킹, 자산 배분 - 모두 온체인에서 실행되며, 모두 지능으로 구동됩니다.',
          mobile:
            '자율 리스크 관리, 마켓 메이킹, 자산 배분 - 온체인 실행, 지능 기반 구동.',
        },
        {
          index: '02',
          title: 'USD1 Settlement',
          desktop:
            '150% 초과 담보 발행, USD1을 안정적인 DeFi 4.0 베이스 레이어의 핵심 결제 자산으로 사용합니다.',
          mobile:
            '150% 초과 담보 발행, USD1을 DeFi 4.0 핵심 결제 자산으로 사용합니다.',
        },
        {
          index: '03',
          title: 'Global Payments',
          desktop:
            'AI 에이전트, DeFi 유동성, 크로스보더 결제를 하나의 통합 글로벌 가치 네트워크로 연결합니다.',
          mobile:
            'AI 에이전트, DeFi 유동성, 크로스보더 결제를 하나의 가치 네트워크로 연결합니다.',
        },
      ],
    },
    engine: {
      eyebrow: 'CORE ENGINE',
      title: {
        desktop: '4대 기둥, 하나의 지능형 시스템',
        mobile: '4대 기둥, 하나의 시스템',
      },
      subtitle: {
        desktop: 'AI 기반 DeFi 4.0 핵심 엔진 - 자가 복구 가격 아키텍처.',
        mobile: 'AI 기반 DeFi 4.0 핵심 엔진.',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            '동적 균형 모델: 상승 시 USD1 리저브 축적, 하락 시 LP 해제 후 바이백 + 소각으로 가격 자가 복구.',
          mobile:
            '동적 균형: 상승 시 USD1 축적, 하락 시 바이백 + 소각으로 가격 자가 복구.',
        },
        {
          title: 'Dynamic Volatility Defense',
          desktop:
            '일일 5% 이상 하락 시 자동 발동: 매도 수수료 30%로 상승, 리저브 바이백 및 블랙홀 소각 가동, 24시간 후 자동 복원.',
          mobile:
            '일일 5% 이상 하락 시: 매도 수수료 30%, 리저브 바이백 + 블랙홀 소각, 24시간 후 자동 복원.',
        },
        {
          title: 'Rebase Engine',
          desktop:
            '12시간마다 듀얼 에포크 정산, 블록 단위 선형 릴리스. 최대 540일 스테이킹 티어 지원, 참고 APY 535%-4,880%.',
          mobile:
            '12시간 듀얼 에포크 정산, 블록 단위 릴리스. 참고 APY 535%-4,880%.',
        },
        {
          title: 'Turbo Mechanism',
          desktop:
            '매수 잠금 해제 설계: 1:1 매수-매도 쿼터, 24-96시간 적응형 쿨다운 및 패닉 매도 방지 로직.',
          mobile:
            '1:1 매수로 매도 쿼터 해제, 24-96시간 적응형 쿨다운 - 패닉 매도 방지.',
        },
      ],
    },
    token: {
      eyebrow: 'TOKEN & ECOSYSTEM',
      title: '다자산 플라이휠',
      subtitle: {
        desktop:
          '4개 토큰, 하나의 자기 강화 가치 루프: 성장 → 유동성 + 결제 + 생태계.',
        mobile: '4개 토큰, 하나의 자기 강화 가치 루프.',
      },
      cards: [
        {
          label: '안정 리저브 자산',
          description: '결제 레이어 · USD 담보 유동성',
        },
        {
          label: '핵심 프로토콜 자산',
          description: '150% 초과 담보 · AI 싱크탱크 관리',
        },
        {
          label: '보상 정산 토큰',
          description: 'AGX 1:1 · X 마이닝 구동',
        },
        {
          label: '생태계 가치 토큰',
          description: '2.1억 고정 공급 · 25% 매도 소각',
        },
      ],
      note: '사용자 → 유동성 → 결제 → 성장 → 무한',
    },
    roadmap: {
      eyebrow: 'ROADMAP',
      title: 'DeFi 4.0으로 가는 길',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2025 Q3',
          title: 'Genesis Launch',
          description: '프로토콜 배포 · AGX 발행 · USD1 유동성 풀',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'PHASE 02',
          time: '2025 Q4',
          title: 'DeFi Core',
          description: 'Rebase 스테이킹 · LP 본드 · 소각 본드 · AI 마켓 메이킹',
          dot: '✓',
          side: 'right',
          state: 'done',
        },
        {
          phase: 'PHASE 03',
          time: '2026 Q1',
          title: 'DAO & Growth',
          description: 'X DAO 인센티브 · 멀티시그 거버넌스 · 글로벌 노드',
          dot: '✓',
          side: 'left',
          state: 'done',
        },
        {
          phase: 'PHASE 04',
          time: '2026 Q2',
          title: 'AI Agent Economy',
          description: '자율 결제 · 온체인 협업 · 에이전트 마켓 메이킹',
          dot: '4',
          side: 'right',
          state: 'current',
        },
        {
          phase: 'PHASE 05',
          time: '2026 Q3',
          title: 'Global Payments',
          description: '크로스보더 정산 · 가맹점 온보딩 · USD1 레일',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'PHASE 06',
          time: '2026 Q4',
          title: 'DeFi 4.0',
          description: '기관 상품 · 컴플라이언스 프레임워크 · 풀 생태계',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'SECURITY & TRUST',
      title: 'Aegis급 보안',
      subtitle: {
        desktop:
          'AEGIS = 방패, 수호, 질서, 보안. 자산 안전은 프로토콜 기반부터 내장됩니다.',
        mobile: '자산 안전은 프로토콜 기반부터 내장됩니다.',
      },
      checks: [
        {
          desktop:
            '비수탁 - AI 마켓 메이커 컨트랙트는 어떤 자산도 전송할 수 없습니다',
          mobile: '비수탁 - AI 마켓 메이커는 자산 전송 불가',
        },
        '다수 보안 업체 감사 완료',
        '핵심 컨트랙트 GitHub 오픈소스',
        {
          desktop: 'Safe 멀티시그 거버넌스 (업그레이드 + 실행 권한)',
          mobile: 'Safe 멀티시그 거버넌스 (업그레이드 + 실행)',
        },
      ],
    },
    partners: {
      title: 'ECOSYSTEM PARTNERS',
    },
    faq: {
      eyebrow: 'FAQ',
      title: '자주 묻는 질문',
      items: [
        {
          question: 'AEGIS X란 무엇인가요?',
          answer:
            'AI 싱크탱크 시스템이 구동하는 세계 최초의 프로토콜로, AI 지능, DeFi 유동성, USD1 스테이블코인 결제를 융합한 차세대 가치 네트워크 - DeFi 4.0입니다.',
          open: true,
        },
        {
          question: 'AGX는 어떻게 발행되나요?',
          answer:
            'AGX는 USD1을 핵심 결제 자산으로 하는 프로토콜의 담보 발행 설계를 통해 발행됩니다.',
        },
        {
          question: '스테이킹 보상은 어떻게 계산되나요?',
          answer:
            '보상은 AEGIS X 컨트랙트에 정의된 스테이킹 티어, 에포크 정산, 프로토콜 참여 규칙을 따릅니다.',
        },
        {
          question: '프로토콜 보안은 어떻게 보장되나요?',
          answer:
            'AEGIS X는 비수탁 설계, 보안 감사, 오픈소스 컨트랙트, 멀티시그 거버넌스를 결합합니다.',
        },
        {
          question: 'X 토큰은 어떻게 작동하나요?',
          answer:
            'X는 고정 공급량과 프로토콜 기반 소각 메커니즘을 갖춘 생태계 가치 토큰입니다.',
          optional: true,
        },
        {
          question: 'Turbo 메커니즘이란 무엇인가요?',
          answer:
            'Turbo는 매수와 매도 쿼터를 연결하고 적응형 쿨다운으로 패닉 매도를 줄이면서 유동성을 유지합니다.',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '담보 비율',
    },
    {
      value: '4,880%',
      countTarget: 4880,
      suffix: '%',
      label: '최대 참고 APY',
    },
    {
      value: '2+',
      countTarget: 2,
      suffix: '+',
      label: '지원 체인',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'X 총 공급량',
    },
  ],
  footer: {
    brandCopy: {
      desktop: '미래 가치의 수호.\nAI x DeFi x USD1',
      mobile: '미래 가치의 수호.\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: '서비스 약관 · 개인정보 처리방침 · 면책 조항',
    languageLabel: '언어',
    groups: [
      {
        label: '프로토콜',
        ariaLabel: '프로토콜 푸터 링크',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'DApp 실행', mobile: 'Docs' },
          },
          { href: '#whitepaper', label: '백서' },
          { href: '#docs', label: 'Docs' },
          { href: '#analytics', label: 'Analytics' },
        ],
      },
      {
        label: '생태계',
        ariaLabel: '생태계 푸터 링크',
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
        label: '커뮤니티',
        ariaLabel: '커뮤니티 푸터 링크',
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
