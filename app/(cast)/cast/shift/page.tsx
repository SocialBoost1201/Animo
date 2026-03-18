import React from 'react';
import { getCurrentCast } from '@/lib/actions/cast-auth';
import { redirect } from 'next/navigation';
import ShiftSubmitPage from '@/components/features/cast/ShiftSubmitForm';

export default async function CastShiftPage() {
  const cast = await getCurrentCast();
  if (!cast) redirect('/cast/login');

  return <ShiftSubmitPage castId={cast.id} />;
}
