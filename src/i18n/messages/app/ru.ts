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
    },
    seasonLive: 'Идёт',
    seasonEnded: 'Завершён',
    seasonUpcoming: 'Скоро',
  },
  rewards: {
    title: 'Награды за со-строительство',
    intro: 'Участвуйте в со-строительстве · делитесь ростом стоимости',
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
    claim: 'Получить на кошелёк',
    claimSuccess: 'Успешно получено',
    claimErrors: {
      zeroAmount: 'Сумма получения равна нулю.',
      invalidSigner: 'Недействительная подпись, запросите её снова.',
      alreadyUsed: 'Эта награда уже получена.',
      expired: 'Срок подписи истёк, обновите и повторите.',
      noOrder: 'Нет наград для получения.',
      failed: 'Не удалось получить. Повторите позже.',
      confirmSyncFailed:
        'Награда уже получена в сети, но синхронизация не удалась. Обновите страницу — не запрашивайте снова.',
    },
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
    faq: {
      title: 'FAQs',
      items: [
        {
          q: 'Как рассчитываются реферальные награды?',
          a: 'Реферальные награды составляют 3% и рассчитываются по механизму сжатия равных сумм: учитывается только равная часть суммы, пустые аккаунты не учитываются в уровнях наград; выплата автоматическая.',
        },
        {
          q: 'Как повышается уровень Genesis?',
          a: 'Уровни Genesis от S1 до S10 определяются личным вкладом в со-строительство и совокупным объёмом системы; для высоких уровней требуется условие двух зон.',
        },
        {
          q: 'Что такое награда за повышение уровня?',
          a: 'Уровень Genesis, достигнутый в период со-строительства, автоматически повышается на 1 уровень после запуска протокола на 30 дней, затем восстанавливается реальный уровень.',
        },
        {
          q: 'Как рассчитываются командные награды Genesis?',
          a: 'Командные награды Genesis автоматически рассчитываются по ставке соответствующего уровня; пользователь вручную получает на кошелёк. После окончания периода со-строительства страница закрывается; неполученные награды нельзя забрать — они направляются в смарт-контракт маркет-мейкинга.',
        },
      ],
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
