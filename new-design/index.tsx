import vector17 from "./vector-17.svg";
import vector22 from "./vector-22.svg";
import vector26 from "./vector-26.svg";
import vector29 from "./vector-29.svg";
import vector30 from "./vector-30.svg";
import vector31 from "./vector-31.svg";
import vector37 from "./vector-37.svg";
import vector38 from "./vector-38.svg";
import vector39 from "./vector-39.svg";
import vector40 from "./vector-40.svg";
import vector41 from "./vector-41.svg";
import vector42 from "./vector-42.svg";
import vector43 from "./vector-43.svg";
import vector44 from "./vector-44.svg";
import vector45 from "./vector-45.svg";
import vector46 from "./vector-46.svg";
import vector47 from "./vector-47.svg";
import vector48 from "./vector-48.svg";
import vector52 from "./vector-52.svg";
import vector56 from "./vector-56.svg";
import vector57 from "./vector-57.svg";
import vector58 from "./vector-58.svg";
import vector60 from "./vector-60.svg";
import vector63 from "./vector-63.svg";
import vector64 from "./vector-64.svg";
import vector65 from "./vector-65.svg";
import vector68 from "./vector-68.svg";
import vector76 from "./vector-76.svg";
import vector84 from "./vector-84.svg";
import vector89 from "./vector-89.svg";
import vector92 from "./vector-92.svg";
import vector97 from "./vector-97.svg";
import vector100 from "./vector-100.svg";
import vector102 from "./vector-102.svg";
import vector106 from "./vector-106.svg";
import vector108 from "./vector-108.svg";
import vector112 from "./vector-112.svg";
import vector123 from "./vector-123.svg";
import vector124 from "./vector-124.svg";
import vector125 from "./vector-125.svg";
import vector126 from "./vector-126.svg";
import vector127 from "./vector-127.svg";
import vector128 from "./vector-128.svg";
import vector129 from "./vector-129.svg";
import vector132 from "./vector-132.svg";
import vector133 from "./vector-133.svg";
import vector134 from "./vector-134.svg";
import vector135 from "./vector-135.svg";
import vector136 from "./vector-136.svg";
import vector145 from "./vector-145.svg";
import vector147 from "./vector-147.svg";
import vector150 from "./vector-150.svg";
import vector151 from "./vector-151.svg";
import vector152 from "./vector-152.svg";
import vector159 from "./vector-159.svg";
import vector162 from "./vector-162.svg";
import vector163 from "./vector-163.svg";
import vector166 from "./vector-166.svg";

const overviewNavItems = [
  {
    label: "本日の営業状況",
    active: true,
    icons: [
      {
        src: vector125,
        className: "absolute w-[92.08%] h-[92.08%] top-[7.92%] left-[7.92%]",
      },
      {
        src: vector126,
        className: "absolute w-[46.25%] h-[92.08%] top-[7.92%] left-[53.75%]",
      },
      {
        src: vector127,
        className: "absolute w-[46.25%] h-[54.58%] top-[45.42%] left-[53.75%]",
      },
      {
        src: vector128,
        className: "absolute w-[92.08%] h-[37.92%] top-[62.08%] left-[7.92%]",
      },
    ],
    badge: null,
    chevron: vector129,
  },
  {
    label: "ダッシュボード",
    active: false,
    icons: [
      {
        src: vector132,
        className: "absolute w-[91.25%] h-[91.25%] top-[8.75%] left-[8.75%]",
      },
      {
        src: vector133,
        className: "absolute w-[45.42%] h-[91.25%] top-[8.75%] left-[54.58%]",
      },
      {
        src: vector134,
        className: "absolute w-[45.42%] h-[53.75%] top-[46.25%] left-[54.58%]",
      },
      {
        src: vector136,
        className: "absolute w-[91.25%] h-[37.08%] top-[62.92%] left-[8.75%]",
      },
    ],
    badge: null,
    chevron: null,
  },
];

