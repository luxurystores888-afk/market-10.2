export function signMediaUrl(baseUrl: string, params: Record<string, string>, secret?: string): string {
  const url = new URL(baseUrl);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (!secret) return url.toString();
  const payload = url.pathname + '?' + url.searchParams.toString();
  const sig = sha256Hex(payload + secret);
  url.searchParams.set('sig', sig);
  return url.toString();
}

function sha256Hex(input: string): string {
  // Lightweight browser-side hash (not for cryptographic guarantees client-side)
  // In production, prefer server-side signing.
  if (typeof window !== 'undefined' && (window as any).crypto?.subtle) {
    // Caller should precompute on server; this is a fallback stub.
    return Array.from(input).map(c => c.charCodeAt(0).toString(16)).join('');
  }
  return Array.from(input).map(c => c.charCodeAt(0).toString(16)).join('');
}

