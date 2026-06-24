# Obsidian 内容同步

这个博客仓库已经添加 `.github/workflows/sync-obsidian-content.yml`，用于接收 Obsidian 仓库通知，并把内容复制到博客内容目录：

- `album/` -> `src/content/albums/`
- `page/` -> `src/content/pages/`
- `posts/` -> `src/content/posts/`

还需要在 GitHub 上完成两件事：

1. 在博客仓库 `wangyunzi/astro-ashe` 的 `Settings -> Secrets and variables -> Actions` 添加 `OBSIDIAN_SYNC_TOKEN`。
   这个 token 需要有读取 Obsidian 仓库的权限。如果 Obsidian 仓库是公开的，也建议保留这个 token，后续改成私有仓库时不用改工作流。

2. 在 Obsidian 仓库新增下面这个工作流，例如 `.github/workflows/notify-blog-sync.yml`。
   其中 `OBSIDIAN_SYNC_PAT` 是 Obsidian 仓库里的 secret，需要有触发博客仓库 `repository_dispatch` 的权限。

```yaml
name: Notify Blog Content Sync

on:
  push:
    branches:
      - main
    paths:
      - "album/**"
      - "page/**"
      - "posts/**"
  workflow_dispatch:

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger blog sync
        env:
          GH_TOKEN: ${{ secrets.OBSIDIAN_SYNC_PAT }}
          BLOG_REPO: wangyunzi/astro-ashe
          OBSIDIAN_REPO: ${{ github.repository }}
          OBSIDIAN_REF: ${{ github.ref_name }}
        run: |
          gh api repos/$BLOG_REPO/dispatches \
            --method POST \
            --field event_type=obsidian-content-updated \
            --raw-field client_payload="{\"repository\":\"$OBSIDIAN_REPO\",\"ref\":\"$OBSIDIAN_REF\"}"
```

如果 Obsidian 仓库默认分支不是 `main`，把示例里的 `branches: main` 改成实际分支名。
