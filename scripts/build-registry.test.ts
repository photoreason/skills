import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { buildManifest, withoutTimestamps } from './build-registry.ts'
import { manifestSchema } from '../src/skills-schema.ts'

/** Create a throwaway skills/ dir with one valid skill and return its path. */
function makeFixtureSkillsDir(): string {
  const root = mkdtempSync(join(tmpdir(), 'prskills-'))
  const skillDir = join(root, 'demo-skill')
  mkdirSync(skillDir, { recursive: true })
  writeFileSync(
    join(skillDir, 'SKILL.md'),
    `---\nname: demo-skill\ndescription: A demo skill used only in tests.\n---\n\n# Demo\n`,
  )
  writeFileSync(
    join(skillDir, 'registry.yaml'),
    [
      'blurb: A one-line demo blurb.',
      'longDescription: A longer paragraph describing the demo skill for the website.',
      'tags: [demo, test]',
      'featured: true',
      'universalCommand: /demo-skill',
      'installTargets:',
      '  - assistant: claude',
      '    label: Claude Code',
      '    command: /plugin marketplace add photoreason/skills',
      'sampleVisuals: []',
      'license: MIT',
    ].join('\n'),
  )
  // A dir that must be ignored by the generator.
  mkdirSync(join(root, '_template'), { recursive: true })
  return root
}

test('buildManifest produces a schema-valid manifest with the skill', () => {
  const skillsDir = makeFixtureSkillsDir()
  try {
    const manifest = buildManifest(skillsDir)
    const parsed = manifestSchema.safeParse(manifest)
    assert.equal(parsed.success, true, JSON.stringify(parsed.error?.issues))
    assert.equal(manifest.skills.length, 1)
    const skill = manifest.skills[0]!
    assert.equal(skill.id, 'demo-skill')
    assert.equal(skill.name, 'demo-skill')
    assert.equal(skill.blurb, 'A one-line demo blurb.')
    assert.equal(skill.repoPath, 'skills/demo-skill')
    assert.equal(skill.featured, true)
    assert.deepEqual(skill.tags, ['demo', 'test'])
    assert.equal(skill.installTargets.length, 1)
    assert.equal(skill.scan.status, 'pass')
    assert.equal(skill.counts.installs, 0)
  } finally {
    rmSync(skillsDir, { recursive: true, force: true })
  }
})

test('rebuilds differing only in timestamps compare as unchanged', () => {
  const skillsDir = makeFixtureSkillsDir()
  try {
    const a = buildManifest(skillsDir)
    const b = buildManifest(skillsDir)
    b.generatedAt = '1999-01-01T00:00:00.000Z'
    b.skills[0]!.scan.scannedAt = '1999-01-01'
    assert.equal(
      JSON.stringify(withoutTimestamps(a)),
      JSON.stringify(withoutTimestamps(b)),
      'timestamp-only differences must be ignored',
    )
    b.skills[0]!.blurb = 'changed'
    assert.notEqual(
      JSON.stringify(withoutTimestamps(a)),
      JSON.stringify(withoutTimestamps(b)),
      'content differences must be detected',
    )
  } finally {
    rmSync(skillsDir, { recursive: true, force: true })
  }
})

test('buildManifest ignores _template and dirs without SKILL.md', () => {
  const skillsDir = makeFixtureSkillsDir()
  try {
    mkdirSync(join(skillsDir, 'not-a-skill'), { recursive: true })
    const manifest = buildManifest(skillsDir)
    assert.deepEqual(
      manifest.skills.map((s) => s.id),
      ['demo-skill'],
    )
  } finally {
    rmSync(skillsDir, { recursive: true, force: true })
  }
})


test('published guide survives registry generation in all supported languages', () => {
  const dir = fileURLToPath(new URL('../skills/', import.meta.url))
  const manifest = manifestSchema.parse(buildManifest(dir))
  const skill = manifest.skills.find((entry) => entry.id === 'portfolio-site-builder')!
  assert.equal(skill.universalCommand.startsWith('npx skills add '), true)
  assert.equal(skill.demoPath, 'portfolio-study/index.html')
  for (const locale of ['en', 'ja', 'zh-hans'] as const) {
    assert.ok(skill.guide?.[locale].steps.length)
    assert.ok(skill.guide?.[locale].firstPrompt)
    assert.ok(skill.guide?.[locale].principles.length)
  }
  const example = new URL('../skills/portfolio-site-builder/examples/' + skill.demoPath, import.meta.url)
  assert.ok(readFileSync(example, 'utf8').includes('content/site.js'))
})


test('editorial metadata key order does not force a timestamp-only registry rewrite', () => {
  const dir = fileURLToPath(new URL('../skills/', import.meta.url))
  const source = buildManifest(dir)
  const encoded = JSON.parse(JSON.stringify(source))
  const parsed = manifestSchema.parse(encoded)
  assert.equal(JSON.stringify(withoutTimestamps(source)), JSON.stringify(withoutTimestamps(parsed)))
})
