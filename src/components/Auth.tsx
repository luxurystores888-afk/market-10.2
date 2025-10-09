import { GoogleLogin } from '@react-oauth/google';

const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    if (res.ok) {
      console.log('Authenticated successfully');
    } else {
      console.error('Authentication failed');
    }
  } catch (error) {
    console.error('Auth error:', error);
  }
};

async function handleGoogleSignIn(credentialResponse) {
  try {
    const res = await fetch('/api/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });
    if (res.ok) console.log('Authenticated successfully');
  } catch (error) {
    console.error('Auth error:', error);
  }
}