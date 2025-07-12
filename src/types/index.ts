// 药材类型定义 - 药典级增强版
export interface Herb {
  id: string;
  name: string;
  englishName?: string;
  pinyin: string;
  functions: string[];
  nature: string;
  taste: string[];
  origin?: string[];
  category: string;
  indications: string[];
  images: string[];
  primaryImage: string;
  meridians?: string[];
  dosage?: string;
  contraindications?: string[];
  processing?: string[];
  compounds?: string[];
  description?: string;
  
  // 专业功能扩展
  detailedOrigins?: ProvinceInfo[];
  expertRecommendations?: ExpertRecommendation[];
  clinicalApplication?: string[];
  pharmacology?: string[];
  qualityStandards?: string[];
  
  // v9.0 药典级新增字段
  pharmacopoeiaInfo?: PharmacopoeiaInfo;
  chemicalComponents?: ChemicalComponent[];
  pharmacologicalActions?: PharmacologicalAction[];
  qualityControl?: QualityControl;
  clinicalGuide?: ClinicalGuide;
  resourceInfo?: ResourceInfo;
  modernResearch?: ModernResearch;
  compatibilityInfo?: CompatibilityInfo;
}

// 药典信息
export interface PharmacopoeiaInfo {
  code: string;              // 药典编号
  latinName: string;         // 拉丁学名
  aliases: string[];         // 别名（地方名称）
  grade: 'premium' | 'first' | 'second' | 'third';  // 药材等级
  standardYear: number;      // 标准制定年份
  officialSource: string;    // 正品来源
}

// 化学成分
export interface ChemicalComponent {
  name: string;              // 成分名称
  category: string;          // 成分类别（如生物碱、黄酮类等）
  content: string;           // 含量范围
  function: string;          // 主要作用
  importance: 'primary' | 'secondary' | 'trace';  // 重要程度
}

// 药理作用
export interface PharmacologicalAction {
  action: string;            // 药理作用
  mechanism: string;         // 作用机制
  evidence: string;          // 证据等级
  clinicalRelevance: string; // 临床意义
  studies?: string[];        // 相关研究
}

// 质量控制
export interface QualityControl {
  identificationMethods: string[];    // 鉴定方法
  contentDetermination: string[];     // 含量测定
  qualityIndicators: QualityIndicator[];  // 质量指标
  storageConditions: string;          // 储存条件
  shelfLife: string;                  // 保质期
}

// 质量指标
export interface QualityIndicator {
  parameter: string;         // 指标参数
  specification: string;     // 规格要求
  method: string;           // 检测方法
  importance: 'critical' | 'major' | 'minor';
}

// 临床应用指南
export interface ClinicalGuide {
  indications: ClinicalIndication[];   // 适应症
  contraindications: string[];         // 禁忌症
  dosageAndAdministration: DosageInfo; // 用法用量
  adverseReactions: string[];          // 不良反应
  interactions: DrugInteraction[];     // 相互作用
  specialPopulations: SpecialPopulation[]; // 特殊人群
}

// 临床适应症
export interface ClinicalIndication {
  condition: string;         // 病症
  evidenceLevel: string;     // 证据等级
  recommendations: string;   // 推荐意见
  dosage: string;           // 推荐剂量
}

// 用法用量
export interface DosageInfo {
  oralDose: string;         // 口服剂量
  externalUse?: string;     // 外用方法
  preparationMethods: string[]; // 制备方法
  administrationTiming: string; // 服用时间
  courseDuration: string;   // 疗程
}

// 药物相互作用
export interface DrugInteraction {
  drug: string;             // 相互作用药物
  type: 'synergistic' | 'antagonistic' | 'toxic'; // 相互作用类型
  mechanism: string;        // 作用机制
  clinicalSignificance: string; // 临床意义
  management: string;       // 处理建议
}

// 特殊人群
export interface SpecialPopulation {
  population: string;       // 人群类型（孕妇、儿童等）
  recommendations: string; // 使用建议
  precautions: string[];   // 注意事项
}

// 资源信息
export interface ResourceInfo {
  authenticRegions: AuthenticRegion[]; // 道地产区
  gapBases: GAPBase[];                // GAP基地
  cultivationTech: CultivationInfo;   // 种植技术
  processingMethods: ProcessingMethod[]; // 炮制方法
  marketInfo: MarketInfo;             // 市场信息
}

