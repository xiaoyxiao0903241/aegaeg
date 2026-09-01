import { defineMessages } from '~/i18n/messages/define-messages'

import type { AppMessagesBundle } from './types'

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
    splitDragHint: 'Sürükleyerek ayarla',
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
      reverts: {
        stakeAmountLimit: 'Günlük stake limiti aşıldı. Tutarı düşürün veya sıfırlanmayı bekleyin.',
        debtCapacityReached: 'Tahvil kapasitesi dolu. Lütfen daha sonra tekrar deneyin.',
        turbineCooldown: 'Bekleme süresi henüz bitmedi. Kayıtları yenileyip tekrar deneyin.',
        pairNotExist: 'İşlem çifti yok. Token yapılandırmasını kontrol edin.',
        configNotReady:
          'Tampon havuzu / serbest bırakma kuyruğu yapılandırması hazır değil. Lütfen daha sonra tekrar deneyin.',
        exceedsMax: 'Tutar üst sınırı aşıyor. Lütfen düşürün.',
        bondTooSmall: 'Tahvil ödemesi çok küçük. Satın alma tutarını artırın.',
        bondTooLarge: 'Tek işlem tahvil üst sınırı aşıldı. Satın alma tutarını düşürün.',
        stakeNotExist: 'Pozisyon yok veya kapatılmış. Listeyi yenileyip tekrar deneyin.',
        yieldUnavailable:
          'Talep edilebilir getiri yok veya tutar çok yüksek. Tutarı düşürün veya birikmeyi bekleyin.',
        operationPaused: 'Bu işlem duraklatıldı. Lütfen daha sonra tekrar deneyin.',
        belowMinAmount: 'Tutar alt sınırın altında. Lütfen artırın.',
        aboveMaxAmount: 'Tutar üst sınırı aşıyor. Lütfen düşürün.',
        zeroRate: 'Kur hazır değil. Lütfen daha sonra tekrar deneyin.',
        zeroAmount: 'Geçerli bir tutar girin.',
        turbineNoSilenceBalance: 'Çekilebilecek olgun soğuma bakiyesi yok.',
        invalidAmount: 'Geçersiz tutar. Kontrol edip yeniden deneyin.',
        zeroAddress: 'Geçersiz adres. Lütfen daha sonra yeniden deneyin.',
        notAuthorized: 'Bu hesabın bu işlem için yetkisi yok.',
        invalidLimits: 'Limit yapılandırması geçersiz. Lütfen daha sonra yeniden deneyin.',
        nothingToClaim: 'Alınacak bir şey yok veya dizin geçersiz. Yenileyip tekrar deneyin.',
        warmupOrLockActive: 'Hâlâ ısınma veya kilit süresinde. Bitmesini bekleyin.',
        walletTokenInsufficient: 'Cüzdan token bakiyesi yetersiz.',
        walletAgxInsufficient: 'Cüzdan AGX bakiyesi yetersiz.',
        walletUsd1Insufficient: 'Cüzdan USD1 bakiyesi yetersiz.',
        walletGagxInsufficient: 'Cüzdan gAGX bakiyesi yetersiz.',
        contractPayableInsufficient:
          'Sözleşmenin ödenebilir bakiyesi yetersiz. Daha sonra yeniden deneyin.',
        extractableInsufficient: 'Çekilebilir bakiye yetersiz. Yenileyip tekrar deneyin.',
        insufficientAllowance: 'Onay limiti yetersiz. Önce onaylayın.',
      },
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
    exchange: 'Takas',
    assets: 'Varlıklar',
    staking: 'Stake işlemi',
    genesis: 'Ortak İnşa',
    rewards: 'Ödüller',
    release: 'Serbest bırakma',
    community: 'Topluluk',
    rewardsTooltip: 'Öneri ödülleri ve takım ödüllerini görüntüleyin.',
    communityTooltip:
      'Ortak inşaya katılmak için arkadaşlarınızı davet edin, ekosistem büyüme değerini ve Genesis ödüllerini paylaşın',
    bscTooltip: 'Yalnızca BSC · AEGIS X BNB Smart Chain üzerinde çalışır.',
  },
  flowOps: {
    stake: {
      STAKE: 'Stake',
      REWARD: 'Ödül alma',
      EXTRA_REWARD: 'Ek ödül alma',
      CLAIM_PRINCIPAL: 'Geri al',
      RESTAKE: 'Yeniden stake',
      EARLY_STAKE: 'Ortak İnşa',
    },
    bond: {
      PURCHASE: 'Satın al',
      REDEEM: 'Geri al',
      REWARD: 'Al',
      RESTAKE: 'Yeniden stake',
    },
    xmine: {
      STAKE_X: 'Stake',
      UNSTAKE_X: 'Stake’ten çıkar',
      REWARD: 'Al',
    },
    buffer: {
      RELEASE_CREATED: 'Giriş',
      PRINCIPAL_CLAIMED: 'Çekim',
    },
    release: {
      entered_queue: 'Kuyruğa gir',
      claimed_from_queue: 'Al',
      released: 'Serbest',
    },
    turbine: {
      received: 'Giriş',
      silenced: 'Kilidi aç',
      cooled_claimed: 'Çekim',
    },
    termDays: ' ({n}g)',
    termLiquid: ' (Esnek)',
    liquid: 'Esnek',
    periodDays: '{n} gün',
  },
  topbar: {
    currentNetwork: 'Mevcut Ağ',
    switchToBsc: 'BSC’ye geçin',
    switchNetworkFailed: 'Ağ değiştirilemedi. Cüzdanınızda BSC’ye geçip tekrar deneyin.',
    wrongNetworkTooltip: 'Yanlış ağ. BNB Smart Chain (BSC) ağına geçmek için tıklayın.',
    openMenu: 'Navigasyonu aç',
    closeMenu: 'Navigasyonu kapat',
    hideDetails: 'Detay panelini gizle',
    showDetails: 'Detay panelini göster',
    toggleTooltip: 'Detay panelini göster veya gizle',
  },
  onboarding: {
    chip: 'Eğitim',
    skip: 'Atla',
    prev: 'Geri',
    next: 'İleri',
    done: 'Tamam',
    complete: {
      title: 'Eğitim tamamlandı',
      body: 'AEGIS X’in temel özelliklerini öğrendiniz. Keşfetmeye başlayın — üst çubuktaki Eğitim’den istediğiniz zaman yeniden izleyebilirsiniz.',
      cta: 'Başla',
    },
    steps: [
      {
        title: 'Takas',
        body: 'Takas ile ana tokenları piyasa kurundan AEGIS X ekosistem tokenlarıyla (AGX, gAGX, X) takas edin.',
      },
      {
        title: 'İşlem',
        body: 'İşlem ile USD1 kullanarak AGX satın alın.',
      },
      {
        title: 'Stake işlemi',
        body: 'Staking getirinin başlangıcıdır: AGX stake edin veya tahvil alın, her Rebase’de bileşik getiri kazanın.',
      },
      {
        title: 'Tek varlık stake',
        body: 'Stake kartında AGX stake edin. Günde {timesPerDay} Rebase bileşik büyür; süre uzadıkça getiri bonusu artar.',
      },
      {
        title: 'Varlıklar',
        body: 'Varlıklar tüm pozisyonlarınızı özetler: stake, LP tahvil, yakım tahvili ve X madenciliği pozisyon ile getirileri.',
      },
      {
        title: 'Stake pozisyonları',
        body: 'Varlıklar’daki Stake kartında pozisyon ve toplam getiriyi görün; talep, yeniden stake veya geri alma yapın.',
      },
      {
        title: 'Serbest bırakma',
        body: 'Serbest bırakma bekleyen fonları yönetir: getiri ve ödüller önce serbest bırakma / tampon havuzuna girer, süreye göre doğrusal serbest bırakılır.',
      },
      {
        title: 'Serbest bırakma havuzu',
        body: 'Talep edilen getiri ve ödüller seçilen sürede (5 / 20 / 40 / 60 gün) doğrusal serbest bırakılır; serbest bırakılan kısım Türbin’e alınabilir.',
      },
      {
        title: 'Tampon havuzu',
        body: 'Geri alınan anapara burada ~30 günlük blok doğrusal serbest bırakılır; serbest bırakılan kısım istediğiniz zaman cüzdana çekilebilir.',
      },
      {
        title: 'Türbin',
        body: 'Serbest bırakma havuzundan Türbin’e giren gAGX kilitlidir; USD1 ile 1:1 alım yaparak kilidi açın.',
      },
      {
        title: 'Ödüller',
        body: 'Ödüller referans, katılım, ortak inşa gibi çeşitli teşvikler içerir; ödül talep etmek katkı puanını 1:1 harcar.',
      },
      {
        title: 'Topluluk',
        body: 'Topluluk ekibinizi gösterir: davet bağlantısı, üyeler ve ortak inşa seviyesi burada.',
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
      wrongChain: 'BNB Smart Chain (BSC) ağına geçip tekrar deneyin.',
      accountChanged: 'Cüzdan hesabı değişti. Yeniden gönderin.',
    },
  },
  exchange: {
    title: 'Takas',
    intro: 'AEGIS X ekosistem tokenlarını en iyi kurlarla alın',
    backToHub: 'Takasa dön',
    sell: 'Sell',
    buy: 'Satın al',
    flip: 'Takas yönünü değiştir',
    balance: 'Bakiye',
    exchangePrice: 'Takas fiyatı',
    slippage: 'Kayma toleransı',
    allowedSlippage: 'İzin verilen kayma',
    slippageSettings: 'Kayma toleransı ayarları',
    slippagePanel: {
      title: 'Kayma',
      hint: 'Kayma toleransı, emri gönderdiğiniz an ile zincirde gerçekleşmesi arasındaki fiyat hareketidir. Gerçek kayma ayarınızı aşarsa işlem iptal edilir. İptal edilen işlemler yine de gas ücreti doğurabilir.',
      modeAuto: 'Varsayılan',
      modeCustom: 'Özel',
      max: 'Maksimum kayma',
      customAria: 'Özel kayma',
    },
    route: 'Takas yolu',
    provider: 'Sağlayıcı',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'PancakeSwap’ta aç',
    overview: 'Genel bakış',
    exchangeRate: 'Takas oranı',
    settlement: 'Uzlaşma',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Hızlı Takas',
          body: 'gAGX’i AGX’e veya USDT’yi USD1’e takas edin — ücretsiz, kaymasız',
        },
        trade: {
          title: 'İşlem',
          body: 'Ana tokenları AEGIS X ekosistem tokenlarıyla takas edin',
        },
        burn: {
          title: 'Yakım',
          body: 'Katkı puanı için AGX yakın',
        },
        turbine: {
          title: 'Türbin',
          body: 'USD1 ile Türbin’deki kilidi açılmış gAGX satın alın',
        },
      },
      program: {
        title: 'AEGIS X protokol tokenlarını alın',
        cards: [
          { title: 'gAGX işle', body: 'gAGX’i AGX’e takas et' },
          { title: 'Türbin', body: 'USD1 ile Türbin’deki kilidi açılmış gAGX satın alın' },
          { title: 'USD1 al', body: 'Flash ile USDT’yi USD1’e çevir' },
          { title: 'AGX al', body: 'PancakeSwap piyasa kurundan AGX al' },
          { title: 'X sat', body: 'X’i AGX, USD1 veya diğer ekosistem tokenlarıyla takas et' },
          { title: 'Katkı puanı al', body: '{ratio} oranında AGX yakarak katkı puanı alın' },
        ],
      },
      faq: {
        items: [
          {
            q: 'Takas sayfasında ne yapabilirim?',
            a: 'Takas sayfası AEGIS X protokol tokenlarını alıp yönetmenin yaygın yollarını bir araya getirir: Flash (gAGX’i 1:1 AGX’e geri al), İşlem (USD1 / AGX / X’i piyasa kurundan takas et), Türbin (USD1 ile alım yapıp Türbin gAGX kilidini aç) ve katkı puanı için AGX yakımı. İhtiyacınıza uyan girişi seçin.',
          },
          {
            q: 'Flash ile İşlem farkı nedir?',
            a: 'Flash, protokolün 1:1 gAGX↔AGX geri alımıdır — ücretsiz, kaymasız, zincir üstünde anında. İşlem PancakeSwap canlı piyasa kurlarından USD1, AGX, X ve diğer tokenları takas eder; fiyat piyasayla hareket eder, izin verilen kaymayı siz ayarlarsınız ve ağ gas’ı ödersiniz.',
          },
          {
            q: 'Kripto cüzdan nedir ve nasıl alınır?',
            a: 'Kripto cüzdan, zincir üstü dijital varlıkları görüntüleyip yöneten yazılımdır. Varlıklar cüzdanda değil blokzincirde kayıtlıdır. Saklamasız cüzdanda özel anahtarı yalnızca siz kontrol edersiniz — işlemleri yalnız siz imzalarsınız. Üçüncü taraf anahtar tutmaz; ancak özel anahtar veya tohum ifadesini kaybederseniz varlıklara erişimi kalıcı kaybedersiniz. Mobil uygulama veya donanım olabilir; yaygın seçenekler MetaMask ve TokenPocket’tır.',
          },
          {
            q: 'Blokzincir işlem ücreti nedir?',
            a: 'Zincir üstü her alım, satım, takas veya transfer gas ister. Bu ücret AEGIS X tarafından alınmaz; ağ talebi ve hesaplama maliyetine göre BSC’de BNB ile ödenir. AEGIS X’te işlem öncesi cüzdanınızda BNB bulundurun.',
          },
          {
            q: 'Kripto cüzdan nasıl çalışır?',
            a: 'Kripto cüzdanlar varlıklarınızı korumak için bir genel ve bir özel anahtar kullanır. Saklamasız cüzdan kurarken yazılım, anahtarları kurtarmak için kullanabileceğiniz bir tohum ifadesi (12, 18 veya 24 rastgele kelime) üretir. Güvenle saklayın, asla paylaşmayın. Özel anahtarınız cüzdanın tam kontrolünü verir; işlemleri imzalamak için kullanılır ve her zaman gizli tutulmalıdır. Genel anahtar özel anahtardan türetilir, paylaşılabilir; cüzdan adresi oluşturmak ve transfer almak için kullanılır.',
          },
        ],
      },
    },
    flash: {
      title: 'Hızlı Takas',
      intros: {
        gagx: 'gAGX’i AGX’e çevirin — ücretsiz, kaymasız',
        gagxWrap: 'AGX’i gAGX’e sarın — ücretsiz, kaymasız',
        usdt: 'USDT’yi USD1’e çevirin — ücretsiz, kaymasız',
      },
      providerName: 'AEGIS X',
      openProvider: 'Flash sözleşmesini BscScan’de görüntüle',
      settlementValue: 'Zincir üstü · saniyeler',
      aboutTitle: 'Hakkında',
      action: 'Hızlı Takas',
      success: 'Flash takası başarılı',
      pairAriaLabel: 'Flash çifti',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'Flash duraklatıldı. Lütfen daha sonra tekrar deneyin.',
        belowMin: 'Tek işlem minimum takas limitinin altında.',
        aboveMax: 'Tek işlem maksimum takas limitini aşıyor.',
        insufficientReserve: 'USD1 rezervi yetersiz. Lütfen daha sonra tekrar deneyin.',
        zeroRate: 'Takas kuru hazır değil. Lütfen daha sonra tekrar deneyin.',
        insufficientOutput: 'Teklif değişti. Lütfen tekrar deneyin.',
        transferMismatch: 'Token transfer tutarı uyuşmuyor. Lütfen tekrar deneyin.',
        zeroAddress: 'Sözleşme adresi geçersiz. Lütfen daha sonra tekrar deneyin.',
        sameToken: 'Giriş/çıkış token yapılandırması geçersiz. Lütfen daha sonra tekrar deneyin.',
        zeroAmount: '0’dan büyük bir yakım tutarı girin.',
        notAuthorized: 'Bu işlem yetkilendirilmedi.',
        invalidLimits: 'Takas limitleri hatalı yapılandırılmış. Lütfen daha sonra tekrar deneyin.',
      },
      faq: {
        items: [
          {
            q: 'gAGX nedir?',
            a: 'gAGX, Rebase ve DAO ödüllerinin birleşik uzlaşma belgesidir: AGX stake veya tahvillerden Rebase getirisi ile DAO ödülleri gAGX olarak ödenir.',
          },
          {
            q: 'gAGX ile AGX takas oranı nedir?',
            a: 'Her zaman sabit 1:1 — ücretsiz, kaymasız, zincir üstünde anında.',
          },
          {
            q: 'Flash neden ücretsiz ve kaymasız?',
            a: 'Flash, AMM takası değil protokol düzeyinde gAGX↔AGX 1:1 geri alımdır; fiyat kayması veya takas ücreti yoktur. Yalnızca BSC ağ gas’ını BNB ile ödersiniz.',
          },
          {
            q: 'gAGX nasıl alınır?',
            a: 'AGX stake, LP tahvil veya yakım tahvilinden Rebase getirisi ile DAO ödülleri hesabınıza gAGX olarak ödenir.',
          },
          {
            q: 'gAGX, AGX’e çevirmenin dışında ne işe yarar?',
            a: 'gAGX’i X Madenciliğe stake ederek ekosistem değer tokenı X’i yakalayabilirsiniz. AGX’e çevirin veya X madenciliği yapın — iki yol da sizin.',
          },
          {
            q: 'USDT nasıl USD1’e takas edilir?',
            a: 'Flash’ın üstünden USDT → USD1 çiftine geçin, tutar girin ve 1:1 takas edin — ücretsiz, kaymasız, zincir üstünde anında.',
          },
          {
            q: 'USD1’i USDT’ye geri takas edebilir miyim?',
            a: 'Hayır. Flash yalnızca USDT’yi tek yönlü USD1’e çevirir. USD1 AEGIS X’in çekirdek uzlaşma varlığıdır; ekosistemde işlem, tahvil alımı ve Türbin kilit açma için kullanılır.',
          },
          {
            q: 'Flash geçmişini nerede görürüm?',
            a: 'Flash zincir üstünde çalışır ve saniyeler içinde kredilendirilir. Her işlemi cüzdanınızda veya blok gezgininde görün.',
          },
        ],
      },
    },
    trade: {
      title: 'İşlem',
      intro: 'PancakeSwap canlı kur · zincir üstü uzlaşma',
      aboutTitle: 'Hakkında',
      selectSellToken: 'Satılacak tokenı seçin',
      selectBuyToken: 'Alınacak tokenı seçin',
      xBuyDisabledHint: 'X yalnızca satılabilir',
      flipDisabledXSellOnly: 'X yalnızca satılabilir — alışa çevrilemez',
      action: 'İşlem',
      success: 'İşlem başarılı',
      priceImpact: 'Fiyat etkisi',
      estimatedGas: 'Tahmini Gas',
      highPriceImpactWarning:
        'Bu işlem havuz fiyatını önemli ölçüde etkileyebilir. Tutarı düşürün veya kayma toleransını artırın.',
    },
    burn: {
      title: 'Yakım',
      subtitle: 'Katkı puanı almak için AGX yakın',
      sellLabel: 'Yakım',
      receiveLabel: 'Alınacak',
      pointsToken: 'Katkı puanlarım',
      currentContribution: 'Mevcut katkı puanı',
      burnRate: 'Yakım oranı',
      destination: 'Yakım hedefi',
      destinationValue: 'Kara delik {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'Katkı takas sözleşmesini BscScan’de görüntüle',
      action: 'Yakım',
      success: 'Yakım başarılı',
      aboutTitle: 'Katkı puanları hakkında',
      blocked: {
        paused: 'Yakım duraklatıldı. Lütfen daha sonra tekrar deneyin.',
        belowMin: 'Tek işlem minimum yakım limitinin altında.',
        aboveMax: 'Tek işlem maksimum yakım limitini aşıyor.',
        zeroRate: 'Yakım oranı hazır değil. Lütfen daha sonra tekrar deneyin.',
        zeroAmount: '0’dan büyük bir yakım tutarı girin.',
      },
      metrics: {
        totalBurnedAgx: 'Toplam yakılan AGX',
        totalEarnedContribution: 'Toplam kazanılan katkı puanı',
        totalConsumedContribution: 'Toplam harcanan katkı puanı',
      },
      history: {
        title: 'Yakım geçmişi',
        emptyBurn: 'Henüz yakım kaydı yok. AGX yakıp katkı puanı alınca her işlem burada görünür.',
        emptyConsume:
          'Henüz harcama kaydı yok. Katkı harcayan getiri/ödül taleplerinden sonra kayıtlar burada görünür.',
        tabsAriaLabel: 'Yakım geçmişi kategorileri',
        tabs: {
          burn: 'Yakım',
          consume: 'Harcama',
        },
        burnColumns: ['Zaman', 'Yakılan AGX', 'Kazanılan katkı puanı', 'İşlem hash’i'],
        consumeColumns: [
          'Zaman',
          'Kullanım',
          'Alınan miktar',
          'Harcanan katkı puanı',
          'İşlem hash’i',
        ],
        purpose: {
          stakeYield: 'Stake getirisi',
          lpBondYield: 'LP tahvil getirisi',
          burnBondYield: 'Yakım tahvil getirisi',
          lucky: 'Şans',
          rank: 'Rütbe',
          referral: 'Referans',
          participation: 'Katılım',
          surpass: 'Akran geçiş',
          lifetime: 'Ömür boyu',
          market: 'Piyasa ödeneği',
        },
      },
      faq: {
        items: [
          {
            q: 'Katkı puanları ne işe yarar?',
            a: 'Stake, tahvil ve diğer kaynaklardan getiri talep etmek katkı puanını 1:1 harcar (1 gAGX talep etmek 1 puan harcar). Puan yetmezse talep edilemez.',
          },
          {
            q: 'Ödül talep ederken neden katkı puanı gerekir?',
            a: 'Bu, talepleri protokol deflasyonuna bağlar: her 1 gAGX talebi 1 katkı puanı harcar ve puan yalnızca AGX yakımından gelir. Böylece her getiri çekimi eşit miktarda yakılan AGX’e karşılık gelir ve AGX deflasyonunu sürekli destekler.',
          },
          {
            q: 'Yakım oranı nedir?',
            a: '1:6 oranında yakım: yakılan her 1 AGX 6 katkı puanı verir. Yakılan AGX doğrudan kara delik adresine gider ve dolaşımdan kalıcı çıkar.',
          },
          {
            q: 'Yakılan AGX nereye gider?',
            a: 'Yakılan AGX’in tamamı kara delik adresine aktarılıp kalıcı kilitlenir; dolaşımı doğrudan azaltır, deflasyonu güçlendirir ve protokolün değer geri dönüş mekanizmasının parçasıdır.',
          },
          {
            q: 'Katkı puanları aktarılabilir veya iade edilebilir mi?',
            a: 'Hayır. Katkı puanları hesabınıza bağlıdır — aktarılamaz ve iade edilemez. Yalnızca getiri talep ederken harcanır; ihtiyaca göre yakın.',
          },
        ],
      },
    },
    turbine: {
      title: 'Türbin',
      aboutTitle: 'Türbin hakkında',
      segmentAriaLabel: 'Türbin işlemleri',
      segments: {
        unlock: 'Kilidi aç',
        claim: 'Çek',
      },
      unlockLabel: 'Kilidi aç',
      unlockable: 'Kilidi açılabilir',
      equivalentBuyHint: 'Kilidi açarken eş tutarda alım da yapılır',
      payUsd1Label: 'USD1 öde',
      buyAgxLabel: 'AGX satın al',
      buyToBoundWallet: 'Alım cüzdana geldi',
      agxPrice: 'AGX fiyatı',
      slippageHint:
        'Ödenecek USD1 teklif artı slippage’dır; fazlası iade edilir. Tampon yetmezse işlem revert olabilir ve yine gas kesilebilir.',
      willReceiveAgx: 'Alacağınız AGX',
      unlockRatio: 'Kilit açma oranı',
      unlockRatioValue: '1 : 1 alımla kilit açma',
      cooldown: 'Soğuma süresi',
      cooldownHoursValue: '{hours} sa',
      unlockAction: 'Kilidi aç',
      unlockSuccess: 'Kilit açıldı — soğuma başladı',
      claimAction: 'Çek',
      claimSuccess: 'Çekim gönderildi—gAGX cüzdanınıza aktarılacak',
      claimEmpty: 'Henüz kilit açma kaydı yok',
      claimable: 'Çekilebilir',
      cooling: 'Soğuma',
      countdownLabel: 'Kilit açma geri sayımı',
      cooldownDone: 'Soğuma bitti',
      countdownHours: 'sa',
      countdownMinutes: 'dk',
      dataTitle: 'Türbin verileri',
      recordsTitle: 'Türbin kayıtları',
      recordsEmpty:
        'Henüz Türbin kaydı yok. Serbest bırakma havuzundan Türbin’e ödül girince her işlem burada görünür.',
      mechanismTitle: 'Türbin mekanizması',
      mechanismIntro:
        'Satış likiditesini alım talebine bağlayın; her kilit açılışı eşit alımla eşlensin',
      mechanism: [
        {
          title: 'Kilidi açmak için 1:1 satın al',
          body: 'Serbest bırakma havuzundan alınan gAGX, Türbin içinde kilitli kalır. Aynı miktarda gAGX’in kilidini açmak için güncel fiyattan USD1 ile eşit miktarda AGX satın alın; her kilit açma işlemi alım talebiyle desteklenir.',
        },
        {
          title: 'Dinamik soğuma',
          body: 'Her kilit açma işlemi, piyasa durumuna göre ayarlanan 24–96 saatlik bekleme süresine girer. Süre tamamlandığında kilidi açılan gAGX’i cüzdanınıza çekin.',
        },
      ],
      metrics: {
        pendingUnlock: 'Kilidi açılacak gAGX',
        cooling: 'Soğumadaki gAGX',
        totalWithdrawn: 'Toplam çekilen',
        pendingUnlockHint:
          'Serbest bırakma havuzundan Türbine alınan, henüz kilidi açılmamış toplam gAGX',
        coolingHint: 'Alımla kilidi açılmış ve soğuma süresindeki toplam gAGX',
        totalWithdrawnHint: 'Türbinden cüzdana çekilen kümülatif gAGX',
      },
      faq: {
        items: [
          {
            q: 'gAGX Türbin’e nasıl girer?',
            a: 'Serbest bırakma havuzundan talep edilen gAGX cüzdana gitmez. Otomatik olarak Türbin’e kilitli girer (kayıtlarda «Giriş»). Eşit miktarda AGX’i USD1 ile alarak kilidi açın, soğuma sonrası cüzdana çekin.',
          },
          {
            q: 'Kilidi açmak için neden alım gerekir?',
            a: 'Türbin satış likiditesini alım talebine bağlar: 1 gAGX kilidini açmak için güncel fiyattan USD1 ile 1 AGX almak gerekir. Her olası satış eşit alımla eşlenir; tek yönlü satış baskısını önler ve taban havuzu korur.',
          },
          {
            q: 'Kilit açma ile çekme farkı nedir?',
            a: 'Kilit açma, güncel fiyattan USD1 ile eşit miktarda AGX alır, kilitli gAGX’i açar ve soğumayı başlatır. Çekme, soğuma (24–96 saat) bitince açılmış gAGX’i cüzdana taşır. İki adım Türbin kayıtlarında Kilit açma ve Çekme olarak görünür.',
          },
          {
            q: 'Soğuma süresi ne kadar?',
            a: 'Her kilit açılışı 24–96 saatlik soğumaya girer; süre piyasaya göre sistemce otomatik ayarlanır. Bittikten sonra o gAGX’i cüzdana çekebilirsiniz.',
          },
          {
            q: 'Satın alınan AGX nereye gider?',
            a: 'Alınan AGX doğrudan cüzdanınıza gider, normal işlem alımı gibi. Eşleşen gAGX kilidi açılır ve soğumaya girer.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'AEGIS X ekosistem tokenları hakkında',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Temel uzlaşma varlığı',
          body: 'AEGIS X ekosisteminin temel uzlaşma varlığıdır; değer dolaşımını, likidite ağlarını ve ödeme senaryolarını birbirine bağlar.',
        },
        {
          key: 'agx',
          title: 'AGX · Temel protokol varlığı',
          body: 'AGX, AEGIS X protokolünün temel varlığıdır; %150 aşırı teminatla üretilir; değer büyümesi, getiri dağıtımı ve ekosistem gelişiminde kilit rol oynar.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Getiri uzlaşma belgesi',
          body: 'AGX’e çevrilebilen ve ekosistem madenciliği ile getiri yeniden değerlendirmesinde kullanılan protokol ödül uzlaşma belgesidir.',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · Stake belgesi',
          body: 'AGX stake ile elde edilen faiz getiren belge; otomatik bileşik getiri, yönetişim ağırlığı ve daha yüksek unvanlar açar.',
        },
        {
          key: 'x',
          title: 'X · Ekosistem hakları tokenı',
          body: 'Zincir üstü katkıyı kaydeden ve haklar, etkinlikler ile airdrop avantajlarında kullanılabilen ekosistem katılım ve hak tokenıdır.',
        },
        {
          key: 'contribution',
          title: 'Katkı puanı · Ödül talep belgesi',
          body: 'Ödül talep etmek katkı puanını {ratio} oranında tüketir. AGX yakmak puan kazandırır ve protokol deflasyonunu güçlendirir.',
        },
        {
          key: 'turbine',
          title: 'Türbin · Kota kilit açma merkezi',
          body: 'Serbest bırakma kuyruğundan alınan ödüller Türbin kotasına girer. USD1 ile eşit miktarda AGX satın almak 24–96 saatlik bekleme süresini başlatır. Süre tamamlandığında kilidi açılan gAGX cüzdana çekilebilir.',
        },
      ],
    },
    tokenContract: 'Sözleşmeyi görüntüle',
    tokenPrevious: 'Önceki token',
    tokenNext: 'Sonraki token',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: 'İşlem',
          items: [
            {
              q: 'İşlem ile Flash takası farkı nedir?',
              a: 'İşlem, PancakeSwap’ta USD1, AGX, X vb. tokenları canlı piyasa kurundan takas eder; kayma ayarlanır ve gas ödenir. Flash, protokol içi gAGX↔AGX 1:1 sabittir — ücretsiz, kaymasız.',
            },
            {
              q: 'İzin verilen kayma nedir ve nasıl ayarlanır?',
              a: 'Kayma, gönderim ile zincir üstü uzlaşma arasındaki fiyat değişimidir. İzin verilen kayma kabul ettiğiniz maksimum sapmadır: varsayılan veya özel yüzde. Gerçek kayma aşılırsa işlem geri alınır (gas yine harcanabilir); çok düşük kolay başarısız, çok yüksek daha kötü fiyattan doldurabilir.',
            },
            {
              q: 'İşlem nasıl uzlaşır ve ücret var mı?',
              a: 'İşlemler PancakeSwap zincir üstünde uzlaşır. AEGIS X ek takas ücreti almaz; her zincir üstü işlem BSC gas’ı (BNB) ister — cüzdanda yeterli BNB bulundurun.',
            },
            {
              q: 'Neden gerçek tutar tahminden farklı olabilir?',
              a: 'Tahmin, teklif anındaki kuru kullanır. Piyasa veya diğer işlemler dolumu değiştirebilir; nihai tutar kayma limitiniz içinde zincir üstünde uzlaşandır.',
            },
            {
              q: 'Hangi tokenlar işlem görebilir?',
              a: 'AEGIS X ekosistem tokenları (USD1, AGX, X) arasında piyasa kurundan takas edebilirsiniz. Ayrıntılar için üst sekmeleri kullanın.',
            },
            {
              q: 'İşlem geçmişini nerede görürüm?',
              a: 'İşlemler zincir üstünde yürütülür ve saniyeler içinde tamamlanır. Her işlemi cüzdanınızda veya blok gezgininde doğrulayın.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'USD1 nedir?',
              a: 'USD1, AEGIS X’in temel değer uzlaşma varlığıdır; %100 rezervle desteklenir (nakit, kısa vadeli ABD Hazine tahvilleri, devlet para piyasası fonları vb.); aylık dağılım raporları WLFI sitesindedir.',
            },
            {
              q: 'USD1 AEGIS X’te hangi rolü oynar?',
              a: 'USD1 temel uzlaşma varlığı olarak likidite ağlarını, ödeme senaryolarını ve ekosistem değer akışını bağlar.',
            },
            {
              q: 'USD1 nasıl alınır?',
              a: 'Takas ana sayfasındaki «USD1 al» girişi ile PancakeSwap piyasa kurundan USD1 alın; veya İşlem sayfasında AGX, X ve diğer ekosistem tokenlarıyla takas edin.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'AGX nedir?',
              a: 'AGX, AEGIS X protokolünün temel varlığıdır; %150 aşırı teminatla basılır; değer büyümesi, getiri dağıtımı ve ekosistem gelişiminde kilit rol oynar.',
            },
            {
              q: 'AGX sürdürülebilir büyümeyi nasıl sağlar?',
              a: 'Staking, tahviller ve Rebase ile AGX uzun vadeli bileşik döngü oluşturur; AI düşünce kuruluşu piyasa yapıcılığı ve geri alım-yakım ile birleşir.',
            },
            {
              q: 'AGX nasıl alınır?',
              a: 'Kullanıcılar protokol ekosistemine katılarak veya protokolün desteklediği işlem piyasalarından AGX alabilir.',
            },
            {
              q: 'AGX değer desteği nereden gelir?',
              a: 'AGX, düşünce kuruluşu rezervleriyle desteklenen %150 aşırı teminatla basılır; staking, tahviller, Rebase bileşik getirisi ve geri alım-yakım ile uzun vadeli değer döngüsü oluşturur.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'gAGX nedir?',
              a: 'gAGX, getiri büyümesini ekosistem değeriyle bağlayan protokol ödül uzlaşma belgesidir; ekosistem madenciliğine katılabilir.',
            },
            {
              q: 'gAGX nasıl alınır?',
              a: 'Kullanıcılar protokol getiri dağıtımına katıldıktan sonra ilgili miktarda gAGX alır.',
            },
            {
              q: 'gAGX ile AGX farkı nedir?',
              a: 'AGX, değer büyümesi ve getiri dağıtımından sorumlu çekirdek protokol varlığıdır; gAGX, AGX’e çevrilebilen ekosistem getiri belgesidir ve ekosistem madenciliğine katılımın önemli girişidir.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'X nedir?',
              a: 'X, AEGIS X ekosistem değer tokenıdır; toplam arz sabit 210 milyondur; ekosistem büyümesi ve değer birikimini taşır.',
            },
            {
              q: 'X nasıl alınır?',
              a: 'Kullanıcılar ekosistem madenciliğine katılarak X ödülü kazanır ve büyüme değerini paylaşır.',
            },
            {
              q: 'X airdrop nasıl serbest bırakılır?',
              a: 'X’in değeri ekosistem büyümesi, değer birikimi ve uzun vadeli gelişim konsensüsünden gelir; ekosistem değerinin önemli taşıyıcısıdır.',
            },
            {
              q: 'X neden sürekli deflasyonist?',
              a: 'X’in arzı sabit 210 milyondur, ek basım yoktur ve her satışın %25’i yakılır. Büyüyen talep ve süregelen yakımlar dolaşımı zamanla küçültür.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'Token ve sözleşme ayrıntılarını görüntüle',
  },
  genesis: {
    title: 'Ortak İnşa Planı',
    intro: 'X DAO Ortak İnşa Planına katılın · Faz {season}  ({discount} indirim)',
    introEnded: 'X DAO ortak inşa programı tamamlandı · Tüm ortak inşa edenlere teşekkürler',
    shares: 'Pay (1 pay = {min} USD1 · maks {max} pay)',
    quota: 'Faz ortak inşa kotası',
    pay: 'Ödeme',
    receive: 'Alınacak AGX',
    value: 'Abonelik değeri',
    xTokenAirdrop: 'Alınacak X başlangıç airdrop değeri',
    xTokenAirdropHint:
      'Faz bazında kümülatif ortak inşa tutarı ≥ {threshold} olduğunda airdrop ödülü kazanılır',
    join: 'Ortak İnşaya Katıl',
    joinEnded: 'Ortak İnşa sona erdi',
    joinGenesis: 'Genesis ortak inşaya katıl',
    statsTitle: 'Faz {season} ortak inşa verileri',
    startsIn: 'Başlangıç geri sayımı',
    countdownUnits: { days: 'g', hours: 'sn', minutes: 'g' },
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
          a: 'Kullanıcılar USD1 ile ortak inşaya katılarak ilgili faz indirimiyle AGX kazanabilir. Toplam 3 faz vardır; indirimler sırasıyla %30, %25, %20 şeklindedir.',
        },
        {
          q: 'Ortak inşa kotası ve katılım koşulları nelerdir?',
          a: 'Minimum katılım tutarı $100 olup, 100 USD1 katları şeklinde katılım gereklidir. Faz kotaları sırasıyla $100 – $10,000, $100 – $10,000, $100 – $30,000 şeklindedir.',
        },
        {
          q: 'Ortak inşa döngüsü ne kadar sürer?',
          a: 'Ortak inşa ile kazanılan AGX, 540 günlük bir kilit açma döngüsüne tabidir.',
        },
        {
          q: 'X airdrop ödülü nasıl kazanılır?',
          a: 'Tek hesapla toplam ortak inşa tutarı $1,000 ulaştığında, ilgili faz X airdrop ödülüne hak kazanılır. 3 faz için airdrop oranları sırasıyla %5, %2, %1 şeklindedir.',
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
    },
    contributionsEmptyEnded: {
      title: 'Henüz ortak inşa kaydı yok',
      body: 'Ortak inşa programı sona erdi. Katılmayan hesapların burada kaydı yoktur.',
    },
    goBindReferrer: 'Referansı bağla',
    seasonLive: 'Devam ediyor',
    seasonEnded: 'Sona erdi',
    seasonUpcoming: 'Yakında',
  },
  rewards: {
    title: 'Ödüller',
    intro: 'Ödül kartı bakiyelerini ve ödeme kayıtlarını görüntüleyin.',
    backToHub: 'Ödüllere dön',
    claim: 'Talep et',
    claimSuccess: 'Talep başarılı',
    restakeSuccess: 'Yeniden stake başarılı',
    claimErrors: {
      zeroAmount: 'Talep tutarı 0.',
      invalidSigner: 'Geçersiz imza. Yenileyip tekrar deneyin.',
      alreadyUsed: 'Bu ödül zaten alındı. Tekrar talep etmeyin.',
      expired: 'İmza süresi doldu. Yenileyip tekrar talep edin.',
      noOrder: 'Talep edilecek ödül yok.',
      failed: 'Talep başarısız. Lütfen daha sonra tekrar deneyin.',
      confirmSyncFailed:
        'Ödül zincir üstünde başarıyla alındı ama senkron başarısız. Sayfayı yenileyin; tekrar talep etmeyin.',
    },
    hub: {
      asideTitle: 'AEGIS X ödülleri hakkında',
      asideBody:
        'Altı ödül kartı şans çekilişi, referans, katılım, ortak inşa, gelişim ödeneği ve genesis ortak inşayı kapsar.',
      aboutTitle: 'AEGIS X ödülleri hakkında',
      balanceLabel: 'Bakiye',
      filterAria: 'Ödülleri filtrele',
      hideZero: '0 varlıkları gizle',
      hideZeroEmpty: 'Sıfır olmayan ödül yok',
      balancePlaceholder: '0.00',
      signInForBalance: 'Görüntülemek için imzalayarak giriş yapın',
      enterClaim: 'Talebe gir',
      sessionHint:
        'Talep öncesi cüzdan imza girişini tamamlayın. Cüzdan bağlamak iş girişi değildir.',
      stats: {
        totalRewards: 'Toplam ödül',
        tier: 'Ortak inşa seviyesi',
        tierEmpty: 'Henüz ortak inşa seviyesi yok',
        personalHolding: 'Kişisel pozisyon',
        totalPerformance: 'Toplam performans',
        smallAreaPerformance: 'Küçük alan performansı',
        contribution: 'Katkı puanlarım',
        contributionHint: 'Talepler katkı puanını {ratio} harcar',
        goBurn: 'Yakıma git',
      },
      mechanismTitle: 'Ortak inşa ödül mekanizması',
      mechanismBody:
        'Ortak inşa ödülleri ekip Rebase getirisinden gelir ve seviyeye göre paylaşılır.',
      mechanismFooter:
        'Gerekli seviyeye ulaşan herhangi iki hat yükseltmeyi açar. A6–A9 tek hatla da yükselebilir: bir hat seviyeye ulaşır, diğer hatların toplam hacmi eşiği karşılar.',
      mechanismToggleAria: 'Yükseltme kuralını değiştir',
      aboutSlides: {
        lucky: {
          title: 'Şans ödülü',
          body: 'Günlük ödül havuzu en az $5,000. Tek seferde $5,000 ve üzeri katılım çekiliş hakkı verir; her gün 10 şanslı kullanıcı rastgele seçilerek havuz paylaşılır.',
        },
        referral: {
          title: 'Referans ödülü',
          body: 'Doğrudan davet ettiğiniz ortak inşaya katıldığında, her Rebase getirisinin %10’unu anında zincir üstünde alırsınız. Kendi pozisyon değerinizi $100’ün üzerinde tutun.',
        },
        participate: {
          title: 'Katılım ödülü',
          body: 'Davet bağlantısıyla bağlanıp ortak inşaya katıldıktan sonra, davet edenin Rebase getirisinin sizin pozisyonunuza eşit kısmının %10’unu, davet edilen olarak alırsınız.',
        },
        cobuild: {
          title: 'Ortak İnşa',
          body: 'Ekibin toplam Rebase getirisinden, ortak inşa kademenizin prim oranıyla ödenir (A1 %10 – A13 %130). Kademe yükseldikçe oran artar; aşağıdaki mekanizma tablosuna bakın.',
        },
        grant: {
          title: 'Gelişim ödeneği',
          body: 'MarketFund imzalı taleplerle ekosistem ödeneği.',
        },
        genesis: {
          title: 'Genesis ortak inşa ödülü',
          body: 'Genesis dönemi referans, seviye ve gelişim fonu ödülleri; uzlaşma penceresi kapanınca talep edilemez.',
        },
      },
      tierTable: {
        columns: [
          'Seviye',
          'Kişisel pozisyon',
          'Aktif hesaplar',
          'Ekip performansı',
          'Bonus oranı',
        ],
        rows: [
          {
            level: 'A1',
            holding: '$100',
            accounts: '2',
            team: 'Toplam performans ≥ $6,000',
            rate: '10%',
          },
          {
            level: 'A2',
            holding: '$100',
            accounts: '2',
            team: 'Toplam performans ≥ $20,000',
            rate: '20%',
          },
          {
            level: 'A3',
            holding: '$100',
            accounts: '2',
            team: 'Toplam performans ≥ $60,000',
            rate: '30%',
          },
          {
            level: 'A4',
            holding: '$500',
            accounts: '5',
            team: 'Toplam performans ≥ $180,000',
            rate: '40%',
          },
          {
            level: 'A5',
            holding: '$1,000',
            accounts: '5',
            team: 'Toplam performans ≥ $550,000',
            rate: '55%',
          },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: 'İki hat A5’e ulaşır',
            teamAlt: 'Tek hat A5’e ulaşır, diğer hatların hacmi ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: 'İki hat A6’ya ulaşır',
            teamAlt: 'Tek hat A6’ya ulaşır, diğer hatların hacmi ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: 'İki hat A7’ye ulaşır',
            teamAlt: 'Tek hat A7’ye ulaşır, diğer hatların hacmi ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: 'İki hat A8’e ulaşır',
            teamAlt: 'Tek hat A8’e ulaşır, diğer hatların hacmi ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: 'İki hat A9’a ulaşır',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: 'İki hat A10’a ulaşır',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: 'İki hat A11’e ulaşır',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: 'İki hat A12’ye ulaşır',
            rate: '130%',
          },
          {
            level: 'Ömür boyu başarı ödülü',
            holding: '$100,000',
            accounts: '20',
            team: 'İki hat A13’e ulaşır',
            rate: '%130 + küresel temettü %5',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Şans ödülü',
        body: 'Ortak inşa edenlere blok şans çekilişi',
        aside: 'Şans ödülleri Chainlink VRF kullanır; kazananlar Mixed ile talep eder.',
      },
      referral: {
        title: 'Referans ödülü',
        body: 'Ortak inşaya ortak davet ederek ödül kazanın',
        aside:
          'Doğrudan referansların Rebase’iyle ilgili ödüller; DaoPool Mixed üzerinden talep edilir (katkı {ratio}).',
      },
      participate: {
        title: 'Katılım ödülü',
        body: 'Referansınızdan ödüller',
        aside: 'Referans bağından katılım ödülleri; DaoPool Mixed ile talep (katkı {ratio}).',
      },
      cobuild: {
        title: 'Ortak İnşa',
        body: 'Uzun vadeli ekip ortak inşa teşvik ödülleri',
        aside: 'Ortak inşa ödülleri DaoPool Mixed ile alınır, katkı puanı gerekir.',
      },
      grant: {
        title: 'Gelişim ödeneği',
        body: 'Ekosistem gelişim özel ödeneği',
        aside:
          'Gelişim ödenekleri onay sonrası MarketFund imzasıyla talep edilir, doğrudan cüzdana gider.',
      },
      genesis: {
        title: 'Genesis ortak inşa ödülleri',
        body: 'Genesis dönemi doğrudan, seviye ve gelişim fonu ödülleri',
        aside: 'Genesis ortak inşa ödülleri RewardClaimer imzasıyla talep edilir.',
        badge: 'Yakında kapanıyor',
      },
    },
    detail: {
      claimable: 'Talep Edilebilir',
      emptyClaimable: 'Talep edilecek ödül yok.',
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: 'Talep ve yeniden stake oranı',
      releasePeriod: 'Serbest bırakma süresi seçimi',
      restakePeriod: 'Yeniden stake süresi seçimi',
      releaseAria: 'Serbest bırakma süresi seçimi',
      restakeAria: 'Yeniden stake süresi seçimi',
      releaseDays: '{days} g',
      restakeDays: '{days} g',
      daysTax: '{days} g · {tax}',
      scheduleJoin: ', ',
      taxRate: 'Vergi %{rate}',
      requiredContributionLabel: 'Bu talepte düşülecek katkı puanı',
      insufficientContributionDetail: 'Katkı puanı yetersiz (gerekli {need}, mevcut {have}), ',
      goBurnInline: 'Yakıma git',
      getContributionSuffix: ' katkı puanı alın.',
      releaseInto: 'Serbest bırakma havuzuna',
      restakeInto: 'Tek varlık stake’ine',
      restakeLabel: 'Yeniden stake',
      tokenGagx: 'gAGX',
      ctaReleaseLine: 'Talep et {amount}',
      ctaRestakeLine: 'Yeniden stake {amount}',
      requiredContribution: 'Bu talepte düşülecek katkı puanı: {amount}',
      insufficientContribution: 'Katkı puanı yetersiz. Önce katkı puanı alın.',
      goBurn: 'Katkı puanı al',
      luckyPaused: 'Şans ödül havuzu duraklatıldı; talep edilemez.',
      luckyNotClaimable: 'Talep edilecek şans ödülü yok.',
    },

    lucky: {
      dataTitle: 'Veri',
      todayPool: 'Bugünkü ödül havuzu',
      countdownHint: 'Sonraki çekiliş {time}',
      eligibility: 'Bugünkü uygunluk',
      eligibilityYes: 'Kazanıldı',
      eligibilityNo: 'Kazanılmadı',
      maxStakeHint: 'Bugünkü alımlar {amount}',
      cumulativeWins: 'Kümülatif kazanç',
      winsCount: '{count} kez',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Chainlink VRF v2.5 doğrulanabilir rastgelelik',
      vrfBody:
        'Şans ödülü Chainlink VRF v2.5 ile staking sözleşmelerini birleştirir: rastgelelik zincir üstünde şifreli kanıtla üretilir; sözleşme o günün listesinden 10 şanslı kullanıcı seçer. İnsan müdahalesi yok; herkes zincir üstünde doğrulayabilir.',
      verifyTutorial: 'Doğrulama rehberi',
      collapseTutorial: 'Rehberi kapat',
      vrfGuideStep1:
        'Sonuçlardaki veya geçmişteki doğrulama karmasına tıklayarak o turun çekiliş işlemini BscScan’de açın.',
      vrfGuideStep2:
        'İşlem Logs içinde Chainlink VRF geri çağrısını bulun; randomWords bu turun zincir üstü rastgeleliğidir ve kriptografik kanıt tahmin veya müdahaleyi engeller.',
      vrfGuideStep3:
        'Staking sözleşmesinin Read Contract sayfasında o günün tur kimliğiyle verifyDraw çağırarak kazanan listesini yeniden hesaplayın ve yayımlanan sonuçlarla karşılaştırın.',
      resultsTitle: 'Çekiliş sonuçları',
      dateFilterAria: 'Çekiliş tarihini seçin',
      resultsSummary: 'Çekiliş · {count} şanslı kullanıcı',
      verifyHash: 'Bu turun çekiliş hash’ini doğrula',
      meBadge: 'Ben',
      resultWon: 'Kazandı {amount}',
      resultLost: 'Kazanmadı',
      resultsColumns: ['Sıra', 'Kazanan adres', 'Yatır', 'Ödül'],
      emptyResults: 'Henüz çekiliş sonucu yok',
      historyTitle: 'Çekiliş geçmişi',
      historyColumns: ['Tarih', 'Yatır', 'Çekiliş sonucu', 'Doğrula'],
      emptyHistory: 'Henüz çekiliş kaydı yok',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Çekiliş hakkı nasıl kazanılır?',
            a: 'Günün ilk ≥ $5,000 stake veya tahvili otomatik o günün hakkını verir. Adres başına günde en fazla bir hak.',
          },
          {
            q: 'Çekiliş nasıl sonuçlanır?',
            a: '00:00 UTC’de Chainlink VRF v2.5 doğrulanabilir rastgelelik üretir; sözleşme o günün listesinden en fazla 10 kazanan seçer (günlük havuz hedefi ≥ $5,000).',
          },
          {
            q: 'Adaleti nasıl doğrularım?',
            a: 'VRF rastgeleliği zincir üstü kanıt içerir. Her sonucun yanındaki doğrulama bağlantısı ve doğrulama rehberiyle kazananları yeniden hesaplayın. Sonuçlar değiştirilemez.',
          },
          {
            q: 'Ödüller nasıl ödenir?',
            a: 'Ödüller çekiliş anı değerinde gAGX’e çevrilir ve Şans kartında birikir. Mixed kurallarıyla talep (1:1 katkı, serbest bırakma havuzu veya yeniden stake).',
          },
          {
            q: 'Neden $5,000 stake etmeme rağmen hakkım yok?',
            a: 'Hak, uzlaşma piyasa değerine göredir. Fiyat hareketiyle kayıtlı stake $5,000 altındaysa o gün hak yoktur. Bir tampon bırakın.',
          },
          {
            q: 'Vadeli olmayan staking çekiliş hakkı verir mi?',
            a: 'Hayır. Vadeli olmayan staking kişi başı günlük limite tabidir; tek bir stake $5,000’i aşmaz ve çekiliş hakkı tutarını karşılayamaz.',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'Veri',
      totalRewards: 'Toplam ödül',
      myPosition: 'Pozisyonum',
      directCount: 'Doğrudan referanslar',
      contribution: 'Katkı puanlarım',
      contributionHint: 'Talepler {ratio} harcar',
      nextPayout: 'Sonraki ödül dağıtımı',
      recordsTitle: 'Referans ödülü kayıtları',
      recordsColumns: ['Zaman', 'Tutar', 'Durum', 'Talep zamanı'],
      emptyRecords: 'Henüz ödül kaydı yok. Dağıtımdan sonra kayıtlar burada görünür.',
      referralsTitle: 'Referanslarım ({count})',
      referralsColumns: ['Katılım zamanı', 'Adres', 'Pozisyon', 'Kümülatif referans ödülü'],
      emptyReferrals:
        'Henüz doğrudan referans yok. Davet bağlantınızı paylaşın; ortaklar burada listelenir.',
      hideZeroPosition: '0 pozisyonları gizle',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Referans ödülü nasıl hesaplanır?',
            a: 'Her doğrudan referansın Rebase getirisinin %10’unu kazanırsınız; zincir üstünde uzlaşır, Referans kartında birikir.',
          },
          {
            q: 'Katılım ödülü koşulları neler?',
            a: 'Stake/tahvil pozisyon değeri $100 üzerinde kalmalıdır. Sonra doğrudan referansların Rebase getirisi payınıza işler.',
          },
          {
            q: 'Pozisyonum $100 görünürken neden katılım ödülü yok?',
            a: 'AGX fiyatı dalgalanır; uzlaşmada pozisyon $99.99 işaretlenip eşiği kaçırabilirsiniz. Tampon tutun.',
          },
          {
            q: 'Referansım benden çok daha fazla tutuyorsa yine tam %10 alır mıyım?',
            a: 'Evet. >$100 koşulunu sağlarsanız, pozisyon farkına bakılmaksızın Rebase getirilerinin tam %10’unu alırsınız.',
          },
          {
            q: 'Referans ödülü nasıl talep edilir?',
            a: 'Soldaki talep panelinde talep/yeniden stake oranını seçin: talep kısmı serbest bırakma havuzuna girer ve seçilen sürede doğrusal açılır; yeniden stake kısmı doğrudan tek token stake’ine girip bileşik üretir. Talep ve yeniden stake katkıyı 1:1 harcar.',
          },
          {
            q: 'Doğrudan referans sayısı nedir?',
            a: 'Davet bağlantınızla bağlanıp ilk katılımı tamamlayan cüzdanlar. Yalnızca ilk katman sayılır.',
          },
          {
            q: 'Ortak çıktıktan sonra referans ödülü devam eder mi?',
            a: 'Ödüller aktif pozisyona bağlıdır: pozisyon getiri üretirken devam eder, tamamen çıkınca durur. Kazanılmış tutarlar etkilenmez.',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'Veri',
      totalRewards: 'Toplam ödül',
      myPosition: 'Pozisyonum',
      contribution: 'Katkı puanlarım',
      contributionHint: 'Talepler {ratio} harcar',
      nextPayout: 'Sonraki ödül dağıtımı',
      recordsTitle: 'Katılım ödülü kayıtları',
      recordsColumns: ['Zaman', 'Tutar', 'Durum', 'Talep zamanı'],
      emptyRecords: 'Henüz ödül kaydı yok. Dağıtımdan sonra kayıtlar burada görünür.',
      inviterTitle: 'Davet edenim',
      inviterColumns: ['Bağlama zamanı', 'Adres', 'Pozisyon', 'Getirilen kümülatif ödül'],
      emptyInviter:
        'Henüz davet eden bağlı değil. Davet bağlantısıyla bağlandıktan sonra burada görünür.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Katılım ödülü nereden gelir?',
            a: 'Davet edenin bağlantısıyla bağlanıp ortak inşaya katılınca, o ilişkiden katılım ödülü kazanırsınız; zincir üstünde uzlaşır, Katılım kartında birikir.',
          },
          {
            q: 'Katılım ödülü nasıl hesaplanır?',
            a: 'Davet edenin Rebase getirisinin, sizin pozisyonunuzla eşleşen kısmının %10’unu alırsınız. Örnek: siz $10,000, davet eden $1,000 tutuyorsa tamamı eşleşir; $20,000 tutuyorsa yalnızca eşleşen $10,000’lık kısımdan %10 alırsınız.',
          },
          {
            q: 'Katılım ödülü koşulları neler?',
            a: 'Davet edenin bağlantısıyla bağlanın ve stake/tahvil pozisyon değerini $100 üzerinde tutun.',
          },
          {
            q: 'Pozisyonum $100 görünürken neden katılım ödülü yok?',
            a: 'AGX fiyatı dalgalanır; uzlaşmada pozisyon $99.99 işaretlenip eşiği kaçırabilirsiniz. Tampon tutun.',
          },
          {
            q: 'Katılım ödülü nasıl talep edilir?',
            a: 'Sol panelde talep/yeniden stake oranını seçin: talep kısmı seçilen sürede serbest bırakma havuzuna girer; yeniden stake tek varlık stake’ine gider. İkisi de katkı 1:1 harcar (DaoPool Mixed).',
          },
          {
            q: 'Davet eden değiştirilebilir mi?',
            a: 'Hayır. Referans bağı ilk bağlamada zincire yazılır ve kalıcıdır.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'Veri',
      totalRewards: 'Toplam ödül',
      totalPerformance: 'Toplam performans',
      myPosition: 'Pozisyonum',
      directCount: 'Doğrudan referanslar',
      contribution: 'Katkı puanlarım',
      contributionHint: 'Talepler {ratio} harcar',
      nextPayout: 'Sonraki ödül dağıtımı',
      tierTitle: 'Ortak inşa seviyesi',
      tierCurrent: 'Mevcut seviye',
      tierNext: 'Sonraki seviye',
      reqHolding: 'Kişisel pozisyon',
      reqHoldingHint: 'Stake ve tahvil pozisyon değeri',
      reqAccounts: 'Aktif hesaplar',
      reqAccountsHint: 'Aktif doğrudan referans adresleri',
      reqPerformance: 'Toplam performans',
      reqPerformanceHint: 'Tüm alt hat pozisyon toplamı',
      reqAchieved: 'Ulaşıldı',
      tierRate: 'Bonus oranı {rate}',
      tierProgress: '{level} yükseltme ilerlemesi',
      tierProgressCount: 'Karşılanan {done}/{total}',
      tierMax: 'En yüksek seviyeye ulaşıldı',
      recordsTitle: 'Ödül kayıtları',
      recordsTabsAria: 'Ödül kayıt türü',
      recordsTabCobuild: 'Ortak İnşa',
      recordsTabEqualize: 'Eşitleme ödülü',
      recordsColumns: ['Zaman', 'Seviye', 'Tutar', 'Durum', 'Talep zamanı'],
      emptyRecordsCobuild: 'Henüz ödül kaydı yok. Dağıtımdan sonra kayıtlar burada görünür.',
      emptyRecordsEqualize: 'Henüz eşitleme ödülü kaydı yok. Dağıtımdan sonra burada görünür.',
      teamTitle: 'Ekibim ({count})',
      teamColumns: ['Katılım zamanı', 'Adres', 'Ekip performansı', 'Ekip en yüksek seviye'],
      emptyTeam: 'Henüz ekip üyesi yok. Davet bağlantınızı paylaşın; ortaklar burada listelenir.',
      hideZeroMarket: '0 performansı gizle',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Ortak inşa ödülü nasıl hesaplanır?',
            a: 'Ortak inşa ödülü ekip Rebase getirisinden gelir; seviye bonus oranınızla ödenir (A1 %10 – A13 %130). Ödül ana sayfasındaki ortak inşa mekanizma tablosuna bakın.',
          },
          {
            q: 'Eşitleme ödülü nedir?',
            a: 'Alt hat seviyenizi yakalayınca veya geçince ortak inşa ödülleri farkınıza girmez. Eşitleme, o alt hat ortak inşa ödülünün %10’unu telafi olarak öder.',
          },
          {
            q: 'Eşitlemede seviye sınırı var mı?',
            a: 'Evet. Yalnızca sizden en fazla 2 seviye yukarıdaki alt hatları kapsar. Örnek: A2 iken A3/A4 eşitlenebilir; A5+ kapsam dışıdır ta ki yükselene kadar.',
          },
          {
            q: 'Ortak inşa seviyesi nasıl yükseltilir?',
            a: 'A1–A5 kişisel pozisyon, aktif hesap ve ekip performansına göredir. A6’dan itibaren çift hat (gerekli seviyede herhangi iki hat); A6–A9 tek hat + diğer hatlar performansı yolunu da destekler.',
          },
          {
            q: 'Ekip performansı nasıl sayılır?',
            a: 'Ekip performansı, tüm referans ağacınızdaki stake ve tahvil pozisyonlarının uzlaşma piyasa değeri toplamıdır.',
          },
          {
            q: 'Ortak inşa ve eşitleme ödülü nasıl talep edilir?',
            a: 'Soldaki talep panelinin üstünden Ortak inşa / Eşitleme’ye geçin, sonra talep/yeniden stake oranını ayarlayın: talep kısmı seçilen sürede doğrusal açılmak üzere serbest bırakma havuzuna girer; yeniden stake doğrudan tek token stake’ine girip bileşik üretir. İkisi de katkıyı 1:1 harcar.',
          },
          {
            q: 'Yeni seviye oranı ne zaman geçerli olur?',
            a: 'Seviyeler günlük uzlaşmada yeniden değerlendirilir; sonraki ortak inşa ödemesi yeni oranı kullanır; eşitleme kapsamı da yeni seviyeyle güncellenir.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: 'Onay bekliyor',
      pendingHint: 'Onay sonrası talep edilebilir hale gelir',
      pendingBody:
        'Ödenekleri açmak için destekle iletişime geçin; yalnızca onay sonrası talep edin.',
      contactSupport: 'Açmak için destekle iletişime geçin',
      claimIntoWallet: 'Cüzdana',
      ctaToWallet: '{amount} tutarını cüzdana talep et',
      dataTitle: 'Veri',
      tier: 'Ortak inşa seviyesi',
      totalClaimed: 'Toplam talep edilen ödül',
      recordsTitle: 'Ödenek kayıtları',
      recordsTabsAria: 'Ödenek kayıt türü',
      recordsTabIssue: 'Dağıtım',
      recordsTabClaim: 'Talep',
      issueColumns: ['Dağıtım zamanı', 'Tutar', 'Tür', 'Hash', 'Ödenek oranı', 'Ödenek tutarı'],
      claimColumns: ['Talep zamanı', 'Tutar', 'Hash'],
      emptyIssue: 'Henüz dağıtım kaydı yok. Ödenek birikince burada görünür.',
      emptyClaim: 'Henüz talep kaydı yok. Talep sonrası burada görünür.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Gelişim ödeneği nedir?',
            a: 'Ortak inşa edenlerin pazar açmasını destekleyen özel fon — tanıtım, topluluk etkinlikleri, kanallar; ekip stake pozisyonlarıyla orantılı birikir.',
          },
          {
            q: 'Ödenek ne için kullanılabilir?',
            a: 'Yalnızca pazar geliştirme: çevrimdışı salon ve yol gösteriler, topluluk operasyonu, tanıtım materyali, kanal genişletme.',
          },
          {
            q: 'Ödenek nasıl kullanılır?',
            a: 'İki yol: harcama öncesi başvuru (plana ve bütçeyi desteğe gönderin; onaylanan tutar talep edilebilir olur) veya sonrasında fiş/kanıtla geri ödeme.',
          },
          {
            q: 'Ödeneğim neden onay bekliyor?',
            a: 'Biriken ödenekler, kullanım planı veya gider kanıtı sunup destek onaylayana dek beklemede kalır. İlerleme ödenek kayıtlarında görünür.',
          },
          {
            q: 'Ödenek talep etmek katkı puanı harcar mı?',
            a: 'Hayır. Diğer ödüllerden farklı olarak gelişim ödenekleri katkı harcamaz ve serbest bırakma havuzuna girmez — gAGX doğrudan cüzdanınıza gider.',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: 'Ortak inşa ödülleri',
      pageSubtitle: 'Ortak inşaya katıl · büyüme değerini paylaş',
      claimToWallet: 'Cüzdana talep et',
      tierColumns: ['Seviye', 'Kişisel abonelik', 'Sistem performansı', 'Ödül oranı'],
      recordsTabsAria: 'Genesis ödül kayıt türü',
      recordsColumns: ['Zaman', 'Tür', 'Tutar', 'Durum'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Referans ödülü nasıl hesaplanır?',
            a: 'Referans ödülü %3’tür; sıkıştırılmış eş tutar uzlaşması — yalnızca eşleşen tutar sayılır; boş hesaplar katman atlar; ödemeler otomatik uzlaşır.',
          },
          {
            q: 'Genesis seviyesi nasıl yükseltilir?',
            a: 'Genesis seviyeleri S1’den S10’a kadardır; kişisel ortak inşa tutarı ve toplam organizasyon hacmine göre değerlendirilir. Üst seviyeler ayrıca çift hat yükseltme koşulunu gerektirir.',
          },
          {
            q: 'Seviye yükseltme ödülü nedir?',
            a: 'Ortak inşa sırasında ulaşılan Genesis seviyesi, protokol yayınından sonra otomatik bir kademe yükselir; 30 gün geçerlidir, ardından gerçek seviyenize döner.',
          },
          {
            q: 'Genesis ekip ödülleri nasıl uzlaştırılır?',
            a: 'Genesis ekip ödülleri eşleşen Genesis seviye oranında otomatik uzlaşır; cüzdana sizin talep etmeniz gerekir. Ortak inşa dönemi bitince bu sayfa kapanır; alınmamış ödüller bir daha talep edilemez ve akıllı piyasa yapıcı sözleşmeye gönderilir.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Ödüller hangi biçimde ödenir?',
          a: 'Tüm ödüller gAGX olarak uzlaşır ve her programın kurallarına göre eşleşen ödül kartlarına yatırılır. Bakiyeleri istediğiniz zaman Ödüller ana sayfasında görün.',
        },
        {
          q: 'Talep için ne gerekir?',
          a: 'Talep katkıyı 1:1 harcar (1 gAGX talep etmek 1 puan harcar). Puanlar AGX yakımından gelir; yetmezse önce Yakım sayfasından alın.',
        },
        {
          q: 'Talep edilen ödüller ne zaman gelir?',
          a: 'Talep ederken serbest bırakma süresi seçin. Ödüller serbest bırakma havuzuna girer ve doğrusal açılır — süre uzadıkça vergi düşer. Ödüllerin bir kısmını veya tamamını tek token stake’ine yeniden stake de edebilirsiniz.',
        },
        {
          q: 'Ödüller ne zaman uzlaşır?',
          a: 'Şans çekilişleri her gün 00:00 UTC’de uzlaşır. Diğer ödüller Rebase’i izler, yaklaşık her 12 saatte bir, bu yüzden aynı ritimde uzlaşır. Sonraki ödeme zamanı her ödül ayrıntı veri panelindedir.',
        },
        {
          q: 'Bazı ödül kartları neden tutar göstermiyor?',
          a: 'Sağ üst ayarlarda varsayılan «0 bakiyeli varlıkları gizle»dir, bu yüzden bakiyesi 0 olan kartlar gizlenir. Tüm ödül kartlarını görmek için işareti kaldırın.',
        },
      ],
    },

    teamRewardRate: 'Takım ödülü {rate}',
    superCommunityBadge: 'Süper Sistem',
    heroTierRewardBody: 'Takım ortak inşa tutarının {bonus} kadarını ödül olarak alın.',
    superCommunityBenefitBody: 'Süper Sistemler özel gelişim fonu ve yönetişim hakları alır.',
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
    communityFundLocked: 'Kilitli: {amount}',
    communityFundHistory: 'Gelişim fonu',
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
      pending: 'Alınacak',
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
    cobuildLevel: 'Ortak inşa seviyesi',
    makingLevel: 'Piyasa yapıcılık seviyesi',
    inviteTitle: 'Davet etmeye başlayın · Ekosistem büyüme değerini paylaşın',
    programs: {
      title: 'Ekosistem destek programları',
      items: [
        {
          label: 'X DAO Ortak İnşa · Faz {season}',
          title: 'Küresel ortak inşa programı devam ediyor',
          body: 'Dünya çapındaki ortak inşa edenleri bir araya getirerek ekosistem inşasına katılın.',
          action: 'Plan detaylarını görüntüle →',
          href: 'https://xdaoaegis.notion.site/genesis-rezerv-konseyi-program',
        },
        {
          label: 'X Akademi',
          title: 'Ortak inşa edenler için ekosistem eğitim programı',
          body: 'Ortak inşa edenlerin ekosistem mekanizmalarını ve gelişim planını daha derin anlamasına yardımcı olur.',
          action: 'Plan detaylarını görüntüle →',
          href: 'https://xdaoaegis.notion.site/x-akademisi-tur',
        },
      ],
    },
    myInvites: 'Direkt davetlilerim ({count})',
    referralBondPermanent: 'Davet ilişkisi etkinleştirildi · kalıcı olarak bağlandı.',
    volumePrefix: 'Performans',
    statToday: 'Bugün +{count} · +{amount}',
    statRewardRate: 'Ödül oranı {rate}',
    bindReferrerSuccess: 'Öneren bağlama başarılı',
    inviteFlow: {
      rewardLink: 'Ödüller',
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
          title: 'Ödül kazanın',
          body: 'Ortak inşadan sonra ödüller rebase dağıtımıyla birlikte hesaplanır. Almak için {link} bölümüne gidin.',
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
          q: 'Genesis referans ödülleri nasıl hesaplanır?',
          a: 'Genesis referans ödülleri %3’tür; sıkıştırılmış eşit tutar mahsuplaşması kullanır, yalnızca eşit tutar kısmı sayılır.',
        },
        {
          q: 'Genesis rütbemi nasıl yükseltebilirim?',
          a: 'Kişisel ortak inşa tutarı ve sistem performansına göre S1’den S10’a kademeli yükselirsiniz.',
        },
        {
          q: 'Sistem gelişim ödeneği niteliği nasıl alınır?',
          a: 'Sistem kümülatif performansı $1,000,000’a ulaşınca %5 gelişim fonu alabilirsiniz. Başvuru için davet edeninizden yardım isteyin.',
        },
      ],
    },
  },
  assets: {
    title: 'Varlıklar',
    intro: 'AEGIS X ekosistem fonlarınızı yönetin',
    body: 'AEGIS X ekosistem fonlarınızı yönetin',
    backToHub: 'Varlıklara dön',
    blocked: {
      zeroAmount: 'Geçerli bir tutar girin',
      insufficientReward: 'Talep edilebilir getiri yetersiz',
      insufficientContribution: 'Katkı puanı yetersiz — önce AGX yakıp katkı puanı alın',
      planUnresolved: 'Serbest bırakma/yeniden stake planı hazır değil — daha sonra deneyin',
      nothingToRedeem: 'Şu an geri alınabilir tutar yok',
      warmupActive: 'Isınma bitmedi, işlem yapılamaz',
      warmupNotEnded: 'Isınma geri sayımı henüz bitmedi',
      noWarmup: 'Etkinleştirilecek ısınma pozisyonu yok',
      unavailable: 'İşlem geçici olarak kullanılamıyor, daha sonra deneyin',
    },
    position: {
      sort: 'Sırala',
      quoteCurrency: 'Fiyat birimi',
      sortOptions: {
        startNear: 'Başlangıç · yeniden eskiye',
        startFar: 'Başlangıç · eskiden yeniye',
        endNear: 'Vade · yakından uzağa',
        endFar: 'Vade · uzaktan yakına',
      },
      emptyTitle: 'Varlıklarınızla getiri üretmeye başlayın',
      pageSize: 5,
      voucher: 'Belge',
      remaining: 'Kalan süre',
      staked: 'Stake edilen',
      payout: 'Geri alınacak',
      bondPrincipal: 'Tahvil anaparası',
      yield: 'Getiri',
      claim: 'Talep et',
      redeem: 'Geri al',
      unstake: 'Stake’ten çıkar',
      liquid: 'Esnek',
      lockedPrefix: 'Kilitli',
      redeemAnytime: 'İstediğiniz zaman geri alınabilir',
      fullyReleased: 'Tamamen serbest',
      activateWarmup: 'Kilidi aç',
      activateWarmupSuccess: 'Kilit açıldı',
      warmupRemainingEpochs: 'Kalan {n} Epoch',
    },
    opsColumns: ['Zaman', 'İşlem', 'Tutar', 'İşlem hash’i'],
    claim: {
      title: 'Getiriyi talep et',
      amount: 'Talep tutarı',
      splitAria: 'Serbest bırakma ve yeniden stake oranı',
      releasePeriod: 'Serbest bırakma süresi seçimi',
      releasePeriodAria: 'Serbest bırakma süresi seçimi',
      restakePeriod: 'Yeniden stake süresi seçimi',
      restakePeriodAria: 'Yeniden stake süresi seçimi',
      releaseDays: '{days} g',
      restakeDays: '{days} g',
      restakeDaysTax: '{days} g · {tax}',
      taxRate: 'vergi %{rate}',
      contribNeed: 'Bu talep {amount} katkı puanı düşer',
      contribShort: 'Katkı puanı yetersiz — önce AGX yakıp katkı puanı alın',
      goBurn: 'Yakıma git',
      ctaMixed: 'Yeniden stake ve talep et',
      ctaRelease: 'Talep et',
      ctaRestake: 'Yeniden stake',
      success: 'Talep gönderildi',
      restakeSuccess: 'Yeniden stake gönderildi',
      xmineSuccess: 'X ödül talebi gönderildi',
    },
    claimOutput: {
      title: 'Getiri talep et',
      rewardLabel: 'Getiri',
      boostLabel: 'Bonus',
      claimReward: 'Getiri talep et',
      claimBoost: 'Bonus talep et',
      contribDeduct: '{amount} katkı puanı düşülür',
    },
    redeem: {
      releasedLabel: 'Serbest bırakıldı',
      title: 'Stake geri al',
      body: 'Geri alma sonrası varlıklar tampona girer ve {days} günlük doğrusal serbest bırakmaya tabi olur. Tampondaki varlıklar getiri üretmez',
      confirmCta: 'Geri al',
      success: 'Geri alma gönderildi — anapara serbest bırakma tamponuna girdi',
    },
    hub: {
      filterAria: 'Varlıkları filtrele',
      hideZero: '0 varlıkları gizle',
      hideZeroEmpty: 'Sıfır olmayan pozisyon yok',
      card: {
        position: 'Pozisyon',
        yield: 'Toplam getiri',
      },
      modes: {
        stake: {
          title: 'Yatır',
          body: 'AGX esnek / vadeli pozisyonları yönet',
          aprHint:
            'Alınmış staking getirisi ile alınmamış staking getirisi ve bonus getirinin toplamının oranı',
        },
        lpbond: {
          title: 'LP Tahvil',
          body: 'Likidite tahvil pozisyonlarını yönet',
          aprHint:
            'Alınmış LP tahvil getirisi ile alınmamış LP tahvil getirisinin toplamının oranı',
        },
        burnbond: {
          title: 'Yakım Tahvili',
          body: 'Yakım tahvil pozisyonlarını yönet',
          aprHint:
            'Alınmış yakım tahvili getirisi ile alınmamış yakım tahvili getirisinin toplamının oranı',
        },
        xmine: {
          title: 'X Madencilik',
          body: 'gAGX madencilik pozisyonlarını yönet',
          aprHint:
            'Alınmış madencilik çıktısı ile alınmamış madencilik çıktısının toplamının oranı',
        },
      },
      overview: {
        title: 'Varlık özeti',
        totalValue: 'Toplam varlık değeri',
        totalValueHint: 'Anapara + alınmamış getirinin piyasa değeri',
        claimable: 'Talep edilebilir getiri',
        claimed: 'Toplam talep edilen',
        contribution: 'Katkı puanlarım',
        contributionHint: 'Getiri talepleri {ratio} katkı harcar',
        holdingsTitle: 'Pozisyonlar',
        holdingsReleased: 'Serbest bırakıldı',
        holdingsTotal: 'Toplam pozisyon',
        bufferTitle: 'Tampon havuzu',
        bufferHint:
          'Stake çözülünce anapara, {days} günlük ikincil doğrusal serbest bırakma için tampon havuzuna girer; kısa vadeli toplu çıkışın likiditeye baskısını azaltır ve süreklilik ile piyasa istikrarını dengeler.',
        bufferTotal: 'Kasada',
        bufferReleased: 'Serbest bırakıldı',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'Tampon varlık görünümünü değiştir',
      },
      distribution: {
        title: 'Pozisyon dağılımı',
        empty: 'Henüz pozisyon yok. Stake veya tahvil alınca dağılım burada görünür.',
      },
      rebase: {
        title: 'Rebase getiri serbest bırakma mekanizması',
        subtitle:
          'Aşamalı uzlaşma ve sürekli serbest bırakma oynaklığı azaltır, uzun vadeli büyümeyi destekler',
        steps: [
          { title: 'Block', body: 'Blok çalışma\\nTemel birim' },
          { title: 'Epoch', body: '~{blocks} blok\\n~{hours} saat' },
          { title: 'Rebase', body: 'Epoch sonu\\nOtomatik uzlaşma' },
          { title: 'Rebase', body: 'Getiri dağıtımı\\nGünde {timesPerDay} kez' },
        ],
        tags: [
          'Blok güdümlü çalışma',
          'Epoch güdümlü uzlaşma',
          'Rebase güdümlü dağıtım',
          'Yumuşak getiri serbest bırakma',
        ],
        footer: 'Bloklar döngüyü sürer; Epoch’lar uzlaştırır; Rebase getiriyi dağıtır',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Toplam varlık değeri nasıl hesaplanır?',
            a: 'Toplam varlık değeri = pozisyon anaparası + alınmamış getiri + madencilik çıktısı, güncel piyasa fiyatlarıyla. Boştaki cüzdan bakiyesi dahil değildir; fiyat hareketi değerlemeyi anlık günceller.',
          },
          {
            q: 'Getiri hangi biçimde ödenir?',
            a: 'Stake, LP tahvil ve yakım tahvilinin Rebase getirisi gAGX olarak uzlaşır. gAGX’i 1:1 AGX’e çevirin veya X Madenciliğe kullanın. X Madencilik çıktısı ekosistem değer tokenı X’tir ve istediğiniz zaman talep edilebilir.',
          },
          {
            q: 'Neden getiri talep edemiyorum?',
            a: 'Getiri talep etmek katkı puanı harcar. Hesapta yeterli yoksa talep ilerleyemez — önce katkı puanı için AGX alıp yakın, sonra Varlıklara dönün. Katkı puanı mekanizması her getiri çekiminin protokol deflasyonuna da katkı vermesini sağlar.',
          },
          {
            q: 'Katkı puanı nasıl kazanılır?',
            a: 'AGX alıp yakarak katkı puanı alın. Talepler katkı puanını 1:1 harcar (1 gAGX talep etmek 1 katkı puanı harcar); talep edeceğiniz getiri için yeterince hazırlayın.',
          },
          {
            q: 'Talepte neden serbest bırakma süresi seçilir?',
            a: 'Talep edilen getiri anında gelmez. Seçilen sürede doğrusal açılır; süre uzadıkça vergi düşer: 5 gün %20, 20 gün %10, 40 gün %5, 60 gün %1.',
          },
          {
            q: 'Talep edilen getiri nereye gider?',
            a: 'Talep edilen getiri doğrudan cüzdana gitmez. Serbest bırakma havuzuna girer ve seçtiğiniz sürede doğrusal açılır. Her talebi izlemek için serbest bırakma havuzunu açın; serbest bırakılan tutarlar cüzdana çekilebilir.',
          },
          {
            q: 'Yeniden stake ile talep farkı nedir?',
            a: 'Yeniden stake serbest bırakma süresini atlar — getiri doğrudan tek token stake’ine girip bileşik üretmeye devam eder, daha iyi vergi oranıyla (360 gün %15, 540 gün %10); uzun vadeli katılımcılara uygundur. Talep, serbest bırakma süresinde cüzdana açılır ve daha esnektir.',
          },
          {
            q: 'Tampon havuzu nedir?',
            a: 'Anapara stake’ten çıktıktan sonra tampon havuzuna 30 günlük ikincil doğrusal serbest bırakmaya girer; kısa vadeli yığılmış çıkışları azaltır. Tampondaki Serbest bırakıldı işaretli tutarlar istediğiniz zaman cüzdana geri alınabilir.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Stake pozisyonları',
        intro: 'Her stake’i yönetin — istediğiniz zaman getiri talep edin veya anaparayı geri alın',
        empty:
          'Henüz stake pozisyonu yok. Stake işlemi tamamlandığında her pozisyon burada görünür.',
        emptyCta: 'İlk stake pozisyonunuzu açın ve getiri kazanmaya başlayın',
        stats: {
          title: 'Pozisyon verileri',
          metrics: [
            { label: 'Pozisyonlarım' },
            { label: 'Serbest bırakıldı' },
            { label: 'Serbest bırakılacak' },
            {
              label: 'Güncel Rebase getiri oranı',
              hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
            },
            {
              label: 'Güncel Rebase bonusu',
              hint: 'Talep edilmemiş Rebase bonusu bileşik getiri üretmez',
            },
            {
              label: 'Toplam stake getirisi',
              hint: 'Talep edilmiş ve edilmemiş stake getirisinin toplamı',
            },
          ],
        },
        ops: {
          title: 'İşlem kayıtları',
          empty: 'Henüz işlem yok. Stake, talep veya geri alma sonrası kayıtlar burada görünür.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Talep ile geri alma farkı nedir?',
              a: 'Talep getiri içindir: biriken gAGX’i seçilen serbest bırakma süresinde alın veya yeniden stake edin. Geri alma anapara içindir: serbest bırakılmış AGX anaparasını 30 günlük tampona ikinci doğrusal serbest bırakma için alın, sonra cüzdana.',
            },
            {
              q: 'Neden her stake ayrı gösterilir?',
              a: 'Her stake kendi süresini, getirisini, bonusunu ve serbest bırakma ilerlemesini izler. Vade ve kullanılabilir işlemler diğer pozisyonları etkilemez, bu yüzden ayrı gösterilir ve işlenir.',
            },
            {
              q: '«Serbest bırakıldı» ne demek?',
              a: 'Anapara blok bazında doğrusal açılır (~3 saniye/blok). «Serbest bırakıldı» o anda açılmış ve istenince geri alınabilir kısımdır; geri kalan süre boyunca açılmaya devam eder.',
            },
            {
              q: 'Geri sayım bitince ne olur?',
              a: 'Geri sayım bitince anapara serbest bırakması tamamdır ve tüm anapara istenince geri alınabilir. Alınmamış anapara hâlâ getiri üretir. Anaparayı geri aldıktan sonra alınmamış getiri geçersiz olmaz ve bileşik üretmeye devam eder.',
            },
            {
              q: 'Talepte yeniden stake oranı nasıl çalışır?',
              a: 'Kaydırıcıyla yeniden stake ve talep oranını ayırın. Yeniden stake kısmı seçilen sürenin tek token stake’ine doğrudan girer ve bileşik üretir (daha iyi vergi). Talep kısmı seçilen serbest bırakma süresinde doğrusal açılır.',
            },
          ],
        },
      },
      lpbond: {
        title: 'LP tahvil pozisyonları',
        intro: 'Her tahvili yönetin — istediğiniz zaman getiri talep edin veya anaparayı geri alın',
        empty: 'Henüz LP tahvil pozisyonu yok. Tahvil alınca her pozisyon burada görünür.',
        emptyCta: 'İlk LP Tahvilinizi alın, getiri kazanmaya başlayın',
        stats: {
          title: 'Pozisyon verileri',
          metrics: [
            { label: 'Pozisyonlarım' },
            { label: 'Serbest bırakıldı' },
            { label: 'Serbest bırakılacak' },
            {
              label: 'Güncel Rebase getiri oranı',
              hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
            },
            {
              label: 'Toplam LP tahvil getirisi',
              hint: 'Talep edilmiş ve edilmemiş LP tahvil getirisinin toplamı',
            },
          ],
        },
        ops: {
          title: 'İşlem kayıtları',
          empty: 'Henüz işlem yok. Stake, talep veya geri alma sonrası kayıtlar burada görünür.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Talep ile geri alma farkı nedir?',
              a: 'Talep getiriyi işler: tahvil gAGX getirisini seçilen sürede alın veya yeniden stake edin. Geri alma anaparayı alır: serbest bırakılmış AGX 30 günlük tampona girer, sonra cüzdana gelir.',
            },
            {
              q: '«Tahvil anaparası» nereden gelir?',
              a: 'LP tahvil için ödenen USD1 indirimli AGX’e çevrilir — bu AGX tahvil anaparasıdır. 180/360/540 günde blok doğrusal serbest bırakılır; «serbest bırakılan» kısım istediğiniz zaman geri alınabilir.',
            },
            {
              q: 'Neden her tahvil ayrı gösterilir?',
              a: 'Her tahvil kendi süresi, indirimi, getirisi ve serbest bırakmasını izler; işlemler pozisyon bazlı kalır.',
            },
            {
              q: 'Tahvil getirisi yeniden stake edilebilir mi?',
              a: 'Evet. Talepte serbest bırakma/yeniden stake oranını ayırın; yeniden stake 360/540 gün tek varlık stake’ine gider, vergi dönem talebinden daha iyidir.',
            },
            {
              q: 'Geri sayım bitince ne olur?',
              a: 'Geri sayım bitince anapara serbest bırakması tamamdır; tüm anapara istenince geri alınabilir. Alınmamış getiri bileşik üretmeye devam eder.',
            },
            {
              q: 'LP tahvilinin LP’si geri alınabilir mi?',
              a: 'Hayır. AGX/USD1 LP, protokol likiditesi olarak yakım adresine kalıcı kilitlenir; siz indirimli AGX anaparası ve getirisini tutarsınız.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Yakım tahvil pozisyonları',
        intro: 'Her tahvili yönetin — istediğiniz zaman getiri talep edin veya anaparayı geri alın',
        empty: 'Henüz yakım tahvil pozisyonu yok. Tahvil alınca her pozisyon burada görünür.',
        emptyCta: 'İlk Yakım Tahvilinizi alın, getiri kazanmaya başlayın',
        stats: {
          title: 'Pozisyon verileri',
          metrics: [
            { label: 'Pozisyonlarım' },
            { label: 'Serbest bırakıldı' },
            { label: 'Serbest bırakılacak' },
            {
              label: 'Güncel Rebase getiri oranı',
              hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
            },
            {
              label: 'Toplam yakım tahvil getirisi',
              hint: 'Talep edilmiş ve edilmemiş yakım tahvili getirisinin toplamı',
            },
          ],
        },
        ops: {
          title: 'İşlem kayıtları',
          empty: 'Henüz işlem yok. Stake, talep veya geri alma sonrası kayıtlar burada görünür.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Talep ile geri alma farkı nedir?',
              a: 'Talep getiriyi işler: tahvil gAGX getirisini seçilen sürede alın veya yeniden stake edin. Geri alma anaparayı alır: serbest bırakılmış AGX 30 günlük tampona girer, sonra cüzdana gelir.',
            },
            {
              q: '«Tahvil anaparası» nereden gelir?',
              a: 'Yakım tahvili için ödenen USD1 indirimli AGX’e çevrilir — bu AGX tahvil anaparasıdır. 180/360/540 günde blok doğrusal serbest bırakılır; «serbest bırakılan» kısım istediğiniz zaman geri alınabilir.',
            },
            {
              q: 'Neden her tahvil ayrı gösterilir?',
              a: 'Her tahvil kendi süresi, indirimi, getirisi ve serbest bırakmasını izler; işlemler pozisyon bazlı kalır.',
            },
            {
              q: 'Tahvil getirisi yeniden stake edilebilir mi?',
              a: 'Evet. Talepte serbest bırakma/yeniden stake oranını ayırın; yeniden stake 360/540 gün tek varlık stake’ine gider, vergi dönem talebinden daha iyidir.',
            },
            {
              q: 'Geri sayım bitince ne olur?',
              a: 'Geri sayım bitince anapara serbest bırakması tamamdır; tüm anapara istenince geri alınabilir. Alınmamış getiri bileşik üretmeye devam eder.',
            },
            {
              q: 'Yakım Tahvili AGX’i nasıl etkiler?',
              a: 'Yakım Tahvili fonları AGX alır ve kara delik adresine kalıcı yakar — dolaşımı azaltır, deflasyonu güçlendirir; siz indirimli anapara ve getiri kazanırsınız.',
            },
          ],
        },
      },
      xmine: {
        title: 'X madencilik pozisyonları',
        intro:
          'Her madencilik stake’ini yönetin — istediğiniz zaman çıktıyı talep edin veya anaparayı geri alın',
        empty:
          'Henüz X madencilik pozisyonu yok. gAGX stake edip madenciliğe başlayınca pozisyonlar burada görünür.',
        emptyCta: 'X madenciliği için gAGX stake edin',
        periodPill: 'Madencilik stake’i',
        output: 'Çıktı',
        stats: {
          title: 'Pozisyon verileri',
          metrics: [
            { label: 'Madencilik stake’im' },
            { label: 'Serbest bırakıldı' },
            { label: 'Güncel madencilik çıktısı' },
            {
              label: 'Toplam madencilik çıktısı',
              hint: 'Talep edilmiş ve edilmemiş madencilik çıktısının toplamı',
            },
          ],
        },
        ops: {
          title: 'İşlem kayıtları',
          empty: 'Henüz işlem yok. Stake, talep veya geri alma sonrası kayıtlar burada görünür.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Çıktı talebi ile stake geri alma farkı nedir?',
              a: 'Talep madencilik çıktısını alır: X serbest bırakma süresi olmadan cüzdana gider. Geri alma anaparayı hedefler: gAGX 30 günlük tampona girer ve getiri üretmez.',
            },
            {
              q: 'Bazı pozisyonlar neden «Kilitli» gösterir?',
              a: 'Her gAGX stake 24 saat kilitlenir; kilitte geri alınamaz. Geri sayım sonrası «İstediğiniz zaman geri alınabilir» görünür.',
            },
            {
              q: 'Madencilik çıktısı nasıl hesaplanır?',
              a: 'Her gün UTC 0’da altın standardıyla uzlaşır: stake gAGX’in USD değeri × günlük oran, X olarak ödenir. Tutar AGX ve X fiyatlarıyla değişir.',
            },
            {
              q: 'Madencilik çıktısı bileşik midir?',
              a: 'Otomatik bileşik yok. X’i elle talep edin; pozisyonu büyütmek için kota içinde daha fazla gAGX stake edin.',
            },
            {
              q: 'Stake kotam neden değişir?',
              a: 'gAGX stake kotası ≥180 gün AGX tahvil + AGX stake toplamını aşamaz. Tahvil/uzun stake artırınca kota yükselir; vade bitince düşer.',
            },
            {
              q: 'Geri alma sonrası çıktı devam eder mi?',
              a: 'Hayır. Geri alınan gAGX tampona girince madenciliği durur; diğer pozisyonlar normal devam eder.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Stake işlemi',
    intro: 'Stake ve tahvillerle ortak inşa — Rebase bileşik getiriyi paylaşın',
    body: 'Stake ve tahvillerle ortak inşa — Rebase bileşik getiriyi paylaşın',
    backToHub: 'Staking’e dön',
    max: 'Maks',
    blocked: {
      notBound: 'Önce referans bağlayın',
      accountMigrated: 'Bu adres taşındı — yeni adresi kullanın',
      migrationNotOpen: 'Hesap taşıma henüz açık değil',
      insufficientBalance:
        'Cüzdan bakiyesi yetersiz, tutarı azaltın veya önce yükleyip tekrar deneyin',
      insufficientGagx:
        'gAGX bakiyesi yetersiz: önce Flash ile AGX’i gAGX’e sarın, sonra tekrar deneyin',
      insufficientAllowance: 'Yetersiz onay',
      insufficientQuota: 'Stake kotası aşıldı, tutarı küçültüp tekrar deneyin',
      insufficientQuotaWithAmount:
        'Stake kotası aşıldı: şu an en fazla {quota} AGX daha stake edilebilir. Tutarı küçültüp tekrar deneyin.',
      insufficientQuotaPersonalWithAmount:
        'Kişisel stake kotanız aşıldı: kişisel kümülatif üst sınırınızda {quota} AGX kaldı, tutarı küçültüp tekrar deneyin.',
      insufficientQuotaPersonalDailyWithAmount:
        'Bugünkü stake kotanız aşıldı: bugünkü kişisel kotanızda {quota} AGX kaldı, tutarı küçültün veya kota yenilenene kadar bekleyip tekrar deneyin.',
      insufficientQuotaPoolWithAmount:
        'Zincir üstü stake havuzu kotası yetersiz: havuzda şu an {quota} AGX kaldı, tutarı küçültün veya daha sonra tekrar deneyin.',
      insufficientXmineQuotaWithAmount:
        'Mining kotanız aşıldı: mining kotası kilitli anaparanıza bağlıdır, şu an en fazla {quota} gAGX daha stake edilebilir. Tutarı küçültün veya önce kilitli pozisyon ekleyip tekrar deneyin.',
      poolPaused: 'Bu staking havuzu geçici olarak kapalı, lütfen daha sonra tekrar deneyin',
      depositoryNotAuth:
        'Bu tahvil piyasası henüz alıma açılmadı, dönem değiştirin veya daha sonra tekrar deneyin',
      insufficientDebtCapacity:
        'Bu tahvil piyasasının kalan satış kotası yetersiz, satın alma tutarını azaltın veya daha sonra tekrar deneyin',
      bondTooSmall:
        'Satın alma tutarı çok küçük: iskonto sonrası ödeme asgari tutarın altında. Satın alma tutarını artırıp tekrar deneyin',
      bondTooLarge:
        'Satın alma tutarı çok büyük: bu tahvilin işlem başına ödeme üst sınırını aşıyor. Satın alma tutarını azaltıp tekrar deneyin',
      zeroAmount: 'Geçerli bir tutar girin',
      unavailable: 'İşlem geçici olarak kullanılamıyor — daha sonra deneyin',
    },
    hub: {
      modes: {
        stake: {
          title: 'Yatır',
          body: 'AGX stake edin — günde {timesPerDay} Rebase bileşik getiri',
        },
        lpbond: {
          title: 'LP Tahvil',
          body: 'USD1 ile taban havuzu inşa edin — indirimli AGX alın',
        },
        burnbond: {
          title: 'Yakım Tahvili',
          body: 'İndirimli AGX basın ve deflasyon için kalıcı yakın',
        },
        xmine: {
          title: 'X Madencilik',
          body: 'gAGX stake edin, zararsız X ekosistem ödülü madenciliği',
        },
        calc: {
          title: 'Getiri hesaplayıcı',
          body: 'Farklı süre ve fiyatlarda beklenen getiriyi hesaplayın',
        },
      },
      overview: {
        title: 'Genel bakış',
        metrics: [
          {
            id: 'tvl',
            label: 'Stake TVL',
            hint: 'Protokolde stake edilen toplam AGX ve yaklaşık USD değeri',
          },
          {
            id: 'mcap',
            label: 'Piyasa değeri',
            hint: 'Dolaşımdaki AGX’in toplam değeri',
          },
          {
            id: 'circulating',
            label: 'AGX dolaşımı',
            hint: 'Piyasada dolaşan AGX miktarı',
          },
          {
            id: 'treasury',
            label: 'Düşünce kuruluşu rezervi',
            hint: 'Basım, piyasa yapıcılık ve risk savunmasını destekleyen rezerv varlıklar',
          },
          {
            id: 'price',
            label: 'AGX fiyatı',
            hint: 'AGX’in USD1’e göre piyasa referans fiyatı',
          },
          {
            id: 'burned',
            label: 'Toplam yakım',
            hint: 'Yakım tahvili ve katkı alımıyla yakılan AGX toplamı',
          },
          {
            id: 'rebase',
            label: 'Güncel Rebase getiri oranı',
            hint: 'Her Epoch’ta (~{hours} sa) bir kez uzlaşır; protokol durumuna göre ayarlanır',
          },
          {
            id: 'runway',
            label: 'Çalışabilir dönem',
            hint: 'Güncel rezerv ve harcamaya göre tahmini sürdürülebilir çalışma süresi',
          },
          {
            id: 'stakers',
            label: 'Stake adresi sayısı',
            hint: 'Ağda stake eden benzersiz adres sayısı',
          },
        ],
      },
      periodTable: {
        title: 'Stake süreleri ve getiriler',
        segmentAria: 'Süre tablosu ürün geçişi',
        segs: {
          stake: 'Yatır',
          lpbond: 'LP Tahvil',
          burnbond: 'Yakım Tahvili',
        },
        columns: [
          'Hesaplanan süre',
          'Temel günlük getiri oranı',
          'Getiri bonusu',
          'Dönem getiri oranı',
        ],
        bondColumns: [
          'Hesaplanan süre',
          'Temel günlük getiri oranı',
          'İndirim oranı',
          'Dönem getiri oranı',
        ],
        rows: [
          { id: 'liquid', period: 'Esnek (süreli)' },
          { id: '180', period: '180 g' },
          { id: '360', period: '360 g' },
          { id: '540', period: '540 g' },
        ],
      },
      runwayDays: '> {days} g',
      chart: {
        title: 'Metrikler',
        metricTabs: {
          tvl: 'Stake TVL',
          mcap: 'Piyasa değeri',
        },
        metricAria: 'Metrik geçişi',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Rebase nasıl uzlaşır?',
            a: 'Protokol bloklarla çalışır: ~14,400 blok = 1 Epoch (~12 saat). Rebase her Epoch sonunda uzlaşır — günde 2 kez.',
          },
          {
            q: 'Anapara nasıl serbest bırakılır?',
            a: 'Stake ve tahvil anaparası blok düzeyinde doğrusal serbest bırakılır (~3 sn/blok). Çekim sonrası serbest bırakılan anapara 30 günlük tampona girer.',
          },
          {
            q: 'Stake, LP Tahvil ve Yakım Tahvili farkı nedir?',
            a: 'Stake doğrudan AGX yatırıp Rebase bileşik getirisi alır. LP ve Yakım tahvilleri USD1 ile indirimli AGX alır — LP kalıcı taban likidite kurar; Yakım AGX’i kalıcı yakarak deflasyonu güçlendirir. Üçünde de anapara süreye göre doğrusal serbest bırakılır ve Rebase kazanılır.',
          },
          {
            q: 'Getiri hangi biçimde ödenir?',
            a: 'Ürünlerdeki Rebase getirileri gAGX olarak uzlaşır. gAGX’i 1:1 AGX’e çevirin veya X madenciliği için stake edin.',
          },
          {
            q: 'Düşünce kuruluşu rezervi ne işe yarar?',
            a: 'Rezerv (USD1) protokolü destekler: %150 aşırı teminatlı AGX basımı, AI piyasa yapıcılık ve risk savunması. Çalışabilir dönem rezerv/harcama tahminidir.',
          },
          {
            q: 'Ürünü nasıl seçmeliyim?',
            a: 'Bileşik tercih → Stake. İndirimli AGX → LP veya Yakım Tahvili. gAGX ile ekosistem getirisi → X Madencilik. Önce hesaplayıcıyla süreleri karşılaştırın.',
          },
          {
            q: 'Piyasa değeri ve AGX dolaşımı nasıl anlaşılır?',
            a: 'Dolaşımdaki arz piyasadaki AGX’tir; piyasa değeri = dolaşım × fiyat. TVL ve yakılan arzla birlikte kilit oranı ve deflasyon ilerlemesini gösterir.',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: 'sa', minutes: 'dk', seconds: 'sn' },
      overview: 'Genel bakış',
      positions: 'Pozisyonlarım',
      positionsHint: 'Talep, geri alma ve stake’ten çıkarma Varlıklar sekmesindedir.',
      viewPositions: 'Görüntüle',
      mechanism: 'Nasıl çalışır',
      faq: 'SSS',
      recordsTitles: {
        stake: 'Staking kayıtlarım',
        lpbond: 'Tahvil satın alma kayıtları',
        burnbond: 'Tahvil satın alma kayıtları',
        xmine: 'Madencilik kayıtlarım',
      },
      recordColumns: ['Zaman', 'Hesaplanan süre', 'Tutar', 'Serbest bırakıldı', 'İşlem hash’i'],
      bondRecordColumns: [
        'Zaman',
        'Hesaplanan süre',
        'Ödenen',
        'İndirim',
        'Alınan AGX',
        'İşlem hash’i',
      ],
      xmineRecordColumns: ['Zaman', 'İşlem', 'Tutar', 'İşlem hash’i'],
      recordsEmpty: {
        stake: 'Henüz staking kaydı yok. Stake tamamlanınca her kayıt burada görünür.',
        lpbond: 'Henüz satın alma kaydı yok. LP tahvil alınca her alım burada görünür.',
        burnbond: 'Henüz satın alma kaydı yok. Yakım tahvili alınca her alım burada görünür.',
        xmine:
          'Henüz madencilik kaydı yok. gAGX stake edip madenciliğe başlayınca her işlem burada görünür.',
      },
      recordsFooter: {
        stake: 'Toplam stake {amount} AGX',
        bond: 'Toplam alım {amount}',
        xmine: 'Toplam stake {amount} gAGX',
      },
      chartTitles: {
        stake: 'TVL (Staking) metrikleri',
        lpbond: 'TVL (LP Tahvil) metrikleri',
        burnbond: 'TVL (Yakım Tahvili) metrikleri',
        xmine: 'TVL (X Madencilik) metrikleri',
      },
      chartRangeAria: 'Grafik zaman aralığı',
      chartRanges: ['1 haf', '1 ay', '1 yıl', 'Tümü'],
      chartEmpty: 'Henüz geçmiş veri yok',
      positionMetrics: [
        { label: 'Pozisyonum' },
        { label: 'Serbest bırakıldı' },
        { label: 'Serbest bırakılacak' },
        {
          label: 'Güncel Rebase getiri oranı',
          hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
        },
        {
          label: 'Güncel Rebase bonusu',
          hint: 'Talep edilmemiş Rebase bonusu bileşik getiri üretmez',
        },
      ],
      xValue: {
        title: 'X uzun vadeli değer sistemi',
        supplyLabel: 'X toplam arz',
        supplyValue: '210,000,000',
        badge: 'Sabit arz · asla enflasyon yok',
        columns: [
          {
            pct: '47.62%',
            title: 'LP likidite inşası',
            bullets: ['İlk likidite inşası', 'Piyasa yapıcılık ve likidite desteği'],
          },
          {
            pct: '52.38%',
            title: 'Küresel ödüller ve büyüme',
            bullets: [
              'gAGX madencilik ödülleri',
              'Pazar genişletme ve marka ortaklıkları',
              'Ekosistem inşası ve uzun vadeli büyüme',
            ],
          },
        ],
        sourcesKicker: 'Değer kaynakları',
        sourcesHeadline: 'Üç talep katmanı',
        sourcesBadge: 'X talebini sürekli güçlendirir',
        sources: [
          { title: 'gAGX talebi', copy: 'Stake ederek madencilik yapın, X talebi oluşturun' },
          { title: 'Getiri geri dönüşü', copy: 'Protokol getirisi sürekli ekosisteme döner' },
          {
            title: 'Ekosistem büyümesi',
            copy: 'Uygulamalar genişler, kullanıcılar talebi sürükler',
          },
        ],
        deflationKicker: 'X deflasyon mekanizması',
        deflationHeadline: 'Sürekli deflasyon',
        deflationBadge: 'Arz azalır · değer artar',
        deflationSteps: [
          { title: 'Ekosistem büyümesi', copy: 'Ekosistem sürekli gelişir' },
          { title: 'X talebi artışı', copy: 'Uygulama ve işlem talebi yükseltir' },
          { title: 'Piyasa dolaşımı', copy: 'X piyasada dolaşır ve kullanılır' },
          { title: 'Satış vergisi %25 yakım', copy: 'Her satış otomatik %25 yakar' },
        ],
        featuresKicker: 'X temel özellikleri',
        featuresHeadline: 'Uzun vadeli değer taşıyıcısı',
        featuresBadge: 'Kıt · deflasyoner · likit · genişleyen',
        features: [
          { title: 'Sabit arz', copy: 'Toplam sabit, kıtlık değeri' },
          { title: 'Sürekli deflasyon', copy: 'Yakım mekanizması değeri yükseltir' },
          { title: 'Likidite desteği', copy: 'Likidite piyasayı istikrarlı tutar' },
          { title: 'Ekosistem genişlemesi', copy: 'Uygulamalar büyür, değer birikir' },
        ],
      },
    },

    stake: {
      title: 'Yatır',
      intro: 'AGX stake · günde {timesPerDay} Rebase bileşik getiri',
      periodLabel: 'Stake süresini seçin',
      periodAria: 'Stake süresini seçin',
      amountAria: 'Stake tutarı',
      amountBalance: 'Tutar (cüzdan bakiyesi {balance} AGX)',
      quotaInline: 'Stake kotası: {quota} AGX',
      submit: 'Yatır',
      bindCta: 'Referans bağla',
      success: 'Stake başarılı',
      periods: {
        liquid: 'Esnek',
        d180: '180 g',
        d360: '360 g',
        d540: '540 g',
      },
      meta: {
        baseDaily: 'Temel günlük getiri oranı',
        periodYield: 'Dönem getiri oranı',
        bonus: 'Getiri bonusu',
        lock: 'Kilit günleri',
        remaining: 'Kalan kota',
        contract: 'Sözleşmeyi görüntüle',
        lockLiquid: 'Esnek',
        lockDays: '{days} günlük doğrusal serbest bırakma',
      },
      overviewMetrics: [
        { label: 'Toplam stake' },
        {
          label: 'Güncel Epoch',
          hint: 'Her Epoch yaklaşık {hours} sa ({blocks} blok); stake getirisi Epoch başına uzlaşır',
        },
        { label: 'Sonraki Rebase dağıtımı' },
        {
          label: 'Güncel Rebase getiri oranı',
          hint: 'Her Epoch’ta (~{hours} sa) bir kez uzlaşır; protokol durumuna göre ayarlanır',
        },
      ],
      mechanismTitle: 'Staking işleyişi',
      mechanism:
        'Esnek stake etkinleştirmeden önce warmup’a girer; vadeli stake seçilen havuza kilitlenir. Ödül talebi ve anapara çıkışı Varlıklar’dadır.',
      mechanismSteps: [
        {
          title: 'AGX stake et',
          body: 'Esnek veya 180/360/540 gün kilit seçin. Daha uzun kilit daha yüksek Rebase bonusu verir.',
        },
        {
          title: 'Günlük Rebase getirisi',
          body: 'Her Epoch (~{hours} sa) uzlaşır; getiri gAGX olarak birikir.',
        },
        {
          title: 'Vade serbest bırakma ve talep',
          body: 'Anapara bloklara göre doğrusal serbest bırakılır; gAGX 1:1 AGX’e çevrilebilir veya X madenciliği için stake edilebilir.',
        },
      ],
      faq: [
        {
          q: 'Stake getirisi nasıl hesaplanır?',
          a: 'Günde 2 Rebase; günlük getiri yaklaşık %0,5–%1. Daha uzun kilit daha yüksek bonus: 180g ≥%10, 360g ≥%15, 540g ≥%20; Rebase katsayısıyla ayarlanır.',
        },
        {
          q: 'Anapara ne zaman çekilebilir?',
          a: 'Anapara blok doğrusal serbest bırakılır (~3 sn). Serbest bırakılan kısım istenince alınır; çekimler 30 günlük tampona girer.',
        },
        {
          q: 'Referans APY sabit midir?',
          a: 'Hayır. APY göstergedir; gerçek getiri Rebase katsayısı, protokol durumu ve arz/talep ile değişir.',
        },
        {
          q: 'Rebase getirisi ile Rebase bonusu farkı nedir?',
          a: 'Rebase getirisi alınmadıkça her Epoch’ta bileşik birikir. Rebase bonusu vadeli kilit ekidir; alınmadıkça bileşik üretmez — zamanında talep edin.',
        },
        {
          q: 'Getiri hangi biçimde ödenir?',
          a: 'Stake getirileri gAGX olarak ödenir. İstediğiniz zaman 1:1 AGX’e çevirin veya X Madencilik’te stake ederek X alın.',
        },
        {
          q: 'Vade öncesi çıkabilir miyim?',
          a: 'Erken çıkış yok. Anapara seçilen sürede doğrusal serbest bırakılır; yalnızca serbest bırakılan kısım alınabilir. Planınıza uygun süre seçin.',
        },
        {
          q: 'Esnek stake’e hangi sınırlar uygulanır?',
          a: 'Esnek stake getiri bonusu almaz; günlük küresel ve hesap başına kotalarla sınırlıdır, günlük sıfırlanır (önce gelen alır).',
        },
        {
          q: 'Aynı hesapta birden fazla stake olabilir mi?',
          a: 'Evet. Her stake kendi süresi, getirisi ve serbest bırakma ilerlemesini izler; Staking kayıtlarım altında ayrı görünür.',
        },
      ],
    },
    lpbond: {
      title: 'LP Tahvil',
      intro: 'USD1 ile taban havuzu inşa edin, indirimli AGX alın',
      periodLabel: 'Tahvil süresini seçin',
      periodAria: 'LP tahvil süresi',
      amountAria: 'Satın alma tutarı',
      amountBalance: 'Tutar (cüzdan bakiyesi {balance} USD1)',
      submit: 'Satın al',
      success: 'Satın alma başarılı',
      footnote:
        'Sistem AGX/USD1 LP’yi otomatik kurar ve kalıcı taban likidite için kara deliğe yakar.',
      card: {
        yield: 'Dönem getiri oranı',
        discountRange: 'İndirim aralığı',
        sold: 'Satıldı',
        currentDiscount: 'Güncel indirim',
        discountPrice: 'İndirimli fiyat',
      },
      meta: {
        discount: 'İndirimli fiyat (%{pct})',
        pay: 'Öde',
        receive: 'AGX al',
        cap: 'Maksimum alım',
        release: 'Anapara serbest bırakma',
        releaseLinear: '{days} günlük blok doğrusal serbest bırakma',
        contract: 'Sözleşmeyi görüntüle',
      },
      overviewMetrics: [
        { label: 'LP tahvil toplam TVL' },
        {
          label: 'Tahvil prim oranı',
          hint: 'Güncel indirimli fiyatın AGX piyasa fiyatına göre getiri farkı',
        },
        { label: 'Sonraki Rebase dağıtımı' },
        {
          label: 'Güncel Rebase getiri oranı',
          hint: 'Her Epoch’ta (~{hours} sa) bir kez uzlaşır; protokol durumuna göre ayarlanır',
        },
      ],
      positionMetrics: [
        { label: 'Varlıklarım' },
        { label: 'Talep' },
        { label: 'Serbest bırakılacak' },
        {
          label: 'Mevcut Rebase getirisi',
          hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
        },
      ],
      mechanismTitle: 'LP Tahvil işleyişi',
      mechanism:
        'BondHelper ile USD1 zap, ilgili dönem BondDepository’ye girer. Geri alma ve getiri Varlıklar’da.',
      mechanismSteps: [
        {
          title: 'LP Tahvil satın al',
          body: 'USD1 ile taban havuzuna ortak inşa edin, indirimli AGX basın.',
        },
        {
          title: 'Otomatik LP inşası',
          body: 'Sözleşmeler AGX/USD1 likiditesini otomatik kurar.',
        },
        {
          title: 'Kara delik kalıcı kilit',
          body: 'LP Token kara delik adresine gider — kalıcı kilitlenir.',
        },
      ],
      faq: [
        {
          q: 'LP Tahvil nedir?',
          a: 'USD1 ile taban havuzuna ortak inşa: indirimli AGX basımı, AGX/USD1 LP otomatik inşası ve kalıcı taban likidite için LP’nin kara deliğe yakımı.',
        },
        {
          q: 'İndirim nasıl belirlenir?',
          a: 'Dynamic Bond Control arz/taleple ayarlar: 180g %85–%100, 360g %80–%100, 540g %75–%100 — daha uzun süre daha iyi indirim.',
        },
        {
          q: 'Satın alma sonrası LP Token tutar mıyım?',
          a: 'Hayır. LP kara deliğe yakılır. Tahvil süresince doğrusal serbest bırakılan indirimli basılmış AGX alırsınız.',
        },
        {
          q: 'Tahvil prim oranı nedir?',
          a: 'Prim, indirimli fiyat ile AGX piyasa fiyatı arasındaki farktır. Pozitif prim, tahvilin spot alımdan daha avantajlı olduğunu gösterir.',
        },
        {
          q: 'Erken geri alabilir miyim?',
          a: 'Erken geri alma yok. Anapara blok doğrusal serbest bırakılır; serbest bırakılan kısım istenince alınır.',
        },
        {
          q: 'Ödediğim USD1 nereye gider?',
          a: 'Ödenen USD1, indirimli basılan AGX ile AGX/USD1 LP oluşturur; LP Token kara deliğe yakılarak protokolün kalıcı likiditesi olur.',
        },
      ],
    },
    burnbond: {
      title: 'Yakım Tahvili',
      intro: 'İndirimli AGX basın ve deflasyon için kalıcı yakın',
      periodLabel: 'Tahvil süresini seçin',
      periodAria: 'Yakım tahvil süresi',
      amountAria: 'Satın alma tutarı',
      amountBalance: 'Tutar (cüzdan bakiyesi {balance} USD1)',
      submit: 'Satın al',
      success: 'Satın alma başarılı',
      footnote: 'Sistem indirimli AGX basar, otomatik alır ve kara deliğe kalıcı yakar.',
      card: {
        yield: 'Dönem getiri oranı',
        discountRange: 'İndirim aralığı',
        sold: 'Satıldı',
        currentDiscount: 'Güncel indirim',
        discountPrice: 'İndirimli fiyat',
      },
      meta: {
        discount: 'İndirimli fiyat (%{pct})',
        pay: 'Öde',
        receive: 'AGX al',
        cap: 'Maksimum alım',
        release: 'Anapara serbest bırakma',
        releaseLinear: '{days} günlük blok doğrusal serbest bırakma',
        contract: 'Sözleşmeyi görüntüle',
      },
      overviewMetrics: [
        { label: 'Yakım tahvil toplam TVL' },
        {
          label: 'Tahvil prim oranı',
          hint: 'Güncel indirimli fiyatın AGX piyasa fiyatına göre getiri farkı',
        },
        { label: 'Sonraki Rebase dağıtımı' },
        {
          label: 'Güncel Rebase getiri oranı',
          hint: 'Her Epoch’ta (~{hours} sa) bir kez uzlaşır; protokol durumuna göre ayarlanır',
        },
      ],
      positionMetrics: [
        { label: 'Varlıklarım' },
        { label: 'Serbest bırakıldı' },
        { label: 'Serbest bırakılacak' },
        {
          label: 'Mevcut Rebase getirisi',
          hint: 'Talep edilmemiş Rebase getirisi her blok ödülüyle bileşik olarak artmaya devam eder',
        },
      ],
      mechanismTitle: 'Yakım Tahvili işleyişi',
      mechanism:
        'BondHelper ile USD1 zap, ilgili dönem BurnBondDepository’ye girer. Geri alma ve getiri Varlıklar’da.',
      mechanismSteps: [
        {
          title: 'USD1 öde',
          body: 'Serbest bırakma süresi seçin ve güncel indirimle Yakım Tahviline katılın.',
        },
        {
          title: 'İndirimli AGX basımı',
          body: 'Sistem ilgili indirim oranında AGX basar.',
        },
        {
          title: 'Al ve kalıcı yakın',
          body: 'AGX’i otomatik alıp kara deliğe yakarak deflasyonu güçlendirin.',
        },
      ],
      faq: [
        {
          q: 'Yakım Tahvili nedir?',
          a: 'USD1 ödeyin: indirimli AGX basımı, otomatik AGX alımı ve kalıcı yakım (Blackhole Lock) ile dolaşımı azaltıp uzun vadeli değeri destekleyin.',
        },
        {
          q: 'LP Tahvilden farkı nedir?',
          a: 'LP Tahvil kalıcı taban likidite kurar; Yakım Tahvili dolaşımı deflate eder. Aynı indirim bantları (%75–%100 süreye göre); anapara her iki yolda da doğrusal serbest bırakılır.',
        },
        {
          q: 'Tahvil prim oranı nedir?',
          a: 'Prim, indirimli fiyat ile AGX piyasa fiyatı arasındaki farktır. Pozitif prim, tahvilin spot alımdan daha avantajlı olduğunu gösterir.',
        },
        {
          q: 'Erken geri alabilir miyim?',
          a: 'Erken geri alma yok. Anapara blok doğrusal serbest bırakılır; serbest bırakılan kısım istenince alınır.',
        },
        {
          q: 'Ödediğim USD1 nereye gider?',
          a: 'Ödenen USD1, basım, piyasa yapıcılık ve risk savunması için hazine rezervine girer; sistem indirimli AGX basar, alır ve kara deliğe kalıcı yakar.',
        },
      ],
    },
    xmine: {
      title: 'X Madencilik',
      intro: 'gAGX stake ederek X ekosistem ödülü madenciliği yapın',
      amountAria: 'Stake gAGX tutarı',
      amountBalance: 'Tutar (cüzdan bakiyesi {balance} gAGX)',
      quotaInline: 'Stake kotası: {quota} gAGX',
      submit: 'Yatır',
      success: 'Stake başarılı',
      openKlineChart: 'Mum grafiğini görüntüle',
      meta: {
        quota: 'Stake kotası',
        daily: 'Getiri oranı (günlük)',
        max: 'Maksimum stake',
        maxHint:
          'gAGX stake üst sınırı, ≥180 günlük AGX tahvil pozisyonu ile AGX stake toplamını aşamaz',
        lock: 'Kilit günleri',
        lockValue: '24 saat sonra serbest bırakılır',
        h24: '24h',
        contract: 'Sözleşmeyi görüntüle',
      },
      overviewMetrics: [
        { label: 'X Madencilik toplam TVL' },
        { label: 'X fiyatı' },
        { label: 'Kümülatif madencilik çıktısı' },
        {
          label: 'Günlük getiri oranı',
          hint: 'Protokol getirisi ve ağ stake’ine göre dinamik dağıtılır; günlük ayarlanır',
        },
        {
          label: 'Sonraki madencilik çıktısı',
          hint: 'X madencilik getirisi her gün 00:00 UTC’de üretilir',
        },
      ],
      positionMetrics: [
        { label: 'Madencilik stake’im' },
        { label: 'Serbest bırakıldı' },
        { label: 'Madencilik çıktısı' },
      ],
      mechanismTitle: 'X Madencilik işleyişi',
      mechanism:
        'miningQuotaOf ile kotayı doğrulayıp stakeGagxForMining yapın. X talebi ve stake’ten çıkarma Varlıklar’da; bu sayfada warmup iptali yok.',
      mechanismSteps: [
        {
          title: 'Rebase + DAO ödülleri',
          body: 'Getiriler birleşik olarak gAGX uzlaşır.',
        },
        { title: 'gAGX stake et', body: 'Stake edilen gAGX 24 saat kilitlenir.' },
        {
          title: 'Dinamik X dağıtımı',
          body: 'Sistem protokol getiri oranına göre X ödülünü dinamik dağıtır.',
        },
        {
          title: 'Stake’ten çıkarma doğrusal serbest bırakma',
          body: 'Kilit açıldıktan sonra gAGX ~30 günde blok doğrusal serbest bırakılır.',
        },
      ],
      faq: [
        {
          q: 'X Madenciliğe nasıl katılırım?',
          a: 'gAGX stake ederek X madenciliğine katılın. Stake sonrası gAGX 24 saat kilitlenir; X ödülleri protokol getirisine göre dağıtılır.',
        },
        {
          q: 'Stake üst sınırı nedir?',
          a: 'gAGX stake, ≥180 gün AGX tahvil + AGX stake toplamını aşamaz.',
        },
        {
          q: 'Stake’ten çıkarma sonrası varlıklar nasıl serbest bırakılır?',
          a: 'Kilit açıldıktan sonra gAGX 30 günlük blok doğrusal serbest bırakma kullanır; çıkış sonrası yığılmış satış baskısını azaltır ve uzun vadeli değer yakalamayı güçlendirir.',
        },
        {
          q: 'X arzı nedir? Enflasyon olur mu?',
          a: 'Sabit 210 million X, asla enflasyon yok. %47,62 LP likidite (başlangıç havuzu, piyasa yapıcılık ve likidite desteği); %52,38 küresel ödül ve büyüme (gAGX madencilik ödülleri, pazar genişlemesi ve marka ortaklıkları, ekosistem ve uzun vadeli gelişim).',
        },
        {
          q: 'gAGX nasıl alınır?',
          a: 'gAGX, Rebase ve DAO ödüllerinin birleşik uzlaşma belgesidir: AGX stake veya tahvillerden Rebase getirisi ile DAO ödülleri gAGX olarak ödenir. gAGX, X ekosistemine tek giriş yoludur.',
        },
        {
          q: 'gAGX madencilik dışında ne yapabilir?',
          a: 'gAGX’i istediğiniz zaman 1:1 AGX’e çevirip stake bileşik getirisine devam edin veya gAGX stake ederek X madenciliği yapın. İki yol da sizin.',
        },
        {
          q: 'X neden sürekli deflate olur?',
          a: 'Her X satışında %25 yakılır. Ekosistem büyümesi talep ve cironun artmasıyla yakımlar birikir, X dolaşımı küçülür ve «daha az arz, daha yüksek değer» uzun vadeli deflasyon döngüsü oluşur.',
        },
        {
          q: 'X değerinin kaynağı nedir?',
          a: 'Üç talep katmanı: gAGX madenciliğinden X talebi; protokol gelirinin ekosisteme geri dönüşü; uygulama genişlemesi ve kullanıcı artışı. Üçü birlikte X talebini sürekli güçlendirir.',
        },
        {
          q: 'Üst sınır neden tahvil/uzun vadeli stake’e bağlı?',
          a: 'Bu, X madencilerinin protokolün uzun vadeli inşa edenleri olmasını sağlar: gAGX stake üst sınırınız ≥180 gün AGX tahvil pozisyonu artı AGX stake toplamını aşamaz. Üst sınırı yükseltmek için tahvil veya uzun vadeli stake ekleyin.',
        },
      ],
    },
    calc: {
      title: 'Getiri hesaplayıcı',
      intro: 'Farklı ürün, süre ve fiyatlarda beklenen getiriyi hesaplayın — zincir üstü işlem yok',
      productAria: 'Hesaplanan ürün',
      products: {
        stake: 'Yatır',
        lpbond: 'LP Tahvil',
        burnbond: 'Yakım Tahvili',
        xmine: 'X Madencilik',
      },
      periodLabel: 'Süre seçin',
      periodAria: 'Hesaplanan süre',
      amountLabel: 'Tutar',
      amountBuy: 'Satın alma tutarı',
      amountAria: 'Tutar',
      price: 'Vade AGX fiyatı',
      priceX: 'Vade X fiyatı',
      priceCurrent: 'Güncel {price}',
      priceAria: 'Fiyat girişi',
      days: 'Tutma günleri',
      dayBubble: '{day}. gün',
      sliderBreakEven: 'Pozitif getiri',
      sliderMaturity: '{days} gün vade',
      daysAria: 'Tutma günleri',
      submit: 'Hesapla',
      result: {
        interest: 'Tahmini getiri',
        total: 'Toplam getiri',
        rate: 'Getiri oranı',
        sellTotal: 'Satış toplamı',
        invested: 'Toplam yatırım',
        yieldBar: 'Getiri {amount}',
        lossBar: 'Zarar {amount}',
        legend: {
          released: 'Serbest bırakılan anapara değeri',
          netYield: 'Net getiri değeri',
          netYieldHint: 'Bileşik rebase ve vade bonusu; katkı puanı düşülmez',
          netYieldHintXmine: 'Çıkarılan X miktarı, vade X fiyatından değerlenir',
          cost: 'Maliyet',
          grossYield: 'Toplam getiri',
        },
      },
      aside: {
        result: 'Hesap sonucu',
        resultHint: 'Solda parametreleri girip Hesapla’ya dokunun.',
        tags: { day: '{day}. gün' },
        curve: 'Getiri eğrisi',
        curveHint: 'Günlük kümülatif getiri; vade sonunda geri alınmazsa bileşik getiri sürer',
        nodes: 'Kritik düğümler',
        nodeEndLabel: '{day}. güne kadar tut',
        nodeCards: [
          {
            label: 'Pozitif getiri başlangıç günü',
            note: 'Bu günden itibaren satmak pozitif getiri sağlayabilir',
          },
          {
            label: 'Anapara tamamen serbest bırakıldı',
            hint: 'Anapara dönem bloklarıyla doğrusal serbest kalır; o günden itibaren tamamı çekilebilir',
          },
          { label: 'Süre sonuna kadar tut', note: 'Anaparaya göre kümülatif getiri gösterimi' },
        ],
        notes: 'Hesaplama notları',
        notesBody: 'Yalnızca yerel tahmin — zincir üstü teklif veya getiri vaadi değildir.',
        notesItems: [
          'Rebase yaklaşık her {hours} saatte bir (günde {timesPerDay} kez) uzlaşır. Getiri her Rebase başına %{rebase} bileşikleşir; daha uzun süreler Rebase getirisine basit faiz bonusu ekler: 180 gün %10, 360 gün %15, 540 gün %20.',
          'Anapara seçilen süre boyunca doğrusal olarak açılır; satış değeri yalnızca o güne kadar serbest bırakılan anaparayı içerir. Serbest bırakılmamış anapara satış toplamına dahil edilmez.',
          'Net getiri, bileşik Rebase ile süre bonusunun toplamıdır. Serbest bırakılan anapara ve net getiri, belirlediğiniz çıkış fiyatından satılmış kabul edilir. Getiri talebi için gereken katkı puanı maliyeti dahil değildir.',
          'Tahmin, getiri serbest bırakma ücretini düşmez ve anapara ile getiri açılırken oluşabilecek fiyat hareketlerini modellemez. Yalnızca örnektir; gerçek getiri protokol durumuna göre değişir.',
        ],
      },
    },
  },

  release: {
    title: 'Serbest bırakma',
    intro: 'Getiri ve anapara serbest bırakmayı yönetin',
    backToHub: 'Serbest bırakmaya dön',
    recordColumns: ['Zaman', 'İşlem', 'Tutar', 'İşlem hash’i'],
    recordsEmpty: 'Henüz zincir üstü indeks kaydı yok (indexer bekleniyor)',
    labels: {
      releasing: 'Serbest bırakılıyor',
      released: 'Serbest bırakıldı',
      releasedPct: 'Serbest bırakıldı %{pct}',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Talep başarısız. Lütfen tekrar deneyin.',
    },
    hub: {
      aboutTitle: 'Serbest bırakma hakkında',
      aboutCardTitle: 'Serbest bırakma havuzu · getiri ve ödül serbest bırakma',
      aboutCardBody:
        'Serbest bırakma havuzu anlık satış baskısını günler süren yumuşak akışa çevirir. Her talep seçilen sürede doğrusal açılır; protokol çıkışları ekosistem büyümesiyle uyumlu kalır.',

      aboutSlides: [
        {
          title: 'Serbest bırakma havuzu · getiri ve ödül serbest bırakma',
          body: 'Serbest bırakma havuzu anlık satış baskısını günler süren yumuşak akışa çevirir. Her talep seçilen sürede doğrusal açılır; getiri çıkışı ekosistem büyümesiyle uyumlu kalır, yoğun nakde çevirmenin AGX fiyatına etkisini azaltır ve uzun vadeli katılımcılar için bileşik büyümeyi korur.',
        },
        {
          title: 'Tampon havuzu · anapara ikincil serbest bırakma',
          body: 'Stake/tahvil anaparası çıkınca fonlar, piyasa emilim kapasitesine uyum için ikincil doğrusal serbest bırakma tamponuna girer.',
        },
      ],
      purposeTitle: 'Serbest bırakmanın işlevi',
      purposeBody:
        'Tüm getiri Türbin’den önce serbest bırakma havuzundan geçer. Nakde çevirmeyi zamana yaymak baskıyı azaltır; daha uzun süre daha düşük vergiyle tutmayı ödüllendirir.',

      mechanismTitle: 'Getiri talep mekanizması',
      mechanismSubtitle:
        'Serbest bırakma, getirinin üretilmesi ile Türbin arasında zorunlu adımdır — zamanla vergiyi, ritimle istikrarı takas edin',
      mechanismSteps: [
        { title: 'Rebase / DAO ödüllerini talep et', body: 'Getiri üretilir' },
        { title: '1:1 katkı mekanizması', body: '%50 yakım · %50 X taban havuzuna' },
        {
          title: 'Serbest bırakma havuzuna gir · doğrusal serbest bırakma',
          body: '5 / 20 / 40 / 60 gün seçin',
        },
        { title: 'Türbin’e talep et', body: '1:1 alımla satış kotası aç' },
      ],
      taxTitle: 'Daha uzun serbest bırakma, daha düşük vergi',
      taxPeriod: 'Hesaplanan süre',
      taxRate: 'Talep vergisi',
    },
    queue: {
      title: 'Serbest bırakma havuzu',
      intro:
        'Talep edilen getiri ve ödüller burada seçilen sürede doğrusal serbest bırakılır; serbest bırakılan kısım istediğiniz zaman Türbin’e alınabilir',
      hubHint:
        'Talep edilen getiri ve ödüller burada seçilen sürede (5/20/40/60 gün) doğrusal serbest bırakılır; serbest bırakılan kısım istediğiniz zaman Türbin’e alınabilir.',
      planDays: '{days} g',
      claim: 'Talep et',
      refresh: 'Yenile',
      claimSuccess: 'Türbin kotasına talep edildi',
      goTurbine: 'Türbin’e git',
      statsTitle: 'Serbest bırakma havuzu verileri',
      lifetimeClaimed: 'Havuzdan kümülatif talep',
      hints: {
        releasing: 'Serbest bırakma havuzunda kalan, seçilen dönemde doğrusal açılan toplam gAGX',
        released: 'Serbest bırakılması bitmiş, istediğiniz an Türbine talep edilebilen gAGX',
        lifetimeClaimed: 'Serbest bırakma havuzundan Türbine talep edilen kümülatif gAGX',
      },
      recordsTitle: 'Serbest bırakma havuzu kayıtları',
    },
    buffer: {
      title: 'Tampon havuzu',
      intro:
        'İtfa edilen anapara burada {days} günlük ikincil doğrusal serbest bırakmadan geçer. Serbest kalan AGX cüzdanınıza çekilebilir.',
      hubHint:
        'İtfa edilen varlıklar tampon havuzuna girer ve {days} gün boyunca blok bazında doğrusal serbest bırakılır; serbest bırakılan kısım istediğiniz zaman cüzdana çekilebilir.',
      claim: 'Çek',
      refresh: 'Yenile',
      claimSuccess: 'AGX cüzdana çekildi',
      statsTitle: 'Tampon havuzu verileri',
      entered: 'Toplam giriş',
      extracted: 'Toplam çekilen',
      hints: {
        enteredAgx: 'Stake ve tahvil bozumundan sonra tampona giren kümülatif AGX',
        extractedAgx: 'Tampondan cüzdana çekilen toplam AGX',
        releasingAgx: 'Tamponda hâlâ serbest bırakılan AGX',
        enteredGagx: 'X madenciliği bozumundan sonra tampona giren kümülatif gAGX',
        extractedGagx: 'Tampondan cüzdana çekilen toplam gAGX',
        releasingGagx: 'Tamponda hâlâ serbest bırakılan gAGX',
      },
      recordsTitle: 'Tampon havuzu kayıtları',
      mechanismTitle: 'Fon serbest bırakma mekanizması',
      mechanismSubtitle:
        'Stake ve tahvil anaparası piyasa istikrarı için iki aşamalı serbest bırakma kullanır',
      mechanismSteps: [
        { title: 'Stake/', body: 'tahvil anaparası' },
        { title: 'Blok düzeyinde', body: 'serbest bırakma' },
        { title: 'Çekim sonrası', body: '{days} günlük tampon' },
        { title: 'İkincil doğrusal', body: 'serbest bırakma' },
      ],
      mechanismBenefits: [
        'Yoğun kilit açılışlarını önle',
        'Piyasa satış baskısını azalt',
        'Fon serbest bırakmayı yumuşat',
        'Piyasa istikrarını güçlendir',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'Getiri neden doğrudan cüzdana gitmez?',
          a: 'Serbest bırakma, getirinin oluşmasından serbestçe kullanılmasına kadar zorunlu adımdır. Getiri önce seçtiğiniz sürede serbest bırakma havuzunda doğrusal açılır, sonra Türbin üzerinden kilit açılıp cüzdana girer. Bu ritim toplanmış satış baskısını süren alım talebine çevirir ve AGX fiyatı ile protokolün uzun vadeli işleyişini korumanın çekirdek tasarımıdır.',
        },
        {
          q: 'Serbest bırakma havuzu ile tampon havuzu farkı?',
          a: 'Serbest bırakma havuzu staking, tahvil, madencilik ve ödüllerden aktif talep ettiğiniz getiriyi alır. Seçilen sürede doğrusal açılır, sonra Türbine talep edilir. Tampon, süre seçimi gerektirmeyen belirli girişleri alır; serbest bırakma bitince doğrudan cüzdana çekilir. İkisi birbirini etkilemez — ayrı bakın ve talep edin.',
        },
        {
          q: 'Tam serbest bırakma yolu nedir?',
          a: 'Getiri talep et → katkı puanını 1:1 harca → serbest bırakma havuzuna gir (vergi süreye göre bir kez kesilir) → doğrusal açılma → Türbine talep → kilidi açmak için USD1 ile eşit AGX al → soğuma bitince cüzdana çek. Tampon yolu daha kısa: serbest bırakma bitince çek.',
        },
        {
          q: 'Getiri talep etmek neden katkı puanı harcar?',
          a: 'Talep, talep edilen tutarla 1:1 katkı puanı harcar. Puanlar AGX yakarak gelir: %50 yakılır, %50 X taban havuzuna eklenir. Her getiri ödemesi böylece deflasyon ve likidite de ekler. Puan yetmezse Yakma sayfasından alın.',
        },
        {
          q: 'Vergi ile süre nasıl dengelenir?',
          a: 'Daha kısa süre daha yüksek vergi (5 gün %20, 20 gün %10, 40 gün %5, 60 gün %1). Vergi havuza girerken bir kez kesilir. Acil nakit → kısa süre. Daha çok tutmak → uzun süre. Hız ve maliyeti dengelemek için getiriyi farklı sürelerle parçalar halinde de gönderebilirsiniz.',
        },
      ],
      queue: [
        {
          q: 'Serbest bırakma süresi değiştirilebilir mi?',
          a: 'Hayır. Süre, getiri serbest bırakma havuzuna girerken sabitlenir ve sonra değiştirilemez. Her talep bağımsızdır, bu yüzden sonraki farklı süre kullanabilir.',
        },
        {
          q: 'Vergi ne zaman kesilir?',
          a: 'Vergi, getiri serbest bırakma havuzuna girerken bir kez kesilir; seçilen sürenin oranı kullanılır (5 gün %20, 20 gün %10, 40 gün %5, 60 gün %1). Havuzda görünen tutarlar zaten vergi sonrasıdır; serbest bırakma ve sonraki talepler ek ücret eklemez.',
        },
        {
          q: 'Serbest bırakma havuzundan talep edilen gAGX nereye gider?',
          a: 'Talep edilen gAGX doğrudan cüzdana gitmez. Türbin’e girer ve Türbin kurallarıyla devam eder. Görüntülemek ve yönetmek için Türbin sayfasını açın.',
        },
        {
          q: 'Serbest bırakılan kısmı hemen almazsam kayıp olur mu?',
          a: 'Süresi dolmaz — istediğiniz zaman talep edin. Havuzda bekleyen serbest bırakılmış tutarlar getiri üretmez, bu yüzden zamanında Türbin’e talep edin.',
        },
        {
          q: 'Uygun serbest bırakma süresi nasıl seçilir?',
          a: 'Fonları daha çabuk istiyorsanız kısa süre seçin (daha yüksek vergi). Bekleyebilirseniz daha düşük oran için uzun süre seçin. Hız ve vergiyi dengelemek için getiriyi farklı sürelerle birden fazla talebe de bölebilirsiniz.',
        },
      ],
      buffer: [
        {
          q: 'Tampon havuzu nedir?',
          a: 'Anapara stake’ten çıktıktan (geri alındıktan) sonra tampon havuzuna 30 günlük ikincil doğrusal serbest bırakmaya girer. Bu, kısa vadeli yığılmış çıkışları azaltır ve sürekli serbest bırakmayı piyasa istikrarıyla dengeler.',
        },
        {
          q: 'Tampon havuzundaki varlıklar hâlâ getiri üretir mi?',
          a: 'Hayır. Varlıklar tampona girdiği anda her türlü getiri üretmeyi durdurur; geri almaları kendi nakit ihtiyacınıza göre zamanlayın.',
        },
        {
          q: 'Serbest bırakılan kısım nasıl çekilir?',
          a: 'Tampon blok bazında doğrusal açılır. Serbest bırakıldı kısmında Çek’e dokunun — ekstra beklemeden doğrudan cüzdana gider.',
        },
        {
          q: 'Tampon havuzunda neden AGX ve gAGX var?',
          a: 'Stake ve tahvil geri almalarının anaparası AGX’tir; X Madencilik çıkışı gAGX’tir. İki varlık bağımsız serbest bırakılır ve çekilir.',
        },
        {
          q: 'Serbest bırakılmış varlıkların tümünü neden bir kerede çekemem?',
          a: 'Tampon varlıkları birçok geri alma kaydından gelebilir; her birinin kendi tampon saati vardır. Kayıt çoksa bir çekim sınırlı sayıda işleyebilir, bu yüzden tüm serbest bırakılmış tutarları tek dokunuşta boşaltamayabilirsiniz. Hepsi çıkana kadar Çek’e yeniden dokunun.',
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
    communityVolume: 'Takım performansı',
    holding: 'Pozisyon',
    contribution: 'Abonelik',
  },
}) satisfies AppMessagesBundle

export default app
