import Link from 'next/link';

export default function CastVerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm text-center bg-white p-10 rounded-2xl shadow-luxury">
        <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold text-2xl">✓</span>
        </div>
        <h1 className="font-serif text-xl tracking-widest text-[#171717] mb-4">SMS認証へ変更されました</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-8">
          キャストログインは電話番号 + SMS認証へ切り替わりました。<br />
          ログイン画面からSMS認証を行ってください。
        </p>
        <Link
          href="/cast/login"
          className="inline-block px-8 py-3 bg-[#171717] text-white text-xs tracking-[0.2em] uppercase rounded-xl hover:bg-gold transition-all"
        >
          ログインへ進む
        </Link>
      </div>
    </div>
  );
}