// 道地产区
export interface AuthenticRegion {
  region: string;           // 产区名称
  quality: string;          // 质量特点
  reason: string;           // 道地原因
  annualProduction: string; // 年产量
  mainSupplyMonths: string[]; // 主要供应月份
}

// GAP基地
export interface GAPBase {
  name: string;             // 基地名称
  location: string;         // 位置
  area: string;             // 面积
  certification: string;   // 认证情况
  contact?: string;         // 联系方式
}

// 种植信息
export interface CultivationInfo {
  growingConditions: string[]; // 生长条件
  plantingTime: string;        // 种植时间
  harvestTime: string;         // 采收时间
  yieldPerMu: string;          // 亩产量
  techniques: string[];        // 种植技术要点
}

// 炮制方法
export interface ProcessingMethod {
  method: string;           // 炮制方法
  purpose: string;          // 炮制目的
  procedure: string[];      // 炮制程序
  qualityChanges: string;   // 质量变化
  clinicalApplication: string; // 临床应用差异
}

// 市场信息
export interface MarketInfo {
  currentPrice: string;     // 当前价格
  priceRange: string;       // 价格区间
  marketTrend: string;      // 市场趋势
  mainMarkets: string[];    // 主要市场
  seasonalPattern: string;  // 季节性规律
}

// 现代研究
export interface ModernResearch {
  researchAchievements: string[];    // 科研成果
  patents: Patent[];                 // 专利信息
  internationalRecognition: string; // 国际认知度
  standardizationLevel: string;     // 标准化程度
  clinicalTrials: ClinicalTrial[];  // 临床试验
  futureProspects: string[];        // 发展前景
}

// 专利信息
export interface Patent {
  title: string;            // 专利名称
  patentNumber: string;     // 专利号
  inventor: string;         // 发明人
  applicationDate: string;  // 申请日期
  description: string;      // 专利描述
}

// 临床试验
export interface ClinicalTrial {
  title: string;            // 试验标题
  phase: string;            // 试验阶段
  status: string;           // 试验状态
  participants: number;     // 参与人数
  primaryOutcome: string;   // 主要终点
  sponsor: string;          // 主办方
}

// 配伍信息
export interface CompatibilityInfo {
  commonCombinations: HerbCombination[]; // 常用配伍
  incompatibleHerbs: string[];           // 配伍禁忌
  synergisticEffects: string[];          // 协同效应
  dosageAdjustments: string[];           // 剂量调整建议
}

// 药材配伍
export interface HerbCombination {
  herbs: string[];          // 配伍药材
  ratio: string;            // 配伍比例
  function: string;         // 配伍功效
  indications: string[];    // 适用病症
  source: string;           // 来源方剂
}

// 省份信息
export interface ProvinceInfo {
  province: string;
  quality: 'excellent' | 'good' | 'moderate';
  notes?: string;
}

// 专家推荐
export interface ExpertRecommendation {
  expertId: string;
  expertName: string;
  recommendation: string;
  clinicalExperience?: string;
}

// 中医药专家类型
export interface TCMExpert {
  id: string;
  name: string;
  title: string;
  institution: string;
  birthYear?: number;
  specialization: string[];
  achievements: string[];
  publications?: Publication[];
  students?: Student[];
  avatar?: string;
  biography: string;
  honors?: string[];
  researchAreas?: string[];
  clinicalExperience?: number;
}

// 出版物
export interface Publication {
  title: string;
  year: number;
  type: 'book' | 'paper' | 'standard';
  description?: string;
}

// 传承人信息
export interface Student {
  name: string;
  batch: string;
  currentPosition: string;
  institution: string;
  specialization?: string[];
  achievements?: string[];
}

// 搜索过滤器类型 - v9.0 增强版
export interface SearchFilters {
  searchTerm: string;
  category: string;
  nature: string;
  taste: string;
  meridian: string;
  origin: string;
  
  // v9.0 新增高级搜索字段
  chemicalComponent?: string;    // 化学成分搜索
  pharmacologicalAction?: string; // 药理作用搜索
  clinicalIndication?: string;   // 临床适应症搜索
  qualityGrade?: string;         // 质量等级筛选
  priceRange?: string;           // 价格区间筛选
  researchLevel?: string;        // 研究程度筛选
}

// 高级搜索配置
export interface AdvancedSearchConfig {
  enableChemicalSearch: boolean;
  enablePharmacologySearch: boolean;
  enableClinicalSearch: boolean;
  enablePriceFilter: boolean;
  enableResearchFilter: boolean;
}

