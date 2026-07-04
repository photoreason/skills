# Your web address (domain)

A "web address" (domain) is what people type to reach the site — `janedoe.com`.
Help them decide this early, but reassure them it's optional to start.

## First: do they even need to buy one now?

No. Every publish path gives a **free address** to launch with:

- Path B/C: `your-site.pages.dev` (Cloudflare) or `your-site.netlify.app`.
- Path A: `yourname.squarespace.com`, `yourname.wixsite.com`, etc.

They can add a custom domain any time later. So if they're unsure, launch free
and revisit. If they want their own address now, continue below.

## Picking a good name

- Prefer **`.com`**; it's what people assume. `.photography`, `.studio`, `.art`
  are fine second choices.
- Use their name (`janedoe.com`) or name + craft (`janedoephoto.com`). Short,
  easy to say out loud, no hyphens or numbers.
- Check a few options — the exact one is often taken; have 2–3 ready.

## Where to register

Recommend based on their path:

### Cloudflare (best for Path C — code, and anyone cost-conscious)

- **Sells domains at cost** (no markup) — the cheapest option long-term.
- Pairs naturally with Cloudflare Pages hosting.
- Steps: create a free Cloudflare account → **Domain Registration → Register** →
  search the name → pay (~$10/yr). Walk them through each screen.

### Squarespace / their builder (best for Path A — visual builder)

- Simplest when the site itself lives on Squarespace/Wix/etc. — the domain and
  site are managed in one place, and annual plans usually include the **domain
  free for the first year**.
- Steps: inside the builder, **Settings → Domains → Get a domain**, search, and
  confirm. It's connected automatically.

### Any other registrar

If they already own a domain (or prefer Namecheap, Porkbun, Google Domains'
successor, etc.), that's fine — every host can connect an external domain. Note
where they bought it; you'll paste in a couple of records at publish time.

## Connecting the domain (done at publish, not now)

Connecting happens in Phase 5 once the site exists:

- **Path A:** the builder's Domains settings walks them through it (often one
  click if bought there).
- **Path B/C:** the host (Cloudflare Pages / Netlify / Vercel) shows the exact
  records to add at the registrar. If the domain is *at* Cloudflare and hosting
  is Cloudflare Pages, it's automatic. See
  [deploy-static.md](deploy-static.md#connect-a-custom-domain).

Keep this in mind now; don't rabbit-hole into it during Phase 3.
