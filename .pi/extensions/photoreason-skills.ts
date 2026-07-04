import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { ExtensionAPI } from '@earendil-works/pi-coding-agent'

/**
 * Photo Reason Skills extension for Pi.
 *
 * Registers the skills directory for discovery. These are an on-demand content
 * library, so nothing is injected at session start — skills load when invoked.
 */

const extensionDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(extensionDir, '../..')
const skillsDir = resolve(packageRoot, 'skills')

export default function photoreasonSkillsExtension(pi: ExtensionAPI) {
  pi.on('resources_discover', async () => ({
    skillPaths: [skillsDir],
  }))
}
