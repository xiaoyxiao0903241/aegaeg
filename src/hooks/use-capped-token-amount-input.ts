import { useState } from 'react'

import { HUNDRED_BI, ZERO_BI } from '~/core/constants'
import {
  cappedTokenAmountRaw,
  capTokenAmountInput,
  formatTokenAmountDraft,
  parseTokenAmount,
  sanitizeTokenAmountInput,
} from '~/core/exchange/token-amount'

type UseCappedTokenAmountInputOptions = {
  decimals: number
  balance: bigint
  balancesLoaded: boolean
  sessionReady: boolean
  /** 展示与填充的小数位上限，实际取 min(decimals, maxFractionDigits)，默认 6。 */
  maxFractionDigits?: number
  /** 应用余额封顶前调用（例如清除提交/校验错误）。 */
  onBeforeCap?: () => void
}

/**
 * 受控的 token 数量输入（上限为钱包余额）
 *
 * 输入超过余额时自动截断到余额，并支持按百分比/最大填充；
 * 小数位取 min(decimals, maxFractionDigits)，避免前端精度误差。
 * 会话未就绪或余额未加载时只做字符清洗、不做封顶，防止写请求依赖未验证的数据。
 *
 * @param decimals token 小数位
 * @param balance 当前可用余额（wei）
 * @param balancesLoaded 余额是否已加载，未加载时禁用封顶
 * @param sessionReady 会话是否就绪，未就绪时禁用封顶
 * @param maxFractionDigits 展示小数位上限，默认 6
 * @param onBeforeCap 应用封顶前回调（如清除提交/校验错误）
 * @returns amount 封顶后的原始字符串、amountIn 解析后的 wei 值，以及 setAmount/clearAmount/fillPercent 操作
 */
export function useCappedTokenAmountInput({
  decimals,
  balance,
  balancesLoaded,
  sessionReady,
  maxFractionDigits = 6,
  onBeforeCap,
}: UseCappedTokenAmountInputOptions) {
  const [amountDraft, setAmountDraft] = useState('')
  const fractionLimit = Math.min(decimals, maxFractionDigits)

  const amount = cappedTokenAmountRaw({
    amount: amountDraft,
    sessionReady,
    balancesLoaded,
    balance,
    decimals,
    maxFractionDigits,
  })

  const amountIn = parseTokenAmount(amount, decimals)

  function setAmount(value: string) {
    if (!sessionReady || !balancesLoaded) {
      setAmountDraft(sanitizeTokenAmountInput(value, fractionLimit))
      return
    }

    onBeforeCap?.()
    setAmountDraft(capTokenAmountInput(value, balance, decimals, maxFractionDigits))
  }

  function clearAmount() {
    setAmountDraft('')
  }

  function fillPercent(percent: number) {
    if (balance === ZERO_BI) return
    onBeforeCap?.()
    const value = percent >= 100 ? balance : (balance * BigInt(percent)) / HUNDRED_BI
    setAmountDraft(formatTokenAmountDraft(value, decimals, fractionLimit))
  }

  return {
    amount,
    amountIn,
    setAmount,
    clearAmount,
    fillPercent,
  }
}
