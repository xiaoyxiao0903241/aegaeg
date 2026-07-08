const imgIP61 = "https://www.figma.com/api/mcp/asset/aa334140-ff2c-40a3-9458-123dcddfa632";
const imgIcSwap = "https://www.figma.com/api/mcp/asset/6f6702e7-590b-4751-ac3c-8518ef0b687d";
const imgIcGenesis = "https://www.figma.com/api/mcp/asset/0e358934-c9cd-4ab4-b24a-978dcc4ebc02";
const imgIcRewards = "https://www.figma.com/api/mcp/asset/f8a01a38-1ae5-454b-84a7-287305478293";
const imgIcCommunity = "https://www.figma.com/api/mcp/asset/6e72b479-e5a6-4748-a7ff-cdd5f1195d65";
const imgFrame = "https://www.figma.com/api/mcp/asset/8ad010ba-5743-4efd-8c48-02a01a35e800";
const imgEllipse = "https://www.figma.com/api/mcp/asset/7190f68e-0a6c-4042-9cd7-f2ef1a4f2278";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/17d773e8-0b20-49e6-a462-5edfffee9f29";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/cf28fcf4-7500-4390-b838-d5f0854c9b65";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/fd4a5ac5-55d5-4216-b77a-0291991a7e93";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/3895734c-a6be-45d0-842d-1828d91061e9";
const imgIcChevron = "https://www.figma.com/api/mcp/asset/84017ff9-9dc2-4231-8db3-38a4d11571ff";
const imgIcChevron1 = "https://www.figma.com/api/mcp/asset/e526943d-3011-486f-9c62-0e2ed623a19b";

