const FEED_LINK_PATTERN =
  /<link\b[^>]*(?:type=["']application\/(?:rss|atom|feed)\+xml["'][^>]*href=["']([^"']+)["']|href=["']([^"']+)["'][^>]*type=["']application\/(?:rss|atom|feed)\+xml["'])[^>]*>/gi;

export type DiscoveredFeed = {
  url: string;
  discovered: boolean;
};

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function normalizeBaseUrl(site: string) {
  const url = new URL(site);
  return `${url.origin}/`;
}

function toAbsoluteUrl(value: string, base: string) {
  try {
    return new URL(value, base).toString();
  } catch {
    return "";
  }
}

export function commonFeedCandidates(site: string) {
  const base = normalizeBaseUrl(site);
  return unique([
    toAbsoluteUrl("feed/", base),
    toAbsoluteUrl("feed.xml", base),
    toAbsoluteUrl("rss.xml", base),
    toAbsoluteUrl("atom.xml", base),
    toAbsoluteUrl("index.xml", base)
  ]);
}

export async function discoverFeedUrl(site: string, timeout = 8000): Promise<DiscoveredFeed | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(site, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Astro Ashe Feed Discovery/1.0)"
      },
      signal: controller.signal
    });
    clearTimeout(timer);

    if (!response.ok) {
      return null;
    }

    const html = await response.text();
    const matches = [...html.matchAll(FEED_LINK_PATTERN)]
      .map((match) => match[1] || match[2] || "")
      .map((href) => toAbsoluteUrl(href, response.url || site))
      .filter(Boolean);
    const [url] = unique(matches);

    return url ? { url, discovered: true } : null;
  } catch {
    return null;
  }
}
