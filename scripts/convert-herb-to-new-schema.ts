#!/usr/bin/env tsx
/**
 * 数据迁移脚本：Herb -> 新数据模型
 * 
 * 使用方式：
 * pnpm tsx scripts/convert-herb-to-new-schema.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Herb } from '../src/types';
import { 
  Material, 
  Slice, 
  Formula, 
  GranuleIngredient,
  PatentMedicine,
  AuthenticRegion,
  ChemicalComponent,
  PharmacologicalAction,
  QualityStandard,
  QiType,
  FlavorType,
  MeridianType
} from '../src/types/tcm-core';

// ESM模块中获取__dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 输入输出路径
const INPUT_FILE = path.join(__dirname, '../public/data/herbs_with_images.json');
const OUTPUT_DIR = path.join(__dirname, '../public/data/new-schema');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 读取原始数据
console.log('📖 读取原始药材数据...');
const herbsData: Herb[] = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
console.log(`✅ 成功读取 ${herbsData.length} 个药材`);

// 数据容器
const materials: Material[] = [];
const slices: Slice[] = [];
const formulas: Formula[] = [];
const granules: GranuleIngredient[] = [];
const medicines: PatentMedicine[] = [];

// ID生成器
let sliceIdCounter = 1;
let formulaIdCounter = 1;

/**
 * 转换性味数据
 */
function convertNature(nature: string): QiType {
  const natureMap: Record<string, QiType> = {
    '寒': '寒',
    '热': '热',
    '温': '温',
    '凉': '凉',
    '平': '平',
    '微寒': '寒',
    '微温': '温',
    '大寒': '寒',
    '大热': '热'
  };
  return natureMap[nature] || '平';
}

/**
 * 转换味道数据
 */
function convertTaste(tastes: string[]): FlavorType[] {
  const validTastes: FlavorType[] = ['酸', '苦', '甘', '辛', '咸', '淡', '涩'];
  return tastes
    .map(taste => taste.replace('微', ''))
    .filter((taste): taste is FlavorType => validTastes.includes(taste as FlavorType));
}

/**
 * 转换归经数据
 */
function convertMeridians(meridians?: string[]): MeridianType[] {
  if (!meridians) return [];
  
  const meridianMap: Record<string, MeridianType> = {
    '肝经': '肝',
    '心经': '心',
    '脾经': '脾',
    '肺经': '肺',
    '肾经': '肾',
    '心包经': '心包',
    '胆经': '胆',
    '小肠经': '小肠',
    '胃经': '胃',
    '大肠经': '大肠',
    '膀胱经': '膀胱',
    '三焦经': '三焦'
  };
  
  return meridians
    .map(m => meridianMap[m])
    .filter((m): m is MeridianType => m !== undefined);
}

/**
 * 转换产地信息
 */
function convertOrigins(origins?: string[], detailedOrigins?: any[]): AuthenticRegion[] {
  const result: AuthenticRegion[] = [];
  
  if (origins) {
    origins.forEach(origin => {
      // 尝试从detailedOrigins找到更详细信息
      const detailed = detailedOrigins?.find(d => d.province === origin);
      
      result.push({
        region: origin,
        province: origin,
        quality: detailed?.quality || 'good',
        notes: detailed?.notes
      });
    });
  }
  
  return result;
}

/**
 * 解析剂量信息
 */
function parseDosage(dosageStr?: string): Material['dosage'] {
  // 默认剂量
  const defaultDosage = {
    min: 3,
    max: 15,
    common: 10,
    notes: dosageStr
  };
  
  if (!dosageStr) return defaultDosage;
  
  // 尝试解析如 "3-15g" 的格式
  const match = dosageStr.match(/(\d+)-(\d+)g/);
  if (match) {
    const min = parseInt(match[1]);
    const max = parseInt(match[2]);
    return {
      min,
      max,
      common: Math.round((min + max) / 2),
      notes: dosageStr
    };
  }
  
  return defaultDosage;
}

/**
 * 转换化学成分
 */
