import fs from 'fs';
import path from 'path';

const AUDIT_DIR = process.env.AUDIT_DIR || path.join(process.cwd(), 'audit');
const AUDIT_FILE = path.join(AUDIT_DIR, 'admin-audit.log');

export function appendAdminAudit(event: {
  actorId: string;
  actorEmail?: string;
  action: string;
  resource?: string;
  meta?: Record<string, any>;
}): void {
  try {
    if (!fs.existsSync(AUDIT_DIR)) fs.mkdirSync(AUDIT_DIR, { recursive: true });
    const record = {
      ts: new Date().toISOString(),
      ...event
    };
    // Append-only: one line JSON per event
    fs.appendFileSync(AUDIT_FILE, JSON.stringify(record) + '\n', { encoding: 'utf8', flag: 'a' });
  } catch (e) {
    // Best-effort; do not throw
  }
}

export function getRecentAuditLines(maxLines = 200): string[] {
  try {
    const content = fs.readFileSync(AUDIT_FILE, 'utf8');
    const lines = content.split('\n').filter(Boolean);
    return lines.slice(-maxLines);
  } catch {
    return [];
  }
}

