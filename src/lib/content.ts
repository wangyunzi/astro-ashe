import { getCollection, getEntry } from "astro:content";
import { asheConfig } from "../ashe.config";
import { slugify, type PostEntry } from "./ashe";

export async function getPublishedPosts() {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedAlbums() {
  const albums = await getCollection("albums", ({ data }) => !data.draft);
  return albums.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPublishedPages() {
  const pages = await getCollection("pages", ({ data }) => !data.draft);
  return pages.sort((a, b) => a.data.title.localeCompare(b.data.title, "zh-CN"));
}

export async function getFeedLinks() {
  const feeds = await getCollection("feeds", ({ data }) => data.enabled !== false);
  const friendGroup = asheConfig.linksPage.groups.find(
    (group) => group.title === (asheConfig.linksPage.friendsGroupTitle || "友情链接")
  );
  const inlineFeeds = (friendGroup?.items || [])
    .filter((item) => "feed" in item && typeof item.feed === "string" && item.feed)
    .map((item) => ({
      id: `links-${slugify(item.title)}`,
      data: {
        title: item.title,
        titleEn: item.titleEn,
        site: item.href,
        feed: item.feed,
        description: item.description,
        descriptionEn: item.descriptionEn,
        avatar: item.avatar,
        category: "category" in item && typeof item.category === "string" ? item.category : friendGroup?.title,
        enabled: true,
        order: Number.MAX_SAFE_INTEGER
      }
    }));

  const merged = [...feeds, ...inlineFeeds];
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
