import container from "./container.svg";
import image from "./image.svg";
import vector2 from "./vector-2.svg";
import vector3 from "./vector-3.svg";
import vector4 from "./vector-4.svg";
import vector5 from "./vector-5.svg";
import vector6 from "./vector-6.svg";
import vector7 from "./vector-7.svg";
import vector8 from "./vector-8.svg";
import vector9 from "./vector-9.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";
import vector14 from "./vector-14.svg";
import vector15 from "./vector-15.svg";
import vector16 from "./vector-16.svg";
import vector18 from "./vector-18.svg";
import vector19 from "./vector-19.svg";
import vector20 from "./vector-20.svg";
import vector21 from "./vector-21.svg";
import vector23 from "./vector-23.svg";
import vector24 from "./vector-24.svg";
import vector25 from "./vector-25.svg";
import vector27 from "./vector-27.svg";
import vector28 from "./vector-28.svg";
import vector32 from "./vector-32.svg";
import vector33 from "./vector-33.svg";
import vector34 from "./vector-34.svg";
import vector35 from "./vector-35.svg";
import vector167 from "./vector-167.svg";
import vector from "./vector.svg";

const quickActions = [
  {
    id: 1,
    label: "来店予定を登録",
    isPrimary: true,
    icons: [
      {
        src: vector,
        className: "absolute w-[83.75%] h-[54.58%] top-[45.42%] left-[16.25%]",
        alt: "Vector",
      },
      {
        src: image,
        className: "absolute w-[54.58%] h-[83.75%] top-[16.25%] left-[45.42%]",
        alt: "Vector",
      },
    ],
    arrowSrc: vector2,
  },
  {
    id: 2,
    label: "本日の出勤確認",
    isPrimary: false,
    icons: [
      {
        src: vector3,
        className: "absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]",
        alt: "Vector",
      },
      {
        src: vector4,
        className: "absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]",
        alt: "Vector",
      },
      {
        src: vector5,
        className: "absolute w-[37.08%] h-[66.25%] top-[33.75%] left-[62.92%]",
        alt: "Vector",
      },
    ],
    arrowSrc: vector6,
  },
  {
    id: 3,
    label: "求人応募を確認",
    isPrimary: false,
    icons: [
      {
        src: vector7,
        className: "absolute w-[70.42%] h-[95.42%] top-[4.58%] left-[29.58%]",
        alt: "Vector",
      },
      {
        src: vector8,
        className: "absolute w-[95.42%] h-[78.75%] top-[21.25%] left-[4.58%]",
        alt: "Vector",
      },
    ],
    arrowSrc: vector9,
  },
  {
    id: 4,
    label: "キャストを追加",
    isPrimary: false,
    icons: [
      {
        src: vector10,
        className: "absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]",
        alt: "Vector",
      },
      {
        src: vector11,
        className: "absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]",
        alt: "Vector",
      },
      {
        src: vector12,
        className: "absolute w-[24.58%] h-[70.42%] top-[29.58%] left-[75.42%]",
        alt: "Vector",
      },
      {
        src: vector13,
        className: "absolute w-[37.08%] h-[57.92%] top-[42.08%] left-[62.92%]",
        alt: "Vector",
      },
    ],
    arrowSrc: vector14,
  },
  {
    id: 5,
    label: "お知らせを投稿",
    isPrimary: false,
    icons: [
      {
        src: vector15,
        className: "absolute w-[91.25%] h-[78.75%] top-[21.25%] left-[8.75%]",
        alt: "Vector",
      },
      {
        src: vector16,
        className: "absolute w-[80.03%] h-[40.42%] top-[59.58%] left-[19.97%]",
        alt: "Vector",
      },
    ],
    arrowSrc: vector18,
  },
];

