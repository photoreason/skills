# Photo Reason Skills

[简体中文](README.zh-Hans.md) · English

Open-source agent skills for photographers. Photo Reason Skills helps
photographers—including people with no technical background—build portfolio
websites, curate and sequence work, and complete creative workflows with Claude,
Codex, Kimi Code, Gemini, Cursor, OpenCode, and Pi.

The skills in this repository are the source of truth for
[Photo Reason Lab](https://www.photoreason.art/en/lab).

## Available skills

| Skill | What it does |
| --- | --- |
| [`portfolio-site-builder`](skills/portfolio-site-builder/) | Guides a photographer from costs and curation to a published, trilingual portfolio website—without assuming technical experience. |

## Install

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
/skill:portfolio-site-builder
```

You can also say, “Help me build a portfolio website for my photography.” Kimi
may select the skill automatically when the request matches its description.

### Claude Code

```text
/plugin marketplace add photoreason/skills
/plugin install photoreason-skills@photoreason-skills
```

### Codex

```bash
codex plugin marketplace add photoreason/skills
```

Restart the ChatGPT desktop app, open **Plugins**, choose the Photo Reason
marketplace, and install **Photo Reason Skills**. Invoke the skill explicitly
with `$portfolio-site-builder`, or describe the portfolio task naturally.

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
