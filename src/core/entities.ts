import { z } from 'zod'

// Base types
export const BaseNodeSchema = z.object({
  id: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const LocalisedNameSchema = z.object({
  cn: z.string(),
  pinyin: z.string(),
  latin: z.string().optional(),
  en: z.string().optional(),
})

export const ImageBundleSchema = z.object({
  thumbnail: z.string().url(),
  medium: z.string().url().optional(),
  large: z.string().url().optional(),
  alt: z.string(),
})

export const AuthenticRegionSchema = z.object({
  province: z.string(),
  city: z.string().optional(),
  description: z.string().optional(),
})

// Enums
export const QiTypeSchema = z.enum(['warm', 'hot', 'neutral', 'cool', 'cold'])
export const FlavorTypeSchema = z.enum(['sweet', 'sour', 'bitter', 'spicy', 'salty', 'bland'])
export const MeridianTypeSchema = z.enum([
  'lung',
  'largeIntestine',
  'stomach',
  'spleen',
  'heart',
  'smallIntestine',
  'bladder',
  'kidney',
  'pericardium',
  'tripleWarmer',
  'gallbladder',
  'liver',
])

// Publication and Apprentice schemas
export const PublicationSchema = z.object({
  id: z.string(),
  title: z.string(),
  year: z.number(),
  journal: z.string().optional(),
  doi: z.string().optional(),
  url: z.string().url().optional(),
})

export const ApprenticeSchema = z.object({
  id: z.string(),
  name: z.string(),
  title: z.string().optional(),
  institution: z.string().optional(),
})

// Main entities
export const ExpertSchema = BaseNodeSchema.extend({
  name: z.string(),
  avatar: z.string().url().optional(),
  title: z.string(),
  institution: z.string(),
  bio: z.string(),
  specialities: z.array(z.string()),
  yearsOfPractice: z.number().optional(),
  publications: z.array(PublicationSchema).optional(),
  apprentices: z.array(ApprenticeSchema).optional(),
  recommendedHerbs: z.array(z.string()),
  classicalFormulas: z.array(z.string()),
})

export const HerbSchema = BaseNodeSchema.extend({
  name: LocalisedNameSchema,
  qi: QiTypeSchema,
  flavor: z.array(FlavorTypeSchema),
  meridians: z.array(MeridianTypeSchema),
  category: z.string(),
  origin: z.array(AuthenticRegionSchema),
  images: ImageBundleSchema,
  clinicalUses: z.array(z.string()),
  recommendedBy: z.array(z.string()),
})

export const FormulaSchema = BaseNodeSchema.extend({
  name: LocalisedNameSchema,
  source: z.string(),
  dynasty: z.string().optional(),
  description: z.string(),
  ingredients: z.array(
    z.object({
      herbId: z.string(),
      amount: z.number(),
      unit: z.string(),
      role: z.enum(['monarch', 'minister', 'assistant', 'guide']),
    })
  ),
  preparation: z.string(),
  dosage: z.string(),
  indications: z.array(z.string()),
  contraindications: z.array(z.string()).optional(),
  modernApplications: z.array(z.string()).optional(),
})

// Relation schema
export const RelationTypeSchema = z.enum([
  'EXPERT_RECOMMENDS_HERB',
  'EXPERT_PUBLISHES_PAPER',
  'HERB_IN_FORMULA',
  'EXPERT_INHERITS_LINEAGE',
])

export const RelationSchema = z.object({
  fromId: z.string(),
  toId: z.string(),
  type: RelationTypeSchema,
  metadata: z.record(z.any()).optional(),
})

// Database schema
export const DatabaseSchema = z.object({
  version: z.string(),
  lastUpdated: z.string().datetime(),
  experts: z.array(ExpertSchema),
  herbs: z.array(HerbSchema),
  formulas: z.array(FormulaSchema),
  relations: z.array(RelationSchema),
})

// Type exports
export type BaseNode = z.infer<typeof BaseNodeSchema>
export type LocalisedName = z.infer<typeof LocalisedNameSchema>
export type ImageBundle = z.infer<typeof ImageBundleSchema>
export type AuthenticRegion = z.infer<typeof AuthenticRegionSchema>
export type QiType = z.infer<typeof QiTypeSchema>
export type FlavorType = z.infer<typeof FlavorTypeSchema>
export type MeridianType = z.infer<typeof MeridianTypeSchema>
export type Publication = z.infer<typeof PublicationSchema>
export type Apprentice = z.infer<typeof ApprenticeSchema>
export type Expert = z.infer<typeof ExpertSchema>
export type Herb = z.infer<typeof HerbSchema>
export type Formula = z.infer<typeof FormulaSchema>
export type RelationType = z.infer<typeof RelationTypeSchema>
export type Relation = z.infer<typeof RelationSchema>
export type Database = z.infer<typeof DatabaseSchema>
