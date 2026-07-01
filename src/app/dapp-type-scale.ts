/** Figma typography @ 16px root — scales with site-fluid via dapp-scale.css vars. */

export const dappKickerClass =
  'text-[length:var(--dapp-type-kicker-size)] font-semibold uppercase leading-[1.2] tracking-[0.88px]'

export const dappCaptionClass =
  'text-[length:var(--dapp-type-caption-size)] leading-[1.5] tracking-[-0.26px]'

export const dappTitleSmClass =
  'text-[length:var(--dapp-type-title-sm-size)] font-semibold leading-[1.3] tracking-[-0.63px]'

export const dappBodyLgClass =
  'text-[length:var(--dapp-type-body-lg-size)] leading-[1.3] tracking-[-0.34px]'

/** Rank card row-2 title — 17px semibold; beats parent `[&_span]:text-xs` on widget cards. */
export const dappRankTitleClass =
  `${dappBodyLgClass} font-semibold !text-[length:var(--dapp-type-body-lg-size)] max-dapp:!text-[length:var(--dapp-type-body-lg-size)] max-dapp:leading-[1.2]`

export const dappAmountClass =
  'text-[length:var(--dapp-type-amount-size)] font-semibold leading-normal tracking-[-0.44px]'

/** Referral reward amount — 22px on PC/H5; overrides RewardBalanceCard text-lg default. */
export const dappReferralAmountClass =
  `${dappAmountClass} !text-[length:var(--dapp-type-amount-size)] max-dapp:!text-[length:var(--dapp-type-amount-size)] leading-[1.3] tracking-[-0.54px] max-dapp:leading-[1.2] max-dapp:tracking-[-0.66px]`

export const dappCommunityStatPaddingClass = 'p-[var(--dapp-community-stat-padding)]'
