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
  onboarding: {
    chip: 'Tutorial',
    skip: 'Skip',
    prev: 'Back',
    next: 'Next',
    done: 'Done',
    steps: [
      {
        title: 'Exchange',
        body: 'Use Exchange to swap major tokens for AEGIS X ecosystem tokens (AGX, gAGX, X) at market rates.',
      },
      {
        title: 'Trade',
        body: 'Use Trade to buy AGX with USD1.',
      },
      {
        title: 'Staking',
        body: 'Staking is where yield starts: stake AGX or buy bonds to earn compound rewards on every Rebase.',
      },
      {
        title: 'Single-asset stake',
        body: 'Stake AGX in the Stake card. Rebase twice daily compounds; longer lockups earn higher yield boosts.',
      },
      {
        title: 'Assets',
        body: 'Assets summarizes all positions: stake, LP bonds, burn bonds, and X mining holdings and rewards.',
      },
      {
        title: 'Stake positions',
        body: 'In the Assets Stake card, review holdings and total rewards, then claim, compound, or redeem.',
      },
      {
        title: 'Release',
        body: 'Release manages pending funds: rewards enter the release pool / buffer pool and unlock linearly by period.',
      },
      {
        title: 'Release pool',
        body: 'Claimed rewards unlock linearly over 5 / 20 / 40 / 60 days; released amounts can move into Turbine.',
      },
      {
        title: 'Buffer pool',
        body: 'Redeemed principal unlocks linearly over ~30 days of blocks; released amounts can be withdrawn anytime.',
      },
      {
        title: 'Turbine',
        body: 'gAGX from the release pool stays locked until you unlock it 1:1 with USD1 in Turbine.',
      },
      {
        title: 'Rewards',
        body: 'Rewards include referral, participation, co-build, and more. Claiming spends contribution points 1:1.',
      },
      {
        title: 'Community',
        body: 'Community shows your team: invite link, members, and co-build tier live here.',
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
    title: 'Rewards',
    intro: 'View reward card balances and payout records.',
    backToHub: 'Back to rewards',
    claim: 'Claim',
    claimSuccess: 'Claimed successfully',
    claimErrors: {
      zeroAmount: 'Claim amount is 0.',
      invalidSigner: 'Invalid signature. Refresh and try again.',
      alreadyUsed: 'This reward was already claimed.',
      expired: 'Signature expired. Refresh and claim again.',
      noOrder: 'No reward available to claim.',
      failed: 'Claim failed. Please try again later.',
      confirmSyncFailed:
        'Claim succeeded on-chain but sync failed. Refresh the page and do not claim again.',
    },
    hub: {
      asideTitle: 'About AEGIS X rewards',
      asideBody:
        'Six reward cards cover lucky draws, referral, participation, co-build, development stipend, and genesis co-build.',
      balanceLabel: 'Balance',
      balancePlaceholder: '—',
      signInForBalance: 'Sign in to view',
      sessionHint:
        'Complete wallet sign-in before claiming. Connecting a wallet is not the same as a business login.',
      stats: {
        totalRewards: 'Total rewards',
        tier: 'Co-build tier',
        tierEmpty: 'No co-build tier yet',
        contribution: 'Contribution points',
        contributionHint: 'Mixed claims consume contribution points 1:1.',
        goBurn: 'Go burn →',
      },
      mechanismTitle: 'Co-build reward mechanism',
      mechanismBody: 'Co-build rewards come from team Rebase yield and are shared by tier.',

      aboutTitle: 'About AEGIS X rewards',
      hideZero: 'Hide zero balances',
      hideZeroEmpty: 'No non-zero reward cards. Turn off Hide zero balances to see all entries.',
      aboutSlides: {
        lucky: {
          title: 'Lucky',
          body: 'Block-lucky draws for co-builders; claim via Mixed when won.',
        },
        referral: {
          title: 'Referral',
          body: 'Earn 10% of each direct referral Rebase yield, settled on-chain. Keep your position value above $100.',
        },
        participate: {
          title: 'Participate',
          body: 'Rewards from your referrer via IncentivePool signed claims.',
        },
        cobuild: {
          title: 'Co-build',
          body: 'Long-term team incentives by tier; Mixed claims require contribution points.',
        },
        grant: {
          title: 'Growth grant',
          body: 'Ecosystem grant via MarketFund signed claims.',
        },
        genesis: {
          title: 'Genesis co-build',
          body: 'Genesis referral, tier, and growth-fund rewards; claims close after settlement ends.',
        },
      },
      tierTable: {
        columns: ['Tier', 'Holding', 'Active accounts', 'Team volume', 'Bonus rate'],
        rows: [
          { level: 'A1', holding: '$100', accounts: '2', team: '—', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: 'Volume ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: 'Volume ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$100', accounts: '3', team: 'Two lines reach A3', rate: '40%' },
          { level: 'A5', holding: '$500', accounts: '3', team: 'Two lines reach A4', rate: '50%' },
          {
            level: 'A6',
            holding: '$1,000',
            accounts: '4',
            team: 'Two lines reach A5',
            rate: '60%',
          },
          {
            level: 'A7',
            holding: '$2,000',
            accounts: '4',
            team: 'Two lines reach A6',
            rate: '70%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '5',
            team: 'Two lines reach A7',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '5',
            team: 'Two lines reach A8',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '5',
            team: 'Two lines reach A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '5',
            team: 'Two lines reach A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '5',
            team: 'Two lines reach A11',
            rate: '128%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '5',
            team: 'Two lines reach A12',
            rate: '138%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Lucky',
        body: 'Block lucky draw for co-builders',
        aside: 'Lucky rewards use Chainlink VRF; winners claim via Mixed.',
      },
      referral: {
        title: 'Referral',
        body: 'Rewards for inviting partners into co-build',
        aside: 'Referral rewards are claimed via CommunityFund signatures.',
      },
      participate: {
        title: 'Participation',
        body: 'Rewards from your referrer',
        aside: 'Participation rewards are claimed via IncentivePool signatures.',
      },
      cobuild: {
        title: 'Co-build',
        body: 'Long-term team co-build incentive rewards',
        aside: 'Co-build rewards use DaoPool Mixed and require contribution points.',
      },
      grant: {
        title: 'Development stipend',
        body: 'Ecosystem development stipend',
        aside: 'Development grants are claimed via MarketFund signatures.',
      },
      genesis: {
        title: 'Genesis co-build rewards',
        body: 'Genesis direct, tier, and development fund rewards',
        aside: 'Genesis co-build rewards are claimed via RewardClaimer signatures.',
        badge: 'Closing soon',
      },
    },
    detail: {
      claimable: 'Claimable',
      emptyClaimable: 'No reward available to claim.',
      signedAmountHint: 'Claimable amount follows the signed payload',
    },

    claimHistory: {
      title: 'Grant & claim history',
      columns: ['Time', 'Type', 'Amount', 'Tx hash'],
      empty: 'No records yet',
    },

    mixed: {
      splitAria: 'Claim vs restake split',
      releasePct: 'Claim {pct}%',
      restakePct: 'Restake {pct}%',
      releasePeriod: 'Release period',
      restakePeriod: 'Restake period',
      releaseAria: 'Release period',
      restakeAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      requiredContribution: 'Contribution required this claim: {amount}',
      insufficientContribution: 'Insufficient contribution points. Burn to top up.',
      goBurn: 'Get contribution points',
      luckyPaused: 'Lucky pool is paused; claims are unavailable.',
      luckyNotClaimable: 'No lucky reward available to claim.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'How are rewards paid out?',
          a: 'Most rewards are shown in AGX / gAGX terms; genesis co-build rewards follow RewardClaimer assets. Mixed claims send the release portion to the release queue.',
        },
        {
          q: 'What is required to claim?',
          a: 'Simple signed claims need a claimable balance and a valid signature. Lucky / DaoPool Mixed also need enough contribution points and a release/restake split.',
        },
        {
          q: 'When do claimed rewards arrive?',
          a: 'After the on-chain transaction confirms. The release portion unlocks over the selected period; the restake portion enters the matching stake position.',
        },
        {
          q: 'When are rewards settled?',
          a: 'Each source settles by contract and backend scan rules. The frontend uses claimable balances and signed payloads as source of truth.',
        },
        {
          q: 'Why do some cards hide amounts?',
          a: 'Disconnected or unsigned sessions show a sign-in hint, not an empty reward. After sign-in, — means nothing claimable or data is not ready yet.',
        },
      ],
    },

    // legacy keys retained for history helpers / gradual deletion
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
    intro: 'View positions, claim yield, or redeem principal',
    body: 'View positions, claim yield, or redeem principal',
    backToHub: 'Back to Assets',
    gates: {
      zeroAmount: 'Enter a valid amount',
      insufficientReward: 'Insufficient claimable yield',
      insufficientContribution: 'Not enough contribution points — burn AGX first',
      planUnresolved: 'Release/restake plan not ready — try again later',
      nothingToRedeem: 'Nothing available to redeem',
      warmupActive: 'Warmup still active',
      unavailable: 'Transaction temporarily unavailable',
    },
    position: {
      sort: 'Sort',
      quoteCurrency: 'Quote currency',
      pageSize: 5,
      remaining: 'Time left',
      staked: 'Staked',
      payout: 'Pending payout',
      yield: 'Yield',
      claim: 'Claim',
      redeem: 'Redeem',
      unlock: 'Unlock',
      unstake: 'Unstake',
      liquid: 'Flexible',
    },
    opsColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
    claim: {
      title: 'Claim yield',
      amount: 'Claim amount',
      splitAria: 'Release vs restake split',
      releaseShare: 'Release {pct}%',
      restakeShare: 'Restake {pct}%',
      releasePeriod: 'Release period',
      releasePeriodAria: 'Release period',
      restakePeriod: 'Restake period',
      restakePeriodAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      restakeDaysTax: '{days}d · {tax}',
      taxRate: 'tax {rate}%',
      contribNeed: 'This claim requires {amount} contribution',
      contribShort: 'Not enough contribution — burn AGX for points first',
      goBurn: 'Go to Burn',
      ctaMixed: 'Claim & Restake',
      ctaRelease: 'Claim',
      ctaRestake: 'Restake',
      success: 'Claim submitted',
      xmineSuccess: 'X reward claim submitted',
    },
    redeem: {
      title: 'Confirm redeem',
      body: 'Principal enters the release buffer (PrincipalReleaseVault) — not credited to your wallet immediately.',
      confirm: 'Enter buffer',
      cancel: 'Cancel',
      success: 'Redeem submitted — principal entered the release buffer',
    },
    hub: {
      hideZero: 'Hide zero balances',
      hideZeroEmpty:
        'No non-zero positions. Turn off Hide zero balances to see all product entries.',
      emptyHint: 'Pick a product to view positions, or open a position in Staking.',
      modes: {
        stake: { title: 'Stake', body: 'Manage AGX flexible / term positions' },
        lpbond: { title: 'LP Bond', body: 'Manage liquidity bond positions' },
        burnbond: { title: 'Burn Bond', body: 'Manage burn bond positions' },
        xmine: { title: 'X Mine', body: 'Manage gAGX mining positions' },
      },
      overview: {
        title: 'Assets overview',
        metrics: [
          { label: 'Total value' },
          { label: 'Claimable yield' },
          { label: 'Claimed total' },
          { label: 'Contribution points' },
        ],
      },
      distribution: {
        title: 'Holdings',
        empty: 'No holdings yet. Stake or buy bonds to see distribution here.',
        cta: 'Go to Staking',
      },
      faq: {
        title: 'FAQ',
        items: [
          {
            q: 'How is total value calculated?',
            a: 'Sum of product positions and claimable yield valuations.',
          },
          {
            q: 'Why do claims need contribution points?',
            a: 'Mixed claims consume contribution per the handbook; burn AGX if short.',
          },
          {
            q: 'Where does redeemed principal go?',
            a: 'Into PrincipalReleaseVault linear release — not instant wallet credit.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Stake positions',
        intro: 'Manage each stake — claim yield or redeem principal anytime',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Total' },
            { label: 'Released' },
            { label: 'Pending release' },
            { label: 'Claimable' },
            { label: 'Claimed' },
            { label: 'Voucher' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'Claim vs redeem?',
              a: 'Claim handles yield (optional restake); redeem sends principal to the release buffer.',
            },
            {
              q: 'What is released?',
              a: 'Principal available to redeem after a locked stake matures.',
            },
            {
              q: 'Why is each stake shown separately?',
              a: 'Each open position accrues and releases independently so you can claim or redeem per position.',
            },
            {
              q: 'What happens when the countdown ends?',
              a: 'The position becomes redeemable/operable; on-chain status is authoritative.',
            },
            {
              q: 'How does the restake ratio work when claiming?',
              a: 'Use the slider to split release vs restake, pick periods, then confirm.',
            },
          ],
        },
      },
      lpbond: {
        title: 'LP Bond positions',
        intro: 'Manage liquidity bonds — claim yield or redeem principal',
        empty: 'No LP bond positions',
        emptyCta: 'Buy LP Bond',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Total' },
            { label: 'Pending payout' },
            { label: 'Claimable' },
            { label: 'Claimed' },
            { label: 'Discount' },
            { label: 'Voucher' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'How does redeem credit principal?',
              a: 'redeem(..., false) creates a PRV release entry — not instant.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Burn Bond positions',
        intro: 'Manage burn bonds — claim yield or redeem principal',
        empty: 'No burn bond positions',
        emptyCta: 'Buy Burn Bond',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Total' },
            { label: 'Pending payout' },
            { label: 'Claimable' },
            { label: 'Claimed' },
            { label: 'Discount' },
            { label: 'Voucher' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'Burn vs LP bond?',
              a: 'Different entry paths; Mixed claim and redeem contracts match.',
            },
          ],
        },
      },
      xmine: {
        title: 'X Mine positions',
        intro: 'Claim X rewards or unstake into the release buffer',
        empty: 'No X mine positions',
        emptyCta: 'Go to X Mine',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Staked' },
            { label: 'Pending X' },
            { label: 'In warmup' },
            { label: 'Mining quota' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            { q: 'Why no restake slider?', a: 'X claim is claimReward only — no Mixed split.' },
            { q: 'Where does unstake go?', a: 'startUnstake enters PrincipalReleaseVault.' },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Staking',
    intro: 'Stake AGX, buy bonds, or mine X with gAGX',
    body: 'Stake AGX, buy bonds, or mine X with gAGX',
    backToHub: 'Back to Staking',
    amount: 'Amount',
    balance: 'Balance',
    max: 'Max',
    viewContract: 'View contract',
    gates: {
      notBound: 'Bind a referral first',
      insufficientBalance: 'Insufficient balance',
      insufficientGagx: 'Insufficient gAGX — wrap via Flash first',
      insufficientAllowance: 'Insufficient allowance',
      insufficientQuota: 'Insufficient quota',
      poolPaused: 'This staking pool is paused',
      depositoryNotAuth: 'Bond depository is not authorized',
      zeroAmount: 'Enter a valid amount',
      unavailable: 'Transaction temporarily unavailable — try again later',
    },
    hub: {
      modes: {
        stake: {
          title: 'Stake',
          body: 'Stake AGX for flexible or term yields',
        },
        lpbond: {
          title: 'LP Bond',
          body: 'Buy liquidity bonds with USD1',
        },
        burnbond: {
          title: 'Burn Bond',
          body: 'Buy burn bonds with USD1',
        },
        xmine: {
          title: 'X Mining',
          body: 'Stake gAGX to mine X',
        },
        calc: {
          title: 'Calculator',
          body: 'Local yield estimate — no on-chain writes',
        },
      },
      overview: {
        title: 'Overview',
        metrics: [
          { label: 'TVL' },
          { label: 'Stakers' },
          { label: 'Staked today' },
          { label: 'Flexible APY' },
          { label: 'Term APY' },
          { label: 'Bond discount' },
          { label: 'X mining quota' },
          { label: 'Reward pool' },
          { label: 'Protocol revenue' },
        ],
      },
      periodTable: {
        title: 'Periods & yields',
        segmentAria: 'Period table product',
        segs: {
          stake: 'Stake',
          lpbond: 'LP Bond',
          burnbond: 'Burn Bond',
        },
        columns: ['Period', 'Yield', 'Bonus'],
        rows: [
          { id: 'liquid', period: 'Flexible' },
          { id: '180', period: '180d' },
          { id: '360', period: '360d' },
          { id: '540', period: '540d' },
        ],
      },
      chart: {
        title: 'Metrics',
      },
      faq: {
        title: 'FAQ',
        items: [
          {
            q: 'What can I do on Staking?',
            a: 'Stake AGX (flexible/term), buy LP or burn bonds with USD1, mine X with gAGX, and run a local calculator. Claims and redeems live on Assets.',
          },
          {
            q: 'Why do I need a referral?',
            a: 'Stake and bond opens require a bound referral. Bind on Community, then retry.',
          },
          {
            q: 'Does the calculator send a transaction?',
            a: 'No. It only estimates locally and never writes on-chain.',
          },
        ],
      },
    },
    aside: {
      overview: 'Overview',
      positions: 'My positions',
      positionsHint: 'Claims, redeems, and unstakes are on the Assets tab.',
      viewPositions: 'View',
      mechanism: 'How it works',
      faq: 'FAQ',
      recordsTitles: {
        stake: 'My staking records',
        lpbond: 'My LP bond records',
        burnbond: 'My burn bond records',
        xmine: 'My mining records',
      },
      recordColumns: ['Time', 'Period', 'Amount', 'Released', 'Tx hash'],
      recordsEmpty: 'No records yet',
      chartTitles: {
        stake: 'TVL (Staking) metrics',
        lpbond: 'TVL (LP Bond) metrics',
        burnbond: 'TVL (Burn Bond) metrics',
        xmine: 'TVL (X Mining) metrics',
      },
      chartRangeAria: 'Chart time range',
      chartRanges: ['1W', '1M', '1Y', 'All'],
      xValue: {
        title: 'X long-term value',
        supplyLabel: 'X total supply',
        supplyValue: '210,000,000',
        badge: 'Fixed supply · never inflate',
        columns: [
          {
            pct: '47.62%',
            title: 'LP liquidity',
            bullets: ['Initial liquidity build', 'Market making & liquidity support'],
          },
          {
            pct: '52.38%',
            title: 'Global rewards & growth',
            bullets: ['gAGX mining rewards', 'Ecosystem growth incentives'],
          },
        ],
      },
    },

    stake: {
      title: 'Stake',
      intro: 'Choose a period and stake AGX',
      periodAria: 'Stake period',
      amountAria: 'Stake amount',
      submit: 'Stake',
      bindCta: 'Bind referral',
      success: 'Staked successfully',
      warmupCta: 'Activate warmup',
      warmupSuccess: 'Warmup activated',
      periods: {
        liquid: 'Flexible',
        d180: '180d',
        d360: '360d',
        d540: '540d',
      },
      meta: {
        apy: 'Yield',
        bonus: 'Bonus',
        lock: 'Lock period',
        remaining: 'Remaining quota',
        contract: 'Contract',
      },
      mechanism:
        'Flexible stake enters warmup before activation; term stakes lock in the selected pool. Rewards and principal exits are on Assets.',
      faq: [
        {
          q: 'Flexible vs term?',
          a: 'Flexible uses LiquidStaking with warmup; term uses the matching LockedStaking pool.',
        },
        {
          q: 'Is warmup activation a reward claim?',
          a: 'No. claim() only activates expired warmup principal. Mixed claims are on Assets.',
        },
      ],
    },
    lpbond: {
      title: 'LP Bond',
      intro: 'Buy liquidity bonds with USD1 via BondHelper',
      periodAria: 'LP bond period',
      amountAria: 'Purchase amount',
      submit: 'Buy',
      success: 'Purchased successfully',
      meta: {
        discount: 'Discount',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive',
        cap: 'Cap',
        release: 'Release',
        contract: 'Contract',
      },
      mechanism:
        'Zap USD1 through BondHelper into the matching BondDepository. Redeems and rewards are on Assets.',
      faq: [
        {
          q: 'Why no flexible bond?',
          a: 'Bonds only offer 180 / 360 / 540 day terms.',
        },
      ],
    },
    burnbond: {
      title: 'Burn Bond',
      intro: 'Buy burn bonds with USD1 via BondHelper',
      periodAria: 'Burn bond period',
      amountAria: 'Purchase amount',
      submit: 'Buy',
      success: 'Purchased successfully',
      meta: {
        discount: 'Discount',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive',
        cap: 'Cap',
        release: 'Release',
        contract: 'Contract',
      },
      mechanism:
        'Zap USD1 through BondHelper into the matching BurnBondDepository. Redeems and rewards are on Assets.',
      faq: [
        {
          q: 'How is burn bond different from LP bond?',
          a: 'They use different depositories; both open via BondHelper + USD1. Claims are on Assets.',
        },
      ],
    },
    xmine: {
      title: 'X Mining',
      intro: 'Stake gAGX to mine (quota from locked principal)',
      amountAria: 'gAGX stake amount',
      submit: 'Stake',
      success: 'Staked successfully',
      meta: {
        quota: 'Mining quota',
        daily: 'Daily yield',
        max: 'Max',
        h24: '24h',
        contract: 'Contract',
      },
      mechanism:
        'Checks miningQuotaOf then stakeGagxForMining. Claim X and unstake are on Assets; cancelWarmup is not offered here.',
      faq: [
        {
          q: 'Where does quota come from?',
          a: 'Locked principal across Early, term stakes, and bonds — returned by miningQuotaOf.',
        },
      ],
    },
    calc: {
      title: 'Calculator',
      intro: 'Local yield estimate — no on-chain writes',
      productAria: 'Product',
      periodAria: 'Period',
      amountAria: 'Amount',
      price: 'Price',
      priceAria: 'Price input',
      days: 'Days',
      daysAria: 'Holding days',
      submit: 'Calculate',
      result: {
        interest: 'Est. interest',
        total: 'Total',
      },
      aside: {
        result: 'Estimate result',
        resultHint: 'Enter parameters on the left and tap Calculate to see results.',
        curve: 'Yield curve',
        curveHint:
          'Cumulative yield by day at current parameters; compounding continues if not redeemed after maturity.',
        nodes: 'Key milestones',
        nodeCards: [
          {
            label: 'Break-even day',
            hint: 'Selling from this day can realize positive yield',
          },
          {
            label: 'Principal fully released',
            hint: '',
          },
          {
            label: 'Hold to period end',
            hint: 'Illustrative cumulative return vs principal',
          },
        ],
        notes: 'Calculation notes',
        notesBody: 'Local estimate only — not an on-chain quote or yield promise.',
        notesItems: [
          'Yield compounds at the current base daily rate; longer locks get APR boosts: 180d 15%, 360d 25%, 540d 35%.',
          'Principal releases linearly by block; only released principal through the estimate day is counted.',
          'Results exclude tax on yield release and price volatility; for reference only.',
        ],
      },
    },
  },
  release: {
    title: 'Release',
    intro: 'Manage yield and principal release',
    backToHub: 'Back to release',
    dash: '—',
    recordsEmpty: 'No indexed records yet',
    labels: {
      releasing: 'Releasing',
      released: 'Released',
      releasedPct: 'Released {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Claim failed. Please try again.',
    },
    hub: {
      aboutTitle: 'About release',
      aboutCardTitle: 'Release pool · yield & rewards',
      aboutCardBody:
        'The release pool turns instant sell pressure into a smooth multi-day flow. Each claim unlocks linearly over the selected period so protocol outflows stay aligned with ecosystem growth.',
      mechanismTitle: 'Yield claim flow',
      mechanismSubtitle:
        'Release sits between yield creation and Turbine — trade time for a lower tax rate and steadier exits.',
      mechanismSteps: [
        { title: 'Claim Rebase / DAO rewards', body: 'Yield is created' },
        { title: '6 : 1 contribution', body: '50% burn · 50% into X pool' },
        { title: 'Enter release pool', body: 'Choose 5 / 20 / 40 / 60 days' },
        { title: 'Claim into Turbine', body: '1:1 unlock sell quota' },
      ],
      taxTitle: 'Longer release, lower tax',
      taxPeriod: 'Period',
      taxRate: 'Claim tax',
      taxRows: {
        periods: ['5d', '20d', '40d', '60d'],
        rates: ['20%', '10%', '5%', '1%'],
      },
    },
    queue: {
      title: 'Release pool',
      intro:
        'Claimed yield unlocks here over the selected period. Released amounts can be claimed into Turbine anytime.',
      planDays: '{days}d',
      claim: 'Claim',
      claimSuccess: 'Claimed into Turbine quota',
      goTurbine: 'Go to Turbine',
      statsTitle: 'Release pool data',
      lifetimeClaimed: 'Lifetime claimed from pool',
      recordsTitle: 'Release pool records',
    },
    buffer: {
      title: 'Buffer pool',
      intro:
        'Redeemed principal unlocks here with a second linear release. Released AGX can be withdrawn to your wallet.',
      claim: 'Withdraw',
      claimSuccess: 'AGX withdrawn to wallet',
      gagxHint:
        'PrincipalReleaseVault settles AGX only. gAGX exits convert to AGX before entering the buffer.',
      statsTitle: 'Buffer pool data',
      entered: 'Total entered',
      extracted: 'Total withdrawn',
      recordsTitle: 'Buffer pool records',
      mechanismTitle: 'Principal release flow',
      mechanismSubtitle:
        'Stake and bond principal use a two-stage release model for market stability.',
      mechanismSteps: [
        { title: 'Stake / bond principal', body: 'Exit entry' },
        { title: 'Block-level release', body: 'Inside position' },
        { title: 'Buffer after redeem', body: '~30 days default' },
        { title: 'Second linear release', body: 'Withdraw to wallet' },
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'Can I change the release period?',
          a: 'Not for amounts already queued. New claims can pick a different period.',
        },
        {
          q: 'When is the tax taken?',
          a: 'When you claim unlocked amounts, using the plan fee rate.',
        },
        {
          q: 'Where does a release-pool claim go?',
          a: 'On-chain AGX enters Turbine sell quota; then use Turbine to obtain gAGX.',
        },
        {
          q: 'Do I lose unlocked amounts if I wait?',
          a: 'No. Unlocked amounts stay claimable.',
        },
        {
          q: 'How do I pick a period?',
          a: 'Longer periods have lower tax. Choose among 5 / 20 / 40 / 60 days.',
        },
      ],
      queue: [
        {
          q: 'Can I change the release period?',
          a: 'Not for amounts already queued.',
        },
        {
          q: 'When is the tax taken?',
          a: 'On claim of unlocked amounts.',
        },
        {
          q: 'Where does a release-pool claim go?',
          a: 'Into Turbine quota — open Exchange → Turbine.',
        },
        {
          q: 'Do I lose unlocked amounts if I wait?',
          a: 'No.',
        },
        {
          q: 'How do I pick a period?',
          a: 'Longer periods, lower tax.',
        },
      ],
      buffer: [
        {
          q: 'What is the buffer pool?',
          a: 'PrincipalReleaseVault — second-stage linear release after redeem/unstake.',
        },
        {
          q: 'Do buffer assets still earn yield?',
          a: 'No staking yield accrues while in the buffer.',
        },
        {
          q: 'How do I withdraw released amounts?',
          a: 'Tap Withdraw — AGX goes to your wallet.',
        },
        {
          q: 'Why show AGX and gAGX?',
          a: 'Design keeps both cards; on-chain buffer is AGX-only after gAGX conversion.',
        },
        {
          q: 'Why can’t I withdraw everything at once?',
          a: 'Only currently unlocked amounts are claimable.',
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
    communityVolume: '커뮤니티 실적',
    contribution: '구독',
  },
}) satisfies AppMessagesBundle

export default app
