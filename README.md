# hurryclear.com

Personal site and blog of Hur Jiang, built with [Hugo](https://gohugo.io/).
The layout is hand-written (no theme); styling is [Tailwind CSS](https://tailwindcss.com/) v4.

## Local development

```sh
git clone https://github.com/hurryclear/hurryclear-web.git
cd hurryclear-web

npm install          # Tailwind CLI + typography plugin
hugo server          # dev server at http://localhost:1313
```

Requires Hugo **extended** `0.165.0` (image processing is used for the profile
avatar) and Node (Hugo shells out to the Tailwind CLI).

### CSS workflow

`assets/css/main.css` is the Tailwind **source**. Hugo compiles it itself via
`css.TailwindCSS` (see `layouts/partials/head.html`) — there is **no separate
build step and nothing to commit**. `hugo server` recompiles the stylesheet
whenever a template adds a new utility class, using `build.buildStats` +
`build.cachebusters` in `hugo.yaml` to invalidate the cached CSS.

`assets/css/app.css` no longer exists; it is git-ignored so a stray manual build
can't be committed.

### Content

Each page or post is a [page bundle](https://gohugo.io/content-management/page-bundles/)
— a folder with an `index.md` and any images beside it:

```
content/
  _index.md              # homepage (left column article)
  about/index.md         # About — doubles as the résumé
  posts/<slug>/index.md
  search/_index.md        # search page (layout: search, outputs: html + json)
```

### Languages

English (`en`, served at `/`) and Chinese (`zh-cn`, served at `/zh-cn/`).
Config: `languages:` in `hugo.yaml`; UI strings in `i18n/en.yaml` / `i18n/zh-cn.yaml`.
Translate a page by adding a `.zh-cn.md` sibling (e.g. `about/index.zh-cn.md`);
untranslated pages simply don't appear in that language. A language switcher is
in the header when more than one language exists.

### Search

Client-side, [Fuse.js](https://fusejs.io/) + [mark.js](https://markjs.io/)
(loaded from jsDelivr CDN). `layouts/search/search.json` emits `/search/index.json`
listing every page across both languages; `layouts/search/search.html` +
`assets/js/search.js` do the querying. Tune in `params.search` (`hugo.yaml`).

### Layout structure

```
layouts/
  _default/baseof.html   # the shell: <head>, header, footer, two-column grid
  _default/single.html   # About and other plain pages (left column)
  _default/list.html     # /posts/ and taxonomy term pages (left column)
  posts/single.html      # an individual post (left column)
  index.html             # homepage (left column)
  404.html
  partials/
    head.html header.html footer.html menu.html
    social_media.html icon.html scripts.html
    profile-card.html    # right column: home + About
    categories.html      # right column: posts / categories / tags
assets/
  css/main.css                # Tailwind source (compiled by Hugo via css.TailwindCSS)
  js/main.js                  # dark-mode toggle + mobile menu
  icons/*.svg                 # inlined by partials/icon.html
```

## Deployment

Hosted on **Cloudflare Pages**, deployed automatically from `main` via the
GitHub integration. Every pull request also gets a preview deployment.

### Cloudflare Pages project settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | `hugo --gc --minify` |
| Build output directory | `public` |
| Environment variable | `HUGO_VERSION` = `0.165.0` |
| Environment variable | `NODE_VERSION` = `20` |

Notes:

- `HUGO_VERSION` is required — without it Cloudflare uses an old default Hugo and the build fails.
- Cloudflare auto-detects `package.json` and runs `npm install` before the build
  command; Hugo then calls the Tailwind CLI during `hugo --gc --minify`. If
  `npm install` fails, the deploy fails. `NODE_VERSION` pins a modern Node.

### Custom domain

`baseURL` in `hugo.yaml` is set to `https://hurryclear.com/`. Add the domain
under **Custom domains** in the Pages project — no code change needed.

### Optional: correct baseURL on preview deployments

Preview builds inherit the production `baseURL`. To make previews
self-referential, set the build command to:

```sh
if [ "$CF_PAGES_BRANCH" = "main" ]; then hugo --gc --minify; else hugo --gc --minify -b "$CF_PAGES_URL"; fi
```
