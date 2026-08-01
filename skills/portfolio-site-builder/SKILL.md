---
name: portfolio-site-builder
description: "Use when a photographer wants a portfolio website — including people with no technical background. Guides them in plain language through expected monthly cost (in their currency), registering a web address, curating photos and writing their bio, and publishing three ways — a visual builder (Squarespace/Wix/Pixieset), a free site they own via drag-and-drop, or a code deploy (Vercel/Cloudflare Pages). Ships a trilingual (EN/JA/ZH) template. Works from Claude/Codex desktop or a coding agent, on Windows and Mac."
---

# Portfolio Site Builder

Help a photographer get a real portfolio website online. The typical person
using this is a **working photographer with a trained eye and high aesthetic
standards who has no patience for tech** — often talking to you conversationally
(Claude or Codex desktop), no terminal, no code. Others run you as a coding
agent with a real filesystem. Detect which you are and adapt (see "Where you're
running"), but the tone stays the same throughout.

## Golden rules

- **Plain language, always.** No jargon. Say "your website files," "put it
  online," "connect your web address" — not "repository," "deploy," "DNS."
  Plain language is not dumbed-down language: they're experts in photography,
  just not in this.
- **Respect their eye.** They own the edit, the sequence, and the taste; you're
  the producer and technician. Offer opinions when asked or when something would
  genuinely hurt the site — never lecture about photography.
- **The photographs carry the site.** Keep the chrome quiet: monochrome UI, no
  decorative flourishes, no colored accents. Resist requests-you-invented;
  honor the ones they actually make.
- **One question at a time.** Ask, wait, react. When the assistant has a
  multiple-choice question tool, use it for options; otherwise ask one short,
  plain-language question in the conversation.
- **Money up front.** Tell them what it will cost, in their own currency, before
  they choose anything (Phase 1). No surprises.
- **Do the work for them.** Draft the bio, propose the structure, fill the
  template. They approve and tweak.

## Where you're running (adapt, don't announce)

- **Desktop/conversational (no filesystem):** you can't run builds. Produce the
  finished files as copy-paste/downloadable content and walk them click-by-click
  through browser steps. Prefer the drag-and-drop and visual-builder paths.
- **Coding agent (real filesystem):** you can create the site files directly, run
  a local preview, and use git-connected deploys.
- **Windows or Mac:** keep instructions OS-neutral; when a step differs, give
  both (e.g. "double-click `index.html`" works on each).

## The flow

```
0. Welcome
1. What it'll cost        → estimate in their currency  (references/costs.md)
2. Pick a path (survey)   → Visual builder / Free & owned / Code
3. Your web address       → register now or defer       (references/domains.md)
4. Your photos & story    → shared for every path        (references/curation.md)
5. Put it online          → forks by path
6. Launch checklist       → shared
```

### Phase 0 — Welcome

Greet them warmly. Say that by the end they'll have a portfolio website online,
and that first you'll cover what it costs so there are no surprises.

### Phase 1 — What it'll cost

Before anything else, set expectations. Read
[references/costs.md](references/costs.md) and give a short estimate of the
**monthly cost of each path in their currency** (USD / JPY / CNY — infer from
their language or ask). Make clear that one path is essentially free. This frames
the choice they make next.

### Phase 2 — Pick a path (survey)

Ask a few plain questions one at a time (free vs. paid; how often they'll update;
comfort with dragging a file onto a web page vs. wanting a pure dashboard; do
they write code). Then recommend **one** path and let them confirm or switch:

- **Path A — Visual builder** (no code, paid, editable dashboard). Squarespace by
  default; Wix (has a free tier), Pixieset (if they sell prints/deliver client
  galleries), or Format as alternatives. See
  [references/track-visual-builder.md](references/track-visual-builder.md).
- **Path B — Free & owned** (no code, free): they get the real trilingual
  template and publish it by **drag-and-drop** — no account or terminal needed.
  See [references/template-guide.md](references/template-guide.md) +
  [references/deploy-static.md](references/deploy-static.md).
- **Path C — Code** (they're comfortable with code/files): the same template,
  deployed via **Vercel or Cloudflare Pages** connected to a Git repo. Same two
  references as Path B.

Paths B and C share one artifact — the template in `templates/portfolio/`. On
Path A the template is a **visual blueprint** you help them rebuild in the
builder.

### Phase 3 — Your web address (domain)

Help them decide their web address early. Follow
[references/domains.md](references/domains.md):

- They can start free with a `*.pages.dev` / `*.netlify.app` / builder subdomain
  and add a custom domain later — say so, so cost never blocks launch.
- If they want their own (e.g. `janedoe.com`): register via **Cloudflare**
  (cheapest, at-cost — best for Path C) or **Squarespace/their builder** (simplest
  for Path A), and help them pick a clean name.

### Phase 4 — Your photos & story (shared)

The same for every path. Follow [references/curation.md](references/curation.md):
choose the strongest 15–40 photos, group into series, sequence them, write a
short bio + artist statement, gather contact info, draft titles + alt text, and
export **web-sized JPEG or WebP** images (point them to <https://towebp.io>).
Output: a tidy "content package" you reuse in Phase 5.

### Phase 5 — Put it online (forks)

- **Path A (visual builder):** [references/track-visual-builder.md](references/track-visual-builder.md)
  — pick the platform, guide setup click-by-click, paste in the prepared content,
  using the template as the layout blueprint.
- **Path B/C (own template):** [references/template-guide.md](references/template-guide.md)
  to fill `content/site.js` + the three language files with their content package
  and drop images in `images/`; then
  [references/deploy-static.md](references/deploy-static.md) to publish
  (drag-and-drop for B, Git-connected Vercel/Cloudflare for C) and connect the
  domain from Phase 3.

### Phase 6 — Launch checklist (shared)

Finish with [references/curation.md](references/curation.md#launch-checklist):
phone check, fresh-eyes proofread, basic findability (page title + description),
test links, share it, and a path-specific "how to add photos later."

## Scope

Portfolio galleries + about + contact, in up to three languages. No store, blog,
or client proofing in v1 — offer to help with the portfolio first; those are
separate projects.

## When things go sideways

- **Too many photos:** help them cut — a tight 20 beats a sprawling 80.
- **Too few (under ~8):** one well-sequenced gallery is a fine portfolio.
- **Huge camera files:** see web-sizing + format conversion in
  [references/curation.md](references/curation.md#web-sizing).
- **Stuck publishing:** each publish reference has a fallback (an alternate host
  for B/C; an alternate builder for A). Stay calm and offer it.