const alerts = [
  {
    id: 1,
    bgColor: "bg-[#c8643c14]",
    borderColor: "border-[#c8643c26]",
    iconBgColor: "bg-[#c8643c14]",
    iconContent: "multi",
    icons: [
      {
        src: vector23,
        className: "absolute w-[87.08%] h-[95.42%] top-[4.58%] left-[12.92%]",
        alt: "Vector",
      },
      {
        src: vector24,
        className: "absolute w-[53.75%] h-[66.25%] top-[33.75%] left-[46.25%]",
        alt: "Vector",
      },
      {
        src: vector25,
        className: "absolute w-[53.75%] h-[32.92%] top-[67.08%] left-[46.25%]",
        alt: "Vector",
      },
    ],
    title: "シフト未提出",
    titleColor: "text-[#d4785a]",
    subtitle: "5名が今週未提出",
    dotColor: "bg-[#d4785a]",
    height: "h-[47px]",
    useContainer: false,
  },
  {
    id: 2,
    bgColor: "bg-[#c8823214]",
    borderColor: "border-[#c882321f]",
    iconBgColor: "bg-[#c8823214]",
    iconContent: "multi",
    icons: [
      {
        src: vector27,
        className: "absolute w-[95.42%] h-[95.42%] top-[4.58%] left-[4.58%]",
        alt: "Vector",
      },
      {
        src: vector28,
        className: "absolute w-[53.75%] h-[78.75%] top-[21.25%] left-[46.25%]",
        alt: "Vector",
      },
    ],
    title: "来店予定未確定",
    titleColor: "text-[#c8884d]",
    subtitle: "2件の確認が必要",
    dotColor: "bg-[#c8884d]",
    height: "h-12",
    useContainer: false,
  },
  {
    id: 3,
    bgColor: "bg-[#c8643c14]",
    borderColor: "border-[#c8643c26]",
    iconBgColor: null,
    iconContent: "container",
    icons: [],
    title: "人員不足リスク",
    titleColor: "text-[#d4785a]",
    subtitle: "金・土の充足率が低い",
    dotColor: "bg-[#d4785a]",
    height: "h-[47px]",
    useContainer: true,
  },
  {
    id: 4,
    bgColor: "bg-[#c8823214]",
    borderColor: "border-[#c882321f]",
    iconBgColor: "bg-[#c8823214]",
    iconContent: "single",
    icons: [{ src: vector32, className: "flex-1 w-[9.54px]", alt: "Vector" }],
    title: "未返信案件",
    titleColor: "text-[#c8884d]",
    subtitle: "応募返信待ち 2件",
    dotColor: "bg-[#c8884d]",
    height: "h-12",
    useContainer: false,
  },
  {
    id: 5,
    bgColor: "bg-[#8a84780f]",
    borderColor: "border-[#8a84781a]",
    iconBgColor: "bg-[#8a84780f]",
    iconContent: "multi",
    icons: [
      {
        src: vector33,
        className: "absolute w-[95.49%] h-[91.31%] top-[8.69%] left-[4.51%]",
        alt: "Vector",
      },
      {
        src: vector34,
        className: "absolute w-[53.75%] h-[66.25%] top-[33.75%] left-[46.25%]",
        alt: "Vector",
      },
      {
        src: vector35,
        className: "absolute w-[53.75%] h-[32.92%] top-[67.08%] left-[46.25%]",
        alt: "Vector",
      },
    ],
    title: "ブログ未更新",
    titleColor: "text-[#8a8478]",
    subtitle: "3名が1週間以上未更新",
    dotColor: "bg-[#5a5650]",
    height: "h-[47px]",
    useContainer: false,
  },
];

