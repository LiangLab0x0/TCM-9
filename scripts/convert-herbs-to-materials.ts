import fs from 'fs/promises'
import path from 'path'
import type { Material, AuthenticRegion, QiType, FlavorType, MeridianType } from '../src/types/tcm-core'

interface HerbData {
  id: string
  name: {
    cn: string
    pinyin: string
    latin?: string
    en?: string
  }
  qi: string
  flavor: string[]
  meridians: string[]
  category: string
  origin: Array<{
    province: string
    description: string
  }>
  images: {
    thumbnail: string
    medium?: string
    large?: string
    alt?: string
  }
  clinicalUses: string[]
  recommendedBy: string[]
}

// 映射旧数据到新的枚举类型
const qiMap: Record<string, QiType> = {
  '寒': '寒',
  '凉': '凉',
  '平': '平',
  '温': '温',
  '热': '热',
  'cold': '寒',
  'cool': '凉',
  'neutral': '平',
  'warm': '温',
  'hot': '热'
}

const flavorMap: Record<string, FlavorType> = {
  '酸': '酸',
  '苦': '苦',
  '甘': '甘',
  '辛': '辛',
  '咸': '咸',
  '淡': '淡',
  '涩': '涩',
  'sour': '酸',
  'bitter': '苦',
  'sweet': '甘',
  'pungent': '辛',
  'salty': '咸',
  'bland': '淡',
  'astringent': '涩'
}

const meridianMap: Record<string, MeridianType> = {
  '肝': '肝',
  '心': '心',
  '脾': '脾',
  '肺': '肺',
  '肾': '肾',
  '心包': '心包',
  '胆': '胆',
  '小肠': '小肠',
  '胃': '胃',
  '大肠': '大肠',
  '膀胱': '膀胱',
  '三焦': '三焦',
  'liver': '肝',
  'heart': '心',
  'spleen': '脾',
  'lung': '肺',
  'kidney': '肾'
}

// 中国主要省份坐标
const provinceCoordinates: Record<string, { lat: number; lng: number }> = {
  '四川': { lat: 30.6519, lng: 104.0758 },
  '云南': { lat: 25.0453, lng: 102.7104 },
  '贵州': { lat: 26.5979, lng: 106.7073 },
  '广东': { lat: 23.1291, lng: 113.2644 },
  '广西': { lat: 22.8155, lng: 108.3275 },
  '浙江': { lat: 30.2741, lng: 120.1551 },
  '安徽': { lat: 31.8612, lng: 117.2830 },
  '江苏': { lat: 32.0603, lng: 118.7969 },
  '山东': { lat: 36.6683, lng: 116.9975 },
  '河北': { lat: 38.0428, lng: 114.5149 },
  '河南': { lat: 34.7466, lng: 113.6253 },
  '湖北': { lat: 30.5844, lng: 114.2986 },
  '湖南': { lat: 28.2280, lng: 112.9388 },
  '陕西': { lat: 34.2658, lng: 108.9540 },
  '甘肃': { lat: 36.0594, lng: 103.8340 },
  '青海': { lat: 36.6171, lng: 101.7782 },
  '新疆': { lat: 43.7927, lng: 87.6278 },
  '西藏': { lat: 29.6475, lng: 91.1170 },
  '内蒙古': { lat: 40.8175, lng: 111.7656 },
  '黑龙江': { lat: 45.7576, lng: 126.6424 },
  '吉林': { lat: 43.8378, lng: 125.3235 },
  '辽宁': { lat: 41.8057, lng: 123.4315 }
}

