export const asheRuntimeConfig = {
  siteUrl: "https://wangyunzi.com",
  feeds: {
    cacheUserAgent: "Mozilla/5.0 (compatible; Astro Ashe Feed Cache/1.0; +$siteUrl)",
    discoveryUserAgent: "Mozilla/5.0 (compatible; Astro Ashe Feed Discovery/1.0; +$siteUrl)"
  }
};

export function configuredUserAgent(template) {
  return template.replace("$siteUrl", asheRuntimeConfig.siteUrl.replace(/\/$/, ""));
}
