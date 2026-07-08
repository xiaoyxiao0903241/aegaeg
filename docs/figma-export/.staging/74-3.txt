const imgRectangle = "https://www.figma.com/api/mcp/asset/b987b0c0-1ff4-4081-9d90-5fdf62c2293e";
const imgGlobe = "https://www.figma.com/api/mcp/asset/d24da388-f557-4de2-9218-5bf7096bb286";
const imgFrame = "https://www.figma.com/api/mcp/asset/e2ad6a98-3e41-4245-9010-31517d642637";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/b32aa5aa-7a52-43f6-b556-d7a1beac9b5f";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/c9d84eb4-1fd8-4513-9b5d-3a194d6ae619";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/d88f91ef-27a0-4444-b2fa-a1f51274ae16";
const imgFrame4 = "https://www.figma.com/api/mcp/asset/4bbb696e-2ef7-4523-be43-ca6dc781e4fc";

export default function DAppSwapDesktop() {
  return (
    <div className="bg-[var(--bg\/page,#f5f6f8)] content-stretch flex flex-col items-start relative size-full" data-node-id="74:3" data-name="DApp — Swap · 未连接钱包 (Desktop)">
      <div className="content-stretch flex h-[76px] items-center justify-between overflow-clip px-[26px] relative shrink-0 w-full" data-node-id="74:4" data-name="topbar">
        <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0" data-node-id="74:5" data-name="tb">
          <div className="h-[24px] relative shrink-0 w-[26px]" data-node-id="74:6" data-name="Rectangle">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="74:7">
            AEGIS X
          </p>
        </div>
        <div className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0" data-node-id="74:8" data-name="tr">
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex h-[40px] items-center justify-center overflow-clip px-[22px] relative rounded-[999px] shrink-0" data-node-id="74:9" data-name="btn-connect">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="74:10">
              Connect Wallet
            </p>
          </div>
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex gap-[6px] h-[36px] items-center justify-center overflow-clip px-[12px] relative rounded-[18px] shrink-0" data-node-id="98:192" data-name="lang">
            <div className="relative shrink-0 size-[16px]" data-node-id="159:22" data-name="globe">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGlobe} />
            </div>
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] whitespace-nowrap" data-node-id="159:26">
              EN
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center overflow-clip pb-[48px] px-[40px] relative shrink-0 w-full" data-node-id="74:18" data-name="stage">
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex h-[880px] items-start overflow-clip relative rounded-[28px] shadow-[0px_16px_40px_0px_rgba(18,26,51,0.1)] shrink-0 w-[1320px]" data-node-id="74:19" data-name="app-window">
          <div className="content-stretch flex flex-col gap-[6px] h-full items-center overflow-clip pt-[14px] relative shrink-0 w-[84px]" data-node-id="74:20" data-name="rail">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] h-[64px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[68px]" data-node-id="74:21" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="74:22" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[12px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.12px] whitespace-nowrap" data-node-id="74:25">
                Swap
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[5px] h-[64px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[68px]" data-node-id="74:26" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="74:27" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.12px] whitespace-nowrap" data-node-id="74:31">
                Genesis
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[5px] h-[64px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[68px]" data-node-id="74:32" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="74:33" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.12px] whitespace-nowrap" data-node-id="74:38">
                Rewards
              </p>
            </div>
            <div className="content-stretch flex flex-col gap-[5px] h-[64px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[68px]" data-node-id="74:39" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="74:40" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.12px] whitespace-nowrap" data-node-id="74:45">
                Community
              </p>
            </div>
          </div>
          <div className="border-[var(--border\/default,#eceef2)] border-r border-solid content-stretch flex flex-col gap-[14px] h-[505px] items-start overflow-clip pb-[28px] pt-[40px] px-[24px] relative shrink-0 w-[400px]" data-node-id="74:46" data-name="wcol">
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="74:47" data-name="wh">
              <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[26px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-1.04px] whitespace-nowrap" data-node-id="74:48">
                Swap
              </p>
              <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] w-[340px]" data-node-id="74:49">
                USDT ↔ USD1 · 1:1 fixed rate · zero slippage.
              </p>
            </div>
            <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[11px] items-start overflow-clip p-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="74:50" data-name="box">
              <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[12px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="74:51" data-name="r">
                <p className="relative shrink-0" data-node-id="74:52">
                  Sell
                </p>
                <p className="relative shrink-0" data-node-id="74:53">
                  Balance: —
                </p>
              </div>
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="74:54" data-name="rr">
                <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="74:55" data-name="tk">
                  <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[24px]" data-node-id="74:56" data-name="tc">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[10px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] whitespace-nowrap" data-node-id="74:57">
                      U
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="74:58">
                    USDT
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[22px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.66px] whitespace-nowrap" data-node-id="74:59">
                  0.00
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col h-[8px] items-center justify-center overflow-clip relative shrink-0 w-full" data-node-id="74:60" data-name="fl">
              <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[34px]" data-node-id="74:61" data-name="flb">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[15px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="74:62">
                  ⇅
                </p>
              </div>
            </div>
            <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[11px] items-start overflow-clip p-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="74:63" data-name="box">
              <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[12px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.24px] w-full whitespace-nowrap" data-node-id="74:64" data-name="r">
                <p className="relative shrink-0" data-node-id="74:65">
                  Buy
                </p>
                <p className="relative shrink-0" data-node-id="74:66">
                  Balance: —
                </p>
              </div>
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="74:67" data-name="rr">
                <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="74:68" data-name="tk">
                  <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[24px]" data-node-id="74:69" data-name="tc">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[10px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] whitespace-nowrap" data-node-id="74:70">
                      U
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="74:71">
                    USD1
                  </p>
                </div>
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[22px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.66px] whitespace-nowrap" data-node-id="74:72">
                  0.00
                </p>
              </div>
            </div>
            <div className="[word-break:break-word] content-stretch flex flex-col gap-[10px] items-start overflow-clip pt-[6px] relative shrink-0 text-[13px] tracking-[-0.26px] w-full whitespace-nowrap" data-node-id="74:73" data-name="meta">
              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="74:74" data-name="r">
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="74:75">
                  Rate
                </p>
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="74:76">
                  1 USDT = 1 USD1
                </p>
              </div>
              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="74:77" data-name="r">
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="74:78">
                  Slippage tolerance
                </p>
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="74:79">
                  0%
                </p>
              </div>
              <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="74:80" data-name="r">
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="74:81">
                  Route
                </p>
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="74:82">
                  USDT → USD1
                </p>
              </div>
            </div>
            <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[50px] items-center justify-center overflow-clip relative rounded-[999px] shrink-0 w-full" data-node-id="74:83" data-name="cw-big">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[15px] text-[color:var(--text\/inverse,white)] tracking-[-0.3px] whitespace-nowrap" data-node-id="74:84">
                Connect Wallet
              </p>
            </div>
            <div className="flex-[1_0_0] min-h-px relative w-full" data-node-id="74:85" data-name="sp" />
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[8px] items-start overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="74:86" data-name="promo">
              <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full" data-node-id="74:87" data-name="pr">
                <div className="relative shrink-0 size-[22px]" data-node-id="74:88" data-name="Frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                </div>
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] w-[250px]" data-node-id="74:92">
                  Connect to explore AEGIS X features
                </p>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.26px] whitespace-nowrap" data-node-id="74:93">
                What you can do after connecting →
              </p>
            </div>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start min-w-px overflow-clip pb-[28px] pt-[40px] px-[28px] relative" data-node-id="74:94" data-name="dcol">
            <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] relative shrink-0 w-full" data-node-id="74:95" data-name="dl">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[20px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.8px] whitespace-nowrap" data-node-id="74:96">
                Overview
              </p>
            </div>
            <div className="[word-break:break-word] content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full whitespace-nowrap" data-node-id="74:97" data-name="ov">
              <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px overflow-clip px-[16px] py-[14px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.06)]" data-node-id="74:98" data-name="ovc">
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px]" data-node-id="74:99">
                  Exchange rate
                </p>
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px]" data-node-id="74:100">
                  1 : 1 fixed
                </p>
              </div>
              <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px overflow-clip px-[16px] py-[14px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.06)]" data-node-id="74:101" data-name="ovc">
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px]" data-node-id="74:102">
                  Settlement
                </p>
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px]" data-node-id="74:103">
                  On-chain · seconds
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col items-start overflow-clip pb-[16px] pt-[34px] relative shrink-0 w-full" data-node-id="74:104" data-name="dl">
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[20px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.8px] whitespace-nowrap" data-node-id="74:105">
                Recent swaps
              </p>
            </div>
            <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[18px] items-center overflow-clip px-[24px] py-[30px] relative rounded-[18px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="74:106" data-name="empty">
              <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="74:107" data-name="sk">
                <div className="content-stretch flex gap-[14px] items-center overflow-clip relative shrink-0 w-full" data-node-id="74:108" data-name="skrow">
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[120px]" data-node-id="74:109" data-name="Rectangle" />
                  <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="74:110" data-name="g">
                    <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[10px]" data-node-id="74:111" data-name="Rectangle" />
                  </div>
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[90px]" data-node-id="74:112" data-name="Rectangle" />
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[70px]" data-node-id="74:113" data-name="Rectangle" />
                </div>
                <div className="content-stretch flex gap-[14px] items-center overflow-clip relative shrink-0 w-full" data-node-id="74:114" data-name="skrow">
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[120px]" data-node-id="74:115" data-name="Rectangle" />
                  <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="74:116" data-name="g">
                    <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[10px]" data-node-id="74:117" data-name="Rectangle" />
                  </div>
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[90px]" data-node-id="74:118" data-name="Rectangle" />
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[70px]" data-node-id="74:119" data-name="Rectangle" />
                </div>
                <div className="content-stretch flex gap-[14px] items-center overflow-clip relative shrink-0 w-full" data-node-id="74:120" data-name="skrow">
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[120px]" data-node-id="74:121" data-name="Rectangle" />
                  <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="74:122" data-name="g">
                    <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[10px]" data-node-id="74:123" data-name="Rectangle" />
                  </div>
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[90px]" data-node-id="74:124" data-name="Rectangle" />
                  <div className="bg-[var(--border\/default,#eceef2)] h-[14px] relative rounded-[8px] shrink-0 w-[70px]" data-node-id="74:125" data-name="Rectangle" />
                </div>
              </div>
              <div className="[word-break:break-word] content-stretch flex flex-col gap-[6px] items-center overflow-clip relative shrink-0 text-center w-full" data-node-id="74:126" data-name="hint">
                <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[15px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.3px] whitespace-nowrap" data-node-id="74:127">
                  Connect a wallet to view and manage your funds
                </p>
                <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] w-[420px]" data-node-id="74:128">
                  Your swap history and balances appear here once connected.
                </p>
              </div>
              <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[46px] items-center justify-center overflow-clip px-[28px] relative rounded-[999px] shrink-0" data-node-id="74:129" data-name="cw-in">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="74:130">
                  Connect Wallet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
