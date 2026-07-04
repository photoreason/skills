import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { buildManifest } from './build-registry.ts'
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
