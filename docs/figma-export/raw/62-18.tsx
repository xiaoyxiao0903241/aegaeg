const imgFrame = "https://www.figma.com/api/mcp/asset/f061d890-f33f-4c2c-b558-970187dc616b";
const imgTc = "https://www.figma.com/api/mcp/asset/9f7bde59-6592-4fc5-9f04-c71e627d0be6";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/1a6e446a-b44d-4f34-8621-752350d41ec4";
const imgGroup = "https://www.figma.com/api/mcp/asset/125606fd-fcbd-4a56-b020-fcfa5daafb60";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/ae7543c4-ec13-4064-89ba-0f46263e9d2d";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/fc678718-f5b9-4ccb-bad8-15b1910eb0a0";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/68686b4b-c665-4751-97b5-1f854918e125";
const imgFrame4 = "https://www.figma.com/api/mcp/asset/0561ecf4-b9da-44f9-81d6-c2e890e2a0f4";
const imgFrame5 = "https://www.figma.com/api/mcp/asset/f9350d8e-ad32-4226-8e97-492cc15d1eee";
const imgFrame6 = "https://www.figma.com/api/mcp/asset/93fd31ae-e548-43b0-bbb2-9daf35fc049e";
const imgFrame7 = "https://www.figma.com/api/mcp/asset/223ab30d-b3cc-4d89-8e72-be8db6dbd57d";
const imgFrame8 = "https://www.figma.com/api/mcp/asset/f65d4735-9da0-4265-93f4-11209d75ecb9";

