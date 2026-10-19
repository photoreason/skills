/**
 * Generates registry.json from skills/<id>/{SKILL.md,registry.yaml}.
 *
 * SKILL.md frontmatter supplies the portable fields (name, description); the
 * sibling registry.yaml supplies the website-facing metadata. Dynamic fields
 * the author can't hand-write (scan results, install counts) are filled with
 * safe placeholders here until they are wired to real sources.
 *
 * Usage: pnpm build:registry   (writes ./registry.json)
 */
import { readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'
import { manifestSchema, type Skill, type SkillManifest } from '../src/skills-schema.ts'

const REGISTRY_URL = 'https://github.com/photoreason/skills'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** Read one skill directory into a Skill, or return null if it isn't a skill. */
function readSkill(skillsDir: string, id: string): Skill | null {
  if (id.startsWith('_') || id.startsWith('.')) return null
  const dir = join(skillsDir, id)
  const skillMd = join(dir, 'SKILL.md')
  const registryYaml = join(dir, 'registry.yaml')
  if (!existsSync(skillMd) || !existsSync(registryYaml)) return null

  const { data: frontmatter } = matter(readFileSync(skillMd, 'utf8'))
  const meta = (parseYaml(readFileSync(registryYaml, 'utf8')) ?? {}) as Record<string, unknown>

  const today = new Date().toISOString().slice(0, 10)

  return {
    id,
    // Display name for the website. Prefer registry.yaml's human-readable
    // `name`; fall back to the (kebab-case) SKILL.md frontmatter name.
    name: String(meta.name ?? frontmatter.name ?? id),
    blurb: String(meta.blurb ?? ''),
    longDescription: String(meta.longDescription ?? frontmatter.description ?? ''),
    tags: (meta.tags as string[]) ?? [],
    ...(typeof meta.featured === 'boolean' ? { featured: meta.featured } : {}),
    ...(typeof meta.studyNumber === 'number' ? { studyNumber: meta.studyNumber } : {}),
    installTargets: (meta.installTargets as Skill['installTargets']) ?? [],
    universalCommand: String(meta.universalCommand ?? ''),
    // Socket (socket.dev) scans every PR on this repo, so anything on main has
    // passed it. Install analytics are still a placeholder.
    scan: { socket: 'pass', status: 'pass', scannedAt: today },
    sampleVisuals: (meta.sampleVisuals as string[]) ?? [],
    ...(meta.demoPath ? { demoPath: meta.demoPath as string } : {}),
    ...(meta.guide ? { guide: meta.guide as Skill['guide'] } : {}),
    license: String(meta.license ?? 'MIT'),
    repoPath: `skills/${id}`,
    counts: { installs: Number(meta.installs ?? 0) },
  }
}

/** Build the full manifest from a skills/ directory. */
export function buildManifest(skillsDir: string): SkillManifest {
  const ids = readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort()

  const skills = ids
    .map((id) => readSkill(skillsDir, id))
    .filter((s): s is Skill => s !== null)

  return {
    generatedAt: new Date().toISOString(),
    registryUrl: REGISTRY_URL,
    skills,
  }
}

/** The manifest minus its timestamps — what "actually changed" means. */
export function withoutTimestamps(manifest: SkillManifest): unknown {
  // Normalize schema key order too: nested editorial YAML can use a different order
  // from the parsed committed JSON, without changing the actual content.
  const normalized = manifestSchema.parse(manifest)
  return {
    registryUrl: normalized.registryUrl,
    skills: normalized.skills.map((s) => ({ ...s, scan: { ...s.scan, scannedAt: '' } })),
  }
}

function main(): void {
  const skillsDir = join(repoRoot, 'skills')
  // Keep the validated canonical shape for both comparison and output.
  const manifest = manifestSchema.parse(buildManifest(skillsDir))
  const out = join(repoRoot, 'registry.json')

  // Idempotent build: timestamps (generatedAt, scannedAt) change on every run,
  // so if nothing else did, keep the committed file byte-for-byte — otherwise
  // CI's "registry.json up to date" check could never pass.
  if (existsSync(out)) {
    const existing = manifestSchema.safeParse(JSON.parse(readFileSync(out, 'utf8')))
    if (
      existing.success &&
      JSON.stringify(withoutTimestamps(existing.data)) ===
        JSON.stringify(withoutTimestamps(manifest))
    ) {
      // eslint-disable-next-line no-console
      console.log(`registry.json unchanged (${manifest.skills.length} skill(s))`)
      return
    }
  }

  writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  // eslint-disable-next-line no-console
  console.log(`Wrote ${manifest.skills.length} skill(s) to ${out}`)
}

// Run only when invoked directly (not when imported by tests).
if (process.argv[1] && process.argv[1].endsWith('build-registry.ts')) {
  main()
}