export const GroupWrapperSubsection = (): JSX.Element => {
  return (
    <div className="absolute top-[260px] left-[1161px] w-[428px] h-[356px] flex gap-3.5">
      <div className="gap-3.5 border-[1.56px] border-solid w-[207px] h-[356px] flex flex-col bg-[#17181c] rounded-[18px] border-[#ffffff0f]">
        <div className="ml-5 mt-4 w-[282.9px] flex">
          <div className="w-[117.2px] flex gap-[7px]">
            <div className="mt-[1.0px] w-3 h-3 flex">
              <img className="flex-1 w-[9.9px]" alt="Vector" src={vector167} />
            </div>
            <div className="w-[98.2px] h-[13.99px] flex">
              <div className="mt-[0.1px] w-[99px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#8a8478] text-[10px] tracking-[1.12px] leading-[14px] whitespace-nowrap">
                クイックアクション
              </div>
            </div>
          </div>
        </div>

        <div className="ml-[19px] h-[295px] gap-[25px] w-[168px] flex flex-col">
          {quickActions.map((action) =>
            action.isPrimary ? (
              <button
                key={action.id}
                className="all-[unset] box-border h-[33px] relative mt-[12.2px] rounded-[11px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]"
              >
                <div className="absolute top-[11px] left-3 w-3 h-3">
                  {action.icons.map((icon, idx) => (
                    <img
                      key={idx}
                      className={icon.className}
                      alt={icon.alt}
                      src={icon.src}
                    />
                  ))}
                </div>
                <div className="absolute top-[9px] left-[33px] w-[219px] h-[15px] flex">
                  <div className="mt-[0.1px] w-[78px] h-4 [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#0b0b0d] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                    {action.label}
                  </div>
                </div>
                <div className="absolute top-3 left-[141px] w-2.5 h-2.5 flex">
                  <img
                    className="flex-1 w-[3.54px]"
                    alt="Vector"
                    src={action.arrowSrc}
                  />
                </div>
              </button>
            ) : (
              <button
                key={action.id}
                className="all-[unset] box-border h-[35px] relative bg-[#ffffff0a] rounded-[11px] border-[0.56px] border-solid border-[#ffffff0f]"
              >
                <div className="absolute top-[11px] left-[13px] w-3 h-3">
                  {action.icons.map((icon, idx) => (
                    <img
                      key={idx}
                      className={icon.className}
                      alt={icon.alt}
                      src={icon.src}
                    />
                  ))}
                </div>
                <div className="absolute top-2.5 left-[34px] w-[218px] h-[15px] flex">
                  <div className="mt-[0.1px] w-[78px] h-4 [font-family:'Inter-Regular',Helvetica] font-normal text-[#c7c0b2] text-[11px] tracking-[0.06px] leading-[15.4px] whitespace-nowrap">
                    {action.label}
                  </div>
                </div>
                <div className="absolute top-3 left-[140px] w-2.5 h-2.5 flex">
                  <img
                    className="flex-1 w-[3.33px]"
                    alt="Vector"
                    src={action.arrowSrc}
                  />
                </div>
              </button>
            ),
          )}
        </div>
      </div>

      <div className="gap-[10.5px] border border-solid w-[207px] h-[356px] flex flex-col bg-[#17181c] rounded-[18px] border-[#ffffff0f]">
        <div className="ml-[18.6px] mt-[18.6px] gap-[7px] w-[282.9px] flex">
          <div className="mt-[-1.0px] w-3 h-3 relative">
            <img
              className="absolute w-[95.49%] h-[91.31%] top-[8.69%] left-[4.51%]"
              alt="Vector"
              src={vector19}
            />
            <img
              className="absolute w-[53.75%] h-[66.25%] top-[33.75%] left-[46.25%]"
              alt="Vector"
              src={vector20}
            />
            <img
              className="absolute w-[53.75%] h-[32.92%] top-[67.08%] left-[46.25%]"
              alt="Vector"
              src={vector21}
            />
          </div>
          <div className="w-[66.01px] h-[13.99px] flex">
            <div className="mt-[-1.9px] w-[66px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#8a8478] text-[10px] tracking-[1.12px] leading-[14px] whitespace-nowrap">
              重要アラート
            </div>
          </div>
        </div>

        <div className="ml-[17px] h-[261px] gap-3.5 w-[168px] flex flex-col">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`${alert.height} relative ${alert.bgColor} rounded-[11px] border-[0.56px] border-solid ${alert.borderColor}`}
            >
              {alert.useContainer ? (
                <img
                  className="absolute top-[13px] left-3 w-[22px] h-[22px]"
                  alt="Container"
                  src={container}
                />
              ) : (
                <div
                  className={`absolute top-[13px] left-3 w-[22px] h-[22px] flex ${alert.iconBgColor} rounded-md`}
                >
                  {alert.iconContent === "single" ? (
                    <div className="mt-[5.5px] w-[11px] h-[11px] ml-[5.5px] flex">
                      {alert.icons.map((icon, idx) => (
                        <img
                          key={idx}
                          className={icon.className}
                          alt={icon.alt}
                          src={icon.src}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-[5.5px] w-[11px] h-[11px] ml-[5.5px] relative">
                      {alert.icons.map((icon, idx) => (
                        <img
                          key={idx}
                          className={icon.className}
                          alt={icon.alt}
                          src={icon.src}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="absolute top-2.5 left-[43px] w-[215px] h-7 flex flex-col gap-px">
                <div className="w-[214.81px] h-[14.3px] flex">
                  <div
                    className={`mt-[0.6px] h-[15px] [font-family:'Inter-Medium',Helvetica] font-medium ${alert.titleColor} text-[11px] tracking-[0.06px] leading-[14.3px] whitespace-nowrap`}
                  >
                    {alert.title}
                  </div>
                </div>
                <div className="w-[214.81px] h-[12.99px] flex">
                  <div className="mt-[0.6px] h-[13px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[13px] whitespace-nowrap">
                    {alert.subtitle}
                  </div>
                </div>
              </div>

              <div
                className={`absolute top-[21px] left-[149px] w-[5px] h-[5px] ${alert.dotColor} rounded-[2.5px]`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
