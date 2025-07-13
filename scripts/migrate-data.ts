import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { z } from 'zod'
import type { Expert, Herb, Formula, Relation, Database } from '../src/core/entities'

// Paths
const DATA_DIR = join(process.cwd(), 'public', 'data')
const NEW_DATA_DIR = join(process.cwd(), 'data', 'v2')

// Helper functions
async function ensureDir(dir: string) {
  try {
    await mkdir(dir, { recursive: true })
  } catch (e) {
    // ignore if exists
  }
}

async function readJSON(path: string) {
  const content = await readFile(path, 'utf-8')
  return JSON.parse(content)
}

async function writeJSON(path: string, data: any) {
  await writeFile(path, JSON.stringify(data, null, 2))
}

// Generate unique ID
function generateId(type: string, index: number): string {
  return `${type}_${index + 1}`
}

// Get current ISO timestamp
function getTimestamp(): string {
  return new Date().toISOString()
}

// Migrate experts data
async function migrateExperts(): Promise<Expert[]> {
  console.log('Migrating experts...')
  const expertsData = await readJSON(join(DATA_DIR, 'experts.json'))

  const experts: Expert[] = expertsData.map((expert: any, index: number) => ({
    id: expert.id || generateId('expert', index),
    createdAt: getTimestamp(),
    updatedAt: getTimestamp(),
    name: expert.name,
    avatar: expert.avatar || undefined,
    title: expert.title,
    institution: expert.institution,
    bio: expert.description || expert.achievements?.join(' ') || '',
    specialities: expert.specialization || [],
    yearsOfPractice: expert.birthYear
      ? new Date().getFullYear() - expert.birthYear - 20
      : undefined,
    publications:
      expert.publications?.map((pub: any) => ({
        id: generateId('pub', index),
        title: pub.title,
        year: pub.year,
        journal: pub.journal,
        doi: pub.doi,
        url: pub.url,
      })) || [],
    apprentices:
      expert.students?.map((student: any, idx: number) => ({
        id: generateId('apprentice', idx),
        name: student.name,
        title: student.currentPosition,
        institution: student.institution,
      })) || [],
    recommendedHerbs: [], // Will be populated from relations
    classicalFormulas: [], // Will be populated from relations
  }))

  console.log(`Migrated ${experts.length} experts`)
  return experts
}

// Migrate herbs/materials data
async function migrateHerbs(): Promise<Herb[]> {
  console.log('Migrating herbs...')

  // Try to read from new schema first
  try {
    const materialsData = await readJSON(join(DATA_DIR, 'new-schema', 'materials.json'))

    const herbs: Herb[] = materialsData.map((material: any, index: number) => ({
      id: material.id || generateId('herb', index),
      createdAt: material.createdAt || getTimestamp(),
      updatedAt: material.updatedAt || getTimestamp(),
      name: {
        cn: material.names?.cn || material.name || '',
        pinyin: material.names?.pinyin || material.pinyin || '',
        latin: material.names?.latin,
        en: material.names?.english,
      },
      qi: mapQiType(material.qi || ''),
      flavor: mapFlavorTypes(material.flavor || []),
      meridians: mapMeridianTypes(material.meridians || []),
      category: material.category || '未分类',
      origin:
        material.origin?.map((o: any) => ({
          province: o.province || o.region || '',
          city: o.city,
          description: o.quality,
        })) || [],
      images: {
        thumbnail: `/images/herbs/${material.id}_thumb.webp`,
        medium: `/images/herbs/${material.id}_medium.webp`,
        large: `/images/herbs/${material.id}_large.webp`,
        alt: material.names?.cn || material.name || '',
      },
      clinicalUses: material.functions || [],
      recommendedBy: [], // Will be populated from relations
    }))

    console.log(`Migrated ${herbs.length} herbs from new schema`)
    return herbs
  } catch (e) {
    console.log('New schema not found, trying old schema...')

    // Fallback to old herbs data
    const herbsData = await readJSON(join(DATA_DIR, 'herbs_with_images.json'))

    const herbs: Herb[] = herbsData.map((herb: any, index: number) => ({
      id: generateId('herb', index),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      name: {
        cn: herb.name || '',
        pinyin: herb.pinyin || '',
        latin: herb.latin,
        en: herb.english,
      },
      qi: mapQiType(herb.properties?.qi || ''),
      flavor: mapFlavorTypes(herb.properties?.flavor || []),
      meridians: mapMeridianTypes(herb.properties?.meridians || []),
      category: herb.category || '未分类',
      origin:
        herb.origin?.map((o: any) => ({
          province: o.province || '',
          city: o.city,
          description: o.description,
        })) || [],
      images: {
        thumbnail: herb.images?.thumbnail || '',
        medium: herb.images?.medium,
        large: herb.images?.large,
        alt: herb.name || '',
      },
      clinicalUses: herb.effects || [],
      recommendedBy: [],
    }))

    console.log(`Migrated ${herbs.length} herbs from old schema`)
    return herbs
  }
}

