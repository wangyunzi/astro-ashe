import { asheConfig, type HomeLayout } from "../ashe.config";
import type { CollectionEntry } from "astro:content";

export type PostEntry = CollectionEntry<"posts">;
export type AlbumEntry = CollectionEntry<"albums">;
export type FeedEntry = CollectionEntry<"feeds">;
export type PageEntry = CollectionEntry<"pages">;

export function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;

  const numberValue = Number.parseInt(value, 16);
  const red = (numberValue >> 16) & 255;
  const green = (numberValue >> 8) & 255;
  const blue = numberValue & 255;

  return `rgba(${red},${green},${blue},${alpha})`;
}

export function fontName(family: string) {
  return family.replace(/\+/g, " ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryHref(category: string) {
  return `/category/${slugify(category)}/`;
}

export function tagHref(tag: string) {
  return `/tag/${slugify(tag)}/`;
}

export function authorHref(author: string) {
  return `/author/${slugify(author)}/`;
}

export function postRouteParam(post: PostEntry) {
  const prefix = asheConfig.blog.postPathPrefix.trim();
  const normalizedPrefix =
    !prefix || prefix === "/" ? "" : prefix.replace(/^\/+|\/+$/g, "");
  const slug = post.slug.replace(/^\/+|\/+$/g, "");

  return normalizedPrefix ? `${normalizedPrefix}/${slug}` : slug;
}

export function postHref(post: PostEntry) {
  return `/${postRouteParam(post)}/`;
}

export function albumHref(album: AlbumEntry) {
  return `/gallery/${album.slug}/`;
}

export function paginationHref(basePath: string, page: number) {
  const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;

  if (page <= 1) {
    return normalizedBase;
  }

  return `${normalizedBase}page/${page}/`;
}

export type PaginationState = {
  currentPage: number;
  totalPages: number;
  perPage: number;
  totalItems: number;
};

export function paginatePosts(posts: PostEntry[], currentPage = 1) {
  const { enabled, perPage } = asheConfig.blog.pagination;
  const safePerPage = Math.max(1, perPage);

  if (!enabled) {
    return {
      items: posts,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        perPage: posts.length || safePerPage,
        totalItems: posts.length
      } satisfies PaginationState
    };
  }

  const totalPages = Math.max(1, Math.ceil(posts.length / safePerPage));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const start = (page - 1) * safePerPage;

  return {
    items: posts.slice(start, start + safePerPage),
    pagination: {
      currentPage: page,
      totalPages,
      perPage: safePerPage,
      totalItems: posts.length
    } satisfies PaginationState
  };
}

export function paginatedPageNumbers(posts: PostEntry[]) {
  return Array.from({ length: paginatePosts(posts).pagination.totalPages }, (_, index) => index + 1);
}

export type MarkdownImage = {
  src: string;
  alt: string;
  title: string;
};

export function extractMarkdownImages(markdown = "") {
  const images: MarkdownImage[] = [];
  const imagePattern = /!\[([^\]]*)\]\((\S+?)(?:\s+["']([^"']*)["'])?\)/g;

  for (const match of markdown.matchAll(imagePattern)) {
    images.push({
      alt: match[1] || "",
      src: match[2] || "",
      title: match[3] || ""
    });
  }

  return images;
}

export function albumCover(album: AlbumEntry) {
  return album.data.cover || extractMarkdownImages(album.body || "")[0]?.src || "";
}

export function postCover(post: PostEntry) {
  return post.data.image || extractMarkdownImages(post.body || "")[0]?.src || "";
}

