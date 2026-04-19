'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle, Send, Smartphone, TriangleAlert } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = globalThis.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index);
  }

  return outputArray;
}

export function PushNotificationCard() {
  const [isWorking, setIsWorking] = useState(false);
  const [permission, setPermission] = useState<string>('unknown');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  async function subscribeToPush() {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error('This browser does not support web push notifications.');
      return;
    }

    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) {
      toast.error('Push notifications are not configured in this environment.');
      return;
    }

    setIsWorking(true);

    try {
      const nextPermission = await Notification.requestPermission();
      setPermission(nextPermission);

      if (nextPermission !== 'granted') {
        toast.error('Notification permission was not granted.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      const existingSubscription = await registration.pushManager.getSubscription();
      const subscription =
        existingSubscription ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
        }));

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      if (!response.ok) {
        throw new Error('Failed to save push subscription.');
      }

      toast.success('Push notifications are enabled for this browser.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsWorking(false);
    }
  }

  async function sendPreviewNotification() {
    setIsWorking(true);

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Approval needed: GBP review reply',
          body: 'AI Growth Agent found a high-priority review reply for Kannai Lounge Lumiere.',
          url: `${window.location.origin}/growth-agent/recommendations/rec-kannai-review`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send preview push notification.');
      }

      toast.success('Preview notification sent to saved subscriptions.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast.error(message);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <div className="rounded-[22px] border border-[#e6e8ef] bg-white p-4 shadow-[0_18px_48px_-38px_rgba(15,23,42,0.18)] md:p-5">
      <div className="flex flex-col gap-4">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4f6bc7]">
            <Smartphone className="size-3.5" />
            Push Ready
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.03em] text-[#1b2335]">
              Notification channel
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#677588]">
              Browser push lets operators jump from an alert directly into a recommendation review. This stays aligned with the in-app approval queue.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button
            onClick={subscribeToPush}
            className="h-12 rounded-[14px] bg-[#1c2536] text-white hover:bg-[#131b2a]"
            disabled={isWorking}
          >
            {isWorking ? <LoaderCircle className="size-4 animate-spin" /> : <Smartphone className="size-4" />}
            Enable browser push
          </Button>
          <Button
            variant="outline"
            onClick={sendPreviewNotification}
            className="h-12 rounded-[14px] border-[#d8dfeb] bg-white hover:bg-[#f6f8fc]"
            disabled={isWorking}
          >
            <Send className="size-4" />
            Send preview alert
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
        <span className="rounded-full bg-[#f4f7fb] px-3 py-1 font-medium text-[#55657d]">
          Permission: {permission}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fff4e8] px-3 py-1 font-medium text-[#cf7b2a]">
          <TriangleAlert className="size-4" />
          Requires configured `NEXT_PUBLIC_VAPID_PUBLIC_KEY`
        </span>
      </div>
    </div>
  );
}