export default function AppWindow() {
  return (
    <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex items-start overflow-clip relative rounded-[var(--radius\/xl,28px)] shadow-[0px_12px_80px_0px_rgba(18,26,51,0.16)] size-full" data-node-id="4207:393" data-name="app-window">
      <div className="bg-[var(--bg\/surface,white)] border-[var(--border\/default,#eceef2)] border-r border-solid content-stretch flex flex-col gap-[6px] h-[820px] items-start overflow-clip px-[8px] py-[14px] relative shrink-0 w-[84px]" data-node-id="4207:394" data-name="rail">
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4207:395" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4207:396" data-name="ic-swap">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcSwap} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4207:398">
            Swap
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4207:399" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4207:400" data-name="ic-genesis">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcGenesis} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4207:404">
            共建
          </p>
        </div>
        <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4207:405" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4207:406" data-name="ic-rewards">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcRewards} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] whitespace-nowrap" data-node-id="4207:412">
            奖励
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4207:413" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4207:414" data-name="ic-community">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcCommunity} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4207:421">
            社区
          </p>
        </div>
      </div>
      <div className="bg-[var(--bg\/surface,white)] border-[var(--border\/default,#eceef2)] border-r border-solid content-stretch flex flex-col h-[820px] items-start overflow-clip pb-[22px] pt-[40px] px-[24px] relative shrink-0 w-[400px]" data-node-id="4207:422" data-name="wcol">
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:423" data-name="wh">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[281px]" data-node-id="4207:424">
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.84px] whitespace-nowrap" data-node-id="4207:425">
              共建奖励
            </p>
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[340px]" data-node-id="4207:426">
              参与共建 · 共享成长价值
            </p>
          </div>
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[13px] shrink-0 size-[42px]" data-node-id="4207:427" data-name="ham">
            <div className="relative shrink-0 size-[18px]" data-node-id="4207:428" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="h-[14px] relative shrink-0 w-full" data-node-id="4207:430" data-name="g" />
        <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:431" data-name="box">
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[11px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[0.88px] whitespace-nowrap" data-node-id="4207:432">
            当前等级
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[17px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.34px] w-[215px]" data-node-id="4207:433">
            S2 · 创世储备理事 · 超级社区
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[320px]" data-node-id="4207:434">
            团队奖励 2%
          </p>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4207:435" data-name="g" />
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:436" data-name="box">
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:437" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4207:438">
              距离 S3 · 个人认购
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4207:439">
              $1,500 / $2,000
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4207:440" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[247.5px]" data-node-id="4207:441" data-name="Rectangle" />
          </div>
          <div className="h-[4px] relative shrink-0 w-full" data-node-id="4207:442" data-name="g" />
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:443" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4207:444">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4207:445">
              $18,000 / $30,000
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4207:446" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[198px]" data-node-id="4207:447" data-name="Rectangle" />
          </div>
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:448" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4207:449">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4207:450">
              S3线 1 / 2
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4207:451" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[165px]" data-node-id="4207:452" data-name="Rectangle" />
          </div>
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:453" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4207:454">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4207:455">
              您已达到最高等级
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4207:456" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[320px]" data-node-id="4207:457" data-name="Rectangle" />
          </div>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4207:458" data-name="g" />
        <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:459" data-name="box">
          <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:460" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4207:461">
              直推奖励
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--functional\/up,#16b979)]" data-node-id="4207:462">
              自动支付
            </p>
          </div>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[22px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.66px] whitespace-nowrap" data-node-id="4207:463">
            $1,280.50
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[320px]" data-node-id="4207:464">
            奖励自动结算至钱包
          </p>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4207:465" data-name="g" />
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:466" data-name="box">
          <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4207:467" data-name="r">
            <p className="relative shrink-0" data-node-id="4207:468">
              等级奖励
            </p>
            <p className="relative shrink-0" data-node-id="4207:469">
              已领取: $1,860.40
            </p>
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="4207:470">
            $342.18 待领取
          </p>
          <div className="h-[4px] relative shrink-0 w-full" data-node-id="4207:471" data-name="g" />
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[42px] items-center justify-center overflow-clip relative rounded-[var(--radius\/pill,999px)] shrink-0 w-full" data-node-id="4207:472" data-name="claim">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/inverse,white)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:473">
              领取到钱包
            </p>
          </div>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4207:474" data-name="g" />
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:475" data-name="box">
          <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:476" data-name="r">
            <div className="content-stretch flex gap-[3px] items-center justify-center relative shrink-0" data-node-id="4208:365" data-name="发展基金_group">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] whitespace-nowrap" data-node-id="4207:477">
                发展基金
              </p>
              <div className="relative shrink-0 size-[16px]" data-node-id="4207:733" data-name="info-icon">
                <div className="absolute left-0 size-[16px] top-0" data-node-id="4207:734" data-name="Ellipse">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse} />
                </div>
                <p className="[word-break:break-word] absolute font-['Inter:Bold'] font-bold leading-[normal] left-[6.5px] not-italic text-[#4d4d59] text-[10px] top-[2px] whitespace-nowrap" data-node-id="4207:735">
                  i
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] whitespace-nowrap" data-node-id="4207:478">
              待解锁: $2,868.40
            </p>
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="4207:479">
            $0.00 已解锁
          </p>
          <div className="h-[4px] relative shrink-0 w-full" data-node-id="4207:480" data-name="g" />
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[42px] items-center justify-center overflow-clip relative rounded-[var(--radius\/pill,999px)] shrink-0 w-full" data-node-id="4207:481" data-name="claim">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/inverse,white)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:482">
              领取到钱包
            </p>
          </div>
        </div>
      </div>
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col h-[1576px] items-start min-w-px overflow-clip pb-[30px] pt-[40px] px-[28px] relative" data-node-id="4207:483" data-name="dcol">
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] relative shrink-0 w-full" data-node-id="4207:484" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4207:485">
            当前等级
          </p>
        </div>
        <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[24px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4207:486" data-name="tc">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[11px] text-[color:var(--accent\/coral-bright,#f4a98f)] tracking-[0.88px] whitespace-nowrap" data-node-id="4207:487">
            创世等级
          </p>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/inverse,white)] tracking-[-0.63px] whitespace-nowrap" data-node-id="4207:488">
            S2 · 创世储备理事 · 超级社区
          </p>
          <div className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[0] relative shrink-0 text-[13px] text-[color:var(--text\/inverse,white)] tracking-[-0.26px] w-[594px]" data-node-id="4207:489">
            <p className="leading-[1.5] mb-0">创世储备理事将获得团队共建金额的2%作为奖励。</p>
            <p className="leading-[1.5]">超级社区将获得体系发展专项基⾦以及治理权益。</p>
          </div>
          <div className="absolute h-[13px] left-[675px] top-[128px] w-[47px]" data-node-id="4207:490">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4207:491" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4207:492">
            创世荣誉体系
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col items-start overflow-clip px-[16px] py-[6px] relative rounded-[var(--radius\/md,16px)] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] shrink-0 w-full" data-node-id="4207:493" data-name="tbl">
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:494" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:495" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:496">
                创世称号
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:497" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:498">
                参与共建
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:499" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:500">
                总业绩
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:501" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:502">
                奖励比例
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:505" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:506" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:507" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:508">
                S1
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:509" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:510">
                $500
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:511" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:512">
                $5,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:513" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:514">
                1%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:517" data-name="Rectangle" />
          <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:518" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:519" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:520">
                S2 · 当前
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:521" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:522">
                $1,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:523" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:524">
                $10,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:525" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:526">
                2%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:529" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:530" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:531" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:532">
                S3
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:533" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:534">
                $2,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:535" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:536">
                $30,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:537" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:538">
                3%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:541" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:542" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:543" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:544">
                S4
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:545" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:546">
                $3,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:547" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:548">
                2条S3线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:549" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:550">
                4%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:553" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:554" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:555" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:556">
                S5
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:557" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:558">
                $5,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:559" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:560">
                2条S4线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:561" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:562">
                5%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:565" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4207:566" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:567" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:568">
                S6
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:569" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:570">
                $10,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:571" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:572">
                2条S5线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:573" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:574">
                6%
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4207:577" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4207:578">
            奖励记录
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[10px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] shrink-0 w-full" data-node-id="4207:579" data-name="tbl">
          <div className="content-stretch flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="4207:580" data-name="htabs">
            <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-start overflow-clip px-[16px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="4207:585" data-name="htab">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.13px] whitespace-nowrap" data-node-id="4207:586">
                直推奖励
              </p>
            </div>
            <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-start overflow-clip px-[16px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="4207:583" data-name="htab">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.13px] whitespace-nowrap" data-node-id="4207:584">
                等级奖励
              </p>
            </div>
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col items-start overflow-clip px-[16px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="4207:581" data-name="htab">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.13px] whitespace-nowrap" data-node-id="4207:582">
                发展基金
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="4207:587" data-name="tt">
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:588" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:589" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:590">
                  领取时间
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:591" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:592">
                  金额
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:597" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:598">
                  状态
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:599" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:600" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:601" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:602">
                  05-30 14:22
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:603" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:604">
                  $60.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:609" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:610">
                  已支付
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:611" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:612" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:613" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:614">
                  05-29 10:08
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:615" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/coral,#e9785a)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:616">
                  $30.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:621" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:622">
                  已支付
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4207:623" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:624" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:625" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:626">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:627" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/coral,#e9785a)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:628">
                  $90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:633" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:634">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:635" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:636" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:637">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:638" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/coral,#e9785a)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:639">
                  $90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:644" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:645">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4207:646" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:647" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:648">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:649" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/coral,#e9785a)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:650">
                  $90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4207:655" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4207:656">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-[748px]" data-node-id="4207:657" data-name="pagination">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] w-[72px]" data-node-id="4207:658">
                共 250 条
              </p>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] w-[121px]" data-node-id="4207:713">
                累计领取 $10,000
              </p>
              <div className="flex-[1_0_0] h-px min-w-px relative" data-node-id="4207:659" data-name="spacer" />
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4207:660">
                每页 5 条
              </p>
              <div className="h-px relative shrink-0 w-[16px]" data-node-id="4207:661" data-name="gap" />
              <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[32px]" data-node-id="4207:662" data-name="btn-disabled">
                <div className="flex items-center justify-center relative shrink-0 size-[12px]" data-node-id="4207:663">
                  <div className="flex-none rotate-90">
                    <div className="relative size-[12px]" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px relative shrink-0 w-[4px]" data-node-id="4207:665" data-name="gap" />
              <div className="bg-[rgba(200,92,63,0.1)] content-stretch flex gap-[2px] h-[32px] items-center justify-center overflow-clip px-[12px] relative rounded-[6px] shrink-0 w-[80px]" data-node-id="4207:666" data-name="page-indicator">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#c85c3f] text-[12px] whitespace-nowrap" data-node-id="4207:667">
                  1 / 50
                </p>
                <div className="flex items-center justify-center relative shrink-0" data-node-id="4207:668">
                  <div className="-scale-y-100 flex-none">
                    <div className="relative size-[12px]" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px relative shrink-0 w-[4px]" data-node-id="4207:670" data-name="gap" />
              <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[32px]" data-node-id="4207:671" data-name="btn">
                <div className="flex items-center justify-center relative shrink-0 size-[12px]" data-node-id="4207:672">
                  <div className="-rotate-90 flex-none">
                    <div className="relative size-[12px]" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4207:674" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4207:675">
            FAQ
          </p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4207:676">
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4207:677" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:678" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4207:679">
                  推荐奖励如何计算？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4207:680" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4207:682">
                推荐奖励为3%，采用压缩同等金额结算机制，仅按同等金额部分计算，空账户不计奖励层级，奖励自动结算。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4207:683" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:684" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4207:685">
                  创世等级如何晋升？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4207:686" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4207:688">
                创世等级由S1至S10，根据个人共建金额与体系总业绩进行评定，高等级需满足双区晋升条件。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4207:689" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:690" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4207:691">
                  什么是等级提升奖励？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4207:692" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4207:694">
                共建期间达成的创世等级，将于协议上线后自动提升1个等级，有效期30天，结束后恢复真实等级。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4207:695" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4207:696" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4207:697">
                  创世团队奖励如何结算？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4207:698" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4207:700">
                创世团队奖励根据对应创世等级比例自动结算，需用户手动领取到钱包。共建期结束后，当前页面将关闭，未领取的奖励不可再领取，奖励将被打入智能做市合约。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[188px] items-center justify-center left-[1147px] top-[35px] w-[133px]" data-node-id="4207:701">
        <div className="-scale-y-100 flex-none rotate-180">
          <div className="h-[188px] relative w-[133px]" data-name="IP动作6 1">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[106.38%] left-[-0.13%] max-w-none top-[-6.38%] w-[100.25%]" src={imgIP61} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
