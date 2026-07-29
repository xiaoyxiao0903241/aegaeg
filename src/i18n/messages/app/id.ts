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
