# Ashe 全局配置说明

全局配置入口是 `src/ashe.config.ts`。这个文件只负责“站点整体默认设置”，文章、页面、相册本身的标题、日期、分类、标签等仍然由 `src/content/` 里的 Markdown frontmatter 决定。

## site

控制站点基础信息和页头：

- `title`：浏览器标题、页头站点名、RSS 标题。
- `description` / `descriptionEn`：站点描述，默认 SEO 文案，页头副标题。
- `url`：正式站点地址，RSS 和站点地图会使用。
- `language`：页面 `<html lang="">` 和日期格式语言。
- `logo`：页头图片 Logo。为空时显示文字标题。
- `headerImage`：页头背景图。
- `headerHeight`：页头背景区域高度，单位 px。
- `headerBackgroundSize`：页头背景图缩放方式，对应 CSS `background-size`。
- `headerBackgroundPosition`：页头背景图位置，对应 CSS `background-position`。
- `headerTextColor`：页头标题和描述颜色，设为 `"blank"` 会隐藏页头文字。
- `showHeaderText`：是否显示页头标题文字。
- `showTagline`：是否显示页头描述。

## navigation

控制顶部导航：

- `enabled`：是否显示顶部导航。
- `align`：导航文字对齐，可用 CSS 文本对齐值，如 `"left"`、`"center"`、`"right"`。
- `showSearch`：是否显示搜索按钮和搜索框。
- `showAltSidebar`：是否显示左侧抽屉侧边栏按钮。
- `mobileButton`：移动端菜单按钮样式，`"icon"` 显示箭头图标，`"text"` 显示文字。
- `mobileText`：`mobileButton` 为 `"text"` 时显示的文字。
- `miniLogo.src` / `miniLogo.width`：导航栏小 Logo 图片和宽度。
- `menu`：导航菜单。支持普通链接、手动子菜单，以及 `childrenSource: "categories"` 自动分类子菜单。

## links.md Links

链接页不再写在全局配置里，改为直接写在 `src/content/pages/links.md` 的 frontmatter 中：

- `title` / `titleEn`：链接页标题。
- `description` / `descriptionEn`：链接页简介。
- `groups`：链接分组，每个链接可配置 `title`、`description`、`href`、`avatar`、`icon`。
- `friendsGroupTitle`：友邻动态页从哪个分组读取带 `feed` 的友链。
- `feedPage`：友邻动态页标题、简介、数量等配置。

`groups` 会直接显示在链接页。带 `feed` 字段的友链还会被友邻动态页读取。

## sidebar

控制普通侧边栏和抽屉侧边栏里的 About 小组件：

- `recentPosts.enabled`：是否显示侧边栏最新文章小组件。
- `about.enabled`：是否显示。
- `about.title`：标题。
- `about.image`：普通侧边栏图片。
- `about.altImage`：抽屉侧边栏图片，留空时使用 `image`。
- `about.imageAlt`：图片替代文本。
- `about.paragraphs`：正文段落。
- `about.translations.en`：英文切换时使用的标题、图片说明和段落。

## social

控制侧边栏社交图标：

- `enabled`：是否显示侧边栏社交小组件。
- `openInNewWindow`：是否新窗口打开。
- `links`：社交链接。`icon` 使用 Font Awesome 类名。

## footer

控制页脚：

- `showScrollTop`：是否显示返回顶部按钮。
- `showCredit`：是否显示 Ashe / WP Royal 主题来源。
- `widgets.showAbout`：是否显示页脚 About。
- `widgets.showLinks`：是否显示页脚站内索引。
- `widgets.showRecentPosts`：是否在页脚显示最新文章。
- `widgets.showTags`：是否在页脚显示标签云。
- `about`：页脚 About 小组件，结构和 `sidebar.about` 类似。
- `links.title` / `links.items`：页脚站内索引标题和链接。
- `copyright`：版权文字，支持 `$year`、`$copy` 和 HTML 链接。
- `runtime.enabled`：是否显示建站时长。
- `runtime.startTime`：建站时间，例如 `"2022/05/10 17:38:00"`。
- `runtime.template`：建站时长显示模板，支持 `$years`、`$days`、`$hours`。
- `runtime.loadingText`：页面刚加载、脚本计算前的占位文字。
- `menu`：页脚站点信息里的链接，如隐私政策、使用条款。

## rss

控制导航栏 RSS 入口和 RSS 元信息：

- `enabled`：是否显示 RSS 图标。
- `path`：RSS 地址，默认对应 `src/pages/rss.xml.ts`。
- `label`：RSS 图标说明文字。

## languageSwitcher

控制导航栏语言切换按钮：

- `enabled`：是否显示语言按钮。
- `current`：当前默认语言。
- `label`：按钮说明。
- `options`：语言列表。当前项目是前端文本切换，不会自动生成独立多语言页面。

## darkMode

控制明暗模式按钮：

- `enabled`：是否显示明暗模式切换。状态保存在浏览器 localStorage。

