/**
 * TCM Core Data Model v1.0
 * 中医药核心数据模型 - 标准TypeScript定义
 * 
 * 遵循中药材全流程：药材 → 饮片 → 方剂 → 颗粒 → 成药
 */

// ==================== 基础类型 ====================

/**
 * 基础节点接口 - 所有实体的公共字段
 */
export interface BaseNode {
  id: string;
  createdAt: string;
  updatedAt: string;
  version: string;
  metadata?: Record<string, any>;
}

/**
 * 四气类型
 */
export type QiType = '寒' | '凉' | '平' | '温' | '热';

/**
 * 五味类型
 */
export type FlavorType = '酸' | '苦' | '甘' | '辛' | '咸' | '淡' | '涩';

/**
 * 归经类型
 */
export type MeridianType = '肝' | '心' | '脾' | '肺' | '肾' | '心包' | '胆' | '小肠' | '胃' | '大肠' | '膀胱' | '三焦';

/**
 * 君臣佐使
 */
export type HerbRole = '君' | '臣' | '佐' | '使';

// ==================== 1. 药材 Material ====================

/**
 * 药材实体 - 原始药材信息
 */
export interface Material extends BaseNode {
  // 基本信息
  names: {
    cn: string;           // 中文名
    pinyin: string;       // 拼音
    latin: string;        // 拉丁学名
    english?: string;     // 英文名
    aliases?: string[];   // 别名
  };
  
  // 药性信息
  qi: QiType;                    // 四气
  flavor: FlavorType[];          // 五味
  meridians: MeridianType[];     // 归经
  
  // 来源信息
  origin: AuthenticRegion[];     // 道地产区
  category: string;              // 药材类别
  
  // 功效信息
  functions: string[];           // 功效
  indications: string[];         // 主治
  contraindications?: string[];  // 禁忌
  
  // 用法用量
  dosage: {
    min: number;              // 最小剂量(g)
    max: number;              // 最大剂量(g)
    common: number;           // 常用剂量(g)
    notes?: string;           // 用量备注
  };
  
  // 植物学信息
  botanical?: {
    family: string;           // 科
    genus: string;            // 属
    species: string;          // 种
    part: string;             // 药用部位
    harvestTime?: string;     // 采收时间
  };
  
  // 化学成分
  chemicalComponents?: ChemicalComponent[];
  
  // 药理作用
  pharmacology?: PharmacologicalAction[];
  
  // 质量标准
  qualityStandards?: QualityStandard[];
  
  // 图片资源
  images: {
    primary: string;          // 主图
    gallery?: string[];       // 图库
    microscopy?: string[];    // 显微图
  };
  
  // 扩展功能（兼容旧数据）
  extFunctions?: string[];      // 额外功效（无方剂出处）
}

/**
 * 道地产区
 */
export interface AuthenticRegion {
  region: string;              // 产区名称
  province: string;            // 省份
  quality: 'excellent' | 'good' | 'moderate';  // 质量等级
  geoCoordinates?: {
    lat: number;
    lng: number;
  };
  annualProduction?: number;   // 年产量(吨)
  bestHarvestMonths?: number[]; // 最佳采收月份
  notes?: string;              // 备注
}

/**
 * 化学成分
 */
export interface ChemicalComponent {
  name: string;                // 成分名称
  category: string;            // 成分类别
  content: {
    min: number;              // 最小含量(%)
    max: number;              // 最大含量(%)
    typical?: number;         // 典型含量(%)
  };
  importance: 'primary' | 'secondary' | 'trace';  // 重要程度
  bioactivity?: string;        // 生物活性
}

/**
 * 药理作用
 */
export interface PharmacologicalAction {
  action: string;              // 药理作用
  mechanism?: string;          // 作用机制
  targetOrgans?: string[];     // 靶器官
  evidence: 'strong' | 'moderate' | 'preliminary';  // 证据强度
  references?: string[];       // 参考文献
}

/**
 * 质量标准
 */
export interface QualityStandard {
  parameter: string;           // 检测参数
  specification: string;       // 规格要求
  method: string;             // 检测方法
  pharmacopoeia?: string;     // 药典标准
}

// ==================== 2. 饮片 Slice ====================

/**
 * 饮片实体 - 炮制后的药材
 */
export interface Slice extends BaseNode {
  materialId: string;          // 关联药材ID
  name?: string;              // 饮片名称
  thumbnail?: string;         // 缩略图
  
  // 炮制信息
  processing: {
    method: string;           // 炮制方法
    category: '净制' | '切制' | '炮炙' | '其他';  // 炮制类别
    temperature?: {
      value: number;          // 温度值
      unit: '°C' | '°F';      // 温度单位
    };
    duration?: {
      value: number;          // 时长
      unit: 'min' | 'hour';   // 时间单位
    };
    excipient?: {             // 辅料
      name: string;           // 辅料名称
      amount: string;         // 用量
    };
    moistureContent?: number; // 含水量(%)
    yield?: number;           // 出品率(%)
    note?: string;           // 炮制备注
  };
  
