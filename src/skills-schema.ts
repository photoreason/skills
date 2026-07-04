import { z } from 'zod'

/**
 * Registry schema for the Photo Reason skills SSoT.
 *
 * This MUST stay in lockstep with photoreason.com/src/lib/skills-schema.ts —
 * the website validates the generated registry.json against the same shape.
 */

export const installTargetSchema = z.object({
  assistant: z.string(),
  label: z.string(),
  command: z.string(),
})

export const scanStatusSchema = z.object({
  snyk: z.enum(['pass', 'fail', 'na']),
  codeql: z.enum(['pass', 'fail', 'na']),
  status: z.enum(['pass', 'fail']),
  scannedAt: z.string(),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  blurb: z.string(),
  longDescription: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
  installTargets: z.array(installTargetSchema).min(1),
  universalCommand: z.string(),
  scan: scanStatusSchema,
  sampleVisuals: z.array(z.string()),
  license: z.string().default('MIT'),
  repoPath: z.string(),
  counts: z.object({ installs: z.number().nonnegative() }),
})

export const manifestSchema = z.object({
  generatedAt: z.string(),
  registryUrl: z.string().url(),
  skills: z.array(skillSchema),
})

export type InstallTarget = z.infer<typeof installTargetSchema>
export type ScanStatus = z.infer<typeof scanStatusSchema>
export type Skill = z.infer<typeof skillSchema>
export type SkillManifest = z.infer<typeof manifestSchema>
