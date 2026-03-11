// public/sw.js - Web Push Service Worker
// このファイルはビルドツールを通さず直接提供されます

self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const { title, body, url, icon, badge } = data;

  const options = {
    body: body || '',
    icon: icon || '/icons/icon-192x192.png',
    badge: badge || '/icons/badge-72x72.png',
    data: { url: url || '/' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'サイトを開く' },
      { action: 'close', title: '閉じる' },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});
