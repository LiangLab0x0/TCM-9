#!/usr/bin/env tsx
/**
 * 数据迁移脚本：Herb -> 新数据模型
 * 
 * 使用方式：
 * pnpm tsx scripts/convert-herb-to-new-schema.ts
 * pnpm tsx scripts/convert-herb-to-new-schema.ts --validate
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
  GranuleFormula,
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

// 解析命令行参数
const args = process.argv.slice(2);
const isValidateMode = args.includes('--validate');

// 输入输出路径
const INPUT_FILE = path.join(__dirname, '../public/data/herbs_with_images.json');
const OUTPUT_DIR = path.join(__dirname, '../public/data/new-schema');

// 如果是验证模式，执行验证逻辑
if (isValidateMode) {
  validateData();
  process.exit(0);
}

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
const granuleFormulas: GranuleFormula[] = [];
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
console.log(`  - 颗粒成分(GranuleIngredients): ${granules.length} 个`);
console.log(`  - 颗粒处方(GranuleFormulas): ${granuleFormulas.length} 个`);
console.log(`  - 中成药(PatentMedicines): ${medicines.length} 个`);

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
saveJSON('granule-formulas.json', granuleFormulas);
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
    granuleFormulas: granuleFormulas.length,
    medicines: medicines.length
  },
  files: [
    'materials.json',
    'slices.json',
    'formulas.json',
    'granules.json',
    'granule-formulas.json',
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
- 生成颗粒成分(GranuleIngredients): ${granules.length}
- 生成颗粒处方(GranuleFormulas): ${granuleFormulas.length}
- 生成中成药(PatentMedicines): ${medicines.length}

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

/**
 * 验证数据完整性
 */
function validateData() {
  console.log('\n🔍 开始验证数据...\n');
  
  const validationResults: {
    entity: string;
    count: number;
    errors: string[];
    warnings: string[];
  }[] = [];
  
  // 验证文件是否存在
  const requiredFiles = [
    'materials.json',
    'slices.json',
    'formulas.json',
    'granules.json',
    'granule-formulas.json',
    'medicines.json',
    'index.json',
    'relations.json'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(OUTPUT_DIR, file))
  );
  
  if (missingFiles.length > 0) {
    console.error('❌ 缺少以下文件:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }
  
  // 1. 验证 Materials
  try {
    const materials: Material[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'materials.json'), 'utf-8')
    );
    const result = validateMaterials(materials);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'Materials',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 2. 验证 Slices
  try {
    const slices: Slice[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'slices.json'), 'utf-8')
    );
    const result = validateSlices(slices);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'Slices',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 3. 验证 Formulas
  try {
    const formulas: Formula[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'formulas.json'), 'utf-8')
    );
    const result = validateFormulas(formulas);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'Formulas',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 4. 验证 GranuleIngredients
  try {
    const granules: GranuleIngredient[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'granules.json'), 'utf-8')
    );
    const result = validateGranuleIngredients(granules);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'GranuleIngredients',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 5. 验证 GranuleFormulas
  try {
    const granuleFormulas: GranuleFormula[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'granule-formulas.json'), 'utf-8')
    );
    const result = validateGranuleFormulas(granuleFormulas);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'GranuleFormulas',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 6. 验证 PatentMedicines
  try {
    const medicines: PatentMedicine[] = JSON.parse(
      fs.readFileSync(path.join(OUTPUT_DIR, 'medicines.json'), 'utf-8')
    );
    const result = validatePatentMedicines(medicines);
    validationResults.push(result);
  } catch (error) {
    validationResults.push({
      entity: 'PatentMedicines',
      count: 0,
      errors: [`无法读取文件: ${error}`],
      warnings: []
    });
  }
  
  // 打印验证结果
  console.log('📊 验证结果汇总:\n');
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  validationResults.forEach(result => {
    console.log(`\n${result.entity}:`);
    console.log(`  ✓ 数量: ${result.count}`);
    
    if (result.errors.length > 0) {
      console.log(`  ❌ 错误 (${result.errors.length}):`);
      result.errors.slice(0, 5).forEach(err => console.log(`     - ${err}`));
      if (result.errors.length > 5) {
        console.log(`     ... 还有 ${result.errors.length - 5} 个错误`);
      }
      totalErrors += result.errors.length;
    }
    
    if (result.warnings.length > 0) {
      console.log(`  ⚠️  警告 (${result.warnings.length}):`);
      result.warnings.slice(0, 5).forEach(warn => console.log(`     - ${warn}`));
      if (result.warnings.length > 5) {
        console.log(`     ... 还有 ${result.warnings.length - 5} 个警告`);
      }
      totalWarnings += result.warnings.length;
    }
    
    if (result.errors.length === 0 && result.warnings.length === 0) {
      console.log(`  ✅ 验证通过`);
    }
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`总计: ${totalErrors} 个错误, ${totalWarnings} 个警告`);
  
  if (totalErrors > 0) {
    console.log('\n❌ 验证失败，请检查错误信息');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n⚠️  验证通过，但有警告需要注意');
  } else {
    console.log('\n✅ 所有验证通过！');
  }
}

