const imgFrame = "https://www.figma.com/api/mcp/asset/b3c3c133-60f1-4a41-8974-91b75ee41fd2";

export default function SlippageTolerance() {
  return (
    <div className="bg-[rgba(13,16,24,0.5)] content-stretch flex flex-col items-center justify-center relative size-full" data-node-id="151:866" data-name="Slippage Tolerance">
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col items-start overflow-clip p-[24px] relative rounded-[24px] shadow-[0px_30px_80px_0px_rgba(15,18,31,0.35)] shrink-0 w-[380px]" data-node-id="151:867" data-name="card">
        <div className="content-stretch flex items-center justify-between overflow-clip pb-[20px] relative shrink-0 w-full" data-node-id="151:868" data-name="hdr">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.63px] whitespace-nowrap" data-node-id="151:869">
            Slippage Tolerance
          </p>
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[17px] shrink-0 size-[34px]" data-node-id="151:870" data-name="wm-x">
            <div className="relative shrink-0 size-[14px]" data-node-id="151:871" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-node-id="151:927">
          <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" data-node-id="151:933">
            <div className="[word-break:break-word] bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex font-['Montserrat:SemiBold'] font-semibold h-[44px] items-center justify-between leading-[1.3] overflow-clip px-[14px] relative rounded-[11px] shrink-0 text-[16px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.32px] w-full whitespace-nowrap" data-node-id="151:928" data-name="inp">
              <p className="relative shrink-0" data-node-id="151:929">
                1
              </p>
              <p className="relative shrink-0" data-node-id="151:931">
                %
              </p>
            </div>
            <div className="bg-white content-stretch flex gap-[8px] h-[24px] items-start overflow-clip relative shrink-0 w-full" data-node-id="151:829" data-name="Presets">
              <div className="bg-white border border-[#e3e8ed] border-solid content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-w-px overflow-clip px-[12px] py-[10px] relative rounded-[24px]" data-node-id="151:830" data-name="Btn-0.1">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#111625] text-[13px] whitespace-nowrap" data-node-id="151:831">
                  0.1%
                </p>
              </div>
              <div className="bg-white border border-[#e3e8ed] border-solid content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-w-px overflow-clip p-[10px] relative rounded-[24px]" data-node-id="151:832" data-name="Btn-0.5">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#111625] text-[13px] whitespace-nowrap" data-node-id="151:833">
                  0.5%
                </p>
              </div>
              <div className="bg-[#e56947] content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-w-px overflow-clip px-[17px] py-[10px] relative rounded-[24px]" data-node-id="151:834" data-name="Btn-1">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[13px] text-white whitespace-nowrap" data-node-id="151:835">
                  1%
                </p>
              </div>
              <div className="bg-white border border-[#e3e8ed] border-solid content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-w-px overflow-clip px-[16px] py-[10px] relative rounded-[24px]" data-node-id="151:836" data-name="Btn-3">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#111625] text-[13px] whitespace-nowrap" data-node-id="151:837">
                  3%
                </p>
              </div>
              <div className="bg-white border border-[#e3e8ed] border-solid content-stretch flex flex-[1_0_0] h-[24px] items-center justify-center min-w-px overflow-clip px-[16px] py-[10px] relative rounded-[24px]" data-node-id="151:838" data-name="Btn-5">
                <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[normal] relative shrink-0 text-[#111625] text-[13px] whitespace-nowrap" data-node-id="151:839">
                  5%
                </p>
              </div>
            </div>
          </div>
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex h-[46px] items-center justify-center overflow-clip relative rounded-[999px] shrink-0 w-full" data-node-id="151:921" data-name="cp">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="151:925">
              Confirm
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
