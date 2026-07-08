const imgIP61 = "https://www.figma.com/api/mcp/asset/2fd10205-45ff-4aa2-a5e6-c0c427eee6ef";
const imgIcSwap = "https://www.figma.com/api/mcp/asset/2b85eaed-b29b-4602-b701-b1daa3b29279";
const imgIcGenesis = "https://www.figma.com/api/mcp/asset/9e7db745-5413-4fd8-b1b9-c743fbf06821";
const imgIcRewards = "https://www.figma.com/api/mcp/asset/bb4873a7-22a9-4b22-a3ee-84ea7e7761cd";
const imgIcCommunity = "https://www.figma.com/api/mcp/asset/ec691799-0b5e-4c08-8aa4-a0f18e630a3b";
const imgFrame = "https://www.figma.com/api/mcp/asset/a058fc8f-f15c-414b-8bda-f0a14cb0746a";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/3954a6e5-584b-4b41-9e5c-ead2c70deead";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/157fc3fb-a035-4790-bedf-a230c08faa83";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/43e86610-b75b-447e-89a4-e1684dd54da7";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/a229c19d-6871-4dfa-a8fa-c8a7e863c662";
const imgIcChevron = "https://www.figma.com/api/mcp/asset/a0bc011d-10ac-4179-bf8e-60f2d57a7101";
const imgIcChevron1 = "https://www.figma.com/api/mcp/asset/ed8c5859-74dd-4b96-b8de-db5e6a70d51a";

