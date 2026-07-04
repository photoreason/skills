# Authoring a skill

Each skill is one directory here. To create one:

1. Copy `_template/` to `<your-skill-name>/` (kebab-case).
2. Edit `SKILL.md`:
   - `name` frontmatter must equal the directory name.
   - `description` is trigger-oriented: *when* should an agent use this skill?
   - The body is the guide the agent follows. Match the audience — beginner
     skills use plain language, no jargon, one step at a time.
3. Edit `registry.yaml` (website metadata — see comments in the template).
4. Add `references/`, `templates/`, or `assets/` as needed.
5. Run `pnpm build:registry && pnpm validate:registry`, then commit the skill
   plus the updated `registry.json`.

## Anatomy

```
<skill-name>/
├── SKILL.md        required — frontmatter (name, description) + guide body
├── registry.yaml   required — blurb, longDescription, tags, installTargets, …
├── references/     optional — deep-dive docs the SKILL.md links to
├── templates/      optional — files the skill fills in for the user
└── assets/         optional — images, sample visuals
```

See `../skills/portfolio-site-builder/` for a complete example.
