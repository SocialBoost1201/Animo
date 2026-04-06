export const TodayPanelSubsection = (): JSX.Element => {
  const overviewRows = [
    {
      label: "営業日",
      value: "2026年4月3日（金）",
      labelWidth: "w-[35.99px]",
      valueWidth: "w-[117.94px]",
      gap: "gap-[232.1px]",
      rowHeight: "h-[35px]",
    },
    {
      label: "営業時間",
      value: "20:00 — 25:00",
      labelWidth: "w-[47.99px]",
      valueWidth: "w-[85.87px]",
      gap: "gap-[243.2px]",
      rowHeight: "h-[35px]",
    },
    {
      label: "想定出勤数",
      value: "18名",
      labelWidth: "w-[59.97px]",
      valueWidth: "w-[25.64px]",
      gap: "gap-[300.4px]",
      rowHeight: "h-9",
    },
    {
      label: "確定出勤数",
      value: "14名",
      labelWidth: "w-[59.97px]",
      valueWidth: "w-[26.01px]",
      gap: "gap-[300px]",
      rowHeight: "h-[35px]",
      valueBold: true,
    },
    {
      label: "予約件数",
      value: "8件",
      labelWidth: "w-[47.99px]",
      valueWidth: "w-[19.88px]",
      gap: "gap-[318.2px]",
      rowHeight: "h-[35px]",
    },
    {
      label: "予定来店人数",
      value: "19名",
      labelWidth: "w-[71.97px]",
      valueWidth: "w-[25.58px]",
      gap: "gap-[288.5px]",
      rowHeight: "h-9",
    },
    {
      label: "体入人数",
      value: "2名（本日初回）",
      labelWidth: "w-[47.99px]",
      valueWidth: "w-[91.36px]",
      gap: "gap-[255.7px]",
      rowHeight: "h-[35px]",
    },
  ];

  const memos = [
    {
      tag: "VIP",
      tagBg: "bg-[#dfbd691a]",
      tagText: "text-[#dfbd69]",
      cardBorder: "border-[#dfbd6926]",
      content:
        "田中様グループ（5名）22:00予定。テーブル4確保。専属対応：橋本あい",
      contentWidth: "w-[364px]",
      marginTop: "mt-[12.5px]",
      tagWidth: "w-[28.07px]",
    },
    {
      tag: "EVENT",
      tagBg: "bg-[#ffffff0a]",
      tagText: "text-[#8a8478]",
      cardBorder: "border-[#ffffff0f]",
      content: "本日深夜24:00よりチャージイベント開始。全キャスト周知済み。",
      contentWidth: "w-[329px]",
      marginTop: "mt-[29px]",
      tagWidth: "w-[44.97px]",
    },
    {
      tag: "要対応",
      tagBg: "bg-[#c882321a]",
      tagText: "text-[#c8884d]",
      cardBorder: "border-[#c8823226]",
      content: "伊藤れいな 21:00遅刻連絡。入り時間の調整が必要。",
      contentWidth: "w-[265px]",
      marginTop: "mt-[29px]",
      tagWidth: "w-[39.15px]",
    },
  ];

  return (
    <div className="absolute top-[260px] left-[272px] w-[874px] h-[356px] flex bg-[#17181c] rounded-[18px] overflow-hidden">
      <div className="mt-px w-[874px] h-[351px] flex flex-col">
        <div className="w-[874px] h-[63px] flex gap-[563.5px] border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0f]">
          <div className="mt-[16.0px] w-[167.5px] h-[31.2px] relative ml-[22.0px]">
            <div className="absolute top-px left-px w-[33px] h-[33px] flex bg-[#dfbd691a] rounded-[7px] aspect-[1]">
              <div className="grid mt-2.5 w-[15px] h-3.5 ml-[9px] relative grid-cols-[repeat(1,fit-content(100%))] grid-rows-[repeat(1,fit-content(100%))] bg-[url(/vector-36.svg)] bg-[100%_100%]" />
            </div>

            <div className="absolute top-px left-[26px] w-[180px] h-[33px] flex flex-col gap-[1.1px]">
              <div className="ml-[11px] w-[131.5px] h-[16.9px] flex">
                <div className="mt-[0.6px] w-[91px] h-[17px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#f4f1ea] text-[13px] tracking-[-0.08px] leading-[16.9px] whitespace-nowrap">
                  本日の営業状況
                </div>
              </div>

              <div className="ml-[11px] w-[132px] flex">
                <div className="mt-px w-[133px] h-[15px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[11px] tracking-[0.06px] leading-[14.3px] whitespace-nowrap">
                  今夜のオペレーション概要
                </div>
              </div>
            </div>
          </div>

          <div className="mt-[22px] w-[79.1px] h-[19.1px] flex gap-[5px] bg-[#50a0641a] rounded-[20px] border-[0.56px] border-solid border-[#50a06426]">
            <div className="mt-[7.0px] w-[5px] h-[5px] ml-[9.5px] bg-[#72b894] rounded-[2.5px]" />

            <div className="mt-[3.6px] w-[50px] h-3 flex">
              <div className="w-[51px] h-3 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#72b894] text-[10px] tracking-[0.12px] leading-3 whitespace-nowrap">
                営業準備中
              </div>
            </div>
          </div>
        </div>

        <div className="w-[874px] flex rounded-[18px] border border-solid border-[#ffffff0f]">
          <div className="w-[436px] h-[297px] flex flex-col">
            <div className="ml-[22px] w-[414px] h-[13px] mt-[9px] flex">
              <div className="mt-[0.1px] w-[58px] tracking-[1.25px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[13.5px] whitespace-nowrap">
                OVERVIEW
              </div>
            </div>

            {overviewRows.map((row, index) => (
              <div
                key={index}
                className={`${row.rowHeight} ${row.gap} ml-[22.0px] w-[298px] flex border-b-[0.56px] [border-bottom-style:solid] border-[#ffffff0a]`}
              >
                <div
                  className={`mt-[9.0px] ${row.labelWidth} h-[16.79px] flex`}
                >
                  <div className="mt-[0.1px] h-[17px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                    {row.label}
                  </div>
                </div>

                <div
                  className={`mt-[9.0px] ${row.valueWidth} h-[16.79px] flex`}
                >
                  <div
                    className={`mt-[0.1px] h-[17px] ml-[9px] ${
                      row.valueBold
                        ? "[font-family:'Inter-SemiBold',Helvetica] font-semibold"
                        : "[font-family:'Inter-Medium',Helvetica] font-medium"
                    } text-[#cbc3b3] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap`}
                  >
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-[434px] h-72 flex flex-col border-l-[0.56px] [border-left-style:solid] border-[#ffffff0f]">
            <div className="ml-[23px] w-[444.46px] h-[13.5px] mt-[9px] flex">
              <div className="mt-[0.1px] w-[116px] tracking-[1.25px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[13.5px] whitespace-nowrap">
                MANAGEMENT MEMO
              </div>
            </div>

            {memos.map((memo, index) => (
              <div
                key={index}
                className={`ml-[23px] w-[388px] h-[${index === 0 ? "61px" : "60px"}] ${memo.marginTop} flex flex-col gap-[5px] bg-[#1c1d22] rounded-[11px] border-[0.56px] border-solid ${memo.cardBorder}`}
              >
                <div className="ml-[13.6px] w-[417.36px] mt-[10.6px] flex">
                  <div
                    className={`${memo.tagWidth} h-[16.4px] flex ${memo.tagBg} rounded-[3px]`}
                  >
                    <div
                      className={`mt-[1.7px] h-[15px] ml-[5px] [font-family:'Inter-Bold',Helvetica] font-bold text-[9px] tracking-[0.89px] leading-[14.4px] ${memo.tagText} whitespace-nowrap`}
                    >
                      {memo.tag}
                    </div>
                  </div>
                </div>

                <div className="ml-[13.6px] w-[417.36px] h-[17.6px] flex">
                  <div
                    className={`mt-[0.2px] ${memo.contentWidth} h-[18px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[11px] tracking-[0.06px] leading-[17.6px] whitespace-nowrap`}
                  >
                    {memo.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
