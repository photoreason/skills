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
  // Socket (socket.dev) gates every pull request on this repo — it is the
  // security platform behind the scan badge shown on photoreason.com/lab.
  socket: z.enum(['pass', 'fail', 'na']),
  status: z.enum(['pass', 'fail']),
  scannedAt: z.string(),
})


const guideSectionSchema = z.object({ title: z.string(), body: z.string() })
export const skillGuideSchema = z.object({
  intro: z.string(),
  overview: z.string(),
  demoTitle: z.string(),
  demoCaption: z.string(),
  demoPrompt: z.string(),
  revision: z.string(),
  revisionNote: z.string(),
  prepare: z.string(),
  firstPrompt: z.string(),
  steps: z.array(guideSectionSchema).min(1),
  principles: z.array(guideSectionSchema).min(1),
  making: z.array(guideSectionSchema).min(1),
  references: z.array(z.object({ title: z.string(), url: z.string().url(), reason: z.string() })),
})

export const skillSchema = z.object({
  id: z.string(),
  name: z.string(),
  blurb: z.string(),
  longDescription: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
  studyNumber: z.number().int().positive().optional(),
  installTargets: z.array(installTargetSchema).min(1),
  universalCommand: z.string(),
  scan: scanStatusSchema,
  sampleVisuals: z.array(z.string()),
  demoPath: z.string().regex(/^[a-z0-9-]+\/index\.html$/).optional(),
  guide: z.object({ en: skillGuideSchema, ja: skillGuideSchema, 'zh-hans': skillGuideSchema }).optional(),
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
