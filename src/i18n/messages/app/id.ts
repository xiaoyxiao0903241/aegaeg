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
    backToHub: 'Kembali ke Swap',
    title: 'Swap',
    intro: 'Dapatkan token ekosistem AEGIS X dengan kurs terbaik.',
    sell: 'Jual',
    buy: 'Beli',
    flip: 'Balik arah swap',
    balance: 'Saldo',
    exchangePrice: 'Harga tukar',
    ratePlaceholder: '1 : 1',
    slippage: 'Toleransi slippage',
    allowedSlippage: 'Slippage diizinkan',
    slippageSettings: 'Pengaturan toleransi slippage',
    route: 'Rute',
    provider: 'Penyedia',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Buka di PancakeSwap',
    exchangeSuccess: 'Swap berhasil',
    transactionCancelled: 'Transaksi dibatalkan di dompet',
    overview: 'Ringkasan',
    exchangeRate: 'Kurs tukar',
    settlement: 'Penyelesaian',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Konversi',
          body: 'Konversi USDT ke USD1 tanpa biaya/slippage',
        },
        trade: {
          title: 'Dagang',
          body: 'Tukar token utama ke token AEGIS X',
        },
        burn: {
          title: 'Bakar',
          body: 'Burn AGX untuk poin kontribusi',
        },
        comingSoon: 'Segera hadir',
      },
      about: {
        title: 'Tentang Swap',
        body: 'Swap USDT ke USD1, tukar token utama ke aset X DAO, upgrade gAGX ke AGX, atau burn AGX untuk poin.',
      },
      program: {
        title: 'Dapatkan Token X DAO',
        cards: [
          { title: 'Konversi', body: 'Konversi USDT ke USD1' },
          { title: 'Dapatkan USD1', body: 'Dapatkan USD1 di harga PancakeSwap' },
          { title: 'Dapatkan AGX', body: 'Dapatkan AGX di harga PancakeSwap' },
          { title: 'Jual X', body: 'Swap X ke aset AEGIS X atau token utama' },
          { title: 'Dapatkan poin', body: 'Burn AGX rasio 1:6 untuk poin' },
        ],
      },
      faq: {
        items: [
          {
            q: 'Apa itu wallet kripto?',
            a: 'Wallet kripto mengelola aset digital on-chain. Wallet non-custodial memberi kontrol private key/seed phrase hanya kepada Anda; simpan aman. Opsi umum: MetaMask dan TokenPocket.',
          },
          {
            q: 'Apa itu biaya gas?',
            a: 'Setiap buy, sell, swap, atau transfer on-chain butuh gas. AEGIS X tidak memungutnya; jaringan BSC yang mengenakan. Simpan BNB sebelum trading.',
          },
          {
            q: 'Bagaimana wallet bekerja?',
            a: 'Wallet memakai public key dan private key. Private key atau seed phrase menandatangani transaksi dan harus dirahasiakan. Public key dipakai untuk alamat dan menerima aset.',
          },
        ],
      },
    },
    flash: {
      title: 'Konversi',
      intro: 'Konversi USDT ke USD1, tanpa biaya, tanpa slippage',
      providerName: 'AEGIS X',
      openProvider: 'Lihat kontrak konversi di BscScan',
      settlementValue: 'On-chain · instan',
      tokenAboutTitle: 'Tentang USD1',
      action: 'Konversi',
      minReceived: 'Minimum diterima',
    },
    trade: {
      title: 'Dagang',
      intro: 'Rate live PancakeSwap · settlement on-chain',
      action: 'Dagang',
      priceImpact: 'Dampak harga',
      estimatedGas: 'Estimasi gas',
      highPriceImpactWarning:
        'Trade ini dapat menggeser harga pool secara signifikan. Kurangi jumlah atau naikkan toleransi slippage.',
    },
    tokenAbout: {
      title: 'Tentang token ekosistem AEGIS X',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Aset settlement inti',
          body: 'Aset settlement inti ekosistem AEGIS X, menghubungkan sirkulasi nilai, jaringan likuiditas, dan skenario pembayaran.',
        },
        {
          key: 'agx',
          title: 'AGX · Aset protokol inti',
          body: 'AGX adalah aset inti protokol AEGIS X, dihasilkan melalui mekanisme over-collateralization 150%, dan berperan penting dalam pertumbuhan nilai, distribusi yield, dan pengembangan ekosistem.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Voucher settlement reward',
          body: 'Voucher settlement reward protokol, dapat ditukar ke AGX, dan digunakan dalam mining ekosistem serta daur ulang yield.',
        },
        {
          key: 'x',
          title: 'X · Token nilai ekosistem',
          body: 'Pembawa nilai ekosistem AEGIS X dengan pasokan tetap 210 juta, menopang pertumbuhan ekosistem dan akumulasi nilai.',
        },
      ],
    },
    tokenContract: 'Lihat kontrak',
    tokenPrevious: 'Token sebelumnya',
    tokenNext: 'Token berikutnya',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'Apa itu USD1?',
              a: 'USD1 adalah aset settlement inti AEGIS X, 100% didukung cadangan seperti kas, T-Bills AS jangka pendek, dan dana pasar uang. Laporan bulanan tersedia di WLFI.',
            },
            {
              q: 'Peran apa yang diemban USD1 di AEGIS X?',
              a: 'USD1 berfungsi sebagai aset penyelesaian inti, menghubungkan jaringan likuiditas, skenario pembayaran, dan sirkulasi nilai ekosistem.',
            },
            {
              q: 'Bagaimana cara menukar USD1?',
              a: 'Pengguna dapat menukar USDT ke USD1 dengan cepat melalui fitur swap on-chain untuk berpartisipasi dalam ekosistem AEGIS X.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'Apa itu AGX?',
              a: 'AGX adalah aset inti protokol, dicetak melalui mekanisme over-collateralization 150%, mengemban pertumbuhan nilai, distribusi hasil, dan pembangunan ekosistem.',
            },
            {
              q: 'Bagaimana AGX mencapai pertumbuhan berkelanjutan?',
              a: 'Melalui staking, bond, dan Rebase membentuk siklus bunga majemuk jangka panjang, dipadukan dengan market making think-tank AI serta buyback dan burn.',
            },
            {
              q: 'Bagaimana cara mendapatkan AGX?',
              a: 'Pengguna dapat memperoleh AGX dengan ikut serta dalam ekosistem protokol, juga melalui pasar perdagangan yang didukung protokol.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'Apa itu gAGX?',
              a: 'gAGX adalah voucher penyelesaian hadiah protokol, menghubungkan pertumbuhan hasil dengan nilai ekosistem, dan dapat ikut serta dalam mining ekosistem.',
            },
            {
              q: 'Bagaimana cara mendapatkan gAGX?',
              a: 'Setelah pengguna ikut serta dalam distribusi hasil protokol, mereka memperoleh jumlah gAGX yang sesuai.',
            },
            {
              q: 'Apa perbedaan gAGX dan AGX?',
              a: 'AGX adalah aset inti yang mengemban pertumbuhan nilai dan distribusi hasil; gAGX adalah voucher hasil ekosistem yang dapat ditukar ke AGX dan menjadi pintu masuk untuk ikut mining.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'Apa itu X?',
              a: 'X adalah token nilai ekosistem AEGIS X dengan pasokan tetap 210 juta, menopang pertumbuhan ekosistem dan akumulasi nilai.',
            },
            {
              q: 'Bagaimana cara mendapatkan X?',
              a: 'Pengguna dapat memperoleh hadiah X melalui partisipasi dalam mining ekosistem, berbagi nilai pertumbuhan ekosistem.',
            },
            {
              q: 'Bagaimana airdrop X dirilis?',
              a: 'Nilai X berasal dari pertumbuhan ekosistem, akumulasi nilai, dan konsensus pengembangan jangka panjang.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'Lihat detail token & kontrak',
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
