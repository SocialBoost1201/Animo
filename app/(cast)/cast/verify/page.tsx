import { redirect } from 'next/navigation';
import { OtpVerifyForm } from '@/components/features/cast/OtpVerifyForm';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { createServiceClient } from '@/lib/supabase/service';

type VerifyPageProps = {
  searchParams: Promise<{
    phone?: string;
    reauth?: string;
  }>;
};

async function resolvePhone(phoneParam?: string, reauth?: string) {
  if (phoneParam) {
    return phoneParam;
  }

  if (reauth !== '1') {
    return null;
  }

  const cast = await getCurrentCast();
  if (!cast?.id) {
    return null;
  }

  const serviceRoleClient = createServiceClient();
  const { data } = await serviceRoleClient
    .from('cast_private_info')
    .select('phone')
    .eq('cast_id', cast.id)
    .maybeSingle();

  return data?.phone ?? null;
}

export default async function CastVerifyPage({ searchParams }: VerifyPageProps) {
  const { phone, reauth } = await searchParams;
  const resolvedPhone = await resolvePhone(phone, reauth);

  if (!resolvedPhone) {
    redirect('/cast/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <div
        className="w-full max-w-[448px] rounded-[16px] p-1"
        style={{
          background: 'linear-gradient(128deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
          boxShadow: '0 0 48px rgba(223,189,105,0.25)',
        }}
      >
        <div
          className="w-full rounded-[14px] p-10"
          style={{
            background: 'linear-gradient(128deg, rgb(24,24,27) 0%, rgb(39,39,42) 50%, rgb(24,24,27) 100%)',
            boxShadow: '0px 25px 50px 0px rgba(0,0,0,0.25)',
          }}
        >
          <div className="mb-8 text-center">
            <p
              className="mb-1 text-sm font-light uppercase tracking-[0.3em] text-white"
              style={{ fontFamily: 'var(--font-serif, serif)' }}
            >
              CLUB ANIMO
            </p>
            <h1 className="mb-5 text-3xl font-bold uppercase tracking-[0.2em] text-white">ANIMO CMS</h1>
            <p
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(90deg, rgb(223,189,105) 0%, rgb(146,111,52) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              SMS Verify
            </p>
          </div>

          <p className="mb-5 text-xs leading-relaxed" style={{ color: '#9f9fa9' }}>
            {reauth === '1'
              ? '14日以上アクセスがなかったため、SMS認証を再度お願いします。'
              : 'SMS認証コードを送信してログインを完了してください。'}
          </p>

          <OtpVerifyForm initialPhone={resolvedPhone} initialCodeSent={Boolean(phone)} />
        </div>
      </div>
    </div>
  );
}
