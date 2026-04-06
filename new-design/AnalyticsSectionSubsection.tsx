import container5 from "./container-5.svg";
import vector72 from "./vector-72.svg";
import vector73 from "./vector-73.svg";
import vector74 from "./vector-74.svg";
import vector75 from "./vector-75.svg";
import vector77 from "./vector-77.svg";
import vector78 from "./vector-78.svg";
import vector79 from "./vector-79.svg";
import vector80 from "./vector-80.svg";
import vector81 from "./vector-81.svg";
import vector82 from "./vector-82.svg";
import vector83 from "./vector-83.svg";
import vector85 from "./vector-85.svg";
import vector86 from "./vector-86.svg";
import vector87 from "./vector-87.svg";
import vector88 from "./vector-88.svg";
import vector90 from "./vector-90.svg";
import vector91 from "./vector-91.svg";
import vector93 from "./vector-93.svg";
import vector94 from "./vector-94.svg";
import vector95 from "./vector-95.svg";
import vector96 from "./vector-96.svg";
import vector98 from "./vector-98.svg";
import vector99 from "./vector-99.svg";
import vector101 from "./vector-101.svg";
import vector103 from "./vector-103.svg";
import vector104 from "./vector-104.svg";
import vector105 from "./vector-105.svg";
import vector107 from "./vector-107.svg";
import vector109 from "./vector-109.svg";
import vector110 from "./vector-110.svg";
import vector111 from "./vector-111.svg";
import vector113 from "./vector-113.svg";
import vector114 from "./vector-114.svg";
import vector115 from "./vector-115.svg";
import vector116 from "./vector-116.svg";
import vector117 from "./vector-117.svg";
import vector118 from "./vector-118.svg";
import vector119 from "./vector-119.svg";
import vector120 from "./vector-120.svg";
import vector121 from "./vector-121.svg";
import vector122 from "./vector-122.svg";

const visitRows = [
  {
    time: "20:30",
    name: "山田 様",
    count: "2名",
    countVectors: [vector78, vector79, vector80, vector81],
    cast: "桜井 あかね",
    statusBg: "bg-[#50a0641a]",
    statusBorder: "border-[#50a0642e]",
    statusText: "確認済",
    statusColor: "text-[#72b894]",
    noteType: "vip",
    noteVectors: [vector82, vector83],
    noteText: "VIP対応",
    noteColor: "text-[#dfbd69]",
  },
  {
    time: "21:00",
    name: "佐藤 様",
    count: "3名",
    countVectors: [vector115, vector116, vector117, vector118],
    cast: "田中 みく",
    statusBg: "bg-[#50a0641a]",
    statusBorder: "border-[#50a0642e]",
    statusText: "確認済",
    statusColor: "text-[#72b894]",
    noteType: "dash",
    noteVectors: [],
    noteText: "—",
    noteColor: "text-[#5a5650]",
  },
  {
    time: "21:30",
    name: "鈴木 様",
    count: "4名",
    countVectors: [vector85, vector86, vector87, vector88],
    cast: "松本 かほ",
    statusBg: "bg-[#c882321a]",
    statusBorder: "border-[#c882322e]",
    statusText: "未確定",
    statusColor: "text-[#c8884d]",
    noteType: "icon",
    noteVectors: [vector90, vector91],
    noteText: "席調整必要",
    noteColor: "text-[#8a8478]",
  },
  {
    time: "22:00",
    name: "田中 様",
    count: "5名",
    countVectors: [vector107, vector109, vector110, vector111],
    cast: "橋本 あい",
    statusBg: "bg-[#50a0641a]",
    statusBorder: "border-[#50a0642e]",
    statusText: "確認済",
    statusColor: "text-[#72b894]",
    noteType: "vip",
    noteVectors: [vector113, vector114],
    noteText: "VIP対応",
    noteColor: "text-[#dfbd69]",
  },
  {
    time: "22:30",
    name: "渡辺 様",
    count: "2名",
    countVectors: [vector93, vector94, vector95, vector96],
    cast: "—",
    castColor: "text-[#5a5650]",
    statusBg: "bg-[#8a847814]",
    statusBorder: "border-[#8a847826]",
    statusText: "保留",
    statusColor: "text-[#8a8478]",
    noteType: "icon",
    noteVectors: [vector98, vector99],
    noteText: "返答待ち",
    noteColor: "text-[#8a8478]",
  },
  {
    time: "23:00",
    name: "中村 様",
    count: "1名",
    countVectors: [vector73, vector74, vector75, vector77],
    cast: "鈴木 なな",
    statusBg: "bg-[#50a0641a]",
    statusBorder: "border-[#50a0642e]",
    statusText: "確認済",
    statusColor: "text-[#72b894]",
    noteType: "dash",
    noteVectors: [],
    noteText: "—",
    noteColor: "text-[#5a5650]",
  },
  {
    time: "23:30",
    name: "小林 様",
    count: "2名",
    countVectors: [vector101, vector103, vector104, vector105],
    cast: "高橋 さら",
    statusBg: "bg-[#c882321a]",
    statusBorder: "border-[#c882322e]",
    statusText: "未確定",
    statusColor: "text-[#c8884d]",
    noteType: "dash",
    noteVectors: [],
    noteText: "—",
    noteColor: "text-[#5a5650]",
  },
];

