# Contributing to Photo Reason Skills

Thanks for helping photographers! This guide covers how to add or change a skill.

## Authoring a skill

1. Copy `skills/_template/` to `skills/<your-skill-name>/` (kebab-case name),
   then rename `SKILL.md.example` to `SKILL.md`.
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

## Instruction quality and verification

Keep the entrypoint focused on the decisions shared by every run. Link conditional
procedures at the stage that needs them; do not ask an assistant to load every
reference, template source, or example at startup. Keep implementation assets out
of instruction prose. Remove duplication before adding another reference layer.

For the portfolio builder, conversation language is the first question; website
languages and currency remain separate. Exercise both guided and available
computer-use paths, existing-domain users, and mainland-audience users. Check
that explicit choices survive follow-up work and that missing tools lead to
honest guidance. These behavior reviews complement automated checks; validators
do not prove that an assistant will follow every instruction.

Run the repository checks after a skill/template change:

```bash
pnpm test
pnpm typecheck
pnpm build:registry
pnpm validate:registry
pnpm sync:plugins
pnpm exec playwright install chromium  # once on a new development machine
pnpm test:browser
```

Browser tests open the packaged working study directly via `file://`, covering
local/offline operation, all three locales, gallery navigation and focus, zoom/pan,
mobile layout, and empty/broken-image cases. The template itself needs no package
installation or build. Keep the working study's HTML/CSS/runtime in sync with the
shipped template; its content and original illustrations are separate fixtures.

When comparing instruction size, name the tokenizer and distinguish entrypoint
size from references loaded for a particular task. Do not claim that a smaller
file guarantees lower total session usage or better behavior.

## Commits

- Write clear, conventional commit messages.
- This is a public repository — do not include automated-tool authorship
  trailers. Commit under your own identity.

## Code of Conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).
