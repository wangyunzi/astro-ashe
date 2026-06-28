import { defineConfig } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import rehypeImageLoading from "./src/lib/rehype-image-loading.mjs";

export default defineConfig({
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeImageLoading]
    })
  },
  output: "static",
  trailingSlash: "always"
});
