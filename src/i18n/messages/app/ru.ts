import { defineMessages } from '~/i18n/messages/define-messages'
import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Подключить кошелёк',
    language: 'Язык',
    copy: 'Копировать',
    claimable: 'Доступно к получению',
    max: 'Макс.',
    shareUnit: 'долей',
    confirm: 'Подтвердить',
    close: 'Закрыть',
    paginationTotal: 'Всего {total}',
    paginationPerPage: '{size} на странице',
    paginationPrev: 'Предыдущая страница',
    paginationNext: 'Следующая страница',
  },
  errors: {
    api: {
      network: 'Ошибка сети. Проверьте подключение и повторите попытку.',
      timeout: 'Время ожидания истекло. Повторите попытку позже.',
      unavailable: 'Сервис временно недоступен. Повторите попытку позже.',
      badResponse: 'Некорректный ответ сервера. Повторите попытку позже.',
      fallback: 'Что-то пошло не так. Повторите попытку позже.',
    },
    chain: {
      fallback: 'Ончейн-действие не выполнено. Повторите попытку позже.',
    },
    walletNotConnected: 'Сначала подключите кошелёк и войдите.',
    quoteFailed: 'Не удалось получить котировку. Повторите попытку позже.',
    loadFailed: 'Не удалось загрузить. Повторите попытку позже.',
    loginFailed: 'Не удалось войти. Повторите попытку позже.',
    loginSignatureRejected: 'Подпись входа недействительна или истекла. Подпишите снова.',
    pageLoadFailed: 'Не удалось загрузить страницу',
    pageLoadFailedBody: 'Ошибка при отрисовке. Обновите страницу — кошелёк останется подключённым.',
    reloadPage: 'Обновить страницу',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'Со-строительство',
    rewards: 'Награды',
    release: 'Release',
    community: 'Сообщество',
    rewardsTooltip: 'Просматривайте реферальные и командные награды.',
    communityTooltip:
      'Приглашайте партнёров к со-строительству, делитесь ростом экосистемы и наградами Genesis.',
    bscTooltip:
      'Только BSC · AEGIS X работает в BNB Smart Chain. Переключение сети пока не поддерживается.',
  },
  topbar: {
    currentNetwork: 'Текущая сеть',
    openMenu: 'Открыть навигацию',
    closeMenu: 'Закрыть навигацию',
    hideDetails: 'Скрыть панель деталей',
    showDetails: 'Показать панель деталей',
    toggleTooltip: 'Показать или скрыть панель деталей',
  },
  onboarding: {
    chip: 'Tutorial',
    skip: 'Skip',
    prev: 'Back',
    next: 'Next',
    done: 'Done',
    steps: [
      {
        title: 'Exchange',
        body: 'Use Exchange to swap major tokens for AEGIS X ecosystem tokens (AGX, gAGX, X) at market rates.',
      },
      {
        title: 'Trade',
        body: 'Use Trade to buy AGX with USD1.',
      },
      {
        title: 'Staking',
        body: 'Staking is where yield starts: stake AGX or buy bonds to earn compound rewards on every Rebase.',
      },
      {
        title: 'Single-asset stake',
        body: 'Stake AGX in the Stake card. Rebase twice daily compounds; longer lockups earn higher yield boosts.',
      },
      {
        title: 'Assets',
        body: 'Assets summarizes all positions: stake, LP bonds, burn bonds, and X mining holdings and rewards.',
      },
      {
        title: 'Stake positions',
        body: 'In the Assets Stake card, review holdings and total rewards, then claim, compound, or redeem.',
      },
      {
        title: 'Release',
        body: 'Release manages pending funds: rewards enter the release pool / buffer pool and unlock linearly by period.',
      },
      {
        title: 'Release pool',
        body: 'Claimed rewards unlock linearly over 5 / 20 / 40 / 60 days; released amounts can move into Turbine.',
      },
      {
        title: 'Buffer pool',
        body: 'Redeemed principal unlocks linearly over ~30 days of blocks; released amounts can be withdrawn anytime.',
      },
      {
        title: 'Turbine',
        body: 'gAGX from the release pool stays locked until you unlock it 1:1 with USD1 in Turbine.',
      },
      {
        title: 'Rewards',
        body: 'Rewards include referral, participation, co-build, and more. Claiming spends contribution points 1:1.',
      },
      {
        title: 'Community',
        body: 'Community shows your team: invite link, members, and co-build tier live here.',
      },
    ],
  },
  dapp: {
    connect: {
      promoTitle: 'Подключитесь, чтобы изучить функции AEGIS X',
      promoBrandLine: 'Защитите сеть будущей ценности',
      recordsTitle: 'Подключите кошелёк, чтобы просмотреть записи',
      recordsBodyGenesis: 'После подключения здесь появится история вашего со-строительства.',
      recordsBodyRewards: 'После подключения здесь появится история ваших наград.',
      recordsBodyCommunity: 'После подключения здесь появятся записи ваших приглашений.',
    },
  },
  wallet: {
    connectTitle: 'Подключить кошелёк',
    connectIntroTitle: 'Подключите кошелёк, чтобы изучить функции AEGIS X',
    connectIntroLink: 'Функции AEGIS X ↗',
    connecting: 'Подключение…',
    copyAddress: 'Копировать адрес',
    copied: 'Скопировано',
    copyFailed: 'Не удалось скопировать. Удерживайте для ручного копирования.',
    disconnect: 'Отключить',
    reconnectWallet: 'Переподключить кошелёк',
    reconnectHint: 'Кошелёк отключён. Подключите его снова для операций на блокчейне.',
    signInRequired: 'Войти',
    accountBanned: 'Аккаунт заблокирован. Обратитесь в поддержку.',
    transactionErrors: {
      gasLimitTooLow:
        'Слишком низкий лимит gas. Оставьте в кошельке достаточно BNB для сетевой комиссии и повторите попытку.',
      gasEstimateFailed:
        'Не удалось оценить gas для этой транзакции. Проверьте сеть и повторите попытку.',
      insufficientFunds: 'Недостаточно BNB для оплаты сетевой комиссии gas.',
      transactionFailed: 'Транзакция не удалась. Повторите попытку позже.',
      transactionUnknown:
        'Статус транзакции неизвестен. Не отправляйте повторно — сначала проверьте кошелёк или обозреватель блоков.',
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
          body: 'Buy unlocked Turbine gAGX with USD1',
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
          { title: 'Get contribution points', body: 'Burn AGX at {ratio} for contribution points' },
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
      aboutTitle: 'About',
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
        pendingUnlock: 'Pending unlock gAGX',
        cooling: 'Cooling gAGX',
        totalWithdrawn: 'Total withdrawn',
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
    title: 'Программа со-строительства',
    intro: 'Участие в программе со-строительства X DAO · Фаза {season}  (скидка {discount})',
    shares: 'Доли (1 доля = 100 USD1 · макс. {max} долей)',
    quota: 'Квота со-строительства текущей фазы',
    pay: 'Оплата',
    receive: 'Получите AGX',
    value: 'Стоимость подписки',
    xTokenAirdrop: 'Ожидаемая начальная стоимость аирдропа X',
    xTokenAirdropHint:
      'Награды аирдропа доступны при накопленном участии в со-строительстве за фазу ≥ {threshold}.',
    join: 'Участвовать в со-строительстве',
    joinGenesis: 'Участвовать в со-строительстве Genesis',
    statsTitle: 'Данные со-строительства фазы {season}',
    startsIn: 'До начала',
    countdownUnits: { days: 'д', hours: 'ч', minutes: 'м' },
    endsIn: 'Осталось в этой фазе',
    referencePrice: 'Справочная цена открытия AGX',
    discountLabel: 'Скидка',
    discountRatio: 'Размер скидки в этой фазе',
    xAirdropRatio: 'Доля airdrop X',
    airdropLabel: 'Доля airdrop X',
    myContributions: 'Мои записи о со-строительстве',
    totalContributed: 'Со-строительство за фазу',
    cumulativeContributed: 'Совокупное со-строительство',
    globalLabel: 'Глобальный совокупный вклад',
    globalBody:
      'Ключевые со-строители со всего мира объединяются для развития глобальной экосистемы AEGISX.',
    viewContract: 'Просмотр контракта',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Как участвовать в программе со-строительства?',
          a: 'Пользователи участвуют в со-строительстве с USD1 и получают AGX со скидкой соответствующей фазы. {phaseCount} фаз, скидки: {discounts}.',
        },
        {
          q: 'Квота и требования к участию?',
          a: 'Минимальная сумма — {minUsd}, участие кратно {shareIncrement} USD1. Квоты по фазам: {phaseQuotas}.',
        },
        {
          q: 'Каков период со-строительства?',
          a: 'AGX, полученный за участие в со-строительстве, высвобождается в течение 540 дней.',
        },
        {
          q: 'Как получить награду airdrop X?',
          a: 'При совокупном участии одного аккаунта от {threshold} открывается право на airdrop X соответствующей фазы. Доли airdrop для {phaseCount} фаз: {airdropRatios}.',
        },
        {
          q: 'Как высвобождается награда airdrop X?',
          a: 'Награды airdrop X высвобождаются линейно в течение 12 месяцев (~8,33% в месяц); первое высвобождение — на 30-й день после запуска протокола стейкинга X, автоматически смарт-контрактом.',
        },
      ],
    },
    promoTitleTemplate: 'Со-строительство Genesis Фаза {season}  скидка {discount}',
    promoLive: 'Идёт сейчас — ограниченная квота, до {endDate}',
    promoUpcoming: 'Скоро — ограниченная квота, начало {startDate}',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Подписка выполнена',
    insufficientUsd1: 'Недостаточно USD1. Пополните баланс перед участием в подписке.',
    insufficientAllowance: 'Недостаточно allowance USD1. Сначала выполните одобрение.',
    purchaseUnavailable:
      'Участие сейчас недоступно. Проверьте количество долей или статус фазы подписки.',
    walletNotConnected: 'Кошелёк отключён. Подключите его снова, чтобы подписать транзакцию.',
    errors: {
      notBound: 'Привяжите реферера перед участием.',
      paused: 'Подписка приостановлена. Повторите попытку позже.',
      invalidAmount: 'Сумма должна быть кратна 100 USD.',
      phaseInactive: 'Эта фаза не началась или уже завершена.',
      belowMin: 'Сумма меньше минимума этой фазы.',
      soldOut: 'Эта фаза распродана.',
      userLimitExceeded: 'Превышен лимит на кошелёк в этой фазе. Уменьшите сумму.',
      invalidPhase: 'Недействительная фаза.',
      systemConfig: 'Ошибка конфигурации системы. Повторите попытку позже.',
    },
    contributionsSyncPending:
      'Подписка в сети подтверждена. История синхронизируется — обновите страницу позже.',
    contributionsEmpty: {
      title: 'Записей о со-строительстве пока нет',
      body: 'Программа со-строительства завершена. У не участвовавших аккаунтов здесь нет записей.',
    },
    goBindReferrer: 'Привязать реферера',
    seasonLive: 'Идёт',
    seasonEnded: 'Завершён',
    seasonUpcoming: 'Скоро',
  },
  rewards: {
    title: 'Rewards',
    intro: 'View reward card balances and payout records.',
    backToHub: 'Back to rewards',
    claim: 'Claim',
    claimSuccess: 'Claimed successfully',
    claimErrors: {
      zeroAmount: 'Claim amount is 0.',
      invalidSigner: 'Invalid signature. Refresh and try again.',
      alreadyUsed: 'This reward was already claimed.',
      expired: 'Signature expired. Refresh and claim again.',
      noOrder: 'No reward available to claim.',
      failed: 'Claim failed. Please try again later.',
      confirmSyncFailed:
        'Claim succeeded on-chain but sync failed. Refresh the page and do not claim again.',
    },
    hub: {
      asideTitle: 'About AEGIS X rewards',
      asideBody:
        'Six reward cards cover lucky draws, referral, participation, co-build, development stipend, and genesis co-build.',
      aboutTitle: 'About AEGIS X rewards',
      balanceLabel: 'Balance',
      balancePlaceholder: '—',
      signInForBalance: 'Sign in to view',
      enterClaim: 'Enter to claim',
      sessionHint:
        'Complete wallet sign-in before claiming. Connecting a wallet is not the same as a business login.',
      stats: {
        totalRewards: 'Total rewards',
        tier: 'Co-build tier',
        tierEmpty: 'No co-build tier yet',
        personalHolding: 'Personal holding',
        totalPerformance: 'Total performance',
        smallAreaPerformance: 'Small-area performance',
        contribution: 'Contribution points',
        contributionHint: 'Mixed claims consume contribution points 1:1.',
        goClaim: 'Go claim',
        goBurn: 'Go burn →',
      },
      mechanismTitle: 'Co-build reward mechanism',
      mechanismBody: 'Co-build rewards come from team Rebase yield and are shared by tier.',
      hideZero: 'Hide zero balances',
      hideZeroEmpty: 'No non-zero reward cards. Turn off Hide zero balances to see all entries.',
      aboutSlides: {
        lucky: {
          title: 'Lucky',
          body: 'Block-lucky draws for co-builders; claim via Mixed when won.',
        },
        referral: {
          title: 'Referral',
          body: 'Earn 10% of each direct referral Rebase yield, settled on-chain. Keep your position value above $100.',
        },
        participate: {
          title: 'Participate',
          body: 'Rewards from your referrer via IncentivePool signed claims.',
        },
        cobuild: {
          title: 'Co-build',
          body: 'Long-term team incentives by tier; Mixed claims require contribution points.',
        },
        grant: {
          title: 'Growth grant',
          body: 'Ecosystem grant via MarketFund signed claims.',
        },
        genesis: {
          title: 'Genesis co-build',
          body: 'Genesis referral, tier, and growth-fund rewards; claims close after settlement ends.',
        },
      },
      tierTable: {
        columns: ['Tier', 'Holding', 'Active accounts', 'Team volume', 'Bonus rate'],
        rows: [
          { level: 'A1', holding: '$100', accounts: '2', team: '—', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: 'Volume ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: 'Volume ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$100', accounts: '3', team: 'Two lines reach A3', rate: '40%' },
          { level: 'A5', holding: '$500', accounts: '3', team: 'Two lines reach A4', rate: '50%' },
          {
            level: 'A6',
            holding: '$1,000',
            accounts: '4',
            team: 'Two lines reach A5',
            rate: '60%',
          },
          {
            level: 'A7',
            holding: '$2,000',
            accounts: '4',
            team: 'Two lines reach A6',
            rate: '70%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '5',
            team: 'Two lines reach A7',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '5',
            team: 'Two lines reach A8',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '5',
            team: 'Two lines reach A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '5',
            team: 'Two lines reach A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '5',
            team: 'Two lines reach A11',
            rate: '128%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '5',
            team: 'Two lines reach A12',
            rate: '138%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Lucky',
        body: 'Block lucky draw for co-builders',
        aside: 'Lucky rewards use Chainlink VRF; winners claim via Mixed.',
      },
      referral: {
        title: 'Referral',
        body: 'Rewards for inviting partners into co-build',
        aside: 'Referral rewards are claimed via CommunityFund signatures.',
      },
      participate: {
        title: 'Participation',
        body: 'Rewards from your referrer',
        aside: 'Participation rewards are claimed via IncentivePool signatures.',
      },
      cobuild: {
        title: 'Co-build',
        body: 'Long-term team co-build incentive rewards',
        aside: 'Co-build rewards use DaoPool Mixed and require contribution points.',
      },
      grant: {
        title: 'Development stipend',
        body: 'Ecosystem development stipend',
        aside: 'Development grants are claimed via MarketFund signatures.',
      },
      genesis: {
        title: 'Genesis co-build rewards',
        body: 'Genesis direct, tier, and development fund rewards',
        aside: 'Genesis co-build rewards are claimed via RewardClaimer signatures.',
        badge: 'Closing soon',
      },
    },
    detail: {
      claimable: 'Claimable',
      emptyClaimable: 'No reward available to claim.',
      signedAmountHint: 'Claimable amount follows the signed payload',
    },

    claimHistory: {
      title: 'Grant & claim history',
      columns: ['Time', 'Type', 'Amount', 'Tx hash'],
      empty: 'No records yet',
    },

    mixed: {
      splitAria: 'Claim vs restake split',
      releasePct: 'Claim {pct}%',
      restakePct: 'Restake {pct}%',
      releasePeriod: 'Release period',
      restakePeriod: 'Restake period',
      releaseAria: 'Release period',
      restakeAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      requiredContribution: 'Contribution required this claim: {amount}',
      insufficientContribution: 'Insufficient contribution points. Burn to top up.',
      goBurn: 'Get contribution points',
      luckyPaused: 'Lucky pool is paused; claims are unavailable.',
      luckyNotClaimable: 'No lucky reward available to claim.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'How are rewards paid out?',
          a: 'Most rewards are shown in AGX / gAGX terms; genesis co-build rewards follow RewardClaimer assets. Mixed claims send the release portion to the release queue.',
        },
        {
          q: 'What is required to claim?',
          a: 'Simple signed claims need a claimable balance and a valid signature. Lucky / DaoPool Mixed also need enough contribution points and a release/restake split.',
        },
        {
          q: 'When do claimed rewards arrive?',
          a: 'After the on-chain transaction confirms. The release portion unlocks over the selected period; the restake portion enters the matching stake position.',
        },
        {
          q: 'When are rewards settled?',
          a: 'Each source settles by contract and backend scan rules. The frontend uses claimable balances and signed payloads as source of truth.',
        },
        {
          q: 'Why do some cards hide amounts?',
          a: 'Disconnected or unsigned sessions show a sign-in hint, not an empty reward. After sign-in, — means nothing claimable or data is not ready yet.',
        },
      ],
    },

    // legacy keys retained for history helpers / gradual deletion
    currentTitle: 'Текущий уровень',
    postLaunchRankTitle: 'Уровень после запуска',
    teamRewardRate: 'Командная награда {rate}',
    postLaunch30DayRank: 'В течение 30 дней после запуска вы можете достичь {rank}',
    postLaunchMaxRank: 'Вы достигли максимального уровня',
    postLaunchRankTooltip:
      'После запуска уровень рассчитывается по реальным показателям на основе объёма командного со-строительства, конвертированного в AGX по скидочной цене.\nТекущий уровень основан только на данных о показателях; после запуска могут учитываться другие факторы, например личные активы и квалифицированные прямые рефералы.\nДанные приведены для справки; окончательными являются данные после запуска.',
    superCommunityBadge: 'Суперсистема',
    heroTierRewardBody: 'Получайте {bonus} от объёма командного со-строительства в виде награды.',
    superCommunityBenefitBody: 'Суперсистемы получают целевой фонд развития и права управления.',
    shareholderHintNoRank: 'Уровень Genesis',
    shareholderNoRankTitle: 'Вы ещё не стали управляющим резервом Genesis',
    shareholderNoRankBody:
      'Став управляющим резервом Genesis, вы получаете 1%-10% от суммы командного со-строительства в виде наград и повышаете уровень на 1 в течение 30 дней после запуска AEGIS X.',
    shareholderTitleForRank: '{rank} · Управляющий резервом Genesis',
    heroKicker: 'Уровень Genesis',
    currentTierSuffix: 'текущий',
    progressPersonalTo: 'До {rank} · личная подписка',
    progressMaxPersonal: 'Достигнут максимальный личный уровень',
    progressMaxTeam: 'Достигнут максимальный командный уровень',
    teamLegRequirement: 'Две линии {rank}',
    tierDualLegRequirement: '2 линии {rank}',
    teamQualifiedPartitionsLabel: 'Линии {rank} {count}/2',
    teamVolume: 'Объём системы',
    referralRewards: 'Прямые реферальные награды',
    autoPaidLabel: 'Автовыплата',
    autoPaid: 'Награды автоматически зачисляются на кошелёк',
    teamRewards: 'Награды за уровень',
    claimed: 'Получено {amount}',
    heroTitle: 'Текущий уровень',
    allTiers: 'Система почёта Genesis',
    history: 'История наград',
    referralHistoryEmpty: {
      title: 'Записей о реферальных наградах пока нет',
      body: 'Реферальные награды появятся здесь после подписки ваших рефералов в период Genesis.',
    },
    teamHistoryEmpty: {
      title: 'Записей о командных наградах пока нет',
      body: 'История расчёта и получения командных наград появится здесь после их начисления.',
    },
    communityFund: 'Фонд развития',
    communityFundTooltip:
      'Суперсистемы получают 5% фонда развития системы для самообеспечения системы, включая, но не ограничиваясь: строительство системы, ежедневные операции, системные встречи и системных лекторов.',
    communityFundLocked: 'Заблокировано: {amount}',
    communityFundUnlockedSuffix: 'разблокировано',
    communityFundClaimed: 'Вы получили {amount}',
    communityFundHistory: 'Фонд развития',
    communityFundCumulativeClaimed: 'Всего получено {amount}',
    communityFundHistoryEmpty: {
      title: 'Записей фонда развития пока нет',
      body: 'История получения фонда развития появится здесь после начисления наград.',
    },
    rewardType: {
      referralPaid: 'Реферальная награда',
      referralWithdrawn: 'Получение реферальной награды',
      marketTeam: 'Командная награда за маркетмейкинг',
      presaleTeam: 'Командная награда за пресейл',
      unknown: '—',
    },
    logStatus: {
      pending: 'В ожидании',
      processing: 'Обработка',
      paid: 'Оплачено',
      claimed: 'Получено',
      failed: 'Ошибка',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'Вы уже привязали реферера.',
      parentNotBound: 'Реферер ещё не привязан. Свяжитесь с ним.',
      selfReferral: 'Нельзя использовать свой собственный адрес.',
      invalidParent: 'Введите действительный адрес реферера.',
      migratedAccount: 'Этот адрес перенесён. Используйте новый адрес.',
      systemConfig: 'Ошибка конфигурации системы. Повторите попытку позже.',
      failed: 'Не удалось привязать. Повторите попытку позже.',
    },
    title: 'Сообщество',
    intro:
      'Приглашайте партнёров к со-строительству, делитесь ростом экосистемы и наградами Genesis.',
    disconnectedIntro:
      'Подключите кошелёк, чтобы создать реферальную ссылку и привязать пригласившего.',
    referralLink: 'Моя реферальная ссылка',
    shareReferral: 'Копировать ссылку',
    referrer: 'Мой реферер',
    bindReferrer: 'Привязать',
    referrerPlaceholder: 'Введите адрес реферера (0x…)',
    referrerHint:
      'После активации реферальной связи она действует постоянно и не может быть изменена.',
    docs: 'Материалы',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Участвовать в со-строительстве',
    myCommunity: 'Моё сообщество',
    directReferrals: 'Прямые рефералы',
    myTeam: 'Участники сообщества',
    genesisTitle: 'Текущий',
    inviteTitle: 'Начните приглашать · делитесь ростом экосистемы',
    programs: {
      title: 'Программы поддержки экосистемы',
      items: [
        {
          label: 'Со-строительство Genesis · Фаза {season}',
          title: 'Программа управляющих резервом Genesis',
          body: 'Открыты первые глобальные места со-строительства',
          action: 'Подробнее о программе →',
          href: '',
        },
        {
          label: 'Академия X',
          title:
            'Глобальная DeFi-академия · Глобальная академия лидерства эпохи цифровой экономики',
          body: 'Готовим лидеров для эпохи · Резервируем таланты для будущего',
          action: 'Подробнее о программе →',
          href: 'https://xdaoaegis.notion.site/x-academy-en',
        },
      ],
    },
    myInvites: 'Участники моего сообщества ({count})',
    referralBondPermanent: 'Реферальная связь активирована · привязка постоянна.',
    volumePrefix: 'Объём',
    genesisShareholder: 'Управляющий резервом Genesis',
    statToday: 'Сегодня +{count} · +{amount}',
    statGenesisToday: 'Автоповышение на 1 уровень после запуска',
    postLaunchRankLabel: 'Уровень после запуска',
    totalTeamVolume: 'Общий объём {amount}',
    postLaunch30DayBoost: 'Повышение до {rank} в течение 30 дней после запуска',
    postLaunchMaxRank: 'Вы достигли максимального уровня',
    bindReferrerSuccess: 'Реферер успешно привязан',
    inviteFlow: {
      items: [
        {
          title: 'Поделитесь реферальной ссылкой',
          body: 'Подключите кошелёк и укажите реферера, чтобы создать персональную реферальную ссылку.',
        },
        {
          title: 'Партнёры участвуют в со-строительстве',
          body: 'После регистрации по вашей ссылке партнёры могут участвовать в со-строительстве.',
        },
        {
          title: 'Получайте награды за со-строительство',
          body: 'После участия партнёров в со-строительстве награды автоматически зачисляются на ваш адрес кошелька смарт-контрактом.',
        },
      ],
    },
    invitesEmpty: {
      title: 'Записей о приглашениях пока нет',
      body: 'Поделитесь реферальной ссылкой, чтобы пригласить друзей в сообщество.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Как устанавливается реферальная связь?',
          a: 'Когда партнёр участвует в со-строительстве по вашей реферальной ссылке, реферальная связь автоматически устанавливается и действует постоянно.',
        },
        {
          q: 'Как рассчитываются реферальные награды Genesis?',
          a: 'Реферальные награды Genesis составляют 3% с механизмом сжатого расчёта по равным суммам — учитывается только равная часть суммы.',
        },
        {
          q: 'Как повысить мой уровень Genesis?',
          a: 'Постепенно повышайтесь от S1 до S10 в зависимости от личного объёма со-строительства и показателей организации.',
        },
      ],
    },
  },
  assets: {
    title: 'Assets',
    intro: 'View positions, claim yield, or redeem principal',
    body: 'View positions, claim yield, or redeem principal',
    backToHub: 'Back to Assets',
    gates: {
      zeroAmount: 'Enter a valid amount',
      insufficientReward: 'Insufficient claimable yield',
      insufficientContribution: 'Not enough contribution points — burn AGX first',
      planUnresolved: 'Release/restake plan not ready — try again later',
      nothingToRedeem: 'Nothing available to redeem',
      warmupActive: 'Warmup still active',
      unavailable: 'Transaction temporarily unavailable',
    },
    position: {
      sort: 'Sort',
      quoteCurrency: 'Quote currency',
      pageSize: 5,
      voucher: 'Voucher',
      remaining: 'Time left',
      staked: 'Staked',
      payout: 'Pending payout',
      yield: 'Yield',
      claim: 'Claim',
      redeem: 'Redeem',
      unlock: 'Unlock',
      unstake: 'Unstake',
      liquid: 'Flexible',
    },
    opsColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
    claim: {
      title: 'Claim yield',
      amount: 'Claim amount',
      splitAria: 'Release vs restake split',
      releaseShare: 'Release {pct}%',
      restakeShare: 'Restake {pct}%',
      releasePeriod: 'Release period',
      releasePeriodAria: 'Release period',
      restakePeriod: 'Restake period',
      restakePeriodAria: 'Restake period',
      releaseDays: '{days}d',
      restakeDays: '{days}d',
      restakeDaysTax: '{days}d · {tax}',
      taxRate: 'tax {rate}%',
      contribNeed: 'This claim requires {amount} contribution',
      contribShort: 'Not enough contribution — burn AGX for points first',
      goBurn: 'Go to Burn',
      ctaMixed: 'Claim & Restake',
      ctaRelease: 'Claim',
      ctaRestake: 'Restake',
      success: 'Claim submitted',
      xmineSuccess: 'X reward claim submitted',
    },
    redeem: {
      title: 'Confirm redeem',
      body: 'Principal enters the release buffer (PrincipalReleaseVault) — not credited to your wallet immediately.',
      confirm: 'Enter buffer',
      cancel: 'Cancel',
      success: 'Redeem submitted — principal entered the release buffer',
    },
    hub: {
      hideZero: 'Hide zero balances',
      hideZeroEmpty:
        'No non-zero positions. Turn off Hide zero balances to see all product entries.',
      emptyHint: 'Pick a product to view positions, or open a position in Staking.',
      card: {
        position: 'Position',
        yield: 'Total yield',
      },
      modes: {
        stake: { title: 'Stake', body: 'Manage AGX flexible / term positions' },
        lpbond: { title: 'LP Bond', body: 'Manage liquidity bond positions' },
        burnbond: { title: 'Burn Bond', body: 'Manage burn bond positions' },
        xmine: { title: 'X Mine', body: 'Manage gAGX mining positions' },
      },
      overview: {
        title: 'Assets overview',
        totalValue: 'Total value',
        claimable: 'Claimable yield',
        claimed: 'Claimed total',
        contribution: 'Contribution points',
        contributionHint: 'Claims consume 1:1 contribution',
        holdingsTitle: 'Holdings',
        holdingsReleased: 'Released',
        holdingsTotal: 'Total holdings',
        bufferTitle: 'Buffer pool',
        bufferTotal: 'Total',
        bufferReleased: 'Released',
        bufferAssetGagx: 'gAGX',
      },
      distribution: {
        title: 'Holdings',
        empty: 'No holdings yet. Stake or buy bonds to see distribution here.',
        cta: 'Go to Staking',
      },
      rebase: {
        title: 'Rebase yield release',
        subtitle:
          'Phased settlement and continuous release reduce volatility and support long-term growth',
        steps: [
          { title: 'Block', body: 'Block runtime\nBase unit' },
          { title: 'Epoch', body: '~14,400 blocks\n~12 hours' },
          { title: 'Rebase', body: 'Epoch end\nAuto settle' },
          { title: 'Rebase', body: 'Yield distribution\nTwice daily' },
        ],
        tags: ['Block-driven', 'Epoch settlement', 'Rebase distribution', 'Smooth release'],
        footer: 'Blocks drive cycles; Epochs settle; Rebase distributes yield',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: 'How is total value calculated?',
            a: 'Sum of product positions and claimable yield valuations; shows — without a quote.',
          },
          {
            q: 'How is yield paid?',
            a: 'Stake/bond yield is in gAGX; X mine yield is in X.',
          },
          {
            q: 'Why do claims need contribution points?',
            a: 'Mixed claims consume contribution per the handbook; burn AGX if short.',
          },
          {
            q: 'Where do contribution points come from?',
            a: 'Burn exchange grants contribution; claims consume them 1:1.',
          },
          {
            q: 'Where does redeemed principal go?',
            a: 'Into PrincipalReleaseVault linear release — not instant wallet credit.',
          },
          {
            q: 'When does holdings distribution appear?',
            a: 'After non-zero positions exist; empty state otherwise.',
          },
          {
            q: 'What is the buffer pool?',
            a: 'Principal exits into the release buffer for secondary linear release; on-chain AGX only.',
          },
          {
            q: 'Why does the buffer show gAGX?',
            a: 'Chrome keeps the asset switch; gAGX exits are converted to AGX — values stay honest —.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Stake positions',
        intro: 'Manage each stake — claim yield or redeem principal anytime',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'My holdings' },
            { label: 'Released' },
            { label: 'Pending release' },
            { label: 'Current Rebase yield' },
            { label: 'Current Rebase bonus' },
            { label: 'Total stake yield' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'Claim vs redeem?',
              a: 'Claim handles yield (optional restake); redeem sends principal to the release buffer.',
            },
            {
              q: 'What is released?',
              a: 'Principal available to redeem after a locked stake matures.',
            },
            {
              q: 'Why is each stake shown separately?',
              a: 'Each open position accrues and releases independently so you can claim or redeem per position.',
            },
            {
              q: 'What happens when the countdown ends?',
              a: 'The position becomes redeemable/operable; on-chain status is authoritative.',
            },
            {
              q: 'How does the restake ratio work when claiming?',
              a: 'Use the slider to split release vs restake, pick periods, then confirm.',
            },
          ],
        },
      },
      lpbond: {
        title: 'LP Bond positions',
        intro: 'Manage liquidity bonds — claim yield or redeem principal',
        empty: 'No LP bond positions',
        emptyCta: 'Buy LP Bond',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Total' },
            { label: 'Pending payout' },
            { label: 'Claimable' },
            { label: 'Claimed' },
            { label: 'Discount' },
            { label: 'Voucher' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'How does redeem credit principal?',
              a: 'redeem(..., false) creates a PRV release entry — not instant.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Burn Bond positions',
        intro: 'Manage burn bonds — claim yield or redeem principal',
        empty: 'No burn bond positions',
        emptyCta: 'Buy Burn Bond',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Total' },
            { label: 'Pending payout' },
            { label: 'Claimable' },
            { label: 'Claimed' },
            { label: 'Discount' },
            { label: 'Voucher' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            {
              q: 'Burn vs LP bond?',
              a: 'Different entry paths; Mixed claim and redeem contracts match.',
            },
          ],
        },
      },
      xmine: {
        title: 'X Mine positions',
        intro: 'Claim X rewards or unstake into the release buffer',
        empty: 'No X mine positions',
        emptyCta: 'Go to X Mine',
        stats: {
          title: 'Position stats',
          metrics: [
            { label: 'Staked' },
            { label: 'Pending X' },
            { label: 'In warmup' },
            { label: 'Mining quota' },
          ],
        },
        ops: { title: 'Activity', empty: 'No activity yet' },
        faq: {
          title: 'FAQ',
          items: [
            { q: 'Why no restake slider?', a: 'X claim is claimReward only — no Mixed split.' },
            { q: 'Where does unstake go?', a: 'startUnstake enters PrincipalReleaseVault.' },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Staking',
    intro: 'Stake AGX, buy bonds, or mine X with gAGX',
    body: 'Stake AGX, buy bonds, or mine X with gAGX',
    backToHub: 'Back to Staking',
    amount: 'Amount',
    balance: 'Balance',
    max: 'Max',
    viewContract: 'View contract',
    gates: {
      notBound: 'Bind a referral first',
      insufficientBalance: 'Insufficient balance',
      insufficientGagx: 'Insufficient gAGX — wrap via Flash first',
      insufficientAllowance: 'Insufficient allowance',
      insufficientQuota: 'Insufficient quota',
      poolPaused: 'This staking pool is paused',
      depositoryNotAuth: 'Bond depository is not authorized',
      zeroAmount: 'Enter a valid amount',
      unavailable: 'Transaction temporarily unavailable — try again later',
    },
    hub: {
      modes: {
        stake: {
          title: 'Stake',
          body: 'Stake AGX for flexible or term yields',
        },
        lpbond: {
          title: 'LP Bond',
          body: 'Buy liquidity bonds with USD1',
        },
        burnbond: {
          title: 'Burn Bond',
          body: 'Buy burn bonds with USD1',
        },
        xmine: {
          title: 'X Mining',
          body: 'Stake gAGX to mine X',
        },
        calc: {
          title: 'Calculator',
          body: 'Local yield estimate — no on-chain writes',
        },
      },
      overview: {
        title: 'Overview',
        metrics: [
          { label: 'TVL' },
          { label: 'Stakers' },
          { label: 'Staked today' },
          { label: 'Flexible APY' },
          { label: 'Term APY' },
          { label: 'Bond discount' },
          { label: 'X mining quota' },
          { label: 'Reward pool' },
          { label: 'Protocol revenue' },
        ],
      },
      periodTable: {
        title: 'Periods & yields',
        segmentAria: 'Period table product',
        segs: {
          stake: 'Stake',
          lpbond: 'LP Bond',
          burnbond: 'Burn Bond',
        },
        columns: ['Period', 'Yield', 'Bonus'],
        rows: [
          { id: 'liquid', period: 'Flexible' },
          { id: '180', period: '180d' },
          { id: '360', period: '360d' },
          { id: '540', period: '540d' },
        ],
      },
      chart: {
        title: 'Metrics',
        metricTabs: {
          tvl: 'TVL',
          mcap: 'Market cap',
        },
        metricAria: 'Metric switch',
      },
      faq: {
        title: 'FAQ',
        items: [
          {
            q: 'What can I do on Staking?',
            a: 'Stake AGX (flexible/term), buy LP or burn bonds with USD1, mine X with gAGX, and run a local calculator. Claims and redeems live on Assets.',
          },
          {
            q: 'Why do I need a referral?',
            a: 'Stake and bond opens require a bound referral. Bind on Community, then retry.',
          },
          {
            q: 'Does the calculator send a transaction?',
            a: 'No. It only estimates locally and never writes on-chain.',
          },
        ],
      },
    },
    aside: {
      overview: 'Overview',
      positions: 'My positions',
      positionsHint: 'Claims, redeems, and unstakes are on the Assets tab.',
      viewPositions: 'View',
      mechanism: 'How it works',
      faq: 'FAQ',
      recordsTitles: {
        stake: 'My staking records',
        lpbond: 'My LP bond records',
        burnbond: 'My burn bond records',
        xmine: 'My mining records',
      },
      recordColumns: ['Time', 'Period', 'Amount', 'Released', 'Tx hash'],
      recordsEmpty: 'No records yet',
      chartTitles: {
        stake: 'TVL (Staking) metrics',
        lpbond: 'TVL (LP Bond) metrics',
        burnbond: 'TVL (Burn Bond) metrics',
        xmine: 'TVL (X Mining) metrics',
      },
      chartRangeAria: 'Chart time range',
      chartRanges: ['1W', '1M', '1Y', 'All'],
      positionMetrics: [
        { label: 'My position' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
        { label: 'Current Rebase bonus' },
      ],
      xValue: {
        title: 'X long-term value',
        supplyLabel: 'X total supply',
        supplyValue: '210,000,000',
        badge: 'Fixed supply · never inflate',
        columns: [
          {
            pct: '47.62%',
            title: 'LP liquidity',
            bullets: ['Initial liquidity build', 'Market making & liquidity support'],
          },
          {
            pct: '52.38%',
            title: 'Global rewards & growth',
            bullets: ['gAGX mining rewards', 'Ecosystem growth incentives'],
          },
        ],
      },
    },

    stake: {
      title: 'Stake',
      intro: 'Stake AGX · rebase twice daily with compounding',
      periodLabel: 'Choose staking period',
      periodAria: 'Choose staking period',
      amountAria: 'Stake amount',
      amountBalance: 'Amount (wallet balance {balance} AGX)',
      submit: 'Stake',
      bindCta: 'Bind referral',
      success: 'Staked successfully',
      warmupCta: 'Activate warmup',
      warmupSuccess: 'Warmup activated',
      periods: {
        liquid: 'Flexible',
        d180: '180d',
        d360: '360d',
        d540: '540d',
      },
      meta: {
        baseDaily: 'Base daily yield',
        periodYield: 'Period yield',
        bonus: 'Yield bonus',
        lock: 'Lock days',
        remaining: 'Remaining quota',
        contract: 'View contract',
        lockLiquid: 'Flexible',
        lockDays: '{days}-day linear release',
      },
      overviewMetrics: [
        { label: 'Total staked' },
        { label: 'Current epoch' },
        { label: 'Next rebase' },
        { label: 'Current rebase yield' },
      ],
      mechanismTitle: 'How staking works',
      mechanism:
        'Flexible stake enters warmup before activation; term stakes lock in the selected pool. Rewards and principal exits are on Assets.',
      mechanismSteps: [
        {
          title: 'Stake AGX',
          body: 'Choose flexible or 180/360/540-day lock. Longer locks earn higher rebase bonus.',
        },
        {
          title: 'Daily rebase',
          body: 'Each epoch (~12h) settles; yield accrues as gAGX.',
        },
        {
          title: 'Release & claim',
          body: 'Principal unlocks linearly; claim or recycle gAGX from Assets.',
        },
      ],
      faq: [
        {
          q: 'Flexible vs term?',
          a: 'Flexible uses LiquidStaking with warmup; term uses the matching LockedStaking pool.',
        },
        {
          q: 'Is warmup activation a reward claim?',
          a: 'No. claim() only activates expired warmup principal. Mixed claims are on Assets.',
        },
      ],
    },
    lpbond: {
      title: 'LP Bond',
      intro: 'Build the base pool with USD1 and mint AGX at a discount',
      periodLabel: 'Select bond period',
      periodAria: 'LP bond period',
      amountAria: 'Purchase amount',
      amountBalance: 'Amount (wallet balance {balance} USD1)',
      submit: 'Buy',
      success: 'Purchased successfully',
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'LP bond TVL' },
        { label: 'Bond premium' },
        { label: 'Total sold' },
        { label: 'Current discount' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
      ],
      mechanismTitle: 'How LP Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        { title: 'Pay USD1', body: 'Route USD1 through BondHelper into the LP bond vault.' },
        {
          title: 'Discount mint AGX',
          body: 'Mint AGX at the current discount and deepen pool liquidity.',
        },
        {
          title: 'Release & claim',
          body: 'Principal unlocks linearly; claim gAGX yield on Assets.',
        },
      ],
      faq: [
        { q: 'Why is there no flexible bond?', a: 'Bonds only offer 180 / 360 / 540 day terms.' },
      ],
    },
    burnbond: {
      title: 'Burn Bond',
      intro: 'Discount-mint AGX and burn permanently for deflation',
      periodLabel: 'Select bond period',
      periodAria: 'Burn bond period',
      amountAria: 'Purchase amount',
      amountBalance: 'Amount (wallet balance {balance} USD1)',
      submit: 'Buy',
      success: 'Purchased successfully',
      card: {
        yield: 'Period yield',
        discountRange: 'Discount range',
        sold: 'Sold',
        currentDiscount: 'Current discount',
        discountPrice: 'Discount price',
      },
      meta: {
        discount: 'Discount price',
        slippage: 'Allowed slippage',
        pay: 'Pay',
        receive: 'Receive AGX',
        cap: 'Max purchase',
        release: 'Principal release',
        releaseLinear: '{days}-day block-linear release',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'Burn bond TVL' },
        { label: 'Bond premium' },
        { label: 'Total burned' },
        { label: 'Current discount' },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Released' },
        { label: 'Pending release' },
        { label: 'Current Rebase yield' },
      ],
      mechanismTitle: 'How Burn Bond works',
      mechanism:
        'USD1 zap via BondHelper into the period BurnBondDepository. Redeem and yield on Assets.',
      mechanismSteps: [
        { title: 'Pay USD1', body: 'Route USD1 through BondHelper into the burn bond vault.' },
        {
          title: 'Discount mint AGX',
          body: 'Mint AGX at the current discount into the term position.',
        },
        {
          title: 'Burn permanently',
          body: 'Corresponding supply is burned permanently for deflation.',
        },
      ],
      faq: [
        {
          q: 'How does Burn Bond differ from LP Bond?',
          a: 'Different depositories; both open with BondHelper + USD1; claims are on Assets.',
        },
      ],
    },
    xmine: {
      title: 'X Mine',
      intro: 'Stake gAGX to mine X ecosystem rewards',
      amountAria: 'gAGX stake amount',
      amountBalance: 'Amount (wallet balance {balance} gAGX)',
      quotaInline: 'Mining quota: {quota} gAGX',
      submit: 'Stake',
      success: 'Staked successfully',
      meta: {
        quota: 'Mining quota',
        daily: 'Daily yield',
        max: 'Max stake',
        lock: 'Lock',
        lockValue: 'Releases after 24 hours',
        h24: '24h',
        contract: 'View contract',
      },
      overviewMetrics: [
        { label: 'X Mine TVL' },
        { label: 'X price' },
        { label: 'Total mined' },
        { label: 'Today yield' },
      ],
      positionMetrics: [{ label: 'My stake' }, { label: 'Released' }, { label: 'Mined' }],
      mechanismTitle: 'How X Mine works',
      mechanism: 'Validate miningQuotaOf then stakeGagxForMining. Claim X and unstake on Assets.',
      mechanismSteps: [
        {
          title: 'Rebase + DAO rewards',
          body: 'Protocol rebase and DAO rewards enter the distributable pool.',
        },
        { title: 'Stake gAGX', body: 'Stake gAGX within quota; enter 24h warmup.' },
        { title: 'Dynamic X allocation', body: 'X rewards allocate by protocol state.' },
        { title: 'Unstake linear release', body: 'Exit principal enters the release vault.' },
      ],
      faq: [
        {
          q: 'Where does quota come from?',
          a: 'Sum of locked principal from Early, term stake, and bonds via miningQuotaOf.',
        },
      ],
    },
    calc: {
      title: 'Yield calculator',
      intro: 'Estimate yield across periods and prices — no on-chain tx',
      productAria: 'Product',
      products: {
        stake: 'Stake',
        lpbond: 'LP Bond',
        burnbond: 'Burn Bond',
        xmine: 'X Mine',
      },
      periodLabel: 'Select period',
      periodAria: 'Period',
      amountLabel: 'Amount',
      amountAria: 'Amount',
      price: 'Exit price',
      priceCurrent: 'Current price ${price}',
      priceAria: 'Price input',
      days: 'Hold days',
      dayBubble: 'Day {day}',
      daysAria: 'Hold days',
      submit: 'Calculate',
      result: {
        interest: 'Estimated yield',
        total: 'Principal + yield',
        rate: 'Yield rate',
      },
      aside: {
        result: 'Estimate',
        resultHint: 'Enter parameters on the left and tap Calculate.',
        tags: { day: 'Day {day}' },
        curve: 'Yield curve',
        curveHint: 'Cumulative yield by day; compounding continues if not redeemed at maturity',
        nodes: 'Key nodes',
        nodeCards: [
          { label: 'Breakeven day', hint: 'Selling from this day can realize positive yield' },
          { label: 'Principal fully released', hint: '' },
          { label: 'Hold to term end', hint: 'Cumulative yield vs principal' },
        ],
        notes: 'Notes',
        notesBody: 'Local estimate only — not an on-chain quote or yield promise.',
        notesItems: [
          'Yield compounds at the current base daily rate; term bonuses: 180d 15%, 360d 25%, 540d 35%.',
          'Only principal unlocked by the selected day counts; locked principal and its yield are excluded.',
          'Ignores claim tax and price volatility; actual results vary with protocol state.',
        ],
      },
    },
  },

  release: {
    title: 'Release',
    intro: 'Manage yield and principal release',
    backToHub: 'Back to release',
    dash: '—',
    recordColumns: ['Time', 'Action', 'Amount', 'Tx hash'],
    recordsEmpty: 'No indexed records yet',
    labels: {
      releasing: 'Releasing',
      released: 'Released',
      releasedPct: 'Released {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Claim failed. Please try again.',
    },
    hub: {
      aboutTitle: 'About release',
      aboutCardTitle: 'Release pool · yield & rewards',
      aboutCardBody:
        'The release pool turns instant sell pressure into a smooth multi-day flow. Each claim unlocks linearly over the selected period so protocol outflows stay aligned with ecosystem growth.',

      aboutSlides: [
        {
          title: 'Release pool · yield & rewards',
          body: 'The release pool turns instant sell pressure into a smooth multi-day flow. Each claim unlocks linearly over the selected period so protocol yield outflow stays aligned with ecosystem growth.',
        },
        {
          title: 'Buffer pool · principal second release',
          body: 'After stake/bond principal exits, funds enter the buffer for a second linear release that matches market absorption capacity.',
        },
      ],
      purposeTitle: 'Why release exists',
      purposeBody:
        'All yield passes through the release pool before Turbine. Spreading redemption over time cuts dump pressure; longer periods get lower tax rates to reward holding.',

      mechanismTitle: 'Yield claim flow',
      mechanismSubtitle:
        'Release sits between yield creation and Turbine — trade time for a lower tax rate and steadier exits.',
      mechanismSteps: [
        { title: 'Claim Rebase / DAO rewards', body: 'Yield is created' },
        { title: '6 : 1 contribution', body: '50% burn · 50% into X pool' },
        { title: 'Enter release pool', body: 'Choose 5 / 20 / 40 / 60 days' },
        { title: 'Claim into Turbine', body: '1:1 unlock sell quota' },
      ],
      taxTitle: 'Longer release, lower tax',
      taxPeriod: 'Period',
      taxRate: 'Claim tax',
      taxRows: {
        periods: ['5d', '20d', '40d', '60d'],
        rates: ['20%', '10%', '5%', '1%'],
      },
    },
    queue: {
      title: 'Release pool',
      intro:
        'Claimed yield unlocks here over the selected period. Released amounts can be claimed into Turbine anytime.',
      planDays: '{days}d',
      claim: 'Claim',
      claimSuccess: 'Claimed into Turbine quota',
      goTurbine: 'Go to Turbine',
      statsTitle: 'Release pool data',
      lifetimeClaimed: 'Lifetime claimed from pool',
      recordsTitle: 'Release pool records',
    },
    buffer: {
      title: 'Buffer pool',
      intro:
        'Redeemed principal unlocks here with a second linear release. Released AGX can be withdrawn to your wallet.',
      claim: 'Withdraw',
      claimSuccess: 'AGX withdrawn to wallet',
      gagxHint:
        'PrincipalReleaseVault settles AGX only. gAGX exits convert to AGX before entering the buffer.',
      statsTitle: 'Buffer pool data',
      entered: 'Total entered',
      extracted: 'Total withdrawn',
      recordsTitle: 'Buffer pool records',
      mechanismTitle: 'Principal release flow',
      mechanismSubtitle:
        'Stake and bond principal use a two-stage release model for market stability.',
      mechanismSteps: [
        { title: 'Stake / bond principal', body: 'Exit entry' },
        { title: 'Block-level release', body: 'Inside position' },
        { title: 'Buffer after redeem', body: '~30 days default' },
        { title: 'Second linear release', body: 'Withdraw to wallet' },
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: 'Can I change the release period?',
          a: 'Not for amounts already queued. New claims can pick a different period.',
        },
        {
          q: 'When is the tax taken?',
          a: 'When you claim unlocked amounts, using the plan fee rate.',
        },
        {
          q: 'Where does a release-pool claim go?',
          a: 'On-chain AGX enters Turbine sell quota; then use Turbine to obtain gAGX.',
        },
        {
          q: 'Do I lose unlocked amounts if I wait?',
          a: 'No. Unlocked amounts stay claimable.',
        },
        {
          q: 'How do I pick a period?',
          a: 'Longer periods have lower tax. Choose among 5 / 20 / 40 / 60 days.',
        },
      ],
      queue: [
        {
          q: 'Can I change the release period?',
          a: 'Not for amounts already queued.',
        },
        {
          q: 'When is the tax taken?',
          a: 'On claim of unlocked amounts.',
        },
        {
          q: 'Where does a release-pool claim go?',
          a: 'Into Turbine quota — open Exchange → Turbine.',
        },
        {
          q: 'Do I lose unlocked amounts if I wait?',
          a: 'No.',
        },
        {
          q: 'How do I pick a period?',
          a: 'Longer periods, lower tax.',
        },
      ],
      buffer: [
        {
          q: 'What is the buffer pool?',
          a: 'PrincipalReleaseVault — second-stage linear release after redeem/unstake.',
        },
        {
          q: 'Do buffer assets still earn yield?',
          a: 'No staking yield accrues while in the buffer.',
        },
        {
          q: 'How do I withdraw released amounts?',
          a: 'Tap Withdraw — AGX goes to your wallet.',
        },
        {
          q: 'Why show AGX and gAGX?',
          a: 'Design keeps both cards; on-chain buffer is AGX-only after gAGX conversion.',
        },
        {
          q: 'Why can’t I withdraw everything at once?',
          a: 'Only currently unlocked amounts are claimable.',
        },
      ],
    },
  },
  tables: {
    time: 'Время',
    claimTime: 'Время получ.',
    paid: 'Сумма',
    status: 'Статус',
    discount: 'Скидка',
    estimatedAgx: 'Ожид. AGX',
    tx: 'Транзакция',
    title: 'Титул Genesis',
    totalVolume: 'Общий объём',
    rewardRate: 'Ставка вознаграждения',
    amount: 'Сумма',
    from: 'Адрес отправителя',
    genesisRank: 'Ранг Genesis',
    joined: 'Дата присоединения',
    address: 'Адрес',
    communityVolume: 'Объём сообщества',
    contribution: 'Подписка',
  },
}) satisfies AppMessagesBundle

export default app