export default function AppWindow() {
  return (
    <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[12px] items-start overflow-clip pb-[22px] pt-[18px] px-[18px] relative rounded-[24px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] size-full" data-node-id="62:18" data-name="app-window">
      <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[13px] shrink-0 size-[42px]" data-node-id="62:19" data-name="ham">
        <div className="relative shrink-0 size-[18px]" data-node-id="62:20" data-name="Frame">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
        </div>
      </div>
      <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[22px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.88px] whitespace-nowrap" data-node-id="62:22">
        Swap
      </p>
      <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] w-[342px]" data-node-id="62:23">
        USDT ↔ USD1 · 1:1 fixed rate · zero slippage · on-chain in seconds.
      </p>
      <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[9px] items-start overflow-clip p-[14px] relative rounded-[16px] shrink-0 w-full" data-node-id="62:24" data-name="box">
        <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] w-full whitespace-nowrap" data-node-id="62:25" data-name="r">
          <p className="relative shrink-0" data-node-id="62:26">
            Sell
          </p>
          <p className="relative shrink-0" data-node-id="62:27">
            Balance: 2,860.12
          </p>
        </div>
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:28" data-name="r2">
          <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="62:29" data-name="tk">
            <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="138:2" data-name="tc">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTc} />
            </div>
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:32">
              USDT
            </p>
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#c9cfda] text-[22px] tracking-[-0.44px] whitespace-nowrap" data-node-id="62:33">
            0.00
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[6px] items-start overflow-clip relative shrink-0 w-full" data-node-id="62:34" data-name="pcts">
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px overflow-clip py-[6px] relative rounded-[9px]" data-node-id="62:35" data-name="pct">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[11px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="62:36">
            25%
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px overflow-clip py-[6px] relative rounded-[9px]" data-node-id="62:37" data-name="pct">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[11px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="62:38">
            50%
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px overflow-clip py-[6px] relative rounded-[9px]" data-node-id="62:39" data-name="pct">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[11px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="62:40">
            75%
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col items-center justify-center min-w-px overflow-clip py-[6px] relative rounded-[9px]" data-node-id="62:41" data-name="pct">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[11px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] whitespace-nowrap" data-node-id="62:42">
            100%
          </p>
        </div>
      </div>
      <div className="content-stretch drop-shadow-[0px_8px_12px_rgba(18,26,51,0.07)] flex flex-col items-center overflow-clip relative shrink-0 w-full" data-node-id="62:43" data-name="fl">
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[11px] shrink-0 size-[34px]" data-node-id="62:44" data-name="flb">
          <div className="relative shrink-0 size-[15px]" data-node-id="62:45" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
        </div>
      </div>
      <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[9px] items-start overflow-clip p-[14px] relative rounded-[16px] shrink-0 w-full" data-node-id="62:47" data-name="box">
        <div className="[word-break:break-word] content-stretch flex font-['Montserrat:Regular'] font-normal items-start justify-between leading-[1.5] overflow-clip relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] w-full whitespace-nowrap" data-node-id="62:48" data-name="r">
          <p className="relative shrink-0" data-node-id="62:49">
            Buy
          </p>
          <p className="relative shrink-0" data-node-id="62:50">
            Balance: 3,200.46
          </p>
        </div>
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:51" data-name="r2">
          <div className="content-stretch flex gap-[8px] items-center overflow-clip relative shrink-0" data-node-id="62:52" data-name="tk">
            <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="138:6" data-name="tc">
              <div className="col-1 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[24px_24px] ml-0 mt-0 relative row-1 size-[24px]" data-node-id="138:9" style={{ maskImage: `url("${imgGroup}")` }} data-name="Group">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
              </div>
            </div>
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:55">
              USD1
            </p>
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#c9cfda] text-[22px] tracking-[-0.44px] whitespace-nowrap" data-node-id="62:56">
            0.00
          </p>
        </div>
      </div>
      <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col gap-[8px] items-start overflow-clip px-[14px] py-[13px] relative rounded-[12px] shrink-0 text-[13px] tracking-[-0.26px] w-full whitespace-nowrap" data-node-id="62:57" data-name="meta">
        <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:58" data-name="r">
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="62:59">
            Rate
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="62:60">
            1 USDT = 1 USD1
          </p>
        </div>
        <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:61" data-name="r">
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="62:62">
            Slippage tolerance
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="62:63">
            1%
          </p>
        </div>
        <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:64" data-name="r">
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))]" data-node-id="62:65">
            Route
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)]" data-node-id="62:66">
            USDT → USD1
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[9px] items-start overflow-clip relative shrink-0 w-full" data-node-id="62:67" data-name="steps">
        <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col h-[46px] items-center justify-center min-w-px overflow-clip relative rounded-[999px]" data-node-id="62:68" data-name="s1">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:69">
            Approve
          </p>
        </div>
        <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-[1_0_0] flex-col h-[46px] items-center justify-center min-w-px overflow-clip relative rounded-[999px]" data-node-id="62:70" data-name="s2">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:71">
            Swap
          </p>
        </div>
      </div>
      <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col gap-[6px] items-start overflow-clip px-[18px] py-[16px] relative rounded-[16px] shrink-0 w-full" data-node-id="62:72" data-name="promo">
        <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:73">
          Genesis Season 1 · 30% off
        </p>
        <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/on-dark,#b8c0ce)] tracking-[-0.24px] w-[342px]" data-node-id="62:74">
          Live now — limited quota, ends 07.10
        </p>
        <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col h-[42px] items-center justify-center overflow-clip relative rounded-[999px] shrink-0 w-full" data-node-id="62:75" data-name="pj">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="62:76">
            Join Genesis
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[14px] relative shrink-0 w-full" data-node-id="62:77" data-name="dl">
        <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[17px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.68px] whitespace-nowrap" data-node-id="62:78">
          Overview
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[10px] items-start relative shrink-0 text-[12px] w-full" data-node-id="62:79" data-name="ov">
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px overflow-clip p-[14px] relative rounded-[14px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)]" data-node-id="62:80" data-name="ovc">
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.24px] w-[140px]" data-node-id="62:81">
            Exchange rate
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.36px] w-[140px]" data-node-id="62:82">
            1 : 1 fixed
          </p>
        </div>
        <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-w-px overflow-clip p-[14px] relative rounded-[14px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)]" data-node-id="62:83" data-name="ovc">
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.24px] w-[140px]" data-node-id="62:84">
            Settlement
          </p>
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.36px] w-[140px]" data-node-id="62:85">
            On-chain · seconds
          </p>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[14px] relative shrink-0 w-full" data-node-id="103:2" data-name="about-carousel">
        <div className="content-stretch flex items-center justify-between overflow-clip pb-[10px] relative shrink-0 w-full" data-node-id="103:3" data-name="hd">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[16px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.64px] whitespace-nowrap" data-node-id="103:4">
            关于 AEGIS X 生态代币
          </p>
          <div className="relative shrink-0 size-[15px]" data-node-id="103:6" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
          </div>
        </div>
        <div className="content-stretch flex gap-[12px] h-[132px] items-center overflow-clip px-[2px] py-[14px] relative shrink-0 w-full" data-node-id="103:8" data-name="viewport">
          <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col h-[104px] items-start overflow-clip relative rounded-[16px] shadow-[0px_10px_28px_0px_rgba(20,28,51,0.1)] shrink-0 w-[342px]" data-node-id="113:2" data-name="tcard">
            <div className="absolute h-[72px] left-[224px] top-0 w-[118px]" data-node-id="113:3" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-clip px-[16px] py-[14px] relative w-full" data-node-id="113:6" data-name="left">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="113:7" data-name="hd">
                <div className="content-stretch flex gap-[9px] items-center overflow-clip relative shrink-0" data-node-id="115:2" data-name="tkgrp">
                  <div className="bg-[#232833] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[30px]" data-node-id="113:8" data-name="ic">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="113:9">
                      A
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[15px] tracking-[-0.45px] whitespace-nowrap" data-node-id="113:10">
                    AGX · 治理代币
                  </p>
                </div>
                <div className="bg-white border border-[#e3e7ee] border-solid content-stretch flex gap-[5px] items-center overflow-clip px-[12px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="113:12" data-name="btn-contract">
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[12px] tracking-[-0.24px] whitespace-nowrap" data-node-id="113:13">
                    查看合同
                  </p>
                  <div className="relative shrink-0 size-[13px]" data-node-id="113:14" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[13px] tracking-[-0.26px] w-[236px]" data-node-id="113:16">
                核心治理与价值代币,用于治理投票、质押与生态激励。
              </p>
            </div>
          </div>
          <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col h-[104px] items-start overflow-clip relative rounded-[16px] shadow-[0px_10px_28px_0px_rgba(20,28,51,0.1)] shrink-0 w-[342px]" data-node-id="113:17" data-name="tcard">
            <div className="absolute h-[72px] left-[224px] top-0 w-[118px]" data-node-id="113:18" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-clip px-[16px] py-[14px] relative w-full" data-node-id="113:21" data-name="left">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="113:22" data-name="hd">
                <div className="content-stretch flex gap-[9px] items-center overflow-clip relative shrink-0" data-node-id="115:3" data-name="tkgrp">
                  <div className="bg-[#e86a43] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[30px]" data-node-id="113:23" data-name="ic">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="113:24">
                      U
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[15px] tracking-[-0.45px] whitespace-nowrap" data-node-id="113:25">
                    USD1 · 结算稳定币
                  </p>
                </div>
                <div className="bg-white border border-[#e3e7ee] border-solid content-stretch flex gap-[5px] items-center overflow-clip px-[12px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="113:27" data-name="btn-contract">
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[12px] tracking-[-0.24px] whitespace-nowrap" data-node-id="113:28">
                    查看合同
                  </p>
                  <div className="relative shrink-0 size-[13px]" data-node-id="113:29" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[13px] tracking-[-0.26px] w-[236px]" data-node-id="113:31">
                核心结算稳定币,1:1 锚定、零滑点,贯穿认购/质押/支付。
              </p>
            </div>
          </div>
          <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col h-[104px] items-start overflow-clip relative rounded-[16px] shadow-[0px_10px_28px_0px_rgba(20,28,51,0.1)] shrink-0 w-[342px]" data-node-id="113:32" data-name="tcard">
            <div className="absolute h-[72px] left-[224px] top-0 w-[118px]" data-node-id="113:33" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-clip px-[16px] py-[14px] relative w-full" data-node-id="113:36" data-name="left">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="113:37" data-name="hd">
                <div className="content-stretch flex gap-[9px] items-center overflow-clip relative shrink-0" data-node-id="115:4" data-name="tkgrp">
                  <div className="bg-[#5e2a40] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[30px]" data-node-id="113:38" data-name="ic">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="113:39">
                      X
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[15px] tracking-[-0.45px] whitespace-nowrap" data-node-id="113:40">
                    X · 权益代币
                  </p>
                </div>
                <div className="bg-white border border-[#e3e7ee] border-solid content-stretch flex gap-[5px] items-center overflow-clip px-[12px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="113:42" data-name="btn-contract">
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[12px] tracking-[-0.24px] whitespace-nowrap" data-node-id="113:43">
                    查看合同
                  </p>
                  <div className="relative shrink-0 size-[13px]" data-node-id="113:44" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[13px] tracking-[-0.26px] w-[236px]" data-node-id="113:46">
                生态权益代币,记录贡献,可兑权益与空投加成。
              </p>
            </div>
          </div>
          <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col h-[104px] items-start overflow-clip relative rounded-[16px] shadow-[0px_10px_28px_0px_rgba(20,28,51,0.1)] shrink-0 w-[342px]" data-node-id="113:47" data-name="tcard">
            <div className="absolute h-[72px] left-[224px] top-0 w-[118px]" data-node-id="113:48" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px overflow-clip px-[16px] py-[14px] relative w-full" data-node-id="113:51" data-name="left">
              <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="113:52" data-name="hd">
                <div className="content-stretch flex gap-[9px] items-center overflow-clip relative shrink-0" data-node-id="115:5" data-name="tkgrp">
                  <div className="bg-[#7c6230] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[30px]" data-node-id="113:53" data-name="ic">
                    <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="113:54">
                      g
                    </p>
                  </div>
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[15px] tracking-[-0.45px] whitespace-nowrap" data-node-id="113:55">
                    gAGX · 质押凭证
                  </p>
                </div>
                <div className="bg-white border border-[#e3e7ee] border-solid content-stretch flex gap-[5px] items-center overflow-clip px-[12px] py-[7px] relative rounded-[999px] shrink-0" data-node-id="113:57" data-name="btn-contract">
                  <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#0b0e14] text-[12px] tracking-[-0.24px] whitespace-nowrap" data-node-id="113:58">
                    查看合同
                  </p>
                  <div className="relative shrink-0 size-[13px]" data-node-id="113:59" data-name="Frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
                  </div>
                </div>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[13px] tracking-[-0.26px] w-[236px]" data-node-id="113:61">
                质押 AGX 的生息凭证,自动复利,解锁治理权重。
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[10px] items-center justify-center overflow-clip pt-[12px] relative shrink-0 w-full" data-node-id="103:81" data-name="dots">
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[26px]" data-node-id="103:82" data-name="arr">
            <div className="relative shrink-0 size-[14px]" data-node-id="103:83" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
            </div>
          </div>
          <div className="content-stretch flex gap-[6px] items-center overflow-clip relative shrink-0" data-node-id="103:85" data-name="dd">
            <div className="bg-[var(--accent\/coral-button,#e66a47)] h-[6px] relative rounded-[999px] shrink-0 w-[18px]" data-node-id="103:86" data-name="Rectangle" />
            <div className="bg-[var(--border\/default,#eceef2)] relative rounded-[999px] shrink-0 size-[6px]" data-node-id="103:87" data-name="Rectangle" />
            <div className="bg-[var(--border\/default,#eceef2)] relative rounded-[999px] shrink-0 size-[6px]" data-node-id="103:88" data-name="Rectangle" />
            <div className="bg-[var(--border\/default,#eceef2)] relative rounded-[999px] shrink-0 size-[6px]" data-node-id="103:89" data-name="Rectangle" />
          </div>
          <div className="content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[26px]" data-node-id="103:90" data-name="arr">
            <div className="relative shrink-0 size-[14px]" data-node-id="103:91" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame6} />
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[14px] relative shrink-0 w-full" data-node-id="62:89" data-name="dl">
        <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[17px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.68px] whitespace-nowrap" data-node-id="62:90">
          Recent swaps
        </p>
      </div>
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col items-start overflow-clip px-[14px] py-[6px] relative rounded-[16px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.07)] shrink-0 w-full" data-node-id="62:91" data-name="tbl">
        <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="62:92" data-name="trow">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:93" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:94">
              Time
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:95" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:96">
              Received
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:97" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:98">
              Status
            </p>
          </div>
        </div>
        <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="62:99" data-name="Rectangle" />
        <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="62:100" data-name="trow">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:101" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:102">
              Today 09:42
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:103" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:104">
              +200.00 USD1
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:105" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:106">
              Success
            </p>
          </div>
        </div>
        <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="62:107" data-name="Rectangle" />
        <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="62:108" data-name="trow">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:109" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:110">
              Yest. 14:08
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:111" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:112">
              +50.00 USDT
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:113" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:114">
              Success
            </p>
          </div>
        </div>
        <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="62:115" data-name="Rectangle" />
        <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="62:116" data-name="trow">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:117" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:118">
              Yest. 11:32
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:119" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:120">
              +120.00 USD1
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:121" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:122">
              Success
            </p>
          </div>
        </div>
        <div className="bg-[var(--border\/default,#eceef2)] h-[0.5px] relative shrink-0 w-full" data-node-id="62:123" data-name="Rectangle" />
        <div className="content-stretch flex items-start overflow-clip py-[10px] relative shrink-0 w-full" data-node-id="62:124" data-name="trow">
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:125" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:126">
              05-24 23:45
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:127" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--functional\/up,#16b979)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:128">
              +500.00 USD1
            </p>
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px overflow-clip relative" data-node-id="62:129" data-name="cell">
            <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="62:130">
              Success
            </p>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-start overflow-clip pt-[14px] relative shrink-0 w-full" data-node-id="62:131" data-name="dl">
        <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[17px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.68px] whitespace-nowrap" data-node-id="62:132">
          FAQ
        </p>
      </div>
      <div className="bg-white content-stretch flex flex-col gap-[8px] items-start overflow-clip px-[16px] py-[14px] relative rounded-[14px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="62:133" data-name="qa">
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:134" data-name="qhd">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[14px] tracking-[-0.28px]" data-node-id="62:135">
            Why is the rate fixed at 1:1?
          </p>
          <div className="relative shrink-0 size-[16px]" data-node-id="62:136" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame7} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[#5b6472] text-[13px] tracking-[-0.26px] w-full" data-node-id="62:138">
          USD1 is a fully-reserved settlement stablecoin; the protocol guarantees 1:1 conversion with zero slippage.
        </p>
      </div>
      <div className="bg-white content-stretch flex flex-col items-start overflow-clip px-[16px] py-[14px] relative rounded-[14px] shadow-[0px_6px_20px_0px_rgba(18,26,51,0.06)] shrink-0 w-full" data-node-id="62:139" data-name="qa">
        <div className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full" data-node-id="62:140" data-name="qhd">
          <p className="[word-break:break-word] flex-[1_0_0] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] min-w-px relative text-[#0b0e14] text-[14px] tracking-[-0.28px]" data-node-id="62:141">
            Are there any fees?
          </p>
          <div className="relative shrink-0 size-[16px]" data-node-id="62:142" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame8} />
          </div>
        </div>
      </div>
    </div>
  );
}
