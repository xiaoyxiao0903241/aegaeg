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
      reverts: {
        stakeAmountLimit: 'Batas staking harian tercapai. Turunkan jumlah atau tunggu reset.',
        debtCapacityReached: 'Kapasitas Bond penuh. Silakan coba lagi nanti.',
        turbineCooldown:
          'Cooldown belum selesai atau jumlah tidak valid. Segarkan catatan cooldown lalu coba lagi.',
        pairNotExist: 'Pasangan perdagangan tidak ada. Periksa konfigurasi token.',
        notWinner: 'Anda tidak menang di putaran ini, tidak dapat diklaim.',
        rewardAlreadyClaimed: 'Hadiah sudah diklaim. Jangan klaim lagi.',
        configNotReady: 'Konfigurasi protokol belum siap. Silakan coba lagi nanti.',
        exceedsMax: 'Jumlah melebihi batas maksimum. Harap turunkan.',
        bondTooSmall: 'Pembayaran Bond terlalu kecil. Tingkatkan jumlah pembelian.',
        bondTooLarge: 'Melebihi batas Bond per transaksi. Turunkan jumlah pembelian.',
        stakeNotExist: 'Posisi tidak ada atau sudah ditutup. Segarkan dan coba lagi.',
        yieldUnavailable:
          'Belum ada hasil yang dapat diklaim atau jumlah terlalu besar. Turunkan jumlah atau tunggu akumulasi.',
        operationPaused: 'Operasi ini dijeda. Silakan coba lagi nanti.',
        belowMinAmount: 'Jumlah di bawah minimum. Harap tingkatkan.',
        aboveMaxAmount: 'Jumlah melebihi batas maksimum. Harap turunkan.',
        zeroRate: 'Kurs belum siap. Silakan coba lagi nanti.',
        zeroAmount: 'Masukkan jumlah yang valid.',
      },
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
    exchange: 'Tukar',
    assets: 'Aset',
    staking: 'Stake',
    genesis: 'Bangun Bersama',
    rewards: 'Hadiah',
    release: 'Rilis',
    community: 'Komunitas',
    rewardsTooltip: 'Lihat hadiah referral dan tim.',
    communityTooltip:
      'Undang mitra untuk ikut pembangunan bersama, bagikan nilai pertumbuhan ekosistem dan hadiah Genesis.',
    bscTooltip: 'Hanya BSC · AEGIS X berjalan di BNB Smart Chain.',
  },
  topbar: {
    currentNetwork: 'Jaringan saat ini',
    switchToBsc: 'Beralih ke BSC',
    switchNetworkFailed: 'Gagal beralih jaringan. Alihkan ke BSC di dompet lalu coba lagi.',
    wrongNetworkTooltip: 'Jaringan salah. Klik untuk beralih ke BNB Smart Chain (BSC).',
    openMenu: 'Buka navigasi',
    closeMenu: 'Tutup navigasi',
    hideDetails: 'Sembunyikan panel detail',
    showDetails: 'Tampilkan panel detail',
    toggleTooltip: 'Tampilkan atau sembunyikan panel detail',
  },
  onboarding: {
    chip: 'Panduan pemula',
    skip: 'Lewati',
    prev: 'Kembali',
    next: 'Lanjut',
    done: 'Selesai',
    steps: [
      {
        title: 'Tukar',
        body: 'Gunakan 「Tukar」 untuk menukar token utama menjadi token ekosistem AEGIS X (AGX, gAGX, X) dengan kurs pasar.',
      },
      {
        title: 'Perdagangan',
        body: 'Gunakan 「Trade」 untuk membeli AGX dengan USD1.',
      },
      {
        title: 'Stake',
        body: '「Staking」 adalah titik awal yield: stake AGX atau beli Bond untuk mendapat reward berbunga majemuk di setiap Rebase.',
      },
      {
        title: 'Staking aset tunggal',
        body: 'Stake AGX di kartu 「Staking」. Rebase dua kali sehari berbunga majemuk; kunci lebih lama mendapat boost yield lebih tinggi.',
      },
      {
        title: 'Aset',
        body: '「Aset」 merangkum semua posisi Anda: staking, Bond LP, Bond bakar, serta posisi dan reward penambangan X.',
      },
      {
        title: 'Posisi staking',
        body: 'Di kartu 「Staking」 halaman Aset, tinjau posisi dan total reward, lalu klaim, restake, atau tebus.',
      },
      {
        title: 'Rilis',
        body: '「Rilis」 mengelola dana yang menunggu rilis: reward masuk ke kolam rilis / kolam penyangga dan terbuka secara linear per periode.',
      },
      {
        title: 'Pool rilis',
        body: 'Reward yang diklaim terbuka secara linear selama 5 / 20 / 40 / 60 hari; bagian yang sudah rilis dapat masuk ke Turbine.',
      },
      {
        title: 'Pool buffer',
        body: 'Pokok yang ditebus terbuka secara linear selama ~30 hari blok; bagian yang sudah rilis dapat ditarik kapan saja.',
      },
      {
        title: 'Turbin',
        body: 'gAGX dari kolam rilis yang masuk Turbine tetap terkunci; beli dengan USD1 sesuai kuotasi Turbine di rantai untuk membuka.',
      },
      {
        title: 'Hadiah',
        body: '「Hadiah」 mencakup referral, partisipasi, co-build, dan lainnya. Klaim Mixed (Lucky/co-build/referral/partisipasi) mengonsumsi poin kontribusi 1:1; tunjangan memakai klaim bertanda tangan ke wallet.',
      },
      {
        title: 'Komunitas',
        body: '「Komunitas」 menampilkan tim Anda: tautan undangan, anggota komunitas, dan level Bangun Bersama ada di sini.',
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
      writeInFlight: 'Operasi on-chain lain sedang berlangsung. Harap tunggu.',
    },
  },
  exchange: {
    title: 'Tukar',
    intro: 'Dapatkan token ekosistem AEGIS X dengan kurs terbaik',
    backToHub: 'Kembali ke Tukar',
    sell: 'Sell',
    buy: 'Beli',
    flip: 'Balik arah tukar',
    balance: 'Saldo',
    exchangePrice: 'Harga tukar',
    slippage: 'Toleransi slippage',
    allowedSlippage: 'Slippage diizinkan',
    slippageSettings: 'Pengaturan toleransi slippage',
    route: 'Rute tukar',
    provider: 'Penyedia',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Buka di PancakeSwap',
    transactionCancelled: 'Transaksi dibatalkan di dompet',
    overview: 'Ikhtisar',
    exchangeRate: 'Kurs tukar',
    settlement: 'Penyelesaian',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Tukar cepat',
          body: 'Tukar gAGX ke AGX atau USDT ke USD1 — tanpa biaya, tanpa slippage',
        },
        trade: {
          title: 'Perdagangan',
          body: 'Tukar token utama menjadi token ekosistem AEGIS X',
        },
        burn: {
          title: 'Bakar',
          body: 'Bakar AGX untuk mendapatkan poin kontribusi',
        },
        turbine: {
          title: 'Turbin',
          body: 'Beli gAGX Turbine yang terbuka dengan USD1',
        },
      },
      program: {
        title: 'Dapatkan token protokol AEGIS X',
        cards: [
          { title: 'Perdagangkan gAGX', body: 'Tukar gAGX menjadi AGX' },
          { title: 'Turbin', body: 'Beli gAGX Turbine yang terbuka dengan USD1' },
          { title: 'Dapatkan USD1', body: 'Konversi USDT ke USD1 via Flash' },
          { title: 'Dapatkan AGX', body: 'Dapatkan AGX dengan kurs pasar PancakeSwap' },
          { title: 'Jual X', body: 'Tukar X menjadi AGX, USD1, atau token ekosistem lainnya' },
          {
            title: 'Dapatkan poin kontribusi',
            body: 'Bakar AGX dengan rasio {ratio} untuk mendapatkan poin kontribusi',
          },
        ],
      },
      faq: {
        items: [
          {
            q: 'Apa yang bisa saya lakukan di halaman Tukar?',
            a: 'Flash-konversi USDT ke USD1 atau gAGX ke AGX, trade token utama untuk aset AEGIS X di PancakeSwap, bakar AGX untuk poin kontribusi, dan beli gAGX Turbine yang terbuka dengan USD1.',
          },
          {
            q: 'Apa perbedaan Flash dan Trade?',
            a: 'Flash memakai rute protokol tetap tanpa kontrol slippage pengguna. Trade memakai kurs live PancakeSwap dengan slippage yang dapat dikonfigurasi dan dampak harga pasar.',
          },
          {
            q: 'Apa itu wallet kripto, dan bagaimana mendapatkannya?',
            a: 'Wallet kripto mengelola aset digital on-chain. Dengan wallet non-kustodial, hanya Anda yang mengontrol private key atau seed phrase, jadi jaga keamanannya. Opsi umum termasuk MetaMask dan TokenPocket.',
          },
          {
            q: 'Apa itu biaya transaksi blockchain?',
            a: 'Setiap beli, jual, tukar, atau transfer on-chain membutuhkan gas. AEGIS X tidak memungutnya; jaringan BSC yang memungut. Simpan BNB di wallet sebelum bertransaksi.',
          },
          {
            q: 'Bagaimana cara kerja dompet kripto?',
            a: 'Dompet kripto menggunakan sepasang kunci—kunci publik dan kunci privat—untuk melindungi dan mengelola aset Anda. Saat menyiapkan dompet non-kustodial, perangkat lunak menghasilkan frasa pemulihan (12, 18, atau 24 kata acak) yang dapat memulihkan kunci Anda. Simpan dengan aman dan jangan bagikan. Kunci privat adalah string unik yang memberi kontrol penuh atas dompet, digunakan untuk menandatangani dan mengotorisasi transaksi, dan harus selalu dirahasiakan. Kunci publik diturunkan dari kunci privat, dapat dibagikan secara publik, dan digunakan untuk membuat alamat dompet serta menerima transfer.',
          },
        ],
      },
    },
    flash: {
      title: 'Tukar cepat',
      intros: {
        gagx: 'Konversi gAGX ke AGX — tanpa biaya, tanpa slippage',
        gagxWrap: 'Bungkus AGX menjadi gAGX — tanpa biaya, tanpa slippage',
        usdt: 'Konversi USDT ke USD1 — tanpa biaya, tanpa slippage',
      },
      providerName: 'AEGIS X',
      openProvider: 'Lihat kontrak Flash di BscScan',
      settlementValue: 'On-chain · detik',
      aboutTitle: 'Tentang',
      action: 'Tukar cepat',
      success: 'Flash berhasil',
      pairAriaLabel: 'Pasangan Flash',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'Flash dijeda. Silakan coba lagi nanti.',
        belowMin: 'Jumlah di bawah batas tukar minimum per transaksi.',
        aboveMax: 'Jumlah melebihi batas tukar maksimum per transaksi.',
        insufficientReserve: 'Cadangan USD1 tidak mencukupi. Silakan coba lagi nanti.',
        zeroRate: 'Kurs tukar belum siap. Silakan coba lagi nanti.',
        insufficientOutput: 'Kuotasi berubah. Silakan coba lagi.',
        transferMismatch: 'Jumlah transfer token tidak cocok. Silakan coba lagi.',
        zeroAddress: 'Alamat kontrak tidak valid. Silakan coba lagi nanti.',
        sameToken: 'Konfigurasi token input/output tidak valid. Silakan coba lagi nanti.',
        zeroAmount: 'Masukkan jumlah lebih dari 0.',
        notAuthorized: 'Tindakan ini tidak diotorisasi.',
        invalidLimits: 'Batas tukar salah dikonfigurasi. Silakan coba lagi nanti.',
      },
      faq: {
        items: [
          {
            q: 'Apa itu gAGX?',
            a: 'gAGX adalah voucher settlement terpadu untuk reward Rebase dan DAO. Yield Rebase dari staking AGX atau Bond, serta reward DAO, dibayar sebagai gAGX.',
          },
          {
            q: 'Berapa rasio tukar gAGX ke AGX?',
            a: 'Tetap 1:1 kapan saja — tanpa biaya, tanpa slippage, settle on-chain secara instan.',
          },
          {
            q: 'Mengapa Flash tanpa biaya atau slippage?',
            a: 'Flash adalah redeem protokol 1:1 gAGX↔AGX, bukan trade AMM, jadi tidak ada slippage harga atau biaya swap. Anda hanya membayar gas jaringan BSC dalam BNB.',
          },
          {
            q: 'Bagaimana cara mendapatkan gAGX?',
            a: 'Setelah berpartisipasi dalam distribusi yield protokol, Anda menerima sejumlah gAGX yang sesuai.',
          },
          {
            q: 'Selain menebus AGX, apa lagi yang bisa dilakukan dengan gAGX?',
            a: 'Tebus 1:1 ke AGX untuk staking berbunga majemuk, atau stake gAGX untuk menambang X. Kedua jalur tersedia.',
          },
          {
            q: 'Bagaimana menukar USDT menjadi USD1?',
            a: 'Beralih ke pasangan USDT → USD1 di Flash, masukkan jumlah, dan tukar dengan kurs protokol serta settlement on-chain.',
          },
          {
            q: 'Bisakah saya menukar USD1 kembali ke USDT?',
            a: 'Flash bersifat satu arah USDT→USD1. Gunakan Trade untuk swap pasar ke aset lain.',
          },
          {
            q: 'Di mana saya melihat riwayat Flash?',
            a: 'Flash diselesaikan on-chain dalam hitungan detik. Konfirmasi setiap transaksi di dompet atau block explorer.',
          },
        ],
      },
    },
    trade: {
      title: 'Perdagangan',
      intro: 'Kurs pasar real-time PancakeSwap · penyelesaian on-chain',
      aboutTitle: 'Tentang',
      selectSellToken: 'Pilih token jual',
      selectBuyToken: 'Pilih token beli',
      action: 'Perdagangan',
      success: 'Perdagangan berhasil',
      priceImpact: 'Dampak harga',
      estimatedGas: 'Estimasi Gas',
      highPriceImpactWarning:
        'Trade ini dapat menggerakkan harga pool secara signifikan. Coba jumlah lebih kecil atau tingkatkan toleransi slippage.',
    },
    burn: {
      title: 'Bakar',
      subtitle: 'Bakar AGX untuk mendapatkan poin kontribusi',
      sellLabel: 'Bakar',
      receiveLabel: 'Terima',
      pointsToken: 'Poin kontribusi saya',
      currentContribution: 'Nilai kontribusi saat ini',
      burnRate: 'Rasio bakar',
      destination: 'Tujuan bakar',
      destinationValue: 'Lubang hitam {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'Lihat kontrak tukar kontribusi di BscScan',
      action: 'Bakar',
      success: 'Bakar berhasil',
      aboutTitle: 'Tentang',
      blocked: {
        paused: 'Bakar dijeda. Silakan coba lagi nanti.',
        belowMin: 'Jumlah di bawah batas bakar minimum per transaksi.',
        aboveMax: 'Jumlah melebihi batas bakar maksimum per transaksi.',
        zeroRate: 'Rasio bakar belum siap. Silakan coba lagi nanti.',
        zeroAmount: 'Masukkan jumlah lebih dari 0.',
      },
      metrics: {
        totalBurnedAgx: 'Total AGX yang dibakar',
        totalEarnedContribution: 'Total poin kontribusi diperoleh',
        totalConsumedContribution: 'Total poin kontribusi dikonsumsi',
      },
      history: {
        title: 'Riwayat bakar',
        emptyBurn:
          'Belum ada catatan pembakaran. Setelah Anda bakar AGX untuk poin kontribusi, setiap transaksi akan muncul di sini.',
        emptyConsume:
          'Belum ada catatan konsumsi. Setelah klaim hadiah yang mengonsumsi poin kontribusi, setiap catatan akan muncul di sini.',
        tabsAriaLabel: 'Tab riwayat bakar',
        tabs: {
          burn: 'Bakar',
          consume: 'Konsumsi',
        },
        burnColumns: ['Waktu', 'AGX dibakar', 'Poin kontribusi diperoleh', 'Hash transaksi'],
        consumeColumns: ['Waktu', 'Poin kontribusi dikonsumsi', 'Hash transaksi'],
      },
      faq: {
        items: [
          {
            q: 'Untuk apa poin kontribusi digunakan?',
            a: 'Poin kontribusi diperlukan saat klaim hadiah campuran dengan restake. Klaim restake dan lucky-pool mengonsumsi poin berdasarkan jumlah hadiah.',
          },
          {
            q: 'Mengapa klaim hadiah perlu mengonsumsi poin kontribusi?',
            a: 'Protokol memakai poin kontribusi untuk mengatur klaim hadiah dan alur restake. Jika saldo tidak cukup, klaim gagal — bakar AGX dulu untuk menambah poin.',
          },
          {
            q: 'Berapa rasio pembakaran?',
            a: 'Rasio pembakaran diatur on-chain (rateBps). Setiap AGX yang dibakar menghasilkan poin kontribusi = AGX × rateBps ÷ 10000.',
          },
          {
            q: 'Ke mana AGX yang dibakar pergi?',
            a: 'Menurut konfigurasi split on-chain, sekitar {burnPct}% masuk ke alamat black-hole secara permanen; sekitar {injectPct}% dapat diinjeksikan ke likuiditas LP.',
          },
          {
            q: 'Bisakah poin kontribusi ditransfer atau dikembalikan?',
            a: 'Poin kontribusi tercatat di buku besar akun kontrak AgxContributionSwap, tidak dapat ditransfer, dan tidak dapat dikembalikan menjadi AGX.',
          },
        ],
      },
    },
    turbine: {
      title: 'Turbin',
      aboutTitle: 'Tentang',
      segmentAriaLabel: 'Aksi Turbine',
      segments: {
        unlock: 'Buka',
        claim: 'Klaim',
      },
      unlockLabel: 'Buka',
      unlockable: 'Dapat dibuka',
      equivalentBuyHint: 'Pembukaan akan menjalankan pembelian setara secara bersamaan',
      payUsd1Label: 'Bayar USD1',
      buyAgxLabel: 'Beli AGX',
      buyToBoundWallet: 'Pembelian masuk ke dompet',
      agxPrice: 'Harga AGX',
      willReceiveAgx: 'AGX yang akan diterima',
      unlockRatio: 'Rasio buka',
      unlockRatioValue: '1 : 1 beli untuk membuka',
      cooldown: 'Periode cooldown',
      cooldownHoursValue: '{hours} jam',
      unlockAction: 'Buka',
      unlockSuccess: 'Berhasil dibuka, cooldown dimulai',
      claimAction: 'Klaim',
      claimSuccess: 'Berhasil diklaim',
      claimEmpty: 'Belum ada catatan pembukaan',
      claimReady: 'Jatuh tempo, dapat ditarik',
      claimCoolingUntil: 'Cooldown · {time}',
      dataTitle: 'Data Turbine',
      recordsTitle: 'Catatan Turbine',
      recordsEmpty:
        'Belum ada catatan Turbine. Setelah reward masuk Turbine dari kolam rilis, setiap aksi akan muncul di sini.',
      mechanismTitle: 'Mekanisme Turbine',
      mechanismIntro:
        'Ikat likuiditas jual dengan permintaan beli agar setiap unlock berpasangan dengan pembelian setara',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
        },
        {
          title: 'Mekanisme cooldown dinamis',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'gAGX menunggu dibuka',
        cooling: 'gAGX dalam cooldown',
        totalWithdrawn: 'Total ditarik',
      },
      faq: {
        items: [
          {
            q: 'Bagaimana gAGX masuk ke Turbine?',
            a: 'After RewardQueue (and related) claims, rewards credit Turbine as unlockable quota (turbineBalances).',
          },
          {
            q: 'Mengapa perlu beli untuk membuka kunci?',
            a: 'Unlock memerlukan pembelian AGX setara dengan USD1 pada harga live (kuantitas 1:1). Jumlah USD1 yang dibayar mengikuti kuotasi AGX — bukan harga tetap USD1:AGX 1:1.',
          },
          {
            q: 'Unlock vs klaim?',
            a: 'Unlock: bayar USD1 untuk membeli AGX dan memulai cooldown. Klaim: tarik gAGX setelah silence matang.',
          },
          {
            q: 'Berapa lama cooldown?',
            a: 'currentCooldownDuration — typically about 24–96 hours, adaptive to treasury health. The page shows the live period.',
          },
          {
            q: 'Ke mana AGX yang dibeli saat membuka?',
            a: 'AGX yang dibeli masuk ke dompet Anda; setelah cooldown selesai, klaim gAGX secara terpisah.',
          },
        ],
      },
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
          body: 'AGX adalah aset inti protokol AEGIS X, dihasilkan melalui mekanisme over-collateralization 150%, dan berperan penting dalam pertumbuhan nilai, distribusi yield, serta pembangunan ekosistem.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Voucher settlement reward',
          body: 'Voucher settlement reward protokol yang dapat ditebus menjadi AGX dan digunakan dalam penambangan ekosistem serta daur ulang yield.',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · Voucher staking',
          body: 'Voucher berbunga dari staking AGX, dengan yield auto-compound serta membuka bobot governance dan gelar yang lebih tinggi.',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
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
        trade: {
          label: 'Perdagangan',
          items: [
            {
              q: 'Apa perbedaan Trade dan Flash Swap?',
              a: 'Trade menukar USD1, AGX, X, dan token ekosistem lain di PancakeSwap dengan kurs pasar live, slippage yang dapat dikustomisasi, dan biaya gas. Flash Swap adalah konversi protokol 1:1 gAGX↔AGX tanpa biaya atau slippage.',
            },
            {
              q: 'Apa itu allowed slippage dan bagaimana mengaturnya?',
              a: 'Slippage adalah pergerakan harga antara pengajuan dan settlement. Allowed slippage adalah deviasi maksimum yang Anda terima—gunakan default atau persen kustom. Jika slippage aktual melebihi pengaturan, trade dibatalkan (gas mungkin tetap terpakai). Terlalu rendah mudah gagal; terlalu tinggi bisa terisi dengan harga lebih buruk.',
            },
            {
              q: 'Bagaimana Trade settle, dan apakah ada biaya?',
              a: 'Trade settle on-chain di PancakeSwap. AEGIS X tidak memungut biaya swap ekstra, tetapi setiap tx on-chain membutuhkan gas BSC dalam BNB—pastikan BNB cukup di wallet.',
            },
            {
              q: 'Mengapa jumlah yang diterima bisa berbeda dari estimasi?',
              a: 'Estimasi memakai kurs saat kuotasi. Pergerakan pasar atau trade lain dapat mengubah fill; jumlah akhir adalah yang settle on-chain dalam batas slippage Anda.',
            },
            {
              q: 'Token apa yang bisa saya trade?',
              a: 'Anda dapat menukar antar token ekosistem AEGIS X (USD1, AGX, X) dengan kurs pasar. Gunakan tab di atas untuk detail setiap token.',
            },
            {
              q: 'Di mana saya melihat riwayat perdagangan?',
              a: 'Perdagangan dieksekusi on-chain dan diselesaikan dalam hitungan detik. Konfirmasi setiap transaksi di dompet atau block explorer.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'Apa itu USD1?',
              a: 'USD1 adalah aset settlement inti AEGIS X. Didukung 100% oleh cadangan seperti kas, U.S. Treasuries jangka pendek, dan government money-market funds; laporan bulanan tersedia di WLFI.',
            },
            {
              q: 'Peran apa yang dijalankan USD1 di AEGIS X?',
              a: 'USD1 berfungsi sebagai aset settlement inti, menghubungkan jaringan likuiditas, skenario pembayaran, dan aliran nilai ekosistem.',
            },
            {
              q: 'Bagaimana cara mendapatkan USD1?',
              a: 'Gunakan entri 「Dapatkan USD1」 di beranda Tukar dengan kurs pasar PancakeSwap, atau tukar AGX, X, dan token ekosistem lain di halaman Perdagangan.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'Apa itu AGX?',
              a: 'AGX adalah aset inti protokol AEGIS X, dicetak melalui mekanisme over-collateralization 150%, dan berperan penting dalam pertumbuhan nilai, distribusi yield, serta pembangunan ekosistem.',
            },
            {
              q: 'Bagaimana AGX mencapai pertumbuhan berkelanjutan?',
              a: 'Melalui staking, Bond, dan Rebase, AGX membentuk siklus compounding jangka panjang, digabungkan dengan market making AI think-tank dan mekanisme buyback-and-burn.',
            },
            {
              q: 'Bagaimana cara mendapatkan AGX?',
              a: 'Pengguna dapat memperoleh AGX dengan berpartisipasi dalam ekosistem protokol, atau mendapatkannya melalui pasar trade yang didukung protokol.',
            },
            {
              q: 'Dari mana dukungan nilai AGX berasal?',
              a: 'AGX dicetak dengan over-collateralization 150%, ditopang cadangan think-tank; serta membentuk siklus nilai jangka panjang melalui staking, Bond, Rebase berbunga majemuk, dan buyback-and-burn.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'Apa itu gAGX?',
              a: 'gAGX adalah voucher settlement reward protokol, menghubungkan pertumbuhan yield dengan nilai ekosistem, dan dapat berpartisipasi dalam penambangan ekosistem.',
            },
            {
              q: 'Bagaimana cara mendapatkan gAGX?',
              a: 'Setelah berpartisipasi dalam distribusi yield protokol, pengguna menerima sejumlah gAGX yang sesuai.',
            },
            {
              q: 'Apa perbedaan gAGX dan AGX?',
              a: 'AGX adalah aset inti protokol untuk pertumbuhan nilai dan distribusi hasil; gAGX adalah voucher hasil ekosistem, dapat ditukar ke AGX, dan menjadi pintu masuk penting untuk mining ekosistem.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'Apa itu X?',
              a: 'X adalah token nilai ekosistem AEGIS X, dengan pasokan tetap 210 juta, membawa pertumbuhan ekosistem dan akumulasi nilai.',
            },
            {
              q: 'Bagaimana cara mendapatkan X?',
              a: 'Pengguna dapat memperoleh reward X dengan berpartisipasi dalam penambangan ekosistem, berbagi nilai pertumbuhan ekosistem.',
            },
            {
              q: 'Bagaimana airdrop X dirilis?',
              a: 'Nilai X berasal dari pertumbuhan ekosistem, akumulasi nilai, dan konsensus pengembangan jangka panjang, menjadikannya pembawa kunci nilai ekosistem.',
            },
            {
              q: 'Mengapa X terus deflasi?',
              a: 'Pasokan X tetap 210 juta, tidak pernah bertambah, dan setiap penjualan otomatis membakar 25%. Permintaan dari pertumbuhan ekosistem plus pembakaran berkelanjutan mengurangi pasokan beredar dari waktu ke waktu.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'Lihat detail token dan kontrak',
  },
  genesis: {
    title: 'Program Pembangunan Bersama',
    intro: 'Ikuti program pembangunan bersama X DAO · Fase {season}  (diskon {discount})',
    introEnded:
      'Program Bangun Bersama X DAO telah selesai · Terima kasih kepada semua pembangun bersama',
    shares: 'Saham (1 saham = {min} USD1 · maks {max} saham)',
    quota: 'Kuota pembangunan bersama fase ini',
    pay: 'Bayar',
    receive: 'Akan menerima AGX',
    value: 'Nilai langganan',
    xTokenAirdrop: 'Estimasi nilai airdrop X awal',
    xTokenAirdropHint:
      'Hadiah airdrop memerlukan partisipasi pembangunan bersama kumulatif per fase ≥ {threshold}.',
    join: 'Ikut Pembangunan Bersama',
    joinEnded: 'Bangun Bersama berakhir',
    joinGenesis: 'Ikut pembangunan bersama Genesis',
    statsTitle: 'Data pembangunan bersama Fase {season}',
    startsIn: 'Mulai dalam',
    countdownUnits: { days: 'j', hours: 'j', minutes: 'mnt' },
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
    contributionsEmptyEnded: {
      title: 'Belum ada riwayat pembangunan bersama',
      body: 'Program pembangunan bersama telah berakhir. Akun yang tidak berpartisipasi tidak memiliki catatan di sini.',
    },
    goBindReferrer: 'Ikat perujuk',
    seasonLive: 'Berlangsung',
    seasonEnded: 'Berakhir',
    seasonUpcoming: 'Segera dimulai',
  },
  rewards: {
    title: 'Hadiah',
    intro: 'Lihat saldo kartu hadiah dan catatan pembayaran.',
    backToHub: 'Kembali ke Hadiah',
    claim: 'Klaim',
    claimSuccess: 'Berhasil diklaim',
    claimErrors: {
      zeroAmount: 'Jumlah klaim adalah 0.',
      invalidSigner: 'Tanda tangan tidak valid. Segarkan dan coba klaim lagi.',
      alreadyUsed: 'Hadiah ini sudah diklaim. Jangan klaim lagi.',
      expired: 'Tanda tangan kedaluwarsa. Segarkan lalu klaim lagi.',
      noOrder: 'Tidak ada hadiah yang dapat diklaim.',
      failed: 'Klaim gagal. Silakan coba lagi nanti.',
      confirmSyncFailed:
        'Klaim berhasil on-chain tetapi sinkronisasi gagal. Segarkan halaman dan jangan klaim lagi.',
    },
    hub: {
      asideTitle: 'Tentang hadiah AEGIS X',
      asideBody:
        'Enam kartu hadiah mencakup lucky draw, referral, partisipasi, co-build, tunjangan pengembangan, dan genesis co-build.',
      aboutTitle: 'Tentang hadiah AEGIS X',
      balanceLabel: 'Saldo',
      filterAria: 'Filter hadiah',
      hideZero: 'Sembunyikan aset 0',
      hideZeroEmpty: 'Belum ada hadiah non-nol',
      balancePlaceholder: '0.00',
      signInForBalance: 'Masuk dengan tanda tangan untuk melihat',
      enterClaim: 'Masuk untuk klaim',
      sessionHint:
        'Selesaikan sign-in wallet sebelum klaim. Menghubungkan wallet tidak sama dengan login bisnis.',
      stats: {
        totalRewards: 'Total hadiah',
        tier: 'Level Bangun Bersama',
        tierEmpty: 'Belum mencapai level Bangun Bersama',
        personalHolding: 'Kepemilikan pribadi',
        totalPerformance: 'Total kinerja',
        smallAreaPerformance: 'Kinerja area kecil',
        contribution: 'Poin kontribusi saya',
        contributionHint: 'Klaim hadiah mengonsumsi 1:1',
        goBurn: 'Pergi bakar',
      },
      mechanismTitle: 'Mekanisme hadiah Bangun Bersama',
      mechanismBody:
        'Hadiah Bangun Bersama berasal dari total hasil Rebase tim, dibagikan sesuai rasio level.',
      mechanismFooter:
        'Sembarang dua jalur yang mencapai tier yang dibutuhkan membuka promosi. Tier lebih tinggi mendapat rate lebih tinggi, hingga pencapaian seumur hidup dan dividen global.',
      aboutSlides: {
        lucky: {
          title: 'Hadiah keberuntungan',
          body: 'Undian keberuntungan blok, dibagikan acak kepada pembangun bersama; setelah menang klaim via Mixed.',
        },
        referral: {
          title: 'Hadiah referral',
          body: 'Hadiah terkait referral setelah mitra langsung ikut Bangun Bersama; klaim via DaoPool Mixed (konsumsi poin kontribusi 1:1).',
        },
        participate: {
          title: 'Hadiah partisipasi',
          body: 'Hadiah partisipasi dari pereferensi Anda; klaim via DaoPool Mixed (konsumsi poin kontribusi 1:1).',
        },
        cobuild: {
          title: 'Bangun Bersama',
          body: 'Insentif berkelanjutan melalui kolaborasi tim dan Bangun Bersama jangka panjang; dialokasikan per rasio level, klaim Mixed memerlukan poin kontribusi.',
        },
        grant: {
          title: 'Tunjangan pengembangan',
          body: 'Tunjangan khusus pengembangan ekosistem, diklaim via tanda tangan MarketFund.',
        },
        genesis: {
          title: 'Hadiah Bangun Bersama Genesis',
          body: 'Hadiah referral, level, dan dana pengembangan periode Genesis; tidak dapat diklaim setelah jendela penyelesaian ditutup.',
        },
      },
      tierTable: {
        columns: ['Tingkat', 'Kepemilikan', 'Akun aktif', 'Volume tim', 'Rate bonus'],
        rows: [
          {
            level: 'A1',
            holding: '$100',
            accounts: '2',
            team: 'Total kinerja ≥ $6,000',
            rate: '10%',
          },
          {
            level: 'A2',
            holding: '$100',
            accounts: '2',
            team: 'Total kinerja ≥ $20,000',
            rate: '20%',
          },
          {
            level: 'A3',
            holding: '$100',
            accounts: '2',
            team: 'Total kinerja ≥ $60,000',
            rate: '30%',
          },
          {
            level: 'A4',
            holding: '$500',
            accounts: '5',
            team: 'Total kinerja ≥ $180,000',
            rate: '40%',
          },
          {
            level: 'A5',
            holding: '$1,000',
            accounts: '5',
            team: 'Total kinerja ≥ $550,000',
            rate: '55%',
          },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: 'Dua jalur mencapai A5',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '5',
            team: 'Dua jalur mencapai A6',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '5',
            team: 'Dua jalur mencapai A7',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '5',
            team: 'Dua jalur mencapai A8',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '5',
            team: 'Dua jalur mencapai A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '5',
            team: 'Dua jalur mencapai A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '5',
            team: 'Dua jalur mencapai A11',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '5',
            team: 'Dua jalur mencapai A12',
            rate: '130%',
          },
          {
            level: 'Hadiah prestasi seumur hidup',
            holding: '$100,000',
            accounts: '5',
            team: 'Dua jalur mencapai A13',
            rate: '130% + dividen global 5%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Hadiah keberuntungan',
        body: 'Undian keberuntungan blok, dibagikan acak kepada pembangun bersama',
        aside: 'Hadiah keberuntungan memakai Chainlink VRF; pemenang dapat klaim via Mixed.',
      },
      referral: {
        title: 'Hadiah referral',
        body: 'Dapatkan hadiah dengan mengundang mitra ke Bangun Bersama',
        aside: 'Direct-referral related rewards; claim via DaoPool Mixed (contribution 1:1).',
      },
      participate: {
        title: 'Hadiah partisipasi',
        body: 'Hadiah dari pereferensi Anda',
        aside:
          'Hadiah partisipasi dari Bond referral Anda; klaim via DaoPool Mixed (kontribusi 1:1).',
      },
      cobuild: {
        title: 'Bangun Bersama',
        body: 'Hadiah insentif berkelanjutan dari kolaborasi tim dan Bangun Bersama jangka panjang',
        aside: 'Hadiah Bangun Bersama diklaim via DaoPool Mixed dan memerlukan poin kontribusi.',
      },
      grant: {
        title: 'Tunjangan pengembangan',
        body: 'Tunjangan khusus pengembangan ekosistem',
        aside:
          'Tunjangan pengembangan diklaim via tanda tangan MarketFund setelah disetujui, langsung ke dompet.',
      },
      genesis: {
        title: 'Hadiah Bangun Bersama Genesis',
        body: 'Hadiah referral langsung, level, dan dana pengembangan periode Genesis',
        aside: 'Hadiah Bangun Bersama Genesis diklaim via tanda tangan RewardClaimer.',
        badge: 'Segera ditutup',
      },
    },
    detail: {
      claimable: 'Dapat diklaim',
      emptyClaimable: 'Tidak ada hadiah yang dapat diklaim.',
      signedAmountHint: 'Jumlah yang dapat diklaim mengikuti payload bertanda tangan',
      usdLabel: 'USD',
    },

    claimHistory: {
      title: 'Riwayat penerbitan & klaim',
      columns: ['Waktu', 'Tipe', 'Jumlah', 'Hash tx'],
      empty: 'Belum ada catatan',
    },

    mixed: {
      splitAria: 'Rasio klaim vs restake',
      releasePct: 'Klaim {pct}%',
      restakePct: 'Investasikan ulang {pct}%',
      releasePeriod: 'Pilihan periode rilis',
      restakePeriod: 'Pilihan periode restake',
      releaseAria: 'Pilihan periode rilis',
      restakeAria: 'Pilihan periode restake',
      releaseDays: '{days} hari',
      restakeDays: '{days} hari',
      daysTax: '{days} hari · {tax}',
      taxRate: 'Pajak {rate}%',
      requiredContributionLabel: 'Poin kontribusi yang dipotong klaim ini',
      insufficientContributionDetail:
        'Poin kontribusi tidak cukup (perlu {need}, saat ini {have}), ',
      goBurnInline: 'Pergi bakar',
      getContributionSuffix: ' untuk mendapatkan poin kontribusi.',
      releaseInto: 'Masuk antrean rilis',
      restakeInto: 'Masuk staking single-asset',
      restakeLabel: 'Investasikan ulang',
      tokenGagx: 'gAGX',
      ctaReleaseLine: 'Klaim {amount}',
      ctaRestakeLine: 'Investasikan ulang {amount}',
      requiredContribution: 'Poin kontribusi dipotong klaim ini: {amount}',
      insufficientContribution: 'Poin kontribusi tidak cukup. Dapatkan poin kontribusi dulu.',
      goBurn: 'Dapatkan poin kontribusi',
      luckyPaused: 'Pool hadiah keberuntungan dijeda; klaim tidak tersedia.',
      luckyNotClaimable: 'Tidak ada hadiah keberuntungan yang dapat diklaim.',
    },

    lucky: {
      dataTitle: 'Data',
      todayPool: 'Pool hadiah hari ini',
      countdownHint: 'Undian berikutnya {time}',
      eligibility: 'Kelayakan hari ini',
      eligibilityYes: 'Memenuhi syarat',
      eligibilityNo: 'Belum memenuhi',
      maxStakeHint: 'Pembelian hari ini {amount}',
      cumulativeWins: 'Total kemenangan',
      winsCount: '{count} kali',
      vrfTitle: 'Keacakan terverifikasi Chainlink VRF v2',
      vrfBody:
        'Lucky draw memakai Chainlink VRF v2 dengan kontrak staking: randomness dihasilkan on-chain dengan bukti kriptografi, lalu pemenang dipilih dari daftar kelayakan hari itu. Tanpa intervensi manusia; siapa pun dapat memverifikasi on-chain.',
      verifyTutorial: 'Panduan verifikasi',
      resultsTitle: 'Hasil undian',
      dateFilterAria: 'Pilih tanggal undian',
      resultsSummary: 'Undian · {count} pengguna beruntung',
      verifyHash: 'Verifikasi hash undian putaran ini',
      meBadge: 'Saya',
      resultWon: 'Menang {amount}',
      resultLost: 'Tidak menang',
      resultsColumns: ['Peringkat', 'Pemenang', 'Stake', 'Hadiah'],
      emptyResults: 'Belum ada hasil undian',
      historyTitle: 'Riwayat undian',
      historyColumns: ['Tanggal', 'Stake', 'Hasil', 'Verifikasi'],
      emptyHistory: 'Belum ada riwayat undian',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana cara menjadi eligible?',
            a: 'Stake atau Bond pertama hari itu sebesar ≥ $5,000 secara otomatis memberi kelayakan hari itu. Satu kelayakan per alamat per hari.',
          },
          {
            q: 'Bagaimana undian diselesaikan?',
            a: 'Pada 00:00 UTC, Chainlink VRF v2 menghasilkan randomness yang dapat diverifikasi; kontrak memilih hingga 10 pemenang dari daftar hari itu untuk berbagi pool (target pool harian ≥ $5,000).',
          },
          {
            q: 'Bagaimana memverifikasi keadilan?',
            a: 'Randomness VRF menyertakan bukti on-chain. Gunakan tautan verifikasi di samping setiap hasil dan panduan verifikasi untuk menghitung ulang pemenang. Hasil tidak dapat diubah.',
          },
          {
            q: 'Bagaimana hadiah dibayar?',
            a: 'Hadiah dikonversi ke gAGX pada nilai saat undian dan terakumulasi di kartu Lucky. Klaim via aturan Mixed (kontribusi 1:1, antrean rilis atau restake).',
          },
          {
            q: 'Mengapa saya tidak eligible setelah staking $5,000?',
            a: 'Kelayakan memakai mark-to-market settlement. Jika harga bergerak sehingga stake tercatat di bawah $5,000, hari itu tidak ada kelayakan. Sisakan buffer.',
          },
          {
            q: 'Apakah staking fleksibel memberi kelayakan undian?',
            a: 'Ya. Staking fleksibel (liquidStake) juga mencatat kelayakan hari itu jika jumlah satu transaksi mencapai ambang; kelayakan dinilai per transaksi, bukan akumulasi. Jika batas harian mencegah satu transaksi mencapai ambang, transaksi itu tidak mendapat kelayakan.',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'Data',
      totalRewards: 'Total hadiah',
      myPosition: 'Posisi saya',
      directCount: 'Detail referral langsung',
      contribution: 'Poin kontribusi saya',
      contributionHint: 'Klaim hadiah mengonsumsi 1:1',
      nextPayout: 'Pembayaran hadiah berikutnya',
      recordsTitle: 'Catatan hadiah referral',
      recordsColumns: ['Waktu', 'Jumlah', 'Status', 'Diklaim pada'],
      emptyRecords:
        'Belum ada catatan hadiah. Setelah hadiah diterbitkan, setiap catatan akan tampil di sini.',
      referralsTitle: 'Referral saya',
      referralsColumns: ['Bergabung', 'Alamat', 'Posisi', 'Reward referral kumulatif'],
      emptyReferrals:
        'Belum ada mitra referral langsung. Bagikan tautan undangan Anda; mitra akan tampil di sini setelah bergabung.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana reward referral dihitung?',
            a: 'Anda mendapat 10% dari setiap yield Rebase referral langsung, settle on-chain dan terakumulasi di kartu Referral.',
          },
          {
            q: 'Apa syarat mendapatkan hadiah partisipasi?',
            a: 'Nilai posisi staking/bond Anda harus tetap di atas $100. Setelah syarat terpenuhi, yield Rebase dari referral langsung Anda akan menambah bagian Anda.',
          },
          {
            q: 'Mengapa tidak ada hadiah padahal posisi saya menampilkan $100?',
            a: 'Harga AGX berfluktuasi; saat settlement posisi Anda bisa tercatat $99.99 dan tidak memenuhi ambang. Pertahankan buffer.',
          },
          {
            q: 'Jika referral saya memegang jauh lebih besar dari saya, apakah saya tetap mendapat 10% penuh?',
            a: 'Ya. Memenuhi syarat >$100 memberi Anda 10% penuh dari yield Rebase mereka, terlepas dari selisih ukuran posisi.',
          },
          {
            q: 'Bagaimana cara mengklaim hadiah referral?',
            a: 'Gunakan panel kiri untuk mengatur klaim vs restake: bagian yang diklaim masuk kolam rilis sesuai periode; restake masuk staking token tunggal. Keduanya mengonsumsi poin kontribusi 1:1 (DaoPool Mixed).',
          },
          {
            q: 'Apa itu jumlah referral langsung?',
            a: 'Wallet yang terikat lewat tautan undangan Anda dan menyelesaikan partisipasi pertama. Hanya lapisan pertama yang dihitung.',
          },
          {
            q: 'Apakah hadiah referral tetap ada setelah mitra keluar?',
            a: 'Hadiah referral terkait posisi aktif yang direferensikan: berlanjut selama posisi menghasilkan; berhenti setelah keluar penuh. Jumlah yang sudah diperoleh tidak terpengaruh.',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'Data',
      totalRewards: 'Total hadiah',
      myPosition: 'Posisi saya',
      contribution: 'Poin kontribusi saya',
      contributionHint: 'Klaim hadiah mengonsumsi 1:1',
      nextPayout: 'Pembayaran hadiah berikutnya',
      recordsTitle: 'Catatan hadiah partisipasi',
      recordsColumns: ['Waktu', 'Jumlah', 'Status', 'Diklaim pada'],
      emptyRecords:
        'Belum ada catatan hadiah. Setelah hadiah diterbitkan, setiap catatan akan tampil di sini.',
      inviterTitle: 'Pereferensi saya',
      inviterColumns: ['Waktu binding', 'Alamat', 'Posisi', 'Hadiah kumulatif yang dibawa'],
      emptyInviter:
        'Belum ada ikatan pereferensi. Setelah mengikat via tautan undangan, pereferensi akan tampil di sini.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Dari mana hadiah partisipasi berasal?',
            a: 'Setelah Anda binding lewat tautan undangan referrer dan bergabung co-build, Anda mendapat hadiah partisipasi dari hubungan itu, settle on-chain dan terakumulasi di kartu Partisipasi.',
          },
          {
            q: 'Bagaimana hadiah partisipasi dihitung?',
            a: 'Anda mendapat 10% yield Rebase referrer pada porsi yang setara ukuran posisi Anda. Contoh: Anda pegang $10,000 dan referrer $1,000 — seluruh posisi mereka dalam jangkauan match, jadi Anda dapat 10% seluruh Rebase mereka; jika mereka pegang $20,000, Anda hanya dapat 10% dari porsi $10,000 yang match.',
          },
          {
            q: 'Apa syarat mendapatkan hadiah partisipasi?',
            a: 'Binding lewat tautan undangan referrer, dan jaga nilai posisi staking/bond di atas $100.',
          },
          {
            q: 'Mengapa tidak ada hadiah padahal posisi saya menampilkan $100?',
            a: 'Harga AGX berfluktuasi; saat settlement posisi Anda bisa tercatat $99.99 dan tidak memenuhi ambang. Pertahankan buffer.',
          },
          {
            q: 'Bagaimana cara mengklaim hadiah partisipasi?',
            a: 'Gunakan panel kiri untuk mengatur klaim vs restake: bagian yang diklaim masuk kolam rilis sesuai periode; restake masuk staking token tunggal. Keduanya mengonsumsi poin kontribusi 1:1 (DaoPool Mixed).',
          },
          {
            q: 'Bisakah pereferensi diganti?',
            a: 'Tidak. Hubungan referral ditulis on-chain saat ikatan pertama dan berlaku permanen; pereferensi tidak dapat diganti.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'Data',
      totalRewards: 'Total hadiah',
      totalPerformance: 'Total kinerja',
      myPosition: 'Posisi saya',
      directCount: 'Detail referral langsung',
      contribution: 'Poin kontribusi saya',
      contributionHint: 'Klaim hadiah mengonsumsi 1:1',
      nextPayout: 'Pembayaran hadiah berikutnya',
      tierTitle: 'Level Bangun Bersama',
      tierCurrent: 'Level saat ini',
      tierNext: 'Level berikutnya',
      reqHolding: 'Kepemilikan pribadi',
      reqHoldingHint: 'Nilai posisi staking dan Bond',
      reqAccounts: 'Akun aktif',
      reqAccountsHint: 'Alamat referral langsung aktif',
      reqPerformance: 'Total kinerja',
      reqPerformanceHint: 'Total nilai posisi seluruh jaringan referral',
      reqAchieved: 'Tercapai',
      recordsTitle: 'Catatan hadiah',
      recordsTabsAria: 'Jenis catatan hadiah',
      recordsTabCobuild: 'Bangun Bersama',
      recordsTabEqualize: 'Hadiah equalize',
      recordsColumns: ['Waktu', 'Tingkat', 'Jumlah', 'Status', 'Diklaim pada'],
      emptyRecordsCobuild:
        'Belum ada catatan hadiah. Setelah hadiah diterbitkan, setiap catatan akan tampil di sini.',
      emptyRecordsEqualize: 'Belum ada catatan equalize. Akan tampil di sini setelah diterbitkan.',
      directsTitle: 'Detail referral langsung',
      directsColumns: ['Bergabung', 'Alamat', 'Posisi', 'Tingkat'],
      emptyDirects:
        'Belum ada mitra referral langsung. Bagikan tautan undangan Anda; mitra akan tampil di sini setelah bergabung.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana hadiah co-build dihitung?',
            a: 'Hadiah co-build berasal dari yield Rebase tim dan dibayar sesuai rasio bonus tingkat Anda (A1 10% hingga A13 130%). Lihat tabel mekanisme co-build di hub.',
          },
          {
            q: 'Apa itu hadiah equalize (pingyue)?',
            a: 'Saat tim downline menyamai atau melampaui tingkat Anda, hadiah co-build mereka tidak lagi masuk diferensial Anda. Equalize memberi Anda 10% hadiah co-build downline itu sebagai kompensasi.',
          },
          {
            q: 'Apakah equalize punya batas tingkat?',
            a: 'Ya. Equalize hanya mencakup downline dalam dua tingkat di atas Anda. Contoh: di A2 Anda bisa equalize A3/A4; A5+ di luar jangkauan sampai Anda naik tingkat.',
          },
          {
            q: 'Bagaimana cara naik tingkat co-build?',
            a: 'A1–A5 memakai holding pribadi, akun aktif, dan volume tim. Dari A6, promosi memakai aturan dual-leg (dua jalur mana pun di tingkat yang disyaratkan); A6–A9 juga memungkinkan jalur single-leg plus volume jalur lain.',
          },
          {
            q: 'Bagaimana kinerja tim dihitung?',
            a: 'Kinerja tim adalah nilai mark-to-market posisi staking dan bond di seluruh pohon referral Anda pada saat settlement.',
          },
          {
            q: 'Bagaimana mengklaim hadiah co-build dan equalize?',
            a: 'Gunakan panel kiri untuk membagi klaim vs restake: klaim masuk antrean rilis; restake masuk staking aset tunggal. Keduanya mengonsumsi poin kontribusi 1:1. Riwayat equalize ada di tab Catatan hadiah di kanan.',
          },
          {
            q: 'Kapan rasio bonus level baru berlaku?',
            a: 'Level dievaluasi ulang saat penyelesaian harian. Pembayaran Bangun Bersama berikutnya memakai rasio baru; cakupan equalize juga diperbarui dengan level baru.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: 'Menunggu persetujuan',
      pendingHint: 'Pindah ke dapat diklaim setelah disetujui',
      pendingBody: 'Hubungi dukungan untuk membuka tunjangan; klaim hanya setelah disetujui.',
      contactSupport: 'Hubungi dukungan untuk membuka',
      claimIntoWallet: 'Ke dompet',
      ctaToWallet: 'Klaim {amount} ke dompet',
      dataTitle: 'Data',
      tier: 'Level Bangun Bersama',
      totalClaimed: 'Total hadiah diklaim',
      recordsTitle: 'Catatan tunjangan',
      recordsTabsAria: 'Jenis catatan tunjangan',
      recordsTabIssue: 'Diterbitkan',
      recordsTabClaim: 'Diklaim',
      issueColumns: [
        'Waktu penerbitan',
        'Jumlah',
        'Tipe',
        'Hash',
        'Rasio tunjangan',
        'Jumlah tunjangan',
      ],
      claimColumns: ['Diklaim pada', 'Jumlah', 'Hash'],
      emptyIssue: 'Belum ada catatan penerbitan. Akan tampil setelah tunjangan terakumulasi.',
      emptyClaim: 'Belum ada catatan klaim. Akan tampil setelah Anda klaim.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Apa itu tunjangan pengembangan?',
            a: 'Dana khusus untuk membantu co-builder memperluas pasar—promosi, acara komunitas, saluran—terakumulasi sesuai posisi staking tim.',
          },
          {
            q: 'Untuk apa tunjangan dapat digunakan?',
            a: 'Hanya pengembangan pasar: salon & roadshow offline, operasi komunitas, materi promo, ekspansi saluran.',
          },
          {
            q: 'Bagaimana cara menggunakan tunjangan?',
            a: 'Dua jalur: ajukan sebelum belanja (kirim rencana & anggaran ke support; jumlah yang disetujui menjadi dapat diklaim), atau reimbursement setelahnya dengan bukti & kwitansi.',
          },
          {
            q: 'Mengapa tunjangan saya berstatus menunggu persetujuan?',
            a: 'Tunjangan yang terakumulasi mulai pending sampai Anda kirim rencana penggunaan atau bukti reimbursement dan support menyetujui. Progres terlihat di catatan tunjangan.',
          },
          {
            q: 'Apakah klaim tunjangan mengonsumsi poin kontribusi?',
            a: 'Tidak. Berbeda dari hadiah lain: tunjangan pengembangan tidak mengonsumsi poin kontribusi dan tidak melalui antrean rilis—gAGX langsung ke dompet Anda.',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: 'Hadiah Bangun Bersama',
      pageSubtitle: 'Ikut Bangun Bersama · berbagi nilai pertumbuhan',
      claimToWallet: 'Klaim ke dompet',
      tierColumns: ['Tingkat', 'Langganan pribadi', 'Kinerja sistem', 'Rasio hadiah'],
      recordsTabsAria: 'Jenis catatan hadiah Genesis',
      recordsColumns: ['Waktu', 'Tipe', 'Jumlah', 'Status'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana reward referral dihitung?',
            a: 'Hadiah referral 3% dengan settlement setara terkompresi—hanya jumlah yang match dihitung; akun kosong melewati lapisan hadiah; pembayaran settle otomatis.',
          },
          {
            q: 'Bagaimana naik tingkat Genesis?',
            a: 'Naik bertahap dari S1 ke S10 berdasarkan jumlah co-build pribadi dan kinerja organisasi.',
          },
          {
            q: 'Apa itu hadiah kenaikan tingkat?',
            a: 'Hadiah tingkat settle sebagian volume co-build tim sesuai tingkat Genesis Anda dan diklaim ke wallet lewat tanda tangan RewardClaimer.',
          },
          {
            q: 'Bagaimana hadiah tim Genesis diselesaikan?',
            a: 'Hadiah referral langsung otomatis ke dompet; hadiah level dan dana pengembangan diklaim via tanda tangan RewardClaimer / CommunityFund.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Dalam bentuk apa hadiah dibayar?',
          a: 'Sebagian besar hadiah ditampilkan dalam AGX / gAGX; hadiah co-build genesis mengikuti aset RewardClaimer. Klaim Mixed mengirim porsi rilis ke antrean rilis.',
        },
        {
          q: 'Apa syarat untuk mengklaim?',
          a: 'Klaim bertanda tangan sederhana butuh saldo dapat diklaim dan tanda tangan valid. Lucky / DaoPool Mixed juga butuh poin kontribusi cukup serta pembagian rilis/restake.',
        },
        {
          q: 'Kapan hadiah yang diklaim masuk?',
          a: 'Setelah transaksi on-chain dikonfirmasi. Porsi rilis terbuka sepanjang periode yang dipilih; porsi restake masuk posisi staking terkait.',
        },
        {
          q: 'Kapan hadiah di-settle?',
          a: 'Setiap sumber settle menurut kontrak dan aturan scan backend. Frontend memakai saldo dapat diklaim dan payload bertanda tangan sebagai sumber kebenaran.',
        },
        {
          q: 'Mengapa beberapa kartu hadiah tidak menampilkan jumlah?',
          a: 'Sesi belum terhubung atau belum masuk dengan tanda tangan menampilkan petunjuk masuk, bukan berarti tanpa hadiah. Setelah masuk, — berarti belum ada yang dapat diklaim atau data belum siap.',
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
    cobuildLevel: 'Level Bangun Bersama',
    inviteTitle: 'Mulai mengundang · bagikan nilai pertumbuhan ekosistem',
    programs: {
      title: 'Program dukungan ekosistem',
      items: [
        {
          label: 'Pembangunan Bersama Genesis · Fase {season}',
          title: 'Program Gubernur Cadangan Genesis',
          body: 'Kursi pembangunan bersama global pertama dibuka',
          action: 'Lihat detail program',
          href: 'https://xdaoaegis.notion.site/program-dewan-cadangan-genesis',
        },
        {
          label: 'Akademi X',
          title: 'Akademi DeFi Global · Akademi Kepemimpinan Global Era Ekonomi Digital',
          body: 'Mencetak pemimpin untuk zaman · Menyimpan talenta untuk masa depan',
          action: 'Lihat detail program',
          href: 'https://xdaoaegis.notion.site/akademi-x-id',
        },
      ],
    },
    myInvites: 'Anggota komunitas saya ({count})',
    referralBondPermanent: 'Hubungan referral aktif · ikatan bersifat permanen.',
    volumePrefix: 'Kinerja',
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
    title: 'Aset',
    intro: 'Kelola dana ekosistem AEGIS X Anda',
    body: 'Kelola dana ekosistem AEGIS X Anda',
    backToHub: 'Kembali ke Aset',
    blocked: {
      zeroAmount: 'Masukkan jumlah yang valid',
      insufficientReward: 'Hasil yang dapat diklaim tidak cukup',
      insufficientContribution: 'Poin kontribusi tidak cukup — bakar AGX dulu',
      planUnresolved: 'Rencana rilis/restake belum siap — coba lagi nanti',
      nothingToRedeem: 'Tidak ada kuota yang dapat ditebus',
      warmupActive: 'Pemanasan belum selesai, belum dapat dioperasi',
      warmupNotEnded: 'Hitung mundur pemanasan belum berakhir',
      noWarmup: 'Tidak ada posisi pemanasan untuk diaktifkan',
      unavailable: 'Transaksi sementara tidak tersedia',
    },
    position: {
      sort: 'Urutkan',
      quoteCurrency: 'Mata uang kuotasi',
      sortOptions: {
        startNear: 'Waktu mulai · terbaru dulu',
        startFar: 'Waktu mulai · terlama dulu',
        endNear: 'Jatuh tempo · terdekat dulu',
        endFar: 'Jatuh tempo · terjauh dulu',
      },
      emptyTitle: 'Mulai hasilkan dari aset Anda',
      pageSize: 5,
      voucher: 'Bukti',
      remaining: 'Sisa waktu',
      staked: 'Jumlah staking',
      payout: 'Menunggu tebus',
      bondPrincipal: 'Pokok Bond',
      yield: 'Hasil',
      claim: 'Klaim',
      redeem: 'Tebus',
      unlock: 'Buka',
      unstake: 'Lepas stake',
      liquid: 'Fleksibel',
      lockedPrefix: 'Terkunci',
      redeemAnytime: 'Dapat ditebus kapan saja',
      activateWarmup: 'Aktifkan pemanasan',
      activateWarmupSuccess: 'Pemanasan diaktifkan',
      warmupRemainingEpochs: 'Sisa {n} Epoch',
    },
    opsColumns: ['Waktu', 'Aksi', 'Jumlah', 'Hash tx'],
    claim: {
      title: 'Klaim hasil',
      amount: 'Jumlah klaim',
      splitAria: 'Rasio rilis vs restake',
      releaseShare: 'Klaim {pct}%',
      restakeShare: 'Investasikan ulang {pct}%',
      releasePeriod: 'Pilihan periode rilis',
      releasePeriodAria: 'Pilihan periode rilis',
      restakePeriod: 'Pilihan periode restake',
      restakePeriodAria: 'Pilihan periode restake',
      releaseDays: '{days} hari',
      restakeDays: '{days} hari',
      restakeDaysTax: '{days} hari · {tax}',
      taxRate: 'pajak {rate}%',
      contribNeed: 'Klaim ini memotong kontribusi {amount}',
      contribShort: 'Kontribusi tidak cukup — bakar AGX untuk poin dulu',
      goBurn: 'Pergi ke Bakar',
      ctaMixed: 'Klaim & Restake',
      ctaRelease: 'Klaim',
      ctaRestake: 'Investasikan ulang',
      success: 'Klaim dikirim',
      xmineSuccess: 'Klaim hadiah X dikirim',
    },
    redeem: {
      badge: 'Tebus',
      releasedLabel: 'Dirilis',
      title: 'Konfirmasi tebus',
      body: 'Setelah tebus, pokok masuk splitter untuk rilis linear (~{days} hari). Tanpa yield; tidak langsung ke wallet.',
      confirm: 'Konfirmasi masuk buffer',
      confirmCta: 'Tebus {amount}',
      cancel: 'Batal',
      success: 'Tebus dikirim — pokok masuk buffer rilis',
    },
    hub: {
      filterAria: 'Filter aset',
      hideZero: 'Sembunyikan aset 0',
      hideZeroEmpty: 'Belum ada posisi non-nol',
      card: {
        position: 'Posisi',
        yield: 'Total hasil',
      },
      modes: {
        stake: {
          title: 'Stake',
          body: 'Kelola posisi AGX fleksibel/berjangka',
          aprHint:
            'Hasil mencakup bonus Rebase dan bunga majemuk; hanya hasil belum diklaim di posisi',
        },
        lpbond: {
          title: 'Bond LP',
          body: 'Kelola posisi Bond likuiditas',
          aprHint: 'Hasil mencakup bunga majemuk; hanya hasil belum diklaim di posisi',
        },
        burnbond: {
          title: 'Bond Burn',
          body: 'Kelola posisi Burn Bond',
          aprHint: 'Hasil mencakup bunga majemuk; hanya hasil belum diklaim di posisi',
        },
        xmine: {
          title: 'Penambangan X',
          body: 'Kelola posisi mining gAGX',
          aprHint: 'Hasil adalah output mining belum diklaim di posisi',
        },
      },
      overview: {
        title: 'Ikhtisar aset',
        totalValue: 'Total nilai aset',
        totalValueHint:
          'Mark-to-market pokok + yield belum diklaim; menampilkan — jika belum ada kuotasi lintas produk',
        claimable: 'Hasil yang dapat diklaim',
        claimed: 'Total sudah diklaim',
        contribution: 'Poin kontribusi saya',
        contributionHint: 'Klaim hasil mengonsumsi 1:1',
        holdingsTitle: 'Kepemilikan',
        holdingsReleased: 'Dirilis',
        holdingsTotal: 'Total kepemilikan',
        bufferTitle: 'Pool buffer',
        bufferTotal: 'Total',
        bufferReleased: 'Dirilis',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'Ganti tampilan aset buffer',
      },
      distribution: {
        title: 'Distribusi kepemilikan',
        empty:
          'Belum ada kepemilikan. Setelah staking atau beli Bond, distribusi akan tampil di sini.',
      },
      rebase: {
        title: 'Mekanisme rilis hasil Rebase',
        subtitle:
          'Settlement bertahap dan rilis berkelanjutan mengurangi volatilitas serta mendukung pertumbuhan jangka panjang',
        steps: [
          { title: 'Block', body: 'Runtime blok\\nUnit dasar' },
          { title: 'Epoch', body: '~14.400 blok\\n~12 jam' },
          { title: 'Rebase', body: 'Akhir Epoch\\nSettle otomatis' },
          { title: 'Rebase', body: 'Distribusi yield\\nDua kali sehari' },
        ],
        tags: [
          'Dijalankan oleh blok',
          'Settlement Epoch',
          'Distribusi Rebase',
          'Rilis hasil yang mulus',
        ],
        footer: 'Blok menggerakkan siklus; Epoch menyelesaikan; Rebase mendistribusikan hasil',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana nilai total aset dihitung?',
            a: 'Jumlah valuasi pokok produk dan yield belum diklaim; menampilkan — jika belum ada kuotasi lintas produk. Saldo wallet menganggur tidak dihitung.',
          },
          {
            q: 'Dalam bentuk apa yield dibayar?',
            a: 'Yield Rebase staking/bond dalam gAGX; output X Mine adalah X.',
          },
          {
            q: 'Mengapa saya tidak bisa mengklaim yield?',
            a: 'Klaim Mixed mengonsumsi kontribusi; jika kurang, bakar AGX dulu untuk poin lalu klaim.',
          },
          {
            q: 'Bagaimana mendapatkan poin kontribusi?',
            a: 'Beli dan bakar AGX; klaim mengonsumsi kontribusi 1:1.',
          },
          {
            q: 'Mengapa harus memilih periode rilis saat mengklaim?',
            a: 'Yield yang diklaim masuk antrean rilis dan terbuka secara linear; periode lebih panjang biasanya pajak lebih rendah.',
          },
          {
            q: 'Ke mana yield yang diklaim pergi?',
            a: 'Tidak langsung ke wallet — masuk RewardQueue / kolam rilis; klaim jumlah yang sudah vested di halaman Rilis.',
          },
          {
            q: 'Apa beda restake dan klaim?',
            a: 'Restake dapat mengarahkan yield ke staking restake; klaim terbuka sepanjang periode rilis yang dipilih.',
          },
          {
            q: 'Apa itu pool buffer?',
            a: 'Setelah unstake, pokok masuk splitter untuk rilis linear berkala (AGX atau gAGX).',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Posisi staking',
        intro: 'Kelola setiap staking — klaim hasil atau tebus pokok kapan saja',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'Data posisi',
          metrics: [
            { label: 'Posisi saya' },
            { label: 'Dirilis' },
            { label: 'Menunggu rilis' },
            { label: 'Yield Rebase saat ini' },
            { label: 'Bonus Rebase saat ini' },
            { label: 'Total yield staking' },
          ],
        },
        ops: { title: 'Catatan operasi', empty: 'Belum ada catatan aktivitas' },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Apa beda klaim dan tebus?',
              a: 'Klaim menangani yield (opsional restake); tebus mengirim pokok ke buffer rilis.',
            },
            {
              q: 'Mengapa setiap posisi staking ditampilkan terpisah?',
              a: 'Setiap posisi dihitung bunga dan progres rilis sendiri, memudahkan klaim atau tebus per posisi.',
            },
            {
              q: 'Apa arti yang sudah dirilis?',
              a: 'Bagok yang dapat ditebus setelah posisi berkala jatuh tempo.',
            },
            {
              q: 'Apa yang terjadi saat countdown berakhir?',
              a: 'Setelah sisa waktu nol, posisi masuk status dapat ditebus/dioperasikan; status on-chain yang berlaku.',
            },
            {
              q: 'Bagaimana rasio restake saat klaim?',
              a: 'Gunakan slider untuk membagi rasio rilis vs restake, pilih periode, lalu konfirmasi.',
            },
          ],
        },
      },
      lpbond: {
        title: 'Posisi LP Bond',
        intro: 'Kelola setiap Bond — klaim hasil atau tebus pokok kapan saja',
        empty: 'Belum ada posisi LP Bond. Setelah membeli Bond, setiap posisi akan tampil di sini.',
        emptyCta: 'Beli LP Bond pertama untuk mulai menghasilkan',
        stats: {
          title: 'Data posisi',
          metrics: [
            { label: 'Posisi saya' },
            { label: 'Dirilis' },
            { label: 'Menunggu rilis' },
            { label: 'Yield Rebase saat ini' },
            { label: 'Total yield Bond LP' },
          ],
        },
        ops: {
          title: 'Catatan operasi',
          empty:
            'Belum ada catatan operasi. Setelah staking, klaim, atau tebus, setiap operasi akan tampil di sini.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Apa beda klaim dan tebus?',
              a: 'Klaim untuk yield: keluarkan yield gAGX bond sesuai periode rilis atau restake langsung; tebus untuk pokok: ambil pokok AGX yang sudah dirilis, masuk buffer 30 hari lalu ke wallet.',
            },
            {
              q: 'Dari mana pokok bond berasal?',
              a: 'USD1 yang dibayar untuk Bond LP dikonversi ke AGX dengan diskon — itulah pokok bond. Terbuka linear selama 180/360/540 hari; jumlah yang sudah dirilis dapat ditebus kapan saja.',
            },
            {
              q: 'Mengapa setiap bond ditampilkan terpisah?',
              a: 'Setiap bond menghitung periode, diskon, yield, dan progres rilis sendiri, jadi ditampilkan dan dioperasikan per posisi.',
            },
            {
              q: 'Bisakah yield bond di-restake?',
              a: 'Ya. Saat klaim, bagi rilis vs restake; restake masuk staking aset tunggal (360/540) dengan pajak lebih baik daripada klaim periode.',
            },
            {
              q: 'Apa yang terjadi saat countdown berakhir?',
              a: 'Countdown berakhir berarti rilis pokok selesai; Anda dapat menebus seluruh pokok kapan saja. Yield yang belum diklaim tidak hilang dan tetap berbunga majemuk.',
            },
            {
              q: 'Bisakah LP dari LP Bond ditarik?',
              a: 'Tidak. LP AGX/USD1 dikunci permanen ke alamat bakar sebagai likuiditas protokol; Anda memegang pokok AGX diskon beserta hasilnya.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Posisi Burn Bond',
        intro: 'Kelola setiap Bond — klaim hasil atau tebus pokok kapan saja',
        empty:
          'Belum ada posisi Burn Bond. Setelah membeli Bond, setiap posisi akan tampil di sini.',
        emptyCta: 'Beli Burn Bond pertama untuk mulai menghasilkan',
        stats: {
          title: 'Data posisi',
          metrics: [
            { label: 'Posisi saya' },
            { label: 'Dirilis' },
            { label: 'Menunggu rilis' },
            { label: 'Yield Rebase saat ini' },
            { label: 'Total yield Bond Burn' },
          ],
        },
        ops: {
          title: 'Catatan operasi',
          empty:
            'Belum ada catatan operasi. Setelah staking, klaim, atau tebus, setiap operasi akan tampil di sini.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Apa beda klaim dan tebus?',
              a: 'Klaim untuk yield: keluarkan yield gAGX bond sesuai periode rilis atau restake langsung; tebus untuk pokok: ambil pokok AGX yang sudah dirilis, masuk buffer 30 hari lalu ke wallet.',
            },
            {
              q: 'Dari mana pokok bond berasal?',
              a: 'Saat membeli Bond Burn, USD1 yang Anda bayar dikonversi ke AGX dengan diskon — itulah pokok bond. Pokok dirilis linear per blok selama 180/360/540 hari; bagian yang sudah dirilis dapat ditebus kapan saja.',
            },
            {
              q: 'Mengapa setiap bond ditampilkan terpisah?',
              a: 'Setiap bond menghitung periode, diskon, yield, dan progres rilis sendiri, jadi ditampilkan dan dioperasikan per posisi.',
            },
            {
              q: 'Bisakah yield bond di-restake?',
              a: 'Ya. Saat klaim, bagi rilis vs restake; restake masuk staking aset tunggal (360/540) dengan pajak lebih baik daripada klaim periode.',
            },
            {
              q: 'Apa yang terjadi saat countdown berakhir?',
              a: 'Countdown berakhir berarti rilis pokok selesai; Anda dapat menebus seluruh pokok kapan saja. Yield yang belum diklaim tidak hilang dan tetap berbunga majemuk.',
            },
            {
              q: 'Apa dampak Burn Bond terhadap AGX?',
              a: 'Dana pembelian Burn Bond otomatis membeli AGX dan membakarnya permanen ke alamat mati — mengurangi pasokan beredar dan memperkuat deflasi, sementara Anda mendapat pokok diskon dan hasil.',
            },
          ],
        },
      },
      xmine: {
        title: 'Posisi X Mine',
        intro: 'Kelola setiap staking mining — klaim output atau tebus pokok kapan saja',
        empty:
          'Belum ada posisi X Mine. Setelah staking gAGX untuk mining, setiap posisi akan tampil di sini.',
        emptyCta: 'Staking gAGX untuk menambang X',
        periodPill: 'Staking mining',
        output: 'Hasil',
        stats: {
          title: 'Data posisi',
          metrics: [
            { label: 'Staking mining saya' },
            { label: 'Dirilis' },
            { label: 'Output mining saat ini' },
            { label: 'Total output mining' },
          ],
        },
        ops: {
          title: 'Catatan operasi',
          empty:
            'Belum ada catatan operasi. Setelah staking, klaim, atau tebus, setiap operasi akan tampil di sini.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Apa beda klaim output dan tebus staking?',
              a: 'Klaim untuk output mining: reward X dapat diklaim kapan saja tanpa periode rilis, langsung ke wallet. Tebus untuk pokok staking: gAGX masuk buffer dan dirilis linear 30 hari; aset di buffer tidak lagi menghasilkan.',
            },
            {
              q: 'Mengapa beberapa posisi menampilkan Terkunci?',
              a: 'Setiap staking gAGX masuk kunci 24 jam; tidak dapat ditebus selama kunci. Setelah countdown, menampilkan Dapat ditebus kapan saja.',
            },
            {
              q: 'Bagaimana output mining dihitung?',
              a: 'Settle harian pada UTC 0 dengan standar emas: nilai USD gAGX yang di-stake × tingkat harian, dibayar dalam X. Jumlah berubah mengikuti harga AGX dan X.',
            },
            {
              q: 'Apakah output mining berbunga majemuk?',
              a: 'Tidak otomatis. Klaim X secara manual; untuk memperbesar posisi mining, stake gAGX tambahan (terbatas kuota).',
            },
            {
              q: 'Mengapa kuota staking saya berubah?',
              a: 'Kuota stake gAGX tidak melebihi holding Bond AGX ≥180 hari plus total stake AGX. Tambah bond/staking jangka panjang untuk menaikkan kuota; jatuh tempo menurunkan kuota.',
            },
            {
              q: 'Apakah masih dapat output setelah tebus?',
              a: 'Tidak. gAGX yang ditebus berhenti menghasilkan output mining sejak masuk buffer; posisi yang belum ditebus tetap menghasilkan normal.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Stake',
    intro: 'Staking dan Bond Bangun Bersama — berbagi pertumbuhan Rebase berbunga majemuk',
    body: 'Staking dan Bond Bangun Bersama — berbagi pertumbuhan Rebase berbunga majemuk',
    backToHub: 'Kembali ke Staking',
    amount: 'Jumlah',
    balance: 'Saldo',
    max: 'MAKS',
    capUnlimited: 'Tidak terbatas',
    viewContract: 'Lihat kontrak',
    blocked: {
      notBound: 'Ikat referral dulu',
      accountMigrated: 'Alamat ini sudah dimigrasi — gunakan alamat baru',
      migrationNotOpen: 'Migrasi akun belum dibuka',
      insufficientBalance: 'Saldo tidak cukup',
      insufficientGagx: 'gAGX tidak cukup — bungkus via Flash dulu',
      insufficientAllowance: 'Allowance tidak cukup',
      insufficientQuota: 'Kuota tidak cukup',
      poolPaused: 'Pool staking ini dijeda',
      depositoryNotAuth: 'Depository Bond tidak diotorisasi',
      insufficientDebtCapacity: 'Sisa kapasitas Bond tidak cukup',
      zeroAmount: 'Masukkan jumlah yang valid',
      unavailable: 'Transaksi sementara tidak tersedia — coba lagi nanti',
    },
    hub: {
      modes: {
        stake: {
          title: 'Stake',
          body: 'Staking AGX — Rebase 2× sehari dengan bunga majemuk',
        },
        lpbond: {
          title: 'Bond LP',
          body: 'Bangun pool dengan USD1 — dapatkan AGX dengan diskon',
        },
        burnbond: {
          title: 'Bond Burn',
          body: 'Cetak AGX dengan diskon dan bakar permanen untuk deflasi',
        },
        xmine: {
          title: 'Penambangan X',
          body: 'Staking gAGX untuk menambang hadiah ekosistem X tanpa rugi',
        },
        calc: {
          title: 'Kalkulator hasil',
          body: 'Estimasi hasil di berbagai periode dan harga',
        },
      },
      overview: {
        title: 'Ikhtisar',
        metrics: [
          {
            id: 'tvl',
            label: 'TVL total staking',
            hint: 'Total AGX yang di-stake di protokol dan perkiraan nilai USD-nya',
          },
          {
            id: 'mcap',
            label: 'Kapitalisasi pasar',
            hint: 'Total nilai AGX yang beredar di pasar',
          },
          {
            id: 'circulating',
            label: 'Sirkulasi AGX',
            hint: 'Jumlah AGX yang sedang beredar di pasar',
          },
          {
            id: 'treasury',
            label: 'Cadangan think tank',
            hint: 'Aset cadangan think tank mendukung minting berjaminan, market making, dan pertahanan risiko',
          },
          {
            id: 'price',
            label: 'Harga AGX',
            hint: 'Harga referensi pasar AGX terhadap USD1',
          },
          {
            id: 'burned',
            label: 'Total dibakar',
            hint: 'Total AGX yang dibakar lewat Bond Burn dan pembelian poin kontribusi',
          },
          {
            id: 'rebase',
            label: 'Yield Rebase saat ini',
            hint: 'Settle sekali per Epoch (~12 jam); menyesuaikan status protokol',
          },
          {
            id: 'runway',
            label: 'Siklus operasional',
            hint: 'Perkiraan waktu operasi berkelanjutan dari cadangan think tank vs pengeluaran protokol',
          },
          {
            id: 'stakers',
            label: 'Jumlah alamat staker',
            hint: 'Total alamat unik yang ikut staking',
          },
        ],
      },
      periodTable: {
        title: 'Periode & hasil staking',
        segmentAria: 'Ganti produk tabel periode',
        segs: {
          stake: 'Stake',
          lpbond: 'Bond LP',
          burnbond: 'Bond Burn',
        },
        columns: ['Periode estimasi', 'Hasil dasar (harian)', 'Bonus hasil', 'Hasil periode'],
        rows: [
          { id: 'liquid', period: 'Fleksibel (berjangka)' },
          { id: '180', period: '180 hari' },
          { id: '360', period: '360 hari' },
          { id: '540', period: '540 hari' },
        ],
      },
      runwayUnknown: '—',
      chart: {
        title: 'Metrik',
        metricTabs: {
          tvl: 'TVL total staking',
          mcap: 'Kapitalisasi pasar',
        },
        metricAria: 'Ganti metrik',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Bagaimana Rebase di-settle?',
            a: 'Protokol berjalan berbasis blok: ~14.400 blok = 1 Epoch (~12 jam). Rebase settle di akhir setiap Epoch — dua kali sehari.',
          },
          {
            q: 'Bagaimana pokok dirilis?',
            a: 'Pokok staking dan bond memakai rilis linear tingkat blok (~3 dtk per blok). Setelah penarikan, pokok yang dirilis masuk buffer 30 hari agar aliran lebih mulus.',
          },
          {
            q: 'Apa beda Staking, Bond LP, dan Bond Burn?',
            a: 'Staking menyetor AGX untuk Rebase berbunga majemuk. Bond LP dan Burn memakai USD1 untuk AGX diskon — LP membangun likuiditas dasar permanen; Burn membakar AGX untuk deflasi. Ketiganya merilis pokok secara linear per periode dan mendapat Rebase.',
          },
          {
            q: 'Dalam bentuk apa hadiah dibayar?',
            a: 'Hadiah Rebase di semua produk settle sebagai gAGX. Tebus gAGX 1:1 ke AGX, atau stake gAGX untuk menambang X.',
          },
          {
            q: 'Apa fungsi cadangan think tank?',
            a: 'Cadangan think tank (USD1) menopang protokol: minting AGX over-collateral 150%, market making AI, dan pertahanan risiko. Siklus operasional memperkirakan waktu berkelanjutan dari cadangan vs pengeluaran.',
          },
          {
            q: 'Bagaimana memilih cara partisipasi yang cocok?',
            a: 'Ingin bunga majemuk stabil → Staking. Ingin AGX diskon → Bond LP atau Burn. Pegang gAGX untuk upside ekosistem → X Mining. Gunakan kalkulator untuk membandingkan periode dulu.',
          },
          {
            q: 'Bagaimana memahami kapitalisasi pasar dan pasokan beredar AGX?',
            a: 'Pasokan beredar adalah AGX yang beredar di pasar; kapitalisasi = pasokan beredar × harga saat ini. Bersama TVL dan total dibakar, menunjukkan rasio lock dan kemajuan deflasi.',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: 'jam', minutes: 'mnt', seconds: 'dtk' },
      overview: 'Ikhtisar',
      positions: 'Posisi saya',
      positionsHint: 'Klaim, tebus, dan unstake posisi ada di tab Aset.',
      viewPositions: 'Lihat',
      mechanism: 'Cara kerja',
      faq: 'Pertanyaan umum',
      recordsTitles: {
        stake: 'Catatan staking saya',
        lpbond: 'Catatan pembelian Bond',
        burnbond: 'Catatan pembelian Bond',
        xmine: 'Catatan mining saya',
      },
      recordColumns: ['Waktu', 'Periode estimasi', 'Jumlah', 'Dirilis', 'Hash tx'],
      bondRecordColumns: [
        'Waktu',
        'Periode estimasi',
        'Bayar',
        'Diskon',
        'AGX diterima',
        'Hash tx',
      ],
      xmineRecordColumns: ['Waktu', 'Aksi', 'Jumlah', 'Hash tx'],
      recordsEmpty: {
        stake: 'Belum ada catatan staking. Setelah staking, setiap catatan akan tampil di sini.',
        lpbond:
          'Belum ada catatan pembelian. Setelah membeli LP Bond, setiap pembelian akan tampil di sini.',
        burnbond:
          'Belum ada catatan pembelian. Setelah membeli Burn Bond, setiap pembelian akan tampil di sini.',
        xmine:
          'Belum ada catatan mining. Stake gAGX untuk mulai mining; setiap aksi akan muncul di sini.',
      },
      chartTitles: {
        stake: 'Metrik TVL (Staking)',
        lpbond: 'Metrik TVL (LP Bond)',
        burnbond: 'Metrik TVL (Burn Bond)',
        xmine: 'Metrik TVL (X Mining)',
      },
      chartRangeAria: 'Rentang waktu grafik',
      chartRanges: ['1Mgg', '1Bln', '1Thn', 'Semua'],
      chartEmpty: 'Belum ada data historis',
      positionMetrics: [
        { label: 'Posisi saya' },
        { label: 'Dirilis' },
        { label: 'Menunggu rilis' },
        { label: 'Yield Rebase saat ini' },
        { label: 'Bonus Rebase saat ini' },
      ],
      xValue: {
        title: 'Sistem nilai jangka panjang X',
        supplyLabel: 'Total penerbitan X',
        supplyValue: '210,000,000',
        badge: 'Pasokan tetap · tidak pernah inflasi',
        columns: [
          {
            pct: '47.62%',
            title: 'Pembangunan likuiditas LP',
            bullets: ['Pembangunan likuiditas awal', 'Market making & dukungan likuiditas'],
          },
          {
            pct: '52.38%',
            title: 'Hadiah & pengembangan global',
            bullets: [
              'Hadiah mining gAGX',
              'Ekspansi pasar & kemitraan merek',
              'Pembangunan ekosistem & pertumbuhan jangka panjang',
            ],
          },
        ],
      },
    },

    stake: {
      title: 'Stake',
      intro: 'Staking AGX · Rebase 2× sehari dengan bunga majemuk',
      periodLabel: 'Pilih periode staking',
      periodAria: 'Pilih periode staking',
      amountAria: 'Jumlah staking',
      amountBalance: 'Jumlah (saldo dompet {balance} AGX)',
      submit: 'Stake',
      bindCta: 'Ikat referral',
      success: 'Staking berhasil',
      periods: {
        liquid: 'Fleksibel',
        d180: '180 hari',
        d360: '360 hari',
        d540: '540 hari',
      },
      meta: {
        baseDaily: 'Hasil dasar (harian)',
        periodYield: 'Hasil periode',
        bonus: 'Bonus hasil',
        lock: 'Hari terkunci',
        remaining: 'Sisa kuota',
        contract: 'Lihat kontrak',
        lockLiquid: 'Fleksibel',
        lockDays: 'Rilis linear {days} hari',
      },
      overviewMetrics: [
        { label: 'Total di-stake' },
        { label: 'Epoch saat ini' },
        { label: 'Rebase berikutnya' },
        { label: 'Yield Rebase saat ini' },
      ],
      mechanismTitle: 'Cara kerja staking',
      mechanism:
        'Staking fleksibel masuk warmup lalu perlu diaktifkan; staking berkala dikunci di pool yang dipilih. Klaim hadiah dan keluar pokok di halaman Aset.',
      mechanismSteps: [
        {
          title: 'Stake AGX',
          body: 'Pilih fleksibel atau kunci 180/360/540 hari. Kunci lebih lama mendapat bonus Rebase lebih tinggi.',
        },
        {
          title: 'Yield Rebase harian',
          body: 'Setiap Epoch (~12 jam) settle otomatis; yield terakumulasi sebagai gAGX.',
        },
        {
          title: 'Rilis & klaim jatuh tempo',
          body: 'Pokok dirilis linear per blok; gAGX dapat ditukar 1:1 ke AGX atau lanjut staking untuk menambang X.',
        },
      ],
      faq: [
        {
          q: 'Bagaimana yield staking dihitung?',
          a: 'Rebase dua kali sehari; yield harian sekitar 0,5%–1%. Kunci lebih lama: 180h ≥10%, 360h ≥15%, 540h ≥20%, menyesuaikan faktor Rebase.',
        },
        {
          q: 'Kapan pokok staking dapat diambil?',
          a: 'Pokok dirilis linear per blok (~3 dtk); bagian yang selesai dapat diambil kapan saja; setelah diambil masuk buffer rilis 30 hari.',
        },
        {
          q: 'Apakah APY referensi tetap?',
          a: 'Tidak. APY hanya referensi; yield aktual bergerak dengan faktor Rebase, status protokol, dan penawaran/permintaan pasar.',
        },
        {
          q: 'Apa beda yield Rebase dan bonus Rebase?',
          a: 'Yield Rebase adalah bagian dari tingkat dasar dan terus berbunga majemuk tiap epoch jika belum diklaim; bonus Rebase adalah tambahan kunci jangka panjang dan tidak berbunga jika belum diklaim — klaim segera.',
        },
        {
          q: 'Dalam bentuk apa hadiah dibayar?',
          a: 'Hadiah staking dibayar sebagai gAGX. Tebus 1:1 ke AGX kapan saja, atau stake gAGX di X Mining untuk X.',
        },
        {
          q: 'Bisakah keluar sebelum jatuh tempo?',
          a: 'Tidak ada keluar dini. Pokok dirilis linear sesuai periode; hanya bagian yang sudah dirilis dapat diambil. Pilih periode yang sesuai rencana Anda.',
        },
        {
          q: 'Apa batasan staking fleksibel?',
          a: 'Staking fleksibel tidak mendapat bonus yield dan dibatasi kuota global harian serta per akun yang di-reset harian (siapa cepat dia dapat).',
        },
        {
          q: 'Bisakah satu akun punya banyak staking?',
          a: 'Ya. Setiap staking menghitung periode, hasil, dan progres rilis sendiri; lihat di 「Catatan staking saya」.',
        },
      ],
    },
    lpbond: {
      title: 'Bond LP',
      intro: 'Bangun pool dasar dengan USD1, dapatkan AGX dengan diskon',
      periodLabel: 'Pilih periode Bond',
      periodAria: 'Periode LP Bond',
      amountAria: 'Jumlah pembelian',
      amountBalance: 'Jumlah (saldo dompet {balance} USD1)',
      submit: 'Beli',
      success: 'Pembelian berhasil',
      footnote:
        'Sistem otomatis membangun LP AGX/USD1 dan membakarnya ke black hole sebagai likuiditas dasar permanen.',
      card: {
        yield: 'Hasil periode',
        discountRange: 'Rentang diskon',
        sold: 'Terjual',
        currentDiscount: 'Diskon saat ini',
        discountPrice: 'Harga diskon',
      },
      meta: {
        discount: 'Harga diskon ({pct}%)',
        slippage: 'Slippage diizinkan',
        pay: 'Bayar',
        receive: 'Terima AGX',
        cap: 'Pembelian maksimum',
        release: 'Rilis pokok',
        releaseLinear: 'Rilis linear per blok {days} hari',
        contract: 'Lihat kontrak',
      },
      overviewMetrics: [
        { label: 'TVL Bond LP' },
        { label: 'Premi bond' },
        { label: 'Pembayaran Rebase berikutnya' },
        { label: 'Yield Rebase saat ini' },
      ],
      positionMetrics: [
        { label: 'My stake' },
        { label: 'Diklaim' },
        { label: 'Menunggu rilis' },
        { label: 'Current Rebase reward' },
      ],
      mechanismTitle: 'Cara kerja LP Bond',
      mechanism:
        'USD1 di-zap lewat BondHelper ke BondDepository periode terkait. Tebus dan yield di halaman Aset.',
      mechanismSteps: [
        {
          title: 'Beli Bond LP',
          body: 'Gunakan USD1 untuk co-build pool dan mint AGX dengan diskon.',
        },
        {
          title: 'Bangun LP otomatis',
          body: 'Kontrak otomatis membangun likuiditas AGX/USD1.',
        },
        {
          title: 'Kunci blackhole permanen',
          body: 'LP Token masuk alamat blackhole, terkunci permanen.',
        },
      ],
      faq: [
        {
          q: 'Apa itu Bond LP?',
          a: 'Bayar USD1 untuk co-build pool: mint AGX diskon, bangun LP AGX/USD1 otomatis, dan bakar LP ke black hole sebagai likuiditas dasar permanen.',
        },
        {
          q: 'Bagaimana diskon ditentukan?',
          a: 'Dynamic Bond Control menyesuaikan penawaran/permintaan: 180h 85%–100%, 360h 80%–100%, 540h 75%–100% — periode lebih panjang diskon lebih baik.',
        },
        {
          q: 'Apakah saya memegang LP Token setelah membeli?',
          a: 'Tidak. LP dibakar ke blackhole. Anda menerima AGX mint diskon yang dirilis linear selama periode bond.',
        },
        {
          q: 'Apa itu premi bond?',
          a: 'Premi adalah selisih harga diskon vs harga pasar AGX. Premi positif berarti bond lebih menguntungkan daripada beli spot.',
        },
        {
          q: 'Bisakah tebus dini?',
          a: 'Tidak ada tebus dini. Pokok dirilis linear per blok; klaim bagian yang sudah dirilis kapan saja.',
        },
        {
          q: 'Ke mana USD1 yang saya bayar?',
          a: 'USD1 yang dibayar bersama AGX cetakan diskon membentuk LP AGX/USD1; LP Token lalu dibakar ke blackhole sebagai likuiditas protokol permanen.',
        },
      ],
    },
    burnbond: {
      title: 'Bond Burn',
      intro: 'Cetak AGX diskon dan bakar permanen untuk deflasi',
      periodLabel: 'Pilih periode Bond',
      periodAria: 'Periode Burn Bond',
      amountAria: 'Jumlah pembelian',
      amountBalance: 'Jumlah (saldo dompet {balance} USD1)',
      submit: 'Beli',
      success: 'Pembelian berhasil',
      footnote: 'Sistem mint AGX dengan diskon, beli otomatis, dan bakar permanen ke black hole.',
      card: {
        yield: 'Hasil periode',
        discountRange: 'Rentang diskon',
        sold: 'Terjual',
        currentDiscount: 'Diskon saat ini',
        discountPrice: 'Harga diskon',
      },
      meta: {
        discount: 'Harga diskon ({pct}%)',
        slippage: 'Slippage diizinkan',
        pay: 'Bayar',
        receive: 'Terima AGX',
        cap: 'Pembelian maksimum',
        release: 'Rilis pokok',
        releaseLinear: 'Rilis linear per blok {days} hari',
        contract: 'Lihat kontrak',
      },
      overviewMetrics: [
        { label: 'TVL Bond Burn' },
        { label: 'Premi bond' },
        { label: 'Pembayaran Rebase berikutnya' },
        { label: 'Yield Rebase saat ini' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Dirilis' },
        { label: 'Menunggu rilis' },
        { label: 'Current Rebase reward' },
      ],
      mechanismTitle: 'Cara kerja Burn Bond',
      mechanism:
        'USD1 di-zap lewat BondHelper ke BurnBondDepository periode terkait. Tebus dan yield di halaman Aset.',
      mechanismSteps: [
        {
          title: 'Bayar USD1',
          body: 'Pilih periode rilis dan ikut Bond Burn dengan diskon saat ini.',
        },
        {
          title: 'Mint AGX diskon',
          body: 'Sistem mint AGX pada rasio diskon yang sesuai.',
        },
        {
          title: 'Beli dan bakar permanen',
          body: 'Otomatis beli AGX dan bakar ke black hole untuk deflasi.',
        },
      ],
      faq: [
        {
          q: 'Apa itu Bond Burn?',
          a: 'Bayar USD1: mint AGX diskon, beli AGX otomatis, dan bakar permanen (Blackhole Lock) untuk mengurangi sirkulasi dan menopang nilai jangka panjang.',
        },
        {
          q: 'Apa bedanya dengan Bond LP?',
          a: 'Bond LP membangun likuiditas dasar permanen; Bond Burn mendeflasi sirkulasi. Pita diskon sama (75%–100% per periode); pokok dirilis linear di keduanya.',
        },
        {
          q: 'Apa itu premi bond?',
          a: 'Premi adalah selisih harga diskon vs harga pasar AGX. Premi positif berarti bond lebih menguntungkan daripada beli spot.',
        },
        {
          q: 'Bisakah tebus dini?',
          a: 'Tidak ada tebus dini. Pokok dirilis linear per blok; klaim bagian yang sudah dirilis kapan saja.',
        },
        {
          q: 'Ke mana USD1 yang saya bayar?',
          a: 'USD1 masuk cadangan think-tank untuk mendukung cetak jaminan, market making, dan pertahanan risiko; sistem juga mencetak AGX sesuai diskon, membeli, dan membakar permanen ke black hole.',
        },
      ],
    },
    xmine: {
      title: 'Penambangan X',
      intro: 'Staking gAGX untuk menambang hadiah ekosistem X',
      amountAria: 'Jumlah staking gAGX',
      amountBalance: 'Jumlah (saldo dompet {balance} gAGX)',
      quotaInline: 'Kuota staking: {quota} gAGX',
      submit: 'Stake',
      success: 'Staking berhasil',
      meta: {
        quota: 'Kuota staking',
        daily: 'Hasil (harian)',
        max: 'Staking maksimum',
        lock: 'Hari terkunci',
        lockValue: 'Rilis setelah 24 jam',
        h24: '24h',
        contract: 'Lihat kontrak',
      },
      overviewMetrics: [
        { label: 'TVL X Mine' },
        { label: 'Harga X' },
        { label: 'Total hasil mining' },
        { label: 'Tingkat yield harian' },
        { label: 'Output mining berikutnya' },
      ],
      positionMetrics: [
        { label: 'Staking mining saya' },
        { label: 'Dirilis' },
        { label: 'Hasil mining' },
      ],
      mechanismTitle: 'Cara kerja X Mine',
      mechanism:
        'Validasi kuota dengan miningQuotaOf lalu stakeGagxForMining. Klaim X dan unstake di halaman Aset; halaman ini tidak menyediakan batalkan warmup.',
      mechanismSteps: [
        {
          title: 'Rebase + hadiah DAO',
          body: 'Hadiah settle seragam sebagai gAGX.',
        },
        { title: 'Stake gAGX', body: 'Setelah di-stake masuk kunci 24 jam.' },
        {
          title: 'Alokasi X dinamis',
          body: 'Sistem mengalokasikan hadiah X secara dinamis menurut yield protokol.',
        },
        {
          title: 'Rilis linear unstake',
          body: 'Setelah dibuka, gAGX dirilis linear ~30 hari per blok.',
        },
      ],
      faq: [
        {
          q: 'Bagaimana ikut X Mine?',
          a: 'Stake gAGX untuk mining X tanpa rugi. Setelah stake, gAGX terkunci 24 jam; hadiah X dialokasikan dinamis menurut yield protokol.',
        },
        {
          q: 'Berapa batas atas staking?',
          a: 'Stake gAGX tidak boleh melebihi holding Bond AGX ≥180 hari plus total stake AGX.',
        },
        {
          q: 'Bagaimana aset dirilis setelah unstake?',
          a: 'gAGX yang terbuka memakai rilis linear blok ~30 hari untuk mengurangi tekanan jual.',
        },
        {
          q: 'Berapa pasokan X? Apakah akan diinflasi?',
          a: 'Tetap 210 juta X, tidak pernah diinflasi. 47,62% untuk likuiditas LP; 52,38% untuk hadiah global dan pertumbuhan.',
        },
        {
          q: 'Bagaimana cara mendapatkan gAGX?',
          a: 'gAGX adalah voucher settlement terpadu untuk hadiah Rebase dan DAO dari staking dan bond.',
        },
        {
          q: 'Selain mining, apa lagi yang bisa dilakukan gAGX?',
          a: 'Tebus 1:1 ke AGX untuk staking, atau stake gAGX untuk menambang X.',
        },
        {
          q: 'Mengapa X terus deflasi?',
          a: 'Setiap penjualan X membakar 25%. Pertumbuhan meningkatkan permintaan sementara pembakaran menyusutkan pasokan.',
        },
        {
          q: 'Apa sumber nilai X?',
          a: 'Tiga permintaan bertumpuk: permintaan X dari mining stake gAGX, arus balik pendapatan protokol, serta ekspansi aplikasi dan pertumbuhan pengguna.',
        },
        {
          q: 'Mengapa batas atas terkait Bond/staking jangka panjang?',
          a: 'Mekanisme ini memastikan peserta X Mine juga pembangun jangka panjang protokol; menambah Bond atau staking jangka panjang menaikkan batas. Kontrak mengembalikan kuota via miningQuotaOf.',
        },
      ],
    },
    calc: {
      title: 'Kalkulator hasil',
      intro: 'Estimasi hasil di berbagai produk, periode, dan harga',
      productAria: 'Produk estimasi',
      products: {
        stake: 'Stake',
        lpbond: 'Bond LP',
        burnbond: 'Bond Burn',
        xmine: 'Penambangan X',
      },
      periodLabel: 'Pilih periode',
      periodAria: 'Periode estimasi',
      amountLabel: 'Jumlah',
      amountAria: 'Jumlah',
      price: 'Harga AGX jatuh tempo',
      priceCurrent: 'Saat ini ${price}',
      priceAria: 'Input harga',
      days: 'Hari kepemilikan',
      dayBubble: 'Hari ke-{day}',
      daysAria: 'Hari kepemilikan',
      submit: 'Hitung',
      result: {
        interest: 'Estimasi hasil',
        total: 'Total hasil',
        rate: 'Tingkat hasil',
        sellTotal: 'Total penjualan',
        invested: 'Total investasi',
        yieldBar: 'Hasil {amount}',
        legend: {
          released: 'Nilai pokok yang dirilis',
          netYield: 'Nilai hasil bersih',
          cost: 'Biaya investasi',
          grossYield: 'Total hasil',
        },
      },
      aside: {
        result: 'Hasil estimasi',
        resultHint: 'Masukkan parameter di kiri dan ketuk Hitung untuk melihat hasil.',
        tags: { day: 'Hari ke-{day}' },
        curve: 'Kurva hasil',
        curveHint:
          'Hasil kumulatif harian menurut parameter saat ini; jika tidak ditebus saat jatuh tempo, bunga majemuk berlanjut',
        nodes: 'Node kunci',
        nodeEndLabel: 'Tahan hingga hari ke-{day}',
        nodeCards: [
          {
            label: 'Hari mulai profit',
            hint: 'Mulai hari itu, menjual dapat merealisasikan yield positif',
          },
          { label: 'Pokok sepenuhnya dirilis', hint: '' },
          { label: 'Tahan hingga akhir periode', hint: 'Ilustrasi yield kumulatif vs pokok' },
        ],
        notes: 'Catatan perhitungan',
        notesBody: 'Kalkulator ini hanya estimasi lokal, bukan kuotasi on-chain atau janji hasil.',
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
    title: 'Rilis',
    intro: 'Kelola dan lihat rilis hasil serta pokok',
    backToHub: 'Kembali ke Rilis',
    recordColumns: ['Waktu', 'Aksi', 'Jumlah', 'Hash tx'],
    recordsEmpty: 'Belum ada catatan indeks on-chain (menunggu indexer)',
    labels: {
      releasing: 'Sedang rilis',
      released: 'Dirilis',
      releasedPct: 'Sudah dirilis {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Klaim gagal. Silakan coba lagi',
    },
    hub: {
      aboutTitle: 'Tentang rilis',
      aboutCardTitle: 'Pool rilis · rilis hasil & hadiah',
      aboutCardBody:
        'Kolam rilis mengubah tekanan jual instan menjadi aliran mulus berhari-hari. Setiap klaim terbuka linear sesuai periode agar arus keluar protokol selaras dengan pertumbuhan ekosistem.',

      aboutSlides: [
        {
          title: 'Pool rilis · rilis hasil & hadiah',
          body: 'Kolam rilis mengubah tekanan jual instan menjadi aliran mulus berhari-hari. Setiap klaim terbuka linear sesuai periode agar arus keluar yield selaras pertumbuhan ekosistem, menghindari dampak harga AGX, dan menjaga dasar bunga majemuk bagi peserta jangka panjang.',
        },
        {
          title: 'Pool buffer · rilis sekunder pokok',
          body: 'Setelah pokok staking/Bond keluar, dana masuk pool buffer untuk rilis linear sekunder yang selaras dengan kapasitas penyerapan pasar, memperkuat stabilitas ekosistem.',
        },
      ],
      purposeTitle: 'Fungsi rilis',
      purposeBody:
        'Semua yield melewati kolam rilis sebelum Turbine. Menyebar penebusan ke waktu mengurangi tekanan dump; periode lebih panjang mendapat pajak lebih rendah untuk mendorong holding.',

      mechanismTitle: 'Mekanisme klaim hasil',
      mechanismSubtitle:
        'Rilis adalah langkah wajib dari terciptanya yield hingga Turbine — tukar waktu untuk pajak lebih rendah dan keluar yang lebih stabil',
      mechanismSteps: [
        { title: 'Klaim hadiah Rebase / DAO', body: 'Yield tercipta' },
        { title: 'Mekanisme kontribusi 6 : 1', body: '50% bakar · 50% ke pool X' },
        { title: 'Masuk kolam rilis · rilis linear', body: 'Pilih periode 5 / 20 / 40 / 60 hari' },
        { title: 'Klaim masuk Turbine', body: 'Beli 1:1 untuk membuka kuota jual' },
      ],
      taxTitle: 'Rilis lebih lama, pajak lebih rendah',
      taxPeriod: 'Periode estimasi',
      taxRate: 'Pajak klaim',
      taxRows: {
        periods: ['5 hari', '20 hari', '40 hari', '60 hari'],
        rates: ['20%', '10%', '5%', '1%'],
      },
    },
    queue: {
      title: 'Pool rilis',
      intro:
        'Yield dan hadiah yang diklaim dirilis linear di sini sesuai periode; bagian yang sudah dirilis dapat diklaim ke Turbine kapan saja',
      planDays: '{days} hari',
      claim: 'Klaim',
      refresh: 'Segarkan',
      claimSuccess: 'Diklaim ke kuota Turbine',
      goTurbine: 'Pergi ke Turbine',
      statsTitle: 'Data pool rilis',
      lifetimeClaimed: 'Total diklaim dari pool rilis',
      recordsTitle: 'Catatan pool rilis',
    },
    buffer: {
      title: 'Pool buffer',
      intro:
        'Aset yang ditebus di sini menjalani rilis linear sekunder selama {days} hari; bagian yang sudah dirilis dapat ditarik kapan saja.',
      claim: 'Tarik',
      refresh: 'Segarkan',
      claimSuccess: 'AGX ditarik ke dompet',
      statsTitle: 'Data pool buffer',
      entered: 'Total masuk',
      extracted: 'Total ditarik',
      recordsTitle: 'Catatan pool buffer',
      mechanismTitle: 'Mekanisme rilis dana',
      mechanismSubtitle:
        'Pokok staking dan bond memakai model rilis dua tahap untuk stabilitas pasar',
      mechanismSteps: [
        { title: 'Staking/', body: 'pokok bond' },
        { title: 'Tingkat blok', body: 'rilis' },
        { title: 'Setelah penarikan', body: 'Buffer 30 hari' },
        { title: 'Linear sekunder', body: 'rilis' },
      ],
      mechanismBenefits: [
        'Hindari unlock bergerombol',
        'Kurangi tekanan jual pasar',
        'Perhalus rilis dana',
        'Tingkatkan stabilitas pasar',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'Bisakah mengubah periode rilis?',
          a: 'Periode yang dipilih saat antre tidak dapat diubah; klaim baru dapat memilih periode lain.',
        },
        {
          q: 'Kapan pajak dipotong?',
          a: 'Saat mengklaim bagian yang sudah terbuka, memakai tarif rencana rilis.',
        },
        {
          q: 'Ke mana gAGX yang diklaim dari kolam rilis?',
          a: 'On-chain masuk kuota jual Turbine sebagai AGX; lalu gunakan alur Turbine untuk memperoleh gAGX.',
        },
        {
          q: 'Apakah bagian yang sudah dirilis rugi jika tidak segera diklaim?',
          a: 'Bagian yang sudah terbuka dapat diklaim kapan saja dan tidak menyusut karena ditunda.',
        },
        {
          q: 'Bagaimana memilih periode rilis yang tepat?',
          a: 'Semakin panjang periode, semakin rendah pajak; pilih di antara 5/20/40/60 hari sesuai kebutuhan likuiditas.',
        },
      ],
      queue: [
        {
          q: 'Bisakah mengubah periode rilis?',
          a: 'Periode yang dipilih saat antre tidak dapat diubah; klaim baru dapat memilih periode lain.',
        },
        {
          q: 'Kapan pajak dipotong?',
          a: 'Saat mengklaim bagian yang sudah terbuka, memakai tarif rencana rilis.',
        },
        {
          q: 'Ke mana gAGX yang diklaim dari kolam rilis?',
          a: 'Masuk kuota Turbine — buka Tukar → Turbine.',
        },
        {
          q: 'Apakah bagian yang sudah dirilis rugi jika tidak segera diklaim?',
          a: 'Tidak menyusut karena ditunda klaim.',
        },
        {
          q: 'Bagaimana memilih periode rilis yang tepat?',
          a: 'Semakin panjang periode, semakin rendah pajak.',
        },
      ],
      buffer: [
        {
          q: 'Apa itu pool buffer?',
          a: 'Setelah tebus/unstake, pokok dirilis linear di splitter.',
        },
        {
          q: 'Apakah aset di buffer masih menghasilkan?',
          a: 'Tidak ada yield staking selama di buffer.',
        },
        {
          q: 'Bagaimana menarik bagian yang sudah dirilis?',
          a: 'Ketuk Tarik — AGX langsung ke wallet.',
        },
        {
          q: 'Mengapa buffer menampilkan AGX dan gAGX?',
          a: 'Desain mempertahankan dua kartu; buffer on-chain hanya AGX setelah konversi gAGX.',
        },
        {
          q: 'Mengapa saya tidak bisa menarik semua aset yang sudah dirilis sekaligus?',
          a: 'Hanya jumlah yang sudah terbuka saat ini yang dapat ditarik; bagian belum jatuh tempo harus menunggu.',
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
