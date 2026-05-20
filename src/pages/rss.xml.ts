import { asheConfig } from "../ashe.config";
import { excerpt, postHref, postSummary } from "../lib/ashe";
import { getPublishedPosts } from "../lib/content";

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

function cdata(value: string) {
  return `<![CDATA[${value.replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts
    .map((post) => {
      const url = absoluteUrl(postHref(post));
      const categories = post.data.categories
        .map((category) => `<category>${escapeXml(category)}</category>`)
        .join("");

      return `
        <item>
          <title>${escapeXml(post.data.title)}</title>
          <link>${url}</link>
          <guid isPermaLink="true">${url}</guid>
          <pubDate>${post.data.date.toUTCString()}</pubDate>
          <description>${cdata(excerpt(postSummary(post)))}</description>
          ${categories}
        </item>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(asheConfig.site.title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(asheConfig.site.description)}</description>
    <language>${escapeXml(asheConfig.site.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${absoluteUrl(asheConfig.rss.path)}" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
