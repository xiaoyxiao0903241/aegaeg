import { defineMessages } from '~/i18n/messages/define-messages'
import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Connect Wallet',
    language: 'Language',
    copy: 'Copy',
    claimable: 'Claimable',
    max: 'Max',
    shareUnit: 'shares',
    confirm: 'Confirm',
    close: 'Close',
    paginationTotal: '{total} total',
    paginationPerPage: '{size} per page',
    paginationPrev: 'Previous page',
    paginationNext: 'Next page',
  },
  errors: {
    api: {
      network: 'Network connection failed. Check your connection and try again.',
      timeout: 'Request timed out. Please try again later.',
      unavailable: 'Service temporarily unavailable. Please try again later.',
      badResponse: 'Unexpected server response. Please try again later.',
      fallback: 'Something went wrong. Please try again later.',
    },
    chain: {
      fallback: 'On-chain action failed. Please try again later.',
    },
    walletNotConnected: 'Please connect your wallet and sign in first.',
    quoteFailed: 'Quote failed. Please try again later.',
    loadFailed: 'Failed to load. Please try again later.',
    loginFailed: 'Sign-in failed. Please try again later.',
    loginSignatureRejected: 'Login signature is invalid or expired. Please sign again.',
    pageLoadFailed: 'Page failed to load',
    pageLoadFailedBody:
      'Something broke while rendering. Reload to continue — your wallet stays connected.',
    reloadPage: 'Reload page',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    rewards: 'Rewards',
    release: 'Release',
    community: 'Community',
    genesis: 'Co-build',
    rewardsTooltip: 'View referral rewards and team rewards.',
    communityTooltip:
      'Invite partners to co-build and share ecosystem growth value and Genesis rewards.',
    bscTooltip:
      'BSC only · AEGIS X runs on BNB Smart Chain. Network switching is not supported yet.',
  },
  topbar: {
    currentNetwork: 'Current network',
    openMenu: 'Open navigation',
    closeMenu: 'Close navigation',
    hideDetails: 'Hide details panel',
    showDetails: 'Show details panel',
    toggleTooltip: 'Show or hide the details panel',
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
      promoTitle: 'Connect to explore AEGIS X features',
      promoBrandLine: 'Guard the future value network',
      recordsTitle: 'Connect your wallet to view your records',
      recordsBodyGenesis: 'After connecting, your co-build history will appear here.',
      recordsBodyRewards: 'After connecting, your reward history will appear here.',
      recordsBodyCommunity: 'After connecting, your invite records will appear here.',
    },
  },
  wallet: {
    connectTitle: 'Connect Wallet',
    connectIntroTitle: 'Connect your wallet to explore AEGIS X features',
    connectIntroLink: 'AEGIS X features ↗',
    connecting: 'Connecting…',
    copyAddress: 'Copy address',
    copied: 'Copied',
    copyFailed: 'Copy failed. Long-press to copy manually.',
    disconnect: 'Disconnect',
    reconnectWallet: 'Reconnect wallet',
    reconnectHint: 'Wallet disconnected. Reconnect before performing on-chain actions.',
    signInRequired: 'Sign in',
    accountBanned: 'Your account has been suspended. Please contact support.',
    transactionErrors: {
      gasLimitTooLow:
        'Gas limit is too low. Keep enough BNB in your wallet for network fees and try again.',
      gasEstimateFailed:
        'Could not estimate gas for this transaction. Check your network and try again.',
      insufficientFunds: 'Insufficient BNB to pay network gas fees.',
      transactionFailed: 'Transaction failed. Please try again.',
      transactionUnknown:
        'Transaction status is unknown. Do not submit again — check your wallet or the block explorer first.',
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
    title: 'Co-build Program',
    intro: 'Join the X DAO co-build program · Phase {season}  ({discount} discount)',
    shares: 'Shares (1 share = 100 USD1 · max {max} shares)',
    quota: 'Phase co-build quota',
    pay: 'Pay',
    receive: 'You will receive AGX',
    value: 'Subscription value',
    xTokenAirdrop: 'Est. initial X airdrop value',
    xTokenAirdropHint:
      'Per-Phase cumulative co-build amount ≥ {threshold} qualifies for airdrop rewards',
    join: 'Join co-build',
    joinGenesis: 'Join Genesis co-build',
    statsTitle: 'Phase {season} co-build stats',
    startsIn: 'Starts in',
    countdownUnits: { days: 'd', hours: 'h', minutes: 'm' },
    endsIn: 'Time remaining this phase',
    referencePrice: 'AGX launch reference price',
    discountLabel: 'Discount',
    discountRatio: 'Phase discount rate',
    xAirdropRatio: 'X airdrop ratio',
    airdropLabel: 'X airdrop ratio',
    myContributions: 'My co-build records',
    totalContributed: 'Phase co-build',
    cumulativeContributed: 'Cumulative co-build',
    globalLabel: 'Global cumulative co-build',
    globalBody:
      'Core co-builders worldwide are coming together to build the AEGIS X global ecosystem.',
    viewContract: 'View contract',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'How do I join the co-build program?',
          a: 'Users participate in co-build with USD1 and receive AGX at the corresponding Phase discount. {phaseCount} phases, with discounts of {discounts} respectively.',
        },
        {
          q: 'What are the quota and participation requirements?',
          a: 'Minimum participation is {minUsd} in increments of {shareIncrement} USD1. Quotas by phase: {phaseQuotas}.',
        },
        {
          q: 'How long is the co-build vesting period?',
          a: 'AGX earned from co-build follows a 540-day release schedule.',
        },
        {
          q: 'How do I qualify for X airdrop rewards?',
          a: 'Accounts with cumulative co-build participation of {threshold} qualify for the corresponding phase X airdrop. Airdrop ratios across {phaseCount} phases: {airdropRatios}.',
        },
        {
          q: 'How are X airdrop rewards released?',
          a: 'X airdrop rewards vest linearly over 12 months, with approximately 8.33% released each month. The first release occurs 30 days after the X staking protocol goes live, executed automatically by smart contract.',
        },
      ],
    },
    promoTitleTemplate: 'Genesis co-build Phase {season}  {discount} discount',
    promoLive: 'In progress — limited quota, ends {endDate}',
    promoUpcoming: 'Coming soon — limited quota, starts {startDate}',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Subscription successful',
    insufficientUsd1: 'Insufficient USD1 balance. Obtain enough USD1 before subscribing.',
    insufficientAllowance: 'Insufficient USD1 allowance. Approve first.',
    purchaseUnavailable:
      'Subscription is currently unavailable. Check your shares or phase status.',
    walletNotConnected: 'Wallet disconnected. Reconnect before signing transactions.',
    errors: {
      notBound: 'Bind a referrer before joining.',
      paused: 'Subscription is paused. Please try again later.',
      invalidAmount: 'Amount must be a multiple of 100 USD.',
      phaseInactive: 'This phase has not started or has ended.',
      belowMin: "Amount is below this phase's minimum.",
      soldOut: 'This phase is sold out.',
      userLimitExceeded: "Exceeds this phase's per-wallet cap. Reduce the amount.",
      invalidPhase: 'Invalid phase.',
      systemConfig: 'System configuration error. Please try again later.',
    },
    contributionsSyncPending:
      'On-chain subscription confirmed. History is syncing — refresh shortly.',
    contributionsEmpty: {
      title: 'No co-build records yet',
      body: 'The co-build program has ended. Accounts that did not participate have no records here.',
    },
    goBindReferrer: 'Bind referrer',
    seasonLive: 'In progress',
    seasonEnded: 'Ended',
    seasonUpcoming: 'Upcoming',
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
    currentTitle: 'Current tier',
    postLaunchRankTitle: 'Post-launch tier',
    teamRewardRate: 'Team reward {rate}',
    postLaunch30DayRank: 'Within 30 days after launch you can reach {rank}',
    postLaunchMaxRank: 'You have reached the maximum tier',
    postLaunchRankTooltip:
      'After launch, tiers are calculated from real performance based on team co-build volume converted to AGX at the discounted price.\nThe current tier is based on performance data only; after launch other factors may apply, such as personal holdings and qualified direct referrals.\nThis information is for reference only; post-launch on-chain data is final.',
    superCommunityBadge: 'Super System',
    heroTierRewardBody: 'Earn {bonus} of team co-build volume as reward.',
    superCommunityBenefitBody:
      'Super Systems receive a dedicated development fund and governance rights.',
    shareholderHintNoRank: 'Genesis tier',
    shareholderNoRankTitle: 'Not yet a Genesis Reserve Governor',
    shareholderNoRankBody:
      'Become a Genesis Reserve Governor to earn 1%-10% of team co-build volume as rewards and upgrade one tier within 30 days after AEGIS X launch.',
    shareholderTitleForRank: '{rank} · Genesis Reserve Governor',
    heroKicker: 'Genesis tier',
    currentTierSuffix: 'Current',
    progressPersonalTo: 'Progress to {rank} · Personal subscription',
    progressMaxPersonal: 'Maximum personal tier reached',
    progressMaxTeam: 'Maximum team tier reached',
    teamLegRequirement: 'Two {rank} legs',
    tierDualLegRequirement: '2 {rank} legs',
    teamQualifiedPartitionsLabel: '{rank} legs {count}/2',
    teamVolume: 'Organization volume',
    referralRewards: 'Direct referral rewards',
    autoPaidLabel: 'Auto-paid',
    autoPaid: 'Rewards settle automatically to your wallet',
    teamRewards: 'Tier rewards',
    claimed: 'Claimed {amount}',
    heroTitle: 'Current tier',
    allTiers: 'Genesis honor system',
    history: 'Reward history',
    referralHistoryEmpty: {
      title: 'No direct referral reward records yet',
      body: 'Direct referral rewards appear here after your referees complete subscriptions during Genesis.',
    },
    teamHistoryEmpty: {
      title: 'No tier reward records yet',
      body: 'Tier reward settlement and claim records appear here once rewards are generated.',
    },
    communityFund: 'Development fund',
    communityFundTooltip:
      'Super systems receive 5% of the system development fund, dedicated to system self-operation, including but not limited to: system building, daily operations, system meetings, and system lecturers.',
    communityFundLocked: 'Locked: {amount}',
    communityFundUnlockedSuffix: 'unlocked',
    communityFundClaimed: 'You claimed {amount}',
    communityFundHistory: 'Development fund',
    communityFundCumulativeClaimed: 'Total claimed {amount}',
    communityFundHistoryEmpty: {
      title: 'No development fund records yet',
      body: 'Development fund claim records will appear here once rewards are generated.',
    },
    rewardType: {
      referralPaid: 'Referral reward',
      referralWithdrawn: 'Referral reward claim',
      marketTeam: 'Market-making team reward',
      presaleTeam: 'Presale team reward',
      unknown: '—',
    },
    logStatus: {
      pending: 'Pending',
      processing: 'Processing',
      paid: 'Paid',
      claimed: 'Claimed',
      failed: 'Failed',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'You have already bound a referrer.',
      parentNotBound: "The referrer hasn't bound yet. Please contact them.",
      selfReferral: "You can't use your own address.",
      invalidParent: 'Please enter a valid referrer address.',
      migratedAccount: 'This address has migrated. Please use the new address.',
      systemConfig: 'System configuration error. Please try again later.',
      failed: 'Binding failed. Please try again later.',
    },
    title: 'Community',
    intro: 'Invite partners to co-build and share ecosystem growth value and Genesis rewards.',
    disconnectedIntro: 'Connect your wallet to generate a referral link and bind an inviter.',
    referralLink: 'My referral link',
    shareReferral: 'Copy link',
    referrer: 'My inviter',
    bindReferrer: 'Bind',
    referrerPlaceholder: 'Enter referrer address (0x…)',
    referrerHint: 'Referral relationships are permanent once activated and cannot be changed.',
    docs: 'Resources',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Join co-build',
    myCommunity: 'My community',
    directReferrals: 'Direct referrals',
    myTeam: 'Community members',
    genesisTitle: 'Current',
    inviteTitle: 'Start inviting · Share ecosystem growth value',
    programs: {
      title: 'Ecosystem support programs',
      items: [
        {
          label: 'Genesis Co-build · Phase {season}',
          title: 'Genesis Reserve Governor Program',
          body: 'First global co-build seats now open',
          action: 'View program details →',
          href: 'https://xdaoaegis.notion.site/genesis-reserve-council-program',
        },
        {
          label: 'X Academy',
          title: 'Global DeFi Academy · Global Leadership Academy for the Digital Economy Era',
          body: 'Cultivating leaders for the era · Reserving talent for the future',
          action: 'View program details →',
          href: 'https://xdaoaegis.notion.site/x-academy-en',
        },
      ],
    },
    myInvites: 'My community members ({count})',
    referralBondPermanent: 'Referral relationship active · binding is permanent.',
    volumePrefix: 'Volume',
    genesisShareholder: 'Genesis Reserve Governor',
    statToday: 'Today +{count} · +{amount}',
    statGenesisToday: 'Auto-upgrade +1 tier after launch',
    postLaunchRankLabel: 'Post-launch tier',
    totalTeamVolume: 'Total volume {amount}',
    postLaunch30DayBoost: 'Upgrade to {rank} within 30 days after launch',
    postLaunchMaxRank: 'You have reached the maximum tier',
    bindReferrerSuccess: 'Referrer bound successfully',
    inviteFlow: {
      items: [
        {
          title: 'Share your referral link',
          body: 'Connect your wallet and enter your inviter to generate your personal referral link.',
        },
        {
          title: 'Partners join co-build',
          body: 'After partners register through your referral link, they can participate in co-build.',
        },
        {
          title: 'Earn co-build rewards',
          body: 'After partners participate in co-build, rewards are settled automatically to your wallet address by smart contract.',
        },
      ],
    },
    invitesEmpty: {
      title: 'No community members yet',
      body: 'Share your invite link — partners will appear here after they join.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'How is the referral relationship established?',
          a: 'After a partner participates in co-build through your referral link, the referral relationship is automatically established and permanently valid.',
        },
        {
          q: 'How are Genesis referral rewards calculated?',
          a: 'Genesis referral rewards are 3%, settled through compressed equal-amount matching — only the matched equal-amount portion counts.',
        },
        {
          q: 'How do I advance my Genesis tier?',
          a: 'Advance gradually from S1 to S10 based on your personal co-build amount and organization performance.',
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
    time: 'Time',
    claimTime: 'Claim Time',
    paid: 'Amount',
    status: 'Status',
    discount: 'Discount',
    estimatedAgx: 'Est. AGX',
    tx: 'Transaction',
    title: 'Genesis title',
    totalVolume: 'Total volume',
    rewardRate: 'Reward rate',
    amount: 'Amount',
    from: 'Source address',
    genesisRank: 'Genesis Rank',
    joined: 'Joined',
    address: 'Address',
    communityVolume: 'Community volume',
    contribution: 'Subscription',
  },
}) satisfies AppMessagesBundle

export default app
