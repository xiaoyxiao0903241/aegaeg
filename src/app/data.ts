export const inviteFlow = [
  {
    title: 'Share your link',
    copy: 'Connect wallet to generate a personal referral link.',
  },
  {
    title: 'Friends join',
    copy: 'Registering via your link activates the bond.',
  },
  {
    title: 'Earn rewards',
    copy: 'When they contribute or stake, rewards flow to you.',
  },
]

export const programs = [
  {
    label: 'X DAO Genesis · Season 1',
    title: 'Global genesis shareholder recruitment is live',
    body: 'The Genesis phase unites core builders worldwide to co-build the AEGIS X ecosystem.',
    link: 'Learn about the program →',
  },
  {
    label: 'X Academy',
    title: 'Professional DeFi training for the community',
    body: 'X Academy helps builders worldwide participate in XDAO more systematically.',
    link: 'View session requirements →',
  },
]

export const invites = [
  ['2026-04-12', '0x05…E515', '8,450', 'S6', '16', '245,960'],
  ['2026-04-28', '0x94…A2BF', '3,280', 'S3', '8', '82,140'],
  ['2026-05-02', '0xc4…9C6a', '1,640', 'S3', '5', '45,300'],
  ['2026-05-10', '0x39…Ef7A', '520', 'S0', '2', '8,200'],
  ['2026-05-20', '0xfF…f468', '210', 'S0', '0', '1,100'],
]

export const compactInvites = [
  ['2026-04-12', '0x05A1…E515', 'S6', '3', '$246,000'],
  ['2026-04-28', '0x94C2…A2BF', 'S3', '1', '$82,400'],
  ['2026-05-02', '0xc4D9…9C6a', 'S3', '0', '$45,100'],
  ['2026-05-18', '0x7F10…77B0', 'S2', '0', '$12,800'],
]

export const mobileCommunityInvites = [
  ['04-12', '0x05…E515', 'S6', '246K'],
  ['04-28', '0x94…A2BF', 'S3', '82K'],
  ['05-02', '0xc4…9C6a', 'S3', '45K'],
]

export const mobileCommunityFirstVisitInvites = [
  ['04-12', '0x05…E515', 'S6', '246K'],
  ['04-28', '0x94…A2BF', 'S3', '82K'],
  ['05-02', '0xc4…9C6a', 'S3', '45K'],
]

export const recentSwaps = [
  ['Today 09:42', '200 USDT', '+200.00 USD1', 'Success'],
  ['Yesterday 14:08', '50 USD1', '+50.00 USDT', 'Success'],
  ['Yesterday 11:32', '120 USDT', '+120.00 USD1', 'Success'],
  ['05-24 23:45', '500 USDT', '+500.00 USD1', 'Success'],
]

export const mobileRecentSwaps = [
  ['Today 09:42', '+200.00 USD1', 'Success'],
  ['Yest. 14:08', '+50.00 USDT', 'Success'],
  ['Yest. 11:32', '+120.00 USD1', 'Success'],
  ['05-24 23:45', '+500.00 USD1', 'Success'],
]

export const swapTokenKeys = ['usd1', 'agx', 'gagx', 'x'] as const
export const swapTokenCardKeys = ['agx', 'usd1', 'x', 'gagx'] as const

export type SwapTokenKey = (typeof swapTokenKeys)[number]

export const seasons = [
  {
    name: 'Season 1',
    status: 'Ended',
    discount: '30% off',
    desktopMeta: {
      discount: '-30%',
      airdrop: '+5%',
    },
    price: '≈ $45.5',
    date: '06.21 – 07.10',
    quota: '$100 – $10,000',
  },
  {
    name: 'Season 2',
    status: 'LIVE',
    discount: '25% off',
    desktopMeta: {
      discount: '-25%',
      airdrop: '+2%',
    },
    price: '≈ $48.75',
    date: '07.11 – 07.30',
    quota: '$100 – $10,000',
    active: true,
  },
  {
    name: 'Season 3',
    status: 'Upcoming',
    discount: '20% off',
    desktopMeta: {
      discount: '-20%',
      airdrop: '+1%',
    },
    price: '≈ $52',
    date: '07.31 – 08.19',
    quota: '$100 – $30,000',
  },
]

export const contributionRows = [
  ['06-21 14:32', '2,000 USD1', '-30%', '43.95', '0x9a3f…'],
  ['06-23 09:18', '1,000 USD1', '-30%', '21.97', '0x4e7b…'],
  ['06-28 20:05', '3,000 USD1', '-30%', '65.93', '0xc25a…'],
]

export const mobileContributionRows = contributionRows.map(
  ([time, paid, discount, estimatedAgx]) => [time, paid, discount, estimatedAgx],
)

export const rewardTiers = [
  ['S1', '$500', '$5,000', '1%', 'A2'],
  ['S2 · current', '$1,000', '$10,000', '2%', 'A3'],
  ['S3', '$2,000', '$30,000', '3%', 'A4'],
  ['S4', '$3,000', 'Two legs S3', '4%', 'A5'],
  ['S5', '$5,000', 'Two legs S4', '5%', 'A6'],
  ['S6', '$10,000', 'Two legs S5', '6%', 'A7'],
]

export const mobileRewardTiers = rewardTiers
  .slice(0, 4)
  .map(([title, personalContribution, , bonusRate, postLaunchRank]) => [
    title.replace(' · current', ''),
    personalContribution,
    bonusRate,
    postLaunchRank,
  ])

export const rewardRows = [
  ['05-30 14:22', '+$60.00', '0x9a3f…', '$2,000', '3%', 'Paid'],
  ['05-29 10:08', '+$30.00', '0x4e7b…', '$1,000', '3%', 'Paid'],
  ['05-28 19:45', '+$90.00', '0xc012…', '$3,000', '3%', 'Paid'],
]

export const teamRewardRows = [
  ['06-01 00:00', '+$342.18', 'Epoch settlement', '$17,109', '2%', 'Claimable'],
  ['05-25 00:00', '+$1,860.40', 'Epoch settlement', '$93,020', '2%', 'Claimed'],
]
