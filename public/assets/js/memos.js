(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  function formatTime(value) {
    if (!value) return "";
    var normalizedValue = value;
    if (typeof value === "number" || (typeof value === "string" && /^\d+$/.test(value))) {
      var timestamp = Number(value);
      normalizedValue = timestamp < 1000000000000 ? timestamp * 1000 : timestamp;
    }
    var date = new Date(normalizedValue);
    if (Number.isNaN(date.valueOf())) return "";
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });
  }

  function getMemoContent(memo) {
    return memo.content || memo.text || memo.memo || "";
  }

  function getMemoDate(memo) {
    return memo.displayTime || memo.createTime || memo.updateTime || memo.createdTs || memo.createdAt || memo.updatedAt || memo.created_at;
  }

  function normalizeMemos(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (Array.isArray(payload.resources)) return payload.resources;
    if (Array.isArray(payload.memos)) return payload.memos;
    if (payload.data && Array.isArray(payload.data.memos)) return payload.data.memos;
    if (payload.data && Array.isArray(payload.data.resources)) return payload.data.resources;
    return [];
  }

  function endpoints(config) {
    var base = (config.memos || "").replace(/\/+$/, "");
    var limit = encodeURIComponent(config.limit || 20);
    var creatorId = encodeURIComponent(config.creatorId || "");
    var oldApi = base + "/api/v1/memo?creatorId=" + creatorId + "&rowStatus=NORMAL&limit=" + limit;
    var newApi = base + "/api/v1/memos?filter=creator_id==" + creatorId + "&&row_status==NORMAL&pageSize=" + limit;

    return [newApi, oldApi];
  }

  function fetchJson(urls) {
    var lastError;

    return urls.reduce(function (promise, url) {
      return promise.catch(function () {
        return fetch(url).then(function (response) {
          if (!response.ok) throw new Error("HTTP " + response.status + " " + url);
          return response.json();
        }).catch(function (error) {
          lastError = error;
          throw error;
        });
      });
    }, Promise.reject()).catch(function () {
      throw lastError || new Error("Unable to load memos");
    });
  }

  function renderMemo(memo) {
    var article = document.createElement("article");
    article.className = "bber-item";

    var body = document.createElement("div");
    body.className = "bber-content";
    var content = getMemoContent(memo);
    if (window.marked && typeof window.marked.parse === "function") {
      body.innerHTML = window.marked.parse(content);
    } else {
      body.textContent = content;
    }

    var time = document.createElement("time");
    time.className = "bber-date";
    time.textContent = formatTime(getMemoDate(memo));

    article.appendChild(body);
    if (time.textContent) article.appendChild(time);
    return article;
  }

  ready(function () {
    var config = window.bbMemo || {};
    var root = document.querySelector(config.domId || "#bber");
    if (!root || !config.memos) return;

    root.innerHTML = '<p class="bber-loading">瞬间加载中...</p>';

    fetchJson(endpoints(config))
      .then(function (payload) {
        var memos = normalizeMemos(payload).slice(0, Number(config.limit) || 20);
        root.innerHTML = "";
        if (!memos.length) {
          root.innerHTML = '<p class="bber-empty">暂无瞬间。</p>';
          return;
        }
        memos.forEach(function (memo) {
          root.appendChild(renderMemo(memo));
        });
      })
      .catch(function (error) {
        root.innerHTML = '<p class="bber-error">瞬间加载失败，请稍后再试。</p>';
        console.error("[memos]", error);
      });
  });
})();
