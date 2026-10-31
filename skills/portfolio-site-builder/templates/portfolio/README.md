# Portfolio template

A minimal, monochrome, image-first photographer portfolio in the Photo Reason
house style. **Zero build, no framework, no server** — it runs by double-clicking
`index.html` and deploys as-is to Cloudflare Pages (the recommended host).

Trilingual out of the box: **English / 日本語 / 简体中文**, with a language switch
top-right (remembers the visitor's choice).

## You only edit the content files

Do **not** edit `index.html`, `styles.css`, or `app.js` for normal use. All the
words and photos come from four files in `content/`:

| File | Holds |
| --- | --- |
| `content/site.js` | Structure — hero/portrait images, projects (ids, year, layout, image paths), email, social links. Shared across languages. |
| `content/en.js` | English text |
| `content/ja.js` | Japanese text |
| `content/zh-hans.js` | Simplified Chinese text |

A project's `id` in `site.js` must match its key in each language file.

## Images

Put photos in `images/` using the paths referenced in `site.js`
(e.g. `images/tidal/01.jpg`). Use **JPEG or WebP**, long edge ~2000px, each well
under ~500 KB. Keep original HEIC/PNG/TIFF/RAW files separate and export web copies locally.
Check detail, color, and zoom quality; the size targets are starting points. Until real photos exist,
the template shows labelled placeholders so the layout is still visible.

## Layouts & viewing

Each project sets `layout: 'stack'` (full-bleed, one image per row — best for a
sequenced series) or `layout: 'grid'` (even grid — best for a set). Click any
image inside a project to enlarge it, or choose Gallery mode. The complete
contact sheet jumps to each photograph without changing the original stack/grid
layout. In the dark viewer, use arrows or ← → keys, the thumbnail rail, or All
photographs to navigate. Click the image or Zoom to enlarge it; drag/scroll to pan.
Escape returns to fit view, closes the contact sheet, or leaves the gallery. Each project ends with a quiet link to the next
body of work.

Per image you can set `thumb` (optional smaller JPEG/WebP for the contact sheet),
`alt` (a plain one-sentence description — recommended),
`caption` (optional), and `aspect` (e.g. `'3 / 2'`, stack layout — reserves the
space before the photo loads so the page never jumps).

## Preview

Double-click `index.html`. The complete site works offline and uses privacy-
friendly system fonts; it makes no third-party font request.

## Deploy

See `../../references/deploy-static.md` — Cloudflare direct upload (a free account is required) or Git integration.
