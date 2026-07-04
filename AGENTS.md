# AGENTS.md — Photo Reason Skills

Open-source skills library for photographers. This repo is the **single source
of truth** for the skills shown on photoreason.com/lab.

## Hard rules

- **This repository is public.** Never include automated-tool authorship in
  commits (no `Co-Authored-By` trailers for assistants). Commit under the
  human author's own git identity.
- **Keep `SKILL.md` frontmatter minimal** (`name`, `description`) for
  cross-platform portability. Website metadata lives in each skill's
  `registry.yaml`.
- **Directory name = `SKILL.md` name = registry `id`.**

## Layout

- `skills/<name>/` — one skill each: `SKILL.md` + `registry.yaml` (+ optional
  `references/`, `templates/`, `assets/`).
- `skills/_template/` — copy this to start a new skill.
- `src/skills-schema.ts` — zod schema; mirrors photoreason.com's schema exactly.
- `scripts/build-registry.ts` — `skills/*/` → `registry.json`.
- `scripts/validate-registry.ts` — CI gate.
- `.claude-plugin/`, `.codex-plugin/`, `.cursor-plugin/`, `.kimi-plugin/`,
  `.opencode/`, `.pi/`, `gemini-extension.json` — per-platform plugin manifests.

## Commands

```bash
pnpm install
pnpm build:registry     # regenerate registry.json
pnpm validate:registry  # validate against the schema
pnpm test               # generator unit tests
pnpm sync:plugins       # confirm per-platform manifest versions agree
```

## Workflow

After adding or editing a skill, always run `pnpm build:registry` and commit the
updated `registry.json` alongside the skill.