function convertChemicalComponents(components?: any[]): ChemicalComponent[] {
  if (!components || !Array.isArray(components)) return [];
  
  return components.map(comp => ({
    name: comp.name || '未知成分',
    category: comp.category || '其他',
    content: {
      min: comp.content?.min || 0,
      max: comp.content?.max || 100,
      typical: comp.content?.typical
    },
    importance: comp.importance || 'secondary',
    bioactivity: comp.function
  }));
}

/**
 * 转换药理作用
 */
function convertPharmacology(actions?: any[]): PharmacologicalAction[] {
  if (!actions || !Array.isArray(actions)) return [];
  
  return actions.map(action => ({
    action: action.action || action,
    mechanism: action.mechanism,
    targetOrgans: action.targetOrgans,
    evidence: action.evidence || 'moderate',
    references: action.studies || action.references
  }));
}

/**
 * 主转换函数
 */
console.log('\n🔄 开始转换数据...');

herbsData.forEach((herb, index) => {
  // 1. 创建Material实体
  const material: Material = {
    id: herb.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: '1.0.0',
    
    names: {
      cn: herb.name,
      pinyin: herb.pinyin,
      latin: herb.pharmacopoeiaInfo?.latinName || '',
      english: herb.englishName,
      aliases: herb.pharmacopoeiaInfo?.aliases
    },
    
    qi: convertNature(herb.nature),
    flavor: convertTaste(herb.taste),
    meridians: convertMeridians(herb.meridians),
    
    origin: convertOrigins(herb.origin, herb.detailedOrigins),
    category: herb.category,
    
    functions: herb.functions,
    indications: herb.indications,
    contraindications: herb.contraindications,
    
    dosage: parseDosage(herb.dosage),
    
    chemicalComponents: convertChemicalComponents(herb.chemicalComponents),
    pharmacology: convertPharmacology(herb.pharmacologicalActions),
    
    images: {
      primary: herb.primaryImage,
      gallery: herb.images
    },
    
    // 无方剂出处的功效放入extFunctions
    extFunctions: herb.clinicalApplication
  };
  
  // 如果有药典信息，添加质量标准
  if (herb.qualityControl) {
    material.qualityStandards = herb.qualityControl.qualityIndicators?.map(ind => ({
      parameter: ind.parameter,
      specification: ind.specification,
      method: ind.method,
      pharmacopoeia: '中国药典2020版'
    }));
  }
  
  materials.push(material);
  
  // 2. 创建Slice实体（如果有炮制信息）
  if (herb.processing && herb.processing.length > 0) {
    herb.processing.forEach(method => {
      const slice: Slice = {
        id: `slice_${sliceIdCounter++}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0',
        
        materialId: material.id,
        
        processing: {
          method: method,
          category: '炮炙',
          note: `${herb.name}的${method}饮片`
        },
        
        qc: [],
        
        storage: {
          temperature: '常温',
          humidity: '≤60%',
          lightCondition: '避光',
          shelfLife: 24,
          container: '密闭容器'
        }
      };
      
      slices.push(slice);
    });
  } else {
    // 默认创建一个生品饮片
    const defaultSlice: Slice = {
      id: `slice_${sliceIdCounter++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      
      materialId: material.id,
      
      processing: {
        method: '净制',
        category: '净制',
        note: `${herb.name}生品`
      },
      
      qc: [],
      
      storage: {
        temperature: '常温',
        humidity: '≤60%',
        lightCondition: '避光',
        shelfLife: 24,
        container: '密闭容器'
      }
    };
    
    slices.push(defaultSlice);
  }
  
  // 3. 如果有经典配伍信息，创建示例Formula
  if (herb.compatibilityInfo?.commonCombinations && herb.compatibilityInfo.commonCombinations.length > 0) {
    const firstCombination = herb.compatibilityInfo.commonCombinations[0];
    
    // 创建一个示例方剂
    const formula: Formula = {
      id: `formula_${formulaIdCounter++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: '1.0.0',
      
      name: firstCombination.source || `${herb.name}配伍方`,
      pinyin: 'peiweifang',
      source: firstCombination.source || '经验方',
      category: '配伍方',
      
      components: [{
        sliceId: slices[slices.length - 1].id, // 使用最后创建的饮片
        weight: { value: 10, unit: 'g' },
        role: '君',
        function: firstCombination.function
      }],
      
      functions: [firstCombination.function],
      indications: firstCombination.indications || [],
      
      usage: {
        preparationMethod: '水煎服',
        dosageForm: '汤剂',
        administration: '日一剂，分两次温服'
      }
    };
    
    formulas.push(formula);
  }
  
  // 进度提示
  if ((index + 1) % 10 === 0) {
    console.log(`  已处理 ${index + 1}/${herbsData.length} 个药材...`);
  }
});

console.log('\n✅ 数据转换完成！');
console.log(`  - 药材(Materials): ${materials.length} 个`);
console.log(`  - 饮片(Slices): ${slices.length} 个`);
console.log(`  - 方剂(Formulas): ${formulas.length} 个`);

// 保存数据
console.log('\n💾 保存数据文件...');

const saveJSON = (filename: string, data: any) => {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`  ✅ ${filename} (${data.length} 条记录)`);
};

saveJSON('materials.json', materials);
saveJSON('slices.json', slices);
saveJSON('formulas.json', formulas);
saveJSON('granules.json', granules);
saveJSON('medicines.json', medicines);

// 创建索引文件
const indexData = {
  version: '1.0.0',
  createdAt: new Date().toISOString(),
  counts: {
    materials: materials.length,
    slices: slices.length,
    formulas: formulas.length,
    granules: granules.length,
    medicines: medicines.length
  },
  files: [
    'materials.json',
    'slices.json',
    'formulas.json',
    'granules.json',
    'medicines.json'
  ]
};

saveJSON('index.json', indexData);

// 创建关系映射文件
const relations = {
  materialToSlices: {} as Record<string, string[]>,
  sliceToFormulas: {} as Record<string, string[]>
};

// 构建关系
slices.forEach(slice => {
  if (!relations.materialToSlices[slice.materialId]) {
    relations.materialToSlices[slice.materialId] = [];
  }
  relations.materialToSlices[slice.materialId].push(slice.id);
});

formulas.forEach(formula => {
  formula.components.forEach(comp => {
    if (!relations.sliceToFormulas[comp.sliceId]) {
      relations.sliceToFormulas[comp.sliceId] = [];
    }
    relations.sliceToFormulas[comp.sliceId].push(formula.id);
  });
});

saveJSON('relations.json', relations);

console.log('\n🎉 数据迁移完成！');
console.log(`📁 输出目录: ${OUTPUT_DIR}`);

// 生成迁移报告
const report = `# 数据迁移报告

生成时间: ${new Date().toLocaleString('zh-CN')}

## 数据统计

- 原始药材数: ${herbsData.length}
- 生成药材(Materials): ${materials.length}
- 生成饮片(Slices): ${slices.length}
- 生成方剂(Formulas): ${formulas.length}
- 生成颗粒(Granules): ${granules.length}
- 生成中成药(Medicines): ${medicines.length}

## 文件列表

${Object.entries(indexData.counts).map(([key, count]) => `- ${key}.json (${count} 条记录)`).join('\n')}
- index.json (索引文件)
- relations.json (关系映射)

## 迁移规则

1. 每个Herb转换为一个Material
2. 如有炮制方法，每种方法生成一个Slice；否则生成默认生品Slice
3. 如有配伍信息，生成示例Formula
4. 产地信息映射到AuthenticRegion
5. 化学成分和药理作用保留原有数据结构

## 注意事项

- Material.names.latin 需要补充拉丁学名
- 部分字段可能需要人工审核和补充
- 建议运行JSON Schema验证确保数据完整性
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'MIGRATION_REPORT.md'), report, 'utf-8');
console.log('\n📋 迁移报告已生成: MIGRATION_REPORT.md');