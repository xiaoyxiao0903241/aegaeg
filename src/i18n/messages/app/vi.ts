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
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'Cùng xây dựng',
    rewards: 'Phần thưởng',
    release: 'Release',
    community: 'Cộng đồng',
    rewardsTooltip: 'Xem phần thưởng giới thiệu và phần thưởng nhóm.',
    communityTooltip:
      'Mời đối tác cùng xây dựng, chia sẻ giá trị tăng trưởng hệ sinh thái và phần thưởng Genesis.',
    bscTooltip: 'Chỉ BSC · AEGIS X chạy trên BNB Smart Chain, chưa hỗ trợ chuyển mạng.',
  },
  topbar: {
    currentNetwork: 'Mạng hiện tại',
    openMenu: 'Mở điều hướng',
    closeMenu: 'Đóng điều hướng',
    hideDetails: 'Thu gọn bảng chi tiết',
    showDetails: 'Mở rộng bảng chi tiết',
    toggleTooltip: 'Hiện hoặc ẩn bảng chi tiết',
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
    connectIntroTitle: 'Kết nối ví để khám phá các tính năng AEGIS X',
    connectIntroLink: 'Tính năng AEGIS X ↗',
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
      transactionFailed: 'Giao dịch thất bại. Vui lòng thử lại sau.',
      transactionUnknown:
        'Trạng thái giao dịch chưa rõ. Đừng gửi lại — hãy kiểm tra ví hoặc trình duyệt khối trước.',
    },
  },
  exchange: {
    title: 'Swap',
    intro: 'Get AEGIS X ecosystem tokens at the best rates',
    backToHub: 'Back to Swap',
    sell: 'Sell',
    buy: 'Buy',
    flip: 'Flip swap direction',
    balance: 'Balance',
    exchangePrice: 'Exchange price',
    ratePlaceholder: '1 : 1',
    slippage: 'Slippage tolerance',
    allowedSlippage: 'Allowed slippage',
    slippageSettings: 'Slippage tolerance settings',
    route: 'Swap route',
    provider: 'Provider',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Open on PancakeSwap',
    exchangeSuccess: 'Swap successful',
    transactionCancelled: 'Transaction cancelled in wallet',
    overview: 'Overview',
    exchangeRate: 'Exchange rate',
    settlement: 'Settlement',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Flash',
          body: 'Swap gAGX for AGX or USDT for USD1 — no fees, no slippage',
        },
        trade: {
          title: 'Trade',
          body: 'Swap major tokens for AEGIS X ecosystem tokens',
        },
        burn: {
          title: 'Burn',
          body: 'Burn AGX for contribution points',
        },
        turbine: {
          title: 'Turbine',
          body: 'Buy unlocked Turbine gAGX 1:1 with USD1',
        },
      },
      program: {
        title: 'Get AEGIS X protocol tokens',
        cards: [
          { title: 'Trade gAGX', body: 'Swap gAGX for AGX' },
          { title: 'Turbine', body: 'Buy unlocked Turbine gAGX with USD1' },
          { title: 'Get USD1', body: 'Convert USDT to USD1 via Flash' },
          { title: 'Get AGX', body: 'Get AGX at PancakeSwap market rate' },
          { title: 'Sell X', body: 'Swap X for AGX, USD1, or other ecosystem tokens' },
          { title: 'Get contribution points', body: 'Burn AGX at 1:6 for contribution points' },
        ],
      },
      faq: {
        items: [
          {
            q: 'What can I do on the Swap page?',
            a: 'Flash-convert USDT to USD1 or (when available) gAGX to AGX, trade major tokens for AEGIS X assets on PancakeSwap, burn AGX for contribution points, and buy unlocked Turbine gAGX with USD1.',
          },
          {
            q: 'What is the difference between Flash and Trade?',
            a: 'Flash uses a fixed protocol route with no user slippage controls. Trade uses PancakeSwap live rates with configurable slippage and market price impact.',
          },
          {
            q: 'What is a crypto wallet, and how do I get one?',
            a: 'A crypto wallet manages digital assets on-chain. With a non-custodial wallet, only you control the private key or seed phrase, so keep it safe. Common options include MetaMask and TokenPocket.',
          },
          {
            q: 'What is a blockchain transaction fee?',
            a: 'Every on-chain buy, sell, swap, or transfer needs gas. AEGIS X does not charge it; the BSC network does. Keep BNB in your wallet before trading.',
          },
          {
            q: 'How does a crypto wallet work?',
            a: 'Wallets use public and private keys. The private key or seed phrase signs transactions and must stay secret. The public key creates your address and receives assets.',
          },
        ],
      },
    },
    flash: {
      title: 'Flash',
      intros: {
        gagx: 'Convert gAGX to AGX — no fees, no slippage',
        gagxWrap: 'Wrap AGX into gAGX — no fees, no slippage',
        usdt: 'Convert USDT to USD1 — no fees, no slippage',
      },
      providerName: 'AEGIS X',
      openProvider: 'View convert contract on BscScan',
      settlementValue: 'On-chain · instant',
      aboutTitle: 'About',
      action: 'Flash',
      pairAriaLabel: 'Flash pair',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      gates: {
        paused: 'Flash is paused. Please try again later.',
        belowMin: 'Amount is below the minimum swap limit.',
        aboveMax: 'Amount exceeds the maximum swap limit.',
        insufficientReserve: 'USD1 reserve is insufficient. Please try again later.',
        zeroRate: 'Exchange rate is unavailable. Please try again later.',
      },
      faq: {
        items: [
          {
            q: 'What is gAGX?',
            a: 'gAGX is the unified settlement voucher for Rebase and DAO rewards. Rebase yield from AGX staking or bonds, and DAO rewards, are paid as gAGX.',
          },
          {
            q: 'What is the gAGX to AGX exchange rate?',
            a: 'Fixed 1:1 at any time — no fees, no slippage, settled on-chain instantly.',
          },
          {
            q: 'Why does Flash have no fees or slippage?',
            a: 'Flash is a protocol-level 1:1 gAGX↔AGX redeem, not an AMM trade, so there is no price slippage or swap fee. You only pay BSC network gas in BNB.',
          },
          {
            q: 'How do I get gAGX?',
            a: 'After participating in protocol yield distribution, you receive a corresponding amount of gAGX.',
          },
          {
            q: 'What else can I do with gAGX besides redeeming AGX?',
            a: 'Redeem 1:1 to AGX for staking compounding, or stake gAGX to mine X. Both paths are available.',
          },
          {
            q: 'How do I swap USDT for USD1?',
            a: 'Switch to the USDT → USD1 pair on Flash, enter an amount, and swap at the protocol rate with on-chain settlement.',
          },
          {
            q: 'Can I swap USD1 back to USDT?',
            a: 'Flash is one-way USDT→USD1. Use Trade for market swaps to other assets.',
          },
        ],
      },
    },
    trade: {
      title: 'Trade',
      intro: 'PancakeSwap live rate · on-chain settlement',
      action: 'Trade',
      priceImpact: 'Price impact',
      estimatedGas: 'Est. network gas',
      highPriceImpactWarning:
        'This trade may move the pool price significantly. Try a smaller amount or increase slippage tolerance.',
    },
    burn: {
      title: 'Burn',
      subtitle: 'Burn AGX to obtain contribution points',
      sellLabel: 'Burn',
      receiveLabel: 'Receive',
      pointsToken: 'Contribution points',
      currentContribution: 'Current contribution',
      burnRate: 'Burn rate',
      destination: 'Burn destination',
      destinationValue: 'Black hole address, permanently burned',
      providerName: 'AEGIS X',
      openProvider: 'View contribution swap on BscScan',
      action: 'Burn',
      aboutTitle: 'About',
      gates: {
        paused: 'Burn is paused. Please try again later.',
        belowMin: 'Amount is below the minimum burn limit.',
        aboveMax: 'Amount exceeds the maximum burn limit.',
        zeroRate: 'Burn rate is unavailable. Please try again later.',
      },
      metrics: {
        totalBurnedAgx: 'Total AGX burned',
        totalEarnedContribution: 'Total contribution earned',
        totalConsumedContribution: 'Total contribution consumed',
      },
      history: {
        title: 'Burn history',
        empty: 'No burn or consumption records yet',
        tabsAriaLabel: 'Burn history tabs',
        tabs: {
          burn: 'Burn',
          consume: 'Consume',
        },
        burnColumns: ['Time', 'Burned AGX', 'Contribution earned', 'Transaction hash'],
        consumeColumns: ['Time', 'Contribution consumed', 'Transaction hash'],
      },
      faq: {
        items: [
          {
            q: 'What are contribution points used for?',
            a: 'Contribution points are required when claiming mixed rewards with restake. Restake and lucky-pool claims consume points based on the reward amount.',
          },
          {
            q: 'Why do I need contribution points to claim rewards?',
            a: 'The protocol uses contribution points to gate reward claims and restake flows. If your balance is insufficient, the claim reverts — burn AGX first to add points.',
          },
          {
            q: 'What is the burn rate?',
            a: 'The burn rate is set on-chain (rateBps). Each AGX burned yields contribution points at contribution = AGX × rateBps ÷ 10000.',
          },
          {
            q: 'Where does burned AGX go?',
            a: 'A portion is sent to a black-hole address and permanently destroyed; the remainder may be injected into LP per contract split settings.',
          },
          {
            q: 'Can contribution points be transferred or refunded?',
            a: 'Contribution points are account-bound ledger balances on AgxContributionSwap. They cannot be transferred or refunded to AGX.',
          },
        ],
      },
    },
    turbine: {
      title: 'Turbine',
      segmentAriaLabel: 'Turbine actions',
      segments: {
        unlock: 'Unlock',
        claim: 'Claim',
      },
      unlockLabel: 'Unlock gAGX',
      unlockable: 'Unlockable',
      equivalentBuyHint: 'Unlocking also executes an equal buy',
      payUsd1Label: 'Pay USD1',
      buyAgxLabel: 'Buy AGX',
      buyToBoundWallet: 'Buy to bound wallet',
      agxPrice: 'AGX price',
      willReceiveAgx: 'AGX you will receive',
      unlockRatio: 'Unlock ratio',
      unlockRatioValue: '1:1 buy to unlock',
      cooldown: 'Cooldown',
      unlockAction: 'Unlock',
      unlockSuccess: 'Unlocked — cooldown started',
      claimAction: 'Claim',
      claimSuccess: 'Claimed successfully',
      claimEmpty: 'No cooldown records yet',
      claimReady: 'Ready to claim',
      claimCooling: 'Cooling down',
      dataTitle: 'Turbine data',
      aboutTitle: 'About',
      recordsTitle: 'Turbine records',
      recordsEmpty: 'No records yet',
      recordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
      mechanismTitle: 'Turbine mechanism',
      mechanism: [
        {
          title: '1:1 buy to unlock',
          body: 'Pay equal USD1 to buy AGX and unlock the matching Turbine quota into cooldown.',
        },
        {
          title: 'Adaptive cooldown',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'Pending unlock',
        cooling: 'Cooling',
        claimable: 'Claimable',
      },
      faq: {
        items: [
          {
            q: 'What does Turbine do?',
            a: 'Rewards enter Turbine as unlockable quota. Buy AGX with USD1 1:1 to start cooldown, then claim gAGX when vested.',
          },
          {
            q: 'Why USD1?',
            a: 'The handbook path settles unlock with USD1. On-chain quotes determine the exact payment amount.',
          },
          {
            q: 'How do I claim after cooldown?',
            a: 'Open the Claim tab and claim vested rows. After a successful claim the silence list is re-fetched.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'About AEGIS X ecosystem tokens',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Core settlement asset',
          body: 'The core settlement asset of the AEGIS X ecosystem, connecting value circulation, liquidity networks, and payment scenarios.',
        },
        {
          key: 'agx',
          title: 'AGX · Core protocol asset',
          body: 'AGX is the core asset of the AEGIS X protocol, generated through a 150% over-collateralization mechanism, and plays a key role in value growth, yield distribution, and ecosystem development.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Reward settlement voucher',
          body: 'A protocol reward settlement voucher redeemable for AGX and used in ecosystem mining and yield recycling.',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
        },
      ],
    },
    tokenContract: 'View contract',
    tokenPrevious: 'Previous token',
    tokenNext: 'Next token',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: 'Trade',
          items: [
            {
              q: 'What is the difference between Trade and Flash Swap?',
              a: 'Trade swaps USD1, AGX, X and other ecosystem tokens on PancakeSwap at live market rates with customizable slippage and gas fees. Flash Swap is a protocol 1:1 gAGX↔AGX conversion with no fee or slippage.',
            },
            {
              q: 'What is allowed slippage and how do I set it?',
              a: 'Slippage is price movement between submission and settlement. Allowed slippage is the maximum deviation you accept—use the default or a custom percent. If realized slippage exceeds your setting the trade reverts (gas may still be spent). Too low fails easily; too high may fill at a worse price.',
            },
            {
              q: 'How does Trade settle, and are there fees?',
              a: 'Trades settle on PancakeSwap on-chain. AEGIS X charges no extra swap fee, but every on-chain tx needs BSC gas in BNB—keep enough BNB in your wallet.',
            },
            {
              q: 'Why can the received amount differ from the estimate?',
              a: 'Estimates use the rate at quote time. Market moves or other trades can change the fill; the final amount is what settles on-chain within your slippage limit.',
            },
            {
              q: 'Which tokens can I trade?',
              a: "You can swap among AEGIS X ecosystem tokens (USD1, AGX, X) at market rates. Use the tabs above for each token's details.",
            },
            {
              q: 'Where can I see trade history?',
              a: 'Trades execute on-chain and settle in seconds. Confirm each tx in your wallet or a block explorer.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: 'What is USD1?',
              a: "USD1 is AEGIS X's core settlement asset. It is backed 100% by reserves such as cash, short-term U.S. Treasuries, and government money-market funds; monthly reports are on WLFI.",
            },
            {
              q: 'What role does USD1 play in AEGIS X?',
              a: 'USD1 serves as the core settlement asset, connecting liquidity networks, payment scenarios, and ecosystem value flows.',
            },
            {
              q: 'How do I swap USD1?',
              a: 'Users can quickly swap USDT for USD1 through on-chain swap functionality to participate in the AEGIS X ecosystem.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: 'What is AGX?',
              a: 'AGX is the core asset of the AEGIS X protocol, minted through a 150% over-collateralization mechanism, and plays a key role in value growth, yield distribution, and ecosystem development.',
            },
            {
              q: 'How does AGX achieve sustained growth?',
              a: 'Through staking, bonds, and Rebase, AGX forms a long-term compounding cycle, combined with AI think-tank market making and a buyback-and-burn mechanism.',
            },
            {
              q: 'How do I get AGX?',
              a: 'Users can obtain AGX by participating in the protocol ecosystem, or acquire it through trading markets supported by the protocol.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: 'What is gAGX?',
              a: 'gAGX is the protocol reward settlement voucher, used to connect yield growth with ecosystem value, and can participate in ecosystem mining.',
            },
            {
              q: 'How do I get gAGX?',
              a: 'After participating in protocol yield distribution, users receive a corresponding amount of gAGX.',
            },
            {
              q: 'What is the difference between gAGX and AGX?',
              a: 'AGX is the core protocol asset, responsible for value growth and yield distribution; gAGX is the ecosystem yield voucher, redeemable for AGX, and serves as a key entry point for participating in ecosystem mining.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: 'What is X?',
              a: 'X is the AEGIS X ecosystem value token, with a fixed total supply of 210 million, carrying ecosystem growth and value accumulation.',
            },
            {
              q: 'How do I get X?',
              a: 'Users can earn X rewards by participating in ecosystem mining, sharing in the ecosystem growth value.',
            },
            {
              q: 'How is the X airdrop released?',
              a: 'X value comes from ecosystem growth, value accumulation, and long-term development consensus, making it a key carrier of ecosystem value.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'View token and contract details',
  },
  genesis: {
    title: 'Kế hoạch cùng xây dựng',
    intro: 'Tham gia kế hoạch cùng xây dựng X DAO · Giai đoạn {season}  (giảm giá {discount})',
    shares: 'Phần (1 phần = 100 USD1 · tối đa {max} phần)',
    quota: 'Hạn mức cùng xây dựng giai đoạn này',
    pay: 'Thanh toán',
    receive: 'Sẽ nhận AGX',
    value: 'Giá trị đăng ký',
    xTokenAirdrop: 'Giá trị airdrop X ban đầu dự kiến',
    xTokenAirdropHint:
      'Phần thưởng airdrop yêu cầu tổng tham gia cùng xây dựng theo giai đoạn ≥ {threshold}.',
    join: 'Tham gia cùng xây dựng',
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
    seasonLive: 'Đang diễn ra',
    seasonEnded: 'Đã kết thúc',
    seasonUpcoming: 'Sắp bắt đầu',
  },
  rewards: {
    title: 'Phần thưởng cùng xây dựng',
    intro: 'Tham gia cùng xây dựng · Chia sẻ giá trị tăng trưởng',
    currentTitle: 'Cấp hiện tại',
    postLaunchRankTitle: 'Cấp sau ra mắt',
    teamRewardRate: 'Thưởng nhóm {rate}',
    postLaunch30DayRank: 'Trong 30 ngày sau ra mắt bạn có thể đạt {rank}',
    postLaunchMaxRank: 'Bạn đã đạt cấp cao nhất',
    postLaunchRankTooltip:
      'Sau ra mắt, cấp được tính theo hiệu suất thực tế dựa trên khối lượng đồng xây dựng của nhóm quy đổi sang AGX theo giá chiết khấu.\nCấp hiện tại chỉ dựa trên dữ liệu hiệu suất; sau ra mắt có thể chịu ảnh hưởng của các yếu tố khác như nắm giữ cá nhân và tài khoản giới thiệu trực tiếp hợp lệ.\nDữ liệu chỉ mang tính tham khảo; dữ liệu thực tế sau ra mắt là căn cứ cuối cùng.',
    superCommunityBadge: 'Siêu hệ thống',
    heroTierRewardBody: 'Nhận {bonus} từ khối lượng đồng xây dựng của nhóm làm phần thưởng.',
    superCommunityBenefitBody: 'Siêu hệ thống nhận quỹ phát triển chuyên dụng và quyền quản trị.',
    shareholderHintNoRank: 'Cấp sáng lập',
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
    claimed: 'Đã nhận {amount}',
    claim: 'Nhận vào ví',
    claimSuccess: 'Nhận thưởng thành công',
    claimErrors: {
      zeroAmount: 'Số tiền nhận bằng 0.',
      invalidSigner: 'Chữ ký không hợp lệ, vui lòng lấy lại.',
      alreadyUsed: 'Phần thưởng này đã được nhận.',
      expired: 'Chữ ký đã hết hạn, hãy làm mới và thử lại.',
      noOrder: 'Không có phần thưởng để nhận.',
      failed: 'Nhận thất bại. Vui lòng thử lại sau.',
      confirmSyncFailed:
        'Phần thưởng đã nhận on-chain nhưng đồng bộ thất bại. Hãy làm mới trang — đừng nhận lại.',
    },
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
    communityFundTooltip:
      'Siêu hệ thống nhận 5% quỹ phát triển hệ thống, dành riêng cho vận hành tự chủ, bao gồm nhưng không giới hạn: xây dựng hệ thống, vận hành hàng ngày, họp hệ thống và giảng viên hệ thống.',
    communityFundLocked: 'Chưa mở khóa: {amount}',
    communityFundUnlockedSuffix: 'đã mở khóa',
    communityFundClaimed: 'Bạn đã nhận {amount}',
    communityFundHistory: 'Quỹ phát triển',
    communityFundCumulativeClaimed: 'Tổng đã nhận {amount}',
    communityFundHistoryEmpty: {
      title: 'Chưa có lịch sử quỹ phát triển',
      body: 'Lịch sử nhận quỹ phát triển sẽ hiển thị tại đây khi phần thưởng phát sinh.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Phần thưởng giới thiệu được tính như thế nào?',
          a: 'Phần thưởng giới thiệu là 3%, áp dụng cơ chế quyết toán nén số tiền tương đương, chỉ tính theo phần số tiền tương đương, tài khoản trống không tính tầng phần thưởng, phần thưởng tự động quyết toán.',
        },
        {
          q: 'Cấp sáng lập thăng tiến như thế nào?',
          a: 'Cấp sáng lập từ S1 đến S10, đánh giá theo số tiền cùng xây dựng cá nhân và tổng doanh số hệ thống, cấp cao cần đáp ứng điều kiện thăng tiến hai khu vực.',
        },
        {
          q: 'Phần thưởng nâng cấp cấp là gì?',
          a: 'Cấp sáng lập đạt được trong thời gian cùng xây dựng sẽ tự động nâng 1 cấp sau khi giao thức ra mắt, có hiệu lực 30 ngày, sau đó trở về cấp thực tế.',
        },
        {
          q: 'Phần thưởng nhóm sáng lập được quyết toán như thế nào?',
          a: 'Phần thưởng nhóm sáng lập được quyết toán tự động theo tỷ lệ cấp sáng lập tương ứng; người dùng phải tự nhận vào ví. Sau khi kỳ cùng xây dựng kết thúc, trang hiện tại sẽ đóng, phần thưởng chưa nhận không thể nhận nữa, phần thưởng sẽ chuyển vào hợp đồng market maker thông minh.',
        },
      ],
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
    inviteTitle: 'Bắt đầu mời · Chia sẻ giá trị tăng trưởng hệ sinh thái',
    programs: {
      title: 'Kế hoạch hỗ trợ hệ sinh thái',
      items: [
        {
          label: 'Cùng xây dựng Sáng lập · Giai đoạn {season}',
          title: 'Chương trình Thống đốc Dự trữ Sáng lập',
          body: 'Mở ghế cùng xây dựng toàn cầu đầu tiên',
          action: 'Xem chi tiết kế hoạch →',
          href: 'https://xdaoaegis.notion.site/ch-ng-tr-nh-h-i-ng-d-tr-genesis-',
        },
        {
          label: 'Học viện X',
          title: 'Học viện DeFi toàn cầu · Học viện lãnh đạo toàn cầu thời đại kinh tế số',
          body: 'Đào tạo lãnh đạo cho thời đại · Dự trữ nhân tài cho tương lai',
          action: 'Xem chi tiết kế hoạch →',
          href: 'https://xdaoaegis.notion.site/h-c-vi-n-x-vn',
        },
      ],
    },
    myInvites: 'Thành viên cộng đồng của tôi ({count})',
    referralBondPermanent: 'Quan hệ giới thiệu đã kích hoạt · Liên kết vĩnh viễn.',
    volumePrefix: 'Doanh số',
    genesisShareholder: 'Thống đốc Dự trữ Sáng lập',
    statToday: 'Hôm nay +{count} · +{amount}',
    statGenesisToday: 'Tự động nâng 1 cấp sau ra mắt',
    postLaunchRankLabel: 'Cấp sau ra mắt',
    totalTeamVolume: 'Tổng hiệu suất {amount}',
    postLaunch30DayBoost: 'Nâng lên {rank} trong 30 ngày sau ra mắt',
    postLaunchMaxRank: 'Bạn đã đạt cấp cao nhất',
    bindReferrerSuccess: 'Liên kết người giới thiệu thành công',
    inviteFlow: {
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
          title: 'Nhận phần thưởng cùng xây dựng',
          body: 'Sau khi đối tác tham gia cùng xây dựng, phần thưởng tự động quyết toán vào địa chỉ ví của bạn bởi hợp đồng thông minh.',
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
          q: 'Phần thưởng giới thiệu Genesis được tính như thế nào?',
          a: 'Phần thưởng giới thiệu Genesis là 3%, áp dụng cơ chế thanh toán số tiền tương đương nén — chỉ tính phần số tiền tương đương.',
        },
        {
          q: 'Làm sao nâng cấp cấp Genesis của tôi?',
          a: 'Thăng tiến dần từ S1 đến S10 dựa trên số tiền cùng xây dựng cá nhân và thành tích hệ thống.',
        },
      ],
    },
  },
  assets: {
    title: 'Assets',
    body: 'Assets overview is coming soon.',
  },
  staking: {
    title: 'Staking',
    body: 'Staking is coming soon.',
  },
  release: {
    title: 'Release',
    body: 'Release schedule is coming soon.',
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
    communityVolume: 'Doanh số cộng đồng',
    contribution: 'Đăng ký',
  },
}) satisfies AppMessagesBundle

export default app
