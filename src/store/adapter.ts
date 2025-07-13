/**
 * Store适配器 - 将新的store结构适配到旧的API
 * 这样可以逐步迁移组件，而不需要一次性修改所有代码
 */

import { useAppStore as useNewStore } from './index.new';
import { Herb, SearchFilters as OldSearchFilters, TCMExpert } from '../types';
import { Material, SearchFilters as NewSearchFilters } from '../types/tcm-core';

/**
 * 将Material转换为Herb（向后兼容）
 */
function materialToHerb(material: Material): Herb {
  return {
    id: material.id,
    name: material.names.cn,
    englishName: material.names.english,
    pinyin: material.names.pinyin,
    functions: material.functions,
    nature: material.qi,
    taste: material.flavor,
    origin: material.origin.map(o => o.region),
    category: material.category,
    indications: material.indications,
    images: material.images.gallery || [material.images.primary],
    primaryImage: material.images.primary,
    meridians: material.meridians,
    dosage: material.dosage.notes || `${material.dosage.min}-${material.dosage.max}g`,
    contraindications: material.contraindications,
    // 以下字段暂时设为空
    processing: [],
    compounds: [],
    description: '',
    detailedOrigins: material.origin.map(o => ({
      province: o.province,
      quality: o.quality,
      notes: o.notes
    })),
    expertRecommendations: [],
    clinicalApplication: material.extFunctions,
    pharmacology: material.pharmacology?.map(p => p.action),
    qualityStandards: material.qualityStandards?.map(q => q.parameter),
    // v9.0字段 - 需要转换
    chemicalComponents: material.chemicalComponents?.map(c => ({
      name: c.name,
      category: c.category,
      content: `${c.content.min}-${c.content.max}%`, // 转换为字符串
      function: c.bioactivity || '',
      importance: c.importance
    })),
    pharmacologicalActions: material.pharmacology?.map(p => ({
      action: p.action,
      mechanism: p.mechanism || '', // 确保不是undefined
      evidence: p.evidence || 'moderate',
      clinicalRelevance: p.references?.join(', ') || '',
      studies: p.references
    })),
  };
}

/**
 * 将旧的SearchFilters转换为新的
 */
function convertSearchFilters(oldFilters: OldSearchFilters): NewSearchFilters {
  const newFilters: NewSearchFilters = {
    query: oldFilters.searchTerm,
    category: oldFilters.category,
    origin: oldFilters.origin,
  };
  
  // 转换性味
  if (oldFilters.nature) {
    newFilters.qi = oldFilters.nature as any;
  }
  
  if (oldFilters.taste) {
    newFilters.flavor = [oldFilters.taste as any];
  }
  
  if (oldFilters.meridian) {
    newFilters.meridian = [oldFilters.meridian as any];
  }
  
  return newFilters;
}

/**
 * 创建适配的store hook
 */
export const useAppStore = () => {
  const store = useNewStore();
  
  // 适配herbs相关
  const herbs = store.materials.map(materialToHerb);
  const filteredHerbs = store.filteredMaterials.map(materialToHerb);
  const selectedHerb = store.selectedMaterial ? materialToHerb(store.selectedMaterial) : null;
  
  // 适配比较列表（使用方剂比较）
  const compareList = store.compareFormulas.map(f => {
    // 找到第一个组分的材料作为代表
    const firstSlice = store.getSliceById(f.components[0]?.sliceId);
    const material = firstSlice ? store.getMaterialById(firstSlice.materialId) : null;
    return material ? materialToHerb(material) : null;
  }).filter((h): h is Herb => h !== null);
  
  return {
    // 数据状态
    herbs,
    experts: store.experts,
    filteredHerbs,
    searchFilters: {
      searchTerm: '',
      category: '',
      nature: '',
      taste: '',
      meridian: '',
      origin: ''
    },
    
    // UI状态
    currentView: store.currentView,
    selectedHerb,
    selectedExpert: store.selectedExpert,
    compareList,
    selectedProvinces: store.selectedProvinces,
    isLoading: store.isLoading,
    error: store.error,
    
    // 数据操作
    setHerbs: (herbs: Herb[]) => {
      // 这里不需要实现，因为我们从新数据源加载
      console.warn('setHerbs is deprecated');
    },
    
    setExperts: store.setExperts,
    
    loadHerbs: async () => {
      await store.loadMaterials();
    },
    
    loadExperts: store.loadExperts,
    
    // 搜索和过滤
    updateSearchFilters: (filters: Partial<OldSearchFilters>) => {
      const currentFilters: OldSearchFilters = {
        searchTerm: '',
        category: '',
        nature: '',
        taste: '',
        meridian: '',
        origin: '',
        ...filters
      };
      store.filterMaterials(convertSearchFilters(currentFilters));
    },
    
    filterHerbs: () => {
      // 由updateSearchFilters处理
    },
    
    // 专业功能
    viewHistory: store.viewHistory.map(h => h.id),
    addToHistory: (herbId: string) => {
      store.addToHistory('material', herbId);
    },
    
    // UI状态管理
    setCurrentView: store.setCurrentView,
    
    setSelectedHerb: (herb: Herb | null) => {
      if (herb) {
        const material = store.getMaterialById(herb.id);
        store.setSelectedMaterial(material || null);
      } else {
        store.setSelectedMaterial(null);
      }
    },
    
    setSelectedExpert: store.setSelectedExpert,
    
    addToCompare: (herb: Herb) => {
      // 暂时使用一个模拟方剂
      const mockFormula = {
        id: `compare_${herb.id}`,
        name: herb.name,
        pinyin: herb.pinyin,
        source: '比较视图',
        category: herb.category,
        components: [],
        functions: herb.functions,
        indications: herb.indications,
        usage: {
          preparationMethod: '',
          dosageForm: '',
          administration: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0.0'
      };
      store.addToCompareFormulas(mockFormula as any);
    },
    
    removeFromCompare: (herbId: string) => {
      store.removeFromCompareFormulas(`compare_${herbId}`);
    },
    
    clearCompare: store.clearCompareFormulas,
    
    setSelectedProvinces: store.setSelectedProvinces,
    
    setLoading: store.setLoading,
    
    setError: store.setError,
    
    // 统计数据
    getStats: () => {
      const stats = store.getStats();
      return {
        total: stats.total,
        categories: stats.categories.size,
        provinces: stats.origins.size
      };
    }
  };
};