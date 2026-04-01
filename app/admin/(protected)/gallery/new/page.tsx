import Link from 'next/link'

export default function NewGalleryPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-serif tracking-widest text-[#171717]">Gallery</h1>
        <p className="text-sm text-gray-500 mt-2">ギャラリー管理は現在一時停止しています。</p>
      </div>

      <div className="rounded-sm border border-amber-200 bg-amber-50 p-6">
        <p className="text-xs font-bold tracking-widest text-amber-800 uppercase">静的運用中</p>
        <p className="mt-3 text-sm leading-7 text-amber-900">
          公開サイトの <span className="font-bold">/gallery</span> は今回のリリースでは静的固定です。
          この画面から追加しても公開には反映されないため、新規登録導線を停止しています。
        </p>
      </div>

      <Link
        href="/admin/gallery"
        className="inline-flex items-center text-sm font-bold tracking-widest text-gray-500 transition-colors hover:text-[#171717]"
      >
        ギャラリー一覧へ戻る
      </Link>
    </div>
  )
}
