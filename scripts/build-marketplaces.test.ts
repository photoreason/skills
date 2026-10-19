import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { buildMarketplaces } from './build-marketplaces.ts'

const root = fileURLToPath(new URL('../', import.meta.url))

test('hosted catalogs have absolute plugin sources and preserve collection identity', () => {
  const catalogs = buildMarketplaces(root)
  for (const catalog of [catalogs.codex, catalogs.claude]) {
    assert.equal(catalog.name, 'photoreason-skills')
    assert.equal(catalog.plugins[0].name, 'photoreason-skills')
    assert.deepEqual(catalog.plugins[0].source, { source: 'url', url: 'https://github.com/photoreason/skills.git' })
  }
  assert.equal(catalogs.codex.plugins[0].policy.installation, 'AVAILABLE')
  assert.equal(catalogs.kimi.version, '2')
  assert.equal(catalogs.kimi.plugins[0].source, 'https://github.com/photoreason/skills')
  assert.deepEqual(catalogs, JSON.parse(readFileSync(new URL('../distribution/marketplaces.json', import.meta.url), 'utf8')))
})

test('native Codex marketplace resolves its packaged plugin at the repo root', () => {
  const catalog = JSON.parse(readFileSync(new URL('../.agents/plugins/marketplace.json', import.meta.url), 'utf8'))
  assert.deepEqual(catalog.plugins[0].source, { source: 'local', path: './' })
  const plugin = JSON.parse(readFileSync(new URL('../.codex-plugin/plugin.json', import.meta.url), 'utf8'))
  assert.equal(plugin.name, catalog.plugins[0].name)
  assert.equal(plugin.skills, './skills/')
})