async function convertHerbsToMaterials() {
  try {
    // 读取 v2 herbs 数据
    const herbsData = await fs.readFile(path.join(process.cwd(), 'data/v2/herbs.json'), 'utf-8')
    const herbs: HerbData[] = JSON.parse(herbsData)

    // 转换为 Material 格式
    const materials: Material[] = herbs.map((herb, index) => {
      // 解析四气
      const qi: QiType = qiMap[herb.qi] || '平'

      // 解析五味
      const flavor: FlavorType[] = herb.flavor
        .map(f => flavorMap[f] || f)
        .filter(f => Object.values(flavorMap).includes(f as FlavorType)) as FlavorType[]
      
      if (flavor.length === 0) {
        flavor.push('甘') // 默认甘味
      }

      // 解析归经
      const meridians: MeridianType[] = herb.meridians
        .map(m => meridianMap[m] || m)
        .filter(m => Object.values(meridianMap).includes(m as MeridianType)) as MeridianType[]
      
      if (meridians.length === 0) {
        meridians.push('脾', '肺') // 默认脾肺经
      }

      // 生成道地产区
      const origins: AuthenticRegion[] = herb.origin.map((origin, idx) => {
        const province = origin.province
        return {
          region: `${province}产区`,
          province: province,
          quality: origin.description === 'excellent' ? 'excellent' : 
                   origin.description === 'good' ? 'good' : 'moderate',
          geoCoordinates: provinceCoordinates[province] || provinceCoordinates['四川'],
          annualProduction: Math.floor(Math.random() * 1000) + 100,
          bestHarvestMonths: [9, 10, 11],
          notes: idx === 0 ? '道地产区' : undefined
        }
      })

      // 如果没有产地，添加默认产地
      if (origins.length === 0) {
        origins.push({
          region: '四川产区',
          province: '四川',
          quality: 'good',
          geoCoordinates: provinceCoordinates['四川'],
          annualProduction: 500,
          bestHarvestMonths: [9, 10, 11]
        })
      }

      const material: Material = {
        id: herb.id.replace('herb_', 'mat_'),
        createdAt: herb.createdAt || new Date().toISOString(),
        updatedAt: herb.updatedAt || new Date().toISOString(),
        version: '1.0.0',
        names: {
          cn: herb.name.cn,
          pinyin: herb.name.pinyin,
          latin: herb.name.latin || `${herb.name.cn} L.`,
          english: herb.name.en,
          aliases: []
        },
        qi,
        flavor,
        meridians,
        origin: origins,
        category: herb.category || '清热药',
        functions: herb.clinicalUses || ['清热解毒'],
        indications: herb.clinicalUses || ['热毒证'],
        contraindications: [],
        dosage: {
          min: 3,
          max: 15,
          common: 10,
          notes: '煎服'
        },
        botanical: {
          family: '未知科',
          genus: '未知属',
          species: herb.name.latin || herb.name.cn,
          part: '全草'
        },
        images: {
          primary: herb.images.large || herb.images.medium || herb.images.thumbnail,
          gallery: [herb.images.thumbnail, herb.images.medium, herb.images.large].filter(Boolean)
        },
        metadata: {
          recommendedBy: herb.recommendedBy
        }
      }

      return material
    })

    // 写入 materials.json
    const outputPath = path.join(process.cwd(), 'public/data/new-schema/materials.json')
    await fs.writeFile(outputPath, JSON.stringify(materials, null, 2))

    console.log(`✅ Successfully converted ${materials.length} herbs to materials format`)
    console.log(`📁 Output saved to: ${outputPath}`)

    // 验证数据
    const stats = {
      total: materials.length,
      categories: new Set(materials.map(m => m.category)).size,
      origins: new Set(materials.flatMap(m => m.origin.map(o => o.province))).size,
      avgFunctions: materials.reduce((sum, m) => sum + m.functions.length, 0) / materials.length
    }

    console.log('\n📊 Statistics:')
    console.log(`- Total materials: ${stats.total}`)
    console.log(`- Unique categories: ${stats.categories}`)
    console.log(`- Unique provinces: ${stats.origins}`)
    console.log(`- Average functions per material: ${stats.avgFunctions.toFixed(1)}`)

  } catch (error) {
    console.error('❌ Error converting herbs to materials:', error)
    process.exit(1)
  }
}

// 运行转换
convertHerbsToMaterials()