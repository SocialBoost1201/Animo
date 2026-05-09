export default function AdminLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      {/* ページヘッダー */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-[#ffffff08]">
        <div className="space-y-2">
          <div className="h-4 w-32 rounded-md bg-[#ffffff0a]" />
          <div className="h-3 w-56 rounded-md bg-[#ffffff06]" />
        </div>
        <div className="h-8 w-24 rounded-[9px] bg-[#ffffff08]" />
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[18px] bg-[#ffffff04] border border-[#ffffff08] overflow-hidden">
            {/* カラムヘッダー */}
            <div className="flex items-center gap-3 px-5 h-[56px] border-b border-[#ffffff08]">
              <div className="w-[33px] h-[33px] rounded-[7px] bg-[#ffffff08]" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-[#ffffff0a]" />
                <div className="h-2.5 w-16 rounded bg-[#ffffff06]" />
              </div>
            </div>
            {/* カード群 */}
            <div className="p-4 space-y-3">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="rounded-[12px] border border-[#ffffff08] bg-[#ffffff04] p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-3.5 w-20 rounded bg-[#ffffff0a]" />
                    <div className="h-2.5 w-12 rounded bg-[#ffffff06]" />
                  </div>
                  <div className="h-2.5 w-full rounded bg-[#ffffff06]" />
                  <div className="h-2.5 w-3/4 rounded bg-[#ffffff06]" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-8 flex-1 rounded-[8px] bg-[#dfbd6920]" />
                    <div className="h-8 flex-1 rounded-[8px] bg-[#c882321a]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
