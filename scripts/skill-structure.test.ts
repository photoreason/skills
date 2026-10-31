import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { parse } from 'yaml'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const skill = resolve(root, 'skills/portfolio-site-builder')

test('portable instructions have consistent identity and resolvable local references', () => {
  const entry = readFileSync(resolve(skill, 'SKILL.md'), 'utf8')
  const { data } = matter(entry)
  assert.deepEqual(Object.keys(data).sort(), ['description', 'name'])
  assert.equal(data.name, 'portfolio-site-builder')
  assert.ok(typeof data.description === 'string' && data.description.trim())
  const references = readdirSync(resolve(skill, 'references')).filter((name) =>
    name.endsWith('.md'),
  )
  for (const name of references)
    assert.ok(
      entry.includes(`references/${name}`),
      `${name} must be discoverable`,
    )
  for (const file of [
    resolve(skill, 'SKILL.md'),
    ...references.map((name) => resolve(skill, 'references', name)),
  ]) {
    for (const match of readFileSync(file, 'utf8').matchAll(/\]\(([^)]+)\)/g)) {
      const href = match[1]!.split('#')[0]!
      if (!href || /^[a-z]+:/i.test(href)) continue
      const target = resolve(dirname(file), href)
      assert.ok(
        target.startsWith(skill + '/'),
        `${href} leaves the packaged skill`,
      )
      assert.ok(existsSync(target), `${file}: missing ${href}`)
    }
  }
  const metadata = parse(
    readFileSync(resolve(skill, 'agents/openai.yaml'), 'utf8'),
  )
  for (const field of ['icon_small', 'icon_large'])
    assert.ok(existsSync(resolve(skill, metadata.interface[field])))
})

test('the working study runs the shipped template rather than a divergent implementation', () => {
  for (const file of ['app.js', 'styles.css', 'index.html']) {
    assert.equal(
      readFileSync(resolve(skill, 'examples/portfolio-study', file), 'utf8'),
      readFileSync(resolve(skill, 'templates/portfolio', file), 'utf8'),
      `${file} drifted from the portable template`,
    )
  }
})
