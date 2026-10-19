/** Generate URL-safe catalogs from the native manifests. No source URL is user supplied. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export function buildMarketplaces(root: string) {
  const read = (path: string) => JSON.parse(readFileSync(resolve(root, path), 'utf8'))
  const claude = read('.claude-plugin/marketplace.json')
  const codex = read('.agents/plugins/marketplace.json')
  const kimi = read('.kimi-plugin/marketplace.json')
  // A standalone JSON catalog has no local repo tree. Its plugins need absolute sources.
  const git = 'https://github.com/photoreason/skills.git'
  return {
    codex: { ...codex, plugins: codex.plugins.map((plugin: Record<string, unknown>) => ({ ...plugin, source: { source: 'url', url: git } })) },
    claude: { ...claude, plugins: claude.plugins.map((plugin: Record<string, unknown>) => ({ ...plugin, source: { source: 'url', url: git } })) },
    kimi,
  }
}

if (process.argv[1]?.endsWith('build-marketplaces.ts')) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const out = resolve(root, 'distribution/marketplaces.json')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, JSON.stringify(buildMarketplaces(root), null, 2) + '\n')
  console.log('Wrote URL-safe Codex, Claude, and Kimi marketplace catalogs')
}
