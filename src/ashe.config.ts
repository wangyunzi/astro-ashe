import { asheRuntimeConfig } from "./ashe.runtime-config.mjs";

export type WidthMode = "boxed" | "contained" | "full";
export type HomeLayout =
  | "col1-fullwidth"
  | "col1-lsidebar"
  | "col1-rsidebar"
  | "list-fullwidth"
  | "list-lsidebar"
  | "list-rsidebar";
export type FeaturedSliderLocation = "top" | "before-posts" | "after-posts";
export type MobileMenuButton = "icon" | "text";
export type CommentProvider = "twikoo" | "remark42";
export type CommentPathStrategy = "pathname" | "slug";
export type Remark42Theme = "light" | "dark";

export type MenuItem = {
  label: string;
  href: string;
  i18nKey?: string;
  childrenSource?: "categories";
  children?: MenuItem[];
};

export type SocialLink = {
  label: string;
  icon: string;
  url: string;
};

export type LanguageOption = {
  label: string;
  locale: string;
  href: string;
};

export type FeaturedLinkItem = {
  title: string;
  href: string;
  image: string;
};

export type FriendsFeedConfig = {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  path: string;
  limit: number;
};

export type PageTextConfig = {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
};

export const asheConfig = {
  site: {
    // 用于浏览器标题、页头 Logo 文本、订阅源元信息和默认 SEO 文案。
    title: "RAE",

    // `showTagline` 为 true 时显示在页头大标题下方。
    description: "此行山高路远，我只剩口袋玫瑰一片。",
    descriptionEn: "The road is long and rough, and I only have a pocket rose left.",

    // 部署前改成你的正式站点域名。
    url: asheRuntimeConfig.siteUrl,

    // Astro 会把它渲染到根元素 <html lang="">。
    language: "zh-CN",

    // 可选图片 Logo。留空时使用 Ashe 的文字 Logo 样式。
    logo: "",

    // 浏览器标签页和收藏夹图标。
    favicon: "https://blog.wangyunzi.com/avatar.png",

    // 页头背景图路径。
    headerImage: "/ashe/assets/images/ashe_bg.png",

    // 页头背景区域高度，单位 px。
    headerHeight: 500,

    // 页头背景图缩放方式，对应 CSS background-size。
    headerBackgroundSize: "cover",

    // 页头背景图位置，对应 CSS background-position。
    headerBackgroundPosition: "center center",

    // 对应 WordPress 的页头文字颜色设置。使用 "blank" 可以隐藏文字。
    headerTextColor: "#111111",

    // 控制是否显示页头文字。为 false 时只保留背景图。
    showHeaderText: true,

    // 控制 Logo 或标题下方的简介文字是否显示。
    showTagline: true
  },

  navigation: {
    enabled: true,
    align: "center",
    showSearch: true,
    showAltSidebar: true,
    mobileButton: "icon" as MobileMenuButton,
    mobileText: "菜单",

    // 导航栏中的可选小 Logo。src 留空时不显示。
    miniLogo: {
      src: "",
      width: 70
    },

    menu: [
      { label: "首页", href: "/", i18nKey: "nav.home" },
      //{
      //  label: "专题",
      //  href: "/category/lifestyle/",
       // i18nKey: "nav.features",
      //  children: [
      //    { label: "生活方式", href: "/category/lifestyle/", i18nKey: "nav.lifestyle" },
      //    { label: "旅行", href: "/category/travel/", i18nKey: "nav.travel" },
      //    { label: "美食", href: "/category/food/", i18nKey: "nav.food" }
      //  ]
      //},
      // {
      //   label: "分类",
      //   href: "/category/lifestyle/",
      //   i18nKey: "nav.categories",
      //   childrenSource: "categories"
      // },
      // { label: "归档", href: "/archives/", i18nKey: "nav.archives" },
      { label: "相册", href: "/gallery/", i18nKey: "nav.gallery" },
      { label: "关于", href: "/about/", i18nKey: "nav.about" },
      // { label: "瞬间", href: "/memos/", i18nKey: "nav.memos" },         
    ] satisfies MenuItem[]
  },

  sidebar: {
    recentPosts: {
      // 是否显示侧边栏里的最新文章小组件。
      enabled: false,
    },

    about: {
      // 是否显示侧边栏里的 About 小组件。
      enabled: false,

      // 普通侧边栏和抽屉侧边栏使用的标题。
      title: "关于我",

      // 普通侧边栏使用的图片。
      image: "/image.png",

      // 抽屉侧边栏使用的图片。留空时会回退到 image。
      altImage: "/image.png",

      // About 图片的替代文本。
      imageAlt: "此行山高路远，我只剩口袋玫瑰一片。",

      // About 正文。每个字符串会渲染为一个段落。
      paragraphs: [
        "此行山高路远，我只剩口袋玫瑰一片。"
      ] satisfies string[],

      // 可选英文文案。切换到英文时，侧边栏 About 会优先使用这里的内容。
      translations: {
        en: {
          title: "About Me",
          imageAlt: "Sidebar about me image",
          paragraphs: [
            "Write your bio, interests, or contact details here."
          ]
        }
      }
    }
  },

  social: {
    // 是否显示侧边栏社交小组件。
    enabled: false,

    // 是否在新窗口打开社交链接。
    openInNewWindow: true,
    links: [
      // { label: "Weibo", icon: "fa-brands fa-weibo", url: "#" },
      //{ label: "Weixin", icon: "fa-brands fa-weixin", url: "#" },
      // { label: "QQ", icon: "fa-brands fa-qq", url: "#" },
      // { label: "Bilibili", icon: "fa-brands fa-bilibili", url: "#" },
      // { label: "Telegram", icon: "fa-brands fa-telegram", url: "#" },
      //{ label: "Facebook", icon: "fa-brands fa-facebook-f", url: "#" },
      // { label: "Mastodon", icon: "fa-brands fa-mastodon", url: "#" },
      // { label: "X", icon: "fa-brands fa-x-twitter", url: "#" },
      //{ label: "Instagram", icon: "fa-brands fa-instagram", url: "#" },
      //{ label: "Pinterest", icon: "fa-brands fa-pinterest-p", url: "#" }
    ] satisfies SocialLink[]
  },

  footer: {
    showScrollTop: true,

    widgets: {
      // 是否显示页脚里的 About、链接、最新文章、标签小组件。
      showAbout: true,
      showLinks: true,
      showRecentPosts: false,
      showTags: false
    },

    about: {
      // 是否显示页脚里的 About 小组件。这里与 sidebar.about 独立配置。
      enabled: true,

      // 页脚小组件使用的标题。
      title: "关于 RAE",

      // 页脚小组件使用的图片。
      image: "/ashe/assets/images/rae.jpeg",

      // 页脚 About 图片的替代文本。
      imageAlt: "RAE",

      // 页脚 About 正文。每个字符串会渲染为一个段落。
      paragraphs: [
        "不知道说什么了，就这样吧。"
      ] satisfies string[],

      // 可选英文文案。切换到英文时，页脚 About 会优先使用这里的内容。
      translations: {
        en: {
          title: "About Ashe",
          imageAlt: "Ashe blog preview",
          paragraphs: [
            "This footer About Ashe block can describe the theme, site, or copyright details separately."
          ]
        }
      }
    },

    links: {
      // 页脚链接小组件，适合放常用页面、友链入口或订阅入口。
      title: "站内索引",
      items: [
        { label: "旧文", href: "/archives/", i18nKey: "nav.archives" },
        { label: "影像", href: "/gallery/", i18nKey: "nav.gallery" },
        { label: "好友", href: "/friends/", i18nKey: "nav.friendLinks" },
        { label: "友邻", href: "/links/", i18nKey: "nav.friendsFeed" },
        { label: "片刻", href: "/memos/", i18nKey: "nav.memos" },
        { label: "关于", href: "/about/", i18nKey: "nav.about" }
      ] satisfies MenuItem[]
    },

    // `$year` 和 `$copy` 会在渲染时替换为年份和版权符号，支持 HTML 链接。
    copyright:
      '$copy $year Ashe Astro。保留所有权利。Ashe 主题由 <a href="https://wp-royal-themes.com/">WP Royal</a> 提供，Astro 移植版。',

    runtime: {
      // 是否显示建站时长。
      enabled: true,

      // 建站时间。建议保留 YYYY/MM/DD HH:mm:ss 格式，浏览器兼容性更稳定。
      startTime: "2022/05/10 17:38:00",

      // 显示模板。支持 $years、$days、$hours 三个占位符。
      template: "小破站在风雨中飘摇了 $years 年 $days 天 $hours 小时",

      // 页面刚加载、脚本还未完成计算时显示的文字。
      loadingText: "正在计算..."
    },

    menu: [
      { label: "隐私政策", href: "/privacy/", i18nKey: "footer.privacy" },
      { label: "使用条款", href: "/terms/", i18nKey: "footer.terms" }
    ] satisfies MenuItem[]
  },

  rss: {
    // 是否在导航搜索按钮旁显示 RSS 订阅入口。
    enabled: true,

    // RSS 静态端点地址，对应 src/pages/rss.xml.ts。
    path: "/rss.xml",

    // RSS 图标链接的无障碍说明。
    label: "RSS 订阅"
  },

  languageSwitcher: {
    // 是否在导航栏显示语言切换按钮。
    enabled: true,

    // 当前语言代码，用于高亮下拉菜单中的当前项。
    current: "zh-CN",

    // 语言切换按钮和下拉菜单的无障碍说明。
    label: "切换语言",

    // 语言选项。href 可以指向实际语言路由，也可以先使用带查询参数的占位地址。
    options: [
      { label: "简体中文", locale: "zh-CN", href: "?lang=zh-CN" },
      { label: "English", locale: "en", href: "?lang=en" }
    ] satisfies LanguageOption[]
  },

  darkMode: {
    // 是否启用导航栏中的明暗模式切换按钮，状态会存入 localStorage 的 `asheDarkMode`。
    enabled: true
  },

  comments: {
    // 评论系统开关。provider 可在 twikoo 和 remark42 之间切换。
    enabled: true,
    provider: "twikoo" as CommentProvider,

    // pathname 按文章 URL 区分评论，slug 按内容 slug 区分评论。
    pathStrategy: "pathname" as CommentPathStrategy,

    twikoo: {
      // Twikoo 服务地址或环境 ID。
      envId: "https://twikoo.wangyunzi.com",

      // Twikoo 客户端脚本地址，可以固定版本或改为自托管地址。
      cdn: "https://cdn.jsdelivr.net/npm/twikoo@1.7.9/dist/twikoo.min.js",

      // 传给 twikoo.init() 的语言参数。
      lang: "zh-CN"
    },

    remark42: {
      // Remark42 服务地址，例如 https://remark42.example.com。留空时不加载。
      host: "",
      siteId: "remark",
      theme: "light" as Remark42Theme,
      locale: "zh",
      maxShownComments: 15,
      showEmailSubscription: true,
      showRssSubscription: true,
      simpleView: false,
      noFooter: false
    }
  },

  pages: {
    archives: {
      title: "归档",
      titleEn: "Archives",
      description: "按年份浏览所有文章",
      descriptionEn: "Browse all posts by year.",
      perPage: 3
    },
    search: {
      title: "搜索",
      titleEn: "Search",
      description: "按标题、分类、标签或摘要搜索文章。",
      descriptionEn: "Search posts by title, category, tag, or excerpt."
    } satisfies PageTextConfig,
    gallery: {
      title: "相册",
      titleEn: "Gallery",
      description: "照片相簿集合",
      descriptionEn: "Photo album collection",
      intro:
        "光影、四季、街巷与寻常日子，都被安静地收在这里，作为生活曾经经过的痕迹。",
      introEn:
        "Light, seasons, streets, and ordinary days are kept here as quiet proof that life once passed by beautifully."
    },
    contact: {
      title: "联系",
      titleEn: "Contact",
      description: "联系页面",
      descriptionEn: "Contact page",
      intro: "在这里添加你的联系方式，或替换为你偏好的 Astro 表单集成方案。",
      introEn: "Add your contact details here, or replace this with the Astro form integration you prefer.",
      note: "下方表单控件会复用 Ashe 已有的输入框和文本域样式。",
      noteEn: "The form controls below reuse Ashe's existing input and textarea styles."
    },
    notFound: {
      title: "404",
      titleEn: "404",
      description: "页面不存在",
      descriptionEn: "Page not found"
    } satisfies PageTextConfig
  },

  author: {
    // 文章作者没有单独头像时使用的默认头像。
    fallbackAvatar: "/ashe/assets/images/img12.jpg",

    // 作者简介组件没有单独 bio 时使用的默认文案。
    fallbackBio: "这个作者负责维护 Ashe Astro 版本中的内容与编辑说明。",
    fallbackBioEn: "This author maintains the content and editorial notes in the Ashe Astro version."
  },

  assets: {
    // Twikoo 评论输入框右下角装饰图。留空可隐藏。
    commentTextareaImage: "/ashe/assets/images/comment-withered-lotus.svg",

    // 相册图片懒加载时的占位图。留空可隐藏。
    galleryPlaceholderImage: "/ashe/assets/images/gallery-placeholder.svg"
  },

  colors: {
    // 主题强调色。链接、分类、选中文本和悬停状态会使用它。
    accent: "#ca9b52",

    // 主内容区背景色。保留白色会更接近原 Ashe 免费主题。
    contentBackground: "#ffffff",

    // 页头图片区域的兜底背景色。
    headerBackground: "#ffffff",

    // 页脚背景色。
    footerBackground: "#f6f6f6"
  },

  layout: {
    // 宽度模式：boxed、contained 或 full。
    headerWidth: "contained" as WidthMode,
    sliderWidth: "boxed" as WidthMode,
    linksWidth: "boxed" as WidthMode,
    contentWidth: "boxed" as WidthMode,
    singleWidth: "boxed" as WidthMode,
    footerWidth: "contained" as WidthMode,

    // 首页文章列表布局。`list-*` 会切换为列表样式。
    homeLayout: "col1-rsidebar" as HomeLayout,

    // 普通侧边栏宽度，单位 px。抽屉侧边栏会额外加上 Ashe 的 70px 内边距。
    sidebarWidth: 270,

    // 是否输出侧边栏吸附状态的数据属性，方便后续接入脚本。
    sidebarSticky: true,

    // Ashe 原始 boxed 容器最大宽度。
    boxedMaxWidth: 1160
  },

  typography: {
    // Google Fonts 样式地址。若改用系统字体，可以留空。
    googleFontsHref:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Playfair+Display:wght@400;700&family=Kalam:wght@400;700&family=Rokkitt:wght@400;600&display=swap",

    bodyFamily: "Open Sans",
    headingFamily: "Playfair Display",

    // 支持普通 CSS 字体名。Google Fonts 在 BaseLayout 中引入。
    logoFamily: "Open Sans",
    navFamily: "Open Sans",

    // 导航文字样式开关。
    navItalic: false,
    navUppercase: true
  },

  featuredSlider: {
    enabled: true,

    // 首页轮播图位置：top 在特色链接前，before-posts 在文章列表前，after-posts 在文章列表后。
    location: "top" as FeaturedSliderLocation,
    amount: 3,
    requireImages: true,
    navigation: true,
    pagination: true,
    autoplay: true,
    intervalMs: 5200
  },

  featuredLinks: {
    // 是否显示特色链接区。
    enabled: true,
    items: [
      // { title: "旧文", href: "/archives/", image: "/ashe/assets/images/img1.jpg" },
      // { title: "影像", href: "/gallery/", image: "/ashe/assets/images/img2.jpg" },
      // { title: "友邻", href: "/links/", image: "/ashe/assets/images/img3.jpg" }
    ] satisfies FeaturedLinkItem[]
  },

  friendsFeed: {
    // 好友动态页配置，对应 /links/ 页面。
    title: "好友动态",
    titleEn: "Friends Feed",
    description: "通过 RSS 聚合好友博客的最新更新。",
    descriptionEn: "A live RSS-powered stream of updates from friendly blogs.",
    path: "/links/",

    // 页面展示的动态数量；RSS 缓存总量在 scripts/update-friends-feed-cache.mjs 中控制。
    limit: 8
  } satisfies FriendsFeedConfig,

  feeds: {
    // 抓取友邻 RSS 时使用的 User-Agent，默认会带上站点地址。
    cacheUserAgent: asheRuntimeConfig.feeds.cacheUserAgent,
    discoveryUserAgent: asheRuntimeConfig.feeds.discoveryUserAgent
  },

  blog: {
    // 文章详情页路径前缀。"/" 为 /slug/，"/posts/" 为 /posts/slug/，"/archives/" 为 /archives/slug/。
    postPathPrefix: "/posts/",
    postDescription: "excerpt" as "excerpt" | "content" | "none",
    excerptWords: 45,
    pagination: {
      // 是否启用首页、分类、标签、作者文章列表分页。搜索页保持全量文章用于前端搜索。
      enabled: true,

      // 每页显示的文章数量。
      perPage: 5
    },
    showCategories: true,
    showDate: true,
    showDropcaps: false,
    showAuthor: false
  },

  single: {
    showFeaturedImage: true,
    showCategories: true,
    showDate: true,
    showAuthor: false,
    showComments: true,
    showAuthorDescription: false
  },

  responsive: {
    // 为 false 时，对应模块会在小屏幕隐藏。
    featuredSlider: true,
    featuredLinks: false,
    relatedPosts: false,

    // 是否在小屏幕继续显示普通左右侧边栏。导航抽屉侧边栏不受此项影响。
    sidebar: false
  },

} as const;