export default function AppWindow() {
  return (
    <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex items-start overflow-clip relative rounded-[var(--radius\/xl,28px)] shadow-[0px_12px_80px_0px_rgba(18,26,51,0.16)] size-full" data-node-id="4040:4835" data-name="app-window">
      <div className="bg-[var(--bg\/surface,white)] border-[var(--border\/default,#eceef2)] border-r border-solid content-stretch flex flex-col gap-[6px] h-[820px] items-start overflow-clip px-[8px] py-[14px] relative shrink-0 w-[84px]" data-node-id="4040:4836" data-name="rail">
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4040:4837" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4040:4838" data-name="ic-swap">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcSwap} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4040:4840">
            Swap
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4040:4841" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4040:4842" data-name="ic-genesis">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcGenesis} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4040:4846">
            共建
          </p>
        </div>
        <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4040:4847" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4040:4848" data-name="ic-rewards">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcRewards} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] whitespace-nowrap" data-node-id="4040:4854">
            奖励
          </p>
        </div>
        <div className="content-stretch flex flex-col gap-[5px] items-center overflow-clip px-[4px] py-[11px] relative rounded-[14px] shrink-0 w-full" data-node-id="4040:4855" data-name="rit">
          <div className="relative shrink-0 size-[22px]" data-node-id="4040:4856" data-name="ic-community">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcCommunity} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[10px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4040:4863">
            社区
          </p>
        </div>
      </div>
      <div className="bg-[var(--bg\/surface,white)] border-[var(--border\/default,#eceef2)] border-r border-solid content-stretch flex flex-col h-[820px] items-start overflow-clip pb-[22px] pt-[40px] px-[24px] relative shrink-0 w-[400px]" data-node-id="4040:4864" data-name="wcol">
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4040:4865" data-name="wh">
          <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-[281px]" data-node-id="4040:4866">
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.84px] whitespace-nowrap" data-node-id="4040:4867">
              共建奖励
            </p>
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[340px]" data-node-id="4040:4868">
              参与共建 · 共享成长价值
            </p>
          </div>
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[13px] shrink-0 size-[42px]" data-node-id="4040:4869" data-name="ham">
            <div className="relative shrink-0 size-[18px]" data-node-id="4040:4870" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="h-[14px] relative shrink-0 w-full" data-node-id="4040:4872" data-name="g" />
        <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0" data-node-id="4040:4873" data-name="box">
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[11px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[0.88px] whitespace-nowrap" data-node-id="4040:4874">
            当前等级
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[17px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.34px] whitespace-nowrap" data-node-id="4212:365">
            S2 · 创世储备理事
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[320px]" data-node-id="4040:4876">
            团队奖励 2%
          </p>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4040:4877" data-name="g" />
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4040:4878" data-name="box">
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4040:4879" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4040:4880">
              距离 S3 · 个人认购
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4040:4881">
              $1,500 / $2,000
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4040:4882" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[247.5px]" data-node-id="4040:4883" data-name="Rectangle" />
          </div>
          <div className="h-[4px] relative shrink-0 w-full" data-node-id="4040:4884" data-name="g" />
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4040:4885" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4040:4886">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4040:4887">
              $18,000 / $30,000
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4040:4888" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[198px]" data-node-id="4040:4889" data-name="Rectangle" />
          </div>
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4158:301" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4158:302">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4158:303">
              S3线 1 / 2
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4158:304" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[165px]" data-node-id="4158:305" data-name="Rectangle" />
          </div>
          <div className="[word-break:break-word] content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4158:307" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4158:308">
              体系业绩
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="4158:309">
              您已达到最高等级
            </p>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] content-stretch flex flex-col h-[7px] items-start overflow-clip relative rounded-[99px] shrink-0 w-full" data-node-id="4158:310" data-name="pb">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[7px] relative rounded-[99px] shrink-0 w-[320px]" data-node-id="4158:311" data-name="Rectangle" />
          </div>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4040:4890" data-name="g" />
        <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4040:4891" data-name="box">
          <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 text-[12px] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4040:4892" data-name="r">
            <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/body,rgba(0,0,0,0.7))]" data-node-id="4040:4893">
              直推奖励
            </p>
            <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[color:var(--functional\/up,#16b979)]" data-node-id="4040:4894">
              自动支付
            </p>
          </div>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[22px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.66px] whitespace-nowrap" data-node-id="4040:4895">
            $1,280.50
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-[320px]" data-node-id="4040:4896">
            奖励自动结算至钱包
          </p>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4040:4897" data-name="g" />
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4040:4898" data-name="box">
          <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="4040:4899" data-name="r">
            <p className="relative shrink-0" data-node-id="4040:4900">
              等级奖励
            </p>
            <p className="relative shrink-0" data-node-id="4040:4901">
              已领取: $1,860.40
            </p>
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="4040:4902">
            $342.18 待领取
          </p>
          <div className="h-[4px] relative shrink-0 w-full" data-node-id="4040:4903" data-name="g" />
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[42px] items-center justify-center overflow-clip relative rounded-[var(--radius\/pill,999px)] shrink-0 w-full" data-node-id="4040:4904" data-name="claim">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/inverse,white)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4905">
              领取到钱包
            </p>
          </div>
        </div>
        <div className="h-[8px] relative shrink-0 w-full" data-node-id="4206:369" data-name="g" />
      </div>
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col h-[1576px] items-start min-w-px overflow-clip pb-[30px] pt-[40px] px-[28px] relative" data-node-id="4040:4906" data-name="dcol">
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] relative shrink-0 w-full" data-node-id="4040:4907" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4040:4908">
            当前等级
          </p>
        </div>
        <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[24px] relative rounded-[var(--radius\/md,16px)] shrink-0 w-full" data-node-id="4040:4909" data-name="tc">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[11px] text-[color:var(--accent\/coral-bright,#f4a98f)] tracking-[0.88px] whitespace-nowrap" data-node-id="4040:4910">
            创世等级
          </p>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/inverse,white)] tracking-[-0.63px] whitespace-nowrap" data-node-id="4040:4911">
            S2 · 创世储备理事
          </p>
          <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/inverse,white)] tracking-[-0.26px] w-[594px]" data-node-id="4040:4912">
            创世储备理事将获得团队共建金额的2%作为奖励。
          </p>
          <div className="absolute h-[13px] left-[675px] top-[128px] w-[47px]" data-node-id="4040:4913">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4040:4914" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4040:4915">
            创世荣誉体系
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col items-start overflow-clip px-[16px] py-[6px] relative rounded-[var(--radius\/md,16px)] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] shrink-0 w-full" data-node-id="4040:4916" data-name="tbl">
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4917" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4918" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4919">
                创世称号
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4920" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4921">
                参与共建
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4922" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4923">
                总业绩
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4924" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4925">
                奖励比例
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4928" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4929" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4930" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4931">
                S1
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4932" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4933">
                $500
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4934" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4935">
                $5,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4936" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4937">
                1%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4940" data-name="Rectangle" />
          <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4941" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4942" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4943">
                S2 · 当前
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4944" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4945">
                $1,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4946" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4947">
                $10,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4948" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4949">
                2%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4952" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4953" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4954" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4955">
                S3
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4956" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4957">
                $2,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4958" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4959">
                $30,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4960" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4961">
                3%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4964" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4965" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4966" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4967">
                S4
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4968" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4969">
                $3,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4970" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4971">
                2条S3线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4972" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4973">
                4%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4976" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4977" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4978" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4979">
                S5
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4980" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4981">
                $5,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4982" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4983">
                2条S4线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4984" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4985">
                5%
              </p>
            </div>
          </div>
          <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:4988" data-name="Rectangle" />
          <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="4040:4989" data-name="trow">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4990" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4991">
                S6
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4992" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4993">
                $10,000
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4994" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4995">
                2条S5线
              </p>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:4996" data-name="cell">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:4997">
                6%
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4040:5000" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4040:5001">
            奖励记录
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[10px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] shrink-0 w-full" data-node-id="4040:5002" data-name="tbl">
          <div className="content-stretch flex gap-[8px] items-start overflow-clip relative shrink-0 w-full" data-node-id="4040:5003" data-name="htabs">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col items-start overflow-clip px-[16px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="4040:5004" data-name="htab">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.13px] whitespace-nowrap" data-node-id="4040:5005">
                直推奖励
              </p>
            </div>
            <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-start overflow-clip px-[16px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="4040:5006" data-name="htab">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.13px] whitespace-nowrap" data-node-id="4040:5007">
                等级奖励
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="4040:5008" data-name="tt">
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4040:5009" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5010" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5011">
                  时间
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5012" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5013">
                  金额
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5014" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5015">
                  来源地址
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5016" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5017">
                  共建金额
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5020" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5021">
                  状态
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:5022" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4040:5023" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5024" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5025">
                  05-30 14:22
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5026" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5027">
                  +$60.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5028" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5029">
                  0x9a3f…
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5030" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5031">
                  $2,000
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5034" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5035">
                  已支付
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:5036" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4040:5037" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5038" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5039">
                  05-29 10:08
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5040" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5041">
                  +$30.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5042" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5043">
                  0x4e7b…
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5044" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5045">
                  $1,000
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5048" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5049">
                  已支付
                </p>
              </div>
            </div>
            <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="4040:5050" data-name="Rectangle" />
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4040:5051" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5052" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5053">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5054" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5055">
                  +$90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5056" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5057">
                  0xc012…
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5058" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5059">
                  $3,000
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4040:5062" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4040:5063">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4052:213" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:214" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:215">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:216" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:217">
                  +$90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:218" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:219">
                  0xc012…
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:220" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:221">
                  $3,000
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:224" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:225">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex items-start overflow-clip py-[9px] relative shrink-0 w-full" data-node-id="4052:227" data-name="trow">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:228" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:229">
                  05-28 19:45
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:230" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:231">
                  +$90.00
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:232" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:233">
                  0xc012…
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:234" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:235">
                  $3,000
                </p>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="4052:238" data-name="cell">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="4052:239">
                  已支付
                </p>
              </div>
            </div>
            <div className="content-stretch flex h-[40px] items-center justify-center relative shrink-0 w-[748px]" data-node-id="4067:258" data-name="pagination">
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4067:259">
                共 250 条
              </p>
              <div className="flex-[1_0_0] h-px min-w-px relative" data-node-id="4067:260" data-name="spacer" />
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[normal] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="4067:261">
                每页 5 条
              </p>
              <div className="h-px relative shrink-0 w-[16px]" data-node-id="4067:262" data-name="gap" />
              <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[32px]" data-node-id="4067:263" data-name="btn-disabled">
                <div className="flex items-center justify-center relative shrink-0 size-[12px]" data-node-id="4067:264">
                  <div className="flex-none rotate-90">
                    <div className="relative size-[12px]" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px relative shrink-0 w-[4px]" data-node-id="4067:266" data-name="gap" />
              <div className="bg-[rgba(200,92,63,0.1)] content-stretch flex gap-[2px] h-[32px] items-center justify-center overflow-clip px-[12px] relative rounded-[6px] shrink-0 w-[80px]" data-node-id="4067:267" data-name="page-indicator">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#c85c3f] text-[12px] whitespace-nowrap" data-node-id="4067:268">
                  1 / 50
                </p>
                <div className="flex items-center justify-center relative shrink-0" data-node-id="4067:269">
                  <div className="-scale-y-100 flex-none">
                    <div className="relative size-[12px]" data-name="Frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-px relative shrink-0 w-[4px]" data-node-id="4067:271" data-name="gap" />
              <div className="bg-[#f2f2f2] content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[32px]" data-node-id="4067:272" data-name="btn">
                <div className="flex items-center justify-center relative shrink-0 size-[12px]" data-node-id="4067:273">
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
        <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="4040:5064" data-name="dl">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.72px] whitespace-nowrap" data-node-id="4040:5065">
            FAQ
          </p>
          <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="4041:7794">
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4041:7795" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4041:7796" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4041:7797">
                  推荐奖励如何计算？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4041:7798" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4041:7800">
                推荐奖励为3%，采用压缩同等金额结算机制，仅按同等金额部分计算，空账户不计奖励层级，奖励自动结算。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4041:7801" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4041:7802" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4041:7803">
                  创世等级如何晋升？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4041:7804" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4041:7806">
                创世等级由S1至S10，根据个人共建金额与体系总业绩进行评定，高等级需满足双区晋升条件。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4041:7807" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4041:7808" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4041:7809">
                  什么是等级提升奖励？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4041:7810" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4041:7812">
                共建期间达成的创世等级，将于协议上线后自动提升1个等级，有效期30天，结束后恢复真实等级。
              </p>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[12px] items-start overflow-clip px-[24px] py-[18px] relative rounded-[16px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="4041:7813" data-name="qa">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="4041:7814" data-name="qhd">
                <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[15px] tracking-[-0.3px]" data-node-id="4041:7815">
                  创世团队奖励如何结算？
                </p>
                <div className="relative shrink-0 size-[18px]" data-node-id="4041:7816" data-name="ic-chevron">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcChevron1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[14px] tracking-[-0.28px] w-full" data-node-id="4041:7818">
                创世团队奖励根据对应创世等级比例自动结算，需用户手动领取到钱包。共建期结束后，当前页面将关闭，未领取的奖励不可再领取，奖励将被打入智能做市合约。
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[188px] items-center justify-center left-[1147px] top-[35px] w-[133px]" data-node-id="4040:5069">
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
