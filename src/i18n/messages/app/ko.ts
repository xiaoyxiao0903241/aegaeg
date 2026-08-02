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
      reverts: {
        stakeAmountLimit: 'Daily stake limit reached. Lower the amount or wait for reset.',
        debtCapacityReached: 'Bond capacity is full. Please try again later.',
        turbineCooldown: 'Cooldown not finished or amount invalid. Refresh silences and retry.',
        pairNotExist: 'Trading pair does not exist. Check token configuration.',
        notWinner: 'You are not a winner for this round.',
        rewardAlreadyClaimed: 'Reward already claimed. Do not claim again.',
        configNotReady: 'Protocol config is not ready. Please try again later.',
        exceedsMax: 'Amount exceeds the maximum. Please lower it.',
        bondTooSmall: 'Bond payout is too small. Increase the purchase amount.',
        bondTooLarge: 'Bond exceeds max payout. Lower the purchase amount.',
        stakeNotExist: 'Position missing or already closed. Refresh and try again.',
        yieldUnavailable: 'No claimable yield or amount too high. Lower amount or wait to accrue.',
        operationPaused: 'This operation is paused. Please try again later.',
        belowMinAmount: 'Amount is below the minimum. Please increase it.',
        aboveMaxAmount: 'Amount exceeds the maximum. Please lower it.',
        zeroRate: 'Rate is not ready. Please try again later.',
        zeroAmount: 'Enter a valid amount.',
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
        body: 'gAGX from the release pool stays locked until you unlock it with USD1 at the live Turbine quote.',
      },
      {
        title: 'Rewards',
        body: 'Rewards include referral, participation, co-build, and more. Mixed claims (Lucky/co-build) spend contribution 1:1; participation and stipends use signed claims to wallet.',
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
      writeInFlight: 'Another write is already in progress. Please wait.',
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
          body: 'Buy unlocked Turbine gAGX with USD1',
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
          { title: 'Get contribution points', body: 'Burn AGX at {ratio} for contribution points' },
        ],
      },
      faq: {
        items: [
          {
            q: 'What can I do on the Swap page?',
            a: 'Flash-convert USDT to USD1 or gAGX to AGX, trade major tokens for AEGIS X assets on PancakeSwap, burn AGX for contribution points, and buy unlocked Turbine gAGX with USD1.',
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
      settlementValue: 'On-chain · seconds',
      aboutTitle: 'About',
      action: 'Flash',
      pairAriaLabel: 'Flash pair',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'Flash is paused. Please try again later.',
        belowMin: 'Amount is below the minimum swap limit.',
        aboveMax: 'Amount exceeds the maximum swap limit.',
        insufficientReserve: 'USD1 reserve is insufficient. Please try again later.',
        zeroRate: 'Exchange rate is unavailable. Please try again later.',
        insufficientOutput: 'Quote moved. Please try again.',
        transferMismatch: 'Token transfer amount mismatch. Please retry.',
        zeroAddress: 'Contract address is invalid. Please try again later.',
        sameToken: 'Token configuration is invalid. Please try again later.',
        zeroAmount: 'Enter an amount greater than zero.',
        notAuthorized: 'This action is not authorized.',
        invalidLimits: 'Swap limits are misconfigured. Please try again later.',
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
          {
            q: 'Where can I see Flash history?',
            a: 'Flash swaps settle on-chain in seconds. Confirm each transaction in your wallet or a block explorer.',
          },
        ],
      },
    },
    trade: {
      title: 'Trade',
      intro: 'PancakeSwap live rate · on-chain settlement',
      aboutTitle: 'About',
      selectSellToken: 'Select sell token',
      selectBuyToken: 'Select buy token',
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
      destinationValue: 'Black hole address · permanently burned',
      providerName: 'AEGIS X',
      openProvider: 'View contribution swap on BscScan',
      action: 'Burn',
      aboutTitle: 'About',
      blocked: {
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
        emptyBurn:
          'No burn records yet. After you burn AGX for contribution points, each transaction will appear here.',
        emptyConsume:
          'No consumption records yet. After claiming rewards that consume contribution points, each record will appear here.',
        tabsAriaLabel: 'Burn history tabs',
        testContribution: 'Set contribution (test)',
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
            a: 'Per on-chain split config, about {burnPct}% goes to the black-hole address permanently; about {injectPct}% may be injected into LP liquidity.',
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
      aboutTitle: 'About',
      segmentAriaLabel: 'Turbine actions',
      segments: {
        unlock: 'Unlock',
        claim: 'Claim',
      },
      unlockLabel: 'Unlock',
      unlockable: 'Unlockable',
      equivalentBuyHint: 'Unlocking buys matching AGX at the live quote',
      payUsd1Label: 'Pay USD1',
      buyAgxLabel: 'Buy AGX',
      buyToBoundWallet: 'Bought to wallet',
      agxPrice: 'AGX price',
      willReceiveAgx: 'AGX you will receive',
      unlockRatio: 'Unlock ratio',
      cooldown: 'Cooldown',
      cooldownHoursValue: '{hours}h',
      unlockAction: 'Unlock',
      unlockSuccess: 'Unlocked — cooldown started',
      claimAction: 'Claim',
      claimSuccess: 'Claimed successfully',
      claimEmpty: 'No unlock records yet',
      claimReady: 'Ready to claim',
      claimCoolingUntil: 'Cooling · {time}',
      dataTitle: 'Turbine data',
      recordsTitle: 'Turbine records',
      recordsEmpty:
        'No turbine records yet. After rewards enter Turbine from the release pool, each action will appear here.',
      mechanismTitle: 'Turbine mechanism',
      mechanismIntro:
        'Bind sell liquidity to buy demand so every unlock is paired with an equal buy',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
        },
        {
          title: 'Adaptive cooldown',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'Pending unlock gAGX',
        cooling: 'Cooling gAGX',
        totalWithdrawn: 'Total withdrawn',
      },
      faq: {
        items: [
          {
            q: 'How does gAGX enter Turbine?',
            a: 'After RewardQueue (and related) claims, rewards credit Turbine as unlockable quota (turbineBalances).',
          },
          {
            q: 'Why is a buy required to unlock?',
            a: 'Unlock settles with USD1. Exact payment comes from the live on-chain quote — not a fixed 1:1.',
          },
          {
            q: 'Unlock vs claim?',
            a: 'Unlock pays USD1 to buy AGX and start cooldown. Claim withdraws gAGX after the silence matures.',
          },
          {
            q: 'How long is the cooldown?',
            a: 'currentCooldownDuration — typically about 24–96 hours, adaptive to treasury health. The page shows the live period.',
          },
          {
            q: 'Where does the purchased AGX go?',
            a: 'Bought AGX goes to your wallet; matured silences are claimed separately as gAGX.',
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
          key: 'gagxStake',
          title: 'gAGX · Staking voucher',
          body: 'An interest-bearing voucher from staking AGX, with auto-compounding yield and unlocked governance weight and higher titles.',
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
              q: 'How do I get USD1?',
              a: 'Use the “Get USD1” entry on the Swap hub at PancakeSwap market rates, or swap AGX, X, and other ecosystem tokens on the Trade page.',
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
            {
              q: 'Where does AGX value support come from?',
              a: 'AGX is minted with 150% over-collateralization backed by think-tank reserves, and forms a long-term value loop through staking, bonds, Rebase compounding, and buyback-and-burn.',
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
            {
              q: 'Why does X stay deflationary?',
              a: 'X has a fixed 210 million supply with no further minting, and 25% of each sell is burned. Growth-driven demand plus ongoing burns shrink circulating supply over time.',
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
    introEnded: 'The X DAO co-build program has concluded · Thank you to all co-builders',
    shares: '지분 (1지분 = 100 USD1 · 최대 {max} 지분)',
    quota: '이번 페이즈 공동 구축 한도',
    pay: '지불',
    receive: '획득 AGX',
    value: '구독 가치',
    xTokenAirdrop: '예상 X 초기 에어드롭 가치',
    xTokenAirdropHint:
      '페이즈 누적 공동 구축 금액 ≥ {threshold} 시 에어드롭 보상 자격이 부여됩니다.',
    join: '공동 구축 참여',
    joinEnded: 'Co-build ended',
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
      aboutTitle: 'About AEGIS X rewards',
      balanceLabel: 'Balance',
      balancePlaceholder: '0.00',
      signInForBalance: 'Sign in to view',
      enterClaim: '수령하러 가기',
      sessionHint:
        'Complete wallet sign-in before claiming. Connecting a wallet is not the same as a business login.',
      stats: {
        totalRewards: 'Total rewards',
        tier: 'Co-build tier',
        tierEmpty: 'No co-build tier yet',
        personalHolding: '개인 보유',
        totalPerformance: '총 실적',
        smallAreaPerformance: '소구역 실적',
        contribution: 'Contribution points',
        contributionHint: 'Claims consume contribution 1:1.',
        goBurn: 'Go burn',
      },
      mechanismTitle: 'Co-build reward mechanism',
      mechanismBody: 'Co-build rewards come from team Rebase yield and are shared by tier.',
      mechanismFooter:
        'Any two lines that reach the required tier unlock promotion. Higher tiers earn higher rates, up to lifetime achievement and a global dividend.',
      aboutSlides: {
        lucky: {
          title: 'Lucky',
          body: 'Block-lucky draws for co-builders; claim via Mixed when won.',
        },
        referral: {
          title: 'Referral',
          body: 'Rewards from direct referrals; claim via CommunityFund signed claim.',
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
          { level: 'A1', holding: '$100', accounts: '2', team: 'Volume ≥ $6,000', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: 'Volume ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: 'Volume ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$500', accounts: '5', team: 'Volume ≥ $180,000', rate: '40%' },
          { level: 'A5', holding: '$1,000', accounts: '5', team: 'Volume ≥ $550,000', rate: '55%' },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: 'Two lines reach A5',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '5',
            team: 'Two lines reach A6',
            rate: '78%',
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
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '5',
            team: 'Two lines reach A12',
            rate: '130%',
          },
          {
            level: 'Lifetime achievement',
            holding: '$100,000',
            accounts: '5',
            team: 'Two lines reach A13',
            rate: '130% + global dividend 5%',
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
        aside: 'Direct-referral related rewards; claim via CommunityFund signature to wallet.',
      },
      participate: {
        title: 'Participation',
        body: 'Rewards from your referrer',
        aside:
          'Participation rewards from your referral bond; claim via IncentivePool signature to wallet.',
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
      daysTax: '{days}d · {tax}',
      taxRate: 'Tax {rate}%',
      requiredContributionLabel: 'Contribution required this claim',
      insufficientContributionDetail: 'Insufficient contribution (need {need}, have {have}), ',
      goBurnInline: 'Go burn',
      getContributionSuffix: ' to get contribution points.',
      releaseInto: 'To release queue',
      restakeInto: 'To single-asset stake',
      restakeLabel: 'Restake',
      tokenGagx: 'gAGX',
      ctaReleaseLine: 'Claim {amount}',
      ctaRestakeLine: 'Restake {amount}',
      requiredContribution: 'Contribution required this claim: {amount}',
      insufficientContribution: 'Insufficient contribution points. Burn to top up.',
      goBurn: 'Get contribution points',
      luckyPaused: 'Lucky pool is paused; claims are unavailable.',
      luckyNotClaimable: 'No lucky reward available to claim.',
    },

    lucky: {
      dataTitle: 'Data',
      todayPool: 'Today prize pool',
      eligibility: 'Today eligibility',
      cumulativeWins: 'Cumulative wins',
      vrfTitle: 'Chainlink VRF v2 verifiable randomness',
      vrfBody:
        'Lucky draws use Chainlink VRF v2 with the staking contracts: randomness is generated on-chain with a cryptographic proof, then winners are selected from that day’s eligibility list. No human intervention; anyone can verify on-chain.',
      verifyTutorial: 'Verification guide',
      resultsTitle: 'Draw results',
      dateFilterAria: 'Select draw date',
      resultsSummary: 'Draw · {count} winners',
      verifyHash: 'Verify round hash {hash}',
      resultsColumns: ['Rank', 'Winner', 'Stake', 'Prize'],
      emptyResults: 'No draw results yet',
      historyTitle: 'Draw history',
      historyColumns: ['Date', 'Stake', 'Result', 'Verify'],
      emptyHistory: 'No draw history yet',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How do I become eligible?',
            a: 'The first stake or bond of the day at or above $5,000 automatically grants that day’s eligibility. One eligibility per address per day.',
          },
          {
            q: 'How is the draw settled?',
            a: 'At 00:00 UTC, Chainlink VRF v2 produces verifiable randomness; the contract selects up to 10 winners from that day’s list to share the pool (daily pool target ≥ $5,000).',
          },
          {
            q: 'How do I verify fairness?',
            a: 'VRF randomness includes an on-chain proof. Use the verify link next to each result and the verification guide to recompute winners. Results are immutable.',
          },
          {
            q: 'How are prizes paid?',
            a: 'Prizes convert to gAGX at draw-time value and accumulate on the Lucky card. Claim via Mixed rules (1:1 contribution, release queue or restake).',
          },
          {
            q: 'Why am I not eligible after staking $5,000?',
            a: 'Eligibility uses settlement mark-to-market. If price moves so the recorded stake is below $5,000, that day has no eligibility. Leave a buffer.',
          },
          {
            q: 'Does liquid staking grant eligibility?',
            a: 'No. Liquid stake has a per-day per-user cap below $5,000, so it cannot meet the eligibility threshold.',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'Data',
      totalRewards: 'Total rewards',
      myPosition: 'My position',
      directCount: 'Direct referrals',
      contribution: 'Contribution points',
      contributionHint: 'Display only; simple claim does not burn contribution',
      nextPayout: 'Next reward payout',
      recordsTitle: 'Referral reward records',
      recordsColumns: ['Time', 'Amount', 'Status', 'Claimed at'],
      emptyRecords: 'No reward records yet. Entries appear after rewards are issued.',
      referralsTitle: 'My referrals',
      referralsColumns: ['Joined', 'Address', 'Position', 'Cumulative referral rewards'],
      emptyReferrals: 'No direct referrals yet. Share your invite link to list partners here.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How are referral rewards calculated?',
            a: 'You earn 10% of each direct referral’s Rebase yield, settled on-chain and accumulated on the Referral card.',
          },
          {
            q: 'What are the conditions?',
            a: 'Your stake/bond position value must stay above $100. Then each direct referral’s Rebase yield accrues your share.',
          },
          {
            q: 'Why no reward when my position shows $100?',
            a: 'AGX price moves; at settlement your position may be marked $99.99 and miss the threshold. Keep a buffer.',
          },
          {
            q: 'If my referral holds much more than I do, do I still get the full 10%?',
            a: 'Yes. Meeting the >$100 condition earns the full 10% of their Rebase yield, regardless of position size gap.',
          },
          {
            q: 'How do I claim referral rewards?',
            a: 'Submit a CommunityFund signed claim in the left panel: unlocked balance to wallet — no Mixed release/restake.',
          },
          {
            q: 'What is direct referral count?',
            a: 'Wallets that bound via your invite link and completed first participation. Only the first layer counts.',
          },
          {
            q: 'Do rewards continue if a partner exits?',
            a: 'Rewards track their active position: they continue while that position earns; they stop after full exit. Already earned amounts stay.',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'Data',
      totalRewards: 'Total rewards',
      myPosition: 'My position',
      contribution: 'Contribution points',
      contributionHint: 'Display only; simple claim does not burn contribution',
      nextPayout: 'Next reward payout',
      recordsTitle: 'Participation reward records',
      recordsColumns: ['Time', 'Amount', 'Status', 'Claimed at'],
      emptyRecords: 'No reward records yet. Entries appear after rewards are issued.',
      inviterTitle: 'My referrer',
      inviterColumns: ['Bound at', 'Address', 'Position', 'Cumulative rewards brought'],
      emptyInviter: 'No referrer binding yet. Bind via an invite link to list your referrer here.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Where do participation rewards come from?',
            a: 'After you bind via your referrer’s invite link and join co-build, you earn participation rewards from that relationship, settled on-chain and accumulated on the Participate card.',
          },
          {
            q: 'How are participation rewards calculated?',
            a: 'You earn 10% of your referrer’s Rebase yield on the portion matching your position size. Example: you hold $10,000 and your referrer holds $1,000 — their full position is within your match, so you earn 10% of all their Rebase; if they hold $20,000, you only earn 10% of the $10,000 matched portion.',
          },
          {
            q: 'What are the conditions?',
            a: 'Bind via your referrer’s invite link, and keep your stake/bond position value above $100.',
          },
          {
            q: 'Why no reward when my position shows $100?',
            a: 'AGX price moves; at settlement your position may be marked $99.99 and miss the threshold. Keep a buffer.',
          },
          {
            q: 'How do I claim participation rewards?',
            a: 'Submit an IncentivePool signed claim in the left panel: no contribution burn and no release queue — gAGX goes straight to your wallet.',
          },
          {
            q: 'Can I change my referrer?',
            a: 'No. The referral binding is written on-chain at first bind and is permanent.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'Data',
      totalRewards: 'Total rewards',
      totalPerformance: 'Total performance',
      myPosition: 'My position',
      directCount: 'Direct referrals',
      contribution: 'Contribution points',
      contributionHint: 'Claims spend 1:1',
      nextPayout: 'Next reward payout',
      tierTitle: 'Co-build tier',
      tierCurrent: 'Current tier',
      tierNext: 'Next tier',
      reqHolding: 'Personal holding',
      reqHoldingHint: 'Stake and bond position value',
      reqAccounts: 'Active accounts',
      reqAccountsHint: 'Active direct referrals',
      reqPerformance: 'Total performance',
      reqPerformanceHint: 'All downline position value',
      recordsTitle: 'Reward records',
      recordsTabsAria: 'Reward record type',
      recordsTabCobuild: 'Co-build',
      recordsTabEqualize: 'Equalize',
      recordsColumns: ['Time', 'Tier', 'Amount', 'Status', 'Claimed at'],
      emptyRecordsCobuild: 'No reward records yet. Entries appear after rewards are issued.',
      emptyRecordsEqualize: 'No equalize records yet. Entries appear after rewards are issued.',
      directsTitle: 'Direct referrals',
      directsColumns: ['Joined', 'Address', 'Position', 'Tier'],
      emptyDirects: 'No direct referrals yet. Share your invite link to list partners here.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How are co-build rewards calculated?',
            a: 'Co-build rewards come from team Rebase yield and pay at your tier bonus rate (A1 10% through A13 130%). See the hub co-build mechanism table.',
          },
          {
            q: 'What is the equalize reward?',
            a: 'When a downline team catches up to or surpasses your tier, their co-build reward no longer feeds your differential. Equalize pays you 10% of that downline co-build reward as compensation.',
          },
          {
            q: 'Is there a tier limit for equalize?',
            a: 'Yes. Equalize only covers downlines within two tiers above you. Example: at A2 you can equalize A3/A4; A5+ is out of range until you promote.',
          },
          {
            q: 'How do I promote co-build tiers?',
            a: 'A1–A5 use personal holding, active accounts, and team volume. From A6, promotion uses the dual-leg rule (any two legs at the required tier); A6–A9 also allow a single-leg path plus other-leg volume.',
          },
          {
            q: 'How is team performance counted?',
            a: 'Team performance is the mark-to-market value of stake and bond positions across your entire referral tree at settlement.',
          },
          {
            q: 'How do I claim co-build and equalize rewards?',
            a: 'Use the left panel to split claim vs restake: claim enters the release queue; restake enters single-asset stake. Both spend contribution 1:1. Equalize history is under Reward records tabs on the right.',
          },
          {
            q: 'When does a new tier rate apply?',
            a: 'Tiers re-evaluate at daily settlement. The next co-build payout uses the new rate; equalize coverage updates with the new tier.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: 'Pending approval',
      pendingHint: 'Moves to claimable after approval',
      pendingBody: 'Contact support to unlock stipends; claim only after approval.',
      contactSupport: 'Contact support to unlock',
      claimIntoWallet: 'To wallet',
      ctaToWallet: 'Claim {amount} to wallet',
      dataTitle: 'Data',
      tier: 'Co-build tier',
      totalClaimed: 'Total claimed rewards',
      recordsTitle: 'Stipend records',
      recordsTabsAria: 'Stipend record type',
      recordsTabIssue: 'Issued',
      recordsTabClaim: 'Claimed',
      issueColumns: ['Issued at', 'Amount', 'Type', 'Hash', 'Rate', 'Stipend'],
      claimColumns: ['Claimed at', 'Amount', 'Hash'],
      emptyIssue: 'No issuance records yet. Entries appear after stipends accrue.',
      emptyClaim: 'No claim records yet. Entries appear after you claim.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'What is the development stipend?',
            a: 'A special fund to help co-builders expand markets—promotion, community events, channels—accruing with team stake positions.',
          },
          {
            q: 'What can the stipend be used for?',
            a: 'Market development only: offline salons and roadshows, community ops, promo materials, channel expansion.',
          },
          {
            q: 'How do I use the stipend?',
            a: 'Two paths: apply before spending (submit a plan and budget to support; approved amounts become claimable), or reimburse afterward with receipts and proof.',
          },
          {
            q: 'Why is my stipend pending approval?',
            a: 'Accrued stipends start pending until you submit a use plan or reimbursement proof and support approves. Progress shows in stipend records.',
          },
          {
            q: 'Does claiming spend contribution points?',
            a: 'No. Unlike other rewards, development stipends spend no contribution and skip the release queue—gAGX goes straight to your wallet.',
          },
        ],
      },
    },
    participateClaim: {
      claimIntoWallet: 'To wallet',
      ctaToWallet: 'Claim {amount} to wallet',
      simpleHint:
        'Participation uses IncentivePool signed claim; no contribution burn — gAGX goes to your wallet.',
    },
    referralClaim: {
      claimIntoWallet: 'To wallet',
      ctaToWallet: 'Claim {amount} to wallet',
      simpleHint:
        'Referral uses CommunityFund signed claim (handbook §9.5); claimable follows unlocked balance to wallet.',
    },

    genesisDetail: {
      pageTitle: 'Co-build rewards',
      pageSubtitle: 'Join co-build · share growth value',
      claimToWallet: 'Claim to wallet',
      tierColumns: ['Tier', 'Personal subscription', 'System performance', 'Reward rate'],
      recordsTabsAria: 'Genesis reward record type',
      recordsColumns: ['Time', 'Type', 'Amount', 'Status'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How are referral rewards calculated?',
            a: 'Referral rewards are 3% with compressed equal-amount settlement—only the matched amount counts; empty accounts skip reward layers; payouts settle automatically.',
          },
          {
            q: 'How do I advance Genesis tiers?',
            a: 'Advance gradually from S1 to S10 based on personal co-build amount and organization performance.',
          },
          {
            q: 'What is the tier uplift reward?',
            a: 'Tier rewards settle a share of team co-build volume by your Genesis tier and are claimed to wallet via RewardClaimer signatures.',
          },
          {
            q: 'How are Genesis team rewards settled?',
            a: 'Direct referral rewards auto-settle to your wallet; tier rewards and the development fund are claimed via RewardClaimer / CommunityFund signatures.',
          },
        ],
      },
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
    cobuildLevel: 'Co-build tier',
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
    blocked: {
      zeroAmount: 'Enter a valid amount',
      insufficientReward: 'Insufficient claimable yield',
      insufficientContribution: 'Not enough contribution points — burn AGX first',
      planUnresolved: 'Release/restake plan not ready — try again later',
      nothingToRedeem: 'Nothing available to redeem',
      warmupActive: 'Warmup still active',
      warmupNotEnded: 'Warmup countdown has not ended',
      noWarmup: 'No warmup stake to activate',
      unavailable: 'Transaction temporarily unavailable',
    },
    position: {
      sort: 'Sort',
      quoteCurrency: 'Quote currency',
      pageSize: 5,
      voucher: 'Voucher',
      remaining: 'Time left',
      staked: 'Staked',
      payout: 'Pending payout',
      bondPrincipal: 'Bond principal',
      yield: 'Yield',
      claim: 'Claim',
      redeem: 'Redeem',
      unlock: 'Unlock',
      unstake: 'Unstake',
      liquid: 'Flexible',
      lockedPrefix: 'Locked',
      redeemAnytime: 'Redeemable anytime',
      activateWarmup: 'Activate warmup',
      activateWarmupSuccess: 'Warmup activated',
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
      card: {
        position: 'Position',
        yield: 'Total yield',
      },
      modes: {
        stake: {
          title: 'Stake',
          body: 'Manage AGX flexible / term positions',
          aprHint: 'Includes rebase bonus and compounding; unclaimed yield in position only',
        },
        lpbond: {
          title: 'LP Bond',
          body: 'Manage liquidity bond positions',
          aprHint: 'Includes compounding; unclaimed yield in position only',
        },
        burnbond: {
          title: 'Burn Bond',
          body: 'Manage burn bond positions',
          aprHint: 'Includes compounding; unclaimed yield in position only',
        },
        xmine: {
          title: 'X Mine',
          body: 'Manage gAGX mining positions',
          aprHint: 'Unclaimed mining output in the position',
        },
      },
      overview: {
        title: 'Assets overview',
        totalValue: 'Total value',
        totalValueHint:
          'Mark-to-market of principal + unclaimed yield; shows — without a cross-product quote',
        claimable: 'Claimable yield',
        claimed: 'Claimed total',
        contribution: 'Contribution points',
        contributionHint: 'Claims consume 1:1 contribution',
        holdingsTitle: 'Holdings',
        holdingsReleased: 'Released',
        holdingsTotal: 'Total holdings',
        bufferTitle: 'Buffer pool',
        bufferTotal: 'Total',
        bufferReleased: 'Released',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'Switch buffer asset display',
      },
      distribution: {
        title: 'Holdings distribution',
        empty: 'No holdings yet. Stake or buy bonds to see distribution here.',
      },
      rebase: {
        title: 'Rebase yield release',
        subtitle:
          'Phased settlement and continuous release reduce volatility and support long-term growth',
        steps: [
          { title: 'Block', body: 'Block runtime\nBase unit' },
          { title: 'Epoch', body: '~14,400 blocks\n~12 hours' },
          { title: 'Rebase', body: 'Epoch end\nAuto settle' },
          { title: 'Rebase', body: 'Yield distribution\nTwice daily' },
        ],
        tags: ['Block-driven', 'Epoch settlement', 'Rebase distribution', 'Smooth release'],
        footer: 'Blocks drive cycles; Epochs settle; Rebase distributes yield',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How is total asset value calculated?',
            a: 'Sum of product principal and unclaimed yield valuations; shows — without a cross-product quote. Idle wallet balances are excluded.',
          },
          {
            q: 'In what form is yield paid?',
            a: 'Stake/bond rebase yield is in gAGX; X mine output is X.',
          },
          {
            q: 'Why can I not claim yield?',
            a: 'Mixed claims consume contribution; burn AGX for points first if short.',
          },
          {
            q: 'How do I earn contribution points?',
            a: 'Buy and burn AGX; claims consume contribution 1:1.',
          },
          {
            q: 'Why choose a release period when claiming?',
            a: 'Claimed yield enters the release queue and unlocks linearly; longer periods usually mean lower tax.',
          },
          {
            q: 'Where does claimed yield go?',
            a: 'Not instant wallet credit — into RewardQueue / release pool; claim vested amounts on Release.',
          },
          {
            q: 'Restake vs claim?',
            a: 'Restake can route yield into restake staking; claim unlocks over the chosen release period.',
          },
          {
            q: 'What is the buffer pool?',
            a: 'Redeemed principal enters PrincipalReleaseVault for secondary linear release (AGX on-chain). gAGX chrome stays; values show —.',
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
            { label: 'My holdings' },
            { label: 'Released' },
            { label: 'Pending release' },
            { label: 'Current Rebase yield' },
            { label: 'Current Rebase bonus' },
            { label: 'Total stake yield' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQs',
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
        intro: 'Manage each bond — claim yield or redeem principal anytime',
        empty: 'No LP bond positions yet. Buy a bond and each position will show here.',
        emptyCta: 'Buy your first LP Bond to start earning',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'My holdings' },
            { label: 'Released' },
            { label: 'Pending release' },
            { label: 'Current Rebase yield' },
            { label: 'Total LP Bond yield' },
          ],
        },
        ops: {
          title: 'Activity',
          empty: 'No activity yet. Stake, claim, or redeem to see records here.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Claim vs redeem?',
              a: 'Claim handles bond gAGX yield (release or restake). Redeem takes released AGX principal into a 30-day buffer before wallet credit.',
            },
            {
              q: 'Where does bond principal come from?',
              a: 'USD1 paid for an LP bond converts to AGX at a discount — that AGX is the bond principal. It unlocks linearly over 180/360/540 days; released amounts can be redeemed anytime.',
            },
            {
              q: 'Why is each bond shown separately?',
              a: 'Each bond has its own period, discount, yield, and vesting — so actions stay per position.',
            },
            {
              q: 'Can bond yield be restaked?',
              a: 'Yes. On claim, split release vs restake; restake routes into single-asset staking (360/540) with better tax than period claim.',
            },
            {
              q: 'What happens when the countdown ends?',
              a: 'Vesting is complete — redeem all principal anytime. Unclaimed yield keeps accruing.',
            },
            {
              q: 'Can I withdraw the LP of an LP bond?',
              a: 'No. AGX/USD1 LP is permanently locked to a burn address as protocol liquidity; you hold discounted AGX principal and its yield.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Burn Bond positions',
        intro: 'Manage each bond — claim yield or redeem principal anytime',
        empty: 'No burn bond positions yet. Buy a bond and each position will show here.',
        emptyCta: 'Buy your first Burn Bond to start earning',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'My holdings' },
            { label: 'Released' },
            { label: 'Pending release' },
            { label: 'Current Rebase yield' },
            { label: 'Total Burn Bond yield' },
          ],
        },
        ops: {
          title: 'Activity',
          empty: 'No activity yet. Stake, claim, or redeem to see records here.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Claim vs redeem?',
              a: 'Claim handles bond gAGX yield (release or restake). Redeem takes released AGX principal into a 30-day buffer before wallet credit.',
            },
            {
              q: 'Where does bond principal come from?',
              a: 'USD1 paid for a Burn bond converts to AGX at a discount — that AGX is the bond principal. It unlocks linearly over 180/360/540 days; released amounts can be redeemed anytime.',
            },
            {
              q: 'Why is each bond shown separately?',
              a: 'Each bond has its own period, discount, yield, and vesting — so actions stay per position.',
            },
            {
              q: 'Can bond yield be restaked?',
              a: 'Yes. On claim, split release vs restake; restake routes into single-asset staking (360/540) with better tax than period claim.',
            },
            {
              q: 'What happens when the countdown ends?',
              a: 'Vesting is complete — redeem all principal anytime. Unclaimed yield keeps accruing.',
            },
            {
              q: 'What impact does Burn Bond have on AGX?',
              a: 'Burn Bond proceeds buy AGX and permanently burn it to a dead address — reducing float and reinforcing deflation while you earn discounted principal and yield.',
            },
          ],
        },
      },
      xmine: {
        title: 'X Mine positions',
        intro: 'Manage each mining stake — claim output or redeem principal anytime',
        empty: 'No X Mine positions yet. Stake gAGX to start mining and see each position here.',
        emptyCta: 'Stake gAGX to mine X',
        periodPill: 'Mining stake',
        output: 'Output',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'My mining stake' },
            { label: 'Released' },
            { label: 'Current mining output' },
            { label: 'Total mining output' },
          ],
        },
        ops: {
          title: 'Activity',
          empty: 'No activity yet. Stake, claim, or redeem to see records here.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Claim output vs redeem stake?',
              a: 'Claim takes mining output: X goes to your wallet with no release period. Redeem targets principal: gAGX enters the buffer for a 30-day linear release and stops earning.',
            },
            {
              q: 'Why do some positions show Locked?',
              a: 'Each gAGX stake enters a 24h lock; you cannot redeem during the lock. After the countdown, it shows Redeemable anytime.',
            },
            {
              q: 'How is mining output calculated?',
              a: 'Settled daily at UTC 0 on a gold standard: USD value of staked gAGX × daily rate, paid in X. Amount moves with AGX and X prices.',
            },
            {
              q: 'Does mining output compound?',
              a: 'No automatic compound. Claim X manually; to grow the mining position, stake more gAGX (subject to quota).',
            },
            {
              q: 'Why does my stake quota change?',
              a: 'gAGX stake quota cannot exceed ≥180-day AGX bond holdings plus AGX stake. Raise bonds/long stake to raise quota; expiry lowers it.',
            },
            {
              q: 'Can I keep earning after redeem?',
              a: 'No. Redeemed gAGX stops mining once in the buffer; remaining stakes continue normally.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Staking',
    intro: 'Stake and bonds co-build — share Rebase compounding',
    body: 'Stake and bonds co-build — share Rebase compounding',
    backToHub: 'Back to Staking',
    amount: 'Amount',
    balance: 'Balance',
    max: 'Max',
    viewContract: 'View contract',
    blocked: {
      notBound: 'Bind a referral first',
      accountMigrated: 'This address has migrated — use the new address',
      migrationNotOpen: 'Account migration is not open yet',
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
          body: 'Stake AGX — rebase twice daily with compounding',
        },
        lpbond: {
          title: 'LP Bond',
          body: 'Build the pool with USD1 — get AGX at a discount',
        },
        burnbond: {
          title: 'Burn Bond',
          body: 'Mint AGX at a discount and burn permanently for deflation',
        },
        xmine: {
          title: 'X Mining',
          body: 'Stake gAGX to mine X ecosystem rewards without loss',
        },
        calc: {
          title: 'Yield Calculator',
          body: 'Estimate returns across periods and prices',
        },
      },
      overview: {
        title: 'Overview',
        metrics: [
          {
            id: 'tvl',
            label: 'Staked TVL',
            hint: 'Total AGX staked in the protocol and its USD estimate',
          },
          {
            id: 'mcap',
            label: 'Market cap',
            hint: 'Total value of circulating AGX',
          },
          {
            id: 'circulating',
            label: 'AGX circulating',
            hint: 'AGX currently in circulation',
          },
          {
            id: 'treasury',
            label: 'Treasury reserve',
            hint: 'Treasury assets backing minting, market making, and risk defense',
          },
          {
            id: 'price',
            label: 'AGX price',
            hint: 'AGX market reference price versus USD1',
          },
          {
            id: 'burned',
            label: 'Total burned',
            hint: 'AGX burned via burn bonds and contribution purchases',
          },
          {
            id: 'rebase',
            label: 'Current Rebase yield',
            hint: 'Settled once per Epoch (~12h); adjusts with protocol state',
          },
          {
            id: 'runway',
            label: 'Runway',
            hint: 'Estimated sustainable runtime from current treasury vs spend',
          },
          {
            id: 'stakers',
            label: 'Staker addresses',
            hint: 'Unique addresses that have staked',
          },
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
        columns: ['Period', 'Base daily yield', 'Yield bonus', 'Period yield'],
        rows: [
          { id: 'liquid', period: 'Flexible (term)' },
          { id: '180', period: '180d' },
          { id: '360', period: '360d' },
          { id: '540', period: '540d' },
        ],
      },
      runwayUnknown: '—',
      chart: {
        title: 'Metrics',
        metricTabs: {
          tvl: 'Staked TVL',
          mcap: 'Market cap',
        },
        metricAria: 'Metric switch',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How is Rebase settled?',
            a: 'The protocol runs on blocks: ~14,400 blocks = 1 Epoch (~12 hours). Rebase settles at each Epoch end — twice daily.',
          },
          {
            q: 'How is principal released?',
            a: 'Stake and bond principal use block-level linear release (~3s per block). After withdrawal, released principal enters a 30-day buffer release for smoother outflow.',
          },
          {
            q: 'How do Stake, LP Bond, and Burn Bond differ?',
            a: 'Stake deposits AGX for Rebase compounding. LP and Burn bonds spend USD1 for discounted AGX — LP builds permanent base liquidity; Burn permanently burns AGX for deflation. All three release principal linearly by period and earn Rebase.',
          },
          {
            q: 'In what form are rewards paid?',
            a: 'Rebase rewards across products settle as gAGX. Redeem gAGX 1:1 to AGX, or stake gAGX to mine X.',
          },
          {
            q: 'What does the treasury reserve do?',
            a: 'Treasury (USD1) backs the protocol: 150% over-collateralized AGX minting, AI market making, and risk defense. Runway estimates sustainable runtime from reserve vs spend.',
          },
          {
            q: 'How should I choose a product?',
            a: 'Prefer compounding → Stake. Want discounted AGX → LP or Burn Bond. Hold gAGX for ecosystem upside → X Mining. Use the calculator to compare periods first.',
          },
          {
            q: 'How do market cap and circulating supply work?',
            a: 'Circulating supply is AGX in circulation; market cap = circulating × price. Together with TVL and burned supply, they show lock rate and deflation progress.',
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
        lpbond: 'Bond purchase records',
        burnbond: 'Bond purchase records',
        xmine: 'My mining records',
      },
      recordColumns: ['Time', 'Period', 'Amount', 'Released', 'Tx hash'],
      bondRecordColumns: ['Time', 'Period', 'Paid', 'Discount', 'AGX received', 'Tx hash'],
      xmineRecordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
      recordsEmpty: {
        stake: 'No staking records yet. Complete a stake and each one will show up here.',
        lpbond: 'No purchase records yet. Buy an LP bond and each purchase will show up here.',
        burnbond: 'No purchase records yet. Buy a burn bond and each purchase will show up here.',
        xmine:
          'No mining records yet. Stake gAGX to start mining and each action will show up here.',
      },
      chartTitles: {
        stake: 'TVL (Staking) metrics',
        lpbond: 'TVL (LP Bond) metrics',
        burnbond: 'TVL (Burn Bond) metrics',
        xmine: 'TVL (X Mining) metrics',
      },
      chartRangeAria: 'Chart time range',
      chartRanges: ['1W', '1M', '1Y', 'All'],
      chartEmpty: 'No historical data yet',
      positionMetrics: [
        { label: 'My position' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
        { label: 'Current Rebase bonus' },
      ],
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
            bullets: [
              'gAGX mining rewards',
              'Market expansion & brand partnerships',
              'Ecosystem building & long-term growth',
            ],
          },
        ],
      },
    },

    stake: {
      title: 'Stake',
      intro: 'Stake AGX · rebase twice daily with compounding',
      periodLabel: 'Choose staking period',
      periodAria: 'Choose staking period',
      amountAria: 'Stake amount',
      amountBalance: 'Amount (wallet balance {balance} AGX)',
      submit: 'Stake',
      bindCta: 'Bind referral',
      success: 'Staked successfully',
      periods: {
        liquid: 'Flexible',
        d180: '180d',
        d360: '360d',
        d540: '540d',
      },
      meta: {
        baseDaily: 'Base daily yield',
        periodYield: 'Period yield',
        bonus: 'Yield bonus',
        lock: 'Lock days',
        remaining: 'Remaining quota',
        contract: 'View contract',
        lockLiquid: 'Flexible',
        lockDays: '{days}-day linear release',
      },
      overviewMetrics: [
        { label: 'Total staked' },
        { label: 'Current epoch' },
        { label: 'Next rebase' },
        { label: 'Current rebase yield' },
      ],
      mechanismTitle: 'How staking works',
      mechanism:
        'Flexible stake enters warmup before activation; term stakes lock in the selected pool. Rewards and principal exits are on Assets.',
      mechanismSteps: [
        {
          title: 'Stake AGX',
          body: 'Choose flexible or 180/360/540-day lock. Longer locks earn higher rebase bonus.',
        },
        {
          title: 'Daily rebase',
          body: 'Each epoch (~12h) settles; yield accrues as gAGX.',
        },
        {
          title: 'Release & claim',
          body: 'Principal unlocks linearly; claim or recycle gAGX from Assets.',
        },
      ],
      faq: [
        {
          q: 'How is staking yield calculated?',
          a: 'Rebase twice daily; daily yield is about 0.5%–1%. Longer locks earn higher bonuses: 180d ≥10%, 360d ≥15%, 540d ≥20%, adjusted with the rebase factor.',
        },
        {
          q: 'When can principal be withdrawn?',
          a: 'Principal unlocks linearly by block (~3s). Released amounts can be claimed anytime; claims enter a 30-day buffer release.',
        },
        {
          q: 'Is the reference APY fixed?',
          a: 'No. APY is indicative; actual yield moves with the rebase factor, protocol state, and market supply/demand.',
        },
        {
          q: 'Rebase yield vs rebase bonus?',
          a: 'Rebase yield compounds with each epoch while unclaimed. Rebase bonus is the term-lock add-on and does not compound while unclaimed — claim promptly.',
        },
        {
          q: 'In what form are rewards paid?',
          a: 'Staking rewards are paid as gAGX. Redeem 1:1 for AGX anytime, or stake gAGX in X Mining for X.',
        },
        {
          q: 'Can I exit before maturity?',
          a: 'No early exit. Principal unlocks linearly over the chosen period; only released amounts can be claimed. Pick a period that fits your plan.',
        },
        {
          q: 'What limits apply to flexible staking?',
          a: 'Flexible stakes earn no yield bonus and are limited by daily global and per-account quotas that reset daily (first come, first served).',
        },
        {
          q: 'Can one account have multiple stakes?',
          a: 'Yes. Each stake tracks its own period, yield, and release progress under My staking records.',
        },
      ],
    },
    lpbond: {
      title: 'LP Bond',
      intro: 'Build the base pool with USD1 and mint AGX at a discount',
      periodLabel: 'Select bond period',
      periodAria: 'LP bond period',
      amountAria: 'Purchase amount',
      amountBalance: 'Amount (wallet balance {balance} USD1)',
      submit: 'Buy',
      success: 'Purchased successfully',
      footnote:
        'The system auto-builds AGX/USD1 LP and burns it to the black hole for permanent base liquidity.',
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price ({pct}%)',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'LP bond TVL' },
        { label: 'Bond premium' },
        { label: 'Next Rebase payout' },
        { label: 'Current Rebase yield' },
      ],
      positionMetrics: [
        { label: 'My stake' },
        { label: 'Claimed' },
        { label: 'Pending release' },
        { label: 'Current Rebase reward' },
      ],
      mechanismTitle: 'How LP Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        {
          title: 'Buy LP Bond',
          body: 'Use USD1 to co-build the pool and mint AGX at a discount.',
        },
        {
          title: 'Auto-build LP',
          body: 'Contracts automatically build AGX/USD1 liquidity.',
        },
        {
          title: 'Blackhole lock',
          body: 'LP tokens go to the blackhole address — permanently locked.',
        },
      ],
      faq: [
        {
          q: 'What is an LP Bond?',
          a: 'Pay USD1 to co-build the pool: discount-mint AGX, auto-build AGX/USD1 LP, and burn LP to the black hole for permanent base liquidity.',
        },
        {
          q: 'How is the discount set?',
          a: 'Dynamic Bond Control adjusts with supply/demand: 180d 85%–100%, 360d 80%–100%, 540d 75%–100% — longer terms get better discounts.',
        },
        {
          q: 'Do I hold LP tokens after buying?',
          a: 'No. LP is burned to the blackhole. You receive discount-minted AGX that unlocks linearly over the bond term.',
        },
        {
          q: 'What is bond premium?',
          a: 'Premium is the gap between discount price and AGX market price. Positive premium means bonds beat spot purchase.',
        },
        {
          q: 'Can I redeem early?',
          a: 'No early redeem. Principal unlocks linearly by block; claim released amounts anytime.',
        },
        {
          q: 'Where does my USD1 go?',
          a: 'USD1 pairs with discount-minted AGX into AGX/USD1 LP; LP is burned to the blackhole as permanent protocol liquidity.',
        },
      ],
    },
    burnbond: {
      title: 'Burn Bond',
      intro: 'Discount-mint AGX and burn permanently for deflation',
      periodLabel: 'Select bond period',
      periodAria: 'Burn bond period',
      amountAria: 'Purchase amount',
      amountBalance: 'Amount (wallet balance {balance} USD1)',
      submit: 'Buy',
      success: 'Purchased successfully',
      footnote:
        'The system discount-mints AGX, auto-buys, and permanently burns to the black hole.',
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price ({pct}%)',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'Burn bond TVL' },
        { label: 'Bond premium' },
        { label: 'Next Rebase payout' },
        { label: 'Current Rebase yield' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase reward' },
      ],
      mechanismTitle: 'How Burn Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BurnBondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        {
          title: 'Pay USD1',
          body: 'Pick a release term and join Burn Bond at the current discount.',
        },
        {
          title: 'Discount-mint AGX',
          body: 'The system mints AGX at the matching discount rate.',
        },
        {
          title: 'Buy and burn forever',
          body: 'Auto-buy AGX and burn to the black hole for deflation.',
        },
      ],
      faq: [
        {
          q: 'What is a Burn Bond?',
          a: 'Pay USD1: discount-mint AGX, auto-buy AGX, and permanently burn it (Blackhole Lock) to reduce float and support long-term value.',
        },
        {
          q: 'How does it differ from LP Bond?',
          a: 'LP Bond builds permanent base liquidity; Burn Bond deflates float. Same discount bands (75%–100% by term); principal unlocks linearly either way.',
        },
        {
          q: 'What is bond premium?',
          a: 'Premium is the gap between discount price and AGX market price. Positive premium means bonds beat spot purchase.',
        },
        {
          q: 'Can I redeem early?',
          a: 'No early redeem. Principal unlocks linearly by block; claim released amounts anytime.',
        },
        {
          q: 'Where does my USD1 go?',
          a: 'USD1 enters treasury reserves for minting, market making, and risk defense; AGX is discount-minted, bought, and burned to the black hole.',
        },
      ],
    },
    xmine: {
      title: 'X Mine',
      intro: 'Stake gAGX to mine X ecosystem rewards',
      amountAria: 'gAGX stake amount',
      amountBalance: 'Amount (wallet balance {balance} gAGX)',
      quotaInline: 'Mining quota: {quota} gAGX',
      submit: 'Stake',
      success: 'Staked successfully',
      meta: {
        quota: 'Mining quota',
        daily: 'Daily yield',
        max: 'Max stake',
        lock: 'Lock',
        lockValue: 'Releases after 24 hours',
        h24: '24h',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'X Mine TVL' },
        { label: 'X price' },
        { label: 'Total mined' },
        { label: 'Daily yield rate' },
        { label: 'Next mining payout' },
      ],
      positionMetrics: [{ label: 'My mining stake' }, { label: 'Released' }, { label: 'Mined' }],
      mechanismTitle: 'How X Mine works',
      mechanism: 'Validate miningQuotaOf then stakeGagxForMining. Claim X and unstake on Assets.',
      mechanismSteps: [
        {
          title: 'Rebase + DAO rewards',
          body: 'Rewards settle uniformly as gAGX.',
        },
        { title: 'Stake gAGX', body: 'Staked gAGX enters a 24-hour lock.' },
        {
          title: 'Dynamic X allocation',
          body: 'X rewards allocate dynamically by protocol yield.',
        },
        {
          title: 'Unstake linear release',
          body: 'After unlock, gAGX releases linearly over ~30 days.',
        },
      ],
      faq: [
        {
          q: 'How do I join X Mine?',
          a: 'Stake gAGX to mine X. After staking, gAGX locks for 24 hours; X rewards allocate by protocol yield.',
        },
        {
          q: 'What is the stake cap?',
          a: 'gAGX stake cannot exceed your ≥180-day AGX bond holdings plus AGX stake total.',
        },
        {
          q: 'How does unstaking release assets?',
          a: 'Unlocked gAGX uses a ~30-day block-linear release to reduce sell pressure.',
        },
        {
          q: 'What is the X supply? Will it inflate?',
          a: 'Fixed 210M X, never inflated. 47.62% for LP liquidity; 52.38% for global rewards and growth.',
        },
        {
          q: 'How do I get gAGX?',
          a: 'gAGX is the unified settlement voucher for Rebase and DAO rewards from staking and bonds.',
        },
        {
          q: 'What else can gAGX do besides mining?',
          a: 'Redeem 1:1 to AGX for staking, or stake gAGX to mine X.',
        },
        {
          q: 'Why does X deflate?',
          a: 'Each X sell burns 25%. Growth increases demand while burns shrink supply.',
        },
        {
          q: 'What drives X value?',
          a: 'Mining demand, protocol revenue recirculation, and ecosystem growth reinforce X demand.',
        },
        {
          q: 'Why is the cap tied to bonds and long-term stake?',
          a: 'It keeps miners as long-term builders; more bonds or long stake raises the cap via miningQuotaOf.',
        },
      ],
    },
    calc: {
      title: 'Yield calculator',
      intro: 'Estimate yield across periods and prices — no on-chain tx',
      productAria: 'Product',
      products: {
        stake: 'Stake',
        lpbond: 'LP Bond',
        burnbond: 'Burn Bond',
        xmine: 'X Mine',
      },
      periodLabel: 'Select period',
      periodAria: 'Period',
      amountLabel: 'Amount',
      amountAria: 'Amount',
      price: 'Exit price',
      priceCurrent: 'Current price ${price}',
      priceAria: 'Price input',
      days: 'Hold days',
      dayBubble: 'Day {day}',
      daysAria: 'Hold days',
      submit: 'Calculate',
      result: {
        interest: 'Estimated yield',
        total: 'Total yield',
        rate: 'Yield rate',
        sellTotal: 'Sell proceeds',
        invested: 'Total invested',
        yieldBar: 'Yield {amount}',
        legend: {
          released: 'Released principal value',
          netYield: 'Net yield value',
          cost: 'Cost basis',
          grossYield: 'Total yield',
        },
      },
      aside: {
        result: 'Estimate',
        resultHint: 'Enter parameters on the left and tap Calculate.',
        tags: { day: 'Day {day}' },
        curve: 'Yield curve',
        curveHint: 'Cumulative yield by day; compounding continues if not redeemed at maturity',
        nodes: 'Key nodes',
        nodeEndLabel: 'Hold to day {day}',
        nodeCards: [
          { label: 'Breakeven day', hint: 'Selling from this day can realize positive yield' },
          { label: 'Principal fully released', hint: '' },
          { label: 'Hold to term end', hint: 'Cumulative yield vs principal' },
        ],
        notes: 'Notes',
        notesBody: 'Local estimate only — not an on-chain quote or yield promise.',
        notesItems: [
          'Yield compounds at base daily {daily}% (2 × rebase); term bonuses: 180d 10%, 360d 15%, 540d 20%.',
          'Only principal unlocked by the selected day counts; locked principal and its yield are excluded.',
          'After deducting 1/6 of yield for burn contribution points, released principal plus yield are sold at the exit price you set.',
          'Ignores claim tax and price volatility during release; results are illustrative and vary with protocol state.',
        ],
      },
    },
  },

  release: {
    title: 'Release',
    intro: 'Manage yield and principal release',
    backToHub: 'Back to release',
    recordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
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

      aboutSlides: [
        {
          title: 'Release pool · yield & rewards',
          body: 'The release pool turns instant sell pressure into a smooth multi-day flow. Each claim unlocks linearly over the selected period so protocol yield outflow stays aligned with ecosystem growth.',
        },
        {
          title: 'Buffer pool · principal second release',
          body: 'After stake/bond principal exits, funds enter the buffer for a second linear release that matches market absorption capacity.',
        },
      ],
      purposeTitle: 'Why release exists',
      purposeBody:
        'All yield passes through the release pool before Turbine. Spreading redemption over time cuts dump pressure; longer periods get lower tax rates to reward holding.',

      mechanismTitle: 'Yield claim flow',
      mechanismSubtitle:
        'Release sits between yield creation and Turbine — trade time for a lower tax rate and steadier exits.',
      mechanismSteps: [
        { title: 'Claim Rebase / DAO rewards', body: 'Yield is created' },
        { title: '6 : 1 contribution', body: '50% burn · 50% into X pool' },
        { title: 'Enter release pool', body: 'Choose 5 / 20 / 40 / 60 days' },
        { title: 'Claim into Turbine', body: 'Unlock sell quota with a USD1 buy at live quote' },
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
      mechanismBenefits: [
        'Avoid clustered unlocks',
        'Reduce sell pressure',
        'Smooth principal release',
        'Improve market stability',
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
