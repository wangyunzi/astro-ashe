import { asheConfig } from "../ashe.config";
import {
  albumHref,
  authorHref,
  categoryHref,
  paginatedPageNumbers,
  paginationHref,
  postHref,
  tagHref
} from "../lib/ashe";
import {
  getAllAuthors,
  getAllCategories,
  getAllTags,
  getPublishedAlbums,
  getPublishedPosts
} from "../lib/content";

const siteUrl = asheConfig.site.url.replace(/\/$/, "");

function absoluteUrl(path: string) {
  return new URL(path, `${siteUrl}/`).toString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function latestDate(dates: Date[]) {
  return new Date(Math.max(...dates.map((date) => date.valueOf())));
}

function sitemapEntry(path: string, lastmod?: Date) {
  const lastmodLine = lastmod ? `\n    <lastmod>${dateOnly(lastmod)}</lastmod>` : "";

  return `
  <url>
    <loc>${escapeXml(absoluteUrl(path))}</loc>${lastmodLine}
  </url>`;
}

export async function GET() {
  const posts = await getPublishedPosts();
  const albums = await getPublishedAlbums();
  const allContentDates = [...posts.map((post) => post.data.date), ...albums.map((album) => album.data.date)];
  const siteLastmod = allContentDates.length ? latestDate(allContentDates) : new Date();

  const entries = [
    sitemapEntry("/", siteLastmod),
    sitemapEntry("/about/"),
    sitemapEntry("/archives/", siteLastmod),
    sitemapEntry("/contact/"),
    sitemapEntry("/gallery/", albums.length ? latestDate(albums.map((album) => album.data.date)) : undefined),
    sitemapEntry("/links/"),
    sitemapEntry("/search/"),
    ...paginatedPageNumbers(posts)
      .filter((page) => page > 1)
      .map((page) => sitemapEntry(paginationHref("/", page), siteLastmod)),
    ...posts.map((post) => sitemapEntry(postHref(post), post.data.date)),
    ...albums.map((album) => sitemapEntry(albumHref(album), album.data.date)),
    ...getAllCategories(posts).map((category) =>
      sitemapEntry(
        categoryHref(category),
        latestDate(
          posts
            .filter((post) => post.data.categories.includes(category))
            .map((post) => post.data.date)
        )
      )
    ),
    ...getAllCategories(posts).flatMap((category) => {
      const categoryPosts = posts.filter((post) => post.data.categories.includes(category));
      const categoryLastmod = latestDate(categoryPosts.map((post) => post.data.date));

      return paginatedPageNumbers(categoryPosts)
        .filter((page) => page > 1)
        .map((page) => sitemapEntry(paginationHref(categoryHref(category), page), categoryLastmod));
    }),
    ...getAllTags(posts).map((tag) =>
      sitemapEntry(
        tagHref(tag),
        latestDate(posts.filter((post) => post.data.tags.includes(tag)).map((post) => post.data.date))
      )
    ),
    ...getAllTags(posts).flatMap((tag) => {
      const tagPosts = posts.filter((post) => post.data.tags.includes(tag));
      const tagLastmod = latestDate(tagPosts.map((post) => post.data.date));

      return paginatedPageNumbers(tagPosts)
        .filter((page) => page > 1)
        .map((page) => sitemapEntry(paginationHref(tagHref(tag), page), tagLastmod));
    }),
    ...getAllAuthors(posts).map((author) =>
      sitemapEntry(
        authorHref(author),
        latestDate(posts.filter((post) => post.data.author === author).map((post) => post.data.date))
      )
    ),
    ...getAllAuthors(posts).flatMap((author) => {
      const authorPosts = posts.filter((post) => post.data.author === author);
      const authorLastmod = latestDate(authorPosts.map((post) => post.data.date));

      return paginatedPageNumbers(authorPosts)
        .filter((page) => page > 1)
        .map((page) => sitemapEntry(paginationHref(authorHref(author), page), authorLastmod));
    })
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
}