const operationsNavItems = [
  {
    label: "キャスト管理",
    icons: [
      {
        src: vector145,
        className: "absolute w-[95.42%] h-[41.25%] top-[58.75%] left-[4.58%]",
      },
      {
        src: vector147,
        className: "absolute w-[82.92%] h-[91.25%] top-[8.75%] left-[17.08%]",
      },
      {
        src: vector151,
        className: "absolute w-[24.58%] h-[40.71%] top-[59.29%] left-[75.42%]",
      },
      {
        src: vector152,
        className: "absolute w-[37.08%] h-[90.71%] top-[9.29%] left-[62.92%]",
      },
    ],
    badge: null,
  },
  {
    label: "シフト管理",
    icons: [
      {
        src: vector159,
        className: "absolute w-[70.42%] h-[95.42%] top-[4.58%] left-[29.58%]",
      },
      {
        src: vector162,
        className: "absolute w-[37.08%] h-[95.42%] top-[4.58%] left-[62.92%]",
      },
      {
        src: vector163,
        className: "absolute w-[91.25%] h-[87.08%] top-[12.92%] left-[8.75%]",
      },
      {
        src: vector166,
        className: "absolute w-[91.25%] h-[62.08%] top-[37.92%] left-[8.75%]",
      },
    ],
    badge: null,
  },
  {
    label: "来店予定",
    icons: [
      {
        src: vector17,
        className: "absolute w-[70.42%] h-[95.42%] top-[4.58%] left-[29.58%]",
      },
      {
        src: vector22,
        className: "absolute w-[87.08%] h-[87.08%] top-[12.92%] left-[12.92%]",
      },
      {
        src: vector26,
        className: "absolute w-[53.75%] h-[57.92%] top-[42.08%] left-[46.25%]",
      },
      {
        src: vector29,
        className: "absolute w-[53.75%] h-[37.08%] top-[62.92%] left-[46.25%]",
      },
      {
        src: vector30,
        className: "absolute w-[70.42%] h-[57.92%] top-[42.08%] left-[29.58%]",
      },
      {
        src: vector31,
        className: "absolute w-[70.42%] h-[37.08%] top-[62.92%] left-[29.58%]",
      },
    ],
    badge: null,
  },
  {
    label: "キャスト投稿",
    icons: [
      {
        src: vector37,
        className: "absolute w-[87.08%] h-[95.42%] top-[4.58%] left-[12.92%]",
      },
      {
        src: vector38,
        className: "absolute w-[45.42%] h-[95.42%] top-[4.58%] left-[54.58%]",
      },
      {
        src: vector39,
        className: "absolute w-[70.42%] h-[66.25%] top-[33.75%] left-[29.58%]",
      },
      {
        src: vector40,
        className: "absolute w-[70.42%] h-[49.58%] top-[50.42%] left-[29.58%]",
      },
      {
        src: vector41,
        className: "absolute w-[70.42%] h-[32.92%] top-[67.08%] left-[29.58%]",
      },
    ],
    badge: null,
  },
  {
    label: "評価管理",
    isSingleIcon: true,
    singleIconSrc: vector42,
    badge: null,
  },
];

const managementNavItems = [
  {
    label: "求人応募",
    icons: [
      {
        src: vector43,
        className: "absolute w-[70.42%] h-[95.42%] top-[4.58%] left-[29.58%]",
      },
      {
        src: vector44,
        className: "absolute w-[95.42%] h-[78.75%] top-[21.25%] left-[4.58%]",
      },
    ],
    badge: "6",
  },
  {
    label: "お知らせ",
    icons: [
      {
        src: vector45,
        className: "absolute w-[60.97%] h-[16.25%] top-[83.75%] left-[39.03%]",
      },
      {
        src: vector46,
        className: "absolute w-[91.25%] h-[95.42%] top-[4.58%] left-[8.75%]",
      },
    ],
    badge: "2",
  },
  {
    label: "設定",
    icons: [
      {
        src: vector47,
        className: "absolute w-[91.32%] h-[95.42%] top-[4.58%] left-[8.68%]",
      },
      {
        src: vector48,
        className: "absolute w-[66.25%] h-[66.25%] top-[33.75%] left-[33.75%]",
      },
    ],
    badge: null,
  },
];

