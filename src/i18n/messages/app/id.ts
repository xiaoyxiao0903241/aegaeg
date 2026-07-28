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
    },
    seasonLive: 'Berlangsung',
    seasonEnded: 'Berakhir',
    seasonUpcoming: 'Segera dimulai',
  },
  rewards: {
    title: 'Hadiah Pembangunan Bersama',
    intro: 'Ikut pembangunan bersama · bagikan nilai pertumbuhan',
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
    claim: 'Klaim ke dompet',
    claimSuccess: 'Berhasil klaim',
    claimErrors: {
      zeroAmount: 'Jumlah klaim nol.',
      invalidSigner: 'Tanda tangan tidak valid, silakan minta ulang.',
      alreadyUsed: 'Hadiah ini sudah diklaim.',
      expired: 'Tanda tangan kedaluwarsa, segarkan dan coba lagi.',
      noOrder: 'Tidak ada hadiah untuk diklaim.',
      failed: 'Klaim gagal. Silakan coba lagi nanti.',
      confirmSyncFailed:
        'Hadiah sudah diklaim on-chain, tetapi sinkron gagal. Muat ulang halaman — jangan klaim lagi.',
    },
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
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Bagaimana hadiah referral dihitung?',
          a: 'Hadiah referral 3%, menggunakan mekanisme penyelesaian jumlah setara terkompresi, hanya dihitung untuk bagian jumlah setara, akun kosong tidak dihitung dalam level hadiah, hadiah diselesaikan otomatis.',
        },
        {
          q: 'Bagaimana level Genesis dinaikkan?',
          a: 'Level Genesis S1 hingga S10, dinilai berdasarkan jumlah pembangunan bersama pribadi dan total volume jaringan. Level tinggi memerlukan syarat promosi dua zona.',
        },
        {
          q: 'Apa itu hadiah kenaikan level?',
          a: 'Level Genesis yang dicapai selama pembangunan bersama otomatis naik 1 level setelah protokol diluncurkan, berlaku 30 hari, lalu kembali ke level sebenarnya.',
        },
        {
          q: 'Bagaimana hadiah tim Genesis diselesaikan?',
          a: 'Hadiah tim Genesis diselesaikan otomatis sesuai rasio level Genesis; pengguna harus klaim manual ke dompet. Setelah periode pembangunan bersama berakhir, halaman ini ditutup; hadiah yang belum diklaim tidak dapat diklaim lagi dan dialihkan ke kontrak market maker.',
        },
      ],
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
