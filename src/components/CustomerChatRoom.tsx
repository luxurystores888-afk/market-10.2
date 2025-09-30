import React, { useState, useEffect, useRef } from 'react';

const CHAT_KEY = 'customer_chat_messages';

function getMessages() {
  try {
    return JSON.parse(localStorage.getItem(CHAT_KEY) || '[]');
  } catch {
    return [];
  }
}

export const CustomerChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<any[]>(getMessages());
  const [input, setInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages));
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, time: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  return (
    <div style={{
      background: '#23272f',
      color: '#fff',
      padding: 16,
      borderRadius: 16,
      maxWidth: 350,
      position: 'fixed',
      bottom: 24,
      right: 24,
      boxShadow: '0 4px 24px #0004',
      zIndex: 1000,
    }}>
      <div style={{ fontWeight: 'bold', color: '#00bcd4', marginBottom: 8 }}>💬 Customer Chat Room</div>
      <div ref={chatRef} style={{
        background: '#181a20',
        height: 180,
        overflowY: 'auto',
        borderRadius: 8,
        padding: 8,
        marginBottom: 8,
        fontSize: 14,
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 4 }}>
            <span style={{ color: '#00d084' }}>{msg.time}:</span> {msg.text}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          style={{ flex: 1, borderRadius: 8, border: 'none', padding: 8 }}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          style={{ background: '#00bcd4', color: '#fff', borderRadius: 8, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
      <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
        (Demo: messages stored locally. For real chat, connect to backend/WebSocket.)
      </div>
    </div>
  );
};
