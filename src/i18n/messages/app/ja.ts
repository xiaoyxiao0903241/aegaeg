import { defineMessages } from '~/i18n/messages/define-messages'

import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'ウォレット接続',
    language: '言語',
    copy: 'コピー',
    claimable: '受取待ち',
    max: '最大',
    shareUnit: 'シェア',
    confirm: '確認',
    close: '閉じる',
    paginationTotal: '合計 {total} 件',
    paginationPerPage: '1ページ {size} 件',
    paginationPrev: '前のページ',
    paginationNext: '次のページ',
  },
  errors: {
    api: {
      network: 'ネットワーク接続に失敗しました。接続を確認して再試行してください。',
      timeout: 'リクエストがタイムアウトしました。しばらくしてから再試行してください。',
      unavailable: 'サービスは一時的に利用できません。しばらくしてから再試行してください。',
      badResponse: 'サーバー応答が不正です。しばらくしてから再試行してください。',
      fallback: '操作に失敗しました。しばらくしてから再試行してください。',
    },
    chain: {
      fallback: 'オンチェーン操作に失敗しました。しばらくしてから再試行してください。',
      reverts: {
        stakeAmountLimit:
          '日間ステーキング上限に達しました。金額を下げるか、上限のリセットをお待ちください。',
        debtCapacityReached: '債券の容量が不足しています。しばらくしてから再度お試しください。',
        turbineCooldown:
          'クールダウン未了、または入力が無効です。クールダウン記録を更新して再試行してください。',
        pairNotExist: '取引ペアが存在しません。トークン設定を確認してください。',
        notWinner: '今回は当選していないため、受取できません。',
        rewardAlreadyClaimed: 'リワードは既に受取済みです。重複操作はできません。',
        configNotReady:
          'プロトコル設定の準備ができていません。しばらくしてから再度お試しください。',
        exceedsMax: '金額が上限を超えています。金額を下げてください。',
        bondTooSmall: '債券の償還額が小さすぎます。購入金額を増やしてください。',
        bondTooLarge: '1回あたりの債券上限を超えています。購入金額を下げてください。',
        stakeNotExist:
          'ポジションが存在しないか、既に清算済みです。一覧を更新して再試行してください。',
        yieldUnavailable:
          '受取可能な収益がないか、引出額が大きすぎます。金額を下げるか、蓄積をお待ちください。',
        operationPaused: 'この操作は一時停止中です。しばらくしてから再度お試しください。',
        belowMinAmount: '金額が下限を下回っています。金額を増やしてください。',
        aboveMaxAmount: '金額が上限を超えています。金額を下げてください。',
        zeroRate: 'レートの準備ができていません。しばらくしてから再度お試しください。',
        zeroAmount: '有効な数量を入力してください。',
        turbineNoSilenceBalance: '引き出せる冷却完了残高がありません。',
        invalidAmount: '金額が無効です。確認して再試行してください。',
        zeroAddress: 'アドレスが無効です。しばらくしてから再試行してください。',
        notAuthorized: 'このアカウントには操作権限がありません。',
        invalidLimits: '限度額の設定が無効です。しばらくしてから再試行してください。',
        nothingToClaim:
          '受取可能なものがありません、または索引が無効です。更新して再試行してください。',
        warmupOrLockActive:
          'まだウォームアップまたはロック期間中です。終了後に再試行してください。',
        walletTokenInsufficient: 'ウォレットのトークン残高が不足しています。',
        walletAgxInsufficient: 'ウォレットの AGX 残高が不足しています。',
        walletUsd1Insufficient: 'ウォレットの USD1 残高が不足しています。',
        walletGagxInsufficient: 'ウォレットの gAGX 残高が不足しています。',
        contractPayableInsufficient:
          'コントラクトの支払可能残高が不足しています。しばらくしてから再試行してください。',
        extractableInsufficient: '引出可能残高が不足しています。更新して再試行してください。',
        insufficientAllowance: '承認額が不足しています。先に承認してください。',
      },
    },
    walletNotConnected: '先にウォレットを接続してサインインしてください。',
    quoteFailed: '見積もりに失敗しました。しばらくしてから再試行してください。',
    loadFailed: '読み込みに失敗しました。しばらくしてから再試行してください。',
    loginFailed: 'サインインに失敗しました。しばらくしてから再試行してください。',
    loginSignatureRejected: 'ログイン署名が無効または期限切れです。再度署名してください。',
    pageLoadFailed: 'ページの読み込みに失敗しました',
    pageLoadFailedBody:
      'レンダリング中に問題が発生しました。再読み込みしてください。ウォレット接続は維持されます。',
    reloadPage: 'ページを再読み込み',
  },
  nav: {
    exchange: '交換',
    assets: '資産',
    staking: 'ステーキング',
    genesis: '共創',
    rewards: 'リワード',
    release: 'リリース',
    community: 'コミュニティ',
    rewardsTooltip: '紹介リワードとチームリワードを確認。',
    communityTooltip:
      'パートナーを招待して共創に参加し、エコシステム成長価値と創世リワードを共有。',
    bscTooltip: 'BSCのみ · AEGIS XはBNB Smart Chainで稼働しています。',
  },
  flowOps: {
    stake: {
      STAKE: 'ステーク',
      REWARD: '報酬受取',
      EXTRA_REWARD: '追加報酬受取',
      CLAIM_PRINCIPAL: '償還',
      RESTAKE: '再ステーク',
    },
    bond: {
      PURCHASE: '購入',
      REDEEM: '償還',
      REWARD: '受取',
      RESTAKE: '再ステーク',
    },
    xmine: {
      STAKE_X: 'ステーク',
      UNSTAKE_X: 'アンステーク',
      REWARD: '受取',
    },
    buffer: {
      RELEASE_CREATED: '入場',
      PRINCIPAL_CLAIMED: '引出',
    },
    release: {
      entered_queue: 'キュー入場',
      claimed: '受取',
      released: '放出済み',
    },
    turbine: {
      received: '入場',
      silenced: 'アンロック',
      cooled_claimed: '引出',
    },
    termDays: '（{n}日）',
    termLiquid: '（流動）',
    liquid: '流動',
    periodDays: '{n} 日',
  },
  topbar: {
    currentNetwork: '現在のネットワーク',
    switchToBsc: 'BSCに切り替えてください',
    switchNetworkFailed:
      'ネットワーク切替に失敗しました。ウォレットでBSCに切り替えて再試行してください。',
    wrongNetworkTooltip: 'ネットワーク不一致。クリックしてBNB Smart Chain（BSC）に切り替えます。',
    openMenu: 'ナビゲーションを開く',
    closeMenu: 'ナビゲーションを閉じる',
    hideDetails: '詳細パネルを折りたたむ',
    showDetails: '詳細パネルを展開',
    toggleTooltip: '詳細パネルの表示/非表示',
  },
  onboarding: {
    chip: 'チュートリアル',
    skip: 'スキップ',
    prev: '戻る',
    next: '次へ',
    done: '完了',
    steps: [
      {
        title: '交換',
        body: '「交換」では、主要トークンを市場レートで AEGIS X エコシステムトークン（AGX、gAGX、X）に交換できます。',
      },
      {
        title: '取引',
        body: '「取引」では、USD1 で AGX を購入できます。',
      },
      {
        title: 'ステーキング',
        body: '「ステーキング」は収益の起点です。AGX をステーキングするか債券を購入すると、毎回の Rebase で複利収益を得られます。',
      },
      {
        title: '単一資産ステーキング',
        body: '「ステーキング」カードで AGX をステーキング。1日 {timesPerDay} 回の Rebase で複利成長し、期間が長いほど収益率ボーナスが高くなります。',
      },
      {
        title: '資産',
        body: '「資産」は全保有を集約します。ステーキング、LP債券、バーン債券、Xマイニングのポジションと収益が一目でわかります。',
      },
      {
        title: 'ステーキングポジション',
        body: '資産ページの「ステーキング」カードで保有と総収益を確認し、収益受取・再投資・償還などを行えます。',
      },
      {
        title: 'リリース',
        body: '「リリース」は未リリース資金を管理します。収益とリワードは先にリリースプール / バッファプールに入り、期間に沿って線形リリースされます。',
      },
      {
        title: 'リリースプール',
        body: '受取した収益とリワードは、選択した期間（5 / 20 / 40 / 60 日）で線形リリースされ、リリース済み分はタービンへ受取できます。',
      },
      {
        title: 'バッファプール',
        body: '償還した元本は約 30 日のブロック線形でリリースされ、リリース済み分はいつでもウォレットへ引き出せます。',
      },
      {
        title: 'タービン',
        body: 'リリースプールからタービンへ入った gAGX はロック状態です。USD1 でオンチェーン相場どおりに買うとアンロックできます。',
      },
      {
        title: 'リワード',
        body: '「リワード」には紹介賞・参加賞・共創賞などがあります。Lucky/共創/紹介/参加などの Mixed 受取は貢献ポイントを {ratio} で消費し、発展手当などは署名でウォレットへ直送されます。',
      },
      {
        title: 'コミュニティ',
        body: '「コミュニティ」ではチームを確認できます。招待リンク、メンバー、共創ランクがここに表示されます。',
      },
    ],
  },
  dapp: {
    connect: {
      promoTitle: '接続後にAEGIS Xの機能を探索',
      promoBrandLine: '未来の価値ネットワークを守る',
      recordsTitle: 'ウォレットを接続して記録を表示',
      recordsBodyGenesis: '接続後、共創履歴がここに表示されます。',
      recordsBodyRewards: '接続後、リワード履歴がここに表示されます。',
      recordsBodyCommunity: '接続後、招待記録がここに表示されます。',
    },
  },
  wallet: {
    connectTitle: 'ウォレット接続',
    connecting: '接続中…',
    copyAddress: 'アドレスをコピー',
    copied: 'コピー済み',
    copyFailed: 'コピーに失敗しました。長押しして手動でコピーしてください。',
    disconnect: '切断',
    reconnectWallet: 'ウォレットを再接続',
    reconnectHint: 'ウォレットが切断されました。オンチェーン操作のために再接続してください。',
    signInRequired: 'サインイン',
    accountBanned: 'アカウントが停止されています。サポートにお問い合わせください。',
    transactionErrors: {
      gasLimitTooLow:
        'Gas 上限が低すぎます。ネットワーク手数料用にウォレットに十分な BNB を残して再試行してください。',
      gasEstimateFailed:
        'この取引の Gas を見積もれませんでした。ネットワークを確認して再試行してください。',
      insufficientFunds: 'ネットワーク Gas 手数料を支払う BNB が不足しています。',
      wrongChain: 'BNB Smart Chain（BSC）に切り替えてから再試行してください。',
      accountChanged: 'ウォレットのアカウントが変わりました。もう一度送信してください。',
    },
  },
  exchange: {
    title: '交換',
    intro: '最良レートで AEGIS X エコシステムのトークンを取得',
    backToHub: '交換に戻る',
    sell: 'Sell',
    buy: '購入',
    flip: '交換方向を切替',
    balance: '残高',
    exchangePrice: '交換価格',
    slippage: 'スリッページ設定',
    allowedSlippage: '許容スリッページ',
    slippageSettings: '許容スリッページ設定',
    slippagePanel: {
      title: 'スリッページ',
      hint: 'スリッページ許容値は、注文送信からオンチェーン実行までの価格変動です。実際のスリッページが設定を超えると取引は失敗して巻き戻されます。巻き戻しでもガス代が発生する場合があります。',
      modeAuto: 'デフォルト',
      modeCustom: 'カスタム',
      max: '最大スリッページ',
      customAria: 'カスタムスリッページ',
    },
    route: '交換ルート',
    provider: 'プロバイダー',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'PancakeSwap で開く',
    overview: '概要',
    exchangeRate: '交換レート',
    settlement: '決済',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'フラッシュ',
          body: 'gAGX を AGX に、USDT を USD1 に交換 — 手数料・スリッページなし',
        },
        trade: {
          title: '取引',
          body: '主要トークンを AEGIS X エコシステムトークンに交換',
        },
        burn: {
          title: 'バーン',
          body: 'AGX をバーンして貢献ポイントを獲得',
        },
        turbine: {
          title: 'タービン',
          body: 'USD1 でタービン内のアンロック gAGX を購入',
        },
      },
      program: {
        title: 'AEGIS X プロトコルトークンを取得',
        cards: [
          { title: 'gAGX を取引', body: 'gAGX を AGX に交換' },
          { title: 'タービン', body: 'USD1 でタービン内のアンロック gAGX を購入' },
          { title: 'USD1 を取得', body: 'フラッシュで USDT を USD1 に交換' },
          { title: 'AGX を取得', body: 'PancakeSwap 市場レートで AGX を取得' },
          { title: 'X を売却', body: 'X を AGX や USD1 などのエコシステムトークンに交換' },
          {
            title: '貢献ポイントを取得',
            body: '{ratio} の比率で AGX をバーンして貢献ポイントを獲得',
          },
        ],
      },
      faq: {
        items: [
          {
            q: '交換ページでは何ができますか？',
            a: '交換ページは、AEGIS X プロトコルトークンの取得と取り扱いに使う主な入口をまとめています。フラッシュ（gAGX を 1:1 で AGX に償還）、取引（USD1 / AGX / X などを市場レートで交換）、タービン（USD1 で購入してタービン内の gAGX をアンロック）、そして AGX をバーンして貢献ポイントを獲得。目的に合う入口を選んでください。',
          },
          {
            q: 'フラッシュと取引の違いは？',
            a: 'フラッシュはプロトコル内の gAGX↔AGX 1:1 償還で、手数料・スリッページなし、オンチェーン即時着金です。取引は PancakeSwap を経由し、USD1、AGX、X などをリアルタイム市場レートで交換します。価格は市場に連動し、許容スリッページを設定してネットワーク gas を支払います。',
          },
          {
            q: '暗号資産ウォレットとは？どう入手しますか？',
            a: '暗号資産ウォレットはデジタル資産を確認・管理するソフトウェアです。資産はウォレット自体ではなくブロックチェーン上に記録されます。ノンカストディアルウォレットでは秘密鍵を完全に自分で管理し、署名できるのはあなただけです。カストディアルと異なり第三者は鍵を持ちませんが、秘密鍵やニーモニックを失うと資産へ永久にアクセスできなくなります。モバイルアプリやハードウェアがあり、一般的な選択肢は MetaMask や TokenPocket です。',
          },
          {
            q: 'ブロックチェーンの取引手数料とは？',
            a: 'オンチェーンの購入・売却・交換・送金などにはすべて gas が必要です。この手数料は AEGIS X アプリが課金するものではなく、ネットワーク需要と計算資源で決まります。BSC では gas は BNB で支払います。AEGIS X で取引する前に、ウォレットに常に BNB を用意してください。',
          },
          {
            q: '暗号資産ウォレットの仕組みは？',
            a: '暗号資産ウォレットは公開鍵と秘密鍵のペアで資産を保護・管理します。ノンカストディアルウォレットの設定時、ソフトウェアがニーモニック（12・18・24個のランダムな単語）を生成し、鍵の復元に使えます。大切に保管し、絶対に漏洩させないでください。秘密鍵はウォレットを完全に制御する一意の文字列で、取引の署名・承認に使われ、常に秘匿する必要があります。公開鍵は秘密鍵から派生し、公開共有でき、ウォレットアドレスの生成と受取に使います。',
          },
        ],
      },
    },
    flash: {
      title: 'フラッシュ',
      intros: {
        gagx: 'gAGX を AGX に交換 — 手数料・スリッページなし',
        gagxWrap: 'AGX を gAGX にラップ — 手数料・スリッページなし',
        usdt: 'USDT を USD1 に交換 — 手数料・スリッページなし',
      },
      providerName: 'AEGIS X',
      openProvider: 'BscScan でフラッシュ契約を確認',
      settlementValue: 'オンチェーン · 数秒で着金',
      aboutTitle: 'について',
      action: 'フラッシュ',
      success: 'フラッシュ成功',
      pairAriaLabel: 'フラッシュペア',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'フラッシュは一時停止中です。しばらくしてから再度お試しください。',
        belowMin: '1回あたりの最小交換額を下回っています。',
        aboveMax: '1回あたりの最大交換額を超えています。',
        insufficientReserve: 'USD1 の準備金が不足しています。しばらくしてから再度お試しください。',
        zeroRate: '交換レートの準備ができていません。しばらくしてから再度お試しください。',
        insufficientOutput: '見積もりが変動しました。再度お試しください。',
        transferMismatch: 'トークン送金数量が一致しません。再試行してください。',
        zeroAddress: '契約アドレスが異常です。しばらくしてから再試行してください。',
        sameToken: '入出力トークンの設定が異常です。しばらくしてから再試行してください。',
        zeroAmount: '0 より大きいバーン金額を入力してください。',
        notAuthorized: 'この操作は認可されていません。',
        invalidLimits: '交換上限の設定が異常です。しばらくしてから再試行してください。',
      },
      faq: {
        items: [
          {
            q: 'gAGX とは？',
            a: 'gAGX は Rebase と DAO リワードの統一決済バウチャーです。AGX ステーキングまたは債券の Rebase 収益、および各種 DAO リワードは、すべて gAGX で支給されます。',
          },
          {
            q: 'gAGX と AGX の交換比率は？',
            a: 'いつでも固定 1:1。手数料・スリッページなしで、オンチェーン即時着金。',
          },
          {
            q: 'フラッシュに手数料やスリッページがない理由は？',
            a: 'フラッシュはプロトコル層の gAGX↔AGX 1:1 固定償還であり、AMM プールでの約定ではないため価格スリッページも交換手数料もありません。支払うのはオンチェーン取引のネットワーク gas（BNB）のみです。',
          },
          {
            q: 'gAGX はどう取得しますか？',
            a: 'AGX ステーキング、LP債券、バーン債券の Rebase 収益、および各種 DAO リワードは、すべて gAGX としてアカウントに支給されます。',
          },
          {
            q: 'gAGX は AGX への交換以外に何ができますか？',
            a: 'gAGX を Xマイニングにステーキングすると、エコシステム価値トークン X を獲得できます。AGX への償還と X の採掘、どちらも自由に選べます。',
          },
          {
            q: 'USDT を USD1 にどう交換しますか？',
            a: 'フラッシュ上部で「USDT → USD1」ペアに切り替え、数量を入力すると 1:1 で交換できます。手数料・スリッページなし、オンチェーン即時着金です。',
          },
          {
            q: 'USD1 を USDT に戻せますか？',
            a: 'できません。フラッシュは USDT を USD1 へ一方向に変換するだけです。USD1 は AEGIS X の中核決済資産で、エコシステム内の取引、債券購入、タービンのアンロックに使えます。',
          },
          {
            q: 'フラッシュ履歴はどこで確認できますか？',
            a: 'フラッシュはオンチェーンで実行され、数秒で着金します。各取引はウォレットまたはブロックエクスプローラーで確認できます。',
          },
        ],
      },
    },
    trade: {
      title: '取引',
      intro: 'PancakeSwap のリアルタイム市場レートに基づき、オンチェーンで数秒着金',
      aboutTitle: 'について',
      selectSellToken: '売却トークンを選択',
      selectBuyToken: '購入トークンを選択',
      xBuyDisabledHint: 'Xは売却のみ可能です',
      flipDisabledXSellOnly: 'Xは売却のみ — 購入側へ切り替えられません',
      action: '取引',
      success: '取引成功',
      priceImpact: '価格影響',
      estimatedGas: '推定 Gas',
      highPriceImpactWarning:
        '現在の取引額はプール価格への影響が大きいです。金額を減らすか、スリッページ許容度を上げてください。',
    },
    burn: {
      title: 'バーン',
      subtitle: 'AGX をバーンして貢献ポイントを獲得',
      sellLabel: 'バーン',
      receiveLabel: '獲得',
      pointsToken: '貢献ポイント',
      currentContribution: '現在の貢献ポイント',
      burnRate: 'バーン比率',
      destination: 'バーン先',
      destinationValue: 'ブラックホール {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'BscScan で貢献交換契約を確認',
      action: 'バーン',
      success: 'バーン成功',
      aboutTitle: '貢献ポイントについて',
      blocked: {
        paused: 'バーンは一時停止中です。しばらくしてから再度お試しください。',
        belowMin: '1回あたりの最小バーン額を下回っています。',
        aboveMax: '1回あたりの最大バーン額を超えています。',
        zeroRate: 'バーン比率の準備ができていません。しばらくしてから再度お試しください。',
        zeroAmount: '0 より大きいバーン金額を入力してください。',
      },
      metrics: {
        totalBurnedAgx: '累計バーン AGX 数量',
        totalEarnedContribution: '累計獲得貢献ポイント',
        totalConsumedContribution: '累計消費貢献ポイント',
      },
      history: {
        title: 'バーン履歴',
        emptyBurn:
          'バーン記録はまだありません。AGX をバーンして貢献ポイントを獲得すると、各操作がここに表示されます。',
        emptyConsume:
          '消費記録はまだありません。収益やリワード受取で貢献ポイントを消費すると、各記録がここに表示されます。',
        tabsAriaLabel: 'バーン履歴カテゴリ',
        tabs: {
          burn: 'バーン',
          consume: '消費',
        },
        burnColumns: ['時間', 'バーン AGX', '獲得貢献ポイント', 'トランザクションハッシュ'],
        consumeColumns: [
          '時間',
          '用途',
          '受取数量',
          '消費貢献ポイント',
          'トランザクションハッシュ',
        ],
        purpose: {
          stakeYield: 'ステーキング収益',
          lpBondYield: 'LP債券収益',
          burnBondYield: 'バーン債券収益',
          lucky: 'ラッキー賞',
          rank: 'ランク報酬',
          referral: '紹介報酬',
          participation: '参加報酬',
          surpass: '同級超越',
          lifetime: '生涯報酬',
          market: 'マーケット手当',
        },
      },
      faq: {
        items: [
          {
            q: '貢献ポイントの用途は？',
            a: 'ステーキング・債券などの収益を受取る際、貢献ポイントを {ratio} で消費します。ポイントが不足すると受取れません。',
          },
          {
            q: '収益受取に貢献ポイントが必要な理由は？',
            a: '受取をプロトコルのデフレに結びつける仕組みです。収益を受取るたびに貢献ポイントを {ratio} で消費し、ポイントは AGX のバーンでのみ得られます。そのため収益の引出は必ず AGX バーンに対応し、継続的に AGX のデフレを支えます。',
          },
          {
            q: 'バーン比率はいくらですか？',
            a: '{burnRatio} の比率でバーンします。AGX を 1 枚バーンするごとに、対応する貢献ポイントを得られます。バーンした AGX はオンチェーンでブラックホールと LP に分割されます。',
          },
          {
            q: 'バーンした AGX はどこへ行きますか？',
            a: 'オンチェーンの分割設定に従い、約 {burnPct}% はブラックホールへ永久バーン、約 {injectPct}% は LP 流動性へ注入されます。',
          },
          {
            q: '貢献ポイントは譲渡や返金できますか？',
            a: 'できません。貢献ポイントはアカウントに紐付き、譲渡も返金もできません。収益受取時にのみ消費されるので、必要な分だけバーンしてください。',
          },
        ],
      },
    },
    turbine: {
      title: 'タービン',
      aboutTitle: 'タービンについて',
      segmentAriaLabel: 'タービン操作',
      segments: {
        unlock: 'アンロック',
        claim: '受取',
      },
      unlockLabel: 'アンロック',
      unlockable: 'アンロック可能',
      equivalentBuyHint: 'アンロックと同時に同額の買いが実行されます',
      payUsd1Label: 'USD1 を支払う',
      buyAgxLabel: 'AGX を購入',
      buyToBoundWallet: '購入分はウォレットへ着金',
      agxPrice: 'AGX 価格',
      willReceiveAgx: '獲得予定 AGX',
      unlockRatio: 'アンロック比率',
      unlockRatioValue: '1 : 1 購入でアンロック',
      cooldown: 'クールダウン',
      cooldownHoursValue: '{hours}時間',
      unlockAction: 'アンロック',
      unlockSuccess: 'アンロック成功 — クールダウン開始',
      claimAction: '受取',
      claimSuccess: '受取成功',
      claimEmpty: 'アンロック記録はまだありません',
      claimReady: '期限到来 · 引出可能',
      claimCoolingUntil: 'クールダウン中 · {time}',
      dataTitle: 'タービンデータ',
      recordsTitle: 'タービン記録',
      recordsEmpty:
        'タービン記録はまだありません。リリースプールからリワードをタービンへ受取すると、各操作がここに表示されます。',
      mechanismTitle: 'タービンの仕組み',
      mechanismIntro: '売却流動性を買い需要に紐付け、すべてのアンロックに同量の買いを伴わせます',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
        },
        {
          title: '動的クールダウン',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'アンロック待ち gAGX',
        cooling: 'クールダウン中 gAGX',
        totalWithdrawn: '累計引出',
        pendingUnlockHint:
          'リリースプールからタービンへ受け取り、まだアンロックされていない gAGX 総量',
        coolingHint: '買いアンロックを完了し、クールダウン中の gAGX 総量',
        totalWithdrawnHint: 'タービンからウォレットへ引き出した累計 gAGX',
      },
      faq: {
        items: [
          {
            q: 'gAGX はどのようにタービンへ入りますか？',
            a: 'リリースプールから受取した gAGX はウォレットへ入らず、自動でタービンに入りロックされます（記録では「進入」と表示）。USD1 で同量の AGX を買って「アンロック」し、クールダウン後に「引出」してウォレットへ移します。',
          },
          {
            q: 'アンロックに買いが必要な理由は？',
            a: 'タービンは売却流動性を買い需要に結びつけます。gAGX を 1 アンロックするには、現在価格で USD1 を使い AGX を 1 買う必要があります。潜在的な売却ごとに同量の買いが対になり、一方的な売圧を避け、底プールを守ります。',
          },
          {
            q: 'アンロックと引出の違いは？',
            a: 'アンロックは、現在価格で USD1 を使い同量の AGX を買い、ロック中の gAGX を解除してクールダウンを開始します。引出はクールダウン（{cooldownHours} 時間）終了後、アンロック済み gAGX をウォレットへ移します。2つの手順はタービン記録で「アンロック」と「引出」として表示されます。',
          },
          {
            q: 'クールダウン時間はどのくらいですか？',
            a: 'アンロックのたびにクールダウンが始まります。現在の期間は {cooldownHours} 時間で、市場状態に応じて自動調整されます。終了後、その gAGX をウォレットへ引き出せます。',
          },
          {
            q: 'アンロック購入の AGX はどこへ行きますか？',
            a: '購入した AGX は通常の取引買いと同じく、ウォレットへ直接入ります。対応する gAGX はアンロックされ、クールダウンに入ります。',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'AEGIS X エコシステムトークンについて',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · 決済ステーブルコイン',
          body: 'プロトコルの中核決済ステーブルコイン。1:1 ペッグ・ゼロスリッページ交換で、Genesis 申込・ステーキング・支払いシーンをつなぎます。',
        },
        {
          key: 'agx',
          title: 'AGX · 中核プロトコル資産',
          body: 'AGX は AEGIS X プロトコルの中核資産で、150% 過剰担保メカニズムにより生成され、価値成長・収益分配・エコシステム建設の重要な役割を担います。',
        },
        {
          key: 'gagx',
          title: 'gAGX · 収益決済バウチャー',
          body: 'Rebase と DAO リワードの統一決済バウチャー。1:1 で AGX に交換でき、ステーキングして X を採掘することもできます。',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · ステーキングバウチャー',
          body: 'AGX ステーキングで得る利付きバウチャー。自動複利収益で、ガバナンスウェイトとより高い称号をアンロックします。',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
        },
        {
          key: 'contribution',
          title: '貢献ポイント · 収益受取証憑',
          body: '収益の受取は貢献ポイントを {ratio} で消費します。AGX をバーンすると貢献ポイントを得られ、プロトコルのデフレも強まります。',
        },
        {
          key: 'turbine',
          title: 'タービン · クォータ解除ハブ',
          body: 'リリース受取の報酬はまずタービンクォータに入ります。USD1 で同量の AGX を買うと 24–96 時間のサイレンスが始まり、満了後の gAGX はスプリッター経由で線形リリースされ、すぐにはウォレットへ入りません。',
        },
      ],
    },
    tokenContract: '契約を確認',
    tokenPrevious: '前のトークン',
    tokenNext: '次のトークン',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: '取引',
          items: [
            {
              q: '取引とフラッシュの違いは？',
              a: '取引は PancakeSwap でリアルタイム市場レートにより USD1、AGX、X などを交換し、価格は市場に連動、許容スリッページ設定と gas が必要です。フラッシュはプロトコル内の gAGX↔AGX 1:1 固定交換で、手数料・スリッページなしです。',
            },
            {
              q: '許容スリッページとは？どう設定しますか？',
              a: 'スリッページは取引開始からオンチェーン約定までの価格変動です。許容スリッページは受け入れ可能な最大偏差で、デフォルト（トークンに応じて自動）かカスタム％を選べます。実際のスリッページが設定を超えると取引は失敗してロールバックし、ロールバックでも gas がかかる場合があります。低すぎると失敗しやすく、高すぎると不利な価格で約定する可能性があります。',
            },
            {
              q: '取引はどう決済されますか？手数料はありますか？',
              a: '取引は PancakeSwap がオンチェーンで約定・決済します。AEGIS X アプリは追加の交換手数料を取りませんが、各オンチェーントランザクションにはネットワーク gas（BSC では BNB）が必要です。ウォレットに十分な BNB を残してください。',
            },
            {
              q: '実際の着金数量が見積とずれる理由は？',
              a: '見積数量は注文時の市場レートで計算されます。約定時は市場変動や他の取引で価格が変わり得ます。最終着金はオンチェーンの実際の約定に基づき、偏差範囲は設定した許容スリッページで制約されます。',
            },
            {
              q: 'どのトークンを取引できますか？',
              a: 'AEGIS X エコシステムトークン（USD1、AGX、X）間を市場レートで交換できます。上部タブで各トークンの詳細を確認できます。',
            },
            {
              q: '取引履歴はどこで確認できますか？',
              a: '取引はオンチェーンで実行され、成立後数秒で着金します。各取引はウォレットまたはブロックチェーンエクスプローラーで確認できます。',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'USD1 とは？',
              a: 'USD1 は AEGIS X エコシステムの中核価値決済資産です。現金、短期米国債、政府マネーマーケットファンドなどの準備資産で 100% 裏付けられ、毎月 WLFI 公式サイトで金額分布レポートを確認できます。',
            },
            {
              q: 'USD1 は AEGIS X でどんな役割ですか？',
              a: 'USD1 は中核決済資産として、流動性ネットワーク・支払いシーン・エコシステム価値の循環をつなぎます。',
            },
            {
              q: 'USD1 はどう取得しますか？',
              a: '交換ハブの「USD1 を取得」から PancakeSwap 市場レートで USD1 を取得するか、取引ページで AGX、X などのエコシステムトークンを市場レートで交換できます。',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'AGX とは？',
              a: 'AGX は AEGIS X プロトコルの中核資産で、150% 過剰担保メカニズムにより鋳造され、価値成長・収益分配・エコシステム建設の重要な役割を担います。',
            },
            {
              q: 'AGX はどう持続成長しますか？',
              a: 'ステーキング・債券・Rebase で長期複利循環を形成し、AI シンクタンクのマーケットメイキングと買戻しバーンの仕組みと組み合わせます。',
            },
            {
              q: 'AGX はどう取得しますか？',
              a: 'プロトコルエコシステムへの参加で AGX を得るほか、プロトコルが支援する取引市場でも取得できます。',
            },
            {
              q: 'AGX の価値裏付けはどこから来ますか？',
              a: 'AGX は 150% 過剰担保で鋳造され、シンクタンク準備資産が裏付けます。ステーキング、債券、Rebase 複利、買戻しバーンなどの仕組みで長期価値循環を形成します。',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'gAGX とは？',
              a: 'gAGX はプロトコルのリワード決済バウチャーで、収益成長とエコシステム価値をつなぎ、エコシステムマイニングにも参加できます。',
            },
            {
              q: 'gAGX はどう取得しますか？',
              a: 'ユーザーがプロトコルの収益分配に参加すると、対応数量の gAGX を得られます。',
            },
            {
              q: 'gAGX と AGX の違いは？',
              a: 'AGX はプロトコルの中核資産で、価値成長と収益分配を担います。gAGX はエコシステム収益バウチャーで、AGX に交換でき、エコシステムマイニング参加の重要な入口です。',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'X とは？',
              a: 'X は AEGIS X のエコシステム価値トークンで、総供給は 2.1 億枚固定。エコシステム成長と価値の蓄積を担います。',
            },
            {
              q: 'X はどう取得しますか？',
              a: 'エコシステムマイニングに参加して X リワードを得、エコシステム成長の価値を共有できます。',
            },
            {
              q: 'X エアドロップはどうリリースされますか？',
              a: 'X の価値はエコシステム成長、価値蓄積、長期発展の合意に由来し、エコシステム価値の重要な担い手です。',
            },
            {
              q: 'X が継続的にデフレになる理由は？',
              a: 'X の総供給は 2.1 億枚で固定・追加発行なし。売却のたびに 25% が自動バーンされます。エコシステム成長による需要と継続的なバーンで、流通量が減少し長期デフレを形成します。',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'トークンと契約の詳細を確認',
  },
  genesis: {
    title: '共創プラン',
    intro: 'X DAO共創プランに参加 · フェーズ{season}  ({discount} 割引)',
    introEnded: 'X DAO 共創プログラムは円満に終了しました · 世界中の共創者の参加に感謝します',
    shares: 'シェア（1シェア = {min} USD1 · 最大 {max} シェア）',
    quota: 'このフェーズの共創枠',
    pay: '支払',
    receive: '獲得予定AGX',
    value: '購入価値',
    xTokenAirdrop: '獲得予定のX初期エアドロップ価値',
    xTokenAirdropHint:
      'フェーズごとの累計共創参加額が{threshold}以上でエアドロップ報酬の対象になります。',
    join: '共創に参加',
    joinEnded: '共創は終了しました',
    joinGenesis: '創世共創に参加',
    statsTitle: 'フェーズ{season} 共創データ',
    startsIn: '開始まで',
    countdownUnits: { days: '日', hours: '時', minutes: '分' },
    endsIn: 'このフェーズの残り時間',
    referencePrice: 'AGX上場参考価格',
    discountLabel: '割引',
    discountRatio: 'このフェーズの割引率',
    xAirdropRatio: 'Xエアドロップ比率',
    airdropLabel: 'Xエアドロップ比率',
    myContributions: '自分の共創記録',
    totalContributed: 'このフェーズの共創',
    cumulativeContributed: '累計共創',
    globalLabel: 'グローバル累計共創',
    globalBody: '世界中のコア共創者が集まり、AEGIS Xグローバルエコシステムネットワークを共同構築。',
    viewContract: 'コントラクトを表示',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '共創プランへの参加方法は？',
          a: 'ユーザーはUSD1で共創に参加し、対応フェーズの割引でAGXを獲得できる。全{phaseCount}フェーズ、割引は{discounts}の順。',
        },
        {
          q: '共創枠と参加条件は？',
          a: '最低参加額{minUsd}、{shareIncrement} USD1の整数倍で参加。各フェーズの枠は{phaseQuotas}。',
        },
        {
          q: '共創のリリース期間は？',
          a: '共創参加で獲得したAGXは540日間のリリーススケジュールに従う。',
        },
        {
          q: 'Xエアドロップリワードの獲得方法は？',
          a: '単一アカウントの累計共創参加額が{threshold}に達すると、対応フェーズのXエアドロップリワード資格を獲得。{phaseCount}フェーズのエアドロップ比率は{airdropRatios}の順。',
        },
        {
          q: 'Xエアドロップリワードのリリース方法は？',
          a: 'Xエアドロップリワードは12か月間の線形リリース（月約8.33%）。初回リリースはXステーキングプロトコル開始30日後、スマートコントラクトが自動実行。',
        },
      ],
    },
    promoTitleTemplate: '創世共創フェーズ{season}  {discount}割引',
    promoLive: '進行中 — 枠限定, {endDate}まで',
    promoUpcoming: 'まもなく開始、枠限定、{startDate}開始',
    promoEnded: '{status} · {date}',
    joinSuccess: '購入成功',
    insufficientUsd1: 'USD1残高が不足しています。参加前に十分なUSD1を用意してください。',
    insufficientAllowance: 'USD1の承認が不足しています。先に承認をクリックしてください。',
    purchaseUnavailable:
      '現在購入に参加できません。シェア数または購入フェーズの状態を確認してください。',
    walletNotConnected: 'ウォレットが切断されました。取引に署名するには再接続してください。',
    errors: {
      notBound: '参加する前に紹介者をバインドしてください。',
      paused: '購入は一時停止中です。後でもう一度お試しください。',
      invalidAmount: '金額は100 USDの倍数である必要があります。',
      phaseInactive: 'この購入フェーズは未開始または終了しています。',
      belowMin: '金額がこの購入フェーズの最低額を下回っています。',
      soldOut: 'この購入フェーズは完売しました。',
      userLimitExceeded: 'この購入フェーズのウォレット上限を超えています。金額を減らしてください。',
      invalidPhase: '無効な購入フェーズです。',
      systemConfig: 'システム設定エラーです。後でもう一度お試しください。',
    },
    contributionsSyncPending:
      'オンチェーン購入は確認済みです。履歴を同期中です。しばらくしてから更新してください。',
    contributionsEmpty: {
      title: '共創記録はまだありません',
    },
    contributionsEmptyEnded: {
      title: '共創記録はまだありません',
      body: '共創プログラムは終了しました。未参加のアカウントには記録がありません。',
    },
    goBindReferrer: '紹介者を紐付け',
    seasonLive: '進行中',
    seasonEnded: '終了',
    seasonUpcoming: 'まもなく開始',
  },
  rewards: {
    title: 'リワード',
    intro: '各種リワードカードの残高と配布記録を確認します。',
    backToHub: 'リワードに戻る',
    claim: '受取',
    claimSuccess: '受取成功',
    restakeSuccess: '再ステーキングが完了しました',
    claimErrors: {
      zeroAmount: '受取金額が 0 です。',
      invalidSigner: '署名が無効です。再取得してから受取してください。',
      alreadyUsed: 'このリワードは既に受取済みです。重複操作はできません。',
      expired: '署名の有効期限が切れました。更新してから再度受取してください。',
      noOrder: '受取可能なリワードはありません。',
      failed: '受取に失敗しました。しばらくしてから再度お試しください。',
      confirmSyncFailed:
        'リワードはオンチェーンで受取成功しましたが、同期に失敗しました。ページを更新し、重複受取しないでください。',
    },
    hub: {
      asideTitle: 'AEGIS X リワードについて',
      asideBody:
        '6 種のリワードカードがラッキー抽選・紹介・参加・共創・発展手当・創世共創をカバーします。',
      aboutTitle: 'AEGIS X リワードについて',
      balanceLabel: '残高',
      filterAria: 'リワードを絞り込み',
      hideZero: '0 資産を非表示',
      hideZeroEmpty: '非ゼロのリワードはありません',
      balancePlaceholder: '0.00',
      signInForBalance: '署名ログイン後に表示',
      enterClaim: '受け取りへ',
      sessionHint:
        '受取前にウォレット署名ログインを完了してください。ウォレット接続は業務ログインとは異なります。',
      stats: {
        totalRewards: '総リワード',
        tier: '共創ランク',
        tierEmpty: '共創ランク未到達',
        personalHolding: '個人保有',
        totalPerformance: '総業績',
        smallAreaPerformance: '小区業績',
        contribution: '貢献ポイント',
        contributionHint: '受取は貢献ポイントを {ratio} で消費',
        goBurn: 'バーンへ',
      },
      mechanismTitle: '共創賞の仕組み',
      mechanismBody: '共創リワードはチーム全体の Rebase 収益から、ランク比率で分配されます。',
      mechanismFooter:
        '任意の 2 ラインが対応ランクに達すると昇格できます。A6–A9 は単ラインでも昇格できます：1 ラインが対応ランクに達し、他ラインの合計業績が基準を満たせば条件達成です。',
      mechanismToggleAria: '昇格条件を切り替える',
      aboutSlides: {
        lucky: {
          title: 'ラッキー賞',
          body: '毎日の賞金プールは $5,000 以上。1 回の参加が $5,000 以上で抽選資格を得られ、毎日 10 名のラッキーユーザーをランダム抽選してプールを分配します。',
        },
        referral: {
          title: '紹介賞',
          body: '直紹介パートナーが共創に参加すると、その都度の Rebase 収益の 10% を受け取れます。オンチェーンで即時決済。自身のポジション価値を $100 超に保つ必要があります。',
        },
        participate: {
          title: '参加賞',
          body: '紹介リンクで紐付けて共創に参加すると、自分の保有額に相当する部分について、紹介人の Rebase 収益の 10% を被紹介特典として受け取れます。',
        },
        cobuild: {
          title: '共創賞',
          body: 'チーム全体の Rebase 収益から、共創ランクに応じたボーナス率で計上されます（A1 10%〜A13 130%）。ランクが高いほど比率が高く、詳細は下の共創賞メカニズム表を参照。',
        },
        grant: {
          title: '発展手当',
          body: 'エコシステム発展の特別手当。MarketFund 署名で受取。',
        },
        genesis: {
          title: '創世共創リワード',
          body: '創世期の直紹介・ランク・発展基金リワード。決済ウィンドウ終了後は受取不可。',
        },
      },
      tierTable: {
        columns: ['ランク', '個人保有', '有効アカウント', 'チーム業績', 'ボーナス比率'],
        rows: [
          { level: 'A1', holding: '$100', accounts: '2', team: '総業績 ≥ $6,000', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: '総業績 ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: '総業績 ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$500', accounts: '5', team: '総業績 ≥ $180,000', rate: '40%' },
          { level: 'A5', holding: '$1,000', accounts: '5', team: '総業績 ≥ $550,000', rate: '55%' },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: '2ラインが A5 達成',
            teamAlt: '1ラインが A5 達成、他ライン業績 ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: '2ラインが A6 達成',
            teamAlt: '1ラインが A6 達成、他ライン業績 ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: '2ラインが A7 達成',
            teamAlt: '1ラインが A7 達成、他ライン業績 ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: '2ラインが A8 達成',
            teamAlt: '1ラインが A8 達成、他ライン業績 ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: '2ラインが A9 達成',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: '2ラインが A10 達成',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: '2ラインが A11 達成',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: '2ラインが A12 達成',
            rate: '130%',
          },
          {
            level: '生涯達成賞',
            holding: '$100,000',
            accounts: '20',
            team: '2ラインが A13 達成',
            rate: '130% + グローバル配当 5%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'ラッキー賞',
        body: 'ブロック幸運抽選。幸運な共創者にランダム配布',
        aside: 'ラッキー賞は Chainlink VRF で抽選。当選後は Mixed で受取可能。',
      },
      referral: {
        title: '紹介賞',
        body: 'パートナーを共創に招待して得るリワード',
        aside: 'Direct-referral related rewards; claim via DaoPool Mixed (contribution {ratio}).',
      },
      participate: {
        title: '参加賞',
        body: '紹介人からのリワード',
        aside: '紹介関係からの参加リワード。DaoPool Mixed で受取（貢献ポイント {ratio} 消費）。',
      },
      cobuild: {
        title: '共創賞',
        body: 'チーム協業と長期共創による持続可能インセンティブリワード',
        aside: '共創賞は DaoPool Mixed で受取し、貢献ポイントが必要です。',
      },
      grant: {
        title: '発展手当',
        body: 'エコシステム発展特別手当',
        aside:
          '発展手当はカスタマーサポート承認後、MarketFund 署名で受取り、ウォレットへ直送されます。',
      },
      genesis: {
        title: '創世共創リワード',
        body: '創世期の直紹介・ランク・発展基金リワード',
        aside: '創世共創リワードは RewardClaimer 署名で受取ります。',
        badge: 'まもなく終了',
      },
    },
    detail: {
      claimable: '受取待ち',
      emptyClaimable: '受取可能なリワードはありません。',
      signedAmountHint: '受取可能額は署名ペイロードに準拠',
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: '受取と再投資の比率',
      releasePct: '受取 {pct}%',
      restakePct: '再投資 {pct}%',
      releasePeriod: 'リリース期間の選択',
      restakePeriod: '再投資期間の選択',
      releaseAria: 'リリース期間の選択',
      restakeAria: '再投資期間の選択',
      releaseDays: '{days} 日',
      restakeDays: '{days} 日',
      daysTax: '{days} 日 · {tax}',
      scheduleJoin: '、',
      taxRate: '税率 {rate}%',
      requiredContributionLabel: '今回控除する貢献ポイント',
      insufficientContributionDetail: '貢献ポイント不足（必要 {need}、現在 {have}）、',
      goBurnInline: 'バーンへ',
      getContributionSuffix: '貢献ポイントを取得。',
      releaseInto: 'リリースプールへ',
      restakeInto: '単一資産ステーキングへ',
      restakeLabel: '再投資',
      tokenGagx: 'gAGX',
      ctaReleaseLine: '受取 {amount}',
      ctaRestakeLine: '再投資 {amount}',
      requiredContribution: '今回控除する貢献ポイント {amount}',
      insufficientContribution:
        '貢献ポイントが不足しています。先に貢献ポイントを取得してください。',
      goBurn: '貢献ポイントを取得',
      luckyPaused: 'ラッキー賞プールは一時停止中のため、受取できません。',
      luckyNotClaimable: '受取可能なラッキー賞はありません。',
    },

    lucky: {
      dataTitle: 'データ',
      todayPool: '本日の賞金プール',
      countdownHint: '次回抽選まで {time}',
      eligibility: '本日の抽選資格',
      eligibilityYes: '獲得済み',
      eligibilityNo: '未獲得',
      maxStakeHint: '本日累計購入 {amount}',
      cumulativeWins: '累計当選',
      winsCount: '{count} 回',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Chainlink VRF v2 検証可能ランダム抽選',
      vrfBody:
        'ラッキー賞は Chainlink VRF v2（検証可能乱数）とステーキング契約を組み合わせて抽選します。乱数は Chainlink オラクルがオンチェーンで生成し暗号証明を付与し、ステーキング契約が受け取った後、当日の抽選名簿から自動で幸運ユーザー 10 名を選びます。人為介入なし・改ざん不可で、誰でもオンチェーン検証でき、不正の余地はありません。',
      verifyTutorial: '検証ガイド',
      collapseTutorial: 'ガイドを閉じる',
      vrfGuideStep1:
        '抽選結果または抽選履歴の検証ハッシュをクリックし、BscScan でそのラウンドの開賞トランザクションを確認します。',
      vrfGuideStep2:
        'トランザクションの Logs で Chainlink VRF のコールバックを探し、randomWords が本ラウンドのオンチェーン乱数です。暗号証明により予測・改ざんできません。',
      vrfGuideStep3:
        'ステーキング契約の Read Contract ページで verifyDraw を呼び、当日のラウンド番号を入力すると、乱数に対応する当選リストを再計算し、公示結果と照合できます。',
      resultsTitle: '抽選結果',
      dateFilterAria: '抽選日を選択',
      resultsSummary: '抽選 · 幸運ユーザー {count} 名',
      verifyHash: '本ラウンド抽選ハッシュを検証',
      meBadge: '自分',
      resultWon: '当選 {amount}',
      resultLost: '未当選',
      resultsColumns: ['順位', '当選アドレス', 'ステーキング', '賞金'],
      emptyResults: '抽選結果はまだありません',
      historyTitle: '抽選履歴',
      historyColumns: ['日付', 'ステーキング', '抽選結果', '検証'],
      emptyHistory: '抽選履歴はまだありません',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '抽選資格はどう得ますか？',
            a: '当日最初の $5,000 以上のステーキングまたは債券で、自動的に当日の抽選資格を得ます。追加申込は不要で、アドレスごとに1日最大1資格です。',
          },
          {
            q: '抽選はどう開かれますか？',
            a: '毎日 00:00（UTC）に Chainlink VRF v2 がオンチェーン検証可能な乱数を生成し、ステーキング契約が当日の全資格名簿から自動で幸運ユーザー最大 10 名を選んで賞金プールを分配します（プールは毎日 ≥ $5,000）。全程人為介入なし。',
          },
          {
            q: '抽選結果の公平性はどう検証しますか？',
            a: 'Chainlink VRF の乱数には暗号証明が付きオンチェーンに記録されます。毎日の当選結果横の検証リンクで抽選トランザクションを確認し、「検証ガイド」に従ってステーキング契約で当選名簿を再計算できます。結果は改ざん不可で、不正の余地はありません。',
          },
          {
            q: '当選後の賞金はどう支給されますか？',
            a: '当選賞金は抽選時の時価で gAGX に換算され、ラッキー賞カードに自動蓄積されます。ラッキー賞の受取ルールに従い受取します（貢献ポイント {ratio} 消費、リリースプール線形リリースまたは再投資）。',
          },
          {
            q: '$5,000 をステーキングしたのに資格がない理由は？',
            a: '資格は決済時の時価が基準です。AGX 価格は変動するため、決済時にステーキングが $5,000 未満（例：$4,999.99）と記録されると当日は資格がありません。余白を残してステーキングすることを推奨します。',
          },
          {
            q: '流動ステーキングで抽選資格を得られますか？',
            a: 'できません。流動ステーキングには1人あたりの日次上限があり、1回のステーキングが $5,000 を超えないため、抽選資格の金額条件を満たせません。',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'データ',
      totalRewards: '総リワード',
      myPosition: 'マイポジション',
      directCount: '直紹介明細',
      contribution: '貢献ポイント',
      contributionHint: '受取は {ratio} で消費',
      nextPayout: '次回リワード配布',
      recordsTitle: '紹介賞記録',
      recordsColumns: ['時間', '試算数量', 'ステータス', '受取日時'],
      emptyRecords: 'リワード記録はまだありません。配布後、各記録がここに表示されます。',
      referralsTitle: 'マイ紹介（{count}）',
      referralsColumns: ['参加日時', 'アドレス', 'ポジション', '累計貢献リワード'],
      emptyReferrals:
        '直紹介パートナーはまだいません。招待リンクを共有すると、参加後ここに表示されます。',
      hideZeroPosition: '0 ポジションを非表示',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '紹介リワードはどう計算されますか？',
            a: '直紹介アカウントの毎回の Rebase 収益の 10% を得ます。オンチェーン即時決済で、紹介賞カードに蓄積されます。',
          },
          {
            q: '参加賞を得る条件は？',
            a: 'ステーキング・債券購入のポジション価値が $100 超である必要があります。条件を満たすと、直紹介アカウントの Rebase 収益が比例で紹介賞として計上されます。',
          },
          {
            q: '保有が $100 なのに参加リワードがない理由は？',
            a: 'AGX 価格は変動します。決済時に保有が $99.99 と記録されると参加リワードの条件を満たさなくなります。保有を増やし、価格変動の影響を避けてください。',
          },
          {
            q: '紹介したユーザーの保有が自分よりはるかに大きい場合でも、紹介リワードは全額もらえますか？',
            a: 'はい。紹介賞の条件（ポジション価値 > $100）を満たせば、双方の保有差に関わらず、直紹介アカウントの毎回の Rebase 収益 10% を全額得られます。',
          },
          {
            q: '紹介賞はどう受取りますか？',
            a: '左側の受取パネルで受取と再投資の配分を設定します。受取分はリリースプールに入り、選択した期間で線形リリースされます。再投資分は単一資産ステーキングへ直接入り複利します。受取も再投資も貢献ポイントを {ratio} で消費します。',
          },
          {
            q: '直接紹介アドレス数とは？',
            a: 'あなたの紹介リンクで紐付け、初回参加を完了したウォレットアドレス数です。直接紹介（第1層）のみが紹介賞に計上されます。',
          },
          {
            q: '紹介したパートナーが退出した後も紹介賞は続きますか？',
            a: '紹介賞は被紹介人のアクティブポジションに連動します。収益が発生している間は継続し、完全退出後は停止します。既に獲得した分は影響を受けません。',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'データ',
      totalRewards: '総リワード',
      myPosition: 'マイポジション',
      contribution: '貢献ポイント',
      contributionHint: '受取は {ratio} で消費',
      nextPayout: '次回リワード配布',
      recordsTitle: '参加賞記録',
      recordsColumns: ['時間', '試算数量', 'ステータス', '受取日時'],
      emptyRecords: 'リワード記録はまだありません。配布後、各記録がここに表示されます。',
      inviterTitle: 'マイ紹介人',
      inviterColumns: ['紐付け日時', 'アドレス', 'ポジション', '累計もたらしたリワード'],
      emptyInviter:
        '紹介人の紐付け記録はまだありません。紹介リンクで紐付け後、ここに表示されます。',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '参加賞はどう発生しますか？',
            a: '招待人の紹介リンクで紐付けて共創に参加すると、被紹介人として紹介関係からの参加リワードを得ます。オンチェーン即時決済で、参加賞カードに蓄積されます。',
          },
          {
            q: '参加賞はどう計算されますか？',
            a: '自分の保有と同額部分の招待人 Rebase 収益の 10% を得ます。例：あなた $10,000・招待人 $1,000 なら招待人保有は全額マッチ範囲で、その全 Rebase の 10%。あなた $10,000・招待人 $20,000 なら、そのうち $10,000 分の Rebase の 10% のみです。',
          },
          {
            q: '参加賞を得る条件は？',
            a: '招待人の紹介リンクで紐付けを完了し、ステーキング・債券のポジション価値が $100 超である必要があります。',
          },
          {
            q: '保有が $100 なのに参加リワードがない理由は？',
            a: 'AGX 価格は変動します。決済時に保有が $99.99 と記録されると参加リワードの条件を満たさなくなります。保有を増やし、価格変動の影響を避けてください。',
          },
          {
            q: '参加賞はどう受取りますか？',
            a: '左側の受取パネルで受取と再投資の比率を選びます。受取分はリリースプールで選択期間どおり線形リリース、再投資分は単一資産ステーキングへ入ります。どちらも貢献ポイントを {ratio} で消費します（DaoPool Mixed）。',
          },
          {
            q: '紹介人は変更できますか？',
            a: 'できません。紹介関係は初回紐付け時にオンチェーンへ書き込まれ、永続的で変更できません。',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'データ',
      totalRewards: '総リワード',
      totalPerformance: '総業績',
      myPosition: 'マイポジション',
      directCount: '直紹介明細',
      contribution: '貢献ポイント',
      contributionHint: '受取は {ratio} で消費',
      nextPayout: '次回リワード配布',
      tierTitle: '共創ランク',
      tierCurrent: '現在のランク',
      tierNext: '次のランク',
      reqHolding: '個人保有',
      reqHoldingHint: 'ステーキングと債券ポジション価値',
      reqAccounts: '有効アカウント',
      reqAccountsHint: '直紹介の有効アドレス数',
      reqPerformance: '総業績',
      reqPerformanceHint: '全紹介体系のポジション合計',
      reqAchieved: '達成済み',
      tierRate: 'ボーナス比率 {rate}',
      tierProgress: '{level} への昇進条件',
      tierProgressCount: '達成 {done}/{total}',
      tierMax: '最高ランクに到達',
      recordsTitle: 'リワード記録',
      recordsTabsAria: 'リワード記録タイプ',
      recordsTabCobuild: '共創賞',
      recordsTabEqualize: 'イコライズ賞',
      recordsColumns: ['時間', 'ランク', '試算数量', 'ステータス', '受取日時'],
      emptyRecordsCobuild: 'リワード記録はまだありません。配布後、各記録がここに表示されます。',
      emptyRecordsEqualize: 'イコライズ賞の記録はまだありません。配布後ここに表示されます。',
      teamTitle: 'マイチーム（{count}）',
      teamColumns: ['参加日時', 'アドレス', 'チーム実績', 'チーム最高ランク'],
      emptyTeam: 'チームメンバーはまだいません。招待リンクを共有すると、参加後ここに表示されます。',
      hideZeroMarket: '実績0を非表示',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '共創賞はどう計算されますか？',
            a: '共創賞はチーム総 Rebase 収益から、共創ランクに対応するボーナス比率で計上されます。ランクが高いほど比率が高く（A1 10%〜A13 130%）、詳細はリワードハブの共創賞メカニズム表を参照。',
          },
          {
            q: 'イコライズ賞とは？',
            a: '下位チームのランクが追いつくか超えると、そのチームの共創賞はあなたの級差収益に入らなくなります。イコライズ賞はその補償で、当該下位共創賞の 10% を得られます。',
          },
          {
            q: 'イコライズ賞にランク制限はありますか？',
            a: 'あります。イコライズ賞は自分より最大 2 ランク上までの下位チームのみ対象です。例：あなたが A2 のとき、下位が A3 または A4 なら共創賞の 10% を得られます。A5 以上（2 ランク超）だとそのチームからイコライズ賞は得られません。自分のランクを上げるとカバーが戻ります。',
          },
          {
            q: '共創ランクはどう昇格しますか？',
            a: 'A1–A5 は個人保有・有効アカウント・チーム総業績で昇格。A6 以降はデュアルレッグ（任意の 2 ラインが対応ランク到達）で昇格。A6–A9 はシングルレッグ（任意の1ライン到達＋他ライン総業績到達）でも昇格できます。',
          },
          {
            q: 'チーム業績はどう集計されますか？',
            a: 'チーム業績は、全紹介体系（各ライン）のステーキング・債券ポジション価値の合計で、決済時の市場価格で計算されます。',
          },
          {
            q: '共創賞とイコライズ賞はどう受取りますか？',
            a: '左側の受取パネル上部で共創賞 / イコライズ賞を切り替え、受取と再投資の配分を設定します。受取分はリリースプールに入り、選択した期間で線形リリースされます。再投資分は単一資産ステーキングへ直接入り複利します。どちらも貢献ポイントを {ratio} で消費します。',
          },
          {
            q: 'ランク変更後、ボーナス比率はいつ反映されますか？',
            a: 'ランクは毎日の決済時に再評価されます。新ランク到達後、次回配布の共創賞は新しいボーナス比率で計算され、イコライズ賞のカバー範囲も新ランクに合わせて更新されます。',
          },
        ],
      },
    },
    grant: {
      pendingLabel: '承認待ち',
      pendingHint: '承認後に受取可能へ移管',
      pendingBody: '手当のアンロックはカスタマーサポートへ申請し、承認後に受取できます。',
      contactSupport: 'サポートに連絡してアンロック申請',
      claimIntoWallet: 'ウォレットへ',
      ctaToWallet: '{amount} をウォレットへ受取',
      dataTitle: 'データ',
      tier: '共創ランク',
      totalClaimed: '累計受取リワード',
      recordsTitle: '手当記録',
      recordsTabsAria: '手当記録タイプ',
      recordsTabIssue: '配布',
      recordsTabClaim: '受取',
      issueColumns: ['配布日時', '試算数量', 'タイプ', 'ハッシュ', '手当比率', '手当数量'],
      claimColumns: ['受取日時', '試算数量', 'ハッシュ'],
      emptyIssue: '配布記録はまだありません。手当が蓄積されるとここに表示されます。',
      emptyClaim: '受取記録はまだありません。受取完了後ここに表示されます。',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '発展手当とは？',
            a: '発展手当は共創者の市場開拓を支援する特別経費で、市場プロモーション・コミュニティ活動・チャネル構築などエコシステム発展関連に使い、チームのステーキングポジションに比例して蓄積されます。',
          },
          {
            q: '発展手当は何に使えますか？',
            a: '手当は市場開拓専用です。オフラインサロンやロードショー、コミュニティ運営・販促物、チャネル拡大など。エコシステム発展の実需に沿って使ってください。',
          },
          {
            q: '発展手当はどう使いますか？',
            a: '2つの方法があります。事前申請：サポートに市場開拓計画と予算を提出し、承認後に対応枠が受取可能へ。事後精算：先に費用を立て替え、活動証憑（請求書・現場写真・支出明細など）でサポートに精算申請し、審査通過後に受取。',
          },
          {
            q: '手当が承認待ちと表示される理由は？',
            a: '手当は蓄積後デフォルトで承認待ちです。用途申請または精算証憑を提出し、サポート承認後に受取可能へ移ります。進捗は手当記録で確認できます。',
          },
          {
            q: '手当の受取に貢献ポイントは必要ですか？',
            a: '不要です。発展手当は他のリワードと異なり、受取時に貢献ポイントを消費せず、リリースプールも経由せず、gAGX が直接ウォレットへ入ります。',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: '共創リワード',
      pageSubtitle: '共創に参加 · 成長価値を共有',
      claimToWallet: 'ウォレットへ受取',
      tierColumns: ['ランク', '個人申込', '体系業績', 'リワード比率'],
      recordsTabsAria: '創世リワード記録タイプ',
      recordsColumns: ['時間', 'タイプ', '試算数量', 'ステータス'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '紹介リワードはどう計算されますか？',
            a: '紹介リワードは 3% で、圧縮同等金額決済です。同等金額部分のみ計算し、空アカウントはリワード階層に含めず、リワードは自動決済されます。',
          },
          {
            q: '創世ランクはどう昇格しますか？',
            a: '創世ランクは S1 から S10 まで、個人の共創金額と体系総業績で評価されます。上位ランクにはデュアルレッグの昇格条件も必要です。',
          },
          {
            q: 'ランク昇格リワードとは？',
            a: '共創期間中に到達した創世ランクは、プロトコル開始後に自動で 1 ランク上がり、30 日間有効です。その後、実際のランクに戻ります。',
          },
          {
            q: '創世チームリワードはどう決済されますか？',
            a: '創世チームリワードは対応する創世ランクの比率で自動決済され、ご自身でウォレットへ受取る必要があります。共創期間終了後、このページは閉じます。未受取のリワードは受取れなくなり、スマートマーケットメイキング契約へ送られます。',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'リワードはどの形態で支給されますか？',
          a: 'すべてのリワードは gAGX で決済され、各プログラムのルールに従って対応するリワードカードへ入金されます。残高はいつでもリワードハブで確認できます。',
        },
        {
          q: 'リワード受取に必要な条件は？',
          a: '受取には貢献ポイントを {ratio} で消費します。ポイントは AGX をバーンして得られます。不足している場合は、先にバーンページで取得してください。',
        },
        {
          q: '受取したリワードはいつ着金しますか？',
          a: '受取時にリリース期間を選びます。リワードはリリースプールに入り線形リリースされ、期間が長いほど税率は低くなります。一部または全部を単一資産ステーキングへ再投資して複利することもできます。',
        },
        {
          q: 'リワードはいつ決済されますか？',
          a: 'ラッキー抽選は毎日 00:00（UTC）に決済されます。その他のリワードは Rebase に従い、約 {hours} 時間ごとに同じ周期で決済されます。次回の支給時刻は各リワード詳細のデータパネルで確認できます。',
        },
        {
          q: '一部のリワードカードが表示されない理由は？',
          a: '右上の設定ではデフォルトで「0 資産を非表示」がオンのため、残高 0 のカードは隠されます。チェックを外すと、すべてのリワードカードが表示されます。',
        },
      ],
    },

    teamRewardRate: 'チーム報酬 {rate}',
    superCommunityBadge: 'スーパー体系',
    heroTierRewardBody: 'チーム共創額の{bonus}をリワードとして獲得します。',
    superCommunityBenefitBody: 'スーパー体系は体系発展専項基金とガバナンス権益を獲得します。',
    shareholderNoRankTitle: 'まだ創世準備理事ではありません',
    shareholderNoRankBody:
      '創世準備理事になると、チーム共創額の1%-10%をリワードとして獲得でき、AEGIS Xローンチ後30日以内に1ランクアップできます。',
    shareholderTitleForRank: '{rank} · 創世準備理事',
    heroKicker: '創世ランク',
    currentTierSuffix: '現在',
    progressPersonalTo: '{rank}まで · 個人購入',
    progressMaxPersonal: '最高個人ランク到達',
    progressMaxTeam: '最高チームランク到達',
    teamLegRequirement: '{rank}ライン2本',
    tierDualLegRequirement: '{rank}ライン2本',
    teamQualifiedPartitionsLabel: '{rank}ライン {count}/2',
    teamVolume: '組織実績',
    referralRewards: '直接紹介リワード',
    autoPaidLabel: '自動支払',
    autoPaid: 'リワードはウォレットに自動決済',
    teamRewards: 'ランクリワード',
    heroTitle: '現在のランク',
    allTiers: '創世栄誉体系',
    history: 'リワード記録',
    referralHistoryEmpty: {
      title: '紹介リワード記録はまだありません',
      body: '紹介先がGenesis期間中に購入を完了すると、紹介リワードがここに表示されます。',
    },
    teamHistoryEmpty: {
      title: 'チームリワード記録はまだありません',
      body: 'チームリワードの決済・受取記録は、リワードが発生するとここに表示されます。',
    },
    communityFund: '発展基金',
    communityFundLocked: 'ロック中: {amount}',
    communityFundHistory: '発展基金',
    communityFundHistoryEmpty: {
      title: '発展基金の記録はまだありません',
      body: '発展基金の受取記録は、リワードが発生するとここに表示されます。',
    },
    rewardType: {
      referralPaid: '紹介リワード',
      referralWithdrawn: '紹介リワード受取',
      marketTeam: 'マーケットメイキングチーム賞',
      presaleTeam: 'プレセールチーム賞',
      unknown: '—',
    },
    logStatus: {
      pending: '保留中',
      processing: '処理中',
      paid: '支払済み',
      claimed: '受取済み',
      failed: '失敗',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'すでに紹介者をバインド済みです。',
      parentNotBound: '紹介者がまだバインドしていません。連絡してください。',
      selfReferral: '自分のアドレスは使用できません。',
      invalidParent: '有効な紹介者アドレスを入力してください。',
      migratedAccount: 'このアドレスは移行済みです。新しいアドレスを使用してください。',
      systemConfig: 'システム設定エラーです。後でもう一度お試しください。',
      failed: 'バインドに失敗しました。後でもう一度お試しください。',
    },
    title: 'コミュニティ',
    intro: 'パートナーを招待して共創に参加し、エコシステム成長価値と創世リワードを共有。',
    disconnectedIntro: 'ウォレット接続後に紹介リンクを生成し、招待者を紐付け。',
    referralLink: '自分の招待リンク',
    shareReferral: 'リンクをコピー',
    referrer: '自分の招待者',
    bindReferrer: '紐付け',
    referrerPlaceholder: '紹介者アドレスを入力（0x…）',
    referrerHint: '招待関係は有効化後に永久有効、変更不可。',
    docs: '資料',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: '共創に参加',
    myCommunity: 'マイコミュニティ',
    directReferrals: '直接紹介人数',
    myTeam: 'コミュニティ人数',
    genesisTitle: '現在',
    cobuildLevel: '共創ランク',
    inviteTitle: '招待を始める · エコシステム成長価値を共有',
    programs: {
      title: 'エコシステム支援プラン',
      items: [
        {
          label: '創世共創 · フェーズ{season}',
          title: '創世準備理事プログラム',
          body: '世界初の共創席位を開放',
          action: 'プラン詳細を見る',
          href: 'https://xdaoaegis.notion.site/genesis-reserve-council-program-jp',
        },
        {
          label: 'X学院',
          title: 'グローバルDeFi学院·デジタル経済時代のグローバルリーダーシップ学院',
          body: '時代のためにリーダーを育て·未来のために人材を備える',
          action: 'プラン詳細を見る',
          href: 'https://xdaoaegis.notion.site/x-jp',
        },
      ],
    },
    myInvites: 'マイコミュニティメンバー（{count}）',
    referralBondPermanent: '紹介関係が有効 · 紐付けは永久関係。',
    volumePrefix: '実績',
    statToday: '本日 +{count} · +{amount}',
    statRewardRate: '報酬比率 {rate}',
    bindReferrerSuccess: '紹介者の紐付けが完了しました',
    inviteFlow: {
      rewardLink: '報酬',
      items: [
        {
          title: '招待リンクを共有',
          body: 'ウォレットを接続し、招待者を入力すると専用招待リンクが生成されます。',
        },
        {
          title: 'パートナーが共創に参加',
          body: 'パートナーがあなたの招待リンクで登録後、共創に参加できます。',
        },
        {
          title: '報酬を獲得',
          body: 'パートナーが共創に参加すると、報酬はrebase収益の配布に合わせて決済されます。{link}欄で報酬を受け取れます。',
        },
      ],
    },
    invitesEmpty: {
      title: '招待記録はまだありません',
      body: '紹介リンクを共有して、友達をコミュニティに招待しましょう。',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '紹介関係はどのように成立しますか？',
          a: 'パートナーが招待リンクから共創に参加すると、紹介関係は自動的に成立し、永久に有効です。',
        },
        {
          q: '招待者を変更できますか？',
          a: '紹介関係を紐付けた後は変更できません。',
        },
        {
          q: '共創ランクをどう上げますか？',
          a: '個人の保有額とチーム業績の達成状況に基づき、A1からA13まで段階的に昇格します。',
        },
        {
          q: '体系発展手当の資格はどう得ますか？',
          a: '体系の累計業績が$1,000,000に達すると、5%の発展基金支援を受けられます。申請は招待者に相談できます。',
        },
      ],
    },
  },
  assets: {
    title: '資産',
    intro: 'AEGIS X エコシステムの資金を管理',
    body: 'AEGIS X エコシステムの資金を管理',
    backToHub: '資産に戻る',
    blocked: {
      zeroAmount: '有効な数量を入力してください',
      insufficientReward: '受取可能な収益が不足',
      insufficientContribution: '貢献値が不足しています。先に貢献ポイントへ交換してください',
      planUnresolved:
        'リリース/再投資プランの準備ができていません。しばらくしてから再試行してください',
      nothingToRedeem: '現在償還可能な枠はありません',
      warmupActive: 'ウォームアップ未了のため操作できません',
      warmupNotEnded: 'ウォームアップのカウントダウンがまだ終了していません',
      noWarmup: '有効化待ちのウォームアップポジションはありません',
      unavailable: '取引は一時利用不可です。しばらくしてから再試行してください',
    },
    position: {
      sort: '並び替え',
      quoteCurrency: '建値単位',
      sortOptions: {
        startNear: '開始時間 · 新しい順',
        startFar: '開始時間 · 古い順',
        endNear: '満期 · 近い順',
        endFar: '満期 · 遠い順',
      },
      emptyTitle: '資産で収益を生み始めましょう',
      pageSize: 5,
      voucher: 'バウチャー',
      remaining: '残り時間',
      staked: 'ステーキング数量',
      payout: '償還待ち',
      bondPrincipal: '債券元本',
      yield: '収益',
      claim: '受取',
      redeem: '償還',
      unstake: 'アンステーク',
      liquid: '流動',
      lockedPrefix: 'ロック',
      redeemAnytime: 'いつでも償還可能',
      fullyReleased: '完全に解除済み',
      activateWarmup: 'アンロック',
      activateWarmupSuccess: 'アンロック完了',
      warmupRemainingEpochs: '残り {n} Epoch',
    },
    opsColumns: ['時間', '操作', '試算数量', 'トランザクションハッシュ'],
    claim: {
      title: '収益を受取',
      amount: '受取数量',
      splitAria: 'リリースと再投資の比率',
      releaseShare: '受取 {pct}%',
      restakeShare: '再投資 {pct}%',
      releasePeriod: 'リリース期間の選択',
      releasePeriodAria: 'リリース期間の選択',
      restakePeriod: '再投資期間の選択',
      restakePeriodAria: '再投資期間の選択',
      releaseDays: '{days} 日',
      restakeDays: '{days} 日',
      restakeDaysTax: '{days} 日 · {tax}',
      taxRate: '税率 {rate}%',
      contribNeed: '今回の受取で控除する貢献値 {amount}',
      contribShort: '貢献値が不足しています。先にバーンで貢献ポイントへ交換してください',
      goBurn: 'バーン交換へ',
      ctaMixed: '受取 & 再投資',
      ctaRelease: '受取',
      ctaRestake: '再投資',
      success: '受取を送信しました',
      restakeSuccess: '再ステーキングを送信しました',
      xmineSuccess: 'X リワードの受取を送信しました',
    },
    claimOutput: {
      title: '産出を受取',
      rewardLabel: '収益',
      boostLabel: 'ボーナス',
      claimReward: '収益を受取',
      claimBoost: 'ボーナスを受取',
      contribDeduct: '貢献値を{amount}控除',
    },
    redeem: {
      releasedLabel: 'リリース済み',
      title: 'ステーキングを償還',
      body: '償還後、資産はバッファに入り {days} 日間の線形リリースとなります。バッファ内の資産は収益を生みません',
      confirmCta: '償還',
      success: '償還を送信しました — 元本はリリースバッファへ',
    },
    hub: {
      filterAria: '資産を絞り込み',
      hideZero: '0 資産を非表示',
      hideZeroEmpty: '非ゼロのポジションはありません',
      card: {
        position: 'ポジション',
        yield: '収益合計',
      },
      modes: {
        stake: {
          title: 'ステーキング',
          body: 'AGX の流動/定期ポジションを管理',
          aprHint:
            '受取済みステーキング収益と未受取のステーキング収益・ボーナス収益の合計に占める割合',
        },
        lpbond: {
          title: 'LP債券',
          body: '流動性債券ポジションを管理',
          aprHint: '受取済みLP債券収益と未受取LP債券収益の合計に占める割合',
        },
        burnbond: {
          title: 'バーン債券',
          body: 'バーン債券ポジションを管理',
          aprHint: '受取済みバーン債券収益と未受取バーン債券収益の合計に占める割合',
        },
        xmine: {
          title: 'Xマイニング',
          body: 'gAGX マイニングポジションを管理',
          aprHint: '受取済みマイニング産出と未受取マイニング産出の合計に占める割合',
        },
      },
      overview: {
        title: '資産概要',
        totalValue: '総資産価値',
        totalValueHint: '現在市場価格で評価 · 保有元本と未引出収益を含む',
        claimable: '受取可能収益',
        claimed: '累計受取済み',
        contribution: '貢献ポイント',
        contributionHint: '収益受取は {ratio} で消費',
        holdingsTitle: '保有',
        holdingsReleased: 'リリース済み',
        holdingsTotal: '総保有',
        bufferTitle: 'バッファプール',
        bufferHint:
          '元本のアンステーク後はバッファプールで {days} 日間の二次線形リリースが行われ、短期の集中流出が市場流動性へ与える衝撃を抑え、資金放出の連続性と市場安定のバランスを取ります。',
        bufferTotal: 'Total',
        bufferReleased: 'リリース済み',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'バッファプール資産表示を切替',
      },
      distribution: {
        title: '保有分布',
        empty: '保有はまだありません。ステーキングまたは債券購入後、ここに分布が表示されます。',
      },
      rebase: {
        title: 'Rebase 収益リリースの仕組み',
        subtitle: '段階決済と継続リリースで市場変動を抑え、長期成長の安定性を高めます',
        steps: [
          { title: 'Block', body: 'ブロック運行\\n基礎単位' },
          { title: 'Epoch', body: '約 {blocks} ブロック\\n約 {hours} 時間' },
          { title: 'Rebase', body: 'Epoch 終了\\n自動決済' },
          { title: 'Rebase', body: '収益分配\\n1日 {timesPerDay} 回' },
        ],
        tags: ['ブロック駆動運行', 'Epoch 駆動決済', 'Rebase 駆動分配', '平滑リリース収益'],
        footer: 'ブロックが周期を駆動し、Epoch で決済、Rebase で収益を分配',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '総資産価値はどう計算されますか？',
            a: '総資産価値 = ポジション元本 + 未受取収益 + マイニング産出で、いずれも現在の市場価格で評価します。ウォレットの遊休残高は含めません。価格変動は評価額にリアルタイムで反映されます。',
          },
          {
            q: '収益はどの形態で支給されますか？',
            a: 'ステーキング、LP債券、バーン債券の Rebase 収益は gAGX で決済されます。gAGX は 1:1 で AGX に償還するか、Xマイニングに使えます。Xマイニングの産出はエコシステム価値トークン X で、いつでも受取れます。',
          },
          {
            q: '収益を受取れない理由は？',
            a: '収益の受取には貢献値を消費します。アカウントの貢献値が不足していると受取できません。先に AGX を購入してバーンし、貢献値を得てから資産ページへ戻ってください。貢献値の仕組みにより、収益の引出は必ずプロトコルのデフレにも寄与します。',
          },
          {
            q: '貢献値はどう得ますか？',
            a: 'AGX を購入してバーンすると貢献値を得られます。収益受取時は {ratio} で消費します。受取る予定の収益に見合う分をあらかじめ用意してください。',
          },
          {
            q: '収益受取時にリリース期間を選ぶ理由は？',
            a: '受取した収益は即時着金せず、選択した期間で線形リリースされます。期間が長いほど税率は低くなります：{taxSchedule}。',
          },
          {
            q: '収益受取後はどこへ行きますか？',
            a: '受取した収益はウォレットへ直接入らず、リリースプールに入り、選んだ期間で線形リリースされます。リリースプールで各受取の進捗を確認でき、リリース済み分はウォレットへ引き出せます。',
          },
          {
            q: '収益の再投資と受取の違いは？',
            a: '再投資はリリース期間をスキップし、収益が単一資産ステーキングへ直接入って複利を続けます。税率も有利（{restakeTax}）で、長期参加者向きです。受取はリリース期間をかけてウォレットへ着金し、より柔軟です。',
          },
          {
            q: 'バッファプールとは？',
            a: '元本をアンステークするとバッファプールに入り、{days} 日の二次線形リリースで短期の集中流出を抑えます。バッファ内の「リリース済み」分はいつでもウォレットへ償還できます。',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'ステーキングポジション',
        intro: '各ステーキングを管理 — いつでも収益受取または元本償還',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'ポジションデータ',
          metrics: [
            { label: 'マイ保有' },
            { label: 'リリース済み' },
            { label: 'リリース待ち' },
            {
              label: '現在の Rebase 収益率',
              hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
            },
            {
              label: '現在の Rebase ボーナス',
              hint: '未受取の Rebase ボーナスは複利を生みません',
            },
            {
              label: 'ステーキング総収益',
              hint: '受取済みと未受取のステーキング収益の合計',
            },
          ],
        },
        ops: {
          title: '操作記録',
          empty:
            '操作記録はまだありません。ステーキング・受取・償還後、各操作がここに表示されます。',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '受取と償還の違いは？',
              a: '受取は収益向け：蓄積した gAGX を選択したリリース期間で引き出すか、再投資します。償還は元本向け：リリース済み AGX 元本を取り出し、{days} 日バッファで二次線形リリースしたあとウォレットへ入ります。',
            },
            {
              q: 'なぜ各ステーキングが個別表示されますか？',
              a: '各ステーキングは期間・収益・ボーナス・リリース進捗を独立して追跡します。満期と実行可能な操作は他のポジションに影響しないため、個別に表示・操作します。',
            },
            {
              q: '「リリース済み」とは？',
              a: '元本はブロック単位で線形にアンロックされます（約 3 秒/ブロック）。「リリース済み」はすでにアンロックされ、いつでも償還できる部分です。残りは期間に沿ってリリースが続きます。',
            },
            {
              q: 'カウントダウン終了後はどうなりますか？',
              a: 'カウントダウン終了は元本リリース完了を意味し、全元本をいつでも償還できます。未償還の元本は引き続き収益を生みます。元本を償還したあと、未受取の収益は失効せず、複利が続きます。',
            },
            {
              q: '受取時の再投資比率はどう使いますか？',
              a: 'スライダーで再投資と受取の配分を決めます。再投資分は選択した期間の単一資産ステーキングへ直接入り、複利を続けます（税率が有利）。受取分は選択したリリース期間で線形に着金します。',
            },
          ],
        },
      },
      lpbond: {
        title: 'LP債券ポジション',
        intro: '各債券を管理 — いつでも収益受取または元本償還',
        empty: 'LP債券ポジションはまだありません。債券購入後、各ポジションがここに表示されます。',
        emptyCta: '最初の LP債券を購入して収益を始めましょう',
        stats: {
          title: 'ポジションデータ',
          metrics: [
            { label: 'マイ保有' },
            { label: 'リリース済み' },
            { label: 'リリース待ち' },
            {
              label: '現在の Rebase 収益率',
              hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
            },
            {
              label: 'LP債券総収益',
              hint: '受取済みと未受取の LP 債券収益の合計',
            },
          ],
        },
        ops: {
          title: '操作記録',
          empty:
            '操作記録はまだありません。ステーキング・受取・償還後、各操作がここに表示されます。',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '受取と償還の違いは？',
              a: '受取は収益向け：債券の gAGX 収益を選択リリース期間で引出、または直接再投資。償還は元本向け：リリース済み AGX 元本を取り出し、{days} 日バッファで二次線形リリース後にウォレット着金。',
            },
            {
              q: '「債券元本」はどう生じますか？',
              a: 'LP 債券購入時、支払った USD1 が割引価格で AGX に換算され、それが当該債券の元本です。選択期間（180/360/540 日）でブロック線形リリースし、「リリース済み」分はいつでも償還できます。',
            },
            {
              q: 'なぜ各債券が個別表示されますか？',
              a: '各債券は期間・割引・収益・リリース進捗を独立計算し、満期と実行可能操作が互いに影響しないため、ポジション単位で表示・操作します。',
            },
            {
              q: '債券収益は再投資できますか？',
              a: 'できます。受取時にスライダーで再投資と受取の比率を自由配分。再投資分は選択期間（{restakeDays} 日）の単一資産ステーキングへ入り複利継続し、期間受取より税率が有利です。',
            },
            {
              q: 'カウントダウン終了後はどうなりますか？',
              a: 'カウントダウン終了は元本リリース完了を意味し、いつでも全元本を償還できます。未受取収益は失効せず、複利収益が継続します。',
            },
            {
              q: 'LP 債券の LP は取り戻せますか？',
              a: 'できません。構築された AGX/USD1 LP はブラックホールアドレスへ永久ロックされ、プロトコルの恒久流動性になります。あなたが得るのは割引価格で鋳造された AGX 元本とその継続収益です。',
            },
          ],
        },
      },
      burnbond: {
        title: 'バーン債券ポジション',
        intro: '各債券を管理 — いつでも収益受取または元本償還',
        empty:
          'バーン債券ポジションはまだありません。債券購入後、各ポジションがここに表示されます。',
        emptyCta: '最初のバーン債券を購入して収益を始めましょう',
        stats: {
          title: 'ポジションデータ',
          metrics: [
            { label: 'マイ保有' },
            { label: 'リリース済み' },
            { label: 'リリース待ち' },
            {
              label: '現在の Rebase 収益率',
              hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
            },
            {
              label: 'バーン債券総収益',
              hint: '受取済みと未受取のバーン債券収益の合計',
            },
          ],
        },
        ops: {
          title: '操作記録',
          empty:
            '操作記録はまだありません。ステーキング・受取・償還後、各操作がここに表示されます。',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '受取と償還の違いは？',
              a: '受取は収益向け：債券の gAGX 収益を選択リリース期間で引出、または直接再投資。償還は元本向け：リリース済み AGX 元本を取り出し、{days} 日バッファで二次線形リリース後にウォレット着金。',
            },
            {
              q: '「債券元本」はどう生じますか？',
              a: 'バーン債券購入時、支払った USD1 が割引価格で AGX に換算され、それが当該債券の元本です。選択期間（180/360/540 日）でブロック線形リリースし、「リリース済み」分はいつでも償還できます。',
            },
            {
              q: 'なぜ各債券が個別表示されますか？',
              a: '各債券は期間・割引・収益・リリース進捗を独立計算し、満期と実行可能操作が互いに影響しないため、ポジション単位で表示・操作します。',
            },
            {
              q: '債券収益は再投資できますか？',
              a: 'できます。受取時にスライダーで再投資と受取の比率を自由配分。再投資分は選択期間（{restakeDays} 日）の単一資産ステーキングへ入り複利継続し、期間受取より税率が有利です。',
            },
            {
              q: 'カウントダウン終了後はどうなりますか？',
              a: 'カウントダウン終了は元本リリース完了を意味し、いつでも全元本を償還できます。未受取収益は失効せず、複利収益が継続します。',
            },
            {
              q: 'バーン債券は AGX にどんな影響がありますか？',
              a: 'バーン債券購入資金は自動で AGX を買い、ブラックホールへ永久バーンします。流通量を減らしデフレを強化しつつ、割引と収益を得ながらプロトコル価値成長を後押しします。',
            },
          ],
        },
      },
      xmine: {
        title: 'Xマイニングポジション',
        intro: '各マイニングステーキングを管理 — いつでも産出受取またはステーキング償還',
        empty:
          'Xマイニングポジションはまだありません。gAGX をステーキングしてマイニング開始後、各ポジションがここに表示されます。',
        emptyCta: 'gAGX をステーキングして X を採掘',
        periodPill: 'マイニングステーキング',
        output: '産出',
        stats: {
          title: 'ポジションデータ',
          metrics: [
            { label: 'マイマイニングステーキング' },
            { label: 'リリース済み' },
            { label: '現在のマイニング産出' },
            {
              label: 'マイニング総産出',
              hint: '受取済みと未受取のマイニング産出の合計',
            },
          ],
        },
        ops: {
          title: '操作記録',
          empty:
            '操作記録はまだありません。ステーキング・受取・償還後、各操作がここに表示されます。',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '産出受取とステーキング償還の違いは？',
              a: '受取はマイニング産出向け：X リワードはいつでも受取可能でリリース期間なし、ウォレットへ直入。償還はステーキング元本向け：gAGX 償還後はバッファに入り {days} 日二次線形リリースし、バッファ内資産は収益を生みません。',
            },
            {
              q: '一部ポジションが「ロック」と表示される理由は？',
              a: '各 gAGX ステーキング後は 24 時間ロックされ、ロック中は償還不可。カウントダウン終了後に「いつでも償還可能」と表示され、償還を開始できます。',
            },
            {
              q: 'マイニング産出はどう計算されますか？',
              a: '毎日 UTC 0 に金本位で決済：ステーキング gAGX のドル価値 × 当日収益率を X に換算して支給。産出数量は AGX と X の価格に連動して変動します。',
            },
            {
              q: 'マイニング産出は複利しますか？',
              a: '自動複利しません。X 産出は手動受取。マイニングポジションを拡大したい場合は、新たに得た gAGX を追加ステーキングできます（ステーキング上限の制約あり）。',
            },
            {
              q: 'ステーキング上限が変わる理由は？',
              a: 'gAGX ステーキング上限は、口座の ≥180 日 AGX 債券保有と AGX ステーキング合計を超えられません。債券や長期ステーキングを増やすと上限が上がり、保有リリース満期で上限は下がります。',
            },
            {
              q: '償還後も産出を得られますか？',
              a: 'できません。償還した gAGX はバッファに入った時点でマイニング産出が停止します。未償還のポジションは影響なく、通常どおり産出します。',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'ステーキング',
    intro: 'ステーキングと債券で共創 — Rebase 複利成長を共有',
    body: 'ステーキングと債券で共創 — Rebase 複利成長を共有',
    backToHub: 'ステーキングに戻る',
    max: '最大',
    capUnlimited: '無制限',
    blocked: {
      notBound: '先に紹介関係を紐付けてください',
      accountMigrated: 'このアドレスは移行済みです — 新しいアドレスで操作してください',
      migrationNotOpen: 'アカウント移行はまだ開放されていません',
      insufficientBalance:
        'ウォレット残高が足りません。数量を減らすか、先に入金してから再度お試しください',
      insufficientGagx:
        'gAGX 残高が足りません：先にフラッシュで AGX を gAGX にラップしてから再度お試しください',
      insufficientAllowance: '承認不足',
      insufficientQuota: 'ステーキング可能な枠を超えています。数量を減らしてから再度お試しください',
      insufficientQuotaWithAmount:
        'ステーキング可能な枠を超えています：現在あと最大 {quota} AGX までステーキングできます。数量を減らしてから再度お試しください。',
      insufficientQuotaPersonalWithAmount:
        'ご自身のステーキング可能枠を超えています：個人累計上限の残りは {quota} AGX です。数量を減らしてから再度お試しください。',
      insufficientQuotaPersonalDailyWithAmount:
        '本日のステーキング可能枠を超えています：今日の個人枠の残りは {quota} AGX です。数量を減らすか、枠が更新されるまでお待ちください。',
      insufficientQuotaPoolWithAmount:
        'オンチェーンのステーキングプール枠が足りません：プールの残りは現在 {quota} AGX です。数量を減らすか、しばらくしてから再度お試しください。',
      insufficientXmineQuotaWithAmount:
        'マイニング枠を超えています：マイニング枠はロック元本で決まり、現在あと最大 {quota} gAGX までステーキングできます。数量を減らすか、先にロックポジションを増やしてから再度お試しください。',
      poolPaused: 'このステーキングプールは一時停止中です。しばらくしてから再度お試しください',
      depositoryNotAuth:
        'この債券市場はまだ購入できません。別の期間を選ぶか、しばらくしてから再度お試しください',
      insufficientDebtCapacity:
        'この債券市場の残販売枠が足りません。購入金額を減らすか、しばらくしてから再度お試しください',
      bondTooSmall:
        '購入金額が小さすぎます：割引後の償還額が最低要件を下回ります。購入金額を増やしてから再度お試しください',
      bondTooLarge:
        '購入金額が大きすぎます：この債券の1回あたりの償還上限を超えています。購入金額を減らしてから再度お試しください',
      zeroAmount: '有効な数量を入力してください',
      unavailable: '取引は一時利用不可です — しばらくしてから再試行してください',
    },
    hub: {
      modes: {
        stake: {
          title: 'ステーキング',
          body: 'AGX をステーキング — 1日 {timesPerDay} 回の Rebase 複利成長',
        },
        lpbond: {
          title: 'LP債券',
          body: 'USD1 で底プールを共創 — 割引で AGX を取得',
        },
        burnbond: {
          title: 'バーン債券',
          body: '割引で AGX を鋳造し永久バーンしてデフレを強化',
        },
        xmine: {
          title: 'Xマイニング',
          body: 'gAGX をステーキング — 元本毀損なく X エコシステムリワードを採掘',
        },
        calc: {
          title: '収益計算機',
          body: '期間と価格ごとの想定収益を試算',
        },
      },
      overview: {
        title: '概要',
        metrics: [
          {
            id: 'tvl',
            label: 'ステーキング総量 TVL',
            hint: 'プロトコル内のステーキング済み AGX 総量と概算ドル価値',
          },
          {
            id: 'mcap',
            label: '時価総額',
            hint: '市場流通中の AGX 数量に対応する総価値',
          },
          {
            id: 'circulating',
            label: 'AGX 流通量',
            hint: '市場で流通中の AGX 数量',
          },
          {
            id: 'treasury',
            label: 'シンクタンク準備',
            hint: 'シンクタンク準備資産は担保鋳造・スマートマーケットメイキング・リスク防衛を支えるために使われます',
          },
          {
            id: 'price',
            label: 'AGX 価格',
            hint: 'AGX の USD1 に対する市場参考価格',
          },
          {
            id: 'burned',
            label: '総バーン量',
            hint: 'バーン債券購入と貢献ポイント購入でバーンされた AGX 総量',
          },
          {
            id: 'rebase',
            label: '現在の Rebase 収益率',
            hint: '各 Epoch（約 {hours} 時間）に1回決済し、プロトコル運行状態に応じて動的調整',
          },
          {
            id: 'runway',
            label: '運行可能期間',
            hint: '現在のシンクタンク準備とプロトコル支出から推定する持続運行期間',
          },
          {
            id: 'stakers',
            label: 'ステーキングアドレス数',
            hint: 'ネットワーク全体でステーキングに参加したアドレス総数',
          },
        ],
      },
      periodTable: {
        title: 'ステーキング期間と収益',
        segmentAria: '期間表の製品切替',
        segs: {
          stake: 'ステーキング',
          lpbond: 'LP債券',
          burnbond: 'バーン債券',
        },
        columns: ['試算期間', '基礎収益率（日）', '収益率ボーナス', '期間収益率'],
        bondColumns: ['試算期間', '基礎収益率（日）', '割引率', '期間収益率'],
        rows: [
          { id: 'liquid', period: '流動（期限付き）' },
          { id: '180', period: '180日' },
          { id: '360', period: '360日' },
          { id: '540', period: '540日' },
        ],
      },
      runwayDays: '{days}日',
      chart: {
        title: 'データ指標',
        metricTabs: {
          tvl: 'ステーキング総量 TVL',
          mcap: '時価総額',
        },
        metricAria: 'データ指標切替',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Rebase はどう決済されますか？',
            a: 'プロトコルはブロックを基礎に運行：約 {blocks} ブロック = 1 Epoch（約 {hours} 時間）。各 Epoch 終了時に Rebase 決済を実行し、システムは1日 {timesPerDay} 回収益を分配します。',
          },
          {
            q: '元本はどうリリースされますか？',
            a: 'ステーキングと債券の元本はブロック級線形リリース（約 3 秒/ブロックで連続決済）。リリース済み元本は引出後、{days} 日バッファリリースへ入り、二重線形で資金継続性と市場安定を両立します。',
          },
          {
            q: 'ステーキング、LP債券、バーン債券の違いは？',
            a: 'ステーキングは AGX を直接預けて Rebase 複利収益を得る方式。LP債券とバーン債券は USD1 で割引 AGX を取得——LP債券は永久基盤流動性を構築し、バーン債券は AGX を直接バーンしてデフレを強化。三者とも元本は期間のブロック線形リリースで、Rebase 収益も享受します。',
          },
          {
            q: '収益はどの形態で支給されますか？',
            a: '各セクションの Rebase 収益は統一して gAGX で決済。gAGX はいつでも 1:1 で AGX に交換でき、ステーキングして X マイニングにも参加し、エコシステム価値トークン X を得られます。',
          },
          {
            q: 'シンクタンク準備の役割は？',
            a: 'シンクタンク準備（USD1）はプロトコルの価値裏付けです。150% 過剰担保での AGX 鋳造、AI スマートマーケットメイキング、市場リスク防衛に使います。「運行可能期間」は現在の準備と支出から推定する持続運行時間です。',
          },
          {
            q: '自分に合う参加方法はどう選びますか？',
            a: '安定複利ならステーキング。割引で AGX を得たいなら LP債券またはバーン債券。gAGX を持ちエコシステム配当を狙うなら Xマイニング。先に収益計算機で製品・期間の想定収益を試算してから決めてください。',
          },
          {
            q: '時価総額と AGX 流通量はどう理解しますか？',
            a: 'AGX 流通量は市場で流通中の AGX 数量、時価総額 = 流通量 × 現在価格。総ステーキング量と総バーン量と合わせて、ロック率とデフレ進捗を観察できます。',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: '時間', minutes: '分', seconds: '秒' },
      overview: '概要',
      positions: 'マイポジション',
      positionsHint: 'ポジションの受取・償還・アンステークは資産タブで操作します。',
      viewPositions: '表示',
      mechanism: '仕組みの説明',
      faq: 'よくある質問',
      recordsTitles: {
        stake: 'マイステーキング記録',
        lpbond: '債券購入記録',
        burnbond: '債券購入記録',
        xmine: 'マイマイニング記録',
      },
      recordColumns: ['時間', '試算期間', '試算数量', 'リリース済み', 'トランザクションハッシュ'],
      bondRecordColumns: [
        '時間',
        '試算期間',
        '支払',
        '割引',
        '獲得 AGX',
        'トランザクションハッシュ',
      ],
      xmineRecordColumns: ['時間', '操作', '試算数量', 'トランザクションハッシュ'],
      recordsEmpty: {
        stake: 'ステーキング記録はまだありません。完了後、各ステーキングがここに表示されます。',
        lpbond: '購入記録はまだありません。LP 債券購入後、各購入がここに表示されます。',
        burnbond: '購入記録はまだありません。バーン債券購入後、各購入がここに表示されます。',
        xmine:
          'マイニング記録はまだありません。gAGX をステーキングしてマイニング開始後、各操作がここに表示されます。',
      },
      recordsFooter: {
        stake: '累計ステーク {amount} AGX',
        bond: '累計購入 {amount}',
        xmine: '累計ステーク {amount} gAGX',
      },
      chartTitles: {
        stake: 'TVL（ステーキング）データ指標',
        lpbond: 'TVL（LP 債券）データ指標',
        burnbond: 'TVL（バーン債券）データ指標',
        xmine: 'TVL（Xマイニング）データ指標',
      },
      chartRangeAria: 'チャート時間範囲',
      chartRanges: ['1週', '1月', '1年', 'すべて'],
      chartEmpty: '履歴データはまだありません',
      positionMetrics: [
        { label: 'マイポジション' },
        { label: 'リリース済み' },
        { label: 'リリース待ち' },
        {
          label: '現在の Rebase 収益率',
          hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
        },
        {
          label: '現在の Rebase ボーナス',
          hint: '未受取の Rebase ボーナスは複利を生みません',
        },
      ],
      xValue: {
        title: 'X 長期価値システム',
        supplyLabel: 'X 総発行量',
        supplyValue: '210,000,000',
        badge: '固定総量 · 追加発行なし',
        columns: [
          {
            pct: '47.62%',
            title: 'LP 流動性構築',
            bullets: ['初期流動性構築', 'マーケットメイキングと流動性支援'],
          },
          {
            pct: '52.38%',
            title: 'グローバルリワードと発展',
            bullets: [
              'gAGX マイニングリワード',
              '市場拡大とブランド提携',
              'エコシステム建設と長期発展',
            ],
          },
        ],
        sourcesKicker: '価値の源泉',
        sourcesHeadline: '三重の需要が重なる',
        sourcesBadge: 'X 需要を持続的に強化',
        sources: [
          { title: 'gAGX 需要', copy: 'ステーキングで採掘し、X 需要を生む' },
          { title: '収益還流', copy: 'プロトコル収益が継続的にエコシステムへ還流' },
          { title: 'エコシステム成長', copy: 'アプリ拡大とユーザー増が需要を牽引' },
        ],
        deflationKicker: 'X デフレの仕組み',
        deflationHeadline: '持続的デフレ',
        deflationBadge: '供給減 · 価値向上',
        deflationSteps: [
          { title: 'エコシステム成長', copy: 'エコシステムが持続的に発展' },
          { title: 'X 需要の増加', copy: 'アプリと取引が需要を押し上げる' },
          { title: '市場流通', copy: 'X が市場で流通・利用される' },
          { title: '売却税 25% バーン', copy: '売却ごとに自動で 25% をバーン' },
        ],
        featuresKicker: 'X の中核特性',
        featuresHeadline: '長期価値の担い手',
        featuresBadge: '希少 · デフレ · 流動 · 拡張',
        features: [
          { title: '固定総量', copy: '総量は一定、希少価値' },
          { title: '持続的デフレ', copy: 'バーンの仕組みが価値を高める' },
          { title: '流動性の支え', copy: '流動性が市場を安定させる' },
          { title: 'エコシステム拡張', copy: 'アプリ拡大が価値を蓄積' },
        ],
      },
    },

    stake: {
      title: 'ステーキング',
      intro: 'AGX をステーキング · 1日 {timesPerDay} 回の Rebase 複利成長',
      periodLabel: 'ステーキング期間を選択',
      periodAria: 'ステーキング期間を選択',
      amountAria: 'ステーキング数量',
      amountBalance: '数量（ウォレット残高 {balance} AGX）',
      quotaInline: 'ステーキング枠：{quota} AGX',
      submit: 'ステーキング',
      bindCta: '紹介を紐付け',
      success: 'ステーキング成功',
      periods: {
        liquid: '流動',
        d180: '180日',
        d360: '360日',
        d540: '540日',
      },
      meta: {
        baseDaily: '基礎収益率（日）',
        periodYield: '期間収益率',
        bonus: '収益率ボーナス',
        lock: 'ロック日数',
        remaining: '残枠',
        contract: '契約を確認',
        lockLiquid: '流動',
        lockDays: '{days} 日線形リリース',
      },
      overviewMetrics: [
        { label: '総ステーキング量' },
        {
          label: '現在の Epoch',
          hint: '各 Epoch は約 {hours} 時間（{blocks} ブロック）で、ステーキング収益は Epoch ごとに決済されます',
        },
        { label: '次回 Rebase 支給' },
        {
          label: '現在の Rebase 収益率',
          hint: '各 Epoch（約 {hours} 時間）に1回決済し、プロトコル運行状態に応じて動的調整',
        },
      ],
      mechanismTitle: 'ステーキングの仕組み',
      mechanism:
        '流動ステーキングは warmup 後に有効化が必要。定期ステーキングは選択プールでロック。リワード受取と元本退出は資産ページで行います。',
      mechanismSteps: [
        {
          title: 'AGX をステーキング',
          body: '流動、または 180/360/540 日で AGX をステーキング。長期ほど高い Rebase ボーナス。',
        },
        {
          title: '毎日の Rebase 収益',
          body: '各 Epoch（約 {hours} 時間）で自動決済し、収益は gAGX として複利蓄積。',
        },
        {
          title: '満期リリースと受取',
          body: '元本はブロック単位で線形リリース。gAGX は 1:1 で AGX に交換、または続けてステーキングして X を採掘できます。',
        },
      ],
      faq: [
        {
          q: 'ステーキング収益はどう計算されますか？',
          a: '1日 {timesPerDay} 回 Rebase、日次収益 0.5%–1%。期間が長いほどボーナスが高く：180 日 ≥10%、360 日 ≥15%、540 日 ≥20%。Rebase 係数と連動調整。',
        },
        {
          q: 'ステーキング元本はいつ引き出せますか？',
          a: '元本はブロック線形リリース（約 3 秒/ブロック）。リリース済み分はいつでも引出でき、引出後は {days} 日バッファリリースへ入ります。',
        },
        {
          q: '参考 APY は固定ですか？',
          a: 'いいえ。APY は参考値で、実際の収益は Rebase 係数・プロトコル運行状態・市場需給に応じて動的に調整されます。',
        },
        {
          q: 'Rebase 収益と Rebase ボーナスの違いは？',
          a: 'Rebase 収益は基礎収益率から生じる部分で、未受取時は各爆ブロック報酬とともに複利蓄積。Rebase ボーナスは長期ステーキングの追加分で、未受取時は複利せず、早めの受取を推奨します。',
        },
        {
          q: '収益はどの形態で支給されますか？',
          a: 'ステーキング収益は gAGX で支給。gAGX はいつでも 1:1 で AGX に交換でき、続けて Xマイニングにステーキングしてエコシステム価値トークン X を得られます。',
        },
        {
          q: 'ステーキング満期前に早期退出できますか？',
          a: '早期退出はできません。元本は選択期間のブロック線形でリリースされ、リリース済み分のみいつでも引出可能。資金計画に合う期間を選んでください。',
        },
        {
          q: '流動ステーキングにどんな制限がありますか？',
          a: '流動ステーキングは収益率ボーナスなし。日次グローバル枠と単口座枠の制限があり、枠は毎日定時リセットで先着順です。',
        },
        {
          q: '同一アカウントで複数のステーキングはできますか？',
          a: 'できます。各ステーキングは期間・収益・リリース進捗を独立計算し、「マイステーキング記録」で個別に確認できます。',
        },
      ],
    },
    lpbond: {
      title: 'LP債券',
      intro: 'USD1 で底プールを共創し、割引で AGX を取得',
      periodLabel: '債券期間を選択',
      periodAria: 'LP 債券期間',
      amountAria: '購入数量',
      amountBalance: '数量（ウォレット残高 {balance} USD1）',
      submit: '購入',
      success: '購入成功',
      footnote:
        'システムは自動で AGX/USD1 LP を構築しブラックホールへバーンし、永久基盤流動性を形成します。',
      card: {
        yield: '期間収益率',
        discountRange: '割引区間',
        sold: '販売済み',
        currentDiscount: '現在の割引',
        discountPrice: '割引価格',
      },
      meta: {
        discount: '割引価格（{pct}%）',
        slippage: '許容スリッページ',
        pay: '支払',
        receive: 'AGX を獲得',
        cap: '最大購入量',
        release: '元本リリース',
        releaseLinear: '{days} 日ブロック線形リリース',
        contract: '契約を確認',
      },
      overviewMetrics: [
        { label: 'LP債券総ステーキング量' },
        {
          label: '債券プレミアム率',
          hint: '現在の割引価格が AGX 市場価格に対して持つ収益余地',
        },
        { label: '次回 Rebase 支給' },
        {
          label: '現在の Rebase 収益率',
          hint: '各 Epoch（約 {hours} 時間）に1回決済し、プロトコル運行状態に応じて動的調整',
        },
      ],
      positionMetrics: [
        { label: 'My stake' },
        { label: '受取' },
        { label: 'リリース待ち' },
        {
          label: 'Current Rebase reward',
          hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
        },
      ],
      mechanismTitle: 'LP債券の仕組み',
      mechanism:
        'BondHelper 経由で USD1 を zap し、対応期間の BondDepository へ。償還と収益は資産ページ。',
      mechanismSteps: [
        {
          title: 'LP 債券を購入',
          body: 'USD1 で底プール共創に参加し、割引で AGX を鋳造。',
        },
        {
          title: 'LP を自動構築',
          body: 'システム契約が AGX/USD1 流動性を自動構築。',
        },
        {
          title: 'ブラックホール永久ロック',
          body: 'LP Token はブラックホールアドレスへ移され、永久に分解不可。',
        },
      ],
      faq: [
        {
          q: 'LP 債券とは？',
          a: 'USD1 で底プール共創に参加。システム契約が自動で割引鋳造 AGX、AGX/USD1 LP 構築、ブラックホールへバーン（Blackhole Lock）まで行い、永久に解体できない基盤流動性を構築します。',
        },
        {
          q: '割引はどう決まりますか？',
          a: '割引は市場需給とプロトコルパラメータで動的調整（Dynamic Bond Control）：180 日 85%–100%、360 日 80%–100%、540 日 75%–100%。期間が長いほど割引が有利。',
        },
        {
          q: 'LP 債券購入後、LP Token を保有しますか？',
          a: 'いいえ。LP Token はシステムが構築後にブラックホールへ直接バーンされ、プロトコルの永久流動性となり個人保有にはなりません。実際に得るのは割引鋳造の AGX で、選択債券期間のブロック線形でリリース着金します。',
        },
        {
          q: '債券プレミアム率とは？',
          a: 'プレミアム率は、現在の割引価格と AGX 市場価格の差の収益余地を示します。プラスなら、債券経由で AGX を得る方が市価直買いより有利です。',
        },
        {
          q: '早期償還できますか？',
          a: '早期償還はできません。元本は選択期間のブロック線形でリリースされ、リリース済み分はいつでも受取可能。資金計画に合う債券期間を選んでください。',
        },
        {
          q: '支払った USD1 はどこへ行きますか？',
          a: '支払った USD1 と割引鋳造の AGX で AGX/USD1 LP を組成。LP Token はその後ブラックホールへバーンされ、プロトコルの永久流動性になります。',
        },
      ],
    },
    burnbond: {
      title: 'バーン債券',
      intro: '割引で AGX を鋳造し永久バーンしてデフレを強化',
      periodLabel: '債券期間を選択',
      periodAria: 'バーン債券期間',
      amountAria: '購入数量',
      amountBalance: '数量（ウォレット残高 {balance} USD1）',
      submit: '購入',
      success: '購入成功',
      footnote: 'システムは割引比率で AGX を鋳造し、自動購入してブラックホールへ永久バーンします。',
      card: {
        yield: '期間収益率',
        discountRange: '割引区間',
        sold: '販売済み',
        currentDiscount: '現在の割引',
        discountPrice: '割引価格',
      },
      meta: {
        discount: '割引価格（{pct}%）',
        slippage: '許容スリッページ',
        pay: '支払',
        receive: 'AGX を獲得',
        cap: '最大購入量',
        release: '元本リリース',
        releaseLinear: '{days} 日ブロック線形リリース',
        contract: '契約を確認',
      },
      overviewMetrics: [
        { label: 'バーン債券総ステーキング量' },
        {
          label: '債券プレミアム率',
          hint: '現在の割引価格が AGX 市場価格に対して持つ収益余地',
        },
        { label: '次回 Rebase 支給' },
        {
          label: '現在の Rebase 収益率',
          hint: '各 Epoch（約 {hours} 時間）に1回決済し、プロトコル運行状態に応じて動的調整',
        },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'リリース済み' },
        { label: 'リリース待ち' },
        {
          label: 'Current Rebase reward',
          hint: '未受取の Rebase 収益は、各ブロック報酬とともに複利で増え続けます',
        },
      ],
      mechanismTitle: 'バーン債券の仕組み',
      mechanism:
        'BondHelper 経由で USD1 を zap し、対応期間の BurnBondDepository へ。償還と収益は資産ページ。',
      mechanismSteps: [
        {
          title: 'USD1 を支払う',
          body: 'リリース期間を選び、現在の割引でバーン債券に参加。',
        },
        {
          title: '割引鋳造 AGX',
          body: 'システムは対応割引比率で AGX を鋳造。',
        },
        {
          title: '購入して永久バーン',
          body: '自動で AGX を買い、ブラックホールへバーンしてデフレを強化。',
        },
      ],
      faq: [
        {
          q: 'バーン債券とは？',
          a: 'USD1 でバーン債券に参加すると、システム契約が自動で対応割引比率の AGX 鋳造、AGX 自動購入と永久バーン（Blackhole Lock）を行い、市場流通量を継続削減して長期価値裏付けを強化します。',
        },
        {
          q: 'LP 債券との違いは？',
          a: 'LP 債券は永久基盤流動性を構築し、バーン債券は流通量を直接デフレ化。割引帯は同一（75%–100%、期間で動的調整）。元本はどちらも期間のブロック線形リリース。',
        },
        {
          q: '債券プレミアム率とは？',
          a: 'プレミアム率は、現在の割引価格と AGX 市場価格の差の収益余地を示します。プラスなら、債券経由で AGX を得る方が市価直買いより有利です。',
        },
        {
          q: '早期償還できますか？',
          a: '早期償還はできません。元本は選択期間のブロック線形でリリースされ、リリース済み分はいつでも受取可能。資金計画に合う債券期間を選んでください。',
        },
        {
          q: '支払った USD1 はどこへ行きますか？',
          a: '支払った USD1 はシンクタンク準備資産に入り、担保鋳造・スマートマーケットメイキング・リスク防衛に使われます。同時に割引で AGX を鋳造し、自動購入してブラックホールへ永久バーンします。',
        },
      ],
    },
    xmine: {
      title: 'Xマイニング',
      intro: 'gAGX をステーキング — 元本毀損なく X エコシステムリワードを採掘',
      amountAria: 'ステーキング gAGX 数量',
      amountBalance: '数量（ウォレット残高 {balance} gAGX）',
      quotaInline: 'ステーキング枠：{quota} gAGX',
      submit: 'ステーキング',
      success: 'ステーキング成功',
      openKlineChart: 'K線チャートを見る',
      meta: {
        quota: 'ステーキング枠',
        daily: '収益率（日）',
        max: '最大ステーキング量',
        maxHint:
          'gAGX のステーキング上限は、≥180 日の AGX 債券保有と AGX ステーキング合計を超えられません',
        lock: 'ロック日数',
        lockValue: '24 時間後にリリース',
        h24: '24h',
        contract: '契約を確認',
      },
      overviewMetrics: [
        { label: 'Xマイニング総ステーキング量' },
        { label: 'X 価格' },
        { label: '累計マイニング産出' },
        {
          label: '当日収益率',
          hint: 'プロトコル収益率とネットワーク全体のステーク量に応じて動的配分し、毎日調整',
        },
        {
          label: '次回マイニング産出',
          hint: 'X マイニング収益は毎日 UTC 0 時に産出されます',
        },
      ],
      positionMetrics: [
        { label: 'マイマイニングステーキング' },
        { label: 'リリース済み' },
        { label: 'マイニング産出' },
      ],
      mechanismTitle: 'Xマイニングの仕組み',
      mechanism:
        'miningQuotaOf で枠を検証後に stakeGagxForMining。X 受取とアンステークは資産ページ。本ページでは warmup 取消は提供しません。',
      mechanismSteps: [
        {
          title: 'Rebase + DAO リワード',
          body: '収益は統一して gAGX で決済。',
        },
        { title: 'gAGX をステーキング', body: 'ステーキング後は 24 時間ロック状態になります。' },
        {
          title: '動的に X を分配',
          body: 'システムはプロトコル収益率に応じて X リワードを動的分配。',
        },
        {
          title: 'アンステーク線形リリース',
          body: 'アンロック後、gAGX は約 30 日のブロック線形でリリース。',
        },
      ],
      faq: [
        {
          q: 'Xマイニングはどう参加しますか？',
          a: 'gAGX をステーキングすると X エコシステムの元本毀損なしマイニングに参加できます。ステーキング後 gAGX は 24 時間ロックされ、システムがプロトコル収益率に応じて X リワードを動的分配します。',
        },
        {
          q: 'ステーキング上限はいくらですか？',
          a: 'gAGX ステーキング上限は、口座の ≥180 日 AGX 債券保有と AGX ステーキング合計を超えられません。',
        },
        {
          q: 'アンステーク後の資産はどうリリースされますか？',
          a: 'アンロック後の gAGX は {days} 日のブロック線形リリースで、アンステーク後の集中売圧を抑え、長期の価値捕捉を強めます。',
        },
        {
          q: 'X の総量は？増発しますか？',
          a: 'X の総発行量は 2.1 億枚で固定され、増発しません。うち 47.62% は LP 流動性（初期プール、マーケットメイク、流動性支援）、52.38% はグローバルリワードと成長（gAGX マイニングリワード、市場拡大とブランド提携、エコシステムと長期発展）に充てます。',
        },
        {
          q: 'gAGX はどう取得しますか？',
          a: 'gAGX は Rebase と DAO リワードの統一決済バウチャーです。AGX ステーキングまたは債券の Rebase 収益、および各種 DAO リワードは、すべて gAGX で支給されます。gAGX は X エコシステムへの唯一の入口です。',
        },
        {
          q: 'gAGX はマイニング以外に何ができますか？',
          a: 'gAGX はいつでも 1:1 で AGX に償還し、ステーキングで複利を続けられます。または gAGX をステーキングして X を採掘できます。どちらも自由に選べます。',
        },
        {
          q: 'X が継続デフレになる理由は？',
          a: 'X は売却のたびに 25% がバーンされます。エコシステム成長が需要と回転を押し上げるとバーンが蓄積し、X の流通量は減り、「供給が減り、価値が上がる」長期デフレ循環が形成されます。',
        },
        {
          q: 'X の価値源は？',
          a: '需要は三層です。gAGX マイニングによる X 需要、プロトコル収益のエコシステム還流、アプリ拡大とユーザー増。これらが重なり、X 需要を継続的に強めます。',
        },
        {
          q: '上限が債券/長期ステーキング保有と連動する理由は？',
          a: 'この仕組みにより、X マイナーはプロトコルの長期建設者であり続けます。gAGX ステーキング上限は、口座の ≥180 日 AGX 債券保有と AGX ステーキング合計を超えられません。債券または長期ステーキングを増やすと、マイニング上限が上がります。',
        },
      ],
    },
    calc: {
      title: '収益計算機',
      intro: '製品・期間・価格ごとの想定収益を試算',
      productAria: '試算製品',
      products: {
        stake: 'ステーキング',
        lpbond: 'LP債券',
        burnbond: 'バーン債券',
        xmine: 'Xマイニング',
      },
      periodLabel: '期間を選択',
      periodAria: '試算期間',
      amountLabel: '試算数量',
      amountBuy: '購入金額',
      amountAria: '試算数量',
      price: '満期 AGX 価格',
      priceCurrent: '現在 {price}',
      priceAria: '価格入力',
      days: '保有日数',
      dayBubble: '第 {day} 日',
      daysAria: '保有日数',
      submit: '計算',
      result: {
        interest: '想定収益',
        total: '収益合計',
        rate: '収益率',
        sellTotal: '売却総額',
        invested: '総投入',
        yieldBar: '収益 {amount}',
        legend: {
          released: 'リリース済み元本価値',
          netYield: '純収益価値',
          netYieldHint: '貢献ポイント控除後の収益',
          netYieldHintXmine: '採掘した X の数量を満期 X 価格で換算した価値',
          cost: '投入コスト',
          grossYield: '収益合計',
        },
      },
      aside: {
        result: '試算結果',
        resultHint: '左側でパラメータを入力し、計算をタップして結果を確認。',
        tags: { day: '第 {day} 日' },
        curve: '収益曲線',
        curveHint: '現在のパラメータで日次試算した累計収益。満期後未償還なら複利が継続',
        nodes: '主要ノード',
        nodeEndLabel: '第 {day} 日まで保有',
        nodeCards: [
          { label: 'プラス収益開始日', note: 'この日から売却するとプラス収益を実現可能' },
          {
            label: '元本完全リリース',
            hint: '元本は期間ブロックで線形リリースされ、この日から全額引き出せます',
          },
          { label: '期間末日まで保有', note: '元本に対する累計収益のイメージ' },
        ],
        notes: '計算の説明',
        notesBody: '本計算機はローカル試算の参考のみで、オンチェーン見積や収益保証ではありません。',
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
    title: 'リリース',
    intro: '収益と元本リリースを管理・確認',
    backToHub: 'リリースに戻る',
    recordColumns: ['時間', '操作', '試算数量', 'トランザクションハッシュ'],
    recordsEmpty: 'オンチェーン索引記録はまだありません（indexer 待ち）',
    labels: {
      releasing: 'リリース中',
      released: 'リリース済み',
      releasedPct: 'リリース済み {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: '受取に失敗しました。再試行してください',
    },
    hub: {
      aboutTitle: 'リリースについて',
      aboutCardTitle: 'リリースプール · 収益とリワードのリリース',
      aboutCardBody:
        'リリースプールは収益の換金を「瞬間的な売圧」から数十日にわたる平滑な資金流へ変えます。各受取は選択期間で線形リリースされ、プロトコル収益の流出ペースをエコシステム成長のペースと同期させます。',

      aboutSlides: [
        {
          title: 'リリースプール · 収益とリワードのリリース',
          body: 'リリースプールは収益の換金を「瞬間的な売圧」から数十日にわたる平滑な資金流へ変えます。各受取は選択期間で線形リリースされ、プロトコル収益の流出ペースをエコシステム成長と同期させ、集中換金による AGX 価格への衝撃を避け、長期参加者の複利成長の土台を守ります。',
        },
        {
          title: 'バッファプール · 元本の二次リリース',
          body: 'ステーキングと債券の元本退出後、バッファプールで二次線形リリースし、元本換金のペースを市場の吸収力に合わせ、エコシステムの安定性を高めます。',
        },
      ],
      purposeTitle: 'リリースの役割',
      purposeBody:
        'すべての収益はタービン到達前に、リリースプールで選択期間どおり線形リリースされます。集中した換金需要を時間軸へ分散し瞬間売圧を下げ、期間が長いほど税率が低い設計で長期保有を促し、エコシステム安定運行の緩衝になります。',

      mechanismTitle: '収益受取の仕組み',
      mechanismSubtitle:
        'リリースは収益発生からタービンへ入る必経の段階——時間で税率を、リズムで安定を換える',
      mechanismSteps: [
        { title: 'Rebase / DAO リワードを受取', body: '収益発生' },
        { title: '{divisor} : 1 貢献メカニズム', body: '50% バーン · 50% を X 底プールへ注入' },
        { title: 'リリースプールへ · 線形リリース', body: '5 / 20 / 40 / 60 日の期間を選択' },
        { title: '受取してタービンへ', body: '1:1 購入で売却枠をアンロック' },
      ],
      taxTitle: '長期リリースほど税率が低い',
      taxPeriod: '試算期間',
      taxRate: '受取税率',
    },
    queue: {
      title: 'リリースプール',
      intro:
        '受取した収益とリワードはここで選択期間どおり線形リリース。リリース済み分はいつでもタービンへ受取できます',
      hubHint:
        '受取した収益とリワードはここで選択期間（5/20/40/60 日）どおり線形リリース。リリース済み分はいつでもタービンへ受取できます。',
      planDays: '{days} 日',
      claim: '受取',
      refresh: '更新',
      claimSuccess: 'タービン枠へ受取済み',
      goTurbine: 'タービンへ',
      statsTitle: 'リリースプールデータ',
      lifetimeClaimed: 'リリースプールからの累計受取',
      hints: {
        releasing: 'リリースプール内にあり、選択した期間で線形リリース中の gAGX 総量',
        released: 'リリース完了済みで、いつでもタービンへ受け取れる gAGX 総量',
        lifetimeClaimed: 'リリースプールからタービンへ受け取った累計 gAGX',
      },
      recordsTitle: 'リリースプール記録',
    },
    buffer: {
      title: 'バッファプール',
      intro:
        '償還資産はここで {days} 日間の二次線形リリースが行われ、リリース済み分はいつでも引き出せます。',
      hubHint:
        '償還した資産はバッファプールに入り、{days} 日間ブロック単位で線形リリース。リリース済み分はいつでもウォレットへ引き出せます。',
      claim: '引出',
      refresh: '更新',
      claimSuccess: 'AGX をウォレットへ引出済み',
      statsTitle: 'バッファプールデータ',
      entered: '累計入庫',
      extracted: '累計引出',
      hints: {
        enteredAgx: 'ステーキングと債券償還後にバッファへ入った累計 AGX',
        extractedAgx: 'バッファからウォレットへ引き出した累計 AGX',
        releasingAgx: 'バッファ内でリリース中の AGX 総量',
        enteredGagx: 'X マイニング償還後にバッファへ入った累計 gAGX',
        extractedGagx: 'バッファからウォレットへ引き出した累計 gAGX',
        releasingGagx: 'バッファ内でリリース中の gAGX 総量',
      },
      recordsTitle: 'バッファプール記録',
      mechanismTitle: '資金リリースの仕組み',
      mechanismSubtitle: 'ステーキングと債券の元本は二段階リリースモデルで市場安定性を高めます',
      mechanismSteps: [
        { title: 'ステーキング/', body: '債券元本' },
        { title: 'ブロック級', body: 'リリース' },
        { title: '引出後', body: '{days} 日バッファ' },
        { title: '二次線形', body: 'リリース' },
      ],
      mechanismBenefits: [
        '集中アンロックを回避',
        '市場売圧を低減',
        '資金リリースを平滑化',
        '市場安定性を強化',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'リリース期間は変更できますか？',
          a: 'できません。期間は収益がリリースプールに入った時点で固定され、あとから変更できません。各受取は独立しているため、次回は別の期間を選べます。',
        },
        {
          q: '税率はいつ控除されますか？',
          a: '税率は収益がリリースプールに入るときに、選択期間の料率で一度だけ控除されます（{taxSchedule}）。プールに表示される数量は税引き後です。リリースと以降の受取に追加手数料はありません。',
        },
        {
          q: 'リリースプールから受取した gAGX はどこへ行きますか？',
          a: '受取した gAGX はウォレットへ直接入らず、タービンへ入り、タービンのルールで続きます。タービンページで確認・管理してください。',
        },
        {
          q: 'リリース済み分をすぐ受取しないと損失がありますか？',
          a: '失効しません。いつでも受取れます。ただしプールに留まっているリリース済み分は収益を生まないため、早めにタービンへ受取してください。',
        },
        {
          q: '適切なリリース期間はどう選びますか？',
          a: '早く資金が必要なら短期間（税率は高め）を選び、待てるなら長期間で低い税率を選んでください。受取を複数回に分け、期間を変えて速度と税率のバランスを取ることもできます。',
        },
      ],
      queue: [
        {
          q: 'リリース期間は変更できますか？',
          a: 'できません。期間は収益がリリースプールに入った時点で固定され、あとから変更できません。各受取は独立しているため、次回は別の期間を選べます。',
        },
        {
          q: '税率はいつ控除されますか？',
          a: '税率は収益がリリースプールに入るときに、選択期間の料率で一度だけ控除されます（{taxSchedule}）。プールに表示される数量は税引き後です。リリースと以降の受取に追加手数料はありません。',
        },
        {
          q: 'リリースプールから受取した gAGX はどこへ行きますか？',
          a: '受取した gAGX はウォレットへ直接入らず、タービンへ入り、タービンのルールで続きます。タービンページで確認・管理してください。',
        },
        {
          q: 'リリース済み分をすぐ受取しないと損失がありますか？',
          a: '失効しません。いつでも受取れます。ただしプールに留まっているリリース済み分は収益を生まないため、早めにタービンへ受取してください。',
        },
        {
          q: '適切なリリース期間はどう選びますか？',
          a: '早く資金が必要なら短期間（税率は高め）を選び、待てるなら長期間で低い税率を選んでください。受取を複数回に分け、期間を変えて速度と税率のバランスを取ることもできます。',
        },
      ],
      buffer: [
        {
          q: 'バッファプールとは？',
          a: '元本をアンステーク（償還）するとバッファプールに入り、{days} 日の二次線形リリースが行われます。短期の集中流出を抑え、継続的なリリースと市場安定のバランスを取ります。',
        },
        {
          q: 'バッファプール内の資産にまだ収益はありますか？',
          a: 'ありません。資産はバッファに入った瞬間から収益を一切生みません。現金需要に合わせて償還のタイミングを決めてください。',
        },
        {
          q: 'リリース済み分はどう引き出しますか？',
          a: 'バッファはブロック単位で線形にアンロックされます。「リリース済み」分の引出をタップすると、追加の待ち時間なくウォレットへ直接入ります。',
        },
        {
          q: 'バッファプールに AGX と gAGX の両方がある理由は？',
          a: 'ステーキングと債券の償還元本は AGX、Xマイニングのアンステークは gAGX です。2つの資産は独立してリリース・引出されます。',
        },
        {
          q: 'リリース済み資産を一度に全部引き出せない理由は？',
          a: 'バッファ内の資産は複数の償還記録から来ることがあり、記録ごとにバッファ時計が異なります。記録が多い場合、1回の引出で処理できる件数に限りがあるため、リリース済み分を一度にすべて出せないことがあります。全部出るまで引出を繰り返しタップしてください。',
        },
      ],
    },
  },
  tables: {
    time: '時間',
    claimTime: '受取時間',
    paid: '金額',
    status: 'ステータス',
    discount: '割引',
    estimatedAgx: '見込みAGX',
    tx: '取引',
    title: '創世タイトル',
    totalVolume: '総実績',
    rewardRate: '報酬率',
    amount: '金額',
    from: '送信元アドレス',
    genesisRank: '創世ランク',
    joined: '参加日時',
    address: 'アドレス',
    communityVolume: 'チーム実績',
    contribution: '購入',
  },
}) satisfies AppMessagesBundle

export default app
