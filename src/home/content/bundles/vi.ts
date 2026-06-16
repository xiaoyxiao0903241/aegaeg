import type { HomeContentBundle } from '../types'

export const viBundle: HomeContentBundle = {
  meta: {
    title: 'AEGIS X - Bảo vệ Tương lai Giá trị',
    description:
      'AEGIS X là giao thức DeFi 4.0 AI-native với thanh toán USD1, truy cập ví ưu tiên BSC và công cụ giao thức tự phục hồi.',
  },
  nav: {
    sectionsLabel: 'Các mục trang chủ',
    links: [
      { href: '#protocol', label: 'Giao thức' },
      { href: '#engine', label: 'Công cụ' },
      { href: '#token', label: 'Token' },
      { href: '#roadmap', label: 'Lộ trình' },
      { href: '#security', label: 'Bảo mật' },
      { href: '#faq', label: 'FAQ' },
    ],
    whitepaper: 'Whitepaper',
    launchDapp: 'Khởi chạy DApp',
    languageLabel: 'Ngôn ngữ',
  },
  hero: {
    guardianLabel: 'Người bảo vệ AEGIS X',
    eyebrow: {
      desktop: 'AI x DeFi x USD1 · Giao thức DeFi 4.0',
      mobile: 'AI x DeFi x USD1 · DeFi 4.0',
    },
    title: 'Bảo vệ Tương lai Giá trị',
    body: {
      desktop:
        'Giao thức thanh toán toàn cầu AI x DeFi x USD1 đầu tiên trên thế giới, được vận hành bởi hệ thống tư duy AI. Với USD1 là tài sản thanh toán cốt lõi, tái định nghĩa tài chính phi tập trung bằng trí tuệ.',
      mobile:
        'Giao thức thanh toán toàn cầu AI x DeFi x USD1 đầu tiên trên thế giới, được vận hành bởi hệ thống tư duy AI.',
    },
    enterProtocol: 'Vào Giao thức',
    readWhitepaper: 'Đọc Whitepaper',
    walletBusy: 'Đang mở ví...',
  },
  sections: {
    protocol: {
      eyebrow: 'GIAO THỨC AEGIS X',
      title: {
        desktop: 'Hạ tầng AI-native cho kỷ nguyên tài chính tiếp theo',
        mobile: 'Hạ tầng AI-native',
      },
      subtitle: {
        desktop:
          'AI x DeFi x USD1 - xây dựng mạng lưới giá trị thế hệ mới.',
        mobile: 'AI x DeFi x USD1 - xây dựng mạng giá trị thế hệ mới.',
      },
      cards: [
        {
          index: '01',
          title: 'Tư duy AI',
          desktop:
            'Kiểm soát rủi ro, tạo lập thị trường và phân bổ tài sản tự động - tất cả trên chuỗi, tất cả do trí tuệ dẫn dắt.',
          mobile:
            'Kiểm soát rủi ro, tạo lập thị trường và phân bổ tài sản - trên chuỗi, do trí tuệ dẫn dắt.',
        },
        {
          index: '02',
          title: 'Thanh toán USD1',
          desktop:
            'Phát hành thế chấp vượt mức 150%, với USD1 là tài sản thanh toán cốt lõi của lớp nền DeFi 4.0 ổn định.',
          mobile:
            'Phát hành thế chấp vượt mức 150%, với USD1 là tài sản thanh toán cốt lõi của DeFi 4.0.',
        },
        {
          index: '03',
          title: 'Thanh toán Toàn cầu',
          desktop:
            'Kết nối AI agent, thanh khoản DeFi và thanh toán xuyên biên giới thành một mạng lưới giá trị toàn cầu thống nhất.',
          mobile:
            'Kết nối AI agent, thanh khoản DeFi và thanh toán xuyên biên giới thành một mạng giá trị.',
        },
      ],
    },
    engine: {
      eyebrow: 'CÔNG CỤ CỐT LÕI',
      title: {
        desktop: 'Bốn trụ cột, một hệ thống thông minh',
        mobile: 'Bốn trụ cột, một hệ thống',
      },
      subtitle: {
        desktop:
          'Công cụ cốt lõi DeFi 4.0 do AI vận hành - kiến trúc giá tự phục hồi.',
        mobile: 'Công cụ cốt lõi DeFi 4.0 do AI vận hành.',
      },
      cards: [
        {
          title: 'AI Market Maker',
          desktop:
            'Mô hình cân bằng động: tích lũy dự trữ USD1 khi giá tăng; khi điều chỉnh, thoát LP và triển khai mua lại + đốt để tự sửa giá.',
          mobile:
            'Cân bằng động: tích lũy USD1 khi tăng; khi điều chỉnh, mua lại + đốt để tự sửa giá.',
        },
        {
          title: 'Phòng thủ Biến động Động',
          desktop:
            'Tự động kích hoạt khi giảm >=5%/ngày: phí bán tăng lên 30%, mua lại dự trữ và đốt hố đen kích hoạt, tự phục hồi sau 24 giờ.',
          mobile:
            'Giảm >=5%/ngày kích hoạt: phí bán 30%, mua lại dự trữ + đốt hố đen, tự phục hồi sau 24 giờ.',
        },
        {
          title: 'Rebase Engine',
          desktop:
            'Thanh toán hai chu kỳ mỗi 12 giờ với phát hành tuyến tính theo block. Linh hoạt đến 540 ngày staking, APY tham chiếu 535%-4,880%.',
          mobile:
            'Thanh toán hai chu kỳ mỗi 12 giờ, phát hành theo block. APY tham chiếu 535%-4,880%.',
        },
        {
          title: 'Cơ chế Turbo',
          desktop:
            'Thiết kế mua để mở khóa: hạn mức bán 1:1 với mua, thời gian chờ thích ứng 24-96 giờ và logic chống bán hoảng loạn.',
          mobile:
            'Mua 1:1 mở hạn mức bán, thời gian chờ thích ứng 24-96 giờ - không bán hoảng loạn.',
        },
      ],
    },
    token: {
      eyebrow: 'TOKEN & HỆ SINH THÁI',
      title: 'Vòng xoáy đa tài sản',
      subtitle: {
        desktop:
          'Bốn token, một vòng lặp giá trị tự củng cố: tăng trưởng → thanh khoản → thanh toán → hệ sinh thái.',
        mobile: 'Bốn token, một vòng lặp giá trị tự củng cố.',
      },
      cards: [
        {
          label: 'Tài sản giao thức cốt lõi',
          description: 'Thế chấp vượt mức 150% · Quản lý bởi tư duy AI',
        },
        {
          label: 'Tài sản dự trữ ổn định',
          description: 'Lớp thanh toán · Thanh khoản hỗ trợ USD',
        },
        {
          label: 'Token giá trị hệ sinh thái',
          description: '210M cố định · 25% đốt khi bán',
        },
        {
          label: 'Token thanh toán phần thưởng',
          description: '1:1 với AGX · vận hành khai thác X',
        },
      ],
    },
    roadmap: {
      eyebrow: 'LỘ TRÌNH',
      title: 'Con đường đến DeFi 4.0',
      phases: [
        {
          phase: 'GIAI ĐOẠN 01',
          time: '2026 Q3',
          title: 'Ra mắt Genesis',
          description: 'Triển khai giao thức · Phát hành AGX · Pool thanh khoản USD1',
          dot: '1',
          side: 'left',
          state: 'current',
        },
        {
          phase: 'GIAI ĐOẠN 02',
          time: '2026 Q4',
          title: 'DeFi Cốt lõi',
          description: 'Rebase staking · LP bond · burn bond · AI market-making',
          dot: '2',
          side: 'right',
        },
        {
          phase: 'GIAI ĐOẠN 03',
          time: '2027 Q1',
          title: 'DAO & Tăng trưởng',
          description: 'Khuyến khích X DAO · quản trị multisig · node toàn cầu',
          dot: '3',
          side: 'left',
        },
        {
          phase: 'GIAI ĐOẠN 04',
          time: '2027 Q2',
          title: 'Kinh tế AI Agent',
          description:
            'Thanh toán tự động · cộng tác trên chuỗi · market-making agent',
          dot: '4',
          side: 'right',
        },
        {
          phase: 'GIAI ĐOẠN 05',
          time: '2027 Q3',
          title: 'Thanh toán Toàn cầu',
          description: 'Thanh toán xuyên biên giới · onboarding merchant · kênh USD1',
          dot: '5',
          side: 'left',
        },
        {
          phase: 'GIAI ĐOẠN 06',
          time: '2027 Q4',
          title: 'DeFi 4.0',
          description:
            'Sản phẩm tổ chức · khung tuân thủ · hệ sinh thái hoàn chỉnh',
          dot: '6',
          side: 'right',
        },
      ],
    },
    security: {
      eyebrow: 'BẢO MẬT & TIN CẬY',
      title: 'Bảo mật cấp Aegis',
      subtitle: {
        desktop:
          'AEGIS = lá chắn, bảo vệ, trật tự, an toàn. An toàn tài sản được tích hợp từ nền tảng.',
        mobile: 'An toàn tài sản được tích hợp từ nền tảng.',
      },
      checks: [
        {
          desktop:
            'Non-custodial - hợp đồng AI market-maker không thể chuyển bất kỳ tài sản nào ra ngoài',
          mobile:
            'Non-custodial - AI market-maker không thể chuyển tài sản ra ngoài',
        },
        'Được kiểm toán bởi nhiều công ty bảo mật',
        'Hợp đồng cốt lõi mã nguồn mở trên GitHub',
        {
          desktop: 'Quản trị Safe multisig (quyền nâng cấp + thực thi)',
          mobile: 'Quản trị Safe multisig (nâng cấp + thực thi)',
        },
      ],
    },
    partners: {
      title: 'ĐỐI TÁC HỆ SINH THÁI',
    },
    faq: {
      eyebrow: 'FAQ',
      title: 'Câu hỏi thường gặp',
      items: [
        {
          question: 'AEGIS X là gì?',
          answer:
            'Giao thức đầu tiên trên thế giới được vận hành bởi hệ thống tư duy AI, kết hợp trí tuệ AI, thanh khoản DeFi và thanh toán stablecoin USD1 thành mạng giá trị thế hệ mới - DeFi 4.0.',
          open: true,
        },
        {
          question: 'AGX được phát hành như thế nào?',
          answer:
            'AGX được phát hành thông qua thiết kế phát hành thế chấp của giao thức, với USD1 là tài sản thanh toán cốt lõi.',
        },
        {
          question: 'Phần thưởng staking được tính như thế nào?',
          answer:
            'Phần thưởng tuân theo cấp staking, thanh toán theo epoch và quy tắc tham gia giao thức do hợp đồng AEGIS X quy định.',
        },
        {
          question: 'Bảo mật giao thức được đảm bảo như thế nào?',
          answer:
            'AEGIS X kết hợp thiết kế non-custodial, kiểm toán, hợp đồng mã nguồn mở và quản trị multisig.',
        },
        {
          question: 'Token X hoạt động như thế nào?',
          answer:
            'X là token giá trị hệ sinh thái với nguồn cung cố định và cơ chế đốt do giao thức vận hành.',
          optional: true,
        },
        {
          question: 'Cơ chế Turbo là gì?',
          answer:
            'Turbo liên kết hạn mức mua và bán với thời gian chờ thích ứng để giảm bán hoảng loạn trong khi duy trì thanh khoản.',
        },
      ],
    },
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Tỷ lệ Thế chấp',
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'APY Tham chiếu Tối đa',
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Chuỗi Hỗ trợ',
    },
    {
      value: '210M',
      countTarget: 210,
      suffix: 'M',
      label: 'Tổng Cung X',
    },
  ],
  footer: {
    brandCopy: {
      desktop: 'Bảo vệ Tương lai Giá trị.\nAI x DeFi x USD1',
      mobile: 'Bảo vệ Tương lai Giá trị.\nAI x DeFi x USD1',
    },
    copyright: '© 2026 AEGIS X DAO. All rights reserved.',
    legal: 'Điều khoản Dịch vụ · Chính sách Bảo mật · Tuyên bố Miễn trừ',
    languageLabel: 'Ngôn ngữ',
    groups: [
      {
        label: 'Giao thức',
        ariaLabel: 'Liên kết giao thức ở chân trang',
        links: [
          {
            href: '/app.html',
            label: { desktop: 'Khởi chạy DApp', mobile: 'Tài liệu' },
          },
          { href: '#whitepaper', label: 'Whitepaper' },
          { href: '#docs', label: 'Tài liệu' },
          { href: '#analytics', label: 'Phân tích' },
        ],
      },
      {
        label: 'Hệ sinh thái',
        ariaLabel: 'Liên kết hệ sinh thái ở chân trang',
        links: [
          {
            href: '#token',
            label: { desktop: 'AGX Staking', mobile: 'Tài liệu' },
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
        label: 'Cộng đồng',
        ariaLabel: 'Liên kết cộng đồng ở chân trang',
        links: [
          {
            href: '#discord',
            label: { desktop: 'Discord', mobile: 'Tài liệu' },
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
