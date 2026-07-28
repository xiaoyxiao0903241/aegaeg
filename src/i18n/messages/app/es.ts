import { defineMessages } from '~/i18n/messages/define-messages'
import type { AppMessagesBundle } from './types'

const app = defineMessages({
  common: {
    brand: 'AEGIS X',
    bsc: 'BSC',
    connectWallet: 'Conectar billetera',
    language: 'Idioma',
    copy: 'Copiar',
    claimable: 'Pendiente de reclamar',
    max: 'Máx.',
    shareUnit: 'participaciones',
    confirm: 'Confirmar',
    close: 'Cerrar',
    paginationTotal: 'Total: {total}',
    paginationPerPage: '{size} por página',
    paginationPrev: 'Página anterior',
    paginationNext: 'Página siguiente',
  },
  errors: {
    api: {
      network: 'Error de conexión. Comprueba tu red e inténtalo de nuevo.',
      timeout: 'La solicitud agotó el tiempo de espera. Inténtalo más tarde.',
      unavailable: 'Servicio temporalmente no disponible. Inténtalo más tarde.',
      badResponse: 'Respuesta inesperada del servidor. Inténtalo más tarde.',
      fallback: 'Algo salió mal. Inténtalo más tarde.',
    },
    chain: {
      fallback: 'La acción on-chain falló. Inténtalo más tarde.',
    },
    walletNotConnected: 'Conecta tu billetera e inicia sesión primero.',
    quoteFailed: 'La cotización falló. Inténtalo más tarde.',
    loadFailed: 'Error al cargar. Inténtalo más tarde.',
    loginFailed: 'Error al iniciar sesión. Inténtalo más tarde.',
    loginSignatureRejected: 'La firma de inicio de sesión no es válida o expiró. Firma de nuevo.',
    pageLoadFailed: 'Error al cargar la página',
    pageLoadFailedBody:
      'Algo falló al renderizar. Recarga para continuar: tu billetera sigue conectada.',
    reloadPage: 'Recargar página',
  },
  nav: {
    exchange: 'Exchange',
    assets: 'Assets',
    staking: 'Staking',
    genesis: 'Co-construcción',
    rewards: 'Recompensas',
    release: 'Release',
    community: 'Comunidad',
    rewardsTooltip: 'Consulta las recompensas por referidos y de equipo.',
    communityTooltip:
      'Invita a socios a co-construir y comparte el valor de crecimiento del ecosistema y las recompensas Génesis.',
    bscTooltip:
      'Solo BSC · AEGIS X funciona en BNB Smart Chain. El cambio de red aún no está disponible.',
  },
  topbar: {
    currentNetwork: 'Red actual',
    openMenu: 'Abrir navegación',
    closeMenu: 'Cerrar navegación',
    hideDetails: 'Ocultar panel de detalles',
    showDetails: 'Mostrar panel de detalles',
    toggleTooltip: 'Mostrar u ocultar el panel de detalles',
  },
  dapp: {
    connect: {
      promoTitle: 'Conecta para explorar las funciones de AEGIS X',
      promoBrandLine: 'Protege la red de valor del futuro',
      recordsTitle: 'Conecta tu billetera para ver tus registros',
      recordsBodyGenesis: 'Tras conectar, tu historial de co-construcción aparecerá aquí.',
      recordsBodyRewards: 'Tras conectar, tu historial de recompensas aparecerá aquí.',
      recordsBodyCommunity: 'Tras conectar, tu historial de invitaciones aparecerá aquí.',
    },
  },
  wallet: {
    connectTitle: 'Conectar billetera',
    connectIntroTitle: 'Conecta tu billetera para explorar las funciones de AEGIS X',
    connectIntroLink: 'Funciones de AEGIS X ↗',
    connecting: 'Conectando…',
    copyAddress: 'Copiar dirección',
    copied: 'Copiado',
    copyFailed: 'Error al copiar. Mantén pulsado para copiar manualmente.',
    disconnect: 'Desconectar',
    reconnectWallet: 'Reconectar billetera',
    reconnectHint:
      'La billetera está desconectada. Vuelve a conectarla antes de realizar operaciones on-chain.',
    signInRequired: 'Iniciar sesión',
    accountBanned: 'Tu cuenta ha sido suspendida. Contacta con soporte.',
    transactionErrors: {
      gasLimitTooLow:
        'El límite de gas es demasiado bajo. Mantén suficiente BNB en tu billetera para las comisiones de red e inténtalo de nuevo.',
      gasEstimateFailed:
        'No se pudo estimar el gas de esta transacción. Comprueba la red e inténtalo de nuevo.',
      insufficientFunds: 'BNB insuficiente para pagar las comisiones de gas de la red.',
      transactionFailed: 'La transacción falló. Inténtalo de nuevo más tarde.',
      transactionUnknown:
        'El estado de la transacción es desconocido. No vuelva a enviar: revise primero la billetera o el explorador.',
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
    title: 'Plan de co-construcción',
    intro:
      'Participa en el plan de co-construcción X DAO · Fase {season}  ({discount} de descuento)',
    shares: 'Participaciones (1 participación = 100 USD1 · máx. {max} participaciones)',
    quota: 'Cuota de co-construcción de esta fase',
    pay: 'Pagar',
    receive: 'Recibirás AGX',
    value: 'Valor de suscripción',
    xTokenAirdrop: 'Valor estimado del airdrop inicial de X',
    xTokenAirdropHint:
      'La participación acumulada en co-construcción por fase ≥ {threshold} da derecho a recompensas de airdrop.',
    join: 'Participar en la co-construcción',
    joinGenesis: 'Participar en la co-construcción Génesis',
    statsTitle: 'Datos de co-construcción de la fase {season}',
    startsIn: 'Cuenta regresiva de inicio',
    countdownUnits: { days: 'd', hours: 'h', minutes: 'm' },
    endsIn: 'Tiempo restante de esta fase',
    referencePrice: 'Precio de referencia de apertura de AGX',
    discountLabel: 'Descuento',
    discountRatio: 'Proporción de descuento de esta fase',
    xAirdropRatio: 'Proporción de airdrop X',
    airdropLabel: 'Proporción de airdrop X',
    myContributions: 'Mis registros de co-construcción',
    totalContributed: 'Co-construcción de la fase',
    cumulativeContributed: 'Co-construcción acumulada',
    globalLabel: 'Co-construcción acumulada global',
    globalBody:
      'Reúne a constructores clave de todo el mundo para construir conjuntamente la red global del ecosistema AEGIS X.',
    viewContract: 'Ver contrato',
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '¿Cómo participar en el plan de co-construcción?',
          a: 'Los usuarios participan en la co-construcción con USD1 y pueden obtener AGX según el descuento de la fase correspondiente. {phaseCount} fases, con descuentos de {discounts} respectivamente.',
        },
        {
          q: '¿Cuota de co-construcción y requisitos de participación?',
          a: 'El monto mínimo de participación es {minUsd}, y debe participarse en múltiplos de {shareIncrement} USD1. Cuotas por fase: {phaseQuotas}.',
        },
        {
          q: '¿Cuánto dura el ciclo de co-construcción?',
          a: 'El AGX obtenido por participar en la co-construcción sigue un ciclo de liberación de 540 días.',
        },
        {
          q: '¿Cómo obtener recompensas de airdrop X?',
          a: 'Cuando el monto acumulado de participación en co-construcción de una cuenta alcanza {threshold}, califica para las recompensas de airdrop X de la fase correspondiente. Proporciones de airdrop en {phaseCount} fases: {airdropRatios}.',
        },
        {
          q: '¿Cómo se liberan las recompensas de airdrop X?',
          a: 'Las recompensas de airdrop X siguen un mecanismo de liberación lineal de 12 meses, liberando aproximadamente el 8,33% cada mes; la primera liberación es el día 30 tras el lanzamiento del protocolo de staking X, ejecutada automáticamente por el contrato inteligente.',
        },
      ],
    },
    promoTitleTemplate: 'Co-construcción Génesis Fase {season}  {discount} de descuento',
    promoLive: 'En curso — cupo limitado, finaliza el {endDate}',
    promoUpcoming: 'Próximamente — cupo limitado, comienza el {startDate}',
    promoEnded: '{status} · {date}',
    joinSuccess: 'Suscripción exitosa',
    insufficientUsd1:
      'Saldo USD1 insuficiente. Obtén suficiente USD1 antes de participar en la suscripción.',
    insufficientAllowance: 'Autorización USD1 insuficiente. Haz clic en Aprobar primero.',
    purchaseUnavailable:
      'No puedes participar en la suscripción en este momento. Revisa las participaciones o el estado de la fase.',
    walletNotConnected:
      'La billetera está desconectada. Vuelve a conectarla antes de firmar la transacción.',
    errors: {
      notBound: 'Vincula un referente antes de participar.',
      paused: 'La suscripción está pausada. Inténtalo más tarde.',
      invalidAmount: 'El importe debe ser múltiplo de 100 USD.',
      phaseInactive: 'Esta fase no ha comenzado o ya terminó.',
      belowMin: 'El importe es inferior al mínimo de la fase.',
      soldOut: 'Esta fase está agotada.',
      userLimitExceeded: 'Supera el límite por wallet de la fase. Reduce el importe.',
      invalidPhase: 'Fase no válida.',
      systemConfig: 'Error de configuración del sistema. Inténtalo más tarde.',
    },
    contributionsSyncPending:
      'La suscripción on-chain está confirmada. El historial se está sincronizando; actualiza en un momento.',
    contributionsEmpty: {
      title: 'Sin registros de co-construcción',
    },
    seasonLive: 'En curso',
    seasonEnded: 'Finalizada',
    seasonUpcoming: 'Próximamente',
  },
  rewards: {
    title: 'Recompensas de co-construcción',
    intro: 'Participa en la co-construcción · comparte el valor del crecimiento',
    currentTitle: 'Nivel actual',
    postLaunchRankTitle: 'Nivel tras el lanzamiento',
    teamRewardRate: 'Recompensa del equipo {rate}',
    postLaunch30DayRank: 'Dentro de los 30 días tras el lanzamiento podrás alcanzar {rank}',
    postLaunchMaxRank: 'Ha alcanzado el nivel máximo',
    postLaunchRankTooltip:
      'Tras el lanzamiento, el nivel se calculará según el rendimiento real del equipo en co-construcción convertido a AGX al precio con descuento.\nEl nivel actual se basa solo en datos de rendimiento; tras el lanzamiento pueden influir otros factores, como tenencias personales y referidos directos válidos.\nEstos datos son solo de referencia; prevalecerán los datos reales tras el lanzamiento.',
    superCommunityBadge: 'Supersistema',
    heroTierRewardBody: 'Obtén {bonus} del volumen de co-construcción del equipo como recompensa.',
    superCommunityBenefitBody:
      'Los supersistemas reciben un fondo de desarrollo dedicado y derechos de gobernanza.',
    shareholderHintNoRank: 'Nivel Génesis',
    shareholderNoRankTitle: 'Aún no eres Gobernador de Reserva Génesis',
    shareholderNoRankBody:
      'Al convertirte en Gobernador de Reserva Génesis, obtienes el 1%-10% del volumen de co-construcción del equipo como recompensa y subes 1 nivel dentro de los 30 días posteriores al lanzamiento de AEGIS X.',
    shareholderTitleForRank: '{rank} · Gobernador de Reserva Génesis',
    heroKicker: 'Nivel Génesis',
    currentTierSuffix: 'actual',
    progressPersonalTo: 'Hasta {rank} · Suscripción personal',
    progressMaxPersonal: 'Nivel personal máximo alcanzado',
    progressMaxTeam: 'Nivel de equipo máximo alcanzado',
    teamLegRequirement: 'Dos líneas {rank}',
    tierDualLegRequirement: '2 líneas {rank}',
    teamQualifiedPartitionsLabel: 'Líneas {rank} {count}/2',
    teamVolume: 'Volumen del sistema',
    referralRewards: 'Recompensas por referidos directos',
    autoPaidLabel: 'Pago automático',
    autoPaid: 'Las recompensas se liquidan automáticamente en la billetera',
    teamRewards: 'Recompensas por nivel',
    claimed: 'Reclamado {amount}',
    claim: 'Reclamar en la billetera',
    claimSuccess: 'Reclamado con éxito',
    claimErrors: {
      zeroAmount: 'El importe a reclamar es cero.',
      invalidSigner: 'Firma no válida, solicítala de nuevo.',
      alreadyUsed: 'Esta recompensa ya fue reclamada.',
      expired: 'La firma expiró, actualiza y reclama de nuevo.',
      noOrder: 'No hay recompensa para reclamar.',
      failed: 'Error al reclamar. Inténtalo más tarde.',
      confirmSyncFailed:
        'La recompensa se reclamó en cadena, pero falló la sincronización. Actualice la página; no vuelva a reclamar.',
    },
    heroTitle: 'Nivel actual',
    allTiers: 'Sistema de honor Génesis',
    history: 'Registros de recompensas',
    referralHistoryEmpty: {
      title: 'Sin registros de recompensas por referidos',
      body: 'Las recompensas por referidos aparecerán aquí cuando tus referidos completen la suscripción durante Génesis.',
    },
    teamHistoryEmpty: {
      title: 'Sin registros de recompensas de equipo',
      body: 'Los registros de liquidación y reclamación de recompensas de equipo aparecerán aquí cuando se generen recompensas.',
    },
    communityFund: 'Fondo de desarrollo',
    communityFundTooltip:
      'Los supersistemas reciben el 5% del fondo de desarrollo del sistema, dedicado a la autogestión del sistema, incluyendo pero no limitado a: construcción del sistema, operaciones diarias, reuniones del sistema y formadores del sistema.',
    communityFundLocked: 'Bloqueado: {amount}',
    communityFundUnlockedSuffix: 'desbloqueado',
    communityFundClaimed: 'Has reclamado {amount}',
    communityFundHistory: 'Fondo de desarrollo',
    communityFundCumulativeClaimed: 'Total reclamado {amount}',
    communityFundHistoryEmpty: {
      title: 'Sin registros del fondo de desarrollo',
      body: 'Los registros de reclamación del fondo de desarrollo aparecerán aquí cuando se generen recompensas.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '¿Cómo se calculan las recompensas por referidos?',
          a: 'Las recompensas por referidos son del 3%, con un mecanismo de liquidación por monto equivalente comprimido: solo se calcula sobre la parte de monto equivalente, las cuentas vacías no cuentan en los niveles de recompensa, y las recompensas se liquidan automáticamente.',
        },
        {
          q: '¿Cómo se promueve el nivel Génesis?',
          a: 'Los niveles Génesis van de S1 a S10, evaluados según el monto personal de co-construcción y el volumen total del sistema. Los niveles superiores requieren cumplir la condición de promoción de doble zona.',
        },
        {
          q: '¿Qué es la recompensa por ascenso de nivel?',
          a: 'El nivel Génesis alcanzado durante la co-construcción se elevará automáticamente 1 nivel tras el lanzamiento del protocolo, válido 30 días, y luego volverá al nivel real.',
        },
        {
          q: '¿Cómo se liquidan las recompensas de equipo Génesis?',
          a: 'Las recompensas de equipo Génesis se liquidan automáticamente según la proporción del nivel Génesis; el usuario debe reclamar manualmente en la billetera. Tras finalizar el período de co-construcción, esta página se cerrará; las recompensas no reclamadas no podrán reclamarse y se transferirán al contrato inteligente de market making.',
        },
      ],
    },
    rewardType: {
      referralPaid: 'Recompensa por referido',
      referralWithdrawn: 'Reclamación de recompensa por referido',
      marketTeam: 'Recompensa de equipo market making',
      presaleTeam: 'Recompensa de equipo de preventa',
      unknown: '—',
    },
    logStatus: {
      pending: 'Pendiente',
      processing: 'Procesando',
      paid: 'Pagado',
      claimed: 'Reclamado',
      failed: 'Fallido',
      unknown: '—',
    },
  },
  community: {
    bindErrors: {
      alreadyBound: 'Ya has vinculado un referente.',
      parentNotBound: 'El referente aún no se ha vinculado. Contáctalo.',
      selfReferral: 'No puedes usar tu propia dirección.',
      invalidParent: 'Introduce una dirección de referente válida.',
      migratedAccount: 'Esta dirección ha migrado. Usa la nueva dirección.',
      systemConfig: 'Error de configuración del sistema. Inténtalo más tarde.',
      failed: 'Error al vincular. Inténtalo más tarde.',
    },
    title: 'Comunidad',
    intro:
      'Invita a socios a participar en la co-construcción y comparte el valor del crecimiento del ecosistema y las recompensas Génesis.',
    disconnectedIntro:
      'Conecta la billetera para generar tu enlace de referido y vincular un invitador.',
    referralLink: 'Mi enlace de invitación',
    shareReferral: 'Copiar enlace',
    referrer: 'Mi invitador',
    bindReferrer: 'Vincular',
    referrerPlaceholder: 'Introduce la dirección del referente (0x…)',
    referrerHint:
      'La relación de invitación es permanente una vez activada y no se puede modificar.',
    docs: 'Documentación',
    youtube: 'Youtube',
    medium: 'Medium',
    twitter: 'Twitter / X',
    telegram: 'Telegram',
    shareholder: 'Participar en la co-construcción',
    myCommunity: 'Mi comunidad',
    directReferrals: 'Referidos directos',
    myTeam: 'Miembros de la comunidad',
    genesisTitle: 'Actual',
    inviteTitle: 'Empieza a invitar · comparte el valor del crecimiento del ecosistema',
    programs: {
      title: 'Programas de apoyo al ecosistema',
      items: [
        {
          label: 'Co-construcción Génesis · Fase {season}',
          title: 'Programa de Gobernadores de Reserva Génesis',
          body: 'Abiertas las primeras plazas globales de co-construcción',
          action: 'Ver detalles del plan →',
          href: 'https://xdaoaegis.notion.site/programa-del-consejo-de-reserva-genesis',
        },
        {
          label: 'Academia X',
          title:
            'Academia Global DeFi · Academia de Liderazgo Global para la Era de la Economía Digital',
          body: 'Formar líderes para la era · Reservar talento para el futuro',
          action: 'Ver detalles del plan →',
          href: 'https://xdaoaegis.notion.site/academia-x-esp',
        },
      ],
    },
    myInvites: 'Miembros de mi comunidad ({count})',
    referralBondPermanent: 'Relación de referido activada · el vínculo es permanente.',
    volumePrefix: 'Volumen',
    genesisShareholder: 'Gobernador de Reserva Génesis',
    statToday: 'Hoy +{count} · +{amount}',
    statGenesisToday: 'Ascenso automático de 1 nivel tras el lanzamiento',
    postLaunchRankLabel: 'Nivel tras el lanzamiento',
    totalTeamVolume: 'Volumen total {amount}',
    postLaunch30DayBoost: 'Ascender a {rank} en 30 días tras el lanzamiento',
    postLaunchMaxRank: 'Ha alcanzado el nivel máximo',
    bindReferrerSuccess: 'Referente vinculado correctamente',
    inviteFlow: {
      items: [
        {
          title: 'Compartir enlace de invitación',
          body: 'Conecta la billetera y completa tu invitador para generar tu enlace de invitación exclusivo.',
        },
        {
          title: 'Los socios participan en la co-construcción',
          body: 'Tras registrarse con tu enlace de invitación, los socios pueden participar en la co-construcción.',
        },
        {
          title: 'Obtener recompensas de co-construcción',
          body: 'Cuando los socios participan en la co-construcción, las recompensas se liquidan automáticamente en tu dirección de billetera mediante el contrato inteligente.',
        },
      ],
    },
    invitesEmpty: {
      title: 'Sin registros de invitación',
      body: 'Comparte tu enlace de referido e invita a amigos a unirse a tu comunidad.',
    },
    faq: {
      title: 'FAQs',
      items: [
        {
          q: '¿Cómo se establece la relación de referido?',
          a: 'Cuando un socio participa en la co-construcción a través de tu enlace de invitación, la relación de referido se establece automáticamente y es permanente.',
        },
        {
          q: '¿Cómo se calculan las recompensas por referidos Génesis?',
          a: 'Las recompensas por referidos Génesis son del 3%, con un mecanismo de liquidación por importes iguales comprimidos; solo cuenta la parte de importe igual.',
        },
        {
          q: '¿Cómo subo mi nivel Génesis?',
          a: 'Avanza gradualmente de S1 a S10 según tu monto personal de co-construcción y el rendimiento de la organización.',
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
    time: 'Hora',
    claimTime: 'Hora recl.',
    paid: 'Monto',
    status: 'Estado',
    discount: 'Descuento',
    estimatedAgx: 'AGX estimado',
    tx: 'Transacción',
    title: 'Título Génesis',
    totalVolume: 'Volumen total',
    rewardRate: 'Tasa de recompensa',
    amount: 'Monto',
    from: 'Dirección de origen',
    genesisRank: 'Rango Génesis',
    joined: 'Fecha de ingreso',
    address: 'Dirección',
    communityVolume: 'Volumen de la comunidad',
    contribution: 'Suscripción',
  },
}) satisfies AppMessagesBundle

export default app