export const SidebarSubsection = (): JSX.Element => {
  return (
    <div className="absolute top-0 left-0 w-[249px] h-[964px] bg-[#0e0e10]">
      {/* Logo / Brand */}
      <div className="absolute top-[15px] left-[23px] w-[203px] h-[38px] flex gap-3">
        <div className="w-[37.99px] h-[37.99px] flex rounded-[10px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]">
          <div className="mt-[10.5px] w-[17px] h-[17px] ml-[10.5px] relative">
            <img
              className="absolute w-[96.24%] h-[92.05%] top-[7.95%] left-[3.76%]"
              alt="Vector"
              src={vector135}
            />
            <img
              className="absolute w-[83.75%] h-[17.08%] top-[82.92%] left-[16.25%]"
              alt="Vector"
              src={vector150}
            />
          </div>
        </div>

        <div className="mt-[5.0px] w-[94px] h-7 flex flex-col gap-0.5">
          <div className="w-[94px] flex">
            <div className="mt-[-0.1px] w-[84px] h-2.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#8a8478] text-[10px] tracking-[2.12px] leading-[10px] whitespace-nowrap">
              CLUB ANIMO
            </div>
          </div>
          <div className="w-[94px] h-[16.8px] flex">
            <div className="w-[95px] h-[17px] [font-family:'Inter-Bold',Helvetica] font-bold text-transparent text-sm tracking-[1.25px] leading-[16.8px] whitespace-nowrap">
              ANIMO CMS
            </div>
          </div>
        </div>
      </div>

      {/* Top divider */}
      <div className="absolute top-[84px] left-[19px] w-[207px] h-px bg-[#ffffff0f]" />

      {/* Bottom divider above mode selector */}
      <div className="absolute top-[812px] left-5 w-[207px] h-px bg-[#ffffff0f]" />

      {/* Mode selector */}
      <div className="absolute top-[823px] left-0 w-[247px] h-[62px]">
        <div className="absolute top-0 left-4 w-[215px] h-[21px] flex gap-1.5">
          <div className="mt-[1.7px] w-2.5 h-2.5 relative ml-[4.0px]">
            <img
              className="absolute w-[45.83%] h-[87.50%] top-[12.50%] left-[54.17%]"
              alt="Vector"
              src={vector52}
            />
            <img
              className="absolute w-[91.67%] h-[87.50%] top-[12.50%] left-[8.33%]"
              alt="Vector"
              src={vector56}
            />
            <img
              className="absolute w-[54.17%] h-[54.17%] top-[45.83%] left-[45.83%]"
              alt="Vector"
              src={vector57}
            />
            <img
              className="absolute w-[91.67%] h-[54.17%] top-[45.83%] left-[8.33%]"
              alt="Vector"
              src={vector58}
            />
            <img
              className="absolute w-[37.50%] h-[20.83%] top-[79.17%] left-[62.50%]"
              alt="Vector"
              src={vector60}
            />
            <img
              className="absolute w-[91.67%] h-[20.83%] top-[79.17%] left-[8.33%]"
              alt="Vector"
              src={vector63}
            />
            <img
              className="absolute w-[45.83%] h-[95.83%] top-[4.17%] left-[54.17%]"
              alt="Vector"
              src={vector64}
            />
            <img
              className="absolute w-[70.83%] h-[62.50%] top-[37.50%] left-[29.17%]"
              alt="Vector"
              src={vector65}
            />
            <img
              className="absolute w-[37.50%] h-[29.17%] top-[70.83%] left-[62.50%]"
              alt="Vector"
              src={vector68}
            />
          </div>
          <div className="mt-[0.1px] w-[51px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[1.43px] leading-[13.5px] whitespace-nowrap">
            モード選択
          </div>
        </div>

        <div className="absolute top-[21px] left-4 w-[215px] h-7 flex gap-1.5">
          {/* Dark mode button (active) */}
          <div className="w-[104.72px] h-[28.1px] flex gap-[5px] bg-[#dfbd691a] rounded-[10px] border-[0.56px] border-solid border-[#dfbd6959]">
            <div className="mt-[8.1px] w-3 h-3 ml-[29.2px] flex">
              <img className="flex-1 w-[9.9px]" alt="Vector" src={vector76} />
            </div>
            <div className="mt-[7.6px] w-[29.4px] h-[12.99px] flex">
              <div className="mt-[0.6px] w-[31px] h-[13px] [font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#dfbd69] text-[10px] text-center tracking-[0.12px] leading-[13px] whitespace-nowrap">
                ダーク
              </div>
            </div>
          </div>

          {/* Light mode button (inactive) */}
          <div className="w-[104.72px] h-[28.1px] flex gap-[5px] bg-[#ffffff0a] rounded-[10px] border-[0.56px] border-solid border-[#ffffff0f]">
            <div className="mt-[8.1px] w-3 h-3 relative ml-[28.9px]">
              <img
                className="absolute w-[70.42%] h-[70.42%] top-[29.58%] left-[29.58%]"
                alt="Vector"
                src={vector84}
              />
              <img
                className="absolute w-[53.75%] h-[95.42%] top-[4.58%] left-[46.25%]"
                alt="Vector"
                src={vector89}
              />
              <img
                className="absolute w-[53.75%] h-[20.42%] top-[79.58%] left-[46.25%]"
                alt="Vector"
                src={vector92}
              />
              <img
                className="absolute w-[83.21%] h-[83.21%] top-[16.79%] left-[16.79%]"
                alt="Vector"
                src={vector97}
              />
              <img
                className="absolute w-[30.17%] h-[30.17%] top-[69.83%] left-[69.83%]"
                alt="Vector"
                src={vector100}
              />
              <img
                className="absolute w-[95.42%] h-[53.75%] top-[46.25%] left-[4.58%]"
                alt="Vector"
                src={vector102}
              />
              <img
                className="absolute w-[20.42%] h-[53.75%] top-[46.25%] left-[79.58%]"
                alt="Vector"
                src={vector106}
              />
              <img
                className="absolute w-[83.21%] h-[30.17%] top-[69.83%] left-[16.79%]"
                alt="Vector"
                src={vector108}
              />
              <img
                className="absolute w-[30.17%] h-[83.21%] top-[16.79%] left-[69.83%]"
                alt="Vector"
                src={vector112}
              />
            </div>
            <div className="mt-[7.6px] w-[30px] h-[12.99px] flex">
              <div className="mt-[0.6px] w-[31px] h-[13px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] text-center tracking-[0.12px] leading-[13px] whitespace-nowrap">
                ライト
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider above user profile */}
      <div className="absolute top-[884px] left-5 w-[207px] h-px bg-[#ffffff0f]" />

      {/* User profile */}
      <div className="absolute top-[895px] left-4 w-[215px] h-[47px] flex gap-2.5 bg-[#ffffff0a] rounded-xl border-[0.56px] border-solid border-[#ffffff0f]">
        <div className="mt-[9.5px] w-[27.99px] h-[27.99px] ml-[11.6px] flex rounded-[14px] bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]">
          <div className="mt-[5.5px] w-[11px] h-[17px] ml-[8.5px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#0b0b0d] text-[11px] tracking-[0.06px] leading-[16.5px] whitespace-nowrap">
            店
          </div>
        </div>

        <div className="mt-[9.9px] w-[132.34px] h-[27.29px] relative">
          <div className="absolute top-0 left-0 w-[132px] h-3.5 flex overflow-hidden">
            <div className="mt-[0.6px] w-[91px] h-[15px] [font-family:'Inter-Medium',Helvetica] font-medium text-[#c7c0b2] text-[11px] tracking-[0.06px] leading-[14.3px] whitespace-nowrap">
              田中 マネージャー
            </div>
          </div>
          <div className="absolute top-3.5 left-0 w-[132px] h-[13px] flex">
            <div className="mt-[0.6px] w-[95px] h-[13px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-[10px] tracking-[0.12px] leading-[13px] whitespace-nowrap">
              Club Animo · 管理者
            </div>
          </div>
        </div>

        <div className="mt-[17.5px] w-3 h-3 relative">
          <img
            className="absolute w-[91.74%] h-[95.83%] top-[4.17%] left-[8.26%]"
            alt="Vector"
            src={vector123}
          />
          <img
            className="absolute w-[66.67%] h-[66.67%] top-[33.33%] left-[33.33%]"
            alt="Vector"
            src={vector124}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-[90px] left-0 w-[249px] h-[722px] flex flex-col gap-1.5">
        {/* OVERVIEW section */}
        <div className="ml-2.5 w-[227.44px] h-[94.05px] mt-[6.0px] flex flex-col">
          <div className="w-[227.44px] h-[26.49px] flex">
            <div className="mt-[8.1px] w-[60px] ml-[12.0px] tracking-[1.61px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[13.5px] whitespace-nowrap">
              OVERVIEW
            </div>
          </div>

          {overviewNavItems.map((item, index) => (
            <div
              key={index}
              className={`w-[227.44px] h-[32.78px] flex gap-2.5 rounded-[11px] ${
                item.active
                  ? "bg-[linear-gradient(90deg,rgba(223,189,105,1)_0%,rgba(146,111,52,1)_100%)]"
                  : ""
              }`}
            >
              <div className="mt-[9.4px] w-[13.99px] h-[13.99px] relative ml-[12.0px]">
                {item.icons.map((icon, iconIndex) => (
                  <img
                    key={iconIndex}
                    className={icon.className}
                    alt="Vector"
                    src={icon.src}
                  />
                ))}
              </div>
              <div className="mt-[8.0px] w-[158.45px] h-[16.79px] flex">
                <div
                  className={`mt-[0.1px] w-[84px] h-[17px] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap ${
                    item.active
                      ? "[font-family:'Inter-SemiBold',Helvetica] font-semibold text-[#0b0b0d]"
                      : "[font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478]"
                  }`}
                >
                  {item.label}
                </div>
              </div>
              {item.chevron && (
                <div className="mt-[10.9px] w-[11px] h-[11px] flex">
                  <img
                    className="flex-1 w-[3.9px]"
                    alt="Vector"
                    src={item.chevron}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* OPERATIONS section */}
        <div className="ml-2.5 w-[227.44px] h-[195.37px] relative">
          <div className="absolute top-0 left-0 w-[227px] h-[26px] flex">
            <div className="mt-[8.1px] w-[73px] h-3.5 ml-[12.0px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] tracking-[1.61px] leading-[13.5px] whitespace-nowrap">
              OPERATIONS
            </div>
          </div>

          {operationsNavItems.map((item, index) => (
            <div
              key={index}
              className="absolute left-0 w-[227px] h-[33px] flex gap-2.5 rounded-[11px]"
              style={{ top: `${26 + index * 33}px` }}
            >
              <div
                className={`mt-[9.4px] w-[13.99px] h-[13.99px] ml-[12.0px] ${item.isSingleIcon ? "flex" : "relative"}`}
              >
                {item.isSingleIcon ? (
                  <img
                    className="flex-1 w-[12.71px]"
                    alt="Vector"
                    src={item.singleIconSrc}
                  />
                ) : (
                  item.icons.map((icon, iconIndex) => (
                    <img
                      key={iconIndex}
                      className={icon.className}
                      alt="Vector"
                      src={icon.src}
                    />
                  ))
                )}
              </div>
              <div className="mt-[8.0px] w-[179.45px] h-[16.79px] flex">
                <div className="mt-[0.1px] h-[17px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MANAGEMENT section */}
        <div className="ml-2.5 w-[227.44px] h-[128.24px] relative">
          <div className="absolute top-0 left-0 w-[227px] h-[26px] flex">
            <div className="mt-[8.1px] w-[82px] ml-[12.0px] tracking-[1.61px] h-3.5 [font-family:'Inter-Bold',Helvetica] font-bold text-[#5a5650] text-[9px] leading-[13.5px] whitespace-nowrap">
              MANAGEMENT
            </div>
          </div>

          {managementNavItems.map((item, index) => (
            <div
              key={index}
              className="absolute left-0 w-[227px] h-[33px] flex gap-2.5 rounded-[11px]"
              style={{ top: `${26 + index * 34}px` }}
            >
              <div className="mt-[9.4px] w-[13.99px] h-[13.99px] relative ml-[12.0px]">
                {item.icons.map((icon, iconIndex) => (
                  <img
                    key={iconIndex}
                    className={icon.className}
                    alt="Vector"
                    src={icon.src}
                  />
                ))}
              </div>
              <div
                className={`mt-[8.1px] h-[16.79px] flex ${item.badge ? "w-[152.46px]" : "w-[179.45px]"}`}
              >
                <div className="mt-[0.1px] h-[17px] [font-family:'Inter-Regular',Helvetica] font-normal text-[#8a8478] text-xs tracking-[0] leading-[16.8px] whitespace-nowrap">
                  {item.label}
                </div>
              </div>
              {item.badge && (
                <div className="mt-[8.0px] w-[17px] h-[17px] flex bg-[#dfbd6924] rounded-lg">
                  <div className="mt-[1.5px] w-1.5 h-3.5 ml-[5.5px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#dfbd69] text-[9px] tracking-[0.17px] leading-[13.5px] whitespace-nowrap">
                    {item.badge}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};
