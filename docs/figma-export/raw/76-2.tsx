const imgFrame = "https://www.figma.com/api/mcp/asset/a3d2ad8b-59e9-434c-82d1-830316f1fc4d";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/3f4564f8-3be7-4f13-a458-667824ee9da6";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/73ef113c-188a-4f83-bcc2-d4a168b31833";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/c59f2941-700a-4aa5-a30a-b90508000e6e";
const imgFrame4 = "https://www.figma.com/api/mcp/asset/93fbb131-15a2-424f-aff3-e87dafa73f7c";
const imgFrame5 = "https://www.figma.com/api/mcp/asset/b65386db-e0f5-4503-8106-a4a2657bb50b";
const imgFrame6 = "https://www.figma.com/api/mcp/asset/92fa2106-cde0-4ed3-bddb-04c81e553517";

export default function TooltipsDesktop() {
  return (
    <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[34px] items-start overflow-clip pb-[48px] pt-[44px] px-[48px] relative rounded-[28px] shadow-[0px_8px_24px_0px_rgba(18,26,51,0.06)] size-full" data-node-id="76:2" data-name="状态规范 · 网络 & Tooltips (Desktop)">
      <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[30px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-1.2px] whitespace-nowrap" data-node-id="76:3">{`网络 & Tooltips hover 规范`}</p>
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:4" data-name="section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:5" data-name="hd">
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="76:6">
            1 · 网络固定 BSC(不可切换)
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] w-[1000px]" data-node-id="76:7">
            用户连接后,网络固定显示 BSC,不提供切换下拉(去掉 ▾)。鼠标悬停时弹出说明气泡。
          </p>
        </div>
        <div className="content-stretch flex items-start overflow-clip pt-[14px] relative shrink-0" data-node-id="76:8" data-name="row">
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:13" data-name="demo">
            <div className="bg-[var(--bg\/page,#f5f6f8)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex gap-[8px] h-[40px] items-center overflow-clip px-[14px] relative rounded-[999px] shrink-0" data-node-id="76:9" data-name="net">
              <div className="bg-[#f3ba2f] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[18px]" data-node-id="76:10" data-name="bscdot">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[#1b1b1b] text-[10px] whitespace-nowrap" data-node-id="76:11">
                  B
                </p>
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[13px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.26px] whitespace-nowrap" data-node-id="76:12">
                BSC
              </p>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:14" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:15" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[240px]" data-node-id="76:17" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[216px]" data-node-id="76:18">
                  BSC only · AEGIS X 运行在 BNB Smart Chain,暂不支持切换网络
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:19" data-name="section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:20" data-name="hd">
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="76:21">
            2 · 菜单项 hover 提示
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] w-[1000px]" data-node-id="76:22">
            左侧模块图标悬停时,显示该模块功能说明。
          </p>
        </div>
        <div className="content-stretch flex gap-[40px] items-start overflow-clip pt-[14px] relative shrink-0" data-node-id="76:23" data-name="row">
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:29" data-name="demo">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] h-[66px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[72px]" data-node-id="76:24" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="76:25" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[12px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.12px] whitespace-nowrap" data-node-id="76:28">
                Swap
              </p>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:30" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:31" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[190px]" data-node-id="76:33" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[166px]" data-node-id="76:34">
                  按固定 1:1 兑换 USDT ↔ USD1
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:41" data-name="demo">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] h-[66px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[72px]" data-node-id="76:35" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="76:36" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[12px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.12px] whitespace-nowrap" data-node-id="76:40">
                Genesis
              </p>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:42" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:43" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[190px]" data-node-id="76:45" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[166px]" data-node-id="76:46">
                  参与 Genesis 各季认购,赢取股东称号
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:54" data-name="demo">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] h-[66px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[72px]" data-node-id="76:47" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="76:48" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[12px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.12px] whitespace-nowrap" data-node-id="76:53">
                Rewards
              </p>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:55" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:56" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[190px]" data-node-id="76:58" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[166px]" data-node-id="76:59">
                  查看推荐/团队奖励并领取到钱包
                </p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:67" data-name="demo">
            <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex flex-col gap-[5px] h-[66px] items-center justify-center overflow-clip relative rounded-[14px] shrink-0 w-[72px]" data-node-id="76:60" data-name="rit">
              <div className="relative shrink-0 size-[22px]" data-node-id="76:61" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
              </div>
              <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[12px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.12px] whitespace-nowrap" data-node-id="76:66">
                Community
              </p>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:68" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:69" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[190px]" data-node-id="76:71" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[166px]" data-node-id="76:72">
                  邀请好友、绑定推荐人、壮大团队
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:73" data-name="section">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[4px] items-start overflow-clip relative shrink-0 w-full" data-node-id="76:74" data-name="hd">
          <p className="font-['Montserrat:SemiBold'] font-semibold leading-[1.2] relative shrink-0 text-[18px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.54px] whitespace-nowrap" data-node-id="76:75">
            3 · 右侧窗口功能按钮 hover 提示
          </p>
          <p className="font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[13px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.26px] w-[1000px]" data-node-id="76:76">
            详情区右上角功能按钮,悬停显示用途。
          </p>
        </div>
        <div className="content-stretch flex gap-[60px] items-start overflow-clip pt-[14px] relative shrink-0" data-node-id="76:77" data-name="row">
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:83" data-name="demo">
            <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[44px]" data-node-id="76:78" data-name="ibtn">
              <div className="relative shrink-0 size-[20px]" data-node-id="76:79" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame5} />
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:84" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:85" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[210px]" data-node-id="76:87" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[186px]" data-node-id="76:88">{`代币与合约详情 / Token & contract`}</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:97" data-name="demo">
            <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[44px]" data-node-id="76:89" data-name="ibtn">
              <div className="relative shrink-0 size-[20px]" data-node-id="76:90" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame6} />
              </div>
            </div>
            <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0" data-node-id="76:98" data-name="tooltip">
              <div className="h-[7px] relative shrink-0 w-[14px]" data-node-id="76:99" data-name="Frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
              </div>
              <div className="bg-[var(--bg\/dark,#11141d)] content-stretch flex flex-col items-start overflow-clip px-[12px] py-[9px] relative rounded-[9px] shrink-0 w-[210px]" data-node-id="76:101" data-name="bubble">
                <p className="[word-break:break-word] font-['Montserrat:Regular'] font-normal leading-[1.5] relative shrink-0 text-[12px] text-[color:var(--text\/inverse,white)] tracking-[-0.12px] w-[186px]" data-node-id="76:102">
                  打开完整活动记录 / Full activity history
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
