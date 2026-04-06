import container6 from "./container-6.svg";
import vector137 from "./vector-137.svg";
import vector138 from "./vector-138.svg";
import vector139 from "./vector-139.svg";
import vector140 from "./vector-140.svg";
import vector141 from "./vector-141.svg";
import vector142 from "./vector-142.svg";
import vector143 from "./vector-143.svg";
import vector144 from "./vector-144.svg";
import vector146 from "./vector-146.svg";
import vector148 from "./vector-148.svg";
import vector149 from "./vector-149.svg";
import vector153 from "./vector-153.svg";
import vector154 from "./vector-154.svg";
import vector155 from "./vector-155.svg";
import vector156 from "./vector-156.svg";
import vector157 from "./vector-157.svg";
import vector158 from "./vector-158.svg";
import vector160 from "./vector-160.svg";
import vector161 from "./vector-161.svg";
import vector164 from "./vector-164.svg";
import vector165 from "./vector-165.svg";

interface Tag {
  label: string;
  bgColor: string;
  textColor: string;
  width: string;
  innerWidth: string;
}

interface CastRow {
  avatarChar: string;
  avatarBg: string;
  avatarTextColor: string;
  name: string;
  timeIcon1: string;
  timeIcon2: string;
  timeText: string;
  statusLabel: string;
  statusBg: string;
  statusBorder: string;
  statusTextColor: string;
  statusWidth: string;
  tags: Tag[];
  emptyTag?: boolean;
}

