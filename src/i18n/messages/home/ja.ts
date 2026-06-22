import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS Xは、USD1決済、BSC優先ウォレット入口、自己修復プロトコルエンジンを備えたAIネイティブDeFi 4.0プロトコルで、次世代の価値ネットワークを構築します。',
    title: 'AEGIS X - 未来の価値を守る'
  },
  nav: {
    sectionsLabel: 'ホームページセクションナビゲーション',
    links: [
      {
        href: '#protocol',
        label: 'プロトコル'
      },
      {
        href: '#engine',
        label: 'コアメカニズム'
      },
      {
        href: '#token',
        label: 'エコシステム価値'
      },
      {
        href: '#roadmap',
        label: 'ロードマップ'
      },
      {
        href: '#security',
        label: 'セキュリティ'
      },
      {
        href: '#faq',
        label: 'よくある質問'
      }
    ],
    whitepaper: 'ホワイトペーパー',
    enterApp: 'Appに入る',
    languageLabel: '言語'
  },
  hero: {
    guardianLabel: 'AEGIS X ガーディアン',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 プロトコル',
    title: '未来の価値を守る',
    body: '世界初のAIシンクタンク駆動型USD1エコシステムプロトコル。USD1をコア決済資産とし、AI、決済、グローバル流動性ネットワークを接続します。',
    enterProtocol: 'プロトコルに入る',
    readWhitepaper: 'ホワイトペーパーを読む',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X プロトコル',
      title: '次世代価値ネットワークのコアアーキテクチャ',
      subtitle: 'AI x DeFi x USD1 - 価値の流動を駆動',
      cards: [
        {
          title: 'AIシンクタンク',
          body: '自律的なリスク管理、インテリジェントなマーケットメイキング、流動性管理をすべてオンチェーンで実行します。',
          index: '01'
        },
        {
          title: 'USD1決済',
          body: 'USD1をコア決済資産とし、安定した価値流通ネットワークを構築します。',
          index: '02'
        },
        {
          title: 'グローバル決済',
          body: 'AI Agent、DeFi、グローバル決済シナリオを接続し、次世代の価値ネットワークを構築します。',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'コアメカニズム',
      title: '4つのメカニズム、1つのインテリジェントシステム',
      subtitle: 'インテリジェントな意思決定、動的調整、リスク管理により、持続可能な価値ネットワークを構築します。',
      cards: [
        {
          title: 'インテリジェントマーケットメイキングメカニズム',
          body: '上昇局面では準備資産を蓄積しプロトコル準備能力を強化し、調整局面では買い戻し・バーン機構を実行して価格を修復します。'
        },
        {
          title: 'ボラティリティ防御メカニズム',
          body: '日次下落率が閾値に達すると自動発動：売却手数料を30%に引き上げ、準備金買い戻しとブラックホールバーンを開始し、24時間後に自動復帰します。'
        },
        {
          title: '収益分配メカニズム',
          body: 'ブロック単位のリニアリリース機構を採用し、12時間ごとに収益精算を行い、最大540日の参加期間をサポートします。'
        },
        {
          title: 'ターボメカニズム',
          body: '動的な買いアンロック機構により市場流動性構造を最適化し、エコシステムの安定性と長期発展力を強化します。'
        }
      ]
    },
    token: {
      eyebrow: '価値エコシステム',
      title: 'マルチアセット価値フライホイール',
      subtitle: 'ユーザー成長 → 流動性強化 → 決済拡大 → エコシステム成長。',
      cards: [
        {
          label: 'コアプロトコル資産',
          description: '150%超過担保発行 · 収益成長エンジン'
        },
        {
          label: 'コア決済資産',
          description: 'エコシステム決済レイヤー · 価値流通インフラ'
        },
        {
          label: 'エコシステム価値トークン',
          description: '固定総量2.1億 · 継続的な価値蓄積'
        },
        {
          label: '報酬決済証明',
          description: 'AGXと交換可能 · エコシステムマイニング参加'
        }
      ]
    },
    roadmap: {
      eyebrow: 'ロードマップ',
      title: '次世代価値ネットワークへの道',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'ジェネシスローンチ',
          description: 'プロトコル展開 · AGX発行 · USD1流動性プール',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFiコア',
          description: 'Rebaseステーキング · LPボンド · バーンボンド · AIマーケットメイキング',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAOと成長',
          description: 'X DAOインセンティブ · マルチシグガバナンス · グローバルノード',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent経済',
          description: '自律決済 · インテリジェント協業 · AI Agent経済ネットワーク',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'グローバル決済',
          description: 'グローバル決済ネットワーク · 加盟店連携 · USD1決済シナリオ',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: '未来の価値ネットワーク',
          description: '決済ネットワーク · AI Agent経済 · 価値エコシステム',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'セキュリティと信頼',
      title: 'AEGIS級セキュリティアーキテクチャ',
      subtitle: 'プロトコルアーキテクチャから資産管理まで、セキュリティがすべての段階に貫通しています',
      checks: [
        "非カストディアルアーキテクチャ · インテリジェントマーケットメイキングコントラクトは資産転出権限を持ちません",
        "コアコントラクトはオープンソースで検証可能 · 専門的なセキュリティ監査を通過",
        "マルチシグガバナンス機構 · コア権限の共同管理",
        "動的防御メカニズム · 極端なボラティリティに自動対応"
      ]
    },
    partners: {
      title: 'エコシステムインフラ'
    },
    faq: {
      eyebrow: 'クイックガイド',
      title: 'よくある質問',
      items: [
        {
          q: 'AEGIS Xとは何ですか？',
          a: 'AEGIS Xは世界初のAIシンクタンク駆動型USD1エコシステムプロトコルで、USD1をコア決済資産とし、AI、DeFi、グローバル決済ネットワークを接続します。',
          open: true
        },
        {
          q: 'AGXはどのように発行されますか？',
          a: 'AGXは150%超過担保メカニズムにより生成され、プロトコルのコア資産と価値成長の重要な担い手です。'
        },
        {
          q: 'USD1はAEGIS Xでどのような役割を果たしますか？',
          a: 'USD1はプロトコルのコア決済資産であり、エコシステムに価値流通、流動性サポート、決済インフラ機能を提供します。'
        },
        {
          q: 'プロトコルはどのようにセキュリティを確保しますか？',
          a: 'コントラクトは非カストディアル境界、監査、オープンソースレビュー、マルチシグガバナンスを採用しています。'
        },
        {
          q: 'ターボメカニズムとは何ですか？',
          a: 'ターボメカニズムは動的アンロックと流動性調整機構により、集中売り圧力リスクを低減し、市場の安定性と長期発展力を強化します。'
        },
        {
          q: 'Xトークンはどのように機能しますか？',
          a: 'Xはエコシステム価値トークンで、固定総量とプロトコル駆動のバーン機構を採用しています。'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: '超過担保率'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP永久ロック'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: '動的防御メカニズム'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X固定総量'
    }
  ],
  footer: {
    brandCopy: '未来の価値ネットワークを守る \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. 全著作権所有。',
    legal: '利用規約 · プライバシーポリシー · 免責事項',
    groups: [
      {
        label: 'プロトコル',
        ariaLabel: 'プロトコルフッターリンク',
        links: [
          {
            href: '/app.html',
            label: 'Appに入る'
          },
          {
            linkId: 'whitepaper',
            label: 'ホワイトペーパー'
          },
          {
            linkId: 'docs',
            label: 'プロジェクトドキュメント'
          },
          {
            linkId: 'economicModel',
            label: '経済モデル'
          }
        ]
      },
      {
        label: 'エコシステム',
        ariaLabel: 'エコシステムフッターリンク',
        links: [
          {
            href: '#token',
            label: 'AGX'
          },
          {
            href: '#token',
            label: 'USD1'
          },
          {
            href: '#token',
            label: 'X'
          },
          {
            href: '#token',
            label: 'gGAX'
          }
        ]
      },
      {
        label: 'コミュニティ',
        ariaLabel: 'コミュニティフッターリンク',
        links: [
          {
            href: '#discord',
            label: 'Discord'
          },
          {
            href: '#twitter',
            label: 'Twitter / X'
          },
          {
            href: '#telegram',
            label: 'Telegram'
          },
          {
            href: '#github',
            label: 'GitHub'
          }
        ]
      }
    ]
  }
} satisfies HomeMessagesBundle)

export default home
