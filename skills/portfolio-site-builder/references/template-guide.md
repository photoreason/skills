# Filling the template (Cloudflare route)

The template in [`../templates/portfolio/`](../templates/portfolio/) is a
minimal, monochrome, **trilingual (EN/JA/ZH)** photographer site. It's zero-build
— no framework, no server — so it previews by double-clicking `index.html` and
deploys as-is.

**You only edit the content files.** Never touch `index.html`, `styles.css`, or
`app.js` for normal use.

## Step 1 — Copy the template

Make the photographer's site folder from a copy of `templates/portfolio/`.
(Coding agent: copy it into the working tree. Desktop/no-filesystem: hand them
the files to download, or reproduce each file's contents for them to save.)

## Step 2 — Structure: `content/site.js`

This holds everything shared across languages — images, projects, contact,
social. Edit the placeholder values:

- `defaultLocale` — the language to use when a visitor has not chosen one and
  their browser language is unavailable: `'en'`, `'ja'`, or `'zh-hans'`. For a
  Chinese-primary site, set this to `'zh-hans'`.
- `heroImage`, `portraitImage` — paths under `images/`.
- `email` — contact address.
- `social` — array of `{ label, href }` (Instagram, Xiaohongshu, etc.).
- `projects` — one entry per series:
  - `id` — short slug (must match the language files).
  - `year`, `ongoing` (true/false).
  - `layout` — `'stack'` (full-bleed, one image per row — best for a sequenced
    series) or `'grid'` (even grid — best for a set).
  - `images` — array of `{ src }`, each optionally with:
    - `alt` — one plain sentence describing the photo (from the prepared content
      package; strongly recommended).
    - `caption` — shown under the image; many pros skip captions.
    - `aspect` — e.g. `'3 / 2'` — reserves the image's space before it loads so
      the page never jumps (stack layout only; the grid handles its own).

## Step 3 — Words: `content/en.js`, `ja.js`, `zh-hans.js`

Each file has the **same shape**; translate the values. Fill from the prepared
content package:

- `meta.title` / `meta.description` — for the browser tab and sharing.
- `hero.eyebrow`, `hero.name`, `hero.tagline`.
- `nav` and `labels` — usually leave as-is (already translated).
- `projects.<id>.title` + `.description` — one block per project id in `site.js`.
- `about.statement`, `about.bio`.
- `footer.rights` — keep `{year}`; it fills in automatically.

**If they only want one language:** delete the `<script src="content/ja.js">`
and `zh-hans.js` lines from `index.html`; the language switch hides itself.

## Step 4 — Images

Drop web-sized **JPEG/WebP** photos into `images/` at the paths named in
`site.js` (e.g. `images/tidal/01.jpg`). Sizing + conversion (towebp.io) is in
[curation.md](curation.md#web-sizing). Missing images show a labelled placeholder,
so the layout is reviewable before every photo is in place.

## Step 5 — Preview

Double-click `index.html` (works on Windows and Mac, offline). Check it on a
narrow window too (mobile). Switch languages with the EN / 日本語 / 简体 control.
Click a project to open its full-screen view; click an image to zoom.

Iterate on order and words until they're happy, then go to
[deploy-static.md](deploy-static.md) to put it online.