function decodeCommonEntities(value: string) {
  return value
    .replace(/&emsp;|&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'");
}

export function stripMarkdown(value: string) {
  return stripHtml(decodeCommonEntities(value))
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/!\[[^\]]*]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+[.)]\s+/gm, "")
    .replace(/[*_~#|[\]()`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function postSummary(post: PostEntry) {
  return stripMarkdown(post.data.description || post.body || "");
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat(asheConfig.site.language, {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

export function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function excerpt(value: string, words = asheConfig.blog.excerptWords) {
  const text = stripMarkdown(value);
  const hasCjk = /[\u3400-\u9fff]/.test(text);

  if (hasCjk) {
    const maxLength = Math.max(80, words * 3);
    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength).replace(/[，。！？、；：,\s]+$/, "")}...`;
  }

  const parts = text.split(/\s+/).filter(Boolean);
  if (parts.length <= words) {
    return text;
  }
  return `${parts.slice(0, words).join(" ")}...`;
}

export function layoutHasLeftSidebar(layout: HomeLayout) {
  return layout.includes("lsidebar");
}

export function layoutHasRightSidebar(layout: HomeLayout) {
  return layout.includes("rsidebar");
}

export function layoutIsList(layout: HomeLayout) {
  return layout.startsWith("list");
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export function buildDynamicCss() {
  const { colors, layout, site, typography, navigation, featuredLinks, responsive, darkMode } =
    asheConfig;
  const accentHover = hexToRgba(colors.accent, 0.8);
  const featuredLinkCount = Math.max(1, featuredLinks.items.filter((item) => item.image).length);
  const featuredLinksGutter = 20;
  const contentSidebarWidth = layout.sidebarWidth + 37;
  const hasLeft = layoutHasLeftSidebar(layout.homeLayout);
  const hasRight = layoutHasRightSidebar(layout.homeLayout);
  const mainContainerWidth =
    hasLeft && hasRight
      ? `calc(100% - ${contentSidebarWidth * 2}px)`
      : hasLeft || hasRight
        ? `calc(100% - ${contentSidebarWidth}px)`
        : "100%";
  const webkitMainContainerWidth = mainContainerWidth.startsWith("calc")
    ? mainContainerWidth.replace("calc", "-webkit-calc")
    : mainContainerWidth;

  const listLayoutCss = layoutIsList(layout.homeLayout)
    ? `
      [data-layout*="list"] .blog-grid .has-post-thumbnail .post-media {
        float: left;
        max-width: 300px;
        width: 100%;
      }

      [data-layout*="list"] .blog-grid .has-post-thumbnail .post-media img {
        width: 100%;
      }

      [data-layout*="list"] .blog-grid .has-post-thumbnail .post-content-wrap {
        width: calc(100% - 300px);
        width: -webkit-calc(100% - 300px);
        float: left;
        padding-left: 37px;
      }

      [data-layout*="list"] .blog-grid > li {
        padding-bottom: 39px;
        margin-bottom: 39px;
      }

      [data-layout*="list"] .blog-grid .post-header,
      [data-layout*="list"] .blog-grid .read-more {
        text-align: left;
      }
    `
    : "";

  const dropcapsCss = asheConfig.blog.showDropcaps
    ? `
      .post-content > p:not(.wp-block-tag-cloud):first-of-type:first-letter {
        font-family: "Playfair Display";
        font-weight: 400;
        float: left;
        margin: 0px 12px 0 0;
        font-size: 80px;
        line-height: 65px;
        text-align: center;
      }

      .blog-post .post-content > p:not(.wp-block-tag-cloud):first-of-type:first-letter {
        color: #030303;
      }
    `
    : "";

  const navCaseCss = typography.navUppercase
    ? `
      #main-menu li a,
      #mobile-menu li,
      .mobile-menu-btn a {
        text-transform: uppercase;
      }
    `
    : "";

  const navItalicCss = typography.navItalic
    ? `
      #main-menu li a,
      #mobile-menu li {
        font-style: italic;
      }
    `
    : "";

  const hiddenHeaderTextCss = site.showHeaderText
    ? ""
    : `
      .header-logo a:not(.logo-img),
      .site-description {
        display: none;
      }
    `;

  const responsiveCss = `
    ${
      responsive.featuredSlider
        ? ""
        : `
      @media screen and (max-width: 768px) {
        .featured-slider-area {
          display: none;
        }
      }
    `
    }
    ${
      responsive.featuredLinks
        ? ""
        : `
      @media screen and (max-width: 768px) {
        #featured-links {
          display: none;
        }
      }
    `
    }
    ${
      responsive.relatedPosts
        ? ""
        : `
      @media screen and (max-width: 640px) {
        .related-posts {
          display: none;
        }
      }
    `
    }
    ${
      responsive.sidebar
        ? ""
        : `
      @media screen and (max-width: 979px) {
        .sidebar-left-wrap,
        .sidebar-right-wrap {
          display: none !important;
        }
      }
    `
    }
  `;

  const darkModeCss = darkMode.enabled
    ? `
      body.ashe-dark-mode {
        background: #222222 !important;
      }

      body.ashe-dark-mode #main-nav,
      body.ashe-dark-mode #main-menu .sub-menu,
      body.ashe-dark-mode #main-nav #s {
        background-color: #111111;
      }

      body.ashe-dark-mode #main-nav a,
      body.ashe-dark-mode #main-nav i,
      body.ashe-dark-mode #main-nav #s {
        color: #ffffff;
      }

      body.ashe-dark-mode #main-nav .language-switcher-button {
        color: #ffffff;
      }

      body.ashe-dark-mode #main-nav .language-switcher-menu {
        background-color: #181818;
        border-color: ${hexToRgba("#ffffff", 0.12)};
        box-shadow: 0 14px 30px ${hexToRgba("#000000", 0.35)},
          0 2px 8px ${hexToRgba("#000000", 0.3)};
      }

      body.ashe-dark-mode #main-nav .language-switcher-menu a {
        background-color: #181818;
        color: #f4f4f4;
      }

      body.ashe-dark-mode #main-nav .language-switcher-menu a:hover,
      body.ashe-dark-mode #main-nav .language-switcher-menu a[aria-current="true"] {
        background-color: #242424;
        color: ${colors.accent};
      }

      body.ashe-dark-mode #main-menu .sub-menu {
        border-color: ${hexToRgba("#ffffff", 0.12)};
        box-shadow: 0 14px 30px ${hexToRgba("#000000", 0.35)},
          0 2px 8px ${hexToRgba("#000000", 0.3)};
      }

      body.ashe-dark-mode #main-menu .sub-menu,
      body.ashe-dark-mode #main-menu .sub-menu a,
      body.ashe-dark-mode #mobile-menu .sub-menu {
        background-color: #181818;
      }

      body.ashe-dark-mode #main-menu .sub-menu a {
        color: #f4f4f4;
        border-color: ${hexToRgba("#ffffff", 0.1)};
      }

      body.ashe-dark-mode #main-menu .sub-menu a:hover,
      body.ashe-dark-mode #main-menu .sub-menu li.current-menu-item > a,
      body.ashe-dark-mode #main-menu .sub-menu li.current-menu-ancestor > a {
        background-color: #242424;
        color: ${colors.accent};
      }

      body.ashe-dark-mode #mobile-menu .sub-menu a {
        color: #e8e8e8;
      }

      body.ashe-dark-mode .sidebar-alt,
      body.ashe-dark-mode #featured-links,
      body.ashe-dark-mode .main-content,
      body.ashe-dark-mode .featured-slider-area,
      body.ashe-dark-mode .page-content select,
      body.ashe-dark-mode .page-content input,
      body.ashe-dark-mode .page-content textarea {
        background-color: #222222;
      }

      body.ashe-dark-mode .page-content,
      body.ashe-dark-mode .page-content select,
      body.ashe-dark-mode .page-content input,
      body.ashe-dark-mode .page-content textarea,
      body.ashe-dark-mode .page-content .post-author a,
      body.ashe-dark-mode .page-content .ashe-widget a,
      body.ashe-dark-mode .page-content .comment-author {
        color: #c4c4c4;
      }

      body.ashe-dark-mode .page-content h1,
      body.ashe-dark-mode .page-content h2,
      body.ashe-dark-mode .page-content h3,
      body.ashe-dark-mode .page-content h4,
      body.ashe-dark-mode .page-content h5,
      body.ashe-dark-mode .page-content h6,
      body.ashe-dark-mode .page-content .post-title a,
      body.ashe-dark-mode blockquote,
      body.ashe-dark-mode .page-content .post-share a {
        color: #ffffff;
      }

      body.ashe-dark-mode .page-content .post-date,
      body.ashe-dark-mode .page-content .post-comments,
      body.ashe-dark-mode .page-content .post-author,
      body.ashe-dark-mode .page-content .comment-meta a,
      body.ashe-dark-mode .page-content .post-tags a {
        color: #9e9e9e;
      }

      body.ashe-dark-mode #featured-links h6 {
        background-color: rgba(34, 34, 34, 0.85);
        color: #c4c4c4;
      }

      body.ashe-dark-mode .main-nav-sidebar span,
      body.ashe-dark-mode .sidebar-alt-close-btn span {
        background-color: #ffffff;
      }

      body.ashe-dark-mode #page-footer,
      body.ashe-dark-mode #page-footer select,
      body.ashe-dark-mode #page-footer input,
      body.ashe-dark-mode #page-footer textarea {
        background-color: #333333;
        color: #c4c4c4;
      }

      body.ashe-dark-mode #page-footer,
      body.ashe-dark-mode #page-footer a {
        color: #c4c4c4;
      }

      body.ashe-dark-mode #page-footer h1,
      body.ashe-dark-mode #page-footer h2,
      body.ashe-dark-mode #page-footer h3,
      body.ashe-dark-mode #page-footer h4,
      body.ashe-dark-mode #page-footer h5,
      body.ashe-dark-mode #page-footer h6 {
        color: #f2f2f2;
      }

      body.ashe-dark-mode .page-content .post-footer,
      body.ashe-dark-mode [data-layout*="list"] .blog-grid > li,
      body.ashe-dark-mode .page-content .author-description,
      body.ashe-dark-mode .page-content .related-posts,
      body.ashe-dark-mode .page-content .entry-comments,
      body.ashe-dark-mode .page-content .ashe-widget li,
      body.ashe-dark-mode .page-content input,
      body.ashe-dark-mode .page-content textarea,
      body.ashe-dark-mode .widget-title h2:before,
      body.ashe-dark-mode .widget-title h2:after,
      body.ashe-dark-mode .post-tags a,
      body.ashe-dark-mode table tr,
      body.ashe-dark-mode table th,
      body.ashe-dark-mode table td,
      body.ashe-dark-mode pre,
      body.ashe-dark-mode .category-description,
      body.ashe-dark-mode #page-footer a,
      body.ashe-dark-mode #page-footer .ashe-widget li,
      body.ashe-dark-mode #page-footer .widget-title h2:before,
      body.ashe-dark-mode #page-footer .widget-title h2:after,
      body.ashe-dark-mode .footer-widgets {
        border-color: #6d6d6d;
      }
    `
    : "";

  return `
    body {
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    .header-logo a,
    .site-description {
      color: ${site.headerTextColor === "blank" ? "#111111" : site.headerTextColor};
    }

    .entry-header {
      height: 500px;
      background-color: ${colors.headerBackground};
      background-image: url(${site.headerImage});
      background-size: cover;
      background-position: center center;
    }

    #main-nav {
      background-color: #ffffff;
      box-shadow: 0px 1px 5px ${hexToRgba("#000000", 0.1)};
      text-align: ${navigation.align};
    }

    #featured-links h6 {
      background-color: ${hexToRgba("#ffffff", 0.85)};
      color: #000000;
    }

    #main-nav a,
    #main-nav i,
    #main-nav #s {
      color: #000000;
    }

    #main-nav .language-switcher-button {
      color: #000000;
    }

    #main-nav .language-switcher-menu {
      background-color: #ffffff;
      border-color: ${hexToRgba("#000000", 0.08)};
      box-shadow: 0 14px 30px ${hexToRgba("#000000", 0.12)},
        0 2px 8px ${hexToRgba("#000000", 0.08)};
    }

    #main-nav .language-switcher-menu a {
      background-color: #ffffff;
      color: #000000;
    }

    #main-nav .language-switcher-menu a:hover,
    #main-nav .language-switcher-menu a[aria-current="true"] {
      background-color: #f8f8f8;
      color: ${colors.accent};
    }

    .main-nav-sidebar span,
    .sidebar-alt-close-btn span {
      background-color: #000000;
    }

    #main-nav a:hover,
    #main-nav i:hover,
    #main-nav li.current-menu-item > a,
    #main-nav li.current-menu-ancestor > a,
    #main-nav .sub-menu li.current-menu-item > a,
    #main-nav .sub-menu li.current-menu-ancestor > a,
    .main-nav-sidebar:hover span {
      color: ${colors.accent};
    }

    .main-nav-sidebar:hover span {
      background-color: ${colors.accent};
    }

    #main-menu .sub-menu,
    #main-menu .sub-menu a {
      background-color: #ffffff;
      border-color: ${hexToRgba("#000000", 0.05)};
    }

    #main-nav #s {
      background-color: #ffffff;
    }

    .sidebar-alt,
    #featured-links,
    .main-content,
    .featured-slider-area,
    .page-content select,
    .page-content input,
    .page-content textarea {
      background-color: ${colors.contentBackground};
    }

    .page-content,
    .page-content select,
    .page-content input,
    .page-content textarea,
    .page-content .post-author a,
    .page-content .ashe-widget a,
    .page-content .comment-author {
      color: #464646;
    }

    .page-content h1,
    .page-content h2,
    .page-content h3,
    .page-content h4,
    .page-content h5,
    .page-content h6,
    .page-content .post-title a,
    .page-content .author-description h4 a,
    .page-content .related-posts h4 a,
    .page-content .blog-pagination .previous-page a,
    .page-content .blog-pagination .next-page a,
    blockquote,
    .page-content .post-share a {
      color: #030303;
    }

    .page-content .post-title a:hover {
      color: ${hexToRgba("#030303", 0.75)};
    }

    .page-content .post-date,
    .page-content .post-comments,
    .page-content .post-author,
    .page-content [data-layout*="list"] .post-author a,
    .page-content .related-post-date,
    .page-content .comment-meta a,
    .page-content .author-share a,
    .page-content .post-tags a,
    .page-content .tagcloud a,
    .widget_categories li,
    .widget_archive li {
      color: #a1a1a1;
    }

    a,
    .post-categories,
    .page-content .ashe-widget.widget_text a {
      color: ${colors.accent};
    }

    a:not(.header-logo-a):hover {
      color: ${accentHover};
    }

    blockquote {
      border-color: ${colors.accent};
    }

    ::selection {
      color: #ffffff;
      background: ${colors.accent};
    }

    ::-moz-selection {
      color: #ffffff;
      background: ${colors.accent};
    }

    .page-content .post-footer,
    [data-layout*="list"] .blog-grid > li,
    .page-content .author-description,
    .page-content .related-posts,
    .page-content .entry-comments,
    .page-content .ashe-widget li,
    .page-content #wp-calendar,
    .page-content #wp-calendar caption,
    .page-content #wp-calendar tbody td,
    .page-content .widget_nav_menu li a,
    .page-content .tagcloud a,
    .page-content select,
    .page-content input,
    .page-content textarea,
    .widget-title h2:before,
    .widget-title h2:after,
    .post-tags a,
    .gallery-caption,
    .wp-caption-text,
    table tr,
    table th,
    table td,
    pre,
    .category-description {
      border-color: #e8e8e8;
    }

    hr {
      background-color: #e8e8e8;
    }

    .widget_search i,
    .widget_search #searchsubmit,
    .wp-block-search button,
    .single-navigation i,
    .page-content .submit,
    .page-content .blog-pagination.numeric a,
    .page-content .blog-pagination.load-more a,
    .page-content .post-password-form input[type="submit"],
    .page-content .wpcf7 [type="submit"] {
      color: #ffffff;
      background-color: #333333;
    }

    .single-navigation i:hover,
    .page-content .submit:hover,
    .page-content .blog-pagination.numeric a:hover,
    .page-content .blog-pagination.numeric span,
    .page-content .blog-pagination.load-more a:hover,
    .page-content .post-password-form input[type="submit"]:hover,
    .page-content .wpcf7 [type="submit"]:hover {
      color: #ffffff;
      background-color: ${colors.accent};
    }

    .image-overlay,
    #infscr-loading,
    .page-content h4.image-overlay {
      color: #ffffff;
      background-color: ${hexToRgba("#494949", 0.3)};
    }

    .image-overlay a,
    .post-slider .prev-arrow,
    .post-slider .next-arrow,
    .page-content .image-overlay a,
    #featured-slider .slick-arrow,
    #featured-slider .slider-dots {
      color: #ffffff;
    }

    #featured-slider .slick-active {
      background: #ffffff;
    }

    #page-footer,
    #page-footer select,
    #page-footer input,
    #page-footer textarea {
      background-color: ${colors.footerBackground};
      color: #333333;
    }

    #page-footer,
    #page-footer a,
    #page-footer select,
    #page-footer input,
    #page-footer textarea {
      color: #333333;
    }

    #page-footer h1,
    #page-footer h2,
    #page-footer h3,
    #page-footer h4,
    #page-footer h5,
    #page-footer h6 {
      color: #111111;
    }

    #page-footer a:hover {
      color: ${colors.accent};
    }

    #page-footer a,
    #page-footer .ashe-widget li,
    #page-footer #wp-calendar,
    #page-footer #wp-calendar caption,
    #page-footer #wp-calendar tbody td,
    #page-footer .widget_nav_menu li a,
    #page-footer select,
    #page-footer input,
    #page-footer textarea,
    #page-footer .widget-title h2:before,
    #page-footer .widget-title h2:after,
    .footer-widgets {
      border-color: #e0dbdb;
    }

    #page-footer hr {
      background-color: #e0dbdb;
    }

    .boxed-wrapper {
      max-width: ${layout.boxedMaxWidth}px;
    }

    .sidebar-alt {
      max-width: ${layout.sidebarWidth + 70}px;
      left: -${layout.sidebarWidth + 70}px;
      padding: 85px 35px 0px;
    }

    .sidebar-left,
    .sidebar-right {
      width: ${contentSidebarWidth}px;
    }

    .main-container {
      width: ${mainContainerWidth};
      width: ${webkitMainContainerWidth};
    }

    #main-nav > div,
    #featured-links,
    .main-content,
    .page-footer-inner,
    .featured-slider-area.boxed-wrapper {
      padding-left: 40px;
      padding-right: 40px;
    }

    .logo-img {
      max-width: 500px;
    }

    .mini-logo a {
      max-width: ${navigation.miniLogo.width}px;
    }

    ${
      navigation.align === "center"
        ? `
      .main-nav-sidebar {
        position: absolute;
        top: 0px;
        left: 40px;
        z-index: 1;
      }

      .main-nav-icons {
        position: absolute;
        top: 0px;
        right: 40px;
        z-index: 2;
      }

      .mini-logo {
        position: absolute;
        left: auto;
        top: 0;
      }

      .main-nav-sidebar ~ .mini-logo {
        margin-left: 30px;
      }
    `
        : `
      .main-nav-sidebar,
      .mini-logo {
        float: left;
        margin-right: 15px;
      }

      .main-nav-icons {
        float: right;
        margin-left: 15px;
      }
    `
    }

    #featured-links .featured-link {
      margin-right: ${featuredLinksGutter}px;
      width: calc((100% - ${(featuredLinkCount - 1) * featuredLinksGutter}px) / ${featuredLinkCount} - 1px);
      width: -webkit-calc((100% - ${(featuredLinkCount - 1) * featuredLinksGutter}px) / ${featuredLinkCount} - 1px);
    }

    #featured-links .featured-link:last-of-type {
      margin-right: 0;
    }

    .blog-grid > li {
      width: 100%;
      margin-bottom: 30px;
    }

    ${
      hasLeft
        ? `
      .sidebar-left {
        padding-right: 37px;
      }
    `
        : ""
    }

    ${
      hasRight
        ? `
      .sidebar-right {
        padding-left: 37px;
      }
    `
        : ""
    }

    .footer-widgets > .ashe-widget {
      width: 30%;
      margin-right: 5%;
    }

    .footer-widgets > .ashe-widget:nth-child(3n+3) {
      margin-right: 0;
    }

    .footer-widgets > .ashe-widget:nth-child(3n+4) {
      clear: both;
    }

    .copyright-info {
      float: right;
    }

    .footer-socials {
      float: left;
    }

    .header-logo a {
      font-family: "${fontName(typography.logoFamily)}";
    }

    #main-menu li a,
    #mobile-menu li,
    .mobile-menu-btn a {
      font-family: "${fontName(typography.navFamily)}";
    }

    ${listLayoutCss}
    ${dropcapsCss}
    ${navCaseCss}
    ${navItalicCss}
    ${hiddenHeaderTextCss}
    ${responsiveCss}
    ${darkModeCss}
  `;
}
