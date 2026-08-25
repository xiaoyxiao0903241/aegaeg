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
      reverts: {
        stakeAmountLimit:
          'Se alcanzó el límite diario de staking. Reduce el monto o espera el reinicio.',
        debtCapacityReached: 'La capacidad del bono está llena. Inténtalo más tarde.',
        turbineCooldown:
          'La espera no ha terminado o el monto no es válido. Actualiza los registros de espera e inténtalo de nuevo.',
        pairNotExist: 'El par de trading no existe. Revisa la configuración del token.',
        notWinner: 'No ganaste en esta ronda.',
        rewardAlreadyClaimed: 'Recompensa ya reclamada. No vuelvas a reclamar.',
        configNotReady: 'La configuración del protocolo no está lista. Inténtalo más tarde.',
        exceedsMax: 'El monto supera el máximo. Redúcelo.',
        bondTooSmall: 'El pago del bono es demasiado pequeño. Aumenta el monto de compra.',
        bondTooLarge: 'El bono supera el pago máximo. Reduce el monto de compra.',
        stakeNotExist: 'La posición no existe o ya está cerrada. Actualiza e inténtalo de nuevo.',
        yieldUnavailable:
          'No hay rendimiento reclamable o el monto es demasiado alto. Redúcelo o espera a que se acumule.',
        operationPaused: 'Esta operación está pausada. Inténtalo más tarde.',
        belowMinAmount: 'El monto está por debajo del mínimo. Auméntalo.',
        aboveMaxAmount: 'El monto supera el máximo. Redúcelo.',
        zeroRate: 'El tipo de cambio no está listo. Inténtalo más tarde.',
        zeroAmount: 'Ingresa un monto válido.',
        turbineNoSilenceBalance: 'No hay saldo de enfriamiento maduro para retirar.',
        invalidAmount: 'Importe no válido. Compruébalo e inténtalo de nuevo.',
        zeroAddress: 'Dirección no válida. Inténtalo de nuevo más tarde.',
        notAuthorized: 'Esta cuenta no está autorizada para esta acción.',
        invalidLimits: 'La configuración de límites no es válida. Inténtalo de nuevo más tarde.',
        nothingToClaim: 'Nada que reclamar o índice no válido. Actualiza e inténtalo de nuevo.',
        warmupOrLockActive: 'Aún en periodo de calentamiento o bloqueo. Espera a que termine.',
        walletTokenInsufficient: 'Saldo de tokens en la cartera insuficiente.',
        walletAgxInsufficient: 'Saldo de AGX en la cartera insuficiente.',
        walletUsd1Insufficient: 'Saldo de USD1 en la cartera insuficiente.',
        walletGagxInsufficient: 'Saldo de gAGX en la cartera insuficiente.',
        contractPayableInsufficient:
          'El saldo pagadero del contrato es insuficiente. Inténtalo más tarde.',
        extractableInsufficient: 'Saldo extraíble insuficiente. Actualiza e inténtalo de nuevo.',
        insufficientAllowance: 'Allowance insuficiente. Aprueba primero.',
      },
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
    exchange: 'Intercambio',
    assets: 'Activos',
    staking: 'Participación',
    genesis: 'Co-construcción',
    rewards: 'Recompensas',
    release: 'Liberación',
    community: 'Comunidad',
    rewardsTooltip: 'Consulta las recompensas por referidos y de equipo.',
    communityTooltip:
      'Invita a socios a co-construir y comparte el valor de crecimiento del ecosistema y las recompensas Génesis.',
    bscTooltip: 'Solo BSC · AEGIS X funciona en BNB Smart Chain.',
  },
  flowOps: {
    stake: {
      STAKE: 'Stake',
      REWARD: 'Reclamo de recompensa',
      EXTRA_REWARD: 'Reclamo extra',
      CLAIM_PRINCIPAL: 'Rescate',
      RESTAKE: 'Reinvertir',
    },
    bond: {
      PURCHASE: 'Compra',
      REDEEM: 'Rescate',
      REWARD: 'Reclamar',
      RESTAKE: 'Reinvertir',
    },
    xmine: {
      STAKE_X: 'Stake',
      UNSTAKE_X: 'Retirar stake',
      REWARD: 'Reclamar',
    },
    buffer: {
      RELEASE_CREATED: 'Entrada',
      PRINCIPAL_CLAIMED: 'Retiro',
    },
    release: {
      entered_queue: 'Entrar en cola',
      claimed_from_queue: 'Reclamar',
      released: 'Liberado',
    },
    turbine: {
      received: 'Entrada',
      silenced: 'Desbloquear',
      cooled_claimed: 'Retiro',
    },
    termDays: ' ({n}d)',
    termLiquid: ' (Flexible)',
    liquid: 'Flexible',
    periodDays: '{n} días',
  },
  topbar: {
    currentNetwork: 'Red actual',
    switchToBsc: 'Cambiar a BSC',
    switchNetworkFailed:
      'No se pudo cambiar de red. Cambia a BSC en tu billetera e inténtalo de nuevo.',
    wrongNetworkTooltip: 'Red incorrecta. Haz clic para cambiar a BNB Smart Chain (BSC).',
    openMenu: 'Abrir navegación',
    closeMenu: 'Cerrar navegación',
    hideDetails: 'Ocultar panel de detalles',
    showDetails: 'Mostrar panel de detalles',
    toggleTooltip: 'Mostrar u ocultar el panel de detalles',
  },
  onboarding: {
    chip: 'Guía introductoria',
    skip: 'Omitir',
    prev: 'Atrás',
    next: 'Siguiente',
    done: 'Listo',
    steps: [
      {
        title: 'Intercambio',
        body: 'Usa Intercambio para canjear tokens principales por tokens del ecosistema AEGIS X (AGX, gAGX, X) a tipo de mercado.',
      },
      {
        title: 'Operar',
        body: 'Usa Operar para comprar AGX con USD1.',
      },
      {
        title: 'Participación',
        body: 'Staking es el punto de partida del rendimiento: haz staking de AGX o compra bonos para obtener recompensas compuestas en cada Rebase.',
      },
      {
        title: 'Staking de un solo activo',
        body: 'Haz staking de AGX en la tarjeta Staking. Rebase {timesPerDay} veces al día capitaliza; a mayor periodo, mayor bonificación de rendimiento.',
      },
      {
        title: 'Activos',
        body: 'Activos resume todas tus posiciones: staking, bonos LP, bonos de quema y posiciones y rendimientos de minado X.',
      },
      {
        title: 'Posiciones de staking',
        body: 'En la tarjeta Staking de Activos, revisa posiciones y rendimiento total; luego reclama, reinviste o canjea.',
      },
      {
        title: 'Liberación',
        body: 'Liberación gestiona fondos pendientes: rendimientos y recompensas entran al pool de liberación / pool búfer y se liberan linealmente por periodo.',
      },
      {
        title: 'Pool de liberación',
        body: 'Los rendimientos y recompensas reclamados se liberan linealmente en 5 / 20 / 40 / 60 días; lo liberado puede reclamarse hacia Turbina.',
      },
      {
        title: 'Pool búfer',
        body: 'El principal canjeado se libera linealmente por bloques en ~30 días; lo liberado se puede retirar a la billetera en cualquier momento.',
      },
      {
        title: 'Turbina',
        body: 'El gAGX que pasa del pool de liberación a Turbina queda bloqueado; desbloquéalo comprando con USD1 a la cotización en cadena.',
      },
      {
        title: 'Recompensas',
        body: 'Recompensas incluye referidos, participación, co-construcción y más. Reclamar vía Mixed (Lucky/co-construcción/referidos/participación) consume contribución {ratio}; los subsidios van a la billetera con firma.',
      },
      {
        title: 'Comunidad',
        body: 'Comunidad muestra tu equipo: el enlace de invitación, los miembros y el nivel de co-construcción están aquí.',
      },
    ],
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
      wrongChain: 'Cambia a BNB Smart Chain (BSC) e inténtalo de nuevo.',
      accountChanged: 'La cuenta de la billetera cambió. Vuelve a enviar.',
    },
  },
  exchange: {
    title: 'Intercambiar',
    intro: 'Obtén tokens del ecosistema AEGIS X al mejor tipo de cambio',
    backToHub: 'Volver al intercambio',
    sell: 'Sell',
    buy: 'Comprar',
    flip: 'Invertir dirección del intercambio',
    balance: 'Saldo',
    exchangePrice: 'Precio de intercambio',
    slippage: 'Tolerancia de deslizamiento',
    allowedSlippage: 'Deslizamiento permitido',
    slippageSettings: 'Ajustes de deslizamiento permitido',
    slippagePanel: {
      title: 'Deslizamiento',
      hint: 'La tolerancia de deslizamiento es el movimiento de precio que aceptas entre enviar la operación y su ejecución en cadena. Si el deslizamiento real supera el valor, la operación se revierte. Las operaciones revertidas pueden seguir cobrando gas.',
      modeAuto: 'Predeterminado',
      modeCustom: 'Personalizado',
      max: 'Deslizamiento máx.',
      customAria: 'Deslizamiento personalizado',
    },
    route: 'Ruta de intercambio',
    provider: 'Proveedor',
    providerName: 'PancakeSwap',
    openPancakeSwap: 'Abrir en PancakeSwap',
    overview: 'Resumen',
    exchangeRate: 'Tipo de cambio',
    settlement: 'Liquidación',
    settlementValue: 'PancakeSwap',
    hub: {
      modes: {
        flash: {
          title: 'Intercambio rápido',
          body: 'Intercambia gAGX por AGX o USDT por USD1 — sin comisiones ni deslizamiento',
        },
        trade: {
          title: 'Operar',
          body: 'Intercambia tokens principales por tokens del ecosistema AEGIS X',
        },
        burn: {
          title: 'Quemar',
          body: 'Quema AGX para obtener puntos de contribución',
        },
        turbine: {
          title: 'Turbina',
          body: 'Compra gAGX desbloqueado de Turbina con USD1',
        },
      },
      program: {
        title: 'Obtén tokens del protocolo AEGIS X',
        cards: [
          { title: 'Operar gAGX', body: 'Intercambiar gAGX por AGX' },
          { title: 'Turbina', body: 'Compra gAGX desbloqueado de Turbina con USD1' },
          { title: 'Obtener USD1', body: 'Convierte USDT a USD1 vía Flash' },
          { title: 'Obtener AGX', body: 'Obtén AGX al tipo de mercado de PancakeSwap' },
          { title: 'Vender X', body: 'Intercambia X por AGX, USD1 u otros tokens del ecosistema' },
          {
            title: 'Obtener puntos de contribución',
            body: 'Quema AGX a ratio {ratio} para obtener puntos de contribución',
          },
        ],
      },
      faq: {
        items: [
          {
            q: '¿Qué puedo hacer en la página de Intercambio?',
            a: 'La página de Intercambio reúne las formas habituales de obtener y gestionar tokens del protocolo AEGIS X: Flash (canjea gAGX por AGX a 1:1), Operar (intercambia USD1 / AGX / X y otros tokens al tipo de mercado), Turbina (compra con USD1 para desbloquear gAGX de Turbina) y Quemar AGX por puntos de contribución. Elige la entrada que necesites.',
          },
          {
            q: '¿Cuál es la diferencia entre Flash y Operar?',
            a: 'Flash es el canje 1:1 gAGX↔AGX del protocolo — sin comisiones, sin deslizamiento, acreditación instantánea en cadena. Operar pasa por PancakeSwap al tipo de mercado en vivo para USD1, AGX, X y otros tokens; el precio se mueve con el mercado, tú defines el deslizamiento permitido y pagas el gas de red.',
          },
          {
            q: '¿Qué es una billetera cripto y cómo obtengo una?',
            a: 'Una billetera cripto es software para ver y gestionar activos digitales. Tus activos están en la blockchain, no en la billetera. Con una no custodial controlas por completo la clave privada: solo tú firmas transacciones. A diferencia de las custodiales, nadie más guarda tus claves — pero si pierdes la clave o la frase semilla, pierdes el acceso. Puede ser app móvil o hardware; opciones comunes: MetaMask y TokenPocket.',
          },
          {
            q: '¿Qué es la comisión de una transacción blockchain?',
            a: 'Cada compra, venta, intercambio o transferencia en cadena necesita gas. AEGIS X no lo cobra; lo determina la demanda de la red y el cómputo. En BSC el gas se paga en BNB. Antes de operar en AEGIS X, asegúrate de tener BNB en la billetera.',
          },
          {
            q: '¿Cómo funciona una billetera cripto?',
            a: 'Las billeteras usan un par de claves — pública y privada — para proteger y gestionar tus activos. Al configurar una billetera no custodial, el software genera una frase semilla (12, 18 o 24 palabras aleatorias) para recuperar tus claves. Guárdala bien y no la reveles. Tu clave privada es la única cadena que otorga control total de la billetera; se usa para firmar y autorizar transacciones y debe permanecer en secreto. La clave pública se deriva de la privada, se puede compartir y sirve para generar la dirección y recibir transferencias.',
          },
        ],
      },
    },
    flash: {
      title: 'Intercambio rápido',
      intros: {
        gagx: 'Convierte gAGX a AGX — sin comisiones ni deslizamiento',
        gagxWrap: 'Envuelve AGX en gAGX — sin comisiones ni deslizamiento',
        usdt: 'Convierte USDT a USD1 — sin comisiones ni deslizamiento',
      },
      providerName: 'AEGIS X',
      openProvider: 'Ver contrato Flash en BscScan',
      settlementValue: 'En cadena · segundos',
      aboutTitle: 'Acerca de',
      action: 'Intercambio rápido',
      success: 'Flash exitoso',
      pairAriaLabel: 'Par Flash',
      pairs: {
        gagx: 'gAGX → AGX',
        usdt: 'USDT → USD1',
      },
      blocked: {
        paused: 'Flash está pausado. Inténtalo más tarde.',
        belowMin: 'El monto está por debajo del mínimo de intercambio.',
        aboveMax: 'El monto supera el máximo de intercambio.',
        insufficientReserve: 'Reserva de USD1 insuficiente. Inténtalo más tarde.',
        zeroRate: 'El tipo de cambio no está listo. Inténtalo más tarde.',
        insufficientOutput: 'La cotización cambió. Inténtalo de nuevo.',
        transferMismatch: 'La cantidad transferida del token no coincide. Reintenta.',
        zeroAddress: 'Dirección de contrato no válida. Inténtalo más tarde.',
        sameToken: 'Configuración de tokens de entrada/salida no válida. Inténtalo más tarde.',
        zeroAmount: 'Ingresa un monto de quema mayor que cero.',
        notAuthorized: 'Esta acción no está autorizada.',
        invalidLimits: 'Los límites de intercambio están mal configurados. Inténtalo más tarde.',
      },
      faq: {
        items: [
          {
            q: '¿Qué es gAGX?',
            a: 'gAGX es el comprobante unificado de liquidación de recompensas Rebase y DAO: el rendimiento Rebase de staking AGX o bonos, y las recompensas DAO, se pagan como gAGX.',
          },
          {
            q: '¿Cuál es el ratio de intercambio gAGX a AGX?',
            a: 'Fijo 1:1 en cualquier momento — sin comisiones ni deslizamiento; liquidación instantánea en cadena.',
          },
          {
            q: '¿Por qué Flash no tiene comisiones ni deslizamiento?',
            a: 'Flash es un canje fijo 1:1 gAGX↔AGX a nivel de protocolo, no un trade AMM; no hay deslizamiento ni comisión de intercambio. Solo pagas gas de BSC en BNB.',
          },
          {
            q: '¿Cómo obtengo gAGX?',
            a: 'El rendimiento Rebase de staking AGX, bonos LP o bonos de quema, más las recompensas DAO, se pagan a tu cuenta como gAGX.',
          },
          {
            q: '¿Qué más puedo hacer con gAGX además de canjearlo por AGX?',
            a: 'Haz staking de gAGX en Minado X para capturar X. Canjea a AGX o mina X — ambas rutas son tuyas.',
          },
          {
            q: '¿Cómo intercambio USDT por USD1?',
            a: 'En la parte superior de Flash cambia al par «USDT → USD1», ingresa la cantidad e intercambia 1:1 — sin comisiones, sin deslizamiento, liquidación instantánea en cadena.',
          },
          {
            q: '¿Puedo intercambiar USD1 de vuelta a USDT?',
            a: 'No. Flash solo convierte USDT a USD1 en un sentido. USD1 es el activo central de liquidación para operar, bonos y desbloqueos de Turbina.',
          },
          {
            q: '¿Dónde veo el historial de Flash?',
            a: 'Flash se ejecuta en cadena y acredita en segundos. Revisa tu billetera o un explorador de bloques.',
          },
        ],
      },
    },
    trade: {
      title: 'Operar',
      intro: 'Tipo de mercado en vivo de PancakeSwap · liquidación en cadena',
      aboutTitle: 'Acerca de',
      selectSellToken: 'Selecciona el token a vender',
      selectBuyToken: 'Selecciona el token a comprar',
      xBuyDisabledHint: 'X solo se puede vender',
      flipDisabledXSellOnly: 'X solo se puede vender — no se puede invertir a compra',
      action: 'Operar',
      success: 'Operación exitosa',
      priceImpact: 'Impacto en el precio',
      estimatedGas: 'Gas estimado',
      highPriceImpactWarning:
        'Esta operación puede mover mucho el precio del pool. Prueba un monto menor o sube la tolerancia de deslizamiento.',
    },
    burn: {
      title: 'Quemar',
      subtitle: 'Quema AGX para obtener puntos de contribución',
      sellLabel: 'Quemar',
      receiveLabel: 'Recibir',
      pointsToken: 'Mis puntos de contribución',
      currentContribution: 'Puntos de contribución actuales',
      burnRate: 'Ratio de quema',
      destination: 'Destino de la quema',
      destinationValue: 'Agujero negro {burnPct}% · LP {injectPct}%',
      providerName: 'AEGIS X',
      openProvider: 'Ver contrato de contribución en BscScan',
      action: 'Quemar',
      success: 'Quema exitosa',
      aboutTitle: 'Acerca de los puntos de contribución',
      blocked: {
        paused: 'La quema está pausada. Inténtalo más tarde.',
        belowMin: 'El monto está por debajo del mínimo de quema.',
        aboveMax: 'El monto supera el máximo de quema.',
        zeroRate: 'El ratio de quema no está listo. Inténtalo más tarde.',
        zeroAmount: 'Ingresa un monto de quema mayor que cero.',
      },
      metrics: {
        totalBurnedAgx: 'AGX quemado acumulado',
        totalEarnedContribution: 'Puntos de contribución obtenidos acumulados',
        totalConsumedContribution: 'Puntos de contribución consumidos acumulados',
      },
      history: {
        title: 'Historial de quema',
        emptyBurn:
          'Aún no hay registros de quema. Tras quemar AGX por puntos de contribución, cada operación aparecerá aquí.',
        emptyConsume:
          'Aún no hay registros de consumo. Tras reclamar recompensas que consumen puntos de contribución, cada registro aparecerá aquí.',
        tabsAriaLabel: 'Categorías del historial de quema',
        tabs: {
          burn: 'Quemar',
          consume: 'Consumir',
        },
        burnColumns: [
          'Hora',
          'AGX quemado',
          'Puntos de contribución obtenidos',
          'Hash de transacción',
        ],
        consumeColumns: [
          'Hora',
          'Uso',
          'Cantidad reclamada',
          'Puntos de contribución consumidos',
          'Hash de transacción',
        ],
        purpose: {
          stakeYield: 'Rendimiento de stake',
          lpBondYield: 'Rendimiento LP',
          burnBondYield: 'Rendimiento de quema',
          lucky: 'Suerte',
          rank: 'Rango',
          referral: 'Referidos',
          participation: 'Participación',
          surpass: 'Superación',
          lifetime: 'Vitalicio',
          market: 'Subsidio de mercado',
        },
      },
      faq: {
        items: [
          {
            q: '¿Para qué sirven los puntos de contribución?',
            a: 'Reclamar rendimiento de staking, bonos y otras fuentes consume contribución a {ratio}. Sin puntos suficientes no puedes reclamar.',
          },
          {
            q: '¿Por qué necesito puntos de contribución para reclamar?',
            a: 'Vincula las reclamaciones a la deflación del protocolo: cada reclamación consume {ratio}; los puntos solo se obtienen quemando AGX. Cada retiro de rendimiento corresponde a AGX quemado.',
          },
          {
            q: '¿Cuál es el ratio de quema?',
            a: 'Quema a {burnRatio}: cada 1 AGX quemado genera puntos equivalentes. El AGX quemado se reparte en cadena entre el agujero negro y el LP.',
          },
          {
            q: '¿A dónde va el AGX quemado?',
            a: 'Según la configuración de reparto en cadena, ~{burnPct}% va al agujero negro de forma permanente; ~{injectPct}% puede inyectarse en liquidez LP.',
          },
          {
            q: '¿Se pueden transferir o reembolsar los puntos de contribución?',
            a: 'No. Ligados a la cuenta — no se pueden transferir ni reembolsar. Solo se gastan al reclamar; quema según necesites.',
          },
        ],
      },
    },
    turbine: {
      title: 'Turbina',
      aboutTitle: 'Acerca de Turbina',
      segmentAriaLabel: 'Acciones de Turbina',
      segments: {
        unlock: 'Desbloquear',
        claim: 'Reclamar',
      },
      unlockLabel: 'Desbloquear',
      unlockable: 'Desbloqueable',
      equivalentBuyHint: 'Al desbloquear se ejecuta una compra equivalente al mismo tiempo',
      payUsd1Label: 'Pagar USD1',
      buyAgxLabel: 'Comprar AGX',
      buyToBoundWallet: 'Compra acreditada a la billetera',
      agxPrice: 'Precio de AGX',
      slippageHint:
        'El USD1 a pagar es la cotización más tu deslizamiento; el sobrante se devuelve. Si el colchón no basta, la transacción puede fallar y aún así gastar gas.',
      willReceiveAgx: 'AGX que recibirás',
      unlockRatio: 'Ratio de desbloqueo',
      unlockRatioValue: 'Compra 1 : 1 para desbloquear',
      cooldown: 'Periodo de espera',
      cooldownHoursValue: '{hours} h',
      unlockAction: 'Desbloquear',
      unlockSuccess: 'Desbloqueo exitoso; espera iniciada',
      claimAction: 'Reclamar',
      claimSuccess: 'Reclamado con éxito',
      claimEmpty: 'Aún no hay registros de desbloqueo',
      claimable: 'Retirable',
      cooling: 'En espera',
      countdownLabel: 'Cuenta atrás de desbloqueo',
      cooldownDone: 'Enfriamiento listo',
      countdownHours: 'h',
      countdownMinutes: 'min',
      dataTitle: 'Datos de Turbina',
      recordsTitle: 'Registros de Turbina',
      recordsEmpty:
        'Aún no hay registros de Turbina. Tras reclamar recompensas del pool de liberación hacia Turbina, cada acción aparecerá aquí.',
      mechanismTitle: 'Mecanismo de Turbina',
      mechanismIntro:
        'Vincula liquidez de venta con demanda de compra para que cada desbloqueo vaya con una compra equivalente',
      mechanism: [
        {
          title: 'Buy to unlock',
          body: 'gAGX claimed from the release pool stays locked in Turbine. Pay USD1 at the live on-chain quote to buy matching AGX, unlock quota, and start cooldown.',
        },
        {
          title: 'Espera dinámica',
          body: 'Cooldown adapts with treasury health (about 24–96 hours). Claim gAGX after it matures.',
        },
      ],
      metrics: {
        pendingUnlock: 'gAGX pendiente de desbloqueo',
        cooling: 'gAGX en espera',
        totalWithdrawn: 'Retirado acumulado',
        pendingUnlockHint:
          'Total de gAGX reclamado del pool de liberación al Turbine que aún no se ha desbloqueado',
        coolingHint: 'Total de gAGX que ya desbloqueó con compra y está en enfriamiento',
        totalWithdrawnHint: 'gAGX acumulado retirado del Turbine a la cartera',
      },
      faq: {
        items: [
          {
            q: '¿Cómo entra gAGX a Turbina?',
            a: 'El gAGX del pool de liberación no va a la billetera: entra solo a Turbina bloqueado (en los registros aparece «Entrada»). Compra AGX equivalente con USD1 para «Desbloquear» y «Retirar» tras la espera.',
          },
          {
            q: '¿Por qué hace falta comprar para desbloquear?',
            a: 'Desbloquear 1 gAGX exige comprar 1 AGX con USD1 al precio actual. Cada venta potencial va emparejada con una compra igual.',
          },
          {
            q: '¿Cuál es la diferencia entre desbloquear y retirar?',
            a: 'Desbloquear compra AGX equivalente con USD1, desbloquea gAGX e inicia la espera. Retirar mueve el gAGX desbloqueado a la billetera tras {cooldownHours} horas. Los registros muestran Desbloquear y Retirar.',
          },
          {
            q: '¿Cuánto dura la espera?',
            a: 'El periodo actual es {cooldownHours} horas, ajustado automáticamente por el mercado. Luego puedes retirar ese gAGX.',
          },
          {
            q: '¿A dónde va el AGX comprado al desbloquear?',
            a: 'El AGX comprado va directo a tu billetera, como una operación normal. El gAGX equivalente se desbloquea y entra en espera.',
          },
        ],
      },
    },
    tokenAbout: {
      title: 'Acerca de los tokens del ecosistema AEGIS X',
      items: [
        {
          key: 'usd1',
          title: 'USD1 · Activo de liquidación',
          body: 'Stablecoin central de liquidación del ecosistema AEGIS X, anclaje 1:1 e intercambio sin deslizamiento; atraviesa suscripción Genesis, staking y pagos.',
        },
        {
          key: 'agx',
          title: 'AGX · Activo central del protocolo',
          body: 'AGX es el activo central del protocolo AEGIS X, generado con sobrecolateralización del 150%, clave en crecimiento de valor, distribución de rendimientos y construcción del ecosistema.',
        },
        {
          key: 'gagx',
          title: 'gAGX · Comprobante de liquidación de rendimientos',
          body: 'Comprobante unificado de liquidación Rebase y DAO; canjeable 1:1 por AGX o usable en staking para minar X.',
        },
        {
          key: 'gagxStake',
          title: 'gAGX · Comprobante de staking',
          body: 'Comprobante con interés al hacer staking de AGX; capitaliza automáticamente y desbloquea peso de gobernanza y títulos superiores.',
        },
        {
          key: 'x',
          title: 'X · Ecosystem value token',
          body: 'The AEGIS X ecosystem value carrier with a fixed supply of 210 million, carrying ecosystem growth and value accumulation.',
        },
        {
          key: 'contribution',
          title: 'Puntos de contribución · Comprobante de recompensa',
          body: 'Reclamar recompensas consume puntos de contribución a {ratio}. Quemar AGX otorga puntos de contribución y refuerza la deflación del protocolo.',
        },
        {
          key: 'turbine',
          title: 'Turbina · Centro de desbloqueo de cuota',
          body: 'Las recompensas reclamadas de la cola de liberación entran en la cuota de Turbina. Comprar la misma cantidad de AGX con USD1 inicia un silencio de 24–96 h. Al vencer, el gAGX se enruta por el splitter para liberación lineal; no llega al monedero de inmediato.',
        },
      ],
    },
    tokenContract: 'Ver contrato',
    tokenPrevious: 'Token anterior',
    tokenNext: 'Token siguiente',
    faq: {
      title: 'FAQs',
      tabsTitle: 'FAQs',
      tabs: {
        trade: {
          label: 'Operar',
          items: [
            {
              q: '¿Cuál es la diferencia entre Operar y Flash?',
              a: 'Operar intercambia USD1, AGX, X y otros en PancakeSwap a tipo de mercado en vivo, con deslizamiento configurable y gas. Flash es conversión fija 1:1 gAGX↔AGX del protocolo, sin comisión ni deslizamiento.',
            },
            {
              q: '¿Qué es el deslizamiento permitido y cómo lo configuro?',
              a: 'El deslizamiento es el cambio de precio entre el envío y la liquidación. El permitido es la desviación máxima que aceptas: usa el valor por defecto o un porcentaje personalizado. Si el real lo supera, la operación revierte (puede consumir gas). Muy bajo falla fácil; muy alto puede llenar a peor precio.',
            },
            {
              q: '¿Cómo se liquida Operar y hay comisiones?',
              a: 'Las operaciones las liquida PancakeSwap en cadena. AEGIS X no cobra comisión extra de intercambio, pero cada tx necesita gas BSC en BNB — deja BNB suficiente en la billetera.',
            },
            {
              q: '¿Por qué la cantidad recibida puede diferir de la estimación?',
              a: 'La estimación usa el tipo al cotizar. El mercado u otras operaciones pueden cambiar el fill; el monto final es el liquidado en cadena dentro de tu deslizamiento permitido.',
            },
            {
              q: '¿Qué tokens puedo operar?',
              a: 'Puedes intercambiar tokens del ecosistema AEGIS X (USD1, AGX, X) a tipo de mercado. Usa las pestañas de arriba para el detalle de cada token.',
            },
            {
              q: '¿Dónde veo el historial de operaciones?',
              a: 'Las operaciones se ejecutan en cadena y se liquidan en segundos. Confirma cada tx en tu billetera o un explorador de bloques.',
            },
          ],
        },
        usd1: {
          label: 'USD1',
          items: [
            {
              q: '¿Qué es USD1?',
              a: 'USD1 es el activo central de liquidación del ecosistema AEGIS X, con respaldo 100% en reservas (efectivo, Treasuries de EE. UU. a corto plazo, fondos monetarios gubernamentales, etc.); cada mes puedes ver el desglose en el sitio de WLFI.',
            },
            {
              q: '¿Qué rol cumple USD1 en AEGIS X?',
              a: 'USD1 es el activo central de liquidación: conecta redes de liquidez, escenarios de pago y flujos de valor del ecosistema.',
            },
            {
              q: '¿Cómo obtengo USD1?',
              a: 'Usa la entrada «Obtener USD1» en el centro de intercambio con tipos de PancakeSwap, o intercambia AGX, X y otros tokens del ecosistema en la página Operar.',
            },
          ],
        },
        agx: {
          label: 'AGX',
          items: [
            {
              q: '¿Qué es AGX?',
              a: 'AGX es el activo central del protocolo AEGIS X, acuñado con sobrecolateralización del 150%, clave en crecimiento de valor, distribución de rendimientos y construcción del ecosistema.',
            },
            {
              q: '¿Cómo logra AGX un crecimiento sostenido?',
              a: 'Mediante staking, bonos y Rebase, AGX forma un ciclo de capitalización a largo plazo, junto con market making del think tank de IA y recompra-quema.',
            },
            {
              q: '¿Cómo obtengo AGX?',
              a: 'Puedes obtener AGX participando en el ecosistema del protocolo o en los mercados de trading que soporta.',
            },
            {
              q: '¿De dónde viene el respaldo de valor de AGX?',
              a: 'AGX se emite con sobrecolateralización del 150% respaldada por reservas del think tank, y forma un ciclo de valor a largo plazo mediante staking, bonos, capitalización Rebase y recompra-quema.',
            },
          ],
        },
        gagx: {
          label: 'gAGX',
          items: [
            {
              q: '¿Qué es gAGX?',
              a: 'gAGX es el comprobante de liquidación de recompensas del protocolo: conecta el crecimiento del rendimiento con el valor del ecosistema y permite participar en el minado.',
            },
            {
              q: '¿Cómo obtengo gAGX?',
              a: 'Tras participar en la distribución de rendimientos del protocolo, los usuarios reciben la cantidad correspondiente de gAGX.',
            },
            {
              q: '¿Cuál es la diferencia entre gAGX y AGX?',
              a: 'AGX es el activo central del protocolo, para el crecimiento de valor y la distribución de rendimientos; gAGX es el comprobante de rendimiento del ecosistema, canjeable por AGX, y una entrada clave al minado del ecosistema.',
            },
          ],
        },
        x: {
          label: 'X',
          items: [
            {
              q: '¿Qué es X?',
              a: 'X es el token de valor del ecosistema AEGIS X, con suministro fijo de 210 millones, que concentra el crecimiento y la acumulación de valor.',
            },
            {
              q: '¿Cómo obtengo X?',
              a: 'Puedes ganar recompensas X participando en el minado del ecosistema y compartiendo el valor de su crecimiento.',
            },
            {
              q: '¿Cómo se libera el airdrop de X?',
              a: 'El valor de X proviene del crecimiento del ecosistema, la acumulación de valor y el consenso de desarrollo a largo plazo; es un portador clave del valor del ecosistema.',
            },
            {
              q: '¿Por qué X se mantiene deflacionario?',
              a: 'X tiene un suministro fijo de 210 millones sin nuevas emisiones, y el 25% de cada venta se quema. La demanda por crecimiento más las quemas continuas reducen la circulación con el tiempo.',
            },
          ],
        },
      },
    },
    tokenContractTooltip: 'Ver detalles del token y del contrato',
  },
  genesis: {
    title: 'Plan de co-construcción',
    intro:
      'Participa en el plan de co-construcción X DAO · Fase {season}  ({discount} de descuento)',
    introEnded:
      'El programa de co-construcción X DAO ha concluido · Gracias a todos los co-constructores',
    shares: 'Participaciones (1 participación = {min} USD1 · máx. {max} participaciones)',
    quota: 'Cuota de co-construcción de esta fase',
    pay: 'Pagar',
    receive: 'Recibirás AGX',
    value: 'Valor de suscripción',
    xTokenAirdrop: 'Valor estimado del airdrop inicial de X',
    xTokenAirdropHint:
      'La participación acumulada en co-construcción por fase ≥ {threshold} da derecho a recompensas de airdrop.',
    join: 'Participar en la co-construcción',
    joinEnded: 'Co-construcción finalizada',
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
    contributionsEmptyEnded: {
      title: 'Sin registros de co-construcción',
      body: 'El programa de co-construcción ha terminado. Las cuentas que no participaron no tienen registros aquí.',
    },
    goBindReferrer: 'Vincular referente',
    seasonLive: 'En curso',
    seasonEnded: 'Finalizada',
    seasonUpcoming: 'Próximamente',
  },
  rewards: {
    title: 'Recompensas',
    intro: 'Consulta saldos de tarjetas de recompensa y registros de pago.',
    backToHub: 'Volver a recompensas',
    claim: 'Reclamar',
    claimSuccess: 'Reclamado con éxito',
    restakeSuccess: 'Reestaking correcto',
    claimErrors: {
      zeroAmount: 'El monto a reclamar es 0.',
      invalidSigner: 'Firma no válida. Actualiza e inténtalo de nuevo.',
      alreadyUsed: 'Esta recompensa ya fue reclamada. No vuelvas a reclamar.',
      expired: 'La firma expiró. Actualiza y reclama de nuevo.',
      noOrder: 'No hay recompensa disponible para reclamar.',
      failed: 'Falló la reclamación. Inténtalo más tarde.',
      confirmSyncFailed:
        'La recompensa se reclamó en cadena, pero falló la sincronización. Actualiza la página y no vuelvas a reclamar.',
    },
    hub: {
      asideTitle: 'Acerca de las recompensas AEGIS X',
      asideBody:
        'Seis tarjetas cubren sorteo de la suerte, referidos, participación, co-construcción, subsidio de desarrollo y co-construcción Génesis.',
      aboutTitle: 'Acerca de las recompensas AEGIS X',
      balanceLabel: 'Saldo',
      filterAria: 'Filtrar recompensas',
      hideZero: 'Ocultar activos en 0',
      hideZeroEmpty: 'No hay recompensas distintas de cero',
      balancePlaceholder: '0.00',
      signInForBalance: 'Inicia sesión con firma para ver',
      enterClaim: 'Entrar a reclamar',
      sessionHint:
        'Completa el inicio de sesión con firma de billetera antes de reclamar. Conectar la billetera no es lo mismo que el login de negocio.',
      stats: {
        totalRewards: 'Recompensas totales',
        tier: 'Nivel de co-construcción',
        tierEmpty: 'Aún no alcanzas un nivel de co-construcción',
        personalHolding: 'Posición personal',
        totalPerformance: 'Rendimiento total',
        smallAreaPerformance: 'Rendimiento del área menor',
        contribution: 'Mis puntos de contribución',
        contributionHint: 'Reclamar consume contribución {ratio}',
        goBurn: 'Ir a quemar',
      },
      mechanismTitle: 'Mecanismo de recompensa de co-construcción',
      mechanismBody:
        'Las recompensas de co-construcción provienen del rendimiento Rebase del equipo y se comparten por nivel.',
      mechanismFooter:
        'Mecanismo de dos líneas: cualquier dos líneas al nivel requerido completan el ascenso. A6–A9 también pueden ascender por una sola línea: una línea alcanza el nivel y el volumen conjunto de las demás cumple el umbral.',
      mechanismToggleAria: 'Cambiar regla de ascenso',
      aboutSlides: {
        lucky: {
          title: 'Premio de la suerte',
          body: 'El pozo diario es de al menos $5,000. Una participación única de $5,000 o más otorga un boleto; cada día se sortean 10 usuarios afortunados para repartir el pozo.',
        },
        referral: {
          title: 'Recompensa por referidos',
          body: 'Tras un referido directo que participa en la co-construcción, recibes el 10% de su rendimiento Rebase en cada ocasión, liquidado on-chain al instante. Mantén el valor de tu propia posición por encima de $100.',
        },
        participate: {
          title: 'Recompensa por participación',
          body: 'Tras vincularte con un enlace de referido y unirte a la co-construcción, recibes el 10% del rendimiento Rebase de tu invitador sobre la porción equivalente a tu posición, como recompensa por ser referido.',
        },
        cobuild: {
          title: 'Co-construcción',
          body: 'Proviene del rendimiento Rebase total del equipo y se paga según la tasa de tu nivel de co-construcción (A1 10% a A13 130%). A mayor nivel, mayor tasa; consulta la tabla de mecanismo más abajo.',
        },
        grant: {
          title: 'Subsidio de desarrollo',
          body: 'Subsidio especial del ecosistema; reclama con firma de MarketFund.',
        },
        genesis: {
          title: 'Recompensa de co-construcción Génesis',
          body: 'Recompensas de referidos, nivel y fondo de desarrollo del periodo Génesis; no se pueden reclamar tras el cierre de liquidación.',
        },
      },
      tierTable: {
        columns: [
          'Nivel',
          'Posición personal',
          'Cuentas activas',
          'Volumen del equipo',
          'Ratio de bono',
        ],
        rows: [
          { level: 'A1', holding: '$100', accounts: '2', team: 'Volumen ≥ $6,000', rate: '10%' },
          { level: 'A2', holding: '$100', accounts: '2', team: 'Volumen ≥ $20,000', rate: '20%' },
          { level: 'A3', holding: '$100', accounts: '2', team: 'Volumen ≥ $60,000', rate: '30%' },
          { level: 'A4', holding: '$500', accounts: '5', team: 'Volumen ≥ $180,000', rate: '40%' },
          {
            level: 'A5',
            holding: '$1,000',
            accounts: '5',
            team: 'Volumen ≥ $550,000',
            rate: '55%',
          },
          {
            level: 'A6',
            holding: '$2,000',
            accounts: '5',
            team: 'Dos líneas alcanzan A5',
            teamAlt: 'Una línea alcanza A5; las demás, volumen ≥ $1,000,000',
            rate: '68%',
          },
          {
            level: 'A7',
            holding: '$3,000',
            accounts: '10',
            team: 'Dos líneas alcanzan A6',
            teamAlt: 'Una línea alcanza A6; las demás, volumen ≥ $2,000,000',
            rate: '78%',
          },
          {
            level: 'A8',
            holding: '$5,000',
            accounts: '10',
            team: 'Dos líneas alcanzan A7',
            teamAlt: 'Una línea alcanza A7; las demás, volumen ≥ $4,000,000',
            rate: '88%',
          },
          {
            level: 'A9',
            holding: '$10,000',
            accounts: '10',
            team: 'Dos líneas alcanzan A8',
            teamAlt: 'Una línea alcanza A8; las demás, volumen ≥ $8,000,000',
            rate: '98%',
          },
          {
            level: 'A10',
            holding: '$20,000',
            accounts: '15',
            team: 'Dos líneas alcanzan A9',
            rate: '108%',
          },
          {
            level: 'A11',
            holding: '$30,000',
            accounts: '15',
            team: 'Dos líneas alcanzan A10',
            rate: '118%',
          },
          {
            level: 'A12',
            holding: '$40,000',
            accounts: '15',
            team: 'Dos líneas alcanzan A11',
            rate: '125%',
          },
          {
            level: 'A13',
            holding: '$50,000',
            accounts: '20',
            team: 'Dos líneas alcanzan A12',
            rate: '130%',
          },
          {
            level: 'Logro de por vida',
            holding: '$100,000',
            accounts: '20',
            team: 'Dos líneas alcanzan A13',
            rate: '130% + dividendo global 5%',
          },
        ],
      },
    },
    cards: {
      lucky: {
        title: 'Premio de la suerte',
        body: 'Sorteo por bloque para co-constructores',
        aside: 'Los premios de la suerte usan Chainlink VRF; los ganadores reclaman vía Mixed.',
      },
      referral: {
        title: 'Recompensa por referidos',
        body: 'Recompensas por invitar socios a la co-construcción',
        aside: 'Direct-referral related rewards; claim via DaoPool Mixed (contribution {ratio}).',
      },
      participate: {
        title: 'Recompensa por participación',
        body: 'Recompensas de tu referente',
        aside:
          'Recompensas de participación por el vínculo de referido; reclama vía DaoPool Mixed (consume contribución {ratio}).',
      },
      cobuild: {
        title: 'Co-construcción',
        body: 'Incentivos sostenibles de co-construcción por colaboración de equipo',
        aside:
          'Las recompensas de co-construcción se reclaman vía DaoPool Mixed y requieren puntos de contribución.',
      },
      grant: {
        title: 'Subsidio de desarrollo',
        body: 'Subsidio especial de desarrollo del ecosistema',
        aside:
          'Tras aprobación de soporte, el subsidio se reclama con firma de MarketFund, directo a la billetera.',
      },
      genesis: {
        title: 'Recompensas de co-construcción Génesis',
        body: 'Recompensas de referidos directos, nivel y fondo de desarrollo del periodo Génesis',
        aside: 'Las recompensas de co-construcción Génesis se reclaman con firma de RewardClaimer.',
        badge: 'Cierra pronto',
      },
    },
    detail: {
      claimable: 'Pendiente de reclamar',
      emptyClaimable: 'No hay recompensa disponible para reclamar.',
      signedAmountHint: 'El monto reclamable sigue el payload firmado',
      usdLabel: 'USD',
    },

    mixed: {
      splitAria: 'Proporción reclamar / reinvertir',
      releasePct: 'Reclamar {pct}%',
      restakePct: 'Reinvertir {pct}%',
      releasePeriod: 'Periodo de liberación',
      restakePeriod: 'Periodo de reinversión',
      releaseAria: 'Periodo de liberación',
      restakeAria: 'Periodo de reinversión',
      releaseDays: '{days} d',
      restakeDays: '{days} d',
      daysTax: '{days} d · {tax}',
      scheduleJoin: ', ',
      taxRate: 'Impuesto {rate}%',
      requiredContributionLabel: 'Puntos de contribución a descontar en esta reclamación',
      insufficientContributionDetail:
        'Puntos de contribución insuficientes (necesitas {need}, tienes {have}), ',
      goBurnInline: 'Ir a quemar',
      getContributionSuffix: ' para obtener puntos de contribución.',
      releaseInto: 'A la cola de liberación',
      restakeInto: 'Al staking de un solo activo',
      restakeLabel: 'Reinvertir',
      tokenGagx: 'gAGX',
      ctaReleaseLine: 'Reclamar {amount}',
      ctaRestakeLine: 'Reinvertir {amount}',
      requiredContribution: 'Puntos de contribución a descontar en esta reclamación: {amount}',
      insufficientContribution: 'Puntos de contribución insuficientes. Obtén puntos primero.',
      goBurn: 'Obtener puntos de contribución',
      luckyPaused: 'El pool de la suerte está pausado; no se puede reclamar.',
      luckyNotClaimable: 'No hay premio de la suerte para reclamar.',
    },

    lucky: {
      dataTitle: 'Datos',
      todayPool: 'Pozo de hoy',
      countdownHint: 'Próximo sorteo en {time}',
      eligibility: 'Elegibilidad de hoy',
      eligibilityYes: 'Calificado',
      eligibilityNo: 'No calificado',
      maxStakeHint: 'Compras del día {amount}',
      cumulativeWins: 'Ganancias acumuladas',
      winsCount: '{count} veces',
      winsAmountHint: '{amount} gAGX {approx}',
      vrfTitle: 'Aleatoriedad verificable Chainlink VRF v2',
      vrfBody:
        'Los sorteos de la suerte usan Chainlink VRF v2 con los contratos de staking: la aleatoriedad se genera en cadena con prueba criptográfica; el contrato elige automáticamente 10 usuarios afortunados de la lista del día. Sin intervención humana; cualquiera puede verificar en cadena.',
      verifyTutorial: 'Guía de verificación',
      collapseTutorial: 'Cerrar guía',
      vrfGuideStep1:
        'Haz clic en el hash de verificación de los resultados o del historial para abrir la transacción del sorteo en BscScan.',
      vrfGuideStep2:
        'En los Logs de la transacción, busca el callback de Chainlink VRF; randomWords es la aleatoriedad on-chain de esta ronda, con una prueba criptográfica que impide predecirla o alterarla.',
      vrfGuideStep3:
        'En la página Read Contract del contrato de staking, llama a verifyDraw con el ID de ronda del día para recalcular la lista de ganadores y compararla con los resultados publicados.',
      resultsTitle: 'Resultados del sorteo',
      dateFilterAria: 'Selecciona la fecha del sorteo',
      resultsSummary: 'Sorteo · {count} usuarios afortunados',
      verifyHash: 'Verificar hash de esta ronda',
      meBadge: 'Yo',
      resultWon: 'Ganaste {amount}',
      resultLost: 'No ganaste',
      resultsColumns: ['Puesto', 'Dirección ganadora', 'Participación', 'Premio'],
      emptyResults: 'Aún no hay resultados del sorteo',
      historyTitle: 'Historial de sorteos',
      historyColumns: ['Fecha', 'Participación', 'Resultado del sorteo', 'Verificar'],
      emptyHistory: 'Aún no hay historial de sorteos',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo obtengo elegibilidad para el sorteo?',
            a: 'La primera operación de staking o bono del día ≥ $5,000 otorga automáticamente elegibilidad ese día. Una elegibilidad por dirección por día.',
          },
          {
            q: '¿Cómo se liquida el sorteo?',
            a: 'A las 00:00 UTC, Chainlink VRF v2 genera aleatoriedad verificable; el contrato elige hasta 10 ganadores de la lista del día para repartir el pozo (objetivo diario ≥ $5,000).',
          },
          {
            q: '¿Cómo verifico que el resultado es justo?',
            a: 'La aleatoriedad VRF incluye prueba en cadena. Usa el enlace Verificar junto a cada resultado y la guía de verificación para recalcular ganadores. Los resultados son inmutables.',
          },
          {
            q: '¿Cómo se pagan los premios?',
            a: 'Los premios se convierten a gAGX al valor del sorteo y se acumulan en la tarjeta Lucky. Reclama con reglas Mixed (contribución {ratio}, cola de liberación o reinversión).',
          },
          {
            q: '¿Por qué no tengo elegibilidad tras hacer staking de $5,000?',
            a: 'La elegibilidad usa mark-to-market en la liquidación. Si el precio hace que el staking quede bajo $5,000, ese día no hay elegibilidad. Deja un margen.',
          },
          {
            q: '¿El staking flexible otorga elegibilidad para el sorteo?',
            a: 'No. El staking flexible tiene un tope diario por persona, así que una sola operación no superará $5,000 y no puede cumplir la elegibilidad del sorteo.',
          },
        ],
      },
    },
    referral: {
      dataTitle: 'Datos',
      totalRewards: 'Recompensas totales',
      myPosition: 'Mi posición',
      directCount: 'Detalle de referidos directos',
      contribution: 'Mis puntos de contribución',
      contributionHint: 'Reclamar consume {ratio}',
      nextPayout: 'Próximo pago de recompensas',
      recordsTitle: 'Registros de recompensa por referidos',
      recordsColumns: ['Hora', 'Cantidad a estimar', 'Estado', 'Hora de reclamación'],
      emptyRecords: 'Aún no hay registros de recompensa. Aparecerán tras cada emisión.',
      referralsTitle: 'Mis referidos ({count})',
      referralsColumns: [
        'Fecha de ingreso',
        'Dirección',
        'Posición',
        'Recompensas de referidos acumuladas',
      ],
      emptyReferrals:
        'Aún no hay referidos directos. Comparte tu enlace de invitación para listarlos aquí.',
      hideZeroPosition: 'Ocultar posiciones en 0',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo se calculan las recompensas por referidos?',
            a: 'Ganas el 10% del rendimiento Rebase de cada referido directo; liquidación en cadena y acumulación en la tarjeta de referidos.',
          },
          {
            q: '¿Cuáles son las condiciones para la recompensa por participación?',
            a: 'El valor de tu posición de staking/bono debe superar $100. Luego el Rebase de tus referidos directos te acredita tu parte.',
          },
          {
            q: '¿Por qué no recibo recompensa de participación si mi posición muestra $100?',
            a: 'El precio de AGX fluctúa; en la liquidación tu posición puede quedar en $99.99 y no cumplir el umbral. Mantén un margen.',
          },
          {
            q: '¿Si mi referido tiene mucha más posición que yo, sigo recibiendo el 10% completo?',
            a: 'Sí. Cumplir la condición >$100 te da el 10% completo de su Rebase, sin importar la diferencia de tamaño de posición.',
          },
          {
            q: '¿Cómo reclamo las recompensas por referidos?',
            a: 'En el panel izquierdo ajusta reclamar vs reinvertir: lo reclamado entra al pool de liberación y se desbloquea linealmente; lo reinvertido va a staking de un solo token para capitalizar. Ambos consumen {ratio}.',
          },
          {
            q: '¿Qué es el número de direcciones de referidos directos?',
            a: 'Billeteras que se vincularon con tu enlace e hicieron la primera participación. Solo cuenta la primera capa.',
          },
          {
            q: '¿Siguen las recompensas si un socio se retira?',
            a: 'Las recompensas siguen la posición activa del referido: continúan mientras genere rendimiento y se detienen tras la salida total. Lo ya ganado no se afecta.',
          },
        ],
      },
    },
    participate: {
      dataTitle: 'Datos',
      totalRewards: 'Recompensas totales',
      myPosition: 'Mi posición',
      contribution: 'Mis puntos de contribución',
      contributionHint: 'Reclamar consume {ratio}',
      nextPayout: 'Próximo pago de recompensas',
      recordsTitle: 'Registros de recompensa por participación',
      recordsColumns: ['Hora', 'Cantidad a estimar', 'Estado', 'Hora de reclamación'],
      emptyRecords: 'Aún no hay registros de recompensa. Aparecerán tras cada emisión.',
      inviterTitle: 'Mi referente',
      inviterColumns: [
        'Hora de vínculo',
        'Dirección',
        'Posición',
        'Recompensas acumuladas aportadas',
      ],
      emptyInviter:
        'Aún no hay vínculo de referente. Complétalo con un enlace de invitación para verlo aquí.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿De dónde vienen las recompensas por participación?',
            a: 'Tras vincularte con el enlace de tu referente y unirte a la co-construcción, ganas recompensas de participación de esa relación; liquidación en cadena y acumulación en la tarjeta Participación.',
          },
          {
            q: '¿Cómo se calculan las recompensas por participación?',
            a: 'Ganas el 10% del Rebase de tu referente sobre la parte igualada a tu posición. Ej.: tú $10,000 y referente $1,000 — toda su posición entra en el match, ganas 10% de todo su Rebase; si tiene $20,000, solo 10% de la parte de $10,000.',
          },
          {
            q: '¿Cuáles son las condiciones para la recompensa por participación?',
            a: 'Vincula con el enlace de tu referente y mantén el valor de staking/bono por encima de $100.',
          },
          {
            q: '¿Por qué no recibo recompensa de participación si mi posición muestra $100?',
            a: 'El precio de AGX fluctúa; en la liquidación tu posición puede quedar en $99.99 y no cumplir el umbral. Mantén un margen.',
          },
          {
            q: '¿Cómo reclamo las recompensas por participación?',
            a: 'En el panel izquierdo elige la proporción reclamar / reinvertir: lo reclamado entra al pool de liberación del periodo elegido; lo reinvertido va a staking de un solo token. Ambos consumen contribución {ratio} (DaoPool Mixed).',
          },
          {
            q: '¿Puedo cambiar de referente?',
            a: 'No. El vínculo de referido se escribe en cadena en el primer enlace y es permanente.',
          },
        ],
      },
    },
    cobuild: {
      dataTitle: 'Datos',
      totalRewards: 'Recompensas totales',
      totalPerformance: 'Rendimiento total',
      myPosition: 'Mi posición',
      directCount: 'Detalle de referidos directos',
      contribution: 'Mis puntos de contribución',
      contributionHint: 'Reclamar consume {ratio}',
      nextPayout: 'Próximo pago de recompensas',
      tierTitle: 'Nivel de co-construcción',
      tierCurrent: 'Nivel actual',
      tierNext: 'Siguiente nivel',
      reqHolding: 'Posición personal',
      reqHoldingHint: 'Valor de posiciones de staking y bonos',
      reqAccounts: 'Cuentas activas',
      reqAccountsHint: 'Direcciones directas activas',
      reqPerformance: 'Rendimiento total',
      reqPerformanceHint: 'Valor total de posiciones de la red',
      reqAchieved: 'Logrado',
      tierRate: 'Bonus {rate}',
      tierProgress: 'Progreso hacia {level}',
      tierProgressCount: 'Cumplido {done}/{total}',
      tierMax: 'Nivel máximo alcanzado',
      recordsTitle: 'Registros de recompensa',
      recordsTabsAria: 'Tipo de registro de recompensa',
      recordsTabCobuild: 'Co-construcción',
      recordsTabEqualize: 'Premio de nivelación',
      recordsColumns: ['Hora', 'Nivel', 'Cantidad a estimar', 'Estado', 'Hora de reclamación'],
      emptyRecordsCobuild: 'Aún no hay registros de recompensa. Aparecerán tras cada emisión.',
      emptyRecordsEqualize: 'Aún no hay registros de nivelación. Aparecerán tras la emisión.',
      teamTitle: 'Mi equipo ({count})',
      teamColumns: [
        'Fecha de ingreso',
        'Dirección',
        'Rendimiento del equipo',
        'Nivel máximo del equipo',
      ],
      emptyTeam:
        'Aún no hay miembros de equipo. Comparte tu enlace de invitación para listarlos aquí.',
      hideZeroMarket: 'Ocultar rendimiento 0',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo se calculan las recompensas de co-construcción?',
            a: 'Las recompensas de co-construcción vienen del Rebase total del equipo y se pagan al ratio de tu nivel (A1 10% a A13 130%). Ver la tabla del mecanismo en el hub de recompensas.',
          },
          {
            q: '¿Qué es el premio de nivelación?',
            a: 'Cuando un equipo inferior alcanza o supera tu nivel, su co-construcción ya no alimenta tu diferencial. La nivelación te paga el 10% de esa recompensa de co-construcción como compensación.',
          },
          {
            q: '¿Hay límite de nivel para la nivelación?',
            a: 'Sí. Solo cubre inferiores hasta 2 niveles por encima. Ej.: en A2 puedes nivelar A3/A4; A5+ queda fuera hasta que asciendas.',
          },
          {
            q: '¿Cómo se ascienden los niveles de co-construcción?',
            a: 'A1–A5 por posición personal, cuentas activas y volumen de equipo. Desde A6, regla de dos líneas (cualquier dos al nivel requerido); A6–A9 también permiten ruta de una línea + volumen de las demás.',
          },
          {
            q: '¿Cómo se contabiliza el volumen del equipo?',
            a: 'El volumen del equipo es el valor mark-to-market de staking y bonos de toda tu red de referidos en la liquidación.',
          },
          {
            q: '¿Cómo reclamo co-construcción y nivelación?',
            a: 'En la parte superior del panel izquierdo cambia Co-construcción / Nivelación y elige la proporción. Misma liberación/reinversión y {ratio}.',
          },
          {
            q: '¿Cuándo aplica la nueva tasa de nivel?',
            a: 'Los niveles se reevalúan en la liquidación diaria. El próximo pago de co-construcción usa la nueva tasa; la cobertura de nivelación se actualiza con el nuevo nivel.',
          },
        ],
      },
    },
    grant: {
      pendingLabel: 'Pendiente de aprobación',
      pendingHint: 'Pasa a reclamable tras la aprobación',
      pendingBody:
        'Contacta a soporte para desbloquear subsidios; reclama solo tras la aprobación.',
      contactSupport: 'Contactar a soporte para desbloquear',
      claimIntoWallet: 'A la billetera',
      ctaToWallet: 'Reclamar {amount} a la billetera',
      dataTitle: 'Datos',
      tier: 'Nivel de co-construcción',
      totalClaimed: 'Recompensas reclamadas acumuladas',
      recordsTitle: 'Registros de subsidio',
      recordsTabsAria: 'Tipo de registro de subsidio',
      recordsTabIssue: 'Emitido',
      recordsTabClaim: 'Reclamado',
      issueColumns: [
        'Hora de emisión',
        'Cantidad a estimar',
        'Tipo',
        'Hash',
        'Ratio del subsidio',
        'Cantidad del subsidio',
      ],
      claimColumns: ['Hora de reclamación', 'Cantidad a estimar', 'Hash'],
      emptyIssue: 'Aún no hay registros de emisión. Aparecerán cuando se acumulen subsidios.',
      emptyClaim: 'Aún no hay registros de reclamación. Aparecerán tras reclamar.',
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Qué es el subsidio de desarrollo?',
            a: 'Fondo especial para que los co-constructores expandan mercados — promoción, eventos de comunidad, canales — y se acumula con las posiciones de staking del equipo.',
          },
          {
            q: '¿Para qué se puede usar el subsidio?',
            a: 'Solo desarrollo de mercado: salones y roadshows, operación de comunidad, materiales promo, expansión de canales.',
          },
          {
            q: '¿Cómo uso el subsidio de desarrollo?',
            a: 'Dos vías: solicita antes de gastar (plan y presupuesto a soporte; lo aprobado pasa a reclamable) o reembolsa después con comprobantes.',
          },
          {
            q: '¿Por qué mi subsidio está pendiente de aprobación?',
            a: 'Los subsidios acumulados quedan pendientes hasta que envíes plan de uso o comprobantes y soporte apruebe. El progreso está en los registros de subsidio.',
          },
          {
            q: '¿Reclamar el subsidio consume puntos de contribución?',
            a: 'No. A diferencia de otras recompensas, el subsidio de desarrollo no consume contribución ni pasa por la cola de liberación: el gAGX va directo a tu billetera.',
          },
        ],
      },
    },

    genesisDetail: {
      pageTitle: 'Recompensas de co-construcción',
      pageSubtitle: 'Únete a la co-construcción · comparte el valor del crecimiento',
      claimToWallet: 'Reclamar a la billetera',
      tierColumns: ['Nivel', 'Suscripción personal', 'Volumen del sistema', 'Ratio de recompensa'],
      recordsTabsAria: 'Tipo de registro de recompensa Génesis',
      recordsColumns: ['Hora', 'Tipo', 'Cantidad a estimar', 'Estado'],
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo se calculan las recompensas por referidos?',
            a: 'Las recompensas por referidos son 3% con liquidación comprimida de monto igualado — solo cuenta lo emparejado; cuentas vacías omiten capas; el pago se liquida automáticamente.',
          },
          {
            q: '¿Cómo se ascienden los niveles Génesis?',
            a: 'Los niveles Génesis van de S1 a S10 según el monto personal de co-construcción y el volumen total de la organización. Los niveles altos requieren la condición de dos zonas.',
          },
          {
            q: '¿Qué es la recompensa por subida de nivel?',
            a: 'El nivel Génesis alcanzado durante la co-construcción se eleva automáticamente un nivel tras el lanzamiento, 30 días, y luego vuelve al nivel real.',
          },
          {
            q: '¿Cómo se liquidan las recompensas de equipo Génesis?',
            a: 'Las recompensas de equipo Génesis se liquidan automáticamente al ratio del nivel; debes reclamarlas a la billetera. Tras el periodo de co-construcción esta página se cierra; lo no reclamado pasa al contrato de creación de mercado inteligente.',
          },
        ],
      },
    },

    faq: {
      title: 'FAQs',
      items: [
        {
          q: '¿En qué forma se pagan las recompensas?',
          a: 'Todas las recompensas se liquidan como gAGX en las tarjetas correspondientes. Consulta el hub de Recompensas cuando quieras.',
        },
        {
          q: '¿Qué se necesita para reclamar?',
          a: 'Reclamar consume {ratio}. Si te faltan puntos, obténlos en la página Quemar.',
        },
        {
          q: '¿Cuándo llegan las recompensas reclamadas?',
          a: 'Elige un periodo de liberación; a más largo, menor impuesto. O reinviste parte o todo en staking de un solo token.',
        },
        {
          q: '¿Cuándo se liquidan las recompensas?',
          a: 'Lucky se liquida a las 00:00 UTC cada día. Las demás siguen el Rebase cada {hours} horas. La próxima hora está en el panel de datos de cada detalle.',
        },
        {
          q: '¿Por qué algunas tarjetas no muestran montos?',
          a: 'En ajustes (arriba a la derecha) está marcada por defecto «Ocultar activos en 0». Desmárcala para ver todas las tarjetas.',
        },
      ],
    },

    teamRewardRate: 'Recompensa del equipo {rate}',
    superCommunityBadge: 'Supersistema',
    heroTierRewardBody: 'Obtén {bonus} del volumen de co-construcción del equipo como recompensa.',
    superCommunityBenefitBody:
      'Los supersistemas reciben un fondo de desarrollo dedicado y derechos de gobernanza.',
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
    communityFundLocked: 'Bloqueado: {amount}',
    communityFundHistory: 'Fondo de desarrollo',
    communityFundHistoryEmpty: {
      title: 'Sin registros del fondo de desarrollo',
      body: 'Los registros de reclamación del fondo de desarrollo aparecerán aquí cuando se generen recompensas.',
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
    cobuildLevel: 'Nivel de co-construcción',
    inviteTitle: 'Empieza a invitar · comparte el valor del crecimiento del ecosistema',
    programs: {
      title: 'Programas de apoyo al ecosistema',
      items: [
        {
          label: 'Co-construcción Génesis · Fase {season}',
          title: 'Programa de Gobernadores de Reserva Génesis',
          body: 'Abiertas las primeras plazas globales de co-construcción',
          action: 'Ver detalles del plan',
          href: 'https://xdaoaegis.notion.site/programa-del-consejo-de-reserva-genesis',
        },
        {
          label: 'Academia X',
          title:
            'Academia Global DeFi · Academia de Liderazgo Global para la Era de la Economía Digital',
          body: 'Formar líderes para la era · Reservar talento para el futuro',
          action: 'Ver detalles del plan',
          href: 'https://xdaoaegis.notion.site/academia-x-esp',
        },
      ],
    },
    myInvites: 'Miembros de mi comunidad ({count})',
    referralBondPermanent: 'Relación de referido activada · el vínculo es permanente.',
    volumePrefix: 'Volumen',
    statToday: 'Hoy +{count} · +{amount}',
    statRewardRate: 'Tasa de recompensa {rate}',
    bindReferrerSuccess: 'Referente vinculado correctamente',
    inviteFlow: {
      rewardLink: 'Recompensas',
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
          title: 'Obtener recompensas',
          body: 'Tras la co-construcción, las recompensas se liquidan con el rebase. Entra en {link} para reclamarlas.',
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
          q: '¿Puedo cambiar a mi invitador?',
          a: 'Una vez vinculada, la relación de referido no se puede cambiar.',
        },
        {
          q: '¿Cómo subo mi nivel de co-construcción?',
          a: 'Según tus tenencias personales y el rendimiento del equipo, avanzas de A1 a A13.',
        },
        {
          q: '¿Cómo califico para la asignación de desarrollo?',
          a: 'Cuando el rendimiento acumulado del sistema alcanza $1,000,000, puedes recibir un 5% de fondo de desarrollo. Pide ayuda a tu invitador para solicitarla.',
        },
      ],
    },
  },
  assets: {
    title: 'Activos',
    intro: 'Gestiona tus fondos del ecosistema AEGIS X',
    body: 'Gestiona tus fondos del ecosistema AEGIS X',
    backToHub: 'Volver a Activos',
    blocked: {
      zeroAmount: 'Ingresa un monto válido',
      insufficientReward: 'Rendimiento reclamable insuficiente',
      insufficientContribution: 'Contribución insuficiente; quema AGX primero para obtener puntos',
      planUnresolved: 'Plan de liberación/reinversión no listo; inténtalo más tarde',
      nothingToRedeem: 'No hay cupo disponible para canjear',
      warmupActive: 'El precalentamiento no ha terminado; aún no se puede operar',
      warmupNotEnded: 'La cuenta regresiva de precalentamiento no ha terminado',
      noWarmup: 'No hay posición de precalentamiento por activar',
      unavailable: 'Transacción temporalmente no disponible; inténtalo más tarde',
    },
    position: {
      sort: 'Ordenar',
      quoteCurrency: 'Moneda de cotización',
      sortOptions: {
        startNear: 'Por inicio · más reciente primero',
        startFar: 'Por inicio · más antiguo primero',
        endNear: 'Por vencimiento · más próximo primero',
        endFar: 'Por vencimiento · más lejano primero',
      },
      emptyTitle: 'Haz que tus activos generen rendimiento',
      pageSize: 5,
      voucher: 'Comprobante',
      remaining: 'Tiempo restante',
      staked: 'Cantidad en staking',
      payout: 'Pendiente de canje',
      bondPrincipal: 'Principal del bono',
      yield: 'Rendimiento',
      claim: 'Reclamar',
      redeem: 'Canjear',
      unstake: 'Retirar staking',
      liquid: 'Sin bloqueo',
      lockedPrefix: 'Bloqueado',
      redeemAnytime: 'Canjeable en cualquier momento',
      fullyReleased: 'Totalmente liberado',
      activateWarmup: 'Desbloquear',
      activateWarmupSuccess: 'Desbloqueado',
      warmupRemainingEpochs: '{n} Epoch restantes',
    },
    opsColumns: ['Hora', 'Acción', 'Cantidad a estimar', 'Hash de tx'],
    claim: {
      title: 'Reclamar rendimiento',
      amount: 'Cantidad a reclamar',
      splitAria: 'Proporción liberación / reinversión',
      releaseShare: 'Reclamar {pct}%',
      restakeShare: 'Reinvertir {pct}%',
      releasePeriod: 'Periodo de liberación',
      releasePeriodAria: 'Periodo de liberación',
      restakePeriod: 'Periodo de reinversión',
      restakePeriodAria: 'Periodo de reinversión',
      releaseDays: '{days} d',
      restakeDays: '{days} d',
      restakeDaysTax: '{days} d · {tax}',
      taxRate: 'impuesto {rate}%',
      contribNeed: 'Esta reclamación descuenta contribución {amount}',
      contribShort: 'Contribución insuficiente; ve a quemar AGX para obtener puntos',
      goBurn: 'Ir a quemar',
      ctaMixed: 'Reclamar y reinvertir',
      ctaRelease: 'Reclamar',
      ctaRestake: 'Reinvertir',
      success: 'Reclamación enviada',
      restakeSuccess: 'Reestaking enviado',
      xmineSuccess: 'Reclamación de recompensa X enviada',
    },
    claimOutput: {
      title: 'Reclamar rendimiento',
      rewardLabel: 'Rendimiento',
      boostLabel: 'Bonus',
      claimReward: 'Reclamar rendimiento',
      claimBoost: 'Reclamar bonus',
      contribDeduct: 'Deduce {amount} de contribución',
    },
    redeem: {
      releasedLabel: 'Liberado',
      title: 'Canjear stake',
      body: 'Tras el canje, los activos entran en el búfer para una liberación lineal de {days} días. Los activos en el búfer no generan rendimiento',
      confirmCta: 'Canjear',
      success: 'Canje enviado; el principal entró al búfer de liberación',
    },
    hub: {
      filterAria: 'Filtrar activos',
      hideZero: 'Ocultar activos en 0',
      hideZeroEmpty: 'No hay posiciones distintas de cero',
      card: {
        position: 'Posición',
        yield: 'Rendimiento total',
      },
      modes: {
        stake: {
          title: 'Participación',
          body: 'Gestiona posiciones AGX flexibles / a plazo',
          aprHint:
            'Proporción del rendimiento de staking reclamado más el no reclamado y el rendimiento extra',
        },
        lpbond: {
          title: 'Bono LP',
          body: 'Gestiona posiciones de bono de liquidez',
          aprHint:
            'Proporción del rendimiento de bono LP reclamado más el rendimiento de bono LP no reclamado',
        },
        burnbond: {
          title: 'Bono de quema',
          body: 'Gestiona posiciones de bono de quema',
          aprHint:
            'Proporción del rendimiento de bono de quema reclamado más el rendimiento de bono de quema no reclamado',
        },
        xmine: {
          title: 'Minado X',
          body: 'Gestiona posiciones de minado gAGX',
          aprHint:
            'Proporción de la producción de minado reclamada más la producción de minado no reclamada',
        },
      },
      overview: {
        title: 'Resumen de activos',
        totalValue: 'Valor total de activos',
        totalValueHint:
          'Valoración a precio de mercado · incluye principal y rendimiento no reclamado',
        claimable: 'Rendimiento reclamable',
        claimed: 'Reclamado acumulado',
        contribution: 'Mis puntos de contribución',
        contributionHint: 'Reclamar rendimiento consume {ratio} de contribución',
        holdingsTitle: 'Posiciones',
        holdingsReleased: 'Liberado',
        holdingsTotal: 'Posiciones totales',
        bufferTitle: 'Pool búfer',
        bufferHint:
          'Tras desestacar, el principal entra en el búfer para una liberación lineal secundaria de {days} días, reduciendo la presión de salida concentrada a corto plazo sobre la liquidez y equilibrando continuidad y estabilidad.',
        bufferTotal: 'Total',
        bufferReleased: 'Liberado',
        bufferAssetAgx: 'AGX',
        bufferAssetGagx: 'gAGX',
        bufferSwitchAria: 'Cambiar visualización del activo del búfer',
      },
      distribution: {
        title: 'Distribución de posiciones',
        empty: 'Aún no hay posiciones. Tras staking o comprar bonos, verás la distribución aquí.',
      },
      rebase: {
        title: 'Mecanismo de liberación de rendimiento Rebase',
        subtitle:
          'La liquidación por fases y la liberación continua reducen la volatilidad y sostienen el crecimiento a largo plazo',
        steps: [
          { title: 'Block', body: 'Ejecución por bloques\\nUnidad base' },
          { title: 'Epoch', body: '~{blocks} bloques\\n~{hours} horas' },
          { title: 'Rebase', body: 'Fin de Epoch\\nLiquidación automática' },
          { title: 'Rebase', body: 'Distribución de rendimiento\\n{timesPerDay} veces al día' },
        ],
        tags: [
          'Impulsado por bloques',
          'Liquidación por Epoch',
          'Distribución por Rebase',
          'Liberación suave del rendimiento',
        ],
        footer:
          'Los bloques impulsan los ciclos; los Epoch liquidan; Rebase distribuye el rendimiento',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo se calcula el valor total de activos?',
            a: 'Total = principal + rendimiento no reclamado + producción de minado, valorados a precios de mercado. Los saldos ociosos de billetera no cuentan.',
          },
          {
            q: '¿En qué forma se paga el rendimiento?',
            a: 'El Rebase de staking, bonos LP y bonos de quema se liquida en gAGX (1:1 a AGX o Minado X). La producción de Minado X es X, reclamable en cualquier momento.',
          },
          {
            q: '¿Por qué no puedo reclamar rendimiento?',
            a: 'Hace falta contribución. Compra y quema AGX primero. Así cada retiro también deflacta el protocolo.',
          },
          {
            q: '¿Cómo obtengo contribución?',
            a: 'Compra y quema AGX. Reclamar consume {ratio}; prepara puntos suficientes.',
          },
          {
            q: '¿Por qué elegir un periodo de liberación al reclamar?',
            a: 'No es instantáneo; desbloqueo lineal; a más largo, menor impuesto: {taxSchedule}.',
          },
          {
            q: '¿A dónde va el rendimiento reclamado?',
            a: 'Entra al pool de liberación; síguelo allí; lo liberado se retira a la billetera.',
          },
          {
            q: '¿Cuál es la diferencia entre reinvertir y reclamar?',
            a: 'Reinvertir omite la liberación, tiene mejor impuesto ({restakeTax}) y capitaliza en staking de un solo token. Reclamar es más flexible.',
          },
          {
            q: '¿Qué es el pool búfer?',
            a: 'Tras retirar el staking, el principal entra al búfer con liberación lineal secundaria de {days} días. Lo «liberado» en el búfer se puede canjear a la billetera en cualquier momento.',
          },
        ],
      },
    },
    products: {
      stake: {
        title: 'Posiciones de staking',
        intro: 'Gestiona cada staking: reclama rendimiento o canjea el principal cuando quieras',
        empty: 'No stake positions',
        emptyCta: 'Go stake',
        stats: {
          title: 'Datos de la posición',
          metrics: [
            { label: 'Mis posiciones' },
            { label: 'Liberado' },
            { label: 'Pendiente de liberación' },
            {
              label: 'Rendimiento Rebase actual',
              hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
            },
            {
              label: 'Bonificación Rebase actual',
              hint: 'El bono Rebase no reclamado no capitaliza',
            },
            {
              label: 'Rendimiento total de staking',
              hint: 'Suma del rendimiento de staking reclamado y no reclamado',
            },
          ],
        },
        ops: {
          title: 'Historial de operaciones',
          empty:
            'Aún no hay operaciones. Tras staking, reclamar o canjear, verás cada registro aquí.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '¿Cuál es la diferencia entre reclamar y canjear?',
              a: 'Reclamar es el rendimiento (periodo de liberación o reinversión). Canjear es el principal AGX liberado → búfer de {days} días y luego la billetera.',
            },
            {
              q: '¿Por qué se muestra cada staking por separado?',
              a: 'Cada staking tiene periodo, rendimiento, bonificación y liberación independientes — se muestra y opera por separado.',
            },
            {
              q: '¿Qué significa «Liberado»?',
              a: '«Liberado» es el principal ya desbloqueado linealmente por bloque (~3 s), canjeable en cualquier momento.',
            },
            {
              q: '¿Qué ocurre cuando termina la cuenta regresiva?',
              a: 'El contador en cero significa que todo el principal está liberado; puedes canjearlo cuando quieras. El principal no reclamado sigue generando. Tras canjear el principal, el rendimiento no reclamado sigue capitalizando.',
            },
            {
              q: '¿Cómo funciona la proporción de reinversión al reclamar?',
              a: 'El control deslizante reparte reinversión y reclamación. Lo reinvertido capitaliza en el periodo de staking elegido (mejor impuesto). Lo reclamado se desbloquea en el periodo de liberación.',
            },
          ],
        },
      },
      lpbond: {
        title: 'Posiciones de bono LP',
        intro: 'Gestiona cada bono: reclama rendimiento o canjea el principal cuando quieras',
        empty:
          'Aún no hay posiciones de bono LP. Tras comprar un bono, cada posición aparecerá aquí.',
        emptyCta: 'Compra tu primer bono LP y empieza a ganar',
        stats: {
          title: 'Datos de la posición',
          metrics: [
            { label: 'Mis posiciones' },
            { label: 'Liberado' },
            { label: 'Pendiente de liberación' },
            {
              label: 'Rendimiento Rebase actual',
              hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
            },
            {
              label: 'Rendimiento total del bono LP',
              hint: 'Suma del rendimiento de bonos LP reclamado y no reclamado',
            },
          ],
        },
        ops: {
          title: 'Historial de operaciones',
          empty:
            'Aún no hay operaciones. Tras staking, reclamar o canjear, verás cada registro aquí.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '¿Cuál es la diferencia entre reclamar y canjear?',
              a: 'Reclamar es sobre el rendimiento: saca el gAGX del bono en el periodo de liberación elegido o reinviste; canjear es sobre el principal: retira el AGX liberado, entra a un búfer de {days} días de liberación lineal secundaria y luego a la billetera.',
            },
            {
              q: '¿De dónde viene el «principal del bono»?',
              a: 'El USD1 pagado por un bono LP se convierte a AGX con descuento — ese AGX es el principal. Se libera linealmente en 180/360/540 días; lo liberado se puede canjear en cualquier momento.',
            },
            {
              q: '¿Por qué se muestra cada bono por separado?',
              a: 'Cada bono calcula solo su periodo, descuento, rendimiento y liberación; vencimiento y acciones no se cruzan, por eso se muestran y operan por posición.',
            },
            {
              q: '¿Se puede reinvertir el rendimiento del bono?',
              a: 'Sí. Al reclamar reparte liberación y reinversión; lo reinvertido va a staking de un solo activo ({restakeDays}) con mejor impuesto que reclamar por periodo.',
            },
            {
              q: '¿Qué ocurre cuando termina la cuenta regresiva?',
              a: 'El contador en cero significa que la liberación del principal terminó; puedes canjear todo el principal en cualquier momento. El rendimiento no reclamado no se pierde y sigue capitalizando.',
            },
            {
              q: '¿Puedo retirar el LP de un bono LP?',
              a: 'No. El LP AGX/USD1 se bloquea permanentemente en una dirección de quema como liquidez del protocolo; tú obtienes principal AGX con descuento y su rendimiento.',
            },
          ],
        },
      },
      burnbond: {
        title: 'Posiciones de bono de quema',
        intro: 'Gestiona cada bono: reclama rendimiento o canjea el principal cuando quieras',
        empty:
          'Aún no hay posiciones de bono de quema. Tras comprar un bono, cada posición aparecerá aquí.',
        emptyCta: 'Compra tu primer bono de quema y empieza a ganar',
        stats: {
          title: 'Datos de la posición',
          metrics: [
            { label: 'Mis posiciones' },
            { label: 'Liberado' },
            { label: 'Pendiente de liberación' },
            {
              label: 'Rendimiento Rebase actual',
              hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
            },
            {
              label: 'Rendimiento total del bono de quema',
              hint: 'Suma del rendimiento de bonos de quema reclamado y no reclamado',
            },
          ],
        },
        ops: {
          title: 'Historial de operaciones',
          empty:
            'Aún no hay operaciones. Tras staking, reclamar o canjear, verás cada registro aquí.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '¿Cuál es la diferencia entre reclamar y canjear?',
              a: 'Reclamar es sobre el rendimiento: saca el gAGX del bono en el periodo de liberación elegido o reinviste; canjear es sobre el principal: retira el AGX liberado, entra a un búfer de {days} días de liberación lineal secundaria y luego a la billetera.',
            },
            {
              q: '¿De dónde viene el «principal del bono»?',
              a: 'El USD1 pagado por un bono de quema se convierte a AGX con descuento — ese AGX es el principal. Se libera linealmente en 180/360/540 días; lo liberado se puede canjear en cualquier momento.',
            },
            {
              q: '¿Por qué se muestra cada bono por separado?',
              a: 'Cada bono calcula solo su periodo, descuento, rendimiento y liberación; vencimiento y acciones no se cruzan, por eso se muestran y operan por posición.',
            },
            {
              q: '¿Se puede reinvertir el rendimiento del bono?',
              a: 'Sí. Al reclamar reparte liberación y reinversión; lo reinvertido va a staking de un solo activo ({restakeDays}) con mejor impuesto que reclamar por periodo.',
            },
            {
              q: '¿Qué ocurre cuando termina la cuenta regresiva?',
              a: 'El contador en cero significa que la liberación del principal terminó; puedes canjear todo el principal en cualquier momento. El rendimiento no reclamado no se pierde y sigue capitalizando.',
            },
            {
              q: '¿Qué impacto tiene el bono de quema en AGX?',
              a: 'Los fondos del bono de quema compran AGX y lo queman permanentemente en una dirección muerta — reducen la circulación y refuerzan la deflación mientras obtienes principal con descuento y rendimiento.',
            },
          ],
        },
      },
      xmine: {
        title: 'Posiciones de minado X',
        intro:
          'Gestiona cada staking de minado: reclama la producción o canjea el principal cuando quieras',
        empty:
          'Aún no hay posiciones de minado X. Tras hacer staking de gAGX, cada posición aparecerá aquí.',
        emptyCta: 'Haz staking de gAGX para minar X',
        periodPill: 'Staking de minado',
        output: 'Producción',
        stats: {
          title: 'Datos de la posición',
          metrics: [
            { label: 'Mi staking de minado' },
            { label: 'Liberado' },
            { label: 'Producción de minado actual' },
            {
              label: 'Producción total de minado',
              hint: 'Suma de la producción de minería reclamada y no reclamada',
            },
          ],
        },
        ops: {
          title: 'Historial de operaciones',
          empty:
            'Aún no hay operaciones. Tras staking, reclamar o canjear, verás cada registro aquí.',
        },
        faq: {
          title: 'FAQs',
          items: [
            {
              q: '¿Cuál es la diferencia entre reclamar producción y canjear staking?',
              a: 'Reclamar es la producción: X va a tu billetera sin periodo de liberación. Canjear es el principal: el gAGX entra al búfer con liberación lineal de 30 días y deja de generar rendimiento.',
            },
            {
              q: '¿Por qué algunas posiciones muestran «Bloqueado»?',
              a: 'Cada staking de gAGX entra a un bloqueo de 24 h; no puedes canjear durante el bloqueo. Tras la cuenta regresiva muestra «Canjeable en cualquier momento».',
            },
            {
              q: '¿Cómo se calcula la producción de minado?',
              a: 'Se liquida a diario a las 00:00 UTC con patrón oro: valor en USD del gAGX en staking × tasa del día, pagado en X. La cantidad varía con los precios de AGX y X.',
            },
            {
              q: '¿La producción de minado capitaliza?',
              a: 'No hay capitalización automática. Reclama X a mano; para crecer la posición, haz más staking de gAGX (sujeto al cupo).',
            },
            {
              q: '¿Por qué cambia mi tope de staking?',
              a: 'El cupo de staking gAGX no puede superar bonos AGX ≥180 días más el staking AGX. Más bonos o staking largo suben el cupo; al vencer baja.',
            },
            {
              q: '¿Sigo obteniendo producción tras canjear?',
              a: 'No. El gAGX canjeado deja de minar al entrar al búfer; las posiciones no canjeadas siguen con normalidad.',
            },
          ],
        },
      },
    },
  },
  staking: {
    title: 'Participación',
    intro: 'Staking y bonos co-construyen — comparte la capitalización Rebase',
    body: 'Staking y bonos co-construyen — comparte la capitalización Rebase',
    backToHub: 'Volver a Staking',
    max: 'Máx.',
    capUnlimited: 'Ilimitado',
    blocked: {
      notBound: 'Vincula primero una relación de referido',
      accountMigrated: 'Esta dirección migró; usa la nueva dirección',
      migrationNotOpen: 'La migración de cuenta aún no está abierta',
      insufficientBalance:
        'El saldo de la billetera no alcanza; reduce la cantidad o deposita primero e inténtalo de nuevo',
      insufficientGagx:
        'Saldo de gAGX insuficiente: primero envuelve AGX a gAGX en Flash e inténtalo de nuevo',
      insufficientAllowance: 'Autorización insuficiente',
      insufficientQuota:
        'Superaste el cupo de staking disponible; reduce la cantidad e inténtalo de nuevo',
      insufficientQuotaWithAmount:
        'Superaste el cupo de staking disponible: aún puedes stakear como máximo {quota} AGX. Reduce la cantidad e inténtalo de nuevo.',
      insufficientQuotaPersonalWithAmount:
        'Superaste tu cupo personal de staking: te quedan {quota} AGX del tope acumulado personal. Reduce la cantidad e inténtalo de nuevo.',
      insufficientQuotaPersonalDailyWithAmount:
        'Superaste tu cupo de staking de hoy: te quedan {quota} AGX del cupo personal diario. Reduce la cantidad, o espera a que se renueve el cupo.',
      insufficientQuotaPoolWithAmount:
        'El cupo del pool de staking on-chain no alcanza: al pool le quedan {quota} AGX. Reduce la cantidad, o inténtalo más tarde.',
      insufficientXmineQuotaWithAmount:
        'Superaste tu cupo de minería: el cupo de minería lo determina tu principal bloqueado; aún puedes stakear como máximo {quota} gAGX. Reduce la cantidad, o primero aumenta posiciones bloqueadas e inténtalo de nuevo.',
      poolPaused: 'Este pool de staking está temporalmente cerrado; inténtalo más tarde',
      depositoryNotAuth:
        'Este mercado de bonos aún no está abierto a la compra; elige otro plazo o inténtalo más tarde',
      insufficientDebtCapacity:
        'El cupo restante a la venta de este mercado de bonos no alcanza; reduce el monto de compra o inténtalo más tarde',
      bondTooSmall:
        'El monto de compra es demasiado pequeño: el pago con descuento no llega al mínimo. Aumenta el monto e inténtalo de nuevo',
      bondTooLarge:
        'El monto de compra es demasiado grande: supera el tope de pago por operación de este bono. Reduce el monto e inténtalo de nuevo',
      zeroAmount: 'Ingresa un monto válido',
      unavailable: 'Transacción temporalmente no disponible; inténtalo más tarde',
    },
    hub: {
      modes: {
        stake: {
          title: 'Participación',
          body: 'Haz staking de AGX: Rebase {timesPerDay} veces al día con capitalización',
        },
        lpbond: {
          title: 'Bono LP',
          body: 'Construye el pool con USD1 y obtén AGX con descuento',
        },
        burnbond: {
          title: 'Bono de quema',
          body: 'Emite AGX con descuento y quémalo permanentemente para reforzar la deflación',
        },
        xmine: {
          title: 'Minado X',
          body: 'Haz staking de gAGX para minar recompensas del ecosistema X sin pérdida',
        },
        calc: {
          title: 'Calculadora de rendimiento',
          body: 'Estima el rendimiento esperado en distintos periodos y precios',
        },
      },
      overview: {
        title: 'Resumen',
        metrics: [
          {
            id: 'tvl',
            label: 'TVL en staking',
            hint: 'Total de AGX en staking en el protocolo y su estimación en USD',
          },
          {
            id: 'mcap',
            label: 'Capitalización de mercado',
            hint: 'Valor total del AGX en circulación',
          },
          {
            id: 'circulating',
            label: 'Circulación de AGX',
            hint: 'Cantidad de AGX en circulación en el mercado',
          },
          {
            id: 'treasury',
            label: 'Reserva del think tank',
            hint: 'Activos de reserva del think tank para emisión colateral, market making y defensa de riesgo',
          },
          {
            id: 'price',
            label: 'Precio de AGX',
            hint: 'Precio de referencia de mercado de AGX frente a USD1',
          },
          {
            id: 'burned',
            label: 'Total quemado',
            hint: 'AGX quemado vía bonos de quema y compra de puntos de contribución',
          },
          {
            id: 'rebase',
            label: 'Rendimiento Rebase actual',
            hint: 'Se liquida una vez por Epoch (~{hours} h); se ajusta con el estado del protocolo',
          },
          {
            id: 'runway',
            label: 'Autonomía',
            hint: 'Tiempo sostenible estimado según reserva actual vs gasto del protocolo',
          },
          {
            id: 'stakers',
            label: 'Direcciones en staking',
            hint: 'Total de direcciones únicas que hicieron staking',
          },
        ],
      },
      periodTable: {
        title: 'Periodos y rendimientos',
        segmentAria: 'Cambio de producto de la tabla de periodos',
        segs: {
          stake: 'Participación',
          lpbond: 'Bono LP',
          burnbond: 'Bono de quema',
        },
        columns: [
          'Periodo a estimar',
          'Rendimiento base (diario)',
          'Bonificación de rendimiento',
          'Rendimiento del periodo',
        ],
        bondColumns: [
          'Periodo a estimar',
          'Rendimiento base (diario)',
          'Tasa de descuento',
          'Rendimiento del periodo',
        ],
        rows: [
          { id: 'liquid', period: 'Flexible (con plazo)' },
          { id: '180', period: '180 d' },
          { id: '360', period: '360 d' },
          { id: '540', period: '540 d' },
        ],
      },
      runwayDays: '> {days} d',
      chart: {
        title: 'Métricas',
        metricTabs: {
          tvl: 'TVL en staking',
          mcap: 'Capitalización de mercado',
        },
        metricAria: 'Cambio de métrica',
      },
      faq: {
        title: 'FAQs',
        items: [
          {
            q: '¿Cómo se liquida el Rebase?',
            a: 'El protocolo corre por bloques: ~{blocks} bloques = 1 Epoch (~{hours} horas). El Rebase se liquida al final de cada Epoch — {timesPerDay} veces al día.',
          },
          {
            q: '¿Cómo se libera el principal?',
            a: 'El principal de staking y bonos usa liberación lineal por bloques (~3 s por bloque). Tras retirarlo, entra a un búfer de {days} días para suavizar la salida.',
          },
          {
            q: '¿En qué se diferencian Staking, bono LP y bono de quema?',
            a: 'Staking deposita AGX para capitalización Rebase. Bonos LP y de quema usan USD1 por AGX con descuento — LP construye liquidez base permanente; quema destruye AGX para deflación. Los tres liberan el principal linealmente por periodo y ganan Rebase.',
          },
          {
            q: '¿En qué forma se pagan los rendimientos?',
            a: 'Los Rebase de todos los productos se liquidan como gAGX. Canjea gAGX 1:1 a AGX o haz staking de gAGX para minar X.',
          },
          {
            q: '¿Para qué sirve la reserva del think tank?',
            a: 'La reserva (USD1) respalda el protocolo: acuñación AGX con sobrecolateralización 150%, market making con IA y defensa de riesgo. El periodo operable estima el tiempo sostenible según reserva vs gasto.',
          },
          {
            q: '¿Cómo elijo la forma de participar?',
            a: 'Si buscas capitalización estable → Staking. AGX con descuento → bono LP o de quema. gAGX para capturar upside → Minado X. Usa primero la calculadora para comparar periodos.',
          },
          {
            q: '¿Cómo se entienden la capitalización y la circulación de AGX?',
            a: 'La circulación es el AGX en el mercado; capitalización = circulación × precio. Junto con TVL y quemado, muestran el ratio de bloqueo y el progreso deflacionario.',
          },
        ],
      },
    },
    aside: {
      countdownUnits: { hours: 'h', minutes: 'min', seconds: 's' },
      overview: 'Resumen',
      positions: 'Mis posiciones',
      positionsHint: 'Reclamar, canjear y retirar staking se hacen en la pestaña Activos.',
      viewPositions: 'Ver',
      mechanism: 'Cómo funciona',
      faq: 'Preguntas frecuentes',
      recordsTitles: {
        stake: 'Mis registros de staking',
        lpbond: 'Registros de compra de bonos',
        burnbond: 'Registros de compra de bonos',
        xmine: 'Mis registros de minado',
      },
      recordColumns: ['Hora', 'Periodo a estimar', 'Cantidad a estimar', 'Liberado', 'Hash de tx'],
      bondRecordColumns: [
        'Hora',
        'Periodo a estimar',
        'Pagado',
        'Descuento',
        'AGX recibido',
        'Hash de tx',
      ],
      xmineRecordColumns: ['Hora', 'Acción', 'Cantidad a estimar', 'Hash de tx'],
      recordsEmpty: {
        stake: 'Aún no hay registros de staking. Tras completar uno, cada staking aparecerá aquí.',
        lpbond:
          'Aún no hay registros de compra. Tras comprar un bono LP, cada compra aparecerá aquí.',
        burnbond:
          'Aún no hay registros de compra. Tras comprar un bono de quema, cada compra aparecerá aquí.',
        xmine:
          'Aún no hay registros de minado. Tras hacer staking de gAGX, cada acción aparecerá aquí.',
      },
      recordsFooter: {
        stake: 'Total apostado {amount} AGX',
        bond: 'Total comprado {amount}',
        xmine: 'Total apostado {amount} gAGX',
      },
      chartTitles: {
        stake: 'Métricas TVL (Staking)',
        lpbond: 'Métricas TVL (Bono LP)',
        burnbond: 'Métricas TVL (Bono de quema)',
        xmine: 'Métricas TVL (Minado X)',
      },
      chartRangeAria: 'Rango temporal del gráfico',
      chartRanges: ['1S', '1M', '1A', 'Todo'],
      chartEmpty: 'Aún no hay datos históricos',
      positionMetrics: [
        { label: 'Mi posición' },
        { label: 'Liberado' },
        { label: 'Pendiente de liberación' },
        {
          label: 'Rendimiento Rebase actual',
          hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
        },
        {
          label: 'Bonificación Rebase actual',
          hint: 'El bono Rebase no reclamado no capitaliza',
        },
      ],
      xValue: {
        title: 'Sistema de valor a largo plazo de X',
        supplyLabel: 'Suministro total de X',
        supplyValue: '210,000,000',
        badge: 'Suministro fijo · nunca se infla',
        columns: [
          {
            pct: '47.62%',
            title: 'Construcción de liquidez LP',
            bullets: ['Construcción inicial de liquidez', 'Market making y soporte de liquidez'],
          },
          {
            pct: '52.38%',
            title: 'Recompensas globales y desarrollo',
            bullets: [
              'Recompensas de minado gAGX',
              'Expansión de mercado y alianzas de marca',
              'Construcción del ecosistema y crecimiento a largo plazo',
            ],
          },
        ],
        sourcesKicker: 'Fuentes de valor',
        sourcesHeadline: 'Tres capas de demanda',
        sourcesBadge: 'Demanda de X en aumento',
        sources: [
          { title: 'Demanda de gAGX', copy: 'Haz staking para minar y crear demanda de X' },
          {
            title: 'Retorno de rendimiento',
            copy: 'El rendimiento del protocolo vuelve al ecosistema',
          },
          { title: 'Crecimiento del ecosistema', copy: 'Más apps y usuarios impulsan la demanda' },
        ],
        deflationKicker: 'Deflación de X',
        deflationHeadline: 'Deflación continua',
        deflationBadge: 'Menos oferta · más valor',
        deflationSteps: [
          { title: 'Crecimiento del ecosistema', copy: 'El ecosistema sigue expandiéndose' },
          { title: 'Más demanda de X', copy: 'Apps y trading elevan la demanda' },
          { title: 'Circulación de mercado', copy: 'X circula y se usa en el mercado' },
          { title: 'Quema del 25% al vender', copy: 'Cada venta quema automáticamente el 25%' },
        ],
        featuresKicker: 'Rasgos clave de X',
        featuresHeadline: 'Soporte de valor a largo plazo',
        featuresBadge: 'Escaso · deflacionario · líquido · expansivo',
        features: [
          { title: 'Suministro fijo', copy: 'Tope fijo, valor por escasez' },
          { title: 'Deflación continua', copy: 'La quema eleva el valor' },
          { title: 'Soporte de liquidez', copy: 'La liquidez estabiliza el mercado' },
          { title: 'Expansión del ecosistema', copy: 'Más apps, valor acumulado' },
        ],
      },
    },

    stake: {
      title: 'Participación',
      intro: 'Staking de AGX · Rebase {timesPerDay} veces al día con capitalización',
      periodLabel: 'Elige el periodo de staking',
      periodAria: 'Elige el periodo de staking',
      amountAria: 'Cantidad de staking',
      amountBalance: 'Cantidad (saldo de billetera {balance} AGX)',
      quotaInline: 'Cuota de staking: {quota} AGX',
      submit: 'Participación',
      bindCta: 'Ir a vincular referido',
      success: 'Staking exitoso',
      periods: {
        liquid: 'Sin bloqueo',
        d180: '180 d',
        d360: '360 d',
        d540: '540 d',
      },
      meta: {
        baseDaily: 'Rendimiento base (diario)',
        periodYield: 'Rendimiento del periodo',
        bonus: 'Bonificación de rendimiento',
        lock: 'Días de bloqueo',
        remaining: 'Cupo restante',
        contract: 'Ver contrato',
        lockLiquid: 'Sin bloqueo',
        lockDays: 'Liberación lineal de {days} días',
      },
      overviewMetrics: [
        { label: 'Total en staking' },
        {
          label: 'Epoch actual',
          hint: 'Cada Epoch dura unos {hours} h ({blocks} bloques); el rendimiento de staking se liquida por Epoch',
        },
        { label: 'Próximo pago Rebase' },
        {
          label: 'Rendimiento Rebase actual',
          hint: 'Se liquida una vez por Epoch (~{hours} h); se ajusta con el estado del protocolo',
        },
      ],
      mechanismTitle: 'Cómo funciona el staking',
      mechanism:
        'El staking flexible entra a warmup y hay que activarlo; el a plazo se bloquea en el pool elegido. Reclamar recompensas y sacar el principal se hace en Activos.',
      mechanismSteps: [
        {
          title: 'Hacer stake de AGX',
          body: 'Elige flexible o bloqueo de 180/360/540 días. A mayor plazo, mayor bonificación Rebase.',
        },
        {
          title: 'Rendimiento Rebase diario',
          body: 'Cada Epoch (~{hours} h) liquida; el rendimiento se acumula como gAGX.',
        },
        {
          title: 'Liberación y reclamación al vencimiento',
          body: 'El principal se libera linealmente por bloques; el gAGX se puede canjear 1:1 por AGX o seguir en staking para minar X.',
        },
      ],
      faq: [
        {
          q: '¿Cómo se calcula el rendimiento del staking?',
          a: 'Rebase {timesPerDay} veces al día; rendimiento diario ~0.5%–1%. A mayor plazo, mayor bonificación: 180 d ≥10%, 360 d ≥15%, 540 d ≥20%, ajustado con el factor Rebase.',
        },
        {
          q: '¿Cuándo se puede retirar el principal?',
          a: 'El principal se libera linealmente por bloques (~3 s). Lo liberado se puede retirar cuando quieras; tras retirarlo entra a un búfer de {days} días.',
        },
        {
          q: '¿El APY de referencia es fijo?',
          a: 'No. El APY es indicativo; el rendimiento real se mueve con el factor Rebase, el estado del protocolo y la oferta/demanda.',
        },
        {
          q: '¿Cuál es la diferencia entre rendimiento Rebase y bonificación Rebase?',
          a: 'El rendimiento Rebase capitaliza con cada Epoch mientras no se reclama. La bonificación Rebase es el extra del plazo largo y no capitaliza sin reclamar — reclama a tiempo.',
        },
        {
          q: '¿En qué forma se pagan los rendimientos?',
          a: 'Las recompensas de staking se pagan como gAGX. Canjea 1:1 por AGX cuando quieras, o haz staking de gAGX en Minado X para obtener X.',
        },
        {
          q: '¿Puedo salir antes del vencimiento?',
          a: 'No hay salida anticipada. El principal se libera linealmente en el periodo elegido; solo lo liberado se puede retirar. Elige un periodo que encaje con tu plan.',
        },
        {
          q: '¿Qué límites tiene el staking flexible?',
          a: 'El flexible no tiene bonificación de rendimiento y está limitado por cupos diarios globales y por cuenta que se reinician a diario (quien llega primero).',
        },
        {
          q: '¿Una cuenta puede tener varios stakings?',
          a: 'Sí. Cada staking calcula su propio periodo, rendimiento y progreso de liberación; puedes verlos en «Mis registros de staking».',
        },
      ],
    },
    lpbond: {
      title: 'Bono LP',
      intro: 'Construye el pool base con USD1 y obtén AGX con descuento',
      periodLabel: 'Selecciona el periodo del bono',
      periodAria: 'Periodo del bono LP',
      amountAria: 'Cantidad de compra',
      amountBalance: 'Cantidad (saldo de billetera {balance} USD1)',
      submit: 'Comprar',
      success: 'Compra exitosa',
      footnote:
        'El sistema construye automáticamente LP AGX/USD1 y lo quema en el agujero negro como liquidez base permanente.',
      card: {
        yield: 'Rendimiento del periodo',
        discountRange: 'Rango de descuento',
        sold: 'Vendido',
        currentDiscount: 'Descuento actual',
        discountPrice: 'Precio con descuento',
      },
      meta: {
        discount: 'Precio con descuento ({pct}%)',
        slippage: 'Deslizamiento permitido',
        pay: 'Pagar',
        receive: 'Recibir AGX',
        cap: 'Compra máxima',
        release: 'Liberación del principal',
        releaseLinear: 'Liberación lineal por bloques de {days} días',
        contract: 'Ver contrato',
      },
      overviewMetrics: [
        { label: 'TVL total del bono LP' },
        {
          label: 'Prima del bono',
          hint: 'Margen de retorno del descuento actual frente al precio de mercado de AGX',
        },
        { label: 'Próximo pago Rebase' },
        {
          label: 'Rendimiento Rebase actual',
          hint: 'Se liquida una vez por Epoch (~{hours} h); se ajusta con el estado del protocolo',
        },
      ],
      positionMetrics: [
        { label: 'My stake' },
        { label: 'Reclamado' },
        { label: 'Pendiente de liberación' },
        {
          label: 'Current Rebase reward',
          hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
        },
      ],
      mechanismTitle: 'Cómo funciona el bono LP',
      mechanism:
        'USD1 zap vía BondHelper al BondDepository del periodo. Canje y rendimiento en Activos.',
      mechanismSteps: [
        {
          title: 'Comprar bono LP',
          body: 'Usa USD1 para co-construir el pool y acuñar AGX con descuento.',
        },
        {
          title: 'Construcción automática de LP',
          body: 'Los contratos construyen automáticamente liquidez AGX/USD1.',
        },
        {
          title: 'Bloqueo permanente en agujero negro',
          body: 'Los LP Token van a la dirección del agujero negro — bloqueo permanente.',
        },
      ],
      faq: [
        {
          q: '¿Qué es un bono LP?',
          a: 'Paga USD1 para co-construir el pool: acuñación AGX con descuento, LP AGX/USD1 automático y quema del LP en el agujero negro (Blackhole Lock) como liquidez base permanente.',
        },
        {
          q: '¿Cómo se determina el descuento?',
          a: 'Dynamic Bond Control ajusta con oferta/demanda: 180 d 85%–100%, 360 d 80%–100%, 540 d 75%–100% — a mayor plazo, mejor descuento.',
        },
        {
          q: '¿Conservo LP Token tras comprar un bono LP?',
          a: 'No. El LP se quema en el agujero negro. Recibes AGX acuñado con descuento que se libera linealmente en el plazo del bono.',
        },
        {
          q: '¿Qué es la prima del bono?',
          a: 'La prima es la brecha entre el precio con descuento y el precio de mercado de AGX. Prima positiva significa que el bono supera la compra al contado.',
        },
        {
          q: '¿Puedo canjear antes de tiempo?',
          a: 'No hay canje anticipado. El principal se libera linealmente por bloques; reclama lo liberado cuando quieras.',
        },
        {
          q: '¿A dónde va el USD1 que pago?',
          a: 'El USD1 se empareja con AGX emitido con descuento en LP AGX/USD1; el LP se quema en el agujero negro como liquidez permanente del protocolo.',
        },
      ],
    },
    burnbond: {
      title: 'Bono de quema',
      intro: 'Emite AGX con descuento y quémalo permanentemente para reforzar la deflación',
      periodLabel: 'Selecciona el periodo del bono',
      periodAria: 'Periodo del bono de quema',
      amountAria: 'Cantidad de compra',
      amountBalance: 'Cantidad (saldo de billetera {balance} USD1)',
      submit: 'Comprar',
      success: 'Compra exitosa',
      footnote:
        'El sistema acuña AGX con descuento, lo compra automáticamente y lo quema de forma permanente en el agujero negro.',
      card: {
        yield: 'Rendimiento del periodo',
        discountRange: 'Rango de descuento',
        sold: 'Vendido',
        currentDiscount: 'Descuento actual',
        discountPrice: 'Precio con descuento',
      },
      meta: {
        discount: 'Precio con descuento ({pct}%)',
        slippage: 'Deslizamiento permitido',
        pay: 'Pagar',
        receive: 'Recibir AGX',
        cap: 'Compra máxima',
        release: 'Liberación del principal',
        releaseLinear: 'Liberación lineal por bloques de {days} días',
        contract: 'Ver contrato',
      },
      overviewMetrics: [
        { label: 'TVL total del bono de quema' },
        {
          label: 'Prima del bono',
          hint: 'Margen de retorno del descuento actual frente al precio de mercado de AGX',
        },
        { label: 'Próximo pago Rebase' },
        {
          label: 'Rendimiento Rebase actual',
          hint: 'Se liquida una vez por Epoch (~{hours} h); se ajusta con el estado del protocolo',
        },
      ],
      positionMetrics: [
        { label: 'My bonds' },
        { label: 'Liberado' },
        { label: 'Pendiente de liberación' },
        {
          label: 'Current Rebase reward',
          hint: 'El rendimiento Rebase no reclamado sigue capitalizando con cada recompensa de bloque',
        },
      ],
      mechanismTitle: 'Cómo funciona el bono de quema',
      mechanism:
        'USD1 zap vía BondHelper al BurnBondDepository del periodo. Canje y rendimiento en Activos.',
      mechanismSteps: [
        {
          title: 'Pagar USD1',
          body: 'Elige el periodo de liberación y únete al bono de quema al descuento actual.',
        },
        {
          title: 'Acuñar AGX con descuento',
          body: 'El sistema acuña AGX al ratio de descuento correspondiente.',
        },
        {
          title: 'Comprar y quemar para siempre',
          body: 'Compra automática de AGX y quema en el agujero negro para reforzar la deflación.',
        },
      ],
      faq: [
        {
          q: '¿Qué es un bono de quema?',
          a: 'Paga USD1: acuñación AGX con descuento, compra automática de AGX y quema permanente (Blackhole Lock) para reducir circulación y respaldar el valor a largo plazo.',
        },
        {
          q: '¿En qué se diferencia del bono LP?',
          a: 'El bono LP construye liquidez base permanente; el de quema deflacta la circulación. Mismas bandas de descuento (75%–100% por plazo); el principal se libera linealmente en ambos.',
        },
        {
          q: '¿Qué es la prima del bono?',
          a: 'La prima es la brecha entre el precio con descuento y el precio de mercado de AGX. Prima positiva significa que el bono supera la compra al contado.',
        },
        {
          q: '¿Puedo canjear antes de tiempo?',
          a: 'No hay canje anticipado. El principal se libera linealmente por bloques; reclama lo liberado cuando quieras.',
        },
        {
          q: '¿A dónde va el USD1 que pago?',
          a: 'El USD1 entra a las reservas del think tank para emisión colateral, market making y defensa de riesgo; el sistema emite AGX con descuento, lo compra y lo quema permanentemente en el agujero negro.',
        },
      ],
    },
    xmine: {
      title: 'Minado X',
      intro: 'Haz staking de gAGX para minar recompensas del ecosistema X',
      amountAria: 'Cantidad de staking gAGX',
      amountBalance: 'Cantidad (saldo de billetera {balance} gAGX)',
      quotaInline: 'Cupo de staking: {quota} gAGX',
      submit: 'Participación',
      success: 'Staking exitoso',
      openKlineChart: 'Ver gráfico de velas',
      meta: {
        quota: 'Cupo de staking',
        daily: 'Rendimiento (diario)',
        max: 'Staking máximo',
        maxHint:
          'El staking de gAGX no puede superar tus bonos AGX de ≥180 días más el total de staking de AGX',
        lock: 'Días de bloqueo',
        lockValue: 'Se libera tras 24 horas',
        h24: '24h',
        contract: 'Ver contrato',
      },
      overviewMetrics: [
        { label: 'TVL total de minado X' },
        { label: 'Precio de X' },
        { label: 'Producción de minado acumulada' },
        {
          label: 'Tasa de rendimiento del día',
          hint: 'Se asigna dinámicamente según el rendimiento del protocolo y el stake de la red; se ajusta a diario',
        },
        {
          label: 'Próxima producción de minado',
          hint: 'El rendimiento de minería X se produce a diario a las 00:00 UTC',
        },
      ],
      positionMetrics: [
        { label: 'Mi staking de minado' },
        { label: 'Liberado' },
        { label: 'Producción de minado' },
      ],
      mechanismTitle: 'Cómo funciona el minado X',
      mechanism:
        'Valida miningQuotaOf y luego stakeGagxForMining. Reclama X y retira staking en Activos.',
      mechanismSteps: [
        {
          title: 'Rebase + recompensas DAO',
          body: 'Los rendimientos se liquidan de forma uniforme como gAGX.',
        },
        {
          title: 'Hacer stake de gAGX',
          body: 'El gAGX en staking entra a un bloqueo de 24 horas.',
        },
        {
          title: 'Asignación dinámica de X',
          body: 'Las recompensas X se asignan dinámicamente según el rendimiento del protocolo.',
        },
        {
          title: 'Liberación lineal al retirar staking',
          body: 'Tras el desbloqueo, el gAGX se libera linealmente por bloques en ~30 días.',
        },
      ],
      faq: [
        {
          q: '¿Cómo participo en el minado X?',
          a: 'Haz staking de gAGX para minar X. Tras el staking, gAGX se bloquea 24 h; las recompensas X se asignan según el rendimiento del protocolo.',
        },
        {
          q: '¿Cuál es el tope de staking?',
          a: 'El staking de gAGX no puede superar tus bonos AGX ≥180 días más el total de staking AGX.',
        },
        {
          q: '¿Cómo se liberan los activos al retirar staking?',
          a: 'El gAGX desbloqueado se libera linealmente por bloques durante {days} días.',
        },
        {
          q: '¿Cuál es el suministro de X? ¿Se inflará?',
          a: 'Suministro fijo de 210 millones, nunca se infla. 47.62% para LP (pool inicial, creación de mercado y soporte de liquidez); 52.38% para recompensas globales (minado gAGX, expansión/marca, ecosistema).',
        },
        {
          q: '¿Cómo obtengo gAGX?',
          a: 'gAGX es el comprobante unificado de liquidación y la única entrada al ecosistema X.',
        },
        {
          q: '¿Qué más puede hacer gAGX además de minar?',
          a: 'Canjea 1:1 a AGX o mina X. Ambas rutas están disponibles.',
        },
        {
          q: '¿Por qué X se deflacta de forma continua?',
          a: 'Cada venta quema el 25%; la circulación se reduce; «menos oferta, más valor».',
        },
        {
          q: '¿Cuál es la fuente de valor de X?',
          a: 'Tres capas: demanda de minado, recirculación de ingresos y crecimiento de apps/usuarios.',
        },
        {
          q: '¿Por qué el tope de staking está ligado a bonos y staking a largo plazo?',
          a: 'El tope de gAGX no supera tus bonos AGX ≥180 días más el staking AGX. Añade bonos o staking largo para subir el tope.',
        },
      ],
    },
    calc: {
      title: 'Calculadora de rendimiento',
      intro: 'Estima el rendimiento esperado por producto, periodo y precio — sin tx en cadena',
      productAria: 'Producto a estimar',
      products: {
        stake: 'Participación',
        lpbond: 'Bono LP',
        burnbond: 'Bono de quema',
        xmine: 'Minado X',
      },
      periodLabel: 'Selecciona el periodo',
      periodAria: 'Periodo a estimar',
      amountLabel: 'Cantidad a estimar',
      amountBuy: 'Importe de compra',
      amountAria: 'Cantidad a estimar',
      price: 'Precio AGX al vencimiento',
      priceCurrent: 'Actual ${price}',
      priceAria: 'Entrada de precio',
      days: 'Días de tenencia',
      dayBubble: 'Día {day}',
      daysAria: 'Días de tenencia',
      submit: 'Calcular',
      result: {
        interest: 'Rendimiento estimado',
        total: 'Rendimiento total',
        rate: 'Tasa de rendimiento',
        sellTotal: 'Valor total de venta',
        invested: 'Inversión total',
        yieldBar: 'Rendimiento {amount}',
        legend: {
          released: 'Valor del principal liberado',
          netYield: 'Valor neto del rendimiento',
          netYieldHint: 'Rendimiento tras descontar los puntos de contribución',
          netYieldHintXmine: 'X minado, valorado al precio de X al vencimiento',
          cost: 'Costo de inversión',
          grossYield: 'Rendimiento total',
        },
      },
      aside: {
        result: 'Resultado de la estimación',
        resultHint: 'Ingresa parámetros a la izquierda y pulsa Calcular para ver el resultado.',
        tags: { day: 'Día {day}' },
        curve: 'Curva de rendimiento',
        curveHint:
          'Rendimiento acumulado día a día con los parámetros actuales; si no canjeas al vencimiento, sigue el interés compuesto',
        nodes: 'Nodos clave',
        nodeEndLabel: 'Mantener hasta el día {day}',
        nodeCards: [
          {
            label: 'Día de inicio de rendimiento positivo',
            note: 'Desde ese día, vender puede realizar rendimiento positivo',
          },
          {
            label: 'Principal totalmente liberado',
            hint: 'El principal se libera linealmente por bloques del periodo; desde ese día se puede retirar por completo',
          },
          {
            label: 'Mantener hasta el último día del periodo',
            note: 'Rendimiento acumulado relativo al principal',
          },
        ],
        notes: 'Notas del cálculo',
        notesBody:
          'Solo estimación local de referencia; no es cotización en cadena ni promesa de rendimiento.',
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
    title: 'Liberación',
    intro: 'Gestiona y consulta la liberación de rendimiento y principal',
    backToHub: 'Volver a liberación',
    recordColumns: ['Hora', 'Acción', 'Cantidad a estimar', 'Hash de tx'],
    recordsEmpty: 'Aún no hay registros indexados en cadena (pendiente indexer)',
    labels: {
      releasing: 'En liberación',
      released: 'Liberado',
      releasedPct: 'Liberado {pct}%',
    },
    units: {
      queue: 'gAGX',
    },
    errors: {
      claimFailed: 'Falló la reclamación. Inténtalo de nuevo',
    },
    hub: {
      aboutTitle: 'Acerca de la liberación',
      aboutCardTitle: 'Pool de liberación · rendimiento y recompensas',
      aboutCardBody:
        'El pool de liberación convierte la presión de venta instantánea en un flujo suave de varios días. Cada reclamación se desbloquea linealmente en el periodo elegido para alinear las salidas del protocolo con el crecimiento del ecosistema.',

      aboutSlides: [
        {
          title: 'Pool de liberación · rendimiento y recompensas',
          body: 'El pool de liberación convierte la presión de venta instantánea en un flujo suave de varios días. Cada reclamación se desbloquea linealmente en el periodo elegido para alinear la salida de rendimientos con el crecimiento del ecosistema, evitando impactos concentrados sobre el precio de AGX.',
        },
        {
          title: 'Pool búfer · segunda liberación del principal',
          body: 'Tras salir el principal de staking/bono, los fondos entran al búfer para una segunda liberación lineal alineada con la capacidad de absorción del mercado, reforzando la estabilidad.',
        },
      ],
      purposeTitle: 'Para qué sirve la liberación',
      purposeBody:
        'Todo el rendimiento pasa por el pool de liberación antes de Turbina. Distribuir el canje en el tiempo reduce la presión de venta; periodos más largos tienen menor impuesto para premiar la tenencia.',

      mechanismTitle: 'Mecanismo de reclamación de rendimiento',
      mechanismSubtitle:
        'La liberación está entre la creación de rendimiento y Turbina — cambia tiempo por menor impuesto y salidas más estables',
      mechanismSteps: [
        { title: 'Reclamar recompensas Rebase / DAO', body: 'Se genera el rendimiento' },
        {
          title: 'Mecanismo de contribución {divisor} : 1',
          body: '50% quema · 50% al pool base de X',
        },
        {
          title: 'Entrar al pool de liberación · liberación lineal',
          body: 'Elige periodo de 5 / 20 / 40 / 60 días',
        },
        { title: 'Reclamar hacia Turbina', body: 'Compra 1:1 para desbloquear cupo de venta' },
      ],
      taxTitle: 'Liberación más larga, impuesto más bajo',
      taxPeriod: 'Periodo a estimar',
      taxRate: 'Impuesto al reclamar',
    },
    queue: {
      title: 'Pool de liberación',
      intro:
        'El rendimiento y las recompensas reclamados se liberan aquí linealmente en el periodo elegido; lo liberado se puede reclamar hacia Turbina en cualquier momento',
      hubHint:
        'El rendimiento y las recompensas reclamados se liberan aquí linealmente en el periodo elegido (5/20/40/60 días). Lo liberado se puede reclamar hacia Turbina en cualquier momento.',
      planDays: '{days} d',
      claim: 'Reclamar',
      refresh: 'Actualizar',
      claimSuccess: 'Reclamado al cupo de Turbina',
      goTurbine: 'Ir a Turbina',
      statsTitle: 'Datos del pool de liberación',
      lifetimeClaimed: 'Reclamado acumulado del pool de liberación',
      hints: {
        releasing:
          'Total de gAGX aún en el pool de liberación, liberándose linealmente en el periodo elegido',
        released: 'gAGX ya liberado que se puede reclamar al Turbine en cualquier momento',
        lifetimeClaimed: 'gAGX acumulado reclamado del pool de liberación al Turbine',
      },
      recordsTitle: 'Registros del pool de liberación',
    },
    buffer: {
      title: 'Pool búfer',
      intro:
        'El principal redimido se libera aquí con una liberación lineal secundaria de {days} días. El AGX liberado se puede retirar a tu billetera.',
      hubHint:
        'Los activos redimidos entran al pool búfer y se liberan linealmente por bloques durante {days} días. Lo liberado se puede retirar a tu billetera en cualquier momento.',
      claim: 'Retirar',
      refresh: 'Actualizar',
      claimSuccess: 'AGX retirado a la billetera',
      statsTitle: 'Datos del pool búfer',
      entered: 'Entrada acumulada',
      extracted: 'Retirado acumulado',
      hints: {
        enteredAgx: 'Total de AGX que entró al búfer tras redimir staking y bonos',
        extractedAgx: 'Total de AGX retirado del búfer a la cartera',
        releasingAgx: 'AGX aún en liberación dentro del búfer',
        enteredGagx: 'Total de gAGX que entró al búfer tras redimir minería X',
        extractedGagx: 'Total de gAGX retirado del búfer a la cartera',
        releasingGagx: 'gAGX aún en liberación dentro del búfer',
      },
      recordsTitle: 'Registros del pool búfer',
      mechanismTitle: 'Mecanismo de liberación de fondos',
      mechanismSubtitle:
        'El principal de staking y bonos usa un modelo de liberación en dos etapas para la estabilidad del mercado',
      mechanismSteps: [
        { title: 'Staking/', body: 'principal del bono' },
        { title: 'A nivel de bloque', body: 'liberación lineal' },
        { title: 'Tras retirar', body: 'búfer de {days} días' },
        { title: 'lineal secundaria', body: 'liberación lineal' },
      ],
      mechanismBenefits: [
        'Evitar desbloqueos concentrados',
        'Reducir la presión de venta',
        'Suavizar la liberación de fondos',
        'Mejorar la estabilidad del mercado',
      ],
    },
    faq: {
      title: 'FAQs',
      hub: [
        {
          q: '¿Puedo cambiar el periodo de liberación?',
          a: 'No. El periodo queda fijo al entrar en cola. La siguiente reclamación puede ser distinta.',
        },
        {
          q: '¿Cuándo se descuenta el impuesto?',
          a: 'Se descuenta una vez al entrar en cola ({taxSchedule}). El pool muestra el monto neto. Luego no hay cargos extra.',
        },
        {
          q: '¿A dónde va el gAGX reclamado del pool de liberación?',
          a: 'El gAGX reclamado va a Turbina, no a la billetera. Gestiónalo en la página Turbina.',
        },
        {
          q: '¿Pierdo lo desbloqueado si no lo reclamo de inmediato?',
          a: 'No caduca. Lo liberado que se queda no genera nada — reclámalo a Turbina a tiempo.',
        },
        {
          q: '¿Cómo elijo un periodo de liberación adecuado?',
          a: 'Periodo corto = más rápido y más impuesto; largo = menos impuesto. O divide en varias reclamaciones.',
        },
      ],
      queue: [
        {
          q: '¿Puedo cambiar el periodo de liberación?',
          a: 'No. El periodo queda fijo al entrar en cola. La siguiente reclamación puede ser distinta.',
        },
        {
          q: '¿Cuándo se descuenta el impuesto?',
          a: 'Se descuenta una vez al entrar en cola ({taxSchedule}). El pool muestra el monto neto. Luego no hay cargos extra.',
        },
        {
          q: '¿A dónde va el gAGX reclamado del pool de liberación?',
          a: 'El gAGX reclamado va a Turbina, no a la billetera. Gestiónalo en la página Turbina.',
        },
        {
          q: '¿Pierdo lo desbloqueado si no lo reclamo de inmediato?',
          a: 'No caduca. Lo liberado que se queda no genera nada — reclámalo a Turbina a tiempo.',
        },
        {
          q: '¿Cómo elijo un periodo de liberación adecuado?',
          a: 'Periodo corto = más rápido y más impuesto; largo = menos impuesto. O divide en varias reclamaciones.',
        },
      ],
      buffer: [
        {
          q: '¿Qué es el pool búfer?',
          a: 'Tras canjear, liberación lineal secundaria de {days} días. Suaviza las salidas.',
        },
        {
          q: '¿Los activos en el pool búfer siguen generando rendimiento?',
          a: 'No. Al entrar al búfer deja de generar rendimiento.',
        },
        {
          q: '¿Cómo retiro lo liberado?',
          a: 'Liberación lineal por bloques; Retirar liberado → a la billetera al instante.',
        },
        {
          q: '¿Por qué el pool búfer muestra AGX y gAGX?',
          a: 'Canje de staking/bono = AGX; retiro de Minado X = gAGX. Independientes.',
        },
        {
          q: '¿Por qué no puedo retirar de una vez todos los activos liberados?',
          a: 'Hay muchos registros; un retiro procesa un número limitado — pulsa Retirar de nuevo.',
        },
      ],
    },
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
    communityVolume: 'Rendimiento del equipo',
    contribution: 'Suscripción',
  },
}) satisfies AppMessagesBundle

export default app
