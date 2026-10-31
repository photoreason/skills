import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path: string) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))

test('the distributed skill tree exposes only the portfolio workflow', () => {
  const skills = readdirSync(resolve(root, 'skills'), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && existsSync(resolve(root, 'skills', entry.name, 'SKILL.md')))
    .map(entry => entry.name)
  assert.deepEqual(skills, ['portfolio-site-builder'])
  assert.equal(read('registry.json').skills.length, 1)
})

test('Codex branding resolves to a packaged PNG and a real skill prompt', () => {
  const plugin = read('.codex-plugin/plugin.json')
  for (const key of ['logo', 'composerIcon']) {
    const asset = resolve(root, plugin.interface[key])
    assert.ok(asset.startsWith(root + '/'))
    assert.equal(readFileSync(asset).subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  }
  assert.ok(plugin.interface.defaultPrompt.every((prompt: string) => prompt.includes('$portfolio-site-builder')))
})
