import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './types'

const home = defineMessages({
  meta: {
    description: 'AEGIS X là giao thức DeFi 4.0 native AI, xây dựng mạng lưới giá trị thế hệ tiếp theo với USD1 settlement, ví BSC-first và self-healing protocol engine.',
    title: 'AEGIS X - Bảo vệ Giá trị Tương lai'
  },
  nav: {
    sectionsLabel: 'Điều hướng trang chủ',
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
    languageLabel: 'Ngôn ngữ'
  },
  hero: {
    guardianLabel: 'AEGIS X Guardian',
    eyebrow: 'AI x DeFi x USD1 · DeFi 4.0 Protocol',
    title: 'Bảo vệ Giá trị Tương lai',
    body: 'Giao thức hệ sinh thái USD1 đầu tiên trên thế giới được điều khiển bởi AI Think Tank. Với USD1 là core settlement asset, kết nối AI, payment và global liquidity network.',
    enterProtocol: 'Vào Protocol',
    readWhitepaper: 'Whitepaper',
  },
  sections: {
    protocol: {
      eyebrow: 'AEGIS X Protocol',
      title: 'Kiến trúc cốt lõi mạng lưới giá trị thế hệ tiếp theo',
      subtitle: 'AI x DeFi x USD1 - Thúc đẩy dòng chảy giá trị',
      cards: [
        {
          title: 'AI Think Tank',
          body: 'Autonomous risk control, intelligent market-making và liquidity management đều thực thi on-chain.',
          index: '01'
        },
        {
          title: 'USD1 Settlement',
          body: 'Với USD1 là core settlement asset, xây dựng mạng lưới value circulation ổn định.',
          index: '02'
        },
        {
          title: 'Global Payments',
          body: 'Kết nối AI Agent, DeFi và global payment scenarios, xây dựng next-gen value network.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Core Mechanisms',
      title: 'Bốn cơ chế, một hệ thống thông minh',
      subtitle: 'Thông qua intelligent decision-making, dynamic adjustment và risk control, xây dựng value network bền vững.',
      cards: [
        {
          title: 'Intelligent Market-Making',
          body: 'Tích lũy reserve assets trong giai đoạn tăng giá để tăng cường protocol reserves; trong giai đoạn điều chỉnh, thực hiện buyback và burn để phục hồi giá.'
        },
        {
          title: 'Volatility Defense',
          body: 'Tự động kích hoạt khi mức giảm trong ngày đạt ngưỡng: sell fee tăng lên 30%, reserve buyback và black-hole burn khởi động, tự động phục hồi sau 24 giờ.'
        },
        {
          title: 'Yield Distribution',
          body: 'Áp dụng block-level linear release, yield settlement mỗi 12 giờ, hỗ trợ participation cycle tối đa 540 ngày.'
        },
        {
          title: 'Turbo Mechanism',
          body: 'Thông qua dynamic buy-to-unlock, tối ưu hóa market liquidity structure, tăng cường ecosystem stability và long-term growth capacity.'
        }
      ]
    },
    token: {
      eyebrow: 'Value Ecosystem',
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
      eyebrow: 'Roadmap',
      title: 'Con đường đến next-gen value network',
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
      eyebrow: 'Security & Trust',
      title: 'Kiến trúc bảo mật cấp AEGIS',
      subtitle: 'Từ kiến trúc protocol đến asset management, bảo mật xuyên suốt mọi khâu',
      checks: [
        "Non-custodial architecture · Smart market-making contracts không có quyền transfer assets ra ngoài",
        "Core contracts open-source và verifiable · Đã qua professional security audit",
        "Multisig governance · Core permissions được quản lý chung",
        "Dynamic defense mechanisms · Tự động ứng phó với extreme volatility"
      ]
    },
    partners: {
      title: 'Ecosystem Infrastructure'
    },
    faq: {
      eyebrow: 'Quick Overview',
      title: 'Câu hỏi thường gặp',
      items: [
        {
          q: 'AEGIS X là gì?',
          a: 'AEGIS X là giao thức hệ sinh thái USD1 đầu tiên trên thế giới được điều khiển bởi AI Think Tank, với USD1 là core settlement asset, kết nối AI, DeFi và global payment network.',
          open: true
        },
        {
          q: 'AGX được mint như thế nào?',
          a: 'AGX được tạo ra thông qua cơ chế over-collateralization 150%, là core protocol asset và phương tiện quan trọng cho value growth.'
        },
        {
          q: 'USD1 đóng vai trò gì trong AEGIS X?',
          a: 'USD1 là core settlement asset của protocol, cung cấp value circulation, liquidity support và payment infrastructure cho hệ sinh thái.'
        },
        {
          q: 'Protocol đảm bảo bảo mật như thế nào?',
          a: 'Contracts sử dụng non-custodial boundaries, audit, open-source review và multisig governance.'
        },
        {
          q: 'Turbo mechanism là gì?',
          a: 'Turbo mechanism sử dụng dynamic unlock và liquidity adjustment để giảm rủi ro concentrated sell pressure, tăng cường market stability và long-term growth capacity.'
        },
        {
          q: 'Token X hoạt động như thế nào?',
          a: 'X là ecosystem value token với fixed supply và protocol-driven burn mechanism.'
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
    brandCopy: 'Bảo vệ mạng lưới giá trị tương lai \nAI x DeFi x USD1',
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
