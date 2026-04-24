'use client';

import { type FormEvent, useEffect, useRef, useState } from 'react';
import { castSendLoginOtp, castVerifyLoginOtp } from '@/lib/actions/cast-auth';
import { formatJapaneseMobilePhone } from '@/lib/utils/phone';
import { toast } from 'sonner';

type OtpVerifyFormProps = {
  initialPhone: string;
  initialCodeSent?: boolean;
};

export function OtpVerifyForm({ initialPhone, initialCodeSent = false }: OtpVerifyFormProps) {
  const [phone, setPhone] = useState(formatJapaneseMobilePhone(initialPhone));
  const [otp, setOtp] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(initialCodeSent);
  const otpInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCodeSent) {
      otpInputRef.current?.focus();
    }
  }, [isCodeSent]);

  const handleSendOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.set('phone', phone);
      const result = await castSendLoginOtp(formData);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      setIsCodeSent(true);
      toast.success(result.message ?? 'SMS認証コードを送信しました。');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVerifying(true);

    try {
      const formData = new FormData();
      formData.set('phone', phone);
      formData.set('otp', otp);
      const result = await castVerifyLoginOtp(formData);

      if (result && !result.success) {
        toast.error(result.error);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form onSubmit={isCodeSent ? handleVerifyOtp : handleSendOtp} className="space-y-5">
      <div>
        <label htmlFor="cast-phone-verify" className="mb-2 block text-sm" style={{ color: '#9f9fa9' }}>
          電話番号
        </label>
        <input
          id="cast-phone-verify"
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(formatJapaneseMobilePhone(event.target.value))}
          className="w-full rounded-[10px] px-4 py-3 text-base text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
          placeholder="090-1234-5678"
          style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
        />
      </div>

      {isCodeSent && (
        <div>
          <label htmlFor="cast-otp-verify" className="mb-2 block text-sm" style={{ color: '#9f9fa9' }}>
            SMS認証コード
          </label>
          <input
            ref={otpInputRef}
            id="cast-otp-verify"
            name="otp"
            type="tel"
            required
            autoComplete="one-time-code"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full rounded-[10px] px-4 py-3 text-base tracking-[0.4em] text-white placeholder-[#71717b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dfbd69]/25"
            placeholder="123456"
            style={{ background: '#27272a', border: '0.556px solid #3f3f47' }}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSending || isVerifying}
        className="h-[48px] w-full rounded-[10px] text-base font-semibold transition-opacity disabled:opacity-60"
        style={{
          background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          color: '#18181b',
        }}
      >
        {isSending || isVerifying ? '処理中...' : isCodeSent ? '認証する' : 'SMSを送信'}
      </button>

      {isCodeSent && (
        <button
          type="button"
          disabled={isSending || isVerifying}
          onClick={() => {
            setIsCodeSent(false);
            setOtp('');
          }}
          className="h-[44px] w-full rounded-[10px] border text-sm text-white/80 transition-opacity disabled:opacity-60"
          style={{ borderColor: '#3f3f47' }}
        >
          電話番号を修正する
        </button>
      )}
    </form>
  );
}
