/**
 * Validates registry.json against the skills schema. CI gate.
 * Usage: pnpm validate:registry
 */
import { readFileSync, existsSync } from 'node:fs'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifestSchema } from '../src/skills-schema.ts'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const registryPath = join(repoRoot, 'registry.json')

if (!existsSync(registryPath)) {
  console.error(`registry.json not found at ${registryPath}. Run \`pnpm build:registry\` first.`)
  process.exit(1)
}

const result = manifestSchema.safeParse(JSON.parse(readFileSync(registryPath, 'utf8')))
if (!result.success) {
  console.error('registry.json is invalid:')
  console.error(JSON.stringify(result.error.issues, null, 2))
  process.exit(1)
}

// eslint-disable-next-line no-console
console.log(`registry.json is valid — ${result.data.skills.length} skill(s).`)