// 验证函数实现
function validateMaterials(materials: Material[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  materials.forEach((material, index) => {
    // 必填字段验证
    if (!material.id) errors.push(`Material[${index}]: 缺少ID`);
    if (!material.names?.cn) errors.push(`Material[${material.id}]: 缺少中文名称`);
    if (!material.names?.pinyin) errors.push(`Material[${material.id}]: 缺少拼音`);
    if (!material.qi) errors.push(`Material[${material.id}]: 缺少性(qi)`);
    if (!material.flavor || material.flavor.length === 0) errors.push(`Material[${material.id}]: 缺少味(flavor)`);
    
    // 警告：建议填写的字段
    if (!material.names?.latin) warnings.push(`Material[${material.id}]: 建议填写拉丁学名`);
    if (!material.chemicalComponents || material.chemicalComponents.length === 0) {
      warnings.push(`Material[${material.id}]: 建议添加化学成分信息`);
    }
    if (!material.qualityStandards || material.qualityStandards.length === 0) {
      warnings.push(`Material[${material.id}]: 建议添加质量标准信息`);
    }
  });
  
  return {
    entity: 'Materials',
    count: materials.length,
    errors,
    warnings
  };
}

function validateSlices(slices: Slice[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  slices.forEach((slice, index) => {
    // 必填字段验证
    if (!slice.id) errors.push(`Slice[${index}]: 缺少ID`);
    if (!slice.materialId) errors.push(`Slice[${slice.id}]: 缺少关联药材ID`);
    if (!slice.processing?.method) errors.push(`Slice[${slice.id}]: 缺少炮制方法`);
    
    // 警告：建议填写的字段
    if (!slice.qc || slice.qc.length === 0) {
      warnings.push(`Slice[${slice.id}]: 建议添加质控指标`);
    }
    if (!slice.storage) {
      warnings.push(`Slice[${slice.id}]: 建议添加储存条件`);
    }
  });
  
  return {
    entity: 'Slices',
    count: slices.length,
    errors,
    warnings
  };
}

function validateFormulas(formulas: Formula[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  formulas.forEach((formula, index) => {
    // 必填字段验证
    if (!formula.id) errors.push(`Formula[${index}]: 缺少ID`);
    if (!formula.name) errors.push(`Formula[${formula.id}]: 缺少方剂名称`);
    if (!formula.pinyin) errors.push(`Formula[${formula.id}]: 缺少拼音`);
    if (!formula.source) errors.push(`Formula[${formula.id}]: 缺少出处`);
    if (!formula.components || formula.components.length === 0) {
      errors.push(`Formula[${formula.id}]: 缺少组成成分`);
    }
    
    // 验证组成成分
    formula.components?.forEach((comp, idx) => {
      if (!comp.sliceId) errors.push(`Formula[${formula.id}].components[${idx}]: 缺少饮片ID`);
      if (!comp.weight?.value) errors.push(`Formula[${formula.id}].components[${idx}]: 缺少用量`);
      if (!comp.role) errors.push(`Formula[${formula.id}].components[${idx}]: 缺少君臣佐使`);
    });
    
    // 警告：建议填写的字段
    if (!formula.explanation) warnings.push(`Formula[${formula.id}]: 建议添加方解`);
    if (!formula.modernApplications) warnings.push(`Formula[${formula.id}]: 建议添加现代应用`);
  });
  
  return {
    entity: 'Formulas',
    count: formulas.length,
    errors,
    warnings
  };
}

function validateGranuleIngredients(granules: GranuleIngredient[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  granules.forEach((granule, index) => {
    // 必填字段验证
    if (!granule.id) errors.push(`GranuleIngredient[${index}]: 缺少ID`);
    if (!granule.sliceId) errors.push(`GranuleIngredient[${granule.id}]: 缺少关联饮片ID`);
    
    // 提取工艺验证
    if (!granule.extraction) {
      errors.push(`GranuleIngredient[${granule.id}]: 缺少提取工艺信息`);
    } else {
      if (!granule.extraction.solvent) errors.push(`GranuleIngredient[${granule.id}]: 缺少提取溶剂`);
      if (!granule.extraction.ratio) errors.push(`GranuleIngredient[${granule.id}]: 缺少料液比`);
    }
    
    // 质量标准验证
    if (!granule.quality?.activeComponents || granule.quality.activeComponents.length === 0) {
      warnings.push(`GranuleIngredient[${granule.id}]: 建议添加有效成分含量`);
    }
  });
  
  return {
    entity: 'GranuleIngredients',
    count: granules.length,
    errors,
    warnings
  };
}

function validateGranuleFormulas(formulas: GranuleFormula[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  formulas.forEach((formula, index) => {
    // 必填字段验证
    if (!formula.id) errors.push(`GranuleFormula[${index}]: 缺少ID`);
    if (!formula.prescriptionNo) errors.push(`GranuleFormula[${formula.id}]: 缺少处方号`);
    if (!formula.hospital) errors.push(`GranuleFormula[${formula.id}]: 缺少医院`);
    if (!formula.doctor) errors.push(`GranuleFormula[${formula.id}]: 缺少医生`);
    
    // 组成验证
    if (!formula.ingredients || formula.ingredients.length === 0) {
      errors.push(`GranuleFormula[${formula.id}]: 缺少颗粒组成`);
    } else {
      formula.ingredients.forEach((ing, idx) => {
        if (!ing.ingredientId) errors.push(`GranuleFormula[${formula.id}].ingredients[${idx}]: 缺少颗粒ID`);
        if (!ing.dosage) errors.push(`GranuleFormula[${formula.id}].ingredients[${idx}]: 缺少用量`);
      });
    }
    
    // 用法验证
    if (!formula.usage) {
      errors.push(`GranuleFormula[${formula.id}]: 缺少用法信息`);
    }
    
    // 警告：建议填写的字段
    if (!formula.compatibility) warnings.push(`GranuleFormula[${formula.id}]: 建议添加配伍分析`);
  });
  
  return {
    entity: 'GranuleFormulas',
    count: formulas.length,
    errors,
    warnings
  };
}

function validatePatentMedicines(medicines: PatentMedicine[]): any {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  medicines.forEach((medicine, index) => {
    // 必填字段验证
    if (!medicine.id) errors.push(`PatentMedicine[${index}]: 缺少ID`);
    if (!medicine.name?.cn) errors.push(`PatentMedicine[${medicine.id}]: 缺少中文名称`);
    if (!medicine.approval?.number) errors.push(`PatentMedicine[${medicine.id}]: 缺少批准文号`);
    if (!medicine.manufacturer?.name) errors.push(`PatentMedicine[${medicine.id}]: 缺少生产厂家`);
    
    // 制剂信息验证
    if (!medicine.formulation?.dosageForm) {
      errors.push(`PatentMedicine[${medicine.id}]: 缺少剂型`);
    }
    
    // 临床信息验证
    if (!medicine.clinical?.functions || medicine.clinical.functions.length === 0) {
      errors.push(`PatentMedicine[${medicine.id}]: 缺少功能主治`);
    }
    if (!medicine.clinical?.usage) {
      errors.push(`PatentMedicine[${medicine.id}]: 缺少用法用量`);
    }
    
    // 警告：建议填写的字段
    if (!medicine.qualityStandards || medicine.qualityStandards.length === 0) {
      warnings.push(`PatentMedicine[${medicine.id}]: 建议添加质量标准`);
    }
    if (!medicine.pricing) {
      warnings.push(`PatentMedicine[${medicine.id}]: 建议添加价格信息`);
    }
  });
  
  return {
    entity: 'PatentMedicines',
    count: medicines.length,
    errors,
    warnings
  };
}