const castData: CastRow[] = [
  {
    avatarChar: "桜",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "桜井 あかね",
    timeIcon1: vector138,
    timeIcon2: vector139,
    timeText: "20:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "ブログ更新済",
        bgColor: "#6496c81a",
        textColor: "#8ab4d4",
        width: "w-[71.6px]",
        innerWidth: "w-[61px]",
      },
      {
        label: "場内強い",
        bgColor: "#dfbd691a",
        textColor: "#dfbd69",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "田",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "田中 みく",
    timeIcon1: vector140,
    timeIcon2: vector141,
    timeText: "20:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "場内強い",
        bgColor: "#dfbd691a",
        textColor: "#dfbd69",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
      {
        label: "出勤安定",
        bgColor: "#50a06414",
        textColor: "#72b894",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "伊",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "伊藤 れいな",
    timeIcon1: vector142,
    timeIcon2: vector143,
    timeText: "21:00〜",
    statusLabel: "遅刻予定",
    statusBg: "#c882321a",
    statusBorder: "#c882322e",
    statusTextColor: "#c8884d",
    statusWidth: "w-[41px]",
    tags: [
      {
        label: "確認必要",
        bgColor: "#c882321a",
        textColor: "#c8884d",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "松",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "松本 かほ",
    timeIcon1: vector144,
    timeIcon2: vector146,
    timeText: "20:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "出勤安定",
        bgColor: "#50a06414",
        textColor: "#72b894",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "山",
    avatarBg:
      "linear-gradient(90deg,rgba(223,189,105,1) 0%,rgba(146,111,52,1) 100%)",
    avatarTextColor: "#0b0b0d",
    name: "山田 ゆい",
    timeIcon1: vector148,
    timeIcon2: vector149,
    timeText: "体験入店",
    statusLabel: "体験",
    statusBg: "#dfbd691a",
    statusBorder: "#dfbd692e",
    statusTextColor: "#dfbd69",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "初回体入",
        bgColor: "#dfbd691a",
        textColor: "#dfbd69",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "鈴",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "鈴木 なな",
    timeIcon1: vector153,
    timeIcon2: vector154,
    timeText: "20:00〜",
    statusLabel: "確認待ち",
    statusBg: "#8a84781a",
    statusBorder: "#8a84782e",
    statusTextColor: "#8a8478",
    statusWidth: "w-[41px]",
    tags: [],
    emptyTag: true,
  },
  {
    avatarChar: "橋",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "橋本 あい",
    timeIcon1: vector155,
    timeIcon2: vector156,
    timeText: "21:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "ブログ更新済",
        bgColor: "#6496c81a",
        textColor: "#8ab4d4",
        width: "w-[71.6px]",
        innerWidth: "w-[61px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "高",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "高橋 さら",
    timeIcon1: vector157,
    timeIcon2: vector158,
    timeText: "20:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "出勤安定",
        bgColor: "#50a06414",
        textColor: "#72b894",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
  {
    avatarChar: "中",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "中村 ほのか",
    timeIcon1: vector160,
    timeIcon2: vector161,
    timeText: "22:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [],
    emptyTag: true,
  },
  {
    avatarChar: "小",
    avatarBg: "#1c1d22",
    avatarTextColor: "#8a8478",
    name: "小林 めい",
    timeIcon1: vector164,
    timeIcon2: vector165,
    timeText: "20:00〜",
    statusLabel: "確定",
    statusBg: "#50a0641a",
    statusBorder: "#50a0642e",
    statusTextColor: "#72b894",
    statusWidth: "w-[21px]",
    tags: [
      {
        label: "ブログ更新済",
        bgColor: "#6496c81a",
        textColor: "#8ab4d4",
        width: "w-[71.6px]",
        innerWidth: "w-[61px]",
      },
      {
        label: "出勤安定",
        bgColor: "#50a06414",
        textColor: "#72b894",
        width: "w-[52px]",
        innerWidth: "w-[41px]",
      },
    ],
    emptyTag: false,
  },
];

export const GroupSubsection = (): JSX.Element => {
  return (
    <div className="absolute top-[635px] left-[272px] w-[874px] h-[563px] flex">
      <div className="w-[874px] h-[563px] flex flex-col bg-[#17181c] rounded-[18px] overflow-hidden border border-solid border-[#ffffff0f]">
        {/* Header */}
        <div className="ml-px w-[871px] h-16 flex gap-[545.1px] border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0f]">
          <div className="mt-[16.0px] w-[198.85px] ml-[22.0px] flex gap-2.5">
            <img
              className="mt-[2.6px] w-[26px] h-[26px]"
              alt="Container"
              src={container6}
            />
            <div className="w-[162.86px] h-[31.2px] flex flex-col">
              <div className="w-[162.86px] h-[16.9px] flex">
                <div className="mt-[0.6px] w-[117px] h-[17px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-[13px] tracking-[-0.08px] leading-[16.9px] whitespace-nowrap">
                  本日の出勤キャスト
                </div>
              </div>
              <div className="w-[162.86px] h-[14.3px] mt-0 flex">
                <p className="mt-[0.6px] w-[165px] h-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[14.3px] whitespace-nowrap">
                  確定 11名 / 未確定 3名 / 体験 2名
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 w-[90.08px] flex">
            <button className="all-[unset] box-border w-[90.08px] h-6 flex gap-1 bg-[#ffffff0a] rounded-lg border-[0.56px] border-solid border-[#ffffff0f]">
              <div className="mt-[4.7px] w-14 h-4 ml-[9.6px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] text-center tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                全員を確認
              </div>
              <div className="mt-[7.2px] w-2.5 h-2.5 flex">
                <img
                  className="flex-1 w-[3.33px]"
                  alt="Vector"
                  src={vector137}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Column Headers */}
        <div className="ml-px w-[871px] h-[31px] flex gap-3 border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]">
          <div className="mt-[9.0px] w-[358.02px] h-[12.6px] ml-[22.0px] flex">
            <div className="w-[49px] tracking-[0.89px] mt-[-0.4px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[12.6px] whitespace-nowrap">
              キャスト名
            </div>
          </div>
          <div className="mt-[9.0px] w-24 h-[12.6px] flex">
            <div className="mt-[-0.4px] w-[39px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.89px] leading-[12.6px] whitespace-nowrap">
              出勤時間
            </div>
          </div>
          <div className="mt-[9.0px] w-[86px] h-[12.6px] flex">
            <div className="w-[49px] tracking-[0.89px] mt-[-0.4px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[12.6px] whitespace-nowrap">
              ステータス
            </div>
          </div>
          <div className="mt-[9.0px] w-[358.02px] h-[12.6px] flex">
            <div className="mt-[-0.4px] w-[19px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.89px] leading-[12.6px] whitespace-nowrap">
              タグ
            </div>
          </div>
        </div>

        {/* Cast Rows */}
        {castData.map((cast, index) => {
          const isLast = index === castData.length - 1;
          const isGradientAvatar = cast.avatarBg.startsWith("linear-gradient");
          return (
            <div
              key={index}
              className={`ml-px w-[871px] flex gap-3${!isLast ? " border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]" : ""}`}
              style={{
                height:
                  index === 2 ||
                  index === 4 ||
                  index === 6 ||
                  index === 7 ||
                  index === 9
                    ? "46px"
                    : "47px",
              }}
            >
              {/* Avatar + Name */}
              <div className="mt-2.5 w-[358.02px] ml-[22.0px] flex gap-[9px]">
                <div
                  className="w-[26px] h-[26px] flex rounded-[13px]"
                  style={
                    isGradientAvatar
                      ? { background: cast.avatarBg }
                      : { backgroundColor: cast.avatarBg }
                  }
                >
                  <div
                    className="mt-[5.5px] w-2.5 h-[15px] ml-[8.0px] [font-family:'Inter-Bold',Helvetica] font-bold text-[10px] tracking-[0.12px] leading-[15px] whitespace-nowrap"
                    style={{ color: cast.avatarTextColor }}
                  >
                    {cast.avatarChar}
                  </div>
                </div>
                <div className="mt-[4.6px] h-[16.79px] flex">
                  <div className="mt-[0.1px] h-[17px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#f4f1ea] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                    {cast.name}
                  </div>
                </div>
              </div>

              {/* Time */}
              <div className="mt-[15.3px] w-24 flex gap-1">
                <div className="mt-[2.7px] w-2.5 h-2.5 relative">
                  <img
                    className="absolute w-[95.42%] h-[95.42%] top-[4.58%] left-[4.58%]"
                    alt="Vector"
                    src={cast.timeIcon1}
                  />
                  <img
                    className="absolute w-[53.75%] h-[78.75%] top-[21.25%] left-[46.25%]"
                    alt="Vector"
                    src={cast.timeIcon2}
                  />
                </div>
                <div className="h-[15.39px] flex">
                  <div className="mt-[0.1px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                    {cast.timeText}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div
                className="mt-[13.4px] w-[86px] h-[19.1px] flex rounded-[20px] border-[0.56px] border-solid"
                style={{
                  backgroundColor: cast.statusBg,
                  borderColor: cast.statusBorder,
                }}
              >
                <div
                  className={`mt-[2.5px] ${cast.statusWidth} h-3.5 ml-[8.6px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap`}
                  style={{ color: cast.statusTextColor }}
                >
                  {cast.statusLabel}
                </div>
              </div>

              {/* Tags */}
              <div
                className={`w-[358.02px] flex gap-[3px] ${cast.emptyTag ? "mt-[14.7px]" : "mt-[14.0px]"}`}
              >
                {cast.emptyTag ? (
                  <div className="w-[9.68px] h-[16.49px] flex">
                    <div className="mt-[0.7px] w-[11px] h-[17px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#5a5650] text-[11px] tracking-[0.06px] leading-[16.5px] whitespace-nowrap">
                      —
                    </div>
                  </div>
                ) : (
                  cast.tags.map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className={`${tag.width} h-[17.99px] flex rounded`}
                      style={{ backgroundColor: tag.bgColor }}
                    >
                      <div
                        className={`mt-[2.0px] ${tag.innerWidth} h-3.5 ml-1.5 [font-family:'Inter-Medium',Helvetica] font-medium text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap`}
                        style={{ color: tag.textColor }}
                      >
                        {tag.label}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
