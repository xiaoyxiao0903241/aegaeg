import { defineMessages } from '~/i18n/messages/define-messages'

import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: '지갑 연결',
    language: '언어',
    copy: '복사',
    claimable: '수령 대기',
    max: '최대',
    shareUnit: '지분',
    confirm: '확인',
    close: '닫기',
    comingSoon: '곧 출시',
    splitDragHint: '드래그하여 조정',
    paginationTotal: '총 {total}건',
    paginationPerPage: '페이지당 {size}건',
    paginationPrev: '이전 페이지',
    paginationNext: '다음 페이지',
  },
  errors: {
    api: {
      network: '네트워크 연결에 실패했습니다. 연결을 확인한 후 다시 시도하세요.',
      timeout: '요청 시간이 초과되었습니다. 잠시 후 다시 시도하세요.',
      unavailable: '서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도하세요.',
      badResponse: '서버 응답이 올바르지 않습니다. 잠시 후 다시 시도하세요.',
      fallback: '작업에 실패했습니다. 잠시 후 다시 시도하세요.',
    },
    chain: {
      fallback: '온체인 작업에 실패했습니다. 잠시 후 다시 시도하세요.',
      reverts: {
        stakeAmountLimit:
          '일일 스테이킹 한도를 초과했습니다. 금액을 낮추거나 한도 회복을 기다려 주세요.',
        debtCapacityReached: '채권 용량이 부족합니다. 나중에 다시 시도해 주세요.',
        turbineCooldown:
          '쿨다운이 끝나지 않았습니다. 쿨다운 기록을 새로고침한 후 다시 시도해 주세요.',
        pairNotExist: '거래쌍이 존재하지 않습니다. 토큰 설정을 확인해 주세요.',
        configNotReady:
          '버퍼 풀 / 릴리스 대기열 설정이 준비되지 않았습니다. 나중에 다시 시도해 주세요.',
        exceedsMax: '금액이 상한을 초과했습니다. 금액을 낮춰 주세요.',
        bondTooSmall: '채권 지급액이 너무 작습니다. 구매 금액을 늘려 주세요.',
        bondTooLarge: '단일 채권 한도를 초과했습니다. 구매 금액을 낮춰 주세요.',
        stakeNotExist:
          '포지션이 없거나 이미 청산되었습니다. 목록을 새로고침한 후 다시 시도해 주세요.',
        yieldUnavailable:
          '수령 가능한 수익이 없거나 출금액이 너무 큽니다. 금액을 낮추거나 누적을 기다려 주세요.',
        operationPaused: '해당 작업이 일시 중지되었습니다. 나중에 다시 시도해 주세요.',
        belowMinAmount: '금액이 하한보다 낮습니다. 금액을 높여 주세요.',
        aboveMaxAmount: '금액이 상한을 초과했습니다. 금액을 낮춰 주세요.',
        zeroRate: '환율이 준비되지 않았습니다. 나중에 다시 시도해 주세요.',
        zeroAmount: '유효한 수량을 입력해 주세요.',
        turbineNoSilenceBalance: '인출 가능한 쿨다운 완료 잔액이 없습니다.',
        invalidAmount: '금액이 유효하지 않습니다. 확인 후 다시 시도하세요.',
        zeroAddress: '주소가 유효하지 않습니다. 잠시 후 다시 시도하세요.',
        notAuthorized: '이 계정에는 해당 작업 권한이 없습니다.',
        invalidLimits: '한도 설정이 유효하지 않습니다. 잠시 후 다시 시도하세요.',
        nothingToClaim:
          '수령할 항목이 없거나 인덱스가 유효하지 않습니다. 새로고침 후 다시 시도하세요.',
        warmupOrLockActive: '아직 워밍업 또는 잠금 기간입니다. 종료 후 다시 시도하세요.',
        walletTokenInsufficient: '지갑 토큰 잔액이 부족합니다.',
        walletAgxInsufficient: '지갑 AGX 잔액이 부족합니다.',
        walletUsd1Insufficient: '지갑 USD1 잔액이 부족합니다.',
        walletGagxInsufficient: '지갑 gAGX 잔액이 부족합니다.',
        contractPayableInsufficient:
          '컨트랙트 지급 가능 잔액이 부족합니다. 잠시 후 다시 시도하세요.',
        extractableInsufficient: '인출 가능 잔액이 부족합니다. 새로고침 후 다시 시도하세요.',
        insufficientAllowance: '승인 한도가 부족합니다. 먼저 승인하세요.',
      },
    },
    walletNotConnected: '먼저 지갑을 연결하고 로그인해 주세요.',
    quoteFailed: '견적에 실패했습니다. 잠시 후 다시 시도하세요.',
    loadFailed: '불러오기에 실패했습니다. 잠시 후 다시 시도하세요.',
    loginFailed: '로그인에 실패했습니다. 잠시 후 다시 시도하세요.',
    loginSignatureRejected: '로그인 서명이 유효하지 않거나 만료되었습니다. 다시 서명해 주세요.',
    pageLoadFailed: '페이지를 불러오지 못했습니다',
    pageLoadFailedBody: '렌더링 중 오류가 발생했습니다. 새로고침하세요. 지갑 연결은 유지됩니다.',
    reloadPage: '페이지 새로고침',
  },
  nav: {
    exchange: '교환',
    assets: '자산',
    staking: '스테이킹',
    genesis: '공동 구축',
    rewards: '리워드',
    release: '릴리스',
    community: '커뮤니티',
    rewardsTooltip: '추천 리워드와 팀 리워드를 확인하세요.',
    communityTooltip:
      '파트너를 초대하여 공동 구축에 참여하고, 생태계 성장 가치와 창세 리워드를 함께 누리세요.',
    bscTooltip: 'BSC 전용 · AEGIS X는 BNB Smart Chain에서 실행됩니다.',
  },
  flowOps: {
    stake: {
      STAKE: '스테이킹',
      REWARD: '보상 수령',
      EXTRA_REWARD: '추가 보상 수령',
      CLAIM_PRINCIPAL: '상환',
      RESTAKE: '재스테이킹',
      EARLY_STAKE: '공동 구축',
    },
    bond: {
      PURCHASE: '구매',
      REDEEM: '상환',
      REWARD: '수령',
      RESTAKE: '재스테이킹',
    },
    xmine: {
      STAKE_X: '스테이킹',
      UNSTAKE_X: '언스테이킹',
      REWARD: '수령',
    },
    buffer: {
      RELEASE_CREATED: '진입',
      PRINCIPAL_CLAIMED: '인출',
    },
    release: {
      entered_queue: '대기열 진입',
      claimed_from_queue: '수령',
      released: '릴리스됨',
    },
    turbine: {
      received: '진입',
      silenced: '잠금 해제',
      cooled_claimed: '인출',
    },
    termDays: '({n}일)',
    termLiquid: '(수시)',
    liquid: '수시',
    periodDays: '{n}일',
  },
  topbar: {
    currentNetwork: '현재 네트워크',
    switchToBsc: 'BSC로 전환하세요',
    switchNetworkFailed: '네트워크 전환에 실패했습니다. 지갑에서 BSC로 전환한 뒤 다시 시도하세요.',
    wrongNetworkTooltip:
      '네트워크가 일치하지 않습니다. 클릭하여 BNB Smart Chain(BSC)으로 전환하세요.',
    openMenu: '내비게이션 열기',
    closeMenu: '내비게이션 닫기',
    hideDetails: '상세 패널 접기',
    showDetails: '상세 패널 펼치기',
    toggleTooltip: '상세 패널 표시 또는 숨기기',
  },
  onboarding: {
    chip: '튜토리얼',
    skip: '건너뛰기',
    prev: '이전',
    next: '다음',
    done: '완료',
    complete: {
      title: '튜토리얼 완료',
      body: 'AEGIS X의 핵심 기능을 확인했습니다. 지금 바로 탐색을 시작하세요. 상단 「튜토리얼」에서 언제든 다시 볼 수 있습니다.',
      cta: '시작하기',
    },
    steps: [
      {
        title: '교환',
        body: '「교환」에서 메이저 토큰을 시장 환율로 AEGIS X 생태계 토큰(AGX, gAGX, X)과 교환할 수 있습니다.',
      },
      {
        title: '거래',
        body: '「거래」에서 USD1로 AGX를 구매할 수 있습니다.',
      },
      {
        title: '스테이킹',
        body: '「스테이킹」은 수익의 시작점입니다. AGX를 스테이킹하거나 채권을 구매하면 매 Rebase마다 복리 수익을 얻습니다.',
      },
      {
        title: '단일 자산 스테이킹',
        body: '「스테이킹」 카드에서 AGX를 스테이킹하세요. 하루 {timesPerDay}회 Rebase로 복리 성장하며, 주기가 길수록 수익률 가산이 높아집니다.',
      },
      {
        title: '자산',
        body: '「자산」에서 전체 포지션을 한눈에 확인합니다. 스테이킹·LP 채권·소각 채권·X 마이닝의 포지션과 수익이 여기에 모입니다.',
      },
      {
        title: '스테이킹 포지션',
        body: '자산 페이지의 「스테이킹」 카드에서 스테이킹 보유와 총 수익을 확인하고, 수익 수령·재예치·상환 등을 진행할 수 있습니다.',
      },
      {
        title: '릴리스',
        body: '「릴리스」는 대기 중인 자금을 관리합니다. 수익과 리워드가 먼저 릴리스 풀 / 버퍼 풀로 들어가 주기별 선형 릴리스됩니다.',
      },
      {
        title: '릴리스 풀',
        body: '수령한 수익과 리워드는 선택한 주기(5 / 20 / 40 / 60일)로 선형 릴리스되며, 릴리스된 분은 터빈으로 수령할 수 있습니다.',
      },
      {
        title: '버퍼 풀',
        body: '상환한 원금은 약 30일 블록 선형으로 릴리스되며, 릴리스된 분은 언제든 지갑으로 출금할 수 있습니다.',
      },
      {
        title: '터빈',
        body: '릴리스 풀에서 터빈으로 들어온 gAGX는 잠금 상태이며, USD1로 1:1 매수하면 잠금 해제됩니다.',
      },
      {
        title: '리워드',
        body: '「리워드」에는 추천상, 참여상, 공동 구축상 등 다양한 인센티브가 포함되며, 리워드를 수령하려면 기여 포인트를 1:1로 소모해야 합니다.',
      },
      {
        title: '커뮤니티',
        body: '「커뮤니티」에서 팀을 확인하세요. 초대 링크, 커뮤니티 멤버, 공동 구축 등급이 여기에 표시됩니다.',
      },
    ],
  },
  dapp: {
    connect: {
      promoTitle: '연결 후 AEGIS X 기능 탐색',
      promoBrandLine: '미래 가치 네트워크를 수호하세요',
      recordsTitle: '지갑을 연결하여 기록을 확인하세요',
      recordsBodyGenesis: '연결 후 공동 구축 기록이 여기에 표시됩니다.',
      recordsBodyRewards: '연결 후 리워드 기록이 여기에 표시됩니다.',
      recordsBodyCommunity: '연결 후 초대 기록이 여기에 표시됩니다.',
    },
  },
  wallet: {
    connectTitle: '지갑 연결',
    connecting: '연결 중…',
    copyAddress: '주소 복사',
    copied: '복사됨',
    copyFailed: '복사에 실패했습니다. 길게 눌러 수동으로 복사하세요.',
    disconnect: '연결 해제',
    reconnectWallet: '지갑 다시 연결',
    reconnectHint: '지갑 연결이 끊어졌습니다. 온체인 작업을 위해 다시 연결하세요.',
    signInRequired: '로그인',
    accountBanned: '계정이 정지되었습니다. 고객 지원에 문의하세요.',
    transactionErrors: {
      gasLimitTooLow:
        'Gas 한도가 너무 낮습니다. 네트워크 수수료를 위해 지갑에 충분한 BNB를 유지한 뒤 다시 시도하세요.',
      gasEstimateFailed:
        '이 거래의 Gas를 추정할 수 없습니다. 네트워크를 확인한 뒤 다시 시도하세요.',
      insufficientFunds: '네트워크 Gas 수수료를 지불할 BNB가 부족합니다.',
      wrongChain: 'BNB Smart Chain(BSC)으로 전환한 뒤 다시 시도하세요.',
      accountChanged: '지갑 계정이 변경되었습니다. 다시 제출하세요.',
    },
  },
  exchange: {
    title: '교환',
    intro: '최적 환율로 AEGIS X 생태계 토큰을 획득하세요',
    backToHub: '교환으로 돌아가기',
    sell: 'Sell',
    buy: '구매',
    flip: '교환 방향 전환',
    balance: '잔액',
    exchangePrice: '교환 가격',
    slippage: '슬리피지 설정',
    allowedSlippage: '허용 슬리피지',
    slippageSettings: '허용 슬리피지 설정',
    slippagePanel: {
      title: '슬리피지',
      hint: '슬리피지 허용치는 주문 제출부터 온체인 체결까지 감수할 가격 변동입니다. 실제 슬리피지가 설정을 넘으면 거래가 실패하고 되돌립니다. 되돌린 거래에도 가스비가 발생할 수 있습니다.',
      modeAuto: '기본',
      modeCustom: '직접 입력',
      max: '최대 슬리피지',
      customAria: '사용자 슬리피지',
    },
    route: '교환 경로',
    provider: '제공자',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'PancakeSwap에서 열기',
    overview: '개요',
    exchangeRate: '교환 비율',
    settlement: '결제',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: '플래시',
          body: 'gAGX를 AGX로, USDT를 USD1로 교환 — 수수료·슬리피지 없음',
        },
        trade: {
          title: '거래',
          body: '메이저 토큰으로 AEGIS X 생태계 토큰을 교환하세요',
        },
        burn: {
          title: '소각',
          body: 'AGX를 소각하여 기여 포인트를 획득하세요',
        },
        turbine: {
          title: '터빈',
          body: 'USD1로 터빈에서 잠금 해제된 gAGX를 매수하세요',
        },
      },
      program: {
        title: 'AEGIS X 프로토콜 토큰 획득',
        cards: [
          { title: 'gAGX 거래', body: 'gAGX를 AGX로 교환' },
          { title: '터빈', body: 'USD1로 터빈에서 잠금 해제된 gAGX를 매수하세요' },
          { title: 'USD1 획득', body: '플래시로 USDT를 USD1로 교환' },
          { title: 'AGX 획득', body: 'PancakeSwap 시장 환율로 AGX 획득' },
          { title: 'X 매도', body: 'X를 AGX·USD1 등 생태계 토큰으로 교환' },
          { title: '기여 포인트 획득', body: '{ratio} 비율로 AGX를 소각하여 기여 포인트 획득' },
        ],
      },
      faq: {
        items: [
          {
            q: '교환 페이지에서는 무엇을 할 수 있나요?',
            a: '교환 페이지는 AEGIS X 프로토콜 토큰을 얻고 다루는 주요 진입점을 모읍니다. 플래시(gAGX를 AGX로 1:1 상환), 거래(USD1 / AGX / X 등을 시장 환율로 교환), 터빈(USD1로 매수해 터빈 gAGX를 잠금 해제), AGX 소각으로 기여 포인트 획득. 필요한 용도에 맞는 진입점을 고르세요.',
          },
          {
            q: '플래시와 거래의 차이는 무엇인가요?',
            a: '플래시는 프로토콜의 gAGX↔AGX 1:1 상환으로, 수수료·슬리피지 없이 온체인에 즉시 반영됩니다. 거래는 PancakeSwap을 거쳐 USD1, AGX, X 등을 실시간 시장 환율로 교환하며, 가격은 시장에 따라 움직이고 허용 슬리피지를 설정한 뒤 네트워크 gas를 지불합니다.',
          },
          {
            q: '암호화 지갑이란 무엇이며 어떻게 얻나요?',
            a: '암호화 지갑은 디지털 자산을 조회·관리하는 소프트웨어입니다. 자산은 지갑이 아니라 블록체인에 기록됩니다. 비수탁 지갑은 개인키를 완전히 통제하므로 거래 서명은 본인만 가능합니다. 수탁 지갑과 달리 제3자가 키를 보관하지 않습니다 — 다만 개인키나 시드 구문을 잃으면 자산 접근을 영구히 잃습니다. 비수탁 지갑은 모바일 앱 또는 하드웨어일 수 있으며, 흔히 MetaMask·TokenPocket 등을 사용합니다.',
          },
          {
            q: '블록체인 거래 수수료란 무엇인가요?',
            a: '온체인의 모든 거래—매수·매도·교환·이전—에는 gas가 필요합니다. 이 비용은 AEGIS X 앱이 통제·징수하지 않으며, 네트워크 수요와 계산 자원에 따라 결정됩니다. BSC에서는 gas를 BNB로 지불합니다. AEGIS X에서 거래하기 전에 지갑에 BNB를 충분히 보유하세요.',
          },
          {
            q: '암호화 지갑은 어떻게 작동하나요?',
            a: '암호화 지갑은 공개키와 개인키 한 쌍으로 자산을 보호·관리합니다. 비수탁 지갑을 설정하면 소프트웨어가 복구용 시드 구문(12·18·24개의 무작위 단어)을 생성합니다. 안전하게 보관하고 절대 유출하지 마세요. 개인키는 지갑에 대한 완전한 제어권을 부여하는 고유 문자열로, 거래 서명·승인에 사용되며 항상 비밀로 유지해야 합니다. 공개키는 개인키에서 파생되며 공개해도 되고, 지갑 주소 생성과 입금 수신에 사용됩니다.',
          },
        ],
      },
    },
    flash: {
      title: '플래시',
      intros: {
        gagx: '수수료·슬리피지 없이 gAGX를 AGX로 교환',
        gagxWrap: '수수료·슬리피지 없이 AGX를 gAGX로 래핑',
        usdt: '수수료·슬리피지 없이 USDT를 USD1로 교환',
      },
      providerName: 'AEGIS X',
      openProvider: 'BscScan에서 플래시 교환 컨트랙트 보기',
      settlementValue: '온체인 · 초 단위 반영',
      aboutTitle: '정보',
      action: '플래시',
      success: '플래시 교환 성공',
      pairAriaLabel: '플래시 페어',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: '플래시가 일시 중지되었습니다. 나중에 다시 시도해 주세요.',
        belowMin: '단일 최소 교환 한도보다 낮습니다.',
        aboveMax: '단일 최대 교환 한도를 초과했습니다.',
        insufficientReserve: 'USD1 준비금이 부족합니다. 나중에 다시 시도해 주세요.',
        zeroRate: '교환 환율이 준비되지 않았습니다. 나중에 다시 시도해 주세요.',
        insufficientOutput: '교환 호가가 변동했습니다. 다시 시도해 주세요.',
        transferMismatch: '토큰 전송 수량이 일치하지 않습니다. 다시 시도해 주세요.',
        zeroAddress: '컨트랙트 주소가 비정상입니다. 나중에 다시 시도해 주세요.',
        sameToken: '입·출력 토큰 설정이 비정상입니다. 나중에 다시 시도해 주세요.',
        zeroAmount: '0보다 큰 소각 금액을 입력해 주세요.',
        notAuthorized: '현재 작업이 승인되지 않았습니다.',
        invalidLimits: '교환 한도 설정이 비정상입니다. 나중에 다시 시도해 주세요.',
      },
      faq: {
        items: [
          {
            q: 'gAGX란 무엇인가요?',
            a: 'gAGX는 Rebase와 DAO 리워드의 통합 정산 증표입니다. AGX 스테이킹 또는 채권의 Rebase 수익, 그리고 각종 DAO 리워드는 모두 gAGX로 지급됩니다.',
          },
          {
            q: 'gAGX와 AGX의 교환 비율은?',
            a: '언제든 고정 1:1 교환 — 수수료·슬리피지 없음, 온체인 즉시 반영.',
          },
          {
            q: '플래시에 수수료와 슬리피지가 없는 이유는?',
            a: '플래시는 AMM 체결이 아니라 프로토콜 수준의 gAGX↔AGX 1:1 고정 상환이므로 가격 슬리피지와 교환 수수료가 없습니다. BSC 네트워크 gas(BNB)만 지불하면 됩니다.',
          },
          {
            q: 'gAGX는 어떻게 얻나요?',
            a: 'AGX 스테이킹, LP 채권, 소각 채권의 Rebase 수익과 각종 DAO 리워드는 모두 gAGX로 계정에 지급됩니다.',
          },
          {
            q: 'gAGX는 AGX 교환 외에 무엇을 할 수 있나요?',
            a: 'gAGX를 X 마이닝에 스테이킹하면 생태계 가치 토큰 X를 얻을 수 있습니다. AGX로 상환하거나 X를 채굴하는 두 경로를 자유롭게 선택할 수 있습니다.',
          },
          {
            q: 'USDT를 USD1로 어떻게 교환하나요?',
            a: '플래시 상단에서 「USDT → USD1」 페어로 전환한 뒤 수량을 입력하면 1:1로 교환됩니다. 수수료·슬리피지 없이 온체인에 즉시 반영됩니다.',
          },
          {
            q: 'USD1을 USDT로 다시 교환할 수 있나요?',
            a: '할 수 없습니다. 플래시는 USDT를 USD1로 단방향 전환만 합니다. USD1은 AEGIS X의 핵심 정산 자산이며, 생태계 내에서 거래·채권 구매·터빈 잠금 해제에 사용할 수 있습니다.',
          },
          {
            q: '플래시 기록은 어디서 확인하나요?',
            a: '플래시는 온체인에서 실행되며 초 단위로 반영됩니다. 지갑 또는 블록 탐색기에서 각 거래를 확인할 수 있습니다.',
          },
        ],
      },
    },
    trade: {
      title: '거래',
      intro: 'PancakeSwap 실시간 시장 환율 · 온체인 즉시 반영',
      aboutTitle: '정보',
      selectSellToken: '매도 토큰 선택',
      selectBuyToken: '매수 토큰 선택',
      xBuyDisabledHint: 'X는 매도만 가능합니다',
      flipDisabledXSellOnly: 'X는 매도만 가능 — 매수로 전환할 수 없습니다',
      action: '거래',
      success: '거래 성공',
      priceImpact: '가격 영향',
      estimatedGas: '예상 Gas',
      highPriceImpactWarning:
        '현재 거래액이 풀 가격에 미치는 영향이 큽니다. 금액을 줄이거나 슬리피지 허용치를 높여 보세요.',
    },
    burn: {
      title: '소각',
      subtitle: 'AGX를 소각하여 기여 포인트 획득',
      sellLabel: '소각',
      receiveLabel: '획득',
      pointsToken: '내 기여 포인트',
      currentContribution: '현재 기여 포인트',
      burnRate: '소각 비율',
      destination: '소각 목적지',
      destinationValue: '블랙홀 {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'BscScan에서 기여 교환 컨트랙트 보기',
      action: '소각',
      success: '소각 성공',
      aboutTitle: '기여 포인트 안내',
      blocked: {
        paused: '소각이 일시 중지되었습니다. 나중에 다시 시도해 주세요.',
        belowMin: '단일 최소 소각 한도보다 낮습니다.',
        aboveMax: '단일 최대 소각 한도를 초과했습니다.',
        zeroRate: '소각 비율이 준비되지 않았습니다. 나중에 다시 시도해 주세요.',
        zeroAmount: '0보다 큰 소각 금액을 입력해 주세요.',
      },
      metrics: {
        totalBurnedAgx: '누적 소각 AGX 수량',
        totalEarnedContribution: '누적 획득 기여 포인트',
        totalConsumedContribution: '누적 소모 기여 포인트',
      },
      history: {
        title: '소각 기록',
        emptyBurn:
          '아직 소각 기록이 없습니다. AGX를 소각해 기여 포인트를 얻은 후 여기에 각 작업이 표시됩니다.',
        emptyConsume:
          '아직 소모 기록이 없습니다. 기여 포인트를 소모하는 수익·리워드를 수령한 후 여기에 각 기록이 표시됩니다.',
        tabsAriaLabel: '소각 기록 분류',
        tabs: {
          burn: '소각',
          consume: '소모',
        },
        burnColumns: ['시간', '소각 AGX', '획득 기여 포인트', '거래 해시'],
        consumeColumns: ['시간', '용도', '수령 수량', '소모 기여 포인트', '거래 해시'],
        purpose: {
          stakeYield: '스테이킹 수익',
          lpBondYield: 'LP채권 수익',
          burnBondYield: '소각채권 수익',
          lucky: '럭키',
          rank: '등급 보상',
          referral: '추천 보상',
          participation: '참여 보상',
          surpass: '동급 추월',
          lifetime: '평생 보상',
          market: '마켓 수당',
        },
      },
      faq: {
        items: [
          {
            q: '기여 포인트는 어디에 쓰이나요?',
            a: '스테이킹·채권 등 수익을 수령할 때 기여 포인트를 1:1로 소모합니다(gAGX 1 수령 시 1포인트 소모). 포인트가 부족하면 수령할 수 없습니다.',
          },
          {
            q: '수익 수령에 기여 포인트가 필요한 이유는?',
            a: '수령을 프로토콜 디플레이션에 묶는 장치입니다. gAGX 1을 수령할 때마다 기여 포인트 1을 소모하며, 포인트는 AGX 소각으로만 얻을 수 있습니다. 따라서 수익을 인출할 때마다 동일한 양의 AGX 소각이 대응되어, AGX 디플레이션을 지속적으로 뒷받침합니다.',
          },
          {
            q: '소각 비율은 얼마인가요?',
            a: '1:6 비율로 소각합니다. AGX 1개를 소각할 때마다 기여 포인트 6을 얻습니다. 소각된 AGX는 블랙홀 주소로 바로 들어가 영구히 유통에서 제외됩니다.',
          },
          {
            q: '소각된 AGX는 어디로 가나요?',
            a: '소각된 AGX는 전부 블랙홀 주소로 이전되어 영구 잠깁니다. 유통량을 직접 줄이고 디플레이션을 강화하며, 프로토콜 가치 환류 메커니즘의 일부입니다.',
          },
          {
            q: '기여 포인트를 양도하거나 환불할 수 있나요?',
            a: '할 수 없습니다. 기여 포인트는 계정에 묶여 양도·환불이 불가능합니다. 수익 수령 시에만 소모되므로, 필요한 만큼만 소각하세요.',
          },
        ],
      },
    },
    turbine: {
      title: '터빈',
      aboutTitle: '터빈 안내',
      segmentAriaLabel: '터빈 작업',
      segments: {
        unlock: '잠금 해제',
        claim: '인출',
      },
      unlockLabel: '잠금 해제',
      unlockable: '잠금 해제 가능',
      equivalentBuyHint: '잠금 해제 시 동일 금액 매수가 함께 실행됩니다',
      payUsd1Label: 'USD1 지불',
      buyAgxLabel: 'AGX 매수',
      buyToBoundWallet: '매수 후 지갑 입금',
      agxPrice: 'AGX 가격',
      slippageHint:
        '지불 USD1은 견적에 슬리피지를 더한 금액이며, 남은 금액은 환불됩니다. 완충이 부족하면 실패할 수 있고 Gas가 발생할 수 있습니다.',
      willReceiveAgx: '받게 될 AGX',
      unlockRatio: '잠금 해제 비율',
      unlockRatioValue: '1 : 1 매수로 잠금 해제',
      cooldown: '쿨다운 주기',
      cooldownHoursValue: '{hours}시간',
      unlockAction: '잠금 해제',
      unlockSuccess: '잠금 해제 성공 — 쿨다운 시작',
      claimAction: '인출',
      claimSuccess: '인출이 제출되었습니다. gAGX가 지갑으로 전송됩니다',
      claimEmpty: '잠금 해제 기록이 아직 없습니다',
      claimable: '출금 가능',
      cooling: '쿨다운 중',
      countdownLabel: '언락 카운트다운',
      cooldownDone: '쿨다운 완료',
      countdownHours: '시간',
      countdownMinutes: '분',
      dataTitle: '터빈 데이터',
      recordsTitle: '터빈 기록',
      recordsEmpty:
        '아직 터빈 기록이 없습니다. 릴리스 풀에서 리워드를 터빈으로 수령한 후 여기에 각 작업이 표시됩니다.',
      mechanismTitle: '터빈 메커니즘',
      mechanismIntro:
        '매도 유동성을 매수 수요에 묶어, 모든 잠금 해제가 동일 수량 매수와 함께하도록 합니다',
      mechanism: [
        {
          title: '1:1 매수로 잠금 해제',
          body: '릴리스 풀에서 수령한 gAGX는 터빈에서 잠긴 상태로 유지됩니다. 현재 가격으로 USD1을 사용해 같은 수량의 AGX를 매수하면 동일한 수량의 gAGX가 잠금 해제되며, 각 잠금 해제는 매수 수요의 지지를 받습니다.',
        },
        {
          title: '동적 쿨다운 메커니즘',
          body: '각 잠금 해제는 시장 상태에 따라 조정되는 24~96시간의 쿨다운에 들어갑니다. 종료 후 잠금 해제된 gAGX를 지갑으로 인출할 수 있습니다.',
        },
      ],
      metrics: {
        pendingUnlock: '잠금 해제 대기 gAGX',
        cooling: '쿨다운 중 gAGX',
        totalWithdrawn: '누적 출금',
        pendingUnlockHint: '릴리스 풀에서 터빈으로 수령했지만 아직 잠금 해제되지 않은 gAGX 총량',
        coolingHint: '매수 잠금 해제를 마치고 쿨다운 중인 gAGX 총량',
        totalWithdrawnHint: '터빈에서 지갑으로 인출한 누적 gAGX',
      },
      faq: {
        items: [
          {
            q: 'gAGX는 어떻게 터빈에 들어가나요?',
            a: '릴리스 풀에서 수령한 gAGX는 지갑으로 가지 않고, 자동으로 터빈에 들어가 잠금 상태가 됩니다(기록에는 「진입」으로 표시). USD1로 동일 수량의 AGX를 매수해 「잠금 해제」한 뒤, 쿨다운이 끝나면 「출금」하여 지갑으로 옮깁니다.',
          },
          {
            q: '잠금 해제에 매수가 필요한 이유는?',
            a: '터빈은 매도 유동성을 매수 수요에 묶습니다. gAGX 1개를 잠금 해제하려면 현재 가격으로 USD1을 써서 AGX 1개를 매수해야 합니다. 잠재적 매도마다 동일 수량 매수가 짝을 이루어, 일방적 매도 압력을 피하고 기반 풀을 지킵니다.',
          },
          {
            q: '잠금 해제와 출금의 차이는?',
            a: '잠금 해제는 현재 가격으로 USD1을 써서 동일 수량의 AGX를 매수하고, 잠긴 gAGX를 풀어 쿨다운을 시작합니다. 출금은 쿨다운(24–96시간)이 끝난 뒤, 잠금 해제된 gAGX를 지갑으로 옮깁니다. 두 단계는 터빈 기록에 「잠금 해제」와 「출금」으로 표시됩니다.',
          },
          {
            q: '쿨다운은 얼마나 걸리나요?',
            a: '잠금 해제할 때마다 24–96시간 쿨다운에 들어갑니다. 구체 시간은 시장 상태에 따라 시스템이 자동 조절합니다. 종료 후 해당 gAGX를 지갑으로 출금할 수 있습니다.',
          },
          {
            q: '잠금 해제 매수 AGX는 어디로 가나요?',
            a: '매수한 AGX는 일반 거래 매수와 같이 지갑으로 바로 들어갑니다. 대응하는 gAGX는 잠금 해제되어 쿨다운에 들어갑니다.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'AEGIS X 생태계 토큰 정보',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · 핵심 정산 자산',
          body: 'AEGIS X 생태계의 핵심 정산 자산으로, 가치 유통과 유동성 네트워크 및 결제 환경을 연결합니다.',
        },
        {
          key: 'agx',
          title: 'AGX · 핵심 프로토콜 자산',
          body: 'AGX는 AEGIS X 프로토콜의 핵심 자산으로, 150% 초과 담보 메커니즘으로 생성되며 가치 성장·수익 분배·생태계 구축에 핵심 역할을 합니다.',
        },
        {
          key: 'gagx',
          title: 'gAGX · 수익 정산 증표',
          body: 'AGX로 교환할 수 있으며 생태계 마이닝과 수익 재활용에 사용되는 프로토콜 리워드 정산 증표입니다.',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · 스테이킹 증표',
          body: 'AGX 스테이킹으로 얻는 이자 증표로, 자동 복리 수익과 함께 거버넌스 가중치·상위 칭호를 잠금 해제합니다.',
        },
        {
          key: 'x',
          title: 'X · 생태계 권익 토큰',
          body: '온체인 기여를 기록하고 권익, 이벤트 참여, 에어드롭 혜택에 사용할 수 있는 생태계 참여·권익 토큰입니다.',
        },
        {
          key: 'contribution',
          title: '기여 포인트 · 수익 수령 증빙',
          body: '수익 수령 시 기여 포인트를 {ratio}로 소모합니다. AGX를 소각하면 기여 포인트를 얻고 프로토콜 디플레이션이 강화됩니다.',
        },
        {
          key: 'turbine',
          title: '터빈 · 쿼터 잠금 해제 허브',
          body: '릴리스 대기열에서 수령한 보상은 터빈 쿼터로 들어갑니다. USD1로 같은 수량의 AGX를 매수하면 24~96시간의 쿨다운이 시작되며, 종료 후 잠금 해제된 gAGX를 지갑으로 인출할 수 있습니다.',
        },
      ],
    },
    tokenContract: '컨트랙트 보기',
    tokenPrevious: '이전 토큰',
    tokenNext: '다음 토큰',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: '거래',
          items: [
            {
              q: '거래와 플래시 교환의 차이는?',
              a: '거래는 PancakeSwap에서 USD1·AGX·X 등을 실시간 시장 환율로 교환하며, 시장 변동에 따라 슬리피지를 설정하고 gas를 지불합니다. 플래시는 프로토콜 내 gAGX↔AGX 1:1 고정 교환으로 수수료·슬리피지가 없습니다.',
            },
            {
              q: '허용 슬리피지란 무엇이며 어떻게 설정하나요?',
              a: '슬리피지는 제출부터 체결까지 가격 변화입니다. 허용 슬리피지는 수용 가능한 최대 편차로, 기본값(토큰별 자동) 또는 사용자 지정 %를 쓸 수 있습니다. 실제 슬리피지가 설정을 넘으면 거래가 실패·롤백되며 gas는 소모될 수 있습니다. 너무 낮으면 실패하기 쉽고, 너무 높으면 불리한 가격에 체결될 수 있습니다.',
            },
            {
              q: '거래는 어떻게 정산되며 수수료가 있나요?',
              a: '거래는 PancakeSwap 온체인에서 체결됩니다. AEGIS X는 추가 교환 수수료를 받지 않지만, 모든 온체인 거래에 BSC gas(BNB)가 필요하므로 지갑에 BNB를 충분히 남겨 두세요.',
            },
            {
              q: '실제 입금 수량이 예상과 다른 이유는?',
              a: '예상 수량은 호가 시점 시장 환율로 계산됩니다. 체결 시 시장 변동이나 다른 거래로 가격이 바뀔 수 있으며, 최종 입금은 허용 슬리피지 내 온체인 체결 기준입니다.',
            },
            {
              q: '어떤 토큰을 거래할 수 있나요?',
              a: 'AEGIS X 생태계 토큰(USD1, AGX, X) 간 시장 환율 교환을 지원합니다. 위 탭을 전환하면 각 토큰 상세를 볼 수 있습니다.',
            },
            {
              q: '거래 기록은 어디서 확인하나요?',
              a: '거래는 온체인에서 실행되며 체결 후 초 단위로 반영됩니다. 지갑 또는 블록체인 탐색기에서 각 거래를 확인하고 조회할 수 있습니다.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'USD1이란 무엇인가요?',
              a: 'USD1은 AEGIS X의 핵심 가치 정산 자산입니다. 현금·단기 미국 국채·정부 머니마켓 펀드 등 100% 준비 자산으로 뒷받침되며, 매월 WLFI에서 금액 분포 보고서를 확인할 수 있습니다.',
            },
            {
              q: 'USD1은 AEGIS X에서 어떤 역할을 하나요?',
              a: 'USD1은 핵심 정산 자산으로서 유동성 네트워크·결제 시나리오·생태계 가치 흐름을 연결합니다.',
            },
            {
              q: 'USD1은 어떻게 얻나요?',
              a: '교환 홈의 「USD1 획득」 입구로 PancakeSwap 시장 환율에 따라 USD1을 얻거나, 거래 페이지에서 AGX·X 등 생태계 토큰을 시장 환율로 교환할 수 있습니다.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'AGX란 무엇인가요?',
              a: 'AGX는 AEGIS X 프로토콜의 핵심 자산으로, 150% 초과 담보 메커니즘으로 발행되며 가치 성장·수익 분배·생태계 구축에 핵심 역할을 합니다.',
            },
            {
              q: 'AGX는 어떻게 지속 성장하나요?',
              a: '스테이킹·채권·Rebase로 장기 복리 순환을 만들고, AI 싱크탱크 마켓메이킹과 바이백 소각 메커니즘을 결합합니다.',
            },
            {
              q: 'AGX는 어떻게 얻나요?',
              a: '프로토콜 생태계에 참여하거나, 프로토콜이 지원하는 거래 시장에서 AGX를 획득할 수 있습니다.',
            },
            {
              q: 'AGX의 가치 지지는 어디서 오나요?',
              a: 'AGX는 150% 초과 담보 메커니즘으로 발행되며 싱크탱크 준비 자산이 뒷받침합니다. 스테이킹·채권·Rebase 복리·바이백 소각 등으로 장기 가치 순환을 형성합니다.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'gAGX란 무엇인가요?',
              a: 'gAGX는 프로토콜 리워드 정산 증표로, 수익 성장과 생태계 가치를 연결하며 생태계 마이닝에 참여할 수 있습니다.',
            },
            {
              q: 'gAGX는 어떻게 얻나요?',
              a: '사용자가 프로토콜 수익 분배에 참여하면 해당 수량의 gAGX를 받습니다.',
            },
            {
              q: 'gAGX와 AGX의 차이는 무엇인가요?',
              a: 'AGX는 프로토콜 핵심 자산으로 가치 성장과 수익 분배를 담당합니다. gAGX는 생태계 수익 증표로 AGX로 교환할 수 있으며, 생태계 마이닝 참여의 주요 진입점입니다.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'X란 무엇인가요?',
              a: 'X는 AEGIS X 생태계 가치 토큰으로, 총량 2.1억 개 고정이며 생태계 성장과 가치 축적을 담습니다.',
            },
            {
              q: 'X는 어떻게 얻나요?',
              a: '생태계 마이닝에 참여해 X 리워드를 얻고 생태계 성장 가치를 공유할 수 있습니다.',
            },
            {
              q: 'X 에어드롭은 어떻게 릴리스되나요?',
              a: 'X의 가치는 생태계 성장·가치 축적·장기 발전 합의에서 오며, 생태계 가치의 핵심 담지자입니다.',
            },
            {
              q: 'X는 왜 지속 디플레이션인가요?',
              a: 'X는 총량 2.1억 개로 고정·추가 발행이 없으며, 매도 거래마다 25%가 자동 소각됩니다. 생태계 성장에 따른 수요와 누적 소각으로 유통량이 줄어 장기 디플레이션이 형성됩니다.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: '토큰 및 컨트랙트 상세 보기',
  },
  genesis: {
    title: '공동 구축 프로그램',
    intro: 'X DAO 공동 구축 프로그램 참여 · 페이즈 {season}  ({discount} 할인)',
    introEnded:
      'X DAO 공동 구축 계획이 성공적으로 종료되었습니다 · 전 세계 공동 구축자 여러분께 감사드립니다',
    shares: '지분 (1지분 = {min} USD1 · 최대 {max} 지분)',
    quota: '이번 페이즈 공동 구축 한도',
    pay: '지불',
    receive: '획득 AGX',
    value: '구독 가치',
    xTokenAirdrop: '예상 X 초기 에어드롭 가치',
    xTokenAirdropHint:
      '페이즈 누적 공동 구축 금액 ≥ {threshold} 시 에어드롭 보상 자격이 부여됩니다.',
    join: '공동 구축 참여',
    joinEnded: '공동 구축 종료',
    joinGenesis: '창세 공동 구축 참여',
    statsTitle: '페이즈 {season} 공동 구축 데이터',
    startsIn: '시작까지',
    countdownUnits: { days: '일', hours: '시', minutes: '분' },
    endsIn: '이번 페이즈 남은 시간',
    referencePrice: 'AGX 상장 참고 가격',
    discountLabel: '할인',
    discountRatio: '이번 페이즈 할인 비율',
    xAirdropRatio: 'X 에어드롭 비율',
    airdropLabel: 'X 에어드롭 비율',
    myContributions: '내 공동 구축 기록',
    totalContributed: '이번 페이즈 공동 구축',
    cumulativeContributed: '누적 공동 구축',
    globalLabel: '글로벌 누적 공동 구축',
    globalBody: '전 세계 핵심 공동 구축자들이 함께 AEGISX 글로벌 생태계 네트워크를 구축합니다.',
    viewContract: '컨트랙트 보기',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '공동 구축 프로그램에 어떻게 참여하나요?',
          a: '사용자는 USD1로 공동 구축에 참여하며, 해당 페이즈 할인에 따라 AGX를 획득할 수 있습니다. 총 3개 페이즈이며, 할인은 30%, 25%, 20% 순입니다.',
        },
        {
          q: '공동 구축 한도와 참여 요건은?',
          a: '최소 $100, 100 USD1 단위로 참여해야 합니다. 페이즈별 한도: $100 – $10,000, $100 – $10,000, $100 – $30,000.',
        },
        {
          q: '공동 구축 기간은 얼마나 되나요?',
          a: '공동 구축으로 획득한 AGX는 540일 방출 주기를 따릅니다.',
        },
        {
          q: 'X 에어드롭 리워드는 어떻게 받나요?',
          a: '단일 계정 누적 공동 구축 금액이 $1,000에 도달하면 해당 페이즈 X 에어드롭 리워드 자격을 획득합니다. 3개 페이즈의 에어드롭 비율: 5%, 2%, 1%.',
        },
        {
          q: 'X 에어드롭 리워드는 어떻게 방출되나요?',
          a: 'X 에어드롭 리워드는 12개월 선형 방출 메커니즘을 따르며, 매월 약 8.33%가 방출됩니다. 첫 방출은 X 스테이킹 프로토콜 출시 후 30일째이며, 스마트 컨트랙트가 자동으로 실행합니다.',
        },
      ],
    },
    promoTitleTemplate: '창세 공동 구축 페이즈 {season}  {discount}할인',
    promoLive: '진행 중 — 한정 수량, {endDate} 마감',
    promoUpcoming: '곧 시작, 한정 수량, {startDate} 시작',
    promoEnded: '{status} · {date}',
    joinSuccess: '구독 완료',
    insufficientUsd1: 'USD1 잔액이 부족합니다. 충분한 USD1을 확보한 후 구독에 참여하세요.',
    insufficientAllowance: 'USD1 승인 한도가 부족합니다. 먼저 승인을 클릭하세요.',
    purchaseUnavailable: '현재 구독에 참여할 수 없습니다. 지분 또는 구독 페이즈 상태를 확인하세요.',
    walletNotConnected: '지갑 연결이 끊어졌습니다. 거래 서명을 위해 다시 연결하세요.',
    errors: {
      notBound: '참여 전에 추천인을 바인딩하세요.',
      paused: '구독이 일시 중지되었습니다. 나중에 다시 시도하세요.',
      invalidAmount: '금액은 100 USD의 배수여야 합니다.',
      phaseInactive: '이 페이즈는 시작되지 않았거나 종료되었습니다.',
      belowMin: '금액이 이 페이즈의 최소 금액보다 낮습니다.',
      soldOut: '이 페이즈는 매진되었습니다.',
      userLimitExceeded: '이 페이즈의 지갑당 한도를 초과했습니다. 금액을 줄이세요.',
      invalidPhase: '유효하지 않은 페이즈입니다.',
      systemConfig: '시스템 구성 오류입니다. 나중에 다시 시도하세요.',
    },
    contributionsSyncPending:
      '온체인 구독이 확인되었습니다. 기록 동기화 중이니 잠시 후 새로고침하세요.',
    contributionsEmpty: {
      title: '공동 구축 기록 없음',
    },
    contributionsEmptyEnded: {
      title: '공동 구축 기록 없음',
      body: '공동 구축 프로그램이 종료되었습니다. 미참여자 계정에는 기록이 없습니다.',
    },
    goBindReferrer: '추천인 연결',
    seasonLive: '진행 중',
    seasonEnded: '종료됨',
    seasonUpcoming: '곧 시작',
  },
  rewards: {
    title: '리워드',
    intro: '각종 리워드 카드 잔액과 지급 기록을 확인하세요.',
    backToHub: '리워드로 돌아가기',
    claim: '수령',
    claimSuccess: '수령 성공',
    restakeSuccess: '재예치 성공',
    claimErrors: {
      zeroAmount: '수령 금액이 0입니다.',
      invalidSigner: '서명이 유효하지 않습니다. 다시 받은 후 수령해 주세요.',
      alreadyUsed: '해당 리워드를 이미 수령했습니다. 중복 수령하지 마세요.',
      expired: '서명이 만료되었습니다. 새로고침 후 다시 수령해 주세요.',
      noOrder: '수령 가능한 리워드가 없습니다.',
      failed: '수령에 실패했습니다. 나중에 다시 시도해 주세요.',
      confirmSyncFailed:
        '리워드가 온체인에서 수령되었지만 동기화에 실패했습니다. 페이지를 새로고침하고 다시 수령하지 마세요.',
    },
    hub: {
      asideTitle: 'AEGIS X 리워드 정보',
      asideBody:
        '여섯 가지 리워드 카드가 럭키 추첨·추천·참여·공동 구축·발전 수당·제네시스 공동 구축을 다룹니다.',
      aboutTitle: 'AEGIS X 리워드 정보',
      balanceLabel: '잔액',
      filterAria: '리워드 필터',
      hideZero: '0 자산 숨기기',
      hideZeroEmpty: '0이 아닌 리워드가 없습니다',
      balancePlaceholder: '0.00',
      signInForBalance: '서명 로그인 후 보기',
      enterClaim: '수령하러 가기',
      stats: {
        totalRewards: '총 리워드',
        tier: '공동 구축 등급',
        tierEmpty: '아직 공동 구축 등급에 도달하지 않았습니다',
        personalHolding: '개인 보유',
        totalPerformance: '총 실적',
        smallAreaPerformance: '소구역 실적',
        contribution: '내 기여 포인트',
        contributionHint: '리워드 수령 시 기여를 {ratio}로 소모합니다.',
        goBurn: '소각으로 이동',
      },
      mechanismTitle: '공동 구축 리워드 메커니즘',
      mechanismBody: '공동 구축 리워드는 팀 총 Rebase 수익에서 나오며 등급 비율로 분배됩니다.',
      mechanismFooter:
        '임의 두 라인 메커니즘: 임의 두 라인이 해당 등급에 도달하면 승급합니다. A6–A9는 단일 라인으로도 승급할 수 있습니다. 한 라인이 해당 등급에 도달하고 나머지 라인 합산 실적이 기준을 충족하면 됩니다.',
      mechanismToggleAria: '승급 조건 전환',
      aboutSlides: {
        lucky: {
          title: '럭키',
          body: '일일 상금 풀은 $5,000 이상입니다. 단일 참여 $5,000 이상이면 추첨 자격이 생기며, 매일 행운 사용자 10명을 무작위로 뽑아 풀을 나눕니다.',
        },
        referral: {
          title: '추천',
          body: '직추천 파트너가 공동 구축에 참여하면, 해당 파트너의 매회 Rebase 수익의 10%를 받으며 온체인에서 즉시 정산됩니다. 본인 포지션 가치를 $100 초과로 유지해야 합니다.',
        },
        participate: {
          title: '참여',
          body: '추천 링크로 바인딩하고 공동 구축에 참여하면, 본인 보유액에 해당하는 부분의 초대인 Rebase 수익 10%를 피추천인 리워드로 받습니다.',
        },
        cobuild: {
          title: '공동 구축',
          body: '팀 전체 Rebase 수익에서 공동 구축 등급에 따른 보너스 비율로 지급됩니다(A1 10% ~ A13 130%). 등급이 높을수록 비율이 높으며, 자세한 내용은 아래 공동 구축 메커니즘 표를 보세요.',
        },
        grant: {
          title: '성장 지원금',
          body: '생태계 발전 특별 지원금, MarketFund 서명으로 수령.',
        },
        genesis: {
          title: '제네시스 공동 구축',
          body: '제네시스 기간의 직추천·등급·발전 기금 리워드; 정산 창 종료 후 더 이상 수령 불가.',
        },
      },
      tierTable: {
        columns: ['등급', '개인 보유', '유효 계정', '팀 실적', '보너스 비율'],
        rows: [
          { level: 'A1', holding: '$100', accounts: '2', team: '총 실적 ≥ $6,000', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: '총 실적 ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: '총 실적 ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$500', accounts: '5', team: '총 실적 ≥ $180,000', rate: '40%' },
          {
            level: 'A5',
            holding: '$1,000',
            accounts: '5',
            team: '총 실적 ≥ $550,000',
            rate: '55%',
          },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: '두 라인 A5 달성',
            teamAlt: '한 라인 A5 달성, 나머지 라인 실적 ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: '두 라인 A6 달성',
            teamAlt: '한 라인 A6 달성, 나머지 라인 실적 ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: '두 라인 A7 달성',
            teamAlt: '한 라인 A7 달성, 나머지 라인 실적 ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: '두 라인 A8 달성',
            teamAlt: '한 라인 A8 달성, 나머지 라인 실적 ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: '두 라인 A9 달성',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: '두 라인 A10 달성',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: '두 라인 A11 달성',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: '두 라인 A12 달성',
            rate: '130%',
          },
          {
            level: '평생 성취상',
            holding: '$100,000',
            accounts: '20',
            team: '두 라인 A13 달성',
            rate: '130% + 글로벌 배당 5%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: '럭키',
        body: '블록 럭키 추첨, 행운의 공동 구축자에게 무작위 지급',
        aside: '럭키 리워드는 Chainlink VRF로 추첨; 당첨 후 Mixed로 수령할 수 있습니다.',
      },
      referral: {
        title: '추천',
        body: '파트너를 공동 구축에 초대해 리워드 획득',
        aside:
          '직접 추천인의 Rebase 관련 리워드이며, DaoPool Mixed에서 수령합니다(기여 포인트 {ratio}).',
      },
      participate: {
        title: '참여',
        body: '추천인으로부터의 리워드',
        aside: '추천 관계에서 오는 참여 리워드; DaoPool Mixed로 수령(기여 포인트 {ratio} 소모).',
      },
      cobuild: {
        title: '공동 구축',
        body: '팀 협업과 장기 공동 구축으로 만드는 지속 가능 인센티브 리워드',
        aside: '공동 구축 리워드는 DaoPool Mixed로 수령하며 기여 포인트가 필요합니다.',
      },
      grant: {
        title: '발전 수당',
        body: '생태계 발전 특별 수당',
        aside:
          '발전 수당은 고객지원 승인으로 잠금 해제된 후 MarketFund 서명으로 수령하며 지갑으로 바로 입금됩니다.',
      },
      genesis: {
        title: '제네시스 공동 구축 리워드',
        body: '제네시스 기간의 직추천·등급·발전 기금 리워드',
        aside: '제네시스 공동 구축 리워드는 RewardClaimer 서명으로 수령합니다.',
        badge: '곧 종료',
      },
    },
    detail: {
      claimable: '수령 대기',
      emptyClaimable: '수령 가능한 리워드가 없습니다.',
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: '수령과 재예치 비율',
      releasePeriod: '릴리스 주기 선택',
      restakePeriod: '재예치 주기 선택',
      releaseAria: '릴리스 주기 선택',
      restakeAria: '재예치 주기 선택',
      releaseDays: '{days}일',
      restakeDays: '{days}일',
      daysTax: '{days}일 · {tax}',
      scheduleJoin: ', ',
      taxRate: '세율 {rate}%',
      requiredContributionLabel: '이번 수령에 차감할 기여 포인트',
      insufficientContributionDetail: '기여 포인트 부족(필요 {need}, 현재 {have}), ',
      goBurnInline: '소각으로 이동',
      getContributionSuffix: '기여 포인트 획득.',
      releaseInto: '릴리스 풀로 이동',
      restakeInto: '단일 자산 스테이킹으로 이동',
      restakeLabel: '재예치',
      tokenGagx: 'gAGX',
      ctaReleaseLine: '수령 {amount}',
      ctaRestakeLine: '재예치 {amount}',
      requiredContribution: '이번 수령에 차감할 기여 포인트 {amount}',
      insufficientContribution: '기여 포인트가 부족합니다. 먼저 기여 포인트를 획득해 주세요.',
      goBurn: '기여 포인트 획득',
      luckyPaused: '럭키 풀이 일시 중지되어 수령할 수 없습니다.',
      luckyNotClaimable: '현재 수령 가능한 럭키 리워드가 없습니다.',
    },

    lucky: {
      dataTitle: '데이터',
      todayPool: '오늘 상금 풀',
      countdownHint: '다음 추첨까지 {time}',
      eligibility: '오늘 추첨 자격',
      eligibilityYes: '획득',
      eligibilityNo: '미획득',
      maxStakeHint: '오늘 누적 구매 {amount}',
      cumulativeWins: '누적 당첨',
      winsCount: '{count}회',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Chainlink VRF v2.5 검증 가능 랜덤 추첨',
      vrfBody:
        '럭키 리워드는 Chainlink VRF v2.5(검증 가능 랜덤 함수)와 스테이킹 컨트랙트를 결합해 추첨합니다. 난수는 Chainlink 오라클이 온체인에서 생성하고 암호 증명을 붙이며, 스테이킹 컨트랙트가 난수를 받아 당일 추첨 명단에서 행운 사용자 10명을 자동 선정합니다. 전 과정에 인위 개입이 없고 결과를 위조할 수 없으며, 누구나 온체인에서 검증할 수 있습니다.',
      verifyTutorial: '검증 튜토리얼',
      collapseTutorial: '가이드 접기',
      vrfGuideStep1:
        '추첨 결과 또는 기록의 검증 해시를 클릭해 BscScan에서 해당 라운드 개찰 트랜잭션을 확인하세요.',
      vrfGuideStep2:
        '트랜잭션 Logs에서 Chainlink VRF 콜백을 찾으면, randomWords가 이번 라운드의 온체인 난수이며, 암호 증명이 예측·변조를 막습니다.',
      vrfGuideStep3:
        '스테이킹 컨트랙트의 Read Contract 페이지에서 verifyDraw를 호출하고 당일 라운드 번호를 입력하면 난수에 해당하는 당첨 명단을 재계산해 공시 결과와 대조할 수 있습니다.',
      resultsTitle: '추첨 결과',
      dateFilterAria: '추첨 날짜 선택',
      resultsSummary: '추첨 · 행운 사용자 {count}명',
      verifyHash: '이번 회차 추첨 해시 검증',
      meBadge: '나',
      resultWon: '당첨 {amount}',
      resultLost: '미당첨',
      resultsColumns: ['순위', '당첨 주소', '스테이킹', '상금'],
      emptyResults: '아직 추첨 결과가 없습니다',
      historyTitle: '추첨 기록',
      historyColumns: ['날짜', '스테이킹', '추첨 결과', '검증'],
      emptyHistory: '아직 추첨 기록이 없습니다',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '추첨 자격은 어떻게 얻나요?',
            a: '당일 첫 스테이킹 또는 채권이 $5,000 이상이면 자동으로 당일 추첨 자격을 얻으며 별도 신청이 필요 없습니다. 주소당 하루 최대 1개 자격입니다.',
          },
          {
            q: '추첨은 어떻게 개봉하나요?',
            a: '매일 00:00(UTC)에 Chainlink VRF v2.5가 온체인 검증 가능 난수를 생성하고, 스테이킹 컨트랙트가 당일 전체 자격 명단에서 행운 사용자 최대 10명을 자동 선정해 상금 풀을 나눕니다(일일 풀 목표 ≥ $5,000). 전 과정에 인위 개입이 없습니다.',
          },
          {
            q: '추첨 결과의 공정성은 어떻게 검증하나요?',
            a: 'Chainlink VRF 난수에는 암호 증명이 붙어 온체인에 기록됩니다. 누구나 검증할 수 있습니다. 매일 당첨 결과 옆의 검증 링크로 추첨 거래를 확인하고, 「검증 튜토리얼」에 따라 스테이킹 컨트랙트에서 당첨 명단을 재계산하세요. 결과는 위조할 수 없습니다.',
          },
          {
            q: '당첨 후 상금은 어떻게 지급되나요?',
            a: '상금은 추첨 시점 시가로 gAGX로 환산되어 럭키 카드에 자동 누적되며, 럭키 수령 규칙으로 수령합니다(기여 포인트 1:1 소모, 릴리스 풀 선형 릴리스 또는 재예치).',
          },
          {
            q: '왜 $5,000을 스테이킹했는데 자격이 없나요?',
            a: '자격은 정산 시점 시가 기준입니다. AGX 가격 변동으로 정산 시 스테이킹이 $5,000 미만(예: $4,999.99)으로 기록되면 당일 자격이 없습니다. 스테이킹 시 여유를 두세요.',
          },
          {
            q: '유동 스테이킹 참여로 추첨 자격을 얻을 수 있나요?',
            a: '할 수 없습니다. 유동 스테이킹은 1인당 일일 한도가 있어 단일 스테이킹이 $5,000을 넘지 않으므로, 추첨 자격 금액 조건을 충족할 수 없습니다.',
          },
        ],
      },
    },
    referral: {
      dataTitle: '데이터',
      totalRewards: '총 리워드',
      myPosition: '내 포지션',
      directCount: '직추천 내역',
      contribution: '내 기여 포인트',
      contributionHint: '수령 시 {ratio} 소모',
      nextPayout: '다음 리워드 지급',
      recordsTitle: '추천 리워드 기록',
      recordsColumns: ['시간', '수량', '상태', '수령 시간'],
      emptyRecords: '아직 리워드 기록이 없습니다. 리워드가 지급되면 여기에 각 기록이 표시됩니다.',
      referralsTitle: '내 추천 ({count})',
      referralsColumns: ['가입 시간', '주소', '포지션', '누적 기여 리워드'],
      emptyReferrals:
        '아직 직추천 파트너가 없습니다. 초대 링크를 공유하면 파트너 가입 후 여기에 표시됩니다.',
      hideZeroPosition: '0 포지션 숨기기',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '추천 리워드는 어떻게 계산되나요?',
            a: '직추천 계정의 매 Rebase 수익 10%를 받으며, 온체인 즉시 정산되어 추천 카드에 누적됩니다.',
          },
          {
            q: '참여상을 받는 조건은?',
            a: '스테이킹·채권 포지션 가치가 $100을 초과해야 합니다. 조건을 충족하면 직추천 계정의 Rebase 수익이 비율에 따라 추천 리워드로 산정됩니다.',
          },
          {
            q: '보유가 $100인데 참여 리워드를 못 받는 이유는?',
            a: 'AGX 가격은 변동합니다. 정산 시 보유가 $99.99로 기록되면 참여 리워드 조건을 더 이상 충족하지 않습니다. 보유를 늘려 가격 변동 손실을 피하세요.',
          },
          {
            q: '직추천 사용자가 나보다 훨씬 많이 보유해도 추천 리워드 전액을 받나요?',
            a: '가능합니다. 추천 리워드 조건(포지션 가치 > $100)만 충족하면 직추천 계정 매 Rebase 수익의 10% 전액을 받으며, 양측 포지션 크기 차이와 무관합니다.',
          },
          {
            q: '추천 리워드는 어떻게 수령하나요?',
            a: '왼쪽 수령 패널에서 수령과 재예치 배분을 설정하세요. 수령분은 릴리스 풀에 들어가 선택한 주기로 선형 릴리스되고, 재예치분은 단일 토큰 스테이킹으로 바로 들어가 복리됩니다. 수령과 재예치 모두 기여 포인트를 1:1로 소모합니다.',
          },
          {
            q: '직접 추천 주소 수란?',
            a: '귀하의 추천 링크로 바인딩하고 최초 참여를 완료한 지갑 주소 수입니다. 직접 추천(1계층)만 추천 리워드에 포함됩니다.',
          },
          {
            q: '추천 파트너가 종료하면 추천 리워드가 계속되나요?',
            a: '추천 리워드는 피추천인의 활성 포지션에 연동됩니다. 해당 포지션이 수익을 내는 동안 추천 리워드가 계속되며, 전량 종료 후 해당 추천 리워드는 더 이상 발생하지 않습니다. 이미 획득한 분은 영향받지 않습니다.',
          },
        ],
      },
    },
    participate: {
      dataTitle: '데이터',
      totalRewards: '총 리워드',
      myPosition: '내 포지션',
      contribution: '내 기여 포인트',
      contributionHint: '수령 시 {ratio} 소모',
      nextPayout: '다음 리워드 지급',
      recordsTitle: '참여 리워드 기록',
      recordsColumns: ['시간', '수량', '상태', '수령 시간'],
      emptyRecords: '아직 리워드 기록이 없습니다. 리워드가 지급되면 여기에 각 기록이 표시됩니다.',
      inviterTitle: '내 초대인',
      inviterColumns: ['바인딩 시간', '주소', '포지션', '누적 발생 리워드'],
      emptyInviter: '아직 초대인 바인딩 기록이 없습니다. 추천 링크로 바인딩하면 여기에 표시됩니다.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '참여 리워드는 어디서 오나요?',
            a: '초대인의 추천 링크로 바인딩하고 공동 구축에 참여하면, 피추천인으로서 추천 관계에서 오는 참여 리워드를 받으며 온체인 즉시 정산되어 참여 카드에 누적됩니다.',
          },
          {
            q: '참여 리워드는 어떻게 계산되나요?',
            a: '보유와 동일 금액 범위의 초대인 Rebase 수익 10%를 받습니다. 예: 보유 $10,000·초대인 $1,000이면 초대인 전액이 범위 안이라 전체 Rebase의 10%; 보유 $10,000·초대인 $20,000이면 $10,000 매칭분만 Rebase의 10%입니다.',
          },
          {
            q: '참여상을 받는 조건은?',
            a: '초대인의 추천 링크로 바인딩하고, 스테이킹·채권 포지션 가치를 $100 초과로 유지하세요.',
          },
          {
            q: '보유가 $100인데 참여 리워드를 못 받는 이유는?',
            a: 'AGX 가격은 변동합니다. 정산 시 보유가 $99.99로 기록되면 참여 리워드 조건을 더 이상 충족하지 않습니다. 보유를 늘려 가격 변동 손실을 피하세요.',
          },
          {
            q: '참여 리워드는 어떻게 수령하나요?',
            a: '왼쪽 수령 패널에서 수령과 재예치 비율을 선택하세요. 수령분은 선택한 주기로 릴리스 풀에서 선형 릴리스되고, 재예치분은 단일 토큰 스테이킹으로 들어갑니다. 둘 다 기여 포인트를 1:1로 소모합니다(DaoPool Mixed).',
          },
          {
            q: '초대인을 변경할 수 있나요?',
            a: '할 수 없습니다. 추천 관계는 최초 바인딩 후 온체인에 기록되며 영구 유효하여 초대인을 변경할 수 없습니다.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: '데이터',
      totalRewards: '총 리워드',
      totalPerformance: '총 실적',
      myPosition: '내 포지션',
      directCount: '직추천 내역',
      contribution: '내 기여 포인트',
      contributionHint: '수령 시 {ratio} 소모',
      nextPayout: '다음 리워드 지급',
      tierTitle: '공동 구축 등급',
      tierCurrent: '현재 등급',
      tierNext: '다음 등급',
      reqHolding: '개인 보유',
      reqHoldingHint: '스테이킹 및 채권 포지션 가치',
      reqAccounts: '유효 계정',
      reqAccountsHint: '직추천 유효 주소 수',
      reqPerformance: '총 실적',
      reqPerformanceHint: '전체 추천 체계 포지션 합계',
      reqAchieved: '달성함',
      tierRate: '보너스 비율 {rate}',
      tierProgress: '{level} 승급 조건 진행',
      tierProgressCount: '달성 {done}/{total}',
      tierMax: '최고 등급 도달',
      recordsTitle: '리워드 기록',
      recordsTabsAria: '리워드 기록 유형',
      recordsTabCobuild: '공동 구축',
      recordsTabEqualize: '등급 균형 보상',
      recordsColumns: ['시간', '등급', '수량', '상태', '수령 시간'],
      emptyRecordsCobuild:
        '아직 리워드 기록이 없습니다. 리워드가 지급되면 여기에 각 기록이 표시됩니다.',
      emptyRecordsEqualize: '아직 등급 균형 보상 기록이 없습니다. 지급 후 여기에 표시됩니다.',
      teamTitle: '내 팀（{count}）',
      teamColumns: ['가입 시간', '주소', '팀 실적', '팀 최고 등급'],
      emptyTeam: '아직 팀 멤버가 없습니다. 초대 링크를 공유하면 파트너 가입 후 여기에 표시됩니다.',
      hideZeroMarket: '0 실적 숨기기',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '공동 구축 리워드는 어떻게 계산되나요?',
            a: '공동 구축 리워드는 팀 총 Rebase 수익에서 나오며, 공동 구축 등급의 보너스 비율로 산정됩니다. 등급이 높을수록 비율이 높습니다(A1 10% ~ A13 130%). 리워드 홈의 공동 구축 메커니즘 표를 참고하세요.',
          },
          {
            q: '등급 균형 보상이란 무엇인가요?',
            a: '하위 팀의 등급이 귀하와 같거나 높아지면 해당 팀의 공동 구축 리워드는 더 이상 귀하의 차등 수익에 포함되지 않습니다. 이를 보완하기 위해 해당 하위 팀 공동 구축 리워드의 10%를 등급 균형 보상으로 받습니다.',
          },
          {
            q: '등급 균형 보상에 등급 제한이 있나요?',
            a: '있습니다. 등급 균형 보상은 귀하보다 최대 2등급 이내의 하위 팀만 포함합니다. 예를 들어 A2일 때 하위가 A3/A4이면 해당 공동 구축 리워드의 10%를 받지만, A5 이상이면 범위를 벗어나 보상을 받지 못합니다. 본인 등급을 올리면 적용 범위가 갱신됩니다.',
          },
          {
            q: '공동 구축 등급은 어떻게 올리나요?',
            a: 'A1–A5는 개인 보유·유효 계정·팀 총 실적으로 승급합니다. A6부터는 쌍라인 메커니즘(임의 두 라인이 해당 등급)이며, A6–A9는 단일 라인(임의 단일 라인 달성 + 기타 라인 총 실적)으로도 승급할 수 있습니다.',
          },
          {
            q: '팀 실적은 어떻게 집계되나요?',
            a: '팀 실적은 전체 추천 체계(각 라인)의 스테이킹·채권 포지션 가치 합계이며, 정산 시점 시장가로 계산됩니다.',
          },
          {
            q: '공동 구축 보상과 등급 균형 보상은 어떻게 수령하나요?',
            a: '왼쪽 수령 패널 상단에서 공동 구축 / 등급 균형 보상을 전환한 뒤, 수령과 재예치 배분을 설정하세요. 수령분은 릴리스 풀에 들어가 선택한 주기로 선형 릴리스되고, 재예치분은 단일 토큰 스테이킹으로 바로 들어가 복리됩니다. 둘 다 기여 포인트를 1:1로 소모합니다.',
          },
          {
            q: '등급 변경 후 보너스 비율은 언제 적용되나요?',
            a: '등급은 일일 정산 시 재평가됩니다. 새 등급 도달 후 다음 공동 구축 리워드 지급부터 새 보너스 비율이 적용되며, 등급 균형 보상의 적용 범위도 새 등급에 맞춰 갱신됩니다.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: '승인 대기',
      pendingHint: '승인 후 수령 가능으로 전환',
      pendingBody:
        '받은 수당은 고객지원에 잠금 해제를 신청해야 하며, 승인 후에만 수령할 수 있습니다.',
      contactSupport: '고객지원에 잠금 해제 신청',
      claimIntoWallet: '지갑으로',
      ctaToWallet: '{amount}을(를) 지갑으로 수령',
      dataTitle: '데이터',
      tier: '공동 구축 등급',
      totalClaimed: '누적 수령 리워드',
      recordsTitle: '수당 기록',
      recordsTabsAria: '수당 기록 유형',
      recordsTabIssue: '지급',
      recordsTabClaim: '수령',
      issueColumns: ['지급 시간', '수량', '유형', '해시', '수당 비율', '수당 수량'],
      claimColumns: ['수령 시간', '수량', '해시'],
      emptyIssue: '아직 지급 기록이 없습니다. 수당이 누적되면 여기에 표시됩니다.',
      emptyClaim: '아직 수령 기록이 없습니다. 수령 완료 후 여기에 표시됩니다.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '발전 수당이란 무엇인가요?',
            a: '공동 구축자의 시장 개척을 지원하는 생태계 특별 경비로, 시장 홍보·커뮤니티 행사·채널 구축 등 생태계 발전에 쓰이며 팀 스테이킹 포지션에 비례해 누적됩니다.',
          },
          {
            q: '발전 수당은 어디에 쓸 수 있나요?',
            a: '시장 개발 전용입니다. 오프라인 살롱·로드쇼, 커뮤니티 운영·홍보 자료, 채널 확장 등 생태계 발전의 실제 필요에 맞게 사용하세요.',
          },
          {
            q: '발전 수당은 어떻게 사용하나요?',
            a: '두 가지 방법입니다. 사전 신청: 고객지원에 시장 개발 계획과 예산을 제출하고 승인 후 해당 한도가 수령 가능으로 전환됩니다. 사후 환급: 비용을 먼저 지출한 뒤 증빙(영수증·현장 사진·지출 내역 등)으로 고객지원에 환급을 신청하고, 심사 통과 후 수령합니다.',
          },
          {
            q: '수당이 승인 대기로 표시되는 이유는?',
            a: '수당이 누적되면 기본이 승인 대기이며, 용도 신청 또는 환급 증빙을 제출해 고객지원이 승인한 뒤에야 수령 가능으로 전환됩니다. 승인 진행은 수당 기록에서 확인할 수 있습니다.',
          },
          {
            q: '수당 수령 시 기여 포인트를 소모하나요?',
            a: '필요하지 않습니다. 발전 수당은 다른 리워드와 달리 수령 시 기여 포인트를 소모하지 않고 릴리스 풀을 거치지 않으며, gAGX가 지갑으로 바로 입금됩니다.',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: '공동 구축 리워드',
      pageSubtitle: '공동 구축에 참여 · 성장 가치 공유',
      claimToWallet: '지갑으로 수령',
      tierColumns: ['등급', '개인 청약', '체계 실적', '리워드 비율'],
      recordsTabsAria: '제네시스 리워드 기록 유형',
      recordsColumns: ['시간', '유형', '수량', '상태'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '추천 리워드는 어떻게 계산되나요?',
            a: '추천 리워드는 3%이며, 압축 동일 금액 정산으로 동일 금액분만 계산하고 빈 계정은 리워드 계층에 넣지 않으며 자동 정산됩니다.',
          },
          {
            q: '제네시스 등급은 어떻게 승급하나요?',
            a: '제네시스 등급은 S1부터 S10까지이며, 개인 공동 구축 금액과 체계 총 실적으로 평가됩니다. 상위 등급은 쌍라인 승급 조건도 충족해야 합니다.',
          },
          {
            q: '등급 향상 리워드란?',
            a: '공동 구축 기간에 도달한 제네시스 등급은 프로토콜 출시 후 자동으로 1등급 올라가며, 30일간 유효합니다. 이후 실제 등급으로 돌아갑니다.',
          },
          {
            q: '제네시스 팀 리워드는 어떻게 정산되나요?',
            a: '제네시스 팀 리워드는 해당 제네시스 등급 비율로 자동 정산되며, 직접 지갑으로 수령해야 합니다. 공동 구축 기간이 끝나면 이 페이지는 닫히고, 미수령 리워드는 더 이상 수령할 수 없으며 스마트 마켓메이킹 컨트랙트로 보내집니다.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: '리워드는 어떤 형태로 지급되나요?',
          a: '모든 리워드는 gAGX로 정산되며, 각 프로그램 규칙에 따라 해당 리워드 카드로 입금됩니다. 잔액은 언제든 리워드 허브에서 확인할 수 있습니다.',
        },
        {
          q: '리워드 수령에 필요한 조건은?',
          a: '수령 시 기여 포인트를 1:1로 소모합니다(gAGX 1 수령 시 1포인트 소모). 포인트는 AGX를 소각해 얻으며, 부족하면 먼저 소각 페이지에서 확보하세요.',
        },
        {
          q: '수령한 리워드는 언제 입금되나요?',
          a: '수령할 때 릴리스 주기를 고릅니다. 리워드는 릴리스 풀에 들어가 선형 릴리스되며, 주기가 길수록 세율이 낮습니다. 일부 또는 전부를 단일 토큰 스테이킹에 재예치해 복리할 수도 있습니다.',
        },
        {
          q: '리워드는 언제 정산되나요?',
          a: '럭키 추첨은 매일 00:00(UTC)에 정산됩니다. 그 외 리워드는 Rebase를 따르며, 약 12시간마다 같은 주기로 정산됩니다. 다음 지급 시각은 각 리워드 상세의 데이터 패널에서 확인할 수 있습니다.',
        },
        {
          q: '일부 리워드 카드에 금액이 표시되지 않는 이유는?',
          a: '오른쪽 위 설정은 기본적으로 「0 자산 숨기기」가 켜져 있어 잔액 0인 카드가 숨겨집니다. 체크를 해제하면 모든 리워드 카드가 보입니다.',
        },
      ],
    },

    teamRewardRate: '팀 보상 {rate}',
    superCommunityBadge: '슈퍼 체계',
    heroTierRewardBody: '팀 공동 구축 금액의 {bonus}를 리워드로 받습니다.',
    superCommunityBenefitBody: '슈퍼 체계는 체계 발전 전용 기금과 거버넌스 권익을 받습니다.',
    shareholderNoRankTitle: '아직 창세 준비금 이사가 아닙니다',
    shareholderNoRankBody:
      '창세 준비금 이사가 되면 팀 공동 구축 금액의 1%-10%를 리워드로 받을 수 있으며, AEGIS X 출시 후 30일 이내 1단계 승급됩니다.',
    shareholderTitleForRank: '{rank} · 창세 준비금 이사',
    heroKicker: '창세 등급',
    currentTierSuffix: '현재',
    progressPersonalTo: '{rank}까지 · 개인 구독',
    progressMaxPersonal: '최고 개인 등급 달성',
    progressMaxTeam: '최고 팀 등급 달성',
    teamLegRequirement: '{rank} 라인 2개',
    tierDualLegRequirement: '{rank} 라인 2개',
    teamQualifiedPartitionsLabel: '{rank} 라인 {count}/2',
    teamVolume: '조직 실적',
    referralRewards: '직접 추천 리워드',
    autoPaidLabel: '자동 지급',
    autoPaid: '리워드가 지갑으로 자동 정산됩니다',
    teamRewards: '등급 리워드',
    heroTitle: '현재 등급',
    allTiers: '창세 명예 체계',
    history: '리워드 기록',
    referralHistoryEmpty: {
      title: '추천 리워드 기록 없음',
      body: '피추천인이 Genesis 기간에 구독을 완료하면 추천 리워드가 여기에 표시됩니다.',
    },
    teamHistoryEmpty: {
      title: '팀 리워드 기록 없음',
      body: '팀 리워드 정산 및 수령 기록은 리워드가 발생한 후 여기에 표시됩니다.',
    },
    communityFund: '발전 기금',
    communityFundLocked: '잠금: {amount}',
    communityFundHistory: '발전 기금',
    communityFundHistoryEmpty: {
      title: '발전 기금 기록 없음',
      body: '발전 기금 수령 기록은 리워드가 발생한 후 여기에 표시됩니다.',
    },
    rewardType: {
      referralPaid: '추천 리워드',
      referralWithdrawn: '추천 리워드 수령',
      marketTeam: '마켓메이킹 팀 리워드',
      presaleTeam: '프리세일 팀 리워드',
      unknown: '—',
    },
    logStatus: {
      pending: '수령 대기',
      processing: '처리 중',
      paid: '지불 완료',
      claimed: '수령 완료',
      failed: '실패',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: '이미 추천인을 바인딩했습니다.',
      parentNotBound: '추천인이 아직 바인딩하지 않았습니다. 연락하세요.',
      selfReferral: '본인 주소는 사용할 수 없습니다.',
      invalidParent: '유효한 추천인 주소를 입력하세요.',
      migratedAccount: '이 주소는 이전되었습니다. 새 주소를 사용하세요.',
      systemConfig: '시스템 구성 오류입니다. 나중에 다시 시도하세요.',
      failed: '바인딩에 실패했습니다. 나중에 다시 시도하세요.',
    },
    title: '커뮤니티',
    intro:
      '파트너를 초대하여 공동 구축에 참여하고, 생태계 성장 가치와 창세 리워드를 함께 누리세요.',
    disconnectedIntro: '지갑을 연결하여 추천 링크를 생성하고 초대인을 연결하세요.',
    referralLink: '내 초대 링크',
    shareReferral: '링크 복사',
    referrer: '내 초대인',
    bindReferrer: '연결',
    referrerPlaceholder: '추천인 주소 입력 (0x…)',
    referrerHint: '초대 관계 활성화 후 영구적으로 유효하며 변경할 수 없습니다.',
    docs: '자료',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: '공동 구축 참여',
    myCommunity: '내 커뮤니티',
    directReferrals: '직접 추천 인원',
    myTeam: '커뮤니티 인원',
    genesisTitle: '현재',
    cobuildLevel: '공동 구축 등급',
    makingLevel: '마켓 메이킹 등급',
    inviteTitle: '초대 시작 · 생태계 성장 가치 공유',
    programs: {
      title: '생태계 지원 프로그램',
      items: [
        {
          label: 'X DAO 공동 구축 · 페이즈 {season}',
          title: '글로벌 공동 구축 계획 진행 중',
          body: '전 세계 공동 구축자를 모아 생태계 건설에 함께 참여합니다.',
          action: '프로그램 상세 보기 →',
          href: 'https://xdaoaegis.notion.site/genesis-reserve-council-program-kr',
        },
        {
          label: 'X 아카데미',
          title: '공동 구축자를 위한 생태계 교육 프로그램',
          body: '공동 구축자가 생태계 메커니즘과 발전 계획을 더 깊이 이해하도록 돕습니다.',
          action: '프로그램 상세 보기 →',
          href: 'https://xdaoaegis.notion.site/x-kr',
        },
      ],
    },
    myInvites: '내 직추천 멤버 ({count})',
    referralBondPermanent: '추천 관계 활성화 · 연결은 영구적입니다.',
    volumePrefix: '실적',
    statToday: '오늘 +{count} · +{amount}',
    statRewardRate: '보상 비율 {rate}',
    bindReferrerSuccess: '추천인 연결 완료',
    inviteFlow: {
      rewardLink: '리워드',
      items: [
        {
          title: '초대 링크 공유',
          body: '지갑을 연결하고 초대인을 입력하면 전용 초대 링크를 생성할 수 있습니다.',
        },
        {
          title: '파트너 공동 구축 참여',
          body: '파트너가 초대 링크로 등록하면 공동 구축에 참여할 수 있습니다.',
        },
        {
          title: '리워드 획득',
          body: '파트너가 공동 구축에 참여하면 리워드는 rebase 수익 지급과 함께 정산됩니다. {link} 메뉴에서 수령하세요.',
        },
      ],
    },
    invitesEmpty: {
      title: '초대 기록 없음',
      body: '추천 링크를 공유하여 친구를 커뮤니티에 초대하세요.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '추천 관계는 어떻게 성립하나요?',
          a: '파트너가 초대 링크를 통해 공동 구축에 참여하면 추천 관계가 자동으로 성립되며 영구적으로 유효합니다.',
        },
        {
          q: '창세 추천 보상은 어떻게 계산되나요?',
          a: '창세 추천 보상은 3%이며, 압축 동등 금액 정산을 사용해 동등 금액 부분만 계산합니다.',
        },
        {
          q: '창세 등급을 어떻게 올리나요?',
          a: '개인 공동 구축 금액과 체계 실적 달성에 따라 S1에서 S10까지 단계적으로 승급합니다.',
        },
        {
          q: '체계 발전 수당 자격은 어떻게 얻나요?',
          a: '체계 누적 실적이 $1,000,000에 도달하면 5% 발전 기금을 받을 수 있습니다. 신청은 초대인에게 도움을 요청하세요.',
        },
      ],
    },
  },
  assets: {
    title: '자산',
    intro: 'AEGIS X 생태계 자금을 관리하세요',
    body: 'AEGIS X 생태계 자금을 관리하세요',
    backToHub: '자산으로 돌아가기',
    blocked: {
      zeroAmount: '유효한 수량을 입력해 주세요',
      insufficientReward: '수령 가능 수익 부족',
      insufficientContribution: '기여 포인트가 부족합니다. 먼저 기여 포인트로 교환해 주세요',
      planUnresolved: '릴리스/재예치 계획이 준비되지 않았습니다. 나중에 다시 시도해 주세요',
      nothingToRedeem: '현재 상환 가능 한도가 없습니다',
      warmupActive: '워밍업이 끝나지 않아 아직 조작할 수 없습니다',
      warmupNotEnded: '워밍업 카운트다운이 아직 끝나지 않았습니다',
      noWarmup: '현재 활성화할 워밍업 포지션이 없습니다',
      unavailable: '거래를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요',
    },
    position: {
      sort: '정렬',
      quoteCurrency: '호가 단위',
      sortOptions: {
        startNear: '시작 시간 · 최신순',
        startFar: '시작 시간 · 오래된순',
        endNear: '만료 · 임박순',
        endFar: '만료 · 최신순',
      },
      emptyTitle: '자산으로 수익을 시작하세요',
      pageSize: 5,
      voucher: '증표',
      remaining: '남은 시간',
      staked: '스테이킹 수량',
      payout: '상환 대기',
      bondPrincipal: '채권 원금',
      yield: '수익',
      claim: '수령',
      redeem: '상환',
      unstake: '언스테이크',
      liquid: '유동',
      lockedPrefix: '잠금',
      redeemAnytime: '언제든 상환 가능',
      fullyReleased: '전액 해제됨',
      activateWarmup: '잠금 해제',
      activateWarmupSuccess: '잠금 해제됨',
      warmupRemainingEpochs: '남은 Epoch {n}개',
    },
    opsColumns: ['시간', '작업', '수량', '거래 해시'],
    claim: {
      title: '수익 수령',
      amount: '수령 수량',
      splitAria: '릴리스와 재예치 비율',
      releasePeriod: '릴리스 주기 선택',
      releasePeriodAria: '릴리스 주기 선택',
      restakePeriod: '재예치 주기 선택',
      restakePeriodAria: '재예치 주기 선택',
      releaseDays: '{days}일',
      restakeDays: '{days}일',
      restakeDaysTax: '{days}일 · {tax}',
      taxRate: '세율 {rate}%',
      contribNeed: '이번 수령에 차감할 기여 포인트 {amount}',
      contribShort: '기여 포인트가 부족합니다. 먼저 소각으로 기여 포인트를 교환해 주세요',
      goBurn: '소각 교환으로 이동',
      ctaMixed: '재예치 & 수령',
      ctaRelease: '수령',
      ctaRestake: '재예치',
      success: '수령 제출됨',
      restakeSuccess: '재예치를 제출했습니다',
      xmineSuccess: 'X 리워드 수령 제출됨',
    },
    claimOutput: {
      title: '산출 수령',
      rewardLabel: '수익',
      boostLabel: '보너스',
      claimReward: '수익 수령',
      claimBoost: '보너스 수령',
      contribDeduct: '기여 포인트 {amount} 차감',
    },
    redeem: {
      releasedLabel: '릴리스됨',
      title: '스테이킹 상환',
      body: '상환 후 자산은 버퍼로 들어가 {days}일 동안 선형 릴리스됩니다. 버퍼 자산은 수익을 내지 않습니다',
      confirmCta: '상환',
      success: '상환이 제출되었습니다. 원금이 릴리스 버퍼로 들어갔습니다',
    },
    hub: {
      filterAria: '자산 필터',
      hideZero: '0 자산 숨기기',
      hideZeroEmpty: '0이 아닌 포지션이 없습니다',
      card: {
        position: '포지션',
        yield: '수익 합계',
      },
      modes: {
        stake: {
          title: '스테이킹',
          body: 'AGX 유동/정기 포지션 관리',
          aprHint: '수령한 스테이킹 수익과 미수령 스테이킹 수익·가산 수익 합계가 차지하는 비율',
        },
        lpbond: {
          title: 'LP 채권',
          body: '유동성 채권 포지션 관리',
          aprHint: '수령한 LP 채권 수익과 미수령 LP 채권 수익 합계가 차지하는 비율',
        },
        burnbond: {
          title: '소각 채권',
          body: '소각 채권 포지션 관리',
          aprHint: '수령한 소각 채권 수익과 미수령 소각 채권 수익 합계가 차지하는 비율',
        },
        xmine: {
          title: 'X 마이닝',
          body: 'gAGX 마이닝 포지션 관리',
          aprHint: '수령한 마이닝 산출과 미수령 마이닝 산출 합계가 차지하는 비율',
        },
      },
      overview: {
        title: '자산 개요',
        totalValue: '총 자산 가치',
        totalValueHint: '현재 시장가로 평가 · 보유 원금과 미출금 수익 포함',
        claimable: '수령 가능 수익',
        claimed: '누적 수령액',
        contribution: '내 기여 포인트',
        contributionHint: '수익 수령 시 기여를 {ratio}로 소모',
        holdingsTitle: '보유',
        holdingsReleased: '릴리스됨',
        holdingsTotal: '총 보유',
        bufferTitle: '버퍼 풀',
        bufferHint:
          '원금 언스테이킹 후 버퍼 풀에서 {days}일 이차 선형 릴리스가 진행되어 단기 집중 유출이 시장 유동성에 주는 충격을 줄이고, 자금 방출의 연속성과 시장 안정성의 균형을 맞춥니다.',
        bufferTotal: '볼트 보관 중',
        bufferReleased: '릴리스됨',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: '버퍼 풀 자산 표시 전환',
      },
      distribution: {
        title: '보유 분포',
        empty: '아직 보유가 없습니다. 스테이킹 또는 채권 구매 후 여기에 보유 분포가 표시됩니다.',
      },
      rebase: {
        title: 'Rebase 수익 릴리스 메커니즘',
        subtitle: '단계별 정산과 지속 릴리스로 시장 변동을 줄이고 장기 성장 안정성을 높입니다',
        steps: [
          { title: 'Block', body: '블록 실행\\n기본 단위' },
          { title: 'Epoch', body: '약 {blocks} 블록\\n약 {hours}시간' },
          { title: 'Rebase', body: 'Epoch 종료\\n자동 정산' },
          { title: 'Rebase', body: '수익 분배\\n하루 {timesPerDay}회' },
        ],
        tags: ['블록 구동 실행', 'Epoch 구동 정산', 'Rebase 구동 분배', '수익 평활 릴리스'],
        footer: '블록으로 주기를 구동하고, Epoch로 정산하며, Rebase로 수익을 분배합니다',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '총 자산 가치는 어떻게 계산되나요?',
            a: '총 자산 가치 = 포지션 원금 + 미수령 수익 + 마이닝 산출이며, 모두 현재 시장가로 평가합니다. 지갑의 유휴 잔액은 포함하지 않습니다. 가격 변동은 평가액에 실시간으로 반영됩니다.',
          },
          {
            q: '수익은 어떤 형태로 지급되나요?',
            a: '스테이킹, LP 채권, 소각 채권의 Rebase 수익은 gAGX로 정산됩니다. gAGX는 1:1로 AGX로 상환하거나 X 마이닝에 쓸 수 있습니다. X 마이닝 산출은 생태계 가치 토큰 X이며, 언제든 수령할 수 있습니다.',
          },
          {
            q: '수익을 수령할 수 없는 이유는?',
            a: '수익 수령에는 기여 포인트를 소모합니다. 계정 기여 포인트가 부족하면 수령할 수 없습니다. 먼저 AGX를 구매·소각해 기여 포인트를 얻은 뒤 자산 페이지로 돌아오세요. 기여 포인트 메커니즘은 수익을 인출할 때마다 프로토콜 디플레이션에도 기여하도록 합니다.',
          },
          {
            q: '기여 포인트는 어떻게 얻나요?',
            a: 'AGX를 구매·소각하면 기여 포인트를 얻습니다. 수익 수령 시 1:1로 소모되므로(gAGX 1 수령 시 기여 포인트 1 소모), 수령할 수익에 맞춰 미리 충분히 준비하세요.',
          },
          {
            q: '수익 수령 시 릴리스 주기를 고르는 이유는?',
            a: '수령한 수익은 즉시 입금되지 않고, 선택한 주기로 선형 릴리스됩니다. 주기가 길수록 세율이 낮습니다: 5일 20%, 20일 10%, 40일 5%, 60일 1%.',
          },
          {
            q: '수익 수령 후 어디로 가나요?',
            a: '수령한 수익은 지갑으로 바로 가지 않고 릴리스 풀에 들어가, 선택한 주기로 선형 릴리스됩니다. 릴리스 풀에서 각 수령의 진행을 확인할 수 있으며, 릴리스된 분은 지갑으로 출금할 수 있습니다.',
          },
          {
            q: '수익 재예치와 수령의 차이는?',
            a: '재예치는 릴리스 주기를 건너뛰고 수익이 단일 토큰 스테이킹으로 바로 들어가 복리를 이어갑니다. 세율도 더 유리하며(360일 15%, 540일 10%), 장기 참여자에게 맞습니다. 수령은 릴리스 주기에 걸쳐 지갑으로 입금되어 더 유연합니다.',
          },
          {
            q: '버퍼 풀이란?',
            a: '원금을 언스테이크하면 버퍼 풀에 들어가 30일 2차 선형 릴리스로 단기 집중 유출을 줄입니다. 버퍼의 「릴리스됨」 분은 언제든 지갑으로 상환할 수 있습니다.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: '스테이킹 포지션',
        intro: '각 스테이킹을 관리하세요 — 언제든 수익 수령 또는 원금 상환',
        empty:
          '아직 스테이킹 포지션이 없습니다. 스테이킹을 완료하면 각 포지션이 여기에 표시됩니다.',
        emptyCta: '첫 스테이킹을 시작하고 수익 받기',
        stats: {
          title: '포지션 데이터',
          metrics: [
            { label: '내 보유' },
            { label: '릴리스됨' },
            { label: '릴리스 대기' },
            {
              label: '현재 Rebase 수익률',
              hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
            },
            {
              label: '현재 Rebase 가산',
              hint: '미수령 Rebase 보너스는 복리를 만들지 않습니다',
            },
            {
              label: '스테이킹 총 수익',
              hint: '수령한 스테이킹 수익과 미수령 스테이킹 수익의 합',
            },
          ],
        },
        ops: {
          title: '활동 기록',
          empty: '아직 활동 기록이 없습니다. 스테이킹·수령·상환 후 여기에 각 작업이 표시됩니다.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '수령과 상환의 차이는?',
              a: '수령은 수익용: 누적된 gAGX를 선택한 릴리스 주기로 받거나 재예치합니다. 상환은 원금용: 릴리스된 AGX 원금을 꺼내 30일 버퍼에서 2차 선형 릴리스한 뒤 지갑으로 들어갑니다.',
            },
            {
              q: '왜 스테이킹마다 따로 표시되나요?',
              a: '각 스테이킹은 주기·수익·가산·릴리스 진행을 독립적으로 추적합니다. 만기와 실행 가능 작업이 다른 포지션에 영향을 주지 않으므로, 따로 표시하고 조작합니다.',
            },
            {
              q: '「릴리스됨」이란 무엇인가요?',
              a: '원금은 블록 단위로 선형 잠금 해제됩니다(약 3초/블록). 「릴리스됨」은 이미 잠금 해제되어 언제든 상환할 수 있는 부분입니다. 나머지는 주기에 따라 계속 릴리스됩니다.',
            },
            {
              q: '카운트다운이 끝나면 어떻게 되나요?',
              a: '카운트다운이 끝나면 원금 릴리스가 모두 끝나며, 원금 전액을 언제든 상환할 수 있습니다. 미상환 원금은 계속 수익을 냅니다. 원금을 상환한 뒤에도 미수령 수익은 소멸하지 않고 복리가 이어집니다.',
            },
            {
              q: '수령 시 재예치 비율은 어떻게 쓰나요?',
              a: '슬라이더로 재예치와 수령 배분을 정합니다. 재예치분은 선택한 주기 단일 토큰 스테이킹으로 바로 들어가 복리를 이어갑니다(세율이 더 유리). 수령분은 선택한 릴리스 주기로 선형 입금됩니다.',
            },
          ],
        },
      },
      lpbond: {
        title: 'LP 채권 포지션',
        intro: '각 채권을 관리하세요 — 언제든 수익 수령 또는 원금 상환',
        empty: '아직 LP 채권 포지션이 없습니다. 채권을 구매하면 여기에 각 포지션이 표시됩니다.',
        emptyCta: '첫 LP 채권을 구매하고 수익을 시작하세요',
        stats: {
          title: '포지션 데이터',
          metrics: [
            { label: '내 보유' },
            { label: '릴리스됨' },
            { label: '릴리스 대기' },
            {
              label: '현재 Rebase 수익률',
              hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
            },
            {
              label: 'LP 채권 총 수익',
              hint: '수령한 LP 채권 수익과 미수령 LP 채권 수익의 합',
            },
          ],
        },
        ops: {
          title: '활동 기록',
          empty: '아직 활동 기록이 없습니다. 스테이킹·수령·상환 후 여기에 각 작업이 표시됩니다.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '수령과 상환의 차이는?',
              a: '수령은 수익용: 채권에서 생긴 gAGX 수익을 선택한 릴리스 주기로 수령하거나 바로 재예치합니다. 상환은 원금용: 릴리스된 AGX 원금을 꺼내 30일 버퍼에서 2차 선형 릴리스 후 지갑에 입금됩니다.',
            },
            {
              q: '「채권 원금」은 어디서 오나요?',
              a: 'LP 채권 구매 시 지불한 USD1이 할인가로 AGX로 환산되며, 그것이 해당 채권의 원금입니다. 원금은 선택한 주기(180/360/540일) 블록 선형으로 릴리스되며, 「릴리스됨」 분은 언제든 상환할 수 있습니다.',
            },
            {
              q: '왜 채권마다 따로 표시되나요?',
              a: '각 채권은 주기·할인·수익·베스팅을 독립 계산하므로 만기와 실행 가능 작업이 서로 영향을 주지 않아 포지션별로 표시·조작합니다.',
            },
            {
              q: '채권 수익을 재예치할 수 있나요?',
              a: '가능합니다. 수령 시 슬라이더로 재예치와 수령 비율을 나눕니다. 재예치분은 선택한 주기(360/540일) 단일 자산 스테이킹으로 들어가 계속 복리되며, 세율이 주기 수령보다 유리합니다.',
            },
            {
              q: '카운트다운이 끝나면 어떻게 되나요?',
              a: '카운트다운 종료는 원금 릴리스가 모두 끝났다는 뜻이며, 이때 원금 전액을 언제든 상환할 수 있습니다. 미수령 수익은 소멸하지 않고 복리 수익이 계속 발생합니다.',
            },
            {
              q: 'LP 채권의 LP를 회수할 수 있나요?',
              a: '할 수 없습니다. 시스템이 구성한 AGX/USD1 LP는 블랙홀 주소로 영구 잠금되어 프로토콜의 영구 기반 유동성이 됩니다. 여러분은 할인 가격으로 발행된 AGX 원금과 그 지속 수익을 받습니다.',
            },
          ],
        },
      },
      burnbond: {
        title: '소각 채권 포지션',
        intro: '각 채권을 관리하세요 — 언제든 수익 수령 또는 원금 상환',
        empty: '아직 소각 채권 포지션이 없습니다. 채권을 구매하면 여기에 각 포지션이 표시됩니다.',
        emptyCta: '첫 소각 채권을 구매하고 수익을 시작하세요',
        stats: {
          title: '포지션 데이터',
          metrics: [
            { label: '내 보유' },
            { label: '릴리스됨' },
            { label: '릴리스 대기' },
            {
              label: '현재 Rebase 수익률',
              hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
            },
            {
              label: '소각 채권 총 수익',
              hint: '수령한 소각 채권 수익과 미수령 소각 채권 수익의 합',
            },
          ],
        },
        ops: {
          title: '활동 기록',
          empty: '아직 활동 기록이 없습니다. 스테이킹·수령·상환 후 여기에 각 작업이 표시됩니다.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '수령과 상환의 차이는?',
              a: '수령은 수익용: 채권에서 생긴 gAGX 수익을 선택한 릴리스 주기로 수령하거나 바로 재예치합니다. 상환은 원금용: 릴리스된 AGX 원금을 꺼내 30일 버퍼에서 2차 선형 릴리스 후 지갑에 입금됩니다.',
            },
            {
              q: '「채권 원금」은 어디서 오나요?',
              a: '소각 채권 구매 시 지불한 USD1이 할인가로 AGX로 환산되며, 그것이 해당 채권의 원금입니다. 원금은 선택한 주기(180/360/540일) 블록 선형으로 릴리스되며, 「릴리스됨」 분은 언제든 상환할 수 있습니다.',
            },
            {
              q: '왜 채권마다 따로 표시되나요?',
              a: '각 채권은 주기·할인·수익·베스팅을 독립 계산하므로 만기와 실행 가능 작업이 서로 영향을 주지 않아 포지션별로 표시·조작합니다.',
            },
            {
              q: '채권 수익을 재예치할 수 있나요?',
              a: '가능합니다. 수령 시 슬라이더로 재예치와 수령 비율을 나눕니다. 재예치분은 선택한 주기(360/540일) 단일 자산 스테이킹으로 들어가 계속 복리되며, 세율이 주기 수령보다 유리합니다.',
            },
            {
              q: '카운트다운이 끝나면 어떻게 되나요?',
              a: '카운트다운 종료는 원금 릴리스가 모두 끝났다는 뜻이며, 이때 원금 전액을 언제든 상환할 수 있습니다. 미수령 수익은 소멸하지 않고 복리 수익이 계속 발생합니다.',
            },
            {
              q: '소각 채권이 AGX에 미치는 영향은?',
              a: '소각 채권 구매 자금은 AGX를 자동 매수해 블랙홀 주소로 영구 소각하여 유통량을 줄이고 디플레이션을 강화합니다. 할인과 수익을 얻는 동시에 프로토콜 가치 성장에도 기여합니다.',
            },
          ],
        },
      },
      xmine: {
        title: 'X 마이닝 포지션',
        intro: '각 마이닝 스테이킹을 관리하세요 — 언제든 산출 수령 또는 원금 상환',
        empty:
          '아직 X 마이닝 포지션이 없습니다. gAGX를 스테이킹해 마이닝을 시작하면 여기에 각 포지션이 표시됩니다.',
        emptyCta: 'gAGX를 스테이킹하고 X 마이닝을 시작하세요',
        periodPill: '마이닝 스테이킹',
        output: '산출',
        stats: {
          title: '포지션 데이터',
          metrics: [
            { label: '내 마이닝 스테이킹' },
            { label: '릴리스됨' },
            { label: '현재 마이닝 산출' },
            {
              label: '마이닝 총 산출',
              hint: '수령한 채굴 산출과 미수령 채굴 산출의 합',
            },
          ],
        },
        ops: {
          title: '활동 기록',
          empty: '아직 활동 기록이 없습니다. 스테이킹·수령·상환 후 여기에 각 작업이 표시됩니다.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '산출 수령과 스테이킹 상환의 차이는?',
              a: '수령은 마이닝 산출용: X 리워드는 언제든 수령·릴리스 주기 없이 지갑으로 바로 입금됩니다. 상환은 스테이킹 원금용: gAGX 상환 후 버퍼에서 30일 2차 선형 릴리스되며, 버퍼 자산은 더 이상 수익을 내지 않습니다.',
            },
            {
              q: '일부 포지션이 「잠금」으로 표시되는 이유는?',
              a: 'gAGX 스테이킹마다 24시간 잠금에 들어가며 잠금 중에는 상환할 수 없습니다. 카운트다운 후 「언제든 상환 가능」이 표시되면 상환을 시작할 수 있습니다.',
            },
            {
              q: '마이닝 산출은 어떻게 계산되나요?',
              a: '매일 UTC 0에 금본위로 정산합니다. 스테이킹 gAGX의 달러 가치 × 당일 수익률을 X로 환산해 지급하며, 산출 수량은 AGX·X 가격에 따라 변합니다.',
            },
            {
              q: '마이닝 산출이 복리되나요?',
              a: '자동 복리되지 않습니다. X 산출은 수동 수령해야 하며, 마이닝 포지션을 키우려면 새로 얻은 gAGX를 추가 스테이킹하세요(스테이킹 상한 적용).',
            },
            {
              q: '스테이킹 상한이 바뀌는 이유는?',
              a: 'gAGX 스테이킹 상한은 계정의 ≥180일 AGX 채권 보유와 AGX 스테이킹 합계를 넘을 수 없습니다. 채권·장기 스테이킹을 늘리면 상한이 오르고, 보유가 만기·릴리스되면 상한이 내려갑니다.',
            },
            {
              q: '상환 후에도 산출을 계속 받을 수 있나요?',
              a: '없습니다. 상환한 gAGX는 버퍼에 들어가는 순간부터 마이닝 산출이 중단됩니다. 미상환 포지션은 영향받지 않고 정상 산출을 계속합니다.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: '스테이킹',
    intro: '스테이킹과 채권으로 공동 구축 — Rebase 복리 성장 공유',
    body: '스테이킹과 채권으로 공동 구축 — Rebase 복리 성장 공유',
    backToHub: '스테이킹으로 돌아가기',
    max: '최대',
    blocked: {
      notBound: '먼저 추천 관계를 바인딩해 주세요',
      accountMigrated: '해당 주소는 이전되었습니다 — 새 주소로 조작해 주세요',
      migrationNotOpen: '계정 이전이 아직 열려 있지 않습니다',
      insufficientBalance:
        '지갑 잔액이 부족합니다. 수량을 줄이거나 먼저 입금한 뒤 다시 시도해 주세요',
      insufficientGagx:
        'gAGX 잔액이 부족합니다: 먼저 플래시에서 AGX를 gAGX로 래핑한 뒤 다시 시도해 주세요',
      insufficientAllowance: '승인 부족',
      insufficientQuota: '스테이킹 가능 한도를 초과했습니다. 수량을 줄인 뒤 다시 시도해 주세요',
      insufficientQuotaWithAmount:
        '스테이킹 가능 한도를 초과했습니다: 현재 최대 {quota} AGX까지 더 스테이킹할 수 있습니다. 수량을 줄인 뒤 다시 시도해 주세요.',
      insufficientQuotaPersonalWithAmount:
        '본인 스테이킹 가능 한도를 초과했습니다: 개인 누적 한도가 {quota} AGX 남았습니다. 수량을 줄인 뒤 다시 시도해 주세요.',
      insufficientQuotaPersonalDailyWithAmount:
        '오늘 스테이킹 가능 한도를 초과했습니다: 오늘 개인 한도가 {quota} AGX 남았습니다. 수량을 줄이거나 한도가 갱신될 때까지 기다려 주세요.',
      insufficientQuotaPoolWithAmount:
        '온체인 스테이킹 풀 한도가 부족합니다: 풀에 현재 {quota} AGX가 남아 있습니다. 수량을 줄이거나 나중에 다시 시도해 주세요.',
      insufficientXmineQuotaWithAmount:
        '채굴 한도를 초과했습니다: 채굴 한도는 잠긴 원금으로 정해지며, 현재 최대 {quota} gAGX까지 더 스테이킹할 수 있습니다. 수량을 줄이거나 먼저 잠금 포지션을 늘린 뒤 다시 시도해 주세요.',
      poolPaused: '해당 스테이킹 풀이 일시적으로 닫혀 있습니다. 나중에 다시 시도해 주세요',
      depositoryNotAuth:
        '해당 채권 시장이 아직 구매 개방되지 않았습니다. 다른 주기를 선택하거나 나중에 다시 시도해 주세요',
      insufficientDebtCapacity:
        '해당 채권 시장의 잔여 판매 한도가 부족합니다. 구매 금액을 줄이거나 나중에 다시 시도해 주세요',
      bondTooSmall:
        '구매 금액이 너무 작습니다: 할인 후 상환액이 최소 요건에 미달합니다. 구매 금액을 늘린 뒤 다시 시도해 주세요',
      bondTooLarge:
        '구매 금액이 너무 큽니다: 해당 채권의 1회 상환 한도를 초과합니다. 구매 금액을 줄인 뒤 다시 시도해 주세요',
      zeroAmount: '유효한 수량을 입력해 주세요',
      unavailable: '거래를 일시적으로 사용할 수 없습니다. 나중에 다시 시도해 주세요',
    },
    hub: {
      modes: {
        stake: {
          title: '스테이킹',
          body: 'AGX 스테이킹 — 하루 {timesPerDay}회 Rebase 복리 성장',
        },
        lpbond: {
          title: 'LP 채권',
          body: 'USD1로 기반 풀을 공동 구축하고 할인으로 AGX 획득',
        },
        burnbond: {
          title: '소각 채권',
          body: '할인 발행 AGX를 영구 소각하여 디플레이션 강화',
        },
        xmine: {
          title: 'X 마이닝',
          body: 'gAGX를 스테이킹해 손실 없이 X 생태계 리워드를 채굴하세요',
        },
        calc: {
          title: '수익 계산기',
          body: '주기와 가격별 예상 수익을 산출하세요',
        },
      },
      overview: {
        title: '개요',
        metrics: [
          {
            id: 'tvl',
            label: '스테이킹 총량 TVL',
            hint: '프로토콜 내 스테이킹된 AGX 총량과 약산 달러 가치',
          },
          {
            id: 'mcap',
            label: '총 시가총액',
            hint: '유통 AGX에 해당하는 총 가치',
          },
          {
            id: 'circulating',
            label: 'AGX 유통량',
            hint: '시장에서 유통 중인 AGX 수량',
          },
          {
            id: 'treasury',
            label: '싱크탱크 준비금',
            hint: '싱크탱크 준비 자산은 담보 발행·스마트 마켓메이킹·리스크 방어를 지원합니다',
          },
          {
            id: 'price',
            label: 'AGX 가격',
            hint: 'AGX의 USD1 대비 시장 참고가',
          },
          {
            id: 'burned',
            label: '총 소각량',
            hint: '소각 채권 구매와 기여 포인트 구매로 소각된 AGX 총량',
          },
          {
            id: 'rebase',
            label: '현재 Rebase 수익률',
            hint: 'Epoch마다(약 {hours}시간) 한 번 정산되며 프로토콜 상태에 따라 동적으로 조절됩니다',
          },
          {
            id: 'runway',
            label: '런웨이',
            hint: '현재 싱크탱크 준비금과 프로토콜 지출로 추정한 지속 가능 운영 주기',
          },
          {
            id: 'stakers',
            label: '스테이킹 주소 수',
            hint: '전역에서 스테이킹에 참여한 주소 총수',
          },
        ],
      },
      periodTable: {
        title: '스테이킹 주기와 수익',
        segmentAria: '주기표 제품 전환',
        segs: {
          stake: '스테이킹',
          lpbond: 'LP 채권',
          burnbond: '소각 채권',
        },
        columns: ['산출 주기', '기본 수익률(일)', '수익률 가산', '주기 수익률'],
        bondColumns: ['산출 주기', '기본 수익률(일)', '할인율', '주기 수익률'],
        rows: [
          { id: 'liquid', period: '유동(기한)' },
          { id: '180', period: '180일' },
          { id: '360', period: '360일' },
          { id: '540', period: '540일' },
        ],
      },
      runwayDays: '> {days}일',
      chart: {
        title: '데이터 지표',
        metricTabs: {
          tvl: '스테이킹 총량 TVL',
          mcap: '총 시가총액',
        },
        metricAria: '데이터 지표 전환',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Rebase는 어떻게 정산되나요?',
            a: '프로토콜은 블록 기반으로 실행됩니다. 약 14,400 블록 = 1 Epoch(약 12시간). 각 Epoch 종료 시 Rebase 정산이 실행되며, 시스템은 하루 2회 수익을 분배합니다.',
          },
          {
            q: '원금은 어떻게 릴리스되나요?',
            a: '스테이킹·채권 원금은 블록 단위 선형 릴리스(약 3초/블록)입니다. 출금 후 릴리스된 원금은 30일 버퍼 릴리스로 들어가, 이중 선형 릴리스로 자금 연속성과 시장 안정성을 맞춥니다.',
          },
          {
            q: '스테이킹·LP 채권·소각 채권의 차이는?',
            a: '스테이킹은 AGX를 예치해 Rebase 복리 수익을 얻습니다. LP·소각 채권은 USD1로 할인 AGX를 얻습니다 — LP는 영구 기반 유동성을 만들고, 소각은 AGX를 영구 소각해 디플레이션을 강화합니다. 셋 모두 주기 블록 선형으로 원금을 릴리스하며 Rebase 수익을 받습니다.',
          },
          {
            q: '수익은 어떤 형태로 지급되나요?',
            a: '각 섹션의 Rebase 수익은 gAGX로 통일 정산됩니다. gAGX는 언제든 1:1로 AGX 교환하거나 X 마이닝에 스테이킹해 생태계 가치 토큰 X를 얻을 수 있습니다.',
          },
          {
            q: '싱크탱크 준비금의 역할은?',
            a: '싱크탱크 준비금(USD1)은 프로토콜의 가치 지지입니다. 150% 초과 담보 AGX 발행, AI 스마트 마켓메이킹, 시장 리스크 방어에 쓰입니다. 「운영 가능 주기」는 현재 준비금과 지출로 추정한 지속 가능 운영 시간입니다.',
          },
          {
            q: '나에게 맞는 참여 방식은 어떻게 고르나요?',
            a: '안정 복리를 원하면 스테이킹, 할인 AGX를 원하면 LP 채권 또는 소각 채권, gAGX로 생태계 업사이드를 원하면 X 마이닝을 선택하세요. 먼저 수익 계산기로 제품·주기별 예상 수익을 비교해 보세요.',
          },
          {
            q: '총 시가총액과 AGX 유통량은 어떻게 이해하나요?',
            a: 'AGX 유통량은 시장에서 유통 중인 AGX 수량이며, 총 시가총액 = 유통량 × 현재 가격입니다. 총 스테이킹량·총 소각량과 함께 프로토콜의 락업률과 디플레이션 진행을 관찰할 수 있습니다.',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: '시간', minutes: '분', seconds: '초' },
      overview: '개요',
      positions: '내 포지션',
      positionsHint: '포지션 수령·상환·언스테이크는 자산 탭에서 진행하세요.',
      viewPositions: '보기',
      mechanism: '메커니즘 설명',
      faq: '자주 묻는 질문',
      recordsTitles: {
        stake: '내 스테이킹 기록',
        lpbond: '채권 구매 기록',
        burnbond: '채권 구매 기록',
        xmine: '내 마이닝 기록',
      },
      recordColumns: ['시간', '산출 주기', '수량', '릴리스됨', '거래 해시'],
      bondRecordColumns: ['시간', '산출 주기', '지불', '할인', '획득 AGX', '거래 해시'],
      xmineRecordColumns: ['시간', '작업', '수량', '거래 해시'],
      recordsEmpty: {
        stake: '아직 스테이킹 기록이 없습니다. 스테이킹을 완료하면 여기에 각 건이 표시됩니다.',
        lpbond: '아직 구매 기록이 없습니다. LP 채권을 구매하면 여기에 각 구매가 표시됩니다.',
        burnbond: '아직 구매 기록이 없습니다. 소각 채권을 구매하면 여기에 각 구매가 표시됩니다.',
        xmine:
          '아직 마이닝 기록이 없습니다. gAGX를 스테이킹해 마이닝을 시작하면 여기에 각 작업이 표시됩니다.',
      },
      recordsFooter: {
        stake: '누적 스테이킹 {amount} AGX',
        bond: '누적 구매 {amount}',
        xmine: '누적 스테이킹 {amount} gAGX',
      },
      chartTitles: {
        stake: 'TVL(스테이킹) 데이터 지표',
        lpbond: 'TVL(LP 채권) 데이터 지표',
        burnbond: 'TVL(소각 채권) 데이터 지표',
        xmine: 'TVL(X 마이닝) 데이터 지표',
      },
      chartRangeAria: '차트 시간 범위',
      chartRanges: ['1주', '1개월', '1년', '전체'],
      chartEmpty: '아직 과거 데이터가 없습니다',
      positionMetrics: [
        { label: '내 포지션' },
        { label: '릴리스됨' },
        { label: '릴리스 대기' },
        {
          label: '현재 Rebase 수익률',
          hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
        },
        {
          label: '현재 Rebase 가산',
          hint: '미수령 Rebase 보너스는 복리를 만들지 않습니다',
        },
      ],
      xValue: {
        title: 'X 장기 가치 시스템',
        supplyLabel: 'X 총 발행량',
        supplyValue: '210,000,000',
        badge: '고정 총량 · 추가 발행 없음',
        columns: [
          {
            pct: '47.62%',
            title: 'LP 유동성 구축',
            bullets: ['초기 유동성 구축', '시장 메이킹 및 유동성 지원'],
          },
          {
            pct: '52.38%',
            title: '글로벌 리워드와 성장',
            bullets: [
              'gAGX 마이닝 리워드',
              '시장 확장 및 브랜드 파트너십',
              '생태계 구축 및 장기 성장',
            ],
          },
        ],
        sourcesKicker: '가치 원천',
        sourcesHeadline: '세 겹의 수요가 겹친다',
        sourcesBadge: 'X 수요를 지속 강화',
        sources: [
          { title: 'gAGX 수요', copy: '스테이킹 마이닝으로 X 수요 창출' },
          { title: '수익 환류', copy: '프로토콜 수익이 생태계로 지속 환류' },
          { title: '생태계 성장', copy: '앱 확장과 사용자 증가가 수요를 견인' },
        ],
        deflationKicker: 'X 디플레이션',
        deflationHeadline: '지속 디플레이션',
        deflationBadge: '수량 감소 · 가치 상승',
        deflationSteps: [
          { title: '생태계 성장', copy: '생태계가 지속 발전' },
          { title: 'X 수요 증가', copy: '앱과 거래가 수요를 끌어올림' },
          { title: '시장 유통', copy: 'X가 시장에서 유통·사용' },
          { title: '매도세 25% 소각', copy: '매도마다 자동으로 25% 소각' },
        ],
        featuresKicker: 'X 핵심 특성',
        featuresHeadline: '장기 가치의 기반',
        featuresBadge: '희소 · 디플레 · 유동 · 확장',
        features: [
          { title: '고정 총량', copy: '총량 고정, 희소 가치' },
          { title: '지속 디플레이션', copy: '소각 메커니즘이 가치 상승' },
          { title: '유동성 지지', copy: '유동성이 시장을 안정' },
          { title: '생태계 확장', copy: '앱 확장이 가치 축적' },
        ],
      },
    },

    stake: {
      title: '스테이킹',
      intro: 'AGX 스테이킹 · 하루 {timesPerDay}회 Rebase 복리 성장',
      periodLabel: '스테이킹 주기 선택',
      periodAria: '스테이킹 주기 선택',
      amountAria: '스테이킹 수량',
      amountBalance: '수량(지갑 잔액 {balance} AGX)',
      quotaInline: '스테이킹 한도: {quota} AGX',
      submit: '스테이킹',
      bindCta: '추천 바인딩으로 이동',
      success: '스테이킹 성공',
      periods: {
        liquid: '유동',
        d180: '180일',
        d360: '360일',
        d540: '540일',
      },
      meta: {
        baseDaily: '기본 수익률(일)',
        periodYield: '주기 수익률',
        bonus: '수익률 가산',
        lock: '잠금 일수',
        remaining: '잔여 한도',
        contract: '컨트랙트 보기',
        lockLiquid: '유동',
        lockDays: '{days}일 선형 릴리스',
      },
      overviewMetrics: [
        { label: '총 스테이킹량' },
        {
          label: '현재 Epoch',
          hint: '각 Epoch는 약 {hours}시간({blocks}블록)이며, 스테이킹 수익은 Epoch마다 정산됩니다',
        },
        { label: '다음 Rebase 지급' },
        {
          label: '현재 Rebase 수익률',
          hint: 'Epoch마다(약 {hours}시간) 한 번 정산되며 프로토콜 상태에 따라 동적으로 조절됩니다',
        },
      ],
      mechanismTitle: '스테이킹 운영 메커니즘',
      mechanism:
        '유동 스테이킹은 warmup 후 활성화가 필요합니다. 정기 스테이킹은 선택한 풀에 잠깁니다. 리워드 수령과 원금 종료는 자산 페이지에서 합니다.',
      mechanismSteps: [
        {
          title: 'AGX 스테이크',
          body: '유동 또는 180/360/540일 잠금을 선택하세요. 긴 잠금일수록 더 높은 Rebase 가산을 받습니다.',
        },
        {
          title: '일일 Rebase 수익',
          body: 'Epoch마다(약 {hours}시간) 자동 정산되며 수익은 gAGX로 복리 누적됩니다.',
        },
        {
          title: '만기 릴리스와 수령',
          body: '원금은 블록 단위로 선형 릴리스되며, gAGX는 1:1로 AGX 교환 또는 계속 스테이킹해 X를 채굴할 수 있습니다.',
        },
      ],
      faq: [
        {
          q: '스테이킹 수익은 어떻게 계산되나요?',
          a: '하루 2회 Rebase, 일 수익 약 0.5%–1%. 주기가 길수록 가산이 큽니다: 180일 ≥10%, 360일 ≥15%, 540일 ≥20%, Rebase 계수와 연동됩니다.',
        },
        {
          q: '스테이킹 원금은 언제 출금할 수 있나요?',
          a: '원금은 블록 선형으로 릴리스됩니다(약 3초/블록). 릴리스된 분은 언제든 출금할 수 있으며, 출금 후 30일 버퍼 릴리스로 들어갑니다.',
        },
        {
          q: '참고 APY는 고정인가요?',
          a: '아닙니다. APY는 참고값이며, 실제 수익은 Rebase 계수·프로토콜 상태·시장 수급에 따라 달라집니다.',
        },
        {
          q: 'Rebase 수익과 Rebase 가산의 차이는?',
          a: 'Rebase 수익은 기본 수익률 부분으로, 미수령 시 매 블록 보상과 함께 복리 누적됩니다. Rebase 가산은 장기 스테이킹 추가분으로, 미수령 시 복리되지 않으니 제때 수령하세요.',
        },
        {
          q: '수익은 어떤 형태로 지급되나요?',
          a: '스테이킹 리워드는 gAGX로 지급됩니다. 언제든 1:1로 AGX 교환하거나, X 마이닝에 gAGX를 스테이킹해 X를 얻을 수 있습니다.',
        },
        {
          q: '만기 전에 조기 종료할 수 있나요?',
          a: '조기 종료는 지원하지 않습니다. 원금은 선택한 주기 블록 선형으로 릴리스되며, 릴리스된 분만 출금할 수 있습니다. 자금 계획에 맞는 주기를 고르세요.',
        },
        {
          q: '유동 스테이킹에는 어떤 제한이 있나요?',
          a: '유동 스테이킹은 수익률 가산이 없고, 일일 전역·계정당 한도 제한이 있으며 한도는 매일 정해진 시간에 초기됩니다(선착순).',
        },
        {
          q: '한 계정에 여러 스테이킹이 가능한가요?',
          a: '가능합니다. 각 스테이킹은 주기·수익·릴리스 진행을 독립 계산하며 「내 스테이킹 기록」에서 각각 확인할 수 있습니다.',
        },
      ],
    },
    lpbond: {
      title: 'LP 채권',
      intro: 'USD1로 기반 풀을 공동 구축하고 할인으로 AGX 획득',
      periodLabel: '채권 주기 선택',
      periodAria: 'LP 채권 주기',
      amountAria: '구매 수량',
      amountBalance: '수량(지갑 잔액 {balance} USD1)',
      submit: '구매',
      success: '구매 성공',
      footnote: '시스템이 AGX/USD1 LP를 자동 구축해 블랙홀로 소각하여 영구 기반 유동성을 만듭니다.',
      card: {
        yield: '주기 수익률',
        discountRange: '할인 구간',
        sold: '판매됨',
        currentDiscount: '현재 할인',
        discountPrice: '할인가',
      },
      meta: {
        discount: '할인가({pct}%)',
        pay: '지불',
        receive: 'AGX 획득',
        cap: '최대 구매량',
        release: '원금 릴리스',
        releaseLinear: '{days}일 블록 선형 릴리스',
        contract: '컨트랙트 보기',
      },
      overviewMetrics: [
        { label: 'LP 채권 총 스테이킹량' },
        {
          label: '채권 프리미엄율',
          hint: '현재 할인가가 AGX 시장가 대비 갖는 수익 여지',
        },
        { label: '다음 Rebase 지급' },
        {
          label: '현재 Rebase 수익률',
          hint: 'Epoch마다(약 {hours}시간) 한 번 정산되며 프로토콜 상태에 따라 동적으로 조절됩니다',
        },
      ],
      positionMetrics: [
        { label: '내 보유량' },
        { label: '수령' },
        { label: '릴리스 대기' },
        {
          label: '현재 Rebase 수익',
          hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
        },
      ],
      mechanismTitle: 'LP 채권 운영 메커니즘',
      mechanism:
        'BondHelper로 USD1 zap 후 해당 주기 BondDepository로 들어갑니다. 상환과 수익은 자산 페이지에서 합니다.',
      mechanismSteps: [
        {
          title: 'LP 채권 구매',
          body: 'USD1로 기반 풀 공동 구축에 참여하고 할인으로 AGX를 발행합니다.',
        },
        {
          title: 'LP 자동 구축',
          body: '시스템 컨트랙트가 AGX/USD1 유동성을 자동 구축합니다.',
        },
        {
          title: '블랙홀 영구 잠금',
          body: 'LP Token은 블랙홀 주소로 이전되어 영구히 분해할 수 없습니다.',
        },
      ],
      faq: [
        {
          q: 'LP 채권이란 무엇인가요?',
          a: 'USD1로 기반 풀 공동 구축에 참여하면 시스템 컨트랙트가 자동으로 할인 AGX 발행, AGX/USD1 LP 구축, 블랙홀(Blackhole Lock) 소각까지 완료해 영구 제거 불가 기반 유동성을 만듭니다.',
        },
        {
          q: '할인은 어떻게 정해지나요?',
          a: 'Dynamic Bond Control이 수급에 따라 조절합니다: 180일 85%–100%, 360일 80%–100%, 540일 75%–100% — 주기가 길수록 할인이 유리합니다.',
        },
        {
          q: 'LP 채권 구매 후 LP Token을 보유하나요?',
          a: '아닙니다. LP Token은 시스템 컨트랙트가 구축한 뒤 블랙홀로 바로 소각되어 프로토콜의 영구 제거 불가 기반 유동성이 되며, 개인 보유가 아닙니다. 실제로 받는 것은 할인 발행 AGX이며, 선택한 채권 주기 블록 선형으로 릴리스됩니다.',
        },
        {
          q: '채권 프리미엄율이란?',
          a: '프리미엄율은 현재 할인가와 AGX 시장가의 차이를 반영합니다. 프리미엄이 양수이면 채권으로 AGX를 얻는 편이 현물 매수보다 유리합니다.',
        },
        {
          q: '조기 상환할 수 있나요?',
          a: '조기 상환은 지원하지 않습니다. 원금은 선택한 주기 블록 선형으로 릴리스되며, 릴리스된 분은 언제든 수령할 수 있습니다. 자금 계획에 맞는 채권 주기를 고르세요.',
        },
        {
          q: '내가 지불한 USD1은 어디로 가나요?',
          a: '지불한 USD1과 시스템이 할인 발행한 AGX가 함께 AGX/USD1 LP를 구성하고, LP Token은 블랙홀 주소로 소각되어 프로토콜의 영구 제거 불가 기반 유동성이 됩니다.',
        },
      ],
    },
    burnbond: {
      title: '소각 채권',
      intro: '할인 발행 AGX를 영구 소각하여 디플레이션 강화',
      periodLabel: '채권 주기 선택',
      periodAria: '소각 채권 주기',
      amountAria: '구매 수량',
      amountBalance: '수량(지갑 잔액 {balance} USD1)',
      submit: '구매',
      success: '구매 성공',
      footnote: '시스템이 할인 비율로 AGX를 발행해 자동 매수 후 블랙홀로 영구 소각합니다.',
      card: {
        yield: '주기 수익률',
        discountRange: '할인 구간',
        sold: '판매됨',
        currentDiscount: '현재 할인',
        discountPrice: '할인가',
      },
      meta: {
        discount: '할인가({pct}%)',
        pay: '지불',
        receive: 'AGX 획득',
        cap: '최대 구매량',
        release: '원금 릴리스',
        releaseLinear: '{days}일 블록 선형 릴리스',
        contract: '컨트랙트 보기',
      },
      overviewMetrics: [
        { label: '소각 채권 총 스테이킹량' },
        {
          label: '채권 프리미엄율',
          hint: '현재 할인가가 AGX 시장가 대비 갖는 수익 여지',
        },
        { label: '다음 Rebase 지급' },
        {
          label: '현재 Rebase 수익률',
          hint: 'Epoch마다(약 {hours}시간) 한 번 정산되며 프로토콜 상태에 따라 동적으로 조절됩니다',
        },
      ],
      positionMetrics: [
        { label: '내 보유량' },
        { label: '릴리스됨' },
        { label: '릴리스 대기' },
        {
          label: '현재 Rebase 수익',
          hint: '미수령 Rebase 수익은 매 블록 보상과 함께 복리로 계속 쌓입니다',
        },
      ],
      mechanismTitle: '소각 채권 운영 메커니즘',
      mechanism:
        'BondHelper로 USD1 zap 후 해당 주기 BurnBondDepository로 들어갑니다. 상환과 수익은 자산 페이지에서 합니다.',
      mechanismSteps: [
        {
          title: 'USD1 지불',
          body: '릴리스 주기를 고르고 현재 할인으로 소각 채권에 참여하세요.',
        },
        {
          title: '할인 발행 AGX',
          body: '시스템이 해당 할인 비율로 AGX를 발행합니다.',
        },
        {
          title: '매수 후 영구 소각',
          body: 'AGX를 자동 매수해 블랙홀로 소각하여 디플레이션을 강화합니다.',
        },
      ],
      faq: [
        {
          q: '소각 채권이란 무엇인가요?',
          a: 'USD1로 소각 채권에 참여하면 시스템 컨트랙트가 자동으로 해당 할인 비율로 AGX를 발행하고, AGX를 자동 매수해 영구 소각(Blackhole Lock)하여 유통량을 줄이고 장기 가치 지지를 강화합니다.',
        },
        {
          q: 'LP 채권과 무엇이 다른가요?',
          a: 'LP 채권은 영구 기반 유동성을 만들고, 소각 채권은 유통량을 직접 디플레이션합니다. 할인 구간은 같습니다(주기별 75%–100% 동적). 원금은 둘 다 주기 블록 선형으로 릴리스됩니다.',
        },
        {
          q: '채권 프리미엄율이란?',
          a: '프리미엄율은 현재 할인가와 AGX 시장가의 차이를 반영합니다. 프리미엄이 양수이면 채권으로 AGX를 얻는 편이 현물 매수보다 유리합니다.',
        },
        {
          q: '조기 상환할 수 있나요?',
          a: '조기 상환은 지원하지 않습니다. 원금은 선택한 주기 블록 선형으로 릴리스되며, 릴리스된 분은 언제든 수령할 수 있습니다. 자금 계획에 맞는 채권 주기를 고르세요.',
        },
        {
          q: '내가 지불한 USD1은 어디로 가나요?',
          a: '지불한 USD1은 싱크탱크 준비 자산으로 들어가 담보 발행·스마트 마켓메이킹·리스크 방어에 사용됩니다. 시스템은 동시에 해당 할인으로 AGX를 발행해 자동 매수 후 블랙홀로 영구 소각합니다.',
        },
      ],
    },
    xmine: {
      title: 'X 마이닝',
      intro: 'gAGX를 스테이킹해 손실 없이 X 생태계 리워드를 채굴하세요',
      amountAria: '스테이킹 gAGX 수량',
      amountBalance: '수량(지갑 잔액 {balance} gAGX)',
      quotaInline: '스테이킹 한도: {quota} gAGX',
      submit: '스테이킹',
      success: '스테이킹 성공',
      openKlineChart: 'K선 차트 보기',
      meta: {
        quota: '스테이킹 한도',
        daily: '수익률(일)',
        max: '최대 스테이킹량',
        maxHint:
          'gAGX 스테이킹 한도는 ≥180일 AGX 채권 보유량과 AGX 스테이킹 합계를 넘을 수 없습니다',
        lock: '잠금 일수',
        lockValue: '24시간 후 릴리스',
        h24: '24h',
        contract: '컨트랙트 보기',
      },
      overviewMetrics: [
        { label: 'X 마이닝 총 스테이킹량' },
        { label: 'X 가격' },
        { label: '누적 마이닝 산출' },
        {
          label: '당일 수익률',
          hint: '프로토콜 수익률과 전역 스테이킹량에 따라 동적으로 배분되며 매일 조절됩니다',
        },
        {
          label: '다음 마이닝 산출',
          hint: 'X 채굴 수익은 매일 UTC 0시에 산출됩니다',
        },
      ],
      positionMetrics: [
        { label: '내 마이닝 스테이킹' },
        { label: '릴리스됨' },
        { label: '마이닝 산출' },
      ],
      mechanismTitle: 'X 마이닝 운영 메커니즘',
      mechanism:
        'miningQuotaOf로 한도를 검증한 뒤 stakeGagxForMining을 실행합니다. X 수령과 언스테이크는 자산 페이지에서 하며, 이 페이지에서는 warmup 취소를 제공하지 않습니다.',
      mechanismSteps: [
        {
          title: 'Rebase + DAO 리워드',
          body: '수익은 gAGX로 통일 정산됩니다.',
        },
        { title: 'gAGX 스테이크', body: '스테이킹 후 24시간 잠금 상태가 됩니다.' },
        {
          title: 'X 동적 배분',
          body: '시스템이 프로토콜 수익률에 따라 X 리워드를 동적으로 배분합니다.',
        },
        {
          title: '언스테이크 선형 릴리스',
          body: '잠금 해제 후 gAGX는 약 30일 블록 선형으로 릴리스됩니다.',
        },
      ],
      faq: [
        {
          q: 'X 마이닝은 어떻게 참여하나요?',
          a: 'gAGX를 스테이킹하면 X 생태계 무손실 마이닝에 참여합니다. 스테이킹 후 gAGX는 24시간 잠금되며, 시스템이 프로토콜 수익률에 따라 X 리워드를 동적으로 배분합니다.',
        },
        {
          q: '스테이킹 상한은 얼마인가요?',
          a: 'gAGX 스테이킹 상한은 계정의 ≥180일 AGX 채권 보유와 AGX 스테이킹 합계를 넘을 수 없습니다.',
        },
        {
          q: '언스테이크 후 자산은 어떻게 릴리스되나요?',
          a: '잠금 해제 후 gAGX는 30일 블록 선형 릴리스로, 언스테이크 후 집중 매도 압력을 줄이고 장기 가치 캡처를 강화합니다.',
        },
        {
          q: 'X 총량은 얼마인가요? 추가 발행되나요?',
          a: 'X 총 발행량은 2.1억 개로 고정되며 추가 발행되지 않습니다. 47.62%는 LP 유동성(초기 풀, 마켓메이킹, 유동성 지원), 52.38%는 글로벌 리워드와 성장(gAGX 마이닝 리워드, 시장 확장과 브랜드 협력, 생태계와 장기 발전)에 쓰입니다.',
        },
        {
          q: 'gAGX는 어떻게 얻나요?',
          a: 'gAGX는 Rebase와 DAO 리워드의 통합 정산 증표입니다. AGX 스테이킹 또는 채권의 Rebase 수익, 그리고 각종 DAO 리워드는 모두 gAGX로 지급됩니다. gAGX는 X 생태계로 들어가는 유일한 진입점입니다.',
        },
        {
          q: 'gAGX는 마이닝 외에 무엇을 할 수 있나요?',
          a: 'gAGX는 언제든 1:1로 AGX로 상환해 스테이킹 복리를 이어갈 수 있고, gAGX를 스테이킹해 X를 채굴할 수도 있습니다. 두 경로를 자유롭게 선택할 수 있습니다.',
        },
        {
          q: 'X는 왜 지속 디플레이션인가요?',
          a: 'X는 매도할 때마다 25%가 소각됩니다. 생태계 성장이 수요와 회전을 끌어올리면 소각이 누적되고 X 유통량은 줄어, 「공급이 줄고 가치가 오르는」 장기 디플레이션 순환이 형성됩니다.',
        },
        {
          q: 'X의 가치 원천은?',
          a: '수요는 세 층입니다. gAGX 마이닝의 X 수요, 프로토콜 수익의 생태계 환류, 앱 확장과 사용자 성장. 이 셋이 겹치며 X 수요를 계속 강화합니다.',
        },
        {
          q: '스테이킹 상한이 채권/장기 스테이킹 보유와 연동되는 이유는?',
          a: '이 장치는 X 마이너가 프로토콜의 장기 건설자로 남도록 합니다. gAGX 스테이킹 상한은 계정의 ≥180일 AGX 채권 보유와 AGX 스테이킹 합계를 넘을 수 없습니다. 채권 또는 장기 스테이킹을 늘리면 마이닝 상한이 올라갑니다.',
        },
      ],
    },
    calc: {
      title: '수익 계산기',
      intro: '제품·주기·가격별 예상 수익을 산출합니다 — 온체인 거래 없음',
      productAria: '산출 제품',
      products: {
        stake: '스테이킹',
        lpbond: 'LP 채권',
        burnbond: '소각 채권',
        xmine: 'X 마이닝',
      },
      periodLabel: '주기 선택',
      periodAria: '산출 주기',
      amountLabel: '수량',
      amountBuy: '구매 금액',
      amountAria: '수량',
      price: '만기 AGX 가격',
      priceCurrent: '현재 {price}',
      priceAria: '가격 입력',
      priceX: '만기 X 가격',
      priceXAria: '만기 X 가격 입력',
      days: '보유 일수',
      dayBubble: '{day}일째',
      sliderBreakEven: '양수익',
      sliderMaturity: '{days}일 만기',
      daysAria: '보유 일수',
      submit: '계산',
      result: {
        interest: '예상 수익',
        total: '수익 합계',
        rate: '수익률',
        sellTotal: '매도 총액',
        invested: '총 투입',
        yieldBar: '수익 {amount}',
        lossBar: '손실 {amount}',
        legend: {
          released: '릴리스된 원금 가치',
          netYield: '순수익 가치',
          netYieldHint: 'Rebase 복리와 장기 보너스. 기여 포인트는 차감하지 않음',
          netYieldHintXmine: '채굴한 X 수량을 만기 X 가격으로 환산한 가치',
          cost: '투입 비용',
          grossYield: '수익 합계',
        },
      },
      aside: {
        result: '산출 결과',
        resultHint: '왼쪽에서 파라미터를 입력하고 계산을 탭한 뒤 결과를 확인하세요.',
        tags: { day: '{day}일째' },
        curve: '수익 곡선',
        curveHint:
          '현재 파라미터로 일별 누적 수익을 산출하며, 만기 후 미상환 시 복리 수익이 계속됩니다',
        nodes: '핵심 노드',
        nodeEndLabel: '{day}일째까지 보유',
        nodeCards: [
          { label: '손익분기일', note: '해당 일부터 매도하면 양의 수익을 실현할 수 있습니다' },
          {
            label: '원금 완전 릴리스',
            hint: '원금은 주기 블록에 따라 선형 릴리스되며, 이날부터 전액 인출할 수 있습니다',
          },
          { label: '주기 말일까지 보유', note: '원금 대비 누적 수익 예시' },
        ],
        notes: '계산 설명',
        notesBody: '본 계산기는 로컬 추정 참고용이며 온체인 호가나 수익 약속이 아닙니다.',
        notesItems: [
          'Rebase는 약 {hours}시간마다(하루 {timesPerDay}회) 정산됩니다. 수익은 Rebase 1회당 {rebase}%로 복리 계산되며, 장기 기간에는 Rebase 수익에 단리 보너스가 추가됩니다: 180일 10%, 360일 15%, 540일 20%.',
          '원금은 선택한 기간에 걸쳐 선형으로 잠금 해제됩니다. 매도 금액에는 해당 날짜까지 릴리스된 원금만 포함되며, 아직 릴리스되지 않은 원금은 매도 합계에 포함되지 않습니다.',
          '순수익은 복리 Rebase와 기간 보너스의 합계입니다. 릴리스된 원금과 순수익은 설정한 매도 가격으로 판매하는 것으로 계산합니다. 수익 수령에 필요한 기여 포인트 비용은 포함되지 않습니다.',
          '이 추정치는 수익 릴리스 수수료를 차감하지 않으며 원금과 수익이 잠금 해제되는 동안의 가격 변동도 반영하지 않습니다. 참고용이며 실제 수익은 프로토콜 상태에 따라 달라집니다.',
        ],
      },
    },
  },

  release: {
    title: '릴리스',
    intro: '수익과 원금 릴리스를 관리·확인하세요',
    backToHub: '릴리스로 돌아가기',
    recordColumns: ['시간', '작업', '수량', '거래 해시'],
    recordsEmpty: '아직 온체인 인덱스 기록이 없습니다(indexer 대기)',
    labels: {
      releasing: '릴리스 중',
      released: '릴리스됨',
      releasedPct: '릴리스됨 {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: '수령에 실패했습니다. 다시 시도해 주세요',
    },
    hub: {
      aboutTitle: '릴리스 정보',
      aboutCardTitle: '릴리스 풀 · 수익 및 리워드 릴리스',
      aboutCardBody:
        '릴리스 풀은 수익 환전을 “순간 매도 압력”에서 수십 일에 걸친 평활 자금 흐름으로 바꿉니다. 매 수령이 선택한 주기로 선형 릴리스되어, 프로토콜 수익 유출 리듬이 생태계 성장 리듬과 맞춰집니다.',

      aboutSlides: [
        {
          title: '릴리스 풀 · 수익 및 리워드 릴리스',
          body: '릴리스 풀은 수익 환전을 “순간 매도 압력”에서 수십 일에 걸친 평활 자금 흐름으로 바꿉니다. 매 수령이 선택한 주기로 선형 릴리스되어, 프로토콜 수익 유출 리듬이 생태계 성장과 맞춰지고, 수익이 한꺼번에 환전되어 AGX 가격을 충격하는 일을 피하며, 장기 참여자의 복리 성장 기반을 지킵니다.',
        },
        {
          title: '버퍼 풀 · 원금 2차 릴리스',
          body: '스테이킹·채권 원금 종료 후 버퍼 풀에서 2차 선형 릴리스되어, 원금 환전 리듬을 시장 흡수력에 맞추고 생태계 안정성을 높입니다.',
        },
      ],
      purposeTitle: '릴리스의 역할',
      purposeBody:
        '모든 수익은 터빈에 도달하기 전에 릴리스 풀에서 선택한 주기로 선형 릴리스됩니다. 집중된 환전 수요를 시간축으로 분산해 순간 매도 압력을 줄이고, 주기가 길수록 세율이 낮은 설계로 장기 보유를 유도해 생태계 안정 운영의 완충을 제공합니다.',

      mechanismTitle: '수익 수령 메커니즘',
      mechanismSubtitle:
        '릴리스는 수익이 발생해 터빈에 들어가기까지의 필수 단계입니다 — 시간으로 세율을, 리듬으로 안정을 바꿉니다',
      mechanismSteps: [
        { title: 'Rebase / DAO 리워드 수령', body: '수익 발생' },
        { title: '1:1 기여 메커니즘', body: '50% 소각 · 50% X 기반 풀 주입' },
        { title: '릴리스 풀 진입 · 선형 릴리스', body: '5 / 20 / 40 / 60일 주기 선택' },
        { title: '터빈으로 수령', body: '1:1 매수로 매도 한도 잠금 해제' },
      ],
      taxTitle: '장기 릴리스일수록 더 낮은 세율',
      taxPeriod: '산출 주기',
      taxRate: '수령 세율',
    },
    queue: {
      title: '릴리스 풀',
      intro:
        '수령한 수익과 리워드는 여기서 선택한 주기로 선형 릴리스되며, 릴리스된 분은 언제든 터빈으로 수령할 수 있습니다',
      hubHint:
        '수령한 수익과 리워드는 여기서 선택한 주기(5/20/40/60일)로 선형 릴리스되며, 릴리스된 분은 언제든 터빈으로 수령할 수 있습니다.',
      planDays: '{days}일',
      claim: '수령',
      refresh: '새로고침',
      claimSuccess: '터빈 할당량으로 수령됨',
      goTurbine: '터빈으로 이동',
      statsTitle: '릴리스 풀 데이터',
      lifetimeClaimed: '릴리스 풀에서 누적 수령',
      hints: {
        releasing: '릴리스 풀에 남아 선택한 주기대로 선형 릴리스 중인 gAGX 총량',
        released: '릴리스가 끝나 언제든 터빈으로 수령할 수 있는 gAGX 총량',
        lifetimeClaimed: '릴리스 풀에서 터빈으로 수령한 누적 gAGX',
      },
      recordsTitle: '릴리스 풀 기록',
    },
    buffer: {
      title: '버퍼 풀',
      intro:
        '상환 자산은 여기서 {days}일간 2차 선형 릴리스되며, 릴리스된 금액은 언제든 인출할 수 있습니다.',
      hubHint:
        '상환한 자산은 버퍼 풀에 들어간 뒤 {days}일 동안 블록 단위로 선형 릴리스되며, 릴리스된 분은 언제든 지갑으로 인출할 수 있습니다.',
      claim: '출금',
      refresh: '새로고침',
      claimSuccess: 'AGX를 지갑으로 출금함',
      statsTitle: '버퍼 풀 데이터',
      entered: '누적 진입',
      extracted: '누적 출금',
      hints: {
        enteredAgx: '스테이킹·채권 상환 후 버퍼에 누적 입고된 AGX 총량',
        extractedAgx: '버퍼에서 지갑으로 인출한 AGX 총량',
        releasingAgx: '버퍼에서 아직 릴리스 중인 AGX 총량',
        enteredGagx: 'X 채굴 상환 후 버퍼에 누적 입고된 gAGX 총량',
        extractedGagx: '버퍼에서 지갑으로 인출한 gAGX 총량',
        releasingGagx: '버퍼에서 아직 릴리스 중인 gAGX 총량',
      },
      recordsTitle: '버퍼 풀 기록',
      mechanismTitle: '자금 릴리스 메커니즘',
      mechanismSubtitle: '스테이킹·채권 원금은 2단계 릴리스 모델로 시장 안정성을 높입니다',
      mechanismSteps: [
        { title: '스테이킹/', body: '채권 원금' },
        { title: '블록 단위', body: '릴리스' },
        { title: '출금 후', body: '{days}일 버퍼' },
        { title: '2차 선형', body: '릴리스' },
      ],
      mechanismBenefits: [
        '집중 잠금 해제 방지',
        '시장 매도 압력 완화',
        '자금 릴리스 평활화',
        '시장 안정성 강화',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: '수익이 지갑으로 바로 갈 수 없는 이유는?',
          a: '릴리스는 수익이 생긴 뒤 자유롭게 쓰기까지의 필수 단계입니다. 수익은 먼저 선택한 주기에 따라 릴리스 풀에서 선형으로 잠금 해제된 뒤, 터빈에서 언락을 마치고 지갑에 들어갑니다. 이 리듬이 집중 매도 압력을 지속적인 매수 수요로 바꾸며, AGX 가격과 프로토콜의 장기 운영을 지키는 핵심 설계입니다.',
        },
        {
          q: '릴리스 풀과 버퍼 풀의 차이는?',
          a: '릴리스 풀은 스테이킹·채권·채굴·각종 보상에서 직접 수령한 수익을 받으며, 선택한 주기로 선형 릴리스한 뒤 터빈으로 수령됩니다. 버퍼 풀은 주기를 고를 필요 없는 특정 입금이며, 릴리스가 끝나면 지갑으로 바로 출금할 수 있습니다. 둘은 서로 영향을 주지 않으니 따로 확인하고 수령하세요.',
        },
        {
          q: '전체 릴리스 경로는 어떻게 되나요?',
          a: '수익 수령 → 기여 포인트 1:1 소모 → 릴리스 풀 진입(주기별 세금 한 번 차감) → 선형 릴리스 → 터빈으로 수령 → USD1로 등량 AGX를 매수해 언락 → 쿨다운 종료 후 지갑으로 출금. 버퍼 풀 경로는 더 짧습니다: 릴리스가 끝나면 바로 출금할 수 있습니다.',
        },
        {
          q: '수익 수령 시 기여 포인트를 소모하는 이유는?',
          a: '수령 수량과 1:1로 기여 포인트를 소모합니다. 포인트는 AGX를 소각해 얻으며, 50%는 바로 소각되고 50%는 X 베이스 풀에 들어갑니다. 따라서 수익을 실현할 때마다 프로토콜에 디플레이션과 유동성을 함께 기여합니다. 포인트가 부족하면 소각 페이지에서 받으세요.',
        },
        {
          q: '세율과 주기는 어떻게 저울질하나요?',
          a: '주기가 짧을수록 세율이 높습니다(5일 20%, 20일 10%, 40일 5%, 60일 1%). 세금은 릴리스 풀에 들어갈 때 한 번만 차감됩니다. 급하면 짧은 주기, 남기고 싶으면 긴 주기. 수익을 나눠 다른 주기로 넣으면 속도와 비용을 함께 맞출 수 있습니다.',
        },
      ],
      queue: [
        {
          q: '릴리스 주기를 변경할 수 있나요?',
          a: '할 수 없습니다. 주기는 수익이 릴리스 풀에 들어가는 시점에 고정되며 이후 변경할 수 없습니다. 각 수령은 독립이므로, 다음에는 다른 주기를 고를 수 있습니다.',
        },
        {
          q: '세율은 언제 차감되나요?',
          a: '세율은 수익이 릴리스 풀에 들어갈 때, 선택한 주기 요율로 한 번만 차감됩니다(5일 20%, 20일 10%, 40일 5%, 60일 1%). 풀에 표시되는 수량은 이미 세후이며, 릴리스와 이후 수령에 추가 수수료는 없습니다.',
        },
        {
          q: '릴리스 풀에서 수령한 gAGX는 어디로 가나요?',
          a: '수령한 gAGX는 지갑으로 바로 가지 않고 터빈으로 들어가, 터빈 규칙에 따라 이어집니다. 터빈 페이지에서 확인하고 관리하세요.',
        },
        {
          q: '릴리스된 분을 바로 수령하지 않으면 손실이 있나요?',
          a: '소멸하지 않으며 언제든 수령할 수 있습니다. 다만 풀에 머무는 릴리스분은 수익을 내지 않으므로, 제때 터빈으로 수령하세요.',
        },
        {
          q: '적절한 릴리스 주기는 어떻게 고르나요?',
          a: '자금을 빨리 쓰고 싶으면 짧은 주기(세율 높음)를, 기다릴 수 있으면 긴 주기로 낮은 세율을 고르세요. 수령을 여러 번 나눠 주기를 달리하면 속도와 세율을 균형 잡을 수 있습니다.',
        },
      ],
      buffer: [
        {
          q: '버퍼 풀이란?',
          a: '원금을 언스테이크(상환)하면 버퍼 풀에 들어가 30일 2차 선형 릴리스가 진행됩니다. 단기 집중 유출을 줄여, 지속 릴리스와 시장 안정의 균형을 맞춥니다.',
        },
        {
          q: '버퍼 풀 자산에도 수익이 있나요?',
          a: '없습니다. 자산은 버퍼에 들어가는 순간부터 수익을 내지 않으므로, 현금 필요에 맞춰 상환 시점을 정하세요.',
        },
        {
          q: '릴리스된 분은 어떻게 출금하나요?',
          a: '버퍼는 블록 단위로 선형 잠금 해제됩니다. 「릴리스됨」 분의 출금을 누르면 추가 대기 없이 지갑으로 바로 들어갑니다.',
        },
        {
          q: '버퍼 풀에 AGX와 gAGX 두 자산이 보이는 이유는?',
          a: '스테이킹·채권 상환 원금은 AGX, X 마이닝 언스테이크는 gAGX입니다. 두 자산은 독립적으로 릴리스·출금됩니다.',
        },
        {
          q: '이미 릴리스된 자산을 한 번에 모두 출금할 수 없는 이유는?',
          a: '버퍼 자산은 여러 상환 기록에서 올 수 있고, 기록마다 버퍼 시계가 다릅니다. 기록이 많으면 한 번 출금으로 처리할 수 있는 건수에 한도가 있어, 릴리스분을 한 번에 모두 빼지 못할 수 있습니다. 전부 나올 때까지 출금을 다시 누르세요.',
        },
      ],
    },
  },
  tables: {
    time: '시간',
    claimTime: '수령 시간',
    paid: '금액',
    status: '상태',
    discount: '할인',
    estimatedAgx: '예상 AGX',
    tx: '거래',
    title: '창세 칭호',
    totalVolume: '총 실적',
    rewardRate: '보상 비율',
    amount: '금액',
    from: '발신 주소',
    genesisRank: '창세 등급',
    joined: '가입 시간',
    address: '주소',
    communityVolume: '팀 실적',
    holding: '보유',
    contribution: '구독',
  },
}) satisfies AppMessagesBundle

export default app
