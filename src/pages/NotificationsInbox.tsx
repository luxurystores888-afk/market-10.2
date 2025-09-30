import React, { useEffect, useState } from 'react';

interface FeedItem {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  url?: string;
}

export default function NotificationsInbox() {
  const [feed, setFeed] = useState<FeedItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('pulse_notifications_feed') || '[]';
    try { setFeed(JSON.parse(raw)); } catch { setFeed([]); }
  }, []);

  const markAllAsRead = () => {
    localStorage.setItem('pulse_notifications_feed', JSON.stringify(feed));
    // no-op for now; can add a read flag later
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-cyan-900/20 text-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>
        {feed.length === 0 ? (
          <div className="text-gray-400">No notifications yet.</div>
        ) : (
          <div>
            <div className="flex justify-end mb-3">
              <button onClick={markAllAsRead} className="px-3 py-2 rounded bg-gray-800 border border-cyan-500/30 text-sm text-cyan-200 hover:bg-gray-800/80">Mark all as read</button>
            </div>
            <div className="space-y-3">
            {feed.sort((a,b)=>b.timestamp-a.timestamp).map(item => (
              <a key={item.id} href={item.url || '#'} className="block p-4 bg-gray-900/60 border border-cyan-500/30 rounded-xl hover:bg-gray-900/80">
                <div className="text-sm text-gray-400">{new Date(item.timestamp).toLocaleString()}</div>
                <div className="text-white">{item.message}</div>
              </a>
            ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


