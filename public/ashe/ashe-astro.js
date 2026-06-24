(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function setDisplay(element, value) {
    if (element) {
      element.style.display = value;
    }
  }

  var DEFAULT_LANGUAGE = "zh-CN";
  var TRANSLATIONS = {
    "zh-CN": {
      "nav.home": "首页",
      "nav.features": "专题",
      "nav.lifestyle": "生活方式",
      "nav.travel": "旅行",
      "nav.food": "美食",
      "nav.categories": "分类",
      "nav.links": "链接",
      "nav.friendLinks": "好友",
      "nav.friends": "友邻动态",
      "nav.friendsFeed": "友邻",
      "nav.gallery": "相册",
      "nav.archives": "归档",
      "nav.memos": "片刻",
      "nav.about": "关于",
      "rss.label": "RSS 订阅",
      "language.label": "切换语言",
      "ui.openSidebar": "打开侧边栏",
      "ui.closeSidebar": "关闭侧边栏",
      "ui.toggleDarkMode": "切换明暗模式",
      "ui.search": "搜索",
      "ui.searchPlaceholder": "搜索...",
      "ui.mainMenu": "主菜单",
      "ui.mobileMenu": "移动端菜单",
      "ui.mobileMenuButton": "菜单",
      "ui.footerMenu": "页脚菜单",
      "sidebar.follow": "关注我",
      "sidebar.recentPosts": "最新文章",
      "sidebar.categories": "分类",
      "sidebar.tags": "标签",
      "post.comments": "评论",
      "post.readMore": "阅读更多",
      "post.authorLabel": "作者：",
      "post.related": "你可能也喜欢",
      "blog.noResultsTitle": "没有找到内容",
      "blog.noResultsText": "没有文章匹配当前搜索条件。",
      "search.inputPlaceholder": "搜索文章...",
      "contact.name": "姓名",
      "contact.email": "邮箱",
      "contact.message": "留言",
      "contact.send": "发送",
      "comments.loading": "评论加载中...",
      "error.notFoundText": "你访问的页面不存在。",
      "gallery.noAlbumsTitle": "没有找到相册",
      "gallery.noAlbumsText": "在 src/content/albums 中添加 Markdown 相册后，会显示在这里。",
      "gallery.noPhotosTitle": "这个相簿还没有图片",
      "gallery.noPhotosText": "请在相册 Markdown 文件中使用图片语法添加照片。",
      "footer.privacy": "隐私政策",
      "footer.terms": "使用条款",
      "footer.siteIndex": "站内索引",
      "footer.siteInfo": "站点信息",
      "footer.creditBefore": "Ashe 主题由",
      "footer.creditAfter": "提供。Astro 移植版。"
    },
    en: {
      "nav.home": "Home",
      "nav.features": "Features",
      "nav.lifestyle": "Lifestyle",
      "nav.travel": "Travel",
      "nav.food": "Food",
      "nav.categories": "Categories",
      "nav.links": "Links",
      "nav.friendLinks": "Friends",
      "nav.friends": "Friends Feed",
      "nav.friendsFeed": "Friends Feed",
      "nav.gallery": "Gallery",
      "nav.archives": "Archives",
      "nav.memos": "Memos",
      "nav.about": "About",
      "rss.label": "RSS Feed",
      "language.label": "Switch language",
      "ui.openSidebar": "Open sidebar",
      "ui.closeSidebar": "Close sidebar",
      "ui.toggleDarkMode": "Toggle dark mode",
      "ui.search": "Search",
      "ui.searchPlaceholder": "Search...",
      "ui.mainMenu": "Main menu",
      "ui.mobileMenu": "Mobile menu",
      "ui.mobileMenuButton": "Menu",
      "ui.footerMenu": "Footer menu",
      "sidebar.follow": "Follow Me",
      "sidebar.recentPosts": "Recent Posts",
      "sidebar.categories": "Categories",
      "sidebar.tags": "Tags",
      "post.comments": "Comments",
      "post.readMore": "Read More",
      "post.authorLabel": "By ",
      "post.related": "You May Also Like",
      "blog.noResultsTitle": "Nothing Found",
      "blog.noResultsText": "No posts match the current search.",
      "search.inputPlaceholder": "Search posts...",
      "contact.name": "Name",
      "contact.email": "Email",
      "contact.message": "Message",
      "contact.send": "Send",
      "comments.loading": "Loading comments...",
      "error.notFoundText": "The page you requested does not exist.",
      "gallery.noAlbumsTitle": "No Albums Found",
      "gallery.noAlbumsText": "Add Markdown albums in src/content/albums to show them here.",
      "gallery.noPhotosTitle": "This Album Has No Photos Yet",
      "gallery.noPhotosText": "Add photos with Markdown image syntax in the album file.",
      "footer.privacy": "Privacy Policy",
      "footer.terms": "Terms of Use",
      "footer.siteIndex": "Site Index",
      "footer.siteInfo": "Site Info",
      "footer.creditBefore": "Ashe theme by",
      "footer.creditAfter": "Astro port."
    }
  };

  function normalizeLanguage(language) {
    if (!language) return "";

    var normalized = String(language).toLowerCase();
    if (normalized === "en" || normalized.indexOf("en-") === 0) {
      return "en";
    }

    if (normalized === "zh" || normalized === "zh-cn" || normalized === "cn") {
      return "zh-CN";
    }

    return TRANSLATIONS[language] ? language : "";
  }

  function getStoredLanguage() {
    try {
      return normalizeLanguage(window.localStorage.getItem("asheLanguage"));
    } catch (error) {
      return "";
    }
  }

  function getRequestedLanguage(defaultLanguage) {
    var queryLanguage = "";

    try {
      queryLanguage = normalizeLanguage(new URLSearchParams(window.location.search).get("lang"));
    } catch (error) {
      queryLanguage = "";
    }

    return queryLanguage || getStoredLanguage() || normalizeLanguage(defaultLanguage) || DEFAULT_LANGUAGE;
  }

  function storeLanguage(language) {
    try {
      window.localStorage.setItem("asheLanguage", language);
    } catch (error) {
      // localStorage can be unavailable in strict privacy contexts.
    }
  }

  function translate(key, language) {
    return (
      (TRANSLATIONS[language] && TRANSLATIONS[language][key]) ||
      (TRANSLATIONS[DEFAULT_LANGUAGE] && TRANSLATIONS[DEFAULT_LANGUAGE][key]) ||
      ""
    );
  }

  function localizedAttribute(element, prefix, language) {
    return element.getAttribute(prefix + language.toLowerCase());
  }

  function originalAttributeName(name) {
    return "data-i18n-original-" + name;
  }

  function rememberOriginal(element, name, value) {
    var attributeName = originalAttributeName(name);
    if (!element.hasAttribute(attributeName)) {
      element.setAttribute(attributeName, value || "");
    }

    return element.getAttribute(attributeName) || "";
  }

  function applyContentTranslations(language) {
    document
      .querySelectorAll("[data-i18n], [data-i18n-en], [data-i18n-zh-cn]")
      .forEach(function (element) {
        if (element.hasAttribute("data-i18n-html") || element.hasAttribute("data-i18n-html-en")) {
          return;
        }

        var key = element.getAttribute("data-i18n");
        var original = rememberOriginal(element, "text", element.textContent);
        var localized = localizedAttribute(element, "data-i18n-", language);
        var value = localized || (key ? translate(key, language) : "");

        if (!value && language === DEFAULT_LANGUAGE) {
          value = original;
        }

        if (value) {
          element.textContent = value;
        }
      });

    document
      .querySelectorAll("[data-i18n-html], [data-i18n-html-en], [data-i18n-html-zh-cn]")
      .forEach(function (element) {
        var key = element.getAttribute("data-i18n-html");
        var original = rememberOriginal(element, "html", element.innerHTML);
        var localized = localizedAttribute(element, "data-i18n-html-", language);
        var value = localized || (key ? translate(key, language) : "");

        if (!value && language === DEFAULT_LANGUAGE) {
          value = original;
        }

        if (value) {
          element.innerHTML = value;
        }
      });
  }

  function applyAttributeTranslations(language, attributeName, dataAttributeName) {
    var selector =
      "[" +
      dataAttributeName +
      "], [" +
      dataAttributeName +
      "-en], [" +
      dataAttributeName +
      "-zh-cn]";

    document.querySelectorAll(selector).forEach(function (element) {
      var key = element.getAttribute(dataAttributeName);
      var original = rememberOriginal(element, attributeName, element.getAttribute(attributeName) || "");
      var localized = localizedAttribute(element, dataAttributeName + "-", language);
      var value = localized || (key ? translate(key, language) : "");

      if (!value && language === DEFAULT_LANGUAGE) {
        value = original;
      }

      if (value) {
        element.setAttribute(attributeName, value);
      }
    });
  }

  function applyDateTranslations(language) {
    var formatter = new Intl.DateTimeFormat(language, {
      month: "long",
      day: "numeric",
      year: "numeric"
    });

    document.querySelectorAll("[data-i18n-date][datetime]").forEach(function (element) {
      var date = new Date(element.getAttribute("datetime"));
      if (Number.isNaN(date.getTime())) return;

      element.textContent = formatter.format(date);
    });
  }

  function languageUrl(language) {
    var url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    return url.pathname + url.search + url.hash;
  }

  function updateLanguageSwitcher(language) {
    document.querySelectorAll("[data-language-switcher]").forEach(function (switcher) {
      switcher.querySelectorAll("[data-language-option]").forEach(function (option) {
        var optionLanguage = normalizeLanguage(option.getAttribute("data-language-option"));
        var isCurrent = optionLanguage === language;

        option.setAttribute("href", languageUrl(optionLanguage || DEFAULT_LANGUAGE));
        option.setAttribute("aria-current", isCurrent ? "true" : "false");
      });
    });
  }

  function applyTranslations(language) {
    var normalized = normalizeLanguage(language) || DEFAULT_LANGUAGE;

    document.documentElement.setAttribute("lang", normalized);
    if (document.body) {
      document.body.setAttribute("data-language", normalized);
    }

    storeLanguage(normalized);
    applyContentTranslations(normalized);
    applyAttributeTranslations(normalized, "placeholder", "data-i18n-placeholder");
    applyAttributeTranslations(normalized, "aria-label", "data-i18n-aria-label");
    applyAttributeTranslations(normalized, "title", "data-i18n-title");
    applyAttributeTranslations(normalized, "alt", "data-i18n-alt");
    applyAttributeTranslations(normalized, "content", "data-i18n-content");
    applyDateTranslations(normalized);
    updateLanguageSwitcher(normalized);

    window.AsheI18n = {
      language: normalized,
      t: function (key) {
        return translate(key, normalized);
      },
      apply: applyTranslations
    };
  }

  function initI18n() {
    var switcher = document.querySelector("[data-language-switcher]");
    var defaultLanguage = switcher ? switcher.getAttribute("data-default-language") : DEFAULT_LANGUAGE;
    applyTranslations(getRequestedLanguage(defaultLanguage));
  }

  function initDesktopMenus() {
    document.querySelectorAll("#main-menu li").forEach(function (item) {
      var submenu = item.querySelector(":scope > .sub-menu");
      if (!submenu) return;

      item.addEventListener("mouseenter", function () {
        setDisplay(submenu, "block");
      });

      item.addEventListener("mouseleave", function () {
        setDisplay(submenu, "none");
      });
    });
  }

  function initMobileMenus() {
    document.querySelectorAll(".mobile-menu-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var root = button.closest("#main-nav") || document;
        root.querySelectorAll(".mobile-menu-container").forEach(function (menu) {
          setDisplay(menu, menu.style.display === "block" ? "none" : "block");
        });
      });
    });

    document.querySelectorAll("#mobile-menu .sub-menu-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        var item = button.closest("li");
        if (!item) return;

        var submenu = item.querySelector(":scope > .sub-menu");
        var icon = item.querySelector(":scope > .sub-menu-btn-icon i");
        if (!submenu) return;

        setDisplay(submenu, submenu.style.display === "block" ? "none" : "block");
        if (icon) {
          icon.classList.toggle("fa-rotate-270");
        }
      });
    });
  }

  function initLanguageSwitcher() {
    var switcher = document.querySelector("[data-language-switcher]");
    if (!switcher) return;

    var button = switcher.querySelector(".language-switcher-button");
    var menu = switcher.querySelector(".language-switcher-menu");
    if (!button || !menu) return;

    function close() {
      switcher.classList.remove("is-open");
      button.setAttribute("aria-expanded", "false");
    }

    function toggle() {
      var isOpen = switcher.classList.toggle("is-open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      toggle();
    });

    menu.addEventListener("click", function (event) {
      var option = event.target.closest("[data-language-option]");
      if (option) {
        var language = normalizeLanguage(option.getAttribute("data-language-option"));
        if (language) {
          storeLanguage(language);
        }

        close();
      }
    });

    document.addEventListener("click", function (event) {
      if (!switcher.contains(event.target)) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
      }
    });
  }

  function initSearch() {
    var trigger = document.querySelector(".main-nav-search");
    var form = document.querySelector("#main-nav #searchform");
    var input = form ? form.querySelector("#s") : null;
    var openIcon = trigger ? trigger.querySelector("i:first-of-type") : null;
    var closeIcon = trigger ? trigger.querySelector("i:last-of-type") : null;
    var darkModeSwitcher = document.querySelector(".dark-mode-switcher");
    var languageSwitcher = document.querySelector(".language-switcher");
    var rssSwitcher = document.querySelector(".main-nav-rss");

    if (!trigger || !form || !input) return;

    input.setAttribute("placeholder", input.getAttribute("data-placeholder") || "Search");

    trigger.addEventListener("click", function () {
      var isOpen = form.style.display === "block";
      setDisplay(form, isOpen ? "none" : "block");
      setDisplay(closeIcon, isOpen ? "none" : "inline-block");
      setDisplay(openIcon, isOpen ? "inline-block" : "none");
      if (darkModeSwitcher) {
        darkModeSwitcher.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (languageSwitcher) {
        languageSwitcher.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (rssSwitcher) {
        rssSwitcher.style.visibility = isOpen ? "visible" : "hidden";
      }
      if (!isOpen) {
        input.focus();
      }
    });
  }

  function initSlider() {
    var slider = document.querySelector("#featured-slider.ashe-astro-slider");
    if (!slider) return;

    var slides = Array.from(slider.querySelectorAll(".slider-item"));
    var dots = Array.from(slider.querySelectorAll(".slider-dots li"));
    var previous = slider.querySelector(".prev-arrow");
    var next = slider.querySelector(".next-arrow");
    var autoplay = slider.getAttribute("data-autoplay") === "true";
    var interval = Number(slider.getAttribute("data-interval") || 5200);
    var current = Math.max(
      0,
      slides.findIndex(function (slide) {
        return slide.classList.contains("slick-current");
      })
    );
    var timer = null;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("slick-current", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("slick-active", dotIndex === current);
      });
    }

    function restart() {
      if (!autoplay || slides.length < 2) return;
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        activate(current + 1);
      }, interval);
    }

    if (previous) {
      previous.addEventListener("click", function () {
        activate(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        activate(current + 1);
        restart();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        activate(index);
        restart();
      });
    });

    activate(current);
    restart();
  }

  function initAltSidebar() {
    var sidebar = document.querySelector(".sidebar-alt");
    var overlay = document.querySelector(".sidebar-alt-close");
    var openButton = document.querySelector(".main-nav-sidebar");
    var closeButton = document.querySelector(".sidebar-alt-close-btn");

    if (!sidebar || !overlay || !openButton) return;

    function close() {
      sidebar.style.left = "-" + (sidebar.offsetWidth + 30) + "px";
      overlay.style.display = "none";
    }

    function open() {
      sidebar.style.left = "0";
      overlay.style.display = "block";
    }

    openButton.addEventListener("click", open);
    overlay.addEventListener("click", close);
    if (closeButton) {
      closeButton.addEventListener("click", close);
    }
    window.addEventListener("resize", close);
    close();
  }

  function initScrollTop() {
    var button = document.querySelector(".scrolltop");
    if (!button) return;

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener("scroll", function () {
      setDisplay(button, window.scrollY >= 800 ? "block" : "none");
    });
  }

  function initDarkMode() {
    var switcher = document.querySelector(".dark-mode-switcher");
    if (!switcher) return;

    var icon = switcher.querySelector("i");

    function apply(enabled) {
      document.body.classList.toggle("ashe-dark-mode", enabled);
      localStorage.setItem("asheDarkMode", enabled ? "on" : "off");
      if (icon) {
        icon.className = enabled ? "fa-regular fa-sun" : "fa-regular fa-moon";
      }
    }

    apply(localStorage.getItem("asheDarkMode") === "on");

    switcher.addEventListener("click", function () {
      apply(!document.body.classList.contains("ashe-dark-mode"));
    });
  }

  function initLazyImages() {
    document.querySelectorAll(".js-lazy-image").forEach(function (image) {
      var shell = image.closest(".lazy-image-shell");
      if (!shell) return;

      function markLoaded() {
        shell.classList.remove("is-error");
        shell.classList.add("is-loaded");
      }

      function markError() {
        shell.classList.add("is-error");
      }

      if (image.complete) {
        if (image.naturalWidth > 0) {
          markLoaded();
        } else {
          markError();
        }
        return;
      }

      image.addEventListener("load", markLoaded, { once: true });
      image.addEventListener("error", markError, { once: true });
    });
  }

  function initSearchPage() {
    var form = document.querySelector("[data-search-page-form]");
    var input = form ? form.querySelector("input[name='q']") : null;
    var items = Array.from(document.querySelectorAll("[data-search-item]"));
    var empty = document.querySelector("[data-search-empty]");
    if (!form || !input) return;

    function queryTerms(value) {
      return value
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
    }

    function updateUrl(query) {
      var url = new URL(window.location.href);

      if (query) {
        url.searchParams.set("q", query);
      } else {
        url.searchParams.delete("q");
      }

      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }

    function filter() {
      var query = input.value.trim();
      var terms = queryTerms(query);
      var visibleCount = 0;

      items.forEach(function (item) {
        var haystack = (item.getAttribute("data-search-item") || "").toLowerCase();
        var matches = !terms.length || terms.every(function (term) {
          return haystack.includes(term);
        });

        item.hidden = !matches;
        if (matches) {
          visibleCount += 1;
        }
      });

      if (empty) {
        empty.hidden = !terms.length || visibleCount > 0;
      }
    }

    input.value = new URLSearchParams(window.location.search).get("q") || "";
    input.addEventListener("input", filter);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      updateUrl(input.value.trim());
      filter();
    });
    filter();
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        textarea.remove();
      }
    });
  }

  function initCodeCopyButtons() {
    document.querySelectorAll(".single-post .post-content pre").forEach(function (pre) {
      if (pre.closest(".ashe-code-block")) return;

      var code = pre.querySelector("code");
      var text = code ? code.innerText : pre.innerText;
      if (!text.trim()) return;

      var wrapper = document.createElement("div");
      wrapper.className = "ashe-code-block";
      var button = document.createElement("button");
      button.className = "ashe-code-copy";
      button.type = "button";
      button.textContent = "复制";
      button.setAttribute("aria-label", "复制代码");

      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
      wrapper.appendChild(button);

      button.addEventListener("click", function () {
        copyText(text).then(function () {
          button.classList.add("is-copied");
          button.textContent = "已复制";
          window.setTimeout(function () {
            button.classList.remove("is-copied");
            button.textContent = "复制";
          }, 1600);
        }).catch(function () {
          button.textContent = "失败";
          window.setTimeout(function () {
            button.textContent = "复制";
          }, 1600);
        });
      });
    });
  }

  ready(function () {
    initDesktopMenus();
    initMobileMenus();
    initLanguageSwitcher();
    initSearch();
    initI18n();
    initSlider();
    initAltSidebar();
    initScrollTop();
    initDarkMode();
    initLazyImages();
    initSearchPage();
    initCodeCopyButtons();
  });
})();
