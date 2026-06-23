export type WidthMode = "boxed" | "contained" | "full";
export type HomeLayout =
  | "col1-fullwidth"
  | "col1-lsidebar"
  | "col1-rsidebar"
  | "list-fullwidth"
  | "list-lsidebar"
  | "list-rsidebar";

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

export type LinkItem = {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  href: string;
  avatar?: string;
  icon?: string;
};

export type LinkGroup = {
  title: string;
  titleEn?: string;
  items: LinkItem[];
};

export const asheConfig = {
  site: {
    // 用于浏览器标题、页头 Logo 文本、订阅源元信息和默认 SEO 文案。
    title: "长街短梦",

    // `showTagline` 为 true 时显示在页头大标题下方。
    description: "此行山高路远，我只剩口袋玫瑰一片。",
    descriptionEn: "The road is long and rough, and I only have a pocket rose left.",

    // 部署前改成你的正式站点域名。
    url: "https://asky.0tz.top",

    // Astro 会把它渲染到根元素 <html lang="">。
    language: "zh-CN",

    // 可选图片 Logo。留空时使用 Ashe 的文字 Logo 样式。
    logo: "",

    // 页头背景图路径。
    headerImage: "/ashe/assets/images/ashe_bg.jpg",

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
    simpleHeader: false,
    mobileIcon: "chevron-down",
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
      // { label: "链接", href: "/links/", i18nKey: "nav.links" },    
      { label: "关于", href: "/about/", i18nKey: "nav.about" },
      // { label: "瞬间", href: "/memos/", i18nKey: "nav.memos" },         
    ] satisfies MenuItem[]
  },

  linksPage: {
    // 链接页面的标题和简介。
    title: "链接",
    titleEn: "Links",
    description: "整理常用资源、友链和项目入口。",
    descriptionEn: "A curated list of useful resources, friends, and project links.",

    // 链接分组。新增或删除链接只需要修改这里。
    groups: [
      {
        title: "推荐资源",
        titleEn: "Recommended",
        items: [
          {
            title: "Astro",
            titleEn: "Astro",
            description: "用于构建内容驱动网站的现代静态站点框架。",
            descriptionEn: "A modern static site framework for content-driven websites.",
            href: "https://astro.build/",
            icon: "fa-solid fa-rocket"
          },
          {
            title: "Twikoo",
            titleEn: "Twikoo",
            description: "轻量、可自部署的静态站点评论系统。",
            descriptionEn: "A lightweight, self-hostable comment system for static sites.",
            href: "https://twikoo.js.org/",
            icon: "fa-regular fa-comments"
          }
        ]
      },
      {
        title: "友情链接",
        titleEn: "Friends",
        items: [
          {
            title: "老孙博客",
            titleEn: "Old Sun's Blog",
            description: "资深网民。",
            descriptionEn: "Replace this with your friends, projects, or favorite sites.",
            href: "https://www.imsun.org/",
            avatar: "https://img.imsun.org/avatar.jpg",
            icon: "fa-solid fa-link"
          }
        ]
      }
    ] satisfies LinkGroup[]
  },

  sidebar: {
    about: {
      // 是否显示侧边栏里的 About 小组件。
      enabled: true,

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
    // 是否在新窗口打开社交链接。
    openInNewWindow: true,
    links: [
      { label: "Weibo", icon: "fa-brands fa-weibo", url: "#" },
      //{ label: "Weixin", icon: "fa-brands fa-weixin", url: "#" },
      { label: "QQ", icon: "fa-brands fa-qq", url: "#" },
      { label: "Bilibili", icon: "fa-brands fa-bilibili", url: "#" },
      { label: "Telegram", icon: "fa-brands fa-telegram", url: "#" },
      //{ label: "Facebook", icon: "fa-brands fa-facebook-f", url: "#" },
      { label: "Mastodon", icon: "fa-brands fa-mastodon", url: "#" },
      //{ label: "X", icon: "fa-brands fa-x-twitter", url: "#" },
      //{ label: "Instagram", icon: "fa-brands fa-instagram", url: "#" },
      //{ label: "Pinterest", icon: "fa-brands fa-pinterest-p", url: "#" }
    ] satisfies SocialLink[]
  },

  footer: {
    showScrollTop: true,
    showCredit: true,

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
      title: "关于 Ashe",

      // 页脚小组件使用的图片。
      image: "/ashe/assets/images/img11.jpg",

      // 页脚 About 图片的替代文本。
      imageAlt: "Ashe 博客预览图",

      // 页脚 About 正文。每个字符串会渲染为一个段落。
      paragraphs: [
        "这是页脚的 About Ashe 内容，可单独介绍主题、站点或版权信息。"
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
        { label: "旧文", href: "/archives/"},
        { label: "影像", href: "/gallery/"},
        { label: "友邻", href: "/links/"},
        { label: "片刻", href: "/memos/"},
        { label: "关于", href: "/about/"}
      ] satisfies MenuItem[]
    },

    // `$year` 和 `$copy` 会在渲染时替换为年份和版权符号。
    copyright: "$copy $year Ashe Astro。保留所有权利。",
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
    // Twikoo 客户端评论。envId 填你的 Twikoo 服务地址或环境 ID。
    enabled: true,
    provider: "twikoo",
    envId: "https://twikoo.wangyunzi.com",

    // Twikoo 客户端 CDN 地址，可以固定版本或改为自托管地址。
    cdn: "https://cdn.jsdelivr.net/npm/twikoo@1.7.9/dist/twikoo.min.js",

    // 通常保持 pathname，让评论和生成后的 Astro 路由一一对应。
    pathStrategy: "pathname" as "pathname" | "slug",

    // 传给 twikoo.init() 的语言参数。
    lang: "zh-CN"
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
    // 支持普通 CSS 字体名。Google Fonts 在 BaseLayout 中引入。
    logoFamily: "Open Sans",
    navFamily: "Open Sans",

    // 导航文字样式开关。
    navItalic: false,
    navUppercase: true
  },

  featuredSlider: {
    enabled: true,

    // 轮播图位置设置。当前 Astro 版本会在首页渲染。
    location: "both",
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
        // { label: "旧文", href: "/archives/"},
        // { label: "影像", href: "/gallery/"},
        // { label: "友邻", href: "/links/"},
        // { label: "片刻", href: "/memos/"},
        // { label: "关于", href: "/about/"}
      ] 
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
    showComments: true,
    showDropcaps: false,
    showAuthor: false,
    relatedOrderBy: "related"
  },

  single: {
    showFeaturedImage: true,
    showCategories: true,
    showDate: true,
    showAuthor: true,
    showComments: true,
    showAuthorDescription: false,
    relatedOrderBy: "related"
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
