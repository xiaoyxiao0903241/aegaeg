import { defineMessages } from '~/i18n/messages/define-messages'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Cüzdanı Bağla',
    language: 'Dil',
    copy: 'Kopyala',
    claimable: 'Talep Edilebilir',
    max: 'Maks',
    shareUnit: 'pay',
    confirm: 'Onayla',
    close: 'Kapat',
    paginationTotal: 'Toplam {total} kayıt',
    paginationPerPage: 'Sayfa başına {size} kayıt',
    paginationPrev: 'Önceki',
    paginationNext: 'Sonraki',
  },
  errors: {
    api: {
      network: 'Ağ bağlantısı başarısız. Bağlantınızı kontrol edip tekrar deneyin.',
      timeout: 'İstek zaman aşımına uğradı. Lütfen daha sonra tekrar deneyin.',
      unavailable: 'Hizmet geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.',
      badResponse: 'Beklenmeyen sunucu yanıtı. Lütfen daha sonra tekrar deneyin.',
      fallback: 'Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.',
    },
    chain: {
      fallback: 'Zincir üstü işlem başarısız. Lütfen daha sonra tekrar deneyin.',
    },
    walletNotConnected: 'Önce cüzdanınızı bağlayın ve oturum açın.',
    quoteFailed: 'Teklif başarısız. Lütfen daha sonra tekrar deneyin.',
    loadFailed: 'Yükleme başarısız. Lütfen daha sonra tekrar deneyin.',
    loginFailed: 'Oturum açma başarısız. Lütfen daha sonra tekrar deneyin.',
    loginSignatureRejected: 'Giriş imzası geçersiz veya süresi dolmuş. Lütfen yeniden imzalayın.',
    pageLoadFailed: 'Sayfa yüklenemedi',
    pageLoadFailedBody:
      'İşleme sırasında bir hata oluştu. Devam etmek için yenileyin — cüzdan bağlı kalır.',
    reloadPage: 'Sayfayı yenile',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'Ortak İnşa',
    rewards: 'Ödüller',
    release: 'Release',
    community: 'Topluluk',
    rewardsTooltip: 'Öneri ödülleri ve takım ödüllerini görüntüleyin.',
    communityTooltip:
      'Ortak inşaya katılmak için arkadaşlarınızı davet edin, ekosistem büyüme değerini ve Genesis ödüllerini paylaşın',
    bscTooltip:
      'Yalnızca BSC · AEGIS X, BNB Smart Chain üzerinde çalışır; şimdilik ağ değiştirme desteklenmiyor.',
  },
  topbar: {
    currentNetwork: 'Mevcut Ağ',
    openMenu: 'Navigasyonu aç',
    closeMenu: 'Navigasyonu kapat',
    hideDetails: 'Detay panelini gizle',
    showDetails: 'Detay panelini göster',
    toggleTooltip: 'Detay panelini göster veya gizle',
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
      promoTitle: 'AEGIS X özelliklerini keşfetmek için cüzdanınızı bağlayın',
      promoBrandLine: 'Geleceğin Değer Ağını Koruyun',
      recordsTitle: 'Kayıtlarınızı görüntülemek için lütfen cüzdanınızı bağlayın',
      recordsBodyGenesis:
        'Bağlantı kurulduktan sonra, ortak inşa geçmişiniz burada görüntülenecektir',
      recordsBodyRewards: 'Bağlantı kurulduktan sonra, ödül geçmişiniz burada görüntülenecektir',
      recordsBodyCommunity:
        'Bağlantı kurulduktan sonra, davet kayıtlarınız burada görüntülenecektir',
    },
  },
  wallet: {
    connectTitle: 'Cüzdanı Bağla',
    connectIntroTitle: 'AEGIS X özelliklerini keşfetmek için cüzdanınızı bağlayın',
    connectIntroLink: 'AEGIS X özellikleri ↗',
    connecting: 'Bağlanıyor…',
    copyAddress: 'Adresi kopyala',
    copied: 'Kopyalandı',
    copyFailed: 'Kopyalama başarısız. Manuel kopyalamak için uzun basın.',
    disconnect: 'Bağlantıyı kes',
    reconnectWallet: 'Cüzdanı yeniden bağla',
    reconnectHint: 'Cüzdan bağlantısı kesildi, zincir üstü işlem yapmadan önce yeniden bağlanın.',
    signInRequired: 'Giriş yap',
    accountBanned: 'Hesabınız askıya alındı. Destek ile iletişime geçin.',
    transactionErrors: {
      gasLimitTooLow:
        'Gas limiti çok düşük. Ağ ücretleri için cüzdanda yeterli BNB bırakıp tekrar deneyin.',
      gasEstimateFailed: 'Bu işlem için gas tahmin edilemedi. Ağı kontrol edip tekrar deneyin.',
      insufficientFunds: 'Ağ gas ücretlerini ödemek için yeterli BNB yok.',
      transactionFailed: 'İşlem başarısız. Lütfen daha sonra tekrar deneyin.',
      transactionUnknown:
        'İşlem durumu bilinmiyor. Tekrar göndermeyin — önce cüzdanınızı veya blok gezginini kontrol edin.',
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
    title: 'Ortak İnşa Planı',
    intro: 'X DAO Ortak İnşa Planına katılın · Faz {season}  ({discount} indirim)',
    shares: 'Pay (1 pay = 100 USD1 · maks {max} pay)',
    quota: 'Faz ortak inşa kotası',
    pay: 'Ödeme',
    receive: 'Alınacak AGX',
    value: 'Abonelik değeri',
    xTokenAirdrop: 'Alınacak X başlangıç airdrop değeri',
    xTokenAirdropHint:
      'Faz bazında kümülatif ortak inşa tutarı ≥ {threshold} olduğunda airdrop ödülü kazanılır',
    join: 'Ortak İnşaya Katıl',
    joinGenesis: 'Genesis ortak inşaya katıl',
    statsTitle: 'Faz {season} ortak inşa verileri',
    startsIn: 'Başlangıç geri sayımı',
    countdownUnits: { days: 'd', hours: 'h', minutes: 'm' },
    endsIn: 'Bu fazda kalan süre',
    referencePrice: 'AGX açılış referans fiyatı',
    discountLabel: 'İndirim',
    discountRatio: 'Faz indirim oranı',
    xAirdropRatio: 'X airdrop oranı',
    airdropLabel: 'X airdrop oranı',
    myContributions: 'Ortak inşa kayıtlarım',
    totalContributed: 'Bu faz ortak inşa',
    cumulativeContributed: 'Toplam ortak inşa',
    globalLabel: 'Küresel toplam ortak inşa',
    globalBody:
      'Küresel çekirdek ortak inşacıları bir araya getirerek AEGISX küresel ekosistem ağını birlikte inşa edin.',
    viewContract: 'Sözleşmeyi görüntüle',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Ortak inşa planına nasıl katılınır?',
          a: 'Kullanıcılar USD1 ile ortak inşaya katılarak ilgili faz indirimiyle AGX kazanabilir. Toplam {phaseCount} faz vardır; indirimler sırasıyla {discounts} şeklindedir.',
        },
        {
          q: 'Ortak inşa kotası ve katılım koşulları nelerdir?',
          a: 'Minimum katılım tutarı {minUsd} olup, {shareIncrement} USD1 katları şeklinde katılım gereklidir. Faz kotaları sırasıyla {phaseQuotas} şeklindedir.',
        },
        {
          q: 'Ortak inşa döngüsü ne kadar sürer?',
          a: 'Ortak inşa ile kazanılan AGX, 540 günlük bir kilit açma döngüsüne tabidir.',
        },
        {
          q: 'X airdrop ödülü nasıl kazanılır?',
          a: 'Tek hesapla toplam ortak inşa tutarı {threshold} ulaştığında, ilgili faz X airdrop ödülüne hak kazanılır. {phaseCount} faz için airdrop oranları sırasıyla {airdropRatios} şeklindedir.',
        },
        {
          q: 'X airdrop ödülü nasıl dağıtılır?',
          a: 'X airdrop ödülü 12 aylık doğrusal kilit açma mekanizmasına tabidir; her ay yaklaşık %8.33 açılır. İlk dağıtım, X stake protokolü yayına girdikten 30 gün sonra akıllı sözleşme tarafından otomatik olarak gerçekleştirilir.',
        },
      ],
    },
    promoTitleTemplate: 'Genesis ortak inşa Faz {season}  {discount} indirim',
    promoLive: 'Devam ediyor — kota sınırlı, bitiş {endDate}',
    promoUpcoming: 'Yakında başlıyor, kota sınırlı, {startDate} başlar',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Abonelik başarılı',
    insufficientUsd1: 'USD1 bakiyesi yetersiz, lütfen yeterli USD1 temin edin.',
    insufficientAllowance: 'USD1 onayı yetersiz, lütfen önce onaylayın.',
    purchaseUnavailable:
      'Şu anda abone olunamaz; lütfen pay miktarını veya abonelik fazı durumunu kontrol edin.',
    walletNotConnected:
      'Cüzdan bağlantısı kesildi, lütfen işlem imzalamadan önce yeniden bağlanın.',
    errors: {
      notBound: 'Lütfen önce önereni bağlayın.',
      paused: 'Abonelik duraklatıldı, lütfen daha sonra tekrar deneyin.',
      invalidAmount: 'Abonelik tutarı 100 USD katları olmalıdır.',
      phaseInactive: 'Mevcut abonelik fazı başlamadı veya sona erdi.',
      belowMin: 'Abonelik tutarı mevcut fazın minimum limitinin altında.',
      soldOut: 'Mevcut abonelik fazı tükendi.',
      userLimitExceeded: 'Mevcut faz tek cüzdan abonelik üst limiti aşıldı; lütfen tutarı azaltın.',
      invalidPhase: 'Geçersiz abonelik fazı.',
      systemConfig: 'Sistem yapılandırması anormal, lütfen daha sonra tekrar deneyin.',
    },
    contributionsSyncPending:
      'Zincir üstü abonelik onaylandı; geçmiş kayıtlar senkronize ediliyor, lütfen daha sonra yenileyin.',
    contributionsEmpty: {
      title: 'Henüz ortak inşa kaydı yok',
      body: 'Ortak inşa programı sona erdi. Katılmayan hesapların burada kaydı yoktur.',
    },
    goBindReferrer: 'Referansı bağla',
    seasonLive: 'Devam ediyor',
    seasonEnded: 'Sona erdi',
    seasonUpcoming: 'Yakında',
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
    currentTitle: 'Mevcut seviye',
    postLaunchRankTitle: 'Yayın sonrası seviye',
    teamRewardRate: 'Takım ödülü {rate}',
    postLaunch30DayRank: 'Yayına girdikten sonraki 30 gün içinde {rank} seviyesine ulaşabilirsiniz',
    postLaunchMaxRank: 'En yüksek seviyeye ulaştınız',
    postLaunchRankTooltip:
      "Yayın sonrası seviye, takım ortak inşa tutarının indirimli fiyattan AGX'e dönüştürülmesine dayalı gerçek performansa göre hesaplanır.\nMevcut seviye yalnızca performans verilerine dayanır; yayın sonrası kişisel varlıklar ve geçerli doğrudan yönlendirmeler gibi diğer faktörler etkili olabilir.\nBu bilgiler yalnızca referans içindir; nihai veri yayın sonrası gerçek verilerdir.",
    superCommunityBadge: 'Süper Sistem',
    heroTierRewardBody: 'Takım ortak inşa tutarının {bonus} kadarını ödül olarak alın.',
    superCommunityBenefitBody: 'Süper Sistemler özel gelişim fonu ve yönetişim hakları alır.',
    shareholderHintNoRank: 'Genesis seviyesi',
    shareholderNoRankTitle: 'Henüz Genesis Rezerv Valisi olmadınız',
    shareholderNoRankBody:
      'Genesis Rezerv Valisi olarak, takım ortak inşa tutarının %1-%10 kadarını ödül olarak alabilir ve AEGIS X yayına girdikten sonra 30 gün boyunca 1 seviye yükselirsiniz',
    shareholderTitleForRank: '{rank} · Genesis Rezerv Valisi',
    heroKicker: 'Genesis seviyesi',
    currentTierSuffix: 'Mevcut',
    progressPersonalTo: '{rank} · kişisel aboneliğe mesafe',
    progressMaxPersonal: 'En yüksek kişisel seviyeye ulaşıldı',
    progressMaxTeam: 'En yüksek takım seviyesine ulaşıldı',
    teamLegRequirement: 'iki {rank} kolu',
    tierDualLegRequirement: '2 {rank} kolu',
    teamQualifiedPartitionsLabel: '{rank} kolu {count}/2',
    teamVolume: 'Sistem performansı',
    referralRewards: 'Doğrudan öneri ödülleri',
    autoPaidLabel: 'Otomatik ödeme',
    autoPaid: 'Ödüller cüzdana otomatik olarak ödenir',
    teamRewards: 'Seviye ödülleri',
    claimed: 'Talep edildi {amount}',
    heroTitle: 'Mevcut seviye',
    allTiers: 'Genesis onur sistemi',
    history: 'Ödül kayıtları',
    referralHistoryEmpty: {
      title: 'Henüz doğrudan öneri ödül kaydı yok',
      body: 'Önerilen kişi Genesis döneminde aboneliğini tamamladıktan sonra, doğrudan öneri ödülleri burada görüntülenecektir.',
    },
    teamHistoryEmpty: {
      title: 'Henüz seviye ödül kaydı yok',
      body: 'Seviye ödülü uzlaşma ve talep kayıtları, ödül oluştuktan sonra burada görüntülenecektir.',
    },
    communityFund: 'Gelişim fonu',
    communityFundTooltip:
      "Süper sistemler, sistem gelişim fonunun %5'ini alır; sistem inşası, günlük operasyonlar, sistem toplantıları ve sistem eğitmenleri dahil olmak üzere sistem öz-işletimine ayrılır.",
    communityFundLocked: 'Kilitli: {amount}',
    communityFundUnlockedSuffix: 'kilidi açıldı',
    communityFundClaimed: 'Talep ettiniz {amount}',
    communityFundHistory: 'Gelişim fonu',
    communityFundCumulativeClaimed: 'Toplam talep {amount}',
    communityFundHistoryEmpty: {
      title: 'Henüz gelişim fonu kaydı yok',
      body: 'Gelişim fonu talep kayıtları ödül oluştuktan sonra burada görünecektir.',
    },
    rewardType: {
      referralPaid: 'Öneri ödülü',
      referralWithdrawn: 'Öneri ödülü talebi',
      marketTeam: 'Piyasa yapıcı takım ödülü',
      presaleTeam: 'Ön satış takım ödülü',
      unknown: '—',
    },
    logStatus: {
      pending: 'Beklemede',
      processing: 'İşleniyor',
      paid: 'Ödendi',
      claimed: 'Talep edildi',
      failed: 'Başarısız',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'Zaten bir önereniz bağlı, tekrar bağlayamazsınız.',
      parentNotBound: 'Önereniz henüz bağlanmadı, lütfen önerenizle iletişime geçin.',
      selfReferral: 'Kendi adresinizi giremezsiniz.',
      invalidParent: 'Lütfen geçerli bir öneren adresi girin.',
      migratedAccount: 'Bu adres taşındı, lütfen yeni adresi kullanın.',
      systemConfig: 'Sistem yapılandırması anormal, lütfen daha sonra tekrar deneyin.',
      failed: 'Bağlama başarısız, lütfen daha sonra tekrar deneyin.',
    },
    title: 'Topluluk',
    intro:
      'Ortak inşaya katılmak için arkadaşlarınızı davet edin, ekosistem büyüme değerini ve Genesis ödüllerini paylaşın.',
    disconnectedIntro:
      'Cüzdan bağladıktan sonra öneri bağlantısı oluşturun ve davet edeninizi bağlayın.',
    referralLink: 'Davet bağlantım',
    shareReferral: 'Bağlantıyı kopyala',
    referrer: 'Davet edenim',
    bindReferrer: 'Bağla',
    referrerPlaceholder: 'Öneren adresini girin (0x…)',
    referrerHint: 'Davet ilişkisi etkinleştirildikten sonra kalıcıdır ve değiştirilemez.',
    docs: 'Dokümanlar',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Ortak inşaya katıl',
    myCommunity: 'Topluluğum',
    directReferrals: 'Doğrudan davet sayısı',
    myTeam: 'Topluluk boyutu',
    genesisTitle: 'Mevcut',
    inviteTitle: 'Davet etmeye başlayın · Ekosistem büyüme değerini paylaşın',
    programs: {
      title: 'Ekosistem destek programları',
      items: [
        {
          label: 'Genesis Ortak İnşa · Faz {season}',
          title: 'Genesis Rezerv Valisi Programı',
          body: 'İlk küresel ortak inşa koltukları açıldı',
          action: 'Plan detaylarını görüntüle →',
          href: 'https://xdaoaegis.notion.site/genesis-rezerv-konseyi-program',
        },
        {
          label: 'X Akademi',
          title: 'Küresel DeFi Akademisi · Dijital Ekonomi Çağında Küresel Liderlik Akademisi',
          body: 'Çağ için lider yetiştirmek · Gelecek için yetenek rezervi',
          action: 'Plan detaylarını görüntüle →',
          href: 'https://xdaoaegis.notion.site/x-akademisi-tur',
        },
      ],
    },
    myInvites: 'Topluluk üyelerim ({count})',
    referralBondPermanent: 'Davet ilişkisi etkinleştirildi · kalıcı olarak bağlandı.',
    volumePrefix: 'Performans',
    genesisShareholder: 'Genesis Rezerv Valisi',
    statToday: 'Bugün +{count} · +{amount}',
    statGenesisToday: 'Yayına girdikten sonra otomatik olarak 1 seviye yükselir',
    postLaunchRankLabel: 'Yayın sonrası seviye',
    totalTeamVolume: 'Toplam hacim {amount}',
    postLaunch30DayBoost: 'Yayına girdikten sonraki 30 gün içinde {rank} seviyesine yükselin',
    postLaunchMaxRank: 'En yüksek seviyeye ulaştınız',
    bindReferrerSuccess: 'Öneren bağlama başarılı',
    inviteFlow: {
      items: [
        {
          title: 'Davet bağlantısını paylaşın',
          body: 'Cüzdanınızı bağlayın ve davet edeninizi doldurduktan sonra size özel davet bağlantısı oluşturulur.',
        },
        {
          title: 'Arkadaşlar ortak inşaya katılır',
          body: 'Arkadaşlarınız davet bağlantınız üzerinden kaydolduktan sonra ortak inşaya katılabilirler.',
        },
        {
          title: 'Ortak inşa ödülleri kazanın',
          body: 'Arkadaşlar ortak inşaya katıldıktan sonra ödüller akıllı sözleşme tarafından cüzdan adresinize otomatik olarak uzlaştırılır.',
        },
      ],
    },
    invitesEmpty: {
      title: 'Henüz davet kaydı yok',
      body: 'Öneri bağlantınızı paylaşarak arkadaşlarınızı topluluğunuza davet edin.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Davet ilişkisi nasıl kurulur?',
          a: 'Arkadaşlar davet bağlantısı üzerinden ortak inşaya katıldığında davet ilişkisi otomatik olarak kurulur ve kalıcıdır.',
        },
        {
          q: 'Genesis öneri ödülü nasıl hesaplanır?',
          a: 'Genesis öneri ödülü %3’tür; sıkıştırılmış eşdeğer tutar uzlaşma mekanizması kullanılır ve yalnızca eşdeğer tutar üzerinden hesaplanır.',
        },
        {
          q: 'Genesis seviyemi nasıl yükseltebilirim?',
          a: 'Kişisel ortak inşa tutarı ve sistem performansı durumuna göre S1’den S10’a kadar kademeli olarak yükselirsiniz.',
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
    time: 'Zaman',
    claimTime: 'Talep zamanı',
    paid: 'Tutar',
    status: 'Durum',
    discount: 'İndirim',
    estimatedAgx: 'Tahmini AGX',
    tx: 'İşlem',
    title: 'Genesis unvanı',
    totalVolume: 'Toplam performans',
    rewardRate: 'Ödül oranı',
    amount: 'Tutar',
    from: 'Kaynak adres',
    genesisRank: 'Genesis seviyesi',
    joined: 'Katılım zamanı',
    address: 'Adres',
    communityVolume: 'Topluluk performansı',
    contribution: 'Abonelik',
  },
})

export type AppMessagesBundle = typeof app

export default app