// 智能推荐配置
export interface RecommendationConfig {
  basedOnNature: boolean;        // 基于药性推荐
  basedOnFunction: boolean;      // 基于功效推荐
  basedOnCompatibility: boolean; // 基于配伍推荐
  maxRecommendations: number;    // 最大推荐数量
}

// 数据导出配置
export interface ExportConfig {
  format: 'excel' | 'pdf' | 'json' | 'csv';
  includeImages: boolean;
  includeDetailedInfo: boolean;
  includeChemicalData: boolean;
  includeClinicalData: boolean;
}

// 界面状态
export interface UIState {
  currentView: 'gallery' | 'detail' | 'compare' | 'map' | 'experts' | 'expert-detail';
  selectedHerb: Herb | null;
  selectedExpert: TCMExpert | null;
  compareList: Herb[];
  selectedProvinces: string[];
  isLoading: boolean;
  error: string | null;
}

// 专业主题色
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
}

// 根据药材属性获取专业主题色
export const getNatureTheme = (nature: string): ThemeColors => {
  const themes: Record<string, ThemeColors> = {
    '寒': {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'bg-blue-50',
      accent: 'text-blue-700',
      background: 'bg-gradient-to-br from-blue-50 to-blue-100',
      text: 'text-blue-900',
      border: 'border-blue-200'
    },
    '凉': {
      primary: 'from-cyan-500 to-cyan-600',
      secondary: 'bg-cyan-50',
      accent: 'text-cyan-700',
      background: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      text: 'text-cyan-900',
      border: 'border-cyan-200'
    },
    '平': {
      primary: 'from-green-500 to-green-600',
      secondary: 'bg-green-50',
      accent: 'text-green-700',
      background: 'bg-gradient-to-br from-green-50 to-green-100',
      text: 'text-green-900',
      border: 'border-green-200'
    },
    '温': {
      primary: 'from-orange-500 to-orange-600',
      secondary: 'bg-orange-50',
      accent: 'text-orange-700',
      background: 'bg-gradient-to-br from-orange-50 to-orange-100',
      text: 'text-orange-900',
      border: 'border-orange-200'
    },
    '热': {
      primary: 'from-red-500 to-red-600',
      secondary: 'bg-red-50',
      accent: 'text-red-700',
      background: 'bg-gradient-to-br from-red-50 to-red-100',
      text: 'text-red-900',
      border: 'border-red-200'
    },
    '微温': {
      primary: 'from-amber-500 to-amber-600',
      secondary: 'bg-amber-50',
      accent: 'text-amber-700',
      background: 'bg-gradient-to-br from-amber-50 to-amber-100',
      text: 'text-amber-900',
      border: 'border-amber-200'
    },
    '微寒': {
      primary: 'from-indigo-500 to-indigo-600',
      secondary: 'bg-indigo-50',
      accent: 'text-indigo-700',
      background: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
      text: 'text-indigo-900',
      border: 'border-indigo-200'
    }
  };
  
  return themes[nature] || themes['平'];
};

// 获取专业等级（基于功效数量和专业属性）
export const getProfessionalLevel = (herb: Herb): {
  level: string;
  color: string;
  description: string;
} => {
  const functionsCount = herb.functions.length;
  const hasDetailedInfo = (herb.meridians?.length || 0) + (herb.contraindications?.length || 0);
  
  if (functionsCount >= 8 && hasDetailedInfo >= 5) {
    return { level: '权威认证', color: 'text-purple-700', description: '临床应用广泛，药理研究充分' };
  } else if (functionsCount >= 6 && hasDetailedInfo >= 3) {
    return { level: '临床常用', color: 'text-blue-700', description: '临床使用频繁，疗效确切' };
  } else if (functionsCount >= 4) {
    return { level: '专业推荐', color: 'text-green-700', description: '具有明确疗效，专业认可' };
  } else if (functionsCount >= 2) {
    return { level: '基础药材', color: 'text-gray-700', description: '基础功效，适合入门学习' };
  } else {
    return { level: '研究中', color: 'text-orange-700', description: '正在深入研究中' };
  }
};

// 中国省份地图数据类型
export interface ProvinceMapData {
  name: string;
  value: number;
  herbs: string[];
  itemStyle?: {
    areaColor: string;
  };
}

// 对比分析结果
export interface ComparisonResult {
  similarities: string[];
  differences: {
    category: string;
    items: {
      herb1: string;
      herb2: string;
      difference: string;
    }[];
  }[];
  recommendations: string[];
}
