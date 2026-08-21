import { defineMessages } from '~/i18n/messages/define-messages'

import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Kết nối ví',
    language: 'Ngôn ngữ',
    copy: 'Sao chép',
    claimable: 'Chờ nhận',
    max: 'Tối đa',
    shareUnit: 'phần',
    confirm: 'Xác nhận',
    close: 'Đóng',
    paginationTotal: 'Tổng {total} mục',
    paginationPerPage: '{size} mục / trang',
    paginationPrev: 'Trang trước',
    paginationNext: 'Trang sau',
  },
  errors: {
    api: {
      network: 'Kết nối mạng thất bại. Kiểm tra mạng và thử lại.',
      timeout: 'Yêu cầu hết thời gian. Vui lòng thử lại sau.',
      unavailable: 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.',
      badResponse: 'Phản hồi máy chủ không hợp lệ. Vui lòng thử lại sau.',
      fallback: 'Thao tác thất bại. Vui lòng thử lại sau.',
    },
    chain: {
      fallback: 'Thao tác on-chain thất bại. Vui lòng thử lại sau.',
      reverts: {
        stakeAmountLimit: 'Đã vượt hạn mức staking ngày. Giảm số lượng hoặc chờ hạn mức khôi phục.',
        debtCapacityReached: 'Dung lượng trái phiếu không đủ, vui lòng thử lại sau.',
        turbineCooldown:
          'Chưa hết thời gian chờ hoặc số lượng không hợp lệ. Làm mới bản ghi chờ rồi thử lại.',
        pairNotExist: 'Cặp giao dịch không tồn tại. Kiểm tra cấu hình token.',
        notWinner: 'Bạn chưa trúng thưởng vòng này, không thể nhận.',
        rewardAlreadyClaimed: 'Phần thưởng đã nhận, vui lòng không thao tác lại.',
        configNotReady: 'Cấu hình giao thức chưa sẵn sàng, vui lòng thử lại sau.',
        exceedsMax: 'Số lượng vượt giới hạn tối đa, vui lòng giảm.',
        bondTooSmall: 'Số trái phiếu nhận được quá nhỏ, hãy tăng số mua.',
        bondTooLarge: 'Vượt giới hạn trái phiếu mỗi lần, hãy giảm số mua.',
        stakeNotExist: 'Vị thế không tồn tại hoặc đã tất toán. Làm mới danh sách rồi thử lại.',
        yieldUnavailable:
          'Chưa có lợi nhuận để nhận hoặc số rút quá lớn. Giảm số lượng hoặc chờ tích lũy.',
        operationPaused: 'Thao tác này đã tạm dừng, vui lòng thử lại sau.',
        belowMinAmount: 'Số lượng thấp hơn mức tối thiểu, vui lòng tăng.',
        aboveMaxAmount: 'Số lượng vượt giới hạn tối đa, vui lòng giảm.',
        zeroRate: 'Tỷ giá chưa sẵn sàng, vui lòng thử lại sau.',
        zeroAmount: 'Nhập số lượng hợp lệ.',
        turbineNoSilenceBalance: 'Không có số dư chờ nguội đã đáo hạn để rút.',
        invalidAmount: 'Số tiền không hợp lệ. Vui lòng kiểm tra và thử lại.',
        zeroAddress: 'Địa chỉ không hợp lệ. Vui lòng thử lại sau.',
        notAuthorized: 'Tài khoản này không có quyền thực hiện thao tác.',
        invalidLimits: 'Cấu hình hạn mức không hợp lệ. Vui lòng thử lại sau.',
        nothingToClaim: 'Không có gì để nhận hoặc chỉ mục không hợp lệ. Làm mới và thử lại.',
        warmupOrLockActive:
          'Vẫn trong thời gian warmup hoặc khóa. Vui lòng đợi kết thúc rồi thử lại.',
        walletTokenInsufficient: 'Số dư token trong ví không đủ.',
        walletAgxInsufficient: 'Số dư AGX trong ví không đủ.',
        walletUsd1Insufficient: 'Số dư USD1 trong ví không đủ.',
        walletGagxInsufficient: 'Số dư gAGX trong ví không đủ.',
        contractPayableInsufficient:
          'Số dư hợp đồng có thể chi trả không đủ. Vui lòng thử lại sau.',
        extractableInsufficient: 'Số dư có thể rút không đủ. Làm mới và thử lại.',
        insufficientAllowance: 'Hạn mức ủy quyền không đủ. Vui lòng phê duyệt trước.',
      },
    },
    walletNotConnected: 'Vui lòng kết nối ví và đăng nhập trước.',
    quoteFailed: 'Báo giá thất bại. Vui lòng thử lại sau.',
    loadFailed: 'Tải thất bại. Vui lòng thử lại sau.',
    loginFailed: 'Đăng nhập thất bại. Vui lòng thử lại sau.',
    loginSignatureRejected: 'Chữ ký đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng ký lại.',
    pageLoadFailed: 'Không tải được trang',
    pageLoadFailedBody: 'Đã xảy ra lỗi khi render. Tải lại để tiếp tục — ví vẫn được kết nối.',
    reloadPage: 'Tải lại trang',
  },
  nav: {
    exchange: 'Đổi',
    assets: 'Tài sản',
    staking: 'Đặt cọc',
    genesis: 'Cùng xây dựng',
    rewards: 'Phần thưởng',
    release: 'Giải phóng',
    community: 'Cộng đồng',
    rewardsTooltip: 'Xem phần thưởng giới thiệu và phần thưởng nhóm.',
    communityTooltip:
      'Mời đối tác cùng xây dựng, chia sẻ giá trị tăng trưởng hệ sinh thái và phần thưởng Genesis.',
    bscTooltip: 'Chỉ BSC · AEGIS X chạy trên BNB Smart Chain.',
  },
  flowOps: {
    stake: {
      STAKE: 'Stake',
      REWARD: 'Nhận thưởng',
      EXTRA_REWARD: 'Nhận thưởng thêm',
      CLAIM_PRINCIPAL: 'Rút gốc',
      RESTAKE: 'Tái stake',
    },
    bond: {
      PURCHASE: 'Mua',
      REDEEM: 'Rút',
      REWARD: 'Nhận',
      RESTAKE: 'Tái stake',
    },
    xmine: {
      STAKE_X: 'Stake',
      UNSTAKE_X: 'Gỡ stake',
      REWARD: 'Nhận',
    },
    buffer: {
      RELEASE_CREATED: 'Vào',
      PRINCIPAL_CLAIMED: 'Rút',
    },
    release: {
      entered_queue: 'Vào hàng đợi',
      claimed: 'Nhận',
      released: 'Đã phát hành',
    },
    turbine: {
      received: 'Vào',
      silenced: 'Mở khóa',
      cooled_claimed: 'Rút',
    },
    termDays: ' ({n} ngày)',
    termLiquid: ' (Linh hoạt)',
    liquid: 'Linh hoạt',
    periodDays: '{n} ngày',
  },
  topbar: {
    currentNetwork: 'Mạng hiện tại',
    switchToBsc: 'Hãy chuyển sang BSC',
    switchNetworkFailed: 'Không chuyển được mạng. Hãy chuyển sang BSC trong ví rồi thử lại.',
    wrongNetworkTooltip: 'Sai mạng. Nhấn để chuyển sang BNB Smart Chain (BSC).',
    openMenu: 'Mở điều hướng',
    closeMenu: 'Đóng điều hướng',
    hideDetails: 'Thu gọn bảng chi tiết',
    showDetails: 'Mở rộng bảng chi tiết',
    toggleTooltip: 'Hiện hoặc ẩn bảng chi tiết',
  },
  onboarding: {
    chip: 'Hướng dẫn',
    skip: 'Bỏ qua',
    prev: 'Quay lại',
    next: 'Tiếp',
    done: 'Xong',
    steps: [
      {
        title: 'Đổi',
        body: 'Qua 「Đổi」, bạn có thể dùng token phổ biến đổi token hệ sinh thái AEGIS X (AGX, gAGX, X) theo tỷ giá thị trường.',
      },
      {
        title: 'Giao dịch',
        body: 'Qua 「Giao dịch」, bạn có thể dùng USD1 mua AGX.',
      },
      {
        title: 'Đặt cọc',
        body: '「Staking」là điểm bắt đầu lợi nhuận: stake AGX hoặc mua trái phiếu để nhận lãi kép theo mỗi lần Rebase.',
      },
      {
        title: 'Staking đơn token',
        body: 'Trong thẻ 「Staking」hãy stake AGX; Rebase {timesPerDay} lần/ngày lãi kép; chu kỳ càng dài cộng tỷ suất càng cao.',
      },
      {
        title: 'Tài sản',
        body: '「Tài sản」tổng hợp toàn bộ vị thế: staking, trái phiếu LP, trái phiếu đốt và đào X — nắm giữ với lợi nhuận rõ ràng.',
      },
      {
        title: 'Vị thế staking',
        body: 'Trong thẻ 「Staking」trên trang Tài sản, xem vị thế stake và tổng lợi nhuận, rồi nhận, tái stake hoặc chuộc.',
      },
      {
        title: 'Giải phóng',
        body: '「Giải phóng」quản lý vốn chờ giải phóng: lợi nhuận và phần thưởng vào hồ giải phóng / hồ đệm, giải phóng tuyến tính theo chu kỳ.',
      },
      {
        title: 'Hồ giải phóng',
        body: 'Lợi nhuận và phần thưởng đã nhận giải phóng tuyến tính theo chu kỳ đã chọn (5 / 20 / 40 / 60 ngày); phần đã giải phóng có thể nhận vào Turbine.',
      },
      {
        title: 'Hồ đệm',
        body: 'Gốc đã chuộc giải phóng tuyến tính theo khối ~30 ngày; phần đã giải phóng có thể rút về ví bất cứ lúc nào.',
      },
      {
        title: 'Tuabin',
        body: 'gAGX từ hồ giải phóng vào Turbine đang khóa; dùng USD1 mua theo báo giá on-chain để mở khóa.',
      },
      {
        title: 'Phần thưởng',
        body: '「Phần thưởng」gồm thưởng giới thiệu, tham gia, Cùng xây dựng…; Mixed (Lucky/Cùng xây dựng/giới thiệu/tham gia) nhận tiêu điểm đóng góp {ratio}; trợ cấp phát triển nhận bằng chữ ký về ví.',
      },
      {
        title: 'Cộng đồng',
        body: '「Cộng đồng」hiển thị đội của bạn: liên kết mời, thành viên và hạng Cùng xây dựng đều ở đây.',
      },
    ],
  },
  dapp: {
    connect: {
      promoTitle: 'Kết nối để khám phá các tính năng AEGIS X',
      promoBrandLine: 'Bảo vệ mạng giá trị tương lai',
      recordsTitle: 'Kết nối ví để xem bản ghi của bạn',
      recordsBodyGenesis: 'Sau khi kết nối, lịch sử cùng xây dựng sẽ hiển thị tại đây.',
      recordsBodyRewards: 'Sau khi kết nối, lịch sử phần thưởng sẽ hiển thị tại đây.',
      recordsBodyCommunity: 'Sau khi kết nối, lịch sử lời mời sẽ hiển thị tại đây.',
    },
  },
  wallet: {
    connectTitle: 'Kết nối ví',
    connecting: 'Đang kết nối…',
    copyAddress: 'Sao chép địa chỉ',
    copied: 'Đã sao chép',
    copyFailed: 'Sao chép thất bại. Nhấn giữ để sao chép thủ công.',
    disconnect: 'Ngắt kết nối',
    reconnectWallet: 'Kết nối lại ví',
    reconnectHint:
      'Ví đã ngắt kết nối. Vui lòng kết nối lại trước khi thực hiện thao tác on-chain.',
    signInRequired: 'Đăng nhập',
    accountBanned: 'Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.',
    transactionErrors: {
      gasLimitTooLow: 'Giới hạn gas quá thấp. Hãy giữ đủ BNB trong ví để trả phí mạng rồi thử lại.',
      gasEstimateFailed: 'Không thể ước tính gas cho giao dịch này. Kiểm tra mạng và thử lại.',
      insufficientFunds: 'Không đủ BNB để trả phí gas mạng.',
      wrongChain: 'Hãy chuyển sang BNB Smart Chain (BSC) rồi thử lại.',
      accountChanged: 'Tài khoản ví đã thay đổi. Vui lòng gửi lại.',
    },
  },
  exchange: {
    title: 'Đổi',
    intro: 'Nhận token hệ sinh thái AEGIS X với tỷ giá tốt nhất',
    backToHub: 'Quay lại Đổi',
    sell: 'Sell',
    buy: 'Mua',
    flip: 'Đảo chiều đổi',
    balance: 'Số dư',
    exchangePrice: 'Giá đổi',
    slippage: 'Độ trượt giá',
    allowedSlippage: 'Cho phép trượt giá',
    slippageSettings: 'Cài đặt độ trượt giá',
    slippagePanel: {
      title: 'Trượt giá',
      hint: 'Dung sai trượt giá là biên độ giá bạn chấp nhận từ lúc gửi lệnh đến lúc khớp trên chuỗi. Nếu trượt giá thực tế vượt mức, giao dịch sẽ thất bại và hoàn tác. Giao dịch hoàn tác vẫn có thể mất phí gas.',
      modeAuto: 'Mặc định',
      modeCustom: 'Tùy chỉnh',
      max: 'Trượt giá tối đa',
      customAria: 'Trượt giá tùy chỉnh',
    },
    route: 'Đường đổi',
    provider: 'Nhà cung cấp',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Mở trên PancakeSwap',
    overview: 'Tổng quan',
    exchangeRate: 'Tỷ giá đổi',
    settlement: 'Tất toán',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Đổi nhanh',
          body: 'Đổi gAGX sang AGX hoặc USDT sang USD1 — không phí, không trượt giá',
        },
        trade: {
          title: 'Giao dịch',
          body: 'Đổi token phổ biến lấy token hệ sinh thái AEGIS X',
        },
        burn: {
          title: 'Đốt',
          body: 'Đốt AGX để nhận điểm đóng góp',
        },
        turbine: {
          title: 'Tuabin',
          body: 'Dùng USD1 mua gAGX đang mở khóa trong Turbine',
        },
      },
      program: {
        title: 'Nhận token giao thức AEGIS X',
        cards: [
          { title: 'Giao dịch gAGX', body: 'Đổi gAGX sang AGX' },
          { title: 'Tuabin', body: 'Dùng USD1 mua gAGX đang mở khóa trong Turbine' },
          { title: 'Lấy USD1', body: 'Đổi USDT sang USD1 qua Flash' },
          { title: 'Lấy AGX', body: 'Lấy AGX theo tỷ giá thị trường PancakeSwap' },
          { title: 'Bán X', body: 'Đổi X sang AGX, USD1 hoặc token hệ sinh thái khác' },
          { title: 'Lấy điểm đóng góp', body: 'Đốt AGX theo tỷ lệ {ratio} để nhận điểm đóng góp' },
        ],
      },
      faq: {
        items: [
          {
            q: 'Trang Đổi làm được gì?',
            a: 'Trang Đổi tập hợp các cách thường dùng để nhận và xử lý token giao thức AEGIS X: Flash (chuộc gAGX thành AGX tỷ lệ 1:1), Giao dịch (đổi USD1 / AGX / X và token khác theo tỷ giá thị trường), Turbine (mua bằng USD1 để mở khóa gAGX trong Turbine), và Đốt AGX lấy điểm đóng góp. Chọn lối vào phù hợp nhu cầu.',
          },
          {
            q: 'Flash và Giao dịch khác nhau thế nào?',
            a: 'Flash là chuộc cố định 1:1 gAGX↔AGX của giao thức — không phí, không trượt giá, về tài khoản on-chain ngay. Giao dịch đi qua PancakeSwap theo tỷ giá thị trường thời gian thực cho USD1, AGX, X và token khác; giá theo thị trường, bạn đặt trượt giá cho phép và trả gas mạng.',
          },
          {
            q: 'Ví crypto là gì và lấy thế nào?',
            a: 'Ví crypto là phần mềm xem và quản lý tài sản số. Tài sản ghi trên blockchain, không nằm trong ví. Ví không lưu ký để bạn toàn quyền khóa riêng — chỉ bạn ký giao dịch. Khác ví lưu ký, không bên thứ ba giữ khóa — nhưng mất khóa riêng hoặc cụm từ khôi phục là mất quyền truy cập vĩnh viễn. Ví không lưu ký có thể là app di động hoặc thiết bị phần cứng; phổ biến gồm MetaMask và TokenPocket.',
          },
          {
            q: 'Phí giao dịch blockchain là gì?',
            a: 'Mỗi giao dịch on-chain — mua, bán, đổi hoặc chuyển tài sản số — đều cần phí gas. Phí không do ứng dụng AEGIS X kiểm soát hay thu, mà theo nhu cầu mạng và tài nguyên tính toán. Trên blockchain BSC, gas trả bằng BNB. Trước khi giao dịch trên giao thức AEGIS X, hãy luôn giữ BNB trong ví.',
          },
          {
            q: 'Ví crypto hoạt động thế nào?',
            a: 'Ví crypto dùng cặp khóa — khóa công khai và khóa riêng — để bảo vệ và quản lý tài sản. Khi tạo ví không lưu ký, phần mềm sinh cụm từ khôi phục (12, 18 hoặc 24 từ ngẫu nhiên) để khôi phục khóa. Hãy giữ an toàn, không tiết lộ. Khóa riêng là chuỗi duy nhất cho toàn quyền kiểm soát ví, dùng để ký và ủy quyền giao dịch, phải luôn bí mật. Khóa công khai suy ra từ khóa riêng, có thể chia sẻ công khai để tạo địa chỉ ví và nhận chuyển khoản.',
          },
        ],
      },
    },
    flash: {
      title: 'Đổi nhanh',
      intros: {
        gagx: 'Đổi gAGX sang AGX — không phí, không trượt giá',
        gagxWrap: 'Bọc AGX thành gAGX — không phí, không trượt giá',
        usdt: 'Đổi USDT sang USD1 — không phí, không trượt giá',
      },
      providerName: 'AEGIS X',
      openProvider: 'Xem hợp đồng Flash trên BscScan',
      settlementValue: 'On-chain · vài giây',
      aboutTitle: 'Giới thiệu',
      action: 'Đổi nhanh',
      success: 'Flash thành công',
      pairAriaLabel: 'Cặp Flash',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'Flash đã tạm dừng, vui lòng thử lại sau.',
        belowMin: 'Thấp hơn hạn mức đổi tối thiểu mỗi lần.',
        aboveMax: 'Vượt hạn mức đổi tối đa mỗi lần.',
        insufficientReserve: 'Dự trữ USD1 không đủ, vui lòng thử lại sau.',
        zeroRate: 'Tỷ giá đổi chưa sẵn sàng, vui lòng thử lại sau.',
        insufficientOutput: 'Báo giá đã thay đổi, vui lòng thử lại.',
        transferMismatch: 'Số lượng chuyển token không khớp, vui lòng thử lại.',
        zeroAddress: 'Địa chỉ hợp đồng bất thường, vui lòng thử lại sau.',
        sameToken: 'Cấu hình token vào/ra bất thường, vui lòng thử lại sau.',
        zeroAmount: 'Nhập số đốt lớn hơn 0.',
        notAuthorized: 'Thao tác hiện tại chưa được ủy quyền.',
        invalidLimits: 'Cấu hình hạn mức đổi bất thường, vui lòng thử lại sau.',
      },
      faq: {
        items: [
          {
            q: 'gAGX là gì?',
            a: 'gAGX là chứng từ tất toán thống nhất cho thưởng Rebase và DAO: lợi nhuận Rebase từ staking AGX hoặc trái phiếu, cùng các thưởng DAO, đều phát dưới dạng gAGX.',
          },
          {
            q: 'Tỷ lệ đổi gAGX và AGX là bao nhiêu?',
            a: 'Cố định 1:1 bất cứ lúc nào — không phí, không trượt giá, về tài khoản on-chain ngay.',
          },
          {
            q: 'Vì sao Flash không phí và không trượt giá?',
            a: 'Flash là chuộc cố định 1:1 gAGX↔AGX ở tầng giao thức, không khớp lệnh trong hồ AMM, nên không trượt giá và không phí đổi; bạn chỉ trả gas mạng on-chain (bằng BNB).',
          },
          {
            q: 'Làm sao nhận gAGX?',
            a: 'Lợi nhuận Rebase từ staking AGX, trái phiếu LP hoặc trái phiếu đốt, cùng các thưởng DAO, đều phát vào tài khoản của bạn dưới dạng gAGX.',
          },
          {
            q: 'gAGX ngoài đổi AGX còn làm gì được?',
            a: 'gAGX có thể stake tham gia đào X để bắt lợi token giá trị hệ sinh thái X. Đổi AGX hoặc đào X — hai đường tự chọn.',
          },
          {
            q: 'Làm sao đổi USDT sang USD1?',
            a: 'Ở đầu trang Flash chuyển sang cặp 「USDT → USD1」, nhập số lượng để đổi 1:1 — không phí, không trượt giá, về tài khoản on-chain ngay.',
          },
          {
            q: 'Có đổi USD1 về USDT được không?',
            a: 'Không. Flash chỉ đổi USDT một chiều thành USD1. USD1 là tài sản tất toán lõi dùng cho giao dịch, mua trái phiếu và mở khóa Turbine.',
          },
          {
            q: 'Xem lịch sử Flash ở đâu?',
            a: 'Flash chạy on-chain và về tài khoản trong vài giây. Xem ví hoặc trình khám khối.',
          },
        ],
      },
    },
    trade: {
      title: 'Giao dịch',
      intro: 'Theo tỷ giá thị trường PancakeSwap thời gian thực · tất toán on-chain vài giây',
      aboutTitle: 'Giới thiệu',
      selectSellToken: 'Chọn token bán',
      selectBuyToken: 'Chọn token mua',
      xBuyDisabledHint: 'X chỉ có thể bán',
      flipDisabledXSellOnly: 'X chỉ có thể bán — không thể đảo sang mua',
      action: 'Giao dịch',
      success: 'Giao dịch thành công',
      priceImpact: 'Tác động giá',
      estimatedGas: 'Ước tính Gas',
      highPriceImpactWarning:
        'Khối lượng giao dịch hiện tại ảnh hưởng giá hồ khá lớn; nên giảm số lượng hoặc tăng độ trượt giá cho phép.',
    },
    burn: {
      title: 'Đốt',
      subtitle: 'Đốt AGX để nhận điểm đóng góp',
      sellLabel: 'Đốt',
      receiveLabel: 'Nhận',
      pointsToken: 'Điểm đóng góp của tôi',
      currentContribution: 'Điểm đóng góp hiện tại',
      burnRate: 'Tỷ lệ đốt',
      destination: 'Đích đốt',
      destinationValue: 'Hố đen {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'Xem hợp đồng đổi đóng góp trên BscScan',
      action: 'Đốt',
      success: 'Đốt thành công',
      aboutTitle: 'Về điểm đóng góp',
      blocked: {
        paused: 'Đốt đã tạm dừng, vui lòng thử lại sau.',
        belowMin: 'Thấp hơn hạn mức đốt tối thiểu mỗi lần.',
        aboveMax: 'Vượt hạn mức đốt tối đa mỗi lần.',
        zeroRate: 'Tỷ lệ đốt chưa sẵn sàng, vui lòng thử lại sau.',
        zeroAmount: 'Nhập số đốt lớn hơn 0.',
      },
      metrics: {
        totalBurnedAgx: 'Tổng AGX đã đốt',
        totalEarnedContribution: 'Tổng điểm đóng góp đã nhận',
        totalConsumedContribution: 'Tổng điểm đóng góp đã tiêu',
      },
      history: {
        title: 'Lịch sử đốt',
        emptyBurn:
          'Chưa có bản ghi đốt; sau khi đốt AGX lấy điểm đóng góp, từng thao tác sẽ hiện ở đây.',
        emptyConsume:
          'Chưa có bản ghi tiêu; sau khi nhận lợi nhuận/phần thưởng tiêu điểm đóng góp, từng bản ghi sẽ hiện ở đây.',
        tabsAriaLabel: 'Phân loại lịch sử đốt',
        tabs: {
          burn: 'Đốt',
          consume: 'Tiêu',
        },
        burnColumns: ['Thời gian', 'Đốt AGX', 'Điểm đóng góp nhận được', 'Hash giao dịch'],
        consumeColumns: [
          'Thời gian',
          'Mục đích',
          'Số lượng nhận',
          'Điểm đóng góp đã tiêu',
          'Hash giao dịch',
        ],
        purpose: {
          stakeYield: 'Lợi nhuận stake',
          lpBondYield: 'Lợi nhuận LP',
          burnBondYield: 'Lợi nhuận đốt',
          lucky: 'May mắn',
          rank: 'Hạng',
          referral: 'Giới thiệu',
          participation: 'Tham gia',
          surpass: 'Vượt đồng cấp',
          lifetime: 'Trọn đời',
          market: 'Trợ cấp market',
        },
      },
      faq: {
        items: [
          {
            q: 'Điểm đóng góp dùng để làm gì?',
            a: 'Nhận lợi nhuận từ staking, trái phiếu và nguồn khác tiêu điểm đóng góp theo {ratio}. Không đủ điểm thì không nhận được.',
          },
          {
            q: 'Vì sao nhận lợi nhuận phải tiêu điểm đóng góp?',
            a: 'Cơ chế gắn nhận thưởng với giảm phát giao thức: mỗi lần nhận tiêu {ratio}; điểm chỉ có từ đốt AGX. Mỗi lần rút lợi nhuận đều tương ứng AGX bị đốt.',
          },
          {
            q: 'Tỷ lệ đốt là bao nhiêu?',
            a: 'Đốt theo tỷ lệ {burnRatio}: mỗi 1 AGX đốt nhận điểm đóng góp tương ứng. AGX đã đốt tách on-chain vào hố đen và LP.',
          },
          {
            q: 'AGX đã đốt đi đâu?',
            a: 'Theo cấu hình tách on-chain, khoảng {burnPct}% vào địa chỉ hố đen đốt vĩnh viễn; khoảng {injectPct}% có thể bơm vào thanh khoản LP.',
          },
          {
            q: 'Điểm đóng góp có thể chuyển hoặc hoàn lại không?',
            a: 'Không. Gắn với tài khoản — không chuyển, không hoàn. Chỉ tiêu khi nhận; hãy đốt theo nhu cầu.',
          },
        ],
      },
    },
    turbine: {
      title: 'Tuabin',
      aboutTitle: 'Về Tuabin',
      segmentAriaLabel: 'Thao tác Turbine',
      segments: {
        unlock: 'Mở khóa',
        claim: 'Nhận',
      },
      unlockLabel: 'Mở khóa',
      unlockable: 'Có thể mở khóa',
      equivalentBuyHint: 'Mở khóa đồng thời thực hiện mua cùng số lượng',
      payUsd1Label: 'Thanh toán USD1',
      buyAgxLabel: 'Mua AGX',
      buyToBoundWallet: 'Mua về ví',
      agxPrice: 'Giá AGX',
      willReceiveAgx: 'AGX sẽ nhận',
      unlockRatio: 'Tỷ lệ mở khóa',
      unlockRatioValue: '1 : 1 mua để mở khóa',
      cooldown: 'Chu kỳ chờ',
      cooldownHoursValue: '{hours} giờ',
      unlockAction: 'Mở khóa',
      unlockSuccess: 'Mở khóa thành công, đã vào chờ',
      claimAction: 'Nhận',
      claimSuccess: 'Nhận thành công',
      claimEmpty: 'Chưa có bản ghi mở khóa',
      claimReady: 'Đã đến hạn, có thể rút',
      claimCoolingUntil: 'Đang chờ · {time}',
      dataTitle: 'Dữ liệu Turbine',
      recordsTitle: 'Bản ghi Turbine',
      recordsEmpty:
        'Chưa có bản ghi Turbine; sau khi nhận thưởng từ hồ giải phóng vào Turbine, từng thao tác sẽ hiện ở đây.',
      mechanismTitle: 'Cơ chế Turbine',
      mechanismIntro:
        'Gắn thanh khoản bán với nhu cầu mua, để mỗi lần mở khóa kèm mua cùng số lượng',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
        },
        {
          title: 'Cơ chế chờ động',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'gAGX chờ mở khóa',
        cooling: 'gAGX đang chờ',
        totalWithdrawn: 'Tổng đã rút',
        pendingUnlockHint: 'Tổng gAGX đã nhận từ hồ giải phóng vào Turbine nhưng chưa mở khóa',
        coolingHint: 'Tổng gAGX đã mua-để-mở-khóa và đang trong thời gian chờ',
        totalWithdrawnHint: 'Tổng gAGX lịch sử đã rút từ Turbine về ví',
      },
      faq: {
        items: [
          {
            q: 'gAGX vào Turbine thế nào?',
            a: 'gAGX nhận từ hồ giải phóng không vào ví, mà tự vào Turbine ở trạng thái khóa (bản ghi hiện 「Vào」). Cần dùng USD1 mua cùng số AGX để 「Mở khóa」, hết chờ mới 「Rút」 về ví.',
          },
          {
            q: 'Vì sao phải mua mới mở khóa?',
            a: 'Mở khóa 1 gAGX cần dùng USD1 mua 1 AGX theo giá hiện tại. Mỗi phần có thể bán đều cặp với một lần mua cùng số lượng.',
          },
          {
            q: 'Mở khóa và rút khác nhau thế nào?',
            a: 'Mở khóa là dùng USD1 mua cùng số AGX, mở khóa gAGX và bắt đầu chờ; rút là sau {cooldownHours} giờ chờ, chuyển gAGX đã mở khóa về ví. Hai bước hiện trong bản ghi Turbine là 「Mở khóa」 và 「Rút」.',
          },
          {
            q: 'Thời gian chờ bao lâu?',
            a: 'Chu kỳ hiện tại là {cooldownHours} giờ, hệ thống tự điều chỉnh theo thị trường. Hết chờ thì rút được khoản gAGX đó.',
          },
          {
            q: 'AGX mua khi mở khóa đi đâu?',
            a: 'AGX mua vào thẳng ví, giống giao dịch thường. gAGX khớp được mở khóa và vào thời gian chờ.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'Về token hệ sinh thái AEGIS X',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Stablecoin tất toán',
          body: 'Stablecoin tất toán lõi giao thức, neo 1:1, đổi không trượt giá; xuyên suốt đăng ký Genesis, staking và thanh toán.',
        },
        {
          key: 'agx',
          title: 'AGX · Tài sản lõi giao thức',
          body: 'AGX là tài sản lõi giao thức AEGIS X, tạo qua cơ chế thế chấp vượt mức 150%, đóng vai trò tăng trưởng giá trị, phân phối lợi nhuận và xây hệ sinh thái.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Chứng từ tất toán lợi nhuận',
          body: 'Chứng từ tất toán thống nhất thưởng Rebase và DAO; đổi 1:1 AGX hoặc stake đào X.',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · Chứng từ staking',
          body: 'Chứng từ sinh lãi khi stake AGX; tự lãi kép, mở khóa trọng số quản trị và danh hiệu cao hơn.',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
        },
        {
          key: 'contribution',
          title: 'Điểm đóng góp · Chứng từ nhận lợi nhuận',
          body: 'Nhận lợi nhuận tiêu điểm đóng góp theo {ratio}. Đốt AGX sẽ nhận điểm đóng góp và tăng giảm phát của giao thức.',
        },
        {
          key: 'turbine',
          title: 'Tuabin · Trung tâm mở khóa hạn ngạch',
          body: 'Phần thưởng nhận từ hàng đợi giải phóng vào hạn ngạch Tuabin. Mua lượng AGX tương đương bằng USD1 bắt đầu im lặng 24–96 giờ; gAGX hết hạn được tuyến qua bộ chia để giải phóng tuyến tính, không vào ví ngay.',
        },
      ],
    },
    tokenContract: 'Xem hợp đồng',
    tokenPrevious: 'Token trước',
    tokenNext: 'Token sau',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: 'Giao dịch',
          items: [
            {
              q: 'Giao dịch và Flash khác nhau thế nào?',
              a: 'Giao dịch đổi USD1, AGX, X… trên PancakeSwap theo tỷ giá thị trường thời gian thực; giá biến động, cần trượt giá cho phép và trả gas. Flash là đổi cố định 1:1 gAGX↔AGX trong giao thức — không phí, không trượt giá.',
            },
            {
              q: 'Trượt giá cho phép là gì? Cách đặt?',
              a: 'Trượt giá là thay đổi giá từ lúc gửi đến khi khớp on-chain. Trượt giá cho phép là độ lệch tối đa bạn chấp nhận: mặc định (hệ thống theo token) hoặc % tùy chỉnh. Vượt mức thì giao dịch thất bại và rollback (vẫn có thể tốn gas); quá thấp dễ fail, quá cao có thể khớp giá kém hơn.',
            },
            {
              q: 'Giao dịch tất toán thế nào? Có phí không?',
              a: 'Giao dịch khớp và tất toán on-chain trên PancakeSwap. Ứng dụng AEGIS X không thu thêm phí đổi, nhưng mỗi giao dịch on-chain cần gas mạng (BSC trả bằng BNB) — hãy giữ đủ BNB trong ví.',
            },
            {
              q: 'Vì sao số thực nhận lệch ước tính?',
              a: 'Số ước tính theo tỷ giá lúc đặt; khi khớp giá có thể đổi vì biến động hoặc lệnh người khác. Số cuối theo khớp on-chain thực, lệch trong trượt giá cho phép bạn đặt.',
            },
            {
              q: 'Có thể giao dịch token nào?',
              a: 'Hỗ trợ đổi giữa token hệ sinh thái AEGIS X (USD1, AGX, X) theo tỷ giá thị trường. Đổi tab phía trên để xem chi tiết từng token.',
            },
            {
              q: 'Xem lịch sử giao dịch ở đâu?',
              a: 'Giao dịch chạy on-chain và về tài khoản trong vài giây. Xác nhận từng giao dịch trong ví hoặc trình khám khối.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'USD1 là gì?',
              a: 'USD1 là tài sản tất toán giá trị lõi hệ sinh thái AEGIS X, được hỗ trợ 100% bằng tài sản dự trữ tương đương gồm tiền mặt, trái phiếu Mỹ ngắn hạn, quỹ thị trường tiền tệ chính phủ…; mỗi tháng xem báo cáo phân bố trên website WLFI.',
            },
            {
              q: 'USD1 đóng vai trò gì trong AEGIS X?',
              a: 'USD1 là tài sản tất toán lõi, nối mạng thanh khoản, kịch bản thanh toán và luân chuyển giá trị hệ sinh thái.',
            },
            {
              q: 'Làm sao lấy USD1?',
              a: 'Dùng mục 「Lấy USD1」 trên trang Đổi theo tỷ giá PancakeSwap; hoặc đổi AGX, X và token hệ sinh thái khác trên trang Giao dịch.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'AGX là gì?',
              a: 'AGX là tài sản lõi giao thức AEGIS X, đúc qua cơ chế thế chấp vượt mức 150%, đóng vai trò tăng trưởng giá trị, phân phối lợi nhuận và xây hệ sinh thái.',
            },
            {
              q: 'AGX tăng trưởng bền vững thế nào?',
              a: 'Qua staking, trái phiếu và Rebase tạo vòng lãi kép dài hạn, kết hợp tạo thị trường think-tank AI và mua lại–đốt.',
            },
            {
              q: 'Làm sao nhận AGX?',
              a: 'Người dùng nhận AGX bằng tham gia hệ sinh thái giao thức, hoặc mua trên thị trường giao dịch được giao thức hỗ trợ.',
            },
            {
              q: 'Giá trị AGX được hỗ trợ từ đâu?',
              a: 'AGX được đúc với thế chấp vượt mức 150%, dựa trên dự trữ think-tank; và tạo vòng giá trị dài hạn qua staking, trái phiếu, lãi kép Rebase và mua lại–đốt.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'gAGX là gì?',
              a: 'gAGX là chứng từ tất toán thưởng giao thức, nối tăng trưởng lợi nhuận với giá trị hệ sinh thái, và có thể tham gia đào hệ sinh thái.',
            },
            {
              q: 'Làm sao nhận gAGX?',
              a: 'Sau khi tham gia phân phối lợi nhuận giao thức, người dùng nhận lượng gAGX tương ứng.',
            },
            {
              q: 'gAGX và AGX khác nhau thế nào?',
              a: 'AGX là tài sản lõi giao thức, chịu tăng trưởng giá trị và phân phối lợi nhuận; gAGX là chứng từ lợi nhuận hệ sinh thái, đổi được AGX, và là cửa vào quan trọng để tham gia đào hệ sinh thái.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'X là gì?',
              a: 'X là token giá trị hệ sinh thái AEGIS X, tổng cố định 210 triệu, mang tăng trưởng và tích tụ giá trị hệ sinh thái.',
            },
            {
              q: 'Làm sao nhận X?',
              a: 'Người dùng nhận thưởng X bằng tham gia đào hệ sinh thái, chia sẻ giá trị tăng trưởng.',
            },
            {
              q: 'Airdrop X giải phóng thế nào?',
              a: 'Giá trị X đến từ tăng trưởng hệ sinh thái, tích tụ giá trị và đồng thuận phát triển dài hạn — là vật mang giá trị hệ sinh thái quan trọng.',
            },
            {
              q: 'Vì sao X luôn giảm phát?',
              a: 'X cố định 210 triệu token, không phát hành thêm, và mỗi lần bán tự đốt 25%. Nhu cầu theo tăng trưởng hệ sinh thái cộng đốt liên tục làm giảm lưu thông theo thời gian.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'Xem chi tiết token và hợp đồng',
  },
  genesis: {
    title: 'Kế hoạch cùng xây dựng',
    intro: 'Tham gia kế hoạch cùng xây dựng X DAO · Giai đoạn {season}  (giảm giá {discount})',
    introEnded: 'Chương trình Cùng xây dựng X DAO đã kết thúc · Cảm ơn mọi người cùng xây dựng',
    shares: 'Phần (1 phần = {min} USD1 · tối đa {max} phần)',
    quota: 'Hạn mức cùng xây dựng giai đoạn này',
    pay: 'Thanh toán',
    receive: 'Sẽ nhận AGX',
    value: 'Giá trị đăng ký',
    xTokenAirdrop: 'Giá trị airdrop X ban đầu dự kiến',
    xTokenAirdropHint:
      'Phần thưởng airdrop yêu cầu tổng tham gia cùng xây dựng theo giai đoạn ≥ {threshold}.',
    join: 'Tham gia cùng xây dựng',
    joinEnded: 'Cùng xây dựng đã kết thúc',
    joinGenesis: 'Tham gia cùng xây dựng Genesis',
    statsTitle: 'Dữ liệu cùng xây dựng giai đoạn {season}',
    startsIn: 'Đếm ngược bắt đầu',
    countdownUnits: { days: 'ngày', hours: 'giờ', minutes: 'phút' },
    endsIn: 'Thời gian còn lại của giai đoạn này',
    referencePrice: 'Giá tham chiếu mở cửa AGX',
    discountLabel: 'Giảm giá',
    discountRatio: 'Tỷ lệ giảm giá giai đoạn này',
    xAirdropRatio: 'Tỷ lệ airdrop X',
    airdropLabel: 'Tỷ lệ airdrop X',
    myContributions: 'Lịch sử cùng xây dựng của tôi',
    totalContributed: 'Cùng xây dựng giai đoạn này',
    cumulativeContributed: 'Tổng cùng xây dựng',
    globalLabel: 'Tổng cùng xây dựng toàn cầu',
    globalBody:
      'Quy tụ các nhà cùng xây dựng cốt lõi toàn cầu, cùng xây dựng mạng lưới sinh thái toàn cầu AEGISX.',
    viewContract: 'Xem hợp đồng',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Làm thế nào để tham gia kế hoạch cùng xây dựng?',
          a: 'Người dùng dùng USD1 tham gia cùng xây dựng, có thể nhận AGX theo mức giảm giá tương ứng từng giai đoạn. {phaseCount} giai đoạn, mức giảm giá lần lượt {discounts}.',
        },
        {
          q: 'Hạn mức cùng xây dựng và yêu cầu tham gia?',
          a: 'Tối thiểu {minUsd}, tham gia theo bội số {shareIncrement} USD1. Hạn mức từng giai đoạn: {phaseQuotas}.',
        },
        {
          q: 'Chu kỳ cùng xây dựng kéo dài bao lâu?',
          a: 'AGX nhận được từ tham gia cùng xây dựng áp dụng chu kỳ giải phóng 540 ngày.',
        },
        {
          q: 'Làm thế nào để nhận phần thưởng airdrop X?',
          a: 'Tài khoản tích lũy tham gia cùng xây dựng đạt {threshold} sẽ đủ điều kiện nhận phần thưởng airdrop X tương ứng giai đoạn. Tỷ lệ airdrop {phaseCount} giai đoạn: {airdropRatios}.',
        },
        {
          q: 'Phần thưởng airdrop X được giải phóng như thế nào?',
          a: 'Phần thưởng airdrop X áp dụng cơ chế giải phóng tuyến tính 12 tháng, mỗi tháng giải phóng khoảng 8,33%; lần giải phóng đầu tiên là ngày thứ 30 sau khi giao thức staking X ra mắt, tự động thực hiện bởi hợp đồng thông minh.',
        },
      ],
    },
    promoTitleTemplate: 'Cùng xây dựng Genesis giai đoạn {season}  giảm giá {discount}',
    promoLive: 'Đang diễn ra — hạn mức có hạn, hết hạn {endDate}',
    promoUpcoming: 'Sắp bắt đầu — hạn mức có hạn, bắt đầu {startDate}',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Đăng ký thành công',
    insufficientUsd1: 'Số dư USD1 không đủ. Vui lòng có đủ USD1 trước khi tham gia đăng ký.',
    insufficientAllowance: 'Ủy quyền USD1 không đủ. Vui lòng nhấn ủy quyền trước.',
    purchaseUnavailable:
      'Hiện không thể tham gia đăng ký. Vui lòng kiểm tra số phần hoặc trạng thái giai đoạn đăng ký.',
    walletNotConnected: 'Ví đã ngắt kết nối. Vui lòng kết nối lại trước khi ký giao dịch.',
    errors: {
      notBound: 'Hãy liên kết người giới thiệu trước khi tham gia.',
      paused: 'Đăng ký đang tạm dừng. Vui lòng thử lại sau.',
      invalidAmount: 'Số tiền phải là bội số của 100 USD.',
      phaseInactive: 'Giai đoạn đăng ký này chưa bắt đầu hoặc đã kết thúc.',
      belowMin: 'Số tiền thấp hơn mức tối thiểu của giai đoạn đăng ký.',
      soldOut: 'Giai đoạn đăng ký này đã bán hết.',
      userLimitExceeded: 'Vượt giới hạn mỗi ví của giai đoạn đăng ký. Hãy giảm số tiền.',
      invalidPhase: 'Giai đoạn đăng ký không hợp lệ.',
      systemConfig: 'Lỗi cấu hình hệ thống. Vui lòng thử lại sau.',
    },
    contributionsSyncPending:
      'Đăng ký on-chain đã xác nhận, lịch sử đang đồng bộ, vui lòng làm mới sau.',
    contributionsEmpty: {
      title: 'Chưa có lịch sử cùng xây dựng',
    },
    contributionsEmptyEnded: {
      title: 'Chưa có lịch sử cùng xây dựng',
      body: 'Chương trình cùng xây dựng đã kết thúc. Tài khoản chưa tham gia không có hồ sơ tại đây.',
    },
    goBindReferrer: 'Gắn người giới thiệu',
    seasonLive: 'Đang diễn ra',
    seasonEnded: 'Đã kết thúc',
    seasonUpcoming: 'Sắp bắt đầu',
  },
  rewards: {
    title: 'Phần thưởng',
    intro: 'Xem số dư các thẻ phần thưởng và lịch sử phát.',
    backToHub: 'Quay lại phần thưởng',
    claim: 'Nhận',
    claimSuccess: 'Nhận thành công',
    restakeSuccess: 'Tái stake thành công',
    claimErrors: {
      zeroAmount: 'Số nhận là 0.',
      invalidSigner: 'Chữ ký không hợp lệ, lấy lại rồi nhận.',
      alreadyUsed: 'Phần thưởng này đã nhận, vui lòng không thao tác lại.',
      expired: 'Chữ ký đã hết hạn, làm mới rồi nhận lại.',
      noOrder: 'Chưa có phần thưởng để nhận.',
      failed: 'Nhận thất bại, vui lòng thử lại sau.',
      confirmSyncFailed:
        'Phần thưởng đã nhận thành công on-chain nhưng đồng bộ thất bại. Làm mới trang, đừng nhận lại.',
    },
    hub: {
      asideTitle: 'Về phần thưởng AEGIS X',
      asideBody:
        'Sáu thẻ phần thưởng gồm bốc thăm may mắn, giới thiệu, tham gia, Cùng xây dựng, trợ cấp phát triển và Cùng xây dựng Genesis.',
      aboutTitle: 'Về phần thưởng AEGIS X',
      balanceLabel: 'Số dư',
      filterAria: 'Lọc phần thưởng',
      hideZero: 'Ẩn tài sản 0',
      hideZeroEmpty: 'Chưa có phần thưởng khác 0',
      balancePlaceholder: '0.00',
      signInForBalance: 'Ký đăng nhập để xem',
      enterClaim: 'Vào nhận',
      sessionHint:
        'Hãy hoàn tất ký đăng nhập ví trước khi nhận. Kết nối ví không bằng đăng nhập nghiệp vụ.',
      stats: {
        totalRewards: 'Tổng phần thưởng',
        tier: 'Hạng Cùng xây dựng',
        tierEmpty: 'Chưa đạt hạng Cùng xây dựng',
        personalHolding: 'Nắm giữ cá nhân',
        totalPerformance: 'Tổng hiệu suất',
        smallAreaPerformance: 'Hiệu suất khu nhỏ',
        contribution: 'Điểm đóng góp của tôi',
        contributionHint: 'Nhận thưởng tiêu điểm đóng góp {ratio}.',
        goBurn: 'Đi đốt',
      },
      mechanismTitle: 'Cơ chế thưởng Cùng xây dựng',
      mechanismBody: 'Thưởng Cùng xây dựng từ tổng lợi nhuận Rebase đội, chia theo tỷ lệ hạng.',
      mechanismFooter:
        'Cơ chế hai nhánh bất kỳ: hai nhánh đạt hạng tương ứng là thăng hạng. A6–A9 cũng có thể thăng bằng một nhánh: một nhánh đạt hạng, tổng thành tích các nhánh còn lại đạt ngưỡng.',
      mechanismToggleAria: 'Đổi điều kiện thăng hạng',
      aboutSlides: {
        lucky: {
          title: 'Thưởng may mắn',
          body: 'Pool thưởng mỗi ngày không dưới $5,000. Một lần tham gia đủ $5,000 là có vé rút thăm; mỗi ngày rút ngẫu nhiên 10 người may mắn chia pool.',
        },
        referral: {
          title: 'Thưởng giới thiệu',
          body: 'Sau khi đối tác giới thiệu trực tiếp tham gia Cùng xây dựng, bạn nhận 10% lợi nhuận Rebase mỗi lần của họ, tất toán on-chain ngay. Cần giữ giá trị vị thế của bạn trên $100.',
        },
        participate: {
          title: 'Thưởng tham gia',
          body: 'Sau khi gắn qua liên kết giới thiệu và tham gia Cùng xây dựng, bạn nhận 10% lợi nhuận Rebase của người mời trên phần tương đương vị thế của bạn, như phần thưởng cho người được giới thiệu.',
        },
        cobuild: {
          title: 'Cùng xây dựng',
          body: 'Lấy từ tổng lợi nhuận Rebase của đội, trả theo tỷ lệ thưởng của hạng Cùng xây dựng (A1 10% đến A13 130%). Hạng càng cao tỷ lệ càng lớn; xem bảng cơ chế bên dưới.',
        },
        grant: {
          title: 'Trợ cấp phát triển',
          body: 'Trợ cấp phát triển hệ sinh thái, nhận qua chữ ký MarketFund.',
        },
        genesis: {
          title: 'Thưởng Cùng xây dựng Genesis',
          body: 'Thưởng giới thiệu trực tiếp, thưởng hạng và quỹ phát triển giai đoạn Genesis; hết cửa sổ tất toán thì không nhận nữa.',
        },
      },
      tierTable: {
        columns: ['Hạng', 'Nắm giữ cá nhân', 'Tài khoản hợp lệ', 'Hiệu suất đội', 'Tỷ lệ thưởng'],
        rows: [
          {
            level: 'A1',
            holding: '$100',
            accounts: '2',
            team: 'Tổng hiệu suất ≥ $6,000',
            rate: '10%',
          },
          {
            level: 'A2',
            holding: '$100',
            accounts: '2',
            team: 'Tổng hiệu suất ≥ $20,000',
            rate: '20%',
          },
          {
            level: 'A3',
            holding: '$100',
            accounts: '2',
            team: 'Tổng hiệu suất ≥ $60,000',
            rate: '30%',
          },
          {
            level: 'A4',
            holding: '$500',
            accounts: '5',
            team: 'Tổng hiệu suất ≥ $180,000',
            rate: '40%',
          },
          {
            level: 'A5',
            holding: '$1,000',
            accounts: '5',
            team: 'Tổng hiệu suất ≥ $550,000',
            rate: '55%',
          },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: 'Hai nhánh đạt A5',
            teamAlt: 'Một nhánh đạt A5, thành tích nhánh còn lại ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: 'Hai nhánh đạt A6',
            teamAlt: 'Một nhánh đạt A6, thành tích nhánh còn lại ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: 'Hai nhánh đạt A7',
            teamAlt: 'Một nhánh đạt A7, thành tích nhánh còn lại ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: 'Hai nhánh đạt A8',
            teamAlt: 'Một nhánh đạt A8, thành tích nhánh còn lại ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: 'Hai nhánh đạt A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: 'Hai nhánh đạt A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: 'Hai nhánh đạt A11',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: 'Hai nhánh đạt A12',
            rate: '130%',
          },
          {
            level: 'Thưởng thành tựu trọn đời',
            holding: '$100,000',
            accounts: '20',
            team: 'Hai nhánh đạt A13',
            rate: '130% + cổ tức toàn cầu 5%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Thưởng may mắn',
        body: 'Bốc thăm may mắn theo khối, phát ngẫu nhiên cho người cùng xây dựng',
        aside: 'Thưởng may mắn dùng Chainlink VRF; trúng thì nhận qua Mixed.',
      },
      referral: {
        title: 'Thưởng giới thiệu',
        body: 'Thưởng khi mời đối tác tham gia Cùng xây dựng',
        aside: 'Direct-referral related rewards; claim via DaoPool Mixed (contribution {ratio}).',
      },
      participate: {
        title: 'Thưởng tham gia',
        body: 'Thưởng từ người giới thiệu',
        aside:
          'Thưởng tham gia từ quan hệ giới thiệu; nhận qua DaoPool Mixed (tiêu điểm đóng góp {ratio}).',
      },
      cobuild: {
        title: 'Cùng xây dựng',
        body: 'Thưởng ưu đãi bền vững qua hợp tác đội và Cùng xây dựng dài hạn',
        aside: 'Thưởng Cùng xây dựng nhận qua DaoPool Mixed, cần điểm đóng góp.',
      },
      grant: {
        title: 'Trợ cấp phát triển',
        body: 'Trợ cấp phát triển hệ sinh thái chuyên biệt',
        aside: 'Trợ cấp phát triển sau duyệt hỗ trợ được nhận qua chữ ký MarketFund, về thẳng ví.',
      },
      genesis: {
        title: 'Thưởng Cùng xây dựng Genesis',
        body: 'Thưởng giới thiệu trực tiếp, thưởng hạng và quỹ phát triển giai đoạn Genesis',
        aside: 'Thưởng Cùng xây dựng Genesis nhận qua chữ ký RewardClaimer.',
        badge: 'Sắp đóng',
      },
    },
    detail: {
      claimable: 'Chờ nhận',
      emptyClaimable: 'Chưa có phần thưởng để nhận.',
      signedAmountHint: 'Số có thể nhận theo gói chữ ký',
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: 'Tỷ lệ nhận và tái stake',
      releasePct: 'Nhận {pct}%',
      restakePct: 'Tái stake {pct}%',
      releasePeriod: 'Chọn chu kỳ giải phóng',
      restakePeriod: 'Chọn chu kỳ tái stake',
      releaseAria: 'Chọn chu kỳ giải phóng',
      restakeAria: 'Chọn chu kỳ tái stake',
      releaseDays: '{days} ngày',
      restakeDays: '{days} ngày',
      daysTax: '{days} ngày · {tax}',
      scheduleJoin: ', ',
      taxRate: 'Thuế {rate}%',
      requiredContributionLabel: 'Điểm đóng góp trừ lần này',
      insufficientContributionDetail: 'Điểm đóng góp không đủ (cần {need}, hiện {have}), ',
      goBurnInline: 'Đi đốt',
      getContributionSuffix: ' để lấy điểm đóng góp.',
      releaseInto: 'Vào hồ giải phóng',
      restakeInto: 'Vào staking đơn token',
      restakeLabel: 'Tái stake',
      tokenGagx: 'gAGX',
      ctaReleaseLine: 'Nhận {amount}',
      ctaRestakeLine: 'Tái stake {amount}',
      requiredContribution: 'Lần này trừ điểm đóng góp {amount}',
      insufficientContribution: 'Điểm đóng góp không đủ, hãy lấy điểm trước.',
      goBurn: 'Lấy điểm đóng góp',
      luckyPaused: 'Hồ thưởng may mắn đã tạm dừng, tạm không nhận được.',
      luckyNotClaimable: 'Hiện không có thưởng may mắn để nhận.',
    },

    lucky: {
      dataTitle: 'Dữ liệu',
      todayPool: 'Hồ thưởng hôm nay',
      countdownHint: 'Quay thưởng sau {time}',
      eligibility: 'Tư cách hôm nay',
      eligibilityYes: 'Đủ điều kiện',
      eligibilityNo: 'Chưa đủ',
      maxStakeHint: 'Mua trong ngày {amount}',
      cumulativeWins: 'Tổng lần trúng',
      winsCount: '{count} lần',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Bốc thăm ngẫu nhiên có thể xác minh Chainlink VRF v2',
      vrfBody:
        'Thưởng may mắn dùng Chainlink VRF v2 (hàm ngẫu nhiên có thể xác minh) kết hợp hợp đồng staking: số ngẫu nhiên do mạng oracle Chainlink sinh on-chain kèm chứng minh mật mã; hợp đồng staking nhận số rồi tự chọn 10 người may mắn từ danh sách trong ngày. Không can thiệp người, kết quả không sửa được; ai cũng xác minh on-chain, không gian lận.',
      verifyTutorial: 'Hướng dẫn xác minh',
      collapseTutorial: 'Thu gọn hướng dẫn',
      vrfGuideStep1:
        'Nhấp hash xác minh trong kết quả hoặc lịch sử để mở giao dịch mở thưởng của vòng đó trên BscScan.',
      vrfGuideStep2:
        'Trong Logs giao dịch, tìm sự kiện callback Chainlink VRF; randomWords là số ngẫu nhiên on-chain của vòng này, kèm chứng minh mật mã nên không thể dự đoán hay giả mạo.',
      vrfGuideStep3:
        'Trên trang Read Contract của hợp đồng staking, gọi verifyDraw với mã vòng trong ngày để tính lại danh sách thắng và đối chiếu với kết quả công bố.',
      resultsTitle: 'Kết quả mở thưởng',
      dateFilterAria: 'Chọn ngày mở thưởng',
      resultsSummary: 'Mở thưởng · {count} người may mắn',
      verifyHash: 'Xác minh hash vòng mở thưởng này',
      meBadge: 'Tôi',
      resultWon: 'Trúng {amount}',
      resultLost: 'Không trúng',
      resultsColumns: ['Hạng', 'Địa chỉ trúng', 'Đặt cọc', 'Tiền thưởng'],
      emptyResults: 'Chưa có kết quả mở thưởng',
      historyTitle: 'Lịch sử bốc thăm',
      historyColumns: ['Ngày', 'Đặt cọc', 'Kết quả bốc thăm', 'Xác minh'],
      emptyHistory: 'Chưa có lịch sử bốc thăm',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Làm sao có tư cách bốc thăm?',
            a: 'Khoản staking hoặc trái phiếu đầu tiên trong ngày ≥ $5,000 tự có tư cách bốc thăm ngày đó, không cần đăng ký thêm. Mỗi địa chỉ tối đa một tư cách/ngày.',
          },
          {
            q: 'Bốc thăm mở thưởng thế nào?',
            a: 'Mỗi ngày 00:00 (UTC) Chainlink VRF v2 sinh số ngẫu nhiên có thể xác minh on-chain; hợp đồng staking tự chọn 10 người may mắn từ danh sách ngày đó chia hồ (hồ thưởng ngày không dưới $5,000). Không can thiệp người.',
          },
          {
            q: 'Làm sao xác minh kết quả công bằng?',
            a: 'Số ngẫu nhiên Chainlink VRF kèm chứng minh mật mã ghi on-chain; ai cũng xác minh: bấm liên kết xác minh cạnh kết quả trúng mỗi ngày để xem giao dịch mở thưởng, và theo 「Hướng dẫn xác minh」tính lại danh sách trong hợp đồng staking. Kết quả không sửa được, không gian lận.',
          },
          {
            q: 'Trúng rồi tiền thưởng phát thế nào?',
            a: 'Tiền thưởng quy ra gAGX theo giá trị lúc mở thưởng, tự tích trên thẻ thưởng may mắn; nhận theo quy tắc thưởng may mắn (tiêu điểm đóng góp {ratio}, qua hồ giải phóng tuyến tính hoặc tái stake).',
          },
          {
            q: 'Vì sao stake $5,000 mà không có tư cách?',
            a: 'Tư cách theo giá thị trường lúc tất toán. Giá AGX biến động; nếu lúc tất toán stake bị ghi dưới $5,000 (vd. $4,999.99) thì ngày đó không có tư cách. Nên chừa dư một chút khi stake.',
          },
          {
            q: 'Staking linh hoạt có được tư cách bốc thăm không?',
            a: 'Không. Staking linh hoạt có hạn mức mỗi người mỗi ngày, nên một lần stake không vượt $5,000 và không đủ điều kiện bốc thăm.',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'Dữ liệu',
      totalRewards: 'Tổng phần thưởng',
      myPosition: 'Vị thế của tôi',
      directCount: 'Chi tiết giới thiệu trực tiếp',
      contribution: 'Điểm đóng góp của tôi',
      contributionHint: 'Nhận thưởng tiêu {ratio}',
      nextPayout: 'Lần phát thưởng tiếp theo',
      recordsTitle: 'Bản ghi thưởng giới thiệu',
      recordsColumns: ['Thời gian', 'Số lượng ước tính', 'Trạng thái', 'Thời gian nhận'],
      emptyRecords: 'Chưa có bản ghi thưởng; sau khi phát sẽ hiện từng mục ở đây.',
      referralsTitle: 'Giới thiệu của tôi ({count})',
      referralsColumns: [
        'Thời gian tham gia',
        'Địa chỉ',
        'Vị thế',
        'Tổng thưởng đóng góp tích lũy',
      ],
      emptyReferrals:
        'Chưa có đối tác giới thiệu trực tiếp. Chia sẻ liên kết mời, họ tham gia sẽ hiện ở đây.',
      hideZeroPosition: 'Ẩn vị thế 0',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Thưởng giới thiệu tính thế nào?',
            a: 'Bạn nhận 10% lợi nhuận Rebase mỗi lần của tài khoản giới thiệu trực tiếp; tất toán on-chain ngay, tích trên thẻ thưởng giới thiệu.',
          },
          {
            q: 'Điều kiện nhận thưởng tham gia là gì?',
            a: 'Giá trị vị thế staking/trái phiếu phải > $100. Đủ điều kiện thì lợi nhuận Rebase của tài khoản giới thiệu trực tiếp được tính thưởng giới thiệu theo tỷ lệ cho bạn.',
          },
          {
            q: 'Vì sao nắm giữ $100 mà không nhận thưởng tham gia?',
            a: 'Giá AGX biến động; lúc tất toán vị thế có thể ghi $99.99 và không còn đủ điều kiện thưởng tham gia. Nên tăng nắm giữ để tránh mất vì biến động giá.',
          },
          {
            q: 'Người tôi giới thiệu nắm giữ nhiều hơn tôi nhiều — tôi còn nhận đủ thưởng giới thiệu không?',
            a: 'Có. Chỉ cần đủ điều kiện thưởng giới thiệu (giá trị vị thế > $100) là nhận đủ 10% lợi nhuận Rebase mỗi lần của tài khoản giới thiệu trực tiếp, không phụ thuộc chênh lệch quy mô vị thế.',
          },
          {
            q: 'Thưởng giới thiệu nhận thế nào?',
            a: 'Ở bảng nhận bên trái chọn tỷ lệ nhận và tái stake: phần nhận vào hồ giải phóng giải phóng tuyến tính theo chu kỳ đã chọn; phần tái stake vào staking đơn token lãi kép. Cả hai tiêu {ratio}.',
          },
          {
            q: 'Số địa chỉ giới thiệu trực tiếp là gì?',
            a: 'Số địa chỉ ví gắn qua liên kết giới thiệu của bạn và hoàn tất tham gia lần đầu. Chỉ tầng giới thiệu trực tiếp (tầng 1) tính vào thưởng giới thiệu.',
          },
          {
            q: 'Đối tác giới thiệu rút hết còn thưởng giới thiệu không?',
            a: 'Thưởng giới thiệu gắn với vị thế đang hoạt động của người được giới thiệu: còn sinh lợi nhuận thì bạn còn nhận; rút hết thì dừng; phần đã nhận không bị ảnh hưởng.',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'Dữ liệu',
      totalRewards: 'Tổng phần thưởng',
      myPosition: 'Vị thế của tôi',
      contribution: 'Điểm đóng góp của tôi',
      contributionHint: 'Nhận thưởng tiêu {ratio}',
      nextPayout: 'Lần phát thưởng tiếp theo',
      recordsTitle: 'Bản ghi thưởng tham gia',
      recordsColumns: ['Thời gian', 'Số lượng ước tính', 'Trạng thái', 'Thời gian nhận'],
      emptyRecords: 'Chưa có bản ghi thưởng; sau khi phát sẽ hiện từng mục ở đây.',
      inviterTitle: 'Người mời của tôi',
      inviterColumns: ['Thời gian gắn', 'Địa chỉ', 'Vị thế', 'Tổng thưởng mang lại'],
      emptyInviter:
        'Chưa có bản ghi gắn người mời. Hoàn tất gắn qua liên kết giới thiệu sẽ hiện ở đây.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Thưởng tham gia đến từ đâu?',
            a: 'Khi gắn qua liên kết người mời và tham gia Cùng xây dựng, với tư cách được giới thiệu bạn nhận thưởng tham gia từ quan hệ đó; tất toán on-chain ngay, tích trên thẻ thưởng tham gia.',
          },
          {
            q: 'Thưởng tham gia tính thế nào?',
            a: 'Bạn nhận 10% lợi nhuận Rebase của người mời trên phần khớp quy mô nắm giữ của bạn. Ví dụ: bạn $10,000, người mời $1,000 — toàn bộ vị thế người mời trong phạm vi khớp, bạn nhận 10% toàn bộ Rebase của họ; nếu bạn $10,000, người mời $20,000 thì chỉ nhận 10% Rebase trên phần $10,000 khớp.',
          },
          {
            q: 'Điều kiện nhận thưởng tham gia là gì?',
            a: 'Bạn cần hoàn tất gắn qua liên kết người mời, và giá trị vị thế staking/trái phiếu > $100.',
          },
          {
            q: 'Vì sao nắm giữ $100 mà không nhận thưởng tham gia?',
            a: 'Giá AGX biến động; lúc tất toán vị thế có thể ghi $99.99 và không còn đủ điều kiện thưởng tham gia. Nên tăng nắm giữ để tránh mất vì biến động giá.',
          },
          {
            q: 'Thưởng tham gia nhận thế nào?',
            a: 'Ở bảng nhận bên trái chọn tỷ lệ nhận và tái stake: phần nhận vào hồ giải phóng theo chu kỳ đã chọn; phần tái stake vào staking đơn token. Cả hai tiêu điểm đóng góp {ratio} (DaoPool Mixed).',
          },
          {
            q: 'Có đổi người mời được không?',
            a: 'Không. Quan hệ giới thiệu ghi on-chain lần gắn đầu và vĩnh viễn, không đổi người mời.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'Dữ liệu',
      totalRewards: 'Tổng phần thưởng',
      totalPerformance: 'Tổng hiệu suất',
      myPosition: 'Vị thế của tôi',
      directCount: 'Chi tiết giới thiệu trực tiếp',
      contribution: 'Điểm đóng góp của tôi',
      contributionHint: 'Nhận thưởng tiêu {ratio}',
      nextPayout: 'Lần phát thưởng tiếp theo',
      tierTitle: 'Hạng Cùng xây dựng',
      tierCurrent: 'Hạng hiện tại',
      tierNext: 'Hạng tiếp theo',
      reqHolding: 'Nắm giữ cá nhân',
      reqHoldingHint: 'Giá trị vị thế staking và trái phiếu',
      reqAccounts: 'Tài khoản hợp lệ',
      reqAccountsHint: 'Số địa chỉ giới thiệu trực tiếp hợp lệ',
      reqPerformance: 'Tổng hiệu suất',
      reqPerformanceHint: 'Tổng giá trị vị thế toàn hệ giới thiệu',
      reqAchieved: 'Đã đạt',
      tierRate: 'Tỷ lệ thưởng {rate}',
      tierProgress: 'Tiến độ lên {level}',
      tierProgressCount: 'Đã đạt {done}/{total}',
      tierMax: 'Đã đạt hạng cao nhất',
      recordsTitle: 'Bản ghi phần thưởng',
      recordsTabsAria: 'Loại bản ghi phần thưởng',
      recordsTabCobuild: 'Cùng xây dựng',
      recordsTabEqualize: 'Thưởng san bằng',
      recordsColumns: ['Thời gian', 'Hạng', 'Số lượng ước tính', 'Trạng thái', 'Thời gian nhận'],
      emptyRecordsCobuild: 'Chưa có bản ghi thưởng; sau khi phát sẽ hiện từng mục ở đây.',
      emptyRecordsEqualize: 'Chưa có bản ghi thưởng san bằng; sau khi phát sẽ hiện ở đây.',
      teamTitle: 'Đội của tôi ({count})',
      teamColumns: ['Thời gian tham gia', 'Địa chỉ', 'Hiệu suất đội', 'Hạng cao nhất của đội'],
      emptyTeam: 'Chưa có thành viên đội. Chia sẻ liên kết mời, họ tham gia sẽ hiện ở đây.',
      hideZeroMarket: 'Ẩn hiệu suất 0',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Thưởng Cùng xây dựng tính thế nào?',
            a: 'Thưởng Cùng xây dựng từ tổng lợi nhuận Rebase đội, tính theo tỷ lệ thưởng hạng của bạn. Hạng càng cao tỷ lệ càng cao (A1 10% đến A13 130%); xem bảng cơ chế trên trang phần thưởng.',
          },
          {
            q: 'Thưởng san bằng là gì?',
            a: 'Khi đội cấp dưới đuổi kịp hoặc vượt hạng bạn, thưởng Cùng xây dựng của đội đó không còn vào chênh hạng của bạn; thưởng san bằng bù: bạn nhận 10% thưởng Cùng xây dựng của cấp dưới đó.',
          },
          {
            q: 'Thưởng san bằng có giới hạn hạng không?',
            a: 'Có. Chỉ phủ đội cấp dưới trong phạm vi vượt bạn tối đa 2 hạng. Ví dụ bạn A2: cấp dưới A3 hoặc A4 thì nhận 10% thưởng Cùng xây dựng của họ; A5 trở lên (vượt quá 2) thì không nhận san bằng từ đội đó. Thăng hạng của bạn để khôi phục phủ.',
          },
          {
            q: 'Hạng Cùng xây dựng thăng thế nào?',
            a: 'A1–A5 thăng theo nắm giữ cá nhân, tài khoản hợp lệ và tổng hiệu suất đội; từ A6 qua cơ chế hai nhánh (hai nhánh bất kỳ đạt hạng); A6–A9 cũng có đường một nhánh (một nhánh đạt + tổng hiệu suất các nhánh khác đạt).',
          },
          {
            q: 'Hiệu suất đội thống kê thế nào?',
            a: 'Hiệu suất đội là tổng giá trị vị thế staking/trái phiếu toàn hệ giới thiệu (mọi nhánh), theo giá thị trường lúc tất toán.',
          },
          {
            q: 'Thưởng Cùng xây dựng và san bằng nhận thế nào?',
            a: 'Ở đầu bảng nhận bên trái chuyển Cùng xây dựng / San bằng, rồi chọn tỷ lệ. Cùng cơ chế giải phóng/tái stake và tiêu {ratio}.',
          },
          {
            q: 'Đổi hạng thì tỷ lệ thưởng có hiệu lực khi nào?',
            a: 'Hạng đánh giá lại mỗi ngày tất toán; lần phát thưởng Cùng xây dựng tiếp theo dùng tỷ lệ mới; phạm vi thưởng san bằng cũng cập nhật theo hạng mới.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: 'Chờ duyệt',
      pendingHint: 'Sau duyệt chuyển sang chờ nhận',
      pendingBody: 'Liên hệ hỗ trợ để mở khóa trợ cấp; chỉ nhận sau khi duyệt.',
      contactSupport: 'Liên hệ hỗ trợ xin mở khóa',
      claimIntoWallet: 'Về ví',
      ctaToWallet: 'Nhận {amount} về ví',
      dataTitle: 'Dữ liệu',
      tier: 'Hạng Cùng xây dựng',
      totalClaimed: 'Tổng phần thưởng đã nhận',
      recordsTitle: 'Bản ghi trợ cấp',
      recordsTabsAria: 'Loại bản ghi trợ cấp',
      recordsTabIssue: 'Phát',
      recordsTabClaim: 'Nhận',
      issueColumns: [
        'Thời gian phát',
        'Số lượng ước tính',
        'Loại',
        'Mã hash',
        'Tỷ lệ trợ cấp',
        'Số lượng trợ cấp',
      ],
      claimColumns: ['Thời gian nhận', 'Số lượng ước tính', 'Mã hash'],
      emptyIssue: 'Chưa có bản ghi phát; trợ cấp tích lũy sẽ hiện ở đây.',
      emptyClaim: 'Chưa có bản ghi nhận; sau khi nhận sẽ hiện ở đây.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Trợ cấp phát triển là gì?',
            a: 'Trợ cấp phát triển là ngân sách chuyên để hỗ trợ người cùng xây dựng mở thị trường — quảng bá, sự kiện cộng đồng, kênh…; tích theo tỷ lệ vị thế staking của đội bạn.',
          },
          {
            q: 'Trợ cấp phát triển dùng làm gì?',
            a: 'Chỉ dùng phát triển thị trường: salon/roadshow offline, vận hành cộng đồng và tài liệu quảng bá, mở rộng kênh. Hãy dùng theo nhu cầu thực của hệ sinh thái.',
          },
          {
            q: 'Dùng trợ cấp phát triển thế nào?',
            a: 'Hai cách: xin trước — liên hệ hỗ trợ nộp kế hoạch và ngân sách; sau duyệt hạn mức vào chờ nhận. Hoặc hoàn sau — tự tạm ứng, nộp chứng từ (hóa đơn, ảnh hiện trường, chi tiết chi…) để xin hoàn; sau duyệt là nhận được.',
          },
          {
            q: 'Vì sao trợ cấp hiện chờ duyệt?',
            a: 'Trợ cấp tích lũy mặc định chờ duyệt; cần nộp đơn mục đích hoặc chứng từ hoàn, hỗ trợ duyệt rồi mới vào chờ nhận. Tiến độ xem trong bản ghi trợ cấp.',
          },
          {
            q: 'Nhận trợ cấp có tiêu điểm đóng góp không?',
            a: 'Không. Khác phần thưởng khác: trợ cấp phát triển không tiêu điểm đóng góp, cũng không qua hồ giải phóng — gAGX vào thẳng ví.',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: 'Phần thưởng Cùng xây dựng',
      pageSubtitle: 'Tham gia Cùng xây dựng · chia sẻ giá trị tăng trưởng',
      claimToWallet: 'Nhận về ví',
      tierColumns: ['Hạng', 'Đăng ký cá nhân', 'Hiệu suất hệ thống', 'Tỷ lệ thưởng'],
      recordsTabsAria: 'Loại bản ghi thưởng Genesis',
      recordsColumns: ['Thời gian', 'Loại', 'Số lượng ước tính', 'Trạng thái'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Thưởng giới thiệu tính thế nào?',
            a: 'Thưởng giới thiệu 3%, tất toán nén theo số tiền khớp — chỉ tính phần số tiền bằng nhau; tài khoản trống không tính tầng thưởng; thưởng tự tất toán.',
          },
          {
            q: 'Hạng Genesis thăng thế nào?',
            a: 'Hạng Genesis từ S1 đến S10, đánh giá theo số Cùng xây dựng cá nhân và tổng hiệu suất hệ thống; hạng cao cần điều kiện thăng hai khu.',
          },
          {
            q: 'Thưởng nâng hạng là gì?',
            a: 'Hạng Genesis đạt trong thời gian Cùng xây dựng tự nâng 1 hạng sau khi giao thức lên, hiệu lực 30 ngày, rồi trở về hạng thật.',
          },
          {
            q: 'Thưởng đội Genesis tất toán thế nào?',
            a: 'Thưởng đội Genesis tự tất toán theo tỷ lệ hạng tương ứng; bạn phải nhận về ví. Kết thúc kỳ Cùng xây dựng, trang này đóng; thưởng chưa nhận không nhận được nữa, chuyển vào hợp đồng làm thị trường thông minh.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Thưởng phát dưới dạng gì?',
          a: 'Mọi thưởng tất toán bằng gAGX vào thẻ tương ứng. Kiểm tra trang phần thưởng bất cứ lúc nào.',
        },
        {
          q: 'Nhận thưởng cần điều kiện gì?',
          a: 'Nhận thưởng tiêu {ratio}. Thiếu điểm thì lấy trên trang Đốt.',
        },
        {
          q: 'Thưởng đã nhận về khi nào?',
          a: 'Chọn chu kỳ giải phóng; chu kỳ càng dài thuế càng thấp. Hoặc tái stake một phần/toàn bộ vào staking đơn token.',
        },
        {
          q: 'Thưởng tất toán khi nào?',
          a: 'Thưởng may mắn tất toán mỗi ngày 00:00 UTC. Các thưởng khác theo Rebase, khoảng mỗi {hours} giờ. Lần tiếp theo xem trên bảng dữ liệu từng trang chi tiết.',
        },
        {
          q: 'Vì sao một số thẻ thưởng không hiện số?',
          a: 'Cài đặt góc phải trên mặc định 「Ẩn tài sản 0」. Bỏ chọn để xem mọi thẻ.',
        },
      ],
    },

    teamRewardRate: 'Thưởng nhóm {rate}',
    superCommunityBadge: 'Siêu hệ thống',
    heroTierRewardBody: 'Nhận {bonus} từ khối lượng đồng xây dựng của nhóm làm phần thưởng.',
    superCommunityBenefitBody: 'Siêu hệ thống nhận quỹ phát triển chuyên dụng và quyền quản trị.',
    shareholderNoRankTitle: 'Bạn chưa trở thành Thống đốc Dự trữ Sáng lập',
    shareholderNoRankBody:
      'Trở thành Thống đốc Dự trữ Sáng lập để nhận 1%-10% khối lượng đồng xây dựng của đội làm phần thưởng và nâng 1 cấp trong 30 ngày sau khi AEGIS X ra mắt.',
    shareholderTitleForRank: '{rank} · Thống đốc Dự trữ Sáng lập',
    heroKicker: 'Cấp sáng lập',
    currentTierSuffix: 'Hiện tại',
    progressPersonalTo: 'Còn cách {rank} · Đăng ký cá nhân',
    progressMaxPersonal: 'Đã đạt cấp cá nhân cao nhất',
    progressMaxTeam: 'Đã đạt cấp nhóm cao nhất',
    teamLegRequirement: 'Hai nhánh {rank}',
    tierDualLegRequirement: '2 nhánh {rank}',
    teamQualifiedPartitionsLabel: 'Nhánh {rank} {count}/2',
    teamVolume: 'Doanh số hệ thống',
    referralRewards: 'Phần thưởng giới thiệu trực tiếp',
    autoPaidLabel: 'Tự động thanh toán',
    autoPaid: 'Phần thưởng tự động thanh toán vào ví',
    teamRewards: 'Phần thưởng cấp',
    heroTitle: 'Cấp hiện tại',
    allTiers: 'Hệ thống danh dự sáng lập',
    history: 'Lịch sử phần thưởng',
    referralHistoryEmpty: {
      title: 'Chưa có lịch sử phần thưởng giới thiệu',
      body: 'Phần thưởng giới thiệu sẽ hiển thị tại đây sau khi người được giới thiệu hoàn tất đăng ký trong thời gian Genesis.',
    },
    teamHistoryEmpty: {
      title: 'Chưa có lịch sử phần thưởng nhóm',
      body: 'Lịch sử quyết toán và nhận phần thưởng nhóm sẽ hiển thị tại đây khi phần thưởng phát sinh.',
    },
    communityFund: 'Quỹ phát triển',
    communityFundLocked: 'Chưa mở khóa: {amount}',
    communityFundHistory: 'Quỹ phát triển',
    communityFundHistoryEmpty: {
      title: 'Chưa có lịch sử quỹ phát triển',
      body: 'Lịch sử nhận quỹ phát triển sẽ hiển thị tại đây khi phần thưởng phát sinh.',
    },
    rewardType: {
      referralPaid: 'Phần thưởng giới thiệu',
      referralWithdrawn: 'Nhận phần thưởng giới thiệu',
      marketTeam: 'Phần thưởng nhóm market maker',
      presaleTeam: 'Phần thưởng nhóm presale',
      unknown: '—',
    },
    logStatus: {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      paid: 'Đã thanh toán',
      claimed: 'Đã nhận',
      failed: 'Thất bại',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'Bạn đã liên kết người giới thiệu rồi.',
      parentNotBound: 'Người giới thiệu chưa liên kết. Hãy liên hệ họ.',
      selfReferral: 'Không thể dùng địa chỉ của chính bạn.',
      invalidParent: 'Vui lòng nhập địa chỉ người giới thiệu hợp lệ.',
      migratedAccount: 'Địa chỉ này đã được chuyển. Hãy dùng địa chỉ mới.',
      systemConfig: 'Lỗi cấu hình hệ thống. Vui lòng thử lại sau.',
      failed: 'Liên kết thất bại. Vui lòng thử lại sau.',
    },
    title: 'Cộng đồng',
    intro:
      'Mời đối tác tham gia cùng xây dựng, chia sẻ giá trị tăng trưởng hệ sinh thái và phần thưởng sáng lập.',
    disconnectedIntro: 'Kết nối ví để tạo liên kết giới thiệu và liên kết người mời.',
    referralLink: 'Liên kết mời của tôi',
    shareReferral: 'Sao chép liên kết',
    referrer: 'Người mời của tôi',
    bindReferrer: 'Liên kết',
    referrerPlaceholder: 'Nhập địa chỉ người giới thiệu (0x…)',
    referrerHint: 'Quan hệ mời kích hoạt sẽ có hiệu lực vĩnh viễn, không thể thay đổi.',
    docs: 'Tài liệu',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Tham gia cùng xây dựng',
    myCommunity: 'Cộng đồng của tôi',
    directReferrals: 'Số giới thiệu trực tiếp',
    myTeam: 'Số thành viên cộng đồng',
    genesisTitle: 'Hiện tại',
    cobuildLevel: 'Hạng Cùng xây dựng',
    inviteTitle: 'Bắt đầu mời · Chia sẻ giá trị tăng trưởng hệ sinh thái',
    programs: {
      title: 'Kế hoạch hỗ trợ hệ sinh thái',
      items: [
        {
          label: 'Cùng xây dựng Sáng lập · Giai đoạn {season}',
          title: 'Chương trình Thống đốc Dự trữ Sáng lập',
          body: 'Mở ghế cùng xây dựng toàn cầu đầu tiên',
          action: 'Xem chi tiết kế hoạch',
          href: 'https://xdaoaegis.notion.site/ch-ng-tr-nh-h-i-ng-d-tr-genesis-',
        },
        {
          label: 'Học viện X',
          title: 'Học viện DeFi toàn cầu · Học viện lãnh đạo toàn cầu thời đại kinh tế số',
          body: 'Đào tạo lãnh đạo cho thời đại · Dự trữ nhân tài cho tương lai',
          action: 'Xem chi tiết kế hoạch',
          href: 'https://xdaoaegis.notion.site/h-c-vi-n-x-vn',
        },
      ],
    },
    myInvites: 'Thành viên cộng đồng của tôi ({count})',
    referralBondPermanent: 'Quan hệ giới thiệu đã kích hoạt · Liên kết vĩnh viễn.',
    volumePrefix: 'Doanh số',
    statToday: 'Hôm nay +{count} · +{amount}',
    statRewardRate: 'Tỷ lệ thưởng {rate}',
    bindReferrerSuccess: 'Liên kết người giới thiệu thành công',
    inviteFlow: {
      rewardLink: 'Phần thưởng',
      items: [
        {
          title: 'Chia sẻ liên kết mời',
          body: 'Kết nối ví và điền người mời của bạn để tạo liên kết mời riêng.',
        },
        {
          title: 'Đối tác tham gia cùng xây dựng',
          body: 'Đối tác đăng ký qua liên kết mời của bạn có thể tham gia cùng xây dựng.',
        },
        {
          title: 'Nhận phần thưởng',
          body: 'Sau khi đối tác cùng xây dựng, phần thưởng được quyết toán theo phân phối rebase. Vào {link} để nhận.',
        },
      ],
    },
    invitesEmpty: {
      title: 'Chưa có lịch sử mời',
      body: 'Chia sẻ liên kết giới thiệu, mời bạn bè tham gia cộng đồng của bạn.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Quan hệ giới thiệu được thiết lập như thế nào?',
          a: 'Sau khi đối tác tham gia cùng xây dựng qua liên kết mời của bạn, quan hệ giới thiệu tự động thiết lập và có hiệu lực vĩnh viễn.',
        },
        {
          q: 'Tôi có thể đổi người mời không?',
          a: 'Sau khi ràng buộc, quan hệ mời không thể thay đổi.',
        },
        {
          q: 'Làm sao nâng cấp cùng xây dựng?',
          a: 'Theo nắm giữ cá nhân và thành tích đội, thăng từ A1 đến A13.',
        },
        {
          q: 'Làm sao đủ điều kiện trợ cấp phát triển hệ thống?',
          a: 'Khi thành tích tích lũy hệ thống đạt $1,000,000, bạn nhận quỹ phát triển 5%. Nhờ người mời hỗ trợ đăng ký.',
        },
      ],
    },
  },
  assets: {
    title: 'Tài sản',
    intro: 'Quản lý quỹ hệ sinh thái AEGIS X của bạn',
    body: 'Quản lý quỹ hệ sinh thái AEGIS X của bạn',
    backToHub: 'Quay lại Tài sản',
    blocked: {
      zeroAmount: 'Nhập số lượng hợp lệ',
      insufficientReward: 'Lợi nhuận có thể nhận không đủ',
      insufficientContribution: 'Đóng góp không đủ, hãy đổi điểm đóng góp trước',
      planUnresolved: 'Kế hoạch giải phóng/tái stake chưa sẵn sàng, thử lại sau',
      nothingToRedeem: 'Hiện không có hạn mức chuộc',
      warmupActive: 'Chưa hết warmup, tạm không thao tác',
      warmupNotEnded: 'Đếm ngược warmup chưa kết thúc',
      noWarmup: 'Hiện không có vị thế warmup chờ kích hoạt',
      unavailable: 'Giao dịch tạm không khả dụng, thử lại sau',
    },
    position: {
      sort: 'Sắp xếp',
      quoteCurrency: 'Đơn vị định giá',
      sortOptions: {
        startNear: 'Theo thời gian bắt đầu gần → xa',
        startFar: 'Theo thời gian bắt đầu xa → gần',
        endNear: 'Theo thời gian đáo hạn gần → xa',
        endFar: 'Theo thời gian đáo hạn xa → gần',
      },
      emptyTitle: 'Để tài sản bắt đầu sinh lợi nhuận',
      pageSize: 5,
      voucher: 'Chứng từ',
      remaining: 'Thời gian còn lại',
      staked: 'Số staking',
      payout: 'Chờ chuộc',
      bondPrincipal: 'Gốc trái phiếu',
      yield: 'Lợi nhuận',
      claim: 'Nhận',
      redeem: 'Chuộc',
      unstake: 'Gỡ stake',
      liquid: 'Linh hoạt',
      lockedPrefix: 'Khóa',
      redeemAnytime: 'Chuộc bất cứ lúc nào',
      fullyReleased: 'Đã mở khóa hoàn toàn',
      activateWarmup: 'Mở khóa',
      activateWarmupSuccess: 'Đã mở khóa',
      warmupRemainingEpochs: 'Còn {n} Epoch',
    },
    opsColumns: ['Thời gian', 'Thao tác', 'Số lượng ước tính', 'Hash giao dịch'],
    claim: {
      title: 'Nhận lợi nhuận',
      amount: 'Số nhận',
      splitAria: 'Tỷ lệ giải phóng và tái stake',
      releaseShare: 'Nhận {pct}%',
      restakeShare: 'Tái stake {pct}%',
      releasePeriod: 'Chọn chu kỳ giải phóng',
      releasePeriodAria: 'Chọn chu kỳ giải phóng',
      restakePeriod: 'Chọn chu kỳ tái stake',
      restakePeriodAria: 'Chọn chu kỳ tái stake',
      releaseDays: '{days} ngày',
      restakeDays: '{days} ngày',
      restakeDaysTax: '{days} ngày · {tax}',
      taxRate: 'thuế {rate}%',
      contribNeed: 'Lần nhận này trừ đóng góp {amount}',
      contribShort: 'Đóng góp không đủ, hãy đốt để đổi điểm đóng góp',
      goBurn: 'Đi đốt để đổi',
      ctaMixed: 'Nhận & tái stake',
      ctaRelease: 'Nhận',
      ctaRestake: 'Tái stake',
      success: 'Đã gửi nhận',
      restakeSuccess: 'Đã gửi tái stake',
      xmineSuccess: 'Đã gửi nhận thưởng X',
    },
    claimOutput: {
      title: 'Nhận sản lượng',
      rewardLabel: 'Lợi nhuận',
      boostLabel: 'Thưởng thêm',
      claimReward: 'Nhận lợi nhuận',
      claimBoost: 'Nhận thưởng thêm',
      contribDeduct: 'Khấu trừ đóng góp {amount}',
    },
    redeem: {
      releasedLabel: 'Đã giải phóng',
      title: 'Chuộc stake',
      body: 'Sau khi chuộc, tài sản vào bộ đệm và giải phóng tuyến tính trong {days} ngày. Tài sản trong bộ đệm không sinh lợi nhuận',
      confirmCta: 'Chuộc',
      success: 'Đã gửi chuộc, gốc vào bộ đệm giải phóng',
    },
    hub: {
      filterAria: 'Lọc tài sản',
      hideZero: 'Ẩn tài sản 0',
      hideZeroEmpty: 'Chưa có vị thế khác 0',
      card: {
        position: 'Vị thế',
        yield: 'Tổng lợi nhuận',
      },
      modes: {
        stake: {
          title: 'Đặt cọc',
          body: 'Quản lý vị thế AGX linh hoạt / kỳ hạn',
          aprHint:
            'Tỷ lệ của lợi nhuận staking đã nhận cộng lợi nhuận staking chưa nhận và lợi nhuận cộng thêm',
        },
        lpbond: {
          title: 'Trái phiếu LP',
          body: 'Quản lý vị thế trái phiếu thanh khoản',
          aprHint:
            'Tỷ lệ của lợi nhuận trái phiếu LP đã nhận cộng lợi nhuận trái phiếu LP chưa nhận',
        },
        burnbond: {
          title: 'Trái phiếu đốt',
          body: 'Quản lý vị thế trái phiếu đốt',
          aprHint:
            'Tỷ lệ của lợi nhuận trái phiếu đốt đã nhận cộng lợi nhuận trái phiếu đốt chưa nhận',
        },
        xmine: {
          title: 'Đào X',
          body: 'Quản lý vị thế đào gAGX',
          aprHint: 'Tỷ lệ của sản lượng đào đã nhận cộng sản lượng đào chưa nhận',
        },
      },
      overview: {
        title: 'Tổng quan tài sản',
        totalValue: 'Tổng giá trị tài sản',
        totalValueHint:
          'Định giá theo giá thị trường hiện tại · gồm gốc vị thế và lợi nhuận chưa rút',
        claimable: 'Lợi nhuận chờ nhận',
        claimed: 'Tổng đã nhận',
        contribution: 'Điểm đóng góp của tôi',
        contributionHint: 'Nhận lợi nhuận tiêu đóng góp {ratio}',
        holdingsTitle: 'Nắm giữ',
        holdingsReleased: 'Đã giải phóng',
        holdingsTotal: 'Tổng nắm giữ',
        bufferTitle: 'Hồ đệm',
        bufferHint:
          'Sau khi gỡ stake, gốc vào hồ đệm và giải phóng tuyến tính lần hai trong {days} ngày, giảm áp lực dòng ra tập trung ngắn hạn lên thanh khoản và cân bằng nhịp giải phóng với ổn định thị trường.',
        bufferTotal: 'Total',
        bufferReleased: 'Đã giải phóng',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'Đổi hiển thị tài sản hồ đệm',
      },
      distribution: {
        title: 'Phân bố nắm giữ',
        empty: 'Chưa có nắm giữ; staking hoặc mua trái phiếu sẽ hiện phân bố ở đây.',
      },
      rebase: {
        title: 'Cơ chế giải phóng lợi nhuận Rebase',
        subtitle:
          'Qua tất toán theo giai đoạn và giải phóng liên tục, giảm biến động thị trường, tăng ổn định tăng trưởng dài hạn',
        steps: [
          { title: 'Block', body: 'Khối chạy\\nĐơn vị cơ sở' },
          { title: 'Epoch', body: 'Khoảng {blocks} khối\\nKhoảng {hours} giờ' },
          { title: 'Rebase', body: 'Hết Epoch\\nTự tất toán' },
          { title: 'Rebase', body: 'Phân phối lợi nhuận\\n{timesPerDay} lần/ngày' },
        ],
        tags: [
          'Chạy theo khối',
          'Tất toán theo Epoch',
          'Phân phối theo Rebase',
          'Giải phóng lợi nhuận mượt',
        ],
        footer: 'Khối dẫn chu kỳ, Epoch tất toán, Rebase phân phối lợi nhuận',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Tổng giá trị tài sản tính thế nào?',
            a: 'Tổng = gốc + lợi nhuận chưa nhận + sản lượng đào, định giá theo giá thị trường hiện tại. Số dư ví nhàn rỗi không tính.',
          },
          {
            q: 'Lợi nhuận phát dưới dạng gì?',
            a: 'Rebase của staking, trái phiếu LP và trái phiếu đốt tất toán bằng gAGX (đổi 1:1 AGX hoặc đào X). Sản lượng đào X là token X, nhận bất cứ lúc nào.',
          },
          {
            q: 'Vì sao không nhận được lợi nhuận?',
            a: 'Nhận cần điểm đóng góp. Hãy mua và đốt AGX trước. Cơ chế này đảm bảo mỗi lần rút lợi nhuận cũng giảm phát giao thức.',
          },
          {
            q: 'Làm sao nhận đóng góp?',
            a: 'Mua và đốt AGX. Nhận tiêu {ratio}; hãy chuẩn bị đủ.',
          },
          {
            q: 'Vì sao nhận lợi nhuận phải chọn chu kỳ giải phóng?',
            a: 'Không về ngay; giải phóng tuyến tính; chu kỳ càng dài thuế càng thấp: {taxSchedule}.',
          },
          {
            q: 'Lợi nhuận sau nhận đi đâu?',
            a: 'Vào hồ giải phóng; theo dõi tại đó; phần đã giải phóng rút về ví.',
          },
          {
            q: 'Tái stake và nhận khác nhau thế nào?',
            a: 'Tái stake bỏ qua giải phóng, thuế tốt hơn ({restakeTax}), lãi kép trong staking đơn token. Nhận linh hoạt hơn.',
          },
          {
            q: 'Hồ đệm là gì?',
            a: 'Sau gỡ stake, gốc vào bộ đệm giải phóng tuyến tính lần hai {days} ngày. Phần 「đã giải phóng」 trong bộ đệm chuộc về ví bất cứ lúc nào.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Vị thế staking',
        intro: 'Quản lý từng khoản staking, nhận lợi nhuận hoặc chuộc gốc bất cứ lúc nào',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'Dữ liệu vị thế',
          metrics: [
            { label: 'Nắm giữ của tôi' },
            { label: 'Đã giải phóng' },
            { label: 'Chờ giải phóng' },
            {
              label: 'Tỷ suất Rebase hiện tại',
              hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
            },
            {
              label: 'Cộng Rebase hiện tại',
              hint: 'Thưởng Rebase chưa nhận không sinh lãi kép',
            },
            {
              label: 'Tổng lợi nhuận staking',
              hint: 'Tổng lợi nhuận stake đã nhận và chưa nhận',
            },
          ],
        },
        ops: {
          title: 'Lịch sử thao tác',
          empty: 'Chưa có lịch sử thao tác; staking, nhận hoặc chuộc sẽ hiện từng thao tác ở đây.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Nhận và chuộc khác nhau thế nào?',
              a: 'Nhận cho lợi nhuận (chu kỳ giải phóng hoặc tái stake). Chuộc cho gốc AGX đã giải phóng → bộ đệm {days} ngày rồi về ví.',
            },
            {
              q: 'Vì sao mỗi khoản staking hiện riêng?',
              a: 'Mỗi khoản staking độc lập chu kỳ, lợi nhuận, cộng và giải phóng — hiện và thao tác riêng.',
            },
            {
              q: '「Đã giải phóng」nghĩa là gì?',
              a: '「Đã giải phóng」là gốc đã mở khóa tuyến tính theo khối (khoảng 3 giây một khối), có thể chuộc bất cứ lúc nào.',
            },
            {
              q: 'Hết đếm ngược thì sao?',
              a: 'Hết đếm ngược nghĩa là gốc giải phóng hết, chuộc bất cứ lúc nào. Gốc chưa nhận vẫn sinh lợi nhuận. Sau khi chuộc gốc, lợi nhuận chưa nhận vẫn lãi kép.',
            },
            {
              q: 'Tỷ lệ tái stake khi nhận dùng thế nào?',
              a: 'Thanh trượt chia tái stake và nhận. Tái stake lãi kép trong chu kỳ stake đã chọn (thuế tốt hơn). Nhận giải phóng theo chu kỳ đã chọn.',
            },
          ],
        },
      },
      lpbond: {
        title: 'Vị thế trái phiếu LP',
        intro: 'Quản lý từng trái phiếu, nhận lợi nhuận hoặc chuộc gốc bất cứ lúc nào',
        empty: 'Chưa có vị thế trái phiếu LP; mua một trái phiếu sẽ hiện từng vị thế ở đây.',
        emptyCta: 'Mua trái phiếu LP đầu tiên để bắt đầu kiếm lợi nhuận',
        stats: {
          title: 'Dữ liệu vị thế',
          metrics: [
            { label: 'Nắm giữ của tôi' },
            { label: 'Đã giải phóng' },
            { label: 'Chờ giải phóng' },
            {
              label: 'Tỷ suất Rebase hiện tại',
              hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
            },
            {
              label: 'Tổng lợi nhuận trái phiếu LP',
              hint: 'Tổng lợi nhuận trái phiếu LP đã nhận và chưa nhận',
            },
          ],
        },
        ops: {
          title: 'Lịch sử thao tác',
          empty: 'Chưa có lịch sử thao tác; staking, nhận hoặc chuộc sẽ hiện từng thao tác ở đây.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Nhận và chuộc khác nhau thế nào?',
              a: 'Nhận cho lợi nhuận: lấy lợi nhuận gAGX từ trái phiếu theo chu kỳ giải phóng đã chọn, hoặc tái stake trực tiếp. Chuộc cho gốc: lấy gốc AGX đã giải phóng vào bộ đệm {days} ngày giải phóng tuyến tính lần hai rồi về ví.',
            },
            {
              q: '「Gốc trái phiếu」đến từ đâu?',
              a: 'Khi mua trái phiếu LP, USD1 bạn trả quy ra AGX theo giá chiết khấu — đó là gốc trái phiếu. Gốc giải phóng tuyến tính theo khối chu kỳ đã chọn (180/360/540 ngày); phần 「đã giải phóng」chuộc bất cứ lúc nào.',
            },
            {
              q: 'Vì sao mỗi trái phiếu hiện riêng?',
              a: 'Mỗi trái phiếu tính riêng chu kỳ, chiết khấu, lợi nhuận và tiến độ giải phóng; thời điểm đáo hạn và thao tác không ảnh hưởng nhau, nên hiện và thao tác theo vị thế.',
            },
            {
              q: 'Lợi nhuận trái phiếu tái stake được không?',
              a: 'Được. Khi nhận, dùng thanh trượt chia tái stake và nhận: phần tái stake vào staking đơn token chu kỳ đã chọn ({restakeDays} ngày) tiếp tục lãi kép, thuế tốt hơn nhận theo chu kỳ.',
            },
            {
              q: 'Hết đếm ngược thì sao?',
              a: 'Hết đếm ngược nghĩa là giải phóng gốc xong — chuộc toàn bộ gốc bất cứ lúc nào; lợi nhuận chưa nhận không mất, vẫn tiếp tục lãi kép.',
            },
            {
              q: 'Có rút LP của trái phiếu LP được không?',
              a: 'Không. LP AGX/USD1 hệ thống tạo đã chuyển địa chỉ hố đen khóa vĩnh viễn, trở thành thanh khoản nền tảng giao thức; bạn nhận gốc AGX đúc theo giá chiết khấu và lợi nhuận liên tục.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Vị thế trái phiếu đốt',
        intro: 'Quản lý từng trái phiếu, nhận lợi nhuận hoặc chuộc gốc bất cứ lúc nào',
        empty: 'Chưa có vị thế trái phiếu đốt; mua một trái phiếu sẽ hiện từng vị thế ở đây.',
        emptyCta: 'Mua trái phiếu đốt đầu tiên để bắt đầu kiếm lợi nhuận',
        stats: {
          title: 'Dữ liệu vị thế',
          metrics: [
            { label: 'Nắm giữ của tôi' },
            { label: 'Đã giải phóng' },
            { label: 'Chờ giải phóng' },
            {
              label: 'Tỷ suất Rebase hiện tại',
              hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
            },
            {
              label: 'Tổng lợi nhuận trái phiếu đốt',
              hint: 'Tổng lợi nhuận trái phiếu đốt đã nhận và chưa nhận',
            },
          ],
        },
        ops: {
          title: 'Lịch sử thao tác',
          empty: 'Chưa có lịch sử thao tác; staking, nhận hoặc chuộc sẽ hiện từng thao tác ở đây.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Nhận và chuộc khác nhau thế nào?',
              a: 'Nhận cho lợi nhuận: lấy lợi nhuận gAGX từ trái phiếu theo chu kỳ giải phóng đã chọn, hoặc tái stake trực tiếp. Chuộc cho gốc: lấy gốc AGX đã giải phóng vào bộ đệm {days} ngày giải phóng tuyến tính lần hai rồi về ví.',
            },
            {
              q: '「Gốc trái phiếu」đến từ đâu?',
              a: 'Khi mua trái phiếu đốt, USD1 bạn trả quy ra AGX theo giá chiết khấu — đó là gốc trái phiếu. Gốc giải phóng tuyến tính theo khối chu kỳ đã chọn (180/360/540 ngày); phần 「đã giải phóng」chuộc bất cứ lúc nào.',
            },
            {
              q: 'Vì sao mỗi trái phiếu hiện riêng?',
              a: 'Mỗi trái phiếu tính riêng chu kỳ, chiết khấu, lợi nhuận và tiến độ giải phóng; thời điểm đáo hạn và thao tác không ảnh hưởng nhau, nên hiện và thao tác theo vị thế.',
            },
            {
              q: 'Lợi nhuận trái phiếu tái stake được không?',
              a: 'Được. Khi nhận, dùng thanh trượt chia tái stake và nhận: phần tái stake vào staking đơn token chu kỳ đã chọn ({restakeDays} ngày) tiếp tục lãi kép, thuế tốt hơn nhận theo chu kỳ.',
            },
            {
              q: 'Hết đếm ngược thì sao?',
              a: 'Hết đếm ngược nghĩa là giải phóng gốc xong — chuộc toàn bộ gốc bất cứ lúc nào; lợi nhuận chưa nhận không mất, vẫn tiếp tục lãi kép.',
            },
            {
              q: 'Trái phiếu đốt ảnh hưởng AGX thế nào?',
              a: 'Tiền mua trái phiếu đốt tự mua AGX và đốt vĩnh viễn về địa chỉ hố đen, giảm lưu thông, tăng giảm phát; bạn vừa nhận chiết khấu và lợi nhuận vừa đẩy giá trị giao thức.',
            },
          ],
        },
      },
      xmine: {
        title: 'Vị thế đào X',
        intro: 'Quản lý từng khoản staking đào, nhận sản lượng hoặc chuộc gốc bất cứ lúc nào',
        empty: 'Chưa có vị thế đào X; stake gAGX bắt đầu đào sẽ hiện từng vị thế ở đây.',
        emptyCta: 'Stake gAGX, bắt đầu đào X',
        periodPill: 'Staking đào',
        output: 'Sản lượng',
        stats: {
          title: 'Dữ liệu vị thế',
          metrics: [
            { label: 'Staking đào của tôi' },
            { label: 'Đã giải phóng' },
            { label: 'Sản lượng đào hiện tại' },
            {
              label: 'Tổng sản lượng đào',
              hint: 'Tổng sản lượng đào đã nhận và chưa nhận',
            },
          ],
        },
        ops: {
          title: 'Lịch sử thao tác',
          empty: 'Chưa có lịch sử thao tác; staking, nhận hoặc chuộc sẽ hiện từng thao tác ở đây.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: 'Nhận sản lượng và chuộc stake khác nhau thế nào?',
              a: 'Nhận cho sản lượng đào: thưởng X nhận bất cứ lúc nào, không chu kỳ giải phóng, về thẳng ví. Chuộc cho gốc stake: gAGX chuộc vào bộ đệm giải phóng tuyến tính lần hai {days} ngày; tài sản trong bộ đệm không còn sinh lợi nhuận.',
            },
            {
              q: 'Vì sao một số vị thế hiện 「Khóa」?',
              a: 'Mỗi lần stake gAGX vào trạng thái khóa 24 giờ, trong khóa không chuộc được; hết đếm ngược hiện 「Chuộc bất cứ lúc nào」là khởi chuộc được.',
            },
            {
              q: 'Sản lượng đào tính thế nào?',
              a: 'Mỗi ngày UTC 0 tất toán theo chuẩn vàng: giá trị USD của gAGX đã stake × tỷ suất ngày, trả bằng X; số lượng đổi theo giá AGX và X.',
            },
            {
              q: 'Sản lượng đào có lãi kép không?',
              a: 'Không tự lãi kép. X cần nhận thủ công; muốn mở rộng vị thế đào hãy stake thêm gAGX mới (trong trần stake).',
            },
            {
              q: 'Vì sao trần stake của tôi đổi?',
              a: 'Trần stake gAGX không cao hơn tổng nắm giữ trái phiếu AGX ≥180 ngày và staking AGX. Tăng trái phiếu hoặc staking dài hạn để nâng trần; hết hạn giải phóng thì trần giảm.',
            },
            {
              q: 'Sau chuộc còn nhận sản lượng không?',
              a: 'Không. gAGX đã chuộc vào bộ đệm thì dừng đào; vị thế chưa chuộc vẫn sản xuất bình thường.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Đặt cọc',
    intro: 'Staking và trái phiếu cùng xây dựng — chia sẻ lãi kép Rebase',
    body: 'Staking và trái phiếu cùng xây dựng — chia sẻ lãi kép Rebase',
    backToHub: 'Quay lại Staking',
    max: 'Tối đa',
    capUnlimited: 'Không giới hạn',
    blocked: {
      notBound: 'Hãy gắn quan hệ giới thiệu trước',
      accountMigrated: 'Địa chỉ này đã di chuyển, hãy dùng địa chỉ mới',
      migrationNotOpen: 'Di chuyển tài khoản chưa mở',
      insufficientBalance: 'Số dư ví không đủ, hãy giảm số lượng hoặc nạp thêm rồi thử lại',
      insufficientGagx: 'Số dư gAGX không đủ: hãy vào Flash bọc AGX thành gAGX rồi thử lại',
      insufficientAllowance: 'Ủy quyền không đủ',
      insufficientQuota: 'Đã vượt hạn mức stake, hãy giảm số lượng rồi thử lại',
      insufficientQuotaWithAmount:
        'Đã vượt hạn mức stake: hiện còn có thể stake tối đa {quota} AGX. Hãy giảm số lượng rồi thử lại.',
      insufficientQuotaPersonalWithAmount:
        'Đã vượt hạn mức stake cá nhân của bạn: hạn mức tích lũy cá nhân còn {quota} AGX, hãy giảm số lượng rồi thử lại.',
      insufficientQuotaPersonalDailyWithAmount:
        'Đã vượt hạn mức stake hôm nay của bạn: hạn mức cá nhân hôm nay còn {quota} AGX, hãy giảm số lượng, hoặc đợi hạn mức làm mới rồi thử lại.',
      insufficientQuotaPoolWithAmount:
        'Hạn mức hồ stake trên chuỗi không đủ: hồ hiện còn {quota} AGX, hãy giảm số lượng, hoặc thử lại sau.',
      insufficientXmineQuotaWithAmount:
        'Đã vượt hạn mức mining của bạn: hạn mức mining do vốn gốc khóa quyết định, hiện còn có thể stake tối đa {quota} gAGX. Hãy giảm số lượng, hoặc tăng vị thế khóa trước rồi thử lại.',
      poolPaused: 'Hồ staking này tạm đóng, vui lòng thử lại sau',
      depositoryNotAuth: 'Thị trường trái phiếu này chưa mở mua, hãy đổi kỳ hạn hoặc thử lại sau',
      insufficientDebtCapacity:
        'Hạn mức bán còn lại của thị trường trái phiếu này không đủ, hãy giảm số mua hoặc thử lại sau',
      bondTooSmall:
        'Số mua quá nhỏ: sau chiết khấu, số nhận không đạt mức tối thiểu. Hãy tăng số mua rồi thử lại',
      bondTooLarge:
        'Số mua quá lớn: vượt giới hạn nhận mỗi lần của trái phiếu này. Hãy giảm số mua rồi thử lại',
      zeroAmount: 'Nhập số lượng hợp lệ',
      unavailable: 'Giao dịch tạm không khả dụng, thử lại sau',
    },
    hub: {
      modes: {
        stake: {
          title: 'Đặt cọc',
          body: 'Stake AGX, Rebase {timesPerDay} lần/ngày với lãi kép',
        },
        lpbond: {
          title: 'Trái phiếu LP',
          body: 'Dùng USD1 cùng xây hồ nền, nhận AGX chiết khấu',
        },
        burnbond: {
          title: 'Trái phiếu đốt',
          body: 'Đúc AGX chiết khấu và đốt vĩnh viễn, tăng giảm phát',
        },
        xmine: {
          title: 'Đào X',
          body: 'Stake gAGX, đào thưởng hệ sinh thái X không lỗ gốc',
        },
        calc: {
          title: 'Máy tính lợi nhuận',
          body: 'Ước tính lợi nhuận theo chu kỳ và giá khác nhau',
        },
      },
      overview: {
        title: 'Tổng quan',
        metrics: [
          {
            id: 'tvl',
            label: 'TVL tổng staking',
            hint: 'Tổng AGX đã stake trong giao thức và ước tính USD',
          },
          {
            id: 'mcap',
            label: 'Tổng vốn hóa',
            hint: 'Tổng giá trị AGX đang lưu thông trên thị trường',
          },
          {
            id: 'circulating',
            label: 'Lưu thông AGX',
            hint: 'Số AGX đang lưu thông trên thị trường',
          },
          {
            id: 'treasury',
            label: 'Dự trữ think-tank',
            hint: 'Tài sản dự trữ think-tank hỗ trợ đúc thế chấp, tạo thị trường thông minh và phòng rủi ro',
          },
          {
            id: 'price',
            label: 'Giá AGX',
            hint: 'Giá tham chiếu thị trường AGX so với USD1',
          },
          {
            id: 'burned',
            label: 'Tổng đã đốt',
            hint: 'Tổng AGX đốt qua mua trái phiếu đốt và mua điểm đóng góp',
          },
          {
            id: 'rebase',
            label: 'Tỷ suất Rebase hiện tại',
            hint: 'Tất toán mỗi Epoch (~{hours} giờ); điều chỉnh theo trạng thái chạy giao thức',
          },
          {
            id: 'runway',
            label: 'Chu kỳ chạy được',
            hint: 'Chu kỳ chạy bền ước tính theo dự trữ think-tank hiện tại và chi tiêu giao thức',
          },
          {
            id: 'stakers',
            label: 'Số địa chỉ staking',
            hint: 'Tổng số địa chỉ toàn mạng đã staking',
          },
        ],
      },
      periodTable: {
        title: 'Chu kỳ staking và lợi nhuận',
        segmentAria: 'Đổi sản phẩm bảng chu kỳ',
        segs: {
          stake: 'Đặt cọc',
          lpbond: 'Trái phiếu LP',
          burnbond: 'Trái phiếu đốt',
        },
        columns: ['Chu kỳ ước tính', 'Tỷ suất cơ sở (ngày)', 'Cộng tỷ suất', 'Tỷ suất chu kỳ'],
        bondColumns: [
          'Chu kỳ ước tính',
          'Tỷ suất cơ sở (ngày)',
          'Tỷ lệ chiết khấu',
          'Tỷ suất chu kỳ',
        ],
        rows: [
          { id: 'liquid', period: 'Linh hoạt (có hạn)' },
          { id: '180', period: '180 ngày' },
          { id: '360', period: '360 ngày' },
          { id: '540', period: '540 ngày' },
        ],
      },
      runwayDays: '{days} ngày',
      chart: {
        title: 'Chỉ số dữ liệu',
        metricTabs: {
          tvl: 'TVL tổng staking',
          mcap: 'Tổng vốn hóa',
        },
        metricAria: 'Đổi chỉ số dữ liệu',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'Rebase tất toán thế nào?',
            a: 'Giao thức chạy theo khối: ~{blocks} khối = 1 Epoch (~{hours} giờ). Mỗi hết Epoch thực hiện một tất toán Rebase; hệ thống phân phối lợi nhuận {timesPerDay} lần/ngày.',
          },
          {
            q: 'Gốc giải phóng thế nào?',
            a: 'Gốc staking và trái phiếu giải phóng tuyến tính theo khối (~3 giây/khối). Gốc đã giải phóng sau rút vào chu kỳ đệm {days} ngày; hai lớp tuyến tính cân bằng liên tục giải phóng và ổn định thị trường.',
          },
          {
            q: 'Staking, trái phiếu LP và trái phiếu đốt khác nhau thế nào?',
            a: 'Staking gửi AGX lấy lãi kép Rebase; trái phiếu LP và trái phiếu đốt dùng USD1 lấy AGX chiết khấu — LP xây thanh khoản nền vĩnh viễn, trái phiếu đốt đốt AGX tăng giảm phát. Cả ba giải phóng gốc tuyến tính theo khối chu kỳ và hưởng lợi nhuận Rebase.',
          },
          {
            q: 'Lợi nhuận phát dưới dạng gì?',
            a: 'Lợi nhuận Rebase các mảng tất toán thống nhất bằng gAGX. gAGX đổi 1:1 AGX bất cứ lúc nào, hoặc stake đào X lấy token giá trị hệ sinh thái X.',
          },
          {
            q: 'Dự trữ think-tank làm gì?',
            a: 'Dự trữ think-tank (USD1) chống lưng giá trị giao thức: đúc AGX thế chấp vượt mức 150%, tạo thị trường AI và phòng rủi ro. 「Chu kỳ chạy được」là thời gian chạy bền ước tính theo dự trữ và chi tiêu hiện tại.',
          },
          {
            q: 'Chọn cách tham gia thế nào?',
            a: 'Muốn lãi kép ổn định → Staking. Muốn AGX chiết khấu → trái phiếu LP hoặc trái phiếu đốt. Giữ gAGX muốn bắt lợi hệ sinh thái → đào X. Nên dùng máy tính lợi nhuận so sánh sản phẩm/chu kỳ trước.',
          },
          {
            q: 'Tổng vốn hóa và lưu thông AGX hiểu thế nào?',
            a: 'Lưu thông AGX là số AGX đang lưu hành; tổng vốn hóa = lưu thông × giá hiện tại. Kết hợp tổng staking và tổng đã đốt để xem tỷ lệ khóa và tiến độ giảm phát.',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: 'giờ', minutes: 'phút', seconds: 'giây' },
      overview: 'Tổng quan',
      positions: 'Vị thế của tôi',
      positionsHint: 'Nhận, chuộc và gỡ stake thao tác ở tab Tài sản.',
      viewPositions: 'Xem',
      mechanism: 'Cơ chế',
      faq: 'Câu hỏi thường gặp',
      recordsTitles: {
        stake: 'Bản ghi staking của tôi',
        lpbond: 'Bản ghi mua trái phiếu',
        burnbond: 'Bản ghi mua trái phiếu',
        xmine: 'Bản ghi đào của tôi',
      },
      recordColumns: [
        'Thời gian',
        'Chu kỳ ước tính',
        'Số lượng ước tính',
        'Đã giải phóng',
        'Hash giao dịch',
      ],
      bondRecordColumns: [
        'Thời gian',
        'Chu kỳ ước tính',
        'Thanh toán',
        'Chiết khấu',
        'Nhận AGX',
        'Hash giao dịch',
      ],
      xmineRecordColumns: ['Thời gian', 'Thao tác', 'Số lượng ước tính', 'Hash giao dịch'],
      recordsEmpty: {
        stake: 'Chưa có bản ghi staking; hoàn tất staking sẽ hiện từng khoản ở đây.',
        lpbond: 'Chưa có bản ghi mua; mua trái phiếu LP sẽ hiện từng lần mua ở đây.',
        burnbond: 'Chưa có bản ghi mua; mua trái phiếu đốt sẽ hiện từng lần mua ở đây.',
        xmine: 'Chưa có bản ghi đào; stake gAGX bắt đầu đào sẽ hiện từng thao tác ở đây.',
      },
      recordsFooter: {
        stake: 'Tổng stake {amount} AGX',
        bond: 'Tổng mua {amount}',
        xmine: 'Tổng stake {amount} gAGX',
      },
      chartTitles: {
        stake: 'Chỉ số TVL (Staking)',
        lpbond: 'Chỉ số TVL (trái phiếu LP)',
        burnbond: 'Chỉ số TVL (trái phiếu đốt)',
        xmine: 'Chỉ số TVL (đào X)',
      },
      chartRangeAria: 'Khoảng thời gian biểu đồ',
      chartRanges: ['1 tuần', '1 tháng', '1 năm', 'Tất cả'],
      chartEmpty: 'Chưa có dữ liệu lịch sử',
      positionMetrics: [
        { label: 'Vị thế của tôi' },
        { label: 'Đã giải phóng' },
        { label: 'Chờ giải phóng' },
        {
          label: 'Tỷ suất Rebase hiện tại',
          hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
        },
        {
          label: 'Cộng Rebase hiện tại',
          hint: 'Thưởng Rebase chưa nhận không sinh lãi kép',
        },
      ],
      xValue: {
        title: 'Hệ thống giá trị dài hạn X',
        supplyLabel: 'Tổng phát hành X',
        supplyValue: '210,000,000',
        badge: 'Tổng cố định · không lạm phát',
        columns: [
          {
            pct: '47.62%',
            title: 'Xây thanh khoản LP',
            bullets: ['Xây thanh khoản ban đầu', 'Tạo thị trường và hỗ trợ thanh khoản'],
          },
          {
            pct: '52.38%',
            title: 'Thưởng toàn cầu và phát triển',
            bullets: [
              'Thưởng đào gAGX',
              'Mở rộng thị trường và hợp tác thương hiệu',
              'Xây hệ sinh thái và tăng trưởng dài hạn',
            ],
          },
        ],
        sourcesKicker: 'Nguồn giá trị',
        sourcesHeadline: 'Ba lớp nhu cầu chồng lên',
        sourcesBadge: 'Tăng nhu cầu X bền vững',
        sources: [
          { title: 'Nhu cầu gAGX', copy: 'Stake đào, tạo nhu cầu X' },
          {
            title: 'Hoàn lưu lợi nhuận',
            copy: 'Lợi nhuận giao thức liên tục chảy về hệ sinh thái',
          },
          { title: 'Tăng trưởng hệ sinh thái', copy: 'Mở rộng ứng dụng, người dùng kéo nhu cầu' },
        ],
        deflationKicker: 'Cơ chế giảm phát X',
        deflationHeadline: 'Giảm phát liên tục',
        deflationBadge: 'Ít hơn · giá trị cao hơn',
        deflationSteps: [
          { title: 'Tăng trưởng hệ sinh thái', copy: 'Hệ sinh thái phát triển liên tục' },
          { title: 'Nhu cầu X tăng', copy: 'Ứng dụng và giao dịch đẩy nhu cầu' },
          { title: 'Lưu thông thị trường', copy: 'X lưu thông và được dùng trên thị trường' },
          { title: 'Thuế bán 25% đốt', copy: 'Mỗi lần bán tự động đốt 25%' },
        ],
        featuresKicker: 'Đặc trưng cốt lõi của X',
        featuresHeadline: 'Nền tảng giá trị dài hạn',
        featuresBadge: 'Khan hiếm · giảm phát · thanh khoản · mở rộng',
        features: [
          { title: 'Tổng cố định', copy: 'Tổng lượng cố định, giá trị khan hiếm' },
          { title: 'Giảm phát liên tục', copy: 'Cơ chế đốt nâng giá trị' },
          { title: 'Nền tảng thanh khoản', copy: 'Thanh khoản giữ thị trường ổn định' },
          { title: 'Mở rộng hệ sinh thái', copy: 'Ứng dụng mở rộng, giá trị lắng đọng' },
        ],
      },
    },

    stake: {
      title: 'Đặt cọc',
      intro: 'Stake AGX · Rebase {timesPerDay} lần/ngày với lãi kép',
      periodLabel: 'Chọn chu kỳ staking',
      periodAria: 'Chọn chu kỳ staking',
      amountAria: 'Số lượng stake',
      amountBalance: 'Số lượng (số dư ví {balance} AGX)',
      quotaInline: 'Hạn mức stake: {quota} AGX',
      submit: 'Đặt cọc',
      bindCta: 'Đi gắn giới thiệu',
      success: 'Staking thành công',
      periods: {
        liquid: 'Linh hoạt',
        d180: '180 ngày',
        d360: '360 ngày',
        d540: '540 ngày',
      },
      meta: {
        baseDaily: 'Tỷ suất cơ sở (ngày)',
        periodYield: 'Tỷ suất chu kỳ',
        bonus: 'Cộng tỷ suất',
        lock: 'Số ngày khóa',
        remaining: 'Hạn mức còn lại',
        contract: 'Xem hợp đồng',
        lockLiquid: 'Linh hoạt',
        lockDays: 'Giải phóng tuyến tính {days} ngày',
      },
      overviewMetrics: [
        { label: 'Tổng đã stake' },
        {
          label: 'Epoch hiện tại',
          hint: 'Mỗi Epoch khoảng {hours} giờ ({blocks} khối); lợi nhuận stake tất toán theo Epoch',
        },
        { label: 'Lần phát Rebase tiếp theo' },
        {
          label: 'Tỷ suất Rebase hiện tại',
          hint: 'Tất toán mỗi Epoch (~{hours} giờ); điều chỉnh theo trạng thái chạy giao thức',
        },
      ],
      mechanismTitle: 'Cơ chế vận hành staking',
      mechanism:
        'Staking linh hoạt vào warmup rồi cần kích hoạt; staking kỳ hạn khóa theo hồ đã chọn. Nhận thưởng và thoát gốc làm ở trang Tài sản.',
      mechanismSteps: [
        {
          title: 'Đặt cọc AGX',
          body: 'Chọn linh hoạt hoặc chu kỳ 180/360/540 ngày stake AGX; chu kỳ dài cộng Rebase cao hơn.',
        },
        {
          title: 'Lợi nhuận Rebase ngày',
          body: 'Mỗi Epoch (~{hours} giờ) tự tất toán một lần; lợi nhuận tích lãi kép bằng gAGX.',
        },
        {
          title: 'Giải phóng đáo hạn và nhận',
          body: 'Gốc giải phóng tuyến tính theo khối; gAGX đổi 1:1 AGX hoặc tiếp tục stake đào X.',
        },
      ],
      faq: [
        {
          q: 'Lợi nhuận staking tính thế nào?',
          a: 'Rebase {timesPerDay} lần/ngày; lợi nhuận ngày khoảng 0.5%–1%. Chu kỳ càng dài cộng càng cao: 180 ngày ≥10%, 360 ngày ≥15%, 540 ngày ≥20%, điều chỉnh theo hệ số Rebase.',
        },
        {
          q: 'Gốc staking khi nào rút được?',
          a: 'Gốc giải phóng tuyến tính theo khối (~3 giây/khối); phần đã giải phóng rút bất cứ lúc nào; sau rút vào chu kỳ đệm {days} ngày.',
        },
        {
          q: 'APY tham chiếu có cố định không?',
          a: 'Không. APY chỉ tham chiếu; lợi nhuận thực theo hệ số Rebase, trạng thái giao thức và cung–cầu thị trường.',
        },
        {
          q: 'Lợi nhuận Rebase và cộng Rebase khác nhau thế nào?',
          a: 'Lợi nhuận Rebase từ tỷ suất cơ sở — chưa nhận thì tiếp tục lãi kép theo mỗi thưởng khối; cộng Rebase là phần cộng thêm staking chu kỳ dài — chưa nhận không lãi kép, nên nhận kịp thời.',
        },
        {
          q: 'Lợi nhuận phát dưới dạng gì?',
          a: 'Lợi nhuận staking phát bằng gAGX. gAGX đổi 1:1 AGX bất cứ lúc nào, hoặc tiếp tục stake đào X lấy token giá trị hệ sinh thái X.',
        },
        {
          q: 'Trước đáo hạn có thoát sớm không?',
          a: 'Không hỗ trợ thoát sớm. Gốc giải phóng tuyến tính theo khối chu kỳ đã chọn; phần đã giải phóng rút bất cứ lúc nào — chọn chu kỳ phù hợp kế hoạch vốn.',
        },
        {
          q: 'Staking linh hoạt có hạn chế gì?',
          a: 'Staking linh hoạt không cộng tỷ suất, và chịu hạn mức stake toàn cục ngày + hạn mức mỗi tài khoản; hạn mức reset theo ngày, ai đến trước được trước.',
        },
        {
          q: 'Một tài khoản có nhiều khoản staking không?',
          a: 'Có. Mỗi khoản tính riêng chu kỳ, lợi nhuận và tiến độ giải phóng, xem trong 「Bản ghi staking của tôi」.',
        },
      ],
    },
    lpbond: {
      title: 'Trái phiếu LP',
      intro: 'Dùng USD1 cùng xây hồ nền, nhận AGX chiết khấu',
      periodLabel: 'Chọn chu kỳ trái phiếu',
      periodAria: 'Chu kỳ trái phiếu LP',
      amountAria: 'Số lượng mua',
      amountBalance: 'Số lượng (số dư ví {balance} USD1)',
      submit: 'Mua',
      success: 'Mua thành công',
      footnote: 'Hệ thống tự xây LP AGX/USD1 và đốt về hố đen, tạo thanh khoản nền vĩnh viễn.',
      card: {
        yield: 'Tỷ suất chu kỳ',
        discountRange: 'Khoảng chiết khấu',
        sold: 'Đã bán',
        currentDiscount: 'Chiết khấu hiện tại',
        discountPrice: 'Giá chiết khấu',
      },
      meta: {
        discount: 'Giá chiết khấu ({pct}%)',
        slippage: 'Cho phép trượt giá',
        pay: 'Thanh toán',
        receive: 'Nhận AGX',
        cap: 'Mức mua tối đa',
        release: 'Giải phóng gốc',
        releaseLinear: 'Giải phóng tuyến tính theo khối {days} ngày',
        contract: 'Xem hợp đồng',
      },
      overviewMetrics: [
        { label: 'Tổng TVL trái phiếu LP' },
        {
          label: 'Tỷ lệ premium trái phiếu',
          hint: 'Khoảng lợi nhuận của giá chiết khấu hiện tại so với giá thị trường AGX',
        },
        { label: 'Lần phát Rebase tiếp theo' },
        {
          label: 'Tỷ suất Rebase hiện tại',
          hint: 'Tất toán mỗi Epoch (~{hours} giờ); điều chỉnh theo trạng thái chạy giao thức',
        },
      ],
      positionMetrics: [
        { label: 'My stake' },
        { label: 'Nhận' },
        { label: 'Chờ giải phóng' },
        {
          label: 'Current Rebase reward',
          hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
        },
      ],
      mechanismTitle: 'Cơ chế vận hành trái phiếu LP',
      mechanism:
        'USD1 zap qua BondHelper vào BondDepository chu kỳ tương ứng. Chuộc và lợi nhuận ở trang Tài sản.',
      mechanismSteps: [
        {
          title: 'Mua trái phiếu LP',
          body: 'Dùng USD1 tham gia cùng xây hồ nền, đúc AGX theo chiết khấu.',
        },
        {
          title: 'Tự xây LP',
          body: 'Hợp đồng hệ thống tự xây thanh khoản AGX/USD1.',
        },
        {
          title: 'Khóa vĩnh viễn hố đen',
          body: 'LP Token chuyển địa chỉ hố đen, không tách được vĩnh viễn.',
        },
      ],
      faq: [
        {
          q: 'Trái phiếu LP là gì?',
          a: 'Dùng USD1 cùng xây hồ nền; hợp đồng tự: đúc AGX chiết khấu, xây LP AGX/USD1 và đốt về hố đen (Blackhole Lock), tạo thanh khoản nền không gỡ được vĩnh viễn.',
        },
        {
          q: 'Chiết khấu xác định thế nào?',
          a: 'Chiết khấu điều chỉnh động theo cung–cầu và tham số giao thức (Dynamic Bond Control): 180 ngày 85%–100%, 360 ngày 80%–100%, 540 ngày 75%–100%; chu kỳ càng dài chiết khấu càng tốt.',
        },
        {
          q: 'Mua trái phiếu LP xong tôi có giữ LP Token không?',
          a: 'Không. LP Token hệ thống xây rồi đốt thẳng địa chỉ hố đen, thành thanh khoản nền không gỡ được của giao thức, không thuộc cá nhân. Bạn thực nhận AGX đúc chiết khấu, giải phóng tuyến tính theo khối chu kỳ trái phiếu đã chọn.',
        },
        {
          q: 'Tỷ lệ premium trái phiếu là gì?',
          a: 'Premium phản ánh khoảng lợi so với giá thị trường AGX của giá chiết khấu hiện tại. Premium dương thì lấy AGX qua trái phiếu lợi hơn mua spot.',
        },
        {
          q: 'Có chuộc sớm không?',
          a: 'Không hỗ trợ chuộc sớm. Gốc giải phóng tuyến tính theo khối chu kỳ đã chọn; phần đã giải phóng nhận bất cứ lúc nào — chọn chu kỳ phù hợp kế hoạch vốn.',
        },
        {
          q: 'USD1 tôi trả đi đâu?',
          a: 'USD1 trả cùng AGX đúc chiết khấu tạo LP AGX/USD1; LP Token rồi đốt về hố đen, thành thanh khoản nền tảng không gỡ được của giao thức.',
        },
      ],
    },
    burnbond: {
      title: 'Trái phiếu đốt',
      intro: 'Đúc AGX chiết khấu và đốt vĩnh viễn, tăng giảm phát',
      periodLabel: 'Chọn chu kỳ trái phiếu',
      periodAria: 'Chu kỳ trái phiếu đốt',
      amountAria: 'Số lượng mua',
      amountBalance: 'Số lượng (số dư ví {balance} USD1)',
      submit: 'Mua',
      success: 'Mua thành công',
      footnote: 'Hệ thống đúc AGX theo tỷ lệ chiết khấu, tự mua và đốt vĩnh viễn về hố đen.',
      card: {
        yield: 'Tỷ suất chu kỳ',
        discountRange: 'Khoảng chiết khấu',
        sold: 'Đã bán',
        currentDiscount: 'Chiết khấu hiện tại',
        discountPrice: 'Giá chiết khấu',
      },
      meta: {
        discount: 'Giá chiết khấu ({pct}%)',
        slippage: 'Cho phép trượt giá',
        pay: 'Thanh toán',
        receive: 'Nhận AGX',
        cap: 'Mức mua tối đa',
        release: 'Giải phóng gốc',
        releaseLinear: 'Giải phóng tuyến tính theo khối {days} ngày',
        contract: 'Xem hợp đồng',
      },
      overviewMetrics: [
        { label: 'Tổng TVL trái phiếu đốt' },
        {
          label: 'Tỷ lệ premium trái phiếu',
          hint: 'Khoảng lợi nhuận của giá chiết khấu hiện tại so với giá thị trường AGX',
        },
        { label: 'Lần phát Rebase tiếp theo' },
        {
          label: 'Tỷ suất Rebase hiện tại',
          hint: 'Tất toán mỗi Epoch (~{hours} giờ); điều chỉnh theo trạng thái chạy giao thức',
        },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Đã giải phóng' },
        { label: 'Chờ giải phóng' },
        {
          label: 'Current Rebase reward',
          hint: 'Lợi nhuận Rebase chưa nhận tiếp tục sinh lãi kép theo mỗi phần thưởng block',
        },
      ],
      mechanismTitle: 'Cơ chế vận hành trái phiếu đốt',
      mechanism:
        'USD1 zap qua BondHelper vào BurnBondDepository chu kỳ tương ứng. Chuộc và lợi nhuận ở trang Tài sản.',
      mechanismSteps: [
        {
          title: 'Thanh toán USD1',
          body: 'Chọn chu kỳ giải phóng, tham gia trái phiếu đốt theo chiết khấu hiện tại.',
        },
        {
          title: 'Đúc AGX chiết khấu',
          body: 'Hệ thống đúc AGX theo tỷ lệ chiết khấu tương ứng.',
        },
        {
          title: 'Mua và đốt vĩnh viễn',
          body: 'Tự mua AGX và đốt về hố đen, tăng giảm phát.',
        },
      ],
      faq: [
        {
          q: 'Trái phiếu đốt là gì?',
          a: 'Dùng USD1 tham gia trái phiếu đốt; hợp đồng tự: đúc AGX theo chiết khấu, tự mua AGX và đốt vĩnh viễn (Blackhole Lock), giảm lưu thông, tăng chống lưng giá trị dài hạn.',
        },
        {
          q: 'Khác trái phiếu LP thế nào?',
          a: 'Trái phiếu LP xây thanh khoản nền vĩnh viễn; trái phiếu đốt giảm phát lưu thông. Khoảng chiết khấu giống nhau (75%–100% theo chu kỳ động); gốc đều giải phóng tuyến tính theo khối chu kỳ.',
        },
        {
          q: 'Tỷ lệ premium trái phiếu là gì?',
          a: 'Premium phản ánh khoảng lợi so với giá thị trường AGX của giá chiết khấu hiện tại. Premium dương thì lấy AGX qua trái phiếu lợi hơn mua spot.',
        },
        {
          q: 'Có chuộc sớm không?',
          a: 'Không hỗ trợ chuộc sớm. Gốc giải phóng tuyến tính theo khối chu kỳ đã chọn; phần đã giải phóng nhận bất cứ lúc nào — chọn chu kỳ phù hợp kế hoạch vốn.',
        },
        {
          q: 'USD1 tôi trả đi đâu?',
          a: 'USD1 trả vào dự trữ think-tank, hỗ trợ đúc thế chấp, tạo thị trường thông minh và phòng rủi ro; hệ thống đồng thời đúc AGX theo chiết khấu tương ứng, tự mua và đốt vĩnh viễn về hố đen.',
        },
      ],
    },
    xmine: {
      title: 'Đào X',
      intro: 'Stake gAGX, đào thưởng hệ sinh thái X không lỗ gốc',
      amountAria: 'Số lượng stake gAGX',
      amountBalance: 'Số lượng (số dư ví {balance} gAGX)',
      quotaInline: 'Hạn mức stake: {quota} gAGX',
      submit: 'Đặt cọc',
      success: 'Staking thành công',
      openKlineChart: 'Xem biểu đồ nến',
      meta: {
        quota: 'Hạn mức stake',
        daily: 'Tỷ suất (ngày)',
        max: 'Mức stake tối đa',
        maxHint: 'Mức stake gAGX không được vượt tổng trái phiếu AGX ≥180 ngày và AGX đang stake',
        lock: 'Số ngày khóa',
        lockValue: 'Giải phóng sau 24 giờ',
        h24: '24h',
        contract: 'Xem hợp đồng',
      },
      overviewMetrics: [
        { label: 'Tổng TVL đào X' },
        { label: 'Giá X' },
        { label: 'Tổng sản lượng đào' },
        {
          label: 'Tỷ suất ngày',
          hint: 'Phân bổ động theo tỷ suất giao thức và lượng stake toàn mạng; điều chỉnh hàng ngày',
        },
        {
          label: 'Lần sản lượng đào tiếp theo',
          hint: 'Lợi nhuận đào X được phát mỗi ngày lúc 00:00 UTC',
        },
      ],
      positionMetrics: [
        { label: 'Staking đào của tôi' },
        { label: 'Đã giải phóng' },
        { label: 'Sản lượng đào' },
      ],
      mechanismTitle: 'Cơ chế vận hành đào X',
      mechanism:
        'Dùng miningQuotaOf kiểm hạn mức rồi stakeGagxForMining. Nhận X và gỡ stake ở trang Tài sản; trang này không hủy warmup.',
      mechanismSteps: [
        {
          title: 'Thưởng Rebase + DAO',
          body: 'Lợi nhuận tất toán thống nhất bằng gAGX.',
        },
        { title: 'Đặt cọc gAGX', body: 'Sau stake vào trạng thái khóa 24 giờ.' },
        {
          title: 'Phân bổ X động',
          body: 'Hệ thống phân bổ thưởng X động theo tỷ suất giao thức.',
        },
        {
          title: 'Giải phóng tuyến tính gỡ stake',
          body: 'Sau mở khóa, gAGX giải phóng tuyến tính theo khối ~30 ngày.',
        },
      ],
      faq: [
        {
          q: 'Tham gia đào X thế nào?',
          a: 'Stake gAGX là tham gia đào X không lỗ gốc. Sau stake gAGX khóa 24 giờ; hệ thống phân bổ thưởng X theo tỷ suất giao thức.',
        },
        {
          q: 'Trần stake là bao nhiêu?',
          a: 'Trần stake gAGX không cao hơn tổng nắm giữ trái phiếu AGX ≥180 ngày và staking AGX.',
        },
        {
          q: 'Sau gỡ stake tài sản giải phóng thế nào?',
          a: 'gAGX đã mở khóa giải phóng tuyến tính theo khối {days} ngày.',
        },
        {
          q: 'Tổng X bao nhiêu? Có phát hành thêm không?',
          a: 'Tổng phát hành X cố định 210 triệu, không lạm phát. 47.62% cho LP (hồ ban đầu, làm thị trường, hỗ trợ thanh khoản); 52.38% thưởng toàn cầu (đào gAGX, mở rộng/thương hiệu, hệ sinh thái).',
        },
        {
          q: 'Làm sao nhận gAGX?',
          a: 'gAGX là chứng từ tất toán thống nhất thưởng Rebase và DAO, đồng thời là lối vào duy nhất vào hệ sinh thái X.',
        },
        {
          q: 'gAGX ngoài đào còn làm gì?',
          a: 'Đổi 1:1 thành AGX hoặc đào X. Hai đường tự chọn.',
        },
        {
          q: 'Vì sao X luôn giảm phát?',
          a: 'Mỗi lần bán tự đốt 25%; lưu thông co lại; 「ít nguồn cung, giá trị cao hơn」.',
        },
        {
          q: 'Nguồn giá trị X là gì?',
          a: 'Ba lớp: cầu đào, lợi nhuận chảy lại, tăng trưởng ứng dụng/người dùng.',
        },
        {
          q: 'Vì sao trần stake gắn với nắm giữ trái phiếu / staking dài hạn?',
          a: 'Trần gAGX không vượt tổng trái phiếu AGX ≥180 ngày và staking AGX. Tăng trái phiếu hoặc staking dài hạn để nâng trần.',
        },
      ],
    },
    calc: {
      title: 'Máy tính lợi nhuận',
      intro: 'Ước tính lợi nhuận theo sản phẩm, chu kỳ và giá — không giao dịch on-chain',
      productAria: 'Sản phẩm ước tính',
      products: {
        stake: 'Đặt cọc',
        lpbond: 'Trái phiếu LP',
        burnbond: 'Trái phiếu đốt',
        xmine: 'Đào X',
      },
      periodLabel: 'Chọn chu kỳ',
      periodAria: 'Chu kỳ ước tính',
      amountLabel: 'Số lượng ước tính',
      amountBuy: 'Số tiền mua',
      amountAria: 'Số lượng ước tính',
      price: 'Giá AGX đáo hạn',
      priceCurrent: 'Hiện tại {price}',
      priceAria: 'Nhập giá',
      days: 'Số ngày nắm giữ',
      dayBubble: 'Ngày {day}',
      daysAria: 'Số ngày nắm giữ',
      submit: 'Tính',
      result: {
        interest: 'Lợi nhuận ước tính',
        total: 'Tổng lợi nhuận',
        rate: 'Tỷ suất',
        sellTotal: 'Tổng giá trị bán',
        invested: 'Tổng đầu tư',
        yieldBar: 'Lợi nhuận {amount}',
        legend: {
          released: 'Giá trị gốc đã giải phóng',
          netYield: 'Giá trị lợi nhuận ròng',
          netYieldHint: 'Lợi nhuận sau khi trừ điểm đóng góp',
          netYieldHintXmine: 'Sản lượng X đào được, quy giá theo giá X đáo hạn',
          cost: 'Chi phí đầu tư',
          grossYield: 'Tổng lợi nhuận',
        },
      },
      aside: {
        result: 'Kết quả ước tính',
        resultHint: 'Nhập tham số bên trái và bấm Tính để xem kết quả.',
        tags: { day: 'Ngày {day}' },
        curve: 'Đường lợi nhuận',
        curveHint:
          'Lợi nhuận tích lũy theo ngày với tham số hiện tại; đáo hạn chưa chuộc vẫn tiếp tục lãi kép',
        nodes: 'Nút then chốt',
        nodeEndLabel: 'Nắm đến ngày {day}',
        nodeCards: [
          { label: 'Ngày bắt đầu lãi dương', note: 'Từ ngày này bán ra có thể lãi dương' },
          {
            label: 'Gốc giải phóng hết',
            hint: 'Gốc giải phóng tuyến tính theo khối chu kỳ; từ ngày này có thể rút toàn bộ',
          },
          { label: 'Nắm đến ngày cuối chu kỳ', note: 'Minh họa lợi nhuận tích lũy so với gốc' },
        ],
        notes: 'Ghi chú tính toán',
        notesBody:
          'Máy tính chỉ để ước lượng cục bộ, không phải báo giá on-chain hay cam kết lợi nhuận.',
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
    title: 'Giải phóng',
    intro: 'Quản lý và xem giải phóng lợi nhuận và gốc',
    backToHub: 'Quay lại Giải phóng',
    recordColumns: ['Thời gian', 'Thao tác', 'Số lượng ước tính', 'Hash giao dịch'],
    recordsEmpty: 'Chưa có bản ghi chỉ mục on-chain (chờ indexer)',
    labels: {
      releasing: 'Đang giải phóng',
      released: 'Đã giải phóng',
      releasedPct: 'Đã giải phóng {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Nhận thất bại, vui lòng thử lại',
    },
    hub: {
      aboutTitle: 'Về giải phóng',
      aboutCardTitle: 'Hồ giải phóng · giải phóng lợi nhuận và phần thưởng',
      aboutCardBody:
        'Hồ giải phóng biến hiện thực lợi nhuận từ 「áp lực bán tức thì」thành dòng vốn mượt kéo dài hàng chục ngày. Mỗi lần nhận giải phóng tuyến tính theo chu kỳ đã chọn, nhịp dòng ra của giao thức khớp với nhịp tăng trưởng hệ sinh thái.',

      aboutSlides: [
        {
          title: 'Hồ giải phóng · giải phóng lợi nhuận và phần thưởng',
          body: 'Hồ giải phóng biến hiện thực lợi nhuận từ 「áp lực bán tức thì」thành dòng vốn mượt kéo dài hàng chục ngày. Mỗi lần nhận giải phóng tuyến tính theo chu kỳ đã chọn, nhịp dòng ra khớp tăng trưởng hệ sinh thái, tránh hiện thực tập trung đập giá AGX, bảo vệ nền lãi kép cho mọi người tham gia dài hạn.',
        },
        {
          title: 'Hồ đệm · giải phóng gốc lần hai',
          body: 'Gốc staking/trái phiếu thoát ra vào hồ đệm giải phóng tuyến tính lần hai, khớp nhịp hiện thực gốc với khả năng hấp thụ thị trường, tăng ổn định hệ sinh thái.',
        },
      ],
      purposeTitle: 'Vai trò của giải phóng',
      purposeBody:
        'Mọi lợi nhuận trước khi vào Turbine đều qua hồ giải phóng tuyến tính theo chu kỳ đã chọn. Bước này trải nhu cầu hiện thực theo thời gian, giảm áp lực bán tức thì; kèm chu kỳ càng dài thuế càng thấp, khuyến khích nắm dài, tạo đệm cho vận hành ổn định.',

      mechanismTitle: 'Cơ chế nhận lợi nhuận',
      mechanismSubtitle:
        'Giải phóng là bước bắt buộc từ lúc lợi nhuận sinh ra đến khi vào Turbine — đổi thời gian lấy thuế thấp, đổi nhịp lấy ổn định',
      mechanismSteps: [
        { title: 'Nhận thưởng Rebase / DAO', body: 'Lợi nhuận sinh ra' },
        { title: 'Cơ chế đóng góp {divisor} : 1', body: '50% đốt · 50% bơm hồ nền X' },
        {
          title: 'Vào hồ giải phóng · giải phóng tuyến tính',
          body: 'Chọn chu kỳ 5 / 20 / 40 / 60 ngày',
        },
        { title: 'Nhận vào Turbine', body: 'Mua 1:1 để mở hạn mức bán' },
      ],
      taxTitle: 'Giải phóng dài hơn hưởng thuế thấp hơn',
      taxPeriod: 'Chu kỳ ước tính',
      taxRate: 'Thuế nhận',
    },
    queue: {
      title: 'Hồ giải phóng',
      intro:
        'Lợi nhuận và phần thưởng đã nhận giải phóng tuyến tính theo chu kỳ đã chọn tại đây; phần đã giải phóng nhận vào Turbine bất cứ lúc nào',
      hubHint:
        'Lợi nhuận và phần thưởng đã nhận giải phóng tuyến tính theo chu kỳ đã chọn (5/20/40/60 ngày) tại đây; phần đã giải phóng nhận vào Turbine bất cứ lúc nào.',
      planDays: '{days} ngày',
      claim: 'Nhận',
      refresh: 'Làm mới',
      claimSuccess: 'Đã nhận vào hạn mức Turbine',
      goTurbine: 'Đi Turbine',
      statsTitle: 'Dữ liệu hồ giải phóng',
      lifetimeClaimed: 'Tổng đã nhận từ hồ giải phóng',
      hints: {
        releasing: 'Tổng gAGX còn trong hồ giải phóng, đang giải phóng tuyến tính theo kỳ đã chọn',
        released: 'Tổng gAGX đã giải phóng xong, có thể nhận vào Turbine bất cứ lúc nào',
        lifetimeClaimed: 'Tổng gAGX lịch sử đã nhận từ hồ giải phóng vào Turbine',
      },
      recordsTitle: 'Bản ghi hồ giải phóng',
    },
    buffer: {
      title: 'Hồ đệm',
      intro:
        'Tài sản đã chuộc tại đây được giải phóng tuyến tính lần hai trong {days} ngày; phần đã giải phóng có thể rút bất cứ lúc nào.',
      hubHint:
        'Tài sản chuộc vào hồ đệm rồi giải phóng tuyến tính theo khối trong {days} ngày; phần đã giải phóng rút về ví bất cứ lúc nào.',
      claim: 'Rút',
      refresh: 'Làm mới',
      claimSuccess: 'Đã rút AGX về ví',
      statsTitle: 'Dữ liệu hồ đệm',
      entered: 'Tổng đã vào',
      extracted: 'Tổng đã rút',
      hints: {
        enteredAgx: 'Tổng AGX đã vào hồ đệm sau khi chuộc stake và trái phiếu',
        extractedAgx: 'Tổng AGX đã rút từ hồ đệm về ví',
        releasingAgx: 'Tổng AGX đang giải phóng trong hồ đệm',
        enteredGagx: 'Tổng gAGX đã vào hồ đệm sau khi chuộc đào X',
        extractedGagx: 'Tổng gAGX đã rút từ hồ đệm về ví',
        releasingGagx: 'Tổng gAGX đang giải phóng trong hồ đệm',
      },
      recordsTitle: 'Bản ghi hồ đệm',
      mechanismTitle: 'Cơ chế giải phóng vốn',
      mechanismSubtitle:
        'Gốc staking và trái phiếu dùng mô hình giải phóng hai giai đoạn, tăng ổn định thị trường',
      mechanismSteps: [
        { title: 'Staking/', body: 'gốc trái phiếu' },
        { title: 'Cấp khối', body: 'giải phóng' },
        { title: 'Sau rút', body: 'Đệm {days} ngày' },
        { title: 'Tuyến tính lần hai', body: 'giải phóng' },
      ],
      mechanismBenefits: [
        'Tránh mở khóa tập trung',
        'Giảm áp lực bán thị trường',
        'Giải phóng vốn mượt',
        'Tăng ổn định thị trường',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'Chu kỳ giải phóng đổi được không?',
          a: 'Không. Chu kỳ cố định lúc vào hàng. Lần nhận sau có thể khác.',
        },
        {
          q: 'Thuế trừ khi nào?',
          a: 'Trừ một lần lúc vào hàng ({taxSchedule}). Hồ hiện số sau thuế. Sau đó không thêm phí.',
        },
        {
          q: 'gAGX nhận từ hồ giải phóng đi đâu?',
          a: 'gAGX đã nhận vào Turbine, không vào ví. Quản lý trên trang Turbine.',
        },
        {
          q: 'Phần đã giải phóng không nhận ngay có mất không?',
          a: 'Không hết hạn. Phần đã giải phóng nằm im không sinh lợi — hãy nhận vào Turbine sớm.',
        },
        {
          q: 'Chọn chu kỳ giải phóng thế nào?',
          a: 'Chu kỳ ngắn = nhanh hơn + thuế cao hơn; dài = thuế thấp hơn. Hoặc tách thành nhiều lần nhận.',
        },
      ],
      queue: [
        {
          q: 'Chu kỳ giải phóng đổi được không?',
          a: 'Không. Chu kỳ cố định lúc vào hàng. Lần nhận sau có thể khác.',
        },
        {
          q: 'Thuế trừ khi nào?',
          a: 'Trừ một lần lúc vào hàng ({taxSchedule}). Hồ hiện số sau thuế. Sau đó không thêm phí.',
        },
        {
          q: 'gAGX nhận từ hồ giải phóng đi đâu?',
          a: 'gAGX đã nhận vào Turbine, không vào ví. Quản lý trên trang Turbine.',
        },
        {
          q: 'Phần đã giải phóng không nhận ngay có mất không?',
          a: 'Không hết hạn. Phần đã giải phóng nằm im không sinh lợi — hãy nhận vào Turbine sớm.',
        },
        {
          q: 'Chọn chu kỳ giải phóng thế nào?',
          a: 'Chu kỳ ngắn = nhanh hơn + thuế cao hơn; dài = thuế thấp hơn. Hoặc tách thành nhiều lần nhận.',
        },
      ],
      buffer: [
        {
          q: 'Hồ đệm là gì?',
          a: 'Sau chuộc, giải phóng tuyến tính lần hai {days} ngày. Làm mượt dòng ra.',
        },
        {
          q: 'Tài sản trong hồ đệm còn lợi nhuận không?',
          a: 'Không. Vào bộ đệm là hết sinh lợi nhuận.',
        },
        {
          q: 'Phần đã giải phóng rút thế nào?',
          a: 'Giải phóng tuyến tính theo khối; Rút đã giải phóng → về ví ngay.',
        },
        {
          q: 'Vì sao hồ đệm có cả AGX và gAGX?',
          a: 'Chuộc staking/trái phiếu = AGX; gỡ stake đào X = gAGX. Độc lập nhau.',
        },
        {
          q: 'Vì sao không rút hết tài sản đã giải phóng một lần?',
          a: 'Nhiều bản ghi, một lần rút chỉ xử lý số lượng giới hạn — bấm Rút lại.',
        },
      ],
    },
  },
  tables: {
    time: 'Thời gian',
    claimTime: 'Nhận lúc',
    paid: 'Số tiền',
    status: 'Trạng thái',
    discount: 'Giảm giá',
    estimatedAgx: 'Dự kiến AGX',
    tx: 'Giao dịch',
    title: 'Danh hiệu sáng lập',
    totalVolume: 'Tổng doanh số',
    rewardRate: 'Tỷ lệ thưởng',
    amount: 'Số tiền',
    from: 'Địa chỉ nguồn',
    genesisRank: 'Hạng Genesis',
    joined: 'Thời gian tham gia',
    address: 'Địa chỉ',
    communityVolume: 'Thành tích đội',
    contribution: 'Đăng ký',
  },
}) satisfies AppMessagesBundle

export default app
