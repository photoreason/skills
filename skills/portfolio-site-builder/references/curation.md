# Photos & story (shared across every path)

This phase translates their work into a site. **You are the producer, not the
teacher** — most people using this are working photographers with a trained eye
and existing bodies of work. They own the edit and the sequence; you handle the
translation to the web, do the drafting and the tedium, and offer an opinion
when asked (or when something would genuinely hurt the site). Never lecture a
professional about photography.

## 1. The edit (selection)

- Ask how their work is organized — most pros already think in **series /
  projects**. Start from their structure; don't impose one.
- For the site, **15–40 images total** is the sweet spot; more dilutes. If their
  edit is larger, say so once, plainly, and let them decide.
- Where they want help tightening the edit, be a good second pair of eyes: flag
  near-duplicates and frames that repeat an idea a stronger frame already makes.
- If they're newer and ask for real editing help: prioritize point of view over
  technical perfection, and cut "nice but similar."

## 2. Series → site structure

- Each body of work becomes one **project** on the site, with its own title,
  year, short description, and a sequence. The default project page shows one
  image with its description; Gallery mode and a contact sheet expose the series.
- **2–5 projects** navigate well. A single strong series is also a perfectly
  good portfolio.
- Mark ongoing work as *ongoing* — it signals an active practice.

## 3. Sequence

- Respect the sequence they already have; many pros sequence deliberately.
- If they want input: open strong, close strong; vary rhythm (wide/tight,
  busy/calm); read the run back to them and adjust.

## 4. Bio, statement, contact

Draft these *for* them in their voice, then let them edit:

- **Short bio (2–3 sentences):** who they are, what they photograph, where
  they're based — plus the credentials that matter (shows, awards, publications,
  representation). Third or first person — ask which they prefer.
- **Artist statement (1 short paragraph):** what the work is about, specific and
  human. No art-speak clichés ("exploring the liminal…") — a pro's statement
  should sound like them, not a grant application.
- **Contact:** email at minimum; Instagram/socials; gallery representation if
  any. Never publish a personal phone number unless they insist.

## 5. Titles, captions, alt text

For each photo, draft and confirm:
- A short **title/caption** (or "Untitled, {place} {year}" — many pros prefer
  minimal or no captions; follow their practice).
- **Alt text:** one plain sentence describing the image, for blind visitors and
  search engines. Example: "A lone swimmer crosses an empty pool at dawn."
  Factual, not poetic. On the template this is the per-image `alt` field.

## Web-sizing

Prepare **web-sized copies**, keeping original camera files untouched. If local
image tools are available, offer to export/convert copies; otherwise guide an
export from their editor. Check the result at its displayed size, including zoom.

- **Use JPEG or WebP.** These are the right formats for photos on the web. WebP
  can reduce file size; compare the exported result with JPEG rather than assuming
  one format always wins.
  **Avoid large PNG, HEIC, TIFF, and RAW originals** as published photo assets.
  PNG is useful for graphics needing transparency, not the default for photographs.
- Start around **2000px on the long edge**, quality ~80%, sRGB, and aim for
  **under ~500 KB** per photo. These are starting points, not hard limits: inspect
  detail, banding, color, and zoom before choosing the final export. For larger
  projects, optional small `thumb` copies keep the contact sheet lighter.
- From pro software:
  - **Lightroom:** Export → JPEG, Quality 80, Image Sizing → Resize to fit Long
    Edge 2000px.
  - **Mac Preview:** Tools → Adjust Size → 2000px, then File → Export as JPEG.
  - **Phone photos:** usually fine, but convert HEIC to JPEG/WebP with a trusted
    local editor or the browser option below.
- Browser option, no software to install: **<https://towebp.io>** converts and
  compresses JPEG, HEIC, PNG, and WebP. This uploads the image to a third-party
  service. For unpublished work, client photographs, or anything confidential,
  prefer Lightroom or another trusted local editor; otherwise review the
  service's privacy terms before uploading.
- Keep the web-sized copies in one folder, named in the order they should appear
  (e.g. `01.jpg`, `02.jpg`). You'll use that folder when filling the template.

## Output: the content package

By the end you should have, written down in the conversation:

- Ordered, grouped list of photos (with their filenames).
- Titles + alt text per photo.
- Short bio + artist statement.
- Contact info.

Hand this same package to whichever publish path they chose.

## Launch checklist

After the site is live:

- [ ] **Open it on a phone.** Fix anything that looks cramped or tiny.
- [ ] **Fresh-eyes read.** Check every word for typos; make sure the story reads
      clearly to a stranger.
- [ ] **Findability.** Set the page **title** (e.g. "Jane Doe — Photography")
      and a one-line **description**. On the template these are
      `meta.title` / `meta.description` in each language file; on a visual builder
      they're in the platform's settings.
- [ ] **Test the links.** Contact email works, each gallery opens, images load.
      Switch languages once (template) and confirm nothing is left untranslated.
- [ ] **Share it.** Give them the link and suggest posting it in their Instagram
      bio and email signature.
- [ ] **Adding photos later:** give them the short recipe for their path — the
      "Updating later" section of [deploy-static.md](deploy-static.md) or [track-visual-builder.md](track-visual-builder.md) — so
      they're never stuck.
