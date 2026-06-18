import { defineMessages } from '~/i18n/messages/define-messages'
import type { HomeMessagesBundle } from './en'

const home = defineMessages({
  meta: {
    description: 'AEGIS X là giao thức DeFi 4.0 bản địa AI với thanh toán USD1, truy cập ví ưu tiên BSC và công cụ giao thức tự phục hồi, xây dựng mạng lưới giá trị thế hệ tiếp theo.',
    title: 'AEGIS X - Bảo vệ Giá trị Tương lai'
  },
  nav: {
    sectionsLabel: 'Điều hướng các phần trang chủ',
    links: [
      {
        href: '#protocol',
        label: 'Giao thức'
      },
      {
        href: '#engine',
        label: 'Cơ chế cốt lõi'
      },
      {
        href: '#token',
        label: 'Giá trị hệ sinh thái'
      },
      {
        href: '#roadmap',
        label: 'Lộ trình'
      },
      {
        href: '#security',
        label: 'Bảo mật'
      },
      {
        href: '#faq',
        label: 'Câu hỏi thường gặp'
      }
    ],
    whitepaper: 'Sách trắng',
    languageLabel: 'Ngôn ngữ'
  },
  hero: {
    guardianLabel: 'Người bảo vệ AEGIS X',
    eyebrow: 'AI x DeFi x USD1 · Giao thức DeFi 4.0',
    title: 'Bảo vệ Giá trị Tương lai',
    body: 'Giao thức hệ sinh thái USD1 đầu tiên trên thế giới được điều khiển bởi viện nghiên cứu AI. Với USD1 là tài sản thanh toán cốt lõi, kết nối AI, thanh toán và mạng lưới thanh khoản toàn cầu.',
    enterProtocol: 'Vào giao thức',
    readWhitepaper: 'Đọc sách trắng',
  },
  sections: {
    protocol: {
      eyebrow: 'Giao thức AEGIS X',
      title: 'Kiến trúc cốt lõi mạng lưới giá trị thế hệ tiếp theo',
      subtitle: 'AI x DeFi x USD1 - Thúc đẩy dòng chảy giá trị',
      cards: [
        {
          title: 'Viện nghiên cứu AI',
          body: 'Kiểm soát rủi ro tự động, tạo lập thị trường thông minh và quản lý thanh khoản đều được thực thi trên chuỗi.',
          index: '01'
        },
        {
          title: 'Thanh toán USD1',
          body: 'Với USD1 là tài sản thanh toán cốt lõi, xây dựng mạng lưới lưu thông giá trị ổn định.',
          index: '02'
        },
        {
          title: 'Thanh toán toàn cầu',
          body: 'Kết nối AI Agent, DeFi và các kịch bản thanh toán toàn cầu, xây dựng mạng lưới giá trị thế hệ tiếp theo.',
          index: '03'
        }
      ]
    },
    engine: {
      eyebrow: 'Cơ chế cốt lõi',
      title: 'Bốn cơ chế, một hệ thống thông minh',
      subtitle: 'Thông qua ra quyết định thông minh, điều chỉnh động và kiểm soát rủi ro, xây dựng mạng lưới giá trị bền vững.',
      cards: [
        {
          title: 'Cơ chế tạo lập thị trường thông minh',
          body: 'Tích lũy tài sản dự trữ trong giai đoạn tăng giá để tăng cường năng lực dự trữ của giao thức; trong giai đoạn điều chỉnh, thực hiện cơ chế mua lại và đốt để phục hồi giá.'
        },
        {
          title: 'Cơ chế phòng thủ biến động',
          body: 'Tự động kích hoạt khi mức giảm trong ngày đạt ngưỡng: phí bán tăng lên 30%, mua lại dự trữ và đốt hố đen khởi động, tự động phục hồi sau 24 giờ.'
        },
        {
          title: 'Cơ chế phân phối lợi nhuận',
          body: 'Áp dụng cơ chế giải phóng tuyến tính theo khối, thanh toán lợi nhuận mỗi 12 giờ, hỗ trợ chu kỳ tham gia tối đa 540 ngày.'
        },
        {
          title: 'Cơ chế Turbo',
          body: 'Thông qua cơ chế mở khóa mua động, tối ưu hóa cấu trúc thanh khoản thị trường, tăng cường sự ổn định hệ sinh thái và năng lực phát triển dài hạn.'
        }
      ]
    },
    token: {
      eyebrow: 'Hệ sinh thái giá trị',
      title: 'Bánh đà giá trị đa tài sản',
      subtitle: 'Tăng trưởng người dùng → Tăng cường thanh khoản → Mở rộng thanh toán → Tăng trưởng hệ sinh thái.',
      cards: [
        {
          label: 'Tài sản giao thức cốt lõi',
          description: 'Phát hành thế chấp vượt mức 150% · Công cụ tăng trưởng lợi nhuận'
        },
        {
          label: 'Tài sản thanh toán cốt lõi',
          description: 'Lớp thanh toán hệ sinh thái · Cơ sở hạ tầng lưu thông giá trị'
        },
        {
          label: 'Token giá trị hệ sinh thái',
          description: 'Tổng cung cố định 210 triệu · Tích lũy giá trị liên tục'
        },
        {
          label: 'Chứng nhận thanh toán phần thưởng',
          description: 'Có thể đổi AGX · Tham gia khai thác hệ sinh thái'
        }
      ]
    },
    roadmap: {
      eyebrow: 'Lộ trình',
      title: 'Con đường đến mạng lưới giá trị thế hệ tiếp theo',
      phases: [
        {
          phase: 'PHASE 01',
          time: '2026 Q3',
          title: 'Khởi động Genesis',
          description: 'Triển khai giao thức · Phát hành AGX · Pool thanh khoản USD1',
          dot: '✓',
          side: 'left',
          state: 'current'
        },
        {
          phase: 'PHASE 02',
          time: '2026 Q4',
          title: 'DeFi cốt lõi',
          description: 'Staking Rebase · Trái phiếu LP · Trái phiếu đốt · Tạo lập thị trường AI',
          dot: '2',
          side: 'right'
        },
        {
          phase: 'PHASE 03',
          time: '2027 Q1',
          title: 'DAO & Tăng trưởng',
          description: 'Khuyến khích X DAO · Quản trị đa chữ ký · Nút toàn cầu',
          dot: '3',
          side: 'left'
        },
        {
          phase: 'PHASE 04',
          time: '2027 Q2',
          title: 'Kinh tế AI Agent',
          description: 'Thanh toán tự động · Hợp tác thông minh · Mạng lưới kinh tế AI Agent',
          dot: '4',
          side: 'right'
        },
        {
          phase: 'PHASE 05',
          time: '2027 Q3',
          title: 'Thanh toán toàn cầu',
          description: 'Mạng lưới thanh toán toàn cầu · Tích hợp thương gia · Kịch bản thanh toán USD1',
          dot: '5',
          side: 'left'
        },
        {
          phase: 'PHASE 06',
          time: '2027 Q4',
          title: 'Mạng lưới giá trị tương lai',
          description: 'Mạng lưới thanh toán · Kinh tế AI Agent · Hệ sinh thái giá trị',
          dot: '6',
          side: 'right'
        }
      ]
    },
    security: {
      eyebrow: 'Bảo mật & Tin cậy',
      title: 'Kiến trúc bảo mật cấp AEGIS',
      subtitle: 'Từ kiến trúc giao thức đến quản lý tài sản, bảo mật xuyên suốt mọi khâu',
      checks: [
        "Kiến trúc phi lưu ký · Hợp đồng tạo lập thị trường thông minh không có quyền chuyển tài sản ra ngoài",
        "Hợp đồng cốt lõi mã nguồn mở có thể xác minh · Đã qua kiểm toán bảo mật chuyên nghiệp",
        "Cơ chế quản trị đa chữ ký · Quản lý chung các quyền cốt lõi",
        "Cơ chế phòng thủ động · Tự động ứng phó với biến động cực đoan"
      ]
    },
    partners: {
      title: 'Cơ sở hạ tầng hệ sinh thái'
    },
    faq: {
      eyebrow: 'Tìm hiểu nhanh',
      title: 'Câu hỏi thường gặp',
      items: [
        {
          q: 'AEGIS X là gì?',
          a: 'AEGIS X là giao thức hệ sinh thái USD1 đầu tiên trên thế giới được điều khiển bởi viện nghiên cứu AI, với USD1 là tài sản thanh toán cốt lõi, kết nối AI, DeFi và mạng lưới thanh toán toàn cầu.',
          open: true
        },
        {
          q: 'AGX được phát hành như thế nào?',
          a: 'AGX được tạo ra thông qua cơ chế thế chấp vượt mức 150%, là tài sản cốt lõi của giao thức và phương tiện quan trọng cho tăng trưởng giá trị.'
        },
        {
          q: 'USD1 đóng vai trò gì trong AEGIS X?',
          a: 'USD1 là tài sản thanh toán cốt lõi của giao thức, cung cấp khả năng lưu thông giá trị, hỗ trợ thanh khoản và cơ sở hạ tầng thanh toán cho hệ sinh thái.'
        },
        {
          q: 'Giao thức đảm bảo bảo mật như thế nào?',
          a: 'Hợp đồng áp dụng ranh giới phi lưu ký, kiểm toán, xem xét mã nguồn mở và quản trị đa chữ ký.'
        },
        {
          q: 'Cơ chế Turbo là gì?',
          a: 'Cơ chế Turbo giảm rủi ro áp lực bán tập trung thông qua cơ chế mở khóa động và điều chỉnh thanh khoản, tăng cường sự ổn định thị trường và năng lực phát triển dài hạn.'
        },
        {
          q: 'Token X hoạt động như thế nào?',
          a: 'X là token giá trị hệ sinh thái, áp dụng tổng cung cố định và cơ chế đốt được điều khiển bởi giao thức.'
        }
      ]
    }
  },
  metrics: [
    {
      value: '150%',
      countTarget: 150,
      suffix: '%',
      label: 'Tỷ lệ thế chấp vượt mức'
    },
    {
      value: '100%',
      countTarget: 100,
      suffix: '%',
      label: 'Khóa LP vĩnh viễn'
    },
    {
      value: '24H',
      countTarget: 24,
      suffix: 'H',
      label: 'Cơ chế phòng thủ động'
    },
    {
      value: '2.1M',
      countTarget: 210,
      suffix: 'M',
      label: 'Tổng cung cố định X'
    }
  ],
  footer: {
    brandCopy: 'Bảo vệ mạng lưới giá trị tương lai \nAI x DeFi x USD1',
    copyright: '© 2026 AEGIS X DAO. Bảo lưu mọi quyền.',
    legal: 'Điều khoản dịch vụ · Chính sách bảo mật · Tuyên bố miễn trừ',
    groups: [
      {
        label: 'Giao thức',
        ariaLabel: 'Liên kết chân trang giao thức',
        links: [
          {
            href: '/app.html',
            label: 'Vào App'
          },
          {
            href: '#whitepaper',
            label: 'Sách trắng'
          },
          {
            href: '#docs',
            label: 'Tài liệu dự án'
          },
          {
            href: '#analytics',
            label: 'Lộ trình phát triển'
          }
        ]
      },
      {
        label: 'Hệ sinh thái',
        ariaLabel: 'Liên kết chân trang hệ sinh thái',
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
        label: 'Cộng đồng',
        ariaLabel: 'Liên kết chân trang cộng đồng',
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
