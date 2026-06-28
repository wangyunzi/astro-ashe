import { defineConfig } from "astro/config";
import rehypeImageLoading from "./src/lib/rehype-image-loading.mjs";

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeImageLoading]
  },
  output: "static",
  trailingSlash: "always"
});