  // 质控指标
  qc: QCIndicator[];
  
  // 性味归经变化
  propertyChanges?: {
    qi?: QiType;              // 新的四气
    flavor?: FlavorType[];    // 新的五味
    meridians?: MeridianType[]; // 新的归经
    enhanced?: string[];      // 增强的功效
    reduced?: string[];       // 减弱的功效
  };
  
  // 临床应用差异
  clinicalDifferences?: string[];
  
  // 储存条件
  storage?: {
    temperature: string;      // 储存温度
    humidity: string;         // 湿度要求
    lightCondition: string;   // 光照条件
    shelfLife: number;        // 保质期(月)
    container: string;        // 包装要求
  };
}

/**
 * 质控指标
 */
export interface QCIndicator {
  item: string;               // 检测项目
  standard: string;           // 标准值
  result?: string;            // 实测值
  method: string;             // 检测方法
  qualified: boolean;         // 是否合格
}

// ==================== 3. 方剂 Formula ====================

/**
 * 方剂实体 - 中药配方
 */
export interface Formula extends BaseNode {
  // 基本信息
  name: string;               // 方剂名称
  pinyin: string;            // 拼音
  source: string;            // 出处
  category: string;          // 方剂分类
  thumbnail?: string;         // 缩略图
  
  // 组成
  components: FormulaComponent[];
  
  // 功效主治
  functions: string[];        // 功效
  indications: string[];      // 主治
  syndromes?: string[];       // 证候
  
  // 用法
  usage: {
    preparationMethod: string; // 制备方法
    dosageForm: string;       // 剂型
    administration: string;    // 服用方法
    course?: string;          // 疗程
  };
  
  // 方解
  explanation?: {
    principle: string;        // 组方原理
    keyPoints: string[];      // 要点
    modifications?: FormulaModification[]; // 加减
  };
  
  // 现代应用
  modernApplications?: {
    diseases: string[];       // 现代疾病
    clinicalTrials?: string[]; // 临床研究
    adverseReactions?: string[]; // 不良反应
    contraindications?: string[]; // 禁忌症
  };
  
  // 质量控制
  qualityControl?: {
    fingerprint?: string;     // 指纹图谱
    markerCompounds?: string[]; // 标志性成分
    standards?: string[];     // 质量标准
  };
}

/**
 * 方剂组成
 */
export interface FormulaComponent {
  sliceId: string;            // 饮片ID
  weight: {
    value: number;            // 重量值
    unit: 'g' | 'kg';         // 重量单位
  };
  role: HerbRole;             // 君臣佐使
  function?: string;          // 在方中作用
  specialProcessing?: string; // 特殊炮制要求
}

/**
 * 方剂加减
 */
export interface FormulaModification {
  condition: string;          // 适用情况
  additions?: {               // 加药
    sliceId: string;
    weight: number;
    reason: string;
  }[];
  removals?: {                // 减药
    sliceId: string;
    reason: string;
  }[];
}

// ==================== 4. 配方颗粒 Granule ====================

/**
 * 配方颗粒成分
 */
export interface GranuleIngredient extends BaseNode {
  sliceId: string;            // 饮片ID
  
  // 提取工艺
  extraction: {
    solvent: '水' | '乙醇' | '混合';  // 提取溶剂
    concentration?: number;    // 溶剂浓度(%)
    ratio: number;            // 料液比
    temperature: number;      // 提取温度(°C)
    duration: number;         // 提取时间(min)
    times: number;            // 提取次数
  };
  
  // 浓缩干燥
  concentration: {
    method: '减压浓缩' | '常压浓缩' | '膜浓缩';
    density: number;          // 相对密度
  };
  
  drying: {
    method: '喷雾干燥' | '真空干燥' | '冷冻干燥';
    temperature?: number;     // 干燥温度(°C)
    moisture: number;         // 水分含量(%)
  };
  
  // 成品指标
  granule: {
    extractRatio: number;     // 出膏率(%)
    particleSize: string;     // 粒度
    solubility: string;       // 溶解性
    appearance: string;       // 外观性状
  };
  
  // 质量标准
  quality: {
    activeComponents: {       // 有效成分
      name: string;
      content: number;        // 含量(mg/g)
      method: string;         // 检测方法
    }[];
    heavyMetals?: {          // 重金属
      item: string;
      limit: number;          // 限量(ppm)
    }[];
    microbial?: {            // 微生物
      item: string;
      limit: string;          // 限量
    }[];
  };
  
