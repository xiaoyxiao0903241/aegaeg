const imgFrame = "https://www.figma.com/api/mcp/asset/29e4b27f-4da8-48b2-9751-b3fde271585b";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/0b8196ac-4c01-48cd-b259-12229e7950c9";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/7a453865-cef6-4a39-a149-56d4b0d542dc";

export default function ModalWalletDetail() {
  return (
    <div className="bg-[rgba(13,16,24,0.45)] content-stretch flex flex-col items-center justify-center relative size-full" data-node-id="40:56" data-name="Modal — Wallet Detail">
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col items-center overflow-clip p-[24px] relative rounded-[24px] shadow-[0px_30px_80px_0px_rgba(15,18,31,0.35)] shrink-0 w-[380px]" data-node-id="40:57" data-name="card">
        <div className="content-stretch flex items-start justify-end overflow-clip relative shrink-0 w-full" data-node-id="40:58" data-name="xrow">
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[17px] shrink-0 size-[34px]" data-node-id="40:59" data-name="wm-x">
            <div className="relative shrink-0 size-[14px]" data-node-id="40:60" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip pb-[20px] pt-[6px] relative shrink-0 w-full" data-node-id="40:66" data-name="icw">
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[39px] shadow-[0px_14px_34px_0px_rgba(229,107,71,0.4)] shrink-0 size-[78px]" data-node-id="40:62" data-name="wd-ico">
            <div className="relative shrink-0 size-[34px]" data-node-id="40:63" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col items-center overflow-clip relative shrink-0 w-full" data-node-id="40:67" data-name="addr">
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[21px] text-[color:var(--text\/ink,#0b0e14)] tracking-[0.21px] whitespace-nowrap" data-node-id="40:68">
            0x8F32...91A2
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex font-['Montserrat:SemiBold'] font-semibold gap-[5px] items-center justify-center leading-[1.3] overflow-clip pb-[24px] pt-[12px] relative shrink-0 w-full whitespace-nowrap" data-node-id="40:69" data-name="bal">
          <p className="relative shrink-0 text-[17px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.34px]" data-node-id="40:70">
            3,200.46
          </p>
          <p className="relative shrink-0 text-[15px] text-[color:var(--text\/muted,rgba(0,0,0,0.4))] tracking-[-0.3px]" data-node-id="40:71">
            USD1
          </p>
        </div>
        <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full" data-node-id="40:72" data-name="btns">
          <div className="bg-[var(--accent\/coral-button,#e66a47)] content-stretch flex flex-[1_0_0] gap-[8px] h-[46px] items-center justify-center min-w-px overflow-clip relative rounded-[999px]" data-node-id="40:73" data-name="cp">
            <div className="relative shrink-0 size-[15px]" data-node-id="40:74" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
            </div>
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[14px] text-[color:var(--text\/inverse,white)] tracking-[-0.28px] whitespace-nowrap" data-node-id="40:77">
              Copy address
            </p>
          </div>
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-[1_0_0] flex-col h-[46px] items-center justify-center min-w-px overflow-clip relative rounded-[999px]" data-node-id="40:78" data-name="out">
            <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[14px] text-[color:var(--text\/ink,#0b0e14)] tracking-[-0.28px] whitespace-nowrap" data-node-id="40:79">
              Disconnect
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
