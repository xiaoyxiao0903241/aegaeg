import { defineMessages } from '~/i18n/messages/define-messages'
import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Hubungkan Dompet',
    language: 'Bahasa',
    copy: 'Salin',
    claimable: 'Dapat diklaim',
    max: 'MAKS',
    shareUnit: 'saham',
    confirm: 'Konfirmasi',
    close: 'Tutup',
    paginationTotal: 'Total {total} entri',
    paginationPerPage: '{size} per halaman',
    paginationPrev: 'Halaman sebelumnya',
    paginationNext: 'Halaman berikutnya',
  },
  errors: {
    api: {
      network: 'Koneksi jaringan gagal. Periksa koneksi dan coba lagi.',
      timeout: 'Permintaan habis waktu. Silakan coba lagi nanti.',
      unavailable: 'Layanan sementara tidak tersedia. Silakan coba lagi nanti.',
      badResponse: 'Respons server tidak terduga. Silakan coba lagi nanti.',
      fallback: 'Terjadi kesalahan. Silakan coba lagi nanti.',
    },
    chain: {
      fallback: 'Aksi on-chain gagal. Silakan coba lagi nanti.',
    },
    walletNotConnected: 'Hubungkan dompet dan masuk terlebih dahulu.',
    quoteFailed: 'Kutipan gagal. Silakan coba lagi nanti.',
    loadFailed: 'Gagal memuat. Silakan coba lagi nanti.',
    loginFailed: 'Gagal masuk. Silakan coba lagi nanti.',
    loginSignatureRejected:
      'Tanda tangan login tidak valid atau kedaluwarsa. Silakan tanda tangani lagi.',
    pageLoadFailed: 'Halaman gagal dimuat',
    pageLoadFailedBody:
      'Terjadi kesalahan saat merender. Muat ulang untuk melanjutkan — dompet tetap terhubung.',
    reloadPage: 'Muat ulang halaman',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'Bangun Bersama',
    rewards: 'Hadiah',
    release: 'Release',
    community: 'Komunitas',
    rewardsTooltip: 'Lihat hadiah referral dan tim.',
    communityTooltip:
      'Undang mitra untuk ikut pembangunan bersama, bagikan nilai pertumbuhan ekosistem dan hadiah Genesis.',
    bscTooltip:
      'Hanya BSC · AEGIS X berjalan di BNB Smart Chain. Pengalihan jaringan belum didukung.',
  },
  topbar: {
    currentNetwork: 'Jaringan saat ini',
    openMenu: 'Buka navigasi',
    closeMenu: 'Tutup navigasi',
    hideDetails: 'Sembunyikan panel detail',
    showDetails: 'Tampilkan panel detail',
    toggleTooltip: 'Tampilkan atau sembunyikan panel detail',
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
      promoTitle: 'Hubungkan untuk menjelajahi fitur AEGIS X',
      promoBrandLine: 'Jaga jaringan nilai masa depan',
      recordsTitle: 'Hubungkan dompet untuk melihat catatan Anda',
      recordsBodyGenesis:
        'Setelah terhubung, riwayat pembangunan bersama Anda akan ditampilkan di sini.',
      recordsBodyRewards: 'Setelah terhubung, riwayat hadiah Anda akan ditampilkan di sini.',
      recordsBodyCommunity: 'Setelah terhubung, riwayat undangan Anda akan ditampilkan di sini.',
    },
  },
  wallet: {
    connectTitle: 'Hubungkan dompet',
    connectIntroTitle: 'Hubungkan dompet untuk menjelajahi fitur AEGIS X',
    connectIntroLink: 'Fitur AEGIS X ↗',
    connecting: 'Menghubungkan…',
    copyAddress: 'Salin alamat',
    copied: 'Disalin',
    copyFailed: 'Gagal menyalin. Tekan lama untuk menyalin manual.',
    disconnect: 'Putuskan',
    reconnectWallet: 'Hubungkan ulang dompet',
    reconnectHint: 'Dompet terputus. Hubungkan ulang sebelum melakukan tindakan on-chain.',
    signInRequired: 'Masuk',
    accountBanned: 'Akun Anda telah ditangguhkan. Hubungi dukungan.',
    transactionErrors: {
      gasLimitTooLow:
        'Batas gas terlalu rendah. Pastikan dompet memiliki cukup BNB untuk biaya jaringan lalu coba lagi.',
      gasEstimateFailed:
        'Tidak dapat memperkirakan gas untuk transaksi ini. Periksa jaringan dan coba lagi.',
      insufficientFunds: 'BNB tidak cukup untuk membayar biaya gas jaringan.',
      transactionFailed: 'Transaksi gagal. Silakan coba lagi nanti.',
      transactionUnknown:
        'Status transaksi tidak diketahui. Jangan kirim ulang — periksa dulu dompet atau block explorer.',
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
    title: 'Program Pembangunan Bersama',
    intro: 'Ikuti program pembangunan bersama X DAO · Fase {season}  (diskon {discount})',
    shares: 'Saham (1 saham = 100 USD1 · maks {max} saham)',
    quota: 'Kuota pembangunan bersama fase ini',
    pay: 'Bayar',
    receive: 'Akan menerima AGX',
    value: 'Nilai langganan',
    xTokenAirdrop: 'Estimasi nilai airdrop X awal',
    xTokenAirdropHint:
      'Hadiah airdrop memerlukan partisipasi pembangunan bersama kumulatif per fase ≥ {threshold}.',
    join: 'Ikut Pembangunan Bersama',
    joinGenesis: 'Ikut pembangunan bersama Genesis',
    statsTitle: 'Data pembangunan bersama Fase {season}',
    startsIn: 'Mulai dalam',
    countdownUnits: { days: 'h', hours: 'j', minutes: 'mnt' },
    endsIn: 'Sisa waktu fase ini',
    referencePrice: 'Harga referensi pembukaan AGX',
    discountLabel: 'Diskon',
    discountRatio: 'Rasio diskon fase ini',
    xAirdropRatio: 'Rasio airdrop X',
    airdropLabel: 'Rasio airdrop X',
    myContributions: 'Riwayat pembangunan bersama saya',
    totalContributed: 'Pembangunan bersama fase ini',
    cumulativeContributed: 'Total pembangunan bersama',
    globalLabel: 'TOTAL CO-BUILD GLOBAL',
    globalBody:
      'Mengumpulkan pembangun inti global untuk membangun jaringan ekosistem AEGIS X bersama.',
    viewContract: 'Lihat kontrak',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Bagaimana cara ikut program pembangunan bersama?',
          a: 'Pengguna berpartisipasi dengan USD1 dan mendapatkan AGX sesuai diskon fase yang berlaku. {phaseCount} fase, dengan diskon {discounts}.',
        },
        {
          q: 'Kuota pembangunan bersama dan persyaratan partisipasi?',
          a: 'Minimum {minUsd}, harus dalam kelipatan {shareIncrement} USD1. Kuota per fase: {phaseQuotas}.',
        },
        {
          q: 'Berapa lama siklus pembangunan bersama?',
          a: 'AGX dari pembangunan bersama dirilis selama 540 hari.',
        },
        {
          q: 'Bagaimana mendapatkan hadiah airdrop X?',
          a: 'Akun dengan total partisipasi pembangunan bersama kumulatif {threshold} memenuhi syarat hadiah airdrop X fase terkait. Rasio airdrop {phaseCount} fase: {airdropRatios}.',
        },
        {
          q: 'Bagaimana hadiah airdrop X dirilis?',
          a: 'Hadiah airdrop X dirilis linear selama 12 bulan, ~8,33% per bulan; rilis pertama 30 hari setelah protokol staking X diluncurkan, dieksekusi otomatis oleh smart contract.',
        },
      ],
    },
    promoTitleTemplate: 'Pembangunan Bersama Genesis Fase {season}  diskon {discount}',
    promoLive: 'Sedang berlangsung — kuota terbatas, berakhir {endDate}',
    promoUpcoming: 'Segera dimulai — kuota terbatas, mulai {startDate}',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Langganan berhasil',
    insufficientUsd1: 'Saldo USD1 tidak cukup. Dapatkan USD1 yang cukup sebelum berpartisipasi.',
    insufficientAllowance: 'Persetujuan USD1 tidak cukup. Klik setujui terlebih dahulu.',
    purchaseUnavailable:
      'Tidak dapat berpartisipasi saat ini. Periksa jumlah saham atau status fase langganan.',
    walletNotConnected: 'Dompet terputus. Hubungkan ulang untuk menandatangani transaksi.',
    errors: {
      notBound: 'Tautkan referrer sebelum ikut serta.',
      paused: 'Subscribe sedang dijeda. Silakan coba lagi nanti.',
      invalidAmount: 'Jumlah harus kelipatan 100 USD.',
      phaseInactive: 'Fase ini belum dimulai atau sudah berakhir.',
      belowMin: 'Jumlah di bawah minimum fase ini.',
      soldOut: 'Fase ini sudah habis terjual.',
      userLimitExceeded: 'Melebihi batas per wallet fase ini. Kurangi jumlahnya.',
      invalidPhase: 'Fase tidak valid.',
      systemConfig: 'Kesalahan konfigurasi sistem. Silakan coba lagi nanti.',
    },
    contributionsSyncPending:
      'Langganan on-chain dikonfirmasi. Riwayat sedang disinkronkan, segarkan sebentar lagi.',
    contributionsEmpty: {
      title: 'Belum ada riwayat pembangunan bersama',
      body: 'Program pembangunan bersama telah berakhir. Akun yang tidak berpartisipasi tidak memiliki catatan di sini.',
    },
    goBindReferrer: 'Ikat perujuk',
    seasonLive: 'Berlangsung',
    seasonEnded: 'Berakhir',
    seasonUpcoming: 'Segera dimulai',
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
        contributionHint: 'Mixed claims consume contribution points 1:1.',
        goClaim: 'Go claim',
        goBurn: 'Go burn →',
      },
      mechanismTitle: 'Co-build reward mechanism',
      mechanismBody: 'Co-build rewards come from team Rebase yield and are shared by tier.',
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
    currentTitle: 'Level saat ini',
    postLaunchRankTitle: 'Tingkat setelah peluncuran',
    teamRewardRate: 'Hadiah tim {rate}',
    postLaunch30DayRank: 'Dalam 30 hari setelah peluncuran Anda dapat mencapai {rank}',
    postLaunchMaxRank: 'Anda telah mencapai tingkat maksimum',
    postLaunchRankTooltip:
      'Setelah peluncuran, tingkat dihitung dari kinerja nyata volume pembangunan bersama tim yang dikonversi ke AGX dengan harga diskon.\nTingkat saat ini hanya berdasarkan data kinerja; setelah peluncuran faktor lain dapat berlaku, seperti kepemilikan pribadi dan referral langsung yang memenuhi syarat.\nInformasi ini hanya untuk referensi; data nyata setelah peluncuran yang berlaku.',
    superCommunityBadge: 'Super Sistem',
    heroTierRewardBody: 'Dapatkan {bonus} dari volume pembangunan bersama tim sebagai hadiah.',
    superCommunityBenefitBody:
      'Super Sistem menerima dana pengembangan khusus dan hak tata kelola.',
    shareholderHintNoRank: 'Level Genesis',
    shareholderNoRankTitle: 'Belum menjadi Gubernur Cadangan Genesis',
    shareholderNoRankBody:
      'Menjadi Gubernur Cadangan Genesis memberi hadiah 1%-10% dari volume pembangunan bersama tim dan naik 1 level dalam 30 hari setelah peluncuran AEGIS X.',
    shareholderTitleForRank: '{rank} · Gubernur Cadangan Genesis',
    heroKicker: 'LEVEL GENESIS',
    currentTierSuffix: 'saat ini',
    progressPersonalTo: 'Menuju {rank} · Langganan pribadi',
    progressMaxPersonal: 'Level pribadi tertinggi tercapai',
    progressMaxTeam: 'Level tim tertinggi tercapai',
    teamLegRequirement: 'Dua jalur {rank}',
    tierDualLegRequirement: '2 jalur {rank}',
    teamQualifiedPartitionsLabel: 'Jalur {rank} {count}/2',
    teamVolume: 'Volume jaringan',
    referralRewards: 'Hadiah referral',
    autoPaidLabel: 'Dibayar otomatis',
    autoPaid: 'Hadiah diselesaikan otomatis ke dompet',
    teamRewards: 'Hadiah level',
    claimed: 'Diklaim {amount}',
    heroTitle: 'Level saat ini',
    allTiers: 'Sistem kehormatan Genesis',
    history: 'Riwayat hadiah',
    referralHistoryEmpty: {
      title: 'Belum ada riwayat hadiah referral',
      body: 'Hadiah referral akan muncul di sini setelah orang yang Anda referensikan menyelesaikan langganan selama Genesis.',
    },
    teamHistoryEmpty: {
      title: 'Belum ada riwayat hadiah tim',
      body: 'Riwayat penyelesaian dan klaim hadiah tim akan muncul di sini setelah hadiah dihasilkan.',
    },
    communityFund: 'Dana pengembangan',
    communityFundTooltip:
      'Super sistem menerima 5% dana pengembangan sistem, khusus untuk operasi mandiri sistem, termasuk namun tidak terbatas pada: pembangunan sistem, operasi harian, rapat sistem, dan pengajar sistem.',
    communityFundLocked: 'Terkunci: {amount}',
    communityFundUnlockedSuffix: 'terbuka',
    communityFundClaimed: 'Anda telah mengklaim {amount}',
    communityFundHistory: 'Dana pengembangan',
    communityFundCumulativeClaimed: 'Total diklaim {amount}',
    communityFundHistoryEmpty: {
      title: 'Belum ada riwayat dana pengembangan',
      body: 'Riwayat klaim dana pengembangan akan muncul di sini setelah hadiah dihasilkan.',
    },
    rewardType: {
      referralPaid: 'Hadiah referral',
      referralWithdrawn: 'Klaim hadiah referral',
      marketTeam: 'Hadiah tim market maker',
      presaleTeam: 'Hadiah tim presale',
      unknown: '—',
    },
    logStatus: {
      pending: 'Menunggu',
      processing: 'Diproses',
      paid: 'Dibayar',
      claimed: 'Diklaim',
      failed: 'Gagal',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'Anda sudah menautkan pemberi referensi.',
      parentNotBound: 'Pemberi referensi belum menautkan. Silakan hubungi mereka.',
      selfReferral: 'Tidak bisa memakai alamat sendiri.',
      invalidParent: 'Masukkan alamat referrer yang valid.',
      migratedAccount: 'Alamat ini telah bermigrasi. Gunakan alamat baru.',
      systemConfig: 'Kesalahan konfigurasi sistem. Silakan coba lagi nanti.',
      failed: 'Gagal menautkan. Silakan coba lagi nanti.',
    },
    title: 'Komunitas',
    intro:
      'Undang mitra untuk ikut pembangunan bersama, bagikan nilai pertumbuhan ekosistem dan hadiah Genesis.',
    disconnectedIntro: 'Hubungkan dompet untuk membuat tautan referral dan mengikat pengundang.',
    referralLink: 'Tautan undangan saya',
    shareReferral: 'Salin tautan',
    referrer: 'Pengundang saya',
    bindReferrer: 'Tautkan',
    referrerPlaceholder: 'Masukkan alamat pemberi referensi (0x…)',
    referrerHint: 'Hubungan undangan aktif permanen setelah diaktifkan dan tidak dapat diubah.',
    docs: 'Dokumen',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Ikut pembangunan bersama',
    myCommunity: 'Komunitas saya',
    directReferrals: 'Referral langsung',
    myTeam: 'Anggota komunitas',
    genesisTitle: 'Saat ini',
    inviteTitle: 'Mulai mengundang · bagikan nilai pertumbuhan ekosistem',
    programs: {
      title: 'Program dukungan ekosistem',
      items: [
        {
          label: 'Pembangunan Bersama Genesis · Fase {season}',
          title: 'Program Gubernur Cadangan Genesis',
          body: 'Kursi pembangunan bersama global pertama dibuka',
          action: 'Lihat detail program →',
          href: 'https://xdaoaegis.notion.site/program-dewan-cadangan-genesis',
        },
        {
          label: 'Akademi X',
          title: 'Akademi DeFi Global · Akademi Kepemimpinan Global Era Ekonomi Digital',
          body: 'Mencetak pemimpin untuk zaman · Menyimpan talenta untuk masa depan',
          action: 'Lihat detail program →',
          href: 'https://xdaoaegis.notion.site/akademi-x-id',
        },
      ],
    },
    myInvites: 'Anggota komunitas saya ({count})',
    referralBondPermanent: 'Hubungan referral aktif · ikatan bersifat permanen.',
    volumePrefix: 'Volume',
    genesisShareholder: 'Gubernur Cadangan Genesis',
    statToday: 'Hari ini +{count} · +{amount}',
    statGenesisToday: 'Naik 1 level otomatis setelah peluncuran',
    postLaunchRankLabel: 'Tingkat setelah peluncuran',
    totalTeamVolume: 'Total kinerja {amount}',
    postLaunch30DayBoost: 'Naik ke {rank} dalam 30 hari setelah peluncuran',
    postLaunchMaxRank: 'Anda telah mencapai tingkat maksimum',
    bindReferrerSuccess: 'Pemberi referensi berhasil ditautkan',
    inviteFlow: {
      items: [
        {
          title: 'Bagikan tautan undangan',
          body: 'Hubungkan dompet dan isi pengundang Anda untuk membuat tautan undangan eksklusif.',
        },
        {
          title: 'Mitra ikut pembangunan bersama',
          body: 'Setelah mitra mendaftar melalui tautan undangan Anda, mereka dapat ikut pembangunan bersama.',
        },
        {
          title: 'Dapatkan hadiah pembangunan bersama',
          body: 'Setelah mitra ikut pembangunan bersama, hadiah diselesaikan otomatis oleh smart contract ke alamat dompet Anda.',
        },
      ],
    },
    invitesEmpty: {
      title: 'Belum ada riwayat undangan',
      body: 'Bagikan tautan referral untuk mengundang teman ke komunitas Anda.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Bagaimana hubungan referral dibentuk?',
          a: 'Setelah mitra berpartisipasi dalam pembangunan bersama melalui tautan undangan Anda, hubungan referral otomatis terbentuk dan berlaku permanen.',
        },
        {
          q: 'Bagaimana hadiah referral Genesis dihitung?',
          a: 'Hadiah referral Genesis sebesar 3%, menggunakan mekanisme penyelesaian jumlah setara terkompresi — hanya bagian jumlah setara yang dihitung.',
        },
        {
          q: 'Bagaimana meningkatkan tingkat Genesis saya?',
          a: 'Naik secara bertahap dari S1 ke S10 berdasarkan jumlah pembangunan bersama pribadi dan pencapaian kinerja organisasi.',
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
      card: {
        position: 'Position',
        yield: 'Total yield',
      },
      modes: {
        stake: { title: 'Stake', body: 'Manage AGX flexible / term positions' },
        lpbond: { title: 'LP Bond', body: 'Manage liquidity bond positions' },
        burnbond: { title: 'Burn Bond', body: 'Manage burn bond positions' },
        xmine: { title: 'X Mine', body: 'Manage gAGX mining positions' },
      },
      overview: {
        title: 'Assets overview',
        totalValue: 'Total value',
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
        bufferAssetGagx: 'gAGX',
      },
      distribution: {
        title: 'Holdings',
        empty: 'No holdings yet. Stake or buy bonds to see distribution here.',
        cta: 'Go to Staking',
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
            q: 'How is total value calculated?',
            a: 'Sum of product positions and claimable yield valuations; shows — without a quote.',
          },
          {
            q: 'How is yield paid?',
            a: 'Stake/bond yield is in gAGX; X mine yield is in X.',
          },
          {
            q: 'Why do claims need contribution points?',
            a: 'Mixed claims consume contribution per the handbook; burn AGX if short.',
          },
          {
            q: 'Where do contribution points come from?',
            a: 'Burn exchange grants contribution; claims consume them 1:1.',
          },
          {
            q: 'Where does redeemed principal go?',
            a: 'Into PrincipalReleaseVault linear release — not instant wallet credit.',
          },
          {
            q: 'When does holdings distribution appear?',
            a: 'After non-zero positions exist; empty state otherwise.',
          },
          {
            q: 'What is the buffer pool?',
            a: 'Principal exits into the release buffer for secondary linear release; on-chain AGX only.',
          },
          {
            q: 'Why does the buffer show gAGX?',
            a: 'Chrome keeps the asset switch; gAGX exits are converted to AGX — values stay honest —.',
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
            bullets: ['gAGX mining rewards', 'Ecosystem growth incentives'],
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
      intro: 'Build the base pool with USD1 and mint AGX at a discount',
      periodLabel: 'Select bond period',
      periodAria: 'LP bond period',
      amountAria: 'Purchase amount',
      amountBalance: 'Amount (wallet balance {balance} USD1)',
      submit: 'Buy',
      success: 'Purchased successfully',
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price',
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
        { label: 'Total sold' },
        { label: 'Current discount' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
      ],
      mechanismTitle: 'How LP Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        { title: 'Pay USD1', body: 'Route USD1 through BondHelper into the LP bond vault.' },
        {
          title: 'Discount mint AGX',
          body: 'Mint AGX at the current discount and deepen pool liquidity.',
        },
        {
          title: 'Release & claim',
          body: 'Principal unlocks linearly; claim gAGX yield on Assets.',
        },
      ],
      faq: [
        { q: 'Why is there no flexible bond?', a: 'Bonds only offer 180 / 360 / 540 day terms.' },
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
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price',
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
        { label: 'Total burned' },
        { label: 'Current discount' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
      ],
      mechanismTitle: 'How Burn Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BurnBondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        { title: 'Pay USD1', body: 'Route USD1 through BondHelper into the burn bond vault.' },
        {
          title: 'Discount mint AGX',
          body: 'Mint AGX at the current discount into the term position.',
        },
        {
          title: 'Burn permanently',
          body: 'Corresponding supply is burned permanently for deflation.',
        },
      ],
      faq: [
        {
          q: 'How does Burn Bond differ from LP Bond?',
          a: 'Different depositories; both open with BondHelper + USD1; claims are on Assets.',
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
        { label: 'Today yield' },
      ],
      positionMetrics: [{ label: 'My stake' }, { label: 'Released' }, { label: 'Mined' }],
      mechanismTitle: 'How X Mine works',
      mechanism: 'Validate miningQuotaOf then stakeGagxForMining. Claim X and unstake on Assets.',
      mechanismSteps: [
        {
          title: 'Rebase + DAO rewards',
          body: 'Protocol rebase and DAO rewards enter the distributable pool.',
        },
        { title: 'Stake gAGX', body: 'Stake gAGX within quota; enter 24h warmup.' },
        { title: 'Dynamic X allocation', body: 'X rewards allocate by protocol state.' },
        { title: 'Unstake linear release', body: 'Exit principal enters the release vault.' },
      ],
      faq: [
        {
          q: 'Where does quota come from?',
          a: 'Sum of locked principal from Early, term stake, and bonds via miningQuotaOf.',
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
        total: 'Principal + yield',
        rate: 'Yield rate',
      },
      aside: {
        result: 'Estimate',
        resultHint: 'Enter parameters on the left and tap Calculate.',
        tags: { day: 'Day {day}' },
        curve: 'Yield curve',
        curveHint: 'Cumulative yield by day; compounding continues if not redeemed at maturity',
        nodes: 'Key nodes',
        nodeCards: [
          { label: 'Breakeven day', hint: 'Selling from this day can realize positive yield' },
          { label: 'Principal fully released', hint: '' },
          { label: 'Hold to term end', hint: 'Cumulative yield vs principal' },
        ],
        notes: 'Notes',
        notesBody: 'Local estimate only — not an on-chain quote or yield promise.',
        notesItems: [
          'Yield compounds at the current base daily rate; term bonuses: 180d 15%, 360d 25%, 540d 35%.',
          'Only principal unlocked by the selected day counts; locked principal and its yield are excluded.',
          'Ignores claim tax and price volatility; actual results vary with protocol state.',
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
    time: 'Waktu',
    claimTime: 'Waktu Klaim',
    paid: 'Jumlah',
    status: 'Status',
    discount: 'Diskon',
    estimatedAgx: 'Perk. AGX',
    tx: 'Tx',
    title: 'Gelar Genesis',
    totalVolume: 'Total Volume',
    rewardRate: 'Rasio hadiah',
    amount: 'Jumlah',
    from: 'Alamat sumber',
    genesisRank: 'Peringkat Genesis',
    joined: 'Bergabung',
    address: 'Alamat',
    communityVolume: 'Volume komunitas',
    contribution: 'Langganan',
  },
}) satisfies AppMessagesBundle

export default app
