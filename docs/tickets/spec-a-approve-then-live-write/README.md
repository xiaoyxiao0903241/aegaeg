# Spec-A 实现票索引

父 Spec：[`../spec-a-approve-then-live-write.md`](../spec-a-approve-then-live-write.md)  
范围：**全仓**迁入「授权后二次门闸写」编排核。  
状态：**01–09 done** · 2026-08-08

## 票序与阻塞

| # | 票 | Blocked by | 状态 |
|---|---|---|---|
| 01 | [核 softPre ↔ approve 同配](./01-core-soft-pre-approve.md) | — | done |
| 02 | [Lucky 迁核](./02-lucky-migrate.md) | 01 | done |
| 03 | [Genesis 迁核](./03-genesis-migrate.md) | 01 | done |
| 04 | [闪兑迁核](./04-flash-migrate.md) | 01 | done |
| 05 | [市价迁核](./05-market-migrate.md) | 01 | done |
| 06 | [销毁迁核](./06-burn-migrate.md) | 01 | done |
| 07 | [Turbine 迁核](./07-turbine-migrate.md) | 01 | done |
| 08 | [已合规路径行为测](./08-compliant-path-tests.md) | — | done |
| 09 | [收口与 Pack 账本](./09-closeout.md) | 02–08 | done |

## 工作方式

- 实现已合入工作树；**commit 须用户明示。**
- Turbine：授权后若报价再升导致授权不足，实时复核硬挡，用户重试（不再 live 软补授权）。