const castRankRows = [
  {
    rank: 1,
    name: "田中 みく",
    rankBg:
      "bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]",
    rankTextColor: "text-[#0b0b0d]",
    score: 22,
    showScore: true,
  },
  {
    rank: 2,
    name: "桜井 あかね",
    rankBg: "bg-[#c8c8c824]",
    rankTextColor: "text-[#b8b8c0]",
    score: null,
    showScore: false,
  },
  {
    rank: 3,
    name: "松本 かほ",
    rankBg: "bg-[#b8733324]",
    rankTextColor: "text-[#b87333]",
    score: null,
    showScore: false,
  },
  {
    rank: 4,
    name: "橋本 あい",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 5,
    name: "高橋 さら",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 6,
    name: "小林 めい",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 7,
    name: "鈴木 なな",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 8,
    name: "山田 ゆい",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 9,
    name: "青木 さき",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
  {
    rank: 10,
    name: "西村 えみ",
    rankBg: "",
    rankTextColor: "text-[#5a5650]",
    score: null,
    showScore: false,
  },
];

const shiftBarData = [
  {
    day: "月",
    value: 72,
    barHeight: "h-[57.6px]",
    barBg: "bg-[#c8a03c8c]",
    barBorder: "border-transparent",
    labelColor: "text-[#c8a84d]",
    mt: "mt-[9.6px]",
  },
  {
    day: "火",
    value: 80,
    barHeight: "h-[63.99px]",
    barBg: "bg-[#dfbd6952]",
    barBorder: "border-transparent",
    labelColor: "text-[#dfbd69]",
    mt: "mt-[3.2px]",
  },
  {
    day: "水",
    value: 68,
    barHeight: "h-[54.39px]",
    barBg: "bg-[#c8a03c8c]",
    barBorder: "border-transparent",
    labelColor: "text-[#c8a84d]",
    mt: "mt-[12.8px]",
  },
  {
    day: "木",
    value: 76,
    barHeight: "h-[60.8px]",
    barBg: "bg-[#dfbd6952]",
    barBorder: "border-transparent",
    labelColor: "text-[#dfbd69]",
    mt: "mt-[6.4px]",
  },
  {
    day: "金",
    value: 55,
    barHeight: "h-[43.99px]",
    barBg: "bg-[#c8643ca6]",
    barBorder: "border-[#dfbd6966]",
    labelColor: "text-[#d4785a]",
    mt: "mt-[23.2px]",
    dayLabelColor: "text-[#dfbd69]",
    dayLabelFont: "[font-family:'Inter-SemiBold',Helvetica] font-semibold",
  },
  {
    day: "土",
    value: 48,
    barHeight: "h-[38.39px]",
    barBg: "bg-[#c8643ca6]",
    barBorder: "border-transparent",
    labelColor: "text-[#d4785a]",
    mt: "mt-[28.8px]",
  },
  {
    day: "日",
    value: 84,
    barHeight: "h-[67.2px]",
    barBg: "bg-[#dfbd6952]",
    barBorder: "border-transparent",
    labelColor: "text-[#dfbd69]",
    mt: "mt-0",
  },
];

const performanceData = [
  {
    barWidth: "w-[58.28px]",
    score: "94",
    blg: "12",
    attendance: null,
    nomination: "45",
  },
  {
    barWidth: "w-[55.18px]",
    score: "89",
    blg: "10",
    attendance: "20",
    nomination: "38",
  },
  {
    barWidth: "w-[50.84px]",
    score: "82",
    blg: "8",
    attendance: "18",
    nomination: "32",
  },
  {
    barWidth: "w-[46.5px]",
    score: "75",
    blg: "6",
    attendance: "16",
    nomination: "28",
  },
  {
    barWidth: "w-[42.16px]",
    score: "68",
    blg: "4",
    attendance: "15",
    nomination: "22",
  },
  {
    barWidth: "w-[38.44px]",
    score: "62",
    blg: "5",
    attendance: "14",
    nomination: "18",
  },
  {
    barWidth: "w-[34.1px]",
    score: "55",
    blg: "2",
    attendance: "12",
    nomination: "15",
  },
  {
    barWidth: "w-[29.76px]",
    score: "48",
    blg: "3",
    attendance: "10",
    nomination: "12",
  },
  {
    barWidth: "w-[26.04px]",
    score: "42",
    blg: "1",
    attendance: "9",
    nomination: "8",
  },
  {
    barWidth: "w-[21.7px]",
    score: "35",
    blg: "0",
    attendance: "8",
    nomination: "5",
  },
];

export const AnalyticsSectionSubsection = (): JSX.Element => {
  return (
    <div className="absolute top-[1198px] left-[273px] w-[1310px] h-[1090px]">
      {/* Visit Schedule Table */}
      <div className="absolute top-[533px] left-0 w-[873px] h-[382px] bg-[#17181c] rounded-[20px] overflow-hidden border border-solid border-[#ffffff0f]">
        <div className="absolute top-4 left-[22px] w-[154px] h-[31px] flex gap-2.5">
          <img
            className="mt-0 w-[26px] h-[29px] ml-0"
            alt="Container"
            src={container5}
          />
          <div className="mt-0 w-[118px] h-7 relative">
            <div className="absolute top-0 left-0 w-[118px] h-[17px] flex">
              <div className="mt-[0.6px] w-[78px] h-[17px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-[13px] tracking-[-0.08px] leading-[16.9px] whitespace-nowrap">
                来店予定一覧
              </div>
            </div>
            <div className="absolute top-[17px] left-0 w-[118px] h-3.5 flex">
              <p className="mt-[0.6px] w-[120px] h-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[14.3px] whitespace-nowrap">
                確認済 4件 / 要確認 3件
              </p>
            </div>
          </div>
        </div>

        <div className="absolute top-4 left-[772px] w-[184px] h-[30px] flex">
          <div className="w-[57.61px] h-[29.98px] ml-[-103px] flex bg-[#50a06414] rounded-lg">
            <div className="mt-[8.3px] w-10 h-[15px] ml-[9.0px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#72b894] text-[10px] tracking-[0.12px] leading-[15px] whitespace-nowrap">
              確認済 4
            </div>
          </div>
          <div className="w-[57.43px] h-[29.98px] ml-[6.0px] flex bg-[#c8823214] rounded-lg">
            <div className="mt-[8.3px] w-10 h-[15px] ml-[9.0px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#c8884d] text-[10px] tracking-[0.12px] leading-[15px] whitespace-nowrap">
              要確認 3
            </div>
          </div>
          <button className="all-[unset] box-border mt-[-0.2px] w-[58px] h-[30px] ml-[5.5px] flex gap-[3px] bg-[#ffffff0a] rounded-lg border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="mt-[4.7px] w-[23px] h-4 ml-[10.6px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#8a8478] text-[11px] text-center tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
              追加
            </div>
            <div className="mt-[7.2px] w-2.5 h-2.5 flex">
              <img className="flex-1 w-[3.33px]" alt="Vector" src={vector72} />
            </div>
          </button>
        </div>

        <div className="absolute top-[62px] -left-px w-[874px] h-[321px]">
          {/* Header row */}
          <div className="absolute -top-px left-0 w-[875px] h-[42px] border-t [border-top-style:solid] border-b [border-bottom-style:solid] border-[#ffffff0a]">
            <div className="absolute top-3.5 left-[22px] w-[68px] h-[11px] flex">
              <div className="flex items-center mt-0 w-[51px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-xs tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                来店時刻
              </div>
            </div>
            <div className="absolute top-3 left-[100px] w-[228px] h-[17px] flex">
              <div className="flex items-center justify-center mt-[3px] w-[51px] h-[13px] ml-[-3.0px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-xs text-center tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                お客様名
              </div>
            </div>
            <div className="absolute top-[13px] left-[327px] w-14 h-[13px] flex">
              <div className="mt-[-0.4px] w-[19px] h-[13px] ml-[19.0px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                人数
              </div>
            </div>
            <div className="absolute top-[13px] left-[397px] w-[228px] h-[13px] flex">
              <div className="mt-[-0.4px] w-[76px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-xs tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                担当キャスト
              </div>
            </div>
            <div className="absolute top-3.5 left-[642px] w-[76px] h-[13px] flex">
              <div className="-mt-px w-[51px] h-[13px] ml-[12.0px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-xs tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                確認状態
              </div>
            </div>
            <div className="absolute top-3.5 left-[728px] w-[228px] h-[13px] flex">
              <div className="mt-[-0.4px] w-[25px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-xs tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                備考
              </div>
            </div>
          </div>

          {/* Data rows */}
          {visitRows.map((row, index) => {
            const isLast = index === visitRows.length - 1;
            const topPositions = [39, 80, 120, 160, 200, 241, 281];
            const topPos = topPositions[index];
            const hasBorderRL =
              index === 0 ||
              index === visitRows.length - 2 ||
              index === visitRows.length - 1;

            return (
              <div
                key={index}
                className={`absolute left-${isLast ? "px" : "0"} w-[${isLast ? "873" : "875"}px] h-[${isLast ? "40" : "42"}px] flex gap-2.5 border-b [border-bottom-style:solid] border-[#ffffff0a]${index === visitRows.length - 2 || index === visitRows.length - 1 ? " border-r [border-right-style:solid] border-l [border-left-style:solid]" : ""}`}
                style={{
                  top: `${topPos}px`,
                  left: isLast ? "1px" : "0px",
                  width: isLast ? "873px" : "875px",
                  height: isLast ? "40px" : "42px",
                }}
              >
                <div className="mt-[11.2px] w-[67.99px] h-[16.79px] ml-[22.0px] flex">
                  <div className="mt-[0.1px] w-[35px] h-[17px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#c7c0b2] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                    {row.time}
                  </div>
                </div>

                <div className="mt-[11.2px] w-[228.01px] h-[16.79px] flex">
                  <div className="mt-[0.1px] w-10 h-[17px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#f4f1ea] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                    {row.name}
                  </div>
                </div>

                <div className="mt-[11.8px] w-14 flex gap-[3px]">
                  <div className="mt-[2.7px] w-2.5 h-2.5 relative">
                    <img
                      className="absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]"
                      alt="Vector"
                      src={row.countVectors[0]}
                    />
                    <img
                      className="absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]"
                      alt="Vector"
                      src={row.countVectors[1]}
                    />
                    <img
                      className="absolute w-[24.58%] h-[40.71%] top-[59.29%] left-[75.42%]"
                      alt="Vector"
                      src={row.countVectors[2]}
                    />
                    <img
                      className="absolute w-[37.08%] h-[90.71%] top-[9.29%] left-[62.92%]"
                      alt="Vector"
                      src={row.countVectors[3]}
                    />
                  </div>
                  <div className="w-[17.7px] h-[15.39px] flex">
                    <div className="mt-[0.1px] w-[18px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                      {row.count}
                    </div>
                  </div>
                </div>

                <div className="mt-[11.8px] w-[228.01px] h-[15.39px] flex">
                  <div
                    className={`mt-[0.1px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap ${row.castColor || "text-[#c7c0b2]"}`}
                  >
                    {row.cast}
                  </div>
                </div>

                <div
                  className={`mt-2.5 w-[76px] h-[19.1px] flex ${row.statusBg} rounded-[20px] border-[0.56px] border-solid ${row.statusBorder}`}
                >
                  <div
                    className={`mt-[2.5px] h-3.5 ml-[21.0px] [font-family:'Inter-SemiBold',Helvetica] font-semibold ${row.statusColor} text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap`}
                  >
                    {row.statusText}
                  </div>
                </div>

                <div className="mt-[11.3px] w-[228.01px] flex gap-1">
                  {row.noteType === "dash" ? (
                    <div className="w-[9.68px] h-[16.49px] flex">
                      <div
                        className={`mt-[0.7px] w-[11px] h-[17px] [font-family:'Inter-Regular',Helvetica] font-normal ${row.noteColor} text-[11px] tracking-[0.06px] leading-[16.5px] whitespace-nowrap`}
                      >
                        {row.noteText}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mt-[2.0px] w-2.5 h-2.5 relative">
                        <img
                          className="absolute w-[91.25%] h-[91.25%] top-[8.75%] left-[8.75%]"
                          alt="Vector"
                          src={row.noteVectors[0]}
                        />
                        <img
                          className="absolute w-[41.25%] h-[91.25%] top-[8.75%] left-[58.75%]"
                          alt="Vector"
                          src={row.noteVectors[1]}
                        />
                      </div>
                      <div className="h-[13.99px] flex">
                        <div
                          className={`mt-[0.1px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal ${row.noteColor} text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap`}
                        >
                          {row.noteText}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cast Performance Table */}
      <div className="absolute top-[18px] left-0 w-[873px] h-[498px] flex flex-col bg-[#17181c] rounded-[18px] overflow-hidden border-[0.56px] border-solid border-[#ffffff0f]">
        <div className="ml-[0.6px] w-[860px] h-[58px] mt-[0.8px] flex gap-[606.3px] border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0f]">
          <div className="mt-[14.5px] w-[312.59px] ml-5 flex gap-[9px]">
            <div className="mt-[2.3px] w-[23.99px] h-[23.99px] flex bg-[#dfbd691a] rounded-[7px]">
              <div className="mt-[6.0px] w-3 h-3 ml-[6.0px] flex">
                <img
                  className="flex-1 w-[10.9px]"
                  alt="Vector"
                  src={vector119}
                />
              </div>
            </div>
            <div className="w-[279.6px] h-[28.59px] flex flex-col">
              <div className="w-[279.6px] h-[15.59px] flex">
                <div className="mt-[0.6px] w-[120px] h-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-xs tracking-[0] leading-[15.6px] whitespace-nowrap">
                  キャスト行動成績評価
                </div>
              </div>
              <div className="w-[279.6px] h-[12.99px] mt-0 flex">
                <div className="mt-[0.6px] w-[284px] h-[13px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[13px] whitespace-nowrap">
                  ブログ投稿数・出勤日数・場内指名本数を管理参考用に可視化
                </div>
              </div>
            </div>
          </div>
          <div className="mt-[18.2px] w-[59.1px] h-[21.09px] flex bg-[#ffffff0a] rounded-[20px] border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="mt-[3.7px] w-[41px] h-3.5 ml-[9.5px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#5a5650] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
              今月集計
            </div>
          </div>
        </div>

        <div className="ml-[0.6px] w-[571px] h-[438px] flex flex-col">
          {/* Table header */}
          <div className="w-[751px] h-[33px] mt-[0.1px] flex gap-2 border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]">
            <div className="mt-2.5 w-[23.99px] h-[12.6px] ml-5 flex">
              <div className="mt-[-0.4px] w-1.5 h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                #
              </div>
            </div>
            <div className="mt-2.5 w-[728.06px] h-[12.6px] flex">
              <div className="mt-[-0.4px] w-[39px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
                キャスト
              </div>
            </div>
          </div>

          {/* Rank rows */}
          {castRankRows.map((row, index) => {
            const isLast = index === castRankRows.length - 1;
            const rankNumWidth =
              row.rank === 10 ? "w-3" : row.rank === 1 ? "w-[5px]" : "w-[7px]";
            const rankNumMl =
              row.rank === 10
                ? "ml-1"
                : row.rank === 1
                  ? "ml-[7.5px]"
                  : "ml-[6.5px]";

            return (
              <div
                key={index}
                className={`w-[751px] flex gap-3 border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a] ${isLast ? "h-px mt-[40.1px]" : index === 0 ? "h-10" : "h-[41px]"}`}
              >
                <div
                  className={`${row.rankBg} mt-2.5 w-5 h-5 ml-5 flex rounded-[5px]`}
                >
                  <div
                    className={`mt-[2.5px] ${rankNumWidth} h-[15px] ${rankNumMl} [font-family:'Inter-${row.rank <= 3 ? "Bold" : "Medium"}',Helvetica] font-${row.rank <= 3 ? "bold" : "medium"} ${row.rankTextColor} text-[10px] tracking-[0.12px] leading-[15px] whitespace-nowrap`}
                  >
                    {row.rank}
                  </div>
                </div>
                <div className="mt-[12.3px] w-[728.06px] h-[15.39px] flex">
                  <div className="mt-[0.1px] h-4 [font-family:'Inter-Medium',Helvetica] font-medium text-[#f4f1ea] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                    {row.name}
                  </div>
                </div>
                {row.showScore && (
                  <div className="mt-[13.0px] w-8 h-[13.99px] ml-[146.0px] flex">
                    <div className="mt-[0.1px] w-[13px] h-3.5 ml-[9.8px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[10px] text-center tracking-[0.12px] leading-[14px] whitespace-nowrap">
                      {row.score}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shift Sufficiency Panel */}
      <div className="absolute top-[19px] left-[888px] w-[428px] h-[497px] flex flex-col bg-[#17181c] rounded-[18px] overflow-hidden border-[0.56px] border-solid border-[#ffffff0f]">
        <div className="ml-px w-[278px] h-[59px] flex border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0f]">
          <div className="mt-[14.5px] w-[132.99px] ml-5 flex gap-[9px]">
            <div className="mt-[2.3px] w-[23.99px] h-[23.99px] flex bg-[#dfbd691a] rounded-[7px]">
              <div className="mt-[6.0px] w-3 h-3 ml-[6.0px] relative">
                <img
                  className="absolute w-[28.75%] h-[62.08%] top-[37.92%] left-[71.25%]"
                  alt="Vector"
                  src={vector120}
                />
                <img
                  className="absolute w-[53.75%] h-[87.08%] top-[12.92%] left-[46.25%]"
                  alt="Vector"
                  src={vector121}
                />
                <img
                  className="absolute w-[78.75%] h-[45.42%] top-[54.58%] left-[21.25%]"
                  alt="Vector"
                  src={vector122}
                />
              </div>
            </div>
            <div className="w-[100px] h-[28.59px] flex flex-col">
              <div className="w-[100px] h-[15.59px] flex">
                <div className="mt-[0.6px] w-[72px] h-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-xs tracking-[0] leading-[15.6px] whitespace-nowrap">
                  シフト充足率
                </div>
              </div>
              <div className="w-[100px] h-[12.99px] mt-0 flex">
                <div className="mt-[0.6px] w-[102px] h-[13px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[13px] whitespace-nowrap">
                  今週の曜日別充足状況
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ml-[19px] w-[376px] h-[438px] relative">
          <div className="absolute top-[108px] left-[18px] w-[243px] h-6 flex">
            <div className="mt-[-92.0px] w-[344.9px] h-[115.99px] relative">
              <div className="absolute top-0 left-0 w-[345px] h-20 flex gap-[23px]">
                {shiftBarData.map((bar, index) => (
                  <div
                    key={index}
                    className="w-[29.56px] h-20 flex flex-col gap-0.5"
                  >
                    <div className={`ml-[8.6px] h-[10.8px] ${bar.mt} flex`}>
                      <div
                        className={`w-3 h-[11px] [font-family:'Inter-SemiBold',Helvetica] font-semibold ${bar.labelColor} text-[9px] tracking-[0.17px] leading-[10.8px] whitespace-nowrap`}
                      >
                        {bar.value}
                      </div>
                    </div>
                    <div
                      className={`${bar.barHeight} ${bar.barBg} rounded-[4px_4px_2px_2px] border-[0.56px] border-solid ${bar.barBorder}`}
                    />
                  </div>
                ))}
              </div>

              {shiftBarData.map((bar, index) => {
                const leftPositions = [0, 53, 105, 158, 210, 263, 315];
                return (
                  <div
                    key={index}
                    className="absolute top-[92px] flex"
                    style={{
                      left: `${leftPositions[index]}px`,
                      width: "30px",
                      height: "24px",
                    }}
                  >
                    <div
                      className={`mt-[5.9px] w-[9px] h-3.5 ml-[11.3px] [font-family:'Inter-${bar.dayLabelFont ? "SemiBold" : "Regular"}',Helvetica] font-${bar.dayLabelFont ? "semibold" : "normal"} ${bar.dayLabelColor || "text-[#8a8478]"} text-[9px] text-center tracking-[0.17px] leading-[13.5px] whitespace-nowrap`}
                    >
                      {bar.day}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="absolute top-36 left-[18px] w-[345px] h-px bg-[#ffffff0a]" />

          <div className="absolute top-[157px] left-[62px] w-[254px] h-[30px] flex bg-[#c8643c0f] rounded-[9px] border-[0.56px] border-solid border-[#c8643c1f]">
            <div className="mt-[11.8px] w-1.5 h-1.5 ml-[8.6px] bg-[#d4785a] rounded-sm" />
            <div className="mt-[7.9px] w-[162.81px] h-[13.99px] ml-[7.0px] flex">
              <div className="mt-[0.1px] w-[92px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#d4785a] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
                要注意（60%未満）
              </div>
            </div>
            <div className="mt-[9px] w-7 h-[13px] ml-[30.6px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#d4785a] text-[9px] tracking-[0.17px] leading-[12.6px] whitespace-nowrap">
              金・土
            </div>
            <div className="mt-[7px] w-[38.98px] h-[14.59px] ml-10 bg-[#c8643c1a] rounded" />
          </div>

          <div className="absolute top-[217px] left-[67px] w-[243px] h-[86px] flex flex-col">
            <div className="h-[37px] -mt-3 border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]" />
            <div className="w-[243px] h-[41px] flex gap-[146.3px] border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]">
              <div className="mt-3 w-[50px] h-[13.99px] flex">
                <div className="mt-[0.1px] w-[51px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
                  最低充足日
                </div>
              </div>
              <div className="mt-3 w-[46.6px] h-[13.99px] flex">
                <div className="mt-[0.1px] w-[45px] h-3.5 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#d4785a] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
                  土曜 48%
                </div>
              </div>
            </div>
            <div className="w-[243px] h-[42px] flex gap-[146.3px] border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]">
              <div className="mt-3 w-[50px] h-[13.99px] flex">
                <div className="mt-[0.1px] w-[51px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
                  最高充足日
                </div>
              </div>
              <div className="mt-3 w-[46.6px] h-[13.99px] flex">
                <div className="mt-[0.1px] w-[45px] h-3.5 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#72b894] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
                  日曜 84%
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-[217px] left-[67px] w-[60px] h-3.5 flex">
            <div className="mt-[0.1px] w-[61px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
              週平均充足率
            </div>
          </div>

          <div className="absolute top-[217px] left-[286px] w-6 h-3.5 flex">
            <div className="mt-[0.1px] w-[22px] h-3.5 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#c7c0b2] text-[10px] tracking-[0.12px] leading-[14px] whitespace-nowrap">
              69%
            </div>
          </div>

          <div className="absolute top-[349px] left-[75px] w-[243px] h-8 flex bg-[#a84949] rounded-[9px] border-[0.56px] border-solid border-[#ff24240f]">
            <div className="mt-[8.6px] w-[221.79px] h-[15px] ml-[10.6px] flex">
              <p className="mt-[0.4px] w-[188px] h-[15px] ml-[16.4px] [font-family:'Inter-Regular',Helvetica] font-normal text-transparent text-[10px] tracking-[0.12px] leading-[15px] whitespace-nowrap">
                <span className="text-white tracking-[0.01px]">
                  シフト未提出
                </span>
                <span className="text-[#cda658] tracking-[0.01px]">&nbsp;</span>
                <span className="[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#cda658] tracking-[0.01px]">
                  5名
                </span>
                <span className="text-[#8a8478] tracking-[0.01px]">&nbsp;</span>
                <span className="text-white tracking-[0.01px]">
                  — 今週中に催促が必要
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Score Columns */}
      <div className="absolute top-28 left-[432px] w-[365px] h-[369px]">
        <div className="absolute top-0 left-0 w-[156px] h-[11px] flex">
          <div className="mt-[-0.4px] w-[29px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
            スコア
          </div>
        </div>
        <div className="absolute top-0 left-[170px] w-14 h-[11px] flex">
          <div className="mt-[-0.4px] w-5 h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[0.71px] leading-[12.6px] whitespace-nowrap">
            BLG
          </div>
        </div>
        <div className="absolute top-0 left-60 w-14 h-[11px] flex">
          <div className="w-[19px] tracking-[0.71px] mt-[-0.4px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[12.6px] whitespace-nowrap">
            出勤
          </div>
        </div>
        <div className="absolute top-0 left-[309px] w-14 h-[11px] flex">
          <div className="w-[19px] tracking-[0.71px] mt-[-0.4px] h-[13px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[12.6px] whitespace-nowrap">
            指名
          </div>
        </div>

        {performanceData.map((item, index) => {
          const topOffsets = [32, 68, 104, 140, 176, 213, 248, 285, 321, 357];
          const top = topOffsets[index];
          return (
            <div key={index}>
              <div
                className="absolute left-0 w-[156px] h-3 flex gap-1.5"
                style={{ top: `${top}px` }}
              >
                <div className="mt-[5.5px] w-[62.01px] flex bg-[#ffffff0f] rounded-sm overflow-hidden">
                  <div
                    className={`${item.barWidth} h-[2.99px] rounded-sm bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]`}
                  />
                </div>
                <div className="w-[22px] h-[13.99px] flex">
                  <div className="mt-[0.1px] h-3.5 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-neutral-950 text-[10px] text-right tracking-[0.12px] leading-[14px] whitespace-nowrap">
                    {item.score}
                  </div>
                </div>
              </div>

              <div
                className="absolute left-[170px] w-14 h-3 flex"
                style={{ top: `${top}px` }}
              >
                <div
                  className="mt-[0.1px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[10px] text-center tracking-[0.12px] leading-[14px] whitespace-nowrap"
                  style={{
                    marginLeft: item.blg.length === 1 ? "12.8px" : "10.4px",
                  }}
                >
                  {item.blg}
                </div>
              </div>

              {item.attendance !== null && (
                <div
                  className="absolute left-60 w-14 h-3 flex"
                  style={{ top: `${top}px` }}
                >
                  <div
                    className="mt-[0.1px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[10px] text-center tracking-[0.12px] leading-[14px] whitespace-nowrap"
                    style={{
                      marginLeft:
                        item.attendance.length === 1 ? "12.7px" : "9.7px",
                    }}
                  >
                    {item.attendance}
                  </div>
                </div>
              )}

              <div
                className="absolute left-[309px] w-14 h-3 flex"
                style={{ top: `${top}px` }}
              >
                <div
                  className="mt-[0.1px] h-3.5 [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[10px] text-center tracking-[0.12px] leading-[14px] whitespace-nowrap"
                  style={{
                    marginLeft:
                      item.nomination && item.nomination.length === 1
                        ? "12.7px"
                        : "9.5px",
                  }}
                >
                  {item.nomination}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
