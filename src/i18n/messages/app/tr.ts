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
    title: 'Ortak İnşa Ödülleri',
    intro: 'Ortak inşaya katılın · Büyüme değerini paylaşın',
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
    claim: 'Cüzdana talep et',
    claimSuccess: 'Talep başarılı',
    claimErrors: {
      zeroAmount: 'Talep tutarı 0.',
      invalidSigner: 'İmza geçersiz, lütfen yeniden alın ve talep edin.',
      alreadyUsed: 'Bu ödül zaten talep edildi, lütfen tekrar etmeyin.',
      expired: 'İmza süresi doldu, lütfen yenileyin ve tekrar talep edin.',
      noOrder: 'Şu anda talep edilecek ödül yok.',
      failed: 'Talep başarısız, lütfen daha sonra tekrar deneyin.',
      confirmSyncFailed:
        'Ödül zincirde alındı ancak senkron başarısız. Sayfayı yenileyin — tekrar talep etmeyin.',
    },
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
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Öneri ödülleri nasıl hesaplanır?',
          a: 'Öneri ödülü %3’tür; sıkıştırılmış eşdeğer tutar uzlaşma mekanizması kullanılır, yalnızca eşdeğer tutar üzerinden hesaplanır, boş hesaplar ödül katmanına dahil edilmez ve ödüller otomatik olarak uzlaştırılır.',
        },
        {
          q: 'Genesis seviyesi nasıl yükseltilir?',
          a: 'Genesis seviyeleri S1’den S10’a kadar kişisel ortak inşa tutarı ve sistem toplam performansına göre belirlenir; yüksek seviyeler çift bölge yükselme koşulunu gerektirir.',
        },
        {
          q: 'Seviye yükseltme ödülü nedir?',
          a: 'Ortak inşa döneminde ulaşılan Genesis seviyesi, protokol yayına girdikten sonra otomatik olarak 1 seviye yükseltilir ve 30 gün geçerlidir; ardından gerçek seviyeye döner.',
        },
        {
          q: 'Genesis takım ödülü nasıl uzlaştırılır?',
          a: 'Genesis takım ödülleri ilgili Genesis seviye oranına göre otomatik uzlaştırılır; kullanıcılar manuel olarak cüzdanlarına talep etmelidir. Ortak inşa dönemi sona erdikten sonra mevcut sayfa kapanır; talep edilmemiş ödüller artık talep edilemez ve akıllı piyasa yapıcı sözleşmesine gönderilir.',
        },
      ],
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
    body: 'Assets overview is coming soon.',
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
        rows: [{ period: 'Flexible' }, { period: '180d' }, { period: '360d' }, { period: '540d' }],
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
        result: 'Result',
        resultHint: 'Enter parameters on the left and tap Calculate.',
        curve: 'Yield curve',
        notes: 'Notes',
        notesBody: 'Estimates only — not an on-chain quote or yield promise.',
      },
    },
  },
  release: {
    title: 'Release',
    body: 'Release schedule is coming soon.',
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
