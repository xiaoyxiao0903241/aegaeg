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
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: '공동 구축',
    rewards: '리워드',
    release: 'Release',
    community: '커뮤니티',
    rewardsTooltip: '추천 리워드와 팀 리워드를 확인하세요.',
    communityTooltip:
      '파트너를 초대하여 공동 구축에 참여하고, 생태계 성장 가치와 창세 리워드를 함께 누리세요.',
    bscTooltip:
      'BSC 전용 · AEGIS X는 BNB Smart Chain에서 운영되며, 현재 네트워크 전환은 지원하지 않습니다.',
  },
  topbar: {
    currentNetwork: '현재 네트워크',
    openMenu: '내비게이션 열기',
    closeMenu: '내비게이션 닫기',
    hideDetails: '상세 패널 접기',
    showDetails: '상세 패널 펼치기',
    toggleTooltip: '상세 패널 표시 또는 숨기기',
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
    connectIntroTitle: '지갑을 연결하여 AEGIS X 기능을 탐색하세요',
    connectIntroLink: 'AEGIS X 기능 ↗',
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
      transactionFailed: '거래에 실패했습니다. 잠시 후 다시 시도하세요.',
      transactionUnknown:
        '거래 상태를 확인할 수 없습니다. 다시 제출하지 마세요. 먼저 지갑 또는 블록 탐색기에서 확인하세요.',
    },
  },
  exchange: {
    title: 'Swap',
    intro: 'Get AEGIS X ecosystem tokens at the best rates',
    backToHub: 'Back to Swap',
    sell: 'Sell',
    buy: 'Buy',
    flip: 'Flip swap direction',
    balance: 'Balance',
    exchangePrice: 'Exchange price',
    ratePlaceholder: '1 : 1',
    slippage: 'Slippage tolerance',
    allowedSlippage: 'Allowed slippage',
    slippageSettings: 'Slippage tolerance settings',
    route: 'Swap route',
    provider: 'Provider',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Open on PancakeSwap',
    exchangeSuccess: 'Swap successful',
    transactionCancelled: 'Transaction cancelled in wallet',
    overview: 'Overview',
    exchangeRate: 'Exchange rate',
    settlement: 'Settlement',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Flash',
          body: 'Swap gAGX for AGX or USDT for USD1 — no fees, no slippage',
        },
        trade: {
          title: 'Trade',
          body: 'Swap major tokens for AEGIS X ecosystem tokens',
        },
        burn: {
          title: 'Burn',
          body: 'Burn AGX for contribution points',
        },
        turbine: {
          title: 'Turbine',
          body: 'Buy unlocked Turbine gAGX 1:1 with USD1',
        },
      },
      program: {
        title: 'Get AEGIS X protocol tokens',
        cards: [
          { title: 'Trade gAGX', body: 'Swap gAGX for AGX' },
          { title: 'Turbine', body: 'Buy unlocked Turbine gAGX with USD1' },
          { title: 'Get USD1', body: 'Convert USDT to USD1 via Flash' },
          { title: 'Get AGX', body: 'Get AGX at PancakeSwap market rate' },
          { title: 'Sell X', body: 'Swap X for AGX, USD1, or other ecosystem tokens' },
          { title: 'Get contribution points', body: 'Burn AGX at 1:6 for contribution points' },
        ],
      },
      faq: {
        items: [
          {
            q: 'What can I do on the Swap page?',
            a: 'Flash-convert USDT to USD1 or (when available) gAGX to AGX, trade major tokens for AEGIS X assets on PancakeSwap, burn AGX for contribution points, and buy unlocked Turbine gAGX with USD1.',
          },
          {
            q: 'What is the difference between Flash and Trade?',
            a: 'Flash uses a fixed protocol route with no user slippage controls. Trade uses PancakeSwap live rates with configurable slippage and market price impact.',
          },
          {
            q: 'What is a crypto wallet, and how do I get one?',
            a: 'A crypto wallet manages digital assets on-chain. With a non-custodial wallet, only you control the private key or seed phrase, so keep it safe. Common options include MetaMask and TokenPocket.',
          },
          {
            q: 'What is a blockchain transaction fee?',
            a: 'Every on-chain buy, sell, swap, or transfer needs gas. AEGIS X does not charge it; the BSC network does. Keep BNB in your wallet before trading.',
          },
          {
            q: 'How does a crypto wallet work?',
            a: 'Wallets use public and private keys. The private key or seed phrase signs transactions and must stay secret. The public key creates your address and receives assets.',
          },
        ],
      },
    },
    flash: {
      title: 'Flash',
      intros: {
        gagx: 'Convert gAGX to AGX — no fees, no slippage',
        gagxWrap: 'Wrap AGX into gAGX — no fees, no slippage',
        usdt: 'Convert USDT to USD1 — no fees, no slippage',
      },
      providerName: 'AEGIS X',
      openProvider: 'View convert contract on BscScan',
      settlementValue: 'On-chain · instant',
      aboutTitle: 'About',
      action: 'Flash',
      pairAriaLabel: 'Flash pair',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      gates: {
        paused: 'Flash is paused. Please try again later.',
        belowMin: 'Amount is below the minimum swap limit.',
        aboveMax: 'Amount exceeds the maximum swap limit.',
        insufficientReserve: 'USD1 reserve is insufficient. Please try again later.',
        zeroRate: 'Exchange rate is unavailable. Please try again later.',
      },
      faq: {
        items: [
          {
            q: 'What is gAGX?',
            a: 'gAGX is the unified settlement voucher for Rebase and DAO rewards. Rebase yield from AGX staking or bonds, and DAO rewards, are paid as gAGX.',
          },
          {
            q: 'What is the gAGX to AGX exchange rate?',
            a: 'Fixed 1:1 at any time — no fees, no slippage, settled on-chain instantly.',
          },
          {
            q: 'Why does Flash have no fees or slippage?',
            a: 'Flash is a protocol-level 1:1 gAGX↔AGX redeem, not an AMM trade, so there is no price slippage or swap fee. You only pay BSC network gas in BNB.',
          },
          {
            q: 'How do I get gAGX?',
            a: 'After participating in protocol yield distribution, you receive a corresponding amount of gAGX.',
          },
          {
            q: 'What else can I do with gAGX besides redeeming AGX?',
            a: 'Redeem 1:1 to AGX for staking compounding, or stake gAGX to mine X. Both paths are available.',
          },
          {
            q: 'How do I swap USDT for USD1?',
            a: 'Switch to the USDT → USD1 pair on Flash, enter an amount, and swap at the protocol rate with on-chain settlement.',
          },
          {
            q: 'Can I swap USD1 back to USDT?',
            a: 'Flash is one-way USDT→USD1. Use Trade for market swaps to other assets.',
          },
        ],
      },
    },
    trade: {
      title: 'Trade',
      intro: 'PancakeSwap live rate · on-chain settlement',
      action: 'Trade',
      priceImpact: 'Price impact',
      estimatedGas: 'Est. network gas',
      highPriceImpactWarning:
        'This trade may move the pool price significantly. Try a smaller amount or increase slippage tolerance.',
    },
    burn: {
      title: 'Burn',
      subtitle: 'Burn AGX to obtain contribution points',
      sellLabel: 'Burn',
      receiveLabel: 'Receive',
      pointsToken: 'Contribution points',
      currentContribution: 'Current contribution',
      burnRate: 'Burn rate',
      destination: 'Burn destination',
      destinationValue: 'Black hole address, permanently burned',
      providerName: 'AEGIS X',
      openProvider: 'View contribution swap on BscScan',
      action: 'Burn',
      aboutTitle: 'About',
      gates: {
        paused: 'Burn is paused. Please try again later.',
        belowMin: 'Amount is below the minimum burn limit.',
        aboveMax: 'Amount exceeds the maximum burn limit.',
        zeroRate: 'Burn rate is unavailable. Please try again later.',
      },
      metrics: {
        totalBurnedAgx: 'Total AGX burned',
        totalEarnedContribution: 'Total contribution earned',
        totalConsumedContribution: 'Total contribution consumed',
      },
      history: {
        title: 'Burn history',
        empty: 'No burn or consumption records yet',
        tabsAriaLabel: 'Burn history tabs',
        tabs: {
          burn: 'Burn',
          consume: 'Consume',
        },
        burnColumns: ['Time', 'Burned AGX', 'Contribution earned', 'Transaction hash'],
        consumeColumns: ['Time', 'Contribution consumed', 'Transaction hash'],
      },
      faq: {
        items: [
          {
            q: 'What are contribution points used for?',
            a: 'Contribution points are required when claiming mixed rewards with restake. Restake and lucky-pool claims consume points based on the reward amount.',
          },
          {
            q: 'Why do I need contribution points to claim rewards?',
            a: 'The protocol uses contribution points to gate reward claims and restake flows. If your balance is insufficient, the claim reverts — burn AGX first to add points.',
          },
          {
            q: 'What is the burn rate?',
            a: 'The burn rate is set on-chain (rateBps). Each AGX burned yields contribution points at contribution = AGX × rateBps ÷ 10000.',
          },
          {
            q: 'Where does burned AGX go?',
            a: 'A portion is sent to a black-hole address and permanently destroyed; the remainder may be injected into LP per contract split settings.',
          },
          {
            q: 'Can contribution points be transferred or refunded?',
            a: 'Contribution points are account-bound ledger balances on AgxContributionSwap. They cannot be transferred or refunded to AGX.',
          },
        ],
      },
    },
    turbine: {
      title: 'Turbine',
      segmentAriaLabel: 'Turbine actions',
      segments: {
        unlock: 'Unlock',
        claim: 'Claim',
      },
      unlockLabel: 'Unlock gAGX',
      unlockable: 'Unlockable',
      equivalentBuyHint: 'Unlocking also executes an equal buy',
      payUsd1Label: 'Pay USD1',
      buyAgxLabel: 'Buy AGX',
      buyToBoundWallet: 'Buy to bound wallet',
      agxPrice: 'AGX price',
      willReceiveAgx: 'AGX you will receive',
      unlockRatio: 'Unlock ratio',
      unlockRatioValue: '1:1 buy to unlock',
      cooldown: 'Cooldown',
      unlockAction: 'Unlock',
      unlockSuccess: 'Unlocked — cooldown started',
      claimAction: 'Claim',
      claimSuccess: 'Claimed successfully',
      claimEmpty: 'No cooldown records yet',
      claimReady: 'Ready to claim',
      claimCooling: 'Cooling down',
      dataTitle: 'Turbine data',
      aboutTitle: 'About',
      recordsTitle: 'Turbine records',
      recordsEmpty: 'No records yet',
      recordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
      mechanismTitle: 'Turbine mechanism',
      mechanism: [
        {
          title: '1:1 buy to unlock',
          body: 'Pay equal USD1 to buy AGX and unlock the matching Turbine quota into cooldown.',
        },
        {
          title: 'Adaptive cooldown',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'Pending unlock',
        cooling: 'Cooling',
        claimable: 'Claimable',
      },
      faq: {
        items: [
          {
            q: 'What does Turbine do?',
            a: 'Rewards enter Turbine as unlockable quota. Buy AGX with USD1 1:1 to start cooldown, then claim gAGX when vested.',
          },
          {
            q: 'Why USD1?',
            a: 'The handbook path settles unlock with USD1. On-chain quotes determine the exact payment amount.',
          },
          {
            q: 'How do I claim after cooldown?',
            a: 'Open the Claim tab and claim vested rows. After a successful claim the silence list is re-fetched.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'About AEGIS X ecosystem tokens',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Core settlement asset',
          body: 'The core settlement asset of the AEGIS X ecosystem, connecting value circulation, liquidity networks, and payment scenarios.',
        },
        {
          key: 'agx',
          title: 'AGX · Core protocol asset',
          body: 'AGX is the core asset of the AEGIS X protocol, generated through a 150% over-collateralization mechanism, and plays a key role in value growth, yield distribution, and ecosystem development.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Reward settlement voucher',
          body: 'A protocol reward settlement voucher redeemable for AGX and used in ecosystem mining and yield recycling.',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
        },
      ],
    },
    tokenContract: 'View contract',
    tokenPrevious: 'Previous token',
    tokenNext: 'Next token',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: 'Trade',
          items: [
            {
              q: 'What is the difference between Trade and Flash Swap?',
              a: 'Trade swaps USD1, AGX, X and other ecosystem tokens on PancakeSwap at live market rates with customizable slippage and gas fees. Flash Swap is a protocol 1:1 gAGX↔AGX conversion with no fee or slippage.',
            },
            {
              q: 'What is allowed slippage and how do I set it?',
              a: 'Slippage is price movement between submission and settlement. Allowed slippage is the maximum deviation you accept—use the default or a custom percent. If realized slippage exceeds your setting the trade reverts (gas may still be spent). Too low fails easily; too high may fill at a worse price.',
            },
            {
              q: 'How does Trade settle, and are there fees?',
              a: 'Trades settle on PancakeSwap on-chain. AEGIS X charges no extra swap fee, but every on-chain tx needs BSC gas in BNB—keep enough BNB in your wallet.',
            },
            {
              q: 'Why can the received amount differ from the estimate?',
              a: 'Estimates use the rate at quote time. Market moves or other trades can change the fill; the final amount is what settles on-chain within your slippage limit.',
            },
            {
              q: 'Which tokens can I trade?',
              a: "You can swap among AEGIS X ecosystem tokens (USD1, AGX, X) at market rates. Use the tabs above for each token's details.",
            },
            {
              q: 'Where can I see trade history?',
              a: 'Trades execute on-chain and settle in seconds. Confirm each tx in your wallet or a block explorer.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'What is USD1?',
              a: "USD1 is AEGIS X's core settlement asset. It is backed 100% by reserves such as cash, short-term U.S. Treasuries, and government money-market funds; monthly reports are on WLFI.",
            },
            {
              q: 'What role does USD1 play in AEGIS X?',
              a: 'USD1 serves as the core settlement asset, connecting liquidity networks, payment scenarios, and ecosystem value flows.',
            },
            {
              q: 'How do I swap USD1?',
              a: 'Users can quickly swap USDT for USD1 through on-chain swap functionality to participate in the AEGIS X ecosystem.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'What is AGX?',
              a: 'AGX is the core asset of the AEGIS X protocol, minted through a 150% over-collateralization mechanism, and plays a key role in value growth, yield distribution, and ecosystem development.',
            },
            {
              q: 'How does AGX achieve sustained growth?',
              a: 'Through staking, bonds, and Rebase, AGX forms a long-term compounding cycle, combined with AI think-tank market making and a buyback-and-burn mechanism.',
            },
            {
              q: 'How do I get AGX?',
              a: 'Users can obtain AGX by participating in the protocol ecosystem, or acquire it through trading markets supported by the protocol.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'What is gAGX?',
              a: 'gAGX is the protocol reward settlement voucher, used to connect yield growth with ecosystem value, and can participate in ecosystem mining.',
            },
            {
              q: 'How do I get gAGX?',
              a: 'After participating in protocol yield distribution, users receive a corresponding amount of gAGX.',
            },
            {
              q: 'What is the difference between gAGX and AGX?',
              a: 'AGX is the core protocol asset, responsible for value growth and yield distribution; gAGX is the ecosystem yield voucher, redeemable for AGX, and serves as a key entry point for participating in ecosystem mining.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'What is X?',
              a: 'X is the AEGIS X ecosystem value token, with a fixed total supply of 210 million, carrying ecosystem growth and value accumulation.',
            },
            {
              q: 'How do I get X?',
              a: 'Users can earn X rewards by participating in ecosystem mining, sharing in the ecosystem growth value.',
            },
            {
              q: 'How is the X airdrop released?',
              a: 'X value comes from ecosystem growth, value accumulation, and long-term development consensus, making it a key carrier of ecosystem value.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'View token and contract details',
  },
  genesis: {
    title: '공동 구축 프로그램',
    intro: 'X DAO 공동 구축 프로그램 참여 · 페이즈 {season}  ({discount} 할인)',
    shares: '지분 (1지분 = 100 USD1 · 최대 {max} 지분)',
    quota: '이번 페이즈 공동 구축 한도',
    pay: '지불',
    receive: '획득 AGX',
    value: '구독 가치',
    xTokenAirdrop: '예상 X 초기 에어드롭 가치',
    xTokenAirdropHint:
      '페이즈 누적 공동 구축 금액 ≥ {threshold} 시 에어드롭 보상 자격이 부여됩니다.',
    join: '공동 구축 참여',
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
          a: '사용자는 USD1로 공동 구축에 참여하며, 해당 페이즈 할인에 따라 AGX를 획득할 수 있습니다. 총 {phaseCount}개 페이즈이며, 할인은 {discounts} 순입니다.',
        },
        {
          q: '공동 구축 한도와 참여 요건은?',
          a: '최소 {minUsd}, {shareIncrement} USD1 단위로 참여해야 합니다. 페이즈별 한도: {phaseQuotas}.',
        },
        {
          q: '공동 구축 기간은 얼마나 되나요?',
          a: '공동 구축으로 획득한 AGX는 540일 방출 주기를 따릅니다.',
        },
        {
          q: 'X 에어드롭 리워드는 어떻게 받나요?',
          a: '단일 계정 누적 공동 구축 금액이 {threshold}에 도달하면 해당 페이즈 X 에어드롭 리워드 자격을 획득합니다. {phaseCount}개 페이즈의 에어드롭 비율: {airdropRatios}.',
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
      body: '공동 구축 프로그램이 종료되었습니다. 미참여자 계정에는 기록이 없습니다.',
    },
    goBindReferrer: '추천인 연결',
    seasonLive: '진행 중',
    seasonEnded: '종료됨',
    seasonUpcoming: '곧 시작',
  },
  rewards: {
    title: '공동 구축 리워드',
    intro: '공동 구축 참여 · 성장 가치 공유',
    currentTitle: '현재 등급',
    postLaunchRankTitle: '출시 후 등급',
    teamRewardRate: '팀 보상 {rate}',
    postLaunch30DayRank: '출시 후 30일 이내 {rank} 등급 획득 가능',
    postLaunchMaxRank: '최고 등급에 도달했습니다',
    postLaunchRankTooltip:
      '출시 후 등급은 팀 공동 구축 금액을 할인가로 AGX에 환산한 실적을 기준으로 산정됩니다.\n현재 등급은 실적 데이터만을 근거로 하며, 출시 후에는 개인 보유량·유효 직추천 계정 등 다른 요인의 영향을 받을 수 있습니다.\n본 데이터는 참고용이며, 최종적으로는 출시 후 실제 데이터가 기준입니다.',
    superCommunityBadge: '슈퍼 체계',
    heroTierRewardBody: '팀 공동 구축 금액의 {bonus}를 리워드로 받습니다.',
    superCommunityBenefitBody: '슈퍼 체계는 체계 발전 전용 기금과 거버넌스 권익을 받습니다.',
    shareholderHintNoRank: '창세 등급',
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
    claimed: '수령 완료 {amount}',
    claim: '지갑으로 수령',
    claimSuccess: '수령 성공',
    claimErrors: {
      zeroAmount: '수령 금액이 0입니다.',
      invalidSigner: '서명이 유효하지 않습니다. 다시 발급받으세요.',
      alreadyUsed: '이미 수령한 리워드입니다.',
      expired: '서명이 만료되었습니다. 새로고침 후 다시 시도하세요.',
      noOrder: '수령 가능한 리워드가 없습니다.',
      failed: '수령에 실패했습니다. 나중에 다시 시도하세요.',
      confirmSyncFailed:
        '온체인 수령은 완료됐지만 동기화에 실패했습니다. 페이지를 새로고침하세요. 다시 수령하지 마세요.',
    },
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
    communityFundTooltip:
      '슈퍼 체계는 체계 발전 기금의 5%를 받으며, 시스템 구축, 일상 운영, 체계 회의, 체계 강사 등 체계 자영에 전용됩니다.',
    communityFundLocked: '잠금: {amount}',
    communityFundUnlockedSuffix: '잠금 해제',
    communityFundClaimed: '수령 완료 {amount}',
    communityFundHistory: '발전 기금',
    communityFundCumulativeClaimed: '누적 수령 {amount}',
    communityFundHistoryEmpty: {
      title: '발전 기금 기록 없음',
      body: '발전 기금 수령 기록은 리워드가 발생한 후 여기에 표시됩니다.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '추천 리워드는 어떻게 계산되나요?',
          a: '추천 리워드는 3%이며, 압축 동등 금액 정산 메커니즘을 적용합니다. 동등 금액 부분만 계산하며, 빈 계정은 리워드 계층에 포함되지 않고 리워드는 자동 정산됩니다.',
        },
        {
          q: '창세 등급은 어떻게 승급하나요?',
          a: '창세 등급은 S1부터 S10까지이며, 개인 공동 구축 금액과 조직 총 실적을 기준으로 평가합니다. 상위 등급은 양쪽 구역 승급 조건을 충족해야 합니다.',
        },
        {
          q: '등급 상승 리워드란?',
          a: '공동 구축 기간에 달성한 창세 등급은 프로토콜 출시 후 자동으로 1등급 상승하며, 30일간 유효하고 이후 실제 등급으로 복귀합니다.',
        },
        {
          q: '창세 팀 리워드는 어떻게 정산되나요?',
          a: '창세 팀 리워드는 해당 창세 등급 비율에 따라 자동 정산되며, 사용자가 지갑으로 수동 수령해야 합니다. 공동 구축 기간 종료 후 현재 페이지는 닫히며, 미수령 리워드는 더 이상 수령할 수 없고 스마트 마켓메이킹 컨트랙트로 이전됩니다.',
        },
      ],
    },
    rewardType: {
      referralPaid: '추천 리워드',
      referralWithdrawn: '추천 리워드 수령',
      marketTeam: '마켓메이킹 팀 리워드',
      presaleTeam: '프리세일 팀 리워드',
      unknown: '—',
    },
    logStatus: {
      pending: '대기 중',
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
    inviteTitle: '초대 시작 · 생태계 성장 가치 공유',
    programs: {
      title: '생태계 지원 프로그램',
      items: [
        {
          label: '창세 공동 구축 · 페이즈 {season}',
          title: '창세 준비금 이사 프로그램',
          body: '글로벌 최초 공동 구축 좌석 개방',
          action: '프로그램 상세 보기 →',
          href: 'https://xdaoaegis.notion.site/genesis-reserve-council-program-kr',
        },
        {
          label: 'X아카데미',
          title: '글로벌 DeFi 아카데미·디지털 경제 시대 글로벌 리더십 아카데미',
          body: '시대를 위한 리더 양성·미래를 위한 인재 비축',
          action: '프로그램 상세 보기 →',
          href: 'https://xdaoaegis.notion.site/x-kr',
        },
      ],
    },
    myInvites: '내 커뮤니티 멤버 ({count})',
    referralBondPermanent: '추천 관계 활성화 · 연결은 영구적입니다.',
    volumePrefix: '실적',
    genesisShareholder: '창세 준비금 이사',
    statToday: '오늘 +{count} · +{amount}',
    statGenesisToday: '출시 후 자동 1등급 상승',
    postLaunchRankLabel: '출시 후 등급',
    totalTeamVolume: '총 실적 {amount}',
    postLaunch30DayBoost: '출시 후 30일 이내 {rank}로 승급',
    postLaunchMaxRank: '최고 등급에 도달했습니다',
    bindReferrerSuccess: '추천인 연결 완료',
    inviteFlow: {
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
          title: '공동 구축 리워드 획득',
          body: '파트너가 공동 구축에 참여하면 리워드가 스마트 컨트랙트를 통해 지갑 주소로 자동 정산됩니다.',
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
          q: '창세 추천 리워드는 어떻게 계산되나요?',
          a: '창세 추천 리워드는 3%이며, 압축 동등 금액 정산 메커니즘을 사용해 동등 금액 부분만 계산합니다.',
        },
        {
          q: '창세 등급을 어떻게 올리나요?',
          a: '개인 공동 구축 금액과 조직 실적 달성에 따라 S1에서 S10까지 단계적으로 승급합니다.',
        },
      ],
    },
  },
  assets: {
    title: 'Assets',
    body: 'Assets overview is coming soon.',
  },
  staking: {
    title: 'Staking',
    body: 'Staking is coming soon.',
  },
  release: {
    title: 'Release',
    body: 'Release schedule is coming soon.',
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
    communityVolume: '커뮤니티 실적',
    contribution: '구독',
  },
}) satisfies AppMessagesBundle

export default app
