import { StateCreator } from 'zustand';

export interface Granule {
  id: string;
  names: {
    cn: string;
    pinyin: string;
    latin?: string;
  };
  baseMaterial?: string;
  baseMaterialId?: string;
  concentration?: string;
  manufacturer?: string;
  specification?: string;
  dosageForm?: string;
  extractionMethod?: string;
  qualityStandard?: string;
  thumbnail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GranuleSlice {
  granules: Granule[];
  selectedGranuleId: string | null;
  
  // Actions
  setGranules: (granules: Granule[]) => void;
  addGranule: (granule: Granule) => void;
  updateGranule: (id: string, updates: Partial<Granule>) => void;
  deleteGranule: (id: string) => void;
  setSelectedGranuleId: (id: string | null) => void;
  
  // Getters
  getGranuleById: (id: string) => Granule | undefined;
  searchGranules: (query: string) => Granule[];
  
  // Data loading
  loadGranules: () => Promise<void>;
}

export const createGranuleSlice: StateCreator<GranuleSlice> = (set, get) => ({
  granules: [],
  selectedGranuleId: null,
  
  setGranules: (granules) => set({ granules }),
  
  addGranule: (granule) => set(state => ({
    granules: [...state.granules, granule]
  })),
  
  updateGranule: (id, updates) => set(state => ({
    granules: state.granules.map(g => 
      g.id === id ? { ...g, ...updates } : g
    )
  })),
  
  deleteGranule: (id) => set(state => ({
    granules: state.granules.filter(g => g.id !== id)
  })),
  
  setSelectedGranuleId: (id) => set({ selectedGranuleId: id }),
  
  getGranuleById: (id) => {
    return get().granules.find(g => g.id === id);
  },
  
  searchGranules: (query) => {
    const lowerQuery = query.toLowerCase();
    return get().granules.filter(granule => 
      granule.names.cn.includes(query) ||
      granule.names.pinyin.toLowerCase().includes(lowerQuery) ||
      (granule.names.latin && granule.names.latin.toLowerCase().includes(lowerQuery)) ||
      (granule.baseMaterial && granule.baseMaterial.includes(query))
    );
  },
  
  loadGranules: async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockGranules: Granule[] = [
        {
          id: 'granule-001',
          names: {
            cn: '人参配方颗粒',
            pinyin: 'Renshen Peifang Keli',
            latin: 'Ginseng Radix Granule'
          },
          baseMaterial: '人参',
          baseMaterialId: 'herb-001',
          concentration: '1:5',
          manufacturer: '某某药业有限公司',
          specification: '1g/袋',
          dosageForm: '颗粒剂',
          extractionMethod: '水提取',
          qualityStandard: '中国药典2020版',
          createdAt: new Date().toISOString()
        },
        {
          id: 'granule-002',
          names: {
            cn: '黄芪配方颗粒',
            pinyin: 'Huangqi Peifang Keli',
            latin: 'Astragali Radix Granule'
          },
          baseMaterial: '黄芪',
          baseMaterialId: 'herb-002',
          concentration: '1:5',
          manufacturer: '某某药业有限公司',
          specification: '1g/袋',
          dosageForm: '颗粒剂',
          extractionMethod: '水提取',
          qualityStandard: '中国药典2020版',
          createdAt: new Date().toISOString()
        }
      ];
      
      set({ granules: mockGranules });
    } catch (error) {
      console.error('Failed to load granules:', error);
      throw error;
    }
  }
});