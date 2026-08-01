# Photo Reason Skills

Open-source **agent skills for photographers** — plain-language, conversational
guides that help you build a portfolio website, curate and sequence your work,
and run creative workflows with coding agents like Claude, Codex, and Gemini.

Many of these skills are written for people with **no technical background**.
You don't need to know how to code.

This repository is the **single source of truth** for the skills surfaced at
[photoreason.com/lab](https://photoreason.com/lab).

## Skills

| Skill | What it does |
| --- | --- |
| [`portfolio-site-builder`](skills/portfolio-site-builder/) | Get a real portfolio website online — a site you own (free, drag-and-drop) or a visual builder — with your photos curated and your story written for you. |

More skills are on the way. See [`skills/README.md`](skills/README.md) to author one.

## Install

This library ships as a plugin for every major coding agent. Pick yours:

### Claude Code

```
/plugin marketplace add photoreason/skills
/plugin install photoreason-skills@photoreason-skills
```

### Codex

```bash
codex plugin marketplace add photoreason/skills
```

Then restart the ChatGPT desktop app, open **Plugins**, choose the Photo Reason
marketplace, and install **Photo Reason Skills**.

### Cursor / Kimi

Add the plugin from `github.com/photoreason/skills` via your agent's plugin
manager (each reads its own `.<agent>-plugin/plugin.json`).

### Gemini CLI

Install as an extension pointing at this repo (`gemini-extension.json`).

### OpenCode

See [`.opencode/INSTALL.md`](.opencode/INSTALL.md).

## How it works

```
skills/<name>/
├── SKILL.md        the guide the agent follows (portable: name + description frontmatter)
├── registry.yaml   website-facing metadata (blurb, tags, install targets, …)
└── …               references/, templates/, assets/ as the skill needs
```

A TypeScript generator turns every skill into a schema-valid `registry.json`
that the website consumes:

```bash
pnpm install
pnpm build:registry     # skills/*/ → registry.json
pnpm validate:registry  # zod-validate registry.json (CI gate)
pnpm test               # generator unit tests
```

`registry.json` is committed and served at
`https://raw.githubusercontent.com/photoreason/skills/main/registry.json`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE) © Photo Reason.