// Migrate formulas data
async function migrateFormulas(): Promise<Formula[]> {
  console.log('Migrating formulas...')

  try {
    const formulasData = await readJSON(join(DATA_DIR, 'new-schema', 'formulas.json'))

    const formulas: Formula[] = formulasData.map((formula: any, index: number) => ({
      id: formula.id || generateId('formula', index),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      name: {
        cn: formula.name || '',
        pinyin: formula.pinyin || '',
        latin: formula.latin,
        en: formula.english,
      },
      source: formula.source || '未知',
      dynasty: formula.dynasty,
      description: formula.explanation?.principle || formula.description || '',
      ingredients:
        formula.components?.map((comp: any, idx: number) => ({
          herbId: comp.sliceId?.replace('slice_', 'herb_') || generateId('herb', idx),
          amount: comp.weight?.value || 0,
          unit: comp.weight?.unit || 'g',
          role: mapHerbRole(comp.role || ''),
        })) || [],
      preparation: formula.usage?.preparationMethod || '',
      dosage: formula.usage?.administration || '',
      indications: Array.isArray(formula.indications)
        ? formula.indications
        : [formula.indications].filter(Boolean),
      contraindications: Array.isArray(formula.contraindications)
        ? formula.contraindications
        : [formula.contraindications].filter(Boolean),
      modernApplications: formula.modernApplications || [],
    }))

    console.log(`Migrated ${formulas.length} formulas`)
    return formulas
  } catch (e) {
    console.log('No formulas found')
    return []
  }
}

// Helper mapping functions
function mapQiType(qi: string): 'warm' | 'hot' | 'neutral' | 'cool' | 'cold' {
  const mapping: Record<string, 'warm' | 'hot' | 'neutral' | 'cool' | 'cold'> = {
    温: 'warm',
    热: 'hot',
    平: 'neutral',
    凉: 'cool',
    寒: 'cold',
  }
  return mapping[qi] || 'neutral'
}

function mapFlavorTypes(
  flavors: string[]
): Array<'sweet' | 'sour' | 'bitter' | 'spicy' | 'salty' | 'bland'> {
  const mapping: Record<string, 'sweet' | 'sour' | 'bitter' | 'spicy' | 'salty' | 'bland'> = {
    甘: 'sweet',
    酸: 'sour',
    苦: 'bitter',
    辛: 'spicy',
    咸: 'salty',
    淡: 'bland',
  }
  return flavors.map((f) => mapping[f] || 'bland').filter((v, i, a) => a.indexOf(v) === i)
}

function mapMeridianTypes(
  meridians: string[]
): Array<
  | 'lung'
  | 'largeIntestine'
  | 'stomach'
  | 'spleen'
  | 'heart'
  | 'smallIntestine'
  | 'bladder'
  | 'kidney'
  | 'pericardium'
  | 'tripleWarmer'
  | 'gallbladder'
  | 'liver'
> {
  const mapping: Record<string, any> = {
    肺: 'lung',
    大肠: 'largeIntestine',
    胃: 'stomach',
    脾: 'spleen',
    心: 'heart',
    小肠: 'smallIntestine',
    膀胱: 'bladder',
    肾: 'kidney',
    心包: 'pericardium',
    三焦: 'tripleWarmer',
    胆: 'gallbladder',
    肝: 'liver',
  }
  return meridians.map((m) => mapping[m]).filter(Boolean)
}

function mapHerbRole(role: string): 'monarch' | 'minister' | 'assistant' | 'guide' {
  const mapping: Record<string, 'monarch' | 'minister' | 'assistant' | 'guide'> = {
    君: 'monarch',
    臣: 'minister',
    佐: 'assistant',
    使: 'guide',
  }
  return mapping[role] || 'assistant'
}

// Generate relations
function generateRelations(experts: Expert[], herbs: Herb[]): Relation[] {
  const relations: Relation[] = []

  // Generate some sample expert-herb relations
  experts.forEach((expert, idx) => {
    // Each expert recommends 3-5 herbs
    const herbCount = 3 + (idx % 3)
    for (let i = 0; i < herbCount && i < herbs.length; i++) {
      const herbIdx = (idx * 3 + i) % herbs.length
      relations.push({
        fromId: expert.id,
        toId: herbs[herbIdx].id,
        type: 'EXPERT_RECOMMENDS_HERB',
        metadata: {
          reason: expert.specialities[0] || 'Clinical experience',
        },
      })

      // Update cross-references
      if (!expert.recommendedHerbs.includes(herbs[herbIdx].id)) {
        expert.recommendedHerbs.push(herbs[herbIdx].id)
      }
      if (!herbs[herbIdx].recommendedBy.includes(expert.id)) {
        herbs[herbIdx].recommendedBy.push(expert.id)
      }
    }
  })

  return relations
}

// Main migration function
async function migrate() {
  console.log('Starting data migration...')

  // Ensure directories exist
  await ensureDir(NEW_DATA_DIR)

  // Migrate data
  const experts = await migrateExperts()
  const herbs = await migrateHerbs()
  const formulas = await migrateFormulas()
  const relations = generateRelations(experts, herbs)

  // Create database object
  const database: Database = {
    version: '2.0.0',
    lastUpdated: getTimestamp(),
    experts,
    herbs,
    formulas,
    relations,
  }

  // Write individual files
  await writeJSON(join(NEW_DATA_DIR, 'experts.json'), experts)
  await writeJSON(join(NEW_DATA_DIR, 'herbs.json'), herbs)
  await writeJSON(join(NEW_DATA_DIR, 'formulas.json'), formulas)
  await writeJSON(join(NEW_DATA_DIR, 'relations.json'), relations)
  await writeJSON(join(NEW_DATA_DIR, 'database.json'), database)

  console.log('Migration completed successfully!')
  console.log(`Output directory: ${NEW_DATA_DIR}`)
  console.log(`- Experts: ${experts.length}`)
  console.log(`- Herbs: ${herbs.length}`)
  console.log(`- Formulas: ${formulas.length}`)
  console.log(`- Relations: ${relations.length}`)
}

// Run migration
migrate().catch(console.error)