## comments

控制文章详情页评论。文章页是否显示评论区，还受 `single.showComments` 控制。

- `enabled`：是否启用评论组件。
- `provider`：评论系统，支持 `"twikoo"` 和 `"remark42"`。
- `pathStrategy`：评论路径，`"pathname"` 按文章 URL 区分，`"slug"` 按内容 slug 区分。
- `twikoo.envId`：Twikoo 服务地址或环境 ID。
- `twikoo.cdn`：Twikoo 前端脚本地址。
- `twikoo.lang`：传给 Twikoo 的语言。
- `remark42.host`：Remark42 服务地址。
- `remark42.siteId`：Remark42 后端配置里的 SITE。
- `remark42.theme`：Remark42 主题，`"light"` 或 `"dark"`。
- `remark42.locale`：Remark42 界面语言，例如 `"zh"`、`"en"`。

切换到 Remark42 示例：

```ts
comments: {
  enabled: true,
  provider: "remark42",
  pathStrategy: "pathname",
  remark42: {
    host: "https://remark42.example.com",
    siteId: "remark",
    theme: "light",
    locale: "zh"
  }
}
```

## colors

控制主题核心颜色：

- `accent`：强调色，用于链接、分类、选中状态、悬停状态。
- `contentBackground`：主内容背景色。
- `headerBackground`：页头背景图加载前的兜底色。
- `footerBackground`：页脚背景色。

## layout

控制整体宽度和文章列表布局：

- `headerWidth`：页头导航宽度模式。
- `sliderWidth`：首页轮播宽度模式。
- `linksWidth`：特色链接宽度模式。
- `contentWidth`：列表页、页面内容区宽度模式。
- `singleWidth`：文章详情页宽度模式。
- `footerWidth`：页脚宽度模式。
- `homeLayout`：首页、普通页面、文章页使用的主布局。`col1-*` 是卡片式，`list-*` 是列表式，`lsidebar` / `rsidebar` 控制侧边栏位置。
- `sidebarWidth`：普通侧边栏宽度。
- `sidebarSticky`：是否输出侧边栏吸附状态。
- `boxedMaxWidth`：boxed 容器最大宽度。

## typography

控制基础字体样式：

- `logoFamily`：页头 Logo 文字字体。
- `navFamily`：导航字体。
- `navItalic`：导航是否斜体。
- `navUppercase`：导航是否大写。

## featuredSlider

控制首页轮播：

- `enabled`：是否显示轮播。
- `location`：轮播在首页的位置，`"top"` 在特色链接前，`"before-posts"` 在文章列表前，`"after-posts"` 在文章列表后。
- `amount`：显示几篇文章。
- `requireImages`：是否只选有封面图的文章。
- `navigation`：是否显示左右箭头。
- `pagination`：是否显示圆点。
- `autoplay`：是否自动轮播。
- `intervalMs`：自动轮播间隔。

## featuredLinks

控制首页特色链接区：

- `enabled`：是否显示。
- `items`：特色入口。每项需要 `title`、`href`、`image`，没有图片不会显示。

## blog

控制文章列表卡片：

- `postPathPrefix`：文章详情页路径前缀。
- `postDescription`：列表摘要来源，`"excerpt"` 使用摘要，`"content"` 使用正文，`"none"` 不显示摘要。
- `excerptWords`：摘要长度。
- `pagination.enabled`：是否分页。
- `pagination.perPage`：每页文章数。
- `showCategories`：列表卡片是否显示分类。
- `showDate`：列表卡片是否显示日期。
- `showDropcaps`：是否启用首字下沉。
- `showAuthor`：列表卡片是否显示作者。

## single

控制文章详情页：

- `showFeaturedImage`：是否显示文章封面。
- `showCategories`：是否显示分类。
- `showDate`：是否显示日期。
- `showAuthor`：是否显示作者。
- `showComments`：是否显示评论区。
- `showAuthorDescription`：是否显示作者介绍。

## responsive

控制小屏显示：

- `featuredSlider`：为 `false` 时，小屏隐藏轮播。
- `featuredLinks`：为 `false` 时，小屏隐藏特色链接。
- `relatedPosts`：为 `false` 时，小屏隐藏相关文章。
- `sidebar`：为 `false` 时，小屏隐藏普通左右侧边栏，抽屉侧边栏不受影响。

## 已清理的无效配置

- `navigation.simpleHeader`：没有组件读取，设置后不会变化。
- `navigation.mobileIcon`：实际只判断是否显示箭头，已改为更明确的 `mobileButton`。
- `blog.showComments`：列表卡片没有评论数量显示功能，因此这个开关不会产生效果。
- `blog.relatedOrderBy` / `single.relatedOrderBy`：相关文章排序当前固定由代码计算，没有读取这两个字段。
- `featuredSlider.location: "both"`：当前首页只渲染一个轮播，已改为 `"top"` / `"before-posts"` / `"after-posts"`。
