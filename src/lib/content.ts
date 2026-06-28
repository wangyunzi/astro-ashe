import { getCollection, getEntry } from "astro:content";
import { slugify, type PostEntry } from "./ashe";

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedAlbums() {
  const albums = await getCollection("album", ({ data }) => !data.draft);
  return albums.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedPages() {
  const pages = await getCollection("pages", ({ data }) => !data.draft);
  return pages.sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-CN"));
}

export async function getFeedLinks() {
  const feeds = await getCollection("feeds", ({ data }) => data.enabled !== false);
  const friendsPage = await getPageBySlug("friends");
  const friendsGroupTitle = friendsPage?.data.friendsGroupTitle || "友情链接";
  const friendGroup = friendsPage?.data.groups.find((group) => group.title === friendsGroupTitle);
  const inlineFeeds = (friendGroup?.items || [])
    .flatMap((item) => {
      const manualFeed = "feed" in item && typeof item.feed === "string" ? item.feed.trim() : "";

      return manualFeed
        ? [{
        id: `links-${slugify(item.title)}`,
        data: {
          title: item.title,
          titleEn: item.titleEn,
          site: item.href,
          feed: manualFeed,
          feedCandidates: [],
          description: item.description,
          descriptionEn: item.descriptionEn,
          avatar: item.avatar,
          category: "category" in item && typeof item.category === "string" ? item.category : friendGroup?.title,
          enabled: true,
          order: Number.MAX_SAFE_INTEGER
        }
      }]
        : [];
    });
  const extraFeeds = (friendsPage?.data.extraFeeds || [])
    .filter((feed) => feed.enabled !== false)
    .map((feed, index) => ({
      id: `extra-feed-${index}`,
      data: feed
    }));

  const merged = [...inlineFeeds, ...extraFeeds, ...feeds];
  return merged.filter(
    (feed, index, array) =>
      array.findIndex((entry) => entry.data.feed === feed.data.feed || entry.data.site === feed.data.site) === index
  );
}

export async function getPageBySlug(slug: string) {
  return getEntry("pages", slug);
}

export async function getPageByPermalink(permalink: string) {
  const pages = await getPublishedPages();
  const normalized = permalink.replace(/\/+$/, "") || "/";
  return pages.find((page) => (page.data.permalink.replace(/\/+$/, "") || "/") === normalized);
}

export function getAllCategories(posts: PostEntry[]) {
  return [...new Set(posts.flatMap((post) => post.data.categories))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getAllTags(posts: PostEntry[]) {
  return [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b)
  );
}

export function getAllAuthors(posts: PostEntry[]) {
  return [...new Set(posts.map((post) => post.data.author))].sort((a, b) => a.localeCompare(b));
}

export function findBySlug(values: string[], slug: string) {
  return values.find((value) => slugify(value) === slug);
}

export function relatedPosts(posts: PostEntry[], post: PostEntry, limit = 3) {
  const categories = new Set(post.data.categories);
  const tags = new Set(post.data.tags);
  return posts
    .filter((entry) => entry.id !== post.id)
    .map((entry) => ({
      entry,
      score:
        entry.data.categories.filter((category) => categories.has(category)).length * 2 +
        entry.data.tags.filter((tag) => tags.has(tag)).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.entry.data.date.valueOf() - a.entry.data.date.valueOf())
    .slice(0, limit)
    .map(({ entry }) => entry);
}
