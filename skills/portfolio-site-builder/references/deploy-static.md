# Putting the template online (Paths B & C)

The template is a plain static site, so it deploys anywhere. Pick by comfort:

- **Path B — no code:** drag-and-drop (no account or terminal to start).
- **Path C — code:** Git-connected Vercel or Cloudflare Pages (auto-rebuilds on
  every push).

## Path B — Drag-and-drop (no code)

### Option 1: Cloudflare Pages (recommended, free, keeps it)

1. Create a free **Cloudflare** account.
2. **Workers & Pages → Create → Pages → Upload assets**.
3. Name the project, then **drag the entire site folder** (the one containing
   `index.html`) onto the upload area.
4. **Deploy.** It's live at `your-project.pages.dev`.

### Option 2: Netlify Drop (fastest, no account to start)

1. Go to <https://app.netlify.com/drop>.
2. Drag the whole site folder onto the page. It's live in seconds at a
   `*.netlify.app` address.
3. Make a free account when prompted to keep the site and manage it.

Reassure them: nothing here can harm their computer, and the files stay theirs.

## Path C — Git-connected (code)

Same template, deployed from a Git repo so pushes publish automatically.

### Vercel

1. Put the site folder in a Git repo (GitHub/GitLab).
2. On **vercel.com**, **Add New → Project → Import** the repo.
3. Framework preset **Other**, no build command, output = the folder with
   `index.html` (repo root if that's where it is). **Deploy.**

### Cloudflare Pages

1. **Workers & Pages → Create → Pages → Connect to Git**, pick the repo.
2. Build command: none. Build output directory: the folder with `index.html`.
   **Save and Deploy.**

## Connect a custom domain

Once live, connect the Phase 3 domain:

- **Cloudflare Pages + domain at Cloudflare:** **Custom domains → Set up a domain**
  → pick it → automatic.
- **Netlify/Vercel:** **Domain settings → Add domain**, then the host shows the
  exact DNS records to paste at wherever the domain was bought. Walk them through
  pasting each one. Propagation can take up to a few hours.

## Updating later

- **Path B:** re-drag the folder onto Cloudflare Pages (Create a new deploy) or
  Netlify Drop. Offer to add the new photos to `site.js` for them first.
- **Path C:** commit and push; the host rebuilds automatically.

To add photos: drop web-sized JPEG/WebP into `images/`, add a matching entry to
the project's `images` array in `content/site.js` (and a project block in each
language file if it's a new series). See
[template-guide.md](template-guide.md).

## Fallback if a host won't cooperate

- Drag-and-drop blocked? Try the other drag-and-drop host (Cloudflare Pages ↔
  Netlify Drop), or **Tiiny Host** (accepts a ZIP).
- The finished files are portable — only "where it lives" changes. Stay calm and
  switch hosts.
