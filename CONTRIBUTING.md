# Contributing to Photo Reason Skills

Thanks for helping photographers! This guide covers how to add or change a skill.

## Authoring a skill

1. Copy `skills/_template/` to `skills/<your-skill-name>/` (kebab-case name).
2. Fill in `SKILL.md`:
   - Frontmatter `name` (must match the directory) and `description` (a
     trigger-oriented sentence — when should an agent reach for this skill?).
   - The body is the guide the agent follows. Write for the reader of the
     skill's audience — for beginner skills, that means **plain language, no
     jargon**, one step at a time.
3. Fill in `registry.yaml` (website-facing metadata — see the template comments).
4. Add any `references/`, `templates/`, or `assets/` the skill needs.
5. Regenerate and validate the registry:

   ```bash
   pnpm build:registry
   pnpm validate:registry
   ```

6. Commit the skill **and** the updated `registry.json`.

## Rules

- **Directory name = `SKILL.md` `name` = the registry `id`.** Keep them in sync.
- Keep `SKILL.md` frontmatter minimal (`name`, `description`) so it stays
  portable across every agent platform. Rich site metadata goes in
  `registry.yaml`.
- `pnpm build:registry` must produce a `registry.json` that
  `pnpm validate:registry` accepts. CI enforces this.
- Bump the version with `.version-bump.json` when cutting a release; run
  `pnpm sync:plugins` to confirm the per-platform manifests agree.

## Commits

- Write clear, conventional commit messages.
- This is a public repository — do not include automated-tool authorship
  trailers. Commit under your own identity.

## Code of Conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
