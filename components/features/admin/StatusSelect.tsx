'use client';

import { useEffect, useState, useTransition } from 'react';
import { updateApplicationStatus } from '@/lib/actions/applications';
import { toast } from 'sonner';

interface Props {
  id: string;
  currentStatus: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: '新着' },
  { value: 'reviewing', label: '選考中' },
  { value: 'hired', label: '採用' },
  { value: 'rejected', label: '見送り' },
];

export function StatusSelect({ id, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value;
    const previousStatus = status;
    setStatus(nextStatus);
    startTransition(async () => {
      const result = await updateApplicationStatus(id, nextStatus);
      if ('error' in result && result.error) {
        setStatus(previousStatus);
        toast.error(result.error);
      }
    });
  };

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-[#ffffff10] rounded-[8px] px-2 py-1.5 text-[#f4f1ea] bg-black/94 focus:outline-none focus:border-gold disabled:opacity-50 transition-colors font-sans"
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
