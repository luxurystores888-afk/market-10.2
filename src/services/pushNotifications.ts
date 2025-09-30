// pushNotifications.ts - Native Push Notification Campaigns

export async function requestAndSendPushNotification(message: string) {
  try {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') return;
    }
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const reg = await navigator.serviceWorker.ready;
      // Fetch VAPID public key
      const keyResp = await fetch('/api/push/public-key');
      const { publicKey } = await keyResp.json();
      if (!publicKey) {
        // Fallback to local notification
        new Notification(message || 'Flash Sale: 50% Off!');
        return;
      }
      // Subscribe
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
      });
      // Persist subscription
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub)
      });
    }
    // Show a local confirmation notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(message || 'Flash Sale: 50% Off!');
    }
  } catch {}
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Example usage:
// requestAndSendPushNotification('Special offer just for you!');
