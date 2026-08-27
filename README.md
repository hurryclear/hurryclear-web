# hurryclear.com

Personal site and blog of Hur Jiang, built with [Hugo](https://gohugo.io/)
and the [tailwind theme](https://github.com/tomowang/hugo-theme-tailwind)
(vendored as a git submodule).

## Local development

```sh
# first clone — pull the theme submodule too
git clone --recurse-submodules https://github.com/hurryclear/hurryclear.com.git

# if you already cloned without submodules
git submodule update --init --recursive

# run the dev server at http://localhost:1313
hugo server
```

Requires Hugo **extended** (image processing is used for the profile
avatar). This project is built against Hugo `0.165.0`.

### Content

Each page or post is a [page bundle](https://gohugo.io/content-management/page-bundles/)
— a folder with an `index.md` and any images beside it:

```
content/
  _index.md              # homepage
  about/index.md
  posts/<slug>/index.md
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

Notes:

- `HUGO_VERSION` is required — without it Cloudflare uses an old default Hugo and the build fails.
- The theme submodule uses an **HTTPS** URL, so Cloudflare clones it automatically. No extra configuration needed.
- No Node/npm build step: the theme ships pre-compiled CSS; Hugo Pipes only fingerprints and minifies it.

### Custom domain (pending)

The site currently serves from the project's `*.pages.dev` URL. `baseURL`
in `hugo.toml` is already set to `https://hurryclear.com/`, so absolute
URLs (canonical tags, sitemap, RSS) point there ahead of the domain going
live. Once `hurryclear.com` is registered: add it under **Custom domains**
in the Pages project — no code change needed.

### Optional: correct baseURL on preview deployments

Preview builds inherit the production `baseURL`. To make previews
self-referential, set the build command to:

```sh
if [ "$CF_PAGES_BRANCH" = "main" ]; then hugo --gc --minify; else hugo --gc --minify -b "$CF_PAGES_URL"; fi
```
