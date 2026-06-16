import type { HomeContentBundle } from '../types'

export const jaBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - 未来の価値を守る',
    description:
      'AEGIS Xは、USD1決済、BSC優先ウォレットアクセス、自己修復プロトコルエンジンを備えたAIネイティブDeFi 4.0プロトコルです。',
  },
  nav: {
    sectionsLabel: 'ホームページセクション',
    links: [
      { href: '#protocol', label: 'プロトコル' },
      { href: '#engine', label: 'エンジン' },
      { href: '#token', label: 'トークン' },
      { href: '#roadmap', label: 'ロードマップ' },
      { href: '#security', label: 'セキュリティ' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: 'ホワイトペーパー',
    launchDapp: 'DAppを起動',
    languageLabel: '言語',
  },
  hero: {
    guardianLabel: 'AEGIS X ガーディアン',
    eyebrow: {
      desktop: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
      mobile: 'AI x DeFi x USD1 · DeFi 4.0',
    },
    title: '未来の価値を守る',
    body: {
      desktop:
        'AIシンクタンクシステムが駆動する、世界初のAI x DeFi x USD1グローバル決済プロトコル。USD1を中核決済資産とし、インテリジェンスによって分散型金融を再定義します。',
      mobile:
        'AIシンクタンクシステムが駆動する、世界初のAI x DeFi x USD1グローバル決済プロトコル。',
    },
    enterProtocol: 'プロトコルへ',
    readWhitepaper: 'ホワイトペーパーを読む',
    walletBusy: 'ウォレットを開いています...',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X PROTOCOL',
      title: {
        desktop: '次世代金融時代のために構築されたAIネイティブインフラ',
        mobile: 'AIネイティブインフラ',
      },
      subtitle: {
        desktop: 'AI x DeFi x USD1 - 次世代バリューネットワークを構築。',
        mobile: 'AI x DeFi x USD1 - 次世代バリューネットワーク構築。',
      },
      cards: [
        {
          index: '01',
          title: 'AI Think-Tank',
          desktop:
            '自律的なリスク管理、マーケットメイキング、資産配分 - すべてオンチェーンで実行され、すべてインテリジェンス駆動。',
          mobile:
            '自律的なリスク管理、マーケットメイキング、資産配分 - オンチェーン実行、インテリジェンス駆動。',
        },
        {
          index: '02',
          title: 'USD1 Settlement',
          desktop:
            '150%超過担保ミント。USD1を安定DeFi 4.0ベースレイヤーの中核決済資産として採用。',
          mobile:
            '150%超過担保ミント。USD1をDeFi 4.0の中核決済資産として採用。',
        },
        {
          index: '03',
          title: 'Global Payments',
          desktop:
            'AIエージェント、DeFi流動性、クロスボーダー決済を統合グローバルバリューネットワークに接続。',
          mobile:
            'AIエージェント、DeFi流動性、クロスボーダー決済を一つのバリューネットワークに接続。',
        },
      ],
    },
    engine: {
      eyebrow: 'CORE ENGINE',
      title: {
        desktop: '4つの柱、1つのインテリジェントシステム',
        mobile: '4つの柱、1つのシステム',
      },
      subtitle: {
        desktop: 'AI駆動DeFi 4.0コアエンジン - 自己修復型プライスアーキテクチャ。',
        mobile: 'AI駆動DeFi 4.0コアエンジン。',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            'ダイナミックバランスモデル：上昇時にUSD1リザーブを蓄積、下落時にLP解消後バイバック＋バーンで価格を自己修復。',
          mobile:
            'ダイナミックバランス：上昇時にUSD1蓄積、下落時にバイバック＋バーンで価格を自己修復。',
        },
        {
          title: 'Dynamic Volatility Defense',
          desktop:
            '日次5%以上の下落で自動発動：売却手数料30%に引き上げ、リザーブバイバックとブラックホールバーンを起動、24時間後に自動復元。',
          mobile:
            '日次5%以上の下落で：売却手数料30%、リザーブバイバック＋ブラックホールバーン、24時間後に自動復元。',
        },
        {
          title: 'Rebase Engine',
          desktop:
            '12時間ごとのデュアルエポック決済、ブロック単位のリニアリリース。最大540日ステーキングティア対応、参考APY 535%-4,880%。',
          mobile:
            '12時間デュアルエポック決済、ブロック単位リリース。参考APY 535%-4,880%。',
        },
        {
          title: 'Turbo Mechanism',
          desktop:
            '購入アンロック設計：1:1の売買クォータ、24-96時間の適応型クールダウンとパニック売却防止ロジック。',
          mobile:
            '1:1購入で売却クォータをアンロック、24-96時間適応型クールダウン - パニック売却防止。',
        },
      ],
    },
    token: {
      eyebrow: 'TOKEN & ECOSYSTEM',
      title: 'マルチアセット・フライホイール',
      subtitle: {
        desktop:
          '4つのトークン、1つの自己強化バリューループ：成長 → 流動性 → 決済 → エコシステム。',
        mobile: '4つのトークン、1つの自己強化バリューループ。',
      },
      cards: [
        {
          label: 'コアプロトコル資産',
          description: '150%超過担保 · AIシンクタンク管理',
        },
        {
          label: '安定リザーブ資産',
          description: '決済レイヤー · USD担保流動性',
        },
        {
          label: 'エコシステム価値トークン',
          description: '2.1億固定供給 · 25%売却バーン',
        },
        {
          label: '報酬決済トークン',
          description: 'AGX 1:1 · Xマイニングを駆動',
        },
      ],
    },
    roadmap: {
      eyebrow: 'ROADMAP',
      title: 'DeFi 4.0への道',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'プロトコルデプロイ · AGXミント · USD1流動性プール',
          dot: '1',
          side: 'left',
          state: 'current',
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebaseステーキング · LPボンド · バーンボンド · AIマーケットメイキング',
          dot: '2',
          side: 'right',
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAOインセンティブ · マルチシグガバナンス · グローバルノード',
          dot: '3',
          side: 'left',
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: '自律決済 · オンチェーン協業 · エージェントマーケットメイキング',
          dot: '4',
          side: 'right',
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'クロスボーダー決済 · 加盟店オンボーディング · USD1レール',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'DeFi 4.0',
          description: '機関向けプロダクト · コンプライアンスフレームワーク · フルエコシステム',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'SECURITY & TRUST',
      title: 'Aegisグレードのセキュリティ',
      subtitle: {
        desktop:
          'AEGIS = 盾、守護、秩序、セキュリティ。資産の安全はプロトコル基盤から組み込まれています。',
        mobile: '資産の安全はプロトコル基盤から組み込まれています。',
      },
      checks: [
        {
          desktop:
            '非カストディアル - AIマーケットメイカーコントラクトはいかなる資産も転送できません',
          mobile: '非カストディアル - AIマーケットメイカーは資産転送不可',
        },
        '複数のセキュリティ企業による監査済み',
        'コアコントラクトをGitHubでオープンソース公開',
        {
          desktop: 'Safeマルチシグガバナンス（アップグレード + 実行権限）',
          mobile: 'Safeマルチシグガバナンス（アップグレード + 実行）',
        },
      ],
    },
    partners: {
      title: 'ECOSYSTEM PARTNERS',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'よくある質問',
      items: [
        {
          question: 'AEGIS Xとは？',
          answer:
            'AIシンクタンクシステムが駆動する世界初のプロトコル。AIインテリジェンス、DeFi流動性、USD1ステーブルコイン決済を融合した次世代バリューネットワーク - DeFi 4.0。',
          open: true,
        },
        {
          question: 'AGXはどのようにミントされますか？',
          answer:
            'AGXは、USD1を中核決済資産とするプロトコルの担保発行設計を通じてミントされます。',
        },
        {
          question: 'ステーキング報酬はどのように計算されますか？',
          answer:
            '報酬は、AEGIS Xコントラクトで定義されたステーキングティア、エポック決済、プロトコル参加ルールに従います。',
        },
        {
          question: 'プロトコルのセキュリティはどのように確保されますか？',
          answer:
            'AEGIS Xは非カストディアル設計、監査、オープンソースコントラクト、マルチシグガバナンスを組み合わせています。',
        },
        {
          question: 'Xトークンはどのように機能しますか？',
          answer:
            'Xは固定供給量とプロトコル駆動のバーンメカニズムを持つエコシステム価値トークンです。',
          optional: true,
        },
        {
          question: 'Turboメカニズムとは？',
          answer:
            'Turboは売買クォータを連動させ、適応型クールダウンでパニック売却を抑制しながら流動性を維持します。',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '担保比率',
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: '最大参考APY',
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: '対応チェーン',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'X総供給量',
    },
  ],
  footer: {
    brandCopy: {
      desktop: '未来の価値を守る。\nAI x DeFi x USD1',
      mobile: '未来の価値を守る。\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: '利用規約 · プライバシーポリシー · 免責事項',
    languageLabel: '言語',
    groups: [
      {
        label: 'プロトコル',
        ariaLabel: 'プロトコルフッターリンク',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'DAppを起動', mobile: 'Docs' },
          },
          { href: '#whitepaper', label: 'ホワイトペーパー' },
          { href: '#docs', label: 'Docs' },
          { href: '#analytics', label: 'Analytics' },
        ],
      },
      {
        label: 'エコシステム',
        ariaLabel: 'エコシステムフッターリンク',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX Staking', mobile: 'Docs' },
          },
          {
            href: '#token',
            label: { desktop: 'LP Bond', mobile: 'Whitepaper' },
          },
          { href: '#token', label: 'Burn Bond' },
          { href: '#token', label: 'X Mining' },
        ],
      },
      {
        label: 'コミュニティ',
        ariaLabel: 'コミュニティフッターリンク',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: 'Docs' },
          },
          {
            href: '#twitter',
            label: { desktop: 'Twitter / X', mobile: 'Whitepaper' },
          },
          { href: '#telegram', label: 'Telegram' },
          { href: '#github', label: 'GitHub' },
        ],
      },
    ],
  },
}
