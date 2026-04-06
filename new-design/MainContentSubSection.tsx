import button from "./button.svg";
import container2 from "./container-2.svg";
import container3 from "./container-3.svg";
import container4 from "./container-4.svg";
import icon from "./icon.svg";
import vector49 from "./vector-49.svg";
import vector50 from "./vector-50.svg";
import vector51 from "./vector-51.svg";
import vector53 from "./vector-53.svg";
import vector54 from "./vector-54.svg";
import vector55 from "./vector-55.svg";
import vector59 from "./vector-59.svg";
import vector61 from "./vector-61.svg";
import vector62 from "./vector-62.svg";
import vector66 from "./vector-66.svg";
import vector67 from "./vector-67.svg";
import vector69 from "./vector-69.svg";
import vector70 from "./vector-70.svg";
import vector71 from "./vector-71.svg";

const statsCards = [
  {
    id: 1,
    title: "本日の出勤人数",
    value: "14",
    subtitle: "確定 11名 / 未確定 3名",
    badge: null,
    icon: (
      <img className="w-[26px] h-[26px]" alt="Container" src={container2} />
    ),
    topBar: true,
    width: "w-52",
    hasRedBar: true,
  },
  {
    id: 2,
    title: "来店予定件数",
    value: "8",
    subtitle: "予定人数 19名",
    badge: {
      text: "昨日比 +2",
      bg: "bg-[#50a0641a]",
      textColor: "text-[#72b894]",
      width: "w-[59.88px]",
      innerWidth: "w-[45.89px]",
    },
    icon: (
      <img className="w-[26px] h-[26px]" alt="Container" src={container3} />
    ),
    topBar: false,
    width: "w-[207.86px]",
    hasRedBar: false,
  },
  {
    id: 3,
    title: "予定来店人数",
    value: "19",
    subtitle: "平均 2.4名 / 組",
    badge: null,
    icon: (
      <div className="w-[26px] h-[26px] flex bg-[#dfbd691a] rounded-[7px]">
        <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
          <img
            className="absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]"
            alt="Vector"
            src={vector49}
          />
          <img
            className="absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]"
            alt="Vector"
            src={vector50}
          />
          <img
            className="absolute w-[37.08%] h-[66.25%] top-[33.75%] left-[62.92%]"
            alt="Vector"
            src={vector51}
          />
        </div>
      </div>
    ),
    topBar: false,
    width: "w-[207.86px]",
    hasRedBar: false,
  },
  {
    id: 4,
    title: "シフト未提出",
    value: "5",
    subtitle: "今週の催促対象",
    badge: {
      text: "要催促",
      bg: "bg-[#c8643c1a]",
      textColor: "text-[#d4785a]",
      width: "w-[43.99px]",
      innerWidth: "w-[30px]",
    },
    icon: (
      <div className="w-[26px] h-[26px] flex bg-[#c882321f] rounded-[7px]">
        <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
          <img
            className="absolute w-[95.49%] h-[91.31%] top-[8.69%] left-[4.51%]"
            alt="Vector"
            src={vector53}
          />
          <img
            className="absolute w-[53.75%] h-[66.25%] top-[33.75%] left-[46.25%]"
            alt="Vector"
            src={vector54}
          />
          <img
            className="absolute w-[53.75%] h-[32.92%] top-[67.08%] left-[46.25%]"
            alt="Vector"
            src={vector55}
          />
        </div>
      </div>
    ),
    topBar: false,
    width: "w-[207.86px]",
    hasRedBar: false,
  },
  {
    id: 5,
    title: "体入・応募",
    value: "6",
    subtitle: "返信待ち 2件",
    badge: {
      text: "新着 +3",
      bg: "bg-[#50a0641a]",
      textColor: "text-[#72b894]",
      width: "w-[50.13px]",
      innerWidth: "w-[36.14px]",
    },
    icon: (
      <img className="w-[26px] h-[26px]" alt="Container" src={container4} />
    ),
    topBar: false,
    width: "w-[207.86px]",
    hasRedBar: false,
  },
  {
    id: 6,
    title: "営業警戒アラート",
    value: "3",
    subtitle: "要対応",
    badge: {
      text: "要確認",
      bg: "bg-[#c8643c1a]",
      textColor: "text-[#d4785a]",
      width: "w-[43.99px]",
      innerWidth: "w-[30px]",
    },
    icon: (
      <div className="w-[26px] h-[26px] flex bg-[#c882321f] rounded-[7px]">
        <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
          <img
            className="absolute w-[87.08%] h-[95.42%] top-[4.58%] left-[12.92%]"
            alt="Vector"
            src={vector59}
          />
          <img
            className="absolute w-[53.75%] h-[70.42%] top-[29.58%] left-[46.25%]"
            alt="Vector"
            src={vector61}
          />
          <img
            className="absolute w-[53.75%] h-[37.08%] top-[62.92%] left-[46.25%]"
            alt="Vector"
            src={vector62}
          />
        </div>
      </div>
    ),
    topBar: false,
    width: "w-52",
    hasRedBar: false,
  },
];

