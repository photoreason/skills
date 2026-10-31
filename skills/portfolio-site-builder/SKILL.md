---
name: portfolio-site-builder
description: "Help a photographer build a portfolio website, from costs and gathering photographs, text, and a domain through the included trilingual template, preview, and publication. Recommend Cloudflare Pages for the template or Squarespace for a visual editor. Supports step-by-step guidance and optional user-authorized computer use for difficult browser steps."
---

# Portfolio Site Builder

Help a photographer make a home for their work. They bring the eye, the edit,
and the sequence; you handle the website and explain unfamiliar steps in plain
language. Keep this one portfolio-building skill. A standalone photo-sequencing
request belongs to a separate workflow; do not start a website survey for it.

## Working principles

- Use the user's existing choices for images, language, budget, and services.
  Ask only what is missing, one manageable question at a time.
- Explain costs in their chosen currency before choosing or buying a service.
  Check current official pricing and renewal terms; don't guess currency from language.
- Keep the template quiet and image-first. Honor specific design requests and
  preserve an existing selection or sequence unless asked to revisit it.
- Do the drafting and assembly yourself when tools allow. Guide the user through
  actions that need their account or computer; do not assume desktop means no files.
- Keep preview separate from publication. The user decides what goes public,
  what gets purchased, and when the site is ready.

## Two assistance modes, one workflow

**Guide mode** is the default: you prepare the site and explain the next browser
step; the user clicks through account, domain, and hosting screens. Use visible
screen labels, short instructions, and checkpoints after meaningful stages.

**Computer-use mode** is optional: with the user's grant of computer/browser
control and a suitable tool actually available in the host, perform difficult
steps for them—uploading files, configuring pages, connecting a domain, or
navigating the hosting dashboard. A request in chat does not create computer-use
capabilities that the host lacks. Check availability before offering to take over.
Read [computer-use.md](references/computer-use.md) when this mode is chosen.

The user can start in either mode, switch at a difficult step, or take control
back at any time. Honor a mode already requested; otherwise offer the choice
briefly when it matters. Both modes follow the same stages below and produce the
same preview, published site, and update guide. Computer use is assistance, not
permission to purchase or publish beyond the user's existing authorization.

## 1. Start with costs

Read [costs.md](references/costs.md). Explain the assistant subscription, hosting,
optional domain, renewals, and any paid add-ons separately. Compare:

- **Recommended: the included template on Cloudflare Pages**, using direct upload
  for a simpler setup, or Git integration when automatic updates fit the user.
- **Alternative: Squarespace**, when the user wants a visual editing dashboard
  and accepts the subscription. Use the included template as a visual blueprint;
  its HTML files cannot simply be imported into Squarespace.

Ask for currency/budget if unknown. Respect an explicitly chosen platform.
Cloudflare remains the default for mainland China audiences too. Audience
location should inform language and real access testing, not automatically
switch the user to a regional builder such as 上线了. Do not promise reliable
mainland access without testing the actual deployed address from that audience.
If it fails, explain the evidence and agree on a next step with the user.

## 2. Gather the resources

Collect a small content package before building:

- Photographs the user may publish, organized into their projects and existing
  sequence; a rough selection is enough to begin.
- Their name, a short introduction/bio, project notes, captions if wanted, and a
  public contact address. Draft missing text for review, without inventing credits.
- Preferred languages and audience; the template supports English, Japanese,
  and Simplified Chinese. One language is fine.
- An existing domain and its registrar, or a short list of names to consider.
  Namecheap, GoDaddy, Squarespace Domains, and Cloudflare Registrar can be domain
  providers; the registrar and website host do not have to be the same company.
  Keep an existing domain rather than asking for a transfer.
- The publishing account or plan they want to use. They handle sign-in; never
  ask them to paste passwords, recovery codes, or payment details into chat.

Use [domains.md](references/domains.md) for the web address and
[curation.md](references/curation.md) for preparing the photographs and words.
Ask only for resources needed for the next stage. A custom domain is optional:
a Cloudflare preview address can come first, then a domain when ready.

## 3. Build from the template

For Cloudflare, copy `templates/portfolio/` and follow
[template-guide.md](references/template-guide.md). Fill `content/site.js`, the
chosen language files, and `images/` from the content package. Preserve project
IDs, image order, credits, and the user's preferred stack/grid layout. Use only
languages and content they asked to publish. Missing assets may be labeled in a
private preview; don't publish placeholders as finished work.

For Squarespace, follow [track-visual-builder.md](references/track-visual-builder.md).
Recreate the template's page structure and visual rhythm in the editor, then
populate the same prepared content. Explain any translation or layout limitations
before committing to paid add-ons. Other builders are alternatives only if the
user has chosen them or agrees to a change.

## 4. Preview and revise

Open a real preview before deploying the Cloudflare site or publishing a builder
site. Check phone and larger-screen layouts, every requested language, image
loading/order, captions, credits, contact links, and the site's title/description.
Invite a concrete revision and show the result. If you lack preview or computer
access, hand over a local preview and tell the user exactly what to check.

Do not call the site finished merely because files exist or an upload completed.

## 5. Publish to Cloudflare or Squarespace

Confirm the intended address and any paid action against the user's existing
authorization. For Cloudflare use [deploy-static.md](references/deploy-static.md):
direct upload or Git integration, followed by domain setup when wanted. For
Squarespace use its preview/publish workflow in
[track-visual-builder.md](references/track-visual-builder.md).

In Guide mode, walk through these screens. In Computer-use mode, perform the
agreed steps with the available tool and return control when the user needs to
sign in, complete a verification challenge, or approve a purchase. Continue after
the user finishes. Avoid changing unrelated DNS records or account settings.

Open the published address in a fresh browser session and verify the actual
site, not just a dashboard success message. For a mainland China audience, ask
for a check from the intended network; if unavailable, mark that check pending.

## 6. Hand over a site they can maintain

Provide the working URL, site files or editing access, image credits, chosen
hosting/domain services, known recurring costs, and short instructions to replace
a photograph or update a project. Explain which actions publish changes.
Complete the [launch checklist](references/curation.md#launch-checklist), recording
any checks that could not be completed. Share or promote the site only if asked.

## Scope and recovery

Portfolio galleries, about, and contact are the starting scope. Stores, client
proofing, and standalone sequencing are separate work. If a step fails, preserve
the files and current account state, explain what happened, and try a relevant
fix. Do not silently switch hosting platforms or restart the whole survey. Without
computer-use tools, continue in Guide mode rather than claiming to control a mouse.
