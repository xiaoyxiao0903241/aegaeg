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
    splitDragHint: 'Drag to adjust',
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
      /** Handbook §19 + contract-doc tips not covered by domain gate bags. */
      reverts: {
        stakeAmountLimit: 'Daily stake limit reached. Lower the amount or wait for reset.',
        debtCapacityReached: 'Bond capacity is full. Please try again later.',
        turbineCooldown: 'Cooldown not finished. Refresh silences and retry.',
        turbineNoSilenceBalance: 'No matured silence balance to extract.',
        invalidAmount: 'Invalid amount. Check and try again.',
        pairNotExist: 'Trading pair does not exist. Check token configuration.',
        configNotReady:
          'Splitter manager / release queue config is not ready. Please try again later.',
        exceedsMax: 'Amount exceeds the maximum. Please lower it.',
        bondTooSmall: 'Bond payout is too small. Increase the purchase amount.',
        bondTooLarge: 'Bond exceeds max payout. Lower the purchase amount.',
        stakeNotExist: 'Position missing or already closed. Refresh and try again.',
        yieldUnavailable: 'No claimable yield or amount too high. Lower amount or wait to accrue.',
        /** Shared revert names across flash/burn/staking — avoid domain-specific copy. */
        operationPaused: 'This operation is paused. Please try again later.',
        belowMinAmount: 'Amount is below the minimum. Please increase it.',
        aboveMaxAmount: 'Amount exceeds the maximum. Please lower it.',
        zeroRate: 'Rate is not ready. Please try again later.',
        zeroAmount: 'Enter a valid amount.',
        zeroAddress: 'Invalid address. Please try again later.',
        notAuthorized: 'This account is not authorized for this action.',
        invalidLimits: 'Limit configuration is invalid. Please try again later.',
        nothingToClaim: 'Nothing to claim or invalid index. Refresh and try again.',
        warmupOrLockActive: 'Still in warmup or lock period. Wait until it ends.',
        walletTokenInsufficient: 'Insufficient wallet token balance.',
        walletAgxInsufficient: 'Insufficient wallet AGX balance.',
        walletUsd1Insufficient: 'Insufficient wallet USD1 balance.',
        walletGagxInsufficient: 'Insufficient wallet gAGX balance.',
        contractPayableInsufficient: 'Contract payable balance is insufficient. Try again later.',
        extractableInsufficient: 'Insufficient extractable balance. Refresh and try again.',
        insufficientAllowance: 'Insufficient allowance. Approve first.',
      },
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
    bscTooltip: 'BSC only · AEGIS X runs on BNB Smart Chain.',
  },
  flowOps: {
    stake: {
      STAKE: 'Stake',
      REWARD: 'Reward claim',
      EXTRA_REWARD: 'Extra reward claim',
      CLAIM_PRINCIPAL: 'Redeem',
      RESTAKE: 'Restake',
      EARLY_STAKE: 'Co-build',
    },
    bond: {
      PURCHASE: 'Purchase',
      REDEEM: 'Redeem',
      REWARD: 'Claim',
      RESTAKE: 'Restake',
    },
    xmine: {
      STAKE_X: 'Stake',
      UNSTAKE_X: 'Unstake',
      REWARD: 'Claim',
    },
    buffer: {
      RELEASE_CREATED: 'Enter',
      PRINCIPAL_CLAIMED: 'Withdraw',
    },
    release: {
      entered_queue: 'Enter queue',
      claimed_from_queue: 'Claim',
      released: 'Released',
    },
    turbine: {
      received: 'Enter',
      silenced: 'Unlock',
      cooled_claimed: 'Withdraw',
    },
    termDays: ' ({n}d)',
    termLiquid: ' (Flexible)',
    liquid: 'Flexible',
    periodDays: '{n} days',
  },
  topbar: {
    currentNetwork: 'Current network',
    switchToBsc: 'Switch to BSC',
    switchNetworkFailed: 'Could not switch network. Switch to BSC in your wallet and try again.',
    wrongNetworkTooltip: 'Wrong network. Click to switch to BNB Smart Chain (BSC).',
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
    complete: {
      title: 'Tutorial complete',
      body: 'You now know the core features of AEGIS X. Start exploring — replay anytime from Tutorial in the top bar.',
      cta: 'Get started',
    },
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
        body: 'Stake AGX in the Stake card. Rebase {timesPerDay} times daily compounds; longer lockups earn higher yield boosts.',
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
        body: 'Redeemed principal unlocks linearly here over a 30-day block vest; released amounts can be withdrawn to your wallet anytime.',
      },
      {
        title: 'Turbine',
        body: 'gAGX from the release pool stays locked until you unlock it by buying 1:1 with USD1.',
      },
      {
        title: 'Rewards',
        body: 'Rewards include referral, participation, co-build, and more. Claiming rewards spends contribution 1:1.',
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
      wrongChain: 'Switch to BNB Smart Chain (BSC) and try again.',
      accountChanged: 'Wallet account changed. Submit again.',
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
    slippagePanel: {
      title: 'Slippage',
      hint: 'Slippage tolerance is the price movement you accept between submitting a trade and on-chain execution. If realized slippage exceeds your setting, the trade reverts. Reverted trades may still cost gas.',
      modeAuto: 'Default',
      modeCustom: 'Custom',
      max: 'Max slippage',
      customAria: 'Custom slippage',
    },
    route: 'Swap route',
    provider: 'Provider',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Open on PancakeSwap',
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
            a: 'The Swap page gathers the usual ways to get and handle AEGIS X protocol tokens: Flash (redeem gAGX for AGX at 1:1), Trade (swap USD1 / AGX / X and other tokens at market rates), Turbine (buy with USD1 to unlock Turbine gAGX), and Burn AGX for contribution points. Pick the entry that fits what you need.',
          },
          {
            q: 'What is the difference between Flash and Trade?',
            a: 'Flash is the protocol’s 1:1 gAGX↔AGX redeem — no fees, no slippage, instant on-chain credit. Trade routes through PancakeSwap at live market rates for USD1, AGX, X, and other tokens; price moves with the market, you set allowed slippage and pay network gas.',
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
      success: 'Flash swap successful',
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
            a: 'gAGX is the unified settlement voucher for Rebase and DAO rewards: rebase yield from AGX staking or bonds, and DAO rewards, are all paid as gAGX.',
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
            a: 'Rebase yield from AGX staking, LP bonds, or burn bonds, plus DAO rewards, is paid to your account as gAGX.',
          },
          {
            q: 'What else can I do with gAGX besides redeeming AGX?',
            a: 'You can stake gAGX in X Mine to capture X, the ecosystem value token. Redeem to AGX or mine X — both paths are yours to choose.',
          },
          {
            q: 'How do I swap USDT for USD1?',
            a: 'Switch to the USDT → USD1 pair at the top of Flash, enter an amount, and swap 1:1 — no fees, no slippage, instant on-chain credit.',
          },
          {
            q: 'Can I swap USD1 back to USDT?',
            a: 'No. Flash only converts USDT one-way into USD1. USD1 is the AEGIS X core settlement asset and can be used in-ecosystem for trading, buying bonds, and Turbine unlocks.',
          },
          {
            q: 'Where can I see Flash history?',
            a: 'Flash runs on-chain and credits in seconds. Check each transaction in your wallet or a block explorer.',
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
      xBuyDisabledHint: 'X can only be sold',
      flipDisabledXSellOnly: 'X can only be sold — cannot flip to buy',
      action: 'Trade',
      success: 'Trade successful',
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
      currentContribution: 'Current contribution points',
      burnRate: 'Burn rate',
      destination: 'Burn destination',
      destinationValue: 'Black hole {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'View contribution swap on BscScan',
      action: 'Burn',
      success: 'Burn successful',
      aboutTitle: 'About contribution points',
      blocked: {
        paused: 'Burn is paused. Please try again later.',
        belowMin: 'Amount is below the minimum burn limit.',
        aboveMax: 'Amount exceeds the maximum burn limit.',
        zeroRate: 'Burn rate is unavailable. Please try again later.',
        zeroAmount: 'Enter an amount greater than zero.',
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
        tabs: {
          burn: 'Burn',
          consume: 'Consume',
        },
        burnColumns: ['Time', 'Burned AGX', 'Contribution earned', 'Transaction hash'],
        consumeColumns: [
          'Time',
          'Usage',
          'Claim amount',
          'Contribution consumed',
          'Transaction hash',
        ],
        purpose: {
          stakeYield: 'Stake yield',
          lpBondYield: 'LP bond yield',
          burnBondYield: 'Burn bond yield',
          lucky: 'Lucky',
          rank: 'Rank reward',
          referral: 'Referral',
          participation: 'Participation',
          surpass: 'Peer surpass',
          lifetime: 'Lifetime',
          market: 'Market allowance',
        },
      },
      faq: {
        items: [
          {
            q: 'What are contribution points used for?',
            a: 'Claiming yield from staking, bonds, and other sources spends contribution points at 1:1 (claiming 1 gAGX spends 1 point). Without enough points you cannot claim.',
          },
          {
            q: 'Why do I need contribution points to claim rewards?',
            a: 'This binds claims to protocol deflation: every 1 gAGX claimed spends 1 contribution point, and points come only from burning AGX. So each withdrawal of yield corresponds to an equal amount of AGX burned, continuously supporting AGX deflation.',
          },
          {
            q: 'What is the burn rate?',
            a: 'Burns at a 1:6 rate: each 1 AGX burned yields 6 contribution points. Burned AGX goes directly to the black-hole address and is permanently removed from circulation.',
          },
          {
            q: 'Where does burned AGX go?',
            a: 'All burned AGX is transferred to the black-hole address and locked permanently, reducing circulating supply and strengthening deflation. This is part of the protocol value-return mechanism.',
          },
          {
            q: 'Can contribution points be transferred or refunded?',
            a: 'No. Contribution points are bound to your account — they cannot be transferred or refunded. They are only spent when claiming yield; burn as needed.',
          },
        ],
      },
    },
    turbine: {
      title: 'Turbine',
      aboutTitle: 'About Turbine',
      segmentAriaLabel: 'Turbine actions',
      segments: {
        unlock: 'Unlock',
        claim: 'Claim',
      },
      unlockLabel: 'Unlock',
      unlockable: 'Unlockable',
      equivalentBuyHint: 'Unlocking runs an equal buy at the same time',
      payUsd1Label: 'Pay USD1',
      buyAgxLabel: 'Buy AGX',
      buyToBoundWallet: 'Bought to wallet',
      agxPrice: 'AGX price',
      slippageHint:
        'USD1 due is the quote plus your slippage; unused USD1 is refunded. Too little buffer may revert; failed transactions can still cost gas.',
      willReceiveAgx: 'AGX you will receive',
      unlockRatio: 'Unlock ratio',
      unlockRatioValue: '1 : 1 buy to unlock',
      cooldown: 'Cooldown',
      cooldownHoursValue: '{hours}h',
      unlockAction: 'Unlock',
      unlockSuccess: 'Unlocked — cooldown started',
      claimAction: 'Claim',
      claimSuccess: 'Extract submitted — gAGX entered splitter release',
      claimEmpty: 'No unlock records yet',
      claimable: 'Claimable',
      cooling: 'Cooling',
      countdownLabel: 'Unlock countdown',
      cooldownDone: 'Cooldown complete',
      countdownHours: 'h',
      countdownMinutes: 'm',
      dataTitle: 'Turbine data',
      recordsTitle: 'Turbine records',
      recordsEmpty:
        'No turbine records yet. After rewards enter Turbine from the release pool, each action will appear here.',
      mechanismTitle: 'Turbine mechanism',
      mechanismIntro:
        'Bind sell liquidity to buy demand so every unlock is paired with an equal buy',
      mechanism: [
        {
          title: '1:1 buy-to-unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Buy matching AGX with USD1 at the current price to unlock the same amount of gAGX—each unlock is floored by buy demand.',
        },
        {
          title: 'Adaptive cooldown',
          body: 'Each unlock enters a 24–96 hour cooldown tuned by market state. After it ends, extract unlocked gAGX to your wallet.',
        },
      ],
      metrics: {
        pendingUnlock: 'Pending unlock gAGX',
        cooling: 'Cooling gAGX',
        totalWithdrawn: 'Total withdrawn',
        pendingUnlockHint:
          'Total gAGX claimed from the release pool into Turbine that is not yet unlocked',
        coolingHint: 'Total gAGX that finished buy-to-unlock and is in cooldown',
        totalWithdrawnHint: 'Lifetime gAGX withdrawn from Turbine to the wallet',
      },
      faq: {
        items: [
          {
            q: 'How does gAGX enter Turbine?',
            a: 'gAGX claimed from the release pool does not go to your wallet. It automatically enters Turbine locked (shown as “Enter” in records). Buy an equal amount of AGX with USD1 to Unlock, then Extract to wallet after cooldown.',
          },
          {
            q: 'Why is a buy required to unlock?',
            a: 'Turbine binds sell liquidity to buy demand: unlocking 1 gAGX requires buying 1 AGX with USD1 at the current price. Every potential sell is paired with an equal buy, avoiding one-sided sell pressure and protecting the base pool.',
          },
          {
            q: 'Unlock vs claim?',
            a: 'Unlock buys an equal amount of AGX with USD1 at the current price, unlocking locked gAGX and starting cooldown. Extract moves unlocked gAGX to your wallet after the cooldown (24–96 hours). The two steps appear in Turbine records as Unlock and Extract.',
          },
          {
            q: 'How long is the cooldown?',
            a: 'Each unlock enters a 24–96 hour cooldown; the exact duration is auto-adjusted by the system based on market state. After it ends you can extract that gAGX to your wallet.',
          },
          {
            q: 'Where does the purchased AGX go?',
            a: 'Bought AGX goes straight to your wallet, same as a normal trade buy. The matching gAGX unlocks and enters cooldown.',
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
          title: 'X · Equity token',
          body: 'An ecosystem participation and equity token that records on-chain contribution, redeemable for rights, events, and airdrop boosts.',
        },
        {
          key: 'contribution',
          title: 'Contribution points · Reward claim voucher',
          body: 'Claiming rewards consumes contribution points at {ratio}. Burning AGX grants contribution points and strengthens protocol deflation.',
        },
        {
          key: 'turbine',
          title: 'Turbine · Quota unlock hub',
          body: 'Rewards claimed from the release queue enter Turbine quota. Buying an equal amount of AGX with USD1 starts a 24–96 hour silence. After it ends, gAGX is routed through the splitter for linear release — it does not arrive in your wallet immediately.',
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
    title: 'Co-build Program',
    intro: 'Join the X DAO co-build program · Phase {season}  ({discount} discount)',
    introEnded: 'The X DAO co-build program has concluded · Thank you to all co-builders',
    shares: 'Shares (1 share = {min} USD1 · max {max} shares)',
    quota: 'Phase co-build quota',
    pay: 'Pay',
    receive: 'You will receive AGX',
    value: 'Subscription value',
    xTokenAirdrop: 'Est. initial X airdrop value',
    xTokenAirdropHint:
      'Per-Phase cumulative co-build amount ≥ {threshold} qualifies for airdrop rewards',
    join: 'Join co-build',
    joinEnded: 'Co-build ended',
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
          a: 'Users participate in co-build with USD1 and receive AGX at the corresponding Phase discount. 3 phases, with discounts of 30%, 25%, 20% respectively.',
        },
        {
          q: 'What are the quota and participation requirements?',
          a: 'Minimum participation is $100 in increments of 100 USD1. Quotas by phase: $100 – $10,000, $100 – $10,000, $100 – $30,000.',
        },
        {
          q: 'How long is the co-build vesting period?',
          a: 'AGX earned from co-build follows a 540-day release schedule.',
        },
        {
          q: 'How do I qualify for X airdrop rewards?',
          a: 'Accounts with cumulative co-build participation of $1,000 qualify for the corresponding phase X airdrop. Airdrop ratios across 3 phases: 5%, 2%, 1%.',
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
    },
    contributionsEmptyEnded: {
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
    restakeSuccess: 'Restake submitted',
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
      filterAria: 'Filter rewards',
      hideZero: 'Hide 0 assets',
      hideZeroEmpty: 'No non-zero rewards',
      balancePlaceholder: '0.00',
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
        contributionHint: 'Claims consume contribution {ratio}.',
        goBurn: 'Go burn',
      },
      mechanismTitle: 'Co-build reward mechanism',
      mechanismBody: 'Co-build rewards come from team Rebase yield and are shared by tier.',
      mechanismFooter:
        'Any two lines that reach the required tier unlock promotion. A6–A9 can also promote via a single-line path: one line reaches the required tier and the other lines’ combined volume meets the threshold.',
      mechanismToggleAria: 'Switch promotion rule',
      aboutSlides: {
        lucky: {
          title: 'Lucky',
          body: 'Daily prize pool of at least $5,000. A single participation of $5,000 or more earns a draw ticket; 10 lucky users are drawn each day to share the pool.',
        },
        referral: {
          title: 'Referral',
          body: 'After a directly referred partner joins co-building, you receive 10% of their Rebase yield each time, settled on-chain instantly. Keep your own position value above $100.',
        },
        participate: {
          title: 'Participate',
          body: 'After binding via a referral link and joining co-building, you receive 10% of your inviter’s Rebase yield on the portion matching your position, as a reward for being referred.',
        },
        cobuild: {
          title: 'Co-build',
          body: 'Drawn from the team’s total Rebase yield and paid at the bonus rate for your co-build tier (A1 10% to A13 130%). Higher tiers earn a higher rate; see the co-build mechanism table below.',
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
            teamAlt: 'One line reaches A5, other lines’ volume ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: 'Two lines reach A6',
            teamAlt: 'One line reaches A6, other lines’ volume ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: 'Two lines reach A7',
            teamAlt: 'One line reaches A7, other lines’ volume ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: 'Two lines reach A8',
            teamAlt: 'One line reaches A8, other lines’ volume ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: 'Two lines reach A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: 'Two lines reach A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: 'Two lines reach A11',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: 'Two lines reach A12',
            rate: '130%',
          },
          {
            level: 'Lifetime achievement',
            holding: '$100,000',
            accounts: '20',
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
          'Direct-referral Rebase-related rewards; claim via DaoPool Mixed (contribution {ratio}).',
      },
      participate: {
        title: 'Participation',
        body: 'Rewards from your referrer',
        aside:
          'Participation rewards from your referral bond; claim via DaoPool Mixed (contribution {ratio}).',
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
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: 'Claim vs restake split',
      releasePeriod: 'Release period',
      restakePeriod: 'Restake period',
      releaseAria: 'Release period',
      restakeAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      daysTax: '{days}d · {tax}',
      scheduleJoin: ', ',
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
      countdownHint: 'Next draw in {time}',
      eligibility: 'Today eligibility',
      eligibilityYes: 'Qualified',
      eligibilityNo: 'Not qualified',
      maxStakeHint: 'Purchases today {amount}',
      cumulativeWins: 'Cumulative wins',
      winsCount: '{count} times',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Chainlink VRF v2.5 verifiable randomness',
      vrfBody:
        'Lucky draws use Chainlink VRF v2.5 with the staking contracts: randomness is generated on-chain with a cryptographic proof, then winners are selected from that day’s eligibility list. No human intervention; anyone can verify on-chain.',
      verifyTutorial: 'Verification guide',
      collapseTutorial: 'Collapse guide',
      vrfGuideStep1:
        'Click a verification hash in the draw results or history to open that round’s draw transaction on BscScan.',
      vrfGuideStep2:
        'In the transaction Logs, find the Chainlink VRF callback; randomWords is this round’s on-chain randomness, with a cryptographic proof that it cannot be predicted or tampered with.',
      vrfGuideStep3:
        'On the staking contract’s Read Contract page, call verifyDraw with that day’s round ID to recompute the winner list and check it against the published results.',
      resultsTitle: 'Draw results',
      dateFilterAria: 'Select draw date',
      resultsSummary: 'Draw · {count} winners',
      verifyHash: 'Verify round hash',
      meBadge: 'Me',
      resultWon: 'Won {amount}',
      resultLost: 'Did not win',
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
            a: 'At 00:00 UTC, Chainlink VRF v2.5 produces verifiable randomness; the contract selects up to 10 winners from that day’s list to share the pool (daily pool target ≥ $5,000).',
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
            a: 'No. Liquid staking has a per-person daily cap, so a single stake will not exceed $5,000 and cannot meet the draw eligibility amount.',
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
      contributionHint: 'Claims spend {ratio}',
      nextPayout: 'Next reward payout',
      recordsTitle: 'Referral reward records',
      recordsColumns: ['Time', 'Amount', 'Status', 'Claimed at'],
      emptyRecords: 'No reward records yet. Entries appear after rewards are issued.',
      referralsTitle: 'My referrals ({count})',
      referralsColumns: ['Joined', 'Address', 'Position', 'Cumulative referral rewards'],
      emptyReferrals: 'No direct referrals yet. Share your invite link to list partners here.',
      hideZeroPosition: 'Hide 0 positions',
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
            a: 'Use the left claim panel to set the claim vs restake split: the claimed portion enters the release pool and unlocks linearly over the chosen period; the restake portion goes straight into single-token staking to compound. Both claim and restake spend contribution at 1:1.',
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
      contributionHint: 'Claims spend {ratio}',
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
            a: 'On the left claim panel, choose the claim vs restake split: the claim share enters the release queue for linear vesting; the restake share goes into single-asset staking. Both spend contribution 1:1.',
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
      contributionHint: 'Claims spend {ratio}',
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
      reqAchieved: 'Achieved',
      tierRate: 'Bonus {rate}',
      tierProgress: 'Progress to {level}',
      tierProgressCount: 'Met {done}/{total}',
      tierMax: 'Highest tier reached',
      recordsTitle: 'Reward records',
      recordsTabsAria: 'Reward record type',
      recordsTabCobuild: 'Co-build',
      recordsTabEqualize: 'Equalize',
      recordsColumns: ['Time', 'Tier', 'Amount', 'Status', 'Claimed at'],
      emptyRecordsCobuild: 'No reward records yet. Entries appear after rewards are issued.',
      emptyRecordsEqualize: 'No equalize records yet. Entries appear after rewards are issued.',
      teamTitle: 'My team ({count})',
      teamColumns: ['Joined', 'Address', 'Team performance', 'Highest team tier'],
      emptyTeam: 'No team members yet. Share your invite link to list partners here.',
      hideZeroMarket: 'Hide 0 performance',
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
            a: 'Switch Co-build / Equalize at the top of the left claim panel, then set the claim vs restake split: claimed portion enters the release pool for linear unlock over the chosen period; restake goes straight into single-token staking to compound. Both spend contribution at 1:1.',
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
            a: 'Genesis tiers run S1 to S10, rated by personal co-build amount and total organization volume. Higher tiers also require the dual-leg promotion condition.',
          },
          {
            q: 'What is the tier uplift reward?',
            a: 'The Genesis tier reached during co-build automatically lifts one tier after protocol launch, valid for 30 days, then returns to your real tier.',
          },
          {
            q: 'How are Genesis team rewards settled?',
            a: 'Genesis team rewards settle automatically at the matching Genesis tier rate and must be claimed to wallet by you. After the co-build period ends this page closes; unclaimed rewards can no longer be claimed and are sent to the smart market-making contract.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'How are rewards paid out?',
          a: 'All rewards settle as gAGX and are credited to the matching reward cards by each program’s rules. Check balances anytime on the Rewards hub.',
        },
        {
          q: 'What is required to claim?',
          a: 'Claiming spends contribution at 1:1 (claiming 1 gAGX spends 1 point). Points come from burning AGX; if you are short, get them on the Burn page first.',
        },
        {
          q: 'When do claimed rewards arrive?',
          a: 'When claiming, pick a release period. Rewards enter the release pool and unlock linearly — longer periods, lower tax. You can also restake some or all rewards into single-token staking to compound.',
        },
        {
          q: 'When are rewards settled?',
          a: 'Lucky draws settle at 00:00 UTC daily. Other rewards follow Rebase, about every 12 hours, so they settle on the same cadence. Next payout time is on each reward detail data panel.',
        },
        {
          q: 'Why do some cards hide amounts?',
          a: 'Settings in the top-right default to “Hide 0-balance assets”, so cards with 0 balance are hidden. Uncheck it to see every reward card.',
        },
      ],
    },

    teamRewardRate: 'Team reward {rate}',
    superCommunityBadge: 'Super System',
    heroTierRewardBody: 'Earn {bonus} of team co-build volume as reward.',
    superCommunityBenefitBody:
      'Super Systems receive a dedicated development fund and governance rights.',
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
    communityFundLocked: 'Locked: {amount}',
    communityFundHistory: 'Development fund',
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
      pending: 'To claim',
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
    cobuildLevel: 'Co-build tier',
    makingLevel: 'Making rank',
    inviteTitle: 'Start inviting · Share ecosystem growth value',
    programs: {
      title: 'Ecosystem support programs',
      items: [
        {
          label: 'X DAO Co-build · Phase {season}',
          title: 'Global co-build program underway',
          body: 'Bringing together co-builders worldwide to take part in ecosystem building.',
          action: 'View program details →',
          href: 'https://xdaoaegis.notion.site/genesis-reserve-council-program',
        },
        {
          label: 'X Academy',
          title: 'Ecosystem training program for co-builders',
          body: 'Helping co-builders understand the ecosystem mechanisms and roadmap more deeply.',
          action: 'View program details →',
          href: 'https://xdaoaegis.notion.site/x-academy-en',
        },
      ],
    },
    myInvites: 'My direct referrals ({count})',
    referralBondPermanent: 'Referral relationship active · binding is permanent.',
    volumePrefix: 'Volume',
    statToday: 'Today +{count} · +{amount}',
    statRewardRate: 'Reward rate {rate}',
    bindReferrerSuccess: 'Referrer bound successfully',
    inviteFlow: {
      rewardLink: 'Rewards',
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
          title: 'Earn rewards',
          body: 'After partners join co-build, rewards settle with rebase distributions. Go to the {link} section to claim yours.',
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
          q: 'How are genesis referral rewards calculated?',
          a: 'Genesis referral rewards are 3%, using a compressed equal-amount settlement: only the matching amount is counted.',
        },
        {
          q: 'How do I raise my genesis rank?',
          a: 'Based on your personal co-build amount and system performance, you can advance from S1 to S10.',
        },
        {
          q: 'How do I qualify for the development allowance?',
          a: 'When cumulative system performance reaches $1,000,000, you can receive 5% development fund support. Ask your inviter for help applying.',
        },
      ],
    },
  },
  assets: {
    title: 'Assets',
    intro: 'Manage your AEGIS X ecosystem funds',
    body: 'Manage your AEGIS X ecosystem funds',
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
      sortOptions: {
        startNear: 'Start time · newest first',
        startFar: 'Start time · oldest first',
        endNear: 'Expiry · soonest first',
        endFar: 'Expiry · latest first',
      },
      emptyTitle: 'Start earning with your assets',
      pageSize: 5,
      voucher: 'Voucher',
      remaining: 'Time left',
      staked: 'Staked',
      payout: 'Pending payout',
      bondPrincipal: 'Bond principal',
      yield: 'Yield',
      claim: 'Claim',
      redeem: 'Redeem',
      unstake: 'Unstake',
      liquid: 'Flexible',
      lockedPrefix: 'Locked',
      redeemAnytime: 'Redeemable anytime',
      fullyReleased: 'Fully released',
      activateWarmup: 'Unlock',
      activateWarmupSuccess: 'Unlocked',
      warmupRemainingEpochs: '{n} epochs remaining',
    },
    opsColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
    claim: {
      title: 'Claim yield',
      amount: 'Claim amount',
      splitAria: 'Release vs restake split',
      releasePeriod: 'Release period',
      releasePeriodAria: 'Release period',
      restakePeriod: 'Restake period',
      restakePeriodAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      restakeDaysTax: '{days}d · {tax}',
      taxRate: 'tax {rate}%',
      contribNeed: 'This claim requires {amount} contribution points',
      contribShort: 'Not enough contribution points — burn AGX for points first',
      goBurn: 'Go to Burn',
      ctaMixed: 'Restake & Claim',
      ctaRelease: 'Claim',
      ctaRestake: 'Restake',
      success: 'Claim submitted',
      restakeSuccess: 'Restake submitted',
      xmineSuccess: 'X reward claim submitted',
    },
    claimOutput: {
      title: 'Claim output',
      rewardLabel: 'Yield',
      boostLabel: 'Bonus',
      claimReward: 'Claim yield',
      claimBoost: 'Claim bonus',
      contribDeduct: 'Deducts {amount} contribution points',
    },
    redeem: {
      releasedLabel: 'Released',
      title: 'Redeem stake',
      body: 'After redeem, assets enter the buffer for a {days}-day linear release. Buffer assets earn no yield.',
      confirmCta: 'Redeem',
      success: 'Redeem submitted — principal entered the release buffer',
    },
    hub: {
      filterAria: 'Filter assets',
      hideZero: 'Hide 0 assets',
      hideZeroEmpty: 'No non-zero positions',
      card: {
        position: 'Position',
        yield: 'Total yield',
      },
      modes: {
        stake: {
          title: 'Stake',
          body: 'Manage AGX flexible / term positions',
          aprHint:
            'Share of claimed staking yield plus unclaimed staking yield and bonus yield combined',
        },
        lpbond: {
          title: 'LP Bond',
          body: 'Manage liquidity bond positions',
          aprHint: 'Share of claimed LP bond yield plus unclaimed LP bond yield combined',
        },
        burnbond: {
          title: 'Burn Bond',
          body: 'Manage burn bond positions',
          aprHint: 'Share of claimed burn bond yield plus unclaimed burn bond yield combined',
        },
        xmine: {
          title: 'X Mine',
          body: 'Manage gAGX mining positions',
          aprHint: 'Share of claimed mining output plus unclaimed mining output combined',
        },
      },
      overview: {
        title: 'Assets overview',
        totalValue: 'Total value',
        totalValueHint: 'Mark-to-market of principal + unclaimed yield',
        claimable: 'Claimable yield',
        claimed: 'Claimed total',
        contribution: 'Contribution points',
        contributionHint: 'Claims consume {ratio} contribution',
        holdingsTitle: 'Holdings',
        holdingsReleased: 'Released',
        holdingsTotal: 'Total holdings',
        bufferTitle: 'Buffer pool',
        bufferHint:
          'After unstaking, principal enters the buffer for a {days}-day secondary linear release, reducing short-term outflow pressure on market liquidity and balancing continuous release with market stability.',
        bufferTotal: 'In vault',
        bufferReleased: 'Withdrawn',
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
          { title: 'Epoch', body: '~{blocks} blocks\n~{hours} hours' },
          { title: 'Rebase', body: 'Epoch end\nAuto settle' },
          { title: 'Rebase', body: 'Yield distribution\n{timesPerDay} times daily' },
        ],
        tags: ['Block-driven', 'Epoch settlement', 'Rebase distribution', 'Smooth release'],
        footer: 'Blocks drive cycles; Epochs settle; Rebase distributes yield',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How is total asset value calculated?',
            a: 'Total asset value = position principal + unclaimed yield + mining output, marked at current market prices. Idle wallet balances are excluded; price moves update the valuation in real time.',
          },
          {
            q: 'In what form is yield paid?',
            a: 'Rebase yield from staking, LP bonds, and burn bonds settles as gAGX. Redeem gAGX 1:1 for AGX or use it in X Mine. X Mine output is the ecosystem value token X and can be claimed anytime.',
          },
          {
            q: 'Why can I not claim yield?',
            a: 'Claiming yield spends contribution points. If your account does not have enough, the claim cannot proceed — buy and burn AGX for contribution points first, then return to Assets. The contribution-points mechanism ensures every yield withdrawal also contributes to protocol deflation.',
          },
          {
            q: 'How do I earn contribution points?',
            a: 'Buy AGX and burn it to receive contribution points. Claims spend contribution points at 1:1 (claiming 1 gAGX spends 1 contribution point); prepare enough for the yield you plan to claim.',
          },
          {
            q: 'Why choose a release period when claiming?',
            a: 'Claimed yield is not instant. It unlocks linearly over the chosen period; longer periods have lower tax: 5 days 20%, 20 days 10%, 40 days 5%, 60 days 1%.',
          },
          {
            q: 'Where does claimed yield go?',
            a: 'Claimed yield does not go straight to your wallet. It enters the release pool and unlocks linearly over the period you chose. Open the release pool to track each claim; released amounts can be withdrawn to your wallet.',
          },
          {
            q: 'Restake vs claim?',
            a: 'Restake skips the release period — yield goes straight into single-token staking to keep compounding, at a better tax rate (360 days 15%, 540 days 10%), better for long-term participants. Claim unlocks to wallet over the release period and is more flexible.',
          },
          {
            q: 'What is the buffer pool?',
            a: 'After principal is unstaked it enters the buffer pool for a 30-day secondary linear release, reducing clustered short-term outflows. Amounts marked Released in the buffer can be redeemed to wallet anytime.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Stake positions',
        intro: 'Manage each stake — claim yield or redeem principal anytime',
        empty: 'No stake positions yet. Complete a stake and each position will show here.',
        emptyCta: 'Open your first stake and start earning',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'My holdings' },
            { label: 'Released' },
            { label: 'Pending release' },
            {
              label: 'Current Rebase yield',
              hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
            },
            {
              label: 'Current Rebase bonus',
              hint: 'Unclaimed Rebase bonus does not compound',
            },
            {
              label: 'Total stake yield',
              hint: 'Sum of claimed and unclaimed staking yield',
            },
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
              a: 'Claim is for yield: take accumulated gAGX over the chosen release period, or restake it. Redeem is for principal: take released AGX principal into a 30-day buffer for a second linear release, then to your wallet.',
            },
            {
              q: 'Why is each stake shown separately?',
              a: 'Each stake tracks its own period, yield, bonus, and release progress. Maturity and available actions do not affect other positions, so they are shown and operated separately.',
            },
            {
              q: 'What does “Released” mean?',
              a: 'Principal unlocks linearly by block (~3 seconds per block). “Released” is the portion already unlocked and redeemable anytime; the rest continues unlocking over the period.',
            },
            {
              q: 'What happens when the countdown ends?',
              a: 'When the countdown ends, principal release is complete and you can redeem all principal anytime. Unclaimed principal still earns yield. After you redeem principal, unclaimed yield does not expire and keeps compounding.',
            },
            {
              q: 'How does the restake ratio work when claiming?',
              a: 'Use the slider to split restake vs claim. The restake portion goes straight into single-token staking for the chosen period and keeps compounding (better tax). The claim portion unlocks linearly over the chosen release period.',
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
            {
              label: 'Current Rebase yield',
              hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
            },
            {
              label: 'Total LP Bond yield',
              hint: 'Sum of claimed and unclaimed LP Bond yield',
            },
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
              a: 'Yes. On claim, split release vs restake; restake routes into single-asset staking (360/540 days) with better tax than period claim.',
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
            {
              label: 'Current Rebase yield',
              hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
            },
            {
              label: 'Total Burn Bond yield',
              hint: 'Sum of claimed and unclaimed Burn Bond yield',
            },
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
              a: 'Yes. On claim, split release vs restake; restake routes into single-asset staking (360/540 days) with better tax than period claim.',
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
            {
              label: 'Total mining output',
              hint: 'Sum of claimed and unclaimed mining output',
            },
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
    max: 'Max',
    blocked: {
      notBound: 'Bind a referral first',
      accountMigrated: 'This address has migrated — use the new address',
      migrationNotOpen: 'Account migration is not open yet',
      insufficientBalance: 'Wallet balance is too low — enter less, or add funds first',
      insufficientGagx: 'Not enough gAGX — wrap AGX via Flash first, then try again',
      insufficientAllowance: 'Insufficient allowance',
      insufficientQuota: 'This amount is over your stake limit — enter a smaller amount',
      insufficientQuotaWithAmount:
        'This amount is over the stake limit. You can stake at most {quota} AGX right now. Enter a smaller amount and try again.',
      insufficientQuotaPersonalWithAmount:
        'This amount is over your personal stake limit. You have {quota} AGX left on your address cap. Enter a smaller amount and try again.',
      insufficientQuotaPersonalDailyWithAmount:
        'This amount is over your daily personal stake limit. You have {quota} AGX left for today. Enter a smaller amount, or wait for the daily reset.',
      insufficientQuotaPoolWithAmount:
        'The on-chain stake pool does not have enough capacity. Only {quota} AGX is left in the pool. Enter a smaller amount, or try again later.',
      insufficientXmineQuotaWithAmount:
        'This amount is over your mining quota. Mining quota comes from your locked principal — you can stake at most {quota} gAGX now. Enter a smaller amount, or add locked positions first.',
      poolPaused: 'This staking pool is temporarily closed — try again later',
      depositoryNotAuth:
        'This bond market is not open for purchase — try another term or come back later',
      insufficientDebtCapacity:
        'This bond market does not have enough remaining capacity — buy less, or try again later',
      bondTooSmall:
        'Purchase too small: discounted payout is below the minimum. Increase the amount and try again',
      bondTooLarge:
        'Purchase too large: it exceeds this bond’s per-trade payout cap. Lower the amount and try again',
      zeroAmount: 'Enter a valid amount',
      unavailable: 'Transaction temporarily unavailable — try again later',
    },
    hub: {
      modes: {
        stake: {
          title: 'Stake',
          body: 'Stake AGX — rebase {timesPerDay} times daily with compounding',
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
            hint: 'Settled once per Epoch (~{hours}h); adjusts with protocol state',
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
        bondColumns: ['Period', 'Base daily yield', 'Discount rate', 'Period yield'],
        rows: [
          { id: 'liquid', period: 'Flexible (term)' },
          { id: '180', period: '180d' },
          { id: '360', period: '360d' },
          { id: '540', period: '540d' },
        ],
      },
      runwayDays: '> {days}d',
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
            a: 'The protocol runs on blocks: ~14,400 blocks = 1 Epoch (~12 hours). Rebase settles at each Epoch end — 2 times daily.',
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
      countdownUnits: { hours: 'h', minutes: 'min', seconds: 's' },
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
      recordsFooter: {
        stake: 'Total staked {amount} AGX',
        bond: 'Total purchased {amount}',
        xmine: 'Total staked {amount} gAGX',
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
        {
          label: 'Current Rebase yield',
          hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
        },
        {
          label: 'Current Rebase bonus',
          hint: 'Unclaimed Rebase bonus does not compound',
        },
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
        sourcesKicker: 'Value sources',
        sourcesHeadline: 'Three demand layers',
        sourcesBadge: 'Steadily growing X demand',
        sources: [
          { title: 'gAGX demand', copy: 'Stake to mine and create demand for X' },
          { title: 'Yield recycle', copy: 'Protocol yield continuously returns to the ecosystem' },
          { title: 'Ecosystem growth', copy: 'Apps expand and users drive demand' },
        ],
        deflationKicker: 'X deflation',
        deflationHeadline: 'Ongoing deflation',
        deflationBadge: 'Less supply · higher value',
        deflationSteps: [
          { title: 'Ecosystem growth', copy: 'The ecosystem keeps expanding' },
          { title: 'X demand growth', copy: 'Apps and trading lift demand' },
          { title: 'Market circulation', copy: 'X circulates and is used in the market' },
          { title: '25% sell-tax burn', copy: 'Every sell automatically burns 25%' },
        ],
        featuresKicker: 'X core traits',
        featuresHeadline: 'Long-term value vehicle',
        featuresBadge: 'Scarce · deflationary · liquid · expanding',
        features: [
          { title: 'Fixed supply', copy: 'Hard cap, scarce value' },
          { title: 'Ongoing deflation', copy: 'Burns lift value' },
          { title: 'Liquidity support', copy: 'Liquidity keeps markets stable' },
          { title: 'Ecosystem expansion', copy: 'Apps grow and value accrues' },
        ],
      },
    },

    stake: {
      title: 'Stake',
      intro: 'Stake AGX · rebase {timesPerDay} times daily with compounding',
      periodLabel: 'Choose staking period',
      periodAria: 'Choose staking period',
      amountAria: 'Stake amount',
      amountBalance: 'Amount (wallet balance {balance} AGX)',
      quotaInline: 'Stake quota: {quota} AGX',
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
        {
          label: 'Current epoch',
          hint: 'Each Epoch is about {hours} hours ({blocks} blocks); staking yield settles per Epoch',
        },
        { label: 'Next rebase' },
        {
          label: 'Current rebase yield',
          hint: 'Settled once per Epoch (~{hours}h); adjusts with protocol state',
        },
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
          body: 'Each epoch (~{hours}h) settles; yield accrues as gAGX.',
        },
        {
          title: 'Release & claim',
          body: 'Principal unlocks linearly; claim or recycle gAGX from Assets.',
        },
      ],
      faq: [
        {
          q: 'How is staking yield calculated?',
          a: 'Rebase 2 times daily; daily yield is about 0.5%–1%. Longer locks earn higher bonuses: 180d ≥10%, 360d ≥15%, 540d ≥20%, adjusted with the rebase factor.',
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
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'LP bond TVL' },
        {
          label: 'Bond premium',
          hint: 'Return gap of the current discount versus the AGX market price',
        },
        { label: 'Next Rebase payout' },
        {
          label: 'Current Rebase yield',
          hint: 'Settled once per Epoch (~{hours}h); adjusts with protocol state',
        },
      ],
      positionMetrics: [
        { label: 'My holdings' },
        { label: 'Released' },
        { label: 'Pending release' },
        {
          label: 'Current Rebase yield',
          hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
        },
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
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'Burn bond TVL' },
        {
          label: 'Bond premium',
          hint: 'Return gap of the current discount versus the AGX market price',
        },
        { label: 'Next Rebase payout' },
        {
          label: 'Current Rebase yield',
          hint: 'Settled once per Epoch (~{hours}h); adjusts with protocol state',
        },
      ],
      positionMetrics: [
        { label: 'My holdings' },
        { label: 'Released' },
        { label: 'Pending release' },
        {
          label: 'Current Rebase yield',
          hint: 'Unclaimed Rebase yield keeps compounding with every block reward',
        },
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
      openKlineChart: 'View candlestick chart',
      meta: {
        quota: 'Mining quota',
        daily: 'Daily yield',
        max: 'Max stake',
        maxHint: 'gAGX stake cannot exceed your ≥180-day AGX bond holdings plus AGX stake total',
        lock: 'Lock',
        lockValue: 'Releases after 24 hours',
        h24: '24h',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'X Mine TVL' },
        { label: 'X price' },
        { label: 'Total mined' },
        {
          label: 'Daily yield rate',
          hint: 'Allocated dynamically from protocol yield and network stake; adjusted daily',
        },
        {
          label: 'Next mining payout',
          hint: 'X mining yield is produced daily at 00:00 UTC',
        },
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
          body: 'After unstake, gAGX releases linearly over ~30 days.',
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
          a: 'After unlock, gAGX uses a 30-day block-linear release to reduce clustered sell pressure after unstake and strengthen long-term value capture.',
        },
        {
          q: 'What is the X supply? Will it inflate?',
          a: 'Fixed 210 million X, never inflated. 47.62% for LP liquidity (initial pool, market making, and liquidity support); 52.38% for global rewards and growth (gAGX mining rewards, market expansion and brand partnerships, ecosystem and long-term development).',
        },
        {
          q: 'How do I get gAGX?',
          a: 'gAGX is the unified settlement voucher for Rebase and DAO rewards: rebase yield from AGX staking or bonds, and DAO rewards, are all paid as gAGX. gAGX is the only entry into the X ecosystem.',
        },
        {
          q: 'What else can gAGX do besides mining?',
          a: 'Redeem gAGX 1:1 for AGX anytime to keep compounding via staking, or stake gAGX to mine X. Both paths are yours to choose.',
        },
        {
          q: 'Why does X deflate?',
          a: 'Each X sell burns 25%. As ecosystem growth lifts demand and turnover, burns accumulate, X circulating supply shrinks, and a long-term deflation loop of “less supply, higher value” forms.',
        },
        {
          q: 'What drives X value?',
          a: 'Three demand layers: gAGX mining demand for X; protocol revenue recirculated into the ecosystem; and app expansion plus user growth. Together they keep reinforcing X demand.',
        },
        {
          q: 'Why is the cap tied to bonds and long-term stake?',
          a: 'This keeps X miners as long-term protocol builders: your gAGX stake cap cannot exceed your ≥180-day AGX bond holdings plus AGX stake total. Add bonds or long-term stake to raise the mining cap.',
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
      amountBuy: 'Purchase amount',
      amountAria: 'Amount',
      price: 'Exit AGX price',
      priceX: 'Exit X price',
      priceCurrent: 'Current {price}',
      priceAria: 'Price input',
      days: 'Hold days',
      dayBubble: 'Day {day}',
      sliderBreakEven: 'Positive yield',
      sliderMaturity: '{days}-day maturity',
      daysAria: 'Hold days',
      submit: 'Calculate',
      result: {
        interest: 'Estimated yield',
        total: 'Total yield',
        rate: 'Yield rate',
        sellTotal: 'Sell proceeds',
        invested: 'Total invested',
        yieldBar: 'Yield {amount}',
        lossBar: 'Loss {amount}',
        legend: {
          released: 'Released principal value',
          netYield: 'Net yield value',
          netYieldHint: 'Compounded rebase plus term bonus; contribution points are not deducted',
          netYieldHintXmine: 'X mined, valued at the expiry X price',
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
          { label: 'Breakeven day', note: 'Selling from this day can realize positive yield' },
          {
            label: 'Principal fully released',
            hint: 'Principal unlocks linearly by period blocks; from this day it is fully withdrawable',
          },
          { label: 'Hold to term end', note: 'Cumulative yield vs principal' },
        ],
        notes: 'Notes',
        notesBody: 'Local estimate only — not an on-chain quote or yield promise.',
        notesItems: [
          'Rebase settles about every {hours} hours ({timesPerDay} times daily). Yield compounds at {rebase}% per Rebase; longer terms add a simple-interest bonus on Rebase yield: 180d 10%, 360d 15%, 540d 20%.',
          'Principal unlocks linearly over the selected term; sell proceeds count only principal released by that day. Unreleased principal is not included in the sale total.',
          'Net yield is compounded Rebase plus the term bonus. Released principal plus net yield are sold at the exit price you set. Contribution-point cost to claim yield is not included.',
          'The estimate does not deduct yield-release tax or model price moves while principal and yield unlock. Illustrative only; actual yield varies with protocol state.',
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
      released: 'Claimable',
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
        { title: '1:1 contribution', body: '50% burn · 50% into X pool' },
        { title: 'Enter release pool', body: 'Choose 5 / 20 / 40 / 60 days' },
        { title: 'Claim into Turbine', body: '1:1 buy to unlock sell quota' },
      ],
      taxTitle: 'Longer release, lower tax',
      taxPeriod: 'Period',
      taxRate: 'Claim tax',
    },
    queue: {
      title: 'Release pool',
      intro:
        'Claimed yield unlocks here over the selected period. Released amounts can be claimed into Turbine anytime.',
      hubHint:
        'Claimed yield and rewards unlock here linearly over the selected period (5/20/40/60 days). Released amounts can be claimed into Turbine anytime.',
      planDays: '{days}d',
      claim: 'Claim',
      refresh: 'Refresh',
      claimSuccess: 'Claimed into Turbine quota',
      goTurbine: 'Go to Turbine',
      statsTitle: 'Release pool data',
      lifetimeClaimed: 'Lifetime claimed from pool',
      hints: {
        releasing:
          'Total gAGX still in the release pool, unlocking linearly over the chosen period',
        released: 'gAGX that has finished releasing and can be claimed into Turbine anytime',
        lifetimeClaimed: 'Lifetime gAGX claimed from the release pool into Turbine',
      },
      recordsTitle: 'Release pool records',
    },
    buffer: {
      title: 'Buffer pool',
      intro:
        'Redeemed principal unlocks here over {days} days of secondary linear release. Released AGX can be withdrawn to your wallet.',
      hubHint:
        'Redeemed assets enter the buffer pool and unlock linearly over {days} days by block. Released amounts can be withdrawn to your wallet anytime.',
      claim: 'Withdraw',
      refresh: 'Refresh',
      claimSuccess: 'Extracted to wallet',
      statsTitle: 'Buffer pool data',
      entered: 'Total entered',
      extracted: 'Total withdrawn',
      hints: {
        enteredAgx: 'Total AGX that entered the buffer after staking and bond redemptions',
        extractedAgx: 'Total AGX withdrawn from the buffer to the wallet',
        releasingAgx: 'AGX still releasing in the buffer',
        enteredGagx: 'Total gAGX that entered the buffer after X mining redemptions',
        extractedGagx: 'Total gAGX withdrawn from the buffer to the wallet',
        releasingGagx: 'gAGX still releasing in the buffer',
      },
      recordsTitle: 'Buffer pool records',
      mechanismTitle: 'Principal release flow',
      mechanismSubtitle:
        'Stake and bond principal use a two-stage release model for market stability.',
      mechanismSteps: [
        { title: 'Stake /', body: 'bond principal' },
        { title: 'Block-level', body: 'linear release' },
        { title: 'After redeem', body: '{days}-day buffer' },
        { title: 'Secondary', body: 'linear release' },
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
          q: 'Why can’t yield go straight to my wallet?',
          a: 'Release sits between earning yield and using it freely. Yield first unlocks linearly in the release pool over the period you choose, then unlocks through Turbine before it reaches your wallet. That pacing turns clustered sell pressure into ongoing buy demand, and is core to protecting AGX price and the protocol’s long-term run.',
        },
        {
          q: 'Release pool vs buffer pool?',
          a: 'The release pool takes yield you actively claim from staking, bonds, mining, and rewards. It unlocks linearly over the period you choose, then claims into Turbine. The buffer takes certain inflows that do not need a period choice; after release you withdraw straight to wallet. The two do not affect each other — view and claim them separately.',
        },
        {
          q: 'What is the full release path?',
          a: 'Claim yield → spend contribution 1:1 → enter the release pool (tax taken once by period) → linear unlock → claim into Turbine → buy equal AGX with USD1 to unlock → extract to wallet after cooldown. The buffer path is shorter: withdraw once release finishes.',
        },
        {
          q: 'Why does claiming yield spend contribution points?',
          a: 'Claims spend contribution 1:1 with the amount claimed. Points come from burning AGX: 50% is burned and 50% is added to the X base pool. Every yield payout thus also adds deflation and liquidity. If you do not have enough points, get more on the Burn page.',
        },
        {
          q: 'How should I weigh tax vs period?',
          a: 'Shorter periods tax more (5 days 20%, 20 days 10%, 40 days 5%, 60 days 1%). Tax is taken once when yield enters the pool. Need funds soon → short period. Want to keep more → long period. You can also send yield in batches with different periods to balance speed and cost.',
        },
      ],
      queue: [
        {
          q: 'Can I change the release period?',
          a: 'No. The period is fixed when yield enters the release pool and cannot be changed afterward. Each claim is independent, so the next one can use a different period.',
        },
        {
          q: 'When is the tax taken?',
          a: 'Tax is taken once when yield enters the release pool, using the chosen period’s rate (5 days 20%, 20 days 10%, 40 days 5%, 60 days 1%). Amounts shown in the pool are already after tax; release and later claims add no extra fee.',
        },
        {
          q: 'Where does a release-pool claim go?',
          a: 'Claimed gAGX does not go straight to your wallet. It enters Turbine and continues under Turbine rules. Open the Turbine page to view and manage it.',
        },
        {
          q: 'Do I lose unlocked amounts if I wait?',
          a: 'It does not expire — claim anytime. Released amounts sitting in the pool earn no yield, so claim promptly into Turbine.',
        },
        {
          q: 'How do I pick a period?',
          a: 'If you want funds sooner, pick a short period (higher tax). If you can wait, pick a long period for a lower rate. You can also send yield into the pool in multiple claims with different periods to balance speed and tax.',
        },
      ],
      buffer: [
        {
          q: 'What is the buffer pool?',
          a: 'After principal is unstaked (redeemed) it enters the buffer pool for a 30-day secondary linear release. This reduces clustered short-term outflows and balances continuous release with market stability.',
        },
        {
          q: 'Do buffer assets still earn yield?',
          a: 'No. Assets stop earning any yield the moment they enter the buffer, so time redemptions to your own cash needs.',
        },
        {
          q: 'How do I withdraw released amounts?',
          a: 'The buffer unlocks linearly by block. Tap Withdraw on the Released portion — it goes straight to your wallet with no extra wait.',
        },
        {
          q: 'Why show AGX and gAGX?',
          a: 'Principal from stake and bond redemptions is AGX; X Mine unstake is gAGX. The two assets release and withdraw independently.',
        },
        {
          q: 'Why can’t I withdraw everything at once?',
          a: 'Buffer assets may come from many redeem records, each with its own buffer clock. When there are many records, one withdraw can only process a limited number, so you may not clear all released amounts in one tap. Tap Withdraw again until everything is out.',
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
    communityVolume: 'Team performance',
    holding: 'Holdings',
    contribution: 'Subscription',
  },
}) satisfies AppMessagesBundle

export default app
