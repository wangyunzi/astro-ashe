import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import Parser from "rss-parser";
import yaml from "js-yaml";

const root = process.cwd();
const friendsPath = path.join(root, "src/content/pages/friends.md");
const feedsDir = path.join(root, "src/content/feeds");
const cachePath = path.join(root, "src/data/friends-feed-cache.json");
const userAgent = "Mozilla/5.0 (compatible; Astro Ashe Feed Cache/1.0; +https://asky.0tz.top)";
const parser = new Parser({
  timeout: Number(process.env.RSS_FETCH_TIMEOUT_MS || 8000),
  headers: {
    "User-Agent": userAgent
  }
});
const fetchConcurrency = Number(process.env.RSS_FETCH_CONCURRENCY || 8);

function readFrontmatter(markdown) {
  const match = markdown.match(/^---\s*\n([\s\S]*?)\n---/);
  return match ? yaml.load(match[1]) || {} : {};
}

function stripHtml(value = "") {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeFeed(feed) {
  if (!feed || feed.enabled === false || !feed.title || !feed.site || !feed.feed) {
    return null;
  }

  return {
    title: String(feed.title),
    titleEn: feed.titleEn ? String(feed.titleEn) : undefined,
    site: String(feed.site),
    feed: String(feed.feed),
    feedCandidates: asArray(feed.feedCandidates).map(String),
    description: feed.description ? String(feed.description) : undefined,
    descriptionEn: feed.descriptionEn ? String(feed.descriptionEn) : undefined,
    avatar: feed.avatar ? String(feed.avatar) : undefined,
    category: feed.category ? String(feed.category) : undefined,
    sourceType: feed.sourceType ? String(feed.sourceType) : "feed",
    order: Number.isFinite(feed.order) ? feed.order : Number.MAX_SAFE_INTEGER
  };
}

function uniqueFeeds(feeds) {
  const seen = new Set();

  return feeds.filter((feed) => {
    const key = `${feed.feed}::${feed.site}`;

    if (seen.has(key) || seen.has(feed.feed) || seen.has(feed.site)) {
      return false;
    }

    seen.add(key);
    seen.add(feed.feed);
    seen.add(feed.site);
    return true;
  });
}

async function readDataFeeds() {
  const entries = [];

  try {
    const files = await fs.readdir(feedsDir);

    for (const file of files) {
      if (!/\.(ya?ml|json)$/i.test(file) || file.startsWith("_")) {
        continue;
      }

      const filePath = path.join(feedsDir, file);
      const raw = await fs.readFile(filePath, "utf8");
      const data = file.endsWith(".json") ? JSON.parse(raw) : yaml.load(raw);
      entries.push(...asArray(data).concat(Array.isArray(data) ? [] : [data]).filter(Boolean));
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  return entries;
}

async function getConfiguredFeeds() {
  const friendsMarkdown = await fs.readFile(friendsPath, "utf8");
  const page = readFrontmatter(friendsMarkdown);
  const friendsGroupTitle = page.friendsGroupTitle || "友情链接";
  const friendGroup = asArray(page.groups).find((group) => group.title === friendsGroupTitle);
  const inlineFeeds = asArray(friendGroup?.items)
    .filter((item) => item.feed)
    .map((item) => ({
      title: item.title,
      titleEn: item.titleEn,
      site: item.href,
      feed: item.feed,
      feedCandidates: item.feedCandidates,
      description: item.description,
      descriptionEn: item.descriptionEn,
      avatar: item.avatar,
      category: item.category || friendGroup?.title,
      sourceType: "friends"
    }));
  const extraFeeds = asArray(page.extraFeeds).map((feed) => ({ ...feed, sourceType: "extraFeeds" }));
  const dataFeeds = (await readDataFeeds()).map((feed) => ({ ...feed, sourceType: "feeds" }));

  return uniqueFeeds([...inlineFeeds, ...extraFeeds, ...dataFeeds].map(normalizeFeed).filter(Boolean));
}

async function fetchFeed(feed, perFeedLimit) {
  const candidates = [feed.feed, ...feed.feedCandidates].filter(Boolean);
  let parsed = null;
  let lastError = null;

  for (const feedUrl of candidates) {
    try {
      parsed = await parser.parseURL(feedUrl);
      break;
    } catch (error) {
      lastError = error;
    }
  }

  if (!parsed) {
    throw new Error(lastError?.message || `No valid RSS feed found for ${feed.site}`);
  }

  return (parsed.items || []).slice(0, perFeedLimit).map((item) => {
    const rawDate = item.isoDate || item.pubDate || item.published || item.created || "";
    const date = rawDate ? new Date(rawDate) : null;
    const content = item.contentSnippet || stripHtml(item.content || item["content:encoded"] || "");
    const summary = content.trim().replace(/\s+/g, " ").slice(0, 180);

    return {
      title: item.title?.trim() || "未命名动态",
      link: item.link || feed.site,
      date: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null,
      summary,
      source: feed.title,
      sourceEn: feed.titleEn,
      sourceUrl: feed.site,
      feedUrl: feed.feed,
      sourceType: feed.sourceType,
      avatar: feed.avatar,
      description: feed.description,
      descriptionEn: feed.descriptionEn,
      category: feed.category
    };
  });
}

async function settleWithConcurrency(entries, limit, worker) {
  const results = Array(entries.length);
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(limit, entries.length));

  await Promise.all(
    Array.from({ length: workerCount }, async () => {
      while (nextIndex < entries.length) {
        const index = nextIndex;
        nextIndex += 1;

        try {
          results[index] = {
            status: "fulfilled",
            value: await worker(entries[index], index)
          };
        } catch (error) {
          results[index] = {
            status: "rejected",
            reason: error
          };
        }
      }
    })
  );

  return results;
}

function dedupeItems(items) {
  const seen = new Set();

  return items.filter((item) => {
    const key = item.link || `${item.source}:${item.title}:${item.date || ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function readExistingCache() {
  try {
    const raw = await fs.readFile(cachePath, "utf8");
    const cache = JSON.parse(raw);

    return {
      updatedAt: typeof cache.updatedAt === "string" ? cache.updatedAt : "",
      expiresAt: typeof cache.expiresAt === "string" ? cache.expiresAt : "",
      items: Array.isArray(cache.items) ? cache.items : [],
      errors: Array.isArray(cache.errors) ? cache.errors : []
    };
  } catch {
    return {
      updatedAt: "",
      expiresAt: "",
      items: [],
      errors: []
    };
  }
}

async function main() {
  const now = new Date();
  const existingCache = await readExistingCache();
  const feeds = await getConfiguredFeeds();
  const perFeedLimit = Number(process.env.RSS_PER_FEED_LIMIT || 5);
  const cacheItemLimit = Number(process.env.RSS_CACHE_ITEM_LIMIT || 80);
  const maxAgeDays = Number(process.env.RSS_CACHE_MAX_AGE_DAYS || 120);
  const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;
  const results = await settleWithConcurrency(feeds, fetchConcurrency, (feed) => fetchFeed(feed, perFeedLimit));
  const errors = [];
  const items = [];
  const successes = [];

  results.forEach((result, index) => {
    const feed = feeds[index];

    if (result.status === "fulfilled") {
      items.push(...result.value);
      successes.push({
        source: feed.title,
        sourceType: feed.sourceType,
        count: result.value.length
      });
      return;
    }

    errors.push({
      source: feed.title,
      sourceType: feed.sourceType,
      site: feed.site,
      feed: feed.feed,
      message: result.reason?.message || "Unknown RSS fetch error"
    });
  });

  if (!items.length && errors.length) {
    const message = `All feed requests failed. Keeping existing cache with ${existingCache.items.length} items.`;

    if (!existingCache.items.length && process.env.RSS_REQUIRE_CACHE === "1") {
      console.error(message);
      console.error(`Feeds: ${feeds.length}, errors: ${errors.length}.`);
      process.exitCode = 1;
      return;
    }

    console.warn(message);
    console.warn(`Feeds: ${feeds.length}, errors: ${errors.length}.`);
    return;
  }

  const freshItems = dedupeItems([...items, ...existingCache.items])
    .filter((item) => {
      if (!item.date) {
        return true;
      }

      return now.getTime() - new Date(item.date).getTime() <= maxAgeMs;
    })
    .sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : 0;
      const bTime = b.date ? new Date(b.date).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, cacheItemLimit);

  const cache = {
    updatedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString(),
    items: freshItems,
    errors
  };

  await fs.mkdir(path.dirname(cachePath), { recursive: true });
  await fs.writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);

  console.log(`Updated ${path.relative(root, cachePath)} with ${freshItems.length} items.`);
  console.log(`Feeds: ${feeds.length}, errors: ${errors.length}.`);
  console.log(
    `Success sources: ${successes.map((feed) => `${feed.source}(${feed.sourceType}:${feed.count})`).join(", ") || "none"}`
  );
  console.log(
    `Failed sources: ${errors.map((feed) => `${feed.source}(${feed.sourceType})`).join(", ") || "none"}`
  );

  if (errors.length && process.env.RSS_VERBOSE_ERRORS === "1") {
    console.log(
      `Failure details: ${errors.map((feed) => `${feed.source}: ${feed.message}`).join(" | ")}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