export const MainContentSubsection = (): JSX.Element => {
  return (
    <div className="absolute w-[calc(100%_-_249px)] top-0 left-[249px] h-[2756px] flex flex-col bg-[#121316]">
      <div className="flex-1 max-h-[88px] mt-[3px] flex">
        <header className="h-[88px] flex-1 relative bg-[#121316]">
          <div className="absolute top-[calc(50.00%_-_25px)] left-[19px] w-[694px] h-[49px] flex gap-3">
            <div className="mt-[17px] w-28 h-5 ml-2 flex">
              <div className="mt-[-1.4px] w-[111px] h-[21px] -ml-2 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-base tracking-[-0.31px] leading-[20.8px] whitespace-nowrap">
                本日の営業状況
              </div>
            </div>

            <div className="mt-[5px] h-5 w-[219px] self-center flex">
              <div className="mt-px w-[222px] h-[19px] -ml-1 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[16.5px] whitespace-nowrap">
                今日の営業判断に必要な情報を確認できます
              </div>
            </div>
          </div>

          <div className="absolute top-[27px] left-[687px] w-[204px] h-[31px] flex bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="mt-1.5 w-28 ml-[53.0px] flex">
              <div className="w-28 flex aspect-[6.58]">
                <div className="w-[154px] ml-[-34px] flex gap-1.5">
                  <img
                    className="mt-0.5 w-3.5 h-3.5 ml-[1.0px]"
                    alt="Icon"
                    src={icon}
                  />
                  <div className="w-[142px] h-[17px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#c7c0b2] text-[11px] tracking-[3.06px] leading-[16.5px] whitespace-nowrap">
                    2026年4月3日（金）
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[27px] left-[907px] w-52 h-[31px] flex gap-[7px] bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="mt-[9.5px] w-[10.71px] h-3 relative ml-[12.6px]">
              <img
                className="absolute w-[91.25%] h-[86.83%] top-[13.17%] left-[8.75%]"
                alt="Vector"
                src={vector66}
              />
              <img
                className="absolute w-[34.17%] h-[35.86%] top-[64.14%] left-[65.83%]"
                alt="Vector"
                src={vector67}
              />
            </div>
            <div className="mt-[7.1px] w-[147.19px] h-[16.79px] flex">
              <div className="mt-[0.9px] w-[34px] h-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b280] text-xs tracking-[0] leading-[normal]">
                検索...
              </div>
            </div>
          </div>

          <img
            className="absolute top-[27px] left-[1126px] w-8 h-[31px]"
            alt="Button"
            src={button}
          />

          <button className="all-[unset] box-border absolute top-[27px] left-[1208px] w-[132px] h-[31px] flex gap-1.5 rounded-[10px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]">
            <div className="mt-[7.1px] w-[84px] h-[17px] ml-[15px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#0b0b0d] text-xs text-center tracking-[0] leading-[16.8px] whitespace-nowrap">
              来店予定を追加
            </div>
            <div className="mt-[9.4px] w-3 h-3 flex">
              <img className="flex-1 w-[7.1px]" alt="Vector" src={vector69} />
            </div>
          </button>

          <div className="absolute top-[27px] left-[1168px] w-8 h-[31px] bg-[#ffffff0a] rounded-[9px] border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="absolute top-[9px] left-[9px] w-[13px] h-[13px]">
              <img
                className="absolute w-[60.97%] h-[16.25%] top-[83.75%] left-[39.03%]"
                alt="Vector"
                src={vector70}
              />
              <img
                className="absolute w-[91.25%] h-[95.42%] top-[4.58%] left-[8.75%]"
                alt="Vector"
                src={vector71}
              />
            </div>
            <div className="absolute top-[7px] left-[19px] w-1.5 h-1.5 rounded-[3px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
          </div>
        </header>
      </div>

      <div className="-ml-3 h-[148px] w-[1316px] self-center flex">
        {/* Card 1: 本日の出勤人数 */}
        <div className="w-52 h-[150px] flex flex-col bg-[#17181c] rounded-[18px] overflow-hidden border-[0.56px] border-solid border-[#ffffff0f]">
          <div className="ml-[18.6px] w-[170.76px] h-[1.49px] mt-[0.6px] rounded-[0px_0px_2px_2px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]" />
          <div className="ml-[20.6px] w-[166.74px] h-[26px] mt-[18.5px] flex gap-[63.8px]">
            <div className="w-[76.96px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-[78px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                本日の出勤人数
              </div>
            </div>
            <img
              className="w-[26px] h-[26px]"
              alt="Container"
              src={container2}
            />
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[30px] mt-[8.0px] flex">
            <div className="mt-[0.2px] w-[35px] h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#fff6f6] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              14
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[15.39px] mt-[8.0px] flex">
            <p className="mt-[0.1px] w-28 h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              確定 11名 / 未確定 3名
            </p>
          </div>
          <div className="w-[1375px] h-[19px] mt-[42.1px] bg-[#fb3a3a]" />
        </div>

        {/* Card 2: 来店予定件数 */}
        <div className="w-[207.86px] h-[150.47px] ml-[13.8px] border-[0.56px] border-solid flex flex-col gap-2 bg-[#17181c] rounded-[18px] overflow-hidden border-[#ffffff0f]">
          <div className="ml-[20.6px] w-[166.75px] h-[26px] mt-[20.6px] flex gap-[74.8px]">
            <div className="w-[65.97px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-[67px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                来店予定件数
              </div>
            </div>
            <img
              className="w-[26px] h-[26px]"
              alt="Container"
              src={container3}
            />
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[30px] flex">
            <div className="mt-[0.2px] w-5 h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#f4f1ea] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              8
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[15.39px] flex">
            <div className="mt-[0.1px] w-[71px] h-4 text-[11px] tracking-[0.06px] leading-[15.4px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] whitespace-nowrap">
              予定人数 19名
            </div>
          </div>
          <div className="ml-[20.6px] w-[59.88px] h-[15.99px] flex bg-[#50a0641a] rounded-[20px]">
            <div className="mt-[2.0px] w-[45.89px] h-3 ml-[7.0px] flex">
              <div className="w-[46px] h-3 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#72b894] text-[10px] tracking-[0.12px] leading-3 whitespace-nowrap">
                昨日比 +2
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: 予定来店人数 */}
        <div className="w-[207.86px] h-[150.47px] ml-[14.0px] border-[0.56px] border-solid flex flex-col gap-2 bg-[#17181c] rounded-[18px] overflow-hidden border-[#ffffff0f]">
          <div className="ml-[20.6px] w-[166.74px] mt-[20.6px] flex gap-[74.8px]">
            <div className="w-[65.97px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-[67px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                予定来店人数
              </div>
            </div>
            <div className="w-[26px] h-[26px] flex bg-[#dfbd691a] rounded-[7px]">
              <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
                <img
                  className="absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]"
                  alt="Vector"
                  src={vector49}
                />
                <img
                  className="absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]"
                  alt="Vector"
                  src={vector50}
                />
                <img
                  className="absolute w-[37.08%] h-[66.25%] top-[33.75%] left-[62.92%]"
                  alt="Vector"
                  src={vector51}
                />
              </div>
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[30px] flex">
            <div className="mt-[0.2px] w-[35px] h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#f4f1ea] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              19
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[15.39px] flex">
            <div className="mt-[0.1px] w-[75px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              平均 2.4名 / 組
            </div>
          </div>
        </div>

        {/* Card 4: シフト未提出 */}
        <div className="w-[207.86px] h-[150.47px] ml-[14.0px] border-[0.56px] border-solid flex flex-col gap-2 bg-[#17181c] rounded-[18px] overflow-hidden border-[#ffffff0f]">
          <div className="ml-[20.6px] w-[166.75px] mt-[20.6px] flex gap-[74.8px]">
            <div className="w-[65.97px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-[67px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                シフト未提出
              </div>
            </div>
            <div className="w-[26px] h-[26px] flex bg-[#c882321f] rounded-[7px]">
              <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
                <img
                  className="absolute w-[95.49%] h-[91.31%] top-[8.69%] left-[4.51%]"
                  alt="Vector"
                  src={vector53}
                />
                <img
                  className="absolute w-[53.75%] h-[66.25%] top-[33.75%] left-[46.25%]"
                  alt="Vector"
                  src={vector54}
                />
                <img
                  className="absolute w-[53.75%] h-[32.92%] top-[67.08%] left-[46.25%]"
                  alt="Vector"
                  src={vector55}
                />
              </div>
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[30px] flex">
            <div className="mt-[0.2px] w-5 h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#f4f1ea] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              5
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[15.39px] flex">
            <div className="mt-[0.1px] w-[78px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              今週の催促対象
            </div>
          </div>
          <div className="ml-[20.6px] w-[43.99px] h-[15.99px] flex bg-[#c8643c1a] rounded-[20px]">
            <div className="mt-[2.0px] w-[30px] h-3 ml-[7.0px] flex">
              <div className="w-[31px] h-3 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#d4785a] text-[10px] tracking-[0.12px] leading-3 whitespace-nowrap">
                要催促
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: 体入・応募 */}
        <div className="w-[207.86px] h-[150.47px] ml-[14.0px] border border-solid flex flex-col gap-2 bg-[#17181c] rounded-[18px] overflow-hidden border-[#ffffff0f]">
          <div className="ml-[20.6px] w-[166.74px] h-[26px] mt-[20.6px] flex gap-[85.8px]">
            <div className="w-[54.97px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-14 h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                体入・応募
              </div>
            </div>
            <img
              className="w-[26px] h-[26px]"
              alt="Container"
              src={container4}
            />
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[30px] flex">
            <div className="mt-[0.2px] w-5 h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#f4f1ea] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              6
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.74px] h-[15.39px] flex">
            <div className="mt-[0.1px] w-[66px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              返信待ち 2件
            </div>
          </div>
          <div className="ml-[20.6px] w-[50.13px] h-[15.99px] flex bg-[#50a0641a] rounded-[20px]">
            <div className="mt-[2.0px] w-[36.14px] h-3 ml-[7.0px] flex">
              <div className="w-[37px] h-3 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#72b894] text-[10px] tracking-[0.12px] leading-3 whitespace-nowrap">
                新着 +3
              </div>
            </div>
          </div>
        </div>

        {/* Card 6: 営業警戒アラート */}
        <div className="w-52 h-[150px] ml-[13.7px] border-[0.56px] border-solid flex flex-col gap-2 bg-[#17181c] rounded-[18px] overflow-hidden border-[#ffffff0f]">
          <div className="ml-[20.6px] w-[166.75px] mt-[20.6px] flex gap-[52.8px]">
            <div className="w-[87.96px] h-[15.39px] flex">
              <div className="mt-[0.1px] w-[89px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                営業警戒アラート
              </div>
            </div>
            <div className="w-[26px] h-[26px] flex bg-[#c882321f] rounded-[7px]">
              <div className="mt-[6.5px] w-[12.99px] h-[12.99px] ml-[6.5px] relative">
                <img
                  className="absolute w-[87.08%] h-[95.42%] top-[4.58%] left-[12.92%]"
                  alt="Vector"
                  src={vector59}
                />
                <img
                  className="absolute w-[53.75%] h-[70.42%] top-[29.58%] left-[46.25%]"
                  alt="Vector"
                  src={vector61}
                />
                <img
                  className="absolute w-[53.75%] h-[37.08%] top-[62.92%] left-[46.25%]"
                  alt="Vector"
                  src={vector62}
                />
              </div>
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[30px] flex">
            <div className="mt-[0.2px] w-5 h-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#f4f1ea] text-3xl tracking-[-0.20px] leading-[30px] whitespace-nowrap">
              3
            </div>
          </div>
          <div className="ml-[20.6px] w-[166.75px] h-[15.39px] flex">
            <div className="mt-[0.1px] w-[34px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              要対応
            </div>
          </div>
          <div className="ml-[20.6px] w-[43.99px] h-[15.99px] flex bg-[#c8643c1a] rounded-[20px]">
            <div className="mt-[2.0px] w-[30px] h-3 ml-[7.0px] flex">
              <div className="w-[31px] h-3 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#d4785a] text-[10px] tracking-[0.12px] leading-3 whitespace-nowrap">
                要確認
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
