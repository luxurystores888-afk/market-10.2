// chat.ts - Chat system with device token integration
import { getDeviceToken } from '../utils/deviceToken';

async function sendChatMessage(message) {
  try {
    await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (error) {
    console.error('Chat send error:', error);
  }
}
