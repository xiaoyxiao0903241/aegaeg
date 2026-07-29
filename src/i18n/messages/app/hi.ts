import { defineMessages } from '~/i18n/messages/define-messages'
import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'वॉलेट कनेक्ट करें',
    language: 'भाषा',
    copy: 'कॉपी करें',
    claimable: 'दावा योग्य',
    max: 'अधिकतम',
    shareUnit: 'शेयर',
    confirm: 'पुष्टि करें',
    close: 'बंद करें',
    paginationTotal: 'कुल {total} प्रविष्टियाँ',
    paginationPerPage: 'प्रति पृष्ठ {size}',
    paginationPrev: 'पिछला पृष्ठ',
    paginationNext: 'अगला पृष्ठ',
  },
  errors: {
    api: {
      network: 'नेटवर्क कनेक्शन विफल। कनेक्शन जाँचें और फिर कोशिश करें।',
      timeout: 'अनुरोध समय समाप्त। बाद में फिर कोशिश करें।',
      unavailable: 'सेवा अस्थायी रूप से अनुपलब्ध है। बाद में फिर कोशिश करें।',
      badResponse: 'सर्वर प्रतिक्रिया असामान्य है। बाद में फिर कोशिश करें।',
      fallback: 'कुछ गलत हुआ। बाद में फिर कोशिश करें।',
    },
    chain: {
      fallback: 'ऑन-चेन कार्रवाई विफल। बाद में फिर कोशिश करें।',
    },
    walletNotConnected: 'पहले वॉलेट कनेक्ट करें और साइन इन करें।',
    quoteFailed: 'कोट विफल। बाद में फिर कोशिश करें।',
    loadFailed: 'लोड विफल। बाद में फिर कोशिश करें।',
    loginFailed: 'साइन-इन विफल। बाद में फिर कोशिश करें।',
    loginSignatureRejected: 'लॉगिन हस्ताक्षर अमान्य या समाप्त। फिर से साइन करें।',
    pageLoadFailed: 'पेज लोड नहीं हो सका',
    pageLoadFailedBody:
      'रेंडर करते समय त्रुटि हुई। जारी रखने के लिए रीलोड करें — वॉलेट जुड़ा रहता है।',
    reloadPage: 'पेज रीलोड करें',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'सह-निर्माण',
    rewards: 'पुरस्कार',
    release: 'Release',
    community: 'समुदाय',
    rewardsTooltip: 'रेफ़रल और टीम पुरस्कार देखें।',
    communityTooltip:
      'साझेदारों को सह-निर्माण के लिए आमंत्रित करें, इकोसिस्टम वृद्धि मूल्य और Genesis पुरस्कार साझा करें।',
    bscTooltip:
      'केवल BSC · AEGIS X BNB Smart Chain पर चलता है। नेटवर्क स्विचिंग अभी समर्थित नहीं है।',
  },
  topbar: {
    currentNetwork: 'वर्तमान नेटवर्क',
    openMenu: 'नेविगेशन खोलें',
    closeMenu: 'नेविगेशन बंद करें',
    hideDetails: 'विवरण पैनल छिपाएँ',
    showDetails: 'विवरण पैनल दिखाएँ',
    toggleTooltip: 'विवरण पैनल दिखाएँ या छिपाएँ',
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
      promoTitle: 'AEGIS X सुविधाओं का अन्वेषण करने के लिए कनेक्ट करें',
      promoBrandLine: 'भविष्य के मूल्य नेटवर्क की रक्षा करें',
      recordsTitle: 'अपने रिकॉर्ड देखने के लिए वॉलेट कनेक्ट करें',
      recordsBodyGenesis: 'कनेक्ट होने के बाद, आपका सह-निर्माण इतिहास यहाँ दिखाई देगा।',
      recordsBodyRewards: 'कनेक्ट होने के बाद, आपका पुरस्कार इतिहास यहाँ दिखाई देगा।',
      recordsBodyCommunity: 'कनेक्ट होने के बाद, आपके निमंत्रण रिकॉर्ड यहाँ दिखाई देंगे।',
    },
  },
  wallet: {
    connectTitle: 'वॉलेट कनेक्ट करें',
    connectIntroTitle: 'AEGIS X सुविधाओं का अन्वेषण करने के लिए कनेक्ट करें',
    connectIntroLink: 'AEGIS X सुविधाएँ ↗',
    connecting: 'कनेक्ट हो रहा है…',
    copyAddress: 'पता कॉपी करें',
    copied: 'कॉपी हो गया',
    copyFailed: 'कॉपी विफल। मैन्युअल कॉपी के लिए लंबा दबाएँ।',
    disconnect: 'डिस्कनेक्ट करें',
    reconnectWallet: 'वॉलेट पुनः कनेक्ट करें',
    reconnectHint: 'वॉलेट डिस्कनेक्ट हो गया। ऑन-चेन कार्यों के लिए पुनः कनेक्ट करें।',
    signInRequired: 'साइन इन करें',
    accountBanned: 'आपका खाता निलंबित कर दिया गया है। सहायता से संपर्क करें।',
    transactionErrors: {
      gasLimitTooLow:
        'Gas सीमा बहुत कम है। नेटवर्क शुल्क के लिए वॉलेट में पर्याप्त BNB रखें और फिर कोशिश करें।',
      gasEstimateFailed:
        'इस लेनदेन के लिए gas का अनुमान नहीं लगाया जा सका। नेटवर्क जांचें और फिर कोशिश करें।',
      insufficientFunds: 'नेटवर्क gas शुल्क चुकाने के लिए BNB अपर्याप्त है।',
      transactionFailed: 'लेनदेन विफल। कृपया बाद में फिर कोशिश करें।',
      transactionUnknown:
        'लेनदेन की स्थिति अज्ञात है। दोबारा सबमिट न करें — पहले वॉलेट या ब्लॉक एक्सप्लोरर जाँचें।',
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
      settlementValue: 'On-chain · seconds',
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
      claimEmpty: 'No cooldown records yet',
      claimReady: 'Ready to claim',
      claimCoolingUntil: 'Cooling · {time}',
      dataTitle: 'Turbine data',
      recordsTitle: 'Turbine records',
      recordsEmpty: 'No records yet',
      recordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
      mechanismTitle: 'Turbine mechanism',
      mechanismIntro: 'Bind sell liquidity to buy demand so every unlock pairs with a matching buy',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
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
    title: 'सह-निर्माण योजना',
    intro: 'X DAO सह-निर्माण कार्यक्रम में भाग लें · फेज़ {season}  ({discount} छूट)',
    introEnded: 'The X DAO co-build program has concluded · Thank you to all co-builders',
    shares: 'शेयर (1 शेयर = 100 USD1 · अधिकतम {max} शेयर)',
    quota: 'इस फेज़ की सह-निर्माण सीमा',
    pay: 'भुगतान',
    receive: 'AGX प्राप्त होगा',
    value: 'सदस्यता मूल्य',
    xTokenAirdrop: 'अनुमानित प्रारंभिक X एयरड्रॉप मूल्य',
    xTokenAirdropHint:
      'एयरड्रॉप पुरस्कार के लिए प्रति फेज़ संचयी सह-निर्माण भागीदारी ≥ {threshold} आवश्यक है।',
    join: 'सह-निर्माण में भाग लें',
    joinEnded: 'Co-build ended',
    joinGenesis: 'Genesis सह-निर्माण में शामिल हों',
    statsTitle: 'फेज़ {season} सह-निर्माण डेटा',
    startsIn: 'शुरू होने में',
    countdownUnits: { days: 'd', hours: 'h', minutes: 'm' },
    endsIn: 'इस फेज़ का शेष समय',
    referencePrice: 'AGX ओपनिंग संदर्भ मूल्य',
    discountLabel: 'छूट',
    discountRatio: 'इस फेज़ की छूट अनुपात',
    xAirdropRatio: 'X एयरड्रॉप अनुपात',
    airdropLabel: 'X एयरड्रॉप अनुपात',
    myContributions: 'मेरे सह-निर्माण रिकॉर्ड',
    totalContributed: 'इस फेज़ का सह-निर्माण',
    cumulativeContributed: 'कुल सह-निर्माण',
    globalLabel: 'वैश्विक कुल सह-निर्माण',
    globalBody:
      'वैश्विक मुख्य सह-निर्माताओं को एकत्रित कर AEGIS X वैश्विक इकोसिस्टम नेटवर्क का निर्माण करें।',
    viewContract: 'कॉन्ट्रैक्ट देखें',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'सह-निर्माण योजना में कैसे भाग लें?',
          a: 'उपयोगकर्ता USD1 से सह-निर्माण में भाग लेते हैं और संबंधित चरण छूट के अनुसार AGX प्राप्त करते हैं। {phaseCount} चरण, छूट क्रमशः {discounts}।',
        },
        {
          q: 'सह-निर्माण सीमा और भागीदारी आवश्यकताएँ?',
          a: 'न्यूनतम {minUsd}, {shareIncrement} USD1 के गुणकों में भाग लें। प्रति चरण सीमा: {phaseQuotas}।',
        },
        {
          q: 'सह-निर्माण चक्र कितना लंबा है?',
          a: 'सह-निर्माण से प्राप्त AGX 540 दिनों की रिलीज़ अवधि में जारी होता है।',
        },
        {
          q: 'X एयरड्रॉप पुरस्कार कैसे प्राप्त करें?',
          a: 'एक खाते की संचयी सह-निर्माण राशि {threshold} तक पहुँचने पर संबंधित चरण X एयरड्रॉप पुरस्कार के लिए पात्र। {phaseCount} चरण एयरड्रॉप अनुपात: {airdropRatios}।',
        },
        {
          q: 'X एयरड्रॉप पुरस्कार कैसे जारी होता है?',
          a: 'X एयरड्रॉप पुरस्कार 12 महीनों में रैखिक रिलीज़, प्रति माह लगभग 8.33%; पहली रिलीज़ X स्टेकिंग प्रोटोकॉल लॉन्च के 30 दिन बाद, स्मार्ट कॉन्ट्रैक्ट द्वारा स्वचालित निष्पादन।',
        },
      ],
    },
    promoTitleTemplate: 'Genesis सह-निर्माण फेज़ {season}  {discount} छूट',
    promoLive: 'चल रहा है — सीमित कोटा, {endDate} तक',
    promoUpcoming: 'जल्द शुरू — सीमित कोटा, {startDate} से',
    promoEnded: '{status} · {date}',
    joinSuccess: 'सदस्यता सफल',
    insufficientUsd1: 'USD1 शेष राशि अपर्याप्त। भाग लेने से पहले पर्याप्त USD1 प्राप्त करें।',
    insufficientAllowance: 'USD1 अनुमोदन अपर्याप्त। पहले अनुमोदन पर क्लिक करें।',
    purchaseUnavailable: 'वर्तमान में सदस्यता लेना संभव नहीं। शेयर या फेज़ स्थिति जाँचें।',
    walletNotConnected: 'वॉलेट डिस्कनेक्ट। लेनदेन हस्ताक्षर के लिए पुनः कनेक्ट करें।',
    errors: {
      notBound: 'भाग लेने से पहले रेफ़रर बाइंड करें।',
      paused: 'सदस्यता रुकी हुई है। कृपया बाद में पुनः प्रयास करें।',
      invalidAmount: 'राशि 100 USD के गुणक में होनी चाहिए।',
      phaseInactive: 'यह फेज़ शुरू नहीं हुआ या समाप्त हो चुका है।',
      belowMin: 'राशि इस फेज़ की न्यूनतम सीमा से कम है।',
      soldOut: 'यह फेज़ बिक चुका है।',
      userLimitExceeded: 'इस फेज़ की प्रति वॉलेट सीमा से अधिक। राशि घटाएँ।',
      invalidPhase: 'अमान्य फेज़।',
      systemConfig: 'सिस्टम कॉन्फ़िगरेशन त्रुटि। कृपया बाद में पुनः प्रयास करें।',
    },
    contributionsSyncPending:
      'ऑन-चेन सदस्यता पुष्टि हो गई, इतिहास सिंक हो रहा है, कृपया बाद में रिफ़्रेश करें।',
    contributionsEmpty: {
      title: 'अभी कोई सह-निर्माण रिकॉर्ड नहीं',
      body: 'सह-निर्माण कार्यक्रम समाप्त हो गया है। जिन खातों ने भाग नहीं लिया, उनके यहाँ कोई रिकॉर्ड नहीं है.',
    },
    goBindReferrer: 'रेफ़रर बाँधें',
    seasonLive: 'चल रहा है',
    seasonEnded: 'समाप्त',
    seasonUpcoming: 'जल्द शुरू',
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
      balancePlaceholder: '—',
      signInForBalance: 'Sign in to view',
      enterClaim: 'Enter to claim',
      sessionHint:
        'Complete wallet sign-in before claiming. Connecting a wallet is not the same as a business login.',
      stats: {
        totalRewards: 'Total rewards',
        tier: 'Co-build tier',
        tierEmpty: 'No co-build tier yet',
        personalHolding: 'Personal holding',
        totalPerformance: 'Total performance',
        smallAreaPerformance: 'Small-area performance',
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
        aside:
          '10% of direct-referral Rebase yield settles on-chain; claim via Mixed with 1:1 contribution.',
      },
      participate: {
        title: 'Participation',
        body: 'Rewards from your referrer',
        aside:
          'Participation rewards from your referral bond; claim via Mixed with 1:1 contribution.',
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
      referralWritePending: 'Referral Mixed claim is not wired yet; submit stays disabled.',
      participateWritePending:
        'Participation Mixed claim is not wired yet (handbook only lists IncentivePool simple claim); submit stays disabled.',
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
      contributionHint: 'Claims spend 1:1',
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
            a: 'Use the left panel to split claim vs restake: claim enters the release queue; restake enters single-asset stake. Both spend contribution 1:1.',
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
      contributionHint: 'Claims spend 1:1',
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
            a: 'Use the left panel to split claim vs restake: claim enters the release queue; restake enters single-asset stake. Both spend contribution 1:1.',
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
    currentTitle: 'वर्तमान स्तर',
    postLaunchRankTitle: 'लॉन्च के बाद स्तर',
    teamRewardRate: 'टीम पुरस्कार {rate}',
    postLaunch30DayRank: 'लॉन्च के 30 दिनों के भीतर आप {rank} तक पहुँच सकते हैं',
    postLaunchMaxRank: 'आप अधिकतम स्तर पर पहुँच गए हैं',
    postLaunchRankTooltip:
      'लॉन्च के बाद, स्तर टीम सह-निर्माण राशि के AGX में छूट मूल्य पर रूपांतरण के आधार पर वास्तविक प्रदर्शन से गणना होगी।\nवर्तमान स्तर केवल प्रदर्शन डेटा पर आधारित है; लॉन्च के बाद अन्य कारक भी प्रभाव डाल सकते हैं, जैसे व्यक्तिगत होल्डिंग और योग्य प्रत्यक्ष रेफरल।\nयह जानकारी केवल संदर्भ के लिए है; लॉन्च के बाद वास्तविक डेटा अंतिम होगा।',
    superCommunityBadge: 'सुपर प्रणाली',
    heroTierRewardBody: 'टीम सह-निर्माण राशि पर {bonus} पुरस्कार प्राप्त करें।',
    superCommunityBenefitBody: 'सुपर प्रणाली को समर्पित विकास कोष और शासन अधिकार प्राप्त होते हैं।',
    shareholderHintNoRank: 'Genesis स्तर',
    shareholderNoRankTitle: 'आप अभी Genesis रिज़र्व गवर्नर नहीं बने हैं',
    shareholderNoRankBody:
      'Genesis रिज़र्व गवर्नर बनने पर टीम सह-निर्माण राशि का 1%-10% पुरस्कार मिलता है, और AEGIS X लॉन्च के 30 दिनों में 1 स्तर अपग्रेड होता है।',
    shareholderTitleForRank: '{rank} · Genesis रिज़र्व गवर्नर',
    heroKicker: 'GENESIS स्तर',
    currentTierSuffix: 'वर्तमान',
    progressPersonalTo: '{rank} तक · व्यक्तिगत सदस्यता',
    progressMaxPersonal: 'उच्चतम व्यक्तिगत स्तर प्राप्त',
    progressMaxTeam: 'उच्चतम टीम स्तर प्राप्त',
    teamLegRequirement: 'दो {rank} लाइनें',
    tierDualLegRequirement: '2 {rank} लाइनें',
    teamQualifiedPartitionsLabel: '{rank} लाइनें {count}/2',
    teamVolume: 'नेटवर्क प्रदर्शन',
    referralRewards: 'प्रत्यक्ष रेफ़रल पुरस्कार',
    autoPaidLabel: 'स्वचालित भुगतान',
    autoPaid: 'पुरस्कार स्वचालित रूप से वॉलेट में निपटान',
    teamRewards: 'स्तर पुरस्कार',
    claimed: 'दावा किया {amount}',
    heroTitle: 'वर्तमान स्तर',
    allTiers: 'Genesis सम्मान प्रणाली',
    history: 'पुरस्कार रिकॉर्ड',
    referralHistoryEmpty: {
      title: 'अभी कोई रेफ़रल पुरस्कार रिकॉर्ड नहीं',
      body: 'आपके रेफ़री Genesis के दौरान सदस्यता पूरी करने के बाद रेफ़रल पुरस्कार यहाँ दिखाई देंगे।',
    },
    teamHistoryEmpty: {
      title: 'अभी कोई टीम पुरस्कार रिकॉर्ड नहीं',
      body: 'टीम पुरस्कार निपटान और दावा रिकॉर्ड पुरस्कार उत्पन्न होने के बाद यहाँ दिखाई देंगे।',
    },
    communityFund: 'विकास कोष',
    communityFundTooltip:
      'सुपर प्रणालियों को 5% प्रणाली विकास कोष मिलता है, जो प्रणाली स्व-संचालन के लिए समर्पित है, जिसमें सिस्टम निर्माण, दैनिक संचालन, प्रणाली बैठकें और प्रणाली व्याख्याता शामिल हैं।',
    communityFundLocked: 'लॉक: {amount}',
    communityFundUnlockedSuffix: 'अनलॉक',
    communityFundClaimed: 'आपने दावा किया {amount}',
    communityFundHistory: 'विकास कोष',
    communityFundCumulativeClaimed: 'कुल दावा {amount}',
    communityFundHistoryEmpty: {
      title: 'अभी कोई विकास कोष रिकॉर्ड नहीं',
      body: 'विकास कोष दावा रिकॉर्ड पुरस्कार उत्पन्न होने के बाद यहाँ दिखाई देंगे।',
    },
    rewardType: {
      referralPaid: 'रेफ़रल पुरस्कार',
      referralWithdrawn: 'रेफ़रल पुरस्कार दावा',
      marketTeam: 'मार्केट मेकर टीम पुरस्कार',
      presaleTeam: 'प्रीसेल टीम पुरस्कार',
      unknown: '—',
    },
    logStatus: {
      pending: 'लंबित',
      processing: 'प्रसंस्करण',
      paid: 'भुगतान हो चुका',
      claimed: 'दावा किया',
      failed: 'विफल',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'आपने पहले ही रेफ़रर जोड़ लिया है।',
      parentNotBound: 'रेफ़रर अभी जुड़ा नहीं है। कृपया उनसे संपर्क करें।',
      selfReferral: 'आप अपना ही पता उपयोग नहीं कर सकते।',
      invalidParent: 'कृपया मान्य रेफ़रर पता दर्ज करें।',
      migratedAccount: 'यह पता माइग्रेट हो चुका है। नया पता उपयोग करें।',
      systemConfig: 'सिस्टम कॉन्फ़िगरेशन त्रुटि। कृपया बाद में पुनः प्रयास करें।',
      failed: 'जोड़ना विफल। कृपया बाद में पुनः प्रयास करें।',
    },
    title: 'समुदाय',
    intro:
      'साझेदारों को सह-निर्माण के लिए आमंत्रित करें, इकोसिस्टम वृद्धि मूल्य और Genesis पुरस्कार साझा करें।',
    disconnectedIntro: 'रेफ़रल लिंक बनाने और आमंत्रक बाइंड करने के लिए वॉलेट कनेक्ट करें।',
    referralLink: 'मेरा आमंत्रण लिंक',
    shareReferral: 'लिंक कॉपी करें',
    referrer: 'मेरा आमंत्रक',
    bindReferrer: 'जोड़ें',
    referrerPlaceholder: 'रेफ़रर पता दर्ज करें (0x…)',
    referrerHint: 'आमंत्रण संबंध सक्रिय होने के बाद स्थायी रूप से वैध, परिवर्तन संभव नहीं।',
    docs: 'दस्तावेज़',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'सह-निर्माण में भाग लें',
    myCommunity: 'मेरा समुदाय',
    directReferrals: 'प्रत्यक्ष रेफ़रल',
    myTeam: 'समुदाय सदस्य',
    genesisTitle: 'वर्तमान',
    cobuildLevel: 'Co-build tier',
    inviteTitle: 'आमंत्रण शुरू करें · इकोसिस्टम वृद्धि मूल्य साझा करें',
    programs: {
      title: 'इकोसिस्टम सहायता कार्यक्रम',
      items: [
        {
          label: 'Genesis सह-निर्माण · फेज़ {season}',
          title: 'Genesis रिज़र्व गवर्नर कार्यक्रम',
          body: 'वैश्विक पहली सह-निर्माण सीटें अब खुली',
          action: 'कार्यक्रम विवरण देखें →',
          href: '',
        },
        {
          label: 'X अकादमी',
          title: 'वैश्विक DeFi अकादमी · डिजिटल अर्थव्यवस्था युग की वैश्विक नेतृत्व अकादमी',
          body: 'युग के लिए नेता तैयार करना · भविष्य के लिए प्रतिभा सुरक्षित रखना',
          action: 'कार्यक्रम विवरण देखें →',
          href: 'https://xdaoaegis.notion.site/x-academy-en',
        },
      ],
    },
    myInvites: 'मेरे समुदाय सदस्य ({count})',
    referralBondPermanent: 'रेफ़रल संबंध सक्रिय · बाइंडिंग स्थायी है।',
    volumePrefix: 'प्रदर्शन',
    genesisShareholder: 'Genesis रिज़र्व गवर्नर',
    statToday: 'आज +{count} · +{amount}',
    statGenesisToday: 'लॉन्च के बाद स्वचालित 1 स्तर वृद्धि',
    postLaunchRankLabel: 'लॉन्च के बाद स्तर',
    totalTeamVolume: 'कुल प्रदर्शन {amount}',
    postLaunch30DayBoost: 'लॉन्च के 30 दिनों में {rank} तक बढ़ें',
    postLaunchMaxRank: 'आप अधिकतम स्तर पर पहुँच गए हैं',
    bindReferrerSuccess: 'रेफ़रर सफलतापूर्वक जुड़ा',
    inviteFlow: {
      items: [
        {
          title: 'आमंत्रण लिंक साझा करें',
          body: 'वॉलेट कनेक्ट करें और अपना आमंत्रक भरें, फिर अपना विशेष आमंत्रण लिंक बनाएँ।',
        },
        {
          title: 'साझेदार सह-निर्माण में भाग लें',
          body: 'साझेदार आपके आमंत्रण लिंक से पंजीकरण के बाद सह-निर्माण में भाग ले सकता है।',
        },
        {
          title: 'सह-निर्माण पुरस्कार प्राप्त करें',
          body: 'साझेदार के सह-निर्माण के बाद, पुरस्कार स्मार्ट कॉन्ट्रैक्ट द्वारा स्वचालित रूप से आपके वॉलेट पते पर निपटान।',
        },
      ],
    },
    invitesEmpty: {
      title: 'अभी कोई आमंत्रण रिकॉर्ड नहीं',
      body: 'रेफ़रल लिंक साझा करें, मित्रों को अपने समुदाय में आमंत्रित करें।',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'रेफ़रल संबंध कैसे बनता है?',
          a: 'जब कोई साथी आपके निमंत्रण लिंक से सह-निर्माण में भाग लेता है, तो रेफ़रल संबंध स्वचालित रूप से बनता है और स्थायी रूप से मान्य रहता है।',
        },
        {
          q: 'Genesis रेफ़रल पुरस्कार की गणना कैसे होती है?',
          a: 'Genesis रेफ़रल पुरस्कार 3% है, संपीड़ित समान-राशि निपटान तंत्र का उपयोग करता है — केवल समान-राशि भाग की गणना होती है।',
        },
        {
          q: 'मैं अपना Genesis स्तर कैसे बढ़ाऊँ?',
          a: 'व्यक्तिगत सह-निर्माण राशि और संगठन प्रदर्शन के आधार पर S1 से S10 तक क्रमिक रूप से उन्नति करें।',
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
      recordsEmpty: 'No records yet',
      chartTitles: {
        stake: 'TVL (Staking) metrics',
        lpbond: 'TVL (LP Bond) metrics',
        burnbond: 'TVL (Burn Bond) metrics',
        xmine: 'TVL (X Mining) metrics',
      },
      chartRangeAria: 'Chart time range',
      chartRanges: ['1W', '1M', '1Y', 'All'],
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
      warmupCta: 'Activate warmup',
      warmupSuccess: 'Warmup activated',
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
          'Yield compounds at base daily 0.82% (2 × rebase); term bonuses: 180d 15%, 360d 25%, 540d 35%.',
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
    dash: '—',
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
    time: 'समय',
    claimTime: 'दावा समय',
    paid: 'राशि',
    status: 'स्थिति',
    discount: 'छूट',
    estimatedAgx: 'अनुमानित AGX',
    tx: 'Tx',
    title: 'Genesis उपाधि',
    totalVolume: 'कुल प्रदर्शन',
    rewardRate: 'पुरस्कार दर',
    amount: 'राशि',
    from: 'स्रोत पता',
    genesisRank: 'Genesis रैंक',
    joined: 'शामिल हुए',
    address: 'पता',
    communityVolume: 'समुदाय प्रदर्शन',
    contribution: 'सदस्यता',
  },
}) satisfies AppMessagesBundle

export default app
