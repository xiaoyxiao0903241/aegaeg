const imgFrame = "https://www.figma.com/api/mcp/asset/b34e7cd0-b193-4165-a7b4-c4e8941e2430";
const imgFrame1 = "https://www.figma.com/api/mcp/asset/aceaa70f-af29-449a-a001-eae0fa025e27";
const imgFrame2 = "https://www.figma.com/api/mcp/asset/76df4942-556c-4804-94f8-b4b0ae84c3f4";
const imgFrame3 = "https://www.figma.com/api/mcp/asset/e29c0fe5-2b5e-41d1-8a52-d383a915758d";
const imgFrame4 = "https://www.figma.com/api/mcp/asset/0d0875b3-46e8-47e7-a9ec-12e27be5da92";

export default function DrawerMobileNav() {
  return (
    <div className="bg-[rgba(13,16,24,0.45)] content-stretch flex items-start relative size-full" data-node-id="41:13" data-name="Drawer — Mobile Nav">
      <div className="bg-[var(--bg\/surface,white)] content-stretch flex flex-col gap-[4px] h-[780px] items-start overflow-clip p-[18px] relative shadow-[20px_0px_60px_0px_rgba(18,26,51,0.25)] shrink-0 w-[300px]" data-node-id="41:14" data-name="drawer">
        <div className="content-stretch flex items-start justify-end overflow-clip pb-[8px] relative shrink-0 w-full" data-node-id="41:15" data-name="dx">
          <div className="bg-[var(--bg\/surface,white)] border border-[var(--border\/default,#eceef2)] border-solid content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[18px] shrink-0 size-[36px]" data-node-id="41:16" data-name="xb">
            <div className="relative shrink-0 size-[14px]" data-node-id="41:17" data-name="Frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame} />
            </div>
          </div>
        </div>
        <div className="bg-[var(--accent\/coral-soft,#fceae2)] content-stretch flex gap-[14px] items-center overflow-clip px-[16px] py-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="41:19" data-name="ditem">
          <div className="relative shrink-0 size-[22px]" data-node-id="41:20" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame1} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[15px] text-[color:var(--accent\/primary-\(coral\),#c85c3f)] tracking-[-0.3px] whitespace-nowrap" data-node-id="41:22">
            Swap
          </p>
        </div>
        <div className="content-stretch flex gap-[14px] items-center overflow-clip px-[16px] py-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="41:23" data-name="ditem">
          <div className="relative shrink-0 size-[22px]" data-node-id="41:24" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame2} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[15px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.3px] whitespace-nowrap" data-node-id="41:28">
            Genesis
          </p>
        </div>
        <div className="content-stretch flex gap-[14px] items-center overflow-clip px-[16px] py-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="41:29" data-name="ditem">
          <div className="relative shrink-0 size-[22px]" data-node-id="41:30" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame3} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[15px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.3px] whitespace-nowrap" data-node-id="41:34">
            Rewards
          </p>
        </div>
        <div className="content-stretch flex gap-[14px] items-center overflow-clip px-[16px] py-[14px] relative rounded-[14px] shrink-0 w-full" data-node-id="41:35" data-name="ditem">
          <div className="relative shrink-0 size-[22px]" data-node-id="41:36" data-name="Frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame4} />
          </div>
          <p className="[word-break:break-word] font-['Montserrat:SemiBold'] font-semibold leading-[1.3] relative shrink-0 text-[15px] text-[color:var(--text\/body,rgba(0,0,0,0.7))] tracking-[-0.3px] whitespace-nowrap" data-node-id="41:41">
            Community
          </p>
        </div>
      </div>
    </div>
  );
}
