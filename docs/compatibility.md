# Using Portfolio Site Builder across assistants

The workflow and template live in one portable folder:
`skills/portfolio-site-builder/`. Keep `SKILL.md`, `references/`, `templates/`,
and `assets/` together. Installing only the Markdown entrypoint loses the
working template. The skill asks for the conversation language first and uses
only tools the host actually provides.

## Installation and invocation

| Host | Install | Start the workflow |
| --- | --- | --- |
| Codex | `codex plugin marketplace add photoreason/skills`, then install Photo Reason Skills in Plugins | `$portfolio-site-builder`, or ask for it by name |
| Claude Code | `/plugin marketplace add photoreason/skills`, then `/plugin install photoreason-skills@photoreason-skills` | `/photoreason-skills:portfolio-site-builder`, or ask for it by name |
| Kimi Code | `/plugins marketplace https://raw.githubusercontent.com/photoreason/skills/main/.kimi-plugin/marketplace.json`, then select Photo Reason Skills and `/reload` | `/skill:photoreason-skills:portfolio-site-builder`, or ask for it by name |
| Grok Build | Uses the existing Claude-compatible plugin and marketplace; select it through Grok's `/plugins` interface | Select the installed skill in `/skills`, or ask for it by name |
| Grok Bot | Give the Bot the complete skill folder on its computer and ask it to follow `SKILL.md`; use its own skills library to save a reusable workflow if available | Ask for Portfolio Site Builder by name, identifying the supplied folder |

Codex uses `.codex-plugin/plugin.json`; Claude uses `.claude-plugin/plugin.json`
and the default root `skills/` directory; Kimi uses `.kimi-plugin/plugin.json`.
They share the same files. Grok Build documents automatic support for Claude
Code marketplaces, plugins and skills, so there is no second Grok copy to maintain.

**Grok Bot and Grok Build are different installation surfaces.** Grok Bot's
Connect apps/private-skills interface is not a verified custom-Git marketplace
installer. Do not paste a fabricated Grok Bot marketplace command. With the folder
available, a suitable first request is:

> Use Portfolio Site Builder from the complete skill folder I supplied. Read
> SKILL.md first and load its referenced files only when needed. Ask my preferred
> chat language, then help with costs, resources, the included template, preview
> and publishing. Preserve my selection and sequence. Tell me which filesystem,
> preview and browser tools are actually available before offering to use them.

For a local skill installation (rather than a plugin), use that host's own
skill directory; its invocation name may not include the plugin namespace.
In particular, Kimi's bare `/skill:portfolio-site-builder` is not the command
for the plugin-installed skill. Update/reload the plugin when its files change.

## What has been verified

- The three native manifests resolve to the same packaged skill tree, and its
  relative references and template assets are checked locally.
- Claude's official `plugin validate` accepts the plugin and marketplace,
  including the PB. listing icon. This validator is not a marketplace safety review.
- Installed Codex CLI 0.159.3 accepts local directories and Git sources in the
  marketplace command's help. This is command-syntax evidence, not a fresh
  desktop installation test.
- The included template has real offline/browser and public Cloudflare checks
  recorded in the portfolio trial. These prove template behavior, not model
  behavior in every assistant.
- Kimi and Grok routes are checked against current official documentation.
  Authenticated Kimi, Grok Build and Grok Bot installation/conversation sessions
  remain to be smoke-tested in those apps. Do not describe them as end-to-end tested.

Computer-use support comes from the host or a separately installed tool, not from
this skill. A browser on a Bot's cloud computer is not the user's local mouse.
If a required tool or account is unavailable, use guided steps and hand back the
specific screen; retain the workflow's preview and publication checkpoints.

## Primary references

- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude plugin manifest and validation](https://code.claude.com/docs/en/plugins-reference)
- [Kimi plugins, manifest discovery and qualified Skill names](https://moonshotai.github.io/kimi-code/en/customization/plugins.html)
- [Grok Build skills and Claude compatibility](https://docs.x.ai/build/features/skills-plugins-marketplaces)
- [Grok Bot skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations)
