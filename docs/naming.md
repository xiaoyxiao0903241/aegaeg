# Naming standards (AEGIS)

**Business vocabulary first.** Identifiers must be understandable to product people; syntax (camelCase / kebab-case) is secondary.

Full glossary: [`../UBIQUITOUS_LANGUAGE.md`](../UBIQUITOUS_LANGUAGE.md).

## Rules

1. Read the glossary **Term** before naming folders, files, types, functions, or variables.
2. Prefer English **business** words (product language), not engineering process words.
3. Contract address keys / ABI field names / backend JSON fields stay as in the contract manual (do not rename those).
4. New DApp navigation targets the **7-rail** product IA: exchange · assets · staking · rewards · release · community · genesis.

## Ban list (core / product code)

Do not use these as primary names for product modules:

- `Dto`, `Entity`, `Model`, `Record`, `Payload`, `Data`, `Info`, `Object` (unless the glossary defines that exact term)
- `Manager`, `Handler`, `Helper`, `Util`, `Wrapper`, `Processor`, `Service` (unless glossary Term)
- Vague verbs alone: `process`, `handle`, `do`, `execute`, `run`
- Scaffold / academic labels as feature folders: `common`, `base`, `system` (prefer a real capability)

Infrastructure adapters (`shared/lib`, thin wallet RPC helpers) may keep technical names, but must not leak as the **primary** name of a product feature.

## Batch 4 full polish — done

Directory / export renames to glossary English business words are complete for this slice:

- **7-rail + exchange dirs** — navigation `exchange` · `assets` · `staking` · `rewards` · `release` · `community` · `genesis`; view bag `views/dapp/exchange`; `flash-exchange/` · `market-trade/` · `burn/` · `turbine/` · `hub/`; i18n `t.exchange`; stores `exchange-view-store` / `exchange-direction-store`
- **web3 / core** — `web3/exchange` · `core/exchange`
- **Config** — `EXCHANGE_CONFIG` / `shared/config/exchange` · `pancake-exchange-links`
- **Errors / invalidation / shell** — `EXCHANGE_QUOTE_FAILED` · `invalidateAfterExchange` · `flashExchangeAssets` · `Exchange*Skeleton` · `HIGH_EXCHANGE_PRICE_IMPACT_BPS`
- **Claim** — `web3/claim/claim-reward` · `use-claim-reward` · `parse-team-reward-claim`
- **Unknown receipt** — `unknown-receipt-lock` (`lockUnknownReceipt` / `clearUnknownReceiptLock` / `isUnknownReceiptLocked`)
- **Startup** — `src/app/startup/` (was `bootstrap/`)

**Frozen (do not rename):** query key literals `'swap'` / `'flashSwap'`; `WRITE_PATH.EXCHANGE` **value** `'swap'`; ABI `functionName: 'swap'`; ABI constants `USD1_SWAP_*` / `SWAP_ROUTER_V3_*`; contract keys like `usd1Swap` / `pancakeV3SwapRouter`; backend JSON field names. Keep `genesis` as the co-build product directory name.
