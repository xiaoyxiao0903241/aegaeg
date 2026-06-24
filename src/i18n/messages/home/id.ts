import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X adalah protokol DeFi 4.0 berbasis AI dengan USD1 settlement, BSC-first wallet access, dan mesin protocol self-healing, membangun jaringan nilai generasi berikutnya.',
    title: 'AEGIS X - Menjaga Nilai Masa Depan'
  },
  nav: {
    sectionsLabel: 'Navigasi bagian beranda',
    links: [
      {
        href: '#protocol',
        label: 'Protocol'
      },
      {
        href: '#engine',
        label: 'Mechanisms'
      },
      {
        href: '#token',
        label: 'Ecosystem'
      },
      {
        href: '#roadmap',
        label: 'Roadmap'
      },
      {
        href: '#security',
        label: 'Security'
      },
      {
        href: '#faq',
        label: 'FAQ'
      }
    ],
    whitepaper: 'Whitepaper',
    enterApp: 'Launch App',
    languageLabel: 'Bahasa'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Menjaga Nilai Masa Depan',
    body: 'Protokol ekosistem USD1 pertama di dunia yang didorong oleh AI Think Tank. Dengan USD1 sebagai core settlement asset, menghubungkan AI, payments, dan global liquidity network.',
    enterProtocol: 'Masuk Protocol',
    readWhitepaper: 'Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X PROTOCOL',
      title: 'Arsitektur inti jaringan nilai generasi berikutnya',
      subtitle: 'AI x DeFi x USD1 - Menggerakkan aliran nilai',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Autonomous risk control, intelligent market-making, dan liquidity management dieksekusi sepenuhnya on-chain.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'Dengan USD1 sebagai core settlement asset, membangun jaringan value circulation yang stabil.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Menghubungkan AI Agent, DeFi, dan global payment scenarios untuk membangun next-gen value network.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'CORE MECHANISMS',
      title: 'Empat mekanisme, satu sistem cerdas',
      subtitle: 'Melalui intelligent decision-making, dynamic adjustment, dan risk control, membangun value network yang berkelanjutan.',
      cards: [
        {
          title: 'Intelligent Market-Making',
          body: 'Fase kenaikan mengakumulasi reserve assets untuk memperkuat protocol reserves; fase koreksi menjalankan buyback dan burn untuk perbaikan harga.'
        },
        {
          title: 'Volatility Defense',
          body: 'Terpicu otomatis saat penurunan harian mencapai ambang: sell fee naik ke 30%, reserve buyback dan black-hole burn dimulai, pulih otomatis setelah 24 jam.'
        },
        {
          title: 'Yield Distribution',
          body: 'Menggunakan block-level linear release, yield settlement setiap 12 jam, mendukung participation cycle hingga 540 hari.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Melalui dynamic buy-to-unlock, mengoptimalkan market liquidity structure dan memperkuat ecosystem stability serta long-term growth capacity.'
        }
      ]
    },
    token: {
      eyebrow: 'VALUE ECOSYSTEM',
      title: 'Multi-asset value flywheel',
      subtitle: 'User growth → Liquidity expansion → Payment growth → Ecosystem growth.',
      cards: [
        {
          label: 'Core protocol asset',
          description: '150% over-collateralized minting · Yield growth engine'
        },
        {
          label: 'Core settlement asset',
          description: 'Ecosystem settlement layer · Value circulation infrastructure'
        },
        {
          label: 'Ecosystem value token',
          description: 'Fixed supply 210M · Continuous value accumulation'
        },
        {
          label: 'Reward settlement voucher',
          description: 'Redeemable for AGX · Participate in ecosystem mining'
        }
      ]
    },
    roadmap: {
      eyebrow: 'ROADMAP',
      title: 'Menuju jaringan nilai generasi berikutnya',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Genesis Launch',
          description: 'Protocol deployment · AGX minting · USD1 liquidity pool',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi Core',
          description: 'Rebase staking · LP bonds · Burn bonds · AI market-making',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Growth',
          description: 'X DAO incentives · Multisig governance · Global nodes',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'AI Agent Economy',
          description: 'Autonomous payments · Intelligent collaboration · AI Agent economy network',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Global Payments',
          description: 'Global payment network · Merchant onboarding · USD1 payment scenarios',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Future Value Network',
          description: 'Payment network · AI Agent economy · Value ecosystem',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'SECURITY & TRUST',
      title: 'Arsitektur keamanan tingkat AEGIS',
      subtitle: 'Dari arsitektur protocol hingga asset management, keamanan menyeluruh di setiap tahap',
      checks: [
        "Non-custodial architecture · Smart market-making contracts tidak memiliki izin transfer assets keluar",
        "Core contracts open-source dan verifiable · Telah melalui professional security audit",
        "Multisig governance · Core permissions dikelola bersama",
        "Dynamic defense mechanisms · Merespons extreme volatility secara otomatis"
      ]
    },
    partners: {
      title: 'Ecosystem Infrastructure'
    },
    faq: {
      eyebrow: 'QUICK OVERVIEW',
      title: 'Pertanyaan Umum',
      items: [
        {
          q: 'Apa itu AEGIS X?',
          a: 'AEGIS X adalah protokol ekosistem USD1 pertama di dunia yang didorong oleh AI Think Tank, dengan USD1 sebagai core settlement asset, menghubungkan AI, DeFi, dan global payment network.',
          open: true
        },
        {
          q: 'Bagaimana AGX dicetak?',
          a: 'AGX diterbitkan melalui mekanisme over-collateralization 150%, sebagai core protocol asset dan pembawa value growth penting.'
        },
        {
          q: 'Peran apa yang diemban USD1 di AEGIS X?',
          a: 'USD1 adalah core settlement asset protocol, menyediakan value circulation, liquidity support, dan payment infrastructure untuk ekosistem.'
        },
        {
          q: 'Bagaimana protocol menjamin keamanan?',
          a: 'Contracts menggunakan non-custodial boundaries, audit, open-source review, dan multisig governance.'
        },
        {
          q: 'Apa itu Turbo mechanism?',
          a: 'Turbo mechanism melalui dynamic unlock dan liquidity adjustment, mengurangi risiko concentrated sell pressure dan memperkuat market stability serta long-term growth capacity.'
        },
        {
          q: 'Bagaimana token X beroperasi?',
          a: 'X adalah ecosystem value token dengan fixed supply dan protocol-driven burn mechanism.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Over-collateralization ratio'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'LP permanently locked'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Dynamic defense mechanism'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'X fixed total supply'
    }
  ],
  footer: {
    brandCopy: 'Menjaga jaringan nilai masa depan \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    groups: [
      {
        label: 'Protocol',
        ariaLabel: 'Footer links protocol',
        links: [
          {
            href: '/app.html',
            label: 'Launch App'
          },
          {
            linkId: 'whitepaper',
            label: 'Whitepaper'
          },
          {
            linkId: 'docs',
            label: 'Docs'
          },
          {
            linkId: 'economicModel',
            label: 'Economic Model'
          }
        ]
      },
      {
        label: 'Ecosystem',
        ariaLabel: 'Footer links ecosystem',
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
        label: 'Community',
        ariaLabel: 'Footer links community',
        links: [
          {
            socialId: 'youtube',
            label: 'Youtube'
          },
          {
            socialId: 'twitter',
            label: 'Twitter / X'
          },
          {
            socialId: 'telegram',
            label: 'Telegram'
          },
          {
            socialId: 'medium',
            label: 'Medium'
          }
        ]
      }
    ]
  }
} satisfies HomeMessagesBundle)

export default home
