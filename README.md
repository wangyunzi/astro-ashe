# Astro Ashe

This project ports the WordPress theme style into Astro.

## What was copied

- Original Ashe static assets live in `public/ashe/`.
- `public/ashe/style.css` and `public/ashe/assets/css/responsive.css` are loaded directly and are not rewritten.
- Astro-specific compatibility CSS and behavior live in:
  - `public/ashe/ashe-astro.css`
  - `public/ashe/ashe-astro.js`

## Main Settings

Edit `src/ashe.config.ts`.

The config keeps Astro-supported Ashe options in one place: site identity, colors, widths, navigation, featured slider, featured links, post meta, sidebars, footer, responsive switches, dark mode, and comments.

## Twikoo Comments

Comments are implemented by `src/components/TwikooComments.astro`.

Set your Twikoo server URL or environment ID:

```ts
comments: {
  enabled: true,
  envId: "https://your-twikoo-server.example.com"
}
```

The Twikoo client URL is configurable through `comments.cdn` and defaults to the version shown in Twikoo's frontend deployment docs. The visual adapter is in `public/ashe/ashe-astro.css` and keeps inputs, titles, avatars, and comment borders aligned with Ashe's original comment section.

## Commands

```sh
npm install
npm run dev
npm run build
```
