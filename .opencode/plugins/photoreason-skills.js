/**
 * Photo Reason Skills plugin for OpenCode.ai
 *
 * Registers the skills directory so OpenCode discovers Photo Reason skills
 * without manual symlinks. Unlike a session-start methodology, these are an
 * on-demand content library, so nothing is force-injected — skills load when
 * the user (or the model) invokes them via OpenCode's native `skill` tool.
 */

import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const PhotoReasonSkillsPlugin = async () => {
  const skillsDir = path.resolve(__dirname, '../../skills')

  return {
    // Inject the skills path into live config so OpenCode discovers our skills.
    config: async (config) => {
      config.skills = config.skills || {}
      config.skills.paths = config.skills.paths || []
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir)
      }
    },
  }
}
