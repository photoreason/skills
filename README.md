# Photo Reason Skills

[简体中文](README.zh-Hans.md) · English

Open-source agent skills for photographers, with Codex as the primary installation
experience and native manifests for Claude Code and Kimi Code. This release
contains one skill: Portfolio Site Builder, from a selection of photographs to a
published website.

Portfolio building stays one skill. A dedicated photo-sequencing workflow belongs
in its own skill and marketplace entry when it is ready; it is not included or
advertised as an available skill here. Existing selections and sequences remain
the photographer's decisions.

The skills in this repository are the source of truth for
[Photo Reason Lab](https://www.photoreason.art/en/lab).

## Two ways to work

Guide mode walks the user through costs → photographs, text, and domain resources
→ the included template → preview → publication on Cloudflare Pages or Squarespace.
Computer-use mode follows the same flow, with user-granted browser/computer control
for difficult steps when the host supplies that capability. Users can take control
back at any time. Cloudflare is the recommended template host, including for mainland
China audiences; real network access still needs testing.

## Available skills

| Skill | What it does |
| --- | --- |
| [`portfolio-site-builder`](skills/portfolio-site-builder/) | Guides a photographer from costs and curation to a published, trilingual portfolio website—without assuming technical experience. |

## A first portfolio, step by step

Start with the [Portfolio Site Builder guide](skills/portfolio-site-builder/README.md):
a working layout study, what to prepare, the first message to send, and the
principles behind the template. The study uses original illustrations in place
of photographs and is clearly labeled as a demonstration.

For a coding assistant that reads skills, install from your website project folder:

```sh
npx skills add photoreason/skills --skill portfolio-site-builder
```

Choose your assistant, open a new session, and describe the portfolio you want.
Installation and publication are separate steps. Other installation methods follow.

## Photo Reason marketplace URLs

The branded entry points are:

| Client | Add this source |
| --- | --- |
| Codex desktop / CLI | `https://photoreason.art/marketplace/codex.git` (Git repository alias) |
| Claude Code | `https://photoreason.art/marketplace/claude/marketplace.json` |
| Kimi Code | `https://photoreason.art/marketplace/kimi/marketplace.json` |

For Codex, register the Git source with `codex plugin marketplace add <Git URL>`,
then restart the desktop app, choose **Photo Reason Skills** in the plugin browser,
and install the plugin. Refresh later with `codex plugin marketplace upgrade photoreason-skills`,
then review available plugin updates in the desktop UI. The existing GitHub source remains valid.
A standalone JSON URL is **not** a supported Codex marketplace add source.

For Claude Code, run `/plugin marketplace add <Claude JSON URL>`, then
`/plugin install photoreason-skills@photoreason-skills`. The URL-hosted catalog uses
an absolute public Git source, so it does not depend on a nonexistent relative folder.
The install panel in `/lab/skills` includes the full steps and update commands.

The Git alias redirects read-only Git discovery/fetch to the canonical public repository.
It does not mirror Git objects or remove the client's need to reach GitHub. The JSON
catalogs are generated from this repository. The website refreshes the published catalogs
with a five-minute cache and falls back to its committed snapshot during an outage.
Run `pnpm build:registry` here and `pnpm skills:sync --source <checkout>` in the site
when updating that fallback and the example assets.
Keep the skills release and the website fallback snapshot in sync.

Sources: [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins),
[Codex CLI marketplace commands](https://learn.chatgpt.com/docs/cli/reference),
[Claude marketplace hosting](https://code.claude.com/docs/en/plugins/host-marketplace).

## Before adding the Codex marketplace on a Mac

Codex uses Git to download a Git marketplace. On a new Mac, Apple's Command Line
Tools may need to be installed first. Full Xcode is not required.

1. Open Terminal and run `git --version`.
2. If macOS offers to install developer tools, accept and finish the installation.
   You can also start it with `xcode-select --install`.
3. Run `git --version` again. Once it prints a version, quit and reopen Codex,
   then retry adding the marketplace.

An `xcode-select: No developer tools were found` error happens before the clone
can read this repository. Changing our Git URL, adding a manifest, or using a
JSON catalog cannot fix that local prerequisite. If Xcode is already installed,
open it once and finish its setup; see Apple's guidance if the active developer
tools location still needs correcting. Do not change it to a guessed path.

[Apple: installing command-line tools](https://developer.apple.com/documentation/xcode/installing-the-command-line-tools/)

### Without Git

If you prefer to avoid Git, download **Code → Download ZIP** from this repository
and extract it into a permanent folder. In a Codex version with the CLI's local
marketplace support, register that extracted folder, then install the plugin:

```sh
codex plugin marketplace add "/full/path/to/skills-main"
codex plugin add photoreason-skills@photoreason-skills
```

Replace the example path with your extracted folder. This local route bypasses
Git cloning; it does not receive Git marketplace upgrades. For updates, download
the new ZIP and register/reinstall the local source. Do not paste a ZIP or JSON
URL into the Git marketplace field.

## Install

### Codex

```bash
codex plugin marketplace add photoreason/skills
```

Quit and reopen Codex, open **Plugins**, choose the Photo Reason
marketplace, and install **Photo Reason Skills**. Invoke the skill explicitly
with `$portfolio-site-builder`, or describe the portfolio task naturally.


### Kimi Code

For update notifications, browse the Photo Reason marketplace inside Kimi Code:

```text
/plugins marketplace https://raw.githubusercontent.com/photoreason/skills/main/.kimi-plugin/marketplace.json
```

Choose **Photo Reason Skills**, confirm that you trust this third-party plugin,
then run `/reload` or `/new`.

For a quick test, install directly from GitHub instead:

```text
/plugins install https://github.com/photoreason/skills
/reload
```

Start the portfolio workflow with:

```text
/skill:photoreason-skills:portfolio-site-builder
```

You can also say, “Help me build a portfolio website for my photography.” Kimi
may select the skill automatically when the request matches its description.

### Claude Code

```text
/plugin marketplace add photoreason/skills
/plugin install photoreason-skills@photoreason-skills
```

### Grok Build and Grok Bot

Grok Build supports Claude-compatible plugins and can reuse this repository's
existing marketplace and skill tree. Use its `/plugins` and `/skills` interfaces.

Grok Bot has a different skills library. Supply the **complete**
`skills/portfolio-site-builder/` folder to its computer and ask it to read
`SKILL.md`; do not provide only the entrypoint or assume the Codex marketplace
command works in Grok Bot. Its authenticated app installation flow still needs
a smoke test.

See the [compatibility notes](docs/compatibility.md) for invocation names,
what has been verified, and the distinction between these two Grok products.

### Other clients

The portable `SKILL.md` is independent of the model provider. A DeepSeek-backed
setup uses the installation method of its host (for example Codex or OpenCode);
we do not claim a separate DeepSeek marketplace format or a tested native
DeepSeek integration.

### Gemini CLI

Install this repository as an extension using `gemini-extension.json`.

### Cursor

Add `github.com/photoreason/skills` through Cursor's plugin manager. The plugin
manifest is in `.cursor-plugin/plugin.json`.

### OpenCode and Pi

- OpenCode: see [`.opencode/INSTALL.md`](.opencode/INSTALL.md).
- Pi: load the extension in `.pi/extensions/photoreason-skills.ts`.

## Updates and versioning

Releases follow [Semantic Versioning](https://semver.org/):

- **Patch** (`0.1.1`): fixes and wording improvements that preserve the workflow.
- **Minor** (`0.2.0`): new skills or meaningful backward-compatible features.
- **Major** (`1.0.0` → `2.0.0`): changes that require users to adjust how they
  install or use the plugin.

Kimi Code does not silently replace installed third-party plugins. Marketplace
installations can show an update badge and a one-time notice after an outdated
plugin is used; the user confirms the update, then runs `/reload` or `/new`.
Direct GitHub installations can be refreshed by running the install command
again.

Update behavior by client:

| Client | Update behavior |
| --- | --- |
| **Kimi Code** | Marketplace installs show an update badge and can give a one-time outdated-plugin notice; the user confirms and reloads. |
| **Claude Code** | Supports automatic marketplace and plugin updates at startup. Auto-update is off by default for third-party marketplaces; enable it under `/plugin` → **Marketplaces**. Claude then asks for `/reload-plugins` after an update. |
| **Codex** | Refresh the source with `codex plugin marketplace upgrade photoreason-skills`, then apply the available update in the Plugins UI. |
| **Cursor, Gemini, OpenCode, Pi** | Receive the same versioned files, but update discovery and installation depend on the host. Check or reinstall when a Photo Reason release is announced. |

All platform manifests share one release version, so one Photo Reason release
describes the same skill contents across supported clients even when their
update interfaces differ.

For maintainers, every release should:

1. Update all version fields listed in `.version-bump.json`.
2. Run `pnpm sync:plugins` and the full test suite.
3. Commit the version change, tag it as `vX.Y.Z`, and publish a GitHub Release.

Ordinary commits do not bump the public version. This keeps update notices tied
to intentional, tested releases.

## Repository structure

```text
skills/<name>/
├── SKILL.md        portable workflow metadata and instructions
├── registry.yaml   Photo Reason Lab metadata
└── …               optional references, templates, and assets
```

The registry generator turns `skills/*/` into the committed `registry.json`:

```bash
pnpm install
pnpm build:registry
pnpm validate:registry
pnpm test
pnpm sync:plugins
```

## Contributing

Contributions and photographer feedback are welcome. Read
[CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md) before opening a pull request.

## Security

Please do not open a public issue for a suspected vulnerability. Read
[SECURITY.md](SECURITY.md) and contact
[contact@photoreason.com](mailto:contact@photoreason.com) privately.

## License

[MIT](LICENSE) © Photo Reason.
