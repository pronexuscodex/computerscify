import dns from 'node:dns/promises';

// Shared between vite.config.ts's dev/preview middleware and netlify/functions/article-proxy.ts
// (mirrors the pdf-proxy split in scripts/pdfProxyAllowlist.ts) so local dev and production apply
// identical fetch rules. Unlike the PDF proxy — which only ever fetches from a fixed, curated
// allowlist of academic-publisher hosts — news items link to whatever site a curated RSS feed
// (including Hacker News' front page, which aggregates arbitrary external submissions) happens to
// point at. A fixed host allowlist can't work here, so instead every request is validated against
// SSRF protections: only http/https, every resolved IP (including each redirect hop) must be a
// public address, and the response body is capped in size and read under a timeout.
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 ComputerSciFyReaderBot/1.0';

const FETCH_TIMEOUT_MS = 10000;
const MAX_REDIRECTS = 5;
const MAX_BYTES = 3_000_000;

function isDisallowedIp(ip: string): boolean {
  const v4 = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const a = parseInt(v4[1], 10);
    const b = parseInt(v4[2], 10);
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 0) return true; // "this network"
    if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata (169.254.169.254)
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a >= 224) return true; // multicast + reserved
    return false;
  }

  const lower = ip.toLowerCase();
  if (lower === '::1' || lower === '::') return true;
  if (lower.startsWith('::ffff:')) {
    const embedded = lower.split(':').pop() || '';
    if (embedded.includes('.')) return isDisallowedIp(embedded);
  }
  if (/^fe[89ab][0-9a-f]:/.test(lower)) return true; // fe80::/10 link-local
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true; // fc00::/7 unique local

  return false;
}

async function assertPublicHost(hostname: string): Promise<void> {
  if (hostname === 'localhost' || hostname === '0.0.0.0') {
    throw new Error('Refusing to fetch a local address');
  }
  let addresses: { address: string }[];
  try {
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    throw new Error('DNS resolution failed for target host');
  }
  if (addresses.length === 0) {
    throw new Error('No addresses resolved for target host');
  }
  for (const { address } of addresses) {
    if (isDisallowedIp(address)) {
      throw new Error('Refusing to fetch a private or internal address');
    }
  }
}

export interface ArticleFetchResult {
  html: string;
  finalUrl: string;
}

export async function fetchArticleHtml(rawUrl: string): Promise<ArticleFetchResult> {
  let current = rawUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    let parsed: URL;
    try {
      parsed = new URL(current);
    } catch {
      throw new Error('Invalid URL');
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Only http/https URLs are allowed');
    }

    await assertPublicHost(parsed.hostname);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch(parsed.toString(), {
        signal: controller.signal,
        redirect: 'manual',
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml',
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) throw new Error('Redirect response had no Location header');
      current = new URL(location, parsed).toString();
      continue;
    }

    if (!response.ok) {
      throw new Error(`Upstream responded ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType && !contentType.includes('html') && !contentType.includes('text/plain')) {
      throw new Error(`Unsupported content type: ${contentType}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      const text = await response.text();
      return { html: text.slice(0, MAX_BYTES), finalUrl: parsed.toString() };
    }

    const decoder = new TextDecoder();
    let html = '';
    let bytesRead = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      html += decoder.decode(value, { stream: true });
      if (bytesRead >= MAX_BYTES) {
        await reader.cancel();
        break;
      }
    }
    return { html, finalUrl: parsed.toString() };
  }

  throw new Error('Too many redirects');
}
