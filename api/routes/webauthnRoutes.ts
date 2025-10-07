import express from 'express';
import crypto from 'crypto';

export const webauthnRoutes = express.Router();

// Auto-enable if both RPID and ORIGIN are present, or explicit flag
const RPID = process.env.WEBAUTHN_RPID || '';
const ORIGIN = process.env.WEBAUTHN_ORIGIN || '';
const ENABLED = (!!RPID && !!ORIGIN) || process.env.WEBAUTHN_ENABLED === 'true';

// In-memory challenge store (replace with DB for production)
const challengeStore: Map<string, string> = new Map();

// Issue a registration/login challenge (client should pass current user id or a temp session id)
webauthnRoutes.post('/challenge', (req, res) => {
  if (!ENABLED) return res.status(501).json({ error: 'WebAuthn disabled' });
  const { userId } = req.body || {};
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const challenge = crypto.randomBytes(32).toString('base64url');
  challengeStore.set(userId, challenge);
  return res.json({ challenge, rpId: RPID, origin: ORIGIN });
});

// Register credential (placeholder; requires a proper WebAuthn verification library)
webauthnRoutes.post('/register', (req, res) => {
  if (!ENABLED) return res.status(501).json({ error: 'WebAuthn disabled' });
  // NOTE: Implement with @simplewebauthn/server or similar to verify attestation
  return res.status(501).json({ error: 'WebAuthn registration verification not configured' });
});

// Verify assertion (login) (placeholder)
webauthnRoutes.post('/verify', (req, res) => {
  if (!ENABLED) return res.status(501).json({ error: 'WebAuthn disabled' });
  // NOTE: Implement with @simplewebauthn/server to verify assertion
  return res.status(501).json({ error: 'WebAuthn assertion verification not configured' });
});