  // 等效性
  equivalence: {
    rawHerbAmount: number;    // 相当于饮片量(g)
    dailyDose: string;        // 日用量
  };
}

/**
 * 配方颗粒处方
 */
export interface GranuleFormula extends BaseNode {
  // 处方信息
  prescriptionNo: string;     // 处方号
  hospital: string;           // 医院
  department: string;         // 科室
  doctor: string;             // 医生
  patient?: {                 // 患者信息（脱敏）
    age: number;
    gender: '男' | '女';
    diagnosis: string;        // 诊断
  };
  
  // 组成
  ingredients: {
    ingredientId: string;     // 颗粒成分ID
    dosage: number;           // 用量(g)
    instructions?: string;    // 特殊说明
  }[];
  
  // 用法
  usage: {
    frequency: string;        // 服用频次
    timing: string;           // 服用时机
    course: string;           // 疗程
    preparation: string;      // 冲服方法
  };
  
  // 配伍分析
  compatibility?: {
    synergies: string[];      // 协同作用
    cautions: string[];       // 注意事项
  };
}

// ==================== 5. 中成药 PatentMedicine ====================

/**
 * 中成药实体
 */
export interface PatentMedicine extends BaseNode {
  // 基本信息
  name: {
    cn: string;               // 中文名
    pinyin: string;           // 拼音
    english?: string;         // 英文名
    tradeName?: string;       // 商品名
  };
  
  // 批准文号
  approval: {
    number: string;           // 批准文号
    type: '国药准字' | '进口药品' | '其他';
    date: string;             // 批准日期
    validUntil?: string;      // 有效期至
  };
  
  // 生产信息
  manufacturer: {
    name: string;             // 生产厂家
    license: string;          // 生产许可证
    gmpCertificate?: string;  // GMP证书
    contact?: string;         // 联系方式
  };
  
  // 处方组成
  formulaRef?: string;        // 关联方剂ID
  composition: {
    herbs: {
      materialId: string;     // 药材ID
      amount: string;         // 用量
      processing?: string;    // 炮制
    }[];
    excipients: string[];     // 辅料
  };
  
  // 制剂信息
  formulation: {
    dosageForm: string;       // 剂型
    specification: string;    // 规格
    appearance: string;       // 性状
    identification: string[]; // 鉴别方法
  };
  
  // 临床信息
  clinical: {
    functions: string[];      // 功能主治
    usage: string;            // 用法用量
    adverseReactions?: string[]; // 不良反应
    contraindications?: string[]; // 禁忌
    precautions?: string[];   // 注意事项
    interactions?: string[];  // 药物相互作用
  };
  
  // 质量标准
  qualityStandards: {
    item: string;             // 检测项目
    specification: string;    // 规定
    method: string;           // 方法
  }[];
  
  // 包装储存
  packaging: {
    materials: string[];      // 包装材料
    sizes: string[];          // 包装规格
    storage: string;          // 储存条件
    shelfLife: string;        // 有效期
  };
  
  // 价格信息
  pricing?: {
    retailPrice?: number;     // 零售价
    isReimbursable?: boolean; // 是否医保
    reimbursementCategory?: string; // 医保类别
  };
}

// ==================== 辅助类型 ====================

/**
 * 搜索过滤器
 */
export interface SearchFilters {
  query?: string;             // 全文搜索
  type?: 'material' | 'slice' | 'formula' | 'granule' | 'medicine';
  qi?: QiType;
  flavor?: FlavorType[];
  meridian?: MeridianType[];
  category?: string;
  origin?: string;
  priceRange?: [number, number];
  qualityGrade?: string;
}

/**
 * 实体关系
 */
export interface EntityRelation {
  from: {
    type: string;
    id: string;
  };
  to: {
    type: string;
    id: string;
  };
  relationType: 'contains' | 'derives_from' | 'used_in' | 'equivalent_to';
  metadata?: Record<string, any>;
}

// ==================== 工具函数 ====================

/**
 * 获取四气主题色
 */
export function getQiTheme(qi: QiType): {
  bg: string;
  border: string;
  text: string;
  icon: string;
} {
  const themes = {
    '寒': { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'text-blue-500' },
    '凉': { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: 'text-cyan-500' },
    '平': { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700', icon: 'text-gray-500' },
    '温': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'text-orange-500' },
    '热': { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'text-red-500' }
  };
  return themes[qi] || themes['平'];
}

/**
 * 判断是否为道地药材
 */
export function isAuthentic(material: Material): boolean {
  return material.origin.some(o => o.quality === 'excellent');
}

/**
 * 计算方剂总重量
 */
export function calculateFormulaWeight(formula: Formula): number {
  return formula.components.reduce((sum, comp) => {
    const weight = comp.weight.unit === 'kg' ? comp.weight.value * 1000 : comp.weight.value;
    return sum + weight;
  }, 0);
